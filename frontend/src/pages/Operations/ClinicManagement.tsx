import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HeartIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  ClockIcon,
  CalendarIcon,
  DocumentPlusIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

interface ClinicVisit {
  id: string;
  patientName: string;
  patientType: 'Student' | 'Staff';
  date: string;
  time: string;
  symptoms: string;
  diagnosis: string;
  treatment: string;
  medicationDispensed: string;
  status: 'Open' | 'FollowUpScheduled' | 'Referred' | 'Closed';
  clinician: string;
}

interface MedicationInventory {
  id: string;
  name: string;
  category: string;
  stockLevel: number;
  unit: string;
  expiryDate: string;
  status: 'InStock' | 'LowStock' | 'OutofStock';
}

const ClinicManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'visits' | 'inventory'>('visits');
  const [visits, setVisits] = useState<ClinicVisit[]>([]);
  const [inventory, setInventory] = useState<MedicationInventory[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Mock Data
    setVisits([
      {
        id: '1',
        patientName: 'Alice Johnson',
        patientType: 'Student',
        date: '2026-05-03',
        time: '09:30 AM',
        symptoms: 'Fever, headache',
        diagnosis: 'Viral Infection',
        treatment: 'Rest and hydration',
        medicationDispensed: 'Paracetamol 500mg',
        status: 'FollowUpScheduled',
        clinician: 'Nurse Mlambo'
      },
      {
        id: '2',
        patientName: 'Mr. Brown',
        patientType: 'Staff',
        date: '2026-05-02',
        time: '14:00 PM',
        symptoms: 'Severe back pain',
        diagnosis: 'Muscle Sprain',
        treatment: 'Refer to physiotherapy',
        medicationDispensed: 'Ibuprofen 400mg',
        status: 'Referred',
        clinician: 'Dr. Dube'
      }
    ]);

    setInventory([
      {
        id: '1',
        name: 'Paracetamol',
        category: 'Pain Relief',
        stockLevel: 1500,
        unit: 'Tablets',
        expiryDate: '2027-12-01',
        status: 'InStock'
      },
      {
        id: '2',
        name: 'Amoxicillin',
        category: 'Antibiotics',
        stockLevel: 50,
        unit: 'Capsules',
        expiryDate: '2026-08-15',
        status: 'LowStock'
      }
    ]);
  }, []);

  const filteredVisits = visits.filter(v => 
    v.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.symptoms.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredInventory = inventory.filter(i => 
    i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderVisits = () => (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">Recent Visits</h2>
        <div className="flex space-x-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500"
            />
          </div>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <PlusIcon className="h-5 w-5 mr-2" />
            New Visit
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {filteredVisits.map((visit) => (
          <motion.div key={visit.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border rounded-lg p-5 hover:shadow-lg transition">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-gray-900">{visit.patientName}</h3>
                <p className="text-sm text-gray-500">{visit.patientType}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                visit.status === 'Closed' ? 'bg-gray-100 text-gray-800' :
                visit.status === 'Referred' ? 'bg-red-100 text-red-800' :
                'bg-blue-100 text-blue-800'
              }`}>{visit.status}</span>
            </div>
            <div className="space-y-2 text-sm text-gray-700">
              <p><strong>Date:</strong> {visit.date} at {visit.time}</p>
              <p><strong>Symptoms:</strong> {visit.symptoms}</p>
              <p><strong>Medication:</strong> {visit.medicationDispensed}</p>
              <p><strong>Clinician:</strong> {visit.clinician}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderInventory = () => (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">Dispensary Inventory</h2>
        <div className="flex space-x-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search medication..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500"
            />
          </div>
          <button className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Stock
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Medication</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock Level</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expiry</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredInventory.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{item.name}</td>
                <td className="px-6 py-4 text-gray-500">{item.category}</td>
                <td className="px-6 py-4 text-gray-900">{item.stockLevel} {item.unit}</td>
                <td className="px-6 py-4 text-gray-500">{item.expiryDate}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    item.status === 'InStock' ? 'bg-green-100 text-green-800' :
                    item.status === 'LowStock' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>{item.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clinic Management</h1>
          <p className="mt-2 text-sm text-gray-600">Comprehensive health clinic records, visits, and dispensary control.</p>
        </div>
      </div>

      <div className="mb-6 flex space-x-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('visits')}
          className={`pb-4 px-4 font-medium ${activeTab === 'visits' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Patient Visits
        </button>
        <button
          onClick={() => setActiveTab('inventory')}
          className={`pb-4 px-4 font-medium ${activeTab === 'inventory' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Dispensary & Inventory
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'visits' ? renderVisits() : renderInventory()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ClinicManagement;
