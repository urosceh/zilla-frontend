import {useEffect} from "react";
import {useParams} from "react-router-dom";
import FilterComponent from "../components/FilterComponent/FilterComponent";
import IssuesTable from "../components/IssuesTable/IssuesTable";
import NavigationBar from "../components/NavigationBar/NavigationBar";
import {useGetAllIssues} from "../hooks/useIssues";

const AllProjectsIssuesPage = () => {
  const params = useParams();
  const projectKey = params.projectKey as string;

  const {issues, getAllIssues, isLoading} = useGetAllIssues();

  useEffect(() => {
    getAllIssues(projectKey);
    // get all issue statuses
    // get all sprints
  }, [projectKey]);

  return (
    <div>
      {isLoading || !issues ? (
        <div>Loading...</div>
      ) : (
        <div>
          <NavigationBar />
          <div className="projects-list">
            <FilterComponent
              users={[{userId: "1", email: "pera@gmail.com", firstName: "Pera", lastName: "Peric"}]}
              issueStatuses={["Backlog", "Deployed", "Done"]}
              sprints={[
                {sprintName: "Sprint 1", sprintId: 1},
                {sprintName: "Sprint 2", sprintId: 2},
                {sprintName: "Sprint 3", sprintId: 3},
              ]}
            />
            <IssuesTable issues={issues} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AllProjectsIssuesPage;
