// Global error handler for tenant-related errors
export const handleTenantError = (error: any): boolean => {
  // Check if it's a 400 error related to invalid tenant
  if (error.response?.status === 400) {
    const errorMessage = error.response?.data?.message || error.response?.data || "";

    // Check if error is tenant-related
    if (
      typeof errorMessage === "string" &&
      (errorMessage.toLowerCase().includes("tenant") ||
        errorMessage.toLowerCase().includes("invalid tenant") ||
        errorMessage.toLowerCase().includes("no tenant configuration found for tenant id"))
    ) {
      // Redirect to tenant error page
      window.location.href = "/";
      return true; // Indicate error was handled
    }
  }

  return false; // Error not handled, let normal error handling proceed
};
