import { Link } from "react-router-dom";
import Icon from "./Icon";
import ProjectVisual from "./ProjectVisual";
import cover from "../assets/cases/nova-street-home.webp";

export default function ProjectCard({ project }) {
  return (
    <article className="project-card" data-scene="plate">
      {project.id === "nova" ? (
        <Link to={project.casePath} aria-label="Explorar a vitrine NØVA STREET">
          <img className="project-cover" src={cover} alt="Abertura da vitrine NØVA STREET" width="1200" height="760" loading="lazy" />
        </Link>
      ) : <ProjectVisual project={project.id} />}
      <div className="project-info">
        <span className="eyebrow">{project.type}</span>
        <h2>{project.name}</h2>
        <p>{project.description}</p>
        <div className="tags">
          {project.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <ul className="project-features">
          {project.features.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
        <div className="project-links">
          {project.casePath && (
            <Link to={project.casePath}>Ler o case <Icon /></Link>
          )}
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noreferrer"
              aria-label={`${project.casePath ? "Ver demonstração" : "Ver projeto"} de ${project.name}`}
            >
              {project.casePath ? "Ver demonstração" : "Ver projeto"}{" "}
              <span aria-hidden="true">
                <Icon />
              </span>
            </a>
          )}
          <a
            href={project.repo}
            target="_blank"
            rel="noreferrer"
            aria-label={`Código no GitHub de ${project.name}`}
          >
            Código no GitHub{" "}
            <span aria-hidden="true">
              <Icon />
            </span>
          </a>
        </div>
      </div>
    </article>
  );
}
