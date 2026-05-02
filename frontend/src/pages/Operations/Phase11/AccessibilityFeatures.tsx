import React from 'react';

const AccessibilityFeatures: React.FC = () => {
  const checks = [
    { key: 'contrast', label: 'High contrast mode', status: 'Enabled' },
    { key: 'font', label: 'Large font support', status: 'Enabled' },
    { key: 'screen-reader', label: 'Screen reader labels', status: 'In progress' },
    { key: 'keyboard', label: 'Keyboard navigation', status: 'Enabled' }
  ];

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Accessibility Features</h1>
      <p className="text-gray-600 dark:text-gray-400">Track accessibility readiness for school portals.</p>
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="text-left p-3">Feature</th>
              <th className="text-left p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {checks.map((item) => (
              <tr key={item.key} className="border-t border-gray-100 dark:border-gray-700">
                <td className="p-3">{item.label}</td>
                <td className="p-3">{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AccessibilityFeatures;
