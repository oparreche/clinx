import React from 'react';
import { IconType } from 'react-icons';

interface ConfigCardProps {
  title: string;
  description?: string;
  icon: React.ReactNode;
  iconBgColor: string;
  iconColor: string;
  children: React.ReactNode;
}

export default function ConfigCard({
  title,
  description,
  icon,
  iconBgColor,
  iconColor,
  children
}: ConfigCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg border">
      <div className="flex items-center space-x-3 mb-4">
        <div className={`p-2 ${iconBgColor} rounded-lg`}>
          <div className={`h-5 w-5 ${iconColor}`}>{icon}</div>
        </div>
        <div>
          <h3 className="text-lg font-medium">{title}</h3>
          {description && <p className="text-sm text-gray-500">{description}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}