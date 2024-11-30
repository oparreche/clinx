import React from 'react';
import { FaSort } from 'react-icons/fa';
import { Paciente } from '../types';

interface PacienteTableProps {
  pacientes: Paciente[];
  sortField: keyof Paciente;
  sortDirection: 'asc' | 'desc';
  onSort: (field: keyof Paciente) => void;
}

export default function PacienteTable({ 
  pacientes, 
  sortField, 
  sortDirection, 
  onSort 
}: PacienteTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-50">
            {[
              { key: 'nome', label: 'Nome' },
              { key: 'email', label: 'Email' },
              { key: 'telefone', label: 'Telefone' },
              { key: 'psicologo', label: 'Psicólogo' },
              { key: 'ultimaConsulta', label: 'Última Consulta' },
              { key: 'status', label: 'Status' }
            ].map(({ key, label }) => (
              <th
                key={key}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => onSort(key as keyof Paciente)}
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
          {pacientes.map((paciente) => (
            <tr key={paciente.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <div className="font-medium text-gray-900">{paciente.nome}</div>
                  <div className="text-sm text-gray-500">CPF: {paciente.cpf}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{paciente.email}</td>
              <td className="px-6 py-4 whitespace-nowrap">{paciente.telefone}</td>
              <td className="px-6 py-4 whitespace-nowrap">{paciente.psicologo || '-'}</td>
              <td className="px-6 py-4 whitespace-nowrap">{paciente.ultimaConsulta || '-'}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  paciente.status === 'Ativo'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {paciente.status}
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