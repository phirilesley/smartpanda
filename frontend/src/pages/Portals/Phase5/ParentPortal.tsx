import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  UserGroupIcon,
  AcademicCapIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  BellIcon,
  EnvelopeIcon,
  PhoneIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  UserIcon,
  BookOpenIcon,
  BriefcaseIcon,
  BanknotesIcon,
  ArrowPathIcon,
  ClipboardDocumentListIcon,
  ChatBubbleLeftRightIcon,
  VideoCameraIcon,
  MapPinIcon,
  StarIcon,
  TrophyIcon,
  AwardIcon,
  CalendarDaysIcon,
  IdentificationIcon,
  CreditCardIcon,
  ReceiptIcon,
  BuildingOfficeIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';

// Types
interface ParentProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  relationship: 'Father' | 'Mother' | 'Guardian' | 'Other';
  occupation: string;
  employer?: string;
  workPhone?: string;
  address: string;
  city: string;
  country: string;
  emergencyContact: boolean;
  primaryContact: boolean;
  accessLevel: 'Full' | 'Limited' | 'View Only';
  twoFactorEnabled: boolean;
  lastLogin?: string;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
    attendance: boolean;
    grades: boolean;
    fees: boolean;
    events: boolean;
    discipline: boolean;
  };
  children: Array<{
    studentId: string;
    studentName: string;
    grade: string;
    stream: string;
    relationship: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface StudentOverview {
  id: string;
  studentId: string;
  studentName: string;
  studentNumber: string;
  grade: string;
  stream: string;
  attendance: {
    present: number;
    absent: number;
    late: number;
    excused: number;
    percentage: number;
    term: string;
    year: string;
  };
  grades: {
    currentAverage: number;
    currentGrade: string;
    classRank: number;
    streamRank: number;
    subjects: Array<{
      subject: string;
      grade: string;
      percentage: number;
      rank: number;
    }>;
    term: string;
    year: string;
  };
  fees: {
    totalFees: number;
    paidAmount: number;
    balance: number;
    dueDate: string;
    status: 'Paid' | 'Partial' | 'Overdue' | 'Upcoming';
    nextPayment?: number;
    nextDueDate?: string;
  };
  behavior: {
    status: 'Excellent' | 'Good' | 'Fair' | 'Poor';
    points: number;
    incidents: number;
    achievements: number;
    term: string;
    year: string;
  };
  upcomingEvents: Array<{
    id: string;
    title: string;
    date: string;
    type: string;
    location?: string;
  }>;
  recentActivities: Array<{
    date: string;
    activity: string;
    type: 'Academic' | 'Attendance' | 'Behavior' | 'Fee' | 'Event';
    details?: string;
  }>;
}

interface ParentCommunication {
  id: string;
  type: 'Message' | 'Meeting' | 'Call' | 'Email' | 'SMS' | 'Video Call';
  title: string;
  description?: string;
  sender: {
    id: string;
    name: string;
    role: string;
    avatar?: string;
  };
  recipient: {
    id: string;
    name: string;
    role: string;
  };
  studentId?: string;
  studentName?: string;
  status: 'Sent' | 'Delivered' | 'Read' | 'Replied' | 'Scheduled' | 'Completed' | 'Cancelled';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  timestamp: string;
  scheduledDate?: string;
  duration?: number;
  attachments?: Array<{
    name: string;
    url: string;
    size: number;
  }>;
  replyCount: number;
  lastReply?: string;
  createdAt: string;
  updatedAt: string;
}

interface ParentAppointment {
  id: string;
  type: 'Parent-Teacher Meeting' | 'Academic Consultation' | 'Disciplinary Meeting' | 'Fee Discussion' | 'General Inquiry';
  title: string;
  description?: string;
  studentId: string;
  studentName: string;
  teacherId: string;
  teacherName: string;
  teacherRole: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  location: string;
  mode: 'In-Person' | 'Video Call' | 'Phone Call';
  status: 'Scheduled' | 'Confirmed' | 'In Progress' | 'Completed' | 'Cancelled' | 'No-Show';
  priority: 'Low' | 'Medium' | 'High';
  agenda?: string[];
  notes?: string;
  outcome?: string;
  followUpRequired: boolean;
  followUpDate?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface ParentNotification {
  id: string;
  type: 'Academic' | 'Attendance' | 'Fee' | 'Event' | 'Behavior' | 'System' | 'Emergency';
  title: string;
  message: string;
  studentId?: string;
  studentName?: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  channels: Array<'Email' | 'SMS' | 'Push' | 'Portal'>;
  read: boolean;
  readAt?: string;
  actionRequired: boolean;
  actionTaken?: boolean;
  actionDeadline?: string;
  attachments?: Array<{
    name: string;
    url: string;
  }>;
  timestamp: string;
  expiresAt?: string;
  createdBy: string;
}

interface ParentDocument {
  id: string;
  title: string;
  description?: string;
  category: 'Academic' | 'Administrative' | 'Medical' | 'Financial' | 'Legal' | 'Other';
  type: 'Report Card' | 'Transcript' | 'Certificate' | 'Invoice' | 'Receipt' | 'Permission Slip' | 'Medical Form' | 'Other';
  studentId?: string;
  studentName?: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  fileFormat: string;
  uploadDate: string;
  expiryDate?: string;
  downloadable: boolean;
  requiresSignature: boolean;
  signed: boolean;
  signedAt?: string;
  sharedWith: Array<{
    userId: string;
    userName: string;
    accessLevel: 'View' | 'Download' | 'Share';
  }>;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export const ParentPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'communication' | 'appointments' | 'notifications' | 'documents'>('overview');
  const [parentProfile, setParentProfile] = useState<ParentProfile | null>(null);
  const [studentOverviews, setStudentOverviews] = useState<StudentOverview[]>([]);
  const [communications, setCommunications] = useState<ParentCommunication[]>([]);
  const [appointments, setAppointments] = useState<ParentAppointment[]>([]);
  const [notifications, setNotifications] = useState<ParentNotification[]>([]);
  const [documents, setDocuments] = useState<ParentDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStudent, setFilterStudent] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentOverview | null>(null);
  const [selectedCommunication, setSelectedCommunication] = useState<ParentCommunication | null>(null);
  const [formData, setFormData] = useState<Partial<ParentAppointment>>({});

  // Mock data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock parent profile
      const mockProfile: ParentProfile = {
        id: 'parent-001',
        userId: 'user-001',
        firstName: 'Mary',
        lastName: 'Smith',
        email: 'mary.smith@email.com',
        phone: '+263 4 123 456',
        relationship: 'Mother',
        occupation: 'Teacher',
        employer: 'Harare Primary School',
        workPhone: '+263 4 789 012',
        address: '123 Main Street',
        city: 'Harare',
        country: 'Zimbabwe',
        emergencyContact: true,
        primaryContact: true,
        accessLevel: 'Full',
        twoFactorEnabled: true,
        lastLogin: '2024-02-20T09:30:00Z',
        notifications: {
          email: true,
          sms: true,
          push: true,
          attendance: true,
          grades: true,
          fees: true,
          events: true,
          discipline: true,
        },
        children: [
          {
            studentId: 'student-001',
            studentName: 'John Smith',
            grade: 'Form 1',
            stream: 'A',
            relationship: 'Son',
          },
          {
            studentId: 'student-002',
            studentName: 'Emma Smith',
            grade: 'Form 3',
            stream: 'B',
            relationship: 'Daughter',
          },
        ],
        createdAt: '2023-01-15T00:00:00Z',
        updatedAt: '2024-02-20T09:30:00Z',
      };

      // Mock student overviews
      const mockStudentOverviews: StudentOverview[] = [
        {
          id: 'overview-001',
          studentId: 'student-001',
          studentName: 'John Smith',
          studentNumber: 'STU2024001',
          grade: 'Form 1',
          stream: 'A',
          attendance: {
            present: 85,
            absent: 3,
            late: 2,
            excused: 2,
            percentage: 92.4,
            term: 'Term 1',
            year: '2024',
          },
          grades: {
            currentAverage: 83.6,
            currentGrade: 'A',
            classRank: 2,
            streamRank: 1,
            subjects: [
              { subject: 'Mathematics', grade: 'A', percentage: 85, rank: 3 },
              { subject: 'English', grade: 'B', percentage: 78, rank: 5 },
              { subject: 'Science', grade: 'A+', percentage: 92, rank: 1 },
              { subject: 'History', grade: 'B', percentage: 75, rank: 4 },
              { subject: 'Geography', grade: 'A', percentage: 88, rank: 2 },
            ],
            term: 'Term 1',
            year: '2024',
          },
          fees: {
            totalFees: 2500,
            paidAmount: 2000,
            balance: 500,
            dueDate: '2024-03-15',
            status: 'Partial',
            nextPayment: 500,
            nextDueDate: '2024-03-15',
          },
          behavior: {
            status: 'Excellent',
            points: 95,
            incidents: 0,
            achievements: 3,
            term: 'Term 1',
            year: '2024',
          },
          upcomingEvents: [
            {
              id: 'event-001',
              title: 'Parent-Teacher Meeting',
              date: '2024-02-25',
              type: 'Meeting',
              location: 'School Hall',
            },
            {
              id: 'event-002',
              title: 'Science Fair',
              date: '2024-03-05',
              type: 'Academic',
              location: 'Science Lab',
            },
          ],
          recentActivities: [
            {
              date: '2024-02-20',
              activity: 'Grade A+ in Science',
              type: 'Academic',
              details: 'Outstanding performance in science examination',
            },
            {
              date: '2024-02-19',
              activity: 'Perfect Attendance',
              type: 'Attendance',
              details: 'No absences this month',
            },
            {
              date: '2024-02-18',
              activity: 'Fee Payment Received',
              type: 'Fee',
              details: 'Payment of $500 received',
            },
          ],
        },
        {
          id: 'overview-002',
          studentId: 'student-002',
          studentName: 'Emma Smith',
          studentNumber: 'STU2024002',
          grade: 'Form 3',
          stream: 'B',
          attendance: {
            present: 78,
            absent: 5,
            late: 4,
            excused: 3,
            percentage: 86.0,
            term: 'Term 1',
            year: '2024',
          },
          grades: {
            currentAverage: 76.2,
            currentGrade: 'B',
            classRank: 8,
            streamRank: 3,
            subjects: [
              { subject: 'Mathematics', grade: 'B', percentage: 72, rank: 12 },
              { subject: 'English', grade: 'A', percentage: 85, rank: 3 },
              { subject: 'Physics', grade: 'B', percentage: 74, rank: 8 },
              { subject: 'Chemistry', grade: 'B+', percentage: 78, rank: 6 },
              { subject: 'Biology', grade: 'A-', percentage: 82, rank: 4 },
            ],
            term: 'Term 1',
            year: '2024',
          },
          fees: {
            totalFees: 3000,
            paidAmount: 3000,
            balance: 0,
            dueDate: '2024-02-10',
            status: 'Paid',
          },
          behavior: {
            status: 'Good',
            points: 82,
            incidents: 1,
            achievements: 2,
            term: 'Term 1',
            year: '2024',
          },
          upcomingEvents: [
            {
              id: 'event-003',
              title: 'Sports Day',
              date: '2024-03-10',
              type: 'Sports',
              location: 'School Field',
            },
            {
              id: 'event-004',
              title: 'Career Guidance Workshop',
              date: '2024-03-15',
              type: 'Academic',
              location: 'Conference Room',
            },
          ],
          recentActivities: [
            {
              date: '2024-02-20',
              activity: 'Participated in Debate Club',
              type: 'Academic',
              details: 'Won best speaker award',
            },
            {
              date: '2024-02-18',
              activity: 'Late Arrival',
              type: 'Attendance',
              details: 'Arrived 15 minutes late',
            },
            {
              date: '2024-02-15',
              activity: 'Fees Fully Paid',
              type: 'Fee',
              details: 'All fees for Term 1 paid',
            },
          ],
        },
      ];

      // Mock communications
      const mockCommunications: ParentCommunication[] = [
        {
          id: 'comm-001',
          type: 'Message',
          title: 'John\'s Progress in Mathematics',
          description: 'John has shown significant improvement in mathematics this term...',
          sender: {
            id: 'teacher-001',
            name: 'Mrs. Sarah Johnson',
            role: 'Mathematics Teacher',
          },
          recipient: {
            id: 'parent-001',
            name: 'Mary Smith',
            role: 'Parent',
          },
          studentId: 'student-001',
          studentName: 'John Smith',
          status: 'Read',
          priority: 'Medium',
          timestamp: '2024-02-20T14:30:00Z',
          replyCount: 2,
          lastReply: '2024-02-20T16:45:00Z',
          createdAt: '2024-02-20T14:30:00Z',
          updatedAt: '2024-02-20T16:45:00Z',
        },
        {
          id: 'comm-002',
          type: 'Meeting',
          title: 'Parent-Teacher Conference',
          description: 'Scheduled meeting to discuss Emma\'s academic performance',
          sender: {
            id: 'teacher-002',
            name: 'Mr. Michael Brown',
            role: 'Class Teacher',
          },
          recipient: {
            id: 'parent-001',
            name: 'Mary Smith',
            role: 'Parent',
          },
          studentId: 'student-002',
          studentName: 'Emma Smith',
          status: 'Scheduled',
          priority: 'High',
          timestamp: '2024-02-19T10:15:00Z',
          scheduledDate: '2024-02-25T15:00:00Z',
          duration: 30,
          createdAt: '2024-02-19T10:15:00Z',
          updatedAt: '2024-02-19T10:15:00Z',
        },
        {
          id: 'comm-003',
          type: 'Email',
          title: 'Fee Payment Reminder',
          description: 'Reminder: John\'s school fees for Term 1 are due on March 15',
          sender: {
            id: 'admin-001',
            name: 'Finance Office',
            role: 'Administrator',
          },
          recipient: {
            id: 'parent-001',
            name: 'Mary Smith',
            role: 'Parent',
          },
          studentId: 'student-001',
          studentName: 'John Smith',
          status: 'Delivered',
          priority: 'Medium',
          timestamp: '2024-02-18T09:00:00Z',
          attachments: [
            {
              name: 'fee_statement.pdf',
              url: '/documents/fee_statement.pdf',
              size: 256000,
            },
          ],
          createdAt: '2024-02-18T09:00:00Z',
          updatedAt: '2024-02-18T09:00:00Z',
        },
      ];

      // Mock appointments
      const mockAppointments: ParentAppointment[] = [
        {
          id: 'apt-001',
          type: 'Parent-Teacher Meeting',
          title: 'Discuss John\'s Academic Progress',
          studentId: 'student-001',
          studentName: 'John Smith',
          teacherId: 'teacher-001',
          teacherName: 'Mrs. Sarah Johnson',
          teacherRole: 'Mathematics Teacher',
          date: '2024-02-25',
          startTime: '15:00',
          endTime: '15:30',
          duration: 30,
          location: 'Mathematics Classroom',
          mode: 'In-Person',
          status: 'Scheduled',
          priority: 'Medium',
          agenda: [
            'Review mathematics performance',
            'Discuss homework completion',
            'Address any concerns',
          ],
          followUpRequired: false,
          createdBy: 'parent-001',
          createdAt: '2024-02-19T14:30:00Z',
          updatedAt: '2024-02-19T14:30:00Z',
        },
        {
          id: 'apt-002',
          type: 'Academic Consultation',
          title: 'Emma\'s Subject Selection',
          studentId: 'student-002',
          studentName: 'Emma Smith',
          teacherId: 'teacher-002',
          teacherName: 'Mr. Michael Brown',
          teacherRole: 'Class Teacher',
          date: '2024-03-05',
          startTime: '10:00',
          endTime: '10:45',
          duration: 45,
          location: 'Conference Room',
          mode: 'In-Person',
          status: 'Scheduled',
          priority: 'High',
          agenda: [
            'Review subject options for Form 4',
            'Discuss career aspirations',
            'Plan academic pathway',
          ],
          followUpRequired: true,
          followUpDate: '2024-03-06',
          createdBy: 'parent-001',
          createdAt: '2024-02-18T11:00:00Z',
          updatedAt: '2024-02-18T11:00:00Z',
        },
      ];

      // Mock notifications
      const mockNotifications: ParentNotification[] = [
        {
          id: 'notif-001',
          type: 'Academic',
          title: 'John\'s Term 1 Results Available',
          message: 'John\'s Term 1 examination results are now available for viewing.',
          studentId: 'student-001',
          studentName: 'John Smith',
          priority: 'Medium',
          channels: ['Email', 'Push', 'Portal'],
          read: false,
          actionRequired: false,
          timestamp: '2024-02-20T16:00:00Z',
          createdBy: 'system',
        },
        {
          id: 'notif-002',
          type: 'Fee',
          title: 'Fee Payment Reminder',
          message: 'John\'s school fees balance of $500 is due on March 15, 2024.',
          studentId: 'student-001',
          studentName: 'John Smith',
          priority: 'Medium',
          channels: ['Email', 'SMS'],
          read: true,
          readAt: '2024-02-18T09:30:00Z',
          actionRequired: true,
          actionTaken: false,
          actionDeadline: '2024-03-15',
          timestamp: '2024-02-18T09:00:00Z',
          createdBy: 'finance',
        },
        {
          id: 'notif-003',
          type: 'Event',
          title: 'Parent-Teacher Meeting Scheduled',
          message: 'Your parent-teacher meeting with Mrs. Sarah Johnson is scheduled for February 25 at 3:00 PM.',
          studentId: 'student-001',
          studentName: 'John Smith',
          priority: 'High',
          channels: ['Email', 'Push', 'Portal'],
          read: true,
          readAt: '2024-02-19T14:35:00Z',
          actionRequired: true,
          actionTaken: true,
          timestamp: '2024-02-19T14:30:00Z',
          createdBy: 'system',
        },
      ];

      // Mock documents
      const mockDocuments: ParentDocument[] = [
        {
          id: 'doc-001',
          title: 'John Smith - Term 1 Report Card',
          description: 'Academic performance report for Term 1 2024',
          category: 'Academic',
          type: 'Report Card',
          studentId: 'student-001',
          studentName: 'John Smith',
          fileUrl: '/documents/report_cards/john_term1_2024.pdf',
          fileName: 'john_term1_2024.pdf',
          fileSize: 512000,
          fileFormat: 'PDF',
          uploadDate: '2024-02-20',
          downloadable: true,
          requiresSignature: false,
          signed: false,
          sharedWith: [
            {
              userId: 'parent-001',
              userName: 'Mary Smith',
              accessLevel: 'Download',
            },
          ],
          tags: ['report-card', 'term1', '2024', 'john-smith'],
          createdAt: '2024-02-20T16:00:00Z',
          updatedAt: '2024-02-20T16:00:00Z',
        },
        {
          id: 'doc-002',
          title: 'Fee Statement - Term 1 2024',
          description: 'Detailed fee statement for Term 1 2024',
          category: 'Financial',
          type: 'Invoice',
          studentId: 'student-001',
          studentName: 'John Smith',
          fileUrl: '/documents/fee_statements/john_term1_2024.pdf',
          fileName: 'john_term1_2024.pdf',
          fileSize: 256000,
          fileFormat: 'PDF',
          uploadDate: '2024-02-18',
          downloadable: true,
          requiresSignature: false,
          signed: false,
          sharedWith: [
            {
              userId: 'parent-001',
              userName: 'Mary Smith',
              accessLevel: 'Download',
            },
          ],
          tags: ['fees', 'invoice', 'term1', '2024', 'john-smith'],
          createdAt: '2024-02-18T09:00:00Z',
          updatedAt: '2024-02-18T09:00:00Z',
        },
        {
          id: 'doc-003',
          title: 'Permission Slip - Science Fair',
          description: 'Permission slip for science fair participation',
          category: 'Administrative',
          type: 'Permission Slip',
          studentId: 'student-001',
          studentName: 'John Smith',
          fileUrl: '/documents/permission_slips/science_fair.pdf',
          fileName: 'science_fair.pdf',
          fileSize: 128000,
          fileFormat: 'PDF',
          uploadDate: '2024-02-15',
          expiryDate: '2024-03-05',
          downloadable: true,
          requiresSignature: true,
          signed: true,
          signedAt: '2024-02-16T10:30:00Z',
          sharedWith: [
            {
              userId: 'parent-001',
              userName: 'Mary Smith',
              accessLevel: 'Download',
            },
          ],
          tags: ['permission', 'science-fair', '2024', 'john-smith'],
          createdAt: '2024-02-15T14:00:00Z',
          updatedAt: '2024-02-16T10:30:00Z',
        },
      ];
      
      setParentProfile(mockProfile);
      setStudentOverviews(mockStudentOverviews);
      setCommunications(mockCommunications);
      setAppointments(mockAppointments);
      setNotifications(mockNotifications);
      setDocuments(mockDocuments);
      setLoading(false);
    };

    loadData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
      case 'Completed':
      case 'Paid':
      case 'Confirmed':
      case 'Read':
      case 'Excellent':
        return 'text-success-600 bg-success-100';
      case 'Partial':
      case 'Scheduled':
      case 'In Progress':
      case 'Pending':
      case 'Delivered':
      case 'Good':
        return 'text-warning-600 bg-warning-100';
      case 'Overdue':
      case 'Cancelled':
      case 'No-Show':
      case 'Unread':
      case 'Poor':
        return 'text-red-600 bg-red-100';
      case 'Upcoming':
      case 'Fair':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent':
        return 'text-red-600 bg-red-100';
      case 'High':
        return 'text-orange-600 bg-orange-100';
      case 'Medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'Low':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Message':
        return 'text-blue-600 bg-blue-100';
      case 'Meeting':
        return 'text-purple-600 bg-purple-100';
      case 'Call':
        return 'text-green-600 bg-green-100';
      case 'Email':
        return 'text-indigo-600 bg-indigo-100';
      case 'SMS':
        return 'text-orange-600 bg-orange-100';
      case 'Video Call':
        return 'text-pink-600 bg-pink-100';
      case 'Academic':
        return 'text-blue-600 bg-blue-100';
      case 'Attendance':
        return 'text-green-600 bg-green-100';
      case 'Fee':
        return 'text-orange-600 bg-orange-100';
      case 'Event':
        return 'text-purple-600 bg-purple-100';
      case 'Behavior':
        return 'text-red-600 bg-red-100';
      case 'System':
        return 'text-gray-600 bg-gray-100';
      case 'Emergency':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+':
        return 'text-purple-600 bg-purple-100';
      case 'A':
      case 'A-':
        return 'text-green-600 bg-green-100';
      case 'B+':
      case 'B':
      case 'B-':
        return 'text-blue-600 bg-blue-100';
      case 'C+':
      case 'C':
      case 'C-':
        return 'text-yellow-600 bg-yellow-100';
      case 'D+':
      case 'D':
      case 'D-':
        return 'text-orange-600 bg-orange-100';
      case 'E':
      case 'F':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredCommunications = communications.filter(comm => {
    const matchesSearch = comm.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comm.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStudent = filterStudent === 'all' || comm.studentId === filterStudent;
    const matchesType = filterType === 'all' || comm.type === filterType;
    const matchesStatus = filterStatus === 'all' || comm.status === filterStatus;
    return matchesSearch && matchesStudent && matchesType && matchesStatus;
  });

  const handleCreateAppointment = () => {
    // In real app, this would call API
    const newAppointment: ParentAppointment = {
      id: `apt-${Date.now()}`,
      type: formData.type as ParentAppointment['type'] || 'Parent-Teacher Meeting',
      title: formData.title || 'New Appointment',
      studentId: formData.studentId || 'student-001',
      studentName: formData.studentName || 'John Smith',
      teacherId: 'teacher-001',
      teacherName: 'Mrs. Sarah Johnson',
      teacherRole: 'Mathematics Teacher',
      date: formData.date || new Date().toISOString().split('T')[0],
      startTime: formData.startTime || '09:00',
      endTime: formData.endTime || '09:30',
      duration: 30,
      location: formData.location || 'School Office',
      mode: formData.mode as ParentAppointment['mode'] || 'In-Person',
      status: 'Scheduled',
      priority: formData.priority as ParentAppointment['priority'] || 'Medium',
      agenda: formData.agenda || [],
      followUpRequired: false,
      createdBy: 'parent-001',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setAppointments([...appointments, newAppointment]);
    setShowAppointmentModal(false);
    setFormData({});
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Parent Portal
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Monitor your children's academic progress and stay connected with the school
            </p>
          </div>
          <div className="flex gap-3">
            <button className="btn btn-secondary">
              <BellIcon className="w-4 h-4 mr-2" />
              Notifications ({notifications.filter(n => !n.read).length})
            </button>
            {activeTab === 'appointments' && (
              <button
                onClick={() => setShowAppointmentModal(true)}
                className="btn btn-primary"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Schedule Appointment
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Parent Profile Card */}
      {parentProfile && (
        <div className="card mb-6">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                  <UserIcon className="w-8 h-8 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {parentProfile.firstName} {parentProfile.lastName}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {parentProfile.relationship} • {parentProfile.occupation}
                  </p>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-500 dark:text-gray-500">
                    <span className="flex items-center gap-1">
                      <EnvelopeIcon className="w-4 h-4" />
                      {parentProfile.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <PhoneIcon className="w-4 h-4" />
                      {parentProfile.phone}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600 dark:text-gray-400">Children</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {parentProfile.children.length}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: ChartBarIcon },
            { id: 'students', label: 'Students', icon: AcademicCapIcon },
            { id: 'communication', label: 'Communication', icon: ChatBubbleLeftRightIcon },
            { id: 'appointments', label: 'Appointments', icon: CalendarDaysIcon },
            { id: 'notifications', label: 'Notifications', icon: BellIcon },
            { id: 'documents', label: 'Documents', icon: DocumentTextIcon },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center px-1 py-4 border-b-2 text-sm font-medium ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-5 h-5 mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
          >
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Children</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {studentOverviews.length}
                  </p>
                </div>
                <UserGroupIcon className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card"
          >
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Unread Messages</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {communications.filter(c => c.status === 'Sent' || c.status === 'Delivered').length}
                  </p>
                </div>
                <ChatBubbleLeftRightIcon className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Upcoming Appointments</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {appointments.filter(a => a.status === 'Scheduled').length}
                  </p>
                </div>
                <CalendarDaysIcon className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {activeTab === 'students' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {studentOverviews.map((student, index) => (
            <motion.div
              key={student.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card card-hover"
            >
              <div className="card-body">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {student.studentName}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {student.studentNumber} • {student.grade} - {student.stream}
                    </p>
                  </div>
                  <button 
                    onClick={() => setSelectedStudent(student)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <EyeIcon className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {student.grades.currentAverage.toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Average Grade</div>
                    <span className={`text-xs px-2 py-1 rounded-full ${getGradeColor(student.grades.currentGrade)}`}>
                      {student.grades.currentGrade}
                    </span>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {student.attendance.percentage.toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Attendance</div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      student.attendance.percentage >= 90 ? 'text-green-600 bg-green-100' :
                      student.attendance.percentage >= 80 ? 'text-yellow-600 bg-yellow-100' :
                      'text-red-600 bg-red-100'
                    }`}>
                      {student.attendance.percentage >= 90 ? 'Excellent' :
                       student.attendance.percentage >= 80 ? 'Good' : 'Needs Improvement'}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Class Rank</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      #{student.grades.classRank}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Fees Status</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(student.fees.status)}`}>
                      {student.fees.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Balance</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      ${student.fees.balance}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Behavior</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(student.behavior.status)}`}>
                      {student.behavior.status}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Recent Activities:</div>
                    {student.recentActivities.slice(0, 2).map((activity, i) => (
                      <div key={i} className="text-xs text-gray-500 dark:text-gray-500">
                        {new Date(activity.date).toLocaleDateString()} - {activity.activity}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-sm text-gray-500 dark:text-gray-500">
                    Next event: {student.upcomingEvents[0]?.title || 'None'}
                  </div>
                  <div className="flex gap-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      <EyeIcon className="w-4 h-4" />
                    </button>
                    <button className="text-blue-600 hover:text-blue-800">
                      <ChatBubbleLeftRightIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'communication' && (
        <div className="space-y-4">
          <div className="card mb-6">
            <div className="card-body">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search communications..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="form-input pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <select
                    value={filterStudent}
                    onChange={(e) => setFilterStudent(e.target.value)}
                    className="form-input"
                  >
                    <option value="all">All Children</option>
                    {studentOverviews.map(student => (
                      <option key={student.studentId} value={student.studentId}>
                        {student.studentName}
                      </option>
                    ))}
                  </select>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="form-input"
                  >
                    <option value="all">All Types</option>
                    <option value="Message">Message</option>
                    <option value="Meeting">Meeting</option>
                    <option value="Email">Email</option>
                    <option value="SMS">SMS</option>
                    <option value="Video Call">Video Call</option>
                  </select>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="form-input"
                  >
                    <option value="all">All Status</option>
                    <option value="Sent">Sent</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Read">Read</option>
                    <option value="Replied">Replied</option>
                    <option value="Scheduled">Scheduled</option>
                  </select>
                  <button className="btn btn-secondary">
                    <FunnelIcon className="w-4 h-4 mr-2" />
                    Filters
                  </button>
                </div>
              </div>
            </div>
          </div>

          {filteredCommunications.map((comm, index) => (
            <motion.div
              key={comm.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card"
            >
              <div className="card-body">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(comm.type)}`}>
                        {comm.type}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(comm.priority)}`}>
                        {comm.priority}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(comm.status)}`}>
                        {comm.status}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-500">
                        {new Date(comm.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                      {comm.title}
                    </h4>
                    {comm.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {comm.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                      <span>From: {comm.sender.name} ({comm.sender.role})</span>
                      {comm.studentName && <span>Student: {comm.studentName}</span>}
                      {comm.replyCount > 0 && <span>{comm.replyCount} replies</span>}
                      {comm.scheduledDate && <span>Scheduled: {new Date(comm.scheduledDate).toLocaleString()}</span>}
                    </div>
                    {comm.attachments && comm.attachments.length > 0 && (
                      <div className="flex items-center gap-2 mt-2">
                        <DocumentTextIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-xs text-gray-500 dark:text-gray-500">
                          {comm.attachments.length} attachment(s)
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setSelectedCommunication(comm)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </button>
                    <button className="text-blue-600 hover:text-blue-800">
                      <ChatBubbleLeftRightIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'appointments' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {appointments.map((appointment, index) => (
            <motion.div
              key={appointment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card card-hover"
            >
              <div className="card-body">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {appointment.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {appointment.studentName} • {appointment.type}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(appointment.status)}`}>
                    {appointment.status}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Teacher</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {appointment.teacherName}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Date</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {new Date(appointment.date).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Time</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {appointment.startTime} - {appointment.endTime}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Duration</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {appointment.duration} minutes
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Location</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {appointment.location}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Mode</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      appointment.mode === 'In-Person' ? 'text-blue-600 bg-blue-100' :
                      appointment.mode === 'Video Call' ? 'text-purple-600 bg-purple-100' :
                      'text-green-600 bg-green-100'
                    }`}>
                      {appointment.mode}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Priority</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(appointment.priority)}`}>
                      {appointment.priority}
                    </span>
                  </div>

                  {appointment.agenda && appointment.agenda.length > 0 && (
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">Agenda:</div>
                      {appointment.agenda.slice(0, 2).map((item, i) => (
                        <div key={i} className="text-xs text-gray-500 dark:text-gray-500">
                          • {item}
                        </div>
                      ))}
                      {appointment.agenda.length > 2 && (
                        <div className="text-xs text-gray-500 dark:text-gray-500">
                          +{appointment.agenda.length - 2} more items
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1">
                    {appointment.followUpRequired && (
                      <span className="text-xs px-2 py-1 bg-orange-100 text-orange-600 rounded">
                        Follow-up Required
                      </span>
                    )}
                    {appointment.completed && (
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded">
                        Completed
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-sm text-gray-500 dark:text-gray-500">
                    Created {new Date(appointment.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex gap-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      <EyeIcon className="w-4 h-4" />
                    </button>
                    <button className="text-blue-600 hover:text-blue-800">
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="space-y-4">
          {notifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`card ${!notification.read ? 'border-l-4 border-blue-500' : ''}`}
            >
              <div className="card-body">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(notification.type)}`}>
                        {notification.type}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(notification.priority)}`}>
                        {notification.priority}
                      </span>
                      {!notification.read && (
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded">
                          New
                        </span>
                      )}
                      <span className="text-sm text-gray-500 dark:text-gray-500">
                        {new Date(notification.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                      {notification.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {notification.message}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                      {notification.studentName && <span>Student: {notification.studentName}</span>}
                      {notification.actionRequired && (
                        <span className="text-red-600 font-medium">
                          Action Required
                        </span>
                      )}
                      {notification.actionTaken && (
                        <span className="text-green-600">
                          Action Taken
                        </span>
                      )}
                      {notification.actionDeadline && (
                        <span>
                          Deadline: {new Date(notification.actionDeadline).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    {notification.attachments && notification.attachments.length > 0 && (
                      <div className="flex items-center gap-2 mt-2">
                        <DocumentTextIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-xs text-gray-500 dark:text-gray-500">
                          {notification.attachments.length} attachment(s)
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {!notification.read && (
                      <button className="text-blue-600 hover:text-blue-800">
                        <CheckCircleIcon className="w-4 h-4" />
                      </button>
                    )}
                    <button className="text-blue-600 hover:text-blue-800">
                      <EyeIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'documents' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((document, index) => (
            <motion.div
              key={document.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card card-hover"
            >
              <div className="card-body">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                      {document.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {document.studentName} • {document.type}
                    </p>
                  </div>
                  <DocumentTextIcon className="w-6 h-6 text-gray-400" />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Category</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(document.category)}`}>
                      {document.category}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Type</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(document.type)}`}>
                      {document.type}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">File Size</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {(document.fileSize / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Upload Date</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {new Date(document.uploadDate).toLocaleDateString()}
                    </span>
                  </div>

                  {document.expiryDate && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Expires</span>
                      <span className="text-sm text-gray-500 dark:text-gray-500">
                        {new Date(document.expiryDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1">
                    {document.downloadable && (
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded">
                        Downloadable
                      </span>
                    )}
                    {document.requiresSignature && (
                      <span className="text-xs px-2 py-1 bg-orange-100 text-orange-600 rounded">
                        Signature Required
                      </span>
                    )}
                    {document.signed && (
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded">
                        Signed
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Tags:</div>
                    <div className="flex flex-wrap gap-1">
                      {document.tags.slice(0, 3).map((tag, i) => (
                        <span key={i} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                          {tag}
                        </span>
                      ))}
                      {document.tags.length > 3 && (
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                          +{document.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {document.description && (
                    <div className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {document.description}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-sm text-gray-500 dark:text-gray-500">
                    {document.fileName}
                  </div>
                  <div className="flex gap-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      <EyeIcon className="w-4 h-4" />
                    </button>
                    <button className="text-blue-600 hover:text-blue-800">
                      <DocumentArrowDownIcon className="w-4 h-4" />
                    </button>
                    <button className="text-blue-600 hover:text-blue-800">
                      <EnvelopeIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Schedule Appointment Modal */}
      {showAppointmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full"
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Schedule Appointment
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Select Student
                  </label>
                  <select
                    value={formData.studentId || ''}
                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                    className="form-input"
                  >
                    <option value="">Select Student</option>
                    {studentOverviews.map(student => (
                      <option key={student.studentId} value={student.studentId}>
                        {student.studentName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Appointment Type
                  </label>
                  <select
                    value={formData.type || ''}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as ParentAppointment['type'] })}
                    className="form-input"
                  >
                    <option value="Parent-Teacher Meeting">Parent-Teacher Meeting</option>
                    <option value="Academic Consultation">Academic Consultation</option>
                    <option value="Disciplinary Meeting">Disciplinary Meeting</option>
                    <option value="Fee Discussion">Fee Discussion</option>
                    <option value="General Inquiry">General Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="form-input"
                    placeholder="Appointment title..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      value={formData.date || ''}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Priority
                    </label>
                    <select
                      value={formData.priority || ''}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value as ParentAppointment['priority'] })}
                      className="form-input"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={formData.startTime || ''}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={formData.endTime || ''}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location || ''}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="form-input"
                    placeholder="Meeting location..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Mode
                  </label>
                  <select
                    value={formData.mode || ''}
                    onChange={(e) => setFormData({ ...formData, mode: e.target.value as ParentAppointment['mode'] })}
                    className="form-input"
                  >
                    <option value="In-Person">In-Person</option>
                    <option value="Video Call">Video Call</option>
                    <option value="Phone Call">Phone Call</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowAppointmentModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateAppointment}
                  className="btn btn-primary"
                >
                  Schedule Appointment
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Student Details Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedStudent.studentName} - Detailed Overview
                </h2>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XCircleIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    {selectedStudent.grades.currentAverage.toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Current Average</div>
                  <span className={`text-xs px-2 py-1 rounded-full ${getGradeColor(selectedStudent.grades.currentGrade)}`}>
                    {selectedStudent.grades.currentGrade}
                  </span>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    {selectedStudent.attendance.percentage.toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Attendance Rate</div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    selectedStudent.attendance.percentage >= 90 ? 'text-green-600 bg-green-100' :
                    selectedStudent.attendance.percentage >= 80 ? 'text-yellow-600 bg-yellow-100' :
                    'text-red-600 bg-red-100'
                  }`}>
                    {selectedStudent.attendance.percentage >= 90 ? 'Excellent' :
                     selectedStudent.attendance.percentage >= 80 ? 'Good' : 'Needs Improvement'}
                  </span>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    #{selectedStudent.grades.classRank}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Class Rank</div>
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded">
                    Stream #{selectedStudent.grades.streamRank}
                  </span>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    ${selectedStudent.fees.balance}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Fee Balance</div>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(selectedStudent.fees.status)}`}>
                    {selectedStudent.fees.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Subject Performance</h3>
                  <div className="space-y-2">
                    {selectedStudent.grades.subjects.map((subject, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{subject.subject}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-500">Rank #{subject.rank}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{subject.percentage}%</div>
                          <span className={`text-xs px-2 py-1 rounded-full ${getGradeColor(subject.grade)}`}>
                            {subject.grade}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activities</h3>
                  <div className="space-y-2">
                    {selectedStudent.recentActivities.map((activity, index) => (
                      <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{activity.activity}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-500">{activity.details}</div>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(activity.type)}`}>
                            {activity.type}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          {new Date(activity.date).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upcoming Events</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedStudent.upcomingEvents.map((event, index) => (
                    <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{event.title}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-500">{event.location}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {new Date(event.date).toLocaleDateString()}
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(event.type)}`}>
                            {event.type}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="btn btn-secondary"
                >
                  Close
                </button>
                <button className="btn btn-primary">
                  <ChatBubbleLeftRightIcon className="w-4 h-4 mr-2" />
                  Contact Teacher
                </button>
                <button className="btn btn-primary">
                  <CalendarDaysIcon className="w-4 h-4 mr-2" />
                  Schedule Meeting
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
