import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BuildingOfficeIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  ShieldCheckIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ChartBarIcon,
  BellIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowPathIcon,
  DocumentTextIcon,
  UserIcon,
  AcademicCapIcon,
  MapPinIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  PhoneIcon,
  UserCircleIcon,
  BeakerIcon,
  ClockIcon,
  TruckIcon
} from '@heroicons/react/24/outline';

interface ClinicVisit {
  id: string;
  studentId: string;
  studentName: string;
  studentNumber: string;
  visitDate: string;
  reasonForVisit: string;
  symptoms: string;
  diagnosis: string;
  treatment: string;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
  attendingStaffId: string;
  attendingStaffName: string;
  notes: string;
  followUpRequired: boolean;
  followUpDate?: string;
  referredTo?: string;
  referralReason?: string;
}

interface Medication {
  id: string;
  name: string;
  description: string;
  category: string;
  unit: string;
  currentStock: number;
  minimumStock: number;
  maximumStock: number;
  expiryDate: string;
  status: 'Active' | 'Inactive' | 'Discontinued';
  manufacturer: string;
  batchNumber: string;
  price: number;
  storageConditions: string;
  sideEffects: string[];
}

interface Prescription {
  id: string;
  clinicVisitId: string;
  studentName: string;
  visitDate: string;
  prescribedByStaffId: string;
  prescribedByStaffName: string;
  notes: string;
  status: 'Active' | 'Completed' | 'Cancelled';
  items: PrescriptionItem[];
  createdAt: string;
  fulfilledAt?: string;
  fulfilledByStaffId?: string;
  fulfilledByStaffName?: string;
}

interface PrescriptionItem {
  id: string;
  clinicMedicationId: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  quantity: number;
  instructions: string;
  dispensed: boolean;
  dispensedQuantity?: number;
  dispensedDate?: string;
}

interface MedicationDispense {
  id: string;
  clinicMedicationId: string;
  medicationName: string;
  quantityDispensed: number;
  dispensedToStudentId: string;
  dispensedToStudentName: string;
  dispensedByStaffId: string;
  dispensedByStaffName: string;
  dispensedAt: string;
  prescriptionId: string;
  notes: string;
  remainingStock: number;
}

interface ClinicAnalytics {
  totalVisits: number;
  totalPrescriptions: number;
  totalMedications: number;
  lowStockMedications: number;
  expiredMedications: number;
  totalDispenses: number;
  revenue: number;
  pendingReferrals: number;
  followUpRequired: number;
  visitsByCategory: Array<{ category: string; count: number }>;
  topMedications: Array<{ name: string; dispensed: number }>;
  monthlyTrends: Array<{ month: string; visits: number; prescriptions: number; revenue: number }>;
  staffPerformance: Array<{ staffName: string; visits: number; prescriptions: number }>;
}

