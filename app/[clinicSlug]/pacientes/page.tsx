'use client';

import React, { useState } from 'react';
import { FaUserPlus, FaFilter } from 'react-icons/fa';
import { Paciente } from './types';
import PacienteTable from './components/PacienteTable';
import PacienteForm from './components/PacienteForm';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';

const initialPacientes: Paciente[] = [
  {
    id: 1,
    nome: 'Carlos Silva',
    email: 'carlos@email.com',
    telefone: '(11) 99999-9999',
    dataNascimento: '1990-05-15',
    cpf: '123.456.789-00',
    endereco: 'Rua das Flores, 123',
    status: 'Ativo',
    ultimaConsulta: '2023-10-01',
    psicologo: 'Dr. Almeida'
  },
  {
    id: 2,
    nome: 'Maria Santos',
    email: 'maria@email.com',
    telefone: '(11) 98888-8888',
    dataNascimento: '1985-03-20',
    cpf: '987.654.321-00',
    endereco: 'Av. Principal, 456',
    convenio: 'Plano Saúde',
    numeroConvenio: '123456',
    status: 'Ativo',
    ultimaConsulta: '2023-09-28',
    psicologo: 'Dra. Santos'
  }
];

export default function Pacientes() {
  const [pacientes, setPacientes] = useState<Paciente[]>(initialPacientes);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPsicologo, setFilterPsicologo] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortField, setSortField] = useState<keyof Paciente>('nome');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showFilters, setShowFilters] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleSort = (field: keyof Paciente) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleAddPaciente = (data: Omit<Paciente, 'id'>) => {
    const newPaciente: Paciente = {
      ...data,
      id: pacientes.length + 1,
    };
    setPacientes([...pacientes, newPaciente]);
    setShowForm(false);
  };

  const filteredPacientes = pacientes
    .filter(paciente =>
      (paciente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        paciente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        paciente.cpf.includes(searchTerm)) &&
      (filterPsicologo ? paciente.psicologo === filterPsicologo : true) &&
      (filterStatus ? paciente.status === filterStatus : true)
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
    <AuthenticatedLayout>
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Pacientes</h1>
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
              <span>Novo Paciente</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-4 border-b">
            <input
              type="text"
              placeholder="Buscar por nome, email ou CPF..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          {showFilters && (
            <div className="p-4 border-b bg-gray-50 flex space-x-4">
              <select
                value={filterPsicologo}
                onChange={(e) => setFilterPsicologo(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Todos os Psicólogos</option>
                <option value="Dr. Almeida">Dr. Almeida</option>
                <option value="Dra. Santos">Dra. Santos</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Todos os Status</option>
                <option value="Ativo">Ativo</option>
                <option value="Inativo">Inativo</option>
              </select>
            </div>
          )}

          <PacienteTable
            pacientes={filteredPacientes}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
        </div>
      </div>

      <PacienteForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleAddPaciente}
      />
    </AuthenticatedLayout>
  );
}