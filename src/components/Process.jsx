const steps = [
  [
    "Entender",
    "Conversamos sobre seu negócio, seu objetivo e o que o site precisa resolver.",
  ],
  [
    "Definir",
    "Organizamos as páginas, os recursos, o escopo e uma proposta personalizada.",
  ],
  [
    "Construir",
    "O projeto ganha forma, com espaço para acompanhar e alinhar os detalhes.",
  ],
  [
    "Entregar",
    "Revisamos a experiência e combinamos a publicação e as orientações de uso.",
  ],
];
export default function Process() {
  return (
    <section className="section process">
      <div className="container">
        <div className="section-heading">
          <div>
            <span className="eyebrow">DO PRIMEIRO CONTATO À ENTREGA</span>
            <h2>
              Um processo claro.
              <br />
              Do início ao site no ar.
            </h2>
          </div>
          <p>
            Você entende cada etapa e acompanha
            <br className="desktop" /> as decisões do seu projeto.
          </p>
        </div>
        <div className="process-grid">
          {steps.map(([name, text], i) => (
            <article key={name}>
              <span>0{i + 1}</span>
              <h3>{name}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
