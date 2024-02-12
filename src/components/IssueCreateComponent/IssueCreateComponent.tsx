import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {IIssueCreate} from "../../entities/Issue";
import {ISprintDto} from "../../entities/Sprint";
import {IUserDto} from "../../entities/User";
import ErrorModal from "../../errors/ErrorModal/ErrorModal";
import {useCreateIssue} from "../../hooks/useIssue";
import {useGetIssueStatuses} from "../../hooks/useIssueStatus";
import {useGetSprints} from "../../hooks/useSprint";
import {useUsers} from "../../hooks/useUser";
import "./IssueCreateComponent.css";

const IssueCreateComponent = () => {
  const params = useParams();
  const projectKey = params.projectKey as string;

  const [issueStatuses, setIssueStatuses] = useState<string[]>([]);
  const [sprints, setSprints] = useState<ISprintDto[]>([]);
  const [users, setUsers] = useState<IUserDto[]>([]);

  const undefinedSprint = {sprintId: "", sprintName: "No sprint"} as any;
  const undefinedAssignee = {userId: "", email: "No Assignee"} as any;

  const [selectedIssueStatus, setSelectedIssueStatus] = useState<string>();
  const [selectedAssignee, setSelectedAssignee] = useState<IUserDto>(undefinedAssignee);
  const [selectedSprint, setSelectedSprint] = useState<ISprintDto>(undefinedSprint);

  const [summary, setSummary] = useState<string>();
  const [details, setDetails] = useState<string>();

  const {getSprints} = useGetSprints(projectKey);
  const {getIssueStatuses} = useGetIssueStatuses();
  const {getAllUsers} = useUsers();

  const [error, setError] = useState<string>("");
  useEffect(() => {
    Promise.all([getSprints(), getIssueStatuses(), getAllUsers(projectKey)])
      .then(([sprints, issueStatuses, users]) => {
        setIssueStatuses(issueStatuses);
        setSelectedIssueStatus(issueStatuses[0]);
        setSprints(sprints);
        setUsers(users);
      })
      .catch((error: any) => {
        setError(error.message);
      });
  }, []);

  const handleIssueStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedIssueStatus(e.target.value);
  };

  const handleAssigneeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const assignee = users.find((user) => user.userId === e.target.value) || undefinedAssignee;
    setSelectedAssignee(assignee);
  };

  const handleSprintChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sprint = sprints.find((sprint) => sprint.sprintName === e.target.value) || undefinedSprint;
    setSelectedSprint(sprint);
  };

  const {createIssue} = useCreateIssue();
  const navigate = useNavigate();

  const handleCreateIssue = () => {
    if (!summary) {
      console.error("Summary is required");
      return;
    }
    const issue: IIssueCreate = {
      projectKey,
      issueStatus: selectedIssueStatus!,
      summary,
      assigneeId: selectedAssignee.userId || null,
      details: details || null,
      sprintId: selectedSprint.sprintId || null,
    };

    createIssue(issue).then(() => {
      navigate(`/${projectKey}/issues`);
    });
  };

  return (
    <div>
      {error && <ErrorModal error={error} setError={setError} />}
      <div className="issue-details">
        <div className="issue-left-section">
          <div className="issue-editable-container">
            <input
              type="text"
              id="summary-input"
              className={"summary"}
              value={summary}
              placeholder="Add summary..."
              onChange={(e) => setSummary(e.target.value)}
            />
          </div>
          <div className="issue-editable-container">
            <textarea
              className={"details"}
              id="details-textarea"
              value={details}
              placeholder="Add details..."
              onChange={(e) => setDetails(e.target.value)}
            />
          </div>
          <div className="create-issue-button">
            <button onClick={handleCreateIssue}>Create Issue</button>
          </div>
        </div>
        <div className="issue-right-section">
          <div className="issue-bordered-box">
            <p className="issue-label-dropdown">
              <span>Issue Status:</span>
              <select value={selectedIssueStatus} onChange={handleIssueStatusChange}>
                {issueStatuses.map((issueStatus) => (
                  <option key={issueStatus} value={issueStatus}>
                    {issueStatus}
                  </option>
                ))}
              </select>
            </p>
            <p className="issue-label-dropdown">
              <span>Assignee:</span>
              <select value={selectedAssignee.userId} onChange={handleAssigneeChange}>
                {[undefinedAssignee, ...users].map((user: IUserDto) => (
                  <option key={user.userId} value={user.userId}>
                    {user.email}
                  </option>
                ))}
              </select>
            </p>
            <p className="issue-label-dropdown">
              <span>Sprint:</span>
              <select value={selectedSprint?.sprintName || "No sprint"} onChange={handleSprintChange}>
                {[undefinedSprint, ...sprints].map((sprint) => (
                  <option key={sprint.sprintId} value={sprint.sprintName}>
                    {sprint.sprintName}
                  </option>
                ))}
              </select>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueCreateComponent;
