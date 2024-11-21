'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { FaUserMd, FaUsers, FaCalendarCheck, FaClinicMedical } from 'react-icons/fa';
import StatCard from './components/StatCard';
import AppointmentList from './components/AppointmentList';
import ReminderList from './components/ReminderList';
import dashboardService, { DashboardData } from '@/services/dashboardService';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function DashboardPage() {
  return <Dashboard />;
}

function Dashboard() {
  const { clinicSlug } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setIsLoading(true);
        const data = await dashboardService.getDashboardData(clinicSlug as string);
        setDashboardData(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Erro ao carregar os dados do dashboard');
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardData();
  }, [clinicSlug]);

  if (isLoading) {
    return (
      <div className="p-4 pt-24 flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 pt-24 text-center text-red-600">
        {error}
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="p-4 pt-24 text-center text-gray-600">
        Nenhum dado encontrado
      </div>
    );
  }

  return (
    <div className="p-4 pt-24 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Psicólogos"
          value={dashboardData.stats.psychologists.total.toString()}
          icon={FaUserMd}
          trend={{
            value: `${dashboardData.stats.psychologists.trend.value > 0 ? '+' : ''}${dashboardData.stats.psychologists.trend.value}`,
            direction: dashboardData.stats.psychologists.trend.direction
          }}
        />
        <StatCard
          title="Pacientes"
          value={dashboardData.stats.patients.total.toString()}
          icon={FaUsers}
          trend={{
            value: `${dashboardData.stats.patients.trend.value > 0 ? '+' : ''}${dashboardData.stats.patients.trend.value}`,
            direction: dashboardData.stats.patients.trend.direction
          }}
        />
        <StatCard
          title="Consultas"
          value={dashboardData.stats.appointments.total.toString()}
          icon={FaCalendarCheck}
          trend={{
            value: `${dashboardData.stats.appointments.trend.value > 0 ? '+' : ''}${dashboardData.stats.appointments.trend.value}`,
            direction: dashboardData.stats.appointments.trend.direction
          }}
        />
        <StatCard
          title="Unidades"
          value={dashboardData.stats.units.total.toString()}
          icon={FaClinicMedical}
          trend={{
            value: `${dashboardData.stats.units.trend.value > 0 ? '+' : ''}${dashboardData.stats.units.trend.value}`,
            direction: dashboardData.stats.units.trend.direction
          }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AppointmentList
          title="Consultas Recentes"
          appointments={dashboardData.recentAppointments}
        />
        <ReminderList 
          title="Próximos Lembretes"
          reminders={dashboardData.upcomingReminders} 
        />
      </div>
    </div>
  );
}