import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { CURRENT_USER } from "../lib/mockData";

/**
 * NOTE: This is a frontend-only demo with mocked authentication. There is
 * intentionally no real JWT / opaque token. The "session" persisted to
 * sessionStorage is only the mocked user profile so the UI survives a refresh.
 *
 * For a real production system the right pattern is:
 *   1. Server issues httpOnly + Secure + SameSite cookies (no JS access).
 *   2. Refresh tokens rotate; CSRF token returned in a header.
 *   3. Optional client-only state stays minimal (e.g. the user's display name).
 *
 * Until a real backend exists, sessionStorage is preferable to localStorage
 * because it is scoped to the tab and cleared on close — shorter XSS window.
 */

const AuthContext = createContext(null);

const STORAGE_KEY = "crjsystems.auth.session";

const readSession = () => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(readSession);

  const login = useCallback(({ email, password }) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === "carolina@crjsystems.com" && password === "Tier2!2026") {
          const session = { ...CURRENT_USER, sessionStartedAt: new Date().toISOString() };
          sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
          setUser(session);
          resolve(session);
        } else {
          reject(new Error("Invalid credentials. Try the demo account."));
        }
      }, 650);
    });
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  // RBAC helper — Tier 2 cannot delete
  const can = useCallback(
    (action) => {
      if (!user) return false;
      if (action === "delete") return user.tier >= 4;
      return true;
    },
    [user]
  );

  const value = useMemo(
    () => ({ user, login, logout, can, hydrated: true }),
    [user, login, logout, can]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
