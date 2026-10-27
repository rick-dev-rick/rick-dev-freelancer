import Icon from "../components/Icon";
import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { createBrief, validateBrief } from "../lib/brief";
import { contact, whatsappUrl, emailUrl } from "../lib/contact";
import { services } from "../data/services";
export default function Contact() {
  const [params] = useSearchParams();
  const prefill = services.some((s) => s.title === params.get("servico"))
    ? params.get("servico")
    : "";
  const [values, setValues] = useState({
    name: "",
    business: "",
    service: prefill,
    goal: "",
    deadline: "",
  });
  const [brief, setBrief] = useState("");
  const [status, setStatus] = useState("");
  const update = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
    setBrief("");
    setStatus("");
  };
  function submit(e) {
    e.preventDefault();
    if (!validateBrief(values)) {
      const field = !values.name.trim() ? "name" : "goal";
      setStatus("Preencha seu nome e o objetivo com texto válido.");
      e.currentTarget.elements.namedItem(field).focus();
      return;
    }
    setBrief(createBrief(values));
    setStatus("Resumo preparado. Revise e escolha como compartilhar.");
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(brief);
      setStatus("Resumo copiado. Nenhuma mensagem foi enviada.");
    } catch {
      setStatus(
        "A cópia automática não está disponível. Selecione o texto do resumo e copie manualmente.",
      );
    }
  }
  function download() {
    const url = URL.createObjectURL(
      new Blob([brief], { type: "text/plain;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "meu-projeto-rick-dev.txt";
    a.click();
    URL.revokeObjectURL(url);
    setStatus("Resumo baixado. Nenhuma mensagem foi enviada.");
  }
  return (
    <>
      <section className="page-intro container">
        <span className="eyebrow">
          CONTATO / O PRIMEIRO PASSO É UMA BOA CONVERSA
        </span>
        <h1>
          Vamos dar forma
          <br />
          <em>à sua ideia.</em>
        </h1>
        <p>
          Conte um pouco sobre o que você precisa. Não é necessário chegar com
          tudo definido: um objetivo já é um bom começo.
        </p>
        <Link className="text-link" to="/mensagens">
          Já enviou um pedido? Acompanhar minhas mensagens
        </Link>
      </section>
      <section className="container contact-grid">
        <aside>
          <span className="eyebrow">ORÇAMENTO PERSONALIZADO</span>
          <h2>
            Seu projeto começa
            <br />
            com contexto.
          </h2>
          <p>
            Os detalhes ajudam a entender o escopo e preparar uma proposta que
            faça sentido para você.
          </p>
          <div className="contact-note">
            <span aria-hidden="true">
              <Icon />
            </span>
            <div>
              <b>Você escolhe como conversar.</b>
              <p>
                Preencha o briefing e escolha: enviar pela caixa de mensagens do
                site, conversar no WhatsApp ou continuar por e-mail.
              </p>
            </div>
          </div>
          <div className="contact-channels">
            <a
              className="button"
              href={whatsappUrl()}
              target="_blank"
              rel="noreferrer"
            >
              Conversar no WhatsApp <Icon />
            </a>
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noreferrer"
              className="contact-address"
            >
              {contact.phoneLabel}
            </a>
            <a href={emailUrl()} className="contact-address">
              {contact.email} <Icon />
            </a>
          </div>
        </aside>
        <form onSubmit={submit}>
          <div className="field-row">
            <label>
              Seu nome <span>*</span>
              <input
                autoComplete="name"
                name="name"
                value={values.name}
                onChange={update}
                required
                maxLength={100}
                placeholder="Como posso chamar você?"
              />
            </label>
            <label>
              Nome do negócio
              <input
                autoComplete="organization"
                name="business"
                value={values.business}
                onChange={update}
                maxLength={150}
                placeholder="Sua empresa ou sua ideia"
              />
            </label>
          </div>
          <label>
            O que você procura? <span>*</span>
            <select
              name="service"
              required
              value={values.service}
              onChange={update}
            >
              <option value="">Selecione uma opção</option>
              {services.map((s) => (
                <option key={s.title}>{s.title}</option>
              ))}
              <option>Ainda preciso de orientação</option>
            </select>
          </label>
          <label>
            O que seu site precisa fazer? <span>*</span>
            <textarea
              name="goal"
              required
              value={values.goal}
              onChange={update}
              maxLength={3000}
              rows={5}
              placeholder="Apresentar meus serviços, mostrar meus produtos, divulgar uma campanha…"
            />
          </label>
          <label>
            Tem algum prazo em mente?
            <input
              name="deadline"
              value={values.deadline}
              onChange={update}
              maxLength={150}
              placeholder="Ex.: próximo mês, sem data definida…"
            />
          </label>
          <button className="button" type="submit">
            Preparar resumo do projeto{" "}
            <span aria-hidden="true">
              <Icon />
            </span>
          </button>
          <small className="privacy-note">
            * Campos obrigatórios. O formulário não armazena nem envia dados. Ao
            abrir WhatsApp ou e-mail, o resumo é compartilhado com o aplicativo
            escolhido; você confirma o envio nele.
          </small>
          <p role="status" className="form-status">
            {status}
          </p>
          {brief && (
            <section className="brief-result">
              <h3>Seu projeto, em poucas palavras.</h3>
              <label htmlFor="brief-text">Resumo para compartilhar</label>
              <textarea id="brief-text" value={brief} readOnly rows={10} />
              <h4 className="channel-title">Como você prefere continuar?</h4>
              <div className="channel-options">
                <Link
                  className="channel-option"
                  to="/mensagens"
                  state={{ values }}
                >
                  <b>
                    Caixa de mensagens do site <Icon />
                  </b>
                  <span>
                    Envie por aqui e acompanhe a resposta com seu código
                    privado.
                  </span>
                </Link>
                <a
                  className="channel-option"
                  href={whatsappUrl(brief)}
                  target="_blank"
                  rel="noreferrer"
                >
                  <b>
                    WhatsApp <Icon />
                  </b>
                  <span>
                    Abra o aplicativo com o resumo pronto para enviar.
                  </span>
                </a>
                <a className="channel-option" href={emailUrl(brief)}>
                  <b>
                    E-mail <Icon />
                  </b>
                  <span>Continue pelo seu aplicativo de e-mail.</span>
                </a>
              </div>
              <div className="brief-actions">
                <button type="button" className="text-button" onClick={copy}>
                  Copiar resumo <Icon />
                </button>
                <button
                  type="button"
                  className="text-button"
                  onClick={download}
                >
                  Baixar .txt <Icon name="download" />
                </button>
              </div>
            </section>
          )}
        </form>
      </section>
      <section className="section">
        <div className="container faq">
          <span className="eyebrow">ANTES DE COMEÇAR</span>
          <h2>Algumas respostas úteis.</h2>
          {[
            [
              "Quanto custa um site?",
              "O orçamento é personalizado. O valor depende das páginas, dos recursos, do conteúdo e do escopo acordado.",
            ],
            [
              "Preciso ter textos e imagens prontos?",
              "Não precisa estar tudo pronto para começar a conversa. A organização do conteúdo e as responsabilidades são definidas na proposta.",
            ],
            [
              "Domínio, hospedagem e manutenção estão incluídos?",
              "Esses pontos são avaliados no orçamento. Custos de serviços externos e suporte após a entrega devem estar claros na proposta.",
            ],
          ].map(([q, a]) => (
            <details key={q}>
              <summary>
                {q}
                <span aria-hidden="true">+</span>
              </summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
