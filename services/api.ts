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

// Add request interceptor to add auth token
api.interceptors.request.use((config) => {
    const token = Cookies.get('token');
    if (token) {
        // Ensure token has 'Bearer ' prefix
        config.headers.Authorization = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    }
    return config;
});

// Add response interceptor to handle errors
api.interceptors.response.use(
    (response) => {
        console.log('Response:', { 
            url: response.config.url, 
            method: response.config.method, 
            status: response.status,
            data: response.data 
        });
        return response;
    },
    (error) => {
        console.error('API Error:', {
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            data: error.response?.data
        });
        
        // If token is invalid or expired, clear cookies and redirect to login
        if (error.response?.status === 401) {
            const clinicSlug = Cookies.get('clinicSlug');
            Cookies.remove('token');
            Cookies.remove('user');
            Cookies.remove('clinicSlug');
            window.location.href = clinicSlug ? `/${clinicSlug}/login` : '/login';
        }
        
        return Promise.reject(error);
    }
);

export const authService = {
    async login(data: LoginDto): Promise<AuthResponse> {
        try {
            const response = await api.post<AuthResponse>(API_ROUTES.AUTH.LOGIN, data);
            if (response.data.access_token) {
                // Save token with Bearer prefix
                const token = `Bearer ${response.data.access_token}`;
                Cookies.set('token', token);
                api.defaults.headers.common['Authorization'] = token;
                
                // Save clinic slug
                if (data.clinic_slug) {
                    Cookies.set('clinicSlug', data.clinic_slug);
                }
            }
            return response.data;
        } catch (error) {
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

    async logout(): Promise<void> {
        try {
            await api.post(API_ROUTES.AUTH.LOGOUT);
            Cookies.remove('token');
            Cookies.remove('admin_token');
            api.defaults.headers.common['Authorization'] = '';
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    }
};

export type { LoginDto, AdminLoginDto, RegisterDto, AuthResponse };
export { api };
export default api;
