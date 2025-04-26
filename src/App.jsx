import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import ResumeForm from "./components/ResumeForm";
import Resume from "./components/Resume";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/resume-form" element={<ResumeForm />} />
        <Route path="/resume" element={<Resume />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;