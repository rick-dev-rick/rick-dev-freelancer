import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../components/Icon";
import CTA from "../components/CTA";
import Process from "../components/Process";
import { services } from "../data/services";
import cover from "../assets/cases/nova-street-home.webp";
import catalog from "../assets/cases/nova-street-catalog-mobile.webp";

const casePath = "/projetos/nova-street";
const views = {
  Desktop: { src: cover, width: 1200, height: 760, caption: "Abertura da vitrine em desktop" },
  Mobile: { src: catalog, width: 390, height: 760, caption: "Catálogo da demonstração a 390 px" },
};

function CaseStudy() {
  const [view, setView] = useState("Desktop");
  const [previous, setPrevious] = useState(null);
  const [selected, setSelected] = useState("Desktop");
  const [notice, setNotice] = useState("");
  const requested = useRef(view);
  const plate = useRef(null);
  const image = views[view];
  async function selectView(name) {
    requested.current = name;
    setSelected(name);
    setNotice("");
    if (name === view) return;
    const preload = new Image();
    preload.src = views[name].src;
    try {
      await preload.decode();
    } catch {
      if (requested.current === name) {
        setSelected(view);
        setNotice("A captura não carregou. Tente novamente.");
      }
      return;
    }
    // Let the current cut settle before replacing its backing plate.
    const running = plate.current?.getAnimations?.().filter(a => a.playState === "running") || [];
    await Promise.allSettled(running.map(a => a.finished));
    if (requested.current !== name) return;
    setPrevious(view);
    setView(name);
  }
  return (
    <section className="container spread study" data-scene="proof" aria-labelledby="study-title">
      <div>
        <span className="eyebrow">Projeto em destaque</span>
        <h2 id="study-title">NØVA STREET</h2>
        <p>Da vitrine à sacola, o case combina direção de arte e navegação em uma jornada demonstrativa. Busca e filtros ficam na URL para compartilhar a seleção do catálogo.</p>
        <Link className="text-link" to={casePath}>Ler o case <Icon /></Link>
        <div className="view-switch" role="group" aria-label="Captura do projeto">
          {Object.keys(views).map(name => (
            <button type="button" key={name} aria-pressed={selected === name} onClick={() => selectView(name)}>{name}</button>
          ))}
        </div>
        <Link className="text-link" to="/projetos">Ver todos os projetos <Icon /></Link>
      </div>
      <figure className="study-figure">
        <div className="study-frame" data-view={view}>
          {previous && <span key={previous} className="study-previous" aria-hidden="true" style={{ backgroundImage: `url(${views[previous].src})` }} />}
          <img ref={plate} key={view} className={previous ? "print-change" : undefined} src={image.src} alt={image.caption} width={image.width} height={image.height} loading="lazy" />
        </div>
        <figcaption aria-live="polite"><span key={view} className={previous ? "print-caption" : undefined}>{notice || image.caption}</span></figcaption>
      </figure>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <section className="container editorial-hero">
        <div className="editorial-title">
          <span className="eyebrow">Estúdio independente · Front-end</span>
          <h1 aria-label="Interfaces com intenção."><span className="type-window"><span>Interfaces</span></span>{" "}<span className="type-window"><span>com <em>intenção.</em></span></span></h1>
          <p>Sites e experiências digitais para marcas que precisam explicar bem o que fazem.</p>
          <Link className="button" to="/contato">Conversar sobre meu projeto <Icon /></Link>
        </div>
        <figure className="editorial-proof">
          <Link to={casePath} aria-label="Conhecer o case NØVA STREET">
            <img src={cover} alt="Abertura da vitrine NØVA STREET em desktop" width="1200" height="760" fetchPriority="high" />
          </Link>
          <figcaption><Link to={casePath}>NØVA STREET ↗</Link><span>Vitrine demonstrativa</span></figcaption>
        </figure>
        <svg className="editorial-stamp" aria-hidden="true" viewBox="0 0 238 163"><text x="0" y="160">rd.</text></svg>
      </section>
      <section className="container spread" data-scene="contents">
        <div><span className="eyebrow">O que desenvolvo</span><h2>Do primeiro clique à página final.</h2></div>
        <div className="service-index">
          {services.map((service, index) => (
            <details key={service.number} open={index === 0}>
              <summary>{service.title}</summary>
              <p>{service.text}</p>
              <Link className="text-link" to={`/servicos#servico-${service.number}`}>Conhecer a solução <Icon /></Link>
            </details>
          ))}
        </div>
      </section>
      <CaseStudy />
      <Process />
      <CTA signed />
    </>
  );
}
