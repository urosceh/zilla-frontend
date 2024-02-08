import {useState} from "react";
import {AxiosClient} from "../lib/AxiosClient";

export const useGetProject = () => {
  const axiosInstance = AxiosClient.getInstance();

  const [isLoading, setIsLoading] = useState(false);
  const [project, setProject] = useState(undefined);

  const getProject = async (projectKey: string) => {
    setIsLoading(true);
    const project = await axiosInstance.getProject(projectKey);

    setProject(project);
    setIsLoading(false);
  };

  return {
    getProject,
    project,
    isLoading,
  };
};
