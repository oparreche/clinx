'use client';

import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface PaymentsPieChartProps {
  pendingAmount: number;
  paidAmount: number;
  canceledAmount: number;
}

export default function PaymentsPieChart({ pendingAmount, paidAmount, canceledAmount }: PaymentsPieChartProps) {
  const total = pendingAmount + paidAmount + canceledAmount;

  // Se não houver dados, mostra uma mensagem
  if (total === 0) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center min-h-[300px]">
        <h3 className="text-lg font-semibold mb-4">Distribuição de Pagamentos</h3>
        <p className="text-gray-500">Nenhum dado de pagamento disponível</p>
      </div>
    );
  }

  const data: ChartData<'pie'> = {
    labels: ['Pendentes', 'Recebidos', 'Cancelados'],
    datasets: [
      {
        data: [pendingAmount, paidAmount, canceledAmount],
        backgroundColor: [
          'rgba(255, 159, 64, 0.7)',  // Laranja para pendentes
          'rgba(75, 192, 192, 0.7)',   // Verde para recebidos
          'rgba(255, 99, 132, 0.7)',   // Vermelho para cancelados
        ],
        borderColor: [
          'rgba(255, 159, 64, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const value = context.raw as number;
            const percentage = ((value / total) * 100).toFixed(1);
            return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (${percentage}%)`;
          }
        }
      }
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Distribuição de Pagamentos</h3>
        <div className="text-sm text-gray-600">
          Total: R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </div>
      </div>
      <div className="w-full max-w-md mx-auto">
        <Pie data={data} options={options} />
      </div>
      <div className="mt-4 grid grid-cols-3 gap-4 text-center text-sm">
        <div className="p-2 rounded-lg bg-orange-50">
          <p className="font-semibold text-orange-500">Pendentes</p>
          <p>R$ {pendingAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          <p className="text-xs text-gray-500">
            {((pendingAmount / total) * 100).toFixed(1)}%
          </p>
        </div>
        <div className="p-2 rounded-lg bg-teal-50">
          <p className="font-semibold text-teal-500">Recebidos</p>
          <p>R$ {paidAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          <p className="text-xs text-gray-500">
            {((paidAmount / total) * 100).toFixed(1)}%
          </p>
        </div>
        <div className="p-2 rounded-lg bg-red-50">
          <p className="font-semibold text-red-500">Cancelados</p>
          <p>R$ {canceledAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          <p className="text-xs text-gray-500">
            {((canceledAmount / total) * 100).toFixed(1)}%
          </p>
        </div>
      </div>
    </div>
  );
}
