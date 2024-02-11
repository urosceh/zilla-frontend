import axios, {AxiosInstance} from "axios";
import {Cookies} from "react-cookie";
import {IIssueCreate, IIssueDto, IIssueSearchOptions, IIssueUpdate} from "../entities/Issue";
import {CreateSprint} from "../entities/Sprint";
import {IUserDto, UserCreate} from "../entities/User";

export class AxiosClient {
  private static _instance: AxiosClient;
  private _client: AxiosInstance;
  private _cookies: Cookies;

  private constructor() {
    this._client = axios.create({
      baseURL: "http://localhost:3000/api",
      headers: {
        "Content-Type": "application/json",
      },
    });

    this._cookies = new Cookies();
  }

  public static getInstance(): AxiosClient {
    if (!this._instance) {
      this._instance = new AxiosClient();
    }

    return this._instance;
  }

  public async login(email: string, password: string): Promise<{bearerToken: string; adminBearerToken?: string}> {
    const response = await this._client.post("/user/login", {email, password});

    // localStorage.setItem("bearerToken", response.data.bearerToken);
    this._cookies.set("bearerToken", response.data.bearerToken, {path: "/"});

    return response.data;
  }

  public async logout(): Promise<void> {
    await this._client.post("/user/logout", null, {
      headers: {
        ...this._client.defaults.headers.common,
        Authorization: this._cookies.get("bearerToken"),
      },
    });

    this._cookies.set("bearerToken", null);
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

      await this._client.post("/user/create-batch", usersForCreate, {
        headers: {
          ...this._client.defaults.headers.common,
          Authorization: this._cookies.get("bearerToken"),
        },
      });
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
      console.error(error);
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
