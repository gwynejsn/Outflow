import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient } from '@/api/client';

export interface User {
  id: string;
  role: 'USER' | 'ADMIN';
  firstName: string;
  lastName: string;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
  updateUser: (updated: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function decodeJwt(token: string): { sub: string } | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT', error);
    return null;
  }
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('outflow_token'));
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchProfile = async (currentToken: string) => {
    try {
      const decoded = decodeJwt(currentToken);
      const email = decoded?.sub;
      
      try {
        const response = await apiClient.get<User>('/user/account');
        setUser(response.data);
      } catch (error: any) {
        if (error.response && error.response.status === 403 && email) {
          // If 403, retrieve profile from admin endpoint using the decoded email
          const response = await apiClient.get<User>(`/admin/users/email/${email}`);
          setUser(response.data);
        } else {
          throw error;
        }
      }
    } catch (error) {
      console.error('Failed to fetch profile', error);
      localStorage.removeItem('outflow_token');
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchProfile(token);
    } else {
      setIsLoading(false);
    }
  }, [token]);

  const login = async (newToken: string) => {
    localStorage.setItem('outflow_token', newToken);
    setToken(newToken);
    setIsLoading(true);
    await fetchProfile(newToken);
  };

  const logout = () => {
    localStorage.removeItem('outflow_token');
    setToken(null);
    setUser(null);
    setIsLoading(false);
  };

  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
    };
    window.addEventListener('unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('unauthorized', handleUnauthorized);
    };
  }, []);

  const handleUpdateUser = (updated: User) => {
    setUser(updated);
  };

  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isAdmin,
        user,
        token,
        isLoading,
        login,
        logout,
        updateUser: handleUpdateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
