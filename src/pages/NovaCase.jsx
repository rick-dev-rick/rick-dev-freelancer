import { Link } from "react-router-dom";
import Icon from "../components/Icon";
import CTA from "../components/CTA";
import cover from "../assets/cases/nova-street-home.webp";
import { projects } from "../data/projects";

const nova = projects.find(({ id }) => id === "nova");
const details = [
  {
    title: "Uma vitrine editorial com navegação clara",
    text: "A abertura apresenta a coleção. No catálogo, busca, filtros e ordenação podem ser compartilhados pela URL. A página de produto reúne galeria, tamanhos e ação de adicionar à sacola.",
  },
  {
    title: "Um Design System que chega aos componentes",
    text: "Tokens organizam cores, tipografia e movimento. Cartões de produto, botões e controles de quantidade usam padrões compartilhados entre catálogo, produto e sacola.",
  },
  {
    title: "Movimento com alternativas estáticas",
    text: "A Home combina entrada cinematográfica com revelações editoriais. A transição de catálogo para produto depende do suporte do navegador, da imagem disponível e da preferência de movimento. A navegação segue disponível com a transição desativada.",
  },
  {
    title: "Uma jornada demonstrativa em React",
    text: "React Router organiza as telas e o Vite gera o build. Favoritos e sacola persistem no navegador quando o armazenamento está disponível. Frete e confirmação são simulados localmente.",
  },
];

export default function NovaCase() {
  return (
    <>
      <section className="container case-intro">
        <Link to="/projetos" className="text-link">Todos os projetos</Link>
        <div className="case-grid">
          <div className="case-story">
            <p className="eyebrow">Case de front-end</p>
            <h1>NØVA STREET</h1>
            <p>Uma vitrine streetwear que conecta direção de arte, Design System e uma jornada de compra demonstrativa.</p>
            <div className="case-actions">
              <a className="button" href={nova.url} target="_blank" rel="noreferrer">
                Abrir demonstração <Icon />
              </a>
              <a className="text-link" href={nova.repo} target="_blank" rel="noreferrer">
                Ver código no GitHub <Icon />
              </a>
            </div>
            <p className="case-note">Projeto de portfólio. Pedidos, frete e pagamentos reais ficam fora da demonstração.</p>
          </div>
          <figure className="case-cover">
            <img
              src={cover}
              alt="Home da NØVA STREET com tipografia editorial em branco e fotografia de campanha em preto e branco"
              width="1200"
              height="760"
              decoding="async"
            />
            <figcaption>Captura da Home da demonstração em desktop.</figcaption>
          </figure>
        </div>
      </section>
      <section className="container case-decisions" data-scene="notes" aria-labelledby="case-decisions">
        <h2 id="case-decisions">Decisões de projeto</h2>
        {details.map(({ title, text }) => (
          <article key={title}>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </section>
      <CTA />
    </>
  );
}
