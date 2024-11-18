import React from 'react';
import { FaFileDownload, FaEye } from 'react-icons/fa';

const mockReports = [
  {
    id: 1,
    title: 'Avaliação Psicológica',
    doctor: 'Dr. Almeida',
    date: '01/12/2023',
    type: 'Laudo Completo',
    status: 'available'
  },
  {
    id: 2,
    title: 'Relatório de Acompanhamento',
    doctor: 'Dra. Santos',
    date: '15/12/2023',
    type: 'Relatório Parcial',
    status: 'processing'
  }
];

export default function Reports() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Meus Laudos</h1>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="space-y-4">
            {mockReports.map((report) => (
              <div key={report.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{report.title}</h3>
                    <p className="text-sm text-gray-500">{report.doctor}</p>
                    <div className="flex items-center mt-2 text-sm text-gray-600">
                      <span>{report.date} - {report.type}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {report.status === 'available' ? (
                      <>
                        <button
                          onClick={() => {}}
                          className="flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                        >
                          <FaEye className="mr-1" />
                          Visualizar
                        </button>
                        <button
                          onClick={() => {}}
                          className="flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                        >
                          <FaFileDownload className="mr-1" />
                          Baixar
                        </button>
                      </>
                    ) : (
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg">
                        Em Processamento
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}