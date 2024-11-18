'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname, useParams } from 'next/navigation';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAuth } from '@/app/auth/context/AuthContext';

// Public routes that don't use the authenticated layout
const PUBLIC_ROUTES = ['/login', '/register', '/forgot-password', '/unauthorized'];

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

const AuthenticatedLayout = ({ children }: AuthenticatedLayoutProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const { user, loading } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const clinicSlug = params?.clinicSlug as string;

  useEffect(() => {
    if (!loading && !user) {
      router.push(`/${clinicSlug}/login`);
    }
  }, [user, loading, router, clinicSlug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Don't show layout for public routes
  if (PUBLIC_ROUTES.includes(pathname)) {
    return <>{children}</>;
  }

  const handleSidebarCollapse = (collapsed: boolean) => {
    setIsSidebarCollapsed(collapsed);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar onCollapse={handleSidebarCollapse} />
      <div 
        className={`
          flex-1 transition-all duration-300
          ${isSidebarCollapsed ? 'ml-[72px]' : 'ml-64'}
        `}
      >
        <Header isSidebarCollapsed={isSidebarCollapsed} />
        <main className="p-8 pt-24 min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AuthenticatedLayout;