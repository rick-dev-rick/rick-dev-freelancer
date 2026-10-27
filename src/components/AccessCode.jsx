import { useState } from "react";
export default function AccessCode({ code }) {
  const [status, setStatus] = useState("");
  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setStatus("Código copiado. Guarde em um lugar seguro.");
    } catch {
      setStatus("Selecione o código no campo acima e copie manualmente.");
    }
  }
  return (
    <section className="access-code">
      <span className="eyebrow">SEU ACESSO À CONVERSA</span>
      <h2>Guarde este código privado.</h2>
      <p>
        Ele permite acompanhar e continuar esta conversa em “Minhas mensagens”.
        Quem tiver o código poderá ler as mensagens. Sem ele, não é possível
        recuperar o acesso por aqui.
      </p>
      <label>
        Código da conversa
        <input readOnly value={code} autoComplete="off" spellCheck="false" />
      </label>
      <button type="button" className="outline-button" onClick={copy}>
        Copiar código privado
      </button>
      <small>
        Não há aviso por e-mail. Volte a esta página e atualize as respostas. O
        código é lembrado apenas nesta aba, enquanto ela estiver aberta.
      </small>
      <p role="status" className="form-status">
        {status}
      </p>
    </section>
  );
}
