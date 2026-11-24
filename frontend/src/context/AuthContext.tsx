import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '../api/client';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (emailOrPhone: string, password: string) => Promise<{ success: boolean; message: string; requiresOtp?: boolean }>;
  signup: (data: SignupData) => Promise<{ success: boolean; message: string }>;
  verifyOtp: (identifier: string, code: string, purpose?: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  demoLogin: (role: 'admin' | 'author' | 'reader') => Promise<void>;
  updateUser: (user: User) => void;
}

interface SignupData {
  fullName: string;
  emailOrPhone: string;
  password: string;
  role?: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('wl_access_token');
    const stored = localStorage.getItem('wl_user');
    if (token && stored) {
      try {
        setUser(JSON.parse(stored));
        // Optionally refresh from server
        authApi.me().then(({ data }) => {
          setUser(data);
          localStorage.setItem('wl_user', JSON.stringify(data));
        }).catch(() => {
          // Token expired, clear auth
          localStorage.removeItem('wl_access_token');
          localStorage.removeItem('wl_refresh_token');
          localStorage.removeItem('wl_user');
          setUser(null);
        });
      } catch {
        setUser(null);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (emailOrPhone: string, password: string) => {
    try {
      const { data } = await authApi.login({ emailOrPhone, password });
      if (data.requiresOtp) {
        return { success: false, message: data.message, requiresOtp: true };
      }
      if (data.accessToken) {
        localStorage.setItem('wl_access_token', data.accessToken);
        localStorage.setItem('wl_refresh_token', data.refreshToken);
        localStorage.setItem('wl_user', JSON.stringify(data.user));
        setUser(data.user);
        return { success: true, message: 'Login successful.' };
      }
      return { success: false, message: data.message || 'Login failed.' };
    } catch (err: any) {
      return { success: false, message: err.response?.data?.message || 'Login failed.' };
    }
  };

  const signup = async (signupData: SignupData) => {
    try {
      const { data } = await authApi.signup(signupData);
      if (data.accessToken) {
        localStorage.setItem('wl_access_token', data.accessToken);
        localStorage.setItem('wl_refresh_token', data.refreshToken);
        localStorage.setItem('wl_user', JSON.stringify(data.user));
        setUser(data.user);
        return { success: true, message: 'Account created successfully.' };
      }
      return { success: false, message: data.message || 'Registration failed.' };
    } catch (err: any) {
      return { success: false, message: err.response?.data?.message || 'Registration failed.' };
    }
  };

  const verifyOtp = async (identifier: string, code: string, purpose = 'Login') => {
    try {
      const { data } = await authApi.verifyOtp({ identifier, code, purpose });
      if (data.accessToken) {
        localStorage.setItem('wl_access_token', data.accessToken);
        localStorage.setItem('wl_refresh_token', data.refreshToken);
        localStorage.setItem('wl_user', JSON.stringify(data.user));
        setUser(data.user);
        return { success: true, message: 'OTP verified.' };
      }
      return { success: false, message: data.message || 'OTP verification failed.' };
    } catch (err: any) {
      return { success: false, message: err.response?.data?.message || 'OTP verification failed.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('wl_access_token');
    localStorage.removeItem('wl_refresh_token');
    localStorage.removeItem('wl_user');
    setUser(null);
  };

  const demoLogin = async (role: 'admin' | 'author' | 'reader') => {
    const credentials = {
      admin: { emailOrPhone: 'admin@theworldledger.com', password: 'Admin@123456!' },
      author: { emailOrPhone: 'author@theworldledger.com', password: 'Author@123456!' },
      reader: { emailOrPhone: 'reader@theworldledger.com', password: 'Reader@123456!' },
    };
    await login(credentials[role].emailOrPhone, credentials[role].password);
  };

  const updateUser = (updated: User) => {
    setUser(updated);
    localStorage.setItem('wl_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{
      user, isLoading, isAuthenticated: !!user,
      login, signup, verifyOtp, logout, demoLogin, updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

