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
import Cookies from "js-cookie";
import { toast } from "sonner";
import { myFetch } from "../../helpers/myFetch";
import { removeAccessToken, setAccessToken } from "../../helpers/authActions";

interface AuthContextValue {
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (token?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  isLoggedIn: false,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  const clearClientAuth = useCallback(async () => {
    Cookies.remove("accessToken", { path: "/" });
    Cookies.remove("accessToken");
    localStorage.removeItem("isLogin");
    try {
      await removeAccessToken();
    } catch {
      // Server cookie may already be cleared
    }
    setIsLoggedIn(false);
  }, []);

  const checkAuth = useCallback(async () => {
    const token = Cookies.get("accessToken");

    if (!token) {
      if (localStorage.getItem("isLogin") === "true") {
        localStorage.removeItem("isLogin");
      }
      setIsLoggedIn(false);
      setIsLoading(false);
      return;
    }

    const res = await myFetch("/users/profile", { cache: "no-store" });
    if (res.data) {
      localStorage.setItem("isLogin", "true");
      setIsLoggedIn(true);
      setIsLoading(false);
      return;
    }

    if (res.message === "Network error") {
      setIsLoggedIn(true);
      setIsLoading(false);
      return;
    }

    await clearClientAuth();
    setIsLoading(false);
  }, [clearClientAuth]);

  useEffect(() => {
    let isActive = true;

    const runCheck = async (withLoading: boolean) => {
      if (withLoading) {
        setIsLoading(true);
      }
      await checkAuth();
      if (!isActive) return;
    };

    void runCheck(true);

    const handleStorage = (event: StorageEvent) => {
      if (event.key === "isLogin" || event.key === null) {
        void runCheck(false);
      }
    };

    const handleAuthChange = () => {
      void runCheck(false);
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("auth-change", handleAuthChange);

    return () => {
      isActive = false;
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("auth-change", handleAuthChange);
    };
  }, [checkAuth]);

  const login = useCallback(async (token?: string) => {
    if (token) {
      Cookies.set("accessToken", token, { expires: 30, path: "/" });
      await setAccessToken(token);
    }
    localStorage.setItem("isLogin", "true");
    setIsLoggedIn(true);
    window.dispatchEvent(new Event("auth-change"));
  }, []);

  const logout = useCallback(async () => {
    try {
      Cookies.remove("accessToken", { path: "/" });
      Cookies.remove("accessToken");
      localStorage.removeItem("isLogin");
      await removeAccessToken();
    } catch (err) {
      console.error("Error removing token during logout:", err);
    } finally {
      setIsLoggedIn(false);
      window.dispatchEvent(new Event("auth-change"));
      toast.success("Logged out successfully");
      router.push("/");
      router.refresh();
    }
  }, [router]);

  const contextValue = useMemo<AuthContextValue>(
    () => ({
      isLoggedIn,
      isLoading,
      login,
      logout,
    }),
    [isLoggedIn, isLoading, login, logout]
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
