import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const accessToken = localStorage.getItem("accesstoken");

      if (storedUser && accessToken) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        console.log("✅ Restored User:", parsedUser);
      }
    } catch (error) {
      console.error("❌ Failed to restore auth state:", error);

      localStorage.removeItem("user");
      localStorage.removeItem("accesstoken");
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    try {
      const data = await authService.login(credentials);


console.log("LOGIN RESPONSE:", data);
console.log("USER:", data.user);
console.log("TOKEN:", data.token);

      // Handle multiple backend response structures
      const loggedInUser =
        data?.user ||
        data?.data?.user ||
        data?.data ||
        data?.result?.user ||
        null;

      const accessToken =
        data?.accessToken ||
        data?.token ||
        data?.data?.accessToken ||
        data?.data?.token;

      console.log("👤 USER FOUND:", loggedInUser);
      console.log("🔑 TOKEN FOUND:", accessToken);

      if (loggedInUser) {
        setUser(loggedInUser);
        localStorage.setItem("user", JSON.stringify(loggedInUser));
      }

      if (accessToken) {
        localStorage.setItem("accesstoken", accessToken);
      }

      return data;
    } catch (error) {
      console.error("❌ Login failed:", error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const data = await authService.register(userData);

      const registeredUser =
        data?.user ||
        data?.data?.user ||
        data?.data ||
        null;

      const accessToken =
        data?.accessToken ||
        data?.token ||
        data?.data?.accessToken ||
        data?.data?.token;

      if (registeredUser) {
        setUser(registeredUser);
        localStorage.setItem("user", JSON.stringify(registeredUser));
      }

      if (accessToken) {
        localStorage.setItem("accesstoken", accessToken);
      }

      return data;
    } catch (error) {
      console.error("❌ Registration failed:", error);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();

    localStorage.removeItem("user");
    localStorage.removeItem("accesstoken");

    setUser(null);

    console.log("👋 User logged out");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        loading,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};