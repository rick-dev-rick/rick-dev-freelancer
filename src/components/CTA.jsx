import Icon from "./Icon";
import { Link } from "react-router-dom";
export default function CTA({ signed = false }) {
  return (
    <section className="cta-band" data-scene={signed ? "signature" : undefined}>
      {signed && <div className="container colophon" aria-hidden="true"><span>rick</span><span>_dev</span></div>}
      <div className="container cta-inner">
        <div>
          <span className="eyebrow">PROJETO NOVO</span>
          <h2>
            O que seu site
            <br />
            precisa fazer?
          </h2>
        </div>
        <div>
          <p>
            Conte o que seu negócio precisa.
            <br />A proposta é pensada para o seu projeto.
          </p>
          <Link className="button light" to="/contato">
            Conversar sobre meu projeto{" "}
            <span aria-hidden="true">
              <Icon />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
