import React from 'react';

export const FoodServicesManagement: React.FC = () => {
  const stats = [
    { label: 'Active Meal Plans', value: '342' },
    { label: 'Today Meals Served', value: '1,126' },
    { label: 'Pending Catering Requests', value: '2' },
    { label: 'Low Stock Items', value: '7' }
  ];

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Food Services Management</h1>
      <p className="text-gray-600 dark:text-gray-400">Cafeteria operations, meal plans, and inventory overview.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((item) => (
          <div key={item.label} className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">{item.label}</p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">{item.value}</p>
          </div>
        ))}
      </div>
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 text-sm text-gray-700 dark:text-gray-300">
        Use this module to manage menus, cafeteria sessions, supplier restocking, and nutrition reports.
      </div>
    </div>
  );
};
