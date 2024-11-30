interface Appointment {
  doctor: string;
  date: string;
  status: 'Realizada' | 'Agendada' | 'Cancelada';
}

export default function AppointmentHistory() {
  const appointments: Appointment[] = [
    {
      doctor: 'Dr. Almeida',
      date: '10 de Janeiro, 2024 - 14:00',
      status: 'Realizada'
    },
    {
      doctor: 'Dra. Santos',
      date: '15 de Janeiro, 2024 - 15:30',
      status: 'Agendada'
    },
    {
      doctor: 'Dr. Almeida',
      date: '05 de Janeiro, 2024 - 10:00',
      status: 'Cancelada'
    }
  ];

  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'Realizada':
        return 'bg-green-100 text-green-800';
      case 'Agendada':
        return 'bg-blue-100 text-blue-800';
      case 'Cancelada':
        return 'bg-red-100 text-red-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <h2 className="text-lg font-medium mb-4">Histórico de Consultas</h2>
        <div className="space-y-4">
          {appointments.map((appointment, index) => (
            <div key={index} className="flex items-center justify-between border-b pb-4">
              <div>
                <p className="font-medium">Consulta com {appointment.doctor}</p>
                <p className="text-sm text-gray-500">{appointment.date}</p>
              </div>
              <div className="flex space-x-2">
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(appointment.status)}`}>
                  {appointment.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}