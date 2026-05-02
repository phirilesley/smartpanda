import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  AcademicCapIcon,
  BookOpenIcon,
  CalendarIcon,
  ChartBarIcon,
  ClockIcon,
  UserIcon,
  BellIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  PlayIcon,
  PauseIcon,
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
  FireIcon,
  SparklesIcon,
  LightBulbIcon,
  RocketLaunchIcon,
  HeartIcon,
  HandRaisedIcon,
  GiftIcon,
  BanknotesIcon,
  BriefcaseIcon,
  FolderIcon,
  ClipboardDocumentCheckIcon,
  UserGroupIcon,
  CalculatorIcon,
  TableCellsIcon,
} from '@heroicons/react/24/outline';

// Types
interface TeacherProfile {
  id: string;
  teacherId: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  department: string;
  specialization: string[];
  qualification: string;
  experience: number;
  grade: string;
  stream?: string;
  subjects: string[];
  classes: Array<{
    grade: string;
    stream: string;
    subject: string;
    room: string;
  }>;
  address: string;
  city: string;
  country: string;
  emergencyContact: string;
  maritalStatus: string;
  spouseName?: string;
  children?: number;
  skills: string[];
  certifications: Array<{
    name: string;
    issuer: string;
    date: string;
    expiryDate?: string;
  }>;
  avatar?: string;
  status: 'Active' | 'Inactive' | 'On Leave' | 'Suspended';
  twoFactorEnabled: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

interface TeachingOverview {
  id: string;
  teacherId: string;
  currentTerm: string;
  currentYear: string;
  totalStudents: number;
  totalClasses: number;
  totalSubjects: number;
  averageClassSize: number;
  teachingHours: {
    weekly: number;
    monthly: number;
    termly: number;
  };
  studentPerformance: {
    overallAverage: number;
    classAverages: Array<{
      grade: string;
      stream: string;
      subject: string;
      average: number;
      students: number;
    }>;
    improvementRate: number;
    topPerformers: Array<{
      studentName: string;
      grade: string;
      stream: string;
      percentage: number;
    }>;
    strugglingStudents: Array<{
      studentName: string;
      grade: string;
      stream: string;
      percentage: number;
      concerns: string[];
    }>;
  };
  attendance: {
    teacherAttendance: number;
    studentAttendance: number;
    classAttendance: Array<{
      grade: string;
      stream: string;
      rate: number;
    }>;
  };
  curriculum: {
    topicsCompleted: number;
    topicsTotal: number;
    onSchedule: boolean;
    ahead: boolean;
    behind: boolean;
    subjects: Array<{
      subject: string;
      completed: number;
      total: number;
      percentage: number;
    }>;
  };
  assessments: {
    total: number;
    graded: number;
    pending: number;
    averageScore: number;
    distribution: {
      'A+': number;
      'A': number;
      'B': number;
      'C': number;
      'D': number;
      'E': number;
      'F': number;
    };
  };
}

interface Course {
  id: string;
  code: string;
  name: string;
  description: string;
  grade: string;
  stream: string;
  credits: number;
  schedule: Array<{
    day: string;
    startTime: string;
    endTime: string;
    room: string;
  }>;
  syllabus: {
    topics: Array<{
      id: string;
      title: string;
      description: string;
      order: number;
      completed: boolean;
      dateCovered?: string;
      resources: Array<{
        type: 'video' | 'document' | 'link' | 'quiz';
        title: string;
        url: string;
        duration?: number;
      }>;
    }>;
    assessments: Array<{
      id: string;
      title: string;
      type: 'Quiz' | 'Test' | 'Assignment' | 'Project' | 'Exam';
      weight: number;
      scheduledDate: string;
      status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
      maxScore: number;
    }>;
  };
  students: Array<{
    studentId: string;
    studentName: string;
    studentNumber: string;
    attendance: number;
    currentGrade: string;
    currentPercentage: number;
    behavior: string;
  }>;
  materials: Array<{
    id: string;
    title: string;
    type: 'Textbook' | 'Workbook' | 'Lab Manual' | 'Reference' | 'Digital';
    quantity: number;
    available: number;
    condition: string;
  }>;
  announcements: Array<{
    id: string;
    title: string;
    message: string;
    date: string;
    important: boolean;
    attachments?: Array<{
      name: string;
      url: string;
    }>;
  }>;
}

interface Assignment {
  id: string;
  courseId: string;
  courseName: string;
  title: string;
  description: string;
  type: 'Homework' | 'Assignment' | 'Project' | 'Quiz' | 'Test' | 'Exam';
  instructions?: string;
  resources: Array<{
    name: string;
    url: string;
    type: string;
  }>;
  assignedDate: string;
  dueDate: string;
  dueTime: string;
  maxScore: number;
  weight: number;
  status: 'Draft' | 'Assigned' | 'In Progress' | 'Due Soon' | 'Overdue' | 'Grading' | 'Completed';
  submissions: {
    total: number;
    submitted: number;
    graded: number;
    pending: number;
    late: number;
  };
  averageScore?: number;
  gradeDistribution: {
    'A+': number;
    'A': number;
    'B': number;
    'C': number;
    'D': number;
    'E': number;
    'F': number;
  };
  rubric?: Array<{
    criterion: string;
    description: string;
    maxPoints: number;
    weight: number;
  }>;
  allowLateSubmission: boolean;
  latePenalty: number;
  resubmissionAllowed: boolean;
  groupWork: boolean;
  estimatedTime: number;
  createdAt: string;
  updatedAt: string;
}

interface StudentRecord {
  id: string;
  studentId: string;
  studentName: string;
  studentNumber: string;
  grade: string;
  stream: string;
  courseId: string;
  courseName: string;
  attendance: {
    present: number;
    absent: number;
    late: number;
    excused: number;
    percentage: number;
    total: number;
  };
  grades: Array<{
    assessmentId: string;
    title: string;
    type: string;
    score: number;
    maxScore: number;
    percentage: number;
    grade: string;
    weight: number;
    date: string;
    feedback?: string;
    late: boolean;
  }>;
  currentAverage: number;
  currentGrade: string;
  classRank: number;
  behavior: {
    status: 'Excellent' | 'Good' | 'Fair' | 'Poor';
    points: number;
    incidents: number;
    achievements: number;
    notes: string[];
  };
  participation: {
    level: 'High' | 'Medium' | 'Low';
    contributions: number;
    quality: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  };
  communication: {
    parentContact: number;
    lastContact?: string;
    concerns: string[];
    notes: string[];
  };
  lastUpdated: string;
}

interface TeacherSchedule {
  id: string;
  date: string;
  dayOfWeek: string;
  periods: Array<{
    period: number;
    startTime: string;
    endTime: string;
    subject: string;
    grade: string;
    stream: string;
    room: string;
    type: 'Regular' | 'Lab' | 'PE' | 'Assembly' | 'Break' | 'Lunch' | 'Meeting' | 'Duty';
    status: 'Scheduled' | 'Completed' | 'Cancelled' | 'Modified';
    notes?: string;
  }>;
  duties: Array<{
    title: string;
    time: string;
    location: string;
    type: 'Supervision' | 'Meeting' | 'Event' | 'Other';
  }>;
  meetings: Array<{
    title: string;
    time: string;
    duration: number;
    location: string;
    type: 'Department' | 'Staff' | 'Parent' | 'Student' | 'Other';
    attendees: string[];
  }>;
  freePeriods: number;
  totalTeachingHours: number;
}

interface ParentCommunication {
  id: string;
  type: 'Message' | 'Meeting' | 'Call' | 'Email' | 'SMS';
  title: string;
  description?: string;
  parentName: string;
  parentContact: string;
  studentId: string;
  studentName: string;
  grade: string;
  stream: string;
  reason: 'Academic' | 'Behavior' | 'Attendance' | 'General' | 'Emergency';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Initiated' | 'In Progress' | 'Completed' | 'Cancelled' | 'Scheduled';
  timestamp: string;
  scheduledDate?: string;
  duration?: number;
  outcome?: string;
  followUpRequired: boolean;
  followUpDate?: string;
  notes: string[];
  attachments: Array<{
    name: string;
    url: string;
    type: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface Resource {
  id: string;
  title: string;
  description?: string;
  type: 'Document' | 'Video' | 'Audio' | 'Presentation' | 'Link' | 'Image' | 'Software' | 'Other';
  category: 'Teaching Material' | 'Reference' | 'Assessment' | 'Template' | 'Curriculum' | 'Other';
  subject?: string;
  grade?: string;
  stream?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  fileFormat?: string;
  linkUrl?: string;
  duration?: number;
  tags: string[];
  shared: boolean;
  sharedWith: Array<{
    teacherId: string;
    teacherName: string;
    accessLevel: 'View' | 'Download' | 'Edit';
  }>;
  downloadCount: number;
  rating: number;
  reviews: number;
  uploadDate: string;
  lastModified: string;
  createdBy: string;
}

export const TeacherPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'courses' | 'assignments' | 'students' | 'schedule' | 'communication' | 'resources' | 'reports'>('dashboard');
  const [teacherProfile, setTeacherProfile] = useState<TeacherProfile | null>(null);
  const [teachingOverview, setTeachingOverview] = useState<TeachingOverview | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [studentRecords, setStudentRecords] = useState<StudentRecord[]>([]);
  const [schedule, setSchedule] = useState<TeacherSchedule[]>([]);
  const [communications, setCommunications] = useState<ParentCommunication[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourse, setFilterCourse] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(null);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

  // Mock data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock teacher profile
      const mockProfile: TeacherProfile = {
        id: 'teacher-001',
        teacherId: 'teacher-001',
        employeeNumber: 'EMP2024001',
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@smartpanda.edu',
        phone: '+263 4 777 888',
        dateOfBirth: '1985-06-15',
        gender: 'Female',
        department: 'Mathematics',
        specialization: ['Algebra', 'Geometry', 'Statistics'],
        qualification: 'M.Sc. Mathematics',
        experience: 8,
        grade: 'Form 1',
        stream: 'A',
        subjects: ['Mathematics', 'Additional Mathematics'],
        classes: [
          {
            grade: 'Form 1',
            stream: 'A',
            subject: 'Mathematics',
            room: 'Room 101',
          },
          {
            grade: 'Form 2',
            stream: 'B',
            subject: 'Mathematics',
            room: 'Room 102',
          },
        ],
        address: '456 Teacher Avenue',
        city: 'Harare',
        country: 'Zimbabwe',
        emergencyContact: '+263 4 999 888',
        maritalStatus: 'Married',
        spouseName: 'David Johnson',
        children: 2,
        skills: ['Curriculum Development', 'Student Assessment', 'Technology Integration', 'Mentoring'],
        certifications: [
          {
            name: 'Advanced Mathematics Teaching',
            issuer: 'Zimbabwe Ministry of Education',
            date: '2020-01-15',
            expiryDate: '2025-01-15',
          },
        ],
        status: 'Active',
        twoFactorEnabled: true,
        lastLogin: '2024-02-20T07:30:00Z',
        createdAt: '2020-01-15T00:00:00Z',
        updatedAt: '2024-02-20T07:30:00Z',
      };

      // Mock teaching overview
      const mockTeachingOverview: TeachingOverview = {
        id: 'overview-001',
        teacherId: 'teacher-001',
        currentTerm: 'Term 1',
        currentYear: '2024',
        totalStudents: 62,
        totalClasses: 4,
        totalSubjects: 2,
        averageClassSize: 31,
        teachingHours: {
          weekly: 24,
          monthly: 96,
          termly: 288,
        },
        studentPerformance: {
          overallAverage: 78.5,
          classAverages: [
            {
              grade: 'Form 1',
              stream: 'A',
              subject: 'Mathematics',
              average: 82.3,
              students: 30,
            },
            {
              grade: 'Form 2',
              stream: 'B',
              subject: 'Mathematics',
              average: 74.7,
              students: 32,
            },
          ],
          improvementRate: 12.5,
          topPerformers: [
            {
              studentName: 'John Smith',
              grade: 'Form 1',
              stream: 'A',
              percentage: 92.0,
            },
            {
              studentName: 'Emma Davis',
              grade: 'Form 2',
              stream: 'B',
              percentage: 88.5,
            },
          ],
          strugglingStudents: [
            {
              studentName: 'Michael Brown',
              grade: 'Form 2',
              stream: 'B',
              percentage: 45.2,
              concerns: ['Basic concepts', 'Homework completion'],
            },
          ],
        },
        attendance: {
          teacherAttendance: 98.5,
          studentAttendance: 94.2,
          classAttendance: [
            {
              grade: 'Form 1',
              stream: 'A',
              rate: 96.0,
            },
            {
              grade: 'Form 2',
              stream: 'B',
              rate: 92.4,
            },
          ],
        },
        curriculum: {
          topicsCompleted: 24,
          topicsTotal: 30,
          onSchedule: true,
          ahead: true,
          behind: false,
          subjects: [
            {
              subject: 'Mathematics',
              completed: 14,
              total: 16,
              percentage: 87.5,
            },
            {
              subject: 'Additional Mathematics',
              completed: 10,
              total: 14,
              percentage: 71.4,
            },
          ],
        },
        assessments: {
          total: 18,
          graded: 15,
          pending: 3,
          averageScore: 76.8,
          distribution: {
            'A+': 3,
            'A': 8,
            'B': 12,
            'C': 18,
            'D': 8,
            'E': 4,
            'F': 2,
          },
        },
      };

      // Mock courses
      const mockCourses: Course[] = [
        {
          id: 'course-001',
          code: 'MATH101',
          name: 'Mathematics',
          description: 'Form 1 Mathematics covering algebra, geometry, and basic statistics',
          grade: 'Form 1',
          stream: 'A',
          credits: 5,
          schedule: [
            {
              day: 'Monday',
              startTime: '08:00',
              endTime: '09:00',
              room: 'Room 101',
            },
            {
              day: 'Wednesday',
              startTime: '08:00',
              endTime: '09:00',
              room: 'Room 101',
            },
            {
              day: 'Friday',
              startTime: '08:00',
              endTime: '09:00',
              room: 'Room 101',
            },
          ],
          syllabus: {
            topics: [
              {
                id: 'topic-001',
                title: 'Linear Equations',
                description: 'Solving linear equations and inequalities',
                order: 1,
                completed: true,
                dateCovered: '2024-02-01',
                resources: [
                  {
                    type: 'video',
                    title: 'Introduction to Linear Equations',
                    url: '/videos/linear_equations_intro.mp4',
                    duration: 1200,
                  },
                ],
              },
              {
                id: 'topic-002',
                title: 'Quadratic Functions',
                description: 'Understanding and solving quadratic equations',
                order: 2,
                completed: false,
                resources: [],
              },
            ],
            assessments: [
              {
                id: 'assessment-001',
                title: 'Linear Equations Quiz',
                type: 'Quiz',
                weight: 10,
                scheduledDate: '2024-02-25',
                status: 'Scheduled',
                maxScore: 50,
              },
            ],
          },
          students: [
            {
              studentId: 'student-001',
              studentName: 'John Smith',
              studentNumber: 'STU2024001',
              attendance: 96,
              currentGrade: 'A',
              currentPercentage: 85,
              behavior: 'Excellent',
            },
            {
              studentId: 'student-002',
              studentName: 'Sarah Johnson',
              studentNumber: 'STU2024002',
              attendance: 94,
              currentGrade: 'B',
              currentPercentage: 78,
              behavior: 'Good',
            },
          ],
          materials: [
            {
              id: 'mat-001',
              title: 'Mathematics Textbook Form 1',
              type: 'Textbook',
              quantity: 35,
              available: 32,
              condition: 'Good',
            },
          ],
          announcements: [
            {
              id: 'ann-001',
              title: 'Extra Help Session',
              message: 'Extra help session available every Tuesday after school',
              date: '2024-02-18',
              important: false,
            },
          ],
        },
        {
          id: 'course-002',
          code: 'MATH102',
          name: 'Mathematics',
          description: 'Form 2 Mathematics building on Form 1 concepts',
          grade: 'Form 2',
          stream: 'B',
          credits: 5,
          schedule: [
            {
              day: 'Tuesday',
              startTime: '09:00',
              endTime: '10:00',
              room: 'Room 102',
            },
            {
              day: 'Thursday',
              startTime: '09:00',
              endTime: '10:00',
              room: 'Room 102',
            },
          ],
          syllabus: {
            topics: [
              {
                id: 'topic-003',
                title: 'Advanced Algebra',
                description: 'Complex algebraic expressions and equations',
                order: 1,
                completed: true,
                dateCovered: '2024-02-05',
                resources: [],
              },
            ],
            assessments: [],
          },
          students: [
            {
              studentId: 'student-003',
              studentName: 'Michael Brown',
              studentNumber: 'STU2024003',
              attendance: 88,
              currentGrade: 'C',
              currentPercentage: 65,
              behavior: 'Fair',
            },
          ],
          materials: [],
          announcements: [],
        },
      ];

      // Mock assignments
      const mockAssignments: Assignment[] = [
        {
          id: 'assign-001',
          courseId: 'course-001',
          courseName: 'Mathematics',
          title: 'Linear Equations Homework',
          description: 'Complete problems 1-20 on page 45',
          type: 'Homework',
          instructions: 'Show all your work and write clearly',
          resources: [
            {
              name: 'Worksheet PDF',
              url: '/resources/linear_equations_worksheet.pdf',
              type: 'pdf',
            },
          ],
          assignedDate: '2024-02-18',
          dueDate: '2024-02-25',
          dueTime: '23:59',
          maxScore: 50,
          weight: 10,
          status: 'In Progress',
          submissions: {
            total: 30,
            submitted: 25,
            graded: 20,
            pending: 5,
            late: 2,
          },
          averageScore: 82.5,
          gradeDistribution: {
            'A+': 3,
            'A': 8,
            'B': 10,
            'C': 6,
            'D': 2,
            'E': 1,
            'F': 0,
          },
          allowLateSubmission: true,
          latePenalty: 10,
          resubmissionAllowed: true,
          groupWork: false,
          estimatedTime: 60,
          createdAt: '2024-02-18T10:00:00Z',
          updatedAt: '2024-02-20T14:30:00Z',
        },
        {
          id: 'assign-002',
          courseId: 'course-001',
          courseName: 'Mathematics',
          title: 'Algebra Quiz',
          description: 'Quiz on linear and quadratic equations',
          type: 'Quiz',
          resources: [],
          assignedDate: '2024-02-10',
          dueDate: '2024-02-25',
          dueTime: '10:00',
          maxScore: 50,
          weight: 15,
          status: 'Due Soon',
          submissions: {
            total: 30,
            submitted: 0,
            graded: 0,
            pending: 30,
            late: 0,
          },
          allowLateSubmission: false,
          latePenalty: 0,
          resubmissionAllowed: false,
          groupWork: false,
          estimatedTime: 45,
          createdAt: '2024-02-10T14:00:00Z',
          updatedAt: '2024-02-10T14:00:00Z',
        },
      ];

      // Mock student records
      const mockStudentRecords: StudentRecord[] = [
        {
          id: 'record-001',
          studentId: 'student-001',
          studentName: 'John Smith',
          studentNumber: 'STU2024001',
          grade: 'Form 1',
          stream: 'A',
          courseId: 'course-001',
          courseName: 'Mathematics',
          attendance: {
            present: 24,
            absent: 1,
            late: 0,
            excused: 0,
            percentage: 96,
            total: 25,
          },
          grades: [
            {
              assessmentId: 'assign-001',
              title: 'Linear Equations Homework',
              type: 'Homework',
              score: 45,
              maxScore: 50,
              percentage: 90,
              grade: 'A',
              weight: 10,
              date: '2024-02-20',
              feedback: 'Excellent work on problem solving',
              late: false,
            },
          ],
          currentAverage: 85.0,
          currentGrade: 'A',
          classRank: 2,
          behavior: {
            status: 'Excellent',
            points: 95,
            incidents: 0,
            achievements: 3,
            notes: ['Excellent participation in class discussions'],
          },
          participation: {
            level: 'High',
            contributions: 15,
            quality: 'Excellent',
          },
          communication: {
            parentContact: 2,
            lastContact: '2024-02-15',
            concerns: [],
            notes: ['Parents very supportive of student learning'],
          },
          lastUpdated: '2024-02-20T14:30:00Z',
        },
        {
          id: 'record-002',
          studentId: 'student-003',
          studentName: 'Michael Brown',
          studentNumber: 'STU2024003',
          grade: 'Form 2',
          stream: 'B',
          courseId: 'course-002',
          courseName: 'Mathematics',
          attendance: {
            present: 22,
            absent: 2,
            late: 1,
            excused: 0,
            percentage: 88,
            total: 25,
          },
          grades: [],
          currentAverage: 65.0,
          currentGrade: 'C',
          classRank: 25,
          behavior: {
            status: 'Fair',
            points: 75,
            incidents: 2,
            achievements: 1,
            notes: ['Needs improvement in homework completion'],
          },
          participation: {
            level: 'Low',
            contributions: 5,
            quality: 'Fair',
          },
          communication: {
            parentContact: 3,
            lastContact: '2024-02-18',
            concerns: ['Struggling with basic concepts'],
            notes: ['Parents requested additional support'],
          },
          lastUpdated: '2024-02-20T14:30:00Z',
        },
      ];

      // Mock schedule
      const mockSchedule: TeacherSchedule[] = [
        {
          id: 'schedule-001',
          date: '2024-02-21',
          dayOfWeek: 'Wednesday',
          periods: [
            {
              period: 1,
              startTime: '08:00',
              endTime: '09:00',
              subject: 'Mathematics',
              grade: 'Form 1',
              stream: 'A',
              room: 'Room 101',
              type: 'Regular',
              status: 'Scheduled',
            },
            {
              period: 2,
              startTime: '09:00',
              endTime: '10:00',
              subject: 'Mathematics',
              grade: 'Form 2',
              stream: 'B',
              room: 'Room 102',
              type: 'Regular',
              status: 'Scheduled',
            },
            {
              period: 3,
              startTime: '10:00',
              endTime: '10:30',
              subject: 'Break',
              grade: '',
              stream: '',
              room: 'Staff Room',
              type: 'Break',
              status: 'Scheduled',
            },
            {
              period: 4,
              startTime: '10:30',
              endTime: '11:30',
              subject: 'Mathematics',
              grade: 'Form 1',
              stream: 'A',
              room: 'Lab 201',
              type: 'Lab',
              status: 'Scheduled',
            },
          ],
          duties: [
            {
              title: 'Break Duty',
              time: '10:00',
              location: 'Playground',
              type: 'Supervision',
            },
          ],
          meetings: [
            {
              title: 'Department Meeting',
              time: '14:00',
              duration: 60,
              location: 'Conference Room',
              type: 'Department',
              attendees: ['All Math Teachers'],
            },
          ],
          freePeriods: 2,
          totalTeachingHours: 5,
        },
      ];

      // Mock communications
      const mockCommunications: ParentCommunication[] = [
        {
          id: 'comm-001',
          type: 'Meeting',
          title: 'Parent-Teacher Conference',
          description: 'Discuss Michael\'s academic progress',
          parentName: 'Mrs. Mary Brown',
          parentContact: '+263 4 555 666',
          studentId: 'student-003',
          studentName: 'Michael Brown',
          grade: 'Form 2',
          stream: 'B',
          reason: 'Academic',
          priority: 'Medium',
          status: 'Scheduled',
          timestamp: '2024-02-20T16:00:00Z',
          scheduledDate: '2024-02-25T15:00:00Z',
          duration: 30,
          followUpRequired: false,
          notes: ['Parent concerned about recent test scores'],
          attachments: [],
          createdAt: '2024-02-20T16:00:00Z',
          updatedAt: '2024-02-20T16:00:00Z',
        },
        {
          id: 'comm-002',
          type: 'Email',
          title: 'Progress Update - John Smith',
          description: 'Monthly progress report',
          parentName: 'Mr. John Smith Sr.',
          parentContact: 'john.smith.sr@email.com',
          studentId: 'student-001',
          studentName: 'John Smith',
          grade: 'Form 1',
          stream: 'A',
          reason: 'Academic',
          priority: 'Low',
          status: 'Completed',
          timestamp: '2024-02-18T10:00:00Z',
          outcome: 'Parent pleased with progress',
          followUpRequired: false,
          notes: ['Excellent performance maintained'],
          attachments: [
            {
              name: 'progress_report.pdf',
              url: '/documents/progress_report.pdf',
              type: 'pdf',
            },
          ],
          createdAt: '2024-02-18T10:00:00Z',
          updatedAt: '2024-02-18T14:30:00Z',
        },
      ];

      // Mock resources
      const mockResources: Resource[] = [
        {
          id: 'res-001',
          title: 'Mathematics Textbook Form 1',
          description: 'Complete textbook for Form 1 Mathematics',
          type: 'Document',
          category: 'Teaching Material',
          subject: 'Mathematics',
          grade: 'Form 1',
          fileUrl: '/resources/math_textbook_form1.pdf',
          fileName: 'math_textbook_form1.pdf',
          fileSize: 10485760,
          fileFormat: 'PDF',
          tags: ['textbook', 'form1', 'mathematics'],
          shared: true,
          sharedWith: [
            {
              teacherId: 'teacher-002',
              teacherName: 'Mr. David Wilson',
              accessLevel: 'View',
            },
          ],
          downloadCount: 45,
          rating: 4.5,
          reviews: 12,
          uploadDate: '2024-01-15',
          lastModified: '2024-01-15',
          createdBy: 'teacher-001',
        },
        {
          id: 'res-002',
          title: 'Algebra Video Series',
          description: 'Comprehensive video lessons on algebra',
          type: 'Video',
          category: 'Teaching Material',
          subject: 'Mathematics',
          linkUrl: 'https://video.example.com/algebra',
          duration: 3600,
          tags: ['video', 'algebra', 'mathematics'],
          shared: false,
          sharedWith: [],
          downloadCount: 0,
          rating: 4.8,
          reviews: 8,
          uploadDate: '2024-02-01',
          lastModified: '2024-02-01',
          createdBy: 'teacher-001',
        },
      ];
      
      setTeacherProfile(mockProfile);
      setTeachingOverview(mockTeachingOverview);
      setCourses(mockCourses);
      setAssignments(mockAssignments);
      setStudentRecords(mockStudentRecords);
      setSchedule(mockSchedule);
      setCommunications(mockCommunications);
      setResources(mockResources);
      setLoading(false);
    };

