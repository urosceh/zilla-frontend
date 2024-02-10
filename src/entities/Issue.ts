import {IPaginatable} from "../interfaces/IPaginatable";
import {ISprintDto} from "./Sprint";
import {IUserDto} from "./User";

export interface IIssueDto {
  issueId: string;
  projectKey: string;
  reporter: IUserDto;
  assignee: IUserDto | null | undefined;
  issueStatus: string;
  summary: string;
  details: string | null;
  createdAt: string;
  updatedAt: string;
  sprint: ISprintDto | null;
}

export interface IIssueCreate {
  projectKey: string;
  issueStatus: string;
  summary: string;
  assigneeId: string | null;
  details: string | null;
  sprintId: number | null;
}

export interface IIssueUpdate {
  issueId: string;
  projectKey: string;
  issueStatus?: string;
  summary?: string;
  assigneeId?: string | null;
  details?: string | null;
  sprintId?: number | null;
}

export interface IIssueSearchOptions extends IPaginatable {
  asigneeIds?: string[];
  reporterIds?: string[];
  sprintIds?: number[];
  issueStatuses?: string[];
}
