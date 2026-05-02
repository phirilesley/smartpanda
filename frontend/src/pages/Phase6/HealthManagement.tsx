import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  HeartIcon,
  UserGroupIcon,
  DocumentTextIcon,
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
  CalendarIcon,
  UserIcon,
  BuildingOfficeIcon,
  AcademicCapIcon,
  MapPinIcon,
  ClockIcon,
  CurrencyDollarIcon,
  PhoneIcon,
  UserCircleIcon,
  BeakerIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';

interface HealthProfile {
  id: string;
  studentId?: string;
  staffId?: string;
  studentName?: string;
  staffName?: string;
  bloodGroup: string;
  allergies: string;
  chronicConditions: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelationship: string;
  medications: string;
  dietaryRestrictions: string;
  physicalLimitations: string;
  lastUpdated: string;
}

interface HealthScreening {
  id: string;
  healthProfileId: string;
  studentName?: string;
  staffName?: string;
  screeningDate: string;
  heightCm?: number;
  weightKg?: number;
  bloodPressure: string;
  heartRate?: number;
  temperature?: number;
  vision?: string;
  hearing?: string;
  dental?: string;
  notes: string;
  screenedByStaffId: string;
  screenedByStaffName: string;
  nextScreeningDate?: string;
}

interface ImmunizationRecord {
  id: string;
  healthProfileId: string;
  vaccineName: string;
  doseNumber: number;
  administeredDate: string;
  nextDueDate?: string;
  administeredByStaffId: string;
  administeredByStaffName: string;
  batchNumber: string;
  notes: string;
  status: 'Completed' | 'Due' | 'Overdue';
}

interface HealthActionPlan {
  id: string;
  healthProfileId: string;
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  assignedToStaffId: string;
  assignedToStaffName: string;
  status: 'Active' | 'Completed' | 'Cancelled';
  priority: 'Low' | 'Medium' | 'High';
  actions: string[];
  progressNotes: string[];
  lastUpdated: string;
}

interface HealthAlert {
  id: string;
  type: 'ImmunizationDue' | 'ScreeningDue' | 'ChronicCondition' | 'SevereAllergy' | 'Medication' | 'Other';
  title: string;
  description: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  profileId: string;
  profileName: string;
  dueDate?: string;
  createdAt: string;
  status: 'Active' | 'Resolved' | 'Ignored';
}

interface HealthAnalytics {
  totalProfiles: number;
  studentProfiles: number;
  staffProfiles: number;
  upcomingImmunizations: number;
  overdueImmunizations: number;
  upcomingScreenings: number;
  chronicConditionCount: number;
  allergyAlerts: number;
  completedScreenings: number;
  actionPlans: number;
  bloodGroupDistribution: Array<{ group: string; count: number }>;
  immunizationCoverage: Array<{ vaccine: string; coverage: number }>;
  healthTrends: Array<{ month: string; screenings: number; immunizations: number; alerts: number }>;
  commonConditions: Array<{ condition: string; count: number }>;
}

