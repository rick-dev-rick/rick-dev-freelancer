import Icon from "../components/Icon";
import { Link } from "react-router-dom";
import ProjectVisual from "../components/ProjectVisual";
import CTA from "../components/CTA";
import Process from "../components/Process";
import { services } from "../data/services";
export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">
              <i className="status-dot" /> DESENVOLVIMENTO WEB PARA NEGÓCIOS
            </span>
            <h1>
              Seu negócio.
              <br />
              Uma presença
              <br />
              <em>à altura.</em>
            </h1>
            <p>
              Sites bem pensados para apresentar sua marca, valorizar seus
              serviços e facilitar o próximo contato.
            </p>
            <div className="hero-actions">
              <Link className="button" to="/contato">
                Quero um site para meu negócio{" "}
                <span aria-hidden="true">
                  <Icon />
                </span>
              </Link>
              <Link className="text-link" to="/projetos">
                Conhecer os projetos{" "}
                <span aria-hidden="true">
                  <Icon />
                </span>
              </Link>
            </div>
            <div className="hero-note">
              <span>Design com propósito.</span>
              <span>Código com cuidado.</span>
            </div>
          </div>
          <div className="hero-showcase">
            <div className="showcase-label">
              <span>IDEIAS QUE GANHAM FORMA</span>
              <span>PORTFÓLIO / 01</span>
            </div>
            <ProjectVisual project="nova" hero />
            <div className="showcase-caption">
              <span>
                <b>NØVA STREET</b>
                <small>E-commerce demonstrativo · React</small>
              </span>
              <Link to="/projetos" aria-label="Conhecer o case NØVA STREET">
                <Icon />
              </Link>
            </div>
            <div className="floating-note">
              <span>
                <Icon name="horizontal" />
              </span>
              <div>
                Pensado para cada tela.
                <small>Do primeiro clique ao celular.</small>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="value-strip">
        <div className="container">
          <span>
            <Icon name="sparkle" />
            Clareza na comunicação
          </span>
          <span>
            <Icon name="sparkle" />
            Experiência responsiva
          </span>
          <span>
            <Icon name="sparkle" />
            Orçamento sob medida
          </span>
          <span>
            <Icon name="sparkle" />
            Desenvolvimento em React
          </span>
        </div>
      </div>
      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">O QUE POSSO CONSTRUIR COM VOCÊ</span>
              <h2>
                Soluções digitais.
                <br />
                Objetivos reais.
              </h2>
            </div>
            <Link className="text-link" to="/servicos">
              Explorar os serviços <Icon />
            </Link>
          </div>
          <div className="service-grid">
            {services.map((s) => (
              <Link className="service-card" key={s.number} to="/servicos">
                <span className="service-number">
                  {s.number}
                  <b>
                    <Icon />
                  </b>
                </span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
                <span className="service-bottom">
                  Conhecer a solução{" "}
                  <span>
                    <Icon />
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="section featured">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">MENOS PROMESSA. MAIS PROJETO.</span>
              <h2>
                Do conceito
                <br />à experiência.
              </h2>
            </div>
            <p>
              Projetos pessoais e demonstrativos que
              <br className="desktop" /> mostram meu trabalho na prática.
            </p>
          </div>
          <div className="featured-grid">
            <Link to="/projetos" className="featured-main">
              <ProjectVisual project="os" />
              <h3>
                RICK_DEV OS{" "}
                <span>
                  <Icon />
                </span>
              </h3>
              <p>Interface, organização e desenvolvimento web.</p>
            </Link>
            <div className="featured-copy">
              <span className="eyebrow">DESIGN + DESENVOLVIMENTO</span>
              <h3>
                O cuidado aparece
                <br />
                em cada interação.
              </h3>
              <p>
                Uma loja, um painel ou uma experiência pessoal: cada projeto
                começa por entender como as pessoas vão usá-lo.
              </p>
              <Link to="/projetos" className="text-link">
                Ver todos os projetos <Icon />
              </Link>
              <span className="mini-index">
                01 / NØVA STREET
                <br />
                02 / RICK_DEV OS
                <br />
                03 / PARA RAFAELA
              </span>
            </div>
          </div>
        </div>
      </section>
      <Process />
      <CTA />
    </>
  );
}
