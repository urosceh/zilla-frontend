import {useState} from "react";
import {IIssueCreate, IIssueDto, IIssueUpdate} from "../entities/Issue";
import {AxiosClient} from "../lib/AxiosClient";

export const useCreateIssue: () => {
  issueId: string;
  createIssue: (createIssue: IIssueCreate) => Promise<void>;
  isLoading: boolean;
} = () => {
  const axiosInstance = AxiosClient.getInstance();

  const [issueId, setIssueId] = useState<string>(null as any);
  const [isLoading, setIsLoading] = useState(false);

  const createIssue = async (createIssue: IIssueCreate) => {
    setIsLoading(true);

    const issueId: string = await axiosInstance.createIssue(createIssue);

    setIssueId(issueId);
    setIsLoading(false);
  };

  return {
    issueId,
    createIssue,
    isLoading,
  };
};

export const useUpdateIssue: () => {
  updateIssue: (updateIssue: IIssueUpdate) => Promise<IIssueDto>;
  isLoading: boolean;
} = () => {
  const axiosInstance = AxiosClient.getInstance();
  const [isLoading, setIsLoading] = useState(false);

  const updateIssue = async (updateIssue: IIssueUpdate) => {
    setIsLoading(true);

    const issue: IIssueDto = await axiosInstance.updateIssue(updateIssue);

    setIsLoading(false);

    return issue;
  };

  return {
    updateIssue,
    isLoading,
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
