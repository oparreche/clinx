export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const API_ROUTES = {
  AUTH: {
    LOGIN: '/api/login',
    REGISTER: '/api/register',
    LOGOUT: '/api/logout',
    ME: '/api/me',
  },
  USERS: '/api/users',
  DOCTORS: '/api/doctors',
  PATIENTS: '/api/patients',
  APPOINTMENTS: '/api/appointments',
  CLINICS: '/api/clinics',
} as const;
