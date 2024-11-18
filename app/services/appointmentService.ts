import api from './api';

export interface Appointment {
  id: number;
  clinic_id: number;
  doctor_id: number;
  patient_id: number;
  date: string;
  start_time: string;
  end_time: string;
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
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

export interface CreateAppointmentDTO {
  doctor_id: number;
  patient_id: number;
  date: string;
  start_time: string;
  end_time: string;
  notes?: string;
}

export interface UpdateAppointmentDTO extends Partial<CreateAppointmentDTO> {
  status?: 'scheduled' | 'confirmed' | 'cancelled' | 'completed';
}

class AppointmentService {
  async getAppointments(clinicSlug: string): Promise<Appointment[]> {
    const response = await api.get<Appointment[]>(`/clinics/${clinicSlug}/appointments`);
    return response.data;
  }

  async getAppointment(clinicSlug: string, id: number): Promise<Appointment> {
    const response = await api.get<Appointment>(`/clinics/${clinicSlug}/appointments/${id}`);
    return response.data;
  }

  async createAppointment(clinicSlug: string, data: CreateAppointmentDTO): Promise<Appointment> {
    const response = await api.post<Appointment>(`/clinics/${clinicSlug}/appointments`, data);
    return response.data;
  }

  async updateAppointment(clinicSlug: string, id: number, data: UpdateAppointmentDTO): Promise<Appointment> {
    const response = await api.put<Appointment>(`/clinics/${clinicSlug}/appointments/${id}`, data);
    return response.data;
  }

  async deleteAppointment(clinicSlug: string, id: number): Promise<void> {
    await api.delete(`/clinics/${clinicSlug}/appointments/${id}`);
  }

  async getAppointmentsByDoctor(clinicSlug: string, doctorId: number): Promise<Appointment[]> {
    const response = await api.get<Appointment[]>(`/clinics/${clinicSlug}/doctors/${doctorId}/appointments`);
    return response.data;
  }

  async getAppointmentsByPatient(clinicSlug: string, patientId: number): Promise<Appointment[]> {
    const response = await api.get<Appointment[]>(`/clinics/${clinicSlug}/patients/${patientId}/appointments`);
    return response.data;
  }

  async confirmAppointment(clinicSlug: string, id: number): Promise<Appointment> {
    return this.updateAppointment(clinicSlug, id, { status: 'confirmed' });
  }

  async cancelAppointment(clinicSlug: string, id: number): Promise<Appointment> {
    return this.updateAppointment(clinicSlug, id, { status: 'cancelled' });
  }

  async completeAppointment(clinicSlug: string, id: number): Promise<Appointment> {
    return this.updateAppointment(clinicSlug, id, { status: 'completed' });
  }
}

export default new AppointmentService();
