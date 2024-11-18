import React, { useState } from 'react';
import { FaLock, FaShieldAlt, FaKey, FaHistory } from 'react-icons/fa';

export function SegurancaTab() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement password change logic
    alert('Senha alterada com sucesso!');
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold mb-6">Configurações de Segurança</h2>

        <div className="space-y-8">
          {/* Password Change Section */}
          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FaKey className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium">Alterar Senha</h3>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Senha Atual
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg pr-10"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? "Ocultar" : "Mostrar"}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nova Senha
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg pr-10"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? "Ocultar" : "Mostrar"}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar Nova Senha
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg pr-10"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? "Ocultar" : "Mostrar"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Atualizar Senha
              </button>
            </form>
          </div>

          {/* Two-Factor Authentication */}
          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <FaShieldAlt className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="text-lg font-medium">Autenticação em Duas Etapas</h3>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Status: {twoFactorEnabled ? 'Ativado' : 'Desativado'}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Adicione uma camada extra de segurança à sua conta
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={twoFactorEnabled}
                  onChange={() => setTwoFactorEnabled(!twoFactorEnabled)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          {/* Session History */}
          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FaHistory className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="text-lg font-medium">Histórico de Sessões</h3>
            </div>

            <div className="space-y-4">
              {[
                { device: 'Windows PC', location: 'São Paulo, BR', time: 'Agora' },
                { device: 'iPhone', location: 'São Paulo, BR', time: '2 horas atrás' },
                { device: 'MacBook', location: 'Rio de Janeiro, BR', time: '1 dia atrás' }
              ].map((session, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{session.device}</p>
                    <p className="text-sm text-gray-500">{session.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">{session.time}</p>
                    {index === 0 ? (
                      <span className="text-green-600 text-sm">Sessão Atual</span>
                    ) : (
                      <button className="text-red-600 text-sm hover:text-red-700">
                        Encerrar Sessão
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}