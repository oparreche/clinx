'use client';

import React, { useState } from 'react';
import { FaPlus, FaFilter } from 'react-icons/fa';
import { Lembrete } from './types';
import LembreteCard from './components/LembreteCard';
import LembreteForm from './components/LembreteForm';
import LembreteFilters from './components/LembreteFilters';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';


const initialLembretes: Lembrete[] = [
  {
    id: 1,
    titulo: 'Reunião com Equipe',
    descricao: 'Discussão sobre novos protocolos de atendimento',
    data: '2024-01-15',
    hora: '14:00',
    prioridade: 'alta',
    status: 'pendente',
    tipo: 'reuniao',
    responsavel: 'Dr. Almeida',
    notificar: true
  },
  {
    id: 2,
    titulo: 'Manutenção Equipamentos',
    descricao: 'Agendamento da manutenção preventiva dos equipamentos',
    data: '2024-01-20',
    hora: '09:00',
    prioridade: 'media',
    status: 'pendente',
    tipo: 'tarefa',
    notificar: false
  },
  {
    id: 3,
    titulo: 'Inventário de Suprimentos',
    descricao: 'Realizar contagem mensal de suprimentos médicos',
    data: '2024-01-25',
    hora: '11:00',
    prioridade: 'baixa',
    status: 'pendente',
    tipo: 'tarefa',
    responsavel: 'Maria Santos',
    notificar: true
  }
];

export default function Lembretes() {
  const [lembretes, setLembretes] = useState<Lembrete[]>(initialLembretes);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPrioridade, setFilterPrioridade] = useState<string>('');
  const [filterTipo, setFilterTipo] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [sortBy, setSortBy] = useState<'data' | 'prioridade'>('data');

  const handleAddLembrete = (data: Omit<Lembrete, 'id'>) => {
    const newLembrete: Lembrete = {
      ...data,
      id: lembretes.length + 1,
    };
    setLembretes([...lembretes, newLembrete]);
    setShowForm(false);
  };

  const handleEdit = (id: number) => {
    // Implement edit functionality
    console.log('Edit reminder', id);
  };

  const handleDelete = (id: number) => {
    setLembretes(lembretes.filter(lembrete => lembrete.id !== id));
  };

  const handleToggleStatus = (id: number) => {
    setLembretes(lembretes.map(lembrete =>
      lembrete.id === id
        ? { ...lembrete, status: lembrete.status === 'pendente' ? 'concluido' : 'pendente' }
        : lembrete
    ));
  };

  const filteredLembretes = lembretes
    .filter(lembrete =>
      (lembrete.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lembrete.descricao.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterPrioridade ? lembrete.prioridade === filterPrioridade : true) &&
      (filterTipo ? lembrete.tipo === filterTipo : true) &&
      (filterStatus ? lembrete.status === filterStatus : true)
    )
    .sort((a, b) => {
      if (sortBy === 'data') {
        return new Date(`${a.data} ${a.hora}`).getTime() - new Date(`${b.data} ${b.hora}`).getTime();
      } else {
        const prioridadeValue = { alta: 3, media: 2, baixa: 1 };
        return prioridadeValue[b.prioridade] - prioridadeValue[a.prioridade];
      }
    });

  return (
    <AuthenticatedLayout>
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Lembretes</h1>
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
              className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-600"
            >
              <FaPlus />
              <span>Novo Lembrete</span>
            </button>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex space-x-4 mb-4">
            <input
              type="text"
              placeholder="Buscar lembrete..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'data' | 'prioridade')}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="data">Ordenar por Data</option>
              <option value="prioridade">Ordenar por Prioridade</option>
            </select>
          </div>

          {showFilters && (
            <LembreteFilters
              prioridade={filterPrioridade}
              tipo={filterTipo}
              status={filterStatus}
              onPrioridadeChange={setFilterPrioridade}
              onTipoChange={setFilterTipo}
              onStatusChange={setFilterStatus}
            />
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLembretes.map((lembrete) => (
            <LembreteCard
              key={lembrete.id}
              lembrete={lembrete}
              onEdit={() => handleEdit(lembrete.id)}
              onDelete={() => handleDelete(lembrete.id)}
              onToggleStatus={() => handleToggleStatus(lembrete.id)}
            />
          ))}
        </div>

        <LembreteForm
          isOpen={showForm}
          onClose={() => setShowForm(false)}
          onSubmit={handleAddLembrete}
        />
      </div>
    </AuthenticatedLayout>
  );
}