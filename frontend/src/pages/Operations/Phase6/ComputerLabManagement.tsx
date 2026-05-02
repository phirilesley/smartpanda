import React, { useState, useEffect } from 'react';
import {
  ComputerDesktopIcon,
  WrenchScrewdriverIcon,
  CalendarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
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
  UserGroupIcon,
  AcademicCapIcon,
  SparklesIcon,
  ShieldCheckIcon,
  CameraIcon,
  QrCodeIcon,
  UserIcon,
  BuildingOfficeIcon,
  DevicePhoneMobileIcon,
  DeviceTabletIcon,
  LaptopIcon,
  MonitorIcon,
  PrinterIcon,
  ServerIcon,
  WifiIcon,
  BatteryIcon,
  ChipIcon,
  CpuChipIcon,
  HardDriveIcon,
  MemoryStickIcon,
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
  CloudIcon,
} from '@heroicons/react/24/outline';

interface ComputerLab {
  id: string;
  labName: string;
  labCode: string;
  location: {
    building: string;
    floor: string;
    room: string;
  };
  capacity: {
    students: number;
    computers: number;
    staff: number;
  };
  equipment: {
    computers: {
      id: string;
      name: string;
      type: 'desktop' | 'laptop' | 'thin_client';
      specifications: {
        cpu: string;
        ram: string;
        storage: string;
        graphics: string;
        os: string;
      };
      status: 'available' | 'in_use' | 'maintenance' | 'offline';
      condition: 'excellent' | 'good' | 'fair' | 'poor';
      lastMaintenance: string;
      nextMaintenance: string;
      assignedTo?: string;
      software: string[];
      peripherals: string[];
    }[];
    peripherals: {
      type: 'printer' | 'scanner' | 'projector' | 'smart_board' | 'whiteboard' | 'router' | 'switch';
      brand: string;
      model: string;
      status: 'available' | 'in_use' | 'maintenance' | 'offline';
      condition: 'excellent' | 'good' | 'fair' | 'poor';
      lastMaintenance: string;
      nextMaintenance: string;
    }[];
    furniture: {
      type: 'desk' | 'chair' | 'table' | 'cabinet' | 'shelf';
      quantity: number;
      condition: 'excellent' | 'good' | 'fair' | 'poor';
    }[];
  };
  network: {
    internet: {
      provider: string;
      speed: string;
      type: 'fiber' | 'dsl' | 'wireless';
      status: 'active' | 'inactive' | 'limited';
    };
    local: {
      topology: string;
      switches: number;
      accessPoints: number;
      servers: number;
    };
    security: {
      firewall: boolean;
      antivirus: boolean;
      contentFilter: boolean;
      accessControl: boolean;
    };
  };
  software: {
    operatingSystems: {
      name: string;
      version: string;
      licenses: number;
      installed: number;
    }[];
    applications: {
      name: string;
      category: string;
      version: string;
      licenses: number;
      installed: number;
      type: 'educational' | 'productivity' | 'development' | 'design' | 'other';
    }[];
    customSoftware: {
      name: string;
      description: string;
      version: string;
      developer: string;
      license: string;
    }[];
  };
  schedule: {
    bookings: {
      id: string;
      subject: string;
      teacher: string;
      class: string;
      startTime: string;
      endTime: string;
      recurring: boolean;
      recurringPattern?: string;
      status: 'confirmed' | 'pending' | 'cancelled';
      softwareRequired: string[];
      equipmentRequired: string[];
    }[];
    availability: {
      day: string;
      startTime: string;
      endTime: string;
      available: boolean;
    }[];
  };
  staff: {
    labTechnician: {
      name: string;
      email: string;
      phone: string;
      qualifications: string[];
      certifications: string[];
    };
    assistants: {
      name: string;
      email: string;
      phone: string;
      role: string;
    }[];
  };
  policies: {
    usage: string[];
    safety: string[];
    security: string[];
    maintenance: string[];
  };
  status: 'active' | 'maintenance' | 'closed' | 'renovation';
  createdAt: string;
  updatedAt: string;
}

interface MaintenanceRequest {
  id: string;
  labId: string;
  labName: string;
  equipmentId?: string;
  equipmentName?: string;
  type: 'hardware' | 'software' | 'network' | 'peripheral' | 'furniture';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  requestedBy: string;
  requestDate: string;
  assignedTo?: string;
  estimatedCost?: number;
  actualCost?: number;
  estimatedDuration?: string;
  actualDuration?: string;
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled' | 'on_hold';
  completionDate?: string;
  parts: string[];
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
  rating?: number;
  feedback?: string;
  createdAt: string;
  updatedAt: string;
}

