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
  recurrence?: RecurrenceInfo;
}

export interface UpdateAppointmentDTO extends Partial<CreateAppointmentDTO> {
  status?: 'scheduled' | 'confirmed' | 'cancelled' | 'completed';
}

interface AppointmentValidationError {
  message: string;
  field?: string;
  code: string;
}

interface RecurrenceInfo {
  type: 'none' | 'daily' | 'weekly' | 'monthly';
  interval?: number;
  daysOfWeek?: number[];
  endDate?: string;
  updateAll?: boolean; // For updating recurring series
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

  private async validateAppointmentTime(
    clinicSlug: string,
    doctorId: number,
    date: string,
    startTime: string,
    endTime: string,
    excludeAppointmentId?: number
  ): Promise<AppointmentValidationError[]> {
    const errors: AppointmentValidationError[] = [];
    
    // Validate business hours (assuming 8 AM to 6 PM)
    const startHour = parseInt(startTime.split(':')[0]);
    const endHour = parseInt(endTime.split(':')[0]);
    
    if (startHour < 8 || endHour > 18) {
      errors.push({
        message: 'Appointment must be within business hours (8 AM to 6 PM)',
        field: 'time',
        code: 'INVALID_HOURS'
      });
    }

    // Check for conflicts
    try {
      const existingAppointments = await this.getAppointmentsByDoctor(clinicSlug, doctorId);
      const newStart = new Date(`${date}T${startTime}`);
      const newEnd = new Date(`${date}T${endTime}`);

      const conflicts = existingAppointments.filter(apt => {
        if (excludeAppointmentId && apt.id === excludeAppointmentId) return false;
        
        const aptStart = new Date(`${apt.date}T${apt.start_time}`);
        const aptEnd = new Date(`${apt.date}T${apt.end_time}`);

        return (
          (newStart >= aptStart && newStart < aptEnd) ||
          (newEnd > aptStart && newEnd <= aptEnd) ||
          (newStart <= aptStart && newEnd >= aptEnd)
        );
      });

      if (conflicts.length > 0) {
        errors.push({
          message: 'Time slot conflicts with existing appointments',
          field: 'time',
          code: 'TIME_CONFLICT'
        });
      }
    } catch (error) {
      console.error('Error checking for conflicts:', error);
      errors.push({
        message: 'Unable to verify appointment conflicts',
        code: 'CONFLICT_CHECK_FAILED'
      });
    }

    return errors;
  }

