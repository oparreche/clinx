import React from 'react';
import { IconType } from 'react-icons';

interface FinanceiroCardProps {
  titulo: string;
  valor: number;
  descricao: string;
  percentual: number;
  Icon: IconType;
  corIcone: string;
  corBarra: string;
}

export default function FinanceiroCard({
  titulo,
  valor,
  descricao,
  percentual,
  Icon,
  corIcone,
  corBarra
}: FinanceiroCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className={`p-3 ${corIcone} rounded-full`}>
            <Icon className="h-6 w-6" />
          </div>
          <div className="ml-4">
            <h2 className="text-lg font-semibold">{titulo}</h2>
            <p className="text-sm text-gray-500">{descricao}</p>
          </div>
        </div>
        <p className="text-2xl font-bold">R$ {valor.toFixed(2)}</p>
      </div>
      <div className="h-2 bg-gray-200 rounded-full">
        <div 
          className={`h-2 ${corBarra} rounded-full`} 
          style={{ width: `${Math.min(percentual, 100)}%` }}
        />
      </div>
    </div>
  );
}