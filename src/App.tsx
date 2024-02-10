import {useState} from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import "./App.css";
import AllProjectsIssuesPage from "./pages/AllProjectIssuesPage";
import IssuePage from "./pages/IssuePage";
import LoginPage from "./pages/LoginPage";
import ProjectsPage from "./pages/ProjectsPage";

function App() {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage setLoggedIn={setLoggedIn} />} />
          <Route path="/" element={<ProjectsPage />} />
          <Route path="/:projectKey/issues" element={<AllProjectsIssuesPage />} />
          {/* <Route path="/:projectKey/kanban" element={<KanbanPage />} /> */}
          <Route path="/:projectKey/:issueId" element={<IssuePage />} />
          {/* <Route path="/logout" element={<LogoutPage />} /> */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
