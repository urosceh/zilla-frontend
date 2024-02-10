import {useState} from "react";
import {AxiosClient} from "../lib/AxiosClient";

export const useGetIssueStatuses: () => {
  getIssueStatuses: () => Promise<string[]>;
  issueStatuses: string[];
  isLoading: boolean;
} = () => {
  const axiosInstance = AxiosClient.getInstance();

  const [isLoading, setIsLoading] = useState(false);
  const [issueStatuses, setIssueStatuses] = useState<string[]>([]);

  const getIssueStatuses = async (): Promise<string[]> => {
    setIsLoading(true);
    const issueStatuses = await axiosInstance.getIssueStatuses();

    setIssueStatuses(issueStatuses);
    setIsLoading(false);

    return issueStatuses;
  };

  return {
    getIssueStatuses,
    issueStatuses,
    isLoading,
  };
};
