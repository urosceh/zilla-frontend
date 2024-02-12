import {useState} from "react";
import {CreateSprint, ISprintDto} from "../entities/Sprint";
import {AxiosClient} from "../lib/AxiosClient";

export const useGetSprints: (projectKey: string) => {sprints: ISprintDto[]; getSprints: () => Promise<ISprintDto[]>; isLoading: boolean} = (
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

    return sprints;
  };

  return {
    getSprints,
    sprints,
    isLoading,
  };
};

export const useCreteSprint: () => {
  createSprint: (sprint: CreateSprint) => Promise<ISprintDto>;
} = () => {
  const axiosInstance = AxiosClient.getInstance();

  const createSprint = async (sprint: CreateSprint) => {
    const createdSprint = await axiosInstance.createSprint(sprint);
    return createdSprint;
  };

  return {
    createSprint,
  };
};
