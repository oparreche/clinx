import { Tenant } from '../types/tenant';

export type UserRole = 'admin' | 'patient' | 'doctor';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  tenant: Tenant | null;
  slug: string | null;
}

export interface TenantContext {
  tenant: Tenant | null;
  setTenant: (tenant: Tenant | null) => void;
  isLoading: boolean;
}