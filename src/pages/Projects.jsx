import { useState } from "react";
import { projects } from "../data/projects";
import ProjectCard from "../components/ProjectCard";
import CTA from "../components/CTA";
export default function Projects() {
  const [filter, setFilter] = useState("all");
  const visible = projects.filter((p) => filter === "all" || p.kind === filter);
  return (
    <>
      <section className="page-intro container">
        <span className="eyebrow">PROJETOS / IDEIAS EM PRÁTICA</span>
        <h1>
          Cada projeto,
          <br />
          <em>uma proposta.</em>
        </h1>
        <p>
          Um olhar sobre interfaces, experiências e código. Os projetos abaixo
          são pessoais ou demonstrativos, com contextos e objetivos próprios.
        </p>
      </section>
      <section className="container projects-section">
        <div className="project-filters" aria-label="Filtrar projetos">
          {[
            ["all", "Todos os projetos"],
            ["demo", "Demonstrativos"],
            ["personal", "Pessoais"],
          ].map(([key, label]) => (
            <button
              key={key}
              aria-pressed={filter === key}
              onClick={() => setFilter(key)}
            >
              {label}
            </button>
          ))}
          <span aria-live="polite">
            {visible.length} projeto{visible.length !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="project-list">
          {visible.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
        <p className="project-disclaimer">
          As imagens dos cards são representações visuais dos projetos. No case
          NØVA STREET, compras, frete e checkout são demonstrativos, sem
          pagamentos reais.
        </p>
      </section>
      <CTA />
    </>
  );
}
