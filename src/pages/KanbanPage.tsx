import {useEffect} from "react";
import {useParams} from "react-router-dom";
import {useGetSprintIssues} from "../hooks/useIssues";

const KanbanPage = () => {
  // const [searchParams, setSearchParams] = useSearchParams();
  const params = useParams();
  const projectKey = params.projectKey as string;

  const {issues, getSprintIssues, isLoading} = useGetSprintIssues();

  useEffect(() => {
    getSprintIssues(projectKey);
  }, [projectKey]);

  return (
    <div>
      <h1>Kanban Page</h1>
      {isLoading && <h2>Loading</h2>}
      {!isLoading && issues && <h2>{JSON.stringify(issues)}</h2>}
    </div>
  );
};

export default KanbanPage;
