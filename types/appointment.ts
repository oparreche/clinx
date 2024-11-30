export interface AppointmentFilters {
  search: string;
  doctor: string;
  patient: string;
  status: string;
  startDate: Date | null;
  endDate: Date | null;
}

export const appointmentStatusMap = {
  scheduled: 'Agendado',
  confirmed: 'Confirmado',
  cancelled: 'Cancelado',
  completed: 'Concluído',
  no_show: 'Não compareceu'
} as const;

export type AppointmentStatus = keyof typeof appointmentStatusMap;

export interface Appointment {
  id: number;
  patient_id: number;
  doctor_id: number;
  start_time: string;
  end_time: string;
  status: AppointmentStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
  patient?: {
    id: number;
    name: string;
    email: string;
    phone?: string;
  };
  doctor?: {
    id: number;
    name: string;
    email: string;
    specialty: string;
  };
}
