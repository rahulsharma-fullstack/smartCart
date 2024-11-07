// src/context/AuthContext.jsx
import { createContext, useContext, useState } from "react";
import { auth, googleProvider } from "../firebaseConfig";
import { signInWithPopup, signOut } from "firebase/auth";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Google sign-in method
  const googleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
      localStorage.setItem("token", result.user.accessToken);
    } catch (error) {
      console.error("Google login error", error);
    }
  };

  // Logout method
  const logout = async () => {
    await signOut(auth);
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, googleLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
