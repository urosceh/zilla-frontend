import {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {useGetProjects} from "../../hooks/useProjects";
import "./NavigationBar.css";

const NavigationBar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const params = useParams();
  const projectKey = params.projectKey as string;
  const {projects, getProjects} = useGetProjects();

  useEffect(() => {
    getProjects();
  }, []);

  const handleCogClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handlePasswordChange = () => {
    // Logic for handling password change
    console.log("Password change clicked");
  };

  return (
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
        {/* <div className="navigation-item">
          <Link to="/">Sprint</Link>
        </div> */}
        {/* <div className="navigation-item">
          create issue
        </div> */}
      </div>

      <div className="right-section">
        <div className="cog" onClick={handleCogClick}>
          ⚙️
          {showDropdown && (
            <div className={`dropdown-content ${showDropdown ? "active" : ""}`}>
              <Link to="/" onClick={handlePasswordChange}>
                Change Password
              </Link>
              <Link to="/logout">Logout</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavigationBar;
