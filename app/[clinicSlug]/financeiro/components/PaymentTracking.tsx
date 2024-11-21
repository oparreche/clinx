'use client';

import React, { useState } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';
import { Payment } from '../types/payment';
import PaymentColumn from './PaymentColumn';
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
      status: t.status === 'pago' ? 'paid' : t.status === 'pendente' ? 'pending' : 'canceled'
    }));
  };

  const [payments, setPayments] = useState<Payment[]>(convertTransacoesToPayments(transacoes));

  const getPaymentsByStatus = (status: Payment['status']) => 
    payments.filter(p => p.status === status);

  const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    // If dropped in the same column and same position
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const paymentId = parseInt(draggableId);
    const payment = payments.find(p => p.id === paymentId);

    if (!payment) return;

    const newPayments = Array.from(payments);
    const sourcePayments = newPayments.filter(p => p.status === source.droppableId);
    const destinationPayments = source.droppableId === destination.droppableId
      ? sourcePayments
      : newPayments.filter(p => p.status === destination.droppableId);

    // Remove from source
    sourcePayments.splice(source.index, 1);

    // Update status if moving between columns
    if (source.droppableId !== destination.droppableId) {
      payment.status = destination.droppableId as Payment['status'];
    }

    // Add to destination
    destinationPayments.splice(destination.index, 0, payment);

    // Update the payments array
    setPayments(newPayments.map(p => {
      if (p.id === payment.id) {
        return payment;
      }
      return p;
    }));
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PaymentColumn
          title="Pagamentos Pendentes"
          status="pending"
          icon={FaClock}
          iconColor="text-yellow-500"
          payments={getPaymentsByStatus('pending')}
        />
        <PaymentColumn
          title="Pagamentos Realizados"
          status="paid"
          icon={FaCheckCircle}
          iconColor="text-green-500"
          payments={getPaymentsByStatus('paid')}
        />
        <PaymentColumn
          title="Pagamentos Cancelados"
          status="canceled"
          icon={FaTimesCircle}
          iconColor="text-red-500"
          payments={getPaymentsByStatus('canceled')}
        />
      </div>
    </DragDropContext>
  );
}