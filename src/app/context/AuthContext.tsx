import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { userApi } from '../services/api';

interface AuthUser {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  role: string;
  referralCode?: string;
  walletBalance?: number;
  sponsor?: { name?: string; email?: string; referralCode?: string };
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, referralCode?: string) => Promise<void>;
  setSession: (authToken: string, authUser: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const normalizeUser = (raw: any): AuthUser => {
  if (!raw) return raw;
  const resolvedId = raw._id || raw.id;
  return {
    ...raw,
    id: resolvedId,
    _id: resolvedId,
  };
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore auth state and validate token on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('auth_user');
    const restore = async () => {
      if (!(savedToken && savedUser)) {
        setLoading(false);
        return;
      }
      try {
        setToken(savedToken);
        const parsedUser = normalizeUser(JSON.parse(savedUser));
        setUser(parsedUser);
        const me = await userApi.getMe();
        const userData = normalizeUser(me?.data);
        if (userData) {
          setUser(userData);
          localStorage.setItem('auth_user', JSON.stringify(userData));
        }
      } catch {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    restore();
  }, []);

  const login = async (email: string, password: string) => {
    const response = (await userApi.login(email, password)) as {
      data?: { user: AuthUser; token: string };
      user?: AuthUser;
      token?: string;
      message?: string;
    };
    const userData = normalizeUser(response.data?.user ?? response.user);
    const authToken = response.data?.token ?? response.token;
    if (!userData || !authToken) {
      throw new Error(response.message || 'Invalid login response from server');
    }
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('auth_token', authToken);
    localStorage.setItem('auth_user', JSON.stringify(userData));
  };

  const signup = async (name: string, email: string, password: string, referralCode?: string) => {
    await userApi.register(name, email, password, referralCode);
    await login(email, password);
  };

  const setSession = useCallback((authToken: string, authUser: AuthUser) => {
    const normalized = normalizeUser(authUser);
    setToken(authToken);
    setUser(normalized);
    localStorage.setItem('auth_token', authToken);
    localStorage.setItem('auth_user', JSON.stringify(normalized));
  }, []);

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        signup,
        setSession,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
