'use client';

import { useAuth } from '@/app/auth/context/AuthContext';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const isPublicRoute = (path: string) => {
  return path.endsWith('/login') || 
         path.endsWith('/register') || 
         path.endsWith('/forgot-password') || 
         path.endsWith('/unauthorized');
};

export default function ClinicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Load sidebar state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState !== null) {
      setIsSidebarCollapsed(savedState === 'true');
    }
  }, []);

  useEffect(() => {
    if (!isLoading && !user && !isPublicRoute(pathname)) {
      router.push('/login');
    }
  }, [user, isLoading, router, pathname]);

  const handleSidebarCollapse = (collapsed: boolean) => {
    setIsSidebarCollapsed(collapsed);
    // Save to localStorage whenever state changes
    localStorage.setItem('sidebarCollapsed', String(collapsed));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Don't show layout for public routes
  if (isPublicRoute(pathname)) {
    return <>{children}</>;
  }

  if (!user) {
    return null;
  }

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
       
        <main className="min-h-[calc(100vh-4rem)]">
          <div className="bg-white rounded-lg shadow-sm h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
