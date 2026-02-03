import { Routes, Route } from "react-router-dom";
import LoginPage from "./LoginPage";
import CarpoolForm from "./CarpoolForm";
import "./App.css";


export default function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<CarpoolForm />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </div>
  );
}
