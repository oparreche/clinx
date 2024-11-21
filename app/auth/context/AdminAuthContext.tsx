"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api, authService } from '@/services/api';
import Cookies from 'js-cookie';
import type { User } from '../types';

interface AdminAuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  error: string | null;
  validationErrors: Record<string, string[]>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearErrors: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('admin_token');
    if (token) {
      authService.getProfile()
        .then(userData => {
          setUser(userData);
        })
        .catch(() => {
          Cookies.remove('admin_token');
          setUser(null);
        });
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setValidationErrors({});
      
      const response = await authService.adminLogin({ email, password });
      
      if (response.access_token) {
        Cookies.set('admin_token', response.access_token);
        setUser(response.user);
        router.push('/admin/dashboard');
      }
    } catch (err: any) {
      if (err.response?.status === 422) {
        setValidationErrors(err.response.data.errors || {});
      } else {
        setError(err.response?.data?.message || 'An error occurred during login');
      }
      throw err;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      Cookies.remove('admin_token');
      setUser(null);
      router.push('/admin/login');
    }
  };

  const clearErrors = () => {
    setError(null);
    setValidationErrors({});
  };

  return (
    <AdminAuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      error,
      validationErrors,
      login,
      logout,
      clearErrors
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
