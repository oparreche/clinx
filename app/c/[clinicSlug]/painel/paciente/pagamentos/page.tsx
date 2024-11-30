import React from 'react';
import { FaCreditCard, FaBarcode } from 'react-icons/fa';
import { SiPix } from 'react-icons/si';

const mockPayments = [
  {
    id: 1,
    description: 'Consulta Psicológica',
    date: '15/01/2024',
    amount: 150.00,
    status: 'pending',
    dueDate: '20/01/2024'
  },
  {
    id: 2,
    description: 'Avaliação Psicológica',
    date: '01/12/2023',
    amount: 300.00,
    status: 'paid',
    paidAt: '01/12/2023'
  }
];

export default function Payments() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Pagamentos</h1>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Pagamentos Pendentes</h2>
          <div className="space-y-4">
            {mockPayments.filter(p => p.status === 'pending').map((payment) => (
              <div key={payment.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{payment.description}</h3>
                    <p className="text-sm text-gray-500">Vencimento: {payment.dueDate}</p>
                    <p className="text-lg font-semibold mt-2">R$ {payment.amount.toFixed(2)}</p>
                  </div>
                  <div className="space-y-2">
                    <button
                      onClick={() => {}}
                      className="flex items-center w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      <FaCreditCard className="mr-2" />
                      Cartão
                    </button>
                    <button
                      onClick={() => {}}
                      className="flex items-center w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                      <SiPix className="mr-2" />
                      Pix
                    </button>
                    <button
                      onClick={() => {}}
                      className="flex items-center w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                    >
                      <FaBarcode className="mr-2" />
                      Boleto
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Histórico de Pagamentos</h2>
            <div className="space-y-4">
              {mockPayments.filter(p => p.status === 'paid').map((payment) => (
                <div key={payment.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{payment.description}</h3>
                      <p className="text-sm text-gray-500">Pago em: {payment.paidAt}</p>
                      <p className="text-lg font-semibold mt-2">R$ {payment.amount.toFixed(2)}</p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg">
                      Pago
                    </span>
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