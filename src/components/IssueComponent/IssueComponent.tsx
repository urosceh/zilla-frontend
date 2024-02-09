import {useState} from "react";
import {IIssueDto} from "../../entities/Issue";
import {IUserDto} from "../../entities/User";
import "./IssueComponent.css";
interface Props {
  issue: IIssueDto;
}

const IssueComponent: React.FC<Props> = ({issue}) => {
  const [isSummaryEditable, setIsSummaryEditable] = useState(false);
  const [isDetailsEditable, setIsDetailsEditable] = useState(false);
  const [isAssigneeEditable, setIsAssigneeEditable] = useState(false);
  const [isIssueStatusEditable, setIsIssueStatusEditable] = useState(false);
  const [isSprintEditable, setIsSprintEditable] = useState(false);

  const [selectedIssueStatus, setSelectedIssueStatus] = useState(issue.issueStatus);
  const [selectedAssignee, setSelectedAssignee] = useState<IUserDto>(issue.assignee || ({userId: null, email: "Undefined"} as any));
  const [selectedSprint, setSelectedSprint] = useState("Sprint 1"); // Replace with your actual sprint data

  const [summary, setSummary] = useState(issue.summary);
  const [details, setDetails] = useState(issue.details || "");

  const issueStatusOptions = ["Open", "In Progress", "Resolved", "Closed"];
  const sprintOptions = ["Sprint 1", "Sprint 2", "Sprint 3"]; // Replace with your actual sprint data
  const users = [
    {userId: "1", email: "john.doe@gmail.com", firstName: "John", lastName: "Doe"},
    {userId: "2", email: "jane.doe@gmail.com", firstName: "Jane", lastName: "Doe"},
    {userId: "3", email: "jo.doe@gmail.com", firstName: "Jo", lastName: "Doe"},
  ];

  const handleSummaryChange = () => {
    const doc: any = document.getElementById("summary-input");
    if (doc) {
      setSummary(doc.value);
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
  };

  const handleAssigneeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const assignee = users.find((user) => user.userId === e.target.value);
    setSelectedAssignee(assignee!);
    setIsAssigneeEditable(false);
  };

  const handleSprintChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSprint(e.target.value);
    setIsSprintEditable(false);
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
                &#x2714; {/* Checkmark Unicode character */}
              </button>
              <button className="issue-editable-button" onClick={handleSummaryCancel}>
                &#x2716; {/* Cross Unicode character */}
              </button>
            </div>
          )}
        </div>
        <div className="issue-editable-container">
          <textarea
            className={`details ${isDetailsEditable ? "editable" : ""}`}
            id="details-textarea"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            readOnly={!isDetailsEditable}
            onDoubleClick={() => setIsDetailsEditable(true)}
            onSubmit={handleDetailsChange}
          />
          {isDetailsEditable && (
            <div className="issue-editable-buttons">
              <button className="issue-editable-button" onClick={handleDetailsChange}>
                &#x2714; {/* Checkmark Unicode character */}
              </button>
              <button className="issue-editable-button" onClick={handleDetailsCancel}>
                &#x2716; {/* Cross Unicode character */}
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
                {issueStatusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
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
                {users.map((user: IUserDto) => (
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
              <select value={selectedSprint} onChange={handleSprintChange}>
                {sprintOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <span className="issue-label-dropdown-button" onDoubleClick={() => setIsSprintEditable(true)}>
                {selectedSprint}
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
