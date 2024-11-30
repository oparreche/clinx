'use client';

import React, { useState } from 'react';
import { FaUserPlus, FaFilter } from 'react-icons/fa';
import { Paciente } from './types';
import PacienteTable from './components/PacienteTable';
import PacienteForm from './components/PacienteForm';

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
    <div className="p-4 pt-24 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Buscar pacientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              showFilters
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FaFilter className="w-4 h-4" />
            <span>Filtros</span>
          </button>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors shadow-md"
        >
          <FaUserPlus className="w-4 h-4" />
          <span>Novo Paciente</span>
        </button>
      </div>

      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-lg space-y-4 mb-6">
          <select
            value={filterPsicologo}
            onChange={(e) => setFilterPsicologo(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="">Todos os Psicólogos</option>
            <option value="Dr. Almeida">Dr. Almeida</option>
            <option value="Dra. Santos">Dra. Santos</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="">Todos os Status</option>
            <option value="Ativo">Ativo</option>
            <option value="Inativo">Inativo</option>
          </select>
        </div>
      )}

      <PacienteTable
        pacientes={filteredPacientes}
        onSort={handleSort}
        sortField={sortField}
        sortDirection={sortDirection}
      />

      <PacienteForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleAddPaciente}
      />
    </div>
  );
}