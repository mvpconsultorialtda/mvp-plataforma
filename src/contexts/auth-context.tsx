"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { User } from "@/lib/types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: () => {},
  logout: () => {},
});

const MOCK_USER: User = {
  id: "1",
  name: "Carlos Santos",
  email: "carlos@mvp.com.br",
  avatar: undefined,
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("mvp-auth");
    if (saved === "true") {
      setUser(MOCK_USER);
    }
    setIsLoading(false);
  }, []);

  const login = (_email: string, _password: string) => {
    setUser(MOCK_USER);
    localStorage.setItem("mvp-auth", "true");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("mvp-auth");
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
