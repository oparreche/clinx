export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled' | 'confirmed';

export type RecurrenceType = 'none' | 'daily' | 'weekly' | 'monthly';

export interface RecurrenceInfo {
  type: RecurrenceType;
  interval: number; // Ex: a cada 1 semana, a cada 2 semanas, etc.
  endDate?: string; // Data opcional de término da recorrência
  daysOfWeek?: number[]; // Para recorrência semanal (0 = domingo, 6 = sábado)
}

export interface Appointment {
  id: number;
  clinic_id: number;
  doctor_id: number;
  patient_id: number;
  date: string;
  start_time: string;
  end_time: string;
  status: AppointmentStatus;
  notes?: string;
  recurrence?: RecurrenceInfo;
  recurrence_group_id?: string; // ID para agrupar agendamentos recorrentes
  doctor?: {
    id: number;
    name: string;
    email: string;
    specialty: string;
  };
  patient?: {
    id: number;
    name: string;
    email: string;
  };
  created_at: string;
  updated_at: string;
}

export interface AppointmentFilters {
  search?: string;
  status?: string;
  doctor?: string;
  startDate: string | null;
  endDate: string | null;
}

export interface CreateAppointmentDTO {
  doctor_id: number;
  patient_id: number;
  date: string;
  start_time: string;
  end_time: string;
  notes?: string;
  recurrence?: RecurrenceInfo;
}

export interface UpdateAppointmentDTO extends Partial<CreateAppointmentDTO> {
  status?: AppointmentStatus;
}

export const appointmentStatusMap: Record<AppointmentStatus, string> = {
  scheduled: 'Agendado',
  completed: 'Concluído',
  cancelled: 'Cancelado',
  confirmed: 'Confirmado'
};