import axios, {AxiosInstance} from "axios";

export class AxiosClient {
  private static _instance: AxiosClient;
  private _client: AxiosInstance;

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

  public async login(email: string, password: string): Promise<void> {
    const response = await this._client.post("/user/login", {email, password});

    console.log(response);

    this._client.defaults.headers.common["Authorization"] = response.data.bearerToken;

    // save the token to cookie
    // document.cookie = `bearerToken=${response.data.bearerToken}; path=/`;
    localStorage.setItem("bearerToken", response.data.bearerToken);

    const projects = await this.getAllUserProjects();

    console.log(projects);
  }

  public async getAllUserProjects(): Promise<any> {
    try {
      const response = await this._client.get("/project/all", {
        headers: {
          ...this._client.defaults.headers.common,
          Authorization: localStorage.getItem("bearerToken"),
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
        Authorization: localStorage.getItem("bearerToken"),
      },
    });

    return response.data;
  }

  public async getAllProjectIssues(projectKey: string): Promise<any> {
    try {
      const response = await this._client.get(`issue/project/${projectKey}`, {
        headers: {
          ...this._client.defaults.headers.common,
          Authorization: localStorage.getItem("bearerToken"),
        },
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
          Authorization: localStorage.getItem("bearerToken"),
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
          Authorization: localStorage.getItem("bearerToken"),
        },
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
