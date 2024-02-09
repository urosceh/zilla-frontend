import {useState} from "react";
import {IUserDto} from "../../entities/User";
import "./FilterComponent.css";

const FilterComponent = (props: {users: IUserDto[]; issueStatuses: string[]; sprints: {sprintId: number; sprintName: string}[]}) => {
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
  const [selectedReporters, setSelectedReporters] = useState<string[]>([]);
  const [selectedSprints, setSelectedSprints] = useState<number[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  const handleFilterClick = (filterName: string) => {
    setOpenFilter((prevFilter) => (prevFilter === filterName ? null : filterName));
  };

  const handleAssigneeChange = (userId: string) => {
    setSelectedAssignees((prevSelected) =>
      prevSelected.includes(userId) ? prevSelected.filter((id) => id !== userId) : [...prevSelected, userId]
    );
  };

  const handleReporterChange = (userId: string) => {
    setSelectedReporters((prevSelected) =>
      prevSelected.includes(userId) ? prevSelected.filter((id) => id !== userId) : [...prevSelected, userId]
    );
  };

  const handleSprintChange = (sprintId: number) => {
    setSelectedSprints((prevSelected) =>
      prevSelected.includes(sprintId) ? prevSelected.filter((id) => id !== sprintId) : [...prevSelected, sprintId]
    );
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatuses((prevSelected) =>
      prevSelected.includes(status) ? prevSelected.filter((s) => s !== status) : [...prevSelected, status]
    );
  };

  return (
    <div className="filter-component">
      <div className="filter-dropdown">
        <label htmlFor="assignee" onClick={() => handleFilterClick("assignee")}>
          Assignee&nbsp;&nbsp;&nbsp;&nbsp;{openFilter === "assignee" ? "▲" : "▼"}
        </label>
        {openFilter === "assignee" && (
          <div className={`filter-dropdown-input ${openFilter === "assignee" ? "active" : ""}`}>
            {props.users.map((user) => (
              <label key={user.userId}>
                <input
                  type="checkbox"
                  value={user.userId}
                  checked={selectedAssignees.includes(user.userId)}
                  onChange={() => handleAssigneeChange(user.userId)}
                />
                {`${user.firstName} ${user.lastName} (${user.email})`}
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="filter-dropdown">
        <label htmlFor="reporter" onClick={() => handleFilterClick("reporter")}>
          Reporter&nbsp;&nbsp;&nbsp;&nbsp;{openFilter === "reporter" ? "▲" : "▼"}
        </label>
        {openFilter === "reporter" && (
          <div className={`filter-dropdown-input ${openFilter === "reporter" ? "active" : ""}`}>
            {props.users.map((user) => (
              <label key={user.userId}>
                <input
                  type="checkbox"
                  value={user.userId}
                  checked={selectedReporters.includes(user.userId)}
                  onChange={() => handleReporterChange(user.userId)}
                />
                {`${user.firstName} ${user.lastName} (${user.email})`}
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="filter-dropdown">
        <label htmlFor="sprint" onClick={() => handleFilterClick("sprint")}>
          Sprint&nbsp;&nbsp;&nbsp;&nbsp;{openFilter === "sprint" ? "▲" : "▼"}
        </label>
        {openFilter === "sprint" && (
          <div className={`filter-dropdown-input ${openFilter === "sprint" ? "active" : ""}`}>
            {props.sprints.map((sprint) => (
              <label key={sprint.sprintId}>
                <input
                  type="checkbox"
                  value={sprint.sprintId}
                  checked={selectedSprints.includes(sprint.sprintId)}
                  onChange={() => handleSprintChange(sprint.sprintId)}
                />
                {sprint.sprintName}
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="filter-dropdown">
        <label htmlFor="status" onClick={() => handleFilterClick("status")}>
          Status&nbsp;&nbsp;&nbsp;&nbsp;{openFilter === "status" ? "▲" : "▼"}
        </label>
        {openFilter === "status" && (
          <div className={`filter-dropdown-input ${openFilter === "status" ? "active" : ""}`}>
            {props.issueStatuses.map((status) => (
              <label key={status}>
                <input
                  type="checkbox"
                  value={status}
                  checked={selectedStatuses.includes(status)}
                  onChange={() => handleStatusChange(status)}
                />
                {status}
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterComponent;
