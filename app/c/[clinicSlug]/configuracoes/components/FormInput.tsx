import React from 'react';

interface FormInputProps {
  label: string;
  type?: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  placeholder?: string;
}

export default function FormInput({
  label,
  type = 'text',
  name,
  defaultValue,
  required = false,
  placeholder
}: FormInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue}
        required={required}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  );
}