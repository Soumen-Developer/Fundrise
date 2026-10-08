import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '@/lib/api';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'visitor' | 'user' | 'admin';
}

interface AuthContextValue {
  user: User | null;
  role: 'visitor' | 'user' | 'admin';
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};

export const AuthProvider = ({
  children
}: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<'visitor' | 'user' | 'admin'>('visitor');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('jwt');
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          const res = await api.get('/auth/me');
          if (res.data?.user) {
            setUser(res.data.user);
            setRole(res.data.user.role);
          }
        } catch (error) {
          localStorage.removeItem('jwt');
          delete api.defaults.headers.common['Authorization'];
          setUser(null);
          setRole('visitor');
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    const data = res.data;
    if (data?.token) {
      localStorage.setItem('jwt', data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      const userObj: User = {
        id: data.id || data._id,
        name: data.name,
        email: data.email,
        role: data.role || 'user',
      };
      setUser(userObj);
      setRole(userObj.role);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await api.post('/auth/register', { name, email, password });
    const data = res.data;
    if (data?.token) {
      localStorage.setItem('jwt', data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      const userObj: User = {
        id: data.id || data._id,
        name: data.name,
        email: data.email,
        role: data.role || 'user',
      };
      setUser(userObj);
      setRole(userObj.role);
    } else {
      await login(email, password);
    }
  };

  const logout = () => {
    try {
      api.post('/auth/logout').catch(() => {});
    } finally {
      localStorage.removeItem('jwt');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
      setRole('visitor');
    }
  };

  return (
    <AuthContext.Provider value={{ user, role, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};