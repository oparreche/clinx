'use client';

import { AuthProvider } from '@/app/auth/context/AuthContext';
import { TenantProvider } from '@/app/tenant/context/TenantContext';

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TenantProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </TenantProvider>
  );
}
