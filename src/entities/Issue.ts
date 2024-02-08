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
}

export class Issue {
  public issueId: string;
  public projectKey: string;
  public reporter: IUserDto;
  public assignee: IUserDto | null | undefined;
  public issueStatus: string;
  public summary: string;
  public details: string | null;
  public createdAt: string;
  public updatedAt: string;

  constructor(issue: IIssueDto) {
    if (
      !issue ||
      !issue.issueId ||
      !issue.projectKey ||
      !issue.reporter ||
      !issue.issueStatus ||
      !issue.summary ||
      !issue.createdAt ||
      !issue.updatedAt
    ) {
      throw new Error("Invalid issue");
    }

    this.issueId = issue.issueId;
    this.projectKey = issue.projectKey;
    this.reporter = issue.reporter;
    this.assignee = issue.assignee;
    this.issueStatus = issue.issueStatus;
    this.summary = issue.summary;
    this.details = issue.details;
    this.createdAt = issue.createdAt;
    this.updatedAt = issue.updatedAt;
  }
}
