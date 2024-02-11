import {useState} from "react";
import {IUserDto, UserCreate} from "../entities/User";
import {AxiosClient} from "../lib/AxiosClient";

export const useUsers: () => {users: IUserDto[]; getAllUsers: (projectKey?: string) => Promise<IUserDto[]>; isLoading: boolean} = () => {
  const axiosInstance = AxiosClient.getInstance();

  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<IUserDto[]>([]);

  const getAllUsers = async (projectKey?: string): Promise<IUserDto[]> => {
    setIsLoading(true);
    const users = await axiosInstance.getAllUsers(projectKey);

    setUsers(users);
    setIsLoading(false);

    return users;
  };

  return {
    getAllUsers,
    users,
    isLoading,
  };
};

export const useCreateUsers: () => {createUsers: (users: UserCreate[]) => Promise<void>} = () => {
  const axiosInstance = AxiosClient.getInstance();

  const createUsers = async (users: UserCreate[]): Promise<void> => {
    await axiosInstance.createUsers(users);
  };

  return {
    createUsers,
  };
};
