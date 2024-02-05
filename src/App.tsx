import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "rsuite/dist/rsuite.min.css";
import "./App.css";
import Login from "./components/LoginComponent";
import HomePage from "./pages/HomePage";
import IssuePage from "./pages/IssuePage";

function App() {

  const [loggedIn, setLoggedIn] = useState(false)
  const [email, setEmail] = useState("")

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login setLoggedIn={setLoggedIn} setEmail={setEmail} />} />
          <Route path="/:projectKey/:issueId" element={<IssuePage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
