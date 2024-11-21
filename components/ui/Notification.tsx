'use client';

import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';
import { defaultTheme } from '@/config/theme';

type NotificationType = 'success' | 'error' | 'info';

interface NotificationProps {
  type: NotificationType;
  message: string;
  duration?: number;
  onClose?: () => void;
}

export function Notification({ type, message, duration = 5000, onClose }: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

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

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FaCheckCircle className="text-green-500" />;
      case 'error':
        return <FaExclamationCircle className="text-red-500" />;
      case 'info':
        return <FaInfoCircle style={{ color: defaultTheme.primaryColor }} />;
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'success':
        return 'border-green-500';
      case 'error':
        return 'border-red-500';
      case 'info':
        return 'border-blue-500';
    }
  };

  return (
    <div
      className={`fixed top-4 right-4 p-4 bg-white rounded-lg shadow-lg border-l-4 ${getBorderColor()} flex items-start gap-3 min-w-[320px] max-w-md animate-slide-in`}
    >
      <div className="flex-shrink-0 text-xl">{getIcon()}</div>
      <div className="flex-grow">{message}</div>
      <button
        onClick={() => {
          setIsVisible(false);
          onClose?.();
        }}
        className="flex-shrink-0 text-gray-400 hover:text-gray-600"
      >
        <FaTimes />
      </button>
    </div>
  );
}

// Gerenciador global de notificações
let notificationId = 0;
const notifications: Map<number, React.ReactElement> = new Map();

export function showNotification(props: Omit<NotificationProps, 'onClose'>) {
  const id = notificationId++;
  const handleClose = () => {
    notifications.delete(id);
    // Force update
    document.dispatchEvent(new CustomEvent('notification-update'));
  };

  const notification = <Notification key={id} {...props} onClose={handleClose} />;
  notifications.set(id, notification);
  // Force update
  document.dispatchEvent(new CustomEvent('notification-update'));
}
