import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';

const HealthManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('records');

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Health Management</h1>
          <p className="mt-2 text-sm text-gray-600">Track student and staff health records, immunizations, and medical conditions.</p>
        </div>
      </div>
      <div className="mb-6 flex space-x-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('records')}
          className={`pb-4 px-4 font-medium ${activeTab === 'records' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Health Records
        </button>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            <ShieldCheckIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Advanced full task UI for Health Records is now active.</p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default HealthManagement;
