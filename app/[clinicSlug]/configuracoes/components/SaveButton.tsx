import React from 'react';

interface SaveButtonProps {
  onClick?: () => void;
  loading?: boolean;
}

export default function SaveButton({ onClick, loading = false }: SaveButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]`}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      ) : (
        'Salvar Alterações'
      )}
    </button>
  );
}