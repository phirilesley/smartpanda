import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  AcademicCapIcon,
  BookOpenIcon,
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
  UserGroupIcon,
} from '@heroicons/react/24/outline';

// Types
interface Course {
  id: string;
  courseCode: string;
  title: string;
  description: string;
  credits: number;
  department: string;
  level: string;
  semester: string;
  instructor: string;
  schedule: Schedule;
  prerequisites: string[];
  learningObjectives: string[];
  materials: string[];
  assessments: Assessment[];
  status: 'active' | 'inactive' | 'draft' | 'archived';
  enrollment: {
    current: number;
    capacity: number;
    waitlist: number;
  };
}

interface Schedule {
  days: string[];
  time: string;
  room: string;
  duration: string;
}

interface Assessment {
  id: string;
  type: string;
  title: string;
  weight: number;
  dueDate: string;
  description: string;
}

interface Program {
  id: string;
  name: string;
  code: string;
  description: string;
  department: string;
  degree: string;
  duration: string;
  totalCredits: number;
  coordinator: string;
  status: 'active' | 'inactive' | 'suspended';
  courses: string[];
  requirements: Requirement[];
  outcomes: string[];
}

interface Requirement {
  id: string;
  type: string;
  description: string;
  credits: number;
  courses: string[];
}

interface Curriculum {
  id: string;
  name: string;
  version: string;
  description: string;
  department: string;
  status: 'draft' | 'review' | 'approved' | 'archived';
  effectiveDate: string;
  revisionDate: string;
  courses: CurriculumCourse[];
  outcomes: string[];
  assessment: CurriculumAssessment[];
}

interface CurriculumCourse {
  id: string;
  courseCode: string;
  title: string;
  credits: number;
  semester: string;
  required: boolean;
  prerequisites: string[];
}

interface CurriculumAssessment {
  id: string;
  type: string;
  description: string;
  weight: number;
  timeline: string;
}

interface Faculty {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  rank: string;
  specialization: string[];
  qualifications: Qualification[];
  courses: string[];
  research: Research[];
  office: string;
  officeHours: string;
  status: 'active' | 'on-leave' | 'retired';
}

interface Qualification {
  id: string;
  degree: string;
  institution: string;
  year: string;
  field: string;
}

interface Research {
  id: string;
  title: string;
  description: string;
  status: string;
  funding: string;
  collaborators: string[];
  publications: string[];
}

interface StudentRecord {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  program: string;
  level: string;
  status: 'active' | 'inactive' | 'graduated' | 'suspended';
  gpa: number;
  credits: {
    earned: number;
    attempted: number;
    remaining: number;
  };
  enrollment: Enrollment[];
  academicStanding: string;
  advisor: string;
}

interface Enrollment {
  id: string;
  semester: string;
  courses: CourseEnrollment[];
  status: string;
  gpa: number;
}

interface CourseEnrollment {
  courseId: string;
  courseCode: string;
  title: string;
  credits: number;
  grade?: string;
  status: string;
}

interface AcademicCalendar {
  id: string;
  title: string;
  type: string;
  startDate: string;
  endDate: string;
  description: string;
  importance: 'low' | 'medium' | 'high';
  audience: string[];
  status: 'scheduled' | 'completed' | 'cancelled';
}

interface AcademicPolicy {
  id: string;
  title: string;
  category: string;
  description: string;
  effectiveDate: string;
  lastRevised: string;
  status: 'active' | 'inactive' | 'under-review';
  document: string;
  relatedPolicies: string[];
}

