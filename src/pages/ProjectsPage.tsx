import {useEffect} from "react";
import FilterToolbar from "../components/FilterToolbar";
import {useGetProjects} from "../hooks/useProjects";

const ProjectsPage = () => {
  // const filters = [
  //   {
  //     name: "Status",
  //     options: ["Open", "In Progress", "Done"],
  //     onChange: () => {},
  //   },
  //   {name: "Assignee", options: ["Me", "Unassigned"]},
  // ];
  const {projects, getProjects, isLoading} = useGetProjects();

  useEffect(() => {
    getProjects();
  }, []);

  return (
    <div>
      <FilterToolbar filters={[]} />
      {isLoading && <h2>Loading</h2>}
      {!isLoading && projects?.length && projects.map((project: any) => <h2 key={project.projectId}>{project.projectName}</h2>)}
    </div>
  );
};

export default ProjectsPage;
