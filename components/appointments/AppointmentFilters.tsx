import React from 'react';
import { AppointmentFilters } from '@/types/appointment';
import { appointmentStatusMap } from '@/types/appointment';

interface AppointmentFiltersProps {
  onFilterChange: (filters: AppointmentFilters) => void;
}

const AppointmentFilters: React.FC<AppointmentFiltersProps> = ({ onFilterChange }) => {
  const handleFilterChange = (field: keyof AppointmentFilters, value: any) => {
    onFilterChange({
      search: '',
      status: '',
      doctor: '',
      startDate: null,
      endDate: null,
      [field]: value,
    });
  };

  return (
    <div className="flex flex-wrap gap-4 p-4 bg-white rounded-lg shadow-sm">
      <div className="flex-1 min-w-[200px]">
        <input
          type="text"
          placeholder="Buscar por paciente ou médico..."
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => handleFilterChange('search', e.target.value)}
        />
      </div>

      <div className="w-48">
        <select
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => handleFilterChange('status', e.target.value)}
        >
          <option value="">Todos os status</option>
          {Object.entries(appointmentStatusMap).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="w-48">
        <select
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => handleFilterChange('doctor', e.target.value)}
        >
          <option value="">Todos os médicos</option>
          <option value="Dr. Carlos Santos">Dr. Carlos Santos</option>
          <option value="Dra. Ana Beatriz">Dra. Ana Beatriz</option>
        </select>
      </div>

      <div className="w-48">
        <input
          type="date"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => handleFilterChange('startDate', e.target.value ? new Date(e.target.value) : null)}
        />
      </div>

      <div className="w-48">
        <input
          type="date"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => handleFilterChange('endDate', e.target.value ? new Date(e.target.value) : null)}
        />
      </div>
    </div>
  );
};

export default AppointmentFilters;
