import { Outlet, Navigate } from "react-router-dom";
import { getAuth } from "firebase/auth";

const PrivateRoute = () => {
  const auth = getAuth()

  return auth.currentUser ? <Outlet /> : <Navigate to="/sign-in" />;
};

export default PrivateRoute;
