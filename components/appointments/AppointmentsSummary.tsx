'use client';

import { Appointment } from '@/services/appointmentService';

interface AppointmentsSummaryProps {
  appointments: Appointment[];
}

export default function AppointmentsSummary({ appointments }: AppointmentsSummaryProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const stats = appointments.reduce(
    (acc, appointment) => {
      const appointmentDate = new Date(appointment.start_time);
      appointmentDate.setHours(0, 0, 0, 0);

      // Count by status
      acc.byStatus[appointment.status] = (acc.byStatus[appointment.status] || 0) + 1;

      // Count today's appointments
      if (appointmentDate.getTime() === today.getTime()) {
        acc.today += 1;
      }

      return acc;
    },
    { byStatus: {} as Record<string, number>, today: 0 }
  );

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'Agendados';
      case 'confirmed':
        return 'Confirmados';
      case 'cancelled':
        return 'Cancelados';
      case 'completed':
        return 'Concluídos';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-sm font-medium text-gray-500">Hoje</h3>
        <p className="mt-1 text-3xl font-semibold text-gray-900">{stats.today}</p>
      </div>

      {Object.entries(stats.byStatus).map(([status, count]) => (
        <div key={status} className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <h3 className="text-sm font-medium text-gray-500">{getStatusLabel(status)}</h3>
            <span className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
              {count}
            </span>
          </div>
          <p className="mt-1 text-3xl font-semibold text-gray-900">{count}</p>
        </div>
      ))}
    </div>
  );
}
