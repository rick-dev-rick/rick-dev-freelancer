// Publishable API key only. Server credentials never belong in this file.
const url = "https://xqtqobtmxuekrdrlpnxr.supabase.co";
const publicKey = "sb_publishable_445SnGrreUKmr0GXLT-EiQ_dGOrzLaq";
export class AuthRequiredError extends Error {
  constructor() {
    super("Sua sessão expirou. Entre novamente sem sair desta conversa.");
    this.code = "AUTH_REQUIRED";
  }
}
const sessionKey = "rick-dev-mailbox-session";
export function newAccessCode() {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)), (b) =>
    b.toString(16).padStart(2, "0"),
  ).join("");
}
export function saveCode(code) {
  try {
    code
      ? sessionStorage.setItem("rick-dev-conversation", code)
      : sessionStorage.removeItem("rick-dev-conversation");
  } catch {
    /* The visitor can still keep the code manually. */
  }
}
export function savedCode() {
  try {
    return sessionStorage.getItem("rick-dev-conversation") || "";
  } catch {
    return "";
  }
}
export function adminSession() {
  try {
    return JSON.parse(sessionStorage.getItem(sessionKey) || "null");
  } catch {
    return null;
  }
}
function saveSession(session) {
  try {
    session
      ? sessionStorage.setItem(sessionKey, JSON.stringify(session))
      : sessionStorage.removeItem(sessionKey);
  } catch {
    throw new Error(
      "Permita o armazenamento desta sessão no navegador para usar o painel.",
    );
  }
}
async function auth(path, body) {
  const res = await fetch(`${url}/auth/v1/${path}`, {
    method: "POST",
    headers: { apikey: publicKey, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const result = await res.json();
  if (!res.ok)
    throw new Error(
      res.status === 429
        ? "Aguarde um pouco antes de tentar entrar novamente."
        : "Não foi possível entrar. Confira a senha e a confirmação do e-mail.",
    );
  return result;
}
export async function signIn(password) {
  const session = await auth("token?grant_type=password", {
    email: "douglasxxxbarbosa@gmail.com",
    password,
  });
  saveSession({
    access_token: session.access_token,
    refresh_token: session.refresh_token,
  });
}
export async function signOut() {
  const session = adminSession();
  saveSession(null);
  if (session?.access_token)
    try {
      await fetch(`${url}/auth/v1/logout`, {
        method: "POST",
        headers: {
          apikey: publicKey,
          Authorization: `Bearer ${session.access_token}`,
        },
      });
    } catch {
      /* Local session is already removed. */
    }
}
export async function mailbox(action, fields = {}, retry = true) {
  const session = action.startsWith("admin_") ? adminSession() : null;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000);
  let res;
  try {
    res = await fetch(`${url}/functions/v1/mailbox`, {
      method: "POST",
      signal: controller.signal,
      headers: {
        apikey: publicKey,
        "Content-Type": "application/json",
        ...(session?.access_token
          ? { Authorization: `Bearer ${session.access_token}` }
          : {}),
      },
      body: JSON.stringify({ action, ...fields }),
    });
  } catch {
    throw new Error(
      "Não foi possível conectar. Confira sua internet e tente novamente. O texto continua nesta página.",
    );
  } finally {
    clearTimeout(timer);
  }
  if (res.status === 401 && session?.refresh_token && retry) {
    try {
      const refreshed = await auth("token?grant_type=refresh_token", {
        refresh_token: session.refresh_token,
      });
      saveSession({
        access_token: refreshed.access_token,
        refresh_token: refreshed.refresh_token,
      });
      return mailbox(action, fields, false);
    } catch {
      saveSession(null);
      throw new AuthRequiredError();
    }
  }
  if (res.status === 401 && action.startsWith("admin_")) {
    saveSession(null);
    throw new AuthRequiredError();
  }
  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error("O serviço não respondeu corretamente. Tente novamente.");
  }
  if (!res.ok)
    throw new Error(
      data.error || "Não foi possível concluir agora. Tente novamente.",
    );
  return data;
}

export function pendingCode(value) {
  try {
    if (value === undefined)
      return sessionStorage.getItem("rick-dev-pending") || "";
    value
      ? sessionStorage.setItem("rick-dev-pending", value)
      : sessionStorage.removeItem("rick-dev-pending");
  } catch {
    return "";
  }
}

export function newRequestId() {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 15) | 64;
  bytes[8] = (bytes[8] & 63) | 128;
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join(
    "",
  );
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
