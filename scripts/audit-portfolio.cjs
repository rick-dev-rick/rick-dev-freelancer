const { createServer } = require('node:http');
const { readFile, mkdir, writeFile, readdir } = require('node:fs/promises');
const path = require('node:path');
const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const dist = path.resolve(process.argv[2] || 'dist');
const out = path.resolve(process.argv[3] || 'artifacts');
const isBaseline = process.argv.includes('--baseline');
const basePath = process.env.PUBLIC_BASE || '/rick-dev-freelancer/';
const widths = [320, 375, 390, 768, 1024, 1440];
const routes = { '': 'Home', servicos: 'Serviços', projetos: 'Projetos', sobre: 'Sobre', contato: 'Contato' };
const types = { '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2', '.webp': 'image/webp', '.html': 'text/html' };

const server = createServer(async (req, res) => {
  const route = new URL(req.url, 'http://localhost').pathname;
  const file = route.startsWith(basePath) && path.resolve(dist, route.slice(basePath.length) || 'index.html');
  if (!file || !file.startsWith(dist + path.sep)) { res.writeHead(404); res.end(); return; }
  try {
    const body = await readFile(file);
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
    res.end(body);
  } catch { res.writeHead(404); res.end(); }
});

(async () => {
  await mkdir(out, { recursive: true });
  await new Promise((done, fail) => server.once('error', fail).listen(0, '127.0.0.1', done));
  const url = 'http://127.0.0.1:' + server.address().port + basePath;
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || undefined,
    args: process.env.CHROMIUM_SINGLE_PROCESS ? ['--no-zygote', '--single-process'] : [],
  });
  const context = await browser.newContext({ deviceScaleFactor: 1 });
  const page = await context.newPage();
  const errors = [], findings = [], flows = {}, resources = [];
  const report = { browser: browser.version(), http: url, findings, flows, errors, resources, capturedAt: new Date().toISOString() };
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', e => errors.push(String(e)));
  page.on('requestfailed', r => resources.push({ url: r.url(), error: r.failure()?.errorText }));
  page.on('response', r => { if (r.status() >= 400) resources.push({ url: r.url(), status: r.status() }); });
  if (process.env.FONT_FIXTURES) {
    const dir = path.resolve(process.env.FONT_FIXTURES);
    const fonts = new Set(await readdir(path.join(dir, 'fonts')));
    await context.route('https://fonts.googleapis.com/**', r => r.fulfill({ path: path.join(dir, 'google-fonts.css'), contentType: 'text/css' }));
    await context.route('https://fonts.gstatic.com/**', r => {
      const name = new URL(r.request().url()).pathname.split('/').at(-1);
      return fonts.has(name)
        ? r.fulfill({ path: path.join(dir, 'fonts', name), contentType: 'font/woff2', headers: { 'Access-Control-Allow-Origin': '*' } })
        : r.abort();
    });
  }
  const axe = process.env.AXE_MODULE ? require(process.env.AXE_MODULE) : null;
  async function go(route, title = routes[route]) {
    const response = await page.goto(url + '#/' + route);
    if (response) assert.equal(response.status(), 200);
    await page.waitForFunction(prefix => document.title.startsWith(prefix + ' |'), title);
    await page.evaluate(() => document.fonts.ready);
  }
  const screenshot = name => page.screenshot({ path: path.join(out, name + '.png'), animations: 'disabled' });
  const prepare = () => page.getByRole('button', { name: 'Preparar resumo do projeto' });
  const values = async () => page.locator('[name=goal]').evaluate(el => Object.fromEntries(new FormData(el.form)));
  try {
    for (const width of widths) {
      await page.setViewportSize({ width, height: width < 768 ? 844 : 900 });
      for (const route of Object.keys(routes)) {
        await go(route);
        const measured = await page.evaluate(route => {
          const button = [...document.querySelectorAll('main a')].find(a => a.textContent.includes('Conversar no WhatsApp'));
          const rect = button?.getBoundingClientRect();
          const animated = document.querySelector('.hero-actions .button');
          return {
            heading: document.querySelector('main h1').innerText,
            scrollWidth: document.documentElement.scrollWidth,
            viewport: innerWidth,
            whatsapp: rect && { top: rect.top, bottom: rect.bottom, visible: rect.bottom <= innerHeight },
            motion: animated && getComputedStyle(animated).transitionDuration,
            route,
          };
        }, route);
        const entry = { width, ...measured };
        findings.push(entry);
        assert.equal(measured.scrollWidth, measured.viewport, route + ' em ' + width);
        if (axe && [320, 1440].includes(width)) {
          await page.evaluate(axe.source);
          entry.axe = await page.evaluate(async () => {
            const result = await window.axe.run({ runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'] } });
            return result.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => ({ selector: n.target, summary: n.failureSummary })) }));
          });
        }
        if ([320, 1440].includes(width)) await screenshot((route || 'home') + '-' + width);
      }
    }
    await page.setViewportSize({ width: 320, height: 844 });
    await go('');
    await page.getByRole('link', { name: 'Conhecer o case NØVA STREET' }).click();
    await page.waitForFunction(() => location.hash.includes('/projetos'));
    await page.waitForFunction(() => /^Projetos|^NØVA STREET/.test(document.title));
    flows.caseRoute = new URL(page.url()).hash;
    await screenshot('case-320');
    await page.setViewportSize({ width: 1440, height: 900 });
    await screenshot('case-1440');
    await page.setViewportSize({ width: 390, height: 844 });
    await go('servicos');
    await page.locator('main a[href*="servico="]').first().click();
    await page.locator('[name=service]').waitFor();
    flows.prefill = (await values()).service;
    const draft = { name: 'Pessoa Teste', business: 'Negócio Teste', service: 'Landing pages', goal: 'Organizar os serviços da empresa.', deadline: 'A combinar' };
    for (const [key, value] of Object.entries(draft)) {
      const field = page.locator('[name=' + key + ']');
      if (key === 'service') await field.selectOption(value);
      else await field.fill(value);
    }
    await prepare().press('Enter');
    await page.locator('.brief-result').waitFor();
    flows.summary = await page.evaluate(() => {
      const heading = document.querySelector('.brief-result h2, .brief-result h3');
      return { focus: document.activeElement === heading, top: heading.getBoundingClientRect().top, viewport: innerHeight };
    });
    await screenshot('resumo-390');
    const review = page.getByRole('link', { name: /Caixa de mensagens do site/ });
    await review.press('Enter');
    await page.locator('.site-send pre').waitFor();
    await page.goBack();
    await page.locator('[name=goal]').waitFor();
    flows.backPreserved = JSON.stringify(await values()) === JSON.stringify(draft);
    if (!isBaseline) {
      assert.equal(flows.caseRoute, '#/projetos/nova-street');
      assert.equal(await page.locator('.site-send').count(), 0);
      for (const width of widths) {
        await page.setViewportSize({ width, height: width < 768 ? 844 : 900 });
        await go('projetos/nova-street', 'NØVA STREET');
        const dimensions = await page.locator('.case-cover img').evaluate(async img => {
          await img.decode();
          return { width: img.naturalWidth, viewport: innerWidth, scrollWidth: document.documentElement.scrollWidth };
        });
        assert.ok(dimensions.width > 0);
        assert.equal(dimensions.scrollWidth, dimensions.viewport);
        const demo = page.getByRole('link', { name: 'Abrir demonstração' });
        assert.equal(await demo.getAttribute('href'), 'https://rick-dev-rick.github.io/nova-street/');
      }
      await page.setViewportSize({ width: 390, height: 844 });
      await go('contato');
      for (const [key, value] of Object.entries(draft)) {
        const field = page.locator('[name=' + key + ']');
        if (key === 'service') await field.selectOption(value);
        else await field.fill(value);
      }
      await prepare().press('Enter');
      assert.ok(flows.prefill);
      assert.ok(flows.summary.focus && flows.summary.top >= 0 && flows.summary.top < flows.summary.viewport);
      assert.ok(flows.backPreserved);
      for (const el of findings.filter(x => x.route === 'contato' && x.width < 768)) assert.ok(el.whatsapp.visible);
      await review.click();
      const send = page.getByRole('button', { name: 'Enviar pedido pelo site' });
      await send.waitFor();
      assert.ok(await send.isDisabled());
      await page.getByRole('button', { name: 'Editar briefing' }).click();
      await page.locator('[name=goal]').waitFor();
      assert.deepEqual(await values(), draft);
      await page.locator('[name=goal]').fill('');
      await prepare().press('Enter');
      assert.equal(await page.locator('[name=goal]:focus').count(), 1);
      assert.equal(await page.locator('[name=goal]').getAttribute('aria-describedby'), 'brief-goal-error');
      flows.editAndValidation = true;
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await go('projetos/nova-street', 'NØVA STREET');
      const reduced = await page.locator('.case-cover img').evaluate(el => getComputedStyle(el).animationName);
      assert.equal(reduced, 'none');
      const demoAction = page.getByRole('link', { name: 'Abrir demonstração' });
      await demoAction.hover();
      const reducedHover = await demoAction.evaluate(el => getComputedStyle(el).transform);
      assert.equal(reducedHover, 'none');
      await page.emulateMedia({ reducedMotion: 'no-preference' });
      await go('projetos');
      await page.getByRole('link', { name: 'Ler o case' }).press('Enter');
      await page.locator('.case-cover').waitFor();
      const motion = await page.locator('.case-cover img').evaluate(async el => {
        const style = getComputedStyle(el);
        const captionOpacity = getComputedStyle(el.parentElement.querySelector('figcaption')).opacity;
        const figureOpacity = getComputedStyle(el.parentElement).opacity;
        const animation = el.getAnimations()[0];
        const duration = animation?.effect.getTiming().duration;
        if (animation) await animation.finished;
        return { name: style.animationName, duration, captionOpacity, figureOpacity, endTransform: getComputedStyle(el).transform };
      });
      assert.equal(motion.name, 'case-cover-enter');
      assert.equal(motion.duration, 240);
      assert.equal(motion.captionOpacity, '1');
      assert.equal(motion.figureOpacity, '1');
      assert.equal(motion.endTransform, 'none');
      flows.motion = { normal: motion, reduced, reducedHover };
      await go('');
      await page.locator('.service-card').nth(1).press('Enter');
      await page.waitForFunction(() => document.activeElement.id === 'servico-02');
      assert.equal(await page.locator('#servico-02').innerText(), 'Landing pages');
      flows.serviceDestination = 'servico-02';
      await page.setViewportSize({ width: 320, height: 844 });
      const menu = page.locator('.menu-toggle');
      await menu.press('Enter');
      assert.equal(await menu.getAttribute('aria-expanded'), 'true');
      await page.keyboard.press('Escape');
      assert.equal(await menu.getAttribute('aria-expanded'), 'false');
      assert.ok(await menu.evaluate(el => el === document.activeElement));
      flows.mobileMenuEscape = true;
      assert.equal(errors.length, 0);
      assert.equal(resources.length, 0);
      if (axe) assert.equal(findings.flatMap(r => r.axe || []).length, 0);
    }
  } catch (err) {
    report.failure = String(err.stack || err);
    process.exitCode = 1;
    console.error(report.failure);
  } finally {
    await writeFile(path.join(out, 'audit.json'), JSON.stringify(report, null, 2));
    await browser.close();
    server.close();
  }
})().catch(err => { console.error(err); server.close(); process.exitCode = 1; });
