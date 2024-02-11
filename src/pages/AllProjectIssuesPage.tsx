import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import FilterComponent from "../components/FilterComponent/FilterComponent";
import IssuesTable from "../components/IssuesTable/IssuesTable";
import {IIssueDto, IIssueSearchOptions} from "../entities/Issue";
import {useGetIssueStatuses} from "../hooks/useIssueStatus";
import {useGetAllIssues} from "../hooks/useIssues";
import {useGetSprints} from "../hooks/useSprint";
import {useUsers} from "../hooks/useUser";

const AllProjectsIssuesPage = () => {
  const params = useParams();
  const projectKey = params.projectKey as string;

  const [isLoading, setIsLoading] = useState(true);

  const [allIssues, setAllIssues] = useState<IIssueDto[]>([]);
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
  const [selectedReporters, setSelectedReporters] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedSprints, setSelectedSprints] = useState<number[]>([]);

  const {getAllIssues} = useGetAllIssues();
  const {sprints, getSprints} = useGetSprints(projectKey);
  const {issueStatuses, getIssueStatuses} = useGetIssueStatuses();
  const {users, getAllUsers} = useUsers();

  useEffect(() => {
    getSprints();
    getIssueStatuses();
    getAllUsers(projectKey);
    const options: IIssueSearchOptions = {
      asigneeIds: selectedAssignees,
      reporterIds: selectedReporters,
      issueStatuses: selectedStatuses,
      sprintIds: selectedSprints,
    };
    getAllIssues(projectKey, options).then((issues: IIssueDto[]) => {
      setAllIssues(issues);
      setIsLoading(false);
    });
  }, [selectedAssignees, selectedReporters, selectedStatuses, selectedSprints]);

  return (
    <div>
      {isLoading || !allIssues ? (
        <div>Loading...</div>
      ) : (
        <div>
          <div className="projects-list">
            <FilterComponent
              users={users}
              issueStatuses={issueStatuses}
              sprints={sprints}
              setters={{setSelectedAssignees, setSelectedReporters, setSelectedSprints, setSelectedStatuses}}
              getters={{selectedAssignees, selectedReporters, selectedSprints, selectedStatuses}}
            />
            <IssuesTable issues={allIssues} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AllProjectsIssuesPage;