interface SoftwareLicense {
  id: string;
  name: string;
  category: string;
  vendor: string;
  version: string;
  type: 'perpetual' | 'subscription' | 'freemium' | 'open_source';
  totalLicenses: number;
  usedLicenses: number;
  availableLicenses: number;
  cost: number;
  renewalDate?: string;
  expiryDate?: string;
  installations: {
    labId: string;
    labName: string;
    computerId: string;
    computerName: string;
    installedDate: string;
    lastUsed: string;
  }[];
  status: 'active' | 'expiring' | 'expired' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface LabSession {
  id: string;
  labId: string;
  labName: string;
  subject: string;
  teacher: string;
  class: string;
  startTime: string;
  endTime: string;
  duration: number;
  studentsPresent: number;
  studentsAbsent: number;
  activities: {
    name: string;
    duration: number;
    software: string[];
    resources: string[];
  }[];
  issues: {
    type: string;
    description: string;
    resolved: boolean;
    resolution?: string;
  }[];
  attendance: {
    studentId: string;
    studentName: string;
    present: boolean;
    loginTime?: string;
    logoutTime?: string;
    computerUsed?: string;
  }[];
  resources: {
    software: string[];
    hardware: string[];
    materials: string[];
  };
  notes: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

const ComputerLabManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'labs' | 'equipment' | 'maintenance' | 'software' | 'schedule' | 'reports'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ComputerLab | MaintenanceRequest | SoftwareLicense | LabSession | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(3);

  // Mock data
  const [labs] = useState<ComputerLab[]>([
    {
      id: '1',
      labName: 'Main Computer Lab',
      labCode: 'LAB-001',
      location: {
        building: 'Technology Building',
        floor: '1st Floor',
        room: '101'
      },
      capacity: {
        students: 30,
        computers: 30,
        staff: 2
      },
      equipment: {
        computers: [
          {
            id: 'PC-001',
            name: 'Desktop PC 1',
            type: 'desktop',
            specifications: {
              cpu: 'Intel Core i5-10400',
              ram: '8GB DDR4',
              storage: '256GB SSD',
              graphics: 'Intel UHD 630',
              os: 'Windows 11 Pro'
            },
            status: 'available',
            condition: 'good',
            lastMaintenance: '2023-12-15',
            nextMaintenance: '2024-03-15',
            assignedTo: 'Student 1',
            software: ['Microsoft Office', 'Visual Studio Code', 'Chrome'],
            peripherals: ['Monitor', 'Keyboard', 'Mouse', 'Headphones']
          }
        ],
        peripherals: [
          {
            type: 'printer',
            brand: 'HP',
            model: 'LaserJet Pro',
            status: 'available',
            condition: 'good',
            lastMaintenance: '2023-12-01',
            nextMaintenance: '2024-03-01'
          }
        ],
        furniture: [
          {
            type: 'desk',
            quantity: 30,
            condition: 'good'
          }
        ]
      },
      network: {
        internet: {
          provider: 'TelOne',
          speed: '100 Mbps',
          type: 'fiber',
          status: 'active'
        },
        local: {
          topology: 'Star',
          switches: 2,
          accessPoints: 3,
          servers: 1
        },
        security: {
          firewall: true,
          antivirus: true,
          contentFilter: true,
          accessControl: true
        }
      },
      software: {
        operatingSystems: [
          {
            name: 'Windows 11 Pro',
            version: '22H2',
            licenses: 30,
            installed: 30
          }
        ],
        applications: [
          {
            name: 'Microsoft Office 365',
            category: 'Productivity',
            version: '2021',
            licenses: 30,
            installed: 30,
            type: 'productivity'
          }
        ],
        customSoftware: [
          {
            name: 'School Management System',
            description: 'Custom school management software',
            version: '2.1',
            developer: 'IT Department',
            license: 'Proprietary'
          }
        ]
      },
      schedule: {
        bookings: [
          {
            id: '1',
            subject: 'Computer Science',
            teacher: 'John Smith',
            class: 'Form 4A',
            startTime: '09:00',
            endTime: '10:30',
            recurring: true,
            recurringPattern: 'Monday, Wednesday, Friday',
            status: 'confirmed',
            softwareRequired: ['Visual Studio Code', 'Python'],
            equipmentRequired: ['Projector']
          }
        ],
        availability: [
          {
            day: 'Monday',
            startTime: '08:00',
            endTime: '17:00',
            available: true
          }
        ]
      },
      staff: {
        labTechnician: {
          name: 'Mike Wilson',
          email: 'mike.wilson@school.edu',
          phone: '+263 123 456 001',
          qualifications: ['BSc Computer Science', 'Diploma in IT Support'],
          certifications: ['CompTIA A+', 'Network+']
        },
        assistants: [
          {
            name: 'Sarah Johnson',
            email: 'sarah.johnson@school.edu',
            phone: '+263 123 456 002',
            role: 'Lab Assistant'
          }
        ]
      },
      policies: {
        usage: ['No food or drinks', 'Respect equipment', 'Follow internet usage policy'],
        safety: ['Emergency exits clearly marked', 'Fire extinguishers available'],
        security: ['Login required', 'No external devices without permission'],
        maintenance: ['Regular cleaning', 'Weekly virus scans']
      },
      status: 'active',
      createdAt: '2023-01-15T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z'
    }
  ]);

  const [maintenanceRequests] = useState<MaintenanceRequest[]>([
    {
      id: '1',
      labId: '1',
      labName: 'Main Computer Lab',
      equipmentId: 'PC-005',
      equipmentName: 'Desktop PC 5',
      type: 'hardware',
      priority: 'medium',
      title: 'Computer not booting',
      description: 'PC-005 fails to boot, shows blue screen',
      requestedBy: 'John Smith',
      requestDate: '2024-01-20',
      assignedTo: 'Mike Wilson',
      estimatedCost: 150,
      status: 'assigned',
      parts: ['Power Supply', 'RAM'],
      tools: ['Screwdriver Set', 'Multimeter'],
      images: {
        before: [],
        after: []
      },
      workOrderNumber: 'WO-2024-001',
      createdAt: '2024-01-20T00:00:00Z',
      updatedAt: '2024-01-21T00:00:00Z'
    }
  ]);

  const [softwareLicenses] = useState<SoftwareLicense[]>([
    {
      id: '1',
      name: 'Microsoft Office 365',
      category: 'Productivity',
      vendor: 'Microsoft',
      version: '2021',
      type: 'subscription',
      totalLicenses: 30,
      usedLicenses: 28,
      availableLicenses: 2,
      cost: 1200,
      renewalDate: '2024-12-31',
      installations: [
        {
          labId: '1',
          labName: 'Main Computer Lab',
          computerId: 'PC-001',
          computerName: 'Desktop PC 1',
          installedDate: '2023-01-15',
          lastUsed: '2024-01-20'
        }
      ],
      status: 'active',
      createdAt: '2023-01-15T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z'
    }
  ]);

  const [labSessions] = useState<LabSession[]>([
    {
      id: '1',
      labId: '1',
      labName: 'Main Computer Lab',
      subject: 'Computer Science',
      teacher: 'John Smith',
      class: 'Form 4A',
      startTime: '2024-01-25T09:00:00Z',
      endTime: '2024-01-25T10:30:00Z',
      duration: 90,
      studentsPresent: 28,
      studentsAbsent: 2,
      activities: [
        {
          name: 'Python Programming',
          duration: 60,
          software: ['Python IDE', 'Visual Studio Code'],
          resources: ['Programming exercises']
        }
      ],
      issues: [
        {
          type: 'Software',
          description: 'Python IDE crashed on PC-015',
          resolved: true,
          resolution: 'Reinstalled Python IDE'
        }
      ],
      attendance: [
        {
          studentId: 'STU-001',
          studentName: 'Alice Johnson',
          present: true,
          loginTime: '09:00',
          logoutTime: '10:30',
          computerUsed: 'PC-001'
        }
      ],
      resources: {
        software: ['Python', 'Visual Studio Code'],
        hardware: ['Projector'],
        materials: ['Exercise sheets']
      },
      notes: 'Good session, students engaged',
      status: 'completed',
      createdAt: '2024-01-25T00:00:00Z',
      updatedAt: '2024-01-25T00:00:00Z'
    }
  ]);

  const stats = {
    totalLabs: labs.length,
    activeLabs: labs.filter(l => l.status === 'active').length,
    totalComputers: labs.reduce((acc, lab) => acc + lab.equipment.computers.length, 0),
    availableComputers: labs.reduce((acc, lab) => 
      acc + lab.equipment.computers.filter(c => c.status === 'available').length, 0),
    maintenanceRequests: maintenanceRequests.filter(m => m.status !== 'completed').length,
    softwareLicenses: softwareLicenses.length
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'available':
      case 'completed':
      case 'confirmed':
        return 'text-green-600 bg-green-100';
      case 'in_use':
      case 'in_progress':
      case 'pending':
      case 'assigned':
        return 'text-yellow-600 bg-yellow-100';
      case 'maintenance':
      case 'offline':
      case 'cancelled':
      case 'on_hold':
        return 'text-orange-600 bg-orange-100';
      case 'closed':
      case 'expired':
      case 'failed':
        return 'text-red-600 bg-red-100';
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
        return 'text-orange-600 bg-orange-100';
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

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Labs</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalLabs}</p>
            </div>
            <BuildingOfficeIcon className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Labs</p>
              <p className="text-2xl font-bold text-green-600">{stats.activeLabs}</p>
            </div>
            <CheckCircleIcon className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Computers</p>
              <p className="text-2xl font-bold text-blue-600">{stats.totalComputers}</p>
            </div>
            <ComputerDesktopIcon className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Available Computers</p>
              <p className="text-2xl font-bold text-green-600">{stats.availableComputers}</p>
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
              <p className="text-sm text-gray-600">Software Licenses</p>
              <p className="text-2xl font-bold text-purple-600">{stats.softwareLicenses}</p>
            </div>
            <SparklesIcon className="h-8 w-8 text-purple-500" />
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
              <WrenchScrewdriverIcon className="h-5 w-5 text-orange-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">Maintenance request: PC-005 not booting</p>
              <p className="text-xs text-gray-500">2 days ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <CalendarIcon className="h-5 w-5 text-blue-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">Computer Science session completed in Main Lab</p>
              <p className="text-xs text-gray-500">3 days ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <ShieldCheckIcon className="h-5 w-5 text-green-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">Software license renewal: Microsoft Office 365</p>
              <p className="text-xs text-gray-500">1 week ago</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lab Status Overview */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Lab Status Overview</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {labs.map((lab) => (
              <div key={lab.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <BuildingOfficeIcon className="h-5 w-5 text-blue-500" />
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{lab.labName}</h4>
                    <p className="text-xs text-gray-500">{lab.location.building} - {lab.location.room}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">
                    {lab.equipment.computers.filter(c => c.status === 'available').length}/{lab.equipment.computers.length} PCs
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(lab.status)}`}>
                    {lab.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderLabs = () => (
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
                placeholder="Search labs..."
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
              <option value="all">All Labs</option>
              <option value="active">Active</option>
              <option value="maintenance">Maintenance</option>
              <option value="closed">Closed</option>
            </select>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Lab
            </button>
          </div>
        </div>
      </div>

      {/* Labs List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="min-w-full divide-y divide-gray-200">
          <div className="bg-gray-50 px-6 py-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">All Labs</h3>
              <span className="text-sm text-gray-500">{labs.length} labs</span>
            </div>
          </div>
          <div className="bg-white divide-y divide-gray-200">
            {labs.map((lab) => (
              <div key={lab.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <BuildingOfficeIcon className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-lg font-medium text-gray-900">{lab.labName}</h4>
                        <span className="text-sm text-gray-500">{lab.labCode}</span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(lab.status)}`}>
                          {lab.status}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-gray-500">{lab.location.building} - {lab.location.room}</span>
                        <span className="text-sm text-gray-500">Capacity: {lab.capacity.students} students</span>
                        <span className="text-sm text-gray-500">
                          {lab.equipment.computers.filter(c => c.status === 'available').length}/{lab.equipment.computers.length} PCs available
                        </span>
                        <span className="text-sm text-gray-500">Technician: {lab.staff.labTechnician.name}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setSelectedItem(lab);
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

  const renderEquipment = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Equipment Management</h3>
        <p className="text-gray-600">Computer equipment, peripherals, and furniture management coming soon...</p>
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
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                      {request.status.replace('_', ' ')}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}>
                      {request.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{request.labName}</p>
                  <p className="text-sm text-gray-500 mt-1">{request.description}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-sm text-gray-500">Equipment: {request.equipmentName}</span>
                    <span className="text-sm text-gray-500">Type: {request.type}</span>
                    <span className="text-sm text-gray-500">WO#: {request.workOrderNumber}</span>
                    {request.estimatedCost && (
                      <span className="text-sm text-gray-500">Est. Cost: ${request.estimatedCost}</span>
                    )}
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

  const renderSoftware = () => (
    <div className="space-y-6">
      {/* Software Licenses */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Software Licenses</h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add License
            </button>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {softwareLicenses.map((license) => (
            <div key={license.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-lg font-medium text-gray-900">{license.name}</h4>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(license.status)}`}>
                      {license.status}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {license.type.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{license.vendor} - {license.version}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-sm text-gray-500">
                      {license.usedLicenses}/{license.totalLicenses} licenses used
                    </span>
                    <span className="text-sm text-gray-500">Category: {license.category}</span>
                    {license.renewalDate && (
                      <span className="text-sm text-gray-500">
                        Renews: {new Date(license.renewalDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedItem(license);
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

  const renderSchedule = () => (
    <div className="space-y-6">
      {/* Lab Sessions */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Lab Sessions</h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Schedule Session
            </button>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {labSessions.map((session) => (
            <div key={session.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-lg font-medium text-gray-900">{session.subject}</h4>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                      {session.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{session.class} with {session.teacher}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-sm text-gray-500">
                      {new Date(session.startTime).toLocaleDateString()} {new Date(session.startTime).toLocaleTimeString()} - {new Date(session.endTime).toLocaleTimeString()}
                    </span>
                    <span className="text-sm text-gray-500">Lab: {session.labName}</span>
                    <span className="text-sm text-gray-500">
                      Attendance: {session.studentsPresent}/{session.studentsPresent + session.studentsAbsent}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedItem(session);
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
            <BuildingOfficeIcon className="h-8 w-8 text-blue-500 mb-2" />
            <h4 className="font-medium text-gray-900">Lab Inventory</h4>
            <p className="text-sm text-gray-500">Complete equipment listing</p>
          </button>
          <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
            <ComputerDesktopIcon className="h-8 w-8 text-green-500 mb-2" />
            <h4 className="font-medium text-gray-900">Computer Status</h4>
            <p className="text-sm text-gray-500">Hardware and software status</p>
          </button>
          <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
            <WrenchScrewdriverIcon className="h-8 w-8 text-orange-500 mb-2" />
            <h4 className="font-medium text-gray-900">Maintenance Report</h4>
            <p className="text-sm text-gray-500">Maintenance history and costs</p>
          </button>
          <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
            <SparklesIcon className="h-8 w-8 text-purple-500 mb-2" />
            <h4 className="font-medium text-gray-900">Software Licenses</h4>
            <p className="text-sm text-gray-500">License usage and compliance</p>
          </button>
          <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
            <CalendarIcon className="h-8 w-8 text-yellow-500 mb-2" />
            <h4 className="font-medium text-gray-900">Utilization Report</h4>
            <p className="text-sm text-gray-500">Lab usage statistics</p>
          </button>
          <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
            <ChartBarIcon className="h-8 w-8 text-red-500 mb-2" />
            <h4 className="font-medium text-gray-900">Performance Metrics</h4>
            <p className="text-sm text-gray-500">System performance data</p>
          </button>
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
              <ComputerDesktopIcon className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">Computer Lab Management</h1>
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
              { id: 'labs', name: 'Labs', icon: BuildingOfficeIcon },
              { id: 'equipment', name: 'Equipment', icon: ComputerDesktopIcon },
              { id: 'maintenance', name: 'Maintenance', icon: WrenchScrewdriverIcon },
              { id: 'software', name: 'Software', icon: SparklesIcon },
              { id: 'schedule', name: 'Schedule', icon: CalendarIcon },
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
        {activeTab === 'labs' && renderLabs()}
        {activeTab === 'equipment' && renderEquipment()}
        {activeTab === 'maintenance' && renderMaintenance()}
        {activeTab === 'software' && renderSoftware()}
        {activeTab === 'schedule' && renderSchedule()}
        {activeTab === 'reports' && renderReports()}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedItem && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {selectedItem.labName || selectedItem.title || selectedItem.name || selectedItem.subject || 'Details'}
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

export default ComputerLabManagement;
