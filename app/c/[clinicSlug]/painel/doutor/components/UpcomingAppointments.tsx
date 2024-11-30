import React from 'react';
import { FaClock, FaTimesCircle } from 'react-icons/fa';

const mockAppointments = [
  {
    id: 1,
    doctor: 'Dr. Almeida',
    date: '15/01/2024',
    time: '14:00',
    type: 'Consulta Regular',
    status: 'confirmed',
    paymentStatus: 'pending'
  },
  {
    id: 2,
    doctor: 'Dra. Santos',
    date: '22/01/2024',
    time: '15:30',
    type: 'Avaliação',
    status: 'scheduled',
    paymentStatus: 'paid'
  }
];

export default function UpcomingAppointments() {
  const handleCancel = (id: number) => {
    // Implement cancellation logic
    console.log('Cancelar consulta:', id);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4">Próximas Consultas</h2>
        <div className="space-y-4">
          {mockAppointments.map((appointment) => (
            <div key={appointment.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{appointment.doctor}</h3>
                  <p className="text-sm text-gray-500">{appointment.type}</p>
                  <div className="flex items-center mt-2 text-sm text-gray-600">
                    <FaClock className="mr-1" />
                    <span>{appointment.date} às {appointment.time}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    appointment.paymentStatus === 'paid' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {appointment.paymentStatus === 'paid' ? 'Pago' : 'Pagamento Pendente'}
                  </span>
                  <button
                    onClick={() => handleCancel(appointment.id)}
                    className="flex items-center text-red-600 hover:text-red-800 text-sm"
                  >
                    <FaTimesCircle className="mr-1" />
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}