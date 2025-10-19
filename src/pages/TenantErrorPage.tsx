import React from "react";

interface TenantErrorPageProps {
  message: string;
}

const TenantErrorPage: React.FC<TenantErrorPageProps> = ({message}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <h1 style={{color: "#e74c3c", marginBottom: "20px"}}>Tenant Error</h1>
      <p style={{fontSize: "18px", color: "#666", marginBottom: "20px"}}>{message}</p>
      <div style={{fontSize: "14px", color: "#999"}}>Please check your URL and ensure you're accessing a valid tenant.</div>
    </div>
  );
};

export default TenantErrorPage;
