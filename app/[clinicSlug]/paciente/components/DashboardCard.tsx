import { IconType } from 'react-icons';

interface DashboardCardProps {
  title: string;
  value: string;
  Icon: IconType;
  iconBgColor: string;
  iconColor: string;
}

export default function DashboardCard({
  title,
  value,
  Icon,
  iconBgColor,
  iconColor
}: DashboardCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center space-x-3">
        <div className={`p-3 ${iconBgColor} rounded-full`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
        <div>
          <h3 className="text-lg font-medium">{title}</h3>
          <p className="text-sm text-gray-500">{value}</p>
        </div>
      </div>
    </div>
  );
}