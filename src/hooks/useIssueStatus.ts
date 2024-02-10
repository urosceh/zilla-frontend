import {useState} from "react";
import {AxiosClient} from "../lib/AxiosClient";

export const useGetIssueStatuses = () => {
  const axiosInstance = AxiosClient.getInstance();

  const [isLoading, setIsLoading] = useState(false);
  const [issueStatuses, setIssueStatuses] = useState<string[]>([]);

  const getIssueStatuses = async () => {
    setIsLoading(true);
    const issueStatus = await axiosInstance.getIssueStatuses();

    setIssueStatuses(issueStatus);
    setIsLoading(false);
  };

  return {
    getIssueStatuses,
    issueStatuses,
    isLoading,
  };
};