export const AcademicAffairs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'courses' | 'programs' | 'curriculum' | 'faculty' | 'students' | 'calendar' | 'policies'>('dashboard');
  const [courses, setCourses] = useState<Course[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [curriculum, setCurriculum] = useState<Curriculum[]>([]);
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [studentRecords, setStudentRecords] = useState<StudentRecord[]>([]);
  const [academicCalendar, setAcademicCalendar] = useState<AcademicCalendar[]>([]);
  const [academicPolicies, setAcademicPolicies] = useState<AcademicPolicy[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

  useEffect(() => {
    // Load mock data
    setTimeout(() => {
      setCourses([
        {
          id: '1',
          courseCode: 'MATH101',
          title: 'Calculus I',
          description: 'Introduction to differential and integral calculus',
          credits: 4,
          department: 'Mathematics',
          level: 'Undergraduate',
          semester: 'Fall 2024',
          instructor: 'Dr. Sarah Johnson',
          schedule: {
            days: ['Monday', 'Wednesday', 'Friday'],
            time: '9:00 AM - 10:20 AM',
            room: 'Room 203',
            duration: '16 weeks',
          },
          prerequisites: ['PRE-CALC'],
          learningObjectives: [
            'Understand limits and continuity',
            'Master differentiation techniques',
            'Apply integration methods',
            'Solve real-world problems',
          ],
          materials: ['Textbook: Calculus Early Transcendentals', 'Calculator', 'Online access code'],
          assessments: [
            {
              id: '1',
              type: 'Exam',
              title: 'Midterm Exam',
              weight: 30,
              dueDate: '2024-10-15',
              description: 'Covers chapters 1-5',
            },
            {
              id: '2',
              type: 'Final Exam',
              title: 'Final Exam',
              weight: 40,
              dueDate: '2024-12-15',
              description: 'Comprehensive final exam',
            },
          ],
          status: 'active',
          enrollment: {
            current: 28,
            capacity: 30,
            waitlist: 5,
          },
        },
        {
          id: '2',
          courseCode: 'ENG201',
          title: 'Academic Writing',
          description: 'Advanced academic writing and research skills',
          credits: 3,
          department: 'English',
          level: 'Undergraduate',
          semester: 'Fall 2024',
          instructor: 'Prof. Michael Chen',
          schedule: {
            days: ['Tuesday', 'Thursday'],
            time: '2:00 PM - 3:20 PM',
            room: 'Room 105',
            duration: '16 weeks',
          },
          prerequisites: ['ENG101'],
          learningObjectives: [
            'Develop research skills',
            'Master academic writing conventions',
            'Create proper citations',
            'Write research papers',
          ],
          materials: ['MLA Handbook', 'Style Guide', 'Online database access'],
          assessments: [
            {
              id: '1',
              type: 'Essay',
              title: 'Research Paper',
              weight: 35,
              dueDate: '2024-11-20',
              description: '10-page research paper',
            },
          ],
          status: 'active',
          enrollment: {
            current: 22,
            capacity: 25,
            waitlist: 2,
          },
        },
      ]);

      setPrograms([
        {
          id: '1',
          name: 'Bachelor of Science in Computer Science',
          code: 'BSCS',
          description: 'Comprehensive computer science program with focus on software development',
          department: 'Computer Science',
          degree: 'Bachelor of Science',
          duration: '4 years',
          totalCredits: 120,
          coordinator: 'Dr. Emily Davis',
          status: 'active',
          courses: ['CS101', 'CS201', 'CS301', 'CS401'],
          requirements: [
            {
              id: '1',
              type: 'Core',
              description: 'Computer Science Core Courses',
              credits: 48,
              courses: ['CS101', 'CS201', 'CS301', 'CS401'],
            },
            {
              id: '2',
              type: 'Mathematics',
              description: 'Mathematics Requirements',
              credits: 18,
              courses: ['MATH101', 'MATH201', 'MATH301'],
            },
          ],
          outcomes: [
            'Design and implement software solutions',
            'Analyze computational problems',
            'Apply software engineering principles',
            'Communicate technical concepts effectively',
          ],
        },
        {
          id: '2',
          name: 'Bachelor of Arts in English Literature',
          code: 'BAENG',
          description: 'Study of English literature with emphasis on critical analysis',
          department: 'English',
          degree: 'Bachelor of Arts',
          duration: '4 years',
          totalCredits: 120,
          coordinator: 'Prof. Robert Wilson',
          status: 'active',
          courses: ['ENG101', 'ENG201', 'ENG301', 'ENG401'],
          requirements: [
            {
              id: '1',
              type: 'Core',
              description: 'Literature Core Courses',
              credits: 36,
              courses: ['ENG101', 'ENG201', 'ENG301', 'ENG401'],
            },
          ],
          outcomes: [
            'Analyze literary texts critically',
            'Write analytical essays',
            'Understand literary movements',
            'Conduct literary research',
          ],
        },
      ]);

      setCurriculum([
        {
          id: '1',
          name: 'Computer Science Curriculum 2024',
          version: 'v2.1',
          description: 'Updated curriculum for Computer Science program',
          department: 'Computer Science',
          status: 'approved',
          effectiveDate: '2024-08-01',
          revisionDate: '2024-01-15',
          courses: [
            {
              id: '1',
              courseCode: 'CS101',
              title: 'Introduction to Programming',
              credits: 3,
              semester: 'Fall Year 1',
              required: true,
              prerequisites: [],
            },
            {
              id: '2',
              courseCode: 'CS201',
              title: 'Data Structures',
              credits: 4,
              semester: 'Spring Year 1',
              required: true,
              prerequisites: ['CS101'],
            },
          ],
          outcomes: [
            'Program proficiency in multiple languages',
            'Understanding of data structures and algorithms',
            'Software development lifecycle knowledge',
            'Database management skills',
          ],
          assessment: [
            {
              id: '1',
              type: 'Portfolio',
              description: 'Programming portfolio assessment',
              weight: 30,
              timeline: 'End of each semester',
            },
          ],
        },
      ]);

      setFaculty([
        {
          id: '1',
          firstName: 'Sarah',
          lastName: 'Johnson',
          email: 'sarah.johnson@smartpanda.edu',
          phone: '+1-555-0123',
          department: 'Mathematics',
          position: 'Professor',
          rank: 'Full Professor',
          specialization: ['Calculus', 'Statistics', 'Applied Mathematics'],
          qualifications: [
            {
              id: '1',
              degree: 'Ph.D. in Mathematics',
              institution: 'MIT',
              year: '2010',
              field: 'Applied Mathematics',
            },
          ],
          courses: ['MATH101', 'MATH201', 'MATH301'],
          research: [
            {
              id: '1',
              title: 'Advanced Calculus Applications',
              description: 'Research in applied calculus methods',
              status: 'Ongoing',
              funding: 'NSF Grant',
              collaborators: ['Dr. Smith', 'Dr. Davis'],
              publications: ['Journal of Applied Math, 2023'],
            },
          ],
          office: 'Room 305',
          officeHours: 'Monday/Wednesday 2:00 PM - 4:00 PM',
          status: 'active',
        },
        {
          id: '2',
          firstName: 'Michael',
          lastName: 'Chen',
          email: 'michael.chen@smartpanda.edu',
          phone: '+1-555-0124',
          department: 'English',
          position: 'Associate Professor',
          rank: 'Associate Professor',
          specialization: ['Academic Writing', 'Literature', 'Composition'],
          qualifications: [
            {
              id: '1',
              degree: 'Ph.D. in English',
              institution: 'Harvard',
              year: '2012',
              field: 'Composition Studies',
            },
          ],
          courses: ['ENG101', 'ENG201', 'ENG301'],
          research: [
            {
              id: '1',
              title: 'Writing Pedagogy Research',
              description: 'Study of effective writing teaching methods',
              status: 'Ongoing',
              funding: 'Internal Grant',
              collaborators: ['Prof. Wilson'],
              publications: ['Composition Forum, 2023'],
            },
          ],
          office: 'Room 205',
          officeHours: 'Tuesday/Thursday 10:00 AM - 12:00 PM',
          status: 'active',
        },
      ]);

      setStudentRecords([
        {
          id: '1',
          studentId: 'STU001',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@smartpanda.edu',
          program: 'BSCS',
          level: 'Junior',
          status: 'active',
          gpa: 3.7,
          credits: {
            earned: 78,
            attempted: 84,
            remaining: 42,
          },
          enrollment: [
            {
              id: '1',
              semester: 'Fall 2024',
              courses: [
                {
                  courseId: '1',
                  courseCode: 'CS301',
                  title: 'Algorithms',
                  credits: 4,
                  grade: 'A-',
                  status: 'completed',
                },
              ],
              status: 'active',
              gpa: 3.7,
            },
          ],
          academicStanding: 'Good Standing',
          advisor: 'Dr. Emily Davis',
        },
        {
          id: '2',
          studentId: 'STU002',
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@smartpanda.edu',
          program: 'BAENG',
          level: 'Sophomore',
          status: 'active',
          gpa: 3.9,
          credits: {
            earned: 45,
            attempted: 48,
            remaining: 75,
          },
          enrollment: [
            {
              id: '1',
              semester: 'Fall 2024',
              courses: [
                {
                  courseId: '2',
                  courseCode: 'ENG201',
                  title: 'Academic Writing',
                  credits: 3,
                  status: 'in-progress',
                },
              ],
              status: 'active',
              gpa: 3.9,
            },
          ],
          academicStanding: 'Dean\'s List',
          advisor: 'Prof. Robert Wilson',
        },
      ]);

      setAcademicCalendar([
        {
          id: '1',
          title: 'Fall Semester Begins',
          type: 'Academic',
          startDate: '2024-08-26',
          endDate: '2024-08-26',
          description: 'First day of Fall semester classes',
          importance: 'high',
          audience: ['Students', 'Faculty', 'Staff'],
          status: 'scheduled',
        },
        {
          id: '2',
          title: 'Midterm Exams',
          type: 'Examination',
          startDate: '2024-10-14',
          endDate: '2024-10-18',
          description: 'Midterm examination period',
          importance: 'high',
          audience: ['Students', 'Faculty'],
          status: 'scheduled',
        },
        {
          id: '3',
          title: 'Thanksgiving Break',
          type: 'Holiday',
          startDate: '2024-11-27',
          endDate: '2024-11-29',
          description: 'Thanksgiving holiday break',
          importance: 'medium',
          audience: ['Students', 'Faculty', 'Staff'],
          status: 'scheduled',
        },
      ]);

      setAcademicPolicies([
        {
          id: '1',
          title: 'Academic Integrity Policy',
          category: 'Academic Standards',
          description: 'Policy regarding academic honesty and integrity',
          effectiveDate: '2023-08-01',
          lastRevised: '2023-06-15',
          status: 'active',
          document: 'academic-integrity-policy.pdf',
          relatedPolicies: ['Student Conduct Code', 'Plagiarism Policy'],
        },
        {
          id: '2',
          title: 'Grade Appeal Process',
          category: 'Grading',
          description: 'Procedure for appealing final grades',
          effectiveDate: '2023-08-01',
          lastRevised: '2023-07-20',
          status: 'active',
          document: 'grade-appeal-process.pdf',
          relatedPolicies: ['Academic Standards Policy'],
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
      case 'scheduled':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending':
      case 'draft':
      case 'under-review':
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'inactive':
      case 'cancelled':
      case 'suspended':
      case 'archived':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'on-leave':
      case 'review':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Academic Affairs</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage academic programs, courses, and policies</p>
      </div>

      {/* Alert */}
      <div className="mb-6 bg-purple-50 dark:bg-purple-900 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
        <div className="flex items-center">
          <BellIcon className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-3" />
          <div>
            <h3 className="text-sm font-medium text-purple-800 dark:text-purple-200">Academic Updates</h3>
            <p className="text-sm text-purple-700 dark:text-purple-300">Fall semester registration opens next week. 3 courses pending approval.</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: ChartBarIcon },
            { id: 'courses', label: 'Courses', icon: BookOpenIcon },
            { id: 'programs', label: 'Programs', icon: AcademicCapIcon },
            { id: 'curriculum', label: 'Curriculum', icon: DocumentTextIcon },
            { id: 'faculty', label: 'Faculty', icon: UsersIcon },
            { id: 'students', label: 'Student Records', icon: UserGroupIcon },
            { id: 'calendar', label: 'Academic Calendar', icon: CalendarIcon },
            { id: 'policies', label: 'Policies', icon: ShieldCheckIcon },
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
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Courses</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">156</p>
                </div>
                <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-3">
                  <BookOpenIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-green-600 dark:text-green-400">12</span>
                <span className="text-gray-500 dark:text-gray-400 ml-2">new this semester</span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Programs</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">24</p>
                </div>
                <div className="bg-green-100 dark:bg-green-900 rounded-full p-3">
                  <AcademicCapIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-green-600 dark:text-green-400">2</span>
                <span className="text-gray-500 dark:text-gray-400 ml-2">under review</span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Faculty Members</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">89</p>
                </div>
                <div className="bg-purple-100 dark:bg-purple-900 rounded-full p-3">
                  <UsersIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-yellow-600 dark:text-yellow-400">3</span>
                <span className="text-gray-500 dark:text-gray-400 ml-2">on leave</span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Student Enrollment</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">2,847</p>
                </div>
                <div className="bg-orange-100 dark:bg-orange-900 rounded-full p-3">
                  <UserGroupIcon className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-green-600 dark:text-green-400">+8%</span>
                <span className="text-gray-500 dark:text-gray-400 ml-2">vs last year</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Course Catalog</h2>
                <div className="flex items-center space-x-3">
                  <button className="flex items-center px-3 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add Course
                  </button>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Course</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Instructor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Schedule</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Enrollment</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {courses.map((course) => (
                    <tr key={course.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{course.courseCode}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{course.title}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{course.credits} credits</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{course.instructor}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <div>{course.schedule.days.join(', ')}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{course.schedule.time}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{course.schedule.room}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <div>{course.enrollment.current}/{course.enrollment.capacity}</div>
                        {course.enrollment.waitlist > 0 && (
                          <div className="text-xs text-yellow-600 dark:text-yellow-400">{course.enrollment.waitlist} waitlisted</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(course.status)}`}>
                          {course.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => setSelectedCourse(course)}
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

        {activeTab === 'programs' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {programs.map((program) => (
              <div key={program.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{program.name}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(program.status)}`}>
                    {program.status}
                  </span>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Program Code</span>
                    <span className="font-medium text-gray-900 dark:text-white">{program.code}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Degree</span>
                    <span className="font-medium text-gray-900 dark:text-white">{program.degree}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Duration</span>
                    <span className="font-medium text-gray-900 dark:text-white">{program.duration}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Total Credits</span>
                    <span className="font-medium text-gray-900 dark:text-white">{program.totalCredits}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Coordinator</span>
                    <span className="font-medium text-gray-900 dark:text-white">{program.coordinator}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{program.description}</p>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setSelectedProgram(program)}
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
                      <DocumentTextIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'curriculum' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {curriculum.map((curr) => (
              <div key={curr.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{curr.name}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(curr.status)}`}>
                    {curr.status}
                  </span>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Version</span>
                    <span className="font-medium text-gray-900 dark:text-white">{curr.version}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Department</span>
                    <span className="font-medium text-gray-900 dark:text-white">{curr.department}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Effective Date</span>
                    <span className="font-medium text-gray-900 dark:text-white">{curr.effectiveDate}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Courses</span>
                    <span className="font-medium text-gray-900 dark:text-white">{curr.courses.length}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{curr.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {curr.outcomes.slice(0, 2).map((outcome, index) => (
                      <span key={index} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full">
                        {outcome.substring(0, 30)}...
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

        {activeTab === 'faculty' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Faculty Directory</h2>
                <button className="flex items-center px-3 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Add Faculty
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Faculty</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Position</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Specialization</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {faculty.map((facultyMember) => (
                    <tr key={facultyMember.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {facultyMember.firstName} {facultyMember.lastName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{facultyMember.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{facultyMember.department}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{facultyMember.position}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <div className="flex flex-wrap gap-1">
                          {facultyMember.specialization.slice(0, 2).map((spec, index) => (
                            <span key={index} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full">
                              {spec}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(facultyMember.status)}`}>
                          {facultyMember.status}
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

        {activeTab === 'students' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Student Records</h2>
                <div className="flex items-center space-x-3">
                  <button className="flex items-center px-3 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add Student
                  </button>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Program</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Level</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">GPA</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Credits</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Standing</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {studentRecords.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {student.firstName} {student.lastName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{student.studentId}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{student.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{student.program}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{student.level}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <span className={`font-medium ${student.gpa >= 3.5 ? 'text-green-600' : student.gpa >= 3.0 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {student.gpa.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <div>{student.credits.earned} earned</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{student.credits.remaining} remaining</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(student.status)}`}>
                          {student.academicStanding}
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

        {activeTab === 'calendar' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {academicCalendar.map((event) => (
              <div key={event.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{event.title}</h3>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getImportanceColor(event.importance)}`}>
                      {event.importance}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(event.status)}`}>
                      {event.status}
                    </span>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Type</span>
                    <span className="font-medium text-gray-900 dark:text-white">{event.type}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Date Range</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {event.startDate} - {event.endDate}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Audience</span>
                    <div className="flex flex-wrap gap-1">
                      {event.audience.map((aud, index) => (
                        <span key={index} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full">
                          {aud}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{event.description}</p>
                <div className="flex items-center justify-between">
                  <button className="flex items-center text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300">
                    <CalendarIcon className="w-4 h-4 mr-1" />
                    Add to Calendar
                  </button>
                  <div className="flex items-center space-x-2">
                    <button className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300">
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300">
                      <BellIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'policies' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {academicPolicies.map((policy) => (
              <div key={policy.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{policy.title}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(policy.status)}`}>
                    {policy.status}
                  </span>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Category</span>
                    <span className="font-medium text-gray-900 dark:text-white">{policy.category}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Effective Date</span>
                    <span className="font-medium text-gray-900 dark:text-white">{policy.effectiveDate}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Last Revised</span>
                    <span className="font-medium text-gray-900 dark:text-white">{policy.lastRevised}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{policy.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full">
                      📎 {policy.document}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300">
                      <ArrowDownTrayIcon className="w-4 h-4" />
                    </button>
                    <button className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300">
                      <EyeIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Course Detail Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Course Details</h3>
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="mb-6">
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {selectedCourse.courseCode} - {selectedCourse.title}
                    </h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedCourse.status)}`}>
                      {selectedCourse.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Department</p>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedCourse.department}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Level</p>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedCourse.level}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Credits</p>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedCourse.credits}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Semester</p>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedCourse.semester}</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h5 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Description</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{selectedCourse.description}</p>
                  </div>

                  <div className="mb-6">
                    <h5 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Learning Objectives</h5>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      {selectedCourse.learningObjectives.map((objective, index) => (
                        <li key={index} className="flex items-center">
                          <CheckCircleIcon className="w-3 h-3 text-green-500 mr-2" />
                          {objective}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-6">
                    <h5 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Assessments</h5>
                    <div className="space-y-2">
                      {selectedCourse.assessments.map((assessment) => (
                        <div key={assessment.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">{assessment.title}</p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">{assessment.type} - {assessment.weight}%</p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">Due: {assessment.dueDate}</p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{assessment.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-1">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                    <h5 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Schedule</h5>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Days</p>
                        <p className="font-medium text-gray-900 dark:text-white">{selectedCourse.schedule.days.join(', ')}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Time</p>
                        <p className="font-medium text-gray-900 dark:text-white">{selectedCourse.schedule.time}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Room</p>
                        <p className="font-medium text-gray-900 dark:text-white">{selectedCourse.schedule.room}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Duration</p>
                        <p className="font-medium text-gray-900 dark:text-white">{selectedCourse.schedule.duration}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                    <h5 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Instructor</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{selectedCourse.instructor}</p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                    <h5 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Enrollment</h5>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Enrolled</span>
                        <span className="font-medium text-gray-900 dark:text-white">{selectedCourse.enrollment.current}/{selectedCourse.enrollment.capacity}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div
                          className="bg-primary-600 h-2 rounded-full"
                          style={{ width: `${(selectedCourse.enrollment.current / selectedCourse.enrollment.capacity) * 100}%` }}
                        />
                      </div>
                      {selectedCourse.enrollment.waitlist > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Waitlist</span>
                          <span className="font-medium text-yellow-600 dark:text-yellow-400">{selectedCourse.enrollment.waitlist}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h5 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Materials</h5>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      {selectedCourse.materials.map((material, index) => (
                        <li key={index} className="flex items-center">
                          <DocumentTextIcon className="w-3 h-3 text-blue-500 mr-2" />
                          {material}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Program Detail Modal */}
      {selectedProgram && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Program Details</h3>
                <button
                  onClick={() => setSelectedProgram(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{selectedProgram.name}</h4>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedProgram.status)}`}>
                  {selectedProgram.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Program Code</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedProgram.code}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Degree</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedProgram.degree}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Department</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedProgram.department}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Duration</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedProgram.duration}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Credits</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedProgram.totalCredits}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Coordinator</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedProgram.coordinator}</p>
                </div>
              </div>

              <div className="mb-6">
                <h5 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Description</h5>
                <p className="text-sm text-gray-600 dark:text-gray-400">{selectedProgram.description}</p>
              </div>

              <div className="mb-6">
                <h5 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Program Requirements</h5>
                <div className="space-y-3">
                  {selectedProgram.requirements.map((req) => (
                    <div key={req.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{req.type}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{req.credits} credits</p>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{req.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {req.courses.map((course, index) => (
                          <span key={index} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full">
                            {course}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h5 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Learning Outcomes</h5>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  {selectedProgram.outcomes.map((outcome, index) => (
                    <li key={index} className="flex items-center">
                      <StarIcon className="w-3 h-3 text-yellow-500 mr-2" />
                      {outcome}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h5 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Courses</h5>
                <div className="flex flex-wrap gap-2">
                  {selectedProgram.courses.map((course, index) => (
                    <span key={index} className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                      {course}
                    </span>
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
