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
import { getSession } from "../../helpers/getSession";
import type { SessionResult, SessionUser } from "../../helpers/getProfile";

const LOGIN_FLAG_KEY = "isLogin";
const SESSION_LOOKUP_TIMEOUT_MS = 12_000;

function withSessionTimeout(promise: Promise<SessionResult>): Promise<SessionResult> {
  return Promise.race([
    promise,
    new Promise<SessionResult>((resolve) => {
      window.setTimeout(() => resolve({ status: "error" }), SESSION_LOOKUP_TIMEOUT_MS);
    }),
  ]);
}

interface AuthContextValue {
  isLoggedIn: boolean;
  user: SessionUser | null;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  isLoggedIn: false,
  user: null,
  login: async () => {},
  logout: async () => {},
  refreshUser: async () => {},
});

function clearClientSession() {
  Cookies.remove("accessToken", { path: "/" });
  localStorage.removeItem(LOGIN_FLAG_KEY);
}

/** Keeps the cross-tab login flag and the readable cookie in line with the session. */
function syncClientSession(session: SessionResult) {
  if (session.status === "authenticated") {
    localStorage.setItem(LOGIN_FLAG_KEY, "true");
  } else if (session.status === "unauthenticated") {
    clearClientSession();
  }
}

interface AuthProviderProps {
  children: ReactNode;
  initialSession: SessionResult;
  syncSessionFromCookie?: boolean;
}

export function AuthProvider({
  children,
  initialSession,
  syncSessionFromCookie = false,
}: AuthProviderProps) {
  const [user, setUser] = useState<SessionUser | null>(
    initialSession.status === "authenticated" ? initialSession.user : null,
  );
  const router = useRouter();
  const t = useTranslations("Navigation");

  const refreshUser = useCallback(async () => {
    if (!Cookies.get("accessToken")) {
      clearClientSession();
      setUser(null);
      return;
    }

    const session = await withSessionTimeout(
      getSession().catch((): SessionResult => ({ status: "error" })),
    );
    syncClientSession(session);
    // On "error" (network/server failure) keep the last known state.
    if (session.status === "authenticated") setUser(session.user);
    else if (session.status === "unauthenticated") setUser(null);
  }, []);

  useEffect(() => {
    syncClientSession(initialSession);
    // Only the first server snapshot needs syncing; later changes go through refreshUser.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (
      syncSessionFromCookie &&
      initialSession.status !== "authenticated" &&
      Cookies.get("accessToken")
    ) {
      void refreshUser();
    }
  }, [syncSessionFromCookie, initialSession.status, refreshUser]);

  useEffect(() => {
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
      user,
      login,
      logout,
      refreshUser,
    }),
    [user, login, logout, refreshUser],
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
