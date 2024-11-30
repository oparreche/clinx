import React from 'react';
import { FaBell, FaTrash, FaEdit, FaCheck, FaClock, FaUser } from 'react-icons/fa';
import { Lembrete } from '../types';

interface LembreteCardProps {
  lembrete: Lembrete;
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
}

export default function LembreteCard({ 
  lembrete,
  onEdit,
  onDelete,
  onToggleStatus
}: LembreteCardProps) {
  const prioridadeColors = {
    alta: 'border-red-500 bg-red-50',
    media: 'border-yellow-500 bg-yellow-50',
    baixa: 'border-green-500 bg-green-50'
  };

  const tipoLabels = {
    reuniao: 'Reunião',
    tarefa: 'Tarefa',
    consulta: 'Consulta',
    outro: 'Outro'
  };

  return (
    <div className={`rounded-lg shadow-md p-4 border-l-4 ${prioridadeColors[lembrete.prioridade]}`}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center">
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold">{lembrete.titulo}</h3>
            <span className="text-sm text-gray-500">{tipoLabels[lembrete.tipo]}</span>
          </div>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={onToggleStatus}
            className={`p-1.5 rounded-full ${
              lembrete.status === 'concluido'
                ? 'bg-green-100 text-green-600'
                : 'bg-gray-100 text-gray-600'
            } hover:bg-opacity-80`}
          >
            <FaCheck />
          </button>
          <button 
            onClick={onEdit}
            className="p-1.5 rounded-full bg-blue-100 text-blue-600 hover:bg-opacity-80"
          >
            <FaEdit />
          </button>
          <button 
            onClick={onDelete}
            className="p-1.5 rounded-full bg-red-100 text-red-600 hover:bg-opacity-80"
          >
            <FaTrash />
          </button>
        </div>
      </div>

      <p className="text-gray-600 mb-4">{lembrete.descricao}</p>

      <div className="space-y-2">
        <div className="flex items-center text-gray-500">
          <FaClock className="mr-2" />
          <span>{new Date(lembrete.data).toLocaleDateString()} às {lembrete.hora}</span>
        </div>
        {lembrete.responsavel && (
          <div className="flex items-center text-gray-500">
            <FaUser className="mr-2" />
            <span>{lembrete.responsavel}</span>
          </div>
        )}
        {lembrete.notificar && (
          <div className="flex items-center text-blue-500">
            <FaBell className="mr-2" />
            <span>Notificações ativadas</span>
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
          lembrete.status === 'concluido'
            ? 'bg-green-100 text-green-800'
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {lembrete.status === 'concluido' ? 'Concluído' : 'Pendente'}
        </span>
      </div>
    </div>
  );
}