import React from 'react';
import { FaBuilding, FaUsers, FaCog, FaBell, FaLock } from 'react-icons/fa';

interface ConfigSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function ConfigSidebar({ activeTab, setActiveTab }: ConfigSidebarProps) {
  const tabs = [
    { id: 'unidades', label: 'Unidades', icon: FaBuilding },
    { id: 'usuarios', label: 'Usuários', icon: FaUsers },
    { id: 'notificacoes', label: 'Notificações', icon: FaBell },
    { id: 'seguranca', label: 'Segurança', icon: FaLock },
    { id: 'geral', label: 'Geral', icon: FaCog },
  ];

  return (
    <div className="w-64 bg-white rounded-lg shadow-md p-4">
      <nav className="space-y-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}