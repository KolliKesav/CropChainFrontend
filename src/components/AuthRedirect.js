import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner } from "@material-tailwind/react";
import { useUser } from "../context/UserContext";

const AuthRedirect = () => {
  const { walletAddress, role, loading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    console.log(loading);
  if (!loading) {
    if (walletAddress && role) {
      switch (role) {
        case "Farmer":
          navigate("/farmer");
          break;
        case "Scientist":
          navigate("/scientist");
          break;
        case "Manager":
          navigate("/manager");
          break;
        default:
          navigate("/login");
      }
    } else {
       
      navigate("/login");
    }
  }
}, [ loading]);


  return (
    <div className="flex justify-center items-center h-screen">
      <Spinner className="h-12 w-12 text-blue-500" />
    </div>
  );
};

export default AuthRedirect;
