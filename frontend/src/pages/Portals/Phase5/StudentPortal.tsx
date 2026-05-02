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
} from '@heroicons/react/24/outline';

// Types
interface StudentProfile {
  id: string;
  studentId: string;
  studentNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  grade: string;
  stream: string;
  section?: string;
  house?: string;
  admissionDate: string;
  admissionNumber: string;
  guardianName: string;
  guardianContact: string;
  guardianEmail: string;
  emergencyContact: string;
  address: string;
  city: string;
  country: string;
  nationality: string;
  religion?: string;
  medicalConditions: string[];
  allergies: string[];
  specialNeeds?: string;
  learningStyle: 'Visual' | 'Auditory' | 'Kinesthetic' | 'Mixed';
  interests: string[];
  hobbies: string[];
  skills: string[];
  careerGoals?: string;
  avatar?: string;
  status: 'Active' | 'Inactive' | 'Suspended' | 'Graduated';
  twoFactorEnabled: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

interface AcademicOverview {
  id: string;
  studentId: string;
  currentTerm: string;
  currentYear: string;
  overallAverage: number;
  overallGrade: string;
  classRank: number;
  streamRank: number;
  totalStudents: number;
  attendanceRate: number;
  attendanceStatus: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  behaviorPoints: number;
  behaviorStatus: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  subjects: Array<{
    subjectId: string;
    subjectName: string;
    teacher: string;
    currentGrade: string;
    currentPercentage: number;
    classRank: number;
    attendance: number;
    assignments: {
      total: number;
      completed: number;
      pending: number;
      overdue: number;
    };
    upcomingTests: Array<{
      title: string;
      date: string;
      type: string;
      topics: string[];
    }>;
    recentGrades: Array<{
      title: string;
      grade: string;
      percentage: number;
      date: string;
      feedback?: string;
    }>;
  }>;
  gpa: {
    current: number;
    cumulative: number;
    target: number;
  };
  credits: {
    earned: number;
    required: number;
    inProgress: number;
  };
  achievements: Array<{
    id: string;
    title: string;
    description: string;
    date: string;
    category: string;
    level: string;
    points: number;
  }>;
  disciplinaryRecords: Array<{
    id: string;
    date: string;
    incident: string;
    category: string;
    severity: 'Minor' | 'Major' | 'Severe';
    action: string;
    resolved: boolean;
    points: number;
  }>;
}

interface Course {
  id: string;
  code: string;
  name: string;
  description: string;
  teacher: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
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
      dueDate: string;
      status: 'Upcoming' | 'In Progress' | 'Completed';
      score?: number;
      maxScore: number;
    }>;
  };
  announcements: Array<{
    id: string;
    title: string;
    message: string;
    date: string;
    important: boolean;
  }>;
  resources: Array<{
    id: string;
    title: string;
    type: 'video' | 'document' | 'presentation' | 'link' | 'audio';
    url: string;
    size?: number;
    duration?: number;
    uploadDate: string;
  }>;
  grades: Array<{
    id: string;
    title: string;
    type: string;
    score: number;
    maxScore: number;
    percentage: number;
    grade: string;
    weight: number;
    date: string;
    feedback?: string;
  }>;
  attendance: Array<{
    date: string;
    status: 'Present' | 'Absent' | 'Late' | 'Excused';
    notes?: string;
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
  dueDate: string;
  dueTime: string;
  submissionDate?: string;
  status: 'Not Started' | 'In Progress' | 'Submitted' | 'Graded' | 'Overdue';
  score?: number;
  maxScore: number;
  percentage?: number;
  grade?: string;
  feedback?: string;
  teacher: string;
  priority: 'Low' | 'Medium' | 'High';
  estimatedTime: number;
  latePenalty: number;
  resubmissionAllowed: boolean;
  resubmissionDeadline?: string;
  groupWork: boolean;
  groupMembers?: string[];
  createdAt: string;
  updatedAt: string;
}

interface StudentSchedule {
  id: string;
  date: string;
  dayOfWeek: string;
  periods: Array<{
    period: number;
    startTime: string;
    endTime: string;
    subject: string;
    teacher: string;
    room: string;
    type: 'Regular' | 'Lab' | 'PE' | 'Assembly' | 'Break' | 'Lunch';
    status: 'Scheduled' | 'Completed' | 'Cancelled' | 'Modified';
    notes?: string;
  }>;
  specialEvents: Array<{
    title: string;
    time: string;
    location: string;
    type: 'Assembly' | 'Meeting' | 'Sports' | 'Club' | 'Other';
    mandatory: boolean;
  }>;
  homeworkDue: Array<{
    subject: string;
    title: string;
    dueTime: string;
    priority: string;
  }>;
  testsScheduled: Array<{
    subject: string;
    title: string;
    time: string;
    duration: number;
    room: string;
  }>;
}

