import { FaUserMd, FaUsers, FaCalendarCheck, FaClinicMedical } from 'react-icons/fa';
import StatCard from './components/StatCard';
import AppointmentList from './components/AppointmentList';
import ReminderList from './components/ReminderList';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';

const mockAppointments = [
  {
    patient: 'Carlos Silva',
    doctor: 'Dr. Almeida',
    unit: 'UNIDADE 1',
    time: '14:00',
    date: 'Hoje',
    status: 'scheduled' as const
  },
  {
    patient: 'Maria Santos',
    doctor: 'Dra. Santos',
    unit: 'UNIDADE 2',
    time: '15:30',
    date: 'Hoje',
    status: 'confirmed' as const
  },
  {
    patient: 'João Costa',
    doctor: 'Dr. Almeida',
    unit: 'UNIDADE 1',
    time: '16:45',
    date: 'Hoje',
    status: 'completed' as const
  }
];

const mockReminders = [
  {
    title: 'Reunião com Equipe',
    description: 'Discussão sobre novos protocolos de atendimento',
    time: '16:00',
    date: 'Hoje',
    priority: 'high' as const
  },
  {
    title: 'Revisão de Prontuários',
    description: 'Atualização dos prontuários da semana',
    time: '11:00',
    date: 'Amanhã',
    priority: 'medium' as const
  },
  {
    title: 'Manutenção de Equipamentos',
    description: 'Verificação de rotina dos equipamentos',
    time: '14:30',
    date: 'Amanhã',
    priority: 'low' as const
  }
];

export default function Dashboard() {
  return (
    <AuthenticatedLayout>
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <select className="px-4 py-2 border border-gray-300 rounded-lg">
            <option value="today">Hoje</option>
            <option value="week">Esta Semana</option>
            <option value="month">Este Mês</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Psicólogos"
            value={24}
            icon={FaUserMd}
            bgColor="bg-blue-100"
            iconColor="text-blue-600"
            trend={{ value: 10, isPositive: true }}
          />

          <StatCard
            title="Pacientes"
            value={145}
            icon={FaUsers}
            bgColor="bg-green-100"
            iconColor="text-green-600"
            trend={{ value: 15, isPositive: true }}
          />

          <StatCard
            title="Consultas Hoje"
            value={12}
            icon={FaCalendarCheck}
            bgColor="bg-purple-100"
            iconColor="text-purple-600"
            trend={{ value: 5, isPositive: false }}
          />

          <StatCard
            title="Unidades"
            value={2}
            icon={FaClinicMedical}
            bgColor="bg-yellow-100"
            iconColor="text-yellow-600"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AppointmentList
            title="Próximos Agendamentos"
            appointments={mockAppointments}
          />
          <ReminderList reminders={mockReminders} />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}