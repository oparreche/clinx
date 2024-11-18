'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Tenant } from '../../types/tenant';
import { TenantContext } from '../../auth/types';

const TenantContext = createContext<TenantContext | undefined>(undefined);

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const loadTenant = async () => {
      try {
        const segments = pathname.split('/');
        const slug = segments[1];

        if (slug) {
          setIsLoading(true);
          // TODO: Substituir por chamada real à API
          const mockTenant: Tenant = {
            id: '1',
            slug,
            name: 'Clínica ' + slug,
            plan: 'premium',
            settings: {
              theme: {
                primaryColor: '#2A3547',
                secondaryColor: '#3B82F6'
              },
              features: {
                appointments: true,
                financialManagement: true,
                multipleLocations: false
              }
            },
            status: 'active',
            createdAt: new Date(),
            updatedAt: new Date()
          };

          setTenant(mockTenant);
        }
      } catch (error) {
        console.error('Error loading tenant:', error);
        setTenant(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadTenant();
  }, [pathname]);

  return (
    <TenantContext.Provider value={{ tenant, setTenant, isLoading }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
}
