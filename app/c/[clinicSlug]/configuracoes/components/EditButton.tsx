import React from 'react';
import { FaEdit } from 'react-icons/fa';

interface EditButtonProps {
  onClick: () => void;
  small?: boolean;
}

export default function EditButton({ onClick, small = false }: EditButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`${
        small ? 'p-2' : 'px-4 py-2'
      } text-blue-600 hover:bg-blue-50 rounded-lg flex items-center space-x-2`}
    >
      <FaEdit className={small ? 'h-4 w-4' : 'h-5 w-5'} />
      {!small && <span>Editar</span>}
    </button>
  );
}