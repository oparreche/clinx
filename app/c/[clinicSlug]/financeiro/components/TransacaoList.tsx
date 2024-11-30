import React from 'react';
import { Transacao } from '../types';

interface TransacaoListProps {
  transacoes: Transacao[];
  titulo: string;
}

export default function TransacaoList({ transacoes, titulo }: TransacaoListProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">{titulo}</h2>
      <div className="space-y-4">
        {transacoes.map((transacao) => (
          <div key={transacao.id} className="flex items-center justify-between border-b pb-4">
            <div>
              <p className="font-medium">{transacao.descricao}</p>
              <div className="flex space-x-4 text-sm text-gray-500">
                <span>{transacao.categoria}</span>
                <span>{new Date(transacao.data).toLocaleDateString()}</span>
                {transacao.status === 'pendente' && transacao.vencimento && (
                  <span className="text-red-500">
                    Vence: {new Date(transacao.vencimento).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className={`font-medium ${
                transacao.tipo === 'receita' ? 'text-green-600' : 'text-red-600'
              }`}>
                {transacao.tipo === 'receita' ? '+' : '-'} R$ {transacao.valor.toFixed(2)}
              </p>
              <span className={`text-xs px-2 py-1 rounded-full ${
                transacao.status === 'pago'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {transacao.status === 'pago' ? 'Pago' : 'Pendente'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}