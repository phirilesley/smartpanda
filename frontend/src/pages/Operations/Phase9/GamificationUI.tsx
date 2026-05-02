import React from 'react';

const GamificationUI: React.FC = () => {
  const leaderboard = [
    { name: 'Form 4A', points: 1280 },
    { name: 'Form 3B', points: 1170 },
    { name: 'Form 2A', points: 980 }
  ];

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Gamification</h1>
      <p className="text-gray-600 dark:text-gray-400">Motivation, points, and achievement tracking.</p>
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
        <h2 className="text-lg font-medium mb-3">Top Leaderboard</h2>
        <ul className="space-y-2">
          {leaderboard.map((entry, index) => (
            <li key={entry.name} className="flex justify-between text-sm">
              <span>{index + 1}. {entry.name}</span>
              <span>{entry.points} pts</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GamificationUI;
