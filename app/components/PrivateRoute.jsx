import React from "react";
import { UserAuth } from "../context/AuthContext";
import { Navigate } from "react-router";

const PrivateRoute = ({ children }) => {
  const { session } = UserAuth();
  if (session === undefined) {
    return <div>Loading...</div>;
  }
  return <>{session ? <>{children}</> : <Navigate to="/" />}</>;
};

export default PrivateRoute;
