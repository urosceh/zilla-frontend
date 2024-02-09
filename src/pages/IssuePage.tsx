import {useEffect} from "react";
import {useParams} from "react-router";
import IssueComponent from "../components/IssueComponent/IssueComponent";
import NavigationBar from "../components/NavigationBar/NavigationBar";
import {useGetIssue} from "../hooks/useIssue";

const IssuePage = () => {
  const params = useParams();
  const issueId = params.issueId as string;
  const projectKey = params.projectKey as string;

  const {issue, getIssue, isLoading} = useGetIssue();

  useEffect(() => {
    getIssue({
      issueId,
      projectKey,
    });
  }, [issueId, projectKey]);

  return (
    <div>
      <NavigationBar />
      <div className="issue-page-container">
        {isLoading && <h2>Loading</h2>}
        {!isLoading && issue && <IssueComponent issue={issue} />}
      </div>
    </div>
  );
};

export default IssuePage;
