import React, { createContext, useState, useEffect, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoggedIn: boolean;
  signOut: () => void;
}

const defaultAuthContext: AuthContextType = {
  user: null,
  setUser: () => {},
  isLoggedIn: false,
  signOut: () => {},
};

export const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  });

  const signOut = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  const checkTokenExpiry = (token: string) => {
    try {
      const decodedToken: { exp: number } = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return decodedToken.exp > currentTime;
    } catch (error) {
      console.error("Error decoding token:", error);
      return false;
    }
  };

  useEffect(() => {
    if (user && user.token) {
      if (!checkTokenExpiry(user.token)) {
        signOut();
      } else {
        const decodedToken: { exp: number } = jwtDecode(user.token);
        const timeUntilExpiry = decodedToken.exp * 1000 - Date.now();

        const logoutTimer = setTimeout(() => {
          signOut();
        }, timeUntilExpiry);

        return () => clearTimeout(logoutTimer);
      }
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{ user, setUser, isLoggedIn: !!user, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};
