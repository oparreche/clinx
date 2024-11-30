import React from 'react';
import { FaCalendarPlus, FaFileAlt, FaCreditCard } from 'react-icons/fa';

export default function PatientActions() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <button
        onClick={() => {}}
        className="flex items-center justify-center space-x-2 bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-600 transition-colors"
      >
        <FaCalendarPlus className="h-5 w-5" />
        <span>Agendar Consulta</span>
      </button>

      <button
        onClick={() => {}}
        className="flex items-center justify-center space-x-2 bg-green-500 text-white p-4 rounded-lg hover:bg-green-600 transition-colors"
      >
        <FaFileAlt className="h-5 w-5" />
        <span>Meus Laudos</span>
      </button>

      <button
        onClick={() => {}}
        className="flex items-center justify-center space-x-2 bg-purple-500 text-white p-4 rounded-lg hover:bg-purple-600 transition-colors"
      >
        <FaCreditCard className="h-5 w-5" />
        <span>Pagamentos</span>
      </button>
    </div>
  );
}