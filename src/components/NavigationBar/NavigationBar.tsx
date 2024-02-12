import React, {Dispatch, SetStateAction, useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {IProjectDto} from "../../entities/Project";
import ErrorModal from "../../errors/ErrorModal/ErrorModal";
import {useGetProjects} from "../../hooks/useProjects";
import {AxiosClient} from "../../lib/AxiosClient";
import "./NavigationBar.css";

interface Props {
  isAdmin: boolean;
  setLoggedIn: Dispatch<SetStateAction<boolean>>;
}

const NavigationBar: React.FC<Props> = ({isAdmin, setLoggedIn}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [projects, setProjects] = useState<IProjectDto[]>([]);

  const {getProjects} = useGetProjects();

  const [error, setError] = useState<string>("");
  useEffect(() => {
    getProjects()
      .then((projects) => {
        setProjects(projects);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, []);

  const handleCogClick = () => {
    setShowDropdown(!showDropdown);
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    AxiosClient.getInstance()
      .logout()
      .then(() => {
        setLoggedIn(false);
        navigate("/login");
      });
  };

  return (
    <div>
      {error && <ErrorModal error={error} setError={setError} />}
      <div className="navigation-bar">
        <div className="left-section">
          <div className="dropdown navigation-item">
            <Link className="dropdown-button" to="/">
              Projects
            </Link>
            <div className="dropdown-content">
              {projects.map((project) => (
                <Link key={project.projectId} to={`/${project.projectKey}/issues`}>
                  {project.projectName}
                </Link>
              ))}
            </div>
          </div>

          <div className="dropdown navigation-item">
            <div className="dropdown-button">Kanbans</div>
            <div className="dropdown-content">
              {projects.map((project) => (
                <Link key={project.projectId} to={`/${project.projectKey}/kanban`}>
                  {project.projectName}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="right-section">
          <div className="cog" onClick={handleCogClick}>
            ⚙️
            {showDropdown && (
              <div className={`dropdown-content ${showDropdown ? "active" : ""}`}>
                <Link to="/change-password">Change Password</Link>
                <Link to="/" onClick={handleLogout}>
                  Logout
                </Link>
                {isAdmin && <Link to="/admin/panel">Admin Panel</Link>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavigationBar;
