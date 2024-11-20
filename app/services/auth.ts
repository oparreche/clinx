import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Configuração global do axios
axios.defaults.withCredentials = true;

// Interceptor para adicionar o token em todas as requisições
axios.interceptors.request.use(
  (config) => {
    const token = Cookies.get('adminToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de autenticação
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Se receber um 401, remove o token e redireciona para o login
      Cookies.remove('adminToken');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  name: string;
  clinicId?: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export const authService = {
  async login(data: LoginDto): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/api/auth/login`, data);
    return response.data;
  },

  async adminLogin(data: LoginDto): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/api/auth/admin/login`, data);
    return response.data;
  },

  async register(data: RegisterDto): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/api/auth/register`, data);
    return response.data;
  },

  async getProfile(): Promise<any> {
    const token = Cookies.get('adminToken');
    if (!token) {
      throw new Error('No token found');
    }

    const response = await axios.get(`${API_URL}/api/auth/profile`);
    return response.data;
  },

  async validateClinic(slug: string): Promise<boolean> {
    try {
      console.log(`Validating clinic with slug: ${slug}`);
      const response = await axios.get(`${API_URL}/api/clinics/validate/${slug}`);
      console.log('Clinic validation response:', response.data);
      return response.data.valid !== false;
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.error('Clinic not found:', error.response.data);
      } else {
        console.error('Error validating clinic:', error.response?.data || error.message);
      }
      return false;
    }
  }
};
