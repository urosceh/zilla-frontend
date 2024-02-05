import { useEffect } from "react";
import { useParams } from "react-router";
import { useGetIssue } from "../hooks/useIssue";

const IssuePage = () => {
  const params = useParams();
  const { issue, getIssue, isLoading } = useGetIssue();
  const issueId = params.issueId as string;
  const projectKey = params.projectKey as string;

  useEffect(() => {
    getIssue({
      issueId,
      projectKey,
    });
  }, [issueId, projectKey]);

  return (
    <>
      {isLoading && <h2>Loading</h2>}
      {!isLoading && issue && <h2>not</h2>}
    </>
  );
};

export default IssuePage;
