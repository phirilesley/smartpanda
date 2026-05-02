import React, { useState, useEffect } from 'react';
import {
  UserGroupIcon,
  IdentificationIcon,
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
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ShieldCheckIcon,
  CameraIcon,
  QrCodeIcon,
  UserIcon,
  BuildingOfficeIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  SparklesIcon,
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

interface Visitor {
  id: string;
  visitorId: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    middleName?: string;
    email?: string;
    phone: string;
    company?: string;
    idType: 'national_id' | 'passport' | 'drivers_license' | 'other';
    idNumber: string;
    dateOfBirth?: string;
    nationality?: string;
    gender?: 'male' | 'female' | 'other';
    photo?: string;
    signature?: string;
  };
  visitDetails: {
    purpose: 'meeting' | 'interview' | 'delivery' | 'maintenance' | 'inspection' | 'tour' | 'parent_visit' | 'student_pickup' | 'other';
    purposeDescription: string;
    hostEmployee: {
      id: string;
      name: string;
      department: string;
      email: string;
      phone: string;
    };
    appointmentDate?: string;
    appointmentTime?: string;
    expectedDuration: string;
    accessLevel: 'general' | 'restricted' | 'sensitive';
    areasToVisit: string[];
    equipment?: string[];
  };
  checkIn: {
    date: string;
    time: string;
    checkedInBy: string;
    temperature?: number;
    healthScreening: {
      symptoms: string[];
      exposure: boolean;
      travelHistory: boolean;
    };
    documents: {
      type: string;
      name: string;
      url: string;
    }[];
    badgeIssued: boolean;
    badgeNumber?: string;
    qrCode?: string;
  };
  checkOut?: {
    date: string;
    time: string;
    checkedOutBy: string;
    notes?: string;
    returnedBadge: boolean;
  };
  security: {
    backgroundCheck: boolean;
    approvedBy: string;
    approvalDate?: string;
    restrictions: string[];
    emergencyContact: {
      name: string;
      relationship: string;
      phone: string;
    };
  };
  status: 'scheduled' | 'checked_in' | 'checked_out' | 'cancelled' | 'blacklisted';
  notes: string;
  createdAt: string;
  updatedAt: string;
}

interface VisitorPass {
  id: string;
  passNumber: string;
  visitorId: string;
  visitorName: string;
  hostName: string;
  issueDate: string;
  expiryDate: string;
  accessLevel: 'general' | 'restricted' | 'sensitive';
  areasAllowed: string[];
  qrCode: string;
  barcode: string;
  photo: string;
  status: 'active' | 'expired' | 'revoked' | 'lost';
  issuedBy: string;
  returnDate?: string;
  returnedBy?: string;
  createdAt: string;
  updatedAt: string;
}

interface PreRegistration {
  id: string;
  visitorInfo: {
    firstName: string;
    lastName: string;
    email?: string;
    phone: string;
    company?: string;
    idType: 'national_id' | 'passport' | 'drivers_license' | 'other';
    idNumber: string;
  };
  visitDetails: {
    purpose: string;
    hostEmployee: string;
    appointmentDate: string;
    appointmentTime: string;
    expectedDuration: string;
    accessLevel: 'general' | 'restricted' | 'sensitive';
  };
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  approvedBy?: string;
  approvedDate?: string;
  rejectionReason?: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

interface Blacklist {
  id: string;
  visitorInfo: {
    firstName: string;
    lastName: string;
    email?: string;
    phone: string;
    idNumber: string;
    photo?: string;
  };
  reason: string;
  blacklistedBy: string;
  blacklistedDate: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  restrictions: string[];
  expiryDate?: string;
  permanent: boolean;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

interface SecurityIncident {
  id: string;
  incidentDate: string;
  incidentTime: string;
  type: 'unauthorized_access' | 'theft' | 'vandalism' | 'violence' | 'suspicious_behavior' | 'safety_violation' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  location: {
    building: string;
    floor: string;
    room: string;
  };
  visitorsInvolved: {
    visitorId: string;
    visitorName: string;
    role: 'suspect' | 'witness' | 'victim';
  }[];
  witnesses: {
    name: string;
    role: string;
    statement: string;
  }[];
  evidence: {
    type: string;
    description: string;
    url?: string;
  }[];
  reportedBy: string;
  actionTaken: string;
  resolved: boolean;
  resolutionDate?: string;
  resolutionNotes?: string;
  createdAt: string;
  updatedAt: string;
}

const VisitorManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'visitors' | 'passes' | 'pre_registration' | 'blacklist' | 'incidents' | 'reports'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Visitor | VisitorPass | PreRegistration | Blacklist | SecurityIncident | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(3);

