'use client';

import React, { useState } from 'react';
import { ConfigSidebar } from '@/components/configuracoes/ConfigSidebar';
import { UnidadesTab } from '@/components/configuracoes/UnidadesTab';
import { UsuariosTab } from '@/components/configuracoes/UsuariosTab';
import { NotificacoesTab } from '@/components/configuracoes/NotificacoesTab';
import { SegurancaTab } from '@/components/configuracoes/SegurancaTab';
import { GeralTab } from '@/components/configuracoes/GeralTab';

export default function Configuracoes() {
  const [activeTab, setActiveTab] = useState('unidades');

  return (
    <div className="p-4 pt-24 space-y-4">
      <div className="flex justify-between items-center mb-4">
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
  );
}