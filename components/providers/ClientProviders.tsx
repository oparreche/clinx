'use client';

import { AuthProvider } from '@/auth/context/AuthContext';
import { AdminAuthProvider } from '@/auth/context/AdminAuthContext';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminAuthProvider>
        {children}
      </AdminAuthProvider>
    </AuthProvider>
  );
}
