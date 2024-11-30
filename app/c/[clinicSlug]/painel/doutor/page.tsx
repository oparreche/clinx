import { FaCalendarAlt, FaFileAlt, FaClock } from 'react-icons/fa';
import DashboardCard from './components/DashboardCard';
import AppointmentHistory from './components/AppointmentHistory';

export default function PatientDashboard() {
  const dashboardCards = [
    {
      title: 'Próxima Consulta',
      value: '15 de Janeiro, 14:00',
      Icon: FaCalendarAlt,
      iconBgColor: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Laudos Disponíveis',
      value: '2 laudos para visualizar',
      Icon: FaFileAlt,
      iconBgColor: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      title: 'Histórico',
      value: '12 consultas realizadas',
      Icon: FaClock,
      iconBgColor: 'bg-purple-100',
      iconColor: 'text-purple-600'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {dashboardCards.map((card, index) => (
          <DashboardCard key={index} {...card} />
        ))}
      </div>
      <AppointmentHistory />
    </div>
  );
}