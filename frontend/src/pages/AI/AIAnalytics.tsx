import React from 'react';
import { motion } from 'framer-motion';

export const AIAnalytics: React.FC = () => {
  const cards = [
    { title: 'At-Risk Students', value: '24', trend: 'down 8%' },
    { title: 'Attendance Forecast', value: '93.6%', trend: 'up 1.2%' },
    { title: 'Fee Collection Forecast', value: '96.1%', trend: 'up 0.8%' },
    { title: 'Teacher Load Risk', value: 'Low', trend: 'stable' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI Analytics Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Predictive insights for Zimbabwe school operations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {cards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            className="rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">{card.title}</p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-2">{card.value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{card.trend}</p>
          </motion.div>
        ))}
      </div>

      <div className="rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Recommendation Queue</h2>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>Prioritize intervention plans for Form 2 Mathematics and English cohorts.</li>
          <li>Increase targeted follow-up for students below 85% attendance in Term 2.</li>
          <li>Rebalance teacher periods for overload hotspots before next timetable cycle.</li>
        </ul>
      </div>
    </div>
  );
};

export default AIAnalytics;
