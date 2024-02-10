import React, {useState} from "react";
import {useParams} from "react-router-dom";
import {CreateSprint} from "../../entities/Sprint";
import {IUserDto} from "../../entities/User";
import {useAccess} from "../../hooks/useAccess";
import {useCreteSprint} from "../../hooks/useSprint";
import "./ManagerPanelComponent.css";

interface Props {
  projectUsers: IUserDto[];
  nonProjectUsers: IUserDto[];
}

const ManagerPanelComponent: React.FC<Props> = ({projectUsers, nonProjectUsers}) => {
  const params = useParams();
  const projectKey = params.projectKey as string;

  const [selectedNonProjectUsers, setSelectedNonProjectUsers] = useState<IUserDto[]>([]);
  const [selectedProjectUsers, setSelectedProjectUsers] = useState<IUserDto[]>([]);
  const [openFilter, setOpenFilter] = useState<string | null>(null);

  const handleFilterClick = (filter: string) => {
    setOpenFilter((prevFilter) => (prevFilter === filter ? null : filter));
  };

  const handleGiveAccessListChange = (user: IUserDto) => {
    setSelectedNonProjectUsers((prevUsers) => {
      console.log({prevUsers, user});
      if (prevUsers.map((u) => u.userId).includes(user.userId)) {
        return prevUsers.filter((u) => u.userId !== user.userId);
      }
      return [...prevUsers, user];
    });
  };

  const handleRemoveAccessListChange = (user: IUserDto) => {
    setSelectedProjectUsers((prevUsers) => {
      if (prevUsers.map((u) => u.userId).includes(user.userId)) {
        return prevUsers.filter((u) => u.userId !== user.userId);
      }
      return [...prevUsers, user];
    });
  };

  const {giveAccess, removeAccess} = useAccess();

  const handleGiveAccess = () => {
    giveAccess(
      projectKey,
      selectedNonProjectUsers.map((u) => u.userId)
    ).then(() => {
      window.location.reload();
    });
  };

  const handleRemoveAccess = () => {
    removeAccess(
      projectKey,
      selectedProjectUsers.map((u) => u.userId)
    ).then(() => {
      window.location.reload();
    });
  };

  const [sprintName, setSprintName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const {createSprint} = useCreteSprint();

  const handleCreateSprint = (e: any) => {
    e.preventDefault();
    const sprintName = e.target[0].value;
    const startOfSprint = e.target[1].value;
    const endOfSprint = e.target[2].value;

    if (!sprintName || !startOfSprint || !endOfSprint || startOfSprint > endOfSprint) {
      return;
    }

    const sprint: CreateSprint = {
      sprintName,
      projectKey,
      startOfSprint,
      endOfSprint,
    };

    createSprint(sprint).then(() => {
      e.target[0].value = "";
      e.target[1].value = "";
      e.target[2].value = "";
    });
  };

  return (
    <div className="manager-panel-container">
      <div className="access-management-container">
        <div className="giving-access">
          <div className="giving-access-select">
            <div className="access-dropdown">
              <label htmlFor="give" onClick={() => handleFilterClick("give")}>
                Non Project Users&nbsp;&nbsp;&nbsp;&nbsp;{openFilter === "give" ? "▲" : "▼"}
              </label>
              {openFilter === "give" && (
                <div className={`access-dropdown-input ${openFilter === "give" ? "active" : ""}`}>
                  {nonProjectUsers.map((user) => (
                    <label key={user.userId}>
                      <input
                        type="checkbox"
                        value={user.userId}
                        checked={selectedNonProjectUsers.map((u) => u.userId).includes(user.userId)}
                        onChange={() => handleGiveAccessListChange(user)}
                      />
                      {`${user.firstName} ${user.lastName} (${user.email})`}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="giving-access-list">
            <div className="giving-access-selected-users">
              {selectedNonProjectUsers.map((u) => {
                return <div key={u.userId}>{u.email}</div>;
              })}
            </div>
            <div className="giving-access-button">
              <button onClick={handleGiveAccess}>Give Access</button>
            </div>
          </div>
        </div>

        <div className="removing-access">
          <div className="removing-access-select">
            <div className="access-dropdown">
              <label htmlFor="remove" onClick={() => handleFilterClick("remove")}>
                Project Users&nbsp;&nbsp;&nbsp;&nbsp;{openFilter === "remove" ? "▲" : "▼"}
              </label>
              {openFilter === "remove" && (
                <div className={`access-dropdown-input ${openFilter === "remove" ? "active" : ""}`}>
                  {projectUsers.map((user) => (
                    <label key={user.userId}>
                      <input
                        type="checkbox"
                        value={user.userId}
                        checked={selectedProjectUsers.map((u) => u.userId).includes(user.userId)}
                        onChange={() => handleRemoveAccessListChange(user)}
                      />
                      {`${user.firstName} ${user.lastName} (${user.email})`}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="removing-access-list">
            <div className="removing-access-selected-users">
              {selectedProjectUsers.map((u) => {
                return <div key={u.userId}>{u.email}</div>;
              })}
            </div>
            <div className="removing-access-button">
              <button onClick={handleRemoveAccess}>Remove Access</button>
            </div>
          </div>
        </div>
      </div>

      <div className="create-sprint-container">
        <form onSubmit={handleCreateSprint}>
          <div className="create-sprint-input">
            <label htmlFor="sprintName">Sprint Name</label>
            <input
              type="text"
              id="sprintName"
              placeholder="Enter sprint name"
              value={sprintName}
              onChange={(e) => setSprintName(e.target.value)}
            />
          </div>
          <div className="create-sprint-input">
            <label htmlFor="startDate">Start Date</label>
            <input type="date" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div className="create-sprint-input">
            <label htmlFor="endDate">End Date</label>
            <input type="date" id="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
          <div className="create-sprint-button">
            <button type="submit">Create Sprint</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManagerPanelComponent;
