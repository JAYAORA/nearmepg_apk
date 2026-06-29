"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole =
  | "tenant"
  | "pg_owner"
  | "hotel_owner"
  | "admin"
  | "super_admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  token?: string;
  expiresAt?: number; // Unix timestamp ms
  aadhaarVerified?: boolean;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAuthReady: boolean;
  login: (user: Omit<User, "expiresAt">) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "nearmepg_user";
const SESSION_COOKIE = "nearmepg_session";
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function setSessionCookie(session: { role: string; expiresAt: number }) {
  const value = encodeURIComponent(JSON.stringify(session));
  const expires = new Date(session.expiresAt).toUTCString();
  document.cookie = `${SESSION_COOKIE}=${value}; path=/; expires=${expires}; SameSite=Lax`;
}

function clearSessionCookie() {
  document.cookie = `${SESSION_COOKIE}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // Rehydrate from localStorage on mount — validate expiry
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed: User = JSON.parse(stored);
          if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
            // Session expired — auto logout
            localStorage.removeItem(STORAGE_KEY);
            clearSessionCookie();
            setUser(null);
          } else {
            setUser(parsed);
            // Refresh the session cookie in case it got cleared
            if (parsed.expiresAt) {
              setSessionCookie({ role: parsed.role, expiresAt: parsed.expiresAt });
            }
          }
        } else {
          setUser(null);
        }
      } catch {}
      setIsAuthReady(true);
    };

    // Initial load
    handleStorageChange();

    // Listen for changes from other tabs
    window.addEventListener("storage", (e) => {
      if (e.key === STORAGE_KEY) {
        handleStorageChange();
      }
    });

    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const login = (userData: Omit<User, "expiresAt">) => {
    const expiresAt = Date.now() + SESSION_DURATION_MS;
    const fullUser: User = { ...userData, expiresAt };
    setUser(fullUser);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fullUser));
      setSessionCookie({ role: fullUser.role, expiresAt });
    } catch {}
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
      clearSessionCookie();
    } catch {}
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isAuthReady, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

/** Returns true for pg_owner and hotel_owner — same permissions */
export function useIsOwner() {
  const { user } = useAuth();
  return user?.role === "pg_owner" || user?.role === "hotel_owner";
}

/** Returns true for admin and super_admin */
export function useIsAdmin() {
  const { user } = useAuth();
  return user?.role === "admin" || user?.role === "super_admin";
}

/** Returns true only for super_admin */
export function useIsSuperAdmin() {
  const { user } = useAuth();
  return user?.role === "super_admin";
}