    loadData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
      case 'Completed':
      case 'Present':
      case 'Excellent':
      case 'A':
      case 'A+':
        return 'text-success-600 bg-success-100';
      case 'In Progress':
      case 'Pending':
      case 'Good':
      case 'B':
      case 'B+':
      case 'Due Soon':
        return 'text-warning-600 bg-warning-100';
      case 'Overdue':
      case 'Absent':
      case 'Poor':
      case 'C':
      case 'D':
      case 'E':
      case 'F':
      case 'Cancelled':
        return 'text-red-600 bg-red-100';
      case 'Not Started':
      case 'Fair':
      case 'Scheduled':
      case 'Draft':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent':
      case 'High':
        return 'text-red-600 bg-red-100';
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
      case 'Academic':
      case 'Grade':
        return 'text-blue-600 bg-blue-100';
      case 'Assignment':
        return 'text-purple-600 bg-purple-100';
      case 'Attendance':
        return 'text-green-600 bg-green-100';
      case 'Event':
      case 'Meeting':
        return 'text-orange-600 bg-orange-100';
      case 'System':
        return 'text-gray-600 bg-gray-100';
      case 'Emergency':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.courseName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = filterCourse === 'all' || assignment.courseId === filterCourse;
    const matchesStatus = filterStatus === 'all' || assignment.status === filterStatus;
    return matchesSearch && matchesCourse && matchesStatus;
  });

  const filteredStudentRecords = studentRecords.filter(record => {
    const matchesSearch = record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.studentNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = filterCourse === 'all' || record.courseId === filterCourse;
    return matchesSearch && matchesCourse;
  });

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
              Teacher Portal
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage your classes, students, and teaching resources
            </p>
          </div>
          <div className="flex gap-3">
            <button className="btn btn-secondary">
              <BellIcon className="w-4 h-4 mr-2" />
              Notifications
            </button>
          </div>
        </div>
      </div>

      {/* Teacher Profile Card */}
      {teacherProfile && (
        <div className="card mb-6">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                  <UserIcon className="w-8 h-8 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {teacherProfile.firstName} {teacherProfile.lastName}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {teacherProfile.employeeNumber} • {teacherProfile.department}
                  </p>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-500 dark:text-gray-500">
                    <span className="flex items-center gap-1">
                      <EnvelopeIcon className="w-4 h-4" />
                      {teacherProfile.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <AcademicCapIcon className="w-4 h-4" />
                      {teacherProfile.qualification}
                    </span>
                  </div>
                </div>
              </div>
              {teachingOverview && (
                <div className="text-right">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Students</div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {teachingOverview.totalStudents}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="flex space-x-8">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: ChartBarIcon },
            { id: 'courses', label: 'Courses', icon: BookOpenIcon },
            { id: 'assignments', label: 'Assignments', icon: ClipboardDocumentListIcon },
            { id: 'students', label: 'Students', icon: UsersIcon },
            { id: 'schedule', label: 'Schedule', icon: CalendarDaysIcon },
            { id: 'communication', label: 'Communication', icon: ChatBubbleLeftRightIcon },
            { id: 'resources', label: 'Resources', icon: FolderIcon },
            { id: 'reports', label: 'Reports', icon: DocumentTextIcon },
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
      {activeTab === 'dashboard' && teachingOverview && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
          >
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Students</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {teachingOverview.totalStudents}
                  </p>
                </div>
                <UsersIcon className="w-8 h-8 text-blue-600" />
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
                  <p className="text-sm text-gray-600 dark:text-gray-400">Class Average</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {teachingOverview.studentPerformance.overallAverage.toFixed(1)}%
                  </p>
                </div>
                <ChartBarIcon className="w-8 h-8 text-green-600" />
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
                  <p className="text-sm text-gray-600 dark:text-gray-400">Pending Grades</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {teachingOverview.assessments.pending}
                  </p>
                </div>
                <ClipboardDocumentCheckIcon className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card"
          >
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Curriculum Progress</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {((teachingOverview.curriculum.topicsCompleted / teachingOverview.curriculum.topicsTotal) * 100).toFixed(0)}%
                  </p>
                </div>
                <BookOpenIcon className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {activeTab === 'courses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card card-hover"
            >
              <div className="card-body">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {course.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {course.code} • {course.grade} - {course.stream}
                    </p>
                  </div>
                  <button 
                    onClick={() => setSelectedCourse(course)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <EyeIcon className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Students</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {course.students.length}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Schedule</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {course.schedule.length} days/week
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Topics</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {course.syllabus.topics.filter(t => t.completed).length}/{course.syllabus.topics.length}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Assessments</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {course.syllabus.assessments.length}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Progress:</div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary-600 h-2 rounded-full"
                        style={{ width: `${(course.syllabus.topics.filter(t => t.completed).length / course.syllabus.topics.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {course.announcements.length > 0 && (
                    <div className="text-xs text-gray-500 dark:text-gray-500">
                      Latest: {course.announcements[0].title}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-sm text-gray-500 dark:text-gray-500">
                    Next: {course.schedule[0]?.day} {course.schedule[0]?.startTime}
                  </div>
                  <div className="flex gap-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      <BookOpenIcon className="w-4 h-4" />
                    </button>
                    <button className="text-blue-600 hover:text-blue-800">
                      <UsersIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'assignments' && (
        <div className="space-y-4">
          <div className="card mb-6">
            <div className="card-body">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search assignments..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="form-input pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <select
                    value={filterCourse}
                    onChange={(e) => setFilterCourse(e.target.value)}
                    className="form-input"
                  >
                    <option value="all">All Courses</option>
                    {courses.map(course => (
                      <option key={course.id} value={course.id}>
                        {course.name}
                      </option>
                    ))}
                  </select>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="form-input"
                  >
                    <option value="all">All Status</option>
                    <option value="Draft">Draft</option>
                    <option value="Assigned">Assigned</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Due Soon">Due Soon</option>
                    <option value="Overdue">Overdue</option>
                    <option value="Grading">Grading</option>
                    <option value="Completed">Completed</option>
                  </select>
                  <button className="btn btn-secondary">
                    <FunnelIcon className="w-4 h-4 mr-2" />
                    Filters
                  </button>
                </div>
              </div>
            </div>
          </div>

          {filteredAssignments.map((assignment, index) => (
            <motion.div
              key={assignment.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card"
            >
              <div className="card-body">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(assignment.type)}`}>
                        {assignment.type}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(assignment.status)}`}>
                        {assignment.status}
                      </span>
                    </div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                      {assignment.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {assignment.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                      <span>Course: {assignment.courseName}</span>
                      <span>Due: {new Date(assignment.dueDate).toLocaleDateString()} {assignment.dueTime}</span>
                      <span>Max Score: {assignment.maxScore}</span>
                      <span>Weight: {assignment.weight}%</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500 mt-2">
                      <span>Submissions: {assignment.submissions.submitted}/{assignment.submissions.total}</span>
                      <span>Graded: {assignment.submissions.graded}</span>
                      <span>Pending: {assignment.submissions.pending}</span>
                      {assignment.averageScore && <span>Average: {assignment.averageScore.toFixed(1)}</span>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setSelectedAssignment(assignment)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </button>
                    <button className="text-blue-600 hover:text-blue-800">
                      <PencilIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'students' && (
        <div className="space-y-4">
          <div className="card mb-6">
            <div className="card-body">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search students..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="form-input pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <select
                    value={filterCourse}
                    onChange={(e) => setFilterCourse(e.target.value)}
                    className="form-input"
                  >
                    <option value="all">All Courses</option>
                    {courses.map(course => (
                      <option key={course.id} value={course.id}>
                        {course.name}
                      </option>
                    ))}
                  </select>
                  <button className="btn btn-secondary">
                    <FunnelIcon className="w-4 h-4 mr-2" />
                    Filters
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudentRecords.map((record, index) => (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card card-hover"
              >
                <div className="card-body">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {record.studentName}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {record.studentNumber} • {record.grade} - {record.stream}
                      </p>
                    </div>
                    <button 
                      onClick={() => setSelectedStudent(record)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <EyeIcon className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Current Grade</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(record.currentGrade)}`}>
                        {record.currentGrade}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Average</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {record.currentAverage.toFixed(1)}%
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Class Rank</span>
                      <span className="text-sm text-gray-500 dark:text-gray-500">
                        #{record.classRank}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Attendance</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        record.attendance.percentage >= 95 ? 'text-green-600 bg-green-100' :
                        record.attendance.percentage >= 90 ? 'text-yellow-600 bg-yellow-100' :
                        'text-red-600 bg-red-100'
                      }`}>
                        {record.attendance.percentage.toFixed(1)}%
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Behavior</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(record.behavior.status)}`}>
                        {record.behavior.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Participation</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        record.participation.level === 'High' ? 'text-green-600 bg-green-100' :
                        record.participation.level === 'Medium' ? 'text-yellow-600 bg-yellow-100' :
                        'text-red-600 bg-red-100'
                      }`}>
                        {record.participation.level}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {record.communication.concerns.length > 0 && (
                        <span className="text-xs px-2 py-1 bg-orange-100 text-orange-600 rounded">
                          {record.communication.concerns.length} Concern(s)
                        </span>
                      )}
                      {record.behavior.incidents > 0 && (
                        <span className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded">
                          {record.behavior.incidents} Incident(s)
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-sm text-gray-500 dark:text-gray-500">
                      Last updated {new Date(record.lastUpdated).toLocaleDateString()}
                    </div>
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-800">
                        <ChatBubbleLeftRightIcon className="w-4 h-4" />
                      </button>
                      <button className="text-blue-600 hover:text-blue-800">
                        <DocumentTextIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'schedule' && (
        <div className="space-y-6">
          {schedule.map((day, index) => (
            <motion.div
              key={day.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card"
            >
              <div className="card-body">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {day.date} - {day.dayOfWeek}
                  </h3>
                  <div className="flex gap-2 text-sm text-gray-500 dark:text-gray-500">
                    <span>{day.totalTeachingHours} teaching hours</span>
                    <span>{day.freePeriods} free periods</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {day.periods.map((period, periodIndex) => (
                    <div key={periodIndex} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            Period {period.period}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-500">
                            {period.startTime} - {period.endTime}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {period.subject}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-500">
                            {period.grade} - {period.stream} • {period.room}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(period.status)}`}>
                          {period.status}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          period.type === 'Regular' ? 'text-blue-600 bg-blue-100' :
                          period.type === 'Lab' ? 'text-green-600 bg-green-100' :
                          period.type === 'Break' || period.type === 'Lunch' ? 'text-gray-600 bg-gray-100' :
                          period.type === 'Meeting' ? 'text-purple-600 bg-purple-100' :
                          period.type === 'Duty' ? 'text-orange-600 bg-orange-100' :
                          'text-blue-600 bg-blue-100'
                        }`}>
                          {period.type}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {day.duties.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Duties</h4>
                    <div className="space-y-2">
                      {day.duties.map((duty, dutyIndex) => (
                        <div key={dutyIndex} className="flex items-center justify-between p-2 bg-orange-50 dark:bg-orange-900/20 rounded">
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {duty.title}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-500">
                              {duty.time} • {duty.location}
                            </div>
                          </div>
                          <span className="text-xs px-2 py-1 bg-orange-100 text-orange-600 rounded">
                            {duty.type}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {day.meetings.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Meetings</h4>
                    <div className="space-y-2">
                      {day.meetings.map((meeting, meetingIndex) => (
                        <div key={meetingIndex} className="flex items-center justify-between p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {meeting.title}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-500">
                              {meeting.time} ({meeting.duration}min) • {meeting.location}
                            </div>
                          </div>
                          <span className="text-xs px-2 py-1 bg-purple-100 text-purple-600 rounded">
                            {meeting.type}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'communication' && (
        <div className="space-y-4">
          {communications.map((comm, index) => (
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
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {comm.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                      <span>Parent: {comm.parentName}</span>
                      <span>Student: {comm.studentName}</span>
                      <span>{comm.grade} - {comm.stream}</span>
                      <span>Reason: {comm.reason}</span>
                    </div>
                    {comm.scheduledDate && (
                      <div className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                        Scheduled: {new Date(comm.scheduledDate).toLocaleString()}
                      </div>
                    )}
                    {comm.followUpRequired && (
                      <div className="text-xs text-orange-600 font-medium mt-2">
                        Follow-up Required
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      <EyeIcon className="w-4 h-4" />
                    </button>
                    <button className="text-blue-600 hover:text-blue-800">
                      <PencilIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'resources' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource, index) => (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card card-hover"
            >
              <div className="card-body">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                      {resource.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {resource.category}
                    </p>
                  </div>
                  <FolderIcon className="w-6 h-6 text-gray-400" />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Type</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(resource.type)}`}>
                      {resource.type}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Size</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {resource.fileSize ? `${(resource.fileSize / 1024 / 1024).toFixed(2)} MB` : 'N/A'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Downloads</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {resource.downloadCount}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Rating</span>
                    <div className="flex items-center gap-1">
                      <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-500 dark:text-gray-500">
                        {resource.rating} ({resource.reviews})
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {resource.shared && (
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded">
                        Shared
                      </span>
                    )}
                    {resource.sharedWith.length > 0 && (
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded">
                        {resource.sharedWith.length} shared
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Tags:</div>
                    <div className="flex flex-wrap gap-1">
                      {resource.tags.slice(0, 3).map((tag, i) => (
                        <span key={i} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                          {tag}
                        </span>
                      ))}
                      {resource.tags.length > 3 && (
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                          +{resource.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {resource.description && (
                    <div className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {resource.description}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-sm text-gray-500 dark:text-gray-500">
                    {new Date(resource.uploadDate).toLocaleDateString()}
                  </div>
                  <div className="flex gap-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      <EyeIcon className="w-4 h-4" />
                    </button>
                    <button className="text-blue-600 hover:text-blue-800">
                      <DocumentArrowDownIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: 'Class Performance Report',
              description: 'Detailed analysis of class performance across all subjects',
              icon: ChartBarIcon,
              color: 'blue',
            },
            {
              title: 'Student Progress Report',
              description: 'Individual student progress and development tracking',
              icon: UserIcon,
              color: 'green',
            },
            {
              title: 'Attendance Report',
              description: 'Comprehensive attendance analysis and trends',
              icon: CalendarIcon,
              color: 'purple',
            },
            {
              title: 'Curriculum Coverage Report',
              description: 'Progress report on curriculum completion',
              icon: BookOpenIcon,
              color: 'orange',
            },
            {
              title: 'Assessment Analysis',
              description: 'Detailed assessment results and statistics',
              icon: ClipboardDocumentCheckIcon,
              color: 'red',
            },
            {
              title: 'Parent Communication Log',
              description: 'Summary of all parent communications',
              icon: ChatBubbleLeftRightIcon,
              color: 'indigo',
            },
          ].map((report, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card card-hover"
            >
              <div className="card-body">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <report.icon className={`w-6 h-6 text-${report.color}-600`} />
                  </div>
                  <button className="text-blue-600 hover:text-blue-800">
                    <DocumentArrowDownIcon className="w-5 h-5" />
                  </button>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {report.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {report.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-500">
                    Last generated: Today
                  </span>
                  <button className="btn btn-primary btn-sm">
                    Generate Report
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Course Details Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedCourse.name}
                </h2>
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XCircleIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Course Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Course Code:</span>
                      <span className="text-gray-900 dark:text-white">{selectedCourse.code}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Grade:</span>
                      <span className="text-gray-900 dark:text-white">{selectedCourse.grade}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Stream:</span>
                      <span className="text-gray-900 dark:text-white">{selectedCourse.stream}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Credits:</span>
                      <span className="text-gray-900 dark:text-white">{selectedCourse.credits}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Students:</span>
                      <span className="text-gray-900 dark:text-white">{selectedCourse.students.length}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Schedule</h3>
                  <div className="space-y-2">
                    {selectedCourse.schedule.map((schedule, index) => (
                      <div key={index} className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">{schedule.day}:</span>
                        <span className="text-gray-900 dark:text-white">
                          {schedule.startTime} - {schedule.endTime} ({schedule.room})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Syllabus Topics</h3>
                <div className="space-y-3">
                  {selectedCourse.syllabus.topics.map((topic, index) => (
                    <div key={topic.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">{topic.title}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{topic.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            topic.completed ? 'text-green-600 bg-green-100' : 'text-yellow-600 bg-yellow-100'
                          }`}>
                            {topic.completed ? 'Completed' : 'Pending'}
                          </span>
                          {topic.dateCovered && (
                            <span className="text-xs text-gray-500 dark:text-gray-500">
                              {new Date(topic.dateCovered).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Students</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedCourse.students.slice(0, 6).map((student, index) => (
                    <div key={student.studentId} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">{student.studentName}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{student.studentNumber}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{student.currentPercentage}%</div>
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(student.currentGrade)}`}>
                            {student.currentGrade}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="btn btn-secondary"
                >
                  Close
                </button>
                <button className="btn btn-primary">
                  <UsersIcon className="w-4 h-4 mr-2" />
                  View All Students
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
