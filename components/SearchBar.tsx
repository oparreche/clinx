import React from 'react';
import { FaUserPlus } from 'react-icons/fa';

interface SearchBarProps {
  placeholder: string;
  onSearch: (value: string) => void;
  onAdd: () => void;
  buttonText: string;
}

export default function SearchBar({ placeholder, onSearch, onAdd, buttonText }: SearchBarProps) {
  return (
    <div className="flex justify-between mb-6">
      <input
        type="text"
        placeholder={placeholder}
        onChange={(e) => onSearch(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg w-64"
      />
      <button 
        onClick={onAdd}
        className="bg-blue-500 text-white px-6 py-2 rounded-lg flex items-center space-x-2"
      >
        <FaUserPlus />
        <span>{buttonText}</span>
      </button>
    </div>
  );
}