// src/hooks/useAuth.js
import { useEffect, useState } from "react";

const useAuth = () => {
  // Replace with your actual authentication logic
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);

  // Example: Check auth status on mount
  useEffect(() => {
    const checkAuth = async () => {
      // Simulate auth check
      const user = localStorage.getItem("user");
      if (user) {
        setUser(JSON.parse(user));
        setIsAuthenticated(true);
      }
    };
    checkAuth();
  }, []);
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);
  return { user, isAuthenticated, token };
};

export default useAuth;
