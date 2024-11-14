import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectFormState } from "./redux/formSlice"; // Adjust the import path

const PrivateRoute = () => {
  const authToken = sessionStorage.getItem("authToken");
  // const user = sessionStorage.getItem("user");
  // const parsedUser = JSON.parse(user);
  // sessionStorage.setItem("userType", parsedUser?.userType);

  // If not authenticated (i.e., no authToken), redirect to the login page
  return authToken?.length > 0 ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
