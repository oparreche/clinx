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
  payments: {
    pending: number;
    paid: number;
    canceled: number;
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

// Mock data para testes
const mockPaymentsData = {
  pending: 15750.50,
  paid: 45980.75,
  canceled: 8320.25,
  total: 70051.50,
  trend: {
    value: 12.5,
    direction: 'up' as const
  }
};

const dashboardService = {
  async getDashboardData(clinicSlug: string): Promise<DashboardData> {
    try {
      // Temporariamente usando dados mocados para pagamentos
      const { data } = await api.get<DashboardData>(`/api/clinics/${clinicSlug}/dashboard`);
      
      // Substituindo apenas os dados de pagamento com os dados mocados
      return {
        ...data,
        stats: {
          ...data.stats,
          payments: mockPaymentsData
        }
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  }
};

export default dashboardService;
