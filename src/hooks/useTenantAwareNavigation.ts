import {useNavigate} from "react-router-dom";
import {useTenant} from "../contexts/TenantContext";

/**
 * Hook that provides tenant-aware navigation utilities
 */
export const useTenantAwareNavigation = () => {
  const {tenant} = useTenant();
  const navigate = useNavigate();

  /**
   * Navigate to a path within the current tenant context
   * @param path - The path to navigate to (without tenant prefix)
   * @param options - Navigation options
   */
  const navigateToTenantPath = (path: string, options?: {replace?: boolean}) => {
    if (!tenant) {
      console.error("No tenant context available for navigation");
      navigate("/login", options);
      return;
    }

    const fullPath = path.startsWith("/") ? `/${tenant}${path}` : `/${tenant}/${path}`;
    navigate(fullPath, options);
  };

  /**
   * Build a tenant-aware path without navigating
   * @param path - The path to build (without tenant prefix)
   * @returns The full tenant-aware path
   */
  const buildTenantPath = (path: string): string => {
    if (!tenant) {
      return path;
    }

    return path.startsWith("/") ? `/${tenant}${path}` : `/${tenant}/${path}`;
  };

  /**
   * Navigate to project-specific pages
   */
  const projectNavigation = {
    toProjects: () => navigateToTenantPath("/"),
    toProjectIssues: (projectKey: string) => navigateToTenantPath(`/${projectKey}/issues`),
    toCreateIssue: (projectKey: string) => navigateToTenantPath(`/${projectKey}/new`),
    toKanban: (projectKey: string) => navigateToTenantPath(`/${projectKey}/kanban`),
    toIssue: (projectKey: string, issueId: string) => navigateToTenantPath(`/${projectKey}/${issueId}`),
    toManagerPanel: (projectKey: string) => navigateToTenantPath(`/manager/${projectKey}/panel`),
  };

  /**
   * Navigate to admin pages
   */
  const adminNavigation = {
    toAdminPanel: () => navigateToTenantPath("/admin/panel"),
    toChangePassword: () => navigateToTenantPath("/change-password"),
  };

  return {
    tenant,
    navigateToTenantPath,
    buildTenantPath,
    projectNavigation,
    adminNavigation,
  };
};
