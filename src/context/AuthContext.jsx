/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import { API_ENDPOINTS } from "../config/api";
import { apiClient } from "../lib/apiClient";
import { clearSession, extractAuthToken, getStoredRole, getStoredToken, getStoredUser, normalizeUser, persistSession } from "../utils/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getStoredToken());
  const [user, setUser] = useState(() => getStoredUser());
  const [isAuthLoading, setIsAuthLoading] = useState(() => Boolean(getStoredToken()));

  useEffect(() => {
    const syncAuth = () => {
      setToken(getStoredToken());
      setUser(getStoredUser());
      setIsAuthLoading(Boolean(getStoredToken()));
    };

    window.addEventListener("auth:changed", syncAuth);
    window.addEventListener("storage", syncAuth);

    return () => {
      window.removeEventListener("auth:changed", syncAuth);
      window.removeEventListener("storage", syncAuth);
    };
  }, []);

  useEffect(() => {
    if (!token) {
      return;
    }

    let ignore = false;

    const loadProfile = async () => {
      setIsAuthLoading(true);

      try {
        const payload = await apiClient.get(API_ENDPOINTS.auth.profile, { requiresAuth: true });
        const normalizedUser = normalizeUser(payload);

        if (!ignore) {
          persistSession({ token, user: normalizedUser });
          setUser(normalizedUser);
        }
      } catch {
        if (!ignore) {
          clearSession();
          setToken("");
          setUser(null);
        }
      } finally {
        if (!ignore) {
          setIsAuthLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      ignore = true;
    };
  }, [token]);

  const login = async (credentials) => {
    const payload = await apiClient.post(API_ENDPOINTS.auth.login, credentials);
    const nextToken = extractAuthToken(payload);

    if (!nextToken) {
      throw new Error("Login succeeded but no token was returned.");
    }

    const normalizedUser = normalizeUser(payload);
    persistSession({ token: nextToken, user: normalizedUser });
    setToken(nextToken);
    setUser(normalizedUser);

    return normalizedUser;
  };

  const register = async (formData) => {
    return apiClient.post(API_ENDPOINTS.auth.register, formData);
  };

  const logout = async () => {
    try {
      if (getStoredToken()) {
        await apiClient.post(API_ENDPOINTS.auth.logout, {}, { requiresAuth: true });
      }
    } catch {
      // Logout should always clear local state.
    } finally {
      clearSession();
      setToken("");
      setUser(null);
    }
  };

  const value = {
    token,
    user,
    role: user?.role || getStoredRole(),
    isAuthenticated: Boolean(token),
    isAdmin: (user?.role || getStoredRole()) === "admin",
    isAuthLoading,
    login,
    register,
    logout,
    refreshProfile: async () => {
      const payload = await apiClient.get(API_ENDPOINTS.auth.profile, { requiresAuth: true });
      const normalizedUser = normalizeUser(payload);
      persistSession({ token: getStoredToken(), user: normalizedUser });
      setUser(normalizedUser);
      return normalizedUser;
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}