interface StudentActivity {
  id: string;
  type: 'Academic' | 'Attendance' | 'Behavior' | 'Assignment' | 'Grade' | 'Event' | 'Achievement' | 'Disciplinary';
  title: string;
  description: string;
  date: string;
  time: string;
  courseId?: string;
  courseName?: string;
  teacher?: string;
  points?: number;
  status?: string;
  details?: any;
  importance: 'Low' | 'Medium' | 'High';
}

interface StudentNotification {
  id: string;
  type: 'Academic' | 'Attendance' | 'Assignment' | 'Grade' | 'Event' | 'Behavior' | 'System' | 'Emergency';
  title: string;
  message: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  read: boolean;
  readAt?: string;
  actionRequired: boolean;
  actionTaken?: boolean;
  actionDeadline?: string;
  courseId?: string;
  courseName?: string;
  timestamp: string;
  expiresAt?: string;
  createdBy: string;
}

interface GamificationProfile {
  id: string;
  studentId: string;
  level: number;
  experiencePoints: number;
  totalPoints: number;
  nextLevelPoints: number;
  streak: {
    current: number;
    longest: number;
    type: 'attendance' | 'assignments' | 'grades';
  };
  badges: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
    category: string;
    earnedDate: string;
    rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  }>;
  achievements: Array<{
    id: string;
    title: string;
    description: string;
    points: number;
    completedDate: string;
    category: string;
    progress: number;
    target: number;
  }>;
  leaderboard: {
    classRank: number;
    streamRank: number;
    schoolRank: number;
    totalStudents: number;
  };
  rewards: Array<{
    id: string;
    title: string;
    description: string;
    type: 'Badge' | 'Points' | 'Privilege' | 'Item';
    cost: number;
    purchased: boolean;
    purchasedDate?: string;
  }>;
  challenges: Array<{
    id: string;
    title: string;
    description: string;
    type: 'Daily' | 'Weekly' | 'Monthly' | 'Special';
    points: number;
    progress: number;
    target: number;
    expiresAt: string;
    completed: boolean;
  }>;
}

