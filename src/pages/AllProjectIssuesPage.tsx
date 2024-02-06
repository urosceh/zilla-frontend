import {useEffect} from "react";
import {useParams} from "react-router-dom";
import {useGetAllIssues} from "../hooks/useIssues";

const AllProjectsIssuesPage = () => {
  const params = useParams();
  const projectKey = params.projectKey as string;

  const {issues, getAllIssues, isLoading} = useGetAllIssues();

  useEffect(() => {
    getAllIssues(projectKey);
  }, [projectKey]);

  return (
    <>
      {isLoading && <h2>Loading</h2>}
      {!isLoading && issues && <h2>{(issues as any).length}</h2>}
    </>
  );
};

export default AllProjectsIssuesPage;
