'use client';

import { useEffect, useState } from 'react';
import { api } from '@/app/services/api';
import { useRouter } from 'next/navigation';

interface Plan {
  id: number;
  name: string;
  description: string;
  price: number;
  billing_cycle: 'monthly' | 'yearly';
  features: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function PlansPage() {
  const router = useRouter();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await api.get('/admin/plans');
      setPlans(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar planos');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (planId: number, currentStatus: boolean) => {
    try {
      await api.patch(`/admin/plans/${planId}`, {
        is_active: !currentStatus,
      });
      fetchPlans(); // Recarrega a lista de planos
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao atualizar plano');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Planos</h1>
          <p className="mt-2 text-sm text-gray-700">
            Gerencie os planos de assinatura disponíveis para as clínicas.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={() => router.push('/admin/plans/new')}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            Adicionar Plano
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-4 bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative rounded-lg border ${
              plan.is_active ? 'bg-white' : 'bg-gray-50'
            } p-6 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400`}
          >
            <div className="flex items-center justify-between space-x-3">
              <h3 className="text-lg font-medium">
                <button
                  onClick={() => router.push(`/admin/plans/${plan.id}`)}
                  className="focus:outline-none"
                >
                  <span className="absolute inset-0" aria-hidden="true" />
                  {plan.name}
                </button>
              </h3>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  plan.is_active
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {plan.is_active ? 'Ativo' : 'Inativo'}
              </span>
            </div>
            <div className="mt-2">
              <p className="text-sm text-gray-500 line-clamp-2">{plan.description}</p>
            </div>
            <div className="mt-4">
              <div className="text-lg font-medium text-gray-900">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(plan.price)}{' '}
                <span className="text-sm text-gray-500">
                  /{plan.billing_cycle === 'monthly' ? 'mês' : 'ano'}
                </span>
              </div>
            </div>
            <div className="mt-4">
              <h4 className="text-xs font-medium text-gray-900">Recursos Incluídos</h4>
              <ul className="mt-2 space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-green-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <p className="ml-2 text-sm text-gray-500">{feature}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6 flex space-x-3">
              <button
                type="button"
                onClick={() => router.push(`/admin/plans/${plan.id}`)}
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Editar
              </button>
              <button
                type="button"
                onClick={() => handleToggleActive(plan.id, plan.is_active)}
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                {plan.is_active ? 'Desativar' : 'Ativar'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
