import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'viewer' | 'analyst' | 'admin';
  isActive: boolean;
};

type DemoUserContextType = {
  user: User | null;
  loading: boolean;
  switchUser: (id: string) => Promise<void>;
  demoUsers: { id: string, name: string, role: string }[];
};

const DemoUserContext = createContext<DemoUserContextType | undefined>(undefined);

export const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export const DemoUserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const demoUsers = [
    { id: 'u1', name: 'Admin User', role: 'admin' },
    { id: 'u2', name: 'Analyst User', role: 'analyst' },
    { id: 'u3', name: 'Viewer User', role: 'viewer' },
  ];

  const fetchUser = async (id: string) => {
    try {
      setLoading(true);
      apiClient.defaults.headers.common['x-user-id'] = id;
      localStorage.setItem('selectedDemoUserId', id);
      
      // We'll use getMe or similar. For now let's just get from the demo list to be fast, 
      // but real project should fetch from /api/auth/me if available.
      // However the assignment says x-user-id is the source of truth.
      const res = await apiClient.get('/api/auth/me');
      setUser(res.data.data);
    } catch (err) {
      console.error('Failed to switch user', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedId = localStorage.getItem('selectedDemoUserId') || 'u1';
    fetchUser(savedId);
  }, []);

  const switchUser = async (id: string) => {
    await fetchUser(id);
    // Refresh to clear any states if necessary, but DemoUserProvider handles most
    window.location.reload(); 
  };

  return (
    <DemoUserContext.Provider value={{ user, loading, switchUser, demoUsers }}>
      {children}
    </DemoUserContext.Provider>
  );
};

export const useDemoUser = () => {
  const context = useContext(DemoUserContext);
  if (context === undefined) throw new Error('useDemoUser must be used within a DemoUserProvider');
  return context;
};
