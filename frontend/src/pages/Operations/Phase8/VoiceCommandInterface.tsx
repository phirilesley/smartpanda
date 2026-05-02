import React from 'react';

const VoiceCommandInterface: React.FC = () => {
  const commands = [
    'Take attendance for Form 2B',
    'Show today timetable',
    'Open pending help desk tickets',
    'Send fee reminder to overdue parents'
  ];

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Voice Command Interface</h1>
      <p className="text-gray-600 dark:text-gray-400">Voice assistant command center for school operations.</p>
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
        <h2 className="text-lg font-medium mb-3">Supported Commands</h2>
        <ul className="list-disc ml-6 space-y-1 text-sm">
          {commands.map((command) => (
            <li key={command}>{command}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default VoiceCommandInterface;
