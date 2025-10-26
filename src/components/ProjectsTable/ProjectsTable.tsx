import React from "react";
import {Link} from "react-router-dom";
import {useTenant} from "../../contexts/TenantContext";
import {IProjectDto} from "../../entities/Project";
import "./ProjectsTable.css";

interface Props {
  projects: IProjectDto[];
}

const ProjectsTable: React.FC<Props> = ({projects}) => {
  const {tenant} = useTenant();

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
        {projects.map((project) => (
          <tr key={project.projectId} className="table-row">
            <td className="table-cell">
              <Link to={tenant ? `/${tenant}/${project.projectKey}/issues` : `/${project.projectKey}/issues`} className="project-link">
                {project.projectName}
              </Link>
            </td>
            <td className="table-cell">
              {project.isManager ? (
                <Link
                  to={tenant ? `/${tenant}/manager/${project.projectKey}/panel` : `/manager/${project.projectKey}/panel`}
                  className="manager-project-link"
                >
                  {project.projectKey}
                </Link>
              ) : (
                project.projectKey
              )}
            </td>
            <td className="table-cell">{`${project.manager.firstName} ${project.manager.lastName}`}</td>
            <td className="table-cell">{project.manager.email}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProjectsTable;
