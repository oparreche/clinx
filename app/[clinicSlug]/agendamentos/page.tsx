'use client';

import { useState, useEffect, Suspense } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useParams } from 'next/navigation';
import { EventClickArg } from '@fullcalendar/core';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { FaCalendarAlt, FaList, FaPlus, FaFilter } from 'react-icons/fa';
import appointmentService, { Appointment, CreateAppointmentDTO } from '@/services/appointmentService';
import doctorService, { Doctor } from '@/services/doctorService';
import patientService, { Patient } from '@/services/patientService';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import NewAppointmentModal from '@/components/appointments/NewAppointmentModal';
import EditAppointmentModal from '@/components/appointments/EditAppointmentModal';
import AppointmentList from '@/components/appointments/AppointmentList';
import FilterPanel from '@/components/appointments/FilterPanel';
import { useAuth } from '@/app/auth/context/AuthContext';

function AgendamentosContent() {
  const params = useParams();
  const clinicSlug = params.clinicSlug as string;
  const { user } = useAuth();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [activeView, setActiveView] = useState<'calendar' | 'list'>('calendar');
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [calendarEvents, setCalendarEvents] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    doctor: '',
    patient: '',
    status: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    const loadData = async () => {
      if (!clinicSlug || !user) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const [appointmentsData, doctorsData, patientsData] = await Promise.all([
          appointmentService.getAppointments(clinicSlug),
          doctorService.getDoctors(clinicSlug),
          patientService.getPatients(clinicSlug),
        ]);

        // Transform appointments for calendar
        const calendarEventsData = appointmentsData.map(appointment => ({
          id: appointment.id.toString(),
          title: `${appointment.patient?.name || 'Paciente'} - ${appointment.doctor?.name || 'Médico'}`,
          start: appointment.start_time,
          end: appointment.end_time,
          className: `status-${appointment.status}`,
          backgroundColor: getStatusColor(appointment.status),
          borderColor: getStatusColor(appointment.status),
          extendedProps: {
            doctor: appointment.doctor,
            patient: appointment.patient,
            status: appointment.status,
            notes: appointment.notes,
          }
        }));

        setAppointments(appointmentsData);
        setFilteredAppointments(appointmentsData);
        setDoctors(doctorsData);
        setPatients(patientsData);
        setCalendarEvents(calendarEventsData);
      } catch (err: any) {
        console.error('Error loading appointments:', err);
        setError(err.response?.data?.message || 'Erro ao carregar os agendamentos');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [clinicSlug, user]);

  // Aplicar filtros aos agendamentos
  useEffect(() => {
    let filtered = [...appointments];

    if (filters.doctor) {
      filtered = filtered.filter(app => app.doctor?.id.toString() === filters.doctor);
    }
    if (filters.patient) {
      filtered = filtered.filter(app => app.patient?.id.toString() === filters.patient);
    }
    if (filters.status) {
      filtered = filtered.filter(app => app.status === filters.status);
    }
    if (filters.startDate && filters.startDate !== '') {
      filtered = filtered.filter(app => new Date(app.start_time) >= new Date(filters.startDate));
    }
    if (filters.endDate && filters.endDate !== '') {
      filtered = filtered.filter(app => new Date(app.start_time) <= new Date(filters.endDate));
    }

    setFilteredAppointments(filtered);
  }, [filters, appointments]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return '#64B5F6'; // Azul claro
      case 'confirmed':
        return '#81C784'; // Verde claro
      case 'cancelled':
        return '#E57373'; // Vermelho claro
      case 'completed':
        return '#90A4AE'; // Cinza claro
      default:
        return '#B0BEC5'; // Cinza mais claro
    }
  };

  const handleAppointmentClick = (info: EventClickArg) => {
    const appointmentId = parseInt(info.event.id);
    const appointment = appointments.find(a => a.id === appointmentId);
    if (appointment) {
      setSelectedAppointment(appointment);
      setIsModalOpen(true);
    }
  };

  const handleAppointmentSelect = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleCreateAppointment = async (data: CreateAppointmentDTO) => {
    if (!clinicSlug) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const formatDate = (date: string) => date.replace('T', ' ').replace('.000Z', '');

      const newAppointment = await appointmentService.createAppointment(clinicSlug, {
        doctor_id: data.doctor_id,
        patient_id: data.patient_id,
        date: data.date,
        start_time: formatDate(data.start_time),
        end_time: formatDate(data.end_time),
        notes: data.notes
      });

      setAppointments(prev => [...prev, newAppointment]);
      setIsNewModalOpen(false);
    } catch (err: any) {
      console.error('Error creating appointment:', err);
      setError(err.response?.data?.message || 'Erro ao criar agendamento');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateAppointment = async (id: number, data: any) => {
    if (!clinicSlug) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const updatedAppointment = await appointmentService.updateAppointment(clinicSlug, id, data);
      setAppointments(prev => prev.map(a => a.id === id ? updatedAppointment : a));
      setIsModalOpen(false);
    } catch (err: any) {
      console.error('Error updating appointment:', err);
      setError(err.response?.data?.message || 'Erro ao atualizar agendamento');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAppointment = async (id: number) => {
    if (!clinicSlug || !window.confirm('Tem certeza que deseja excluir este agendamento?')) return;
    
    setIsLoading(true);
    setError(null);

    try {
      await appointmentService.deleteAppointment(clinicSlug, id);
      setAppointments(prev => prev.filter(a => a.id !== id));
      setIsModalOpen(false);
    } catch (err: any) {
      console.error('Error deleting appointment:', err);
      setError(err.response?.data?.message || 'Erro ao excluir agendamento');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-center">
          <h3 className="text-lg font-semibold">Erro ao carregar agendamentos</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Header com botões de ação */}
      <div className="flex justify-between items-center bg-white rounded-lg shadow p-4">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveView('calendar')}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
              activeView === 'calendar' 
                ? 'bg-blue-500 text-white shadow-md' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <FaCalendarAlt className="text-lg" />
            <span>Calendário</span>
          </button>
          <button
            onClick={() => setActiveView('list')}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
              activeView === 'list' 
                ? 'bg-blue-500 text-white shadow-md' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <FaList className="text-lg" />
            <span>Lista</span>
          </button>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors
              ${showFilters ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            <FaFilter className="text-lg" />
            <span>Filtros</span>
          </button>
          <button
            onClick={() => setIsNewModalOpen(true)}
            className="px-4 py-2 rounded-lg bg-blue-500 text-white flex items-center space-x-2 
              hover:bg-blue-600 transition-colors shadow-md"
          >
            <FaPlus className="text-lg" />
            <span>Novo Agendamento</span>
          </button>
        </div>
      </div>

      {/* Painel de Filtros */}
      {showFilters && (
        <div className="bg-white rounded-lg shadow p-4 transition-all">
          <FilterPanel
            doctors={doctors}
            patients={patients}
            filters={filters}
            onFilterChange={setFilters}
          />
        </div>
      )}

      {/* Conteúdo Principal */}
      <div className="bg-white rounded-lg shadow">
        {activeView === 'calendar' ? (
          <div className="p-4">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
              }}
              events={calendarEvents}
              eventClick={handleAppointmentClick}
              slotMinTime="08:00:00"
              slotMaxTime="18:00:00"
              allDaySlot={false}
              locale="pt-br"
              buttonText={{
                today: 'Hoje',
                month: 'Mês',
                week: 'Semana',
                day: 'Dia'
              }}
              slotLabelFormat={{
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
              }}
              eventTimeFormat={{
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
              }}
              nowIndicator={true}
              dayHeaderFormat={{
                weekday: 'short',
                day: 'numeric',
                month: 'numeric'
              }}
              businessHours={{
                daysOfWeek: [1, 2, 3, 4, 5],
                startTime: '08:00',
                endTime: '18:00',
              }}
              height="auto"
              expandRows={true}
              stickyHeaderDates={true}
              handleWindowResize={true}
            />
          </div>
        ) : (
          <AppointmentList
            appointments={filteredAppointments}
            onSelectAppointment={handleAppointmentSelect}
          />
        )}
      </div>

      {/* Modais */}
      <NewAppointmentModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onSubmit={handleCreateAppointment}
        doctors={doctors}
        patients={patients}
      />

      {selectedAppointment && (
        <EditAppointmentModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedAppointment(null);
          }}
          appointment={selectedAppointment}
          onUpdate={handleUpdateAppointment}
          onDelete={handleDeleteAppointment}
          doctors={doctors}
          patients={patients}
        />
      )}
    </div>
  );
}

export default function AgendamentosPage() {
  return (
    <AuthenticatedLayout>
      <Suspense fallback={<div>Carregando...</div>}>
        <AgendamentosContent />
      </Suspense>
    </AuthenticatedLayout>
  );
}