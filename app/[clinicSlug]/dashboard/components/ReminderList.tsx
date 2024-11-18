import React from 'react';

interface Reminder {
  title: string;
  description: string;
  time: string;
  date: string;
  priority: 'high' | 'medium' | 'low';
}

interface ReminderListProps {
  reminders: Reminder[];
}

export default function ReminderList({ reminders }: ReminderListProps) {
  const getPriorityColor = (priority: Reminder['priority']) => {
    switch (priority) {
      case 'high':
        return 'border-red-500';
      case 'medium':
        return 'border-yellow-500';
      case 'low':
        return 'border-green-500';
      default:
        return 'border-gray-500';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Lembretes</h2>
      <div className="space-y-4">
        {reminders.map((reminder, index) => (
          <div 
            key={index} 
            className={`border-l-4 ${getPriorityColor(reminder.priority)} p-4 bg-gray-50 rounded-r-lg`}
          >
            <h3 className="font-medium">{reminder.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{reminder.description}</p>
            <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
              <span>{reminder.date}</span>
              <span>{reminder.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}