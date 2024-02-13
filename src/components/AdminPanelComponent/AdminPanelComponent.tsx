import React, {useState} from "react";
import {IUserDto, UserCreate} from "../../entities/User";
import ErrorModal from "../../errors/ErrorModal/ErrorModal";
import {useCreateProject} from "../../hooks/useProject";
import {useCreateUsers} from "../../hooks/useUser";
import {AxiosClient} from "../../lib/AxiosClient";
import "./AdminPanelComponent.css";

interface Props {
  allUsers: IUserDto[];
}

const AdminPanelComponent: React.FC<Props> = ({allUsers}) => {
  const undefinedUser = {userId: "", email: "No Manager"} as any;
  const [selectedManager, setSelectedManager] = useState<IUserDto>();
  const [projectName, setProjectName] = useState<string>();
  const [projectKey, setProjectKey] = useState<string>();

  const [openFilter, setOpenFilter] = useState<string | null>(null);

  const [selectedUsers, setSelectedUsers] = useState<IUserDto[]>([]);

  const handleFilterClick = (filter: string) => {
    setOpenFilter((prevFilter) => (prevFilter === filter ? null : filter));
  };

  const handleSelectedUsersListChanged = (user: IUserDto) => {
    setSelectedUsers((prevUsers) => {
      console.log({prevUsers, user});
      if (prevUsers.map((u) => u.userId).includes(user.userId)) {
        return prevUsers.filter((u) => u.userId !== user.userId);
      }
      return [...prevUsers, user];
    });
  };

  const [error, setError] = useState<string>("");

  const handleSendForgottenPasswordEmail = () => {
    const axiosInstance = AxiosClient.getInstance();
    selectedUsers.forEach((user) => {
      axiosInstance
        .sendPasswordResetEmail(user.email)
        .then(() => {
          setSelectedUsers(selectedUsers.filter((u) => u.userId !== user.userId));
        })
        .catch((error) => {
          setError(`${error.message}: ${error.response?.data}`);
        });
    });
  };

  const {createProject} = useCreateProject();

  const handleCreateProject = (e: any) => {
    e.preventDefault();
    if (projectName && projectKey && selectedManager?.userId) {
      createProject({projectName, projectKey, managerId: selectedManager.userId})
        .then(() => {
          setProjectName("");
          setProjectKey("");
          setSelectedManager(undefinedUser);
        })
        .catch((error) => {
          setError(`${error.message}: ${error.response?.data}`);
        });
    } else {
      let errMsg = "";
      !projectName && (errMsg += "Project Name must be defined\n");
      !projectKey && (errMsg += "Project Key must be defined\n");
      !selectedManager?.userId && (errMsg += "Project Manager must be defined\n");
      setError(errMsg);
    }
  };

  const handleManagerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const manager = allUsers.find((user) => user.userId === e.target.value) || undefinedUser;
    setSelectedManager(manager);
  };

  const {createUsers} = useCreateUsers();

  const handleCreateUser = (e: any) => {
    e.preventDefault();
    if (userEmail && userFirstName && userLasstName) {
      const user: UserCreate = {
        email: userEmail,
        firstName: userFirstName,
        lastName: userLasstName,
      };

      createUsers([user])
        .then(() => {
          setUserEmail("");
          setUserFirstName("");
          setUserLasstName("");
        })
        .catch((error) => {
          setError(`${error.message}: ${error.response?.data}`);
        });
    }
  };

  const [userEmail, setUserEmail] = useState<string>();
  const [userFirstName, setUserFirstName] = useState<string>();
  const [userLasstName, setUserLasstName] = useState<string>();

  return (
    <div>
      {error && <ErrorModal error={error} setError={setError} />}
      <div className="admin-panel-container">
        <div className="sending-forgotten-email">
          <div className="sending-forgotten-email-select">
            <div className="users-dropdown">
              <label htmlFor="open" onClick={() => handleFilterClick("open")}>
                Forgotten Email Users&nbsp;&nbsp;&nbsp;&nbsp;{openFilter === "open" ? "▲" : "▼"}
              </label>
              {openFilter === "open" && (
                <div className={`users-dropdown-input ${openFilter === "open" ? "active" : ""}`}>
                  {allUsers.map((user) => (
                    <label key={user.userId}>
                      <input
                        type="checkbox"
                        value={user.userId}
                        checked={selectedUsers.map((u) => u.userId).includes(user.userId)}
                        onChange={() => handleSelectedUsersListChanged(user)}
                      />
                      {`${user.firstName} ${user.lastName} (${user.email})`}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="sending-forgotten-email-list">
            <div className="sending-forgotten-email-selected-users">
              {selectedUsers.map((u) => {
                return <div key={u.userId}>{u.email}</div>;
              })}
            </div>
            <div className="sending-forgotten-email-button">
              <button onClick={handleSendForgottenPasswordEmail}>Send Email</button>
            </div>
          </div>
        </div>

        <div className="create-project-container">
          <form onSubmit={handleCreateProject}>
            <div className="create-project-input">
              <label className="create-project-input-label" htmlFor="projectName">
                Project Name
              </label>
              <input
                type="text"
                id="projectName"
                placeholder="Enter project name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </div>
            <div className="create-project-input">
              <label className="create-project-input-label" htmlFor="projectKey">
                Project Key
              </label>
              <input
                type="text"
                id="projectKey"
                placeholder="Enter project key"
                value={projectKey}
                onChange={(e) => setProjectKey(e.target.value)}
              />
            </div>
            <div className="create-project-input">
              <label className="create-project-input-label" htmlFor="projectManager">
                Project Manager
              </label>
              <select className="" value={selectedManager?.userId} onChange={handleManagerChange}>
                {[undefinedUser, ...allUsers].map((user: IUserDto) => (
                  <option key={user.userId} value={user.userId}>
                    {user.email}
                  </option>
                ))}
              </select>
            </div>

            <div className="create-project-button">
              <button type="submit">Create Project</button>
            </div>
          </form>
        </div>

        <div className="create-user-container">
          <form onSubmit={handleCreateUser}>
            <div className="create-user-input">
              <label className="create-user-input-label" htmlFor="userEmail">
                User Email
              </label>
              <input
                type="text"
                id="userEmail"
                placeholder="Enter user email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
              />
            </div>
            <div className="create-user-input">
              <label className="create-user-input-label" htmlFor="userFirstName">
                User Name
              </label>
              <input
                type="text"
                id="userFirstName"
                placeholder="Enter user name"
                value={userFirstName}
                onChange={(e) => setUserFirstName(e.target.value)}
              />
            </div>
            <div className="create-user-input">
              <label className="create-user-input-label" htmlFor="userLasstName">
                User Surname
              </label>
              <input
                type="text"
                id="userLasstName"
                placeholder="Enter user name"
                value={userLasstName}
                onChange={(e) => setUserLasstName(e.target.value)}
              />
            </div>

            <div className="create-user-button">
              <button type="submit">Create User</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminPanelComponent;
