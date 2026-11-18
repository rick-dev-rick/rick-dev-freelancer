import { useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../components/Icon";
import CTA from "../components/CTA";
import Process from "../components/Process";
import { services } from "../data/services";
import cover from "../assets/cases/nova-street-home.webp";
import catalog from "../assets/cases/nova-street-catalog-mobile.webp";

const casePath = "/projetos/nova-street";
const views = {
  Desktop: { src: cover, width: 1200, height: 760, caption: "Abertura da vitrine em desktop" },
  Mobile: { src: catalog, width: 390, height: 760, caption: "Catálogo da demonstração a 390 px" },
};

function CaseStudy() {
  const [view, setView] = useState("Desktop");
  const image = views[view];
  return (
    <section className="container spread study" aria-labelledby="study-title">
      <div>
        <span className="eyebrow">Projeto em destaque</span>
        <h2 id="study-title">NØVA STREET</h2>
        <p>Da vitrine à sacola, o case combina direção de arte e navegação em uma jornada demonstrativa. Busca e filtros ficam na URL para compartilhar a seleção do catálogo.</p>
        <Link className="text-link" to={casePath}>Ler o case <Icon /></Link>
        <div className="view-switch" role="group" aria-label="Captura do projeto">
          {Object.keys(views).map(name => (
            <button type="button" key={name} aria-pressed={view === name} onClick={() => setView(name)}>{name}</button>
          ))}
        </div>
        <Link className="text-link" to="/projetos">Ver todos os projetos <Icon /></Link>
      </div>
      <figure className="study-figure">
        <div className="study-frame">
          <img key={view} src={image.src} alt={image.caption} width={image.width} height={image.height} loading="lazy" />
        </div>
        <figcaption aria-live="polite">{image.caption}</figcaption>
      </figure>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <section className="container editorial-hero">
        <div className="editorial-title">
          <span className="eyebrow">Estúdio independente · Front-end</span>
          <h1>Interfaces<br />com <em>intenção.</em></h1>
          <p>Sites e experiências digitais para marcas que precisam explicar bem o que fazem.</p>
          <Link className="button" to="/contato">Conversar sobre meu projeto <Icon /></Link>
        </div>
        <figure className="editorial-proof">
          <Link to={casePath} aria-label="Conhecer o case NØVA STREET">
            <img src={cover} alt="Abertura da vitrine NØVA STREET em desktop" width="1200" height="760" fetchPriority="high" />
          </Link>
          <figcaption><Link to={casePath}>NØVA STREET ↗</Link><span>Vitrine demonstrativa</span></figcaption>
        </figure>
        <svg className="editorial-stamp" aria-hidden="true" viewBox="0 0 238 163"><text x="0" y="160">rd.</text></svg>
      </section>
      <section className="container spread">
        <div><span className="eyebrow">O que desenvolvo</span><h2>Do primeiro clique à página final.</h2></div>
        <div className="service-index">
          {services.map((service, index) => (
            <details key={service.number} open={index === 0}>
              <summary>{service.title}</summary>
              <p>{service.text}</p>
              <Link className="text-link" to={`/servicos#servico-${service.number}`}>Conhecer a solução <Icon /></Link>
            </details>
          ))}
        </div>
      </section>
      <CaseStudy />
      <Process />
      <CTA />
    </>
  );
}
