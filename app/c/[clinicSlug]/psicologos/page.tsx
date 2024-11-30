'use client';

import React, { useState } from 'react';
import { FaUserPlus, FaFilter } from 'react-icons/fa';
import { Psicologo } from './types';
import PsicologoTable from './components/PsicologoTable';
import PsicologoForm from './components/PsicologoForm';

const initialPsicologos: Psicologo[] = [
  {
    id: 1,
    nome: 'Dr. Almeida',
    crp: 'CRP 01/12345',
    especialidade: 'Psicologia Clínica',
    unidade: 'UNIDADE 1',
    email: 'almeida@clinica.com',
    telefone: '(11) 98765-4321',
    status: 'Ativo',
    horarios: ['Segunda 08:00-17:00', 'Quarta 08:00-17:00', 'Sexta 08:00-17:00'],
    pacientesAtivos: 25
  },
  {
    id: 2,
    nome: 'Dra. Santos',
    crp: 'CRP 01/54321',
    especialidade: 'Neuropsicologia',
    unidade: 'UNIDADE 2',
    email: 'santos@clinica.com',
    telefone: '(11) 98765-1234',
    status: 'Ativo',
    horarios: ['Terça 09:00-18:00', 'Quinta 09:00-18:00'],
    pacientesAtivos: 18
  }
];

export default function Psicologos() {
  const [psicologos, setPsicologos] = useState<Psicologo[]>(initialPsicologos);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterUnidade, setFilterUnidade] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortField, setSortField] = useState<keyof Psicologo>('nome');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showFilters, setShowFilters] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleSort = (field: keyof Psicologo) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleAddPsicologo = (data: Omit<Psicologo, 'id'>) => {
    const newPsicologo: Psicologo = {
      ...data,
      id: psicologos.length + 1,
    };
    setPsicologos([...psicologos, newPsicologo]);
    setShowForm(false);
  };

  const filteredPsicologos = psicologos
    .filter(psicologo => {
      const matchesSearch = searchTerm === '' || [
        psicologo.nome,
        psicologo.crp,
        psicologo.especialidade
      ].some(field => field?.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesUnidade = !filterUnidade || psicologo.unidade === filterUnidade;
      const matchesStatus = !filterStatus || psicologo.status === filterStatus;

      return matchesSearch && matchesUnidade && matchesStatus;
    })
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      return 0;
    });

  return (
    <div className="p-4 pt-24 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Buscar psicólogos..."
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
          <span>Novo Psicólogo</span>
        </button>
      </div>

      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-lg space-y-4 mb-6">
          <select
            value={filterUnidade}
            onChange={(e) => setFilterUnidade(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="">Todas as Unidades</option>
            <option value="UNIDADE 1">UNIDADE 1</option>
            <option value="UNIDADE 2">UNIDADE 2</option>
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

      <PsicologoTable
        psicologos={filteredPsicologos}
        onSort={handleSort}
        sortField={sortField}
        sortDirection={sortDirection}
      />

      {showForm && (
        <PsicologoForm
          isOpen={true}
          onClose={() => setShowForm(false)}
          onSubmit={handleAddPsicologo}
        />
      )}
    </div>
  );
}