import Icon from "./Icon";
export default function ProjectVisual({ project, hero = false }) {
  return (
    <div
      className={`project-visual visual-${project} ${hero ? "hero-visual" : ""}`}
      aria-hidden="true"
    >
      <div className="browser-bar">
        <i />
        <i />
        <i />
        <span>
          {project === "nova"
            ? "nova street / new collection"
            : project === "os"
              ? "rick_dev / workspace"
              : "uma experiência feita com carinho"}
        </span>
        <b>
          <Icon />
        </b>
      </div>
      {project === "nova" ? (
        <div className="nova-preview">
          <div className="nova-nav">
            NØVA STREET <span>NEW DROP · 2026</span>
          </div>
          <div className="nova-art">
            <div className="shirt">
              <span>
                NØVA
                <br />
                <small>STREET ESSENTIALS</small>
              </span>
            </div>
            <div className="nova-title">
              <small>ESTILO URBANO. SEM RÓTULOS.</small>
              <strong>
                STREET
                <br />
                ESSENTIALS.
              </strong>
              <b>
                VER COLEÇÃO <Icon />
              </b>
            </div>
            <em>01 / 03</em>
          </div>
          <div className="nova-strip">
            NOVO DROP DISPONÍVEL <span>VISTA SUA PRÓPRIA HISTÓRIA.</span>
          </div>
        </div>
      ) : project === "os" ? (
        <div className="os-preview">
          <aside>
            R<span>◫</span>
            <span>◷</span>
            <span>▤</span>
          </aside>
          <div>
            <small>MEU ESPAÇO DIGITAL</small>
            <h3>Seu dia, organizado.</h3>
            <div className="os-stats">
              <b>
                Visão geral<span>Planeje. Organize. Evolua.</span>
              </b>
              <b>
                Foco<span>Um passo de cada vez.</span>
              </b>
            </div>
            <div className="os-chart">
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>
          </div>
        </div>
      ) : (
        <div className="rafaela-preview">
          <span>UM PEQUENO PRESENTE</span>
          <h3>
            Para Rafaela<span>♡</span>
          </h3>
          <p>
            Existem histórias que merecem
            <br />
            um lugar só delas.
          </p>
          <b>Abrir minha surpresa ♡</b>
          <i>✧</i>
        </div>
      )}
    </div>
  );
}
