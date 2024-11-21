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

  // Initialize authentication state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = Cookies.get('token');
        const clinicSlug = Cookies.get('clinicSlug');
        const storedUser = localStorage.getItem('user');
        
        if (!token || !clinicSlug || !storedUser) {
          handleAuthFailure();
          setIsLoading(false);
          return;
        }

        // Set token in API headers
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        try {
          // First try to use stored user data
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setIsAuthenticated(true);

          // Then validate token and update user data in background
          const userData = await authService.getProfile();
          const updatedUser: User = {
            ...userData,
            clinicSlug
          };

          setUser(updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));
        } catch (error) {
          console.error('Error validating user session:', error);
          handleAuthFailure();
          router.push(`/${clinicSlug}/login`);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        handleAuthFailure();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [router]);

  const handleAuthFailure = () => {
    // Clear auth data but keep lastClinicSlug
    const lastClinicSlug = localStorage.getItem('lastClinicSlug');
    
    // Clear all auth data
    Cookies.remove('token');
    Cookies.remove('clinicSlug');
    localStorage.removeItem('user');
    api.defaults.headers.common['Authorization'] = '';
    setUser(null);
    setIsAuthenticated(false);
    
    // Restore lastClinicSlug if it existed
    if (lastClinicSlug) {
      localStorage.setItem('lastClinicSlug', lastClinicSlug);
    }
  };

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

      // Set authentication data
      Cookies.set('token', response.access_token);
      Cookies.set('clinicSlug', credentials.clinicSlug);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Update application state
      api.defaults.headers.common['Authorization'] = `Bearer ${response.access_token}`;
      setUser(user);
      setIsAuthenticated(true);

      // Navigate to dashboard
      router.push(`/${credentials.clinicSlug}/dashboard`);
    } catch (error) {
      console.error('Login error:', error);
      handleAuthFailure();
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
      api.defaults.headers.common['Authorization'] = `Bearer ${response.access_token}`;
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
      // Get clinic slug from multiple sources, prioritizing the most recent
      const currentClinicSlug = user?.clinicSlug || 
                               Cookies.get('clinicSlug') || 
                               localStorage.getItem('lastClinicSlug');
      
      // Call logout API
      await authService.logout();
      
      // Clear all auth data
      handleAuthFailure();
      
      // Redirect to clinic-specific login
      if (currentClinicSlug) {
        // Keep the last clinic slug for future redirects
        localStorage.setItem('lastClinicSlug', currentClinicSlug);
        router.push(`/${currentClinicSlug}/login`);
      } else {
        // Fallback to main login only if no clinic slug is found
        console.warn('No clinic slug found during logout, redirecting to main login');
        router.push('/login');
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, clear local auth data and redirect to clinic login
      const clinicSlug = user?.clinicSlug || 
                        Cookies.get('clinicSlug') || 
                        localStorage.getItem('lastClinicSlug');
      
      handleAuthFailure();
      
      if (clinicSlug) {
        // Keep the last clinic slug for future redirects
        localStorage.setItem('lastClinicSlug', clinicSlug);
        router.push(`/${clinicSlug}/login`);
      } else {
        router.push('/login');
      }
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
