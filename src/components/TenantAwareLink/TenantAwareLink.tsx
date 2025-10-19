import {Navigate} from "react-router-dom";
import {useTenant} from "../../contexts/TenantContext";

interface TenantAwareLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const TenantAwareLink: React.FC<TenantAwareLinkProps> = ({to, children, className, onClick}) => {
  const {tenant} = useTenant();

  // Prepend tenant to the path if not already included
  const finalPath = tenant && !to.startsWith(`/${tenant}`) && to !== "/login" && to !== "/forgotten-password" ? `/${tenant}${to}` : to;

  return (
    <a
      href={finalPath}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        if (onClick) onClick();
        window.location.href = finalPath;
      }}
    >
      {children}
    </a>
  );
};

// Hook to get tenant-aware paths
export const useTenantAwarePaths = () => {
  const {tenant} = useTenant();

  const buildPath = (path: string): string => {
    if (!tenant || path === "/login" || path === "/forgotten-password") {
      return path;
    }

    if (path.startsWith(`/${tenant}`)) {
      return path;
    }

    return `/${tenant}${path}`;
  };

  const navigateToTenantPath = (path: string) => {
    return <Navigate to={buildPath(path)} replace />;
  };

  return {
    buildPath,
    navigateToTenantPath,
    tenant,
  };
};
