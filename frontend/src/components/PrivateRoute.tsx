import { Navigate } from "react-router-dom";
import { useAppSelector } from "../hooks/hooks";

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { accessToken } = useAppSelector((state) => state.user);
  const token = localStorage.getItem("token") || accessToken;

  return token ? <>{children}</> : <Navigate to="/" />;
};

export default PrivateRoute;
