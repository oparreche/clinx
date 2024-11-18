import api from './api';
import { Doctor } from './doctorService';
import { Patient } from './patientService';

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
  doctor?: Doctor;
  patient?: Patient;
}

class AppointmentService {
  async getAppointments(clinicSlug: string) {
    const response = await api.get<Appointment[]>(`/clinics/${clinicSlug}/appointments`);
    return response.data;
  }

  async getAppointment(clinicSlug: string, id: number) {
    const response = await api.get<Appointment>(`/clinics/${clinicSlug}/appointments/${id}`);
    return response.data;
  }

  async createAppointment(clinicSlug: string, data: Partial<Appointment>) {
    const response = await api.post<Appointment>(`/clinics/${clinicSlug}/appointments`, data);
    return response.data;
  }

  async updateAppointment(clinicSlug: string, id: number, data: Partial<Appointment>) {
    const response = await api.put<Appointment>(`/clinics/${clinicSlug}/appointments/${id}`, data);
    return response.data;
  }

  async deleteAppointment(clinicSlug: string, id: number) {
    await api.delete(`/clinics/${clinicSlug}/appointments/${id}`);
  }

  async getAppointmentsByDoctor(clinicSlug: string, doctorId: number) {
    const response = await api.get<Appointment[]>(`/clinics/${clinicSlug}/doctors/${doctorId}/appointments`);
    return response.data;
  }

  async getAppointmentsByPatient(clinicSlug: string, patientId: number) {
    const response = await api.get<Appointment[]>(`/clinics/${clinicSlug}/patients/${patientId}/appointments`);
    return response.data;
  }
}

export default new AppointmentService();
