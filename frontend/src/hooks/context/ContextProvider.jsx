import { createContext, useState, useEffect } from "react";

// Create AuthContext
export const AuthContext = createContext();

// Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState(null);

  // Load user from localStorage on app start
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
    }
  }, []);

  // Login Function
  const logIn = async (userName, password) => {
    try {
      const res = await api.post("log_in", { username: userName, password });
      setUser(res.data);
      setIsLoggedIn(true);
      localStorage.setItem("user", JSON.stringify(res.data));
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
    }
  };

  // Logout Function
  const logOut = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, logIn, logOut, error }}>
      {children}
    </AuthContext.Provider>
  );
};
