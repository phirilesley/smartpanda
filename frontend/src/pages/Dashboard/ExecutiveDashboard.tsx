import React from 'react';
import { ChartBarIcon, UserGroupIcon, AcademicCapIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

const ExecutiveDashboard: React.FC = () => {
  const metrics = [
    { name: 'Enrollment', value: '1,248', icon: UserGroupIcon },
    { name: 'Pass Rate', value: '89.4%', icon: AcademicCapIcon },
    { name: 'Fee Collection', value: '96.1%', icon: CurrencyDollarIcon },
    { name: 'Overall Health', value: 'Strong', icon: ChartBarIcon }
  ];

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Executive Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <div key={metric.name} className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
            <metric.icon className="w-5 h-5 text-gray-500 mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400">{metric.name}</p>
            <p className="text-xl font-semibold text-gray-900 dark:text-white">{metric.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExecutiveDashboard;
