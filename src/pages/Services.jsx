import Icon from "../components/Icon";
import { Link } from "react-router-dom";
import { services } from "../data/services";
import Process from "../components/Process";
import CTA from "../components/CTA";
export default function Services() {
  return (
    <>
      <section className="page-intro container">
        <span className="eyebrow">SERVIÇOS / FEITO PARA O SEU MOMENTO</span>
        <h1>
          Um site que faz sentido
          <br />
          <em>para o seu negócio.</em>
        </h1>
        <p>
          O ponto de partida é o que você precisa comunicar. A solução vem
          depois, com escopo claro e orçamento personalizado.
        </p>
      </section>
      <section className="container service-details">
        {services.map((s) => (
          <article key={s.number}>
            <span className="detail-number">{s.number}</span>
            <div>
              <h2>{s.title}</h2>
              <p>{s.text}</p>
              <small>{s.ideal}</small>
            </div>
            <div>
              <span className="eyebrow">O QUE PODE FAZER PARTE</span>
              <ul>
                {s.items.map((item) => (
                  <li key={item}>
                    ✓ <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                to={`/contato?servico=${encodeURIComponent(s.title)}`}
                className="text-link"
              >
                Conversar sobre essa solução <Icon />
              </Link>
            </div>
          </article>
        ))}
      </section>
      <section className="section">
        <div className="container scope-note">
          <span className="eyebrow">SEM PACOTES ENGESSADOS</span>
          <h2>Cada projeto tem seu contexto.</h2>
          <p>
            Páginas, conteúdo, integrações, prazo e manutenção são alinhados na
            proposta. Assim, você sabe o que está incluído antes do
            desenvolvimento começar.
          </p>
        </div>
      </section>
      <Process />
      <CTA />
    </>
  );
}
