import React from 'react';
import { FaTrash } from 'react-icons/fa';

interface DeleteButtonProps {
  onClick: () => void;
  small?: boolean;
}

export default function DeleteButton({ onClick, small = false }: DeleteButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`${
        small ? 'p-2' : 'px-4 py-2'
      } text-red-600 hover:bg-red-50 rounded-lg flex items-center space-x-2`}
    >
      <FaTrash className={small ? 'h-4 w-4' : 'h-5 w-5'} />
      {!small && <span>Excluir</span>}
    </button>
  );
}