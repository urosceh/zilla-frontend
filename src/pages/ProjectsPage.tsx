import {useEffect, useState} from "react";
import NavigationBar from "../components/NavigationBar/NavigationBar";
import ProjectsTable from "../components/ProjectsTable/ProjectsTable";
import SearchComponent from "../components/SearchComponent/SearchComponent";
import {useGetProjects} from "../hooks/useProjects";

const ProjectsPage = () => {
  const {projects, getProjects, isLoading} = useGetProjects();

  const [searchData, setSearchData] = useState("");

  useEffect(() => {
    getProjects();
  }, [searchData]);

  return (
    <div>
      {isLoading || !projects ? (
        <div>Loading...</div>
      ) : (
        <div>
          <NavigationBar />
          <div className="search-filter">
            <SearchComponent setData={setSearchData} placeholder="Search Project Name or Key..." />
          </div>
          <div className="projects-list">
            <ProjectsTable projects={projects} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
