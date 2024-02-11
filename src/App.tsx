import {useEffect, useState} from "react";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import "./App.css";
import NavigationBar from "./components/NavigationBar/NavigationBar";
import {ClientCookies} from "./lib/ClientCookies";
import AdminPage from "./pages/AdminPage";
import AllProjectsIssuesPage from "./pages/AllProjectIssuesPage";
import CreateIssuePage from "./pages/CreateIssuePage";
import ForgottenPasswordPage from "./pages/ForgottenPasswordPage";
import IssuePage from "./pages/IssuePage";
import KanbanPage from "./pages/KanbanPage";
import LoginPage from "./pages/LoginPage";
import ManagerPage from "./pages/ManagerPage";
import ProjectsPage from "./pages/ProjectsPage";

function App() {
  const cookies = ClientCookies.getCookies();
  const [loggedIn, setLoggedIn] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

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
    <div className="App">
      <BrowserRouter>
        {loggedIn && <NavigationBar isAdmin={isAdmin} setLoggedIn={setLoggedIn} />}
        <Routes>
          <Route
            path="/login"
            element={!loggedIn ? <LoginPage setLoggedIn={setLoggedIn} setIsAdmin={setIsAdmin} cookies={cookies} /> : <Navigate to="/" />}
          />
          <Route path="/forgotten-password" element={!loggedIn ? <ForgottenPasswordPage /> : <Navigate to="/" />} />
          <Route path="/" element={loggedIn ? <ProjectsPage /> : <Navigate to="/login" />} />
          <Route path="/:projectKey/issues" element={loggedIn ? <AllProjectsIssuesPage /> : <Navigate to="/login" />} />
          <Route path="/:projectKey/new" element={loggedIn ? <CreateIssuePage /> : <Navigate to="/login" />} />
          <Route path="/:projectKey/kanban" element={loggedIn ? <KanbanPage /> : <Navigate to="/login" />} />
          <Route path="/:projectKey/:issueId" element={loggedIn ? <IssuePage /> : <Navigate to="/login" />} />
          <Route path="/manager/:projectKey/panel" element={loggedIn ? <ManagerPage /> : <Navigate to="/login" />} />
          <Route path="/admin/panel" element={loggedIn && isAdmin ? <AdminPage /> : <Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
