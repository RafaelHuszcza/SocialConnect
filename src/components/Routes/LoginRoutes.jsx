import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";

export const LoginRoutes = () => {
  const { isLogged } = useAuth();

  return isLogged() ? <Navigate to={"/search"} /> : <Outlet />;
};
