import {useState} from "react";
import {IIssueDto, IIssueSearchOptions} from "../entities/Issue";
import {AxiosClient} from "../lib/AxiosClient";

export const useGetAllIssues: () => {
  getAllIssues: (projectKey: string, options?: IIssueSearchOptions) => Promise<IIssueDto[]>;
  isLoading: boolean;
} = () => {
  const axiosInstance = AxiosClient.getInstance();

  const [isLoading, setIsLoading] = useState(false);

  const getAllIssues = async (projectKey: string, options?: IIssueSearchOptions) => {
    setIsLoading(true);
    const issues = await axiosInstance.getAllProjectIssues(projectKey, options);

    setIsLoading(false);
    return issues;
  };

  return {
    getAllIssues,
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
