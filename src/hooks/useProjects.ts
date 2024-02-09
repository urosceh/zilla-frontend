import {useState} from "react";
import {IProjectDto} from "../entities/Project";
import {AxiosClient} from "../lib/AxiosClient";

export const useGetProjects = (): {getProjects: () => Promise<void>; projects: IProjectDto[]; isLoading: boolean} => {
  const axiosInstance = AxiosClient.getInstance();

  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState([]);

  const getProjects = async () => {
    setIsLoading(true);
    const response = await axiosInstance.getAllUserProjects();

    setProjects(response);
    setIsLoading(false);
  };

  return {
    getProjects,
    projects,
    isLoading,
  };
};
