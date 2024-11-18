'use client';

import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';
import { useTenant } from '@/app/tenant/context/TenantContext';

type NotificationType = 'success' | 'error' | 'info';

interface NotificationProps {
  type: NotificationType;
  message: string;
  duration?: number;
  onClose?: () => void;
}

export function Notification({ type, message, duration = 5000, onClose }: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true);
  const { tenant } = useTenant();
  const primaryColor = tenant?.settings?.theme?.primaryColor || '#2A3547';

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!isVisible) return null;

  const icons = {
    success: FaCheckCircle,
    error: FaExclamationCircle,
    info: FaInfoCircle
  };

  const colors = {
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200'
  };

  const Icon = icons[type];

  return (
    <div
      className={`fixed top-4 right-4 p-4 rounded-lg border shadow-lg max-w-sm animate-slide-in ${colors[type]}`}
      style={{ zIndex: 9999 }}
    >
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5" />
        <p className="flex-1">{message}</p>
        <button
          onClick={() => {
            setIsVisible(false);
            onClose?.();
          }}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <FaTimes />
        </button>
      </div>
    </div>
  );
}

// Gerenciador global de notificações
let notificationId = 0;
const notifications: Map<number, React.ReactElement> = new Map();

export const showNotification = (props: Omit<NotificationProps, 'onClose'>) => {
  const id = notificationId++;
  const notification = (
    <Notification
      key={id}
      {...props}
      onClose={() => {
        notifications.delete(id);
      }}
    />
  );
  notifications.set(id, notification);
  return id;
};
