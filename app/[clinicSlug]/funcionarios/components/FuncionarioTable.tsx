import React from 'react';
import { FaSort, FaEdit, FaTrash } from 'react-icons/fa';
import { Funcionario } from '../types';

interface FuncionarioTableProps {
  funcionarios: Funcionario[];
  sortField: keyof Funcionario;
  sortDirection: 'asc' | 'desc';
  onSort: (field: keyof Funcionario) => void;
  onEdit: (id: number, data: Omit<Funcionario, 'id'>) => void;
  onDelete: (id: number) => void;
}

export default function FuncionarioTable({ 
  funcionarios, 
  sortField, 
  sortDirection, 
  onSort,
  onEdit,
  onDelete
}: FuncionarioTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-50">
            {[
              { key: 'nome', label: 'Nome' },
              { key: 'cargo', label: 'Cargo' },
              { key: 'email', label: 'Email' },
              { key: 'unidade', label: 'Unidade' },
              { key: 'departamento', label: 'Departamento' },
              { key: 'turno', label: 'Turno' },
              { key: 'status', label: 'Status' }
            ].map(({ key, label }) => (
              <th
                key={key}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => onSort(key as keyof Funcionario)}
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
          {funcionarios.map((funcionario) => (
            <tr key={funcionario.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <div className="font-medium text-gray-900">{funcionario.nome}</div>
                  <div className="text-sm text-gray-500">{funcionario.telefone}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{funcionario.cargo}</td>
              <td className="px-6 py-4 whitespace-nowrap">{funcionario.email}</td>
              <td className="px-6 py-4 whitespace-nowrap">{funcionario.unidade}</td>
              <td className="px-6 py-4 whitespace-nowrap">{funcionario.departamento}</td>
              <td className="px-6 py-4 whitespace-nowrap">{funcionario.turno}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  funcionario.status === 'Ativo'
                    ? 'bg-green-100 text-green-800'
                    : funcionario.status === 'Inativo'
                    ? 'bg-red-100 text-red-800'
                    : funcionario.status === 'Férias'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {funcionario.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <button
                  onClick={() => onEdit(funcionario.id, funcionario)}
                  className="text-blue-600 hover:text-blue-900 mr-3"
                >
                  <FaEdit className="inline-block mr-1" />
                  Editar
                </button>
                <button
                  onClick={() => onDelete(funcionario.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <FaTrash className="inline-block mr-1" />
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}