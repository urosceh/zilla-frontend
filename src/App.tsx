import {useState} from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import "rsuite/dist/rsuite.min.css";
import "./App.css";
import Login from "./components/LoginComponent";
import AllProjectsIssuesPage from "./pages/AllProjectIssuesPage";
import IssuePage from "./pages/IssuePage";
import KanbanPage from "./pages/KanbanPage";
import ProjectsPage from "./pages/ProjectsPage";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ProjectsPage />} />
          {/* <Route path="/" element={loggedIn ? <ProjectsPage /> : <Navigate to={{pathname: "/login"}} />} /> */}
          <Route path="/login" element={<Login setLoggedIn={setLoggedIn} />} />
          <Route path="/:projectKey/issues" element={<AllProjectsIssuesPage />} />
          <Route path="/:projectKey/kanban" element={<KanbanPage />} />
          <Route path="/:projectKey/:issueId" element={<IssuePage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
