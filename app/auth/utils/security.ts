import { User } from '../types';

export const sanitizeUserData = (userData: any): Omit<User, 'password'> => {
  const { password, ...sanitizedData } = userData;
  return sanitizedData;
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const [, payload] = token.split('.');
    const decodedPayload = JSON.parse(atob(payload));
    return Date.now() >= decodedPayload.exp * 1000;
  } catch {
    return true;
  }
};