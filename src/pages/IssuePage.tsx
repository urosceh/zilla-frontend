import {useEffect, useState} from "react";
import {useParams} from "react-router";
import IssueComponent from "../components/IssueComponent/IssueComponent";
import ErrorModal from "../errors/ErrorModal/ErrorModal";
import {useGetIssue} from "../hooks/useIssue";

const IssuePage = () => {
  const params = useParams();
  const issueId = params.issueId as string;
  const projectKey = params.projectKey as string;

  const {issue, getIssue, isLoading} = useGetIssue();

  const [error, setError] = useState<string>("");
  useEffect(() => {
    getIssue({
      issueId,
      projectKey,
    }).catch((error) => {
      setError(`${error.message}: ${error.response?.data}`);
    });
  }, [issueId, projectKey]);

  return (
    <div>
      {error && <ErrorModal error={error} setError={setError} />}
      <div className="issue-page-container">
        {isLoading && <h2>Loading</h2>}
        {!isLoading && issue && <IssueComponent issue={issue} />}
      </div>
    </div>
  );
};

export default IssuePage;
