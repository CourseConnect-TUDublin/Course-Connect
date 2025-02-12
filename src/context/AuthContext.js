// src/context/AuthContext.js
"use client"; 

import { createContext, useContext, useState, useEffect } from "react";

// Create the AuthContext
const AuthContext = createContext();

// Create a provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Simulate fetching user data (replace this with your real auth logic)
  useEffect(() => {
    // For example, check localStorage for a saved user
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Simulated login function: in a real app, authenticate via API
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // Simulated logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for easy access to the context
export function useAuth() {
  return useContext(AuthContext);
}
