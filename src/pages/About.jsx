import Icon from "../components/Icon";
import { Link } from "react-router-dom";
import CTA from "../components/CTA";
export default function About() {
  return (
    <>
      <section className="page-intro container">
        <span className="eyebrow">SOBRE / QUEM ESTÁ POR TRÁS DO CÓDIGO</span>
        <h1>
          Prazer, rick_dev.
          <br />
          <em>Vamos construir?</em>
        </h1>
        <p>
          Desenvolvimento web com atenção ao visual, à organização e à
          experiência de quem vai usar o seu site.
        </p>
      </section>
      <section className="container about-grid">
        <div className="about-art" aria-hidden="true">
          <span className="eyebrow">DESIGN / CÓDIGO / PROPÓSITO</span>
          <strong>
            rick<span>_dev</span>
            <b>
              <Icon />
            </b>
          </strong>
          <div>
            <span>Ideias bem apresentadas.</span>
            <span>Experiências bem construídas.</span>
          </div>
        </div>
        <div className="about-copy">
          <span className="eyebrow">O FOCO É O SEU PROJETO</span>
          <h2>
            Tecnologia com
            <br />
            uma função clara.
          </h2>
          <p>
            Meu trabalho é transformar informações e ideias em interfaces que
            façam sentido para as pessoas e para o negócio.
          </p>
          <p>
            Isso começa pela conversa: entender o serviço, organizar o conteúdo
            e escolher os recursos que ajudam o cliente a encontrar o que
            precisa.
          </p>
          <p>
            Trabalho com React, JavaScript, HTML e CSS, escolhendo a estrutura
            de acordo com o projeto. O código é parte da entrega; clareza,
            navegação e cuidado visual também.
          </p>
          <Link to="/projetos" className="text-link">
            Conheça meu trabalho na prática <Icon />
          </Link>
        </div>
      </section>
      <section className="section">
        <div className="container principles">
          <article>
            <span>01 / COMUNICAÇÃO</span>
            <h3>Conversa direta.</h3>
            <p>
              Decisões explicadas com clareza, sem complicar o que pode ser
              simples.
            </p>
          </article>
          <article>
            <span>02 / ORGANIZAÇÃO</span>
            <h3>Escopo bem definido.</h3>
            <p>
              Alinhamento do que será construído e de como o projeto vai
              avançar.
            </p>
          </article>
          <article>
            <span>03 / EXPERIÊNCIA</span>
            <h3>Cuidado em cada tela.</h3>
            <p>
              Conteúdo legível, navegação intuitiva e atenção aos detalhes da
              interface.
            </p>
          </article>
        </div>
      </section>
      <CTA />
    </>
  );
}
