'use client';

import { Appointment } from '@/types/appointment';
import { Doctor } from '@/services/doctorService';
import { Patient } from '@/services/patientService';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';
import { useAuth } from '@/app/auth/context/AuthContext';
import {
  FaHome,
  FaUserMd,
  FaUsers,
  FaUserTie,
  FaCalendarAlt,
  FaStickyNote,
  FaMoneyBillWave,
  FaListAlt,
  FaCog,
  FaChevronLeft,
  FaChevronRight,
  FaStethoscope,
  FaPlus,
} from 'react-icons/fa';
import NewAppointmentModal from './appointments/NewAppointmentModal';

interface SidebarProps {
  onCollapse?: (collapsed: boolean) => void;
}

const Sidebar = ({ onCollapse }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    // Initialize from localStorage if available, otherwise false
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('sidebarCollapsed');
      return savedState ? savedState === 'true' : false;
    }
    return false;
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const pathname = usePathname();
  const { clinicSlug } = useAuth();
  const router = useRouter();

  const menuItems = useMemo(() => {
    if (!clinicSlug) return [];

    return [
      { icon: FaHome, label: 'Dashboard', href: `/${clinicSlug}/dashboard` },
      { icon: FaCalendarAlt, label: 'Agendamentos', href: `/${clinicSlug}/agendamentos` },
      { icon: FaUserMd, label: 'Psicólogos', href: `/${clinicSlug}/psicologos` },
      { icon: FaUsers, label: 'Pacientes', href: `/${clinicSlug}/pacientes` },
      { icon: FaUserTie, label: 'Funcionários', href: `/${clinicSlug}/funcionarios` },
      { icon: FaListAlt, label: 'Serviços', href: `/${clinicSlug}/servicos` },
      { icon: FaStickyNote, label: 'Lembretes', href: `/${clinicSlug}/lembretes` },
      { icon: FaMoneyBillWave, label: 'Financeiro', href: `/${clinicSlug}/financeiro` },
      { icon: FaCog, label: 'Configurações', href: `/${clinicSlug}/configuracoes` },
    ];
  }, [clinicSlug]);

  const handleCollapse = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    onCollapse?.(newCollapsed);
    localStorage.setItem('sidebarCollapsed', newCollapsed.toString());
  };

  const isActiveLink = (href: string) => pathname.startsWith(href);

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  const handleAddAppointment = (newAppointment: Omit<Appointment, 'id'>) => {
    const id = appointments.length + 1;
    const appointment: Appointment = {
      ...newAppointment,
      id,
    };
    setAppointments([...appointments, appointment]);
    setIsModalOpen(false);
  };

  return (
    <aside
      className={`
        bg-[#2A3547] fixed top-0 left-0 z-50
        h-screen overflow-y-auto overflow-x-hidden
        transition-all duration-300 ease-in-out
        flex flex-col
        ${isCollapsed ? 'w-[72px]' : 'w-64'}
        scrollbar-thin scrollbar-thumb-[#323e4f] scrollbar-track-[#2A3547]
      `}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-6 flex-shrink-0 sticky top-0 bg-[#2A3547] z-10">
        <FaStethoscope className="w-6 h-6 text-blue-400 shrink-0" />
        <div
          className={`
            ml-3 overflow-hidden whitespace-nowrap
            transition-all duration-300 ease-in-out
            ${isCollapsed ? 'w-0 opacity-0' : 'w-32 opacity-100'}
          `}
        >
          <span className="font-medium text-white">Clínica Casa</span>
        </div>
        {/* Toggle Button */}
        <button
          onClick={handleCollapse}
          className="
            absolute -right-3 top-6
            bg-[#2A3547] text-white p-1.5 rounded-full shadow-md
            hover:bg-[#323e4f]
            transition-colors duration-200
            z-50
          "
          aria-label={isCollapsed ? 'Expandir menu' : 'Recolher menu'}
        >
          {isCollapsed ? (
            <FaChevronRight className="w-4 h-4" />
          ) : (
            <FaChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Novo Agendamento */}
      <div className="px-4 mt-4 flex-shrink-0">
        <button
          onClick={() => setIsModalOpen(true)}
          className={`
            bg-blue-500 hover:bg-blue-600 text-white rounded-lg w-full
            transition-all duration-300 ease-in-out
            flex items-center justify-center py-2
            ${isCollapsed ? 'px-2' : 'px-4'}
          `}
        >
          <FaPlus className="w-4 h-4" />
          <span
            className={`
              ml-2 whitespace-nowrap
              transition-all duration-300 ease-in-out
              ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}
            `}
          >
            Novo Agendamento
          </span>
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 px-4 mt-4">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={index}
              onClick={() => handleNavigation(item.href)}
              className={`
                flex items-center px-2 py-2.5 mb-1 rounded-lg w-full
                transition-all duration-200 ease-in-out
                hover:bg-[#323e4f] group relative
                ${isActiveLink(item.href) ? 'bg-[#323e4f] text-blue-400' : 'text-gray-300'}
              `}
            >
              <Icon className={`w-5 h-5 shrink-0`} />
              <span
                className={`
                  ml-3 whitespace-nowrap
                  transition-all duration-300 ease-in-out
                  ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}
                `}
              >
                {item.label}
              </span>
              {isCollapsed && (
                <div className="
                  absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm
                  rounded opacity-0 group-hover:opacity-100
                  transition-opacity duration-200
                  pointer-events-none
                  whitespace-nowrap
                ">
                  {item.label}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      <NewAppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddAppointment}
        selectedDate={selectedDate}
        doctors={doctors}
        patients={patients}
      />
    </aside>
  );
};

export default Sidebar;