import { useState, useRef } from "react";
import AdminLogin from "./AdminLogin";
import { mailbox, newRequestId } from "../lib/mailbox";
export default function Conversation({ data, code, admin = false, onUpdate }) {
  const [message, setMessage] = useState("");
  const requestId = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [authNeeded, setAuthNeeded] = useState(false);
  async function refresh() {
    setBusy(true);
    setError("");
    try {
      onUpdate(
        await mailbox(
          admin ? "admin_read" : "read",
          admin ? { id: data.thread.id } : { code },
        ),
      );
    } catch (e) {
      setError(e.message);
      if (admin && e.code === "AUTH_REQUIRED") setAuthNeeded(true);
    } finally {
      setBusy(false);
    }
  }
  async function reply(e) {
    e.preventDefault();
    if (!message.trim()) {
      setError("Escreva uma mensagem antes de enviar.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      requestId.current ||= newRequestId();
      onUpdate(
        await mailbox(admin ? "admin_reply" : "reply", {
          ...(admin ? { id: data.thread.id } : { code }),
          message,
          requestId: requestId.current,
        }),
      );
      setMessage("");
      requestId.current = null;
    } catch (e) {
      setError(e.message);
      if (admin && e.code === "AUTH_REQUIRED") setAuthNeeded(true);
    } finally {
      setBusy(false);
    }
  }
  async function changeStatus() {
    const status = data.thread.status === "closed" ? "open" : "closed";
    setBusy(true);
    setError("");
    try {
      onUpdate(await mailbox("admin_status", { id: data.thread.id, status }));
      setError(
        status === "closed"
          ? "Conversa marcada como finalizada."
          : "Conversa reaberta para atendimento.",
      );
    } catch (e) {
      setError(e.message);
      if (e.code === "AUTH_REQUIRED") setAuthNeeded(true);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="conversation">
      <div className="conversation-heading">
        <div>
          <span className="eyebrow">CONVERSA SOBRE O PROJETO</span>
          <h2>{data.thread.service}</h2>
          <p>
            {data.thread.name}
            {data.thread.business ? ` · ${data.thread.business}` : ""}
          </p>
        </div>
        <button
          className="outline-button"
          onClick={refresh}
          disabled={busy || authNeeded}
        >
          {busy ? "Aguarde…" : "Atualizar respostas"}
        </button>
      </div>
      <div className="conversation-status">
        <div>
          <span
            className={`thread-status status-${data.thread.status || "open"}`}
          >
            {data.thread.status === "closed" ? "Finalizada" : "Em atendimento"}
          </span>
          {data.thread.status === "closed" && (
            <p>
              Atendimento finalizado. Uma nova mensagem reabre a conversa,
              mantendo todo o histórico.
            </p>
          )}
        </div>
        {admin && (
          <button
            type="button"
            className="outline-button"
            disabled={busy || authNeeded}
            onClick={changeStatus}
          >
            {data.thread.status === "closed"
              ? "Reabrir conversa"
              : "Finalizar conversa"}
          </button>
        )}
      </div>
      <div
        className="message-list"
        aria-live="polite"
        aria-relevant="additions text"
      >
        {data.messages.map((m) => (
          <article key={m.id} className={`message message-${m.author}`}>
            <header>
              <b>
                {m.author === "admin"
                  ? "rick_dev"
                  : admin
                    ? data.thread.name
                    : "Você"}
              </b>
              <time dateTime={m.created_at}>
                {new Intl.DateTimeFormat("pt-BR", {
                  dateStyle: "short",
                  timeStyle: "short",
                }).format(new Date(m.created_at))}
              </time>
            </header>
            <p>{m.body}</p>
          </article>
        ))}
      </div>
      {authNeeded && (
        <AdminLogin
          onLogin={() => {
            setAuthNeeded(false);
            setError(
              "Você entrou novamente. Sua mensagem está preservada; revise e envie quando quiser.",
            );
          }}
        />
      )}
      {data.messages.length >= 200 ? (
        <p>
          Esta conversa atingiu o limite de mensagens. Para continuar, abra um
          novo pedido.
        </p>
      ) : (
        <form onSubmit={reply}>
          <label>
            Sua mensagem
            <textarea
              name="message"
              required
              maxLength={5000}
              rows={4}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                requestId.current = null;
              }}
              disabled={busy || authNeeded}
              placeholder={
                admin
                  ? "Escreva sua resposta ao cliente…"
                  : "Acrescente detalhes ou tire uma dúvida…"
              }
            />
          </label>
          <div className="reply-actions">
            <button className="button" disabled={busy || authNeeded}>
              {busy ? "Enviando…" : "Enviar mensagem"}
            </button>
            <small>
              A conversa fica salva no site. Use “Atualizar respostas” para ver
              novidades.
            </small>
          </div>
        </form>
      )}
      <p role="status" className="form-status">
        {error}
      </p>
    </section>
  );
}
