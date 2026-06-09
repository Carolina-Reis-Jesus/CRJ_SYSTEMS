import { createContext, useContext, useState } from "react";
import { CURRENT_USER } from "../lib/mockData";

const AuthContext = createContext(null);

const STORAGE_KEY = "crjsystems.auth.session";

const readSession = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(readSession);
  const hydrated = true;

  const login = ({ email, password }) => {
    // Mocked auth — accepts demo credentials
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === "helena@crjsystems.com" && password === "Tier2!2026") {
          const session = { ...CURRENT_USER, sessionStartedAt: new Date().toISOString() };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
          setUser(session);
          resolve(session);
        } else {
          reject(new Error("Invalid credentials. Try the demo account."));
        }
      }, 650);
    });
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  // RBAC helper — Tier 2 cannot delete
  const can = (action) => {
    if (!user) return false;
    if (action === "delete") return user.tier >= 4;
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, can, hydrated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