  async createAppointment(clinicSlug: string, data: CreateAppointmentDTO): Promise<Appointment | Appointment[]> {
    try {
      console.log('Creating appointment:', { clinicSlug, data });

      // Validate appointment time
      const validationErrors = await this.validateAppointmentTime(
        clinicSlug,
        data.doctor_id,
        data.date,
        data.start_time,
        data.end_time
      );

      if (validationErrors.length > 0) {
        console.error('Validation errors:', validationErrors);
        throw new Error(JSON.stringify(validationErrors));
      }

      if (!data.recurrence || data.recurrence.type === 'none') {
        const response = await api.post(`/api/clinics/${clinicSlug}/appointments`, data);
        return response.data;
      } else {
        console.log('Creating recurring appointments with data:', data.recurrence);
        const appointments = await this.generateRecurringAppointments(data);
        console.log('Generated recurring appointments:', appointments);
        
        // Validate all recurring appointments
        const allValidationPromises = appointments.map(apt =>
          this.validateAppointmentTime(
            clinicSlug,
            apt.doctor_id,
            apt.date,
            apt.start_time,
            apt.end_time
          )
        );

        const allValidations = await Promise.all(allValidationPromises);
        const allErrors = allValidations.flat();

        if (allErrors.length > 0) {
          console.error('Validation errors for recurring appointments:', allErrors);
          throw new Error(JSON.stringify(allErrors));
        }

        try {
          const response = await api.post(`/api/clinics/${clinicSlug}/appointments/recurring`, {
            appointments,
            recurrence: data.recurrence
          });
          console.log('Recurring appointments created successfully:', response.data);
          return response.data;
        } catch (error: any) {
          console.error('Error creating recurring appointments:', {
            error,
            response: error.response?.data,
            status: error.response?.status
          });
          throw new Error(error.response?.data?.message || 'Failed to create recurring appointments');
        }
      }
    } catch (error: any) {
      console.error('Error in createAppointment:', {
        error,
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  }

  async updateAppointment(
    clinicSlug: string,
    id: number,
    data: UpdateAppointmentDTO
  ): Promise<Appointment | Appointment[]> {
    console.log('Updating appointment:', { clinicSlug, id, data });
    
    try {
      // If updating time/date, validate the new slot
      if (data.date || data.start_time || data.end_time) {
        const appointment = await this.getAppointment(clinicSlug, id);
        const validationErrors = await this.validateAppointmentTime(
          clinicSlug,
          data.doctor_id || appointment.doctor_id,
          data.date || appointment.date,
          data.start_time || appointment.start_time,
          data.end_time || appointment.end_time,
          id
        );

        if (validationErrors.length > 0) {
          throw new Error(JSON.stringify(validationErrors));
        }
      }

      // Handle recurring appointment updates
      if (data.recurrence?.updateAll) {
        const response = await api.put(`/api/clinics/${clinicSlug}/appointments/${id}/recurring`, data);
        return response.data;
      } else {
        const response = await api.put(`/api/clinics/${clinicSlug}/appointments/${id}`, data);
        return response.data;
      }
    } catch (error: any) {
      console.error('Error updating appointment:', error);
      throw error;
    }
  }

  async deleteAppointment(
    clinicSlug: string,
    id: number,
    deleteRecurring: boolean = false
  ): Promise<void> {
    console.log('Deleting appointment:', { clinicSlug, id, deleteRecurring });
    
    try {
      const endpoint = deleteRecurring
        ? `/api/clinics/${clinicSlug}/appointments/${id}/recurring`
        : `/api/clinics/${clinicSlug}/appointments/${id}`;
      
      await api.delete(endpoint);
    } catch (error: any) {
      console.error('Error deleting appointment:', error);
      throw error;
    }
  }

  async getAppointmentsByDoctor(clinicSlug: string, doctorId: number): Promise<Appointment[]> {
    console.log('Getting appointments for doctor:', { clinicSlug, doctorId });
    console.log('Authorization token:', localStorage.getItem('token'));
    
    try {
      const endpoint = `/api/clinics/${clinicSlug}/appointments/doctor/${doctorId}`;
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

  private generateRecurringAppointments(data: CreateAppointmentDTO): any[] {
    console.log('Generating recurring appointments with data:', data);
    const appointments = [];
    const startDate = new Date(data.date);
    const endDate = data.recurrence?.endDate 
      ? new Date(data.recurrence.endDate) 
      : new Date(startDate.getTime() + (365 * 24 * 60 * 60 * 1000)); // 1 year from start date

    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      if (this.isValidAppointmentDate(currentDate, data.recurrence)) {
        appointments.push({
          doctor_id: data.doctor_id,
          patient_id: data.patient_id,
          date: currentDate.toISOString().split('T')[0],
          start_time: data.start_time,
          end_time: data.end_time,
          notes: data.notes
        });
      }

      // Avançar para a próxima data baseado no tipo de recorrência
      switch (data.recurrence?.type) {
        case 'daily':
          currentDate.setDate(currentDate.getDate() + (data.recurrence.interval || 1));
          break;
        case 'weekly':
          if (data.recurrence.daysOfWeek?.length) {
            // Encontrar o próximo dia da semana válido
            do {
              currentDate.setDate(currentDate.getDate() + 1);
            } while (!data.recurrence.daysOfWeek.includes(currentDate.getDay()));
          } else {
            currentDate.setDate(currentDate.getDate() + (7 * (data.recurrence.interval || 1)));
          }
          break;
        case 'monthly':
          currentDate.setMonth(currentDate.getMonth() + (data.recurrence.interval || 1));
          break;
        default:
          console.warn('Unknown recurrence type:', data.recurrence?.type);
          return appointments;
      }
    }

    console.log('Generated appointments:', appointments);
    return appointments;
  }

  private isValidAppointmentDate(date: Date, recurrence?: RecurrenceInfo): boolean {
    if (!recurrence || recurrence.type === 'none') return true;

    // Para recorrência semanal, verificar se o dia da semana está incluído
    if (recurrence.type === 'weekly' && recurrence.daysOfWeek?.length) {
      return recurrence.daysOfWeek.includes(date.getDay());
    }

    return true;
  }
}

export default new AppointmentService();
