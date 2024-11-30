import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Appointment, AppointmentStatus, appointmentStatusMap } from '@/types/appointment';
import { Doctor } from '@/services/doctorService';
import { Patient } from '@/services/patientService';

interface EditAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: number, data: Partial<Appointment>) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  appointment: Appointment | null;
  doctors: Doctor[];
  patients: Patient[];
}

const EditAppointmentModal: React.FC<EditAppointmentModalProps> = ({
  isOpen,
  onClose,
  onUpdate,
  onDelete,
  appointment,
  doctors,
  patients
}) => {
  const [formData, setFormData] = useState<Partial<Appointment>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (appointment) {
      setFormData({
        doctor_id: appointment.doctor_id,
        patient_id: appointment.patient_id,
        start_time: appointment.start_time,
        end_time: appointment.end_time,
        notes: appointment.notes,
        status: appointment.status
      });
    }
  }, [appointment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (appointment && formData) {
      setLoading(true);
      try {
        await onUpdate(appointment.id, formData);
        onClose();
      } catch (error) {
        console.error('Error updating appointment:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDelete = async () => {
    if (appointment && window.confirm('Tem certeza que deseja excluir este agendamento?')) {
      setLoading(true);
      try {
        await onDelete(appointment.id);
        onClose();
      } catch (error) {
        console.error('Error deleting appointment:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!isOpen || !appointment) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-lg rounded bg-white p-6 w-full">
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="text-lg font-medium">
              Editar Agendamento
            </Dialog.Title>
            <button
              onClick={onClose}
              className="rounded-full p-1 hover:bg-gray-100"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Médico
              </label>
              <select
                name="doctor_id"
                value={formData.doctor_id}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Selecione um médico</option>
                {doctors.map(doctor => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Paciente
              </label>
              <select
                name="patient_id"
                value={formData.patient_id}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Selecione um paciente</option>
                {patients.map(patient => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Horário Início
                </label>
                <input
                  type="datetime-local"
                  name="start_time"
                  value={formData.start_time ? formData.start_time.slice(0, 16) : ''}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Horário Fim
                </label>
                <input
                  type="datetime-local"
                  name="end_time"
                  value={formData.end_time ? formData.end_time.slice(0, 16) : ''}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                {Object.entries(appointmentStatusMap).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Observações
              </label>
              <textarea
                name="notes"
                value={formData.notes || ''}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:opacity-50"
              >
                Excluir
              </button>

              <div className="space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50"
                >
                  Salvar
                </button>
              </div>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default EditAppointmentModal;