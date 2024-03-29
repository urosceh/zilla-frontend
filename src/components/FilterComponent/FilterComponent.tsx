import React, {Dispatch, SetStateAction, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {ISprintDto} from "../../entities/Sprint";
import {IUserDto} from "../../entities/User";
import "./FilterComponent.css";

interface Props {
  users: IUserDto[];
  issueStatuses: string[];
  sprints: ISprintDto[];
  getters: {
    selectedAssignees: string[];
    selectedReporters: string[];
    selectedSprints: number[];
    selectedStatuses: string[];
  };
  setters: {
    setSelectedAssignees: Dispatch<SetStateAction<string[]>>;
    setSelectedReporters: Dispatch<SetStateAction<string[]>>;
    setSelectedSprints: Dispatch<SetStateAction<number[]>>;
    setSelectedStatuses: Dispatch<SetStateAction<string[]>>;
  };
}

const FilterComponent: React.FC<Props> = ({
  users,
  issueStatuses,
  sprints,
  setters: {setSelectedAssignees, setSelectedReporters, setSelectedSprints, setSelectedStatuses},
  getters: {selectedAssignees, selectedReporters, selectedSprints, selectedStatuses},
}) => {
  const params = useParams();
  const projectKey = params.projectKey as string;

  const [openFilter, setOpenFilter] = useState<string | null>(null);

  const orderedAssignees = [...users].sort((a, b) => {
    if (selectedAssignees.includes(a.userId) && selectedAssignees.includes(b.userId)) return 0;
    if (selectedAssignees.includes(a.userId)) return -1;
    if (selectedAssignees.includes(b.userId)) return 1;
    return 0;
  });
  const orderedReporters = [...users].sort((a, b) => {
    if (selectedReporters.includes(a.userId) && selectedReporters.includes(b.userId)) return 0;
    if (selectedReporters.includes(a.userId)) return -1;
    if (selectedReporters.includes(b.userId)) return 1;
    return 0;
  });
  const orderedSprints = [...sprints].sort((a, b) => {
    if (selectedSprints.includes(a.sprintId) && selectedSprints.includes(b.sprintId)) return 0;
    if (selectedSprints.includes(a.sprintId)) return -1;
    if (selectedSprints.includes(b.sprintId)) return 1;
    return 0;
  });
  const orderedStatuses = [...issueStatuses].sort((a, b) => {
    if (selectedStatuses.includes(a) && selectedStatuses.includes(b)) return 0;
    if (selectedStatuses.includes(a)) return -1;
    if (selectedStatuses.includes(b)) return 1;
    return 0;
  });

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
            {orderedAssignees.map((user) => (
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
            {orderedReporters.map((user) => (
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
            {orderedSprints.map((sprint) => (
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
            {orderedStatuses.map((status) => (
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

      <div className="create-issue-navigation-item">
        <Link to={`/${projectKey}/new`}>+</Link>
      </div>
    </div>
  );
};

export default FilterComponent;
