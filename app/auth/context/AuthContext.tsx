"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api, authService } from '@/services/api';
import Cookies from 'js-cookie';
import type { User, LoginCredentials, RegisterData, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = token;
      authService.getProfile()
        .then(userData => {
          setUser(userData);
          setIsAuthenticated(true);
        })
        .catch(() => {
          Cookies.remove('token');
          api.defaults.headers.common['Authorization'] = '';
          setUser(null);
          setIsAuthenticated(false);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await authService.login({
        email: credentials.email,
        password: credentials.password,
        clinic_slug: credentials.clinicSlug
      });

      const user: User = {
        id: response.user.id,
        email: response.user.email,
        name: response.user.name,
        role: response.user.role,
        clinicSlug: credentials.clinicSlug
      };

      Cookies.set('token', response.access_token);
      api.defaults.headers.common['Authorization'] = response.access_token;
      setUser(user);
      setIsAuthenticated(true);
      router.push(`/${credentials.clinicSlug}/dashboard`);
    } catch (error) {
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const response = await authService.register(data);

      const user: User = {
        id: response.user.id,
        email: response.user.email,
        name: response.user.name,
        role: response.user.role,
        clinicSlug: data.clinicSlug
      };

      Cookies.set('token', response.access_token);
      api.defaults.headers.common['Authorization'] = response.access_token;
      setUser(user);
      setIsAuthenticated(true);
      if (data.clinicSlug) {
        router.push(`/${data.clinicSlug}/dashboard`);
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      Cookies.remove('token');
      api.defaults.headers.common['Authorization'] = '';
      setUser(null);
      setIsAuthenticated(false);
      router.push('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        clinicSlug: user?.clinicSlug,
        login,
        register,
        logout
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
