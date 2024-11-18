export type UserRole = 'admin' | 'doctor' | 'patient';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  tenant_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: UserRole;
  tenant_id?: number;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  tenant: any | null;
  slug: string | null;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}
