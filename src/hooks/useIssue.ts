import {useState} from "react";
import {IIssueDto} from "../entities/Issue";
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

export const useGetIssue = (): {
  issue: IIssueDto | null;
  getIssue: ({issueId, projectKey}: {issueId: string; projectKey: string}) => Promise<void>;
  isLoading: boolean;
} => {
  const axiosInstance = AxiosClient.getInstance();

  const [isLoading, setIsLoading] = useState(false);
  const [issue, setIssue] = useState<IIssueDto | null>(null);

  const getIssue = async ({issueId, projectKey}: {issueId: string; projectKey: string}) => {
    setIsLoading(true);
    const issue: IIssueDto = await axiosInstance.getIssue(projectKey, issueId);

    setIssue(issue);
    setIsLoading(false);
  };

  return {
    getIssue,
    issue,
    isLoading,
  };
};
