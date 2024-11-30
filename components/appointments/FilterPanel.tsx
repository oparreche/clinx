import React from 'react';
import { Doctor } from '@/services/doctorService';
import { Patient } from '@/services/patientService';
import { appointmentStatusMap } from '@/types/appointment';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

interface FilterPanelProps {
  doctors: Doctor[];
  patients: Patient[];
  filters: {
    doctor: string;
    patient: string;
    status: string;
    startDate: Date | null;
    endDate: Date | null;
  };
  onFilterChange: (filters: any) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  doctors,
  patients,
  filters,
  onFilterChange,
}) => {
  const handleChange = (field: string, value: any) => {
    onFilterChange({ ...filters, [field]: value });
  };

  const clearFilters = () => {
    onFilterChange({
      doctor: '',
      patient: '',
      status: '',
      startDate: null,
      endDate: null,
    });
  };

  return (
    <div className="space-y-4 bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Filtros</h3>
        <button
          onClick={clearFilters}
          className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          Limpar Filtros
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label htmlFor="doctor" className="block text-sm font-medium text-gray-700">
            Médico
          </label>
          <select
            id="doctor"
            value={filters.doctor}
            onChange={(e) => handleChange('doctor', e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none 
              focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="">Todos os médicos</option>
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="patient" className="block text-sm font-medium text-gray-700">
            Paciente
          </label>
          <select
            id="patient"
            value={filters.patient}
            onChange={(e) => handleChange('patient', e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none 
              focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="">Todos os pacientes</option>
            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            id="status"
            value={filters.status}
            onChange={(e) => handleChange('status', e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none 
              focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="">Todos os status</option>
            {Object.entries(appointmentStatusMap).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Data Inicial
          </label>
          <DatePicker
            selected={filters.startDate || null}
            onChange={(date) => handleChange('startDate', date)}
            dateFormat="dd/MM/yyyy"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none 
              focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            placeholderText="Selecione a data inicial"
            isClearable
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Data Final
          </label>
          <DatePicker
            selected={filters.endDate || null}
            onChange={(date) => handleChange('endDate', date)}
            dateFormat="dd/MM/yyyy"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none 
              focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            placeholderText="Selecione a data final"
            minDate={filters.startDate || undefined}
            isClearable
          />
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
