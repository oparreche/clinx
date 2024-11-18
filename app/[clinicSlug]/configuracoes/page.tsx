'use client';

import React, { useState } from 'react';
import { ConfigSidebar } from '@/components/configuracoes/ConfigSidebar';
import { UnidadesTab } from '@/components/configuracoes/UnidadesTab';
import { UsuariosTab } from '@/components/configuracoes/UsuariosTab';
import { NotificacoesTab } from '@/components/configuracoes/NotificacoesTab';
import { SegurancaTab } from '@/components/configuracoes/SegurancaTab';
import { GeralTab } from '@/components/configuracoes/GeralTab';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';

export default function Configuracoes() {
  const [activeTab, setActiveTab] = useState('unidades');

  return (
    <AuthenticatedLayout>
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Configurações</h1>
        </div>

        <div className="flex gap-6">
          <ConfigSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

          <div className="flex-1">
            {activeTab === 'unidades' && <UnidadesTab />}
            {activeTab === 'usuarios' && <UsuariosTab />}
            {activeTab === 'notificacoes' && <NotificacoesTab />}
            {activeTab === 'seguranca' && <SegurancaTab />}
            {activeTab === 'geral' && <GeralTab />}
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}