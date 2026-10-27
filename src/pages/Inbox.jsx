import { useState, useEffect } from "react";
import { mailbox, adminSession, signOut } from "../lib/mailbox";
import AdminLogin from "../components/AdminLogin";
import Conversation from "../components/Conversation";
export default function Inbox() {
  const [signed, setSigned] = useState(() => Boolean(adminSession()));
  const [threads, setThreads] = useState([]);
  const [data, setData] = useState(null);
  const [page, setPage] = useState(0);
  const [filter, setFilter] = useState("open");
  const [more, setMore] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function list(value = page) {
    setBusy(true);
    setError("");
    try {
      const result = await mailbox("admin_list", {
        page: value,
        status: filter,
      });
      setThreads(result.threads);
      setMore(result.hasMore);
      setPage(value);
    } catch (e) {
      setError(e.message);
      if (!adminSession()) setSigned(false);
    } finally {
      setBusy(false);
    }
  }
  useEffect(() => {
    if (signed) list(0);
  }, [signed, filter]);
  async function open(id) {
    setBusy(true);
    setError("");
    try {
      setData(await mailbox("admin_read", { id }));
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  async function logout() {
    await signOut();
    setSigned(false);
    setThreads([]);
    setData(null);
    setError("");
  }
  return (
    <>
      <section className="page-intro container">
        <span className="eyebrow">RICK_DEV / PAINEL DE ATENDIMENTO</span>
        <h1>
          Caixa de
          <br />
          <em>mensagens.</em>
        </h1>
        <p>Acompanhe os pedidos e responda aos clientes pelo site.</p>
      </section>
      <section className="container mailbox-page">
        {!signed ? (
          <AdminLogin onLogin={() => setSigned(true)} />
        ) : (
          <>
            <div className="inbox-toolbar">
              <button
                className="outline-button"
                disabled={busy}
                onClick={() => {
                  setData(null);
                  list();
                }}
              >
                Atualizar lista
              </button>
              <button className="text-button" onClick={logout}>
                Sair da conta
              </button>
            </div>
            {data ? (
              <>
                <button
                  className="text-button"
                  onClick={() => {
                    setData(null);
                    list();
                  }}
                >
                  Voltar à lista
                </button>
                <Conversation data={data} admin onUpdate={setData} />
              </>
            ) : (
              <>
                <div
                  className="inbox-filters"
                  aria-label="Filtrar por status do atendimento"
                >
                  {[
                    ["open", "Em atendimento"],
                    ["closed", "Finalizadas"],
                    ["all", "Todas"],
                  ].map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={filter === value}
                      disabled={busy}
                      onClick={() => setFilter(value)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <div className="inbox-list">
                  {threads.map((t) => (
                    <button
                      key={t.id}
                      className="inbox-item"
                      disabled={busy}
                      onClick={() => open(t.id)}
                    >
                      <div>
                        <b>{t.name}</b>
                        <span>
                          {t.service}
                          {t.business ? ` · ${t.business}` : ""}
                        </span>
                      </div>
                      <div>
                        <small>
                          {new Intl.DateTimeFormat("pt-BR", {
                            dateStyle: "short",
                          }).format(new Date(t.updated_at))}
                        </small>
                        <span
                          className={`thread-status status-${t.status || "open"}`}
                        >
                          {t.status === "closed"
                            ? "Finalizada"
                            : "Em atendimento"}
                        </span>
                        {t.status !== "closed" && (
                          <span
                            className={
                              t.last_author === "client"
                                ? "waiting-badge"
                                : "replied-badge"
                            }
                          >
                            {t.last_author === "client"
                              ? "Cliente escreveu"
                              : "Você respondeu"}
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
                {!threads.length && !busy && !error && (
                  <p className="empty-state">
                    {filter === "closed"
                      ? "Nenhuma conversa finalizada."
                      : filter === "open"
                        ? "Nenhuma conversa em atendimento."
                        : "Nenhuma mensagem recebida ainda."}
                  </p>
                )}
                <div className="inbox-toolbar">
                  <button
                    className="text-button"
                    disabled={busy || page === 0}
                    onClick={() => list(page - 1)}
                  >
                    Página anterior
                  </button>
                  <span>Página {page + 1}</span>
                  <button
                    className="text-button"
                    disabled={busy || !more}
                    onClick={() => list(page + 1)}
                  >
                    Próxima página
                  </button>
                </div>
              </>
            )}
          </>
        )}
        <p role="status" className="form-status">
          {error || (busy && "Carregando…")}
        </p>
      </section>
    </>
  );
}
