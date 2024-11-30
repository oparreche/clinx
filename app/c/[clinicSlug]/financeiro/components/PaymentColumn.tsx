'use client';

import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { IconType } from 'react-icons';
import { Payment } from '../types/payment';
import PaymentCard from './PaymentCard';

interface PaymentColumnProps {
  title: string;
  status: Payment['status'];
  icon: IconType;
  iconColor: string;
  payments: Payment[];
}

function PaymentColumn({ 
  title, 
  status, 
  icon: Icon,
  iconColor,
  payments 
}: PaymentColumnProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center space-x-2 mb-4">
        <Icon className={`h-5 w-5 ${iconColor}`} />
        <h3 className="text-lg font-medium">{title}</h3>
        <span className="ml-auto bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm">
          {payments.length}
        </span>
      </div>
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`bg-gray-50 p-4 rounded-lg min-h-[400px] transition-colors ${
              snapshot.isDraggingOver ? 'bg-blue-50 ring-2 ring-blue-200' : ''
            }`}
          >
            {payments.map((payment, index) => (
              <PaymentCard key={payment.id} payment={payment} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}

export default React.memo(PaymentColumn);