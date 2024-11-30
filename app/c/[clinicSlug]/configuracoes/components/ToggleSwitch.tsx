import React from 'react';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: () => void;
  label?: string;
  description?: string;
}

export default function ToggleSwitch({
  checked,
  onChange,
  label,
  description
}: ToggleSwitchProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        {label && <p className="font-medium">{label}</p>}
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
      </label>
    </div>
  );
}