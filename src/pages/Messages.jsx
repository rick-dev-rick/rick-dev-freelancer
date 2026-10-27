import { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  mailbox,
  newAccessCode,
  saveCode,
  savedCode,
  pendingCode,
} from "../lib/mailbox";
import { createBrief } from "../lib/brief";
import Conversation from "../components/Conversation";
import AccessCode from "../components/AccessCode";
export default function Messages() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const values = state?.values;
  const [code, setCode] = useState(() => pendingCode() || savedCode());
  const [typed, setTyped] = useState("");
  const [data, setData] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [consent, setConsent] = useState(false);
  const pending = useRef(pendingCode() || null);
  async function load(value) {
    setBusy(true);
    setError("");
    try {
      const result = await mailbox("read", { code: value.trim() });
      saveCode(value.trim());
      pendingCode("");
      setCode(value.trim());
      setData(result);
      navigate("/mensagens", { replace: true, state: null });
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  useEffect(() => {
    if (code && !values) load(code);
  }, []);
  async function send(e) {
    e.preventDefault();
    if (!consent || !values) return;
    setBusy(true);
    setError("");
    pending.current ||= newAccessCode();
    pendingCode(pending.current);
    try {
      const result = await mailbox("create", { code: pending.current, values });
      setCode(pending.current);
      saveCode(pending.current);
      pendingCode("");
      setData(result);
      navigate("/mensagens", { replace: true, state: null });
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  function leave() {
    saveCode("");
    pendingCode("");
    setCode("");
    setTyped("");
    setData(null);
    setError("");
    pending.current = null;
  }
  return (
    <>
      <section className="page-intro container">
        <span className="eyebrow">MENSAGENS / CONVERSE PELO SITE</span>
        <h1>
          Uma conversa.
          <br />
          <em>No seu tempo.</em>
        </h1>
        <p>
          Envie seu pedido e acompanhe a resposta por aqui. Sem precisar abrir
          WhatsApp ou e-mail.
        </p>
      </section>
      <section className="container mailbox-page">
        {data ? (
          <>
            <AccessCode code={code} />
            <Conversation data={data} code={code} onUpdate={setData} />
            <button className="text-button" onClick={leave}>
              Sair desta conversa neste dispositivo
            </button>
          </>
        ) : (
          <>
            {values && (
              <form className="site-send" onSubmit={send}>
                <span className="eyebrow">REVISE ANTES DE ENVIAR</span>
                <h2>Seu pedido pelo site.</h2>
                <pre>{createBrief(values)}</pre>
                <p>
                  Ao enviar, seu nome e os detalhes acima serão salvos na caixa
                  de mensagens de rick_dev, em um serviço de banco de dados
                  Supabase. Use este espaço somente para informações do projeto.
                </p>
                <label className="consent">
                  <input
                    type="checkbox"
                    required
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                  />
                  <span>
                    Quero enviar este pedido e acompanhar a conversa pelo site.
                  </span>
                </label>
                <button className="button" disabled={busy || !consent}>
                  {busy ? "Enviando seu pedido…" : "Enviar pedido pelo site"}
                </button>
                <p>
                  Após o envio, guarde seu código privado para acompanhar as
                  respostas. Não há notificações por e-mail.
                </p>
              </form>
            )}
            <form
              className="recover-conversation"
              onSubmit={(e) => {
                e.preventDefault();
                load(typed);
              }}
            >
              <h2>Já enviou uma mensagem?</h2>
              <p>Informe o código privado recebido ao enviar seu pedido.</p>
              <label>
                Código privado
                <input
                  required
                  value={typed}
                  onChange={(e) => setTyped(e.target.value)}
                  autoComplete="off"
                  spellCheck="false"
                  maxLength={64}
                  minLength={64}
                  placeholder="Cole seu código de 64 caracteres"
                />
              </label>
              <button className="outline-button" disabled={busy}>
                {busy ? "Buscando…" : "Acessar minha conversa"}
              </button>
            </form>
            {!values && (
              <Link className="text-link" to="/contato">
                Quero preparar um novo pedido
              </Link>
            )}
          </>
        )}
        <p role="status" className="form-status">
          {error}
        </p>
      </section>
    </>
  );
}
