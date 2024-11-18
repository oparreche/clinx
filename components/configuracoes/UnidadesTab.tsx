import React, { useState } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

interface Unidade {
  id: number;
  nome: string;
  endereco: string;
  telefone: string;
  responsavel: string;
  status: 'ativo' | 'inativo';
}

const initialUnidades: Unidade[] = [
  {
    id: 1,
    nome: 'UNIDADE 1',
    endereco: 'Rua Example, 123 - São Paulo, SP',
    telefone: '(11) 1234-5678',
    responsavel: 'João Silva',
    status: 'ativo'
  },
  {
    id: 2,
    nome: 'UNIDADE 2',
    endereco: 'Av. Sample, 456 - São Paulo, SP',
    telefone: '(11) 8765-4321',
    responsavel: 'Maria Santos',
    status: 'ativo'
  }
];

export function UnidadesTab() {
  const [unidades, setUnidades] = useState<Unidade[]>(initialUnidades);
  const [showForm, setShowForm] = useState(false);
  const [editingUnidade, setEditingUnidade] = useState<Unidade | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const unidade = {
      id: editingUnidade?.id || unidades.length + 1,
      nome: formData.get('nome') as string,
      endereco: formData.get('endereco') as string,
      telefone: formData.get('telefone') as string,
      responsavel: formData.get('responsavel') as string,
      status: 'ativo' as const
    };

    if (editingUnidade) {
      setUnidades(unidades.map(u => u.id === editingUnidade.id ? unidade : u));
    } else {
      setUnidades([...unidades, unidade]);
    }

    setShowForm(false);
    setEditingUnidade(null);
  };

  const handleEdit = (unidade: Unidade) => {
    setEditingUnidade(unidade);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Tem certeza que deseja excluir esta unidade?')) {
      setUnidades(unidades.filter(u => u.id !== id));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Gerenciar Unidades</h2>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-600"
          >
            <FaPlus />
            <span>Nova Unidade</span>
          </button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
              <h3 className="text-lg font-semibold mb-4">
                {editingUnidade ? 'Editar Unidade' : 'Nova Unidade'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome da Unidade
                    </label>
                    <input
                      type="text"
                      name="nome"
                      defaultValue={editingUnidade?.nome}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Telefone
                    </label>
                    <input
                      type="text"
                      name="telefone"
                      defaultValue={editingUnidade?.telefone}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Endereço
                    </label>
                    <input
                      type="text"
                      name="endereco"
                      defaultValue={editingUnidade?.endereco}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Responsável
                    </label>
                    <input
                      type="text"
                      name="responsavel"
                      defaultValue={editingUnidade?.responsavel}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingUnidade(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                  >
                    {editingUnidade ? 'Salvar Alterações' : 'Criar Unidade'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {unidades.map((unidade) => (
            <div
              key={unidade.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
            >
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">{unidade.nome}</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(unidade)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(unidade.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-1">{unidade.endereco}</p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                  <span>📞 {unidade.telefone}</span>
                  <span>👤 {unidade.responsavel}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}