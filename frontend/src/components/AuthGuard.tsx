import { Navigate } from "react-router-dom";
import { useAppSelector } from "../hooks/hooks";

const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { accessToken } = useAppSelector((state) => state.user); // Reduxでトークンを取得
  const token = localStorage.getItem("token") || accessToken;

  return token ? <Navigate to="/main" /> : <>{children}</>;
};

export default AuthGuard;
