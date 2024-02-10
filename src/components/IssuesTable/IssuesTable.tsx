import React from "react";
import {Link} from "react-router-dom";
import {IIssueDto} from "../../entities/Issue";
import "./IssuesTable.css";

interface Props {
  issues: IIssueDto[];
}

const IssuesTable: React.FC<Props> = ({issues}) => {
  return (
    <table className="issue-table">
      <thead>
        <tr>
          <th className="assignee-column">Assignee</th>
          <th className="reporter-column">Reporter</th>
          <th className="created-column">Created</th>
          <th className="summary-column">Summary</th>
          <th className="status-column">Status</th>
        </tr>
      </thead>
      <tbody>
        {issues.map((issue) => (
          <tr key={issue.issueId} className="issue-row">
            <td className="assignee-cell">{issue.assignee ? issue.assignee.email : "-"}</td>
            <td className="reporter-cell">{issue.reporter.email}</td>
            <td className="created-cell">{issue.createdAt}</td>
            <td className="summary-cell">
              <Link to={`/${issue.projectKey}/${issue.issueId}`} className="summary-link">
                {issue.summary}
              </Link>
            </td>
            <td className="status-cell">{issue.issueStatus}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default IssuesTable;