  // Mock data
  const [visitors] = useState<Visitor[]>([
    {
      id: '1',
      visitorId: 'VIS-2024-001',
      personalInfo: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@company.com',
        phone: '+263 123 456 789',
        company: 'Tech Solutions Ltd',
        idType: 'national_id',
        idNumber: '12-345678-A-12',
        dateOfBirth: '1980-05-15',
        nationality: 'Zimbabwean',
        gender: 'male',
        photo: '/images/visitors/john_doe.jpg'
      },
      visitDetails: {
        purpose: 'meeting',
        purposeDescription: 'Business meeting with IT Department',
        hostEmployee: {
          id: 'emp1',
          name: 'Sarah Johnson',
          department: 'IT',
          email: 'sarah.johnson@school.edu',
          phone: '+263 123 456 001'
        },
        appointmentDate: '2024-01-25',
        appointmentTime: '10:00',
        expectedDuration: '2 hours',
        accessLevel: 'general',
        areasToVisit: ['Administration Building', 'IT Department'],
        equipment: ['Laptop', 'Presentation Materials']
      },
      checkIn: {
        date: '2024-01-25',
        time: '09:45',
        checkedInBy: 'Security Guard A',
        temperature: 36.5,
        healthScreening: {
          symptoms: [],
          exposure: false,
          travelHistory: false
        },
        documents: [
          {
            type: 'ID Copy',
            name: 'john_doe_id.pdf',
            url: '/documents/visitors/john_doe_id.pdf'
          }
        ],
        badgeIssued: true,
        badgeNumber: 'BG-001',
        qrCode: 'QR-VIS-001'
      },
      security: {
        backgroundCheck: true,
        approvedBy: 'Security Manager',
        approvalDate: '2024-01-24',
        restrictions: [],
        emergencyContact: {
          name: 'Jane Doe',
          relationship: 'Spouse',
          phone: '+263 123 456 788'
        }
      },
      status: 'checked_in',
      notes: 'Regular business visitor',
      createdAt: '2024-01-24T00:00:00Z',
      updatedAt: '2024-01-25T00:00:00Z'
    }
  ]);

  const [passes] = useState<VisitorPass[]>([
    {
      id: '1',
      passNumber: 'VP-001',
      visitorId: '1',
      visitorName: 'John Doe',
      hostName: 'Sarah Johnson',
      issueDate: '2024-01-25',
      expiryDate: '2024-01-25',
      accessLevel: 'general',
      areasAllowed: ['Administration Building', 'IT Department'],
      qrCode: 'QR-VP-001',
      barcode: 'BC-VP-001',
      photo: '/images/visitors/john_doe.jpg',
      status: 'active',
      issuedBy: 'Security Guard A',
      createdAt: '2024-01-25T00:00:00Z',
      updatedAt: '2024-01-25T00:00:00Z'
    }
  ]);

  const [preRegistrations] = useState<PreRegistration[]>([
    {
      id: '1',
      visitorInfo: {
        firstName: 'Alice',
        lastName: 'Smith',
        email: 'alice.smith@vendor.com',
        phone: '+263 123 456 777',
        company: 'Office Supplies Co',
        idType: 'national_id',
        idNumber: '12-345678-B-34'
      },
      visitDetails: {
        purpose: 'Delivery',
        hostEmployee: 'Procurement Department',
        appointmentDate: '2024-01-26',
        appointmentTime: '14:00',
        expectedDuration: '1 hour',
        accessLevel: 'general'
      },
      status: 'approved',
      approvedBy: 'Procurement Manager',
      approvedDate: '2024-01-24',
      notes: 'Regular delivery vendor',
      createdAt: '2024-01-23T00:00:00Z',
      updatedAt: '2024-01-24T00:00:00Z'
    }
  ]);

