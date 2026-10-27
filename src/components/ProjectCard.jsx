import Icon from "./Icon";
import ProjectVisual from "./ProjectVisual";
export default function ProjectCard({ project }) {
  return (
    <article className="project-card">
      <ProjectVisual project={project.id} />
      <div className="project-info">
        <span className="eyebrow">{project.type}</span>
        <h3>{project.name}</h3>
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
          {project.url && (
            <a href={project.url} target="_blank" rel="noreferrer">
              Ver projeto{" "}
              <span aria-hidden="true">
                <Icon />
              </span>
            </a>
          )}
          <a href={project.repo} target="_blank" rel="noreferrer">
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
