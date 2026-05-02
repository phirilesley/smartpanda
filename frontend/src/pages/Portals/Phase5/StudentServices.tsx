import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  UserGroupIcon,
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
  BriefcaseIcon,
  HeartIcon,
  ChatBubbleLeftRightIcon,
  QuestionMarkCircleIcon,
  NewspaperIcon,
  TrophyIcon,
  GiftIcon,
  MusicalNoteIcon,
  PaintBrushIcon,
  BanknotesIcon,
  HomeModernIcon,
} from '@heroicons/react/24/outline';

// Types
interface StudentService {
  id: string;
  name: string;
  category: string;
  description: string;
  location: string;
  contact: {
    phone: string;
    email: string;
    website?: string;
  };
  hours: string;
  services: string[];
  staff: StaffMember[];
  appointments: boolean;
  status: 'active' | 'inactive' | 'limited';
}

interface StaffMember {
  id: string;
  name: string;
  title: string;
  department: string;
  email: string;
  phone: string;
  specialization: string[];
  availability: string;
}

interface CounselingSession {
  id: string;
  studentId: string;
  studentName: string;
  counselorId: string;
  counselorName: string;
  type: string;
  date: string;
  time: string;
  duration: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  notes: string;
  followUp: boolean;
  nextSession?: string;
}

interface CareerService {
  id: string;
  title: string;
  type: string;
  description: string;
  date: string;
  time: string;
  location: string;
  presenter: string;
  capacity: number;
  registered: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  targetAudience: string[];
  materials: string[];
}

interface HealthRecord {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  type: string;
  provider: string;
  description: string;
  diagnosis?: string;
  treatment?: string;
  medication?: string;
  followUpRequired: boolean;
  followUpDate?: string;
  confidential: boolean;
}

interface HousingApplication {
  id: string;
  studentId: string;
  studentName: string;
  applicationDate: string;
  semester: string;
  housingType: string;
  preferences: string[];
  status: 'pending' | 'approved' | 'rejected' | 'waitlisted';
  roomAssignment?: RoomAssignment;
  priority: number;
  specialNeeds?: string;
}

interface RoomAssignment {
  building: string;
  room: string;
  roommate?: string;
  moveInDate: string;
  checkOutDate?: string;
}

interface FinancialAid {
  id: string;
  studentId: string;
  studentName: string;
  type: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'disbursed';
  applicationDate: string;
  awardDate?: string;
  disbursementDate?: string;
  requirements: string[];
  documents: string[];
  gpaRequirement: number;
}

interface StudentClub {
  id: string;
  name: string;
  category: string;
  description: string;
  advisor: string;
  president: string;
  email: string;
  meetingTime: string;
  location: string;
  memberCount: number;
  status: 'active' | 'inactive' | 'suspended';
  dues: number;
  events: ClubEvent[];
}

interface ClubEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  attendees: number;
}

interface CampusEvent {
  id: string;
  title: string;
  type: string;
  description: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  expectedAttendance: number;
  registered: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  cost?: number;
  openToPublic: boolean;
  registrationRequired: boolean;
}

interface SupportRequest {
  id: string;
  studentId: string;
  studentName: string;
  type: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  description: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  assignedTo?: string;
  createdDate: string;
  resolvedDate?: string;
  resolution?: string;
  category: string;
}

