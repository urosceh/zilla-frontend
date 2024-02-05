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

    const projects = await this.getAllUserProjects();

    console.log(projects);
  }

  public async getAllUserProjects(): Promise<any> {
    try {
      const response = await this._client.get("/project/all");

      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
}
