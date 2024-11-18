import React from 'react';

interface LembreteFiltersProps {
  prioridade: string;
  tipo: string;
  status: string;
  onPrioridadeChange: (value: string) => void;
  onTipoChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

export default function LembreteFilters({
  prioridade,
  tipo,
  status,
  onPrioridadeChange,
  onTipoChange,
  onStatusChange
}: LembreteFiltersProps) {
  return (
    <div className="p-4 bg-gray-50 rounded-lg flex flex-wrap gap-4">
      <select
        value={prioridade}
        onChange={(e) => onPrioridadeChange(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg"
      >
        <option value="">Todas as Prioridades</option>
        <option value="alta">Alta</option>
        <option value="media">Média</option>
        <option value="baixa">Baixa</option>
      </select>

      <select
        value={tipo}
        onChange={(e) => onTipoChange(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg"
      >
        <option value="">Todos os Tipos</option>
        <option value="reuniao">Reunião</option>
        <option value="tarefa">Tarefa</option>
        <option value="consulta">Consulta</option>
        <option value="outro">Outro</option>
      </select>

      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg"
      >
        <option value="">Todos os Status</option>
        <option value="pendente">Pendente</option>
        <option value="concluido">Concluído</option>
      </select>
    </div>
  );
}