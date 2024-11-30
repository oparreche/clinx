'use client';

import { useRouter } from 'next/navigation';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';

export default function Navigation() {
  const router = useRouter();

  const handleLogout = () => {
    router.push('/login');
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="text-xl font-semibold text-blue-600">Portal do Paciente</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <FaUser className="text-gray-500" />
              <span className="text-gray-700">Carlos Silva</span>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
            >
              <FaSignOutAlt />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}