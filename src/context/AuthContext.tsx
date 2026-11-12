"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { removeAccessToken, setAccessToken } from "../../helpers/authActions";
import { getSession, type SessionResult, type SessionUser } from "../../helpers/getSession";

const LOGIN_FLAG_KEY = "isLogin";

interface AuthContextValue {
  isLoggedIn: boolean;
  isLoading: boolean;
  user: SessionUser | null;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  isLoggedIn: false,
  isLoading: true,
  user: null,
  login: async () => {},
  logout: async () => {},
  refreshUser: async () => {},
});

function clearClientSession() {
  Cookies.remove("accessToken", { path: "/" });
  localStorage.removeItem(LOGIN_FLAG_KEY);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  const t = useTranslations("Navigation");

  const applySession = useCallback((session: SessionResult) => {
    if (session.status === "authenticated") {
      localStorage.setItem(LOGIN_FLAG_KEY, "true");
      setUser(session.user);
    } else if (session.status === "unauthenticated") {
      clearClientSession();
      setUser(null);
    }
    // On "error" (network/server failure) keep the last known state.
    setIsLoading(false);
  }, []);

  const refreshUser = useCallback(
    () =>
      getSession()
        .catch((): SessionResult => ({ status: "error" }))
        .then(applySession),
    [applySession],
  );

  useEffect(() => {
    void refreshUser();

    const handleStorage = (event: StorageEvent) => {
      if (event.key === LOGIN_FLAG_KEY || event.key === null) {
        void refreshUser();
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [refreshUser]);

  const login = useCallback(
    async (token: string) => {
      await setAccessToken(token);
      await refreshUser();
      router.refresh();
    },
    [refreshUser, router],
  );

  const logout = useCallback(async () => {
    clearClientSession();
    try {
      await removeAccessToken();
    } finally {
      setUser(null);
      toast.success(t("logoutSuccess"));
      router.push("/");
      router.refresh();
    }
  }, [router, t]);

  const contextValue = useMemo<AuthContextValue>(
    () => ({
      isLoggedIn: user !== null,
      isLoading,
      user,
      login,
      logout,
      refreshUser,
    }),
    [user, isLoading, login, logout, refreshUser],
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