export const StudentPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'courses' | 'assignments' | 'schedule' | 'grades' | 'activity' | 'notifications' | 'achievements'>('dashboard');
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [academicOverview, setAcademicOverview] = useState<AcademicOverview | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [schedule, setSchedule] = useState<StudentSchedule[]>([]);
  const [activities, setActivities] = useState<StudentActivity[]>([]);
  const [notifications, setNotifications] = useState<StudentNotification[]>([]);
  const [gamification, setGamification] = useState<GamificationProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourse, setFilterCourse] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

  // Mock data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock student profile
      const mockProfile: StudentProfile = {
        id: 'student-001',
        studentId: 'student-001',
        studentNumber: 'STU2024001',
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@smartpanda.edu',
        phone: '+263 4 555 666',
        dateOfBirth: '2008-03-15',
        gender: 'Male',
        grade: 'Form 1',
        stream: 'A',
        section: 'Science',
        house: 'Eagles',
        admissionDate: '2024-01-15',
        admissionNumber: 'ADM2024001',
        guardianName: 'Mrs. Mary Smith',
        guardianContact: '+263 4 123 456',
        guardianEmail: 'mary.smith@email.com',
        emergencyContact: '+263 4 987 654',
        address: '123 Main Street',
        city: 'Harare',
        country: 'Zimbabwe',
        nationality: 'Zimbabwean',
        religion: 'Christianity',
        medicalConditions: ['Asthma'],
        allergies: ['Peanuts'],
        specialNeeds: 'None',
        learningStyle: 'Visual',
        interests: ['Mathematics', 'Science', 'Technology', 'Sports'],
        hobbies: ['Chess', 'Football', 'Reading', 'Coding'],
        skills: ['Python Programming', 'Public Speaking', 'Leadership'],
        careerGoals: 'Software Engineer',
        status: 'Active',
        twoFactorEnabled: true,
        lastLogin: '2024-02-20T08:30:00Z',
        createdAt: '2023-01-15T00:00:00Z',
        updatedAt: '2024-02-20T08:30:00Z',
      };

      // Mock academic overview
      const mockAcademicOverview: AcademicOverview = {
        id: 'academic-001',
        studentId: 'student-001',
        currentTerm: 'Term 1',
        currentYear: '2024',
        overallAverage: 83.6,
        overallGrade: 'A',
        classRank: 2,
        streamRank: 1,
        totalStudents: 30,
        attendanceRate: 95.2,
        attendanceStatus: 'Excellent',
        behaviorPoints: 95,
        behaviorStatus: 'Excellent',
        subjects: [
          {
            subjectId: 'subj-001',
            subjectName: 'Mathematics',
            teacher: 'Mrs. Sarah Johnson',
            currentGrade: 'A',
            currentPercentage: 85,
            classRank: 3,
            attendance: 96,
            assignments: {
              total: 12,
              completed: 10,
              pending: 2,
              overdue: 0,
            },
            upcomingTests: [
              {
                title: 'Algebra Test',
                date: '2024-02-25',
                type: 'Test',
                topics: ['Linear Equations', 'Quadratic Functions'],
              },
            ],
            recentGrades: [
              {
                title: 'Homework 5',
                grade: 'A',
                percentage: 88,
                date: '2024-02-18',
                feedback: 'Excellent work on problem solving',
              },
            ],
          },
          {
            subjectId: 'subj-002',
            subjectName: 'English',
            teacher: 'Mr. Michael Brown',
            currentGrade: 'B',
            currentPercentage: 78,
            classRank: 5,
            attendance: 94,
            assignments: {
              total: 15,
              completed: 13,
              pending: 2,
              overdue: 0,
            },
            upcomingTests: [
              {
                title: 'Essay Writing',
                date: '2024-02-28',
                type: 'Assignment',
                topics: ['Creative Writing', 'Grammar'],
              },
            ],
            recentGrades: [
              {
                title: 'Book Report',
                grade: 'B+',
                percentage: 82,
                date: '2024-02-17',
                feedback: 'Good analysis, improve conclusion',
              },
            ],
          },
        ],
        gpa: {
          current: 3.7,
          cumulative: 3.7,
          target: 4.0,
        },
        credits: {
          earned: 25,
          required: 240,
          inProgress: 30,
        },
        achievements: [
          {
            id: 'ach-001',
            title: 'Math Competition Winner',
            description: 'First place in regional mathematics competition',
            date: '2024-01-20',
            category: 'Academic',
            level: 'Regional',
            points: 100,
          },
        ],
        disciplinaryRecords: [],
      };

      // Mock courses
      const mockCourses: Course[] = [
        {
          id: 'course-001',
          code: 'MATH101',
          name: 'Mathematics',
          description: 'Advanced mathematics covering algebra, geometry, and trigonometry',
          teacher: {
            id: 'teacher-001',
            name: 'Mrs. Sarah Johnson',
            email: 'sarah.johnson@smartpanda.edu',
          },
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
                resources: [
                  {
                    type: 'video',
                    title: 'Introduction to Linear Equations',
                    url: '/videos/linear_equations_intro.mp4',
                    duration: 1200,
                  },
                  {
                    type: 'document',
                    title: 'Linear Equations Worksheet',
                    url: '/docs/linear_equations_worksheet.pdf',
                  },
                ],
              },
              {
                id: 'topic-002',
                title: 'Quadratic Functions',
                description: 'Understanding and solving quadratic equations',
                order: 2,
                completed: false,
                resources: [
                  {
                    type: 'video',
                    title: 'Quadratic Functions Explained',
                    url: '/videos/quadratic_functions.mp4',
                    duration: 1800,
                  },
                ],
              },
            ],
            assessments: [
              {
                id: 'assessment-001',
                title: 'Linear Equations Quiz',
                type: 'Quiz',
                weight: 10,
                dueDate: '2024-02-25',
                status: 'Upcoming',
                maxScore: 50,
              },
            ],
          },
          announcements: [
            {
              id: 'ann-001',
              title: 'Extra Help Session',
              message: 'Extra help session available every Tuesday after school',
              date: '2024-02-18',
              important: false,
            },
          ],
          resources: [
            {
              id: 'res-001',
              title: 'Mathematics Textbook PDF',
              type: 'document',
              url: '/resources/math_textbook.pdf',
              size: 5242880,
              uploadDate: '2024-01-15',
            },
          ],
          grades: [
            {
              id: 'grade-001',
              title: 'Homework 1',
              type: 'Homework',
              score: 45,
              maxScore: 50,
              percentage: 90,
              grade: 'A',
              weight: 5,
              date: '2024-02-01',
              feedback: 'Excellent work',
            },
          ],
          attendance: [
            {
              date: '2024-02-20',
              status: 'Present',
            },
            {
              date: '2024-02-18',
              status: 'Present',
            },
          ],
        },
        {
          id: 'course-002',
          code: 'ENG101',
          name: 'English',
          description: 'English language and literature focusing on comprehension and writing skills',
          teacher: {
            id: 'teacher-002',
            name: 'Mr. Michael Brown',
            email: 'michael.brown@smartpanda.edu',
          },
          grade: 'Form 1',
          stream: 'A',
          credits: 5,
          schedule: [
            {
              day: 'Monday',
              startTime: '09:00',
              endTime: '10:00',
              room: 'Room 102',
            },
            {
              day: 'Tuesday',
              startTime: '11:00',
              endTime: '12:00',
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
                title: 'Creative Writing',
                description: 'Developing creative writing skills',
                order: 1,
                completed: false,
                resources: [
                  {
                    type: 'document',
                    title: 'Creative Writing Guide',
                    url: '/docs/creative_writing_guide.pdf',
                  },
                ],
              },
            ],
            assessments: [
              {
                id: 'assessment-002',
                title: 'Essay Assignment',
                type: 'Assignment',
                weight: 20,
                dueDate: '2024-02-28',
                status: 'In Progress',
                maxScore: 100,
              },
            ],
          },
          announcements: [],
          resources: [],
          grades: [
            {
              id: 'grade-002',
              title: 'Book Report',
              type: 'Assignment',
              score: 82,
              maxScore: 100,
              percentage: 82,
              grade: 'B+',
              weight: 10,
              date: '2024-02-17',
              feedback: 'Good analysis, improve conclusion',
            },
          ],
          attendance: [
            {
              date: '2024-02-20',
              status: 'Present',
            },
          ],
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
          dueDate: '2024-02-25',
          dueTime: '23:59',
          status: 'In Progress',
          maxScore: 50,
          teacher: 'Mrs. Sarah Johnson',
          priority: 'Medium',
          estimatedTime: 60,
          latePenalty: 10,
          resubmissionAllowed: true,
          groupWork: false,
          createdAt: '2024-02-18T10:00:00Z',
          updatedAt: '2024-02-20T14:30:00Z',
        },
        {
          id: 'assign-002',
          courseId: 'course-002',
          courseName: 'English',
          title: 'Essay Writing Assignment',
          description: 'Write a 500-word essay on "My Favorite Hobby"',
          type: 'Assignment',
          instructions: 'Include introduction, body, and conclusion',
          resources: [
            {
              name: 'Essay Writing Guide',
              url: '/resources/essay_guide.pdf',
              type: 'pdf',
            },
          ],
          dueDate: '2024-02-28',
          dueTime: '23:59',
          status: 'Not Started',
          maxScore: 100,
          teacher: 'Mr. Michael Brown',
          priority: 'High',
          estimatedTime: 120,
          latePenalty: 5,
          resubmissionAllowed: true,
          groupWork: false,
          createdAt: '2024-02-15T09:00:00Z',
          updatedAt: '2024-02-15T09:00:00Z',
        },
        {
          id: 'assign-003',
          courseId: 'course-001',
          courseName: 'Mathematics',
          title: 'Algebra Quiz',
          description: 'Quiz on linear and quadratic equations',
          type: 'Quiz',
          resources: [],
          dueDate: '2024-02-25',
          dueTime: '10:00',
          status: 'Upcoming',
          maxScore: 50,
          teacher: 'Mrs. Sarah Johnson',
          priority: 'High',
          estimatedTime: 45,
          latePenalty: 0,
          resubmissionAllowed: false,
          groupWork: false,
          createdAt: '2024-02-10T14:00:00Z',
          updatedAt: '2024-02-10T14:00:00Z',
        },
      ];

      // Mock schedule
      const mockSchedule: StudentSchedule[] = [
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
              teacher: 'Mrs. Sarah Johnson',
              room: 'Room 101',
              type: 'Regular',
              status: 'Scheduled',
            },
            {
              period: 2,
              startTime: '09:00',
              endTime: '10:00',
              subject: 'English',
              teacher: 'Mr. Michael Brown',
              room: 'Room 102',
              type: 'Regular',
              status: 'Scheduled',
            },
            {
              period: 3,
              startTime: '10:00',
              endTime: '10:30',
              subject: 'Break',
              teacher: '',
              room: 'Cafeteria',
              type: 'Break',
              status: 'Scheduled',
            },
            {
              period: 4,
              startTime: '10:30',
              endTime: '11:30',
              subject: 'Science',
              teacher: 'Dr. Emily Davis',
              room: 'Lab 201',
              type: 'Lab',
              status: 'Scheduled',
            },
          ],
          specialEvents: [
            {
              title: 'Assembly',
              time: '14:00',
              location: 'School Hall',
              type: 'Assembly',
              mandatory: true,
            },
          ],
          homeworkDue: [
            {
              subject: 'Mathematics',
              title: 'Linear Equations Homework',
              dueTime: '23:59',
              priority: 'Medium',
            },
          ],
          testsScheduled: [
            {
              subject: 'Mathematics',
              title: 'Algebra Quiz',
              time: '10:00',
              duration: 45,
              room: 'Room 101',
            },
          ],
        },
      ];

      // Mock activities
      const mockActivities: StudentActivity[] = [
        {
          id: 'activity-001',
          type: 'Grade',
          title: 'Math Homework Graded',
          description: 'Received A grade on Linear Equations Homework',
          date: '2024-02-20',
          time: '14:30',
          courseId: 'course-001',
          courseName: 'Mathematics',
          teacher: 'Mrs. Sarah Johnson',
          points: 45,
          status: 'A',
          importance: 'Medium',
        },
        {
          id: 'activity-002',
          type: 'Assignment',
          title: 'Essay Assignment Started',
          description: 'Began working on English essay assignment',
          date: '2024-02-20',
          time: '16:00',
          courseId: 'course-002',
          courseName: 'English',
          importance: 'Low',
        },
        {
          id: 'activity-003',
          type: 'Attendance',
          title: 'Present - Mathematics',
          description: 'Attended mathematics class',
          date: '2024-02-20',
          time: '08:00',
          courseId: 'course-001',
          courseName: 'Mathematics',
          importance: 'Low',
        },
      ];

      // Mock notifications
      const mockNotifications: StudentNotification[] = [
        {
          id: 'notif-001',
          type: 'Assignment',
          title: 'Math Homework Due Tomorrow',
          message: 'Linear Equations Homework is due tomorrow at 11:59 PM',
          priority: 'High',
          read: false,
          actionRequired: true,
          courseId: 'course-001',
          courseName: 'Mathematics',
          timestamp: '2024-02-20T18:00:00Z',
          createdBy: 'system',
        },
        {
          id: 'notif-002',
          type: 'Grade',
          title: 'New Grade Posted',
          message: 'Your Book Report has been graded. You received B+',
          priority: 'Medium',
          read: true,
          readAt: '2024-02-17T15:30:00Z',
          actionRequired: false,
          courseId: 'course-002',
          courseName: 'English',
          timestamp: '2024-02-17T15:00:00Z',
          createdBy: 'teacher-002',
        },
        {
          id: 'notif-003',
          type: 'Event',
          title: 'School Assembly Tomorrow',
          message: 'Mandatory school assembly tomorrow at 2:00 PM in the School Hall',
          priority: 'Medium',
          read: true,
          readAt: '2024-02-20T09:00:00Z',
          actionRequired: true,
          actionTaken: true,
          timestamp: '2024-02-19T16:00:00Z',
          createdBy: 'admin',
        },
      ];

      // Mock gamification
      const mockGamification: GamificationProfile = {
        id: 'gamif-001',
        studentId: 'student-001',
        level: 12,
        experiencePoints: 2450,
        totalPoints: 2450,
        nextLevelPoints: 3000,
        streak: {
          current: 7,
          longest: 14,
          type: 'attendance',
        },
        badges: [
          {
            id: 'badge-001',
            name: 'Math Wizard',
            description: 'Achieved A+ in 3 consecutive math assignments',
            icon: '🧮',
            category: 'Academic',
            earnedDate: '2024-02-15',
            rarity: 'Rare',
          },
          {
            id: 'badge-002',
            name: 'Perfect Attendance',
            description: '30 days of perfect attendance',
            icon: '📅',
            category: 'Attendance',
            earnedDate: '2024-02-10',
            rarity: 'Common',
          },
        ],
        achievements: [
          {
            id: 'ach-001',
            title: 'Assignment Master',
            description: 'Complete 50 assignments on time',
            points: 500,
            completedDate: '2024-02-18',
            category: 'Assignments',
            progress: 52,
            target: 50,
          },
        ],
        leaderboard: {
          classRank: 2,
          streamRank: 1,
          schoolRank: 15,
          totalStudents: 156,
        },
        rewards: [
          {
            id: 'reward-001',
            title: 'Homework Pass',
            description: 'Skip one homework assignment',
            type: 'Privilege',
            cost: 100,
            purchased: false,
          },
        ],
        challenges: [
          {
            id: 'challenge-001',
            title: 'Daily Login Streak',
            description: 'Login to the portal for 7 consecutive days',
            type: 'Daily',
            points: 50,
            progress: 5,
            target: 7,
            expiresAt: '2024-02-25T23:59:59Z',
            completed: false,
          },
        ],
      };
      
      setStudentProfile(mockProfile);
      setAcademicOverview(mockAcademicOverview);
      setCourses(mockCourses);
      setAssignments(mockAssignments);
      setSchedule(mockSchedule);
      setActivities(mockActivities);
      setNotifications(mockNotifications);
      setGamification(mockGamification);
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
      case 'Submitted':
        return 'text-warning-600 bg-warning-100';
      case 'Overdue':
      case 'Absent':
      case 'Poor':
      case 'C':
      case 'D':
      case 'E':
      case 'F':
        return 'text-red-600 bg-red-100';
      case 'Not Started':
      case 'Fair':
      case 'Scheduled':
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
        return 'text-orange-600 bg-orange-100';
      case 'System':
        return 'text-gray-600 bg-gray-100';
      case 'Emergency':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Legendary':
        return 'text-yellow-600 bg-yellow-100 border-yellow-300';
      case 'Epic':
        return 'text-purple-600 bg-purple-100 border-purple-300';
      case 'Rare':
        return 'text-blue-600 bg-blue-100 border-blue-300';
      case 'Common':
        return 'text-gray-600 bg-gray-100 border-gray-300';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-300';
    }
  };

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.courseName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = filterCourse === 'all' || assignment.courseId === filterCourse;
    const matchesStatus = filterStatus === 'all' || assignment.status === filterStatus;
    return matchesSearch && matchesCourse && matchesStatus;
  });

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || activity.type === filterType;
    return matchesSearch && matchesType;
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
              Student Portal
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Your academic journey and learning hub
            </p>
          </div>
          <div className="flex gap-3">
            <button className="btn btn-secondary">
              <BellIcon className="w-4 h-4 mr-2" />
              Notifications ({notifications.filter(n => !n.read).length})
            </button>
            {gamification && (
              <div className="flex items-center gap-2 px-3 py-2 bg-purple-100 rounded-lg">
                <SparklesIcon className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-purple-600">Level {gamification.level}</span>
                <span className="text-xs text-purple-500">{gamification.experiencePoints} XP</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Student Profile Card */}
      {studentProfile && (
        <div className="card mb-6">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                  <UserIcon className="w-8 h-8 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {studentProfile.firstName} {studentProfile.lastName}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {studentProfile.studentNumber} • {studentProfile.grade} - {studentProfile.stream}
                  </p>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-500 dark:text-gray-500">
                    <span className="flex items-center gap-1">
                      <EnvelopeIcon className="w-4 h-4" />
                      {studentProfile.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <AcademicCapIcon className="w-4 h-4" />
                      {studentProfile.careerGoals}
                    </span>
                  </div>
                </div>
              </div>
              {academicOverview && (
                <div className="text-right">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Current Average</div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {academicOverview.overallAverage.toFixed(1)}%
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(academicOverview.overallGrade)}`}>
                    {academicOverview.overallGrade}
                  </span>
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
            { id: 'schedule', label: 'Schedule', icon: CalendarDaysIcon },
            { id: 'grades', label: 'Grades', icon: AwardIcon },
            { id: 'activity', label: 'Activity', icon: ClockIcon },
            { id: 'notifications', label: 'Notifications', icon: BellIcon },
            { id: 'achievements', label: 'Achievements', icon: TrophyIcon },
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
      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
          >
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Overall Average</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {academicOverview?.overallAverage.toFixed(1)}%
                  </p>
                </div>
                <ChartBarIcon className="w-8 h-8 text-blue-600" />
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
                  <p className="text-sm text-gray-600 dark:text-gray-400">Class Rank</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    #{academicOverview?.classRank}
                  </p>
                </div>
                <TrophyIcon className="w-8 h-8 text-green-600" />
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
                  <p className="text-sm text-gray-600 dark:text-gray-400">Attendance</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {academicOverview?.attendanceRate.toFixed(1)}%
                  </p>
                </div>
                <CalendarIcon className="w-8 h-8 text-purple-600" />
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
                  <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {assignments.filter(a => a.status === 'Not Started' || a.status === 'In Progress').length}
                  </p>
                </div>
                <ClipboardDocumentListIcon className="w-8 h-8 text-orange-600" />
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
                      {course.code} • {course.teacher.name}
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
                    <span className="text-sm text-gray-600 dark:text-gray-400">Credits</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {course.credits}
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
                      {course.syllabus.topics.length} total
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Assessments</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {course.syllabus.assessments.length}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Resources</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {course.resources.length}
                    </span>
                  </div>

                  {course.announcements.length > 0 && (
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">Latest Announcement:</div>
                      <div className="text-xs text-gray-500 dark:text-gray-500">
                        {course.announcements[0].title}
                      </div>
                    </div>
                  )}

                  <div className="space-y-1">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Progress:</div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary-600 h-2 rounded-full"
                        style={{ width: `${(course.syllabus.topics.filter(t => t.completed).length / course.syllabus.topics.length) * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-500">
                      {course.syllabus.topics.filter(t => t.completed).length}/{course.syllabus.topics.length} topics completed
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-sm text-gray-500 dark:text-gray-500">
                    Next class: {course.schedule[0]?.day} {course.schedule[0]?.startTime}
                  </div>
                  <div className="flex gap-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      <BookOpenIcon className="w-4 h-4" />
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
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Submitted">Submitted</option>
                    <option value="Graded">Graded</option>
                    <option value="Overdue">Overdue</option>
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
                      <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(assignment.priority)}`}>
                        {assignment.priority}
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
                      <span>Teacher: {assignment.teacher}</span>
                      <span>Due: {new Date(assignment.dueDate).toLocaleDateString()} {assignment.dueTime}</span>
                      <span>Max Score: {assignment.maxScore}</span>
                      {assignment.estimatedTime && <span>Est. Time: {assignment.estimatedTime}min</span>}
                    </div>
                    {assignment.resources && assignment.resources.length > 0 && (
                      <div className="flex items-center gap-2 mt-2">
                        <DocumentTextIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-xs text-gray-500 dark:text-gray-500">
                          {assignment.resources.length} resource(s)
                        </span>
                      </div>
                    )}
                    {assignment.feedback && (
                      <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                        <p className="text-xs text-blue-600 dark:text-blue-400">
                          <strong>Feedback:</strong> {assignment.feedback}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setSelectedAssignment(assignment)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </button>
                    <button className="text-blue-600 hover:text-blue-800">
                      <PlayIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
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
                  <span className="text-sm text-gray-500 dark:text-gray-500">
                    {day.periods.length} periods
                  </span>
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
                            {period.teacher} • {period.room}
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
                          period.type === 'PE' ? 'text-orange-600 bg-orange-100' :
                          period.type === 'Assembly' ? 'text-purple-600 bg-purple-100' :
                          period.type === 'Break' || period.type === 'Lunch' ? 'text-gray-600 bg-gray-100' :
                          'text-blue-600 bg-blue-100'
                        }`}>
                          {period.type}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {day.specialEvents.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Special Events</h4>
                    <div className="space-y-2">
                      {day.specialEvents.map((event, eventIndex) => (
                        <div key={eventIndex} className="flex items-center justify-between p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {event.title}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-500">
                              {event.time} • {event.location}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              event.mandatory ? 'text-red-600 bg-red-100' : 'text-blue-600 bg-blue-100'
                            }`}>
                              {event.mandatory ? 'Mandatory' : 'Optional'}
                            </span>
                            <span className="text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-600">
                              {event.type}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(day.homeworkDue.length > 0 || day.testsScheduled.length > 0) && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {day.homeworkDue.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Homework Due</h4>
                          <div className="space-y-1">
                            {day.homeworkDue.map((hw, hwIndex) => (
                              <div key={hwIndex} className="text-xs text-gray-500 dark:text-gray-500">
                                {hw.subject}: {hw.title} (Due: {hw.dueTime})
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {day.testsScheduled.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Tests Scheduled</h4>
                          <div className="space-y-1">
                            {day.testsScheduled.map((test, testIndex) => (
                              <div key={testIndex} className="text-xs text-gray-500 dark:text-gray-500">
                                {test.subject}: {test.title} ({test.time}, {test.duration}min, {test.room})
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'grades' && academicOverview && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card"
            >
              <div className="card-body text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {academicOverview.overallAverage.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Overall Average</div>
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(academicOverview.overallGrade)}`}>
                  {academicOverview.overallGrade}
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card"
            >
              <div className="card-body text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  #{academicOverview.classRank}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Class Rank</div>
                <span className="text-xs text-gray-500 dark:text-gray-500">
                  of {academicOverview.totalStudents} students
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card"
            >
              <div className="card-body text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {academicOverview.gpa.current.toFixed(2)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Current GPA</div>
                <span className="text-xs text-gray-500 dark:text-gray-500">
                  Target: {academicOverview.gpa.target.toFixed(2)}
                </span>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {academicOverview.subjects.map((subject, index) => (
              <motion.div
                key={subject.subjectId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card"
              >
                <div className="card-body">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {subject.subjectName}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {subject.teacher}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(subject.currentGrade)}`}>
                      {subject.currentGrade}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Current Grade</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {subject.currentPercentage}%
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Class Rank</span>
                      <span className="text-sm text-gray-500 dark:text-gray-500">
                        #{subject.classRank}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Attendance</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        subject.attendance >= 95 ? 'text-green-600 bg-green-100' :
                        subject.attendance >= 90 ? 'text-yellow-600 bg-yellow-100' :
                        'text-red-600 bg-red-100'
                      }`}>
                        {subject.attendance}%
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Assignments</span>
                      <span className="text-sm text-gray-500 dark:text-gray-500">
                        {subject.assignments.completed}/{subject.assignments.total}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">Recent Grades:</div>
                      {subject.recentGrades.slice(0, 2).map((grade, i) => (
                        <div key={i} className="flex items-center justify-between text-xs">
                          <span className="text-gray-600 dark:text-gray-400">{grade.title}</span>
                          <div className="flex items-center gap-1">
                            <span className="text-gray-500 dark:text-gray-500">
                              {grade.percentage}%
                            </span>
                            <span className={`text-xs px-1 py-0.5 rounded ${getStatusColor(grade.grade)}`}>
                              {grade.grade}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {subject.upcomingTests.length > 0 && (
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">Upcoming Tests:</div>
                        {subject.upcomingTests.map((test, i) => (
                          <div key={i} className="text-xs text-gray-500 dark:text-gray-500">
                            {test.title} - {new Date(test.date).toLocaleDateString()}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="space-y-4">
          <div className="card mb-6">
            <div className="card-body">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search activities..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="form-input pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="form-input"
                  >
                    <option value="all">All Types</option>
                    <option value="Academic">Academic</option>
                    <option value="Assignment">Assignment</option>
                    <option value="Grade">Grade</option>
                    <option value="Attendance">Attendance</option>
                    <option value="Event">Event</option>
                    <option value="Achievement">Achievement</option>
                  </select>
                  <button className="btn btn-secondary">
                    <FunnelIcon className="w-4 h-4 mr-2" />
                    Filters
                  </button>
                </div>
              </div>
            </div>
          </div>

          {filteredActivities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card"
            >
              <div className="card-body">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(activity.type)}`}>
                        {activity.type}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        activity.importance === 'High' ? 'text-red-600 bg-red-100' :
                        activity.importance === 'Medium' ? 'text-yellow-600 bg-yellow-100' :
                        'text-blue-600 bg-blue-100'
                      }`}>
                        {activity.importance}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-500">
                        {new Date(activity.date).toLocaleDateString()} {activity.time}
                      </span>
                    </div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                      {activity.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {activity.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                      {activity.courseName && <span>Course: {activity.courseName}</span>}
                      {activity.teacher && <span>Teacher: {activity.teacher}</span>}
                      {activity.points && <span>Points: {activity.points}</span>}
                      {activity.status && <span>Status: {activity.status}</span>}
                    </div>
                  </div>
                  <div className="flex gap-2">
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
                      {notification.courseName && <span>Course: {notification.courseName}</span>}
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

      {activeTab === 'achievements' && gamification && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card"
            >
              <div className="card-body text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Level {gamification.level}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Current Level</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full"
                    style={{ width: `${(gamification.experiencePoints / gamification.nextLevelPoints) * 100}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-500">
                  {gamification.experiencePoints} / {gamification.nextLevelPoints} XP
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card"
            >
              <div className="card-body text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {gamification.streak.current}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Current Streak</div>
                <span className="text-xs text-gray-500 dark:text-gray-500">
                  {gamification.streak.type} • Longest: {gamification.streak.longest}
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card"
            >
              <div className="card-body text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  #{gamification.leaderboard.classRank}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Class Rank</div>
                <span className="text-xs text-gray-500 dark:text-gray-500">
                  Stream #{gamification.leaderboard.streamRank} • School #{gamification.leaderboard.schoolRank}
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card"
            >
              <div className="card-body text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {gamification.totalPoints}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Points</div>
                <span className="text-xs text-gray-500 dark:text-gray-500">
                  {gamification.badges.length} badges earned
                </span>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card"
            >
              <div className="card-body">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Badges</h3>
                <div className="grid grid-cols-2 gap-4">
                  {gamification.badges.map((badge, index) => (
                    <div key={badge.id} className={`p-3 border-2 rounded-lg ${getRarityColor(badge.rarity)}`}>
                      <div className="text-center">
                        <div className="text-2xl mb-2">{badge.icon}</div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">{badge.name}</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{badge.description}</p>
                        <span className={`text-xs px-2 py-1 rounded-full mt-2 ${getRarityColor(badge.rarity)}`}>
                          {badge.rarity}
                        </span>
                      </div>
                    </div>
                  ))}
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
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Active Challenges</h3>
                <div className="space-y-3">
                  {gamification.challenges.map((challenge, index) => (
                    <div key={challenge.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">{challenge.title}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          challenge.type === 'Daily' ? 'text-blue-600 bg-blue-100' :
                          challenge.type === 'Weekly' ? 'text-green-600 bg-green-100' :
                          challenge.type === 'Monthly' ? 'text-purple-600 bg-purple-100' :
                          'text-orange-600 bg-orange-100'
                        }`}>
                          {challenge.type}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{challenge.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 dark:text-gray-500">
                            {challenge.progress}/{challenge.target}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-500">
                            {challenge.points} points
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-500">
                          Expires: {new Date(challenge.expiresAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div 
                          className="bg-primary-600 h-2 rounded-full"
                          style={{ width: `${(challenge.progress / challenge.target) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <div className="card-body">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Achievements</h3>
              <div className="space-y-3">
                {gamification.achievements.map((achievement, index) => (
                  <div key={achievement.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">{achievement.title}</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{achievement.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500 dark:text-gray-500">
                          {achievement.points} points
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-500">
                          {achievement.category}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-500">
                          Completed: {new Date(achievement.completedDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {achievement.progress}/{achievement.target}
                      </div>
                      <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${(achievement.progress / achievement.target) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
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
                      <span className="text-gray-600 dark:text-gray-400">Teacher:</span>
                      <span className="text-gray-900 dark:text-white">{selectedCourse.teacher.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Credits:</span>
                      <span className="text-gray-900 dark:text-white">{selectedCourse.credits}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Grade:</span>
                      <span className="text-gray-900 dark:text-white">{selectedCourse.grade}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Stream:</span>
                      <span className="text-gray-900 dark:text-white">{selectedCourse.stream}</span>
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
                            {topic.completed ? 'Completed' : 'In Progress'}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-500">
                            {topic.resources.length} resources
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upcoming Assessments</h3>
                <div className="space-y-3">
                  {selectedCourse.syllabus.assessments.map((assessment, index) => (
                    <div key={assessment.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">{assessment.title}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{assessment.type}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            assessment.status === 'Completed' ? 'text-green-600 bg-green-100' :
                            assessment.status === 'In Progress' ? 'text-yellow-600 bg-yellow-100' :
                            'text-blue-600 bg-blue-100'
                          }`}>
                            {assessment.status}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-500">
                            {assessment.weight}% weight
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                        Due: {new Date(assessment.dueDate).toLocaleDateString()}
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
                  <ChatBubbleLeftRightIcon className="w-4 h-4 mr-2" />
                  Contact Teacher
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
