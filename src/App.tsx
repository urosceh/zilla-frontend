import {useState} from "react";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import "./App.css";
import NavigationBar from "./components/NavigationBar/NavigationBar";
import AllProjectsIssuesPage from "./pages/AllProjectIssuesPage";
import CreateIssuePage from "./pages/CreateIssuePage";
import IssuePage from "./pages/IssuePage";
import LoginPage from "./pages/LoginPage";
import ManagerPage from "./pages/ManagerPage";
import ProjectsPage from "./pages/ProjectsPage";

function App() {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const redirectToLogin = () => {
    if (!loggedIn) {
      return <Navigate to="/login" />;
    }
  };

  return (
    <div className="App">
      <BrowserRouter>
        {redirectToLogin()}
        {loggedIn && <NavigationBar isAdmin={isAdmin} setLoggedIn={setLoggedIn} />}
        <Routes>
          <Route path="/login" element={<LoginPage setLoggedIn={setLoggedIn} setIsAdmin={setIsAdmin} />} />
          <Route path="/" element={<ProjectsPage />} />
          <Route path="/:projectKey/issues" element={<AllProjectsIssuesPage />} />
          {/* <Route path="/:projectKey/kanban" element={<KanbanPage />} /> */}
          <Route path="/:projectKey/new" element={<CreateIssuePage />} />
          <Route path="/:projectKey/:issueId" element={<IssuePage />} />
          <Route path="/manager/:projectKey/panel" element={<ManagerPage />} />
          {/* <Route path="/logout" element={<LogoutPage />} /> */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
