import { Navigate } from "react-router-dom";
import { useUserStore } from "../store/userStore";

const RedirectIfAuth = ({ children }) => {
  const { user } = useUserStore();
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
};

export default RedirectIfAuth;
