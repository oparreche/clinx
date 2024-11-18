import api from './api';

export interface Doctor {
  id: number;
  clinic_id: number;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  crm: string;
  available_days?: string[];
  available_hours?: string[];
  is_active: boolean;
}

class DoctorService {
  async getDoctors(clinicSlug: string) {
    const response = await api.get<Doctor[]>(`/clinics/${clinicSlug}/doctors`);
    return response.data;
  }

  async getDoctor(clinicSlug: string, id: number) {
    const response = await api.get<Doctor>(`/clinics/${clinicSlug}/doctors/${id}`);
    return response.data;
  }

  async createDoctor(clinicSlug: string, data: Partial<Doctor>) {
    const response = await api.post<Doctor>(`/clinics/${clinicSlug}/doctors`, data);
    return response.data;
  }

  async updateDoctor(clinicSlug: string, id: number, data: Partial<Doctor>) {
    const response = await api.put<Doctor>(`/clinics/${clinicSlug}/doctors/${id}`, data);
    return response.data;
  }

  async deleteDoctor(clinicSlug: string, id: number) {
    await api.delete(`/clinics/${clinicSlug}/doctors/${id}`);
  }
}

export default new DoctorService();
