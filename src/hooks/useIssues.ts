import {useState} from "react";
import {AxiosClient} from "../lib/AxiosClient";

export const useGetAllIssues = () => {
  const axiosInstance = AxiosClient.getInstance();

  const [isLoading, setIsLoading] = useState(false);
  const [issues, setIssues] = useState(undefined);

  const getAllIssues = async (projectKey: string) => {
    try {
      setIsLoading(true);
      const issues = await axiosInstance.getAllProjectIssues(projectKey);

      setIssues(issues);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  return {
    getAllIssues,
    issues,
    isLoading,
  };
};

export const useGetSprintIssues = () => {
  const axiosInstance = AxiosClient.getInstance();

  const [isLoading, setIsLoading] = useState(false);
  const [issues, setIssues] = useState(undefined);

  const getSprintIssues = async (projectKey: string, sprintId?: number) => {
    try {
      setIsLoading(true);
      const issues = await axiosInstance.getCurrentSprintIssues(projectKey);

      setIssues(issues);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  return {
    getSprintIssues,
    issues,
    isLoading,
  };
};
