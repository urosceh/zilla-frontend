import axios, {AxiosInstance} from "axios";
import Cookies from "universal-cookie";
import {IIssueCreate, IIssueDto, IIssueSearchOptions, IIssueUpdate} from "../entities/Issue";
import {ProjectCreate} from "../entities/Project";
import {CreateSprint} from "../entities/Sprint";
import {IUserDto, UserCreate} from "../entities/User";
import {ClientCookies} from "./ClientCookies";

export class AxiosClient {
  private static _instance: AxiosClient;
  private _client: AxiosInstance;
  private _cookies: Cookies = ClientCookies.getCookies();

  private constructor() {
    this._client = axios.create({
      baseURL: "http://localhost:3000/api",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  public static getInstance(): AxiosClient {
    if (!this._instance) {
      this._instance = new AxiosClient();
    }

    return this._instance;
  }

  public static setCookies(cookies: Cookies): void {
    this._instance._cookies = cookies;
  }

  public async login(email: string, password: string): Promise<{bearerToken: string; adminBearerToken?: string}> {
    const response = await this._client.post("/user/login", {email, password});

    this._cookies.set("bearerToken", response.data.bearerToken, {path: "/"});

    return response.data;
  }

  public async logout(): Promise<void> {
    const cookie = this._cookies.get("bearerToken");
    await this._client.post("/user/logout", null, {
      headers: {
        ...this._client.defaults.headers.common,
        Authorization: this._cookies.get("bearerToken"),
      },
    });

    this._cookies.remove("bearerToken");
    this._cookies.remove("adminBearerToken");
  }

  public async sendPasswordResetEmail(email: string): Promise<void> {
    try {
      await this._client.post(
        "/user/forgotten-password",
        {email},
        {
          headers: {
            ...this._client.defaults.headers.common,
            Authorization: this._cookies.get("bearerToken"),
          },
        }
      );
    } catch (error) {
      throw error;
    }
  }

  public async resetPassword(data: {securityCode: string; newPassword: string}): Promise<void> {
    try {
      const body = {
        securityCode: data.securityCode,
        newPassword: data.newPassword,
      };

      await this._client.post("/user/set-forgotten-password", body);
    } catch (error) {
      throw error;
    }
  }

  public async getAllUsers(projectKey?: string): Promise<IUserDto[]> {
    try {
      const params = {
        limit: 50,
        offset: 0,
      };

      if (projectKey) {
        Object.assign(params, {projectKey});
      }

      const response = await this._client.get("/user/all", {
        headers: {
          ...this._client.defaults.headers.common,
          Authorization: this._cookies.get("bearerToken"),
        },
        params,
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async createUsers(usersForCreate: UserCreate[]): Promise<void> {
    try {
      const users = usersForCreate.map((u) => {
        return {
          email: u.email,
          firstName: u.firstName,
          lastName: u.lastName,
        };
      });

      await this._client.post(
        "/user/create-batch",
        {users},
        {
          headers: {
            ...this._client.defaults.headers.common,
            Authorization: this._cookies.get("bearerToken"),
          },
        }
      );
    } catch (error) {
      throw error;
    }
  }

  public async getAllUserProjects(): Promise<any> {
    try {
      const response = await this._client.get("/project/all", {
        headers: {
          ...this._client.defaults.headers.common,
          Authorization: this._cookies.get("bearerToken"),
        },
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async getIssue(projectKey: string, issueId: string): Promise<any> {
    const response = await this._client.get(`/issue/${issueId}`, {
      params: {projectKey},
      headers: {
        ...this._client.defaults.headers.common,
        Authorization: this._cookies.get("bearerToken"),
      },
    });

    return response.data;
  }

  public async createIssue(issue: IIssueCreate): Promise<string> {
    try {
      const response = await this._client.post("/issue", issue, {
        headers: {
          ...this._client.defaults.headers.common,
          Authorization: this._cookies.get("bearerToken"),
        },
      });

      return response.data.issueId;
    } catch (error) {
      throw error;
    }
  }

  public async updateIssue(issue: IIssueUpdate): Promise<IIssueDto> {
    try {
      const {issueId, projectKey, ...body} = issue;
      const response = await this._client.patch(`/issue/${issue.issueId}`, body, {
        headers: {
          ...this._client.defaults.headers.common,
          Authorization: this._cookies.get("bearerToken"),
        },
        params: {projectKey},
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async getAllProjectIssues(projectKey: string, options?: IIssueSearchOptions): Promise<IIssueDto[]> {
    try {
      const params = {
        orderCol: "updatedAt",
        orderDir: "DESC",
        limit: (options?.limit || 10) + 1,
        offset: options?.offset || 0,
        assigneeIds: options?.asigneeIds,
        reporterIds: options?.reporterIds,
        sprintIds: options?.sprintIds,
      };
      const response = await this._client.get(`issue/project/${projectKey}`, {
        headers: {
          ...this._client.defaults.headers.common,
          Authorization: this._cookies.get("bearerToken"),
        },
        params,
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async getCurrentSprintIssues(projectKey: string): Promise<any> {
    try {
      const response = await this._client.get(`sprint/${projectKey}/issues`, {
        headers: {
          ...this._client.defaults.headers.common,
          Authorization: this._cookies.get("bearerToken"),
        },
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async getProject(projectKey: string): Promise<any> {
    try {
      const response = await this._client.get(`/project/${projectKey}`, {
        headers: {
          ...this._client.defaults.headers.common,
          Authorization: this._cookies.get("bearerToken"),
        },
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async createProject(projectForCreate: ProjectCreate): Promise<any> {
    try {
      const project = {
        projectName: projectForCreate.projectName,
        projectKey: projectForCreate.projectKey,
        managerId: projectForCreate.managerId,
      };

      const response = await this._client.post("/project", project, {
        headers: {
          ...this._client.defaults.headers.common,
          Authorization: this._cookies.get("bearerToken"),
        },
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async getSprints(projectKey: string): Promise<any> {
    try {
      const response = await this._client.get(`/sprint/${projectKey}`, {
        headers: {
          ...this._client.defaults.headers.common,
          Authorization: this._cookies.get("bearerToken"),
        },
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async createSprint(sprint: CreateSprint): Promise<any> {
    try {
      const response = await this._client.post("/sprint", sprint, {
        headers: {
          ...this._client.defaults.headers.common,
          Authorization: this._cookies.get("bearerToken"),
        },
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async getIssueStatuses(): Promise<string[]> {
    try {
      const response = await this._client.get("/issue-status/", {
        headers: {
          ...this._client.defaults.headers.common,
          Authorization: this._cookies.get("bearerToken"),
        },
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async giveAccess(projectKey: string, userIds: string[]): Promise<void> {
    try {
      await this._client.post(
        "/access",
        {userIds, projectKey},
        {
          headers: {
            ...this._client.defaults.headers.common,
            Authorization: this._cookies.get("bearerToken"),
          },
        }
      );
    } catch (error) {
      throw error;
    }
  }

  public async removeAccess(projectKey: string, userIds: string[]): Promise<void> {
    try {
      await this._client.delete("/access", {
        headers: {
          ...this._client.defaults.headers.common,
          Authorization: this._cookies.get("bearerToken"),
        },
        data: {userIds, projectKey},
      });
    } catch (error) {
      throw error;
    }
  }
}
