import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);
const STORAGE_KEY = "weather_app_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      else localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      // ignore
    }
  }, [user]);

  // Mock sign-in: accept any email/username + password. Returns a promise to emulate async.
  function signIn({ username, email }) {
    return new Promise((resolve) => {
      const u = {
        username: username || email?.split("@")[0] || "user",
        email: email || null,
      };
      setUser(u);
      setTimeout(() => resolve(u), 300);
    });
  }

  function signOut() {
    setUser(null);
  }

  function updateUser(patch) {
    // merge and persist
    setUser((prev) => {
      const next = { ...(prev || {}), ...(patch || {}) };
      return next;
    });
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthContext;
