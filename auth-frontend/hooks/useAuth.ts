"use client";
import { useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import { authApi, userApi } from "@/lib/api";
import { User } from "@/types";
import { useRouter } from "next/navigation";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUser = useCallback(async () => {
    try {
      const token = Cookies.get("accessToken");
      if (!token) { setLoading(false); return; }
      const { data } = await userApi.getProfile();
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUser(); }, [fetchUser]);

  const login = async (email: string, password: string) => {
    const { data } = await authApi.login({ email, password });
    Cookies.set("accessToken", data.tokens.accessToken, { expires: 1 / 96 });
    Cookies.set("refreshToken", data.tokens.refreshToken, { expires: 7 });
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    const refreshToken = Cookies.get("refreshToken") || "";
    try { await authApi.logout(refreshToken); } catch {}
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    setUser(null);
    router.push("/login");
  };

  const isAdmin = user?.role === "ADMIN";
  const isAuthenticated = !!user;

  return { user, loading, login, logout, isAdmin, isAuthenticated, refetch: fetchUser };
}
