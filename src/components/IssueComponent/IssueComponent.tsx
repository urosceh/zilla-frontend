import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {IIssueDto, IIssueUpdate} from "../../entities/Issue";
import {ISprintDto} from "../../entities/Sprint";
import {IUserDto} from "../../entities/User";
import {useUpdateIssue} from "../../hooks/useIssue";
import {useGetIssueStatuses} from "../../hooks/useIssueStatus";
import {useGetSprints} from "../../hooks/useSprint";
import {useUsers} from "../../hooks/useUser";
import "./IssueComponent.css";
interface Props {
  issue: IIssueDto;
}

const IssueComponent: React.FC<Props> = ({issue}) => {
  const params = useParams();
  const projectKey = params.projectKey as string;
  const issueId = params.issueId as string;

  const undefinedSprint = {sprintId: "", sprintName: "No sprint"} as any;
  const undefinedAssignee = {userId: "", email: "No Assignee"} as any;

  const [isSummaryEditable, setIsSummaryEditable] = useState(false);
  const [isDetailsEditable, setIsDetailsEditable] = useState(false);
  const [isAssigneeEditable, setIsAssigneeEditable] = useState(false);
  const [isIssueStatusEditable, setIsIssueStatusEditable] = useState(false);
  const [isSprintEditable, setIsSprintEditable] = useState(false);

  const [selectedIssueStatus, setSelectedIssueStatus] = useState(issue.issueStatus);
  const [selectedAssignee, setSelectedAssignee] = useState<IUserDto>(issue.assignee || undefinedAssignee);
  const [selectedSprint, setSelectedSprint] = useState<ISprintDto>(issue.sprint || undefinedSprint);

  const [summary, setSummary] = useState(issue.summary);
  const [details, setDetails] = useState(issue.details || "");

  const {sprints, getSprints} = useGetSprints(projectKey);
  const {issueStatuses, getIssueStatuses} = useGetIssueStatuses();
  const {users, getAllUsers} = useUsers();
  const {updateIssue} = useUpdateIssue();

  useEffect(() => {
    getSprints();
    getIssueStatuses();
    getAllUsers(projectKey);
  }, [issueId, projectKey]);

  const updateIssueHandler = async (issueForUpdate: IIssueUpdate) => {
    const updatedIssue = await updateIssue(issueForUpdate);

    setSummary(updatedIssue.summary);
    setSelectedIssueStatus(updatedIssue.issueStatus);
    setDetails(updatedIssue.details || "");
    const assignee = users.find((user) => user.userId === updatedIssue.assignee?.userId);
    setSelectedAssignee(assignee || undefinedAssignee);
    const sprint = sprints.find((sprint) => sprint.sprintId === updatedIssue.sprint?.sprintId);
    setSelectedSprint(sprint || undefinedSprint);
    issue.updatedAt = updatedIssue.updatedAt;
  };

  const handleSummaryChange = () => {
    const doc: any = document.getElementById("summary-input");
    if (doc) {
      const newSummary = doc.value;
      if (newSummary === "") {
        // If summary is empty, set it to the previous value
        doc.value = issue.summary;
      }
      setSummary(newSummary);
      updateIssueHandler({issueId, projectKey, summary: newSummary}).catch((error) => {
        doc.value = issue.summary;
        console.log("Error: " + error);
      });
    }
    setIsSummaryEditable(false);
  };

  const handleSummaryCancel = () => {
    setSummary(issue.summary);
    setIsSummaryEditable(false);
  };

  const handleDetailsChange = () => {
    const doc: any = document.getElementById("details-textarea");
    if (doc) {
      setDetails(doc.value);
      updateIssueHandler({issueId, projectKey, details: doc.value}).catch((error) => {
        doc.value = issue.details;
        console.log("Error: " + error);
      });
    }
    setIsDetailsEditable(false);
  };

  const handleDetailsCancel = () => {
    setDetails(issue.details || "");
    setIsDetailsEditable(false);
  };

  const handleIssueStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedIssueStatus(e.target.value);
    setIsIssueStatusEditable(false);
    updateIssueHandler({issueId, projectKey, issueStatus: e.target.value}).catch((error) => {
      setSelectedIssueStatus(issue.issueStatus);
      console.log("Error: " + error);
    });
  };

  const handleAssigneeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const assignee = users.find((user) => user.userId === e.target.value) || undefinedAssignee;
    setSelectedAssignee(assignee);
    setIsAssigneeEditable(false);
    updateIssueHandler({issueId, projectKey, assigneeId: assignee.userId || null}).catch((error) => {
      setSelectedAssignee(issue.assignee || undefinedAssignee);
      console.log("Error: " + error);
    });
  };

  const handleSprintChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sprint = sprints.find((sprint) => sprint.sprintName === e.target.value) || undefinedSprint;
    setSelectedSprint(sprint);
    setIsSprintEditable(false);
    updateIssueHandler({issueId, projectKey, sprintId: sprint.sprintId || null}).catch((error) => {
      setSelectedSprint(issue.sprint || undefinedSprint);
      console.log("Error: " + error);
    });
  };

  return (
    <div className="issue-details">
      <div className="issue-left-section">
        <div className="issue-editable-container">
          <input
            type="text"
            id="summary-input"
            className={`summary ${isSummaryEditable ? "editable" : ""}`}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            readOnly={!isSummaryEditable}
            onDoubleClick={() => setIsSummaryEditable(true)}
          />
          {isSummaryEditable && (
            <div className="issue-editable-buttons">
              <button className="issue-editable-button" onClick={handleSummaryChange}>
                &#x2714;
              </button>
              <button className="issue-editable-button" onClick={handleSummaryCancel}>
                &#x2716;
              </button>
            </div>
          )}
        </div>
        <div className="issue-editable-container">
          <textarea
            className={`details ${isDetailsEditable ? "editable" : ""}`}
            id="details-textarea"
            value={details}
            placeholder="Add details..."
            onChange={(e) => setDetails(e.target.value)}
            readOnly={!isDetailsEditable}
            onDoubleClick={() => setIsDetailsEditable(true)}
            onSubmit={handleDetailsChange}
          />
          {isDetailsEditable && (
            <div className="issue-editable-buttons">
              <button className="issue-editable-button" onClick={handleDetailsChange}>
                &#x2714;
              </button>
              <button className="issue-editable-button" onClick={handleDetailsCancel}>
                &#x2716;
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="issue-right-section">
        <div className="issue-bordered-box">
          <p className="issue-label-dropdown">
            <span>Issue Status:</span>
            {isIssueStatusEditable ? (
              <select value={selectedIssueStatus} onChange={handleIssueStatusChange}>
                {issueStatuses.map((issueStatus) => (
                  <option key={issueStatus} value={issueStatus}>
                    {issueStatus}
                  </option>
                ))}
              </select>
            ) : (
              <span className="issue-label-dropdown-button" onDoubleClick={() => setIsIssueStatusEditable(true)}>
                {selectedIssueStatus}
              </span>
            )}
          </p>
          <p className="issue-label-dropdown">
            <span>Assignee:</span>
            {isAssigneeEditable ? (
              <select value={selectedAssignee.userId} onChange={handleAssigneeChange}>
                {[undefinedAssignee, ...users].map((user: IUserDto) => (
                  <option key={user.userId} value={user.userId}>
                    {user.email}
                  </option>
                ))}
              </select>
            ) : (
              <span className="issue-label-dropdown-button" onDoubleClick={() => setIsAssigneeEditable(true)}>
                {selectedAssignee.email}
              </span>
            )}
          </p>
          <p className="issue-label">
            <span>Reporter:</span>
            <span>{issue.reporter.email}</span>
          </p>
          <p className="issue-label-dropdown">
            <span>Sprint:</span>
            {isSprintEditable ? (
              <select value={selectedSprint?.sprintName || "No sprint"} onChange={handleSprintChange}>
                {[undefinedSprint, ...sprints].map((sprint) => (
                  <option key={sprint.sprintId} value={sprint.sprintName}>
                    {sprint.sprintName}
                  </option>
                ))}
              </select>
            ) : (
              <span className="issue-label-dropdown-button" onDoubleClick={() => setIsSprintEditable(true)}>
                {selectedSprint?.sprintName || "No sprint"}
              </span>
            )}
          </p>
          <div className="issue-label-timestamp">
            <p>
              <span>Created:</span> <span className="small-font">{issue.createdAt}</span>
            </p>
            <p>
              <span>Updated:</span> <span className="small-font">{issue.updatedAt}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueComponent;
