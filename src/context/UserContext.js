import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hydrated, setHydrated] = useState(false);


  // Load persisted data from localStorage
  useEffect(() => {
  const storedWallet = localStorage.getItem("walletAddress");
  const storedRole = localStorage.getItem("role");

  if (storedWallet) setWalletAddress(storedWallet);
  if (storedRole) setRole(storedRole);
  setHydrated(true);

  
  
    setLoading(false);
  

 
}, []);

  // Save to localStorage whenever values change
  useEffect(() => {
    if (walletAddress) {
      localStorage.setItem("walletAddress", walletAddress);
    } else {
      localStorage.removeItem("walletAddress");
    }

    if (role) {
      localStorage.setItem("role", role);
    } else {
      localStorage.removeItem("role");
    }
  }, [walletAddress, role]);

  // Login function
  const login = (address, userRole) => {
    setWalletAddress(address);
    setRole(userRole);
    localStorage.setItem("walletAddress", address);
    localStorage.setItem("role", userRole);
  };

  // Logout function
  const logout = () => {
    setWalletAddress(null);
    setRole(null);
    localStorage.removeItem("walletAddress");
    localStorage.removeItem("role");
   
  };

  return (
    <UserContext.Provider
      value={{
        walletAddress,
        role,
        loading,
        hydrated,
        login,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
