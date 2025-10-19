import {useTenant} from "../contexts/TenantContext";

// AxiosClient gets tenant dynamically from URL
export const useTenantSync = () => {
  const {tenant} = useTenant();

  return tenant;
};
