import {useState} from "react";
import {AxiosClient} from "../lib/AxiosClient";

export const useGetProjects = () => {
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