export const ClinicManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'visits' | 'medications' | 'prescriptions' | 'dispenses' | 'analytics'>('visits');
  const [visits, setVisits] = useState<ClinicVisit[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [dispenses, setDispenses] = useState<MedicationDispense[]>([]);
  const [analytics, setAnalytics] = useState<ClinicAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API calls
      const mockVisits: ClinicVisit[] = [
        {
          id: 'visit-1',
          studentId: 'stu-1',
          studentName: 'John Doe',
          studentNumber: 'STU001',
          visitDate: '2024-03-15T10:30:00Z',
          reasonForVisit: 'Fever and headache',
          symptoms: 'Temperature 38.5°C, mild headache, fatigue',
          diagnosis: 'Viral fever',
          treatment: 'Paracetamol, rest, hydration',
          status: 'Completed',
          attendingStaffId: 'staff-1',
          attendingStaffName: 'Dr. Sarah Johnson',
          notes: 'Patient responded well to treatment',
          followUpRequired: false
        },
        {
          id: 'visit-2',
          studentId: 'stu-2',
          studentName: 'Jane Smith',
          studentNumber: 'STU002',
          visitDate: '2024-03-14T14:15:00Z',
          reasonForVisit: 'Sports injury',
          symptoms: 'Sprained ankle during basketball practice',
          diagnosis: 'Ankle sprain',
          treatment: 'RICE protocol, pain medication',
          status: 'Completed',
          attendingStaffId: 'staff-2',
          attendingStaffName: 'Nurse Emily Davis',
          notes: 'Student advised to rest for 3 days',
          followUpRequired: true,
          followUpDate: '2024-03-17'
        },
        {
          id: 'visit-3',
          studentId: 'stu-3',
          studentName: 'Mike Wilson',
          studentNumber: 'STU003',
          visitDate: '2024-03-13T09:00:00Z',
          reasonForVisit: 'Routine checkup',
          symptoms: 'No symptoms',
          diagnosis: 'Healthy',
          treatment: 'No treatment needed',
          status: 'Completed',
          attendingStaffId: 'staff-1',
          attendingStaffName: 'Dr. Sarah Johnson',
          notes: 'Regular health check completed',
          followUpRequired: false,
          referredTo: 'Dentist',
          referralReason: 'Routine dental checkup recommended'
        }
      ];

      const mockMedications: Medication[] = [
        {
          id: 'med-1',
          name: 'Paracetamol',
          description: 'Pain relief and fever reducer',
          category: 'Analgesic',
          unit: 'Tablet',
          currentStock: 150,
          minimumStock: 50,
          maximumStock: 500,
          expiryDate: '2025-12-31',
          status: 'Active',
          manufacturer: 'PharmaCorp',
          batchNumber: 'PAR-2024-001',
          price: 2.50,
          storageConditions: 'Store at room temperature',
          sideEffects: ['Nausea', 'Stomach upset', 'Allergic reactions']
        },
        {
          id: 'med-2',
          name: 'Ibuprofen',
          description: 'Anti-inflammatory medication',
          category: 'NSAID',
          unit: 'Tablet',
          currentStock: 75,
          minimumStock: 30,
          maximumStock: 300,
          expiryDate: '2025-06-30',
          status: 'Active',
          manufacturer: 'MediLab',
          batchNumber: 'IBU-2024-002',
          price: 3.00,
          storageConditions: 'Store at room temperature',
          sideEffects: ['Stomach irritation', 'Headache', 'Dizziness']
        },
        {
          id: 'med-3',
          name: 'Amoxicillin',
          description: 'Antibiotic',
          category: 'Antibiotic',
          unit: 'Capsule',
          currentStock: 25,
          minimumStock: 20,
          maximumStock: 100,
          expiryDate: '2024-08-15',
          status: 'Active',
          manufacturer: 'BioPharm',
          batchNumber: 'AMX-2024-003',
          price: 5.50,
          storageConditions: 'Store at room temperature',
          sideEffects: ['Nausea', 'Diarrhea', 'Allergic reactions']
        }
      ];

      const mockPrescriptions: Prescription[] = [
        {
          id: 'presc-1',
          clinicVisitId: 'visit-1',
          studentName: 'John Doe',
          visitDate: '2024-03-15T10:30:00Z',
          prescribedByStaffId: 'staff-1',
          prescribedByStaffName: 'Dr. Sarah Johnson',
          notes: 'Take as needed for fever',
          status: 'Completed',
          items: [
            {
              id: 'item-1',
              clinicMedicationId: 'med-1',
              medicationName: 'Paracetamol',
              dosage: '500mg',
              frequency: 'Every 6 hours',
              duration: '3 days',
              quantity: 6,
              instructions: 'Take with food',
              dispensed: true,
              dispensedQuantity: 6,
              dispensedDate: '2024-03-15T11:00:00Z'
            }
          ],
          createdAt: '2024-03-15T10:45:00Z',
          fulfilledAt: '2024-03-15T11:00:00Z',
          fulfilledByStaffId: 'staff-3',
          fulfilledByStaffName: 'Pharmacist Tom Brown'
        },
        {
          id: 'presc-2',
          clinicVisitId: 'visit-2',
          studentName: 'Jane Smith',
          visitDate: '2024-03-14T14:15:00Z',
          prescribedByStaffId: 'staff-2',
          prescribedByStaffName: 'Nurse Emily Davis',
          notes: 'Pain management for sprain',
          status: 'Completed',
          items: [
            {
              id: 'item-2',
              clinicMedicationId: 'med-2',
              medicationName: 'Ibuprofen',
              dosage: '400mg',
              frequency: 'Every 8 hours',
              duration: '5 days',
              quantity: 10,
              instructions: 'Take with food',
              dispensed: true,
              dispensedQuantity: 10,
              dispensedDate: '2024-03-14T15:00:00Z'
            }
          ],
          createdAt: '2024-03-14T14:30:00Z',
          fulfilledAt: '2024-03-14T15:00:00Z',
          fulfilledByStaffId: 'staff-3',
          fulfilledByStaffName: 'Pharmacist Tom Brown'
        }
      ];

      const mockDispenses: MedicationDispense[] = [
        {
          id: 'disp-1',
          clinicMedicationId: 'med-1',
          medicationName: 'Paracetamol',
          quantityDispensed: 6,
          dispensedToStudentId: 'stu-1',
          dispensedToStudentName: 'John Doe',
          dispensedByStaffId: 'staff-3',
          dispensedByStaffName: 'Pharmacist Tom Brown',
          dispensedAt: '2024-03-15T11:00:00Z',
          prescriptionId: 'presc-1',
          notes: 'For fever management',
          remainingStock: 144
        },
        {
          id: 'disp-2',
          clinicMedicationId: 'med-2',
          medicationName: 'Ibuprofen',
          quantityDispensed: 10,
          dispensedToStudentId: 'stu-2',
          dispensedToStudentName: 'Jane Smith',
          dispensedByStaffId: 'staff-3',
          dispensedByStaffName: 'Pharmacist Tom Brown',
          dispensedAt: '2024-03-14T15:00:00Z',
          prescriptionId: 'presc-2',
          notes: 'For pain management',
          remainingStock: 65
        }
      ];

      const mockAnalytics: ClinicAnalytics = {
        totalVisits: 156,
        totalPrescriptions: 89,
        totalMedications: 45,
        lowStockMedications: 3,
        expiredMedications: 2,
        totalDispenses: 234,
        revenue: 1250.50,
        pendingReferrals: 8,
        followUpRequired: 12,
        visitsByCategory: [
          { category: 'General', count: 65 },
          { category: 'Injury', count: 28 },
          { category: 'Illness', count: 35 },
          { category: 'Checkup', count: 28 }
        ],
        topMedications: [
          { name: 'Paracetamol', dispensed: 45 },
          { name: 'Ibuprofen', dispensed: 32 },
          { name: 'Amoxicillin', dispensed: 18 }
        ],
        monthlyTrends: [
          { month: 'Jan', visits: 52, prescriptions: 28, revenue: 450.00 },
          { month: 'Feb', visits: 48, prescriptions: 31, revenue: 380.50 },
          { month: 'Mar', visits: 56, prescriptions: 30, revenue: 420.00 }
        ],
        staffPerformance: [
          { staffName: 'Dr. Sarah Johnson', visits: 45, prescriptions: 25 },
          { staffName: 'Nurse Emily Davis', visits: 38, prescriptions: 18 },
          { staffName: 'Pharmacist Tom Brown', visits: 0, prescriptions: 0 }
        ]
      };

      setVisits(mockVisits);
      setMedications(mockMedications);
      setPrescriptions(mockPrescriptions);
      setDispenses(mockDispenses);
      setAnalytics(mockAnalytics);
    } catch (error) {
      console.error('Error loading clinic data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
      case 'Active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Scheduled':
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'Inactive':
      case 'Discontinued':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Clinic Management</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage clinic visits, medications, prescriptions, and dispensing</p>
      </div>

      {/* Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Visits</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.totalVisits}</p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-3">
                <BuildingOfficeIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600 dark:text-green-400">{analytics.followUpRequired} follow-ups</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Prescriptions</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.totalPrescriptions}</p>
              </div>
              <div className="bg-purple-100 dark:bg-purple-900 rounded-full p-3">
                <ClipboardDocumentListIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-gray-500 dark:text-gray-400">This month</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Medications</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.totalMedications}</p>
              </div>
              <div className="bg-green-100 dark:bg-green-900 rounded-full p-3">
                <BeakerIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-red-600 dark:text-red-400">{analytics.lowStockMedications} low stock</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Revenue</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">${analytics.revenue.toFixed(2)}</p>
              </div>
              <div className="bg-yellow-100 dark:bg-yellow-900 rounded-full p-3">
                <CurrencyDollarIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-gray-500 dark:text-gray-400">This month</span>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'visits', label: 'Visits', icon: BuildingOfficeIcon },
            { id: 'medications', label: 'Medications', icon: BeakerIcon },
            { id: 'prescriptions', label: 'Prescriptions', icon: ClipboardDocumentListIcon },
            { id: 'dispenses', label: 'Dispenses', icon: TruckIcon },
            { id: 'analytics', label: 'Analytics', icon: ChartBarIcon }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center px-1 py-2 border-b-2 text-sm font-medium ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'visits' && (
          <div>
            {/* Actions Bar */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search visits..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="all">All Status</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  New Visit
                </button>
                <button className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <ArrowPathIcon className="w-4 h-4 mr-2" />
                  Refresh
                </button>
              </div>
            </div>

            {/* Visits Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {visits.filter(v => 
                (v.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                 v.reasonForVisit.toLowerCase().includes(searchTerm.toLowerCase())) &&
                (filterStatus === 'all' || v.status === filterStatus)
              ).map((visit) => (
                <motion.div
                  key={visit.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                          {visit.reasonForVisit}
                        </h3>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <UserIcon className="w-4 h-4 mr-1" />
                          {visit.studentName} ({visit.studentNumber})
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(visit.status)}`}>
                        {visit.status}
                      </span>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Symptoms</p>
                        <p className="text-sm text-gray-900 dark:text-white">{visit.symptoms}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Diagnosis</p>
                        <p className="text-sm text-gray-900 dark:text-white">{visit.diagnosis}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Treatment</p>
                        <p className="text-sm text-gray-900 dark:text-white">{visit.treatment}</p>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Attending Staff</span>
                        <span className="font-medium text-gray-900 dark:text-white">{visit.attendingStaffName}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Visit Date</span>
                        <span className="font-medium text-gray-900 dark:text-white">{new Date(visit.visitDate).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {visit.followUpRequired && (
                      <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900 rounded-lg">
                        <div className="flex items-center text-sm">
                          <BellIcon className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mr-2" />
                          <span className="text-yellow-800 dark:text-yellow-200">
                            Follow-up required on {visit.followUpDate ? new Date(visit.followUpDate).toLocaleDateString() : 'TBD'}
                          </span>
                        </div>
                      </div>
                    )}

                    {visit.referredTo && (
                      <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
                        <div className="flex items-center text-sm">
                          <ExclamationTriangleIcon className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2" />
                          <span className="text-blue-800 dark:text-blue-200">
                            Referred to {visit.referredTo} - {visit.referralReason}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors">
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors">
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors">
                          <DocumentTextIcon className="w-4 h-4" />
                        </button>
                      </div>
                      <button className="px-3 py-1 text-sm bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors">
                        Manage Visit
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'medications' && (
          <div className="space-y-4">
            {medications.map((medication) => (
              <motion.div
                key={medication.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        {medication.name}
                      </h3>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <BeakerIcon className="w-4 h-4 mr-1" />
                        {medication.category} • {medication.unit}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(medication.status)}`}>
                        {medication.status}
                      </span>
                      {medication.currentStock <= medication.minimumStock && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                          Low Stock
                        </span>
                      )}
                      {new Date(medication.expiryDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                          Expiring Soon
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Current Stock</p>
                      <p className="font-medium text-gray-900 dark:text-white">{medication.currentStock}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Min/Max Stock</p>
                      <p className="font-medium text-gray-900 dark:text-white">{medication.minimumStock}/{medication.maximumStock}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Price</p>
                      <p className="font-medium text-gray-900 dark:text-white">${medication.price.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Expiry Date</p>
                      <p className={`font-medium ${
                        new Date(medication.expiryDate) <= new Date()
                          ? 'text-red-600 dark:text-red-400'
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {new Date(medication.expiryDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Description</p>
                    <p className="text-sm text-gray-900 dark:text-white">{medication.description}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Manufacturer</p>
                      <p className="text-sm text-gray-900 dark:text-white">{medication.manufacturer}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Batch: {medication.batchNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Storage</p>
                      <p className="text-sm text-gray-900 dark:text-white">{medication.storageConditions}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors">
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors">
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors">
                        <TruckIcon className="w-4 h-4" />
                      </button>
                    </div>
                    <button className="px-3 py-1 text-sm bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors">
                      Manage Medication
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'analytics' && analytics && (
          <div className="space-y-6">
            {/* Visits by Category */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Visits by Category</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {analytics.visitsByCategory.map((category, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                      {category.count}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{category.category}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Medications */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Medications</h3>
              <div className="space-y-3">
                {analytics.topMedications.map((med, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <BeakerIcon className="w-4 h-4 text-blue-500 mr-2" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{med.name}</span>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{med.dispensed} dispensed</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Staff Performance */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Staff Performance</h3>
              <div className="space-y-3">
                {analytics.staffPerformance.map((staff, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{staff.staffName}</span>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <BuildingOfficeIcon className="w-4 h-4 text-blue-500 mr-1" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{staff.visits} visits</span>
                      </div>
                      <div className="flex items-center">
                        <ClipboardDocumentListIcon className="w-4 h-4 text-green-500 mr-1" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{staff.prescriptions} prescriptions</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Monthly Trends */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Monthly Trends</h3>
              <div className="space-y-4">
                {analytics.monthlyTrends.map((trend, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{trend.month}</span>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <BuildingOfficeIcon className="w-4 h-4 text-blue-500 mr-1" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{trend.visits} visits</span>
                      </div>
                      <div className="flex items-center">
                        <ClipboardDocumentListIcon className="w-4 h-4 text-green-500 mr-1" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{trend.prescriptions} prescriptions</span>
                      </div>
                      <div className="flex items-center">
                        <CurrencyDollarIcon className="w-4 h-4 text-yellow-500 mr-1" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">${trend.revenue.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