  const [blacklist] = useState<Blacklist[]>([
    {
      id: '1',
      visitorInfo: {
        firstName: 'Robert',
        lastName: 'Brown',
        phone: '+263 123 456 666',
        idNumber: '12-345678-C-56',
        photo: '/images/visitors/robert_brown.jpg'
      },
      reason: 'Previous security violation - unauthorized access to restricted areas',
      blacklistedBy: 'Security Manager',
      blacklistedDate: '2023-12-01',
      severity: 'high',
      restrictions: ['No access to school premises', 'Report to security if seen'],
      expiryDate: '2025-12-01',
      permanent: false,
      notes: 'Review before expiry date',
      createdAt: '2023-12-01T00:00:00Z',
      updatedAt: '2023-12-01T00:00:00Z'
    }
  ]);

  const [incidents] = useState<SecurityIncident[]>([
    {
      id: '1',
      incidentDate: '2024-01-20',
      incidentTime: '15:30',
      type: 'unauthorized_access',
      severity: 'medium',
      description: 'Visitor found in restricted laboratory area without proper authorization',
      location: {
        building: 'Science Building',
        floor: '2nd Floor',
        room: 'Lab 201'
      },
      visitorsInvolved: [
        {
          visitorId: '2',
          visitorName: 'Unknown Visitor',
          role: 'suspect'
        }
      ],
      witnesses: [
        {
          name: 'Dr. Sarah Johnson',
          role: 'Lab Manager',
          statement: 'Found individual in restricted area without badge'
        }
      ],
      evidence: [
        {
          type: 'CCTV Footage',
          description: 'Camera footage of unauthorized access'
        }
      ],
      reportedBy: 'Dr. Sarah Johnson',
      actionTaken: 'Visitor escorted out, security protocol reviewed',
      resolved: false,
      createdAt: '2024-01-20T00:00:00Z',
      updatedAt: '2024-01-20T00:00:00Z'
    }
  ]);

