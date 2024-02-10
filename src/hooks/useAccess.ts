import {useState} from "react";
import {AxiosClient} from "../lib/AxiosClient";

export const useAccess: () => {
  giveAccess: (projectKey: string, userIds: string[]) => Promise<void>;
  removeAccess: (projectKey: string, userIds: string[]) => Promise<void>;
  isLoading: boolean;
} = () => {
  const axiosInstance = AxiosClient.getInstance();

  const [isLoading, setIsLoading] = useState(false);

  const giveAccess = async (projectKey: string, userIds: string[]): Promise<void> => {
    setIsLoading(true);
    await axiosInstance.giveAccess(projectKey, userIds);
    setIsLoading(false);
  };

  const removeAccess = async (projectKey: string, userIds: string[]): Promise<void> => {
    setIsLoading(true);
    await axiosInstance.removeAccess(projectKey, userIds);
    setIsLoading(false);
  };

  return {
    giveAccess,
    removeAccess,
    isLoading,
  };
};
