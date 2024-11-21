import api from './api';

export interface DashboardStats {
  psychologists: {
    total: number;
    trend: {
      value: number;
      direction: 'up' | 'down' | 'neutral';
    };
  };
  patients: {
    total: number;
    trend: {
      value: number;
      direction: 'up' | 'down' | 'neutral';
    };
  };
  appointments: {
    total: number;
    trend: {
      value: number;
      direction: 'up' | 'down' | 'neutral';
    };
  };
  units: {
    total: number;
    trend: {
      value: number;
      direction: 'up' | 'down' | 'neutral';
    };
  };
}

export interface DashboardAppointment {
  id: string;
  patient: string;
  doctor: string;
  unit: string;
  time: string;
  date: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
}

export interface DashboardReminder {
  id: string;
  title: string;
  description: string;
  time: string;
  date: string;
  priority: 'high' | 'medium' | 'low';
}

export interface DashboardData {
  stats: DashboardStats;
  recentAppointments: DashboardAppointment[];
  upcomingReminders: DashboardReminder[];
}

const dashboardService = {
  async getDashboardData(clinicSlug: string): Promise<DashboardData> {
    const { data } = await api.get<DashboardData>(`/api/clinics/${clinicSlug}/dashboard`);
    return data;
  }
};

export default dashboardService;
