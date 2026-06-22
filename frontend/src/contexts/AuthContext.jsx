import { createContext, useCallback, useEffect, useMemo, useState } from "react";

import { authService } from "../services/authService.js";
import { AUTH_STORAGE_KEYS } from "../utils/constants.js";

export const AuthContext = createContext(null);

function getStoredUser() {
  const storedUser = localStorage.getItem(AUTH_STORAGE_KEYS.user);
  if (!storedUser) return null;

  try {
    return JSON.parse(storedUser);
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEYS.user);
    return null;
  }
}

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(() =>
    localStorage.getItem(AUTH_STORAGE_KEYS.accessToken),
  );
  const [refreshToken, setRefreshToken] = useState(() =>
    localStorage.getItem(AUTH_STORAGE_KEYS.refreshToken),
  );
  const [user, setUser] = useState(() => getStoredUser());
  const [isInitializing, setIsInitializing] = useState(Boolean(accessToken));

  const setAuthSession = useCallback((session) => {
    setAccessToken(session.access_token);
    setRefreshToken(session.refresh_token);
    setUser(session.user);
    localStorage.setItem(AUTH_STORAGE_KEYS.accessToken, session.access_token);
    localStorage.setItem(AUTH_STORAGE_KEYS.refreshToken, session.refresh_token);
    localStorage.setItem(AUTH_STORAGE_KEYS.user, JSON.stringify(session.user));
  }, []);

  const clearAuthSession = useCallback(() => {
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEYS.accessToken);
    localStorage.removeItem(AUTH_STORAGE_KEYS.refreshToken);
    localStorage.removeItem(AUTH_STORAGE_KEYS.user);
  }, []);

  const login = useCallback(
    async (payload) => {
      const session = await authService.login(payload);
      setAuthSession(session);
      return session;
    },
    [setAuthSession],
  );

  const logout = useCallback(async () => {
    try {
      if (localStorage.getItem(AUTH_STORAGE_KEYS.accessToken)) {
        await authService.logout();
      }
    } finally {
      clearAuthSession();
    }
  }, [clearAuthSession]);

  const loadCurrentUser = useCallback(async () => {
    if (!localStorage.getItem(AUTH_STORAGE_KEYS.accessToken)) {
      clearAuthSession();
      setIsInitializing(false);
      return null;
    }

    setIsInitializing(true);

    try {
      const currentUser = await authService.getCurrentUser();
      setAccessToken(localStorage.getItem(AUTH_STORAGE_KEYS.accessToken));
      setRefreshToken(localStorage.getItem(AUTH_STORAGE_KEYS.refreshToken));
      setUser(currentUser);
      localStorage.setItem(AUTH_STORAGE_KEYS.user, JSON.stringify(currentUser));
      return currentUser;
    } catch {
      clearAuthSession();
      return null;
    } finally {
      setIsInitializing(false);
    }
  }, [clearAuthSession]);

  useEffect(() => {
    loadCurrentUser();
  }, [loadCurrentUser]);

  useEffect(() => {
    window.addEventListener("auth:expired", clearAuthSession);
    return () => window.removeEventListener("auth:expired", clearAuthSession);
  }, [clearAuthSession]);

  useEffect(() => {
    const syncStoredSession = () => {
      setAccessToken(localStorage.getItem(AUTH_STORAGE_KEYS.accessToken));
      setRefreshToken(localStorage.getItem(AUTH_STORAGE_KEYS.refreshToken));
      setUser(getStoredUser());
    };

    window.addEventListener("auth:session-updated", syncStoredSession);
    return () => window.removeEventListener("auth:session-updated", syncStoredSession);
  }, []);

  const value = useMemo(
    () => ({
      accessToken,
      refreshToken,
      user,
      isAuthenticated: Boolean(accessToken),
      isInitializing,
      login,
      logout,
      loadCurrentUser,
      setAuthSession,
      clearAuthSession,
    }),
    [
      accessToken,
      refreshToken,
      user,
      isInitializing,
      login,
      logout,
      loadCurrentUser,
      setAuthSession,
      clearAuthSession,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
