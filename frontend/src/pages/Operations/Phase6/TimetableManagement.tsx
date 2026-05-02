import React, { useState, useEffect } from 'react';
import {
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
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
  UserIcon,
  BuildingOfficeIcon,
  AcademicCapIcon,
  SparklesIcon,
  ShieldCheckIcon,
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

interface Timetable {
  id: string;
  name: string;
  description: string;
  type: 'regular' | 'exam' | 'event' | 'substitute' | 'temporary';
  academicYear: string;
  term: 'term1' | 'term2' | 'term3';
  grade: string;
  class: string;
  status: 'draft' | 'published' | 'active' | 'archived';
  schedule: {
    day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';
    periods: {
      period: number;
      startTime: string;
      endTime: string;
      subject: {
        id: string;
        name: string;
        code: string;
        category: string;
      };
      teacher: {
        id: string;
        name: string;
        email: string;
        department: string;
      };
      room: {
        id: string;
        name: string;
        type: 'classroom' | 'laboratory' | 'library' | 'computer_lab' | 'auditorium' | 'sports_field';
        capacity: number;
        equipment: string[];
      };
      group?: string;
      notes?: string;
    }[];
  }[];
  metadata: {
    createdBy: string;
    createdAt: string;
    lastModifiedBy: string;
    lastModifiedAt: string;
    version: number;
    effectiveFrom: string;
    effectiveTo?: string;
  };
  constraints: {
    teacherAvailability: {
      teacherId: string;
      unavailablePeriods: number[];
      reason: string;
    }[];
    roomAvailability: {
      roomId: string;
      unavailablePeriods: number[];
      reason: string;
    }[];
    subjectRequirements: {
      subjectId: string;
      requiredEquipment: string[];
      preferredRoomType: string;
      maxConcurrentSessions: number;
    }[];
  };
  conflicts: {
    type: 'teacher' | 'room' | 'student' | 'subject';
    description: string;
    severity: 'low' | 'medium' | 'high';
    resolved: boolean;
  }[];
  notifications: {
    type: 'change' | 'cancellation' | 'substitution' | 'room_change';
    message: string;
    recipients: string[];
    sentAt: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

interface Subject {
  id: string;
  name: string;
  code: string;
  category: 'core' | 'elective' | 'language' | 'practical' | 'sports';
  description: string;
  credits: number;
  hoursPerWeek: number;
  periodsPerWeek: number;
  requiresLab: boolean;
  requiresSpecialEquipment: string[];
  prerequisites: string[];
  grade: string;
  department: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface Teacher {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  specialization: string[];
  qualifications: {
    degree: string;
    institution: string;
    year: string;
  }[];
  subjects: {
    subjectId: string;
    subjectName: string;
    proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    maxHoursPerWeek: number;
    currentHoursPerWeek: number;
  }[];
  availability: {
    day: string;
    periods: {
      period: number;
      available: boolean;
      reason?: string;
    }[];
  }[];
  preferences: {
    preferredGrades: string[];
    preferredSubjects: string[];
    maxPeriodsPerDay: number;
    maxConsecutivePeriods: number;
    breakRequiredAfter: number;
  };
  workload: {
    totalPeriods: number;
    teachingPeriods: number;
    nonTeachingPeriods: number;
    overtimePeriods: number;
  };
  status: 'active' | 'inactive' | 'on_leave';
  createdAt: string;
  updatedAt: string;
}

interface Room {
  id: string;
  name: string;
  type: 'classroom' | 'laboratory' | 'library' | 'computer_lab' | 'auditorium' | 'sports_field';
  building: string;
  floor: string;
  capacity: number;
  area: number;
  equipment: string[];
  features: string[];
  availability: {
    day: string;
    periods: {
      period: number;
      available: boolean;
      reason?: string;
    }[];
  }[];
  schedule: {
    timetableId: string;
    day: string;
    period: number;
    subject: string;
    teacher: string;
    class: string;
  }[];
  maintenance: {
    nextMaintenance: string;
    lastMaintenance: string;
    issues: string[];
  };
  status: 'available' | 'maintenance' | 'occupied' | 'reserved';
  createdAt: string;
  updatedAt: string;
}

interface Class {
  id: string;
  name: string;
  grade: string;
  stream: string;
  capacity: number;
  currentEnrollment: number;
  classTeacher: {
    id: string;
    name: string;
    email: string;
  };
  subjects: {
    subjectId: string;
    subjectName: string;
    periodsPerWeek: number;
    teacher?: string;
  }[];
  timetable: {
    id: string;
    name: string;
    status: string;
  };
  room: {
    id: string;
    name: string;
    type: string;
  };
  schedule: {
    day: string;
    periods: {
      period: number;
      subject: string;
      teacher: string;
      room: string;
    }[];
  }[];
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface Substitution {
  id: string;
  date: string;
  period: number;
  originalTeacher: {
    id: string;
    name: string;
  };
  substituteTeacher: {
    id: string;
    name: string;
  };
  class: {
    id: string;
    name: string;
  };
  subject: {
    id: string;
    name: string;
  };
  room: {
    id: string;
    name: string;
  };
  reason: string;
  type: 'sick' | 'personal' | 'training' | 'meeting' | 'other';
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  requestedBy: string;
  approvedBy?: string;
  approvedAt?: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

const TimetableManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'timetables' | 'subjects' | 'teachers' | 'rooms' | 'classes' | 'substitutions' | 'reports'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Timetable | Subject | Teacher | Room | Class | Substitution | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(3);

  // Mock data
  const [timetables] = useState<Timetable[]>([
    {
      id: '1',
      name: 'Form 4A - Regular Timetable',
      description: 'Regular class timetable for Form 4A students',
      type: 'regular',
      academicYear: '2024',
      term: 'term1',
      grade: 'Form 4',
      class: '4A',
      status: 'active',
      schedule: [
        {
          day: 'monday',
          periods: [
            {
              period: 1,
              startTime: '08:00',
              endTime: '08:40',
              subject: {
                id: 'sub1',
                name: 'Mathematics',
                code: 'MATH',
                category: 'core'
              },
              teacher: {
                id: 't1',
                name: 'John Smith',
                email: 'john.smith@school.edu',
                department: 'Mathematics'
              },
              room: {
                id: 'rm1',
                name: 'Room 101',
                type: 'classroom',
                capacity: 35,
                equipment: ['Projector', 'Whiteboard']
              }
            },
            {
              period: 2,
              startTime: '08:45',
              endTime: '09:25',
              subject: {
                id: 'sub2',
                name: 'English',
                code: 'ENG',
                category: 'core'
              },
              teacher: {
                id: 't2',
                name: 'Sarah Johnson',
                email: 'sarah.johnson@school.edu',
                department: 'English'
              },
              room: {
                id: 'rm1',
                name: 'Room 101',
                type: 'classroom',
                capacity: 35,
                equipment: ['Projector', 'Whiteboard']
              }
            }
          ]
        },
        {
          day: 'tuesday',
          periods: [
            {
              period: 1,
              startTime: '08:00',
              endTime: '08:40',
              subject: {
                id: 'sub3',
                name: 'Physics',
                code: 'PHY',
                category: 'core'
              },
              teacher: {
                id: 't3',
                name: 'Michael Brown',
                email: 'michael.brown@school.edu',
                department: 'Science'
              },
              room: {
                id: 'lab1',
                name: 'Physics Lab',
                type: 'laboratory',
                capacity: 30,
                equipment: ['Lab Equipment', 'Safety Gear']
              }
            }
          ]
        }
      ],
      metadata: {
        createdBy: 'Admin',
        createdAt: '2024-01-01T00:00:00Z',
        lastModifiedBy: 'Admin',
        lastModifiedAt: '2024-01-15T00:00:00Z',
        version: 1,
        effectiveFrom: '2024-01-15',
        effectiveTo: '2024-04-15'
      },
      constraints: {
        teacherAvailability: [],
        roomAvailability: [],
        subjectRequirements: []
      },
      conflicts: [],
      notifications: [],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z'
    }
  ]);

  const [subjects] = useState<Subject[]>([
    {
      id: '1',
      name: 'Mathematics',
      code: 'MATH',
      category: 'core',
      description: 'Mathematics curriculum for Form 4',
      credits: 4,
      hoursPerWeek: 5,
      periodsPerWeek: 5,
      requiresLab: false,
      requiresSpecialEquipment: ['Calculator', 'Geometry Set'],
      prerequisites: [],
      grade: 'Form 4',
      department: 'Mathematics',
      status: 'active',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }
  ]);

  const [teachers] = useState<Teacher[]>([
    {
      id: '1',
      employeeId: 'EMP001',
      name: 'John Smith',
      email: 'john.smith@school.edu',
      phone: '+263 123 456 001',
      department: 'Mathematics',
      specialization: ['Mathematics', 'Statistics'],
      qualifications: [
        {
          degree: 'BSc Mathematics',
          institution: 'University of Zimbabwe',
          year: '2015'
        }
      ],
      subjects: [
        {
          subjectId: '1',
          subjectName: 'Mathematics',
          proficiency: 'expert',
          maxHoursPerWeek: 25,
          currentHoursPerWeek: 20
        }
      ],
      availability: [
        {
          day: 'monday',
          periods: [
            { period: 1, available: true },
            { period: 2, available: true },
            { period: 3, available: false, reason: 'Department meeting' }
          ]
        }
      ],
      preferences: {
        preferredGrades: ['Form 3', 'Form 4'],
        preferredSubjects: ['Mathematics', 'Statistics'],
        maxPeriodsPerDay: 6,
        maxConsecutivePeriods: 3,
        breakRequiredAfter: 2
      },
      workload: {
        totalPeriods: 25,
        teachingPeriods: 20,
        nonTeachingPeriods: 3,
        overtimePeriods: 2
      },
      status: 'active',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-25T00:00:00Z'
    }
  ]);

  const [rooms] = useState<Room[]>([
    {
      id: '1',
      name: 'Room 101',
      type: 'classroom',
      building: 'Main Building',
      floor: '1st Floor',
      capacity: 35,
      area: 50,
      equipment: ['Projector', 'Whiteboard', 'Computer'],
      features: ['Air Conditioning', 'Natural Light'],
      availability: [
        {
          day: 'monday',
          periods: [
            { period: 1, available: false, reason: 'Occupied by Form 4A' },
            { period: 2, available: false, reason: 'Occupied by Form 4A' },
            { period: 3, available: true }
          ]
        }
      ],
      schedule: [
        {
          timetableId: '1',
          day: 'monday',
          period: 1,
          subject: 'Mathematics',
          teacher: 'John Smith',
          class: 'Form 4A'
        }
      ],
      maintenance: {
        nextMaintenance: '2024-03-01',
        lastMaintenance: '2023-12-01',
        issues: []
      },
      status: 'available',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-25T00:00:00Z'
    }
  ]);

  const [classes] = useState<Class[]>([
    {
      id: '1',
      name: 'Form 4A',
      grade: 'Form 4',
      stream: 'A',
      capacity: 35,
      currentEnrollment: 32,
      classTeacher: {
        id: 't4',
        name: 'Mary Davis',
        email: 'mary.davis@school.edu'
      },
      subjects: [
        {
          subjectId: '1',
          subjectName: 'Mathematics',
          periodsPerWeek: 5,
          teacher: 'John Smith'
        }
      ],
      timetable: {
        id: '1',
        name: 'Form 4A - Regular Timetable',
        status: 'active'
      },
      room: {
        id: '1',
        name: 'Room 101',
        type: 'classroom'
      },
      schedule: [
        {
          day: 'monday',
          periods: [
            {
              period: 1,
              subject: 'Mathematics',
              teacher: 'John Smith',
              room: 'Room 101'
            }
          ]
        }
      ],
      status: 'active',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-25T00:00:00Z'
    }
  ]);

  const [substitutions] = useState<Substitution[]>([
    {
      id: '1',
      date: '2024-01-26',
      period: 2,
      originalTeacher: {
        id: '1',
        name: 'John Smith'
      },
      substituteTeacher: {
        id: '2',
        name: 'Sarah Wilson'
      },
      class: {
        id: '1',
        name: 'Form 4A'
      },
      subject: {
        id: '1',
        name: 'Mathematics'
      },
      room: {
        id: '1',
        name: 'Room 101'
      },
      reason: 'Teacher sick leave',
      type: 'sick',
      status: 'approved',
      requestedBy: 'Admin',
      approvedBy: 'Head Teacher',
      approvedAt: '2024-01-25T10:00:00Z',
      notes: 'Substitute teacher has been notified',
      createdAt: '2024-01-25T09:00:00Z',
      updatedAt: '2024-01-25T10:00:00Z'
    }
  ]);

  const stats = {
    totalTimetables: timetables.length,
    activeTimetables: timetables.filter(t => t.status === 'active').length,
    totalSubjects: subjects.length,
    totalTeachers: teachers.length,
    totalRooms: rooms.length,
    totalClasses: classes.length,
    pendingSubstitutions: substitutions.filter(s => s.status === 'pending').length
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'available':
      case 'completed':
      case 'approved':
        return 'text-green-600 bg-green-100';
      case 'draft':
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'inactive':
      case 'maintenance':
      case 'occupied':
      case 'rejected':
        return 'text-red-600 bg-red-100';
      case 'archived':
      case 'reserved':
        return 'text-gray-600 bg-gray-100';
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
              <p className="text-sm text-gray-600">Total Timetables</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalTimetables}</p>
            </div>
            <CalendarIcon className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Timetables</p>
              <p className="text-2xl font-bold text-green-600">{stats.activeTimetables}</p>
            </div>
            <CheckCircleIcon className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Subjects</p>
              <p className="text-2xl font-bold text-blue-600">{stats.totalSubjects}</p>
            </div>
            <AcademicCapIcon className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Teachers</p>
              <p className="text-2xl font-bold text-purple-600">{stats.totalTeachers}</p>
            </div>
            <UserGroupIcon className="h-8 w-8 text-purple-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Rooms</p>
              <p className="text-2xl font-bold text-orange-600">{stats.totalRooms}</p>
            </div>
            <BuildingOfficeIcon className="h-8 w-8 text-orange-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Substitutions</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pendingSubstitutions}</p>
            </div>
            <ClockIcon className="h-8 w-8 text-yellow-500" />
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
              <p className="text-sm text-gray-900">Form 4A timetable published successfully</p>
              <p className="text-xs text-gray-500">2 days ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <UserGroupIcon className="h-5 w-5 text-blue-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">New teacher added to Mathematics department</p>
              <p className="text-xs text-gray-500">5 days ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-5 w-5 text-orange-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">Substitution request for John Smith</p>
              <p className="text-xs text-gray-500">1 week ago</p>
            </div>
          </div>
        </div>
      </div>

      {/* Timetable Status */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Timetable Status Overview</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {timetables.map((timetable) => (
              <div key={timetable.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CalendarIcon className="h-5 w-5 text-blue-500" />
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{timetable.name}</h4>
                    <p className="text-xs text-gray-500">{timetable.grade} - {timetable.class}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">{timetable.term}</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(timetable.status)}`}>
                    {timetable.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderTimetables = () => (
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
                placeholder="Search timetables..."
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
              <option value="all">All Timetables</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Create Timetable
            </button>
          </div>
        </div>
      </div>

      {/* Timetables List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="min-w-full divide-y divide-gray-200">
          <div className="bg-gray-50 px-6 py-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">All Timetables</h3>
              <span className="text-sm text-gray-500">{timetables.length} timetables</span>
            </div>
          </div>
          <div className="bg-white divide-y divide-gray-200">
            {timetables.map((timetable) => (
              <div key={timetable.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <CalendarIcon className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-lg font-medium text-gray-900">{timetable.name}</h4>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(timetable.status)}`}>
                          {timetable.status}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {timetable.type}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-gray-500">{timetable.grade}</span>
                        <span className="text-sm text-gray-500">{timetable.class}</span>
                        <span className="text-sm text-gray-500">{timetable.academicYear}</span>
                        <span className="text-sm text-gray-500">{timetable.term}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setSelectedItem(timetable);
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

  const renderSubjects = () => (
    <div className="space-y-6">
      {/* Subjects List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Subjects</h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Subject
            </button>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {subjects.map((subject) => (
            <div key={subject.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                      <AcademicCapIcon className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-lg font-medium text-gray-900">{subject.name}</h4>
                      <span className="text-sm text-gray-500">{subject.code}</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(subject.status)}`}>
                        {subject.status}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {subject.category}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-gray-500">{subject.grade}</span>
                      <span className="text-sm text-gray-500">{subject.credits} credits</span>
                      <span className="text-sm text-gray-500">{subject.periodsPerWeek} periods/week</span>
                      <span className="text-sm text-gray-500">{subject.department}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedItem(subject);
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

  const renderTeachers = () => (
    <div className="space-y-6">
      {/* Teachers List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Teachers</h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Teacher
            </button>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {teachers.map((teacher) => (
            <div key={teacher.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <UserIcon className="h-5 w-5 text-purple-600" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-lg font-medium text-gray-900">{teacher.name}</h4>
                      <span className="text-sm text-gray-500">{teacher.employeeId}</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(teacher.status)}`}>
                        {teacher.status}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-gray-500">{teacher.department}</span>
                      <span className="text-sm text-gray-500">{teacher.specialization.join(', ')}</span>
                      <span className="text-sm text-gray-500">{teacher.workload.teachingPeriods} periods/week</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedItem(teacher);
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

  const renderRooms = () => (
    <div className="space-y-6">
      {/* Rooms List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Rooms</h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Room
            </button>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {rooms.map((room) => (
            <div key={room.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                      <BuildingOfficeIcon className="h-5 w-5 text-orange-600" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-lg font-medium text-gray-900">{room.name}</h4>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(room.status)}`}>
                        {room.status}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {room.type.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-gray-500">{room.building}</span>
                      <span className="text-sm text-gray-500">{room.capacity} capacity</span>
                      <span className="text-sm text-gray-500">{room.area} sq ft</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedItem(room);
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

  const renderClasses = () => (
    <div className="space-y-6">
      {/* Classes List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Classes</h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Class
            </button>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {classes.map((classItem) => (
            <div key={classItem.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <UserGroupIcon className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-lg font-medium text-gray-900">{classItem.name}</h4>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(classItem.status)}`}>
                        {classItem.status}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-gray-500">{classItem.grade}</span>
                      <span className="text-sm text-gray-500">{classItem.currentEnrollment}/{classItem.capacity} students</span>
                      <span className="text-sm text-gray-500">Class Teacher: {classItem.classTeacher.name}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedItem(classItem);
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

  const renderSubstitutions = () => (
    <div className="space-y-6">
      {/* Substitutions List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Substitutions</h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Substitution
            </button>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {substitutions.map((substitution) => (
            <div key={substitution.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                      <ArrowPathIcon className="h-5 w-5 text-yellow-600" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-lg font-medium text-gray-900">
                        {substitution.originalTeacher.name} → {substitution.substituteTeacher.name}
                      </h4>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(substitution.status)}`}>
                        {substitution.status}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-gray-500">{substitution.date}</span>
                      <span className="text-sm text-gray-500">Period {substitution.period}</span>
                      <span className="text-sm text-gray-500">{substitution.class.name}</span>
                      <span className="text-sm text-gray-500">{substitution.subject.name}</span>
                      <span className="text-sm text-gray-500">{substitution.type}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedItem(substitution);
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
            <CalendarIcon className="h-8 w-8 text-blue-500 mb-2" />
            <h4 className="font-medium text-gray-900">Timetable Report</h4>
            <p className="text-sm text-gray-500">Complete timetable overview</p>
          </button>
          <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
            <UserGroupIcon className="h-8 w-8 text-green-500 mb-2" />
            <h4 className="font-medium text-gray-900">Teacher Workload</h4>
            <p className="text-sm text-gray-500">Teacher workload analysis</p>
          </button>
          <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
            <BuildingOfficeIcon className="h-8 w-8 text-orange-500 mb-2" />
            <h4 className="font-medium text-gray-900">Room Utilization</h4>
            <p className="text-sm text-gray-500">Room usage statistics</p>
          </button>
          <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
            <AcademicCapIcon className="h-8 w-8 text-purple-500 mb-2" />
            <h4 className="font-medium text-gray-900">Subject Distribution</h4>
            <p className="text-sm text-gray-500">Subject allocation report</p>
          </button>
          <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
            <ChartBarIcon className="h-8 w-8 text-red-500 mb-2" />
            <h4 className="font-medium text-gray-900">Conflict Analysis</h4>
            <p className="text-sm text-gray-500">Timetable conflicts report</p>
          </button>
          <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
            <ArrowPathIcon className="h-8 w-8 text-yellow-500 mb-2" />
            <h4 className="font-medium text-gray-900">Substitution Summary</h4>
            <p className="text-sm text-gray-500">Teacher substitution report</p>
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
              <CalendarIcon className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">Timetable Management</h1>
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
              { id: 'timetables', name: 'Timetables', icon: CalendarIcon },
              { id: 'subjects', name: 'Subjects', icon: AcademicCapIcon },
              { id: 'teachers', name: 'Teachers', icon: UserGroupIcon },
              { id: 'rooms', name: 'Rooms', icon: BuildingOfficeIcon },
              { id: 'classes', name: 'Classes', icon: UserGroupIcon },
              { id: 'substitutions', name: 'Substitutions', icon: ArrowPathIcon },
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
        {activeTab === 'timetables' && renderTimetables()}
        {activeTab === 'subjects' && renderSubjects()}
        {activeTab === 'teachers' && renderTeachers()}
        {activeTab === 'rooms' && renderRooms()}
        {activeTab === 'classes' && renderClasses()}
        {activeTab === 'substitutions' && renderSubstitutions()}
        {activeTab === 'reports' && renderReports()}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedItem && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {selectedItem.name || selectedItem.displayName || 'Details'}
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

export default TimetableManagement;
