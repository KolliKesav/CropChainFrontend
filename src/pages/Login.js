import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { ConnectButton } from "web3uikit";
import Upload from "../utils/Upload.json";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

export default function LoginPage() {
  const { login } = useUser(); 
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);
  const [walletAddress, setWalletAddress] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const { enableWeb3, isWeb3Enabled, account } = useMoralis();

  const roles = [
    { name: "Farmer", icon: "farmer1.png", color: "bg-green-200" },
    { name: "Scientist", icon: "scientist.png", color: "bg-blue-200" },
    { name: "Manager", icon: "scientist1.png", color: "bg-yellow-200" },
  ];

  // 🔹 Detect mobile screen
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile(); // Run at start
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // 🔹 Filter roles for mobile
  const visibleRoles = isMobile
    ? roles.filter((role) => role.name !== "Manager")
    : roles;

  useEffect(() => {
    if (account) {
      setWalletAddress(account);
    }
  }, [account]);

  const { runContractFunction: getFarmerData } = useWeb3Contract({
    abi: Upload.abi,
    contractAddress: process.env.REACT_APP_CONTRACT,
    functionName: "display_farmer",
    params: { _user: walletAddress },
  });

  const { runContractFunction: getScientistData } = useWeb3Contract({
    abi: Upload.abi,
    contractAddress: process.env.REACT_APP_CONTRACT,
    functionName: "display_scientist",
    params: { _user: walletAddress },
  });

  const { runContractFunction: getKvkManager } = useWeb3Contract({
    abi: Upload.abi,
    contractAddress: process.env.REACT_APP_CONTRACT,
    functionName: "getKvkManager",
  });

  const handleSubmit = async () => {
    if (!walletAddress) {
      setErrorMessage("Please connect your wallet.");
      return;
    }

    if (!selectedRole) {
      setErrorMessage("Please select a role before logging in.");
      return;
    }

    try {
      if (selectedRole === "Farmer") {
        const result = await getFarmerData();
        if (result) {
          const adhaarFromChain = result.adhar_id.toString();
          const farmerAddress = result.farmer_add;
          if (
            adhaarFromChain !== "0" &&
            farmerAddress !== "0x0000000000000000000000000000000000000000"
          ) {
            if (adhaarFromChain !== aadhaar) {
              setErrorMessage("Aadhaar number does not match.");
              return;
            }
            login(walletAddress, selectedRole);
            setErrorMessage("");
            navigate("/farmer");
          } else {
            setErrorMessage("Farmer not registered on blockchain.");
          }
        } else {
          setErrorMessage("No data returned for farmer.");
        }
      } else if (selectedRole === "Scientist") {
        const result = await getScientistData();
        if (result) {
          const adhaarFromChain = result.adhar_id.toString();
          const scientistAddress = result.scientist_add;
          if (
            adhaarFromChain !== "0" &&
            scientistAddress !== "0x0000000000000000000000000000000000000000"
          ) {
            if (adhaarFromChain !== aadhaar) {
              setErrorMessage("Aadhaar number does not match.");
              return;
            }
            login(walletAddress, selectedRole);
            setErrorMessage("");
            navigate("/scientist");
          } else {
            setErrorMessage("Scientist not registered on blockchain.");
          }
        } else {
          setErrorMessage("No data returned for scientist.");
        }
      } else if (selectedRole === "Manager") {
        const ownerAddress = await getKvkManager();
        if (walletAddress.toLowerCase() === ownerAddress.toLowerCase()) {
          login(walletAddress, selectedRole);
          setErrorMessage("");
          navigate("/kvkmanager");
        } else {
          setErrorMessage(
            "Access denied. Only the contract owner can log in as Manager."
          );
        }
      }
    } catch (error) {
      console.error("Unexpected error during login:", error);
      setErrorMessage("Unexpected error during login.");
    }
  };

  return (
    <div>
      
      <div className="min-h-screen bg-gradient-to-r from-teal-50 via-cyan-50 to-blue-100 flex justify-center items-start pt-20 sm:pt-24 px-2 sm:px-4">
        <div className="bg-white shadow-lg rounded-lg w-full max-w-md sm:max-w-xl p-4 sm:p-6 flex flex-col gap-6">
          {/* Title */}
          <div className="border-l-4 border-green-500 pl-3 sm:pl-4 text-xl sm:text-2xl font-semibold text-gray-800">
            Login
          </div>

          {/* Role Selection */}
          <div>
            <label className="block mb-3 font-medium text-gray-700">
              Select Role
            </label>
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap sm:justify-center gap-4 sm:gap-8">
              {visibleRoles.map((role) => (
                <div
                  key={role.name}
                  className={`flex flex-col items-center p-2 rounded-lg cursor-pointer transition border-2 ${
                    selectedRole === role.name
                      ? "border-green-400 shadow-md"
                      : "border-gray-300"
                  }`}
                  onClick={() => setSelectedRole(role.name)}
                >
                  <div className={`${role.color} rounded-full p-3 sm:p-4`}>
                    <img
                      src={role.icon}
                      alt={role.name}
                      className="h-12 w-12 sm:h-16 sm:w-16"
                    />
                  </div>
                  <span className="mt-2 text-sm sm:text-base font-medium text-gray-800">
                    {role.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Aadhaar Input */}
          {selectedRole !== "Manager" && (
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Aadhaar Number
              </label>
              <input
                type="text"
                placeholder="Enter Aadhaar"
                value={aadhaar}
                onChange={(e) => setAadhaar(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>
          )}

          {/* Connect Wallet */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Connect
            </label>
            <div className="flex justify-center">
              <ConnectButton moralisAuth={false} />
            </div>
            {walletAddress && (
              <p className="text-center text-xs sm:text-sm text-gray-500 mt-2 break-words">
                Connected wallet: {walletAddress}
              </p>
            )}
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="bg-gray-100 text-xs sm:text-sm italic text-red-700 border border-gray-300 rounded-md p-2 mb-4 text-center">
              {errorMessage}
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-400 transition"
          >
            Login
          </button>
        </div>
      </div>
       <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </div>
  );
}
