'use client';

import React, { useState } from 'react';
import { FaMoneyBillWave, FaFileInvoice, FaChartLine, FaDownload, FaPlus } from 'react-icons/fa';
import { Transacao, ResumoFinanceiro } from './types';
import FinanceiroCard from './components/FinanceiroCard';
import TransacaoList from './components/TransacaoList';
import TransacaoForm from './components/TransacaoForm';
import PaymentTracking from './components/PaymentTracking';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';


const initialTransacoes: Transacao[] = [
  {
    id: 1,
    tipo: 'receita',
    descricao: 'Consulta - Carlos Silva',
    valor: 150.00,
    data: '2024-01-01',
    categoria: 'Consultas',
    status: 'pago',
    formaPagamento: 'PIX',
    recorrente: false
  },
  {
    id: 2,
    tipo: 'despesa',
    descricao: 'Material de Escritório',
    valor: 75.50,
    data: '2024-01-02',
    categoria: 'Materiais',
    status: 'pago',
    formaPagamento: 'Cartão de Crédito',
    recorrente: false
  },
  {
    id: 3,
    tipo: 'receita',
    descricao: 'Consulta - Maria Santos',
    valor: 150.00,
    data: '2024-01-03',
    categoria: 'Consultas',
    status: 'pendente',
    vencimento: '2024-01-10',
    recorrente: false
  }
];

const initialResumo: ResumoFinanceiro = {
  receitaTotal: 45250.00,
  despesaTotal: 12800.00,
  lucroLiquido: 32450.00,
  receitasPendentes: 3500.00,
  despesasPendentes: 1200.00,
  percentualCrescimento: 15
};

export default function Financeiro() {
  const [transacoes, setTransacoes] = useState<Transacao[]>(initialTransacoes);
  const [resumo] = useState<ResumoFinanceiro>(initialResumo);
  const [selectedPeriodo, setSelectedPeriodo] = useState('month');
  const [showFormReceita, setShowFormReceita] = useState(false);
  const [showFormDespesa, setShowFormDespesa] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const handleAddTransacao = (data: Omit<Transacao, 'id'>) => {
    const newTransacao: Transacao = {
      ...data,
      id: transacoes.length + 1,
    };
    setTransacoes([...transacoes, newTransacao]);
    setShowFormReceita(false);
    setShowFormDespesa(false);
  };

  return (
    <AuthenticatedLayout>
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Financeiro</h1>
          <div className="flex space-x-4">
            <select
              value={selectedPeriodo}
              onChange={(e) => setSelectedPeriodo(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="week">Última Semana</option>
              <option value="month">Último Mês</option>
              <option value="year">Último Ano</option>
            </select>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-600">
              <FaDownload />
              <span>Exportar Relatório</span>
            </button>
          </div>
        </div>

        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                Visão Geral
              </button>

              <button
                onClick={() => setActiveTab('payments')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'payments'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                Acompanhamento de Pagamentos
              </button>
            </nav>
          </div>
        </div>

        {activeTab === 'overview' ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <FinanceiroCard
                titulo="Receita Total"
                valor={resumo.receitaTotal}
                descricao="Este mês"
                percentual={75}
                Icon={FaMoneyBillWave}
                corIcone="bg-green-100"
                corBarra="bg-green-500"
              />

              <FinanceiroCard
                titulo="Despesas"
                valor={resumo.despesaTotal}
                descricao="Este mês"
                percentual={35}
                Icon={FaFileInvoice}
                corIcone="bg-red-100"
                corBarra="bg-red-500"
              />

              <FinanceiroCard
                titulo="Lucro Líquido"
                valor={resumo.lucroLiquido}
                descricao="Este mês"
                percentual={60}
                Icon={FaChartLine}
                corIcone="bg-blue-100"
                corBarra="bg-blue-500"
              />
            </div>

            <div className="flex justify-end space-x-4 mb-6">
              <button
                onClick={() => setShowFormReceita(true)}
                className="px-4 py-2 bg-green-500 text-white rounded-lg flex items-center space-x-2 hover:bg-green-600"
              >
                <FaPlus />
                <span>Nova Receita</span>
              </button>
              <button
                onClick={() => setShowFormDespesa(true)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg flex items-center space-x-2 hover:bg-red-600"
              >
                <FaPlus />
                <span>Nova Despesa</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TransacaoList
                titulo="Últimas Transações"
                transacoes={transacoes.filter(t => t.status === 'pago')}
              />

              <TransacaoList
                titulo="Pagamentos Pendentes"
                transacoes={transacoes.filter(t => t.status === 'pendente')}
              />
            </div>
          </>
        ) : (
          <PaymentTracking />
        )}

        <TransacaoForm
          isOpen={showFormReceita}
          onClose={() => setShowFormReceita(false)}
          onSubmit={handleAddTransacao}
          tipo="receita"
        />

        <TransacaoForm
          isOpen={showFormDespesa}
          onClose={() => setShowFormDespesa(false)}
          onSubmit={handleAddTransacao}
          tipo="despesa"
        />
      </div>
    </AuthenticatedLayout>
  );
}