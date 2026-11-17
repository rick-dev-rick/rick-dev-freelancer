import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createHandler } from "../backend/mailbox/handler.js";

const { PGlite } = await import(process.env.PGLITE_MODULE || "@electric-sql/pglite");
const db = new PGlite();
const base = "https://mailbox.invalid";
const code = "a".repeat(64);
const values = {
  name: "Visitante sintético",
  business: "Estabelecimento fictício",
  service: "Landing pages",
  goal: "Validar a caixa em banco descartável.",
};
let failRead = false;

async function fakeRest(url, options) {
  const request = new URL(url);
  assert.equal(request.origin, base);
  const endpoint = request.pathname.replace("/rest/v1/", "");
  if (endpoint === "rpc/mail_take_rate") {
    const { p_bucket, p_limit, p_window } = JSON.parse(options.body);
    const { rows } = await db.query("select mail_take_rate($1,$2,$3) as allowed", [p_bucket, p_limit, p_window]);
    return Response.json(rows[0].allowed);
  }
  if (endpoint === "rpc/mail_create") {
    const { p_hash, p_name, p_business, p_service, p_body } = JSON.parse(options.body);
    const { rows } = await db.query("select mail_create($1,$2,$3,$4,$5) as id", [p_hash, p_name, p_business, p_service, p_body]);
    return Response.json(rows[0].id);
  }
  if (endpoint === "mail_threads") {
    if (failRead) { failRead = false; return Response.json({}, { status: 503 }); }
    const token = request.searchParams.get("token_hash").slice(3);
    const { rows } = await db.query("select id,name,business,service,status from mail_threads where token_hash=$1", [token]);
    return Response.json(rows);
  }
  if (endpoint === "mail_messages") {
    const id = request.searchParams.get("thread_id").slice(3);
    const { rows } = await db.query("select id,author,body,created_at from mail_messages where thread_id=$1", [id]);
    return Response.json(rows);
  }
  throw new Error("Rota inesperada no adaptador local");
}

try {
  await db.exec("create role anon; create role authenticated; create role service_role bypassrls;");
  for (const name of ["setup.sql", "mailbox-reliability.sql", "mailbox-status.sql"]) {
    const sql = await readFile(new URL("../backend/" + name, import.meta.url), "utf8");
    await db.exec(sql);
  }
  const handler = createHandler({ url: base, secret: "local-test-only", publishable: "local-test-only", fetcher: fakeRest });
  const invoke = fields => handler(new Request(base + "/functions/v1/mailbox", {
    method: "POST",
    headers: { "content-type": "application/json", origin: "http://localhost:5173" },
    body: JSON.stringify({ action: "create", code, values, ...fields }),
  }));

  assert.equal((await invoke({ values: { ...values, goal: "" } })).status, 400);
  failRead = true;
  const lostConfirmation = await invoke({});
  assert.equal(lostConfirmation.status, 503);
  assert.ok(!(await lostConfirmation.json()).thread);
  const retry = await invoke({});
  assert.equal(retry.status, 201);
  const result = await retry.json();
  assert.match(result.messages[0].body, /banco descartável/);
  const read = await invoke({ action: "read" });
  assert.equal(read.status, 200);
  assert.equal((await read.json()).thread.id, result.thread.id);
  const { rows: [counts] } = await db.query(
    "select (select count(*)::int from mail_threads) as threads, (select count(*)::int from mail_messages) as messages",
  );
  assert.deepEqual(counts, { threads: 1, messages: 1 });
  const { rows: [rights] } = await db.query(`
    select
      has_table_privilege('anon','public.mail_threads','SELECT') as anon_reads,
      has_table_privilege('authenticated','public.mail_messages','INSERT') as client_writes,
      has_function_privilege('anon','public.mail_create(text,text,text,text,text)','EXECUTE') as anon_rpc,
      has_function_privilege('service_role','public.mail_create(text,text,text,text,text)','EXECUTE') as service_rpc,
      (select count(*)::int from pg_class where relname in ('mail_threads','mail_messages','mail_rate_limits') and relrowsecurity) as rls_tables
  `);
  assert.deepEqual(rights, { anon_reads: false, client_writes: false, anon_rpc: false, service_rpc: true, rls_tables: 3 });
  console.log(JSON.stringify({
    engine: (await db.query("select version()")).rows[0].version,
    invalidInput: 400,
    lostConfirmation: 503,
    retry: 201,
    read: 200,
    counts,
    rights,
    postgrest: "adaptador local em memória",
    productionRequests: 0,
  }, null, 2));
} finally {
  await db.close();
}
