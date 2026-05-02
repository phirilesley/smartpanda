import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  UserGroupIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  CalendarIcon,
  ClockIcon,
  BellIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ArrowPathIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon,
  HomeIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  IdentificationIcon,
  CreditCardIcon,
  ChartBarIcon,
  UserIcon,
  UsersIcon,
  DocumentArrowDownIcon,
  DocumentArrowUpIcon,
  PaperAirplaneIcon,
  InboxIcon,
  FlagIcon,
  BookmarkIcon,
  TagIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  PrinterIcon,
  ClipboardDocumentListIcon,
  ShieldCheckIcon,
  StarIcon,
  FireIcon,
  LightBulbIcon,
  CogIcon,
  ArchiveBoxIcon,
  FolderIcon,
  ReceiptIcon,
  CalculatorIcon,
  TableCellsIcon,
} from '@heroicons/react/24/outline';

// Types
interface Employee {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  hireDate: string;
  status: 'active' | 'inactive' | 'on-leave' | 'terminated';
  employmentType: 'full-time' | 'part-time' | 'contract' | 'intern';
  salary: number;
  workSchedule: string;
  supervisor: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  skills: string[];
  certifications: string[];
  education: Education[];
  performance: Performance[];
  documents: Document[];
}

interface Education {
  id: string;
  degree: string;
  institution: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
}

interface Performance {
  id: string;
  reviewDate: string;
  reviewer: string;
  rating: number;
  goals: string[];
  achievements: string[];
  areasForImprovement: string[];
  comments: string;
  status: 'completed' | 'pending' | 'scheduled';
}

interface Document {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  expiryDate?: string;
  status: 'valid' | 'expired' | 'expiring-soon';
  url: string;
}

interface JobPosting {
  id: string;
  title: string;
  department: string;
  location: string;
  employmentType: string;
  experienceLevel: string;
  salaryRange: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  postedDate: string;
  closingDate: string;
  status: 'active' | 'closed' | 'draft';
  applications: Application[];
}

interface Application {
  id: string;
  jobId: string;
  applicantName: string;
  email: string;
  phone: string;
  coverLetter: string;
  resume: string;
  appliedDate: string;
  status: 'new' | 'under-review' | 'shortlisted' | 'rejected' | 'hired';
  notes: string;
  interviewSchedule?: InterviewSchedule[];
}

interface InterviewSchedule {
  id: string;
  type: string;
  date: string;
  time: string;
  location: string;
  interviewer: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  feedback?: string;
}

interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedDate?: string;
  daysRequested: number;
  attachments: string[];
}

interface Training {
  id: string;
  title: string;
  description: string;
  type: string;
  duration: string;
  cost: number;
  instructor: string;
  location: string;
  startDate: string;
  endDate: string;
  capacity: number;
  enrolled: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  participants: Participant[];
  materials: string[];
}

interface Participant {
  id: string;
  employeeId: string;
  name: string;
  department: string;
  enrollmentDate: string;
  status: 'enrolled' | 'completed' | 'dropped';
  progress?: number;
  certificate?: string;
}

interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  payPeriod: string;
  payDate: string;
  baseSalary: number;
  overtime: number;
  bonuses: number;
  deductions: number;
  netPay: number;
  status: 'draft' | 'processed' | 'paid';
  bankAccount: string;
  taxInfo: string;
}

interface Benefit {
  id: string;
  name: string;
  type: string;
  description: string;
  eligibility: string;
  coverage: string;
  cost: number;
  employerContribution: number;
  employeeContribution: number;
  status: 'active' | 'inactive';
  enrollmentDeadline?: string;
  documents: string[];
}

