'use client';

import { useState } from 'react';
import { api } from '@/app/services/api';

interface Settings {
  site_name: string;
  contact_email: string;
  support_phone: string;
  maintenance_mode: boolean;
  default_currency: string;
  payment_gateway: {
    provider: string;
    api_key: string;
    webhook_secret: string;
  };
  smtp: {
    host: string;
    port: number;
    user: string;
    password: string;
    from_email: string;
  };
}

export default function SettingsPage() {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [settings, setSettings] = useState<Settings>({
    site_name: 'Clinx',
    contact_email: '',
    support_phone: '',
    maintenance_mode: false,
    default_currency: 'BRL',
    payment_gateway: {
      provider: 'stripe',
      api_key: '',
      webhook_secret: '',
    },
    smtp: {
      host: '',
      port: 587,
      user: '',
      password: '',
      from_email: '',
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await api.put('/admin/settings', settings);
      setSuccess('Configurações salvas com sucesso!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao salvar configurações');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const nameParts = name.split('.');

    if (nameParts.length === 1) {
      setSettings((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    } else {
      setSettings((prev) => ({
        ...prev,
        [nameParts[0]]: {
          ...prev[nameParts[0] as keyof Settings],
          [nameParts[1]]: value,
        },
      }));
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Configurações</h1>
          <p className="mt-2 text-sm text-gray-700">
            Gerencie as configurações globais do sistema.
          </p>
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

      {success && (
        <div className="mt-4 bg-green-50 border-l-4 border-green-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{success}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-8">
        {/* Configurações Gerais */}
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Configurações Gerais</h3>
            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label htmlFor="site_name" className="block text-sm font-medium text-gray-700">
                  Nome do Site
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="site_name"
                    id="site_name"
                    value={settings.site_name}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="sm:col-span-4">
                <label htmlFor="contact_email" className="block text-sm font-medium text-gray-700">
                  Email de Contato
                </label>
                <div className="mt-1">
                  <input
                    type="email"
                    name="contact_email"
                    id="contact_email"
                    value={settings.contact_email}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="sm:col-span-4">
                <label htmlFor="support_phone" className="block text-sm font-medium text-gray-700">
                  Telefone de Suporte
                </label>
                <div className="mt-1">
                  <input
                    type="tel"
                    name="support_phone"
                    id="support_phone"
                    value={settings.support_phone}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <div className="relative flex items-start">
                  <div className="flex h-5 items-center">
                    <input
                      id="maintenance_mode"
                      name="maintenance_mode"
                      type="checkbox"
                      checked={settings.maintenance_mode}
                      onChange={handleChange}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="maintenance_mode" className="font-medium text-gray-700">
                      Modo de Manutenção
                    </label>
                    <p className="text-gray-500">Ative para mostrar uma página de manutenção para todos os usuários</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Configurações de Pagamento */}
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Gateway de Pagamento</h3>
            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="payment_gateway.provider" className="block text-sm font-medium text-gray-700">
                  Provedor
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="payment_gateway.provider"
                    id="payment_gateway.provider"
                    value={settings.payment_gateway.provider}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="sm:col-span-4">
                <label htmlFor="payment_gateway.api_key" className="block text-sm font-medium text-gray-700">
                  Chave da API
                </label>
                <div className="mt-1">
                  <input
                    type="password"
                    name="payment_gateway.api_key"
                    id="payment_gateway.api_key"
                    value={settings.payment_gateway.api_key}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="sm:col-span-4">
                <label htmlFor="payment_gateway.webhook_secret" className="block text-sm font-medium text-gray-700">
                  Webhook Secret
                </label>
                <div className="mt-1">
                  <input
                    type="password"
                    name="payment_gateway.webhook_secret"
                    id="payment_gateway.webhook_secret"
                    value={settings.payment_gateway.webhook_secret}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Configurações de Email */}
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Configurações de Email (SMTP)</h3>
            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="smtp.host" className="block text-sm font-medium text-gray-700">
                  Host SMTP
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="smtp.host"
                    id="smtp.host"
                    value={settings.smtp.host}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="smtp.port" className="block text-sm font-medium text-gray-700">
                  Porta SMTP
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="smtp.port"
                    id="smtp.port"
                    value={settings.smtp.port}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="smtp.user" className="block text-sm font-medium text-gray-700">
                  Usuário SMTP
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="smtp.user"
                    id="smtp.user"
                    value={settings.smtp.user}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="smtp.password" className="block text-sm font-medium text-gray-700">
                  Senha SMTP
                </label>
                <div className="mt-1">
                  <input
                    type="password"
                    name="smtp.password"
                    id="smtp.password"
                    value={settings.smtp.password}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="sm:col-span-4">
                <label htmlFor="smtp.from_email" className="block text-sm font-medium text-gray-700">
                  Email de Envio
                </label>
                <div className="mt-1">
                  <input
                    type="email"
                    name="smtp.from_email"
                    id="smtp.from_email"
                    value={settings.smtp.from_email}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {saving ? 'Salvando...' : 'Salvar Configurações'}
          </button>
        </div>
      </form>
    </div>
  );
}
