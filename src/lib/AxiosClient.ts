import axios, {AxiosInstance} from "axios";
import Cookies from "universal-cookie";
import {BackendApiConfig} from "../config/backend.api.config";
import {IIssueCreate, IIssueDto, IIssueSearchOptions, IIssueUpdate} from "../entities/Issue";
import {ProjectCreate} from "../entities/Project";
import {CreateSprint} from "../entities/Sprint";
import {IUserDto, UserCreate} from "../entities/User";
import {ClientCookies} from "./ClientCookies";
import {handleTenantError} from "./TenantErrorHandler";

export class AxiosClient {
  private static _instance: AxiosClient;
  private _client: AxiosInstance;
  private _cookies: Cookies = ClientCookies.getCookies();

  private constructor() {
    this._client = axios.create({
      baseURL: BackendApiConfig.getBaseUrl(),
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Add request interceptor to automatically include tenant header
    this._client.interceptors.request.use((config) => {
      const tenant = this.getCurrentTenant();
      if (tenant) {
        config.headers.tenant = tenant;
      }
      return config;
    });

    // Add response interceptor to handle tenant errors globally
    this._client.interceptors.response.use(
      (response) => response,
      (error) => {
        // Handle tenant-related errors
        if (this.getCurrentTenant() && handleTenantError(error)) {
          return Promise.reject(new Error("Tenant error handled"));
        }
        return Promise.reject(error);
      }
    );
  }

  // Get current tenant from URL only (no localStorage in shared frontend)
  private getCurrentTenant(): string | null {
    // Get tenant from current URL path only
    const pathSegments = window.location.pathname.split("/").filter((segment) => segment !== "");
    if (pathSegments.length > 0 && this.isValidTenant(pathSegments[0])) {
      return pathSegments[0];
    }

    // No fallback - tenant must be in URL for shared frontend
    return null;
  }

  // Validate tenant name format
  private isValidTenant(tenant: string): boolean {
    return /^[a-zA-Z0-9-_]+$/.test(tenant);
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

  // Helper methods for tenant-scoped cookies
  private getBearerTokenKey(tenant?: string): string {
    const currentTenant = tenant || this.getCurrentTenant();
    return currentTenant ? `bearerToken_${currentTenant}` : "bearerToken";
  }

  private getAdminBearerTokenKey(tenant?: string): string {
    const currentTenant = tenant || this.getCurrentTenant();
    return currentTenant ? `adminBearerToken_${currentTenant}` : "adminBearerToken";
  }

  private getBearerToken(tenant?: string): string | undefined {
    return this._cookies.get(this.getBearerTokenKey(tenant));
  }

  // Helper to get authorization headers with tenant-scoped token
  private getAuthHeaders() {
    const currentTenant = this.getCurrentTenant();
    return {
      ...this._client.defaults.headers.common,
      Authorization: this.getBearerToken(currentTenant || undefined),
    };
  }

  public async health(): Promise<void> {
    await this._client.get("/health");
  }

  public async login(email: string, password: string): Promise<{bearerToken: string; adminBearerToken?: string}> {
    const response = await this._client.post("/user/login", {email, password});
    const currentTenant = this.getCurrentTenant();

    // Use tenant-scoped cookie names
    this._cookies.set(this.getBearerTokenKey(currentTenant || undefined), response.data.bearerToken, {path: "/"});

    if (response.data.adminBearerToken) {
      this._cookies.set(this.getAdminBearerTokenKey(currentTenant || undefined), response.data.adminBearerToken, {path: "/"});
    }

    return response.data;
  }

  public async logout(): Promise<void> {
    const currentTenant = this.getCurrentTenant();
    const bearerToken = this.getBearerToken(currentTenant || undefined);

    await this._client.post("/user/logout", null, {
      headers: {
        ...this._client.defaults.headers.common,
        Authorization: bearerToken,
      },
    });

    // Remove tenant-scoped cookies
    this._cookies.remove(this.getBearerTokenKey(currentTenant || undefined));
    this._cookies.remove(this.getAdminBearerTokenKey(currentTenant || undefined));
  }

  public async sendPasswordResetEmail(email: string): Promise<void> {
    try {
      await this._client.post(
        "/user/forgotten-password",
        {email},
        {
          headers: this.getAuthHeaders(),
        }
      );
    } catch (error) {
      throw error;
    }
  }

  public async changePassword(data: {oldPassword: string; newPassword: string}): Promise<void> {
    const body = {
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
    };

    await this._client.put("/user/password", body, {
      headers: this.getAuthHeaders(),
    });
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
        headers: this.getAuthHeaders(),
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
          headers: this.getAuthHeaders(),
        }
      );
    } catch (error) {
      throw error;
    }
  }

  public async getAllUserProjects(search?: string): Promise<any> {
    try {
      const params = search ? {search} : {};

      const response = await this._client.get("/project/all", {
        headers: this.getAuthHeaders(),
        params,
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async getIssue(projectKey: string, issueId: string): Promise<any> {
    const response = await this._client.get(`/issue/${issueId}`, {
      params: {projectKey},
      headers: this.getAuthHeaders(),
    });

    return response.data;
  }

  public async createIssue(issue: IIssueCreate): Promise<string> {
    try {
      const response = await this._client.post("/issue", issue, {
        headers: this.getAuthHeaders(),
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
        headers: this.getAuthHeaders(),
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
        headers: this.getAuthHeaders(),
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
        headers: this.getAuthHeaders(),
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async getProject(projectKey: string): Promise<any> {
    try {
      const response = await this._client.get(`/project/${projectKey}`, {
        headers: this.getAuthHeaders(),
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
        headers: this.getAuthHeaders(),
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async getSprints(projectKey: string): Promise<any> {
    try {
      const response = await this._client.get(`/sprint/${projectKey}`, {
        headers: this.getAuthHeaders(),
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async createSprint(sprint: CreateSprint): Promise<any> {
    try {
      const response = await this._client.post("/sprint", sprint, {
        headers: this.getAuthHeaders(),
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async getIssueStatuses(): Promise<string[]> {
    try {
      const response = await this._client.get("/issue-status/", {
        headers: this.getAuthHeaders(),
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
          headers: this.getAuthHeaders(),
        }
      );
    } catch (error) {
      throw error;
    }
  }

  public async removeAccess(projectKey: string, userIds: string[]): Promise<void> {
    try {
      await this._client.delete("/access", {
        headers: this.getAuthHeaders(),
        data: {userIds, projectKey},
      });
    } catch (error) {
      throw error;
    }
  }
}
