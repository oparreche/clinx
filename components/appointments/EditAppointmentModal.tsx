import React, { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { Appointment, appointmentStatusMap } from '@/types/appointment';

interface EditAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (appointment: Appointment) => void;
  appointment: Appointment | null;
}

const EditAppointmentModal: React.FC<EditAppointmentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  appointment: initialAppointment,
}) => {
  const [appointment, setAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    if (initialAppointment) {
      // Garantir que as datas sejam objetos Date válidos
      const formattedAppointment = {
        ...initialAppointment,
        start: initialAppointment.start instanceof Date 
          ? initialAppointment.start 
          : parseISO(initialAppointment.start as unknown as string),
        end: initialAppointment.end instanceof Date 
          ? initialAppointment.end 
          : parseISO(initialAppointment.end as unknown as string),
      };
      setAppointment(formattedAppointment);
    }
  }, [initialAppointment]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (appointment) {
      onSave(appointment);
      onClose();
    }
  };

  if (!isOpen || !appointment) return null;

  // Função auxiliar para formatar data com segurança
  const formatSafeDate = (date: Date | string, formatString: string): string => {
    try {
      if (date instanceof Date) {
        return format(date, formatString);
      }
      return format(parseISO(date as string), formatString);
    } catch (error) {
      console.error('Error formatting date:', error, date);
      return '';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Editar Agendamento</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Paciente
            </label>
            <input
              type="text"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={appointment.patientName}
              onChange={(e) => setAppointment({ ...appointment, patientName: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Médico
            </label>
            <select
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={appointment.doctor}
              onChange={(e) => setAppointment({ ...appointment, doctor: e.target.value })}
            >
              <option value="">Selecione um médico</option>
              <option value="Dr. Carlos Santos">Dr. Carlos Santos</option>
              <option value="Dra. Ana Beatriz">Dra. Ana Beatriz</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Data
              </label>
              <input
                type="date"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formatSafeDate(appointment.start, 'yyyy-MM-dd')}
                onChange={(e) => {
                  try {
                    const date = parseISO(e.target.value);
                    const start = new Date(appointment.start);
                    const end = new Date(appointment.end);
                    
                    start.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
                    end.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
                    
                    setAppointment({ ...appointment, start, end });
                  } catch (error) {
                    console.error('Error updating date:', error);
                  }
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Horário
              </label>
              <input
                type="time"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formatSafeDate(appointment.start, 'HH:mm')}
                onChange={(e) => {
                  try {
                    const [hours, minutes] = e.target.value.split(':');
                    const start = new Date(appointment.start);
                    const end = new Date(appointment.end);
                    
                    start.setHours(parseInt(hours), parseInt(minutes));
                    end.setHours(parseInt(hours) + 1, parseInt(minutes));
                    
                    setAppointment({ ...appointment, start, end });
                  } catch (error) {
                    console.error('Error updating time:', error);
                  }
                }}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={appointment.status}
              onChange={(e) => setAppointment({ ...appointment, status: e.target.value as Appointment['status'] })}
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              value={appointment.notes}
              onChange={(e) => setAppointment({ ...appointment, notes: e.target.value })}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAppointmentModal;