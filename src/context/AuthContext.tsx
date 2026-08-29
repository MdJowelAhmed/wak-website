"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "sonner";
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

  const checkAuth = useCallback(() => {
    const token = Cookies.get("accessToken");
    const isLogin = localStorage.getItem("isLogin") === "true";
    setIsLoggedIn(Boolean(token || isLogin));
    setIsLoading(false);
  }, []);

  useEffect(() => {
    checkAuth();

    const handleStorage = (event: StorageEvent) => {
      if (event.key === "isLogin" || event.key === null) {
        checkAuth();
      }
    };

    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("auth-change", handleAuthChange);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("auth-change", handleAuthChange);
    };
  }, [checkAuth]);

  const login = async (token?: string) => {
    if (token) {
      Cookies.set("accessToken", token, { expires: 30, path: "/" });
      await setAccessToken(token);
    }
    localStorage.setItem("isLogin", "true");
    setIsLoggedIn(true);
    window.dispatchEvent(new Event("auth-change"));
  };

  const logout = async () => {
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
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
