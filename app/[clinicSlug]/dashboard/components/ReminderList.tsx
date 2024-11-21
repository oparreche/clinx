import React from 'react';

interface Reminder {
  id: string;
  title: string;
  date: string;
  priority: 'high' | 'medium' | 'low';
}

interface ReminderListProps {
  title: string;
  reminders: Reminder[];
}

export default function ReminderList({ title, reminders }: ReminderListProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      {reminders.length === 0 ? (
        <p className="text-gray-500 text-center py-4">Nenhum lembrete encontrado</p>
      ) : (
        <div className="space-y-4">
          {reminders.map((reminder) => (
            <div
              key={reminder.id}
              className="flex items-center justify-between border-b pb-2"
            >
              <div>
                <h3 className="font-medium">{reminder.title}</h3>
                <p className="text-sm text-gray-500">{reminder.date}</p>
              </div>
              <span className={`text-sm font-medium ${getPriorityColor(reminder.priority)}`}>
                {reminder.priority === 'high' && 'Alta'}
                {reminder.priority === 'medium' && 'Média'}
                {reminder.priority === 'low' && 'Baixa'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}