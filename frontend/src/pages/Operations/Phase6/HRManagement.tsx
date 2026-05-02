import React, { useState, useEffect } from 'react';
import {
  UserGroupIcon,
  BriefcaseIcon,
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
  AcademicCapIcon,
  SparklesIcon,
  CurrencyDollarIcon,
  TagIcon,
  ArchiveBoxIcon,
  ClipboardDocumentListIcon,
  UserIcon,
  BuildingOfficeIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  IdentificationIcon,
  ShieldCheckIcon,
  BanknotesIcon,
  ReceiptRefundIcon,
  DocumentArrowDownIcon,
  DocumentArrowUpIcon,
  FolderIcon,
  FolderOpenIcon,
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

interface Employee {
  id: string;
  employeeId: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    middleName?: string;
    dateOfBirth: string;
    gender: 'male' | 'female' | 'other';
    nationalId: string;
    passportNumber?: string;
    emailAddress: string;
    phoneNumber: string;
    address: {
      street: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
    emergencyContact: {
      name: string;
      relationship: string;
      phone: string;
      email: string;
    };
  };
  employment: {
    employeeType: 'full_time' | 'part_time' | 'contract' | 'intern' | 'volunteer';
    department: string;
    position: string;
    grade: string;
    reportsTo: string;
    workLocation: string;
    startDate: string;
    endDate?: string;
    probationPeriod: number;
    employmentStatus: 'active' | 'inactive' | 'terminated' | 'retired' | 'suspended';
    workSchedule: {
      days: string[];
      hours: string;
    };
  };
  compensation: {
    salary: number;
    currency: string;
    payFrequency: 'monthly' | 'bi_weekly' | 'weekly';
    allowances: {
      housing: number;
      transport: number;
      medical: number;
      other: number;
    };
    deductions: {
      tax: number;
      pension: number;
      insurance: number;
      other: number;
    };
    bankDetails: {
      bankName: string;
      accountNumber: string;
      accountType: string;
      branchCode: string;
    };
  };
  benefits: {
    healthInsurance: boolean;
    lifeInsurance: boolean;
    retirementPlan: boolean;
    paidTimeOff: number;
    sickLeave: number;
    maternityLeave: number;
    paternityLeave: number;
    otherBenefits: string[];
  };
  qualifications: {
    education: {
      degree: string;
      institution: string;
      year: string;
      field: string;
    }[];
    certifications: {
      name: string;
      issuer: string;
      date: string;
      expiryDate?: string;
    }[];
    skills: string[];
    languages: {
      language: string;
      proficiency: 'basic' | 'intermediate' | 'advanced' | 'native';
    }[];
  };
  documents: {
    type: string;
    name: string;
    uploadDate: string;
    expiryDate?: string;
    status: 'valid' | 'expired' | 'pending';
  }[];
  performance: {
    reviews: {
      id: string;
      date: string;
      reviewer: string;
      rating: number;
      comments: string;
      goals: string[];
    }[];
    kpis: {
      category: string;
      metric: string;
      target: number;
      actual: number;
      period: string;
    }[];
  };
  leave: {
    balance: {
      annual: number;
      sick: number;
      maternity: number;
      paternity: number;
      compassionate: number;
    };
    history: {
      id: string;
      type: string;
      startDate: string;
      endDate: string;
      days: number;
      status: 'approved' | 'pending' | 'rejected';
      reason: string;
      approvedBy?: string;
    }[];
  };
  attendance: {
    totalDays: number;
    presentDays: number;
    absentDays: number;
    lateDays: number;
    overtime: number;
    attendanceRate: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  type: 'annual' | 'sick' | 'maternity' | 'paternity' | 'compassionate' | 'unpaid' | 'study';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  requestedBy: string;
  approvedBy?: string;
  approvedDate?: string;
  rejectionReason?: string;
  attachments: string[];
  emergencyContact: string;
  handoverNotes?: string;
  createdAt: string;
  updatedAt: string;
}

interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  payPeriod: string;
  grossPay: number;
  netPay: number;
  earnings: {
    basic: number;
    housing: number;
    transport: number;
    medical: number;
    overtime: number;
    bonus: number;
    other: number;
  };
  deductions: {
    tax: number;
    pension: number;
    insurance: number;
    loan: number;
    other: number;
  };
  paymentMethod: 'bank_transfer' | 'cash' | 'check';
  paymentStatus: 'pending' | 'processed' | 'failed';
  paymentDate?: string;
  bankReference?: string;
  payslipGenerated: boolean;
  payslipUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface Recruitment {
  id: string;
  position: string;
  department: string;
  employmentType: 'full_time' | 'part_time' | 'contract';
  vacancyCount: number;
  applicantsCount: number;
  status: 'open' | 'closed' | 'on_hold' | 'filled';
  postedDate: string;
  closingDate?: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  salaryRange: {
    min: number;
    max: number;
    currency: string;
  };
  applicants: {
    id: string;
    name: string;
    email: string;
    phone: string;
    appliedDate: string;
    status: 'applied' | 'screening' | 'interview' | 'assessment' | 'offer' | 'rejected' | 'hired';
    experience: number;
    qualifications: string[];
  }[];
  hiringManager: string;
  createdAt: string;
  updatedAt: string;
}

const HRManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'employees' | 'leave' | 'payroll' | 'recruitment' | 'performance' | 'reports'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Employee | LeaveRequest | PayrollRecord | Recruitment | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(3);

  // Mock data
  const [employees] = useState<Employee[]>([
    {
      id: '1',
      employeeId: 'EMP001',
      personalInfo: {
        firstName: 'John',
        lastName: 'Smith',
        dateOfBirth: '1985-05-15',
        gender: 'male',
        nationalId: '12-345678-A-12',
        emailAddress: 'john.smith@school.edu',
        phoneNumber: '+263 123 456 789',
        address: {
          street: '123 Main St',
          city: 'Harare',
          state: 'Harare Province',
          postalCode: '00123',
          country: 'Zimbabwe'
        },
        emergencyContact: {
          name: 'Jane Smith',
          relationship: 'Spouse',
          phone: '+263 123 456 788',
          email: 'jane.smith@email.com'
        }
      },
      employment: {
        employeeType: 'full_time',
        department: 'Academics',
        position: 'Mathematics Teacher',
        grade: 'T3',
        reportsTo: 'Dr. Sarah Johnson',
        workLocation: 'Main Campus',
        startDate: '2020-01-15',
        probationPeriod: 90,
        employmentStatus: 'active',
        workSchedule: {
          days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          hours: '08:00 - 17:00'
        }
      },
      compensation: {
        salary: 120000,
        currency: 'ZWL',
        payFrequency: 'monthly',
        allowances: {
          housing: 24000,
          transport: 12000,
          medical: 8000,
          other: 5000
        },
        deductions: {
          tax: 20000,
          pension: 12000,
          insurance: 5000,
          other: 3000
        },
        bankDetails: {
          bankName: 'CBZ Bank',
          accountNumber: '1234567890',
          accountType: 'Savings',
          branchCode: '001'
        }
      },
      benefits: {
        healthInsurance: true,
        lifeInsurance: true,
        retirementPlan: true,
        paidTimeOff: 21,
        sickLeave: 10,
        maternityLeave: 90,
        paternityLeave: 14,
        otherBenefits: ['Laptop', 'Transport Allowance']
      },
      qualifications: {
        education: [
          {
            degree: 'Bachelor of Education',
            institution: 'University of Zimbabwe',
            year: '2010',
            field: 'Mathematics'
          }
        ],
        certifications: [
          {
            name: 'Teaching Certificate',
            issuer: 'Ministry of Education',
            date: '2011'
          }
        ],
        skills: ['Mathematics', 'Teaching', 'Communication', 'Leadership'],
        languages: [
          { language: 'English', proficiency: 'native' },
          { language: 'Shona', proficiency: 'advanced' }
        ]
      },
      documents: [
        {
          type: 'CV',
          name: 'John_Smith_CV.pdf',
          uploadDate: '2020-01-10',
          status: 'valid'
        },
        {
          type: 'National ID',
          name: 'John_Smith_ID.pdf',
          uploadDate: '2020-01-10',
          status: 'valid'
        }
      ],
      performance: {
        reviews: [
          {
            id: '1',
            date: '2023-12-15',
            reviewer: 'Dr. Sarah Johnson',
            rating: 4.5,
            comments: 'Excellent teaching performance',
            goals: ['Complete advanced mathematics course', 'Mentor junior teachers']
          }
        ],
        kpis: [
          {
            category: 'Teaching',
            metric: 'Student Pass Rate',
            target: 85,
            actual: 92,
            period: '2023-Q4'
          }
        ]
      },
      leave: {
        balance: {
          annual: 15,
          sick: 8,
          maternity: 0,
          paternity: 14,
          compassionate: 3
        },
        history: [
          {
            id: '1',
            type: 'annual',
            startDate: '2023-12-20',
            endDate: '2023-12-31',
            days: 10,
            status: 'approved',
            reason: 'Family vacation',
            approvedBy: 'Dr. Sarah Johnson'
          }
        ]
      },
      attendance: {
        totalDays: 220,
        presentDays: 210,
        absentDays: 5,
        lateDays: 5,
        overtime: 20,
        attendanceRate: 95.5
      },
      createdAt: '2020-01-10T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z'
    }
  ]);

  const [leaveRequests] = useState<LeaveRequest[]>([
    {
      id: '1',
      employeeId: '1',
      employeeName: 'John Smith',
      type: 'annual',
      startDate: '2024-02-01',
      endDate: '2024-02-05',
      days: 5,
      reason: 'Family vacation',
      status: 'pending',
      requestedBy: 'John Smith',
      attachments: [],
      emergencyContact: '+263 123 456 788',
      createdAt: '2024-01-20T00:00:00Z',
      updatedAt: '2024-01-20T00:00:00Z'
    }
  ]);

  const [payrollRecords] = useState<PayrollRecord[]>([
    {
      id: '1',
      employeeId: '1',
      employeeName: 'John Smith',
      payPeriod: '2024-01',
      grossPay: 169000,
      netPay: 129000,
      earnings: {
        basic: 120000,
        housing: 24000,
        transport: 12000,
        medical: 8000,
        overtime: 5000,
        bonus: 0,
        other: 0
      },
      deductions: {
        tax: 20000,
        pension: 12000,
        insurance: 5000,
        loan: 3000,
        other: 0
      },
      paymentMethod: 'bank_transfer',
      paymentStatus: 'processed',
      paymentDate: '2024-01-25',
      bankReference: 'REF123456',
      payslipGenerated: true,
      payslipUrl: '/payslips/2024-01/EMP001.pdf',
      createdAt: '2024-01-25T00:00:00Z',
      updatedAt: '2024-01-25T00:00:00Z'
    }
  ]);

  const [recruitments] = useState<Recruitment[]>([
    {
      id: '1',
      position: 'Science Teacher',
      department: 'Academics',
      employmentType: 'full_time',
      vacancyCount: 2,
      applicantsCount: 15,
      status: 'open',
      postedDate: '2024-01-15',
      closingDate: '2024-02-15',
      description: 'We are looking for an experienced Science Teacher',
      requirements: ['BSc in Science', 'Teaching Certificate', '3+ years experience'],
      responsibilities: ['Teach Science subjects', 'Prepare lesson plans', 'Assess student progress'],
      salaryRange: {
        min: 100000,
        max: 150000,
        currency: 'ZWL'
      },
      applicants: [
        {
          id: '1',
          name: 'Alice Johnson',
          email: 'alice@email.com',
          phone: '+263 123 456 777',
          appliedDate: '2024-01-16',
          status: 'screening',
          experience: 4,
          qualifications: ['BSc Chemistry', 'PGCE']
        }
      ],
      hiringManager: 'Dr. Sarah Johnson',
      createdAt: '2024-01-15T00:00:00Z',
      updatedAt: '2024-01-20T00:00:00Z'
    }
  ]);

  const stats = {
    totalEmployees: employees.length,
    activeEmployees: employees.filter(e => e.employment.employmentStatus === 'active').length,
    pendingLeaveRequests: leaveRequests.filter(l => l.status === 'pending').length,
    openPositions: recruitments.filter(r => r.status === 'open').length,
    averageAttendance: employees.reduce((acc, e) => acc + e.attendance.attendanceRate, 0) / employees.length,
    totalApplicants: recruitments.reduce((acc, r) => acc + r.applicantsCount, 0)
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'approved':
      case 'processed':
      case 'completed':
      case 'valid':
      case 'hired':
        return 'text-green-600 bg-green-100';
      case 'pending':
      case 'screening':
      case 'interview':
      case 'assessment':
        return 'text-yellow-600 bg-yellow-100';
      case 'inactive':
      case 'rejected':
      case 'failed':
      case 'expired':
      case 'terminated':
      case 'suspended':
        return 'text-red-600 bg-red-100';
      case 'on_hold':
      case 'offer':
        return 'text-blue-600 bg-blue-100';
      case 'closed':
      case 'filled':
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
              <p className="text-sm text-gray-600">Total Employees</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalEmployees}</p>
            </div>
            <UserGroupIcon className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Employees</p>
              <p className="text-2xl font-bold text-green-600">{stats.activeEmployees}</p>
            </div>
            <CheckCircleIcon className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Leave Requests</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pendingLeaveRequests}</p>
            </div>
            <CalendarIcon className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Open Positions</p>
              <p className="text-2xl font-bold text-blue-600">{stats.openPositions}</p>
            </div>
            <BriefcaseIcon className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Average Attendance</p>
              <p className="text-2xl font-bold text-gray-900">{stats.averageAttendance.toFixed(1)}%</p>
            </div>
            <ChartBarIcon className="h-8 w-8 text-purple-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Applicants</p>
              <p className="text-2xl font-bold text-orange-600">{stats.totalApplicants}</p>
            </div>
            <UserGroupIcon className="h-8 w-8 text-orange-500" />
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
              <CalendarIcon className="h-5 w-5 text-yellow-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">John Smith requested annual leave (Feb 1-5)</p>
              <p className="text-xs text-gray-500">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <BriefcaseIcon className="h-5 w-5 text-blue-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">Science Teacher position posted - 2 vacancies</p>
              <p className="text-xs text-gray-500">1 day ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <CurrencyDollarIcon className="h-5 w-5 text-green-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">January payroll processed successfully</p>
              <p className="text-xs text-gray-500">5 days ago</p>
            </div>
          </div>
        </div>
      </div>

      {/* Department Distribution */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Department Distribution</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {Object.entries(
              employees.reduce((acc, employee) => {
                acc[employee.employment.department] = (acc[employee.employment.department] || 0) + 1;
                return acc;
              }, {} as Record<string, number>)
            ).map(([department, count]) => (
              <div key={department} className="flex items-center justify-between">
                <span className="text-sm text-gray-900">{department}</span>
                <span className="text-sm font-medium text-gray-900">{count} employees</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderEmployees = () => (
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
                placeholder="Search employees..."
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
              <option value="all">All Employees</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="full_time">Full Time</option>
              <option value="part_time">Part Time</option>
              <option value="contract">Contract</option>
            </select>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Employee
            </button>
          </div>
        </div>
      </div>

      {/* Employees List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="min-w-full divide-y divide-gray-200">
          <div className="bg-gray-50 px-6 py-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">All Employees</h3>
              <span className="text-sm text-gray-500">{employees.length} employees</span>
            </div>
          </div>
          <div className="bg-white divide-y divide-gray-200">
            {employees.map((employee) => (
              <div key={employee.id} className="p-6 hover:bg-gray-50">
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
                          {employee.personalInfo.firstName} {employee.personalInfo.lastName}
                        </h4>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(employee.employment.employmentStatus)}`}>
                          {employee.employment.employmentStatus}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {employee.employment.employeeType.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-gray-500">{employee.employeeId}</span>
                        <span className="text-sm text-gray-500">{employee.employment.position}</span>
                        <span className="text-sm text-gray-500">{employee.employment.department}</span>
                        <span className="text-sm text-gray-500">{employee.personalInfo.emailAddress}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setSelectedItem(employee);
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

  const renderLeave = () => (
    <div className="space-y-6">
      {/* Leave Requests */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Leave Requests</h3>
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
          {leaveRequests.map((request) => (
            <div key={request.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-lg font-medium text-gray-900">{request.employeeName}</h4>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {request.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{request.reason}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-sm text-gray-500">
                      {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                    </span>
                    <span className="text-sm text-gray-500">{request.days} days</span>
                    <span className="text-sm text-gray-500">Requested by: {request.requestedBy}</span>
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

  const renderPayroll = () => (
    <div className="space-y-6">
      {/* Payroll Records */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Payroll Records</h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Process Payroll
            </button>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {payrollRecords.map((record) => (
            <div key={record.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-lg font-medium text-gray-900">{record.employeeName}</h4>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(record.paymentStatus)}`}>
                      {record.paymentStatus}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {record.payPeriod}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-sm text-gray-500">Gross: ZWL {record.grossPay.toLocaleString()}</span>
                    <span className="text-sm text-gray-500">Net: ZWL {record.netPay.toLocaleString()}</span>
                    <span className="text-sm text-gray-500">Method: {record.paymentMethod.replace('_', ' ')}</span>
                    {record.paymentDate && (
                      <span className="text-sm text-gray-500">Paid: {new Date(record.paymentDate).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedItem(record);
                      setShowDetailsModal(true);
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <EyeIcon className="h-5 w-5" />
                  </button>
                  {record.payslipGenerated && (
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <ArrowDownTrayIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderRecruitment = () => (
    <div className="space-y-6">
      {/* Recruitment Positions */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Open Positions</h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Post Position
            </button>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {recruitments.map((recruitment) => (
            <div key={recruitment.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-lg font-medium text-gray-900">{recruitment.position}</h4>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(recruitment.status)}`}>
                      {recruitment.status}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {recruitment.employmentType.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{recruitment.department}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-sm text-gray-500">Vacancies: {recruitment.vacancyCount}</span>
                    <span className="text-sm text-gray-500">Applicants: {recruitment.applicantsCount}</span>
                    <span className="text-sm text-gray-500">
                      ZWL {recruitment.salaryRange.min.toLocaleString()} - {recruitment.salaryRange.max.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-500">Closes: {new Date(recruitment.closingDate!).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedItem(recruitment);
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

  const renderPerformance = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Management</h3>
        <p className="text-gray-600">Performance reviews, KPIs, and goal tracking coming soon...</p>
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
            <h4 className="font-medium text-gray-900">Employee Directory</h4>
            <p className="text-sm text-gray-500">Complete employee list</p>
          </button>
          <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
            <CurrencyDollarIcon className="h-8 w-8 text-green-500 mb-2" />
            <h4 className="font-medium text-gray-900">Payroll Summary</h4>
            <p className="text-sm text-gray-500">Salary and compensation reports</p>
          </button>
          <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
            <CalendarIcon className="h-8 w-8 text-yellow-500 mb-2" />
            <h4 className="font-medium text-gray-900">Leave Analysis</h4>
            <p className="text-sm text-gray-500">Leave balances and usage</p>
          </button>
          <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
            <ChartBarIcon className="h-8 w-8 text-purple-500 mb-2" />
            <h4 className="font-medium text-gray-900">Attendance Report</h4>
            <p className="text-sm text-gray-500">Attendance statistics</p>
          </button>
          <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
            <BriefcaseIcon className="h-8 w-8 text-orange-500 mb-2" />
            <h4 className="font-medium text-gray-900">Recruitment Metrics</h4>
            <p className="text-sm text-gray-500">Hiring and applicant data</p>
          </button>
          <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
            <DocumentTextIcon className="h-8 w-8 text-red-500 mb-2" />
            <h4 className="font-medium text-gray-900">Performance Review</h4>
            <p className="text-sm text-gray-500">Employee performance data</p>
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
              <h1 className="text-xl font-bold text-gray-900">HR Management</h1>
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
              { id: 'employees', name: 'Employees', icon: UserGroupIcon },
              { id: 'leave', name: 'Leave Management', icon: CalendarIcon },
              { id: 'payroll', name: 'Payroll', icon: CurrencyDollarIcon },
              { id: 'recruitment', name: 'Recruitment', icon: BriefcaseIcon },
              { id: 'performance', name: 'Performance', icon: ChartBarIcon },
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
        {activeTab === 'employees' && renderEmployees()}
        {activeTab === 'leave' && renderLeave()}
        {activeTab === 'payroll' && renderPayroll()}
        {activeTab === 'recruitment' && renderRecruitment()}
        {activeTab === 'performance' && renderPerformance()}
        {activeTab === 'reports' && renderReports()}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedItem && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {selectedItem.personalInfo ? `${selectedItem.personalInfo.firstName} ${selectedItem.personalInfo.lastName}` : 
                 selectedItem.employeeName || selectedItem.position || selectedItem.employeeName}
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

export default HRManagement;
