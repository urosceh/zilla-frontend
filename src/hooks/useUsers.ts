import {useState} from "react";
import {IUserDto} from "../entities/User";
import {AxiosClient} from "../lib/AxiosClient";

export const useUsers: () => {users: IUserDto[]; getAllUsers: (projectKey?: string) => Promise<void>; isLoading: boolean} = () => {
  const axiosInstance = AxiosClient.getInstance();

  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<IUserDto[]>([]);

  const getAllUsers = async (projectKey?: string) => {
    setIsLoading(true);
    const users = await axiosInstance.getAllUsers(projectKey);

    setUsers(users);
    setIsLoading(false);
  };

  return {
    getAllUsers,
    users,
    isLoading,
  };
};
