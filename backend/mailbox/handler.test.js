import test from "node:test";
import assert from "node:assert/strict";
import { createHandler } from "./handler.js";
const url = "https://test.supabase.co";
function request(body, headers = {}) {
  return new Request("https://test/functions/v1/mailbox", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
}
test("operações administrativas sem sessão são negadas antes de consultar mensagens", async () => {
  let calls = 0;
  const handle = createHandler({
    url,
    secret: "server",
    publishable: "public",
    fetcher: async () => {
      calls++;
      throw Error("unexpected");
    },
  });
  const r = await handle(request({ action: "admin_list" }));
  assert.equal(r.status, 401);
  assert.equal(calls, 0);
});
test("sessão válida de outro cliente não permite acesso administrativo", async () => {
  let calls = 0;
  const handle = createHandler({
    url,
    secret: "server",
    publishable: "public",
    fetcher: async (path) => {
      calls++;
      assert.match(path, /auth\/v1\/user/);
      return Response.json({
        id: "other",
        email: "other@example.com",
        email_confirmed_at: "yes",
      });
    },
  });
  const r = await handle(
    request(
      { action: "admin_read", id: "anything" },
      { Authorization: "Bearer user" },
    ),
  );
  assert.equal(r.status, 403);
  assert.equal(calls, 1);
});
test("código de outra conversa não retorna nenhuma mensagem", async () => {
  const handle = createHandler({
    url,
    secret: "server",
    publishable: "public",
    fetcher: async (path) => {
      if (path.includes("mail_take_rate")) return Response.json(true);
      assert.match(path, /mail_threads\?token_hash=eq\.[a-f0-9]{64}&select=/);
      assert.ok(!path.includes("mail_messages"));
      return Response.json([]);
    },
  });
  const r = await handle(request({ action: "read", code: "a".repeat(64) }));
  assert.equal(r.status, 404);
});
test("origem desconhecida é rejeitada sem acessar o banco", async () => {
  const handle = createHandler({
    url,
    secret: "server",
    publishable: "public",
    fetcher: () => {
      throw Error("unexpected");
    },
  });
  const r = await handle(
    request({ action: "create" }, { Origin: "https://other.example" }),
  );
  assert.equal(r.status, 403);
});
test("falha no servidor retorna erro sem confirmar envio", async () => {
  const handle = createHandler({
    url,
    secret: "server",
    publishable: "public",
    fetcher: async () => Response.json({ error: "failure" }, { status: 500 }),
  });
  const r = await handle(request({ action: "read", code: "a".repeat(64) }));
  assert.equal(r.status, 503);
  assert.ok(!(await r.json()).messages);
});

test("resposta administrativa exige usuário confirmado e encaminha identificador único de envio", async () => {
  const id = "3937a9f9-a61c-4eda-98d3-2f94a69a98af";
  const requestId = "72c87ed2-2acf-4b6e-a291-77fa1d72442d";
  let appended = false;
  const handle = createHandler({
    url,
    secret: "server",
    publishable: "public",
    fetcher: async (path, options) => {
      if (path.includes("/auth/"))
        return Response.json({
          id: "owner",
          email: "douglasxxxbarbosa@gmail.com",
          email_confirmed_at: "2026",
        });
      if (path.includes("mail_take_rate")) return Response.json(true);
      if (path.includes("mail_threads"))
        return Response.json([{ id, name: "Teste", service: "Site" }]);
      if (path.includes("mail_append")) {
        const body = JSON.parse(options.body);
        assert.equal(body.p_author, "admin");
        assert.equal(body.p_request, requestId);
        appended = true;
        return Response.json("message-id");
      }
      if (path.includes("mail_messages"))
        return Response.json([{ author: "admin", body: "Resposta de teste" }]);
      throw Error("unexpected");
    },
  });
  const response = await handle(
    request(
      { action: "admin_reply", id, message: "Resposta de teste", requestId },
      { Authorization: "Bearer owner" },
    ),
  );
  assert.equal(response.status, 200);
  assert.equal(appended, true);
  assert.equal((await response.json()).messages[0].author, "admin");
});

test("cliente não pode finalizar nem reabrir uma conversa", async () => {
  const handle = createHandler({
    url,
    secret: "server",
    publishable: "public",
    fetcher: async () => {
      throw Error("unexpected database access");
    },
  });
  const response = await handle(
    request({
      action: "admin_status",
      id: "3937a9f9-a61c-4eda-98d3-2f94a69a98af",
      status: "closed",
    }),
  );
  assert.equal(response.status, 401);
});
test("proprietário finaliza e recebe status atualizado sem perder histórico", async () => {
  const id = "3937a9f9-a61c-4eda-98d3-2f94a69a98af";
  let closed = false;
  const handle = createHandler({
    url,
    secret: "server",
    publishable: "public",
    fetcher: async (path, options) => {
      if (path.includes("/auth/"))
        return Response.json({
          id: "owner",
          email: "douglasxxxbarbosa@gmail.com",
          email_confirmed_at: "2026",
        });
      if (path.includes("mail_take_rate")) return Response.json(true);
      if (path.includes("mail_set_status")) {
        assert.deepEqual(JSON.parse(options.body), {
          p_id: id,
          p_status: "closed",
        });
        closed = true;
        return Response.json(id);
      }
      if (path.includes("mail_threads"))
        return Response.json([{ id, status: closed ? "closed" : "open" }]);
      if (path.includes("mail_messages"))
        return Response.json([{ id: "old", body: "Histórico preservado" }]);
      throw Error("unexpected");
    },
  });
  const response = await handle(
    request(
      { action: "admin_status", id, status: "closed" },
      { Authorization: "Bearer owner" },
    ),
  );
  assert.equal(response.status, 200);
  const result = await response.json();
  assert.equal(result.thread.status, "closed");
  assert.equal(result.messages[0].body, "Histórico preservado");
});
test("filtro de finalizadas é aplicado no servidor antes da paginação", async () => {
  let queried = false;
  const handle = createHandler({
    url,
    secret: "server",
    publishable: "public",
    fetcher: async (path) => {
      if (path.includes("/auth/"))
        return Response.json({
          id: "owner",
          email: "douglasxxxbarbosa@gmail.com",
          email_confirmed_at: "2026",
        });
      if (path.includes("mail_take_rate")) return Response.json(true);
      assert.match(path, /status=eq.closed/);
      assert.match(path, /offset=50/);
      queried = true;
      return Response.json([]);
    },
  });
  const response = await handle(
    request(
      { action: "admin_list", page: 1, status: "closed" },
      { Authorization: "Bearer owner" },
    ),
  );
  assert.equal(response.status, 200);
  assert.equal(queried, true);
});
