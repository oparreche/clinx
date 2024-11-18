import React, { useState } from 'react';
import { FaCog, FaGlobe, FaPalette, FaClock } from 'react-icons/fa';

interface Theme {
  primary: string;
  secondary: string;
  accent: string;
}

export function GeralTab() {
  const [theme, setTheme] = useState<Theme>({
    primary: '#3B82F6',
    secondary: '#1E40AF',
    accent: '#60A5FA'
  });

  const handleThemeChange = (color: string, type: keyof Theme) => {
    setTheme({ ...theme, [type]: color });
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold mb-6">Configurações Gerais</h2>

        <div className="space-y-8">
          {/* Clinic Information */}
          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FaCog className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium">Informações da Clínica</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome da Clínica
                </label>
                <input
                  type="text"
                  defaultValue="Clínica Casa"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CNPJ
                </label>
                <input
                  type="text"
                  defaultValue="00.000.000/0000-00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email de Contato
                </label>
                <input
                  type="email"
                  defaultValue="contato@clinica.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Localization Settings */}
          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <FaGlobe className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="text-lg font-medium">Localização</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Idioma
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <option value="pt-BR">Português (BR)</option>
                  <option value="en">English</option>
                  <option value="es">Español</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fuso Horário
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <option value="America/Sao_Paulo">América/São Paulo</option>
                  <option value="America/New_York">América/Nova York</option>
                  <option value="Europe/London">Europa/Londres</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Formato de Data
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Formato de Hora
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <option value="24h">24 horas</option>
                  <option value="12h">12 horas (AM/PM)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Theme Settings */}
          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FaPalette className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="text-lg font-medium">Tema</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cor Primária
                </label>
                <input
                  type="color"
                  value={theme.primary}
                  onChange={(e) => handleThemeChange(e.target.value, 'primary')}
                  className="w-full h-10 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cor Secundária
                </label>
                <input
                  type="color"
                  value={theme.secondary}
                  onChange={(e) => handleThemeChange(e.target.value, 'secondary')}
                  className="w-full h-10 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cor de Destaque
                </label>
                <input
                  type="color"
                  value={theme.accent}
                  onChange={(e) => handleThemeChange(e.target.value, 'accent')}
                  className="w-full h-10 rounded-lg cursor-pointer"
                />
              </div>
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