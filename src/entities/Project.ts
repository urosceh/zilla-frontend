import {IUserDto} from "./User";

export interface IProjectDto {
  projectId: number;
  projectName: string;
  projectKey: string;
  manager: IUserDto;
  isManager: boolean;
  managerId: string;
  createdAt: string;
  updatedAt: string;
}

export type ProjectCreate = Pick<IProjectDto, "projectName" | "projectKey" | "managerId">;