export const HumanResources: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'employees' | 'recruitment' | 'leave' | 'training' | 'payroll' | 'benefits' | 'performance' | 'documents'>('dashboard');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [training, setTraining] = useState<Training[]>([]);
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([]);
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);

  useEffect(() => {
    // Load mock data
    setTimeout(() => {
      setEmployees([
        {
          id: '1',
          employeeId: 'EMP001',
          firstName: 'Sarah',
          lastName: 'Johnson',
          email: 'sarah.johnson@smartpanda.edu',
          phone: '+1-555-0123',
          position: 'Senior Teacher',
          department: 'Academics',
          hireDate: '2020-08-15',
          status: 'active',
          employmentType: 'full-time',
          salary: 65000,
          workSchedule: 'Monday-Friday, 8:00 AM - 4:00 PM',
          supervisor: 'Dr. Michael Chen',
          emergencyContact: {
            name: 'John Johnson',
            relationship: 'Spouse',
            phone: '+1-555-0124',
          },
          address: {
            street: '123 Main St',
            city: 'Springfield',
            state: 'IL',
            zipCode: '62701',
            country: 'USA',
          },
          skills: ['Mathematics', 'Curriculum Development', 'Student Assessment'],
          certifications: ['Teaching License', 'Advanced Mathematics'],
          education: [
            {
              id: '1',
              degree: 'Master of Education',
              institution: 'University of Illinois',
              field: 'Mathematics Education',
              startDate: '2018-09-01',
              endDate: '2020-05-15',
              gpa: '3.8',
            },
          ],
          performance: [
            {
              id: '1',
              reviewDate: '2023-12-15',
              reviewer: 'Dr. Michael Chen',
              rating: 4.5,
              goals: ['Implement new teaching methods', 'Mentor junior teachers'],
              achievements: ['Improved student test scores by 15%', 'Led curriculum revision'],
              areasForImprovement: ['Time management', 'Technology integration'],
              comments: 'Excellent teacher with strong leadership skills',
              status: 'completed',
            },
          ],
          documents: [
            {
              id: '1',
              name: 'Teaching License',
              type: 'Certification',
              uploadDate: '2020-08-01',
              expiryDate: '2025-08-01',
              status: 'valid',
              url: '/documents/license.pdf',
            },
          ],
        },
        {
          id: '2',
          employeeId: 'EMP002',
          firstName: 'Michael',
          lastName: 'Chen',
          email: 'michael.chen@smartpanda.edu',
          phone: '+1-555-0125',
          position: 'Operations Manager',
          department: 'Administration',
          hireDate: '2019-06-01',
          status: 'active',
          employmentType: 'full-time',
          salary: 75000,
          workSchedule: 'Monday-Friday, 9:00 AM - 5:00 PM',
          supervisor: 'Director of Operations',
          emergencyContact: {
            name: 'Emily Chen',
            relationship: 'Spouse',
            phone: '+1-555-0126',
          },
          address: {
            street: '456 Oak Ave',
            city: 'Springfield',
            state: 'IL',
            zipCode: '62702',
            country: 'USA',
          },
          skills: ['Operations Management', 'Budget Planning', 'Team Leadership'],
          certifications: ['PMP', 'Six Sigma'],
          education: [
            {
              id: '1',
              degree: 'MBA',
              institution: 'Northwestern University',
              field: 'Business Administration',
              startDate: '2017-09-01',
              endDate: '2019-05-15',
              gpa: '3.9',
            },
          ],
          performance: [
            {
              id: '1',
              reviewDate: '2023-12-10',
              reviewer: 'Director of Operations',
              rating: 4.7,
              goals: ['Optimize operational efficiency', 'Reduce costs by 10%'],
              achievements: ['Implemented new inventory system', 'Reduced operational costs by 12%'],
              areasForImprovement: ['Staff training programs', 'Technology adoption'],
              comments: 'Outstanding performance with excellent results',
              status: 'completed',
            },
          ],
          documents: [
            {
              id: '1',
              name: 'PMP Certificate',
              type: 'Certification',
              uploadDate: '2019-05-20',
              expiryDate: '2024-05-20',
              status: 'expiring-soon',
              url: '/documents/pmp.pdf',
            },
          ],
        },
      ]);

      setJobPostings([
        {
          id: '1',
          title: 'Mathematics Teacher',
          department: 'Academics',
          location: 'Springfield, IL',
          employmentType: 'Full-time',
          experienceLevel: 'Mid-level',
          salaryRange: '$50,000 - $70,000',
          description: 'We are seeking a passionate Mathematics Teacher to join our academic team.',
          requirements: ['Bachelor\'s degree in Mathematics or Education', 'Teaching license', '2+ years experience'],
          responsibilities: ['Teach mathematics to grades 9-12', 'Develop curriculum', 'Assess student progress'],
          benefits: ['Health insurance', 'Retirement plan', 'Professional development'],
          postedDate: '2024-01-15',
          closingDate: '2024-02-15',
          status: 'active',
          applications: [
            {
              id: '1',
              jobId: '1',
              applicantName: 'John Doe',
              email: 'john.doe@email.com',
              phone: '+1-555-0130',
              coverLetter: 'Experienced mathematics teacher...',
              resume: 'resume.pdf',
              appliedDate: '2024-01-16',
              status: 'under-review',
              notes: 'Strong candidate with good experience',
            },
          ],
        },
      ]);

      setLeaveRequests([
        {
          id: '1',
          employeeId: 'EMP001',
          employeeName: 'Sarah Johnson',
          leaveType: 'Annual Leave',
          startDate: '2024-02-01',
          endDate: '2024-02-05',
          reason: 'Family vacation',
          status: 'approved',
          approvedBy: 'Dr. Michael Chen',
          approvedDate: '2024-01-20',
          daysRequested: 5,
          attachments: [],
        },
        {
          id: '2',
          employeeId: 'EMP002',
          employeeName: 'Michael Chen',
          leaveType: 'Sick Leave',
          startDate: '2024-01-18',
          endDate: '2024-01-19',
          reason: 'Medical appointment',
          status: 'pending',
          daysRequested: 2,
          attachments: ['doctor_note.pdf'],
        },
      ]);

      setTraining([
        {
          id: '1',
          title: 'Advanced Teaching Methods',
          description: 'Professional development for teachers on modern teaching techniques',
          type: 'Workshop',
          duration: '2 days',
          cost: 500,
          instructor: 'Dr. Jane Smith',
          location: 'Conference Room A',
          startDate: '2024-02-10',
          endDate: '2024-02-11',
          capacity: 20,
          enrolled: 15,
          status: 'upcoming',
          participants: [
            {
              id: '1',
              employeeId: 'EMP001',
              name: 'Sarah Johnson',
              department: 'Academics',
              enrollmentDate: '2024-01-15',
              status: 'enrolled',
            },
          ],
          materials: ['workbook.pdf', 'presentation.pptx'],
        },
      ]);

      setPayrollRecords([
        {
          id: '1',
          employeeId: 'EMP001',
          employeeName: 'Sarah Johnson',
          payPeriod: 'January 2024',
          payDate: '2024-01-31',
          baseSalary: 5416.67,
          overtime: 300,
          bonuses: 200,
          deductions: 1200,
          netPay: 4716.67,
          status: 'paid',
          bankAccount: '****1234',
          taxInfo: 'TX-12345',
        },
      ]);

      setBenefits([
        {
          id: '1',
          name: 'Health Insurance',
          type: 'Medical',
          description: 'Comprehensive health coverage for employees and dependents',
          eligibility: 'Full-time employees',
          coverage: 'Medical, Dental, Vision',
          cost: 800,
          employerContribution: 600,
          employeeContribution: 200,
          status: 'active',
          enrollmentDeadline: '2024-01-31',
          documents: ['plan_summary.pdf', 'enrollment_form.pdf'],
        },
        {
          id: '2',
          name: '401(k) Retirement Plan',
          type: 'Retirement',
          description: 'Company-sponsored retirement savings plan with matching',
          eligibility: 'Employees after 6 months',
          coverage: 'Up to 6% employer match',
          cost: 0,
          employerContribution: 0,
          employeeContribution: 0,
          status: 'active',
          documents: ['401k_plan.pdf'],
        },
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'completed':
      case 'approved':
      case 'paid':
      case 'valid':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending':
      case 'under-review':
      case 'draft':
      case 'scheduled':
      case 'expiring-soon':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'inactive':
      case 'rejected':
      case 'terminated':
      case 'expired':
      case 'cancelled':
      case 'closed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'on-leave':
      case 'shortlisted':
      case 'ongoing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Human Resources</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage employees, recruitment, and HR operations</p>
      </div>

      {/* Alert */}
      <div className="mb-6 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-center">
          <BellIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3" />
          <div>
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">HR Updates</h3>
            <p className="text-sm text-blue-700 dark:text-blue-300">2 pending leave requests and 3 job applications to review</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: ChartBarIcon },
            { id: 'employees', label: 'Employees', icon: UsersIcon },
            { id: 'recruitment', label: 'Recruitment', icon: BriefcaseIcon },
            { id: 'leave', label: 'Leave Management', icon: CalendarIcon },
            { id: 'training', label: 'Training', icon: AcademicCapIcon },
            { id: 'payroll', label: 'Payroll', icon: CurrencyDollarIcon },
            { id: 'benefits', label: 'Benefits', icon: ShieldCheckIcon },
            { id: 'performance', label: 'Performance', icon: StarIcon },
            { id: 'documents', label: 'Documents', icon: DocumentTextIcon },
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
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Employees</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">48</p>
                </div>
                <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-3">
                  <UsersIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-green-600 dark:text-green-400">+3</span>
                <span className="text-gray-500 dark:text-gray-400 ml-2">new hires this month</span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Open Positions</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">5</p>
                </div>
                <div className="bg-yellow-100 dark:bg-yellow-900 rounded-full p-3">
                  <BriefcaseIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-yellow-600 dark:text-yellow-400">12</span>
                <span className="text-gray-500 dark:text-gray-400 ml-2">applications pending</span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Leave Requests</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">2</p>
                </div>
                <div className="bg-purple-100 dark:bg-purple-900 rounded-full p-3">
                  <CalendarIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-yellow-600 dark:text-yellow-400">1 pending</span>
                <span className="text-gray-500 dark:text-gray-400 ml-2">approval needed</span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Training Sessions</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">3</p>
                </div>
                <div className="bg-green-100 dark:bg-green-900 rounded-full p-3">
                  <AcademicCapIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-green-600 dark:text-green-400">15</span>
                <span className="text-gray-500 dark:text-gray-400 ml-2">employees enrolled</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'employees' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Employee Directory</h2>
                <div className="flex items-center space-x-3">
                  <button className="flex items-center px-3 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add Employee
                  </button>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Employee</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Position</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Hire Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {employees.map((employee) => (
                    <tr key={employee.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-primary-500 flex items-center justify-center">
                              <span className="text-white font-medium">
                                {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {employee.firstName} {employee.lastName}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{employee.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{employee.position}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{employee.department}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(employee.status)}`}>
                          {employee.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{employee.hireDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => setSelectedEmployee(employee)}
                          className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 mr-3"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300">
                          <PencilIcon className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'recruitment' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {jobPostings.map((job) => (
              <div key={job.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{job.title}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(job.status)}`}>
                    {job.status}
                  </span>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Department</span>
                    <span className="font-medium text-gray-900 dark:text-white">{job.department}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Location</span>
                    <span className="font-medium text-gray-900 dark:text-white">{job.location}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Type</span>
                    <span className="font-medium text-gray-900 dark:text-white">{job.employmentType}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Salary Range</span>
                    <span className="font-medium text-gray-900 dark:text-white">{job.salaryRange}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Applications</span>
                    <span className="font-medium text-gray-900 dark:text-white">{job.applications.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Closing Date</span>
                    <span className="font-medium text-gray-900 dark:text-white">{job.closingDate}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{job.description}</p>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setSelectedJob(job)}
                    className="flex items-center text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                  >
                    <EyeIcon className="w-4 h-4 mr-1" />
                    View Details
                  </button>
                  <div className="flex items-center space-x-2">
                    <button className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300">
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300">
                      <UsersIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'leave' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Leave Requests</h2>
                <button className="flex items-center px-3 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                  <PlusIcon className="w-4 h-4 mr-2" />
                  New Request
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Employee</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Leave Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Dates</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Days</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {leaveRequests.map((leave) => (
                    <tr key={leave.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{leave.employeeName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{leave.leaveType}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {leave.startDate} - {leave.endDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{leave.daysRequested}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(leave.status)}`}>
                          {leave.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 mr-3">
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300">
                          <PencilIcon className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'training' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {training.map((program) => (
              <div key={program.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{program.title}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(program.status)}`}>
                    {program.status}
                  </span>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Type</span>
                    <span className="font-medium text-gray-900 dark:text-white">{program.type}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Duration</span>
                    <span className="font-medium text-gray-900 dark:text-white">{program.duration}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Instructor</span>
                    <span className="font-medium text-gray-900 dark:text-white">{program.instructor}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Enrollment</span>
                    <span className="font-medium text-gray-900 dark:text-white">{program.enrolled}/{program.capacity}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Dates</span>
                    <span className="font-medium text-gray-900 dark:text-white">{program.startDate} - {program.endDate}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Cost</span>
                    <span className="font-medium text-gray-900 dark:text-white">${program.cost}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{program.description}</p>
                <div className="flex items-center justify-between">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-4">
                    <div
                      className="bg-primary-600 h-2 rounded-full"
                      style={{ width: `${(program.enrolled / program.capacity) * 100}%` }}
                    />
                  </div>
                  <button className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300">
                    <EyeIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'payroll' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Payroll Records</h2>
                <button className="flex items-center px-3 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                  <PlusIcon className="w-4 h-4 mr-2" />
                    Process Payroll
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Employee</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Pay Period</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Pay Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Base Salary</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Net Pay</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {payrollRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{record.employeeName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{record.payPeriod}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{record.payDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">${record.baseSalary.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">${record.netPay.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(record.status)}`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 mr-3">
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300">
                          <ArrowDownTrayIcon className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'benefits' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {benefits.map((benefit) => (
              <div key={benefit.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{benefit.name}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(benefit.status)}`}>
                    {benefit.status}
                  </span>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Type</span>
                    <span className="font-medium text-gray-900 dark:text-white">{benefit.type}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Eligibility</span>
                    <span className="font-medium text-gray-900 dark:text-white">{benefit.eligibility}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Coverage</span>
                    <span className="font-medium text-gray-900 dark:text-white">{benefit.coverage}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Employer Contribution</span>
                    <span className="font-medium text-gray-900 dark:text-white">${benefit.employerContribution}/month</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Employee Contribution</span>
                    <span className="font-medium text-gray-900 dark:text-white">${benefit.employeeContribution}/month</span>
                  </div>
                  {benefit.enrollmentDeadline && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Enrollment Deadline</span>
                      <span className="font-medium text-gray-900 dark:text-white">{benefit.enrollmentDeadline}</span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{benefit.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {benefit.documents.map((doc, index) => (
                      <span key={index} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full">
                        📎 {doc}
                      </span>
                    ))}
                  </div>
                  <button className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300">
                    <EyeIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Performance Reviews</h2>
                <button className="flex items-center px-3 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Schedule Review
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {employees.flatMap((employee) =>
                  employee.performance.map((review) => (
                    <div key={`${employee.id}-${review.id}`} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">{employee.firstName} {employee.lastName}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Review Date: {review.reviewDate}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">Rating:</span>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <StarIcon
                                  key={i}
                                  className={`w-4 h-4 ${i < Math.floor(review.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                />
                              ))}
                              <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">{review.rating}</span>
                            </div>
                          </div>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(review.status)}`}>
                            {review.status}
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">Goals</p>
                          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                            {review.goals.map((goal, index) => (
                              <li key={index} className="flex items-center">
                                <CheckCircleIcon className="w-3 h-3 text-green-500 mr-2" />
                                {goal}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">Achievements</p>
                          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                            {review.achievements.map((achievement, index) => (
                              <li key={index} className="flex items-center">
                                <StarIcon className="w-3 h-3 text-yellow-500 mr-2" />
                                {achievement}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">Areas for Improvement</p>
                          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                            {review.areasForImprovement.map((area, index) => (
                              <li key={index} className="flex items-center">
                                <LightBulbIcon className="w-3 h-3 text-blue-500 mr-2" />
                                {area}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-medium">Reviewer:</span> {review.reviewer}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{review.comments}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {employees.flatMap((employee) =>
              employee.documents.map((document) => (
                <div key={`${employee.id}-${document.id}`} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{document.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{employee.firstName} {employee.lastName}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(document.status)}`}>
                      {document.status}
                    </span>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Type</span>
                      <span className="font-medium text-gray-900 dark:text-white">{document.type}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Upload Date</span>
                      <span className="font-medium text-gray-900 dark:text-white">{document.uploadDate}</span>
                    </div>
                    {document.expiryDate && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Expiry Date</span>
                        <span className="font-medium text-gray-900 dark:text-white">{document.expiryDate}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <button className="flex items-center text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300">
                      <ArrowDownTrayIcon className="w-4 h-4 mr-1" />
                      Download
                    </button>
                    <div className="flex items-center space-x-2">
                      <button className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300">
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300">
                        <PencilIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </motion.div>

      {/* Employee Detail Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Employee Details</h3>
                <button
                  onClick={() => setSelectedEmployee(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full bg-primary-500 flex items-center justify-center mb-4">
                      <span className="text-white text-2xl font-medium">
                        {selectedEmployee.firstName.charAt(0)}{selectedEmployee.lastName.charAt(0)}
                      </span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {selectedEmployee.firstName} {selectedEmployee.lastName}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{selectedEmployee.position}</p>
                    <span className={`mt-2 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedEmployee.status)}`}>
                      {selectedEmployee.status}
                    </span>
                  </div>
                </div>
                <div className="lg:col-span-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Employee ID</p>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedEmployee.employeeId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Department</p>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedEmployee.department}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedEmployee.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedEmployee.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Employment Type</p>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedEmployee.employmentType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Hire Date</p>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedEmployee.hireDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Salary</p>
                      <p className="font-medium text-gray-900 dark:text-white">${selectedEmployee.salary.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Supervisor</p>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedEmployee.supervisor}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h5 className="text-md font-semibold text-gray-900 dark:text-white mb-4">Skills & Certifications</h5>
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedEmployee.skills.map((skill, index) => (
                    <span key={index} className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedEmployee.certifications.map((cert, index) => (
                    <span key={index} className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
                      {cert}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h5 className="text-md font-semibold text-gray-900 dark:text-white mb-4">Performance Reviews</h5>
                <div className="space-y-3">
                  {selectedEmployee.performance.map((review) => (
                    <div key={review.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{review.reviewDate}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Reviewer: {review.reviewer}</p>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-900 dark:text-white mr-2">{review.rating}</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <StarIcon
                                key={i}
                                className={`w-3 h-3 ${i < Math.floor(review.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{review.comments}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Job Posting Detail Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Job Posting Details</h3>
                <button
                  onClick={() => setSelectedJob(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{selectedJob.title}</h4>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedJob.status)}`}>
                  {selectedJob.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Department</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedJob.department}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Location</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedJob.location}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Employment Type</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedJob.employmentType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Experience Level</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedJob.experienceLevel}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Salary Range</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedJob.salaryRange}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Posted Date</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedJob.postedDate}</p>
                </div>
              </div>

              <div className="mb-6">
                <h5 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Description</h5>
                <p className="text-sm text-gray-600 dark:text-gray-400">{selectedJob.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h5 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Requirements</h5>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    {selectedJob.requirements.map((req, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircleIcon className="w-3 h-3 text-green-500 mr-2" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Responsibilities</h5>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    {selectedJob.responsibilities.map((resp, index) => (
                      <li key={index} className="flex items-center">
                        <ArrowPathIcon className="w-3 h-3 text-blue-500 mr-2" />
                        {resp}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mb-6">
                <h5 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Benefits</h5>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  {selectedJob.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center">
                      <StarIcon className="w-3 h-3 text-yellow-500 mr-2" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <h5 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Applications ({selectedJob.applications.length})</h5>
                <div className="space-y-2">
                  {selectedJob.applications.map((app) => (
                    <div key={app.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{app.applicantName}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">{app.email} | Applied: {app.appliedDate}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(app.status)}`}>
                          {app.status}
                        </span>
                      </div>
                      {app.notes && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{app.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
