import React from 'react';

interface Appointment {
  patient: string;
  doctor: string;
  unit: string;
  time: string;
  date: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
}

interface AppointmentListProps {
  title: string;
  appointments: Appointment[];
}

export default function AppointmentList({ title, appointments }: AppointmentListProps) {
  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <div className="space-y-4">
        {appointments.map((appointment, index) => (
          <div key={index} className="flex items-center justify-between border-b pb-4">
            <div>
              <p className="font-medium">{appointment.patient}</p>
              <div className="text-sm text-gray-500">
                <p>{appointment.doctor} - {appointment.unit}</p>
                <p>{appointment.date} às {appointment.time}</p>
              </div>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(appointment.status)}`}>
              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}