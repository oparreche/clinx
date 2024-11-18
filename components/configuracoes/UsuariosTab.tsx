import React from 'react';

export function UsuariosTab() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Gerenciar Usuários</h2>
      <div className="space-y-4">
        <div className="flex justify-between mb-4">
          <input
            type="text"
            placeholder="Buscar usuário..."
            className="px-4 py-2 border rounded-lg w-64"
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
            Novo Usuário
          </button>
        </div>
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Perfil</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
            </tr>
          </thead>
          <tbody>
            {[
              { nome: 'Admin', email: 'admin@clinica.com', perfil: 'Administrador', status: 'Ativo' },
              { nome: 'User', email: 'user@clinica.com', perfil: 'Usuário', status: 'Ativo' },
            ].map((user, index) => (
              <tr key={index} className="border-t">
                <td className="px-6 py-4">{user.nome}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">{user.perfil}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-blue-600 hover:text-blue-800 mr-2">Editar</button>
                  <button className="text-red-600 hover:text-red-800">Remover</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}