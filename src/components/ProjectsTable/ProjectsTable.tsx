import {Link} from "react-router-dom";
import {IProjectDto} from "../../entities/Project";
import "./ProjectsTable.css";

const ProjectsTable = (props: {projects: IProjectDto[]}) => {
  return (
    <table className="projects-table">
      <thead>
        <tr>
          <th className="table-header">Project Name</th>
          <th className="table-header">Project Key</th>
          <th className="table-header">Manager</th>
          <th className="table-header">Manager email</th>
        </tr>
      </thead>
      <tbody>
        {props.projects.map((project) => (
          <tr key={project.projectId} className="table-row">
            <td className="table-cell">
              <Link to={`/${project.projectKey}/issues`} className="project-link">
                {project.projectName}
              </Link>
            </td>
            <td className="table-cell">{project.projectKey}</td>
            <td className="table-cell">{`${project.manager.firstName} ${project.manager.lastName}`}</td>
            <td className="table-cell">{project.manager.email}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProjectsTable;
