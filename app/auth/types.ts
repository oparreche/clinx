export type UserRole = 'admin' | 'psicologo' | 'secretaria';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  clinicSlug?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
  clinicSlug: string;  
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  clinicSlug?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  clinicSlug?: string;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
}
