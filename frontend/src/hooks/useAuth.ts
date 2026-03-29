"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";
import {
  setToken,
  setRefreshToken,
  setStoredUser,
  clearAuthState,
  isAuthenticated,
  getStoredUser,
} from "@/lib/auth";
import type { User, LoginRequest, RegisterRequest } from "@/types";
import { AxiosError } from "axios";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

interface UseAuthReturn extends AuthState {
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  fetchCurrentUser: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  });

  // Initialize auth state from storage
  useEffect(() => {
    const storedUser = getStoredUser();
    const authenticated = isAuthenticated();

    if (authenticated && storedUser) {
      setState({
        user: storedUser,
        isLoading: false,
        isAuthenticated: true,
        error: null,
      });
    } else if (authenticated && !storedUser) {
      // Token exists but no cached user — fetch from API
      fetchCurrentUser();
    } else {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCurrentUser = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));
      const response = await authApi.me();
      const user = response.data;
      setStoredUser(user);
      setState({
        user,
        isLoading: false,
        isAuthenticated: true,
        error: null,
      });
    } catch (err: any) {
      // Only clear auth on 401 (invalid token), not on network errors
      const status = err?.response?.status;
      if (status === 401) {
        clearAuthState();
        setState({ user: null, isLoading: false, isAuthenticated: false, error: null });
      } else {
        // Network error or server error — keep existing auth state
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    }
  }, []);

  const login = useCallback(
    async (data: LoginRequest) => {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));
        const response = await authApi.login(data);
        const { user, token, refreshToken } = response.data;

        setToken(token);
        if (refreshToken) setRefreshToken(refreshToken);
        setStoredUser(user);

        setState({
          user,
          isLoading: false,
          isAuthenticated: true,
          error: null,
        });

        router.push("/dashboard");
      } catch (err) {
        const axiosError = err as AxiosError<{ message: string }>;
        const message =
          axiosError.response?.data?.message ||
          "Login failed. Please check your credentials.";
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: message,
        }));
        throw new Error(message);
      }
    },
    [router]
  );

  const register = useCallback(
    async (data: RegisterRequest) => {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));
        const response = await authApi.register(data);
        const { user, token, refreshToken } = response.data;

        setToken(token);
        if (refreshToken) setRefreshToken(refreshToken);
        setStoredUser(user);

        setState({
          user,
          isLoading: false,
          isAuthenticated: true,
          error: null,
        });

        router.push("/dashboard");
      } catch (err) {
        const axiosError = err as AxiosError<{ message: string }>;
        const message =
          axiosError.response?.data?.message ||
          "Registration failed. Please try again.";
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: message,
        }));
        throw new Error(message);
      }
    },
    [router]
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // Ignore logout API errors — clear state regardless
    } finally {
      clearAuthState();
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
      });
      router.push("/login");
    }
  }, [router]);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    login,
    register,
    logout,
    clearError,
    fetchCurrentUser,
  };
}
