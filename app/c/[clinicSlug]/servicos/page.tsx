'use client';

import React, { useState } from 'react';
import { FaPlus, FaFilter } from 'react-icons/fa';
import { Servico } from './types';
import ServicoCard from './components/ServicoCard';
import ServicoForm from './components/ServicoForm';

const initialServicos: Servico[] = [
  {
    id: 1,
    nome: 'Consulta Psicológica',
    descricao: 'Atendimento psicológico individual',
    duracao: '50 min',
    preco: 150.00,
    disponibilidade: ['Segunda', 'Quarta', 'Sexta'],
    status: 'Ativo',
    categoria: 'Individual',
    psicologos: ['Dr. Almeida', 'Dra. Santos']
  },
  {
    id: 2,
    nome: 'Avaliação Psicológica',
    descricao: 'Avaliação completa com testes e laudos',
    duracao: '120 min',
    preco: 300.00,
    disponibilidade: ['Terça', 'Quinta'],
    status: 'Ativo',
    categoria: 'Avaliação'
  },
  {
    id: 3,
    nome: 'Terapia em Grupo',
    descricao: 'Sessões terapêuticas em grupo',
    duracao: '90 min',
    preco: 80.00,
    disponibilidade: ['Segunda', 'Quinta'],
    status: 'Ativo',
    categoria: 'Grupo',
    maximoPacientes: 8
  }
];

export default function Servicos() {
  const [servicos, setServicos] = useState<Servico[]>(initialServicos);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategoria, setFilterCategoria] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleAddServico = (data: Omit<Servico, 'id'>) => {
    const newServico: Servico = {
      ...data,
      id: servicos.length + 1,
    };
    setServicos([...servicos, newServico]);
    setShowForm(false);
  };

  const handleEdit = (id: number) => {
    // Implement edit functionality
    console.log('Edit service', id);
  };

  const handleDelete = (id: number) => {
    setServicos(servicos.filter(servico => servico.id !== id));
  };

  const filteredServicos = servicos.filter(servico =>
    (servico.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      servico.descricao.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterCategoria ? servico.categoria === filterCategoria : true) &&
    (filterStatus ? servico.status === filterStatus : true)
  );

  return (
    <>
      <div className="p-4 pt-24 space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">Serviços</h1>
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
              <span>Novo Serviço</span>
            </button>
          </div>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar serviço..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        {showFilters && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg flex space-x-4">
            <select
              value={filterCategoria}
              onChange={(e) => setFilterCategoria(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Todas as Categorias</option>
              <option value="Individual">Individual</option>
              <option value="Grupo">Grupo</option>
              <option value="Avaliação">Avaliação</option>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServicos.map((servico) => (
            <ServicoCard
              key={servico.id}
              servico={servico}
              onEdit={() => handleEdit(servico.id)}
              onDelete={() => handleDelete(servico.id)}
            />
          ))}
        </div>
      </div>

      <ServicoForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleAddServico}
      />
    </>
  );
}