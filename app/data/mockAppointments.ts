import { Appointment } from '@/types/appointment';

export const mockAppointments: Appointment[] = [
  {
    id: '1',
    patientName: 'João Silva',
    doctor: 'Dr. Carlos Santos',
    start: new Date(2024, 0, 15, 9, 0),
    end: new Date(2024, 0, 15, 10, 0),
    status: 'scheduled',
    notes: 'Primeira consulta'
  },
  {
    id: '2',
    patientName: 'Maria Oliveira',
    doctor: 'Dra. Ana Beatriz',
    start: new Date(2024, 0, 15, 10, 30),
    end: new Date(2024, 0, 15, 11, 30),
    status: 'completed',
    notes: 'Retorno pós-cirurgia'
  },
  {
    id: '3',
    patientName: 'Pedro Santos',
    doctor: 'Dr. Carlos Santos',
    start: new Date(2024, 0, 15, 14, 0),
    end: new Date(2024, 0, 15, 15, 0),
    status: 'cancelled',
    notes: 'Paciente solicitou cancelamento'
  },
  {
    id: '4',
    patientName: 'Ana Paula',
    doctor: 'Dra. Ana Beatriz',
    start: new Date(2024, 0, 16, 9, 0),
    end: new Date(2024, 0, 16, 10, 0),
    status: 'no_show',
    notes: 'Paciente não compareceu'
  },
  {
    id: '5',
    patientName: 'Lucas Mendes',
    doctor: 'Dr. Carlos Santos',
    start: new Date(2024, 0, 16, 11, 0),
    end: new Date(2024, 0, 16, 12, 0),
    status: 'scheduled',
    notes: 'Consulta de rotina'
  }
];