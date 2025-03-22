import { createContext, useState, useEffect } from "react";
import api from "../../api";

// Create AuthContext
export const AuthContext = createContext();

// Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [error, setError] = useState(null);
  const [token,setToken] =useState("")

  // Load user from localStorage on app start
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userinfo"));
    const access_token = JSON.parse(localStorage.getItem("access_token"));

    if(access_token){
      console.log('got it')
      setToken(access_token)
    }
    
    if (storedUser) {
      (async () => {
        await logIn(null, storedUser.username, storedUser.password);
      })();
    }
  }, []);
  

  // Login Function
  const logIn = async (e, username, password) => {
    if(e){
      e.preventDefault();  // Prevent page refresh
    }
    const UserLogin = { username, password };
    try {
        const res = await api.post("/log_in", UserLogin);
        if (res.status === 200) { // Check if the response is successful
            setUser(res.data);
            setIsLoggedIn(true);
            localStorage.setItem("userinfo", JSON.stringify(UserLogin));
            localStorage.setItem("access_token", JSON.stringify(res.data.access_token));
            setToken(res.data.access_token)
            console.log(res.data)
        }
    } catch (err) {
        console.error("Login Error:", err);  // Log the error if something goes wrong
        setError(err.response?.data?.detail || err.message);
    }
};

  // Logout Function
  const logOut = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem("userinfo");
    localStorage.removeItem("access_token");
  };

  const changeUserEventsHandler=(eventName)=>{
    setUser((prevUser) => {
      const updatedUser = {
        ...prevUser,
        user_events: [...prevUser.user_events, eventName],
      };

      return updatedUser;
    });
  }

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, logIn, logOut, error ,changeUserEventsHandler,token}}>
      {children}
    </AuthContext.Provider>
  );
};
