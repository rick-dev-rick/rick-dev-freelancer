import { InputError, code, owner, submission, text } from "./validation.js";
const origins = new Set([
  "https://rick-dev-freelancer.stillbee12.chatgpt.site",
  "https://rick-dev-rick.github.io",
  "http://terminal.local:4173",
  "http://localhost:5173",
]);
const columns =
  "id,name,business,service,created_at,updated_at,last_author,status,closed_at";
export async function hash(value) {
  return Array.from(
    new Uint8Array(
      await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)),
    ),
    (b) => b.toString(16).padStart(2, "0"),
  ).join("");
}
export function createHandler({ url, secret, publishable, fetcher = fetch }) {
  const dbHeaders = {
    apikey: secret,
    "Content-Type": "application/json",
    ...(secret?.startsWith("eyJ") ? { Authorization: `Bearer ${secret}` } : {}),
  };
  async function db(path, options = {}) {
    const response = await fetcher(`${url}/rest/v1/${path}`, {
      ...options,
      headers: { ...dbHeaders, ...options.headers },
    });
    if (!response.ok) throw new Error("database_unavailable");
    return response.status === 204 ? null : response.json();
  }
  const rpc = (name, body) =>
    db(`rpc/${name}`, { method: "POST", body: JSON.stringify(body) });
  async function threadData(thread) {
    const messages = await db(
      `mail_messages?thread_id=eq.${thread.id}&select=id,author,body,created_at&order=created_at.asc,id.asc&limit=200`,
    );
    return { thread, messages };
  }
  return async function handle(req) {
    const origin = req.headers.get("Origin");
    const headers = {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      Vary: "Origin",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "content-type, apikey, authorization",
      ...(origin && origins.has(origin)
        ? { "Access-Control-Allow-Origin": origin }
        : {}),
    };
    const reply = (data, status = 200) =>
      new Response(JSON.stringify(data), { status, headers });
    if (origin && !origins.has(origin))
      return reply({ error: "Origem não permitida." }, 403);
    if (req.method === "OPTIONS")
      return new Response(null, { status: 204, headers });
    if (req.method !== "POST")
      return reply({ error: "Método não permitido." }, 405);
    try {
      const raw = await req.text();
      if (raw.length > 12000)
        return reply({ error: "Mensagem muito longa." }, 413);
      let input;
      try {
        input = JSON.parse(raw);
      } catch {
        return reply({ error: "Pedido inválido." }, 400);
      }
      if (!input || typeof input !== "object" || Array.isArray(input))
        return reply({ error: "Pedido inválido." }, 400);
      const isAdmin =
        typeof input.action === "string" && input.action.startsWith("admin_");
      if (
        ![
          "create",
          "read",
          "reply",
          "admin_list",
          "admin_read",
          "admin_reply",
          "admin_status",
        ].includes(input.action)
      )
        return reply({ error: "Ação inválida." }, 400);
      let administrator = false;
      if (isAdmin) {
        const authorization = req.headers.get("Authorization");
        if (!authorization?.startsWith("Bearer "))
          return reply(
            { error: "Entre na sua conta para acessar o painel." },
            401,
          );
        const result = await fetcher(`${url}/auth/v1/user`, {
          headers: { apikey: publishable, Authorization: authorization },
        });
        if (!result.ok)
          return reply({ error: "Sua sessão expirou. Entre novamente." }, 401);
        administrator = owner(await result.json());
        if (!administrator)
          return reply(
            { error: "Este painel é exclusivo do desenvolvedor." },
            403,
          );
      }
      const ip =
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        req.headers.get("cf-connecting-ip") ||
        "unknown";
      const bucket = await hash(`${secret}:mail:${ip}`);
      const allowed = await rpc("mail_take_rate", {
        p_bucket: `${input.action === "create" ? "create" : "access"}:${bucket}`,
        p_limit: input.action === "create" ? 5 : 120,
        p_window: input.action === "create" ? 3600 : 60,
      });
      if (!allowed)
        return reply(
          { error: "Muitas tentativas. Aguarde um pouco e tente novamente." },
          429,
        );
      if (input.action === "admin_list") {
        const page =
          Number.isInteger(input.page) && input.page >= 0 ? input.page : 0;
        const status = input.status || "all";
        if (!["all", "open", "closed"].includes(status))
          throw new InputError("Filtro de atendimento inválido.");
        const filter = status === "all" ? "" : `&status=eq.${status}`;
        const threads = await db(
          `mail_threads?select=${columns}${filter}&order=updated_at.desc,id.desc&limit=51&offset=${page * 50}`,
        );
        return reply({
          threads: threads.slice(0, 50),
          hasMore: threads.length > 50,
        });
      }
      let thread;
      if (administrator) {
        const id = text(input.id, 36, "conversa");
        if (!/^[a-f0-9-]{36}$/.test(id))
          throw new InputError("Conversa inválida.");
        const rows = await db(`mail_threads?id=eq.${id}&select=${columns}`);
        thread = rows[0];
      } else {
        const token = code(input.code);
        const tokenHash = await hash(token);
        if (input.action === "create") {
          const s = submission(input.values || {});
          await rpc("mail_create", {
            p_hash: tokenHash,
            p_name: s.name,
            p_business: s.business,
            p_service: s.service,
            p_body: s.body,
          });
        }
        const rows = await db(
          `mail_threads?token_hash=eq.${tokenHash}&select=${columns}`,
        );
        thread = rows[0];
      }
      if (!thread)
        return reply(
          { error: "Conversa não encontrada. Confira o código privado." },
          404,
        );
      if (input.action === "admin_status") {
        if (!["open", "closed"].includes(input.status))
          throw new InputError("Status de atendimento inválido.");
        await rpc("mail_set_status", {
          p_id: thread.id,
          p_status: input.status,
        });
        const rows = await db(
          `mail_threads?id=eq.${thread.id}&select=${columns}`,
        );
        thread = rows[0];
      }
      if (input.action === "reply" || input.action === "admin_reply") {
        const body = text(input.message, 5000, "mensagem");
        const requestId = text(input.requestId, 36, "identificador de envio");
        if (
          !/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/.test(
            requestId,
          )
        )
          throw new InputError(
            "Envio inválido. Atualize a página e tente novamente.",
          );
        const allowed = await rpc("mail_take_rate", {
          p_bucket: `reply:${thread.id}`,
          p_limit: 10,
          p_window: 60,
        });
        if (!allowed)
          return reply(
            { error: "Aguarde um minuto antes de enviar outra mensagem." },
            429,
          );
        await rpc("mail_append", {
          p_id: thread.id,
          p_author: administrator ? "admin" : "client",
          p_body: body,
          p_request: requestId,
        });
        const rows = await db(
          `mail_threads?id=eq.${thread.id}&select=${columns}`,
        );
        thread = rows[0];
      }
      return reply(
        await threadData(thread),
        input.action === "create" ? 201 : 200,
      );
    } catch (error) {
      return error instanceof InputError
        ? reply({ error: error.message }, 400)
        : reply(
            {
              error:
                "Não foi possível concluir agora. Seus dados não foram descartados. Tente novamente em instantes.",
            },
            503,
          );
    }
  };
}
