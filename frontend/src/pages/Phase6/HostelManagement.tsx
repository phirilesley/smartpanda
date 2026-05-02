import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  HomeIcon,
  UserGroupIcon,
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
  BuildingOfficeIcon,
  AcademicCapIcon,
  MapPinIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  WrenchScrewdriverIcon,
  PhoneIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';

interface Hostel {
  id: string;
  name: string;
  genderPolicy: 'Male' | 'Female' | 'Mixed' | 'Any';
  capacity: number;
  currentOccupancy: number;
  availableBeds: number;
  matronStaffId?: string;
  matronName?: string;
  isActive: boolean;
  address: string;
  phone: string;
  facilities: string[];
  rules: string[];
  createdAt: string;
}

interface Room {
  id: string;
  hostelId: string;
  hostelName: string;
  name: string;
  floorName: string;
  capacity: number;
  currentOccupancy: number;
  availableBeds: number;
  status: 'Available' | 'Full' | 'Maintenance';
  facilities: string[];
  bedPrice: number;
}

interface Bed {
  id: string;
  roomId: string;
  roomName: string;
  bedCode: string;
  status: 'Available' | 'Occupied' | 'Maintenance' | 'Reserved';
  bedType: 'Single' | 'Double' | 'Bunk';
  price: number;
  amenities: string[];
}

interface Allocation {
  id: string;
  studentId: string;
  studentName: string;
  studentNumber: string;
  bedId: string;
  bedCode: string;
  roomName: string;
  hostelName: string;
  startDate: string;
  endDate?: string;
  status: 'Active' | 'Inactive' | 'Transferred' | 'Ended';
  guardianContact: string;
  paymentStatus: 'Paid' | 'Pending' | 'Overdue';
  specialRequirements?: string;
  lastPaymentDate?: string;
}

interface Incident {
  id: string;
  hostelId: string;
  hostelName: string;
  studentId: string;
  studentName: string;
  studentNumber: string;
  reportedByStaffId: string;
  reportedByStaffName: string;
  occurredAt: string;
  category: 'Disciplinary' | 'Medical' | 'Maintenance' | 'Security' | 'Other';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  title: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  resolutionDate?: string;
  resolvedByStaffId?: string;
  resolvedByStaffName?: string;
  actions: string[];
}

interface HostelAnalytics {
  totalHostels: number;
  activeHostels: number;
  totalRooms: number;
  totalBeds: number;
  occupiedBeds: number;
  availableBeds: number;
  occupancyRate: number;
  totalIncidents: number;
  openIncidents: number;
  totalRevenue: number;
  pendingPayments: number;
  occupancyByGender: Array<{ gender: string; count: number }>;
  incidentsByCategory: Array<{ category: string; count: number }>;
  monthlyRevenue: Array<{ month: string; revenue: number; occupancy: number }>;
  popularHostels: Array<{ name: string; occupancy: number; revenue: number }>;
}

