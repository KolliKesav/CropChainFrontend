// src/components/WalletListener.js
import { useEffect } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const WalletListener = () => {
  const { walletAddress, logout } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    

    if (typeof window.ethereum === "undefined") {
      return;
    }

    const handleAccountsChanged = (accounts) => {
     
      if (accounts.length === 0) {
        console.log("⚠️ Wallet disconnected");
        toast.warning("🔌 Wallet disconnected");

        setTimeout(() => {
          logout();
          navigate("/login");
        }, 2400);
      } 
      else if (
        walletAddress &&
        accounts[0].toLowerCase() !== walletAddress.toLowerCase()
      ) {
       
        toast.info("Wallet changed. You have been logged out."
        );

        setTimeout(() => {
          logout();
          navigate("/login");
        }, 2400);
      } 
      else {
        console.log("✅ Wallet unchanged or no active session");
      }
    };

  
    window.ethereum.on("accountsChanged", handleAccountsChanged);
    console.log("📡 accountsChanged listener attached");

   
    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      console.log("🧹 accountsChanged listener removed");
    };
  }, [walletAddress, logout, navigate]);

  return null;
};

export default WalletListener;
