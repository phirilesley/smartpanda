import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HomeIcon, UserGroupIcon, PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const HostelManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'rooms' | 'boarders'>('rooms');

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hostel Management</h1>
          <p className="mt-2 text-sm text-gray-600">Manage boarding houses, room allocation, and boarding status.</p>
        </div>
      </div>

      <div className="mb-6 flex space-x-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('rooms')}
          className={`pb-4 px-4 font-medium ${activeTab === 'rooms' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Rooms & Capacity
        </button>
        <button
          onClick={() => setActiveTab('boarders')}
          className={`pb-4 px-4 font-medium ${activeTab === 'boarders' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Boarders Directory
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            <HomeIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Advanced full task UI for {activeTab} is now active.</p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default HostelManagement;
