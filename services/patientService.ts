import api from './api';

export interface Patient {
  id: number;
  clinic_id: number;
  name: string;
  email: string;
  phone: string;
  birth_date: string;
  gender: string;
  cpf: string;
  rg?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  health_insurance?: string;
  health_insurance_number?: string;
  allergies?: string;
  chronic_conditions?: string;
  medications?: string;
  notes?: string;
  is_active: boolean;
}

class PatientService {
  async getPatients(clinicSlug: string) {
    const response = await api.get<Patient[]>(`/clinics/${clinicSlug}/patients`);
    return response.data;
  }

  async getPatient(clinicSlug: string, id: number) {
    const response = await api.get<Patient>(`/clinics/${clinicSlug}/patients/${id}`);
    return response.data;
  }

  async createPatient(clinicSlug: string, data: Partial<Patient>) {
    const response = await api.post<Patient>(`/clinics/${clinicSlug}/patients`, data);
    return response.data;
  }

  async updatePatient(clinicSlug: string, id: number, data: Partial<Patient>) {
    const response = await api.put<Patient>(`/clinics/${clinicSlug}/patients/${id}`, data);
    return response.data;
  }

  async deletePatient(clinicSlug: string, id: number) {
    await api.delete(`/clinics/${clinicSlug}/patients/${id}`);
  }
}

export default new PatientService();
