import axios from "axios";
import Cookies from 'js-cookie';

// API Base URL e rotas
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const API_ROUTES = {
    AUTH: {
        LOGIN: '/api/auth/login',
        ADMIN_LOGIN: '/api/admin/login',
        REGISTER: '/api/auth/register',
        LOGOUT: '/api/auth/logout',
        ME: '/api/auth/profile',
    },
    USERS: '/api/users',
    DOCTORS: '/api/doctors',
    PATIENTS: '/api/patients',
    APPOINTMENTS: '/api/clinics/appointments',
    CLINICS: {
        BASE: '/api/clinics',
        VALIDATE: (slug: string) => `/api/clinics/validate/${slug}`
    }
} as const;

// Interfaces
interface LoginDto {
    email: string;
    password: string;
    clinic_slug: string;
}

interface AdminLoginDto {
    email: string;
    password: string;
}

interface RegisterDto {
    email: string;
    password: string;
    name: string;
    clinicId?: string;
}

interface AuthResponse {
    access_token: string;
    user: {
        id: string;
        email: string;
        name: string;
        role: 'admin' | 'psicologo' | 'secretaria';
        clinicSlug?: string;
    };
}

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Initialize API with stored token if available
const token = Cookies.get('token');
if (token) {
    api.defaults.headers.common['Authorization'] = token;
}

// API interceptors for handling auth
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.error('API Error:', {
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            data: error.response?.data
        });
        
        // If token is invalid or expired, clear auth data and redirect
        if (error.response?.status === 401) {
            // Store clinic slug before clearing data
            const clinicSlug = Cookies.get('clinicSlug');
            
            // Clear all auth data
            Cookies.remove('token');
            Cookies.remove('clinicSlug');
            localStorage.removeItem('user');
            api.defaults.headers.common['Authorization'] = '';
            
            // Redirect to clinic-specific login page
            if (typeof window !== 'undefined') {
                const loginPath = clinicSlug ? `/c/${clinicSlug}/login` : '/login';
                console.log('Redirecting to:', loginPath);
                window.location.href = loginPath;
            }
        }
        
        return Promise.reject(error);
    }
);

export const authService = {
    async login(data: LoginDto): Promise<AuthResponse> {
        try {
            const response = await api.post<AuthResponse>(API_ROUTES.AUTH.LOGIN, data);
            if (response.data.access_token) {
                const token = `Bearer ${response.data.access_token}`;
                Cookies.set('token', token);
                api.defaults.headers.common['Authorization'] = token;
                
                if (data.clinic_slug) {
                    Cookies.set('clinicSlug', data.clinic_slug);
                }
            }
            return response.data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    async adminLogin(data: AdminLoginDto): Promise<AuthResponse> {
        try {
            const response = await api.post<AuthResponse>(API_ROUTES.AUTH.ADMIN_LOGIN, data);
            if (response.data.access_token) {
                Cookies.set('admin_token', response.data.access_token);
                api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
            }
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async register(data: RegisterDto): Promise<AuthResponse> {
        try {
            const response = await api.post<AuthResponse>(API_ROUTES.AUTH.REGISTER, data);
            if (response.data.access_token) {
                Cookies.set('token', response.data.access_token);
                api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
            }
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async getProfile(): Promise<any> {
        try {
            const response = await api.get(API_ROUTES.AUTH.ME);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async validateClinic(slug: string): Promise<{ valid: boolean; message?: string }> {
        try {
            const response = await api.get(API_ROUTES.CLINICS.VALIDATE(slug));
            return {
                valid: response.data.valid,
                message: response.data.message
            };
        } catch (error: any) {
            return {
                valid: false,
                message: error.response?.data?.message || 'Erro ao validar a clínica'
            };
        }
    },

    async logout(): Promise<{ clinicSlug: string | null }> {
        try {
            // Store clinic slug before making the request
            const clinicSlug = Cookies.get('clinicSlug') || null;
            
            const response = await api.post(API_ROUTES.AUTH.LOGOUT);
            
            // Clear all auth data
            Cookies.remove('token');
            Cookies.remove('clinicSlug');
            localStorage.removeItem('user');
            api.defaults.headers.common['Authorization'] = '';
            
            // Return the clinic slug for the caller to use
            return { clinicSlug };
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    }
};

export type { LoginDto, AdminLoginDto, RegisterDto, AuthResponse };
export { api };
export default api;
