import {useState} from "react";
import {ISprintDto} from "../entities/Sprint";
import {AxiosClient} from "../lib/AxiosClient";

export const useGetSprints: (projectKey: string) => {sprints: ISprintDto[]; getSprints: () => Promise<void>; isLoading: boolean} = (
  projectKey: string
) => {
  const axiosInstance = AxiosClient.getInstance();

  const [isLoading, setIsLoading] = useState(false);
  const [sprints, setSprints] = useState<ISprintDto[]>([]);

  const getSprints = async () => {
    setIsLoading(true);
    const sprints = await axiosInstance.getSprints(projectKey);

    setSprints(sprints);
    setIsLoading(false);
  };

  return {
    getSprints,
    sprints,
    isLoading,
  };
};
