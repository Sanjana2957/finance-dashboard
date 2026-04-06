import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'viewer' | 'analyst' | 'admin';
  isActive: boolean;
};

type UserContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async (token: string) => {
    try {
      apiClient.defaults.headers.common['x-user-id'] = token;
      const res = await apiClient.get('/auth/me');
      setUser(res.data.data);
    } catch (err) {
      console.error('Session validation failed', err);
      localStorage.removeItem('token');
      delete apiClient.defaults.headers.common['x-user-id'];
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchCurrentUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const res = await apiClient.post('/auth/login', { email, password });
      const { token, user: userData } = res.data.data;
      
      localStorage.setItem('token', token);
      apiClient.defaults.headers.common['x-user-id'] = token;
      setUser(userData);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Security verification failed.';
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete apiClient.defaults.headers.common['x-user-id'];
    setUser(null);
    window.location.href = '/';
  };

  return (
    <UserContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(UserContext);
  if (context === undefined) throw new Error('useAuth must be used within a UserProvider');
  return context;
};
