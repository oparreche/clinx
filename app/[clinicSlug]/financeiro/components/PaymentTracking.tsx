'use client';

import React, { useState } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';
import { Payment } from '../types/payment';
import PaymentColumn from './PaymentColumn';

const initialPayments: Payment[] = [
  {
    id: 1,
    patient: 'Carlos Silva',
    service: 'Consulta Psicológica',
    value: 150.00,
    dueDate: '2024-01-15',
    status: 'pending'
  },
  {
    id: 2,
    patient: 'Maria Santos',
    service: 'Avaliação Psicológica',
    value: 300.00,
    dueDate: '2024-01-10',
    status: 'paid'
  },
  {
    id: 3,
    patient: 'João Costa',
    service: 'Terapia em Grupo',
    value: 80.00,
    dueDate: '2024-01-20',
    status: 'canceled'
  }
];

export default function PaymentTracking() {
  const [payments, setPayments] = useState<Payment[]>(initialPayments);

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