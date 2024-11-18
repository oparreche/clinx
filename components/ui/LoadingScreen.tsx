'use client';

import React from 'react';
import { useTenant } from '@/app/tenant/context/TenantContext';

export function LoadingScreen() {
  const { tenant } = useTenant();
  const primaryColor = tenant?.settings?.theme?.primaryColor || '#2A3547';

  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div 
            className="w-16 h-16 rounded-full border-4 border-gray-200 animate-spin"
            style={{ borderTopColor: primaryColor }}
          />
        </div>
        <div className="text-lg font-medium text-gray-700">
          Carregando...
        </div>
      </div>
    </div>
  );
}

export function LoadingIndicator({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const { tenant } = useTenant();
  const primaryColor = tenant?.settings?.theme?.primaryColor || '#2A3547';
  
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  };

  return (
    <div 
      className={`rounded-full border-gray-200 animate-spin ${sizeClasses[size]}`}
      style={{ borderTopColor: primaryColor }}
    />
  );
}
