import React from 'react';
import { FaTimes } from 'react-icons/fa';

interface ServicoFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export default function ServicoForm({ isOpen, onClose, onSubmit }: ServicoFormProps) {
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const disponibilidade = Array.from(formData.getAll('disponibilidade'));
    const psicologos = Array.from(formData.getAll('psicologos'));
    
    const data = {
      nome: formData.get('nome'),
      descricao: formData.get('descricao'),
      duracao: formData.get('duracao'),
      preco: parseFloat(formData.get('preco') as string),
      disponibilidade,
      categoria: formData.get('categoria'),
      status: 'Ativo',
      psicologos: psicologos.length > 0 ? psicologos : undefined,
      maximoPacientes: formData.get('maximoPacientes') 
        ? parseInt(formData.get('maximoPacientes') as string)
        : undefined
    };

    onSubmit(data);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Novo Serviço</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome do Serviço
              </label>
              <input
                name="nome"
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <textarea
                name="descricao"
                required
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duração
              </label>
              <select
                name="duracao"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="30 min">30 minutos</option>
                <option value="50 min">50 minutos</option>
                <option value="60 min">1 hora</option>
                <option value="90 min">1 hora e 30 minutos</option>
                <option value="120 min">2 horas</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preço
              </label>
              <input
                name="preco"
                type="number"
                step="0.01"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoria
              </label>
              <select
                name="categoria"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Individual">Individual</option>
                <option value="Grupo">Grupo</option>
                <option value="Avaliação">Avaliação</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Máximo de Pacientes
              </label>
              <input
                name="maximoPacientes"
                type="number"
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Disponibilidade
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'].map((dia) => (
                  <label key={dia} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="disponibilidade"
                      value={dia}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{dia}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Psicólogos
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['Dr. Almeida', 'Dra. Santos'].map((psicologo) => (
                  <label key={psicologo} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="psicologos"
                      value={psicologo}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{psicologo}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}