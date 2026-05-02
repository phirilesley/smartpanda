import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  AcademicCapIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  CalendarIcon,
  BuildingOffice2Icon,
  UserGroupIcon,
  BookOpenIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';

// Types
interface AcademicYear {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'Active' | 'Upcoming' | 'Completed';
  tenantId: string;
  tenantName: string;
  currentTerm: string;
  totalTerms: number;
  createdAt: string;
  updatedAt: string;
}

interface Term {
  id: string;
  name: string;
  academicYearId: string;
  academicYearName: string;
  startDate: string;
  endDate: string;
  status: 'Active' | 'Upcoming' | 'Completed';
  termNumber: number;
  totalWeeks: number;
  currentWeek: number;
  isExamTerm: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Grade {
  id: string;
  name: string;
  code: string;
  level: number;
  description: string;
  status: 'Active' | 'Inactive';
  tenantId: string;
  tenantName: string;
  schoolId: string;
  schoolName: string;
  subjects: string[];
  streams: string[];
  maxStudents: number;
  currentStudents: number;
  createdAt: string;
  updatedAt: string;
}

interface Stream {
  id: string;
  name: string;
  code: string;
  gradeId: string;
  gradeName: string;
  description: string;
  status: 'Active' | 'Inactive';
  capacity: number;
  currentStudents: number;
  classTeacher?: string;
  roomNumber?: string;
  createdAt: string;
  updatedAt: string;
}

interface Subject {
  id: string;
  name: string;
  code: string;
  description: string;
  status: 'Active' | 'Inactive';
  type: 'Core' | 'Optional' | 'Elective';
  credits: number;
  passMark: number;
  grades: string[];
  teachers: string[];
  createdAt: string;
  updatedAt: string;
}

export const AcademicSetup: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'years' | 'terms' | 'grades' | 'streams' | 'subjects'>('years');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});

  // Mock data
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [terms, setTerms] = useState<Term[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [streams, setStreams] = useState<Stream[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      setAcademicYears([
        {
          id: 'year-001',
          name: '2024',
          startDate: '2024-01-15',
          endDate: '2024-12-15',
          status: 'Active',
          tenantId: 'tenant-001',
          tenantName: 'Harare School District',
          currentTerm: 'Term 1',
          totalTerms: 3,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
        {
          id: 'year-002',
          name: '2023',
          startDate: '2023-01-15',
          endDate: '2023-12-15',
          status: 'Completed',
          tenantId: 'tenant-001',
          tenantName: 'Harare School District',
          currentTerm: 'Term 3',
          totalTerms: 3,
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-12-15T00:00:00Z',
        },
      ]);

      setTerms([
        {
          id: 'term-001',
          name: 'Term 1',
          academicYearId: 'year-001',
          academicYearName: '2024',
          startDate: '2024-01-15',
          endDate: '2024-05-15',
          status: 'Active',
          termNumber: 1,
          totalWeeks: 17,
          currentWeek: 3,
          isExamTerm: false,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-15T00:00:00Z',
        },
        {
          id: 'term-002',
          name: 'Term 2',
          academicYearId: 'year-001',
          academicYearName: '2024',
          startDate: '2024-05-20',
          endDate: '2024-09-20',
          status: 'Upcoming',
          termNumber: 2,
          totalWeeks: 17,
          currentWeek: 0,
          isExamTerm: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      ]);

      setGrades([
        {
          id: 'grade-001',
          name: 'Form 1',
          code: 'F1',
          level: 1,
          description: 'First Form - Junior Secondary',
          status: 'Active',
          tenantId: 'tenant-001',
          tenantName: 'Harare School District',
          schoolId: 'school-001',
          schoolName: 'Harare High School',
          subjects: ['Mathematics', 'English', 'Science', 'History', 'Geography'],
          streams: ['A', 'B', 'C'],
          maxStudents: 120,
          currentStudents: 115,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
        {
          id: 'grade-002',
          name: 'Form 2',
          code: 'F2',
          level: 2,
          description: 'Second Form - Junior Secondary',
          status: 'Active',
          tenantId: 'tenant-001',
          tenantName: 'Harare School District',
          schoolId: 'school-001',
          schoolName: 'Harare High School',
          subjects: ['Mathematics', 'English', 'Science', 'History', 'Geography'],
          streams: ['A', 'B'],
          maxStudents: 80,
          currentStudents: 78,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      ]);

      setStreams([
        {
          id: 'stream-001',
          name: 'Stream A',
          code: 'F1A',
          gradeId: 'grade-001',
          gradeName: 'Form 1',
          description: 'Advanced Mathematics Stream',
          status: 'Active',
          capacity: 40,
          currentStudents: 38,
          classTeacher: 'Mrs. Johnson',
          roomNumber: 'Room 101',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      ]);

      setSubjects([
        {
          id: 'subject-001',
          name: 'Mathematics',
          code: 'MATH',
          description: 'Core Mathematics Subject',
          status: 'Active',
          type: 'Core',
          credits: 5,
          passMark: 50,
          grades: ['Form 1', 'Form 2', 'Form 3', 'Form 4', 'Form 5', 'Form 6'],
          teachers: ['Mr. Smith', 'Mrs. Johnson'],
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
        {
          id: 'subject-002',
          name: 'English Language',
          code: 'ENG',
          description: 'English Language and Literature',
          status: 'Active',
          type: 'Core',
          credits: 4,
          passMark: 50,
          grades: ['Form 1', 'Form 2', 'Form 3', 'Form 4', 'Form 5', 'Form 6'],
          teachers: ['Mrs. Brown', 'Mr. Davis'],
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      ]);

      setLoading(false);
    };

    loadData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'text-success-600 bg-success-100';
      case 'Upcoming':
        return 'text-warning-600 bg-warning-100';
      case 'Completed':
      case 'Inactive':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Core':
        return 'text-blue-600 bg-blue-100';
      case 'Optional':
        return 'text-green-600 bg-green-100';
      case 'Elective':
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const renderAcademicYears = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {academicYears.filter(year => 
        year.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filterStatus === 'all' || year.status === filterStatus)
      ).map((year, index) => (
        <motion.div
          key={year.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="card card-hover"
        >
          <div className="card-body">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {year.name} Academic Year
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {year.tenantName}
                </p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(year.status)}`}>
                {year.status}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Start Date</span>
                <span className="text-sm text-gray-500 dark:text-gray-500">
                  {new Date(year.startDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">End Date</span>
                <span className="text-sm text-gray-500 dark:text-gray-500">
                  {new Date(year.endDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Current Term</span>
                <span className="text-sm text-gray-500 dark:text-gray-500">
                  {year.currentTerm}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Terms</span>
                <span className="text-sm text-gray-500 dark:text-gray-500">
                  {year.totalTerms}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex gap-2">
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
  );

  const renderTerms = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {terms.filter(term => 
        term.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filterStatus === 'all' || term.status === filterStatus)
      ).map((term, index) => (
        <motion.div
          key={term.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="card card-hover"
        >
          <div className="card-body">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {term.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {term.academicYearName}
                </p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(term.status)}`}>
                {term.status}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Term Number</span>
                <span className="text-sm text-gray-500 dark:text-gray-500">
                  {term.termNumber} of {term.academicYearName.includes('2024') ? '3' : '3'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Duration</span>
                <span className="text-sm text-gray-500 dark:text-gray-500">
                  {new Date(term.startDate).toLocaleDateString()} - {new Date(term.endDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Week Progress</span>
                <span className="text-sm text-gray-500 dark:text-gray-500">
                  {term.currentWeek}/{term.totalWeeks} weeks
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full"
                  style={{ width: `${(term.currentWeek / term.totalWeeks) * 100}%` }}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Exam Term</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  term.isExamTerm ? 'text-orange-600 bg-orange-100' : 'text-gray-600 bg-gray-100'
                }`}>
                  {term.isExamTerm ? 'Yes' : 'No'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex gap-2">
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
  );

  const renderGrades = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {grades.filter(grade => 
        grade.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filterStatus === 'all' || grade.status === filterStatus)
      ).map((grade, index) => (
        <motion.div
          key={grade.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="card card-hover"
        >
          <div className="card-body">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {grade.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {grade.code} • {grade.schoolName}
                </p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(grade.status)}`}>
                {grade.status}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Level</span>
                <span className="text-sm text-gray-500 dark:text-gray-500">
                  {grade.level}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Students</span>
                <span className="text-sm text-gray-500 dark:text-gray-500">
                  {grade.currentStudents}/{grade.maxStudents}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Streams</span>
                <span className="text-sm text-gray-500 dark:text-gray-500">
                  {grade.streams.join(', ')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Subjects</span>
                <span className="text-sm text-gray-500 dark:text-gray-500">
                  {grade.subjects.length} subjects
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full"
                  style={{ width: `${(grade.currentStudents / grade.maxStudents) * 100}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex gap-2">
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
  );

  const renderStreams = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {streams.filter(stream => 
        stream.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filterStatus === 'all' || stream.status === filterStatus)
      ).map((stream, index) => (
        <motion.div
          key={stream.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="card card-hover"
        >
          <div className="card-body">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {stream.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {stream.code} • {stream.gradeName}
                </p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(stream.status)}`}>
                {stream.status}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Students</span>
                <span className="text-sm text-gray-500 dark:text-gray-500">
                  {stream.currentStudents}/{stream.capacity}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Class Teacher</span>
                <span className="text-sm text-gray-500 dark:text-gray-500">
                  {stream.classTeacher || 'Not assigned'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Room</span>
                <span className="text-sm text-gray-500 dark:text-gray-500">
                  {stream.roomNumber || 'Not assigned'}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full"
                  style={{ width: `${(stream.currentStudents / stream.capacity) * 100}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex gap-2">
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
  );

  const renderSubjects = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {subjects.filter(subject => 
        subject.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filterStatus === 'all' || subject.status === filterStatus)
      ).map((subject, index) => (
        <motion.div
          key={subject.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="card card-hover"
        >
          <div className="card-body">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {subject.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {subject.code}
                </p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(subject.status)}`}>
                {subject.status}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Type</span>
                <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(subject.type)}`}>
                  {subject.type}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Credits</span>
                <span className="text-sm text-gray-500 dark:text-gray-500">
                  {subject.credits}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Pass Mark</span>
                <span className="text-sm text-gray-500 dark:text-gray-500">
                  {subject.passMark}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Grades</span>
                <span className="text-sm text-gray-500 dark:text-gray-500">
                  {subject.grades.length} grades
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Teachers</span>
                <span className="text-sm text-gray-500 dark:text-gray-500">
                  {subject.teachers.length} teachers
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex gap-2">
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
  );

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
              Academic Setup
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage academic years, terms, grades, streams, and subjects
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Add {activeTab.charAt(0).toUpperCase() + activeTab.slice(1, -1)}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="flex space-x-8">
          {[
            { id: 'years', label: 'Academic Years', icon: CalendarIcon },
            { id: 'terms', label: 'Terms', icon: CalendarIcon },
            { id: 'grades', label: 'Grades', icon: AcademicCapIcon },
            { id: 'streams', label: 'Streams', icon: UserGroupIcon },
            { id: 'subjects', label: 'Subjects', icon: BookOpenIcon },
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

      {/* Filters and Search */}
      <div className="card mb-6">
        <div className="card-body">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="form-input"
              >
                <option value="all">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Upcoming">Upcoming</option>
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

      {/* Content */}
      {activeTab === 'years' && renderAcademicYears()}
      {activeTab === 'terms' && renderTerms()}
      {activeTab === 'grades' && renderGrades()}
      {activeTab === 'streams' && renderStreams()}
      {activeTab === 'subjects' && renderSubjects()}
    </div>
  );
};
