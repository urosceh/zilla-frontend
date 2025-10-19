import React, {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";

interface TenantContextType {
  tenant: string | null;
  setTenant: (tenant: string) => void;
  getTenantFromPath: () => string | null;
  isValidTenant: (tenant: string) => boolean;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

interface TenantProviderProps {
  children: ReactNode;
}

export const TenantProvider: React.FC<TenantProviderProps> = ({children}) => {
  const [tenant, setTenantState] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const getTenantFromPath = (): string | null => {
    const pathParts = location.pathname.split("/").filter((part) => part !== "");
    // First path segment should be the tenant name
    return pathParts.length > 0 ? pathParts[0] : null;
  };

  const isValidTenant = (tenantName: string): boolean => {
    // Add your tenant validation logic here
    // For now, we'll accept any non-empty string that doesn't contain special characters
    return /^[a-zA-Z0-9-_]+$/.test(tenantName);
  };

  const setTenant = (newTenant: string) => {
    if (isValidTenant(newTenant)) {
      setTenantState(newTenant);
      // Don't store in localStorage - keep tenant purely URL-based
    }
  };

  useEffect(() => {
    const tenantFromPath = getTenantFromPath();

    if (tenantFromPath && isValidTenant(tenantFromPath)) {
      setTenantState(tenantFromPath);
    } else {
      setTenantState(null);
    }
  }, [location.pathname]);

  const contextValue: TenantContextType = {
    tenant,
    setTenant,
    getTenantFromPath,
    isValidTenant,
  };

  return <TenantContext.Provider value={contextValue}>{children}</TenantContext.Provider>;
};

export const useTenant = (): TenantContextType => {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error("useTenant must be used within a TenantProvider");
  }
  return context;
};
