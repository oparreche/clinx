'use client';

import { useState, useEffect, useRef } from 'react';
import { FaBell, FaCog, FaSearch, FaUserCircle } from 'react-icons/fa';
import { useAuth } from '@/auth/context/AuthContext';

interface Notification {
  id: number;
  title: string;
  description: string;
  time: string;
  read: boolean;
}

interface HeaderProps {
  isSidebarCollapsed: boolean;
}

const Header = ({ isSidebarCollapsed }: HeaderProps) => {
  const { logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const [notifications] = useState<Notification[]>([
    {
      id: 1,
      title: 'Nova Consulta Agendada',
      description: 'Carlos Silva - 14:00',
      time: '5 min atrás',
      read: false,
    },
    {
      id: 2,
      title: 'Lembrete',
      description: 'Reunião com equipe às 15:00',
      time: '1 hora atrás',
      read: false,
    },
    {
      id: 3,
      title: 'Pagamento Recebido',
      description: 'Maria Santos - R$ 150,00',
      time: '2 horas atrás',
      read: true,
    },
  ]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header 
      className={`
        bg-white shadow-sm h-16 fixed top-0 z-40
        transition-all duration-300
        ${isSidebarCollapsed ? 'left-[72px]' : 'left-64'}
        right-0
      `}
    >
      <div className="h-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-full">
          <div className="flex-1 flex items-center">
            <div className="max-w-2xl w-full lg:max-w-xs relative">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="relative">
              <select className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-colors duration-200">
                <option>UNIDADE 1</option>
                <option>UNIDADE 2</option>
              </select>
            </div>

            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-lg hover:bg-gray-100 relative transition-colors duration-200"
                aria-label={`Notificações ${unreadCount > 0 ? `(${unreadCount} não lidas)` : ''}`}
              >
                <FaBell className="h-6 w-6 text-gray-500" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-200">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-900">Notificações</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`px-4 py-3 hover:bg-gray-50 transition-colors duration-200 ${
                          !notification.read ? 'bg-blue-50' : ''
                        }`}
                      >
                        <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                        <p className="text-sm text-gray-500">{notification.description}</p>
                        <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <FaUserCircle className="h-6 w-6 text-gray-500" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-200">
                  <a
                    href="#profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                  >
                    Meu Perfil
                  </a>
                  <a
                    href="#settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                  >
                    Configurações
                  </a>
                  <hr className="my-1 border-gray-200" />
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      logout();
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors duration-200"
                  >
                    Sair
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;