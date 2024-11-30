'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { FaUserMd, FaUsers, FaCalendarCheck, FaClinicMedical } from 'react-icons/fa';
import StatCard from './components/StatCard';
import AppointmentList from './components/AppointmentList';
import ReminderList from './components/ReminderList';
import PaymentsPieChart from './components/PaymentsPieChart';
import PaymentsBarChart from './components/PaymentsBarChart';
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
        Nenhum dado disponível
      </div>
    );
  }

  return (
    <div className="p-4 pt-24">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Psicólogos"
          value={dashboardData.stats.psychologists.total.toString()}
          trend={{
            value: dashboardData.stats.psychologists.trend.value.toString(),
            direction: dashboardData.stats.psychologists.trend.direction
          }}
          icon={FaUserMd}
        />
        <StatCard
          title="Pacientes"
          value={dashboardData.stats.patients.total.toString()}
          trend={{
            value: dashboardData.stats.patients.trend.value.toString(),
            direction: dashboardData.stats.patients.trend.direction
          }}
          icon={FaUsers}
        />
        <StatCard
          title="Consultas"
          value={dashboardData.stats.appointments.total.toString()}
          trend={{
            value: dashboardData.stats.appointments.trend.value.toString(),
            direction: dashboardData.stats.appointments.trend.direction
          }}
          icon={FaCalendarCheck}
        />
        <StatCard
          title="Unidades"
          value={dashboardData.stats.units.total.toString()}
          trend={{
            value: dashboardData.stats.units.trend.value.toString(),
            direction: dashboardData.stats.units.trend.direction
          }}
          icon={FaClinicMedical}
        />
      </div>

      {/* Middle Section with Charts and Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="space-y-8">
          <PaymentsPieChart
            pendingAmount={dashboardData.stats.payments?.pending ?? 0}
            paidAmount={dashboardData.stats.payments?.paid ?? 0}
            canceledAmount={dashboardData.stats.payments?.canceled ?? 0}
          />
          <PaymentsBarChart
            pendingAmount={dashboardData.stats.payments?.pending ?? 0}
            paidAmount={dashboardData.stats.payments?.paid ?? 0}
            canceledAmount={dashboardData.stats.payments?.canceled ?? 0}
          />
        </div>
        <AppointmentList 
          title="Consultas Recentes"
          appointments={dashboardData.recentAppointments} 
        />
      </div>

      {/* Bottom Section */}
      <div className="mb-8">
        <ReminderList 
          title="Lembretes Próximos"
          reminders={dashboardData.upcomingReminders} 
        />
      </div>
    </div>
  );
}