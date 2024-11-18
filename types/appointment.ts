export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled' | 'no_show';

export type AppointmentType = 'consultation' | 'return' | 'exam';

export interface Appointment {
  id: string;
  title: string;
  description: string;
  patientName: string;
  doctor: string;
  specialty: string;
  start: Date;
  end: Date;
  status: AppointmentStatus;
  type: AppointmentType;
  backgroundColor: string;
  borderColor: string;
  notes?: string;
}

export interface AppointmentFilters {
  search: string;
  status: string;
  doctor: string;
  startDate: Date | null;
  endDate: Date | null;
}

export interface AppointmentFormData {
  title: string;
  description: string;
  start: string;
  end: string;
  doctor: string;
  specialty: string;
  type: AppointmentType;
}

export const appointmentStatusMap: Record<AppointmentStatus, string> = {
  scheduled: 'Agendado',
  completed: 'Concluído',
  cancelled: 'Cancelado',
  no_show: 'Não Compareceu',
};

export const appointmentTypeMap = {
  consultation: 'Consulta',
  return: 'Retorno',
  exam: 'Exame'
};