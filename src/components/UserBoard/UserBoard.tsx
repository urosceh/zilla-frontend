import {Droppable} from "react-beautiful-dnd";
import {IIssueDto} from "../../entities/Issue";
import {IUserDto} from "../../entities/User";
import Card from "../Card/Card";
import "./UserBoard.css";

interface Props {
  user: IUserDto;
  issues: IIssueDto[];
  issueStatuses: string[];
}

const UserBoard: React.FC<Props> = ({user, issues, issueStatuses}) => {
  return (
    <div>
      <div className="user-name">
        <p>
          {user.firstName} {user.lastName} {user.email ? `(${user.email})` : ""}
        </p>
      </div>
      <div className="user-board">
        {issueStatuses.map((status) => {
          const statusIssues = issues.filter((issue) => issue.issueStatus === status);
          return (
            <Droppable droppableId={`${user.userId}:${status}`} key={status}>
              {(provided) => (
                <div className="user-status-cards" ref={provided.innerRef} {...provided.droppableProps}>
                  {statusIssues.map((issue, index) => (
                    <Card key={issue.issueId} issue={issue} index={index} />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          );
        })}
      </div>
    </div>
  );
};

export default UserBoard;
