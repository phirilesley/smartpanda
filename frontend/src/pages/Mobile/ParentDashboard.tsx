import React from 'react';

const ParentDashboard: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Parent Dashboard</h1>
      <p className="text-gray-600 dark:text-gray-400 mt-2">Child progress, attendance, and fee status overview.</p>
    </div>
  );
};

export default ParentDashboard;
