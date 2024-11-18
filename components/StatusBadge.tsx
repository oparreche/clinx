import React from 'react';

interface StatusBadgeProps {
  status: string;
  type?: 'success' | 'warning' | 'error' | 'info';
}

export default function StatusBadge({ status, type = 'success' }: StatusBadgeProps) {
  const colors = {
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
  };

  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colors[type]}`}>
      {status}
    </span>
  );
}