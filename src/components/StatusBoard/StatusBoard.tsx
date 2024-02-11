import "./StatusBoard.css";

interface Props {
  issueStatuses: string[];
}

const StatusBoard: React.FC<Props> = ({issueStatuses}) => {
  return (
    <div className="statuses-board">
      {issueStatuses.map((issueStatus) => (
        <div key={issueStatus} className="status-card">
          <p className="status-name">{issueStatus}</p>
        </div>
      ))}
    </div>
  );
};

export default StatusBoard;
