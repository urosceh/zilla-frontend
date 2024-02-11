import {useEffect, useState} from "react";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import "./App.css";
import NavigationBar from "./components/NavigationBar/NavigationBar";
import AdminPage from "./pages/AdminPage";
import AllProjectsIssuesPage from "./pages/AllProjectIssuesPage";
import CreateIssuePage from "./pages/CreateIssuePage";
import IssuePage from "./pages/IssuePage";
import LoginPage from "./pages/LoginPage";
import ManagerPage from "./pages/ManagerPage";
import ProjectsPage from "./pages/ProjectsPage";

function App() {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const loggedInStatus = localStorage.getItem("loggedIn");
    if (loggedInStatus === "true") {
      setLoggedIn(true);
    }
    const adminStatus = localStorage.getItem("isAdmin");
    if (adminStatus === "true") {
      setIsAdmin(true);
    }
  }, []);

  const redirectToLogin = () => {
    const loggedInStatus = localStorage.getItem("loggedIn");
    if (loggedInStatus !== "true") {
      return <Navigate to="/login" />;
    }
  };

  return (
    <div className="App">
      <BrowserRouter>
        {redirectToLogin()}
        {loggedIn && <NavigationBar isAdmin={isAdmin} setLoggedIn={setLoggedIn} />}
        <Routes>
          <Route path="/login" element={loggedIn ? <Navigate to="/" /> : <LoginPage setLoggedIn={setLoggedIn} setIsAdmin={setIsAdmin} />} />
          <Route path="/" element={<ProjectsPage />} />
          <Route path="/:projectKey/issues" element={<AllProjectsIssuesPage />} />
          {/* <Route path="/:projectKey/kanban" element={<KanbanPage />} /> */}
          <Route path="/:projectKey/new" element={<CreateIssuePage />} />
          <Route path="/:projectKey/:issueId" element={<IssuePage />} />
          <Route path="/manager/:projectKey/panel" element={<ManagerPage />} />
          <Route path="/admin/panel" element={<AdminPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
