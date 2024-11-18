import React, { useState } from 'react';
import { FaBell, FaEnvelope, FaMobile, FaCalendar } from 'react-icons/fa';

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
}

export function NotificacoesTab() {
  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      id: 'email',
      title: 'Notificações por Email',
      description: 'Receba atualizações importantes por email',
      icon: <FaEnvelope className="h-5 w-5" />,
      enabled: true
    },
    {
      id: 'push',
      title: 'Notificações Push',
      description: 'Receba alertas instantâneos no navegador',
      icon: <FaBell className="h-5 w-5" />,
      enabled: false
    },
    {
      id: 'sms',
      title: 'Notificações SMS',
      description: 'Receba lembretes por mensagem de texto',
      icon: <FaMobile className="h-5 w-5" />,
      enabled: true
    },
    {
      id: 'calendar',
      title: 'Lembretes de Agenda',
      description: 'Notificações sobre consultas e compromissos',
      icon: <FaCalendar className="h-5 w-5" />,
      enabled: true
    }
  ]);

  const toggleSetting = (id: string) => {
    setSettings(settings.map(setting =>
      setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
    ));
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold mb-6">Configurações de Notificações</h2>
        
        <div className="space-y-6">
          {settings.map(setting => (
            <div
              key={setting.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-lg ${
                  setting.enabled ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  {setting.icon}
                </div>
                <div>
                  <h3 className="font-medium">{setting.title}</h3>
                  <p className="text-sm text-gray-500">{setting.description}</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={setting.enabled}
                  onChange={() => toggleSetting(setting.id)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium mb-4">Horários de Notificação</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Início do Expediente
              </label>
              <input
                type="time"
                defaultValue="08:00"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fim do Expediente
              </label>
              <input
                type="time"
                defaultValue="18:00"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
}