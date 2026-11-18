import Icon from "./Icon";
import { Link } from "react-router-dom";
export default function CTA({ signed = false }) {
  return (
    <section className="cta-band" data-scene={signed ? "signature" : "invitation"}>
      {signed && (
        <svg className="ink-leaves" aria-hidden="true" focusable="false" viewBox="0 0 600 400" preserveAspectRatio="none">
          <g className="ink-leaf far"><path d="M20 410 L265 -60 H640 V410 Z" /></g>
          <g className="ink-leaf middle"><path d="M20 410 L366 -60 H640 V410 Z" /></g>
          <g className="ink-leaf near"><path d="M20 410 L505 -60 H640 V410 Z" /></g>
        </svg>
      )}
      {signed && (
        <div className="container colophon" aria-hidden="true">
          <span>rick</span><span>_dev</span>
          <svg className="signature-stroke" viewBox="0 0 240 48" fill="none">
            <path pathLength="1" d="M3 36C53 31 122 11 152 12C174 13 134 34 148 34C165 32 190 20 202 22L235 22" />
          </svg>
        </div>
      )}
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
