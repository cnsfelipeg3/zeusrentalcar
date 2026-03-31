import { useState, useEffect, useCallback } from "react";

export interface AuthUser {
  name: string;
  email: string;
  phone: string;
  document: string;
  nationality: string;
}

interface AuthState {
  isLoggedIn: boolean;
  user: AuthUser | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const STORAGE_KEY = "zeus_auth";

export function useAuth(): AuthState {
  const [state, setState] = useState<{ isLoggedIn: boolean; user: AuthUser | null }>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.isLoggedIn && parsed.user) {
          return { isLoggedIn: true, user: parsed.user };
        }
      }
    } catch {}
    return { isLoggedIn: false, user: null };
  });

  const login = useCallback((email: string, password: string): boolean => {
    if (email === "admin@admin.com" && password === "admin") {
      const user: AuthUser = {
        name: "João Silva",
        email: "admin@admin.com",
        phone: "+55 11 99999-0000",
        document: "AB123456",
        nationality: "Brasileira",
      };
      const data = { isLoggedIn: true, user };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setState(data);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setState({ isLoggedIn: false, user: null });
  }, []);

  return { ...state, login, logout };
}
