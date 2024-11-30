'use client';

import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface PaymentsBarChartProps {
  pendingAmount: number;
  paidAmount: number;
  canceledAmount: number;
}

export default function PaymentsBarChart({ pendingAmount, paidAmount, canceledAmount }: PaymentsBarChartProps) {
  const data: ChartData<'bar'> = {
    labels: ['Pendentes', 'Recebidos', 'Cancelados'],
    datasets: [
      {
        label: 'Valor (R$)',
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

  const options: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const value = context.raw as number;
            return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
          }
        }
      }
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Valores por Status</h3>
      <div className="w-full">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
