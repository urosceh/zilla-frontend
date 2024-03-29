import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import FilterComponent from "../components/FilterComponent/FilterComponent";
import IssuesTable from "../components/IssuesTable/IssuesTable";
import {IIssueDto, IIssueSearchOptions} from "../entities/Issue";
import ErrorModal from "../errors/ErrorModal/ErrorModal";
import {useGetIssueStatuses} from "../hooks/useIssueStatus";
import {useGetAllIssues} from "../hooks/useIssues";
import {useGetSprints} from "../hooks/useSprint";
import {useUsers} from "../hooks/useUser";

const AllProjectsIssuesPage = () => {
  const params = useParams();
  const projectKey = params.projectKey as string;

  const [page, setPage] = useState<number>(1);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
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

  const [error, setError] = useState<string>("");
  useEffect(() => {
    const limit = 10;
    const options: IIssueSearchOptions = {
      asigneeIds: selectedAssignees,
      reporterIds: selectedReporters,
      issueStatuses: selectedStatuses,
      sprintIds: selectedSprints,
      limit,
      offset: (page - 1) * limit,
    };

    Promise.all([getAllIssues(projectKey, options), getSprints(), getIssueStatuses(), getAllUsers(projectKey)])
      .then(([issues, sprints, issueStatuses, users]) => {
        setAllIssues(issues);
        if (issues.length > limit) {
          setHasNextPage(true);
        } else {
          setHasNextPage(false);
        }
        setIsLoading(false);
      })
      .catch((error: any) => {
        setError(`${error.message}: ${error.response?.data}`);
      });
  }, [selectedAssignees, selectedReporters, selectedStatuses, selectedSprints, page]);

  return (
    <div>
      {error && <ErrorModal error={error} setError={setError} />}
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
            <div className="pagination">
              {page > 1 && (
                <button className="previous" onClick={() => setPage(page - 1)}>
                  Prev
                </button>
              )}
              <span>{page}</span>
              {hasNextPage && (
                <button className="next" onClick={() => setPage(page + 1)}>
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllProjectsIssuesPage;