export const StudentServices: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'counseling' | 'career' | 'health' | 'housing' | 'financial' | 'clubs' | 'events' | 'support'>('dashboard');
  const [studentServices, setStudentServices] = useState<StudentService[]>([]);
  const [counselingSessions, setCounselingSessions] = useState<CounselingSession[]>([]);
  const [careerServices, setCareerServices] = useState<CareerService[]>([]);
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);
  const [housingApplications, setHousingApplications] = useState<HousingApplication[]>([]);
  const [financialAid, setFinancialAid] = useState<FinancialAid[]>([]);
  const [studentClubs, setStudentClubs] = useState<StudentClub[]>([]);
  const [campusEvents, setCampusEvents] = useState<CampusEvent[]>([]);
  const [supportRequests, setSupportRequests] = useState<SupportRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<StudentService | null>(null);
  const [selectedClub, setSelectedClub] = useState<StudentClub | null>(null);

  useEffect(() => {
    // Load mock data
    setTimeout(() => {
      setStudentServices([
        {
          id: '1',
          name: 'Counseling Center',
          category: 'Mental Health',
          description: 'Professional counseling services for students',
          location: 'Student Center, Room 205',
          contact: {
            phone: '+1-555-0101',
            email: 'counseling@smartpanda.edu',
            website: 'www.smartpanda.edu/counseling',
          },
          hours: 'Monday-Friday 9:00 AM - 5:00 PM',
          services: ['Individual Counseling', 'Group Therapy', 'Crisis Intervention', 'Career Counseling'],
          staff: [
            {
              id: '1',
              name: 'Dr. Sarah Johnson',
              title: 'Director of Counseling',
              department: 'Student Services',
              email: 'sarah.johnson@smartpanda.edu',
              phone: '+1-555-0102',
              specialization: ['Anxiety', 'Depression', 'Stress Management'],
              availability: 'Monday, Wednesday, Friday',
            },
          ],
          appointments: true,
          status: 'active',
        },
        {
          id: '2',
          name: 'Career Services',
          category: 'Career Development',
          description: 'Career planning and job search assistance',
          location: 'Academic Building, Room 150',
          contact: {
            phone: '+1-555-0103',
            email: 'careers@smartpanda.edu',
          },
          hours: 'Monday-Thursday 8:00 AM - 6:00 PM, Friday 8:00 AM - 5:00 PM',
          services: ['Resume Writing', 'Interview Preparation', 'Job Search', 'Career Assessments'],
          staff: [
            {
              id: '2',
              name: 'Michael Chen',
              title: 'Career Advisor',
              department: 'Career Services',
              email: 'michael.chen@smartpanda.edu',
              phone: '+1-555-0104',
              specialization: ['Resume Writing', 'Interview Skills', 'Networking'],
              availability: 'Tuesday, Thursday',
            },
          ],
          appointments: true,
          status: 'active',
        },
        {
          id: '3',
          name: 'Health Center',
          category: 'Health Services',
          description: 'Medical and health services for students',
          location: 'Health Services Building',
          contact: {
            phone: '+1-555-0105',
            email: 'health@smartpanda.edu',
          },
          hours: 'Monday-Friday 8:00 AM - 6:00 PM, Saturday 10:00 AM - 2:00 PM',
          services: ['Primary Care', 'Immunizations', 'Health Education', 'Emergency Care'],
          staff: [
            {
              id: '3',
              name: 'Dr. Emily Davis',
              title: 'Medical Director',
              department: 'Health Services',
              email: 'emily.davis@smartpanda.edu',
              phone: '+1-555-0106',
              specialization: ['Primary Care', 'Student Health', 'Preventive Medicine'],
              availability: 'Monday-Friday',
            },
          ],
          appointments: true,
          status: 'active',
        },
      ]);

      setCounselingSessions([
        {
          id: '1',
          studentId: 'STU001',
          studentName: 'John Doe',
          counselorId: '1',
          counselorName: 'Dr. Sarah Johnson',
          type: 'Individual Counseling',
          date: '2024-01-20',
          time: '2:00 PM',
          duration: '1 hour',
          status: 'completed',
          notes: 'Discussed stress management techniques and academic pressure',
          followUp: true,
          nextSession: '2024-01-27',
        },
        {
          id: '2',
          studentId: 'STU002',
          studentName: 'Jane Smith',
          counselorId: '1',
          counselorName: 'Dr. Sarah Johnson',
          type: 'Career Counseling',
          date: '2024-01-22',
          time: '10:00 AM',
          duration: '1 hour',
          status: 'scheduled',
          notes: '',
          followUp: false,
        },
      ]);

      setCareerServices([
        {
          id: '1',
          title: 'Resume Writing Workshop',
          type: 'Workshop',
          description: 'Learn how to create an effective resume',
          date: '2024-01-25',
          time: '2:00 PM - 4:00 PM',
          location: 'Career Center, Room 101',
          presenter: 'Michael Chen',
          capacity: 25,
          registered: 18,
          status: 'upcoming',
          targetAudience: ['All Students', 'Graduating Seniors'],
          materials: ['Resume Template', 'Cover Letter Guide'],
        },
        {
          id: '2',
          title: 'Mock Interview Day',
          type: 'Event',
          description: 'Practice your interview skills with professionals',
          date: '2024-02-01',
          time: '9:00 AM - 5:00 PM',
          location: 'Career Center',
          presenter: 'Various Industry Professionals',
          capacity: 40,
          registered: 32,
          status: 'upcoming',
          targetAudience: ['Juniors', 'Seniors', 'Graduate Students'],
          materials: ['Interview Questions', 'Evaluation Form'],
        },
      ]);

      setHealthRecords([
        {
          id: '1',
          studentId: 'STU001',
          studentName: 'John Doe',
          date: '2024-01-15',
          type: 'General Check-up',
          provider: 'Dr. Emily Davis',
          description: 'Annual physical examination',
          diagnosis: 'Healthy',
          treatment: 'No treatment required',
          medication: '',
          followUpRequired: false,
          confidential: true,
        },
        {
          id: '2',
          studentId: 'STU002',
          studentName: 'Jane Smith',
          date: '2024-01-18',
          type: 'Urgent Care',
          provider: 'Dr. Emily Davis',
          description: 'Treatment for flu symptoms',
          diagnosis: 'Influenza Type A',
          treatment: 'Prescribed antiviral medication',
          medication: 'Tamiflu',
          followUpRequired: true,
          followUpDate: '2024-01-25',
          confidential: true,
        },
      ]);

      setHousingApplications([
        {
          id: '1',
          studentId: 'STU001',
          studentName: 'John Doe',
          applicationDate: '2024-01-10',
          semester: 'Fall 2024',
          housingType: 'Dormitory',
          preferences: ['Quiet floor', 'Single room', 'Near engineering building'],
          status: 'approved',
          roomAssignment: {
            building: 'North Hall',
            room: '304',
            roommate: 'James Wilson',
            moveInDate: '2024-08-20',
          },
          priority: 2,
        },
        {
          id: '2',
          studentId: 'STU002',
          studentName: 'Jane Smith',
          applicationDate: '2024-01-12',
          semester: 'Fall 2024',
          housingType: 'Apartment',
          preferences: ['2-bedroom', 'Kitchen access', 'Parking'],
          status: 'pending',
          priority: 3,
          specialNeeds: 'ADA accessible',
        },
      ]);

      setFinancialAid([
        {
          id: '1',
          studentId: 'STU001',
          studentName: 'John Doe',
          type: 'Federal Pell Grant',
          amount: 6000,
          status: 'approved',
          applicationDate: '2024-01-05',
          awardDate: '2024-01-15',
          disbursementDate: '2024-08-15',
          requirements: ['FAFSA submitted', 'Satisfactory academic progress'],
          documents: ['FAFSA', 'Tax Returns', 'Enrollment Verification'],
          gpaRequirement: 2.0,
        },
        {
          id: '2',
          studentId: 'STU002',
          studentName: 'Jane Smith',
          type: 'Academic Scholarship',
          amount: 8000,
          status: 'pending',
          applicationDate: '2024-01-08',
          requirements: ['Essay submission', 'Letters of recommendation', 'Transcript'],
          documents: ['Application Form', 'Essay', 'Transcript'],
          gpaRequirement: 3.5,
        },
      ]);

      setStudentClubs([
        {
          id: '1',
          name: 'Student Government Association',
          category: 'Government',
          description: 'Representing student interests and organizing campus events',
          advisor: 'Dr. Robert Wilson',
          president: 'Sarah Johnson',
          email: 'sga@smartpanda.edu',
          meetingTime: 'Wednesday 6:00 PM',
          location: 'Student Center, Room 101',
          memberCount: 45,
          status: 'active',
          dues: 25,
          events: [
            {
              id: '1',
              title: 'Spring Festival Planning',
              date: '2024-01-24',
              time: '7:00 PM',
              location: 'Student Center',
              description: 'Planning meeting for spring festival',
              attendees: 32,
            },
          ],
        },
        {
          id: '2',
          name: 'Computer Science Club',
          category: 'Academic',
          description: 'Exploring technology and programming concepts',
          advisor: 'Prof. Michael Chen',
          president: 'David Lee',
          email: 'csc@smartpanda.edu',
          meetingTime: 'Thursday 5:00 PM',
          location: 'Tech Building, Room 205',
          memberCount: 28,
          status: 'active',
          dues: 15,
          events: [
            {
              id: '2',
              title: 'Hackathon 2024',
              date: '2024-02-10',
              time: '9:00 AM',
              location: 'Tech Building',
              description: '24-hour programming competition',
              attendees: 45,
            },
          ],
        },
      ]);

      setCampusEvents([
        {
          id: '1',
          title: 'Spring Festival',
          type: 'Cultural',
          description: 'Annual spring celebration with music, food, and activities',
          date: '2024-03-15',
          time: '12:00 PM - 8:00 PM',
          location: 'Campus Quad',
          organizer: 'Student Activities',
          expectedAttendance: 500,
          registered: 234,
          status: 'upcoming',
          cost: 0,
          openToPublic: true,
          registrationRequired: false,
        },
        {
          id: '2',
          title: 'Career Fair 2024',
          type: 'Career',
          description: 'Meet with employers and explore career opportunities',
          date: '2024-02-20',
          time: '10:00 AM - 3:00 PM',
          location: 'Sports Complex',
          organizer: 'Career Services',
          expectedAttendance: 300,
          registered: 156,
          status: 'upcoming',
          cost: 0,
          openToPublic: true,
          registrationRequired: true,
        },
      ]);

      setSupportRequests([
        {
          id: '1',
          studentId: 'STU001',
          studentName: 'John Doe',
          type: 'Technical Support',
          priority: 'high',
          description: 'Unable to access online course materials',
          status: 'in-progress',
          assignedTo: 'IT Support Team',
          createdDate: '2024-01-19',
          category: 'Technology',
        },
        {
          id: '2',
          studentId: 'STU002',
          studentName: 'Jane Smith',
          type: 'Academic Advising',
          priority: 'medium',
          description: 'Need help with course registration for next semester',
          status: 'open',
          createdDate: '2024-01-20',
          category: 'Academic',
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
      case 'disbursed':
      case 'upcoming':
      case 'resolved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending':
      case 'scheduled':
      case 'in-progress':
      case 'ongoing':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'inactive':
      case 'cancelled':
      case 'rejected':
      case 'closed':
      case 'suspended':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'limited':
      case 'waitlisted':
      case 'no-show':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Student Services</h1>
        <p className="text-gray-600 dark:text-gray-400">Comprehensive support services for student success</p>
      </div>

      {/* Alert */}
      <div className="mb-6 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-800 rounded-lg p-4">
        <div className="flex items-center">
          <BellIcon className="w-5 h-5 text-green-600 dark:text-green-400 mr-3" />
          <div>
            <h3 className="text-sm font-medium text-green-800 dark:text-green-200">Student Services Updates</h3>
            <p className="text-sm text-green-700 dark:text-green-300">Career Fair registration now open. Housing applications for Fall 2024 being accepted.</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: ChartBarIcon },
            { id: 'counseling', label: 'Counseling', icon: HeartIcon },
            { id: 'career', label: 'Career Services', icon: BriefcaseIcon },
            { id: 'health', label: 'Health Services', icon: ShieldCheckIcon },
            { id: 'housing', label: 'Housing', icon: HomeModernIcon },
            { id: 'financial', label: 'Financial Aid', icon: BanknotesIcon },
            { id: 'clubs', label: 'Student Clubs', icon: UserGroupIcon },
            { id: 'events', label: 'Campus Events', icon: CalendarIcon },
            { id: 'support', label: 'Support', icon: QuestionMarkCircleIcon },
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
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Services</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">12</p>
                </div>
                <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-3">
                  <BuildingOfficeIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-green-600 dark:text-green-400">All operational</span>
                <span className="text-gray-500 dark:text-gray-400 ml-2">services available</span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Counseling Sessions</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">156</p>
                </div>
                <div className="bg-purple-100 dark:bg-purple-900 rounded-full p-3">
                  <HeartIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-yellow-600 dark:text-yellow-400">8</span>
                <span className="text-gray-500 dark:text-gray-400 ml-2">scheduled this week</span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Student Clubs</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">48</p>
                </div>
                <div className="bg-green-100 dark:bg-green-900 rounded-full p-3">
                  <UserGroupIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-green-600 dark:text-green-400">1,247</span>
                <span className="text-gray-500 dark:text-gray-400 ml-2">total members</span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Support Requests</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">23</p>
                </div>
                <div className="bg-orange-100 dark:bg-orange-900 rounded-full p-3">
                  <QuestionMarkCircleIcon className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-yellow-600 dark:text-yellow-400">5</span>
                <span className="text-gray-500 dark:text-gray-400 ml-2">awaiting response</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'counseling' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Counseling Services</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {studentServices
                    .filter(service => service.category === 'Mental Health')
                    .map((service) => (
                      <div key={service.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-md font-semibold text-gray-900 dark:text-white">{service.name}</h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(service.status)}`}>
                            {service.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{service.description}</p>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <MapPinIcon className="w-4 h-4 mr-2" />
                            {service.location}
                          </div>
                          <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <ClockIcon className="w-4 h-4 mr-2" />
                            {service.hours}
                          </div>
                          <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <PhoneIcon className="w-4 h-4 mr-2" />
                            {service.contact.phone}
                          </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <button
                            onClick={() => setSelectedService(service)}
                            className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 text-sm"
                          >
                            View Details
                          </button>
                          <button className="flex items-center px-3 py-1 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                            <PlusIcon className="w-3 h-3 mr-1" />
                            Book Appointment
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Sessions</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Student</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {counselingSessions.map((session) => (
                      <tr key={session.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{session.studentName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{session.type}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{session.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(session.status)}`}>
                            {session.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'career' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Upcoming Workshops</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {careerServices.map((service) => (
                    <div key={service.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-md font-semibold text-gray-900 dark:text-white">{service.title}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(service.status)}`}>
                          {service.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{service.description}</p>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                          <CalendarIcon className="w-4 h-4 mr-2" />
                          {service.date} at {service.time}
                        </div>
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                          <MapPinIcon className="w-4 h-4 mr-2" />
                          {service.location}
                        </div>
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                          <UserIcon className="w-4 h-4 mr-2" />
                          {service.registered}/{service.capacity} registered
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {service.targetAudience.map((audience, index) => (
                            <span key={index} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full">
                              {audience}
                            </span>
                          ))}
                        </div>
                        <button className="flex items-center px-3 py-1 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                          Register
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Career Services</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {studentServices
                    .filter(service => service.category === 'Career Development')
                    .map((service) => (
                      <div key={service.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-md font-semibold text-gray-900 dark:text-white">{service.name}</h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(service.status)}`}>
                            {service.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{service.description}</p>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <MapPinIcon className="w-4 h-4 mr-2" />
                            {service.location}
                          </div>
                          <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <ClockIcon className="w-4 h-4 mr-2" />
                            {service.hours}
                          </div>
                        </div>
                        <div className="mt-3">
                          <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">Services Offered:</p>
                          <div className="flex flex-wrap gap-1">
                            {service.services.map((svc, index) => (
                              <span key={index} className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                                {svc}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'health' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Health Records</h2>
                <button className="flex items-center px-3 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Add Record
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Provider</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {healthRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{record.studentName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{record.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{record.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{record.provider}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                        <div>{record.description}</div>
                        {record.diagnosis && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">Diagnosis: {record.diagnosis}</div>
                        )}
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

        {activeTab === 'housing' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Housing Applications</h2>
                <button className="flex items-center px-3 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                  <PlusIcon className="w-4 h-4 mr-2" />
                  New Application
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Semester</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Housing Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Preferences</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Room Assignment</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {housingApplications.map((application) => (
                    <tr key={application.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{application.studentName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{application.semester}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{application.housingType}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                        <div className="flex flex-wrap gap-1">
                          {application.preferences.map((pref, index) => (
                            <span key={index} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full">
                              {pref}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {application.roomAssignment ? (
                          <div>
                            <div>{application.roomAssignment.building} {application.roomAssignment.room}</div>
                            {application.roomAssignment.roommate && (
                              <div className="text-xs text-gray-500 dark:text-gray-400">Roommate: {application.roomAssignment.roommate}</div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-500 dark:text-gray-400">Not assigned</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(application.status)}`}>
                          {application.status}
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

        {activeTab === 'financial' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Financial Aid</h2>
                <button className="flex items-center px-3 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                  <PlusIcon className="w-4 h-4 mr-2" />
                  New Application
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Application Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {financialAid.map((aid) => (
                    <tr key={aid.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{aid.studentName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{aid.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">${aid.amount.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{aid.applicationDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(aid.status)}`}>
                          {aid.status}
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

        {activeTab === 'clubs' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {studentClubs.map((club) => (
              <div key={club.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{club.name}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(club.status)}`}>
                    {club.status}
                  </span>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Category</span>
                    <span className="font-medium text-gray-900 dark:text-white">{club.category}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Members</span>
                    <span className="font-medium text-gray-900 dark:text-white">{club.memberCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Meeting Time</span>
                    <span className="font-medium text-gray-900 dark:text-white">{club.meetingTime}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Location</span>
                    <span className="font-medium text-gray-900 dark:text-white">{club.location}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Dues</span>
                    <span className="font-medium text-gray-900 dark:text-white">${club.dues}/semester</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{club.description}</p>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">President:</span> {club.president}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedClub(club)}
                      className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </button>
                    <button className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300">
                      <EnvelopeIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'events' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {campusEvents.map((event) => (
              <div key={event.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{event.title}</h3>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(event.status)}`}>
                      {event.status}
                    </span>
                    {event.cost && (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        ${event.cost}
                      </span>
                    )}
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Type</span>
                    <span className="font-medium text-gray-900 dark:text-white">{event.type}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Date & Time</span>
                    <span className="font-medium text-gray-900 dark:text-white">{event.date} at {event.time}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Location</span>
                    <span className="font-medium text-gray-900 dark:text-white">{event.location}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Organizer</span>
                    <span className="font-medium text-gray-900 dark:text-white">{event.organizer}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Registered</span>
                    <span className="font-medium text-gray-900 dark:text-white">{event.registered}/{event.expectedAttendance}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{event.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs">
                    {event.openToPublic && (
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                        Public
                      </span>
                    )}
                    {event.registrationRequired && (
                      <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full">
                        Registration Required
                      </span>
                    )}
                  </div>
                  <button className="flex items-center px-3 py-1 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                    Register
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'support' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Support Requests</h2>
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Priority</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Created</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {supportRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{request.studentName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{request.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(request.priority)}`}>
                          {request.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{request.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{request.createdDate}</td>
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
      </motion.div>

      {/* Service Detail Modal */}
      {selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Service Details</h3>
                <button
                  onClick={() => setSelectedService(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{selectedService.name}</h4>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedService.status)}`}>
                  {selectedService.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Category</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedService.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Location</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedService.location}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Hours</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedService.hours}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedService.contact.phone}</p>
                </div>
              </div>

              <div className="mb-6">
                <h5 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Description</h5>
                <p className="text-sm text-gray-600 dark:text-gray-400">{selectedService.description}</p>
              </div>

              <div className="mb-6">
                <h5 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Services Offered</h5>
                <div className="flex flex-wrap gap-2">
                  {selectedService.services.map((service, index) => (
                    <span key={index} className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                      {service}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h5 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Staff</h5>
                <div className="space-y-3">
                  {selectedService.staff.map((staff) => (
                    <div key={staff.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{staff.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{staff.title}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{staff.email}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-600 dark:text-gray-400">Available</p>
                          <p className="text-sm text-gray-900 dark:text-white">{staff.availability}</p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-xs text-gray-600 dark:text-gray-400">Specialization:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {staff.specialization.map((spec, index) => (
                            <span key={index} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full">
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button className="flex items-center px-4 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  Book Appointment
                </button>
                <div className="flex items-center space-x-2">
                  <button className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300">
                    <EnvelopeIcon className="w-4 h-4" />
                  </button>
                  <button className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300">
                    <PhoneIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Club Detail Modal */}
      {selectedClub && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Club Details</h3>
                <button
                  onClick={() => setSelectedClub(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{selectedClub.name}</h4>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedClub.status)}`}>
                  {selectedClub.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Category</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedClub.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Members</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedClub.memberCount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">President</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedClub.president}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Advisor</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedClub.advisor}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Meeting Time</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedClub.meetingTime}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Location</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedClub.location}</p>
                </div>
              </div>

              <div className="mb-6">
                <h5 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Description</h5>
                <p className="text-sm text-gray-600 dark:text-gray-400">{selectedClub.description}</p>
              </div>

              <div className="mb-6">
                <h5 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Upcoming Events</h5>
                <div className="space-y-2">
                  {selectedClub.events.map((event) => (
                    <div key={event.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{event.title}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">{event.date} at {event.time}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">{event.location}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-600 dark:text-gray-400">Attendees</p>
                          <p className="text-sm text-gray-900 dark:text-white">{event.attendees}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{event.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Dues:</span> ${selectedClub.dues}/semester
                </div>
                <div className="flex items-center space-x-2">
                  <button className="flex items-center px-4 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                    <UserGroupIcon className="w-4 h-4 mr-2" />
                    Join Club
                  </button>
                  <button className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300">
                    <EnvelopeIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
