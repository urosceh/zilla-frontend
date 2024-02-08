export interface IProjectDto {
  // "projectId": 1,
  //   "projectName": "Facebook",
  //   "projectKey": "FBK",
  //   "managerId": "a65a5856-6d27-44f5-945e-ec0c2348dc36",
  //   "createdAt": "2024-02-07T19:36:37.622Z",
  //   "updatedAt": "2024-02-07T19:36:37.622Z"
  projectId: number;
  projectName: string;
  projectKey: string;
  managerId: string;
  createdAt: string;
  updatedAt: string;
}

export class Project {
  private _projectId: number;
  private _projectName: string;
  private _projectKey: string;
  private _managerId: string;
  private _createdAt: string;
  private _updatedAt: string;

  constructor(project: IProjectDto) {
    if (
      !project ||
      !project.projectId ||
      !project.projectName ||
      !project.projectKey ||
      !project.managerId ||
      !project.createdAt ||
      !project.updatedAt
    ) {
    }

    this._projectId = project.projectId;
    this._projectName = project.projectName;
    this._projectKey = project.projectKey;
    this._managerId = project.managerId;
    this._createdAt = project.createdAt;
    this._updatedAt = project.updatedAt;
  }
}
