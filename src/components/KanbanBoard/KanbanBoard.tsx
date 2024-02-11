import React from "react";
import {DragDropContext, OnDragEndResponder} from "react-beautiful-dnd";
import {IIssueDto} from "../../entities/Issue";
import {IUserDto} from "../../entities/User";
import StatusBoard from "../StatusBoard/StatusBoard";
import UserBoard from "../UserBoard/UserBoard";
import "./KanbanBoard.css";

interface Props {
  users: IUserDto[];
  issues: IIssueDto[];
  issueStatuses: string[];
  onDragEnd: OnDragEndResponder;
}

export const KabnanBoard: React.FC<Props> = ({users, issues, issueStatuses, onDragEnd}) => {
  const allUsers = users.concat({userId: "", email: "", firstName: "Unassigned", lastName: ""});

  return (
    <div className="kanban-board">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="">
          <div className="">
            <div className="">
              <StatusBoard issueStatuses={issueStatuses} />
              <div className="users-board">
                {allUsers.map((user) => (
                  <UserBoard
                    key={user.userId}
                    user={user}
                    issues={issues.filter((issue) => issue.assignee?.userId === user.userId || (!issue.assignee && user.userId === ""))}
                    issueStatuses={issueStatuses}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </DragDropContext>
    </div>
  );
};

export default KabnanBoard;
