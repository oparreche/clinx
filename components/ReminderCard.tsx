import React from 'react';
import { FaBell, FaTrash, FaEdit } from 'react-icons/fa';

interface ReminderCardProps {
  title: string;
  description: string;
  date: string;
  priority: 'high' | 'medium' | 'low';
  onEdit: () => void;
  onDelete: () => void;
}

export default function ReminderCard({ 
  title, 
  description, 
  date, 
  priority,
  onEdit,
  onDelete 
}: ReminderCardProps) {
  const priorityColors = {
    high: 'border-red-500',
    medium: 'border-yellow-500',
    low: 'border-green-500'
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${priorityColors[priority]}`}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center">
          <FaBell className="text-gray-500 mr-2" />
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
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
      <p className="text-gray-600 mb-2">{description}</p>
      <div className="text-sm text-gray-500">
        {date}
      </div>
    </div>
  );
}