import { useState } from "react";
import { signIn } from "../lib/mailbox";
import { contact } from "../lib/contact";
export default function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setStatus("");
    try {
      await signIn(password);
      setPassword("");
      onLogin();
    } catch (e) {
      setStatus(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <form className="admin-login" onSubmit={submit}>
      <span className="eyebrow">ACESSO RESTRITO AO DESENVOLVEDOR</span>
      <h2>Entrar no painel</h2>
      <p>Conta do proprietário: {contact.email}</p>
      <label>
        Sua senha
        <input
          type="password"
          autoComplete="current-password"
          required
          maxLength={128}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={busy}
        />
      </label>
      <button className="button" disabled={busy}>
        {busy ? "Entrando…" : "Entrar"}
      </button>
      <details>
        <summary>Primeiro acesso do desenvolvedor</summary>
        <p>
          O usuário do atendimento precisa ser criado pelo proprietário no
          Supabase, em Authentication → Users → Add user → Create new user. Use
          o e-mail acima, uma senha exclusiva e a opção de confirmar o e-mail do
          usuário. Depois, entre aqui com essa senha. Isso protege o acesso às
          mensagens dos clientes.
        </p>
        <a
          className="text-link"
          href="https://supabase.com/dashboard/project/xqtqobtmxuekrdrlpnxr/auth/users"
          target="_blank"
          rel="noreferrer"
        >
          Abrir configuração do atendimento
        </a>
      </details>
      <p role="status" className="form-status">
        {status}
      </p>
    </form>
  );
}
