'use client';

import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import doctorService, { Doctor } from '@/services/doctorService';
import patientService, { Patient } from '@/services/patientService';
import { useParams } from 'next/navigation';

interface NewAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (appointment: AppointmentPayload) => void;
  selectedDate?: Date | null;
  doctors: Doctor[];
  patients: Patient[];
}

type RecurrenceFrequency = 'none' | 'daily' | 'weekly' | 'monthly';

interface FormData {
  patient_id: string;
  doctor_id: string;
  date: string;
  time: string;
  duration: string;
  notes: string;
  room: string;
  recurrence: {
    type: RecurrenceFrequency;
    interval: number;
    endDate: string;
    daysOfWeek: number[];
    dayOfMonth?: number;
    occurrences?: number;
  };
}

export interface AppointmentPayload {
  doctor_id: number;
  patient_id: number;
  date: string;
  start_time: string;
  end_time: string;
  notes?: string;
  recurrence?: {
    type: 'none' | 'daily' | 'weekly' | 'monthly';
    interval?: number;
    daysOfWeek?: number[];
    endDate?: string;
    occurrences?: number;
  };
}

export default function NewAppointmentModal({ 
  isOpen, 
  onClose, 
  onSubmit,
  selectedDate,
  doctors: initialDoctors,
  patients: initialPatients
}: NewAppointmentModalProps) {
  const params = useParams();
  const clinicSlug = params.clinicSlug as string;
  
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors);
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [formData, setFormData] = useState<FormData>({
    patient_id: '',
    doctor_id: '',
    date: selectedDate ? selectedDate.toISOString().split('T')[0] : '',
    time: '',
    duration: '30',
    notes: '',
    room: '',
    recurrence: {
      type: 'none',
      interval: 1,
      endDate: '',
      daysOfWeek: []
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      if (isOpen && (!initialDoctors.length || !initialPatients.length)) {
        setLoading(true);
        try {
          const [doctorsData, patientsData] = await Promise.all([
            !initialDoctors.length ? doctorService.getDoctors(clinicSlug) : Promise.resolve(initialDoctors),
            !initialPatients.length ? patientService.getPatients(clinicSlug) : Promise.resolve(initialPatients)
          ]);
          
          if (!initialDoctors.length) setDoctors(doctorsData);
          if (!initialPatients.length) setPatients(patientsData);
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [isOpen, clinicSlug, initialDoctors, initialPatients]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Criar data de início no formato ISO 8601
    const appointmentDate = new Date(formData.date);
    const [hours, minutes] = formData.time.split(':');
    appointmentDate.setHours(parseInt(hours), parseInt(minutes));
    
    // Criar data de fim
    const endDate = new Date(appointmentDate);
    endDate.setMinutes(endDate.getMinutes() + parseInt(formData.duration));

    // Formatar horários no formato HH:mm
    const formatTime = (date: Date) => {
      return date.toTimeString().split(' ')[0].substring(0, 5);
    };

    const appointment: AppointmentPayload = {
      doctor_id: parseInt(formData.doctor_id),
      patient_id: parseInt(formData.patient_id),
      date: formData.date,
      start_time: formatTime(appointmentDate),
      end_time: formatTime(endDate),
      notes: formData.notes || undefined
    };

    // Adicionar dados de recorrência apenas se não for 'none'
    if (formData.recurrence.type !== 'none') {
      appointment.recurrence = {
        type: formData.recurrence.type,
        interval: formData.recurrence.interval,
        endDate: formData.recurrence.endDate,
        daysOfWeek: formData.recurrence.type === 'weekly' ? formData.recurrence.daysOfWeek : undefined
      };
    } else {
      appointment.recurrence = { type: 'none' };
    }

    onSubmit(appointment);
    onClose();
  };

  const handleRecurrenceTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const type = e.target.value as RecurrenceFrequency;
    setFormData(prev => ({
      ...prev,
      recurrence: {
        ...prev.recurrence,
        type,
        daysOfWeek: type === 'weekly' ? [] : prev.recurrence.daysOfWeek
      }
    }));
  };

  const handleDayOfWeekToggle = (day: number) => {
    setFormData(prev => {
      const currentDays = prev.recurrence.daysOfWeek;
      const newDays = currentDays.includes(day)
        ? currentDays.filter(d => d !== day)
        : [...currentDays, day];

      return {
        ...prev,
        recurrence: {
          ...prev.recurrence,
          daysOfWeek: newDays
        }
      };
    });
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30 z-40" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
        <Dialog.Panel className="mx-auto max-w-lg w-full rounded-lg bg-white p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>

          <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
            Novo Agendamento
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="mt-4 grid grid-cols-1 gap-4">
              <div>
                <label htmlFor="doctor" className="block text-sm font-medium text-gray-700">
                  Médico
                </label>
                <select
                  id="doctor"
                  name="doctor_id"
                  value={formData.doctor_id}
                  onChange={(e) => setFormData({ ...formData, doctor_id: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                >
                  <option value="">Selecione um médico</option>
                  {doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.name} - {doctor.specialization}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="patient" className="block text-sm font-medium text-gray-700">
                  Paciente
                </label>
                <select
                  id="patient"
                  name="patient_id"
                  value={formData.patient_id}
                  onChange={(e) => setFormData({ ...formData, patient_id: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                >
                  <option value="">Selecione um paciente</option>
                  {patients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.name} - {patient.cpf}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Data
                </label>
                <input
                  type="date"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Horário
                </label>
                <input
                  type="time"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Duração (minutos)
              </label>
              <select
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              >
                <option value="30">30 minutos</option>
                <option value="45">45 minutos</option>
                <option value="60">1 hora</option>
                <option value="90">1 hora e 30 minutos</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Observações
              </label>
              <textarea
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Sala
              </label>
              <input
                type="text"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                value={formData.room}
                onChange={(e) => setFormData({ ...formData, room: e.target.value })}
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">
                Recorrência
              </label>
              <select
                value={formData.recurrence.type}
                onChange={handleRecurrenceTypeChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="none">Sem recorrência</option>
                <option value="daily">Diário</option>
                <option value="weekly">Semanal</option>
                <option value="monthly">Mensal</option>
              </select>
            </div>

            {formData.recurrence.type !== 'none' && (
              <>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Intervalo
                  </label>
                  <div className="mt-1 flex items-center">
                    <input
                      type="number"
                      min="1"
                      value={formData.recurrence.interval}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        recurrence: {
                          ...prev.recurrence,
                          interval: parseInt(e.target.value) || 1
                        }
                      }))}
                      className="block w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                    <span className="ml-2 text-sm text-gray-500">
                      {formData.recurrence.type === 'daily' && 'dias'}
                      {formData.recurrence.type === 'weekly' && 'semanas'}
                      {formData.recurrence.type === 'monthly' && 'meses'}
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Data Final (opcional)
                  </label>
                  <input
                    type="date"
                    value={formData.recurrence.endDate}
                    min={formData.date}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      recurrence: {
                        ...prev.recurrence,
                        endDate: e.target.value
                      }
                    }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                {formData.recurrence.type === 'weekly' && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Dias da Semana
                    </label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day, index) => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => handleDayOfWeekToggle(index)}
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            formData.recurrence.daysOfWeek?.includes(index)
                              ? 'bg-indigo-600 text-white'
                              : 'bg-gray-200 text-gray-700'
                          }`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Salvar
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}