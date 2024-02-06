import {useEffect, useState} from "react";
import {AxiosClient} from "../lib/AxiosClient";

export const useIssue = () => {
  const axiosInstance = AxiosClient.getInstance();

  const [isLoading, setIsLoading] = useState(false);

  const createIssue = async () => {};
  const deleteIssue = async () => {};
  const updateIssue = async () => {};

  return {
    createIssue,
    deleteIssue,
    updateIssue,
  };
};

export const useGetIssue = () => {
  const axiosInstance = AxiosClient.getInstance();

  const [isLoading, setIsLoading] = useState(false);
  const [issue, setIssue] = useState(undefined);

  const getIssue = async ({issueId, projectKey}: {issueId: string; projectKey: string}) => {
    setIsLoading(true);
    const issue = await axiosInstance.getIssue(projectKey, issueId);

    setIssue(issue);
    setIsLoading(false);
  };

  return {
    getIssue,
    issue,
    isLoading,
  };
};
