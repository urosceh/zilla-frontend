import {useEffect, useState} from "react";
import ProjectsTable from "../components/ProjectsTable/ProjectsTable";
import SearchComponent from "../components/SearchComponent/SearchComponent";
import {useGetProjects} from "../hooks/useProjects";

const ProjectsPage = () => {
  const {projects, getProjects, isLoading} = useGetProjects();

  const [searchData, setSearchData] = useState("");

  useEffect(() => {
    getProjects().then((projects) => {
      console.log(projects);
    });
  }, [searchData]);

  return (
    <div>
      {isLoading || !projects ? (
        <div>Loading...</div>
      ) : (
        <div>
          <div>
            <div className="search-filter">
              <SearchComponent setData={setSearchData} placeholder="Search Project Name or Key..." />
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
