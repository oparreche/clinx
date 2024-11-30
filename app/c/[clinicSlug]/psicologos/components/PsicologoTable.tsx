import React from 'react';
import { FaSort } from 'react-icons/fa';
import { Psicologo } from '../types';

interface PsicologoTableProps {
  psicologos: Psicologo[];
  sortField: keyof Psicologo;
  sortDirection: 'asc' | 'desc';
  onSort: (field: keyof Psicologo) => void;
}

export default function PsicologoTable({ 
  psicologos, 
  sortField, 
  sortDirection, 
  onSort 
}: PsicologoTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-50">
            {[
              { key: 'nome', label: 'Nome' },
              { key: 'crp', label: 'CRP' },
              { key: 'especialidade', label: 'Especialidade' },
              { key: 'unidade', label: 'Unidade' },
              { key: 'pacientesAtivos', label: 'Pacientes' },
              { key: 'status', label: 'Status' }
            ].map(({ key, label }) => (
              <th
                key={key}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => onSort(key as keyof Psicologo)}
              >
                <div className="flex items-center space-x-1">
                  <span>{label}</span>
                  <FaSort className={`h-3 w-3 ${
                    sortField === key ? 'text-blue-500' : 'text-gray-400'
                  }`} />
                </div>
              </th>
            ))}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {psicologos.map((psicologo) => (
            <tr key={psicologo.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <div className="font-medium text-gray-900">{psicologo.nome}</div>
                  <div className="text-sm text-gray-500">{psicologo.email}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{psicologo.crp}</td>
              <td className="px-6 py-4 whitespace-nowrap">{psicologo.especialidade}</td>
              <td className="px-6 py-4 whitespace-nowrap">{psicologo.unidade}</td>
              <td className="px-6 py-4 whitespace-nowrap">{psicologo.pacientesAtivos}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  psicologo.status === 'Ativo'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {psicologo.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <button className="text-blue-600 hover:text-blue-900 mr-3">Editar</button>
                <button className="text-red-600 hover:text-red-900">Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}