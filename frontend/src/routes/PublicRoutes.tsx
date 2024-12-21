import { Routes, Route } from "react-router-dom";
import AuthGuard from "../components/AuthGuard";
import Home from "../page/Home";
import Signup from "../page/SignUp";
import Welcome from "../page/Welcome";
import Login from "../page/Login";

const PublicRoutes: React.FC = () => {
  return (
    <AuthGuard>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </AuthGuard>
  );
};

export default PublicRoutes;