  const stats = {
    totalVisitors: visitors.length,
    checkedInToday: visitors.filter(v => v.status === 'checked_in').length,
    preRegistrations: preRegistrations.filter(p => p.status === 'pending').length,
    activePasses: passes.filter(p => p.status === 'active').length,
    blacklistCount: blacklist.length,
    pendingIncidents: incidents.filter(i => !i.resolved).length
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'checked_in':
      case 'active':
      case 'approved':
      case 'resolved':
        return 'text-green-600 bg-green-100';
      case 'checked_out':
      case 'expired':
      case 'completed':
        return 'text-gray-600 bg-gray-100';
      case 'scheduled':
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'cancelled':
      case 'rejected':
      case 'revoked':
      case 'lost':
        return 'text-red-600 bg-red-100';
      case 'blacklisted':
        return 'text-red-800 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'text-green-600 bg-green-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'high':
        return 'text-orange-600 bg-orange-100';
      case 'critical':
        return 'text-red-600 bg-red-100';
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
              <p className="text-sm text-gray-600">Total Visitors</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalVisitors}</p>
            </div>
            <UserGroupIcon className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Checked In Today</p>
              <p className="text-2xl font-bold text-green-600">{stats.checkedInToday}</p>
            </div>
            <CheckCircleIcon className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pre-registrations</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.preRegistrations}</p>
            </div>
            <CalendarIcon className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Passes</p>
              <p className="text-2xl font-bold text-blue-600">{stats.activePasses}</p>
            </div>
            <IdentificationIcon className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Blacklisted</p>
              <p className="text-2xl font-bold text-red-600">{stats.blacklistCount}</p>
            </div>
            <ShieldCheckIcon className="h-8 w-8 text-red-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Incidents</p>
              <p className="text-2xl font-bold text-orange-600">{stats.pendingIncidents}</p>
            </div>
            <ExclamationTriangleIcon className="h-8 w-8 text-orange-500" />
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
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">John Doe checked in for meeting with IT Department</p>
              <p className="text-xs text-gray-500">30 minutes ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <CalendarIcon className="h-5 w-5 text-yellow-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">Alice Smith pre-registered for delivery tomorrow</p>
              <p className="text-xs text-gray-500">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-5 w-5 text-orange-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">Security incident reported in Science Building</p>
              <p className="text-xs text-gray-500">5 days ago</p>
            </div>
          </div>
        </div>
      </div>

      {/* Visitor Types */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Visitors by Purpose</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {Object.entries(
              visitors.reduce((acc, visitor) => {
                acc[visitor.visitDetails.purpose] = (acc[visitor.visitDetails.purpose] || 0) + 1;
                return acc;
              }, {} as Record<string, number>)
            ).map(([purpose, count]) => (
              <div key={purpose} className="flex items-center justify-between">
                <span className="text-sm text-gray-900 capitalize">{purpose.replace('_', ' ')}</span>
                <span className="text-sm font-medium text-gray-900">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderVisitors = () => (
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
                placeholder="Search visitors..."
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
              <option value="all">All Visitors</option>
              <option value="checked_in">Checked In</option>
              <option value="checked_out">Checked Out</option>
              <option value="scheduled">Scheduled</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Check In
            </button>
          </div>
        </div>
      </div>

      {/* Visitors List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="min-w-full divide-y divide-gray-200">
          <div className="bg-gray-50 px-6 py-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">All Visitors</h3>
              <span className="text-sm text-gray-500">{visitors.length} visitors</span>
            </div>
          </div>
          <div className="bg-white divide-y divide-gray-200">
            {visitors.map((visitor) => (
              <div key={visitor.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <UserIcon className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-lg font-medium text-gray-900">
                          {visitor.personalInfo.firstName} {visitor.personalInfo.lastName}
                        </h4>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(visitor.status)}`}>
                          {visitor.status.replace('_', ' ')}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {visitor.visitDetails.purpose.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-gray-500">{visitor.visitorId}</span>
                        <span className="text-sm text-gray-500">{visitor.personalInfo.company}</span>
                        <span className="text-sm text-gray-500">Host: {visitor.visitDetails.hostEmployee.name}</span>
                        <span className="text-sm text-gray-500">
                          {visitor.checkIn.date} {visitor.checkIn.time}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <QrCodeIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedItem(visitor);
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
    </div>
  );

  const renderPasses = () => (
    <div className="space-y-6">
      {/* Visitor Passes */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Visitor Passes</h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Issue Pass
            </button>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {passes.map((pass) => (
            <div key={pass.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-lg font-medium text-gray-900">{pass.visitorName}</h4>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(pass.status)}`}>
                      {pass.status}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {pass.accessLevel}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Host: {pass.hostName}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-sm text-gray-500">Pass #: {pass.passNumber}</span>
                    <span className="text-sm text-gray-500">
                      Issued: {new Date(pass.issueDate).toLocaleDateString()}
                    </span>
                    <span className="text-sm text-gray-500">
                      Expires: {new Date(pass.expiryDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedItem(pass);
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

  const renderPreRegistration = () => (
    <div className="space-y-6">
      {/* Pre-registrations */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Pre-registrations</h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Pre-register
            </button>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {preRegistrations.map((registration) => (
            <div key={registration.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-lg font-medium text-gray-900">
                      {registration.visitorInfo.firstName} {registration.visitorInfo.lastName}
                    </h4>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(registration.status)}`}>
                      {registration.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{registration.visitorInfo.company}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-sm text-gray-500">Purpose: {registration.visitDetails.purpose}</span>
                    <span className="text-sm text-gray-500">Host: {registration.visitDetails.hostEmployee}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(registration.visitDetails.appointmentDate).toLocaleDateString()} {registration.visitDetails.appointmentTime}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedItem(registration);
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

  const renderBlacklist = () => (
    <div className="space-y-6">
      {/* Blacklist */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Blacklisted Visitors</h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add to Blacklist
            </button>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {blacklist.map((entry) => (
            <div key={entry.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-lg font-medium text-gray-900">
                      {entry.visitorInfo.firstName} {entry.visitorInfo.lastName}
                    </h4>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(entry.severity)}`}>
                      {entry.severity}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{entry.reason}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-sm text-gray-500">Blacklisted: {new Date(entry.blacklistedDate).toLocaleDateString()}</span>
                    <span className="text-sm text-gray-500">By: {entry.blacklistedBy}</span>
                    {entry.expiryDate && (
                      <span className="text-sm text-gray-500">
                        Expires: {new Date(entry.expiryDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedItem(entry);
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

  const renderIncidents = () => (
    <div className="space-y-6">
      {/* Security Incidents */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Security Incidents</h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Report Incident
            </button>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {incidents.map((incident) => (
            <div key={incident.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-lg font-medium text-gray-900">{incident.type.replace('_', ' ')}</h4>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(incident.severity)}`}>
                      {incident.severity}
                    </span>
                    {incident.resolved && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Resolved
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{incident.description}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-sm text-gray-500">
                      {new Date(incident.incidentDate).toLocaleDateString()} {incident.incidentTime}
                    </span>
                    <span className="text-sm text-gray-500">
                      {incident.location.building} - {incident.location.room}
                    </span>
                    <span className="text-sm text-gray-500">Reported by: {incident.reportedBy}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedItem(incident);
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
            <UserGroupIcon className="h-8 w-8 text-blue-500 mb-2" />
            <h4 className="font-medium text-gray-900">Visitor Log</h4>
            <p className="text-sm text-gray-500">Complete visitor history</p>
          </button>
          <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
            <ChartBarIcon className="h-8 w-8 text-green-500 mb-2" />
            <h4 className="font-medium text-gray-900">Visitor Statistics</h4>
            <p className="text-sm text-gray-500">Visitor trends and analytics</p>
          </button>
          <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
            <ShieldCheckIcon className="h-8 w-8 text-purple-500 mb-2" />
            <h4 className="font-medium text-gray-900">Security Report</h4>
            <p className="text-sm text-gray-500">Incidents and security status</p>
          </button>
          <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
            <IdentificationIcon className="h-8 w-8 text-orange-500 mb-2" />
            <h4 className="font-medium text-gray-900">Pass Report</h4>
            <p className="text-sm text-gray-500">Visitor pass usage</p>
          </button>
          <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
            <ExclamationTriangleIcon className="h-8 w-8 text-red-500 mb-2" />
            <h4 className="font-medium text-gray-900">Blacklist Report</h4>
            <p className="text-sm text-gray-500">Blacklisted visitors</p>
          </button>
          <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
            <CalendarIcon className="h-8 w-8 text-yellow-500 mb-2" />
            <h4 className="font-medium text-gray-900">Scheduled Visits</h4>
            <p className="text-sm text-gray-500">Upcoming appointments</p>
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
              <UserGroupIcon className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">Visitor Management</h1>
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
              { id: 'visitors', name: 'Visitors', icon: UserGroupIcon },
              { id: 'passes', name: 'Passes', icon: IdentificationIcon },
              { id: 'pre_registration', name: 'Pre-registration', icon: CalendarIcon },
              { id: 'blacklist', name: 'Blacklist', icon: ShieldCheckIcon },
              { id: 'incidents', name: 'Incidents', icon: ExclamationTriangleIcon },
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
        {activeTab === 'visitors' && renderVisitors()}
        {activeTab === 'passes' && renderPasses()}
        {activeTab === 'pre_registration' && renderPreRegistration()}
        {activeTab === 'blacklist' && renderBlacklist()}
        {activeTab === 'incidents' && renderIncidents()}
        {activeTab === 'reports' && renderReports()}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedItem && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {selectedItem.personalInfo ? `${selectedItem.personalInfo.firstName} ${selectedItem.personalInfo.lastName}` :
                 selectedItem.visitorInfo ? `${selectedItem.visitorInfo.firstName} ${selectedItem.visitorInfo.lastName}` :
                 selectedItem.visitorName || selectedItem.type || 'Details'}
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

export default VisitorManagement;
