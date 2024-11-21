'use client';

import React, { useState } from 'react';
import { FaUserPlus, FaFilter } from 'react-icons/fa';
import { Funcionario } from './types';
import FuncionarioTable from './components/FuncionarioTable';
import FuncionarioForm from './components/FuncionarioForm';

const initialFuncionarios: Funcionario[] = [
  {
    id: 1,
    nome: 'João Silva',
    cargo: 'Recepcionista',
    email: 'joao@clinica.com',
    telefone: '(11) 98765-4321',
    unidade: 'UNIDADE 1',
    dataAdmissao: '2023-01-15',
    departamento: 'Recepção',
    turno: 'Manhã',
    status: 'Ativo'
  },
  {
    id: 2,
    nome: 'Maria Santos',
    cargo: 'Auxiliar Administrativo',
    email: 'maria@clinica.com',
    telefone: '(11) 98765-4322',
    unidade: 'UNIDADE 2',
    dataAdmissao: '2023-02-01',
    departamento: 'Administrativo',
    turno: 'Integral',
    status: 'Ativo'
  },
  {
    id: 3,
    nome: 'Pedro Oliveira',
    cargo: 'Secretário',
    email: 'pedro@clinica.com',
    telefone: '(11) 98765-4323',
    unidade: 'UNIDADE 1',
    dataAdmissao: '2023-03-15',
    departamento: 'Recepção',
    turno: 'Tarde',
    status: 'Ativo'
  }
];

export default function Funcionarios() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>(initialFuncionarios);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterUnidade, setFilterUnidade] = useState('');
  const [filterDepartamento, setFilterDepartamento] = useState('');
  const [sortField, setSortField] = useState<keyof Funcionario>('nome');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showFilters, setShowFilters] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleSort = (field: keyof Funcionario) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleAddFuncionario = (data: Omit<Funcionario, 'id'>) => {
    const newFuncionario: Funcionario = {
      ...data,
      id: funcionarios.length + 1,
    };
    setFuncionarios([...funcionarios, newFuncionario]);
    setShowForm(false);
  };

  const handleEditFuncionario = (id: number, data: Omit<Funcionario, 'id'>) => {
    setFuncionarios(funcionarios.map(func =>
      func.id === id ? { ...data, id } : func
    ));
  };

  const handleDeleteFuncionario = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este funcionário?')) {
      setFuncionarios(funcionarios.filter(func => func.id !== id));
    }
  };

  const filteredFuncionarios = funcionarios
    .filter(funcionario =>
      (funcionario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        funcionario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        funcionario.cargo.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterUnidade ? funcionario.unidade === filterUnidade : true) &&
      (filterDepartamento ? funcionario.departamento === filterDepartamento : true)
    )
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      return 0;
    });

  return (
    <>
      <div className="p-4 pt-24 space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">Funcionários</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 border border-gray-300 rounded-lg flex items-center space-x-2 hover:bg-gray-50"
            >
              <FaFilter />
              <span>Filtros</span>
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-600"
            >
              <FaUserPlus />
              <span>Novo Funcionário</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-4 border-b">
            <input
              type="text"
              placeholder="Buscar por nome, email ou cargo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          {showFilters && (
            <div className="p-4 border-b bg-gray-50 flex space-x-4">
              <select
                value={filterUnidade}
                onChange={(e) => setFilterUnidade(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Todas as Unidades</option>
                <option value="UNIDADE 1">UNIDADE 1</option>
                <option value="UNIDADE 2">UNIDADE 2</option>
              </select>

              <select
                value={filterDepartamento}
                onChange={(e) => setFilterDepartamento(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Todos os Departamentos</option>
                <option value="Administrativo">Administrativo</option>
                <option value="Recepção">Recepção</option>
                <option value="Financeiro">Financeiro</option>
                <option value="Recursos Humanos">Recursos Humanos</option>
              </select>
            </div>
          )}

          <FuncionarioTable
            funcionarios={filteredFuncionarios}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
            onEdit={handleEditFuncionario}
            onDelete={handleDeleteFuncionario}
          />
        </div>
      </div>

      {showForm && (
        <FuncionarioForm
          isOpen={showForm}
          onClose={() => setShowForm(false)}
          onSubmit={handleAddFuncionario}
        />
      )}
    </>
  );
}