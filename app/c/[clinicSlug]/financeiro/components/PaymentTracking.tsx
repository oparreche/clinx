'use client';

import React, { useState } from 'react';
import { FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';
import { Payment } from '../types/payment';
import { Transacao } from '../types';

interface PaymentTrackingProps {
  transacoes: Transacao[];
}

export default function PaymentTracking({ transacoes }: PaymentTrackingProps) {
  // Convert transacoes to Payment type
  const convertTransacoesToPayments = (transacoes: Transacao[]): Payment[] => {
    return transacoes.map(t => ({
      id: t.id,
      patient: t.descricao,
      service: t.categoria,
      value: t.valor,
      dueDate: t.vencimento || t.data,
      status: t.status === 'pago' ? 'completed' : t.status === 'pendente' ? 'pending' : 'reconciled',
      linkedPayments: []
    }));
  };

  const [payments, setPayments] = useState<Payment[]>(convertTransacoesToPayments(transacoes));
  const [selectedPending, setSelectedPending] = useState<Payment | null>(null);
  const [selectedCompleted, setSelectedCompleted] = useState<Payment[]>([]);

  const getPaymentsByStatus = (status: Payment['status']) => 
    payments.filter(p => p.status === status);

  const handlePendingClick = (payment: Payment) => {
    setSelectedPending(selectedPending?.id === payment.id ? null : payment);
    setSelectedCompleted([]);
  };

  const handleCompletedClick = (payment: Payment) => {
    if (!selectedPending) return;

    setSelectedCompleted(prev => {
      const isSelected = prev.some(p => p.id === payment.id);
      if (isSelected) {
        return prev.filter(p => p.id !== payment.id);
      } else {
        return [...prev, payment];
      }
    });
  };

  const handleReconcile = () => {
    if (!selectedPending || selectedCompleted.length === 0) return;

    const reconciled: Payment = {
      ...selectedPending,
      status: 'reconciled',
      linkedPayments: selectedCompleted.map(p => p.id)
    };

    setPayments(prev => {
      return prev.map(p => {
        if (p.id === selectedPending.id) {
          return reconciled;
        }
        if (selectedCompleted.some(sp => sp.id === p.id)) {
          return { ...p, status: 'reconciled' };
        }
        return p;
      });
    });

    setSelectedPending(null);
    setSelectedCompleted([]);
  };

  return (
    <div className="flex flex-col">
      {(selectedPending && selectedCompleted.length > 0) && (
        <div className="mb-4 p-4 bg-blue-100 rounded-lg flex justify-between items-center">
          <span>
            Reconciliar pagamento pendente com {selectedCompleted.length} pagamento(s) realizado(s)
          </span>
          <button
            onClick={handleReconcile}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Conciliar
          </button>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FaClock className="text-yellow-500" />
            Pagamentos Pendentes
          </h3>
          <div className="space-y-2">
            {getPaymentsByStatus('pending').map(payment => (
              <div
                key={payment.id}
                onClick={() => handlePendingClick(payment)}
                className={`p-3 rounded cursor-pointer border ${
                  selectedPending?.id === payment.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="font-medium">{payment.patient}</div>
                <div className="text-sm text-gray-600">R$ {payment.value.toFixed(2)}</div>
                <div className="text-xs text-gray-500">Vencimento: {payment.dueDate}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FaCheckCircle className="text-green-500" />
            Pagamentos Realizados
          </h3>
          <div className="space-y-2">
            {getPaymentsByStatus('completed').map(payment => (
              <div
                key={payment.id}
                onClick={() => handleCompletedClick(payment)}
                className={`p-3 rounded cursor-pointer border ${
                  selectedCompleted.some(p => p.id === payment.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="font-medium">{payment.patient}</div>
                <div className="text-sm text-gray-600">R$ {payment.value.toFixed(2)}</div>
                <div className="text-xs text-gray-500">Data: {payment.dueDate}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FaCheckCircle className="text-blue-500" />
            Pagamentos Conciliados
          </h3>
          <div className="space-y-2">
            {getPaymentsByStatus('reconciled').map(payment => (
              <div
                key={payment.id}
                className="p-3 rounded border border-gray-200"
              >
                <div className="font-medium">{payment.patient}</div>
                <div className="text-sm text-gray-600">R$ {payment.value.toFixed(2)}</div>
                <div className="text-xs text-gray-500">Data: {payment.dueDate}</div>
                {payment.linkedPayments.length > 0 && (
                  <div className="mt-2 text-xs text-gray-500">
                    Pagamentos vinculados: {payment.linkedPayments.length}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}