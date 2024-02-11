import {useEffect, useState} from "react";
import {DropResult, OnDragEndResponder} from "react-beautiful-dnd";
import {useParams} from "react-router-dom";
import KabnanBoard from "../components/KanbanBoard/KanbanBoard";
import {IIssueDto, IIssueUpdate} from "../entities/Issue";
import {IUserDto} from "../entities/User";
import {useUpdateIssue} from "../hooks/useIssue";
import {useGetIssueStatuses} from "../hooks/useIssueStatus";
import {useGetAllIssues} from "../hooks/useIssues";

const KanbanPage = () => {
  const params = useParams();
  const projectKey = params.projectKey as string;

  const [users, setUsers] = useState<IUserDto[]>([]);
  const [issues, setIssues] = useState<IIssueDto[]>([]);
  const [issueStatuses, setIssueStatuses] = useState<string[]>([]);

  const {getAllIssues} = useGetAllIssues();
  const {getIssueStatuses} = useGetIssueStatuses();

  useEffect(() => {
    getAllIssues(projectKey).then((issues) => {
      setIssues(issues);

      const uniqueUsers = issues.reduce<IUserDto[]>((acc, issue) => {
        if (issue.assignee && !acc.find((user) => user.userId === issue.assignee!.userId)) {
          acc.push(issue.assignee);
        }
        if (issue.reporter && !acc.find((user) => user.userId === issue.reporter!.userId)) {
          acc.push(issue.reporter);
        }
        return acc;
      }, []);
      setUsers(uniqueUsers.sort((a, b) => a.firstName!.localeCompare(b.firstName!)));

      getIssueStatuses().then((statuses) => {
        setIssueStatuses(statuses);
      });
    });
  }, [projectKey]);

  const {updateIssue} = useUpdateIssue();

  const onDragEnd: OnDragEndResponder = (result: DropResult) => {
    const {source, destination, draggableId} = result;
    if (!destination || source.droppableId === destination.droppableId) return;

    const [assigneeId, issueStatus] = destination.droppableId.split(":");
    const issue: IIssueUpdate = {
      issueId: draggableId,
      projectKey,
      assigneeId,
      issueStatus,
    };

    updateIssue(issue).then((issue) => {
      setIssues((issues) => {
        const newIssues = issues.map((i) => (i.issueId === issue.issueId ? issue : i));
        return newIssues;
      });
    });
  };

  return <KabnanBoard users={users} issues={issues} issueStatuses={issueStatuses} onDragEnd={onDragEnd} />;
};

export default KanbanPage;
