'use client';

import { AuthProvider } from '@/app/auth/context/AuthContext';
import { AdminAuthProvider } from '@/app/auth/context/AdminAuthContext';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminAuthProvider>
        {children}
      </AdminAuthProvider>
    </AuthProvider>
  );
}
