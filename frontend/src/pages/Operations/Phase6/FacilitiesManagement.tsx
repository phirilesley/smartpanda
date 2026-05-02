import React, { useState, useEffect } from 'react';
import {
  BuildingOfficeIcon,
  WrenchScrewdriverIcon,
  CalendarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  UserGroupIcon,
  ChartBarIcon,
  DocumentTextIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  BellIcon,
  Cog6ToothIcon,
  HomeIcon,
  AcademicCapIcon,
  SparklesIcon,
  FireIcon,
  BoltIcon,
  ShieldCheckIcon,
  CameraIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  CurrencyDollarIcon,
  TagIcon,
  ArchiveBoxIcon,
  TruckIcon,
  ClipboardDocumentListIcon,
  UserIcon,
  BuildingLibraryIcon,
  ComputerDesktopIcon,
  TvIcon,
  LightbulbIcon,
  FaucetIcon,
  PaintBrushIcon,
  HammerIcon,
  SawIcon,
  WrenchIcon,
  ArrowPathIcon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MinusIcon,
  EllipsisHorizontalIcon,
  EllipsisVerticalIcon,
  LockClosedIcon,
  KeyIcon,
  FingerprintIcon,
  ChipIcon,
  CloudIcon,
  DevicePhoneMobileIcon,
  DeviceTabletIcon,
  LaptopIcon,
  MonitorIcon,
} from '@heroicons/react/24/outline';

interface Facility {
  id: string;
  name: string;
  type: 'classroom' | 'laboratory' | 'library' | 'auditorium' | 'gymnasium' | 'cafeteria' | 'office' | 'storage' | 'outdoor' | 'other';
  building: string;
  floor: string;
  capacity: number;
  area: number;
  status: 'available' | 'occupied' | 'maintenance' | 'reserved' | 'closed';
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  equipment: string[];
  features: string[];
  accessibility: boolean;
  climateControl: boolean;
  lighting: string;
  ventilation: string;
  lastInspection: string;
  nextInspection: string;
  maintenanceSchedule: string;
  responsiblePerson: string;
  contactInfo: {
    phone: string;
    email: string;
  };
  costPerHour: number;
  bookingRequired: boolean;
  notes: string;
  images: string[];
  documents: string[];
  createdAt: string;
  updatedAt: string;
}

interface MaintenanceRequest {
  id: string;
  facilityId: string;
  facilityName: string;
  type: 'repair' | 'inspection' | 'cleaning' | 'upgrade' | 'emergency' | 'preventive';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  requestedBy: string;
  requestedByRole: 'admin' | 'staff' | 'faculty' | 'student';
  assignedTo?: string;
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled' | 'on_hold';
  estimatedCost?: number;
  actualCost?: number;
  estimatedDuration?: string;
  actualDuration?: string;
  scheduledDate?: string;
  completedDate?: string;
  materials: string[];
  tools: string[];
  images: {
    before: string[];
    after: string[];
  };
  workOrderNumber: string;
  vendorInfo?: {
    name: string;
    contact: string;
    license: string;
  };
  safetyPrecautions: string[];
  impact: 'none' | 'minor' | 'moderate' | 'major';
  followUpRequired: boolean;
  rating?: number;
  feedback?: string;
  createdAt: string;
  updatedAt: string;
}

interface Booking {
  id: string;
  facilityId: string;
  facilityName: string;
  bookedBy: string;
  bookedByRole: 'admin' | 'staff' | 'faculty' | 'student';
  purpose: string;
  startTime: string;
  endTime: string;
  recurring: boolean;
  recurringPattern?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    daysOfWeek?: number[];
    endDate?: string;
  };
  participants: number;
  equipment: string[];
  specialRequirements: string[];
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  approvedBy?: string;
  cost: number;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  notes: string;
  createdAt: string;
  updatedAt: string;
}

interface Inspection {
  id: string;
  facilityId: string;
  facilityName: string;
  type: 'routine' | 'safety' | 'fire' | 'health' | 'accessibility' | 'equipment' | 'structural';
  inspector: string;
  inspectorRole: 'internal' | 'external' | 'certified';
  scheduledDate: string;
  completedDate?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
  checklist: {
    category: string;
    items: {
      name: string;
      status: 'pass' | 'fail' | 'na';
      notes?: string;
      severity?: 'low' | 'medium' | 'high' | 'critical';
    }[];
  }[];
  overallScore?: number;
  findings: {
    category: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    recommendation: string;
    deadline?: string;
  }[];
  certificateIssued: boolean;
  certificateExpiry?: string;
  nextInspectionDate: string;
  images: string[];
  documents: string[];
  createdAt: string;
  updatedAt: string;
}

const FacilitiesManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'facilities' | 'maintenance' | 'bookings' | 'inspections' | 'reports'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Facility | MaintenanceRequest | Booking | Inspection | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(3);

  // Mock data
  const [facilities] = useState<Facility[]>([
    {
      id: '1',
      name: 'Computer Lab 101',
      type: 'laboratory',
      building: 'Technology Building',
      floor: '1st Floor',
      capacity: 30,
      area: 120,
      status: 'available',
      condition: 'excellent',
      equipment: ['Desktop Computers', 'Projector', 'Whiteboard', 'Printer'],
      features: ['Air Conditioning', 'WiFi', 'Smart Board'],
      accessibility: true,
      climateControl: true,
      lighting: 'LED',
      ventilation: 'HVAC',
      lastInspection: '2024-01-15',
      nextInspection: '2024-04-15',
      maintenanceSchedule: 'Monthly',
      responsiblePerson: 'John Smith',
      contactInfo: {
        phone: '555-0101',
        email: 'john.smith@school.edu'
      },
      costPerHour: 25,
      bookingRequired: true,
      notes: 'Advanced computing facility with specialized software',
      images: [],
      documents: [],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z'
    },
    {
      id: '2',
      name: 'Science Laboratory A',
      type: 'laboratory',
      building: 'Science Building',
      floor: '2nd Floor',
      capacity: 24,
      area: 150,
      status: 'maintenance',
      condition: 'good',
      equipment: ['Microscopes', 'Lab Benches', 'Safety Equipment', 'Fume Hood'],
      features: ['Gas Lines', 'Safety Shower', 'Chemical Storage'],
      accessibility: true,
      climateControl: true,
      lighting: 'Fluorescent',
      ventilation: 'Fume Hood',
      lastInspection: '2024-01-10',
      nextInspection: '2024-04-10',
      maintenanceSchedule: 'Weekly',
      responsiblePerson: 'Dr. Sarah Johnson',
      contactInfo: {
        phone: '555-0102',
        email: 'sarah.johnson@school.edu'
      },
      costPerHour: 35,
      bookingRequired: true,
      notes: 'Chemistry and biology experiments',
      images: [],
      documents: [],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-10T00:00:00Z'
    }
  ]);

  const [maintenanceRequests] = useState<MaintenanceRequest[]>([
    {
      id: '1',
      facilityId: '2',
      facilityName: 'Science Laboratory A',
      type: 'repair',
      priority: 'high',
      title: 'Fume Hood Malfunction',
      description: 'Fume hood not functioning properly, needs immediate attention',
      requestedBy: 'Dr. Sarah Johnson',
      requestedByRole: 'faculty',
      assignedTo: 'Mike Wilson',
      status: 'in_progress',
      estimatedCost: 500,
      actualCost: 0,
      estimatedDuration: '4 hours',
      actualDuration: '',
      scheduledDate: '2024-01-20',
      completedDate: '',
      materials: ['Filter Replacement', 'Duct Tape', 'Screws'],
      tools: ['Screwdriver Set', 'Wrench', 'Multimeter'],
      images: {
        before: [],
        after: []
      },
      workOrderNumber: 'WO-2024-001',
      vendorInfo: {
        name: 'ABC Lab Equipment',
        contact: '555-0201',
        license: 'LAB-12345'
      },
      safetyPrecautions: ['Wear protective gear', 'Ensure proper ventilation', 'Turn off power'],
      impact: 'moderate',
      followUpRequired: true,
      rating: 0,
      feedback: '',
      createdAt: '2024-01-18T00:00:00Z',
      updatedAt: '2024-01-19T00:00:00Z'
    }
  ]);

  const [bookings] = useState<Booking[]>([
    {
      id: '1',
      facilityId: '1',
      facilityName: 'Computer Lab 101',
      bookedBy: 'Prof. Michael Chen',
      bookedByRole: 'faculty',
      purpose: 'Programming Workshop',
      startTime: '2024-01-25T09:00:00Z',
      endTime: '2024-01-25T12:00:00Z',
      recurring: false,
      participants: 25,
      equipment: ['Projector', 'Speaker System'],
      specialRequirements: ['Software installation'],
      status: 'confirmed',
      approvedBy: 'John Smith',
      cost: 75,
      paymentStatus: 'paid',
      notes: 'Workshop on advanced programming concepts',
      createdAt: '2024-01-15T00:00:00Z',
      updatedAt: '2024-01-16T00:00:00Z'
    }
  ]);

  const [inspections] = useState<Inspection[]>([
    {
      id: '1',
      facilityId: '1',
      facilityName: 'Computer Lab 101',
      type: 'safety',
      inspector: 'Fire Marshal Office',
      inspectorRole: 'external',
      scheduledDate: '2024-02-01',
      completedDate: '',
      status: 'scheduled',
      checklist: [
        {
          category: 'Fire Safety',
          items: [
            { name: 'Fire Extinguishers', status: 'pass' as const, notes: 'All extinguishers inspected and tagged' },
            { name: 'Emergency Exits', status: 'pass' as const, notes: 'Clear and accessible' },
            { name: 'Smoke Detectors', status: 'pass' as const, notes: 'Tested and functional' }
          ]
        }
      ],
      overallScore: 0,
      findings: [],
      certificateIssued: false,
      certificateExpiry: '',
      nextInspectionDate: '2024-08-01',
      images: [],
      documents: [],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }
  ]);

  const stats = {
    totalFacilities: facilities.length,
    availableFacilities: facilities.filter(f => f.status === 'available').length,
    maintenanceRequests: maintenanceRequests.filter(m => m.status !== 'completed').length,
    pendingBookings: bookings.filter(b => b.status === 'pending').length,
    scheduledInspections: inspections.filter(i => i.status === 'scheduled').length,
    averageCondition: facilities.reduce((acc, f) => {
      const conditionScore = f.condition === 'excellent' ? 4 : f.condition === 'good' ? 3 : f.condition === 'fair' ? 2 : 1;
      return acc + conditionScore;
    }, 0) / facilities.length
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
      case 'completed':
      case 'confirmed':
      case 'pass':
        return 'text-green-600 bg-green-100';
      case 'occupied':
      case 'in_progress':
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'maintenance':
      case 'cancelled':
      case 'failed':
        return 'text-red-600 bg-red-100';
      case 'reserved':
      case 'scheduled':
        return 'text-blue-600 bg-blue-100';
      case 'closed':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'text-red-600 bg-red-100';
      case 'high':
        return 'text-orange-600 bg-orange-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'excellent':
        return 'text-green-600 bg-green-100';
      case 'good':
        return 'text-blue-600 bg-blue-100';
      case 'fair':
        return 'text-yellow-600 bg-yellow-100';
      case 'poor':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getFacilityIcon = (type: string) => {
    switch (type) {
      case 'classroom':
        return <AcademicCapIcon className="h-5 w-5" />;
      case 'laboratory':
        return <SparklesIcon className="h-5 w-5" />;
      case 'library':
        return <BuildingLibraryIcon className="h-5 w-5" />;
      case 'auditorium':
        return <TvIcon className="h-5 w-5" />;
      case 'gymnasium':
        return <SparklesIcon className="h-5 w-5" />;
      case 'cafeteria':
        return <SparklesIcon className="h-5 w-5" />;
      case 'office':
        return <BuildingOfficeIcon className="h-5 w-5" />;
      default:
        return <HomeIcon className="h-5 w-5" />;
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Facilities</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalFacilities}</p>
            </div>
            <BuildingOfficeIcon className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Available Now</p>
              <p className="text-2xl font-bold text-green-600">{stats.availableFacilities}</p>
            </div>
            <CheckCircleIcon className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Maintenance Requests</p>
              <p className="text-2xl font-bold text-orange-600">{stats.maintenanceRequests}</p>
            </div>
            <WrenchScrewdriverIcon className="h-8 w-8 text-orange-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Bookings</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pendingBookings}</p>
            </div>
            <CalendarIcon className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Scheduled Inspections</p>
              <p className="text-2xl font-bold text-blue-600">{stats.scheduledInspections}</p>
            </div>
            <ShieldCheckIcon className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Average Condition</p>
              <p className="text-2xl font-bold text-gray-900">{stats.averageCondition.toFixed(1)}/4.0</p>
            </div>
            <ChartBarIcon className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Activities</h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-5 w-5 text-orange-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">High priority maintenance request for Science Laboratory A</p>
              <p className="text-xs text-gray-500">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <CalendarIcon className="h-5 w-5 text-blue-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">Computer Lab 101 booked for Programming Workshop</p>
              <p className="text-xs text-gray-500">5 hours ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <ShieldCheckIcon className="h-5 w-5 text-green-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">Safety inspection scheduled for Computer Lab 101</p>
              <p className="text-xs text-gray-500">1 day ago</p>
            </div>
          </div>
        </div>
      </div>

      {/* Facilities Status Chart */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Facilities Status Overview</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {Object.entries(
              facilities.reduce((acc, facility) => {
                acc[facility.status] = (acc[facility.status] || 0) + 1;
                return acc;
              }, {} as Record<string, number>)
            ).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(status).split(' ')[1]}`}></div>
                  <span className="text-sm text-gray-900 capitalize">{status}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderFacilities = () => (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search facilities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <select
              className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
            >
              <option value="all">All Facilities</option>
              <option value="classroom">Classrooms</option>
              <option value="laboratory">Laboratories</option>
              <option value="library">Libraries</option>
              <option value="auditorium">Auditoriums</option>
              <option value="gymnasium">Gymnasiums</option>
              <option value="cafeteria">Cafeterias</option>
              <option value="office">Offices</option>
            </select>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Facility
            </button>
          </div>
        </div>
      </div>

      {/* Facilities List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="min-w-full divide-y divide-gray-200">
          <div className="bg-gray-50 px-6 py-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">All Facilities</h3>
              <span className="text-sm text-gray-500">{facilities.length} facilities</span>
            </div>
          </div>
          <div className="bg-white divide-y divide-gray-200">
            {facilities.map((facility) => (
              <div key={facility.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        {getFacilityIcon(facility.type)}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-lg font-medium text-gray-900">{facility.name}</h4>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(facility.status)}`}>
                          {facility.status}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getConditionColor(facility.condition)}`}>
                          {facility.condition}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-gray-500">{facility.building} - {facility.floor}</span>
                        <span className="text-sm text-gray-500">Capacity: {facility.capacity}</span>
                        <span className="text-sm text-gray-500">{facility.area} sq ft</span>
                        {facility.accessibility && (
                          <span className="inline-flex items-center text-sm text-green-600">
                            <SparklesIcon className="h-4 w-4 mr-1" />
                            Accessible
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setSelectedItem(facility);
                        setShowDetailsModal(true);
                      }}
                      className="p-2 text-gray-400 hover:text-gray-600"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600">
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderMaintenance = () => (
    <div className="space-y-6">
      {/* Maintenance Requests */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Maintenance Requests</h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              New Request
            </button>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {maintenanceRequests.map((request) => (
            <div key={request.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-lg font-medium text-gray-900">{request.title}</h4>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}>
                      {request.priority}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{request.facilityName}</p>
                  <p className="text-sm text-gray-500 mt-1">{request.description}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-sm text-gray-500">Requested by: {request.requestedBy}</span>
                    {request.assignedTo && (
                      <span className="text-sm text-gray-500">Assigned to: {request.assignedTo}</span>
                    )}
                    {request.estimatedCost && (
                      <span className="text-sm text-gray-500">Est. Cost: ${request.estimatedCost}</span>
                    )}
                    <span className="text-sm text-gray-500">WO#: {request.workOrderNumber}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedItem(request);
                      setShowDetailsModal(true);
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <EyeIcon className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <PencilIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderBookings = () => (
    <div className="space-y-6">
      {/* Bookings List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Facility Bookings</h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              New Booking
            </button>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {bookings.map((booking) => (
            <div key={booking.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-lg font-medium text-gray-900">{booking.facilityName}</h4>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{booking.purpose}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-sm text-gray-500">Booked by: {booking.bookedBy}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(booking.startTime).toLocaleDateString()} {new Date(booking.startTime).toLocaleTimeString()} - {new Date(booking.endTime).toLocaleTimeString()}
                    </span>
                    <span className="text-sm text-gray-500">Participants: {booking.participants}</span>
                    <span className="text-sm text-gray-500">Cost: ${booking.cost}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedItem(booking);
                      setShowDetailsModal(true);
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <EyeIcon className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <PencilIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderInspections = () => (
    <div className="space-y-6">
      {/* Inspections List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Inspections</h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Schedule Inspection
            </button>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {inspections.map((inspection) => (
            <div key={inspection.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-lg font-medium text-gray-900">{inspection.facilityName}</h4>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(inspection.status)}`}>
                      {inspection.status}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {inspection.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Inspector: {inspection.inspector}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-sm text-gray-500">Scheduled: {new Date(inspection.scheduledDate).toLocaleDateString()}</span>
                    {inspection.completedDate && (
                      <span className="text-sm text-gray-500">Completed: {new Date(inspection.completedDate).toLocaleDateString()}</span>
                    )}
                    <span className="text-sm text-gray-500">Next: {new Date(inspection.nextInspectionDate).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedItem(inspection);
                      setShowDetailsModal(true);
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <EyeIcon className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <PencilIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      {/* Report Generation */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Generate Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
            <DocumentTextIcon className="h-8 w-8 text-blue-500 mb-2" />
            <h4 className="font-medium text-gray-900">Facility Inventory</h4>
            <p className="text-sm text-gray-500">Complete list of all facilities</p>
          </button>
          <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
            <ChartBarIcon className="h-8 w-8 text-green-500 mb-2" />
            <h4 className="font-medium text-gray-900">Utilization Report</h4>
            <p className="text-sm text-gray-500">Facility usage statistics</p>
          </button>
          <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
            <WrenchScrewdriverIcon className="h-8 w-8 text-orange-500 mb-2" />
            <h4 className="font-medium text-gray-900">Maintenance Summary</h4>
            <p className="text-sm text-gray-500">Maintenance requests and costs</p>
          </button>
          <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
            <ShieldCheckIcon className="h-8 w-8 text-purple-500 mb-2" />
            <h4 className="font-medium text-gray-900">Inspection Report</h4>
            <p className="text-sm text-gray-500">Safety and compliance status</p>
          </button>
          <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
            <CurrencyDollarIcon className="h-8 w-8 text-yellow-500 mb-2" />
            <h4 className="font-medium text-gray-900">Cost Analysis</h4>
            <p className="text-sm text-gray-500">Financial overview of facilities</p>
          </button>
          <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
            <CalendarIcon className="h-8 w-8 text-red-500 mb-2" />
            <h4 className="font-medium text-gray-900">Booking Report</h4>
            <p className="text-sm text-gray-500">Reservation and revenue data</p>
          </button>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Reports</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Q4 2023 Facility Utilization Report</p>
                  <p className="text-xs text-gray-500">Generated on January 15, 2024</p>
                </div>
              </div>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                <ArrowDownTrayIcon className="h-4 w-4" />
              </button>
            </div>
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Annual Maintenance Summary 2023</p>
                  <p className="text-xs text-gray-500">Generated on January 1, 2024</p>
                </div>
              </div>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                <ArrowDownTrayIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <BuildingOfficeIcon className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">Facilities Management</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-400 hover:text-gray-600"
              >
                <BellIcon className="h-6 w-6" />
                {notifications > 0 && (
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400"></span>
                )}
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Cog6ToothIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8" aria-label="Tabs">
            {[
              { id: 'overview', name: 'Overview', icon: ChartBarIcon },
              { id: 'facilities', name: 'Facilities', icon: BuildingOfficeIcon },
              { id: 'maintenance', name: 'Maintenance', icon: WrenchScrewdriverIcon },
              { id: 'bookings', name: 'Bookings', icon: CalendarIcon },
              { id: 'inspections', name: 'Inspections', icon: ShieldCheckIcon },
              { id: 'reports', name: 'Reports', icon: DocumentTextIcon }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'facilities' && renderFacilities()}
        {activeTab === 'maintenance' && renderMaintenance()}
        {activeTab === 'bookings' && renderBookings()}
        {activeTab === 'inspections' && renderInspections()}
        {activeTab === 'reports' && renderReports()}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedItem && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {selectedItem.name || selectedItem.title || selectedItem.facilityName}
              </h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="mt-4">
              <pre className="text-sm text-gray-600 whitespace-pre-wrap">
                {JSON.stringify(selectedItem, null, 2)}
              </pre>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacilitiesManagement;
