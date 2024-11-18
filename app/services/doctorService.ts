import api from './api';

export interface Doctor {
  id: number;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  crm: string;
  available_days?: string[];
  available_hours?: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateDoctorDTO {
  name: string;
  email: string;
  phone: string;
  specialization: string;
  crm: string;
  available_days?: string[];
  available_hours?: string[];
}

class DoctorService {
  async getDoctors(clinicSlug: string): Promise<Doctor[]> {
    const response = await api.get<Doctor[]>(`/clinics/${clinicSlug}/doctors`);
    return response.data;
  }

  async getDoctor(clinicSlug: string, id: number): Promise<Doctor> {
    const response = await api.get<Doctor>(`/clinics/${clinicSlug}/doctors/${id}`);
    return response.data;
  }

  async createDoctor(clinicSlug: string, data: CreateDoctorDTO): Promise<Doctor> {
    const response = await api.post<Doctor>(`/clinics/${clinicSlug}/doctors`, data);
    return response.data;
  }

  async updateDoctor(clinicSlug: string, id: number, data: Partial<CreateDoctorDTO>): Promise<Doctor> {
    const response = await api.put<Doctor>(`/clinics/${clinicSlug}/doctors/${id}`, data);
    return response.data;
  }

  async deleteDoctor(clinicSlug: string, id: number): Promise<void> {
    await api.delete(`/clinics/${clinicSlug}/doctors/${id}`);
  }
}

export default new DoctorService();
