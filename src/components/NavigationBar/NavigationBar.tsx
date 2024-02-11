import React, {Dispatch, SetStateAction, useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import {useGetProjects} from "../../hooks/useProjects";
import {AxiosClient} from "../../lib/AxiosClient";
import "./NavigationBar.css";

interface Props {
  isAdmin: boolean;
  setLoggedIn: Dispatch<SetStateAction<boolean>>;
}

const NavigationBar: React.FC<Props> = ({isAdmin, setLoggedIn}) => {
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
        <div className="create-issue-navigation-item">
          <Link to={`/${projectKey}/new`}>+</Link>
        </div>
      </div>

      <div className="right-section">
        <div className="cog" onClick={handleCogClick}>
          ⚙️
          {showDropdown && (
            <div className={`dropdown-content ${showDropdown ? "active" : ""}`}>
              <Link to="/" onClick={handlePasswordChange}>
                Change Password
              </Link>
              <Link to="/" onClick={handleLogout}>
                Logout
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavigationBar;