export const HostelManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'hostels' | 'rooms' | 'beds' | 'allocations' | 'incidents' | 'analytics'>('hostels');
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [beds, setBeds] = useState<Bed[]>([]);
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [analytics, setAnalytics] = useState<HostelAnalytics | null>(null);
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
      const mockHostels: Hostel[] = [
        {
          id: '1',
          name: 'Main Boys Hostel',
          genderPolicy: 'Male',
          capacity: 200,
          currentOccupancy: 185,
          availableBeds: 15,
          matronStaffId: 'staff-1',
          matronName: 'Mrs. Sarah Johnson',
          isActive: true,
          address: '123 School Road, City',
          phone: '+1234567890',
          facilities: ['WiFi', 'Laundry', 'Kitchen', 'Study Room', 'Gym'],
          rules: ['No visitors after 9 PM', 'Quiet hours 10 PM - 6 AM', 'No smoking', 'Keep rooms clean'],
          createdAt: '2023-01-15'
        },
        {
          id: '2',
          name: 'Girls Hostel A',
          genderPolicy: 'Female',
          capacity: 150,
          currentOccupancy: 142,
          availableBeds: 8,
          matronStaffId: 'staff-2',
          matronName: 'Ms. Emily Davis',
          isActive: true,
          address: '456 College Avenue, City',
          phone: '+0987654321',
          facilities: ['WiFi', 'Laundry', 'Kitchen', 'Study Room', 'Library'],
          rules: ['No visitors after 8 PM', 'Quiet hours 9 PM - 6 AM', 'No smoking', 'Keep rooms clean'],
          createdAt: '2023-01-20'
        },
        {
          id: '3',
          name: 'International Hostel',
          genderPolicy: 'Mixed',
          capacity: 100,
          currentOccupancy: 78,
          availableBeds: 22,
          matronStaffId: 'staff-3',
          matronName: 'Mr. Michael Chen',
          isActive: true,
          address: '789 International Blvd, City',
          phone: '+1122334455',
          facilities: ['WiFi', 'Laundry', 'Kitchen', 'Study Room', 'Gym', 'Game Room'],
          rules: ['24/7 security', 'International cuisine available', 'Multi-lingual staff'],
          createdAt: '2023-02-01'
        }
      ];

      const mockRooms: Room[] = [
        {
          id: 'room-1',
          hostelId: '1',
          hostelName: 'Main Boys Hostel',
          name: 'Room 101',
          floorName: 'Ground Floor',
          capacity: 4,
          currentOccupancy: 4,
          availableBeds: 0,
          status: 'Full',
          facilities: ['AC', 'Study Desk', 'Wardrobe', 'Balcony'],
          bedPrice: 500
        },
        {
          id: 'room-2',
          hostelId: '1',
          hostelName: 'Main Boys Hostel',
          name: 'Room 102',
          floorName: 'Ground Floor',
          capacity: 4,
          currentOccupancy: 3,
          availableBeds: 1,
          status: 'Available',
          facilities: ['AC', 'Study Desk', 'Wardrobe', 'Balcony'],
          bedPrice: 500
        },
        {
          id: 'room-3',
          hostelId: '2',
          hostelName: 'Girls Hostel A',
          name: 'Room 201',
          floorName: 'First Floor',
          capacity: 3,
          currentOccupancy: 2,
          availableBeds: 1,
          status: 'Available',
          facilities: ['AC', 'Study Desk', 'Wardrobe', 'Attached Bathroom'],
          bedPrice: 600
        }
      ];

      const mockBeds: Bed[] = [
        {
          id: 'bed-1',
          roomId: 'room-1',
          roomName: 'Room 101',
          bedCode: 'A101',
          status: 'Occupied',
          bedType: 'Single',
          price: 500,
          amenities: ['Mattress', 'Pillow', 'Blanket', 'Study Lamp']
        },
        {
          id: 'bed-2',
          roomId: 'room-2',
          roomName: 'Room 102',
          bedCode: 'A102',
          status: 'Available',
          bedType: 'Single',
          price: 500,
          amenities: ['Mattress', 'Pillow', 'Blanket', 'Study Lamp']
        },
        {
          id: 'bed-3',
          roomId: 'room-3',
          roomName: 'Room 201',
          bedCode: 'B201',
          status: 'Available',
          bedType: 'Single',
          price: 600,
          amenities: ['Mattress', 'Pillow', 'Blanket', 'Study Lamp', 'Bedside Table']
        }
      ];

      const mockAllocations: Allocation[] = [
        {
          id: 'alloc-1',
          studentId: 'stu-1',
          studentName: 'John Doe',
          studentNumber: 'STU001',
          bedId: 'bed-1',
          bedCode: 'A101',
          roomName: 'Room 101',
          hostelName: 'Main Boys Hostel',
          startDate: '2024-01-15',
          status: 'Active',
          guardianContact: '+1234567890',
          paymentStatus: 'Paid',
          lastPaymentDate: '2024-02-15'
        },
        {
          id: 'alloc-2',
          studentId: 'stu-2',
          studentName: 'Jane Smith',
          studentNumber: 'STU002',
          bedId: 'bed-3',
          bedCode: 'B201',
          roomName: 'Room 201',
          hostelName: 'Girls Hostel A',
          startDate: '2024-01-20',
          status: 'Active',
          guardianContact: '+0987654321',
          paymentStatus: 'Pending'
        }
      ];

      const mockIncidents: Incident[] = [
        {
          id: 'inc-1',
          hostelId: '1',
          hostelName: 'Main Boys Hostel',
          studentId: 'stu-3',
          studentName: 'Mike Wilson',
          studentNumber: 'STU003',
          reportedByStaffId: 'staff-1',
          reportedByStaffName: 'Mrs. Sarah Johnson',
          occurredAt: '2024-03-10T22:30:00Z',
          category: 'Disciplinary',
          severity: 'Medium',
          title: 'Noise Complaint',
          description: 'Student playing loud music after quiet hours',
          status: 'Resolved',
          resolutionDate: '2024-03-11T09:00:00Z',
          resolvedByStaffId: 'staff-1',
          resolvedByStaffName: 'Mrs. Sarah Johnson',
          actions: ['Warning issued', 'Music confiscated', 'Parents notified']
        },
        {
          id: 'inc-2',
          hostelId: '2',
          hostelName: 'Girls Hostel A',
          studentId: 'stu-4',
          studentName: 'Lisa Brown',
          studentNumber: 'STU004',
          reportedByStaffId: 'staff-2',
          reportedByStaffName: 'Ms. Emily Davis',
          occurredAt: '2024-03-14T15:45:00Z',
          category: 'Medical',
          severity: 'High',
          title: 'Medical Emergency',
          description: 'Student fainted in room, immediate medical attention required',
          status: 'In Progress',
          actions: ['Ambulance called', 'Parents notified', 'Student taken to hospital']
        }
      ];

      const mockAnalytics: HostelAnalytics = {
        totalHostels: 3,
        activeHostels: 3,
        totalRooms: 45,
        totalBeds: 180,
        occupiedBeds: 152,
        availableBeds: 28,
        occupancyRate: 84.4,
        totalIncidents: 25,
        openIncidents: 3,
        totalRevenue: 456000,
        pendingPayments: 12,
        occupancyByGender: [
          { gender: 'Male', count: 98 },
          { gender: 'Female', count: 54 },
          { gender: 'Mixed', count: 0 }
        ],
        incidentsByCategory: [
          { category: 'Disciplinary', count: 12 },
          { category: 'Medical', count: 6 },
          { category: 'Maintenance', count: 4 },
          { category: 'Security', count: 2 },
          { category: 'Other', count: 1 }
        ],
        monthlyRevenue: [
          { month: 'Jan', revenue: 120000, occupancy: 82.5 },
          { month: 'Feb', revenue: 135000, occupancy: 85.2 },
          { month: 'Mar', revenue: 142000, occupancy: 84.4 }
        ],
        popularHostels: [
          { name: 'Main Boys Hostel', occupancy: 92.5, revenue: 185000 },
          { name: 'Girls Hostel A', occupancy: 94.7, revenue: 156000 },
          { name: 'International Hostel', occupancy: 78.0, revenue: 115000 }
        ]
      };

      setHostels(mockHostels);
      setRooms(mockRooms);
      setBeds(mockBeds);
      setAllocations(mockAllocations);
      setIncidents(mockIncidents);
      setAnalytics(mockAnalytics);
    } catch (error) {
      console.error('Error loading hostel data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
      case 'Available':
      case 'Paid':
      case 'Resolved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Maintenance':
      case 'Pending':
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Inactive':
      case 'Full':
      case 'Occupied':
      case 'Overdue':
      case 'Closed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'Transferred':
      case 'Ended':
      case 'Reserved':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Hostel Management</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage hostels, rooms, bed allocations, and incidents</p>
      </div>

      {/* Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Occupancy Rate</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.occupancyRate}%</p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-3">
                <HomeIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600 dark:text-green-400">{analytics.occupiedBeds}/{analytics.totalBeds} occupied</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Available Beds</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.availableBeds}</p>
              </div>
              <div className="bg-green-100 dark:bg-green-900 rounded-full p-3">
                <HomeIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-gray-500 dark:text-gray-400">Across {analytics.totalHostels} hostels</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Open Incidents</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.openIncidents}</p>
              </div>
              <div className="bg-yellow-100 dark:bg-yellow-900 rounded-full p-3">
                <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-gray-500 dark:text-gray-400">{analytics.totalIncidents} total this month</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Payments</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.pendingPayments}</p>
              </div>
              <div className="bg-red-100 dark:bg-red-900 rounded-full p-3">
                <CurrencyDollarIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-gray-500 dark:text-gray-400">Require attention</span>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'hostels', label: 'Hostels', icon: HomeIcon },
            { id: 'rooms', label: 'Rooms', icon: BuildingOfficeIcon },
            { id: 'beds', label: 'Beds', icon: HomeIcon },
            { id: 'allocations', label: 'Allocations', icon: UserGroupIcon },
            { id: 'incidents', label: 'Incidents', icon: ShieldCheckIcon },
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
        {activeTab === 'hostels' && (
          <div>
            {/* Actions Bar */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search hostels..."
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
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Add Hostel
                </button>
                <button className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <ArrowPathIcon className="w-4 h-4 mr-2" />
                  Refresh
                </button>
              </div>
            </div>

            {/* Hostels Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {hostels.filter(h => 
                h.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
                (filterStatus === 'all' || (filterStatus === 'Active' && h.isActive) || (filterStatus === 'Inactive' && !h.isActive))
              ).map((hostel) => (
                <motion.div
                  key={hostel.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                          {hostel.name}
                        </h3>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <MapPinIcon className="w-4 h-4 mr-1" />
                          {hostel.address}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(hostel.isActive ? 'Active' : 'Inactive')}`}>
                          {hostel.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
                          {hostel.genderPolicy}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Capacity</span>
                        <span className="font-medium text-gray-900 dark:text-white">{hostel.capacity} beds</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Occupancy</span>
                        <span className="font-medium text-gray-900 dark:text-white">{hostel.currentOccupancy}/{hostel.capacity}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Available</span>
                        <span className="font-medium text-green-600 dark:text-green-400">{hostel.availableBeds} beds</span>
                      </div>
                      {hostel.matronName && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Matron</span>
                          <span className="font-medium text-gray-900 dark:text-white">{hostel.matronName}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Contact</span>
                        <span className="font-medium text-gray-900 dark:text-white">{hostel.phone}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Facilities</p>
                      <div className="flex flex-wrap gap-2">
                        {hostel.facilities.slice(0, 3).map((facility, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full"
                          >
                            {facility}
                          </span>
                        ))}
                        {hostel.facilities.length > 3 && (
                          <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
                            +{hostel.facilities.length - 3} more
                          </span>
                        )}
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
                          <UserCircleIcon className="w-4 h-4" />
                        </button>
                      </div>
                      <button className="px-3 py-1 text-sm bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors">
                        Manage Hostel
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'allocations' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Student Allocations</h2>
              <div className="flex items-center space-x-4">
                <select className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
                  <option value="">All Hostels</option>
                  {hostels.map((hostel) => (
                    <option key={hostel.id} value={hostel.id}>
                      {hostel.name}
                    </option>
                  ))}
                </select>
                <select className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
                  <option value="">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Transferred">Transferred</option>
                </select>
                <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                  New Allocation
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Allocation
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Period
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {allocations.map((allocation) => (
                    <tr key={allocation.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                            <UserIcon className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{allocation.studentName}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{allocation.studentNumber}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          <div>{allocation.hostelName}</div>
                          <div className="text-gray-500">{allocation.roomName} - {allocation.bedCode}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          <div>From: {new Date(allocation.startDate).toLocaleDateString()}</div>
                          {allocation.endDate && <div>To: {new Date(allocation.endDate).toLocaleDateString()}</div>}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(allocation.status)}`}>
                          {allocation.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(allocation.paymentStatus)}`}>
                          {allocation.paymentStatus}
                        </span>
                        {allocation.lastPaymentDate && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Last: {new Date(allocation.lastPaymentDate).toLocaleDateString()}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <PhoneIcon className="w-4 h-4 mr-1" />
                          {allocation.guardianContact}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 mr-3">
                          Edit
                        </button>
                        <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3">
                          Transfer
                        </button>
                        <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                          End
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'incidents' && (
          <div className="space-y-4">
            {incidents.map((incident) => (
              <motion.div
                key={incident.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        {incident.title}
                      </h3>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <HomeIcon className="w-4 h-4 mr-1" />
                        {incident.hostelName} • {new Date(incident.occurredAt).toLocaleString()}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(incident.status)}`}>
                        {incident.status}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(incident.severity)}`}>
                        {incident.severity}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Student</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {incident.studentName} ({incident.studentNumber})
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Category</p>
                      <p className="font-medium text-gray-900 dark:text-white">{incident.category}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Reported By</p>
                      <p className="font-medium text-gray-900 dark:text-white">{incident.reportedByStaffName}</p>
                    </div>
                    {incident.resolvedByStaffName && (
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Resolved By</p>
                        <p className="font-medium text-gray-900 dark:text-white">{incident.resolvedByStaffName}</p>
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Description</p>
                    <p className="text-sm text-gray-900 dark:text-white">{incident.description}</p>
                  </div>

                  {incident.actions.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Actions Taken</p>
                      <ul className="list-disc list-inside text-sm text-gray-900 dark:text-white space-y-1">
                        {incident.actions.map((action, index) => (
                          <li key={index}>{action}</li>
                        ))}
                      </ul>
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
                      Manage Incident
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'analytics' && analytics && (
          <div className="space-y-6">
            {/* Occupancy by Gender */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Occupancy by Gender</h3>
              <div className="grid grid-cols-3 gap-4">
                {analytics.occupancyByGender.map((item, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                      {item.count}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{item.gender}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Incidents by Category */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Incidents by Category</h3>
              <div className="space-y-3">
                {analytics.incidentsByCategory.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{item.category}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{item.count} incidents</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Monthly Revenue */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Monthly Revenue & Occupancy</h3>
              <div className="space-y-4">
                {analytics.monthlyRevenue.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{item.month}</span>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <CurrencyDollarIcon className="w-4 h-4 text-green-500 mr-1" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">${item.revenue.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center">
                        <HomeIcon className="w-4 h-4 text-blue-500 mr-1" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{item.occupancy}% occupancy</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular Hostels */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Popular Hostels</h3>
              <div className="space-y-3">
                {analytics.popularHostels.map((hostel, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <HomeIcon className="w-4 h-4 text-purple-500 mr-2" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{hostel.name}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <UserGroupIcon className="w-4 h-4 text-blue-500 mr-1" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{hostel.occupancy}%</span>
                      </div>
                      <div className="flex items-center">
                        <CurrencyDollarIcon className="w-4 h-4 text-green-500 mr-1" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">${hostel.revenue.toLocaleString()}</span>
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
