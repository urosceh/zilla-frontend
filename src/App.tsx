import React, {useEffect, useState} from "react";
import {BrowserRouter, Navigate, Route, Routes, useParams} from "react-router-dom";
import "./App.css";
import NavigationBar from "./components/NavigationBar/NavigationBar";
import {TenantProvider, useTenant} from "./contexts/TenantContext";
import {useTenantSync} from "./hooks/useTenantSync";
import {ClientCookies} from "./lib/ClientCookies";
import AdminPage from "./pages/AdminPage";
import AllProjectsIssuesPage from "./pages/AllProjectIssuesPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import CreateIssuePage from "./pages/CreateIssuePage";
import ForgottenPasswordPage from "./pages/ForgottenPasswordPage";
import IssuePage from "./pages/IssuePage";
import KanbanPage from "./pages/KanbanPage";
import LoginPage from "./pages/LoginPage";
import ManagerPage from "./pages/ManagerPage";
import ProjectsPage from "./pages/ProjectsPage";
import TenantErrorPage from "./pages/TenantErrorPage";

// Component to redirect to tenant-specific login
const TenantLoginRedirect: React.FC = () => {
  const {tenant} = useParams<{tenant: string}>();
  return <Navigate to={`/${tenant}/login`} replace />;
};

// Component to show error when no tenant is provided
const NoTenantError: React.FC = () => {
  return <TenantErrorPage message="Valid tenant must be provided in the URL path." />;
};

// Main App component with TenantProvider
const AppContent: React.FC = () => {
  const cookies = ClientCookies.getCookies();
  const [loggedIn, setLoggedIn] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const {tenant} = useTenant();

  // Sync tenant with AxiosClient
  useTenantSync();

  useEffect(() => {
    const bearerToken = cookies.get("bearerToken");
    if (!bearerToken) {
      setLoggedIn(false);
    } else {
      setLoggedIn(true);
    }

    const adminBearerToken = cookies.get("adminBearerToken");
    if (adminBearerToken) {
      setIsAdmin(true);
    }
  }, []);

  return (
    <>
      {loggedIn && <NavigationBar isAdmin={isAdmin} setLoggedIn={setLoggedIn} />}
      <Routes>
        {/* Tenant-scoped authentication routes */}
        <Route
          path="/:tenant/login"
          element={
            !loggedIn ? (
              <LoginPage setLoggedIn={setLoggedIn} setIsAdmin={setIsAdmin} cookies={cookies} />
            ) : (
              <Navigate to={tenant ? `/${tenant}` : "/"} />
            )
          }
        />
        <Route
          path="/:tenant/forgotten-password"
          element={!loggedIn ? <ForgottenPasswordPage /> : <Navigate to={tenant ? `/${tenant}` : "/"} />}
        />

        {/* Tenant-scoped routes */}
        <Route path="/:tenant" element={loggedIn ? <ProjectsPage /> : <TenantLoginRedirect />} />
        <Route path="/:tenant/:projectKey/issues" element={loggedIn ? <AllProjectsIssuesPage /> : <TenantLoginRedirect />} />
        <Route path="/:tenant/:projectKey/new" element={loggedIn ? <CreateIssuePage /> : <TenantLoginRedirect />} />
        <Route path="/:tenant/:projectKey/kanban" element={loggedIn ? <KanbanPage /> : <TenantLoginRedirect />} />
        <Route path="/:tenant/:projectKey/:issueId" element={loggedIn ? <IssuePage /> : <TenantLoginRedirect />} />
        <Route path="/:tenant/manager/:projectKey/panel" element={loggedIn ? <ManagerPage /> : <TenantLoginRedirect />} />
        <Route path="/:tenant/admin/panel" element={loggedIn && isAdmin ? <AdminPage /> : <TenantLoginRedirect />} />
        <Route path="/:tenant/change-password" element={loggedIn ? <ChangePasswordPage /> : <TenantLoginRedirect />} />

        {/* Show error when no tenant provided */}
        <Route path="/" element={<NoTenantError />} />

        {/* Catch-all redirect */}
        <Route path="*" element={<NoTenantError />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <TenantProvider>
          <AppContent />
        </TenantProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
