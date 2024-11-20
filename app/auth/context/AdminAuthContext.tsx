'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService, LoginDto, AuthResponse } from '@/app/services/auth';
import Cookies from 'js-cookie';

interface AdminAuthContextType {
  user: AuthResponse['user'] | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
  validationErrors: Record<string, string[]> | null;
  clearErrors: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthResponse['user'] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]> | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check for existing admin token and fetch user profile
    const token = Cookies.get('adminToken');
    if (token) {
      authService.getProfile()
        .then(profile => {
          if (profile.role === 'admin') {
            setUser(profile);
          } else {
            Cookies.remove('adminToken');
            setUser(null);
          }
        })
        .catch(() => {
          Cookies.remove('adminToken');
          setUser(null);
        });
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setValidationErrors(null);
      
      const response = await authService.adminLogin({ email, password });
      
      if (response.user.role !== 'admin') {
        setError('Acesso não autorizado. Esta área é restrita para administradores.');
        throw new Error('Unauthorized');
      }
      
      // Store admin token in cookies
      Cookies.set('adminToken', response.access_token, { secure: true });
      setUser(response.user);
      
    } catch (err: any) {
      if (err.response?.data?.message) {
        if (typeof err.response.data.message === 'string') {
          setError(err.response.data.message);
        } else if (Array.isArray(err.response.data.message)) {
          setValidationErrors(
            err.response.data.message.reduce((acc: Record<string, string[]>, curr: any) => {
              const [field, error] = Object.entries(curr.constraints)[0];
              acc[curr.property] = [...(acc[curr.property] || []), error];
              return acc;
            }, {})
          );
        }
      } else {
        setError('Erro ao fazer login. Por favor, tente novamente.');
      }
      throw err;
    }
  };

  const logout = () => {
    Cookies.remove('adminToken');
    setUser(null);
    router.push('/admin/login');
  };

  const clearErrors = () => {
    setError(null);
    setValidationErrors(null);
  };

  return (
    <AdminAuthContext.Provider value={{ user, login, logout, error, validationErrors, clearErrors }}>
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
