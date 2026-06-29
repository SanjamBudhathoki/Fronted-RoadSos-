import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "./Loader";

const ProjectRoute = ({ children, allowedRole }) => {
  const { user, isAuthenticated, loading } = useAuth();
  if (loading) return <Loader/>;
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (allowedRole && user?.role !== allowedRole) {
    return <Navigate to={user?.role === "provider" ? "/provider/dashbord" : "/user/dashbord"} />;
  }
  return children;
};

export default ProjectRoute;