export const HealthManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profiles' | 'screenings' | 'immunizations' | 'action-plans' | 'alerts' | 'analytics'>('profiles');
  const [profiles, setProfiles] = useState<HealthProfile[]>([]);
  const [screenings, setScreenings] = useState<HealthScreening[]>([]);
  const [immunizations, setImmunizations] = useState<ImmunizationRecord[]>([]);
  const [actionPlans, setActionPlans] = useState<HealthActionPlan[]>([]);
  const [alerts, setAlerts] = useState<HealthAlert[]>([]);
  const [analytics, setAnalytics] = useState<HealthAnalytics | null>(null);
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
      const mockProfiles: HealthProfile[] = [
        {
          id: '1',
          studentId: 'stu-1',
          studentName: 'John Doe',
          bloodGroup: 'O+',
          allergies: 'Peanuts, Dust mites',
          chronicConditions: 'Asthma',
          emergencyContactName: 'Jane Doe',
          emergencyContactPhone: '+1234567890',
          emergencyContactRelationship: 'Mother',
          medications: 'Albuterol inhaler',
          dietaryRestrictions: 'No peanuts',
          physicalLimitations: 'None',
          lastUpdated: '2024-03-10'
        },
        {
          id: '2',
          studentId: 'stu-2',
          studentName: 'Jane Smith',
          bloodGroup: 'A+',
          allergies: 'None',
          chronicConditions: 'None',
          emergencyContactName: 'Bob Smith',
          emergencyContactPhone: '+0987654321',
          emergencyContactRelationship: 'Father',
          medications: 'None',
          dietaryRestrictions: 'Vegetarian',
          physicalLimitations: 'None',
          lastUpdated: '2024-03-12'
        },
        {
          id: '3',
          staffId: 'staff-1',
          staffName: 'Dr. Sarah Johnson',
          bloodGroup: 'B+',
          allergies: 'Latex',
          chronicConditions: 'Hypertension',
          emergencyContactName: 'Tom Johnson',
          emergencyContactPhone: '+1122334455',
          emergencyContactRelationship: 'Spouse',
          medications: 'Lisinopril',
          dietaryRestrictions: 'Low sodium',
          physicalLimitations: 'None',
          lastUpdated: '2024-03-08'
        }
      ];

      const mockScreenings: HealthScreening[] = [
        {
          id: 'screen-1',
          healthProfileId: '1',
          studentName: 'John Doe',
          screeningDate: '2024-03-15',
          heightCm: 165,
          weightKg: 55,
          bloodPressure: '110/70',
          heartRate: 72,
          temperature: 36.5,
          vision: '20/20',
          hearing: 'Normal',
          dental: 'Good',
          notes: 'Overall healthy, asthma well controlled',
          screenedByStaffId: 'staff-2',
          screenedByStaffName: 'Nurse Emily Davis',
          nextScreeningDate: '2024-09-15'
        },
        {
          id: 'screen-2',
          healthProfileId: '2',
          studentName: 'Jane Smith',
          screeningDate: '2024-03-10',
          heightCm: 160,
          weightKg: 50,
          bloodPressure: '105/65',
          heartRate: 68,
          temperature: 36.4,
          vision: '20/25',
          hearing: 'Normal',
          dental: 'Good',
          notes: 'Healthy, needs vision correction',
          screenedByStaffId: 'staff-2',
          screenedByStaffName: 'Nurse Emily Davis',
          nextScreeningDate: '2024-09-10'
        }
      ];

      const mockImmunizations: ImmunizationRecord[] = [
        {
          id: 'imm-1',
          healthProfileId: '1',
          vaccineName: 'BCG',
          doseNumber: 1,
          administeredDate: '2020-01-15',
          nextDueDate: '2025-01-15',
          administeredByStaffId: 'staff-3',
          administeredByStaffName: 'Dr. Michael Chen',
          batchNumber: 'BCG-2020-001',
          notes: 'No adverse reactions',
          status: 'Completed'
        },
        {
          id: 'imm-2',
          healthProfileId: '1',
          vaccineName: 'MMR',
          doseNumber: 1,
          administeredDate: '2021-03-20',
          nextDueDate: '2021-09-20',
          administeredByStaffId: 'staff-3',
          administeredByStaffName: 'Dr. Michael Chen',
          batchNumber: 'MMR-2021-002',
          notes: 'First dose completed',
          status: 'Completed'
        },
        {
          id: 'imm-3',
          healthProfileId: '2',
          vaccineName: 'Hepatitis B',
          doseNumber: 1,
          administeredDate: '2024-02-15',
          nextDueDate: '2024-05-15',
          administeredByStaffId: 'staff-3',
          administeredByStaffName: 'Dr. Michael Chen',
          batchNumber: 'HEP-2024-001',
          notes: 'First dose of series',
          status: 'Due'
        }
      ];

      const mockActionPlans: HealthActionPlan[] = [
        {
          id: 'plan-1',
          healthProfileId: '1',
          title: 'Asthma Management Plan',
          description: 'Daily monitoring and emergency procedures for asthma',
          startDate: '2024-01-15',
          endDate: '2024-12-31',
          assignedToStaffId: 'staff-2',
          assignedToStaffName: 'Nurse Emily Davis',
          status: 'Active',
          priority: 'High',
          actions: ['Daily peak flow monitoring', 'Carry inhaler at all times', 'Avoid triggers'],
          progressNotes: ['Patient compliant with medication', 'No recent exacerbations'],
          lastUpdated: '2024-03-10'
        },
        {
          id: 'plan-2',
          healthProfileId: '3',
          title: 'Hypertension Management',
          description: 'Blood pressure monitoring and medication management',
          startDate: '2024-02-01',
          assignedToStaffId: 'staff-3',
          assignedToStaffName: 'Dr. Michael Chen',
          status: 'Active',
          priority: 'Medium',
          actions: ['Daily BP monitoring', 'Low sodium diet', 'Regular exercise'],
          progressNotes: ['BP well controlled', 'Patient following diet plan'],
          lastUpdated: '2024-03-08'
        }
      ];

      const mockAlerts: HealthAlert[] = [
        {
          id: 'alert-1',
          type: 'ImmunizationDue',
          title: 'Hepatitis B Vaccine Due',
          description: 'Second dose of Hepatitis B vaccine is due',
          severity: 'Medium',
          profileId: '2',
          profileName: 'Jane Smith',
          dueDate: '2024-05-15',
          createdAt: '2024-03-01',
          status: 'Active'
        },
        {
          id: 'alert-2',
          type: 'ScreeningDue',
          title: 'Annual Health Screening',
          description: 'Annual health screening is due',
          severity: 'Low',
          profileId: '1',
          profileName: 'John Doe',
          dueDate: '2024-09-15',
          createdAt: '2024-03-01',
          status: 'Active'
        },
        {
          id: 'alert-3',
          type: 'SevereAllergy',
          title: 'Severe Allergy Alert',
          description: 'Student has severe peanut allergy',
          severity: 'High',
          profileId: '1',
          profileName: 'John Doe',
          createdAt: '2024-01-15',
          status: 'Active'
        }
      ];

      const mockAnalytics: HealthAnalytics = {
        totalProfiles: 245,
        studentProfiles: 220,
        staffProfiles: 25,
        upcomingImmunizations: 18,
        overdueImmunizations: 5,
        upcomingScreenings: 45,
        chronicConditionCount: 12,
        allergyAlerts: 8,
        completedScreenings: 180,
        actionPlans: 15,
        bloodGroupDistribution: [
          { group: 'O+', count: 85 },
          { group: 'A+', count: 65 },
          { group: 'B+', count: 45 },
          { group: 'AB+', count: 25 },
          { group: 'O-', count: 15 },
          { group: 'A-', count: 10 }
        ],
        immunizationCoverage: [
          { vaccine: 'BCG', coverage: 95 },
          { vaccine: 'MMR', coverage: 88 },
          { vaccine: 'Hepatitis B', coverage: 82 },
          { vaccine: 'DTP', coverage: 90 },
          { vaccine: 'Polio', coverage: 92 }
        ],
        healthTrends: [
          { month: 'Jan', screenings: 35, immunizations: 28, alerts: 12 },
          { month: 'Feb', screenings: 42, immunizations: 31, alerts: 15 },
          { month: 'Mar', screenings: 38, immunizations: 25, alerts: 10 }
        ],
        commonConditions: [
          { condition: 'Asthma', count: 8 },
          { condition: 'Allergies', count: 15 },
          { condition: 'Vision Problems', count: 12 },
          { condition: 'Hypertension', count: 3 }
        ]
      };

      setProfiles(mockProfiles);
      setScreenings(mockScreenings);
      setImmunizations(mockImmunizations);
      setActionPlans(mockActionPlans);
      setAlerts(mockAlerts);
      setAnalytics(mockAnalytics);
    } catch (error) {
      console.error('Error loading health data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
      case 'Completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Due':
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Overdue':
      case 'Cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'Low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'High':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'Critical':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Health Management</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage health profiles, screenings, immunizations, and action plans</p>
      </div>

      {/* Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Profiles</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.totalProfiles}</p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-3">
                <HeartIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600 dark:text-green-400">{analytics.studentProfiles} students</span>
              <span className="text-gray-500 dark:text-gray-400 ml-2">•</span>
              <span className="text-blue-600 dark:text-blue-400 ml-2">{analytics.staffProfiles} staff</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Immunizations Due</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.upcomingImmunizations}</p>
              </div>
              <div className="bg-yellow-100 dark:bg-yellow-900 rounded-full p-3">
                <ShieldCheckIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-red-600 dark:text-red-400">{analytics.overdueImmunizations} overdue</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Health Alerts</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.allergyAlerts}</p>
              </div>
              <div className="bg-red-100 dark:bg-red-900 rounded-full p-3">
                <ExclamationTriangleIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-gray-500 dark:text-gray-400">Allergy & medical alerts</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Action Plans</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.actionPlans}</p>
              </div>
              <div className="bg-purple-100 dark:bg-purple-900 rounded-full p-3">
                <ClipboardDocumentListIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-gray-500 dark:text-gray-400">Active treatment plans</span>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'profiles', label: 'Profiles', icon: HeartIcon },
            { id: 'screenings', label: 'Screenings', icon: BeakerIcon },
            { id: 'immunizations', label: 'Immunizations', icon: ShieldCheckIcon },
            { id: 'action-plans', label: 'Action Plans', icon: ClipboardDocumentListIcon },
            { id: 'alerts', label: 'Alerts', icon: ExclamationTriangleIcon },
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
        {activeTab === 'profiles' && (
          <div>
            {/* Actions Bar */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search profiles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <select className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
                  <option value="all">All Types</option>
                  <option value="student">Students</option>
                  <option value="staff">Staff</option>
                </select>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Create Profile
                </button>
                <button className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <ArrowPathIcon className="w-4 h-4 mr-2" />
                  Refresh
                </button>
              </div>
            </div>

            {/* Profiles Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {profiles.filter(p => 
                (p.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                 p.staffName?.toLowerCase().includes(searchTerm.toLowerCase())) &&
                (filterStatus === 'all' || !filterStatus)
              ).map((profile) => (
                <motion.div
                  key={profile.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                          {profile.studentName || profile.staffName}
                        </h3>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <UserIcon className="w-4 h-4 mr-1" />
                          {profile.studentId ? 'Student' : 'Staff'}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                          {profile.bloodGroup}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Allergies</p>
                        <p className="text-sm text-gray-900 dark:text-white">{profile.allergies || 'None'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Chronic Conditions</p>
                        <p className="text-sm text-gray-900 dark:text-white">{profile.chronicConditions || 'None'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Emergency Contact</p>
                        <p className="text-sm text-gray-900 dark:text-white">{profile.emergencyContactName} ({profile.emergencyContactRelationship})</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{profile.emergencyContactPhone}</p>
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
                          <DocumentTextIcon className="w-4 h-4" />
                        </button>
                      </div>
                      <button className="px-3 py-1 text-sm bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        {alert.title}
                      </h3>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <UserIcon className="w-4 h-4 mr-1" />
                        {alert.profileName}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(alert.severity)}`}>
                        {alert.severity}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(alert.status)}`}>
                        {alert.status}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Description</p>
                    <p className="text-sm text-gray-900 dark:text-white">{alert.description}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Type</p>
                      <p className="font-medium text-gray-900 dark:text-white">{alert.type}</p>
                    </div>
                    {alert.dueDate && (
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Due Date</p>
                        <p className="font-medium text-gray-900 dark:text-white">{new Date(alert.dueDate).toLocaleDateString()}</p>
                      </div>
                    )}
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
                        <BellIcon className="w-4 h-4" />
                      </button>
                    </div>
                    <button className="px-3 py-1 text-sm bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors">
                      Manage Alert
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'analytics' && analytics && (
          <div className="space-y-6">
            {/* Blood Group Distribution */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Blood Group Distribution</h3>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                {analytics.bloodGroupDistribution.map((item, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                      {item.count}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{item.group}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Immunization Coverage */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Immunization Coverage</h3>
              <div className="space-y-3">
                {analytics.immunizationCoverage.map((vaccine, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{vaccine.vaccine}</span>
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${vaccine.coverage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">{vaccine.coverage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Common Conditions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Common Health Conditions</h3>
              <div className="space-y-3">
                {analytics.commonConditions.map((condition, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{condition.condition}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{condition.count} cases</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Health Trends */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Health Trends</h3>
              <div className="space-y-4">
                {analytics.healthTrends.map((trend, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{trend.month}</span>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <BeakerIcon className="w-4 h-4 text-blue-500 mr-1" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{trend.screenings} screenings</span>
                      </div>
                      <div className="flex items-center">
                        <ShieldCheckIcon className="w-4 h-4 text-green-500 mr-1" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{trend.immunizations} immunizations</span>
                      </div>
                      <div className="flex items-center">
                        <ExclamationTriangleIcon className="w-4 h-4 text-yellow-500 mr-1" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{trend.alerts} alerts</span>
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
