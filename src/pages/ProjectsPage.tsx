import {useEffect, useState} from "react";
import ProjectsTable from "../components/ProjectsTable/ProjectsTable";
import SearchComponent from "../components/SearchComponent/SearchComponent";
import {IProjectDto} from "../entities/Project";
import ErrorModal from "../errors/ErrorModal/ErrorModal";
import {useGetProjects} from "../hooks/useProjects";

const ProjectsPage = () => {
  const {getProjects, isLoading} = useGetProjects();
  const [projects, setProjects] = useState<IProjectDto[]>();

  const [searchData, setSearchData] = useState("");

  const [error, setError] = useState<string>("");
  useEffect(() => {
    getProjects(searchData)
      .then((projects) => {
        setProjects(projects);
      })
      .catch((error) => {
        setError(`${error.message}: ${error.response?.data}`);
      });
    setSearchData(searchData);
  }, [searchData]);

  return (
    <div>
      {error && <ErrorModal error={error} setError={setError} />}
      {isLoading || !projects ? (
        <div>Loading...</div>
      ) : (
        <div>
          <div>
            <div className="search-filter">
              <SearchComponent setSearchData={setSearchData} searchData={searchData} />
            </div>
            <div className="projects-list">
              <ProjectsTable projects={projects} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
