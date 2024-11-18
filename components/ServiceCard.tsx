import React from 'react';
import { FaClock, FaCalendarAlt, FaEdit, FaTrash } from 'react-icons/fa';

interface Service {
  id: number;
  name: string;
  description: string;
  duration: string;
  price: number;
  availability: string[];
  status: string;
}

interface ServiceCardProps {
  service: Service;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ServiceCard({ service, onEdit, onDelete }: ServiceCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold">{service.name}</h3>
        <div className="flex space-x-2">
          <button 
            onClick={onEdit}
            className="text-blue-500 hover:text-blue-700"
          >
            <FaEdit />
          </button>
          <button 
            onClick={onDelete}
            className="text-red-500 hover:text-red-700"
          >
            <FaTrash />
          </button>
        </div>
      </div>

      <p className="text-gray-600 mb-4">{service.description}</p>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-gray-500">
          <FaClock className="mr-2" />
          <span>{service.duration}</span>
        </div>
        <div className="flex items-center text-gray-500">
          <FaCalendarAlt className="mr-2" />
          <span>{service.availability.join(', ')}</span>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <span className="text-lg font-bold text-blue-600">
          R$ {service.price.toFixed(2)}
        </span>
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
          service.status === 'active' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {service.status === 'active' ? 'Ativo' : 'Inativo'}
        </span>
      </div>
    </div>
  );
}