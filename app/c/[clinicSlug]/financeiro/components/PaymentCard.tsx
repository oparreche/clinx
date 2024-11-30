'use client';

import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Payment } from '../types/payment';

interface PaymentCardProps {
  payment: Payment;
  index: number;
}

function PaymentCard({ payment, index }: PaymentCardProps) {
  return (
    <Draggable draggableId={payment.id.toString()} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-white p-4 rounded-lg shadow mb-4 transform transition-all duration-200 ${
            snapshot.isDragging 
              ? 'shadow-lg ring-2 ring-blue-500 rotate-2 scale-105' 
              : 'hover:shadow-md hover:-translate-y-1'
          }`}
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="font-medium">{payment.patient}</h4>
              <p className="text-sm text-gray-500">{payment.service}</p>
            </div>
            <span className={`font-medium text-lg ${
              payment.status === 'completed' 
                ? 'text-green-600' 
                : payment.status === 'pending' 
                  ? 'text-yellow-600' 
                  : 'text-blue-600'
            }`}>
              R$ {payment.value.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">
              Vencimento: {new Date(payment.dueDate).toLocaleDateString()}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              payment.status === 'completed'
                ? 'bg-green-100 text-green-800'
                : payment.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-blue-100 text-blue-800'
            }`}>
              {payment.status === 'completed' 
                ? 'Pago' 
                : payment.status === 'pending' 
                  ? 'Pendente' 
                  : 'Conciliado'}
            </span>
          </div>
        </div>
      )}
    </Draggable>
  );
}

export default React.memo(PaymentCard);