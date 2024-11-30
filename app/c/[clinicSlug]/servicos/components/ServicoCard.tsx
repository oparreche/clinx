import React from 'react';
import { FaClock, FaCalendarAlt, FaUsers, FaEdit, FaTrash, FaMoneyBillWave } from 'react-icons/fa';
import { Servico } from '../types';

interface ServicoCardProps {
  servico: Servico;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ServicoCard({ servico, onEdit, onDelete }: ServicoCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">{servico.nome}</h3>
          <span className="text-sm text-gray-500">{servico.categoria}</span>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={onEdit}
            className="text-blue-500 hover:text-blue-700 transition-colors"
          >
            <FaEdit />
          </button>
          <button 
            onClick={onDelete}
            className="text-red-500 hover:text-red-700 transition-colors"
          >
            <FaTrash />
          </button>
        </div>
      </div>

      <p className="text-gray-600 mb-4">{servico.descricao}</p>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-gray-500">
          <FaClock className="mr-2" />
          <span>{servico.duracao}</span>
        </div>
        <div className="flex items-center text-gray-500">
          <FaCalendarAlt className="mr-2" />
          <span>{servico.disponibilidade.join(', ')}</span>
        </div>
        <div className="flex items-center text-gray-500">
          <FaMoneyBillWave className="mr-2" />
          <span>R$ {servico.preco.toFixed(2)}</span>
        </div>
        {servico.maximoPacientes && (
          <div className="flex items-center text-gray-500">
            <FaUsers className="mr-2" />
            <span>Máximo {servico.maximoPacientes} pacientes</span>
          </div>
        )}
      </div>

      {servico.psicologos && servico.psicologos.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Psicólogos:</h4>
          <div className="flex flex-wrap gap-2">
            {servico.psicologos.map((psicologo, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
              >
                {psicologo}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
          servico.status === 'Ativo' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {servico.status}
        </span>
      </div>
    </div>
  );
}