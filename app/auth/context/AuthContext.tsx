"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { login, register, logout, getMe } from "@/app/services/api";
import { useRouter, useParams } from "next/navigation";

interface ValidationErrors {
    [key: string]: string[];
}

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    tenant_id: number;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
    validationErrors: ValidationErrors | null;
    clinicSlug: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (userData: any) => Promise<void>;
    logout: () => Promise<void>;
    clearErrors: () => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    error: null,
    validationErrors: null,
    clinicSlug: null,
    login: async () => {},
    register: async () => {},
    logout: async () => {},
    clearErrors: () => {},
});

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState<ValidationErrors | null>(null);
    const router = useRouter();
    const params = useParams();
    const clinicSlug = params?.clinicSlug as string;

    useEffect(() => {
        const initAuth = async () => {
            try {
                const storedUser = localStorage.getItem("user");
                const storedClinicSlug = localStorage.getItem("clinicSlug");
                
                if (storedUser && storedClinicSlug) {
                    setUser(JSON.parse(storedUser));
                    const updatedUser = await getMe();
                    setUser(updatedUser);
                    localStorage.setItem("user", JSON.stringify(updatedUser));
                }
            } catch (error) {
                console.error("Auth initialization error:", error);
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                localStorage.removeItem("clinicSlug");
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    const clearErrors = () => {
        setError(null);
        setValidationErrors(null);
    };

    const handleLogin = async (email: string, password: string) => {
        try {
            clearErrors();
            if (!clinicSlug) {
                setError("Clínica não encontrada");
                return;
            }
            const { user, token } = await login(email, password, clinicSlug);
            
            // Save data to localStorage
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            if (clinicSlug) {
                localStorage.setItem("clinicSlug", clinicSlug);
            }
            
            // Save data to cookie
            document.cookie = `auth_token=${JSON.stringify({ 
                user, 
                clinicSlug,
                timestamp: Date.now() 
            })}; path=/`;
            
            setUser(user);
            
            const redirectPath = user.role === 'admin' ? 'dashboard' : 
                               user.role === 'doctor' ? 'medico' : 
                               'paciente';
            
            const url = `/${clinicSlug}/${redirectPath}`;
            console.log('Redirecting to:', url);
            
            // Use window.location for hard navigation instead of router.push
            window.location.href = url;
        } catch (error: any) {
            if (error.response?.status === 422) {
                setValidationErrors(error.response.data.errors);
                setError(error.response.data.message);
            } else {
                setError(error.response?.data?.message || "Ocorreu um erro ao fazer login");
            }
            throw error;
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            setUser(null);
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.removeItem("clinicSlug");
            document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
            window.location.href = `/${clinicSlug}/login`;
        } catch (error) {
            console.error("Logout error:", error);
            setUser(null);
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.removeItem("clinicSlug");
            document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
            window.location.href = `/${clinicSlug}/login`;
        }
    };

    const handleRegister = async (userData: any) => {
        try {
            clearErrors();
            const { user, token } = await register(userData);
            
            // Save data to localStorage first
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("clinicSlug", clinicSlug);
            
            // Save data to cookie
            document.cookie = `auth_token=${JSON.stringify({ 
                user, 
                clinicSlug,
                timestamp: Date.now() 
            })}; path=/`;
            
            // Update state
            setUser(user);
            
            // Get redirect path
            const redirectPath = getRedirectPath(user.role);
            
            // Use router.push for client-side navigation
            await router.push(redirectPath);
            
        } catch (error: any) {
            if (error.response?.status === 422) {
                setValidationErrors(error.response.data.errors);
                setError(error.response.data.message);
            } else {
                setError(error.response?.data?.message || "Ocorreu um erro ao fazer o registro");
            }
            throw error;
        }
    };

    const getRedirectPath = (userRole: string): string => {
        switch (userRole) {
            case 'admin':
                return `/${clinicSlug}/dashboard`;
            case 'doctor':
                return `/${clinicSlug}/medico`;
            case 'patient':
                return `/${clinicSlug}/paciente`;
            default:
                return `/${clinicSlug}/dashboard`;
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                error,
                validationErrors,
                clinicSlug,
                login: handleLogin,
                register: handleRegister,
                logout: handleLogout,
                clearErrors,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
