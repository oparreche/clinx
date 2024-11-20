import { LoginCredentials, RegisterData, UserRole } from '../types';

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): string[] => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('A senha deve ter pelo menos 8 caracteres');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('A senha deve conter pelo menos uma letra maiúscula');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('A senha deve conter pelo menos uma letra minúscula');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('A senha deve conter pelo menos um número');
  }
  if (!/[!@#$%^&*]/.test(password)) {
    errors.push('A senha deve conter pelo menos um caractere especial (!@#$%^&*)');
  }

  return errors;
};

export const validateRole = (role: string): boolean => {
  const validRoles: UserRole[] = ['admin', 'doctor', 'patient'];
  return validRoles.includes(role as UserRole);
};

export const validateLoginCredentials = (credentials: LoginCredentials): string[] => {
  const errors: string[] = [];

  if (!validateEmail(credentials.email)) {
    errors.push('Por favor, insira um endereço de email válido');
  }

  if (!credentials.password) {
    errors.push('A senha é obrigatória');
  }

  return errors;
};

export const validateRegistrationData = (data: RegisterData): string[] => {
  const errors: string[] = [];

  if (!data.name || data.name.length < 2) {
    errors.push('O nome deve ter pelo menos 2 caracteres');
  }

  if (!validateEmail(data.email)) {
    errors.push('Por favor, insira um endereço de email válido');
  }

  const passwordErrors = validatePassword(data.password);
  errors.push(...passwordErrors);

  if ('password_confirmation' in data && data.password !== data.password_confirmation) {
    errors.push('As senhas não coincidem');
  }

  if (!validateRole(data.role)) {
    errors.push('Tipo de usuário inválido');
  }

  if (data.role === 'doctor') {
    if (!('tenant_id' in data) || !data.tenant_id) {
      errors.push('A clínica é obrigatória para médicos');
    }
  }

  return errors;
};