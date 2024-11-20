import { Appointment } from '@/types/appointment';

export const mockAppointments: Appointment[] = [
  {
    id: 1,
    clinic_id: 1,
    doctor_id: 1,
    patient_id: 1,
    date: '2024-01-15',
    start_time: '09:00:00',
    end_time: '10:00:00',
    status: 'scheduled',
    notes: 'Primeira consulta',
    doctor: {
      id: 1,
      name: 'Dr. Carlos Santos',
      email: 'carlos.santos@clinx.com',
      specialty: 'Clínico Geral'
    },
    patient: {
      id: 1,
      name: 'João Silva',
      email: 'joao.silva@email.com'
    },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    clinic_id: 1,
    doctor_id: 2,
    patient_id: 2,
    date: '2024-01-15',
    start_time: '10:30:00',
    end_time: '11:30:00',
    status: 'completed',
    notes: 'Retorno pós-cirurgia',
    doctor: {
      id: 2,
      name: 'Dra. Ana Beatriz',
      email: 'ana.beatriz@clinx.com',
      specialty: 'Cirurgiã'
    },
    patient: {
      id: 2,
      name: 'Maria Oliveira',
      email: 'maria.oliveira@email.com'
    },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 3,
    clinic_id: 1,
    doctor_id: 1,
    patient_id: 3,
    date: '2024-01-15',
    start_time: '14:00:00',
    end_time: '15:00:00',
    status: 'cancelled',
    notes: 'Paciente solicitou cancelamento',
    doctor: {
      id: 1,
      name: 'Dr. Carlos Santos',
      email: 'carlos.santos@clinx.com',
      specialty: 'Clínico Geral'
    },
    patient: {
      id: 3,
      name: 'Pedro Santos',
      email: 'pedro.santos@email.com'
    },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 4,
    clinic_id: 1,
    doctor_id: 2,
    patient_id: 4,
    date: '2024-01-16',
    start_time: '09:00:00',
    end_time: '10:00:00',
    status: 'cancelled',
    notes: 'Paciente não compareceu',
    doctor: {
      id: 2,
      name: 'Dra. Ana Beatriz',
      email: 'ana.beatriz@clinx.com',
      specialty: 'Cirurgiã'
    },
    patient: {
      id: 4,
      name: 'Ana Paula',
      email: 'ana.paula@email.com'
    },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 5,
    clinic_id: 1,
    doctor_id: 1,
    patient_id: 5,
    date: '2024-01-16',
    start_time: '11:00:00',
    end_time: '12:00:00',
    status: 'scheduled',
    notes: 'Consulta de rotina',
    doctor: {
      id: 1,
      name: 'Dr. Carlos Santos',
      email: 'carlos.santos@clinx.com',
      specialty: 'Clínico Geral'
    },
    patient: {
      id: 5,
      name: 'Lucas Mendes',
      email: 'lucas.mendes@email.com'
    },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];