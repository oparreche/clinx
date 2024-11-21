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
    console.log('Getting appointments for clinic:', clinicSlug);
    console.log('Authorization token:', localStorage.getItem('token'));
    
    try {
      const endpoint = `/api/clinics/${clinicSlug}/appointments`;
      console.log('Using endpoint:', endpoint);
      
      const response = await api.get<Appointment[]>(endpoint);
      console.log('Appointments response:', {
        status: response.status,
        headers: response.headers,
        data: response.data
      });
      
      return response.data;
    } catch (error: any) {
      console.error('Error fetching appointments:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      });
      throw error;
    }
  }

  async getAppointment(clinicSlug: string, id: number): Promise<Appointment> {
    console.log('Getting appointment details:', { clinicSlug, id });
    console.log('Authorization token:', localStorage.getItem('token'));
    
    try {
      const endpoint = `/api/clinics/${clinicSlug}/appointments/${id}`;
      console.log('Using endpoint:', endpoint);
      
      const response = await api.get<Appointment>(endpoint);
      console.log('Appointment details response:', {
        status: response.status,
        headers: response.headers,
        data: response.data
      });
      
      return response.data;
    } catch (error: any) {
      console.error('Error fetching appointment details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      });
      throw error;
    }
  }

  async createAppointment(clinicSlug: string, data: CreateAppointmentDTO): Promise<Appointment> {
    console.log('Creating new appointment:', { clinicSlug, data });
    console.log('Authorization token:', localStorage.getItem('token'));
    
    try {
      const endpoint = `/api/clinics/${clinicSlug}/appointments`;
      console.log('Using endpoint:', endpoint);
      
      const response = await api.post<Appointment>(endpoint, data);
      console.log('Create appointment response:', {
        status: response.status,
        headers: response.headers,
        data: response.data
      });
      
      return response.data;
    } catch (error: any) {
      console.error('Error creating appointment:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      });
      throw error;
    }
  }

  async updateAppointment(clinicSlug: string, id: number, data: UpdateAppointmentDTO): Promise<Appointment> {
    console.log('Updating appointment:', { clinicSlug, id, data });
    console.log('Authorization token:', localStorage.getItem('token'));
    
    try {
      const endpoint = `/api/clinics/${clinicSlug}/appointments/${id}`;
      console.log('Using endpoint:', endpoint);
      
      const response = await api.put<Appointment>(endpoint, data);
      console.log('Update appointment response:', {
        status: response.status,
        headers: response.headers,
        data: response.data
      });
      
      return response.data;
    } catch (error: any) {
      console.error('Error updating appointment:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      });
      throw error;
    }
  }

  async deleteAppointment(clinicSlug: string, id: number): Promise<void> {
    console.log('Deleting appointment:', { clinicSlug, id });
    console.log('Authorization token:', localStorage.getItem('token'));
    
    try {
      const endpoint = `/api/clinics/${clinicSlug}/appointments/${id}`;
      console.log('Using endpoint:', endpoint);
      
      const response = await api.delete(endpoint);
      console.log('Delete appointment response:', {
        status: response.status,
        headers: response.headers
      });
    } catch (error: any) {
      console.error('Error deleting appointment:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      });
      throw error;
    }
  }

  async getAppointmentsByDoctor(clinicSlug: string, doctorId: number): Promise<Appointment[]> {
    console.log('Getting appointments for doctor:', { clinicSlug, doctorId });
    console.log('Authorization token:', localStorage.getItem('token'));
    
    try {
      const endpoint = `/api/clinics/${clinicSlug}/doctors/${doctorId}/appointments`;
      console.log('Using endpoint:', endpoint);
      
      const response = await api.get<Appointment[]>(endpoint);
      console.log('Appointments by doctor response:', {
        status: response.status,
        headers: response.headers,
        data: response.data
      });
      
      return response.data;
    } catch (error: any) {
      console.error('Error fetching appointments by doctor:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      });
      throw error;
    }
  }

  async getAppointmentsByPatient(clinicSlug: string, patientId: number): Promise<Appointment[]> {
    console.log('Getting appointments for patient:', { clinicSlug, patientId });
    console.log('Authorization token:', localStorage.getItem('token'));
    
    try {
      const endpoint = `/api/clinics/${clinicSlug}/patients/${patientId}/appointments`;
      console.log('Using endpoint:', endpoint);
      
      const response = await api.get<Appointment[]>(endpoint);
      console.log('Appointments by patient response:', {
        status: response.status,
        headers: response.headers,
        data: response.data
      });
      
      return response.data;
    } catch (error: any) {
      console.error('Error fetching appointments by patient:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      });
      throw error;
    }
  }

  async confirmAppointment(clinicSlug: string, id: number): Promise<Appointment> {
    console.log('Confirming appointment:', { clinicSlug, id });
    console.log('Authorization token:', localStorage.getItem('token'));
    
    try {
      const endpoint = `/api/clinics/${clinicSlug}/appointments/${id}/confirm`;
      console.log('Using endpoint:', endpoint);
      
      const response = await api.put<Appointment>(endpoint, {});
      console.log('Confirm appointment response:', {
        status: response.status,
        headers: response.headers,
        data: response.data
      });
      
      return response.data;
    } catch (error: any) {
      console.error('Error confirming appointment:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      });
      throw error;
    }
  }

  async cancelAppointment(clinicSlug: string, id: number): Promise<Appointment> {
    console.log('Canceling appointment:', { clinicSlug, id });
    console.log('Authorization token:', localStorage.getItem('token'));
    
    try {
      const endpoint = `/api/clinics/${clinicSlug}/appointments/${id}/cancel`;
      console.log('Using endpoint:', endpoint);
      
      const response = await api.put<Appointment>(endpoint, {});
      console.log('Cancel appointment response:', {
        status: response.status,
        headers: response.headers,
        data: response.data
      });
      
      return response.data;
    } catch (error: any) {
      console.error('Error canceling appointment:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      });
      throw error;
    }
  }

  async completeAppointment(clinicSlug: string, id: number): Promise<Appointment> {
    console.log('Completing appointment:', { clinicSlug, id });
    console.log('Authorization token:', localStorage.getItem('token'));
    
    try {
      const endpoint = `/api/clinics/${clinicSlug}/appointments/${id}/complete`;
      console.log('Using endpoint:', endpoint);
      
      const response = await api.put<Appointment>(endpoint, {});
      console.log('Complete appointment response:', {
        status: response.status,
        headers: response.headers,
        data: response.data
      });
      
      return response.data;
    } catch (error: any) {
      console.error('Error completing appointment:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      });
      throw error;
    }
  }
}

export default new AppointmentService();
