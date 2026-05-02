import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  AcademicCapIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  DocumentArrowDownIcon,
  CalendarIcon,
  UserIcon,
  ClockIcon,
  BookOpenIcon,
  ChartBarIcon,
  UsersIcon,
  BuildingOfficeIcon,
  BellIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  PrinterIcon,
} from '@heroicons/react/24/outline';

// Types
interface Examination {
  id: string;
  title: string;
  description: string;
  examType: 'Mid-Term' | 'Final' | 'Mock' | 'Practical' | 'Assignment' | 'Quiz' | 'Test' | 'National' | 'International';
  subject: string;
  grade: string;
  stream?: string;
  academicYear: string;
  term: string;
  examDate: string;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  venue: string;
  maxMarks: number;
  passingMarks: number;
  status: 'Draft' | 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled' | 'Postponed';
  invigilators: string[];
  totalStudents: number;
  registeredStudents: number;
  attendedStudents: number;
  isExternal: boolean;
  externalBoard?: string;
  instructions: string[];
  materials: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface ExamSchedule {
  id: string;
  examinationId: string;
  examinationTitle: string;
  grade: string;
  stream?: string;
  subject: string;
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  invigilators: string[];
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface ExamResult {
  id: string;
  examinationId: string;
  examinationTitle: string;
  studentId: string;
  studentName: string;
  studentNumber: string;
  grade: string;
  stream: string;
  subject: string;
  marksObtained: number;
  maxMarks: number;
  percentage: number;
  grade: string;
  status: 'Pass' | 'Fail' | 'Absent' | 'Pending';
  rank?: number;
  classRank?: number;
  gradeRank?: number;
  remarks?: string;
  gradedBy: string;
  gradedDate: string;
  verifiedBy?: string;
  verifiedDate?: string;
  published: boolean;
  publishedDate?: string;
  createdAt: string;
  updatedAt: string;
}

interface ExamStatistics {
  id: string;
  examinationId: string;
  examinationTitle: string;
  subject: string;
  grade: string;
  totalStudents: number;
  attendedStudents: number;
  passedStudents: number;
  failedStudents: number;
  absentStudents: number;
  averageMarks: number;
  highestMarks: number;
  lowestMarks: number;
  passPercentage: number;
  gradeDistribution: {
    'A+': number;
    'A': number;
    'B': number;
    'C': number;
    'D': number;
    'E': number;
    'F': number;
  };
  generatedDate: string;
  generatedBy: string;
}

export const ExaminationManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'examinations' | 'schedule' | 'results' | 'statistics'>('examinations');
  const [examinations, setExaminations] = useState<Examination[]>([]);
  const [examSchedules, setExamSchedules] = useState<ExamSchedule[]>([]);
  const [examResults, setExamResults] = useState<ExamResult[]>([]);
  const [examStatistics, setExamStatistics] = useState<ExamStatistics[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGrade, setFilterGrade] = useState<string>('all');
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Examination | null>(null);
  const [formData, setFormData] = useState<Partial<Examination | ExamResult>>({});

  // Mock data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock examinations
      const mockExaminations: Examination[] = [
        {
          id: 'exam-001',
          title: 'Form 1 Mathematics Mid-Term Examination',
          description: 'Comprehensive mathematics assessment covering topics from the first half of the term',
          examType: 'Mid-Term',
          subject: 'Mathematics',
          grade: 'Form 1',
          stream: 'A',
          academicYear: '2024',
          term: 'Term 1',
          examDate: '2024-02-15',
          startTime: '09:00',
          endTime: '11:30',
          duration: 150,
          venue: 'Main Hall',
          maxMarks: 100,
          passingMarks: 50,
          status: 'Completed',
          invigilators: ['Mrs. Johnson', 'Mr. Smith'],
          totalStudents: 30,
          registeredStudents: 30,
          attendedStudents: 29,
          isExternal: false,
          instructions: [
            'Bring your own calculator',
            'No mobile phones allowed',
            'Write in blue or black ink only',
            'Read all instructions carefully',
          ],
          materials: ['Answer sheets', 'Question papers', 'Rough paper'],
          createdBy: 'Academic Office',
          createdAt: '2024-01-20T00:00:00Z',
          updatedAt: '2024-02-15T15:00:00Z',
        },
        {
          id: 'exam-002',
          title: 'Form 2 English Final Examination',
          description: 'Final English examination covering literature, grammar, and composition',
          examType: 'Final',
          subject: 'English',
          grade: 'Form 2',
          stream: 'B',
          academicYear: '2024',
          term: 'Term 1',
          examDate: '2024-03-20',
          startTime: '08:30',
          endTime: '11:00',
          duration: 150,
          venue: 'Examination Hall A',
          maxMarks: 100,
          passingMarks: 40,
          status: 'Scheduled',
          invigilators: ['Mrs. Davis', 'Mr. Wilson'],
          totalStudents: 28,
          registeredStudents: 28,
          attendedStudents: 0,
          isExternal: false,
          instructions: [
            'Bring your own writing materials',
            'No electronic devices permitted',
            'Answer all questions',
            'Manage your time wisely',
          ],
          materials: ['Answer booklets', 'Question papers'],
          createdBy: 'Academic Office',
          createdAt: '2024-02-01T00:00:00Z',
          updatedAt: '2024-02-01T00:00:00Z',
        },
        {
          id: 'exam-003',
          title: 'ZIMSEC O-Level Physics Mock Exam',
          description: 'Mock examination for ZIMSEC O-Level Physics preparation',
          examType: 'Mock',
          subject: 'Physics',
          grade: 'Form 4',
          stream: 'A',
          academicYear: '2024',
          term: 'Term 1',
          examDate: '2024-02-28',
          startTime: '09:00',
          endTime: '12:00',
          duration: 180,
          venue: 'Science Laboratory',
          maxMarks: 100,
          passingMarks: 50,
          status: 'In Progress',
          invigilators: ['Dr. Brown', 'Mr. Taylor'],
          totalStudents: 25,
          registeredStudents: 25,
          attendedStudents: 25,
          isExternal: true,
          externalBoard: 'ZIMSEC',
          instructions: [
            'Follow ZIMSEC guidelines strictly',
            'Use approved calculators only',
            'Show all working steps',
            'Label diagrams clearly',
          ],
          materials: ['Answer sheets', 'Graph paper', 'Calculator'],
          createdBy: 'Academic Office',
          createdAt: '2024-01-15T00:00:00Z',
          updatedAt: '2024-02-28T09:00:00Z',
        },
        {
          id: 'exam-004',
          title: 'Form 3 Chemistry Practical Test',
          description: 'Practical examination testing laboratory skills and chemical knowledge',
          examType: 'Practical',
          subject: 'Chemistry',
          grade: 'Form 3',
          stream: 'C',
          academicYear: '2024',
          term: 'Term 1',
          examDate: '2024-03-10',
          startTime: '10:00',
          endTime: '12:30',
          duration: 150,
          venue: 'Chemistry Lab',
          maxMarks: 50,
          passingMarks: 25,
          status: 'Scheduled',
          invigilators: ['Ms. Anderson', 'Lab Assistant'],
          totalStudents: 20,
          registeredStudents: 20,
          attendedStudents: 0,
          isExternal: false,
          instructions: [
            'Wear lab coats at all times',
            'Follow safety procedures',
            'Clean work area after completion',
            'Handle chemicals carefully',
          ],
          materials: ['Lab equipment', 'Chemicals', 'Report sheets'],
          createdBy: 'Science Department',
          createdAt: '2024-02-10T00:00:00Z',
          updatedAt: '2024-02-10T00:00:00Z',
        },
      ];

      // Mock exam schedules
      const mockSchedules: ExamSchedule[] = [
        {
          id: 'sch-001',
          examinationId: 'exam-001',
          examinationTitle: 'Form 1 Mathematics Mid-Term Examination',
          grade: 'Form 1',
          stream: 'A',
          subject: 'Mathematics',
          date: '2024-02-15',
          startTime: '09:00',
          endTime: '11:30',
          venue: 'Main Hall',
          invigilators: ['Mrs. Johnson', 'Mr. Smith'],
          status: 'Completed',
          notes: 'All students except one attended the exam',
          createdAt: '2024-01-20T00:00:00Z',
          updatedAt: '2024-02-15T15:00:00Z',
        },
        {
          id: 'sch-002',
          examinationId: 'exam-002',
          examinationTitle: 'Form 2 English Final Examination',
          grade: 'Form 2',
          stream: 'B',
          subject: 'English',
          date: '2024-03-20',
          startTime: '08:30',
          endTime: '11:00',
          venue: 'Examination Hall A',
          invigilators: ['Mrs. Davis', 'Mr. Wilson'],
          status: 'Scheduled',
          notes: 'Final exam for Term 1',
          createdAt: '2024-02-01T00:00:00Z',
          updatedAt: '2024-02-01T00:00:00Z',
        },
        {
          id: 'sch-003',
          examinationId: 'exam-003',
          examinationTitle: 'ZIMSEC O-Level Physics Mock Exam',
          grade: 'Form 4',
          stream: 'A',
          subject: 'Physics',
          date: '2024-02-28',
          startTime: '09:00',
          endTime: '12:00',
          venue: 'Science Laboratory',
          invigilators: ['Dr. Brown', 'Mr. Taylor'],
          status: 'In Progress',
          notes: 'ZIMSEC mock examination',
          createdAt: '2024-01-15T00:00:00Z',
          updatedAt: '2024-02-28T09:00:00Z',
        },
      ];

      // Mock exam results
      const mockResults: ExamResult[] = [
        {
          id: 'res-001',
          examinationId: 'exam-001',
          examinationTitle: 'Form 1 Mathematics Mid-Term Examination',
          studentId: 'student-001',
          studentName: 'John Smith',
          studentNumber: 'STU2024001',
          grade: 'Form 1',
          stream: 'A',
          subject: 'Mathematics',
          marksObtained: 85,
          maxMarks: 100,
          percentage: 85,
          grade: 'A',
          status: 'Pass',
          rank: 3,
          classRank: 3,
          gradeRank: 3,
          remarks: 'Excellent performance',
          gradedBy: 'Mrs. Johnson',
          gradedDate: '2024-02-16',
          verifiedBy: 'Mr. Headmaster',
          verifiedDate: '2024-02-17',
          published: true,
          publishedDate: '2024-02-18',
          createdAt: '2024-02-16T10:00:00Z',
          updatedAt: '2024-02-18T14:00:00Z',
        },
        {
          id: 'res-002',
          examinationId: 'exam-001',
          examinationTitle: 'Form 1 Mathematics Mid-Term Examination',
          studentId: 'student-002',
          studentName: 'Sarah Johnson',
          studentNumber: 'STU2024002',
          grade: 'Form 1',
          stream: 'A',
          subject: 'Mathematics',
          marksObtained: 92,
          maxMarks: 100,
          percentage: 92,
          grade: 'A+',
          status: 'Pass',
          rank: 1,
          classRank: 1,
          gradeRank: 1,
          remarks: 'Outstanding performance',
          gradedBy: 'Mrs. Johnson',
          gradedDate: '2024-02-16',
          verifiedBy: 'Mr. Headmaster',
          verifiedDate: '2024-02-17',
          published: true,
          publishedDate: '2024-02-18',
          createdAt: '2024-02-16T10:00:00Z',
          updatedAt: '2024-02-18T14:00:00Z',
        },
        {
          id: 'res-003',
          examinationId: 'exam-001',
          examinationTitle: 'Form 1 Mathematics Mid-Term Examination',
          studentId: 'student-003',
          studentName: 'Michael Brown',
          studentNumber: 'STU2024003',
          grade: 'Form 1',
          stream: 'A',
          subject: 'Mathematics',
          marksObtained: 45,
          maxMarks: 100,
          percentage: 45,
          grade: 'E',
          status: 'Fail',
          rank: 28,
          classRank: 28,
          gradeRank: 28,
          remarks: 'Needs improvement',
          gradedBy: 'Mrs. Johnson',
          gradedDate: '2024-02-16',
          verifiedBy: 'Mr. Headmaster',
          verifiedDate: '2024-02-17',
          published: true,
          publishedDate: '2024-02-18',
          createdAt: '2024-02-16T10:00:00Z',
          updatedAt: '2024-02-18T14:00:00Z',
        },
        {
          id: 'res-004',
          examinationId: 'exam-001',
          examinationTitle: 'Form 1 Mathematics Mid-Term Examination',
          studentId: 'student-004',
          studentName: 'Emily Davis',
          studentNumber: 'STU2024004',
          grade: 'Form 1',
          stream: 'A',
          subject: 'Mathematics',
          marksObtained: 0,
          maxMarks: 100,
          percentage: 0,
          grade: 'F',
          status: 'Absent',
          remarks: 'Absent from examination',
          gradedBy: 'Mrs. Johnson',
          gradedDate: '2024-02-16',
          published: true,
          publishedDate: '2024-02-18',
          createdAt: '2024-02-16T10:00:00Z',
          updatedAt: '2024-02-18T14:00:00Z',
        },
      ];

      // Mock exam statistics
      const mockStatistics: ExamStatistics[] = [
        {
          id: 'stat-001',
          examinationId: 'exam-001',
          examinationTitle: 'Form 1 Mathematics Mid-Term Examination',
          subject: 'Mathematics',
          grade: 'Form 1',
          totalStudents: 30,
          attendedStudents: 29,
          passedStudents: 25,
          failedStudents: 4,
          absentStudents: 1,
          averageMarks: 72.5,
          highestMarks: 95,
          lowestMarks: 35,
          passPercentage: 86.2,
          gradeDistribution: {
            'A+': 3,
            'A': 8,
            'B': 10,
            'C': 4,
            'D': 2,
            'E': 2,
            'F': 0,
          },
          generatedDate: '2024-02-18',
          generatedBy: 'System',
        },
        {
          id: 'stat-002',
          examinationId: 'exam-003',
          examinationTitle: 'ZIMSEC O-Level Physics Mock Exam',
          subject: 'Physics',
          grade: 'Form 4',
          totalStudents: 25,
          attendedStudents: 25,
          passedStudents: 18,
          failedStudents: 7,
          absentStudents: 0,
          averageMarks: 65.8,
          highestMarks: 88,
          lowestMarks: 42,
          passPercentage: 72.0,
          gradeDistribution: {
            'A+': 2,
            'A': 4,
            'B': 6,
            'C': 6,
            'D': 4,
            'E': 3,
            'F': 0,
          },
          generatedDate: '2024-02-28',
          generatedBy: 'System',
        },
      ];
      
      setExaminations(mockExaminations);
      setExamSchedules(mockSchedules);
      setExamResults(mockResults);
      setExamStatistics(mockStatistics);
      setLoading(false);
    };

    loadData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
      case 'Pass':
        return 'text-success-600 bg-success-100';
      case 'Scheduled':
      case 'In Progress':
      case 'Pending':
        return 'text-blue-600 bg-blue-100';
      case 'Draft':
        return 'text-gray-600 bg-gray-100';
      case 'Cancelled':
      case 'Fail':
      case 'Postponed':
        return 'text-red-600 bg-red-100';
      case 'Absent':
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getExamTypeColor = (type: string) => {
    switch (type) {
      case 'Mid-Term':
        return 'text-blue-600 bg-blue-100';
      case 'Final':
        return 'text-red-600 bg-red-100';
      case 'Mock':
        return 'text-purple-600 bg-purple-100';
      case 'Practical':
        return 'text-green-600 bg-green-100';
      case 'Assignment':
        return 'text-yellow-600 bg-yellow-100';
      case 'Quiz':
        return 'text-orange-600 bg-orange-100';
      case 'Test':
        return 'text-indigo-600 bg-indigo-100';
      case 'National':
        return 'text-teal-600 bg-teal-100';
      case 'International':
        return 'text-pink-600 bg-pink-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+':
        return 'text-purple-600 bg-purple-100';
      case 'A':
        return 'text-green-600 bg-green-100';
      case 'B':
        return 'text-blue-600 bg-blue-100';
      case 'C':
        return 'text-yellow-600 bg-yellow-100';
      case 'D':
        return 'text-orange-600 bg-orange-100';
      case 'E':
        return 'text-red-600 bg-red-100';
      case 'F':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredExaminations = examinations.filter(exam => {
    const matchesSearch = exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exam.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exam.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = filterGrade === 'all' || exam.grade === filterGrade;
    const matchesSubject = filterSubject === 'all' || exam.subject === filterSubject;
    const matchesStatus = filterStatus === 'all' || exam.status === filterStatus;
    const matchesType = filterType === 'all' || exam.examType === filterType;
    return matchesSearch && matchesGrade && matchesSubject && matchesStatus && matchesType;
  });

  const filteredSchedules = examSchedules.filter(schedule => {
    const matchesSearch = schedule.examinationTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         schedule.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = filterGrade === 'all' || schedule.grade === filterGrade;
    const matchesStatus = filterStatus === 'all' || schedule.status === filterStatus;
    return matchesSearch && matchesGrade && matchesStatus;
  });

  const filteredResults = examResults.filter(result => {
    const matchesSearch = result.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         result.studentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         result.examinationTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = filterGrade === 'all' || result.grade === filterGrade;
    const matchesSubject = filterSubject === 'all' || result.subject === filterSubject;
    const matchesStatus = filterStatus === 'all' || result.status === filterStatus;
    return matchesSearch && matchesGrade && matchesSubject && matchesStatus;
  });

  const handleCreateExam = () => {
    // In real app, this would call API
    const newExam: Examination = {
      id: `exam-${Date.now()}`,
      title: formData.title || 'New Examination',
      description: formData.description || '',
      examType: formData.examType as Examination['examType'] || 'Test',
      subject: formData.subject || 'General',
      grade: formData.grade || 'Form 1',
      stream: formData.stream,
      academicYear: formData.academicYear || '2024',
      term: formData.term || 'Term 1',
      examDate: formData.examDate || new Date().toISOString().split('T')[0],
      startTime: formData.startTime || '09:00',
      endTime: formData.endTime || '11:00',
      duration: formData.duration || 120,
      venue: formData.venue || 'Main Hall',
      maxMarks: formData.maxMarks || 100,
      passingMarks: formData.passingMarks || 50,
      status: 'Draft',
      invigilators: formData.invigilators as string[] || [],
      totalStudents: formData.totalStudents || 0,
      registeredStudents: 0,
      attendedStudents: 0,
      isExternal: formData.isExternal || false,
      externalBoard: formData.externalBoard,
      instructions: formData.instructions as string[] || [],
      materials: formData.materials as string[] || [],
      createdBy: 'Current User',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setExaminations([...examinations, newExam]);
    setShowCreateModal(false);
    setFormData({});
  };

  const handleAddResult = () => {
    // In real app, this would call API
    const newResult: ExamResult = {
      id: `res-${Date.now()}`,
      examinationId: selectedExam?.id || 'exam-001',
      examinationTitle: selectedExam?.title || 'Examination',
      studentId: formData.studentId || 'student-new',
      studentName: formData.studentName || 'New Student',
      studentNumber: formData.studentNumber || 'STU000000',
      grade: formData.grade || 'Form 1',
      stream: formData.stream || 'A',
      subject: selectedExam?.subject || 'General',
      marksObtained: formData.marksObtained || 0,
      maxMarks: selectedExam?.maxMarks || 100,
      percentage: (formData.marksObtained || 0) / (selectedExam?.maxMarks || 100) * 100,
      grade: formData.grade || 'F',
      status: formData.marksObtained && selectedExam ? 
        (formData.marksObtained >= selectedExam.passingMarks ? 'Pass' : 'Fail') : 'Pending',
      remarks: formData.remarks,
      gradedBy: 'Current User',
      gradedDate: new Date().toISOString().split('T')[0],
      published: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setExamResults([...examResults, newResult]);
    setShowResultModal(false);
    setFormData({});
    setSelectedExam(null);
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
              Examination Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Schedule, conduct, and manage examinations and results
            </p>
          </div>
          <div className="flex gap-3">
            <button className="btn btn-secondary">
              <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
              Export Results
            </button>
            {activeTab === 'examinations' && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn btn-primary"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Schedule Exam
              </button>
            )}
            {activeTab === 'results' && (
              <button
                onClick={() => setShowResultModal(true)}
                className="btn btn-primary"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Add Results
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="flex space-x-8">
          {[
            { id: 'examinations', label: 'Examinations', icon: AcademicCapIcon },
            { id: 'schedule', label: 'Schedule', icon: CalendarIcon },
            { id: 'results', label: 'Results', icon: ChartBarIcon },
            { id: 'statistics', label: 'Statistics', icon: UsersIcon },
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
                  placeholder="Search examinations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterGrade}
                onChange={(e) => setFilterGrade(e.target.value)}
                className="form-input"
              >
                <option value="all">All Grades</option>
                <option value="Form 1">Form 1</option>
                <option value="Form 2">Form 2</option>
                <option value="Form 3">Form 3</option>
                <option value="Form 4">Form 4</option>
                <option value="Form 5">Form 5</option>
                <option value="Form 6">Form 6</option>
              </select>
              {activeTab !== 'schedule' && (
                <select
                  value={filterSubject}
                  onChange={(e) => setFilterSubject(e.target.value)}
                  className="form-input"
                >
                  <option value="all">All Subjects</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="English">English</option>
                  <option value="Science">Science</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Biology</option>
                  <option value="History">History</option>
                  <option value="Geography">Geography</option>
                </select>
              )}
              {activeTab === 'examinations' && (
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="form-input"
                >
                  <option value="all">All Types</option>
                  <option value="Mid-Term">Mid-Term</option>
                  <option value="Final">Final</option>
                  <option value="Mock">Mock</option>
                  <option value="Practical">Practical</option>
                  <option value="Assignment">Assignment</option>
                  <option value="Quiz">Quiz</option>
                  <option value="Test">Test</option>
                  <option value="National">National</option>
                  <option value="International">International</option>
                </select>
              )}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="form-input"
              >
                <option value="all">All Status</option>
                <option value="Draft">Draft</option>
                <option value="Scheduled">Scheduled</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Postponed">Postponed</option>
                <option value="Pass">Pass</option>
                <option value="Fail">Fail</option>
                <option value="Absent">Absent</option>
                <option value="Pending">Pending</option>
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
      {activeTab === 'examinations' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExaminations.map((exam, index) => (
            <motion.div
              key={exam.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card card-hover"
            >
              <div className="card-body">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                      {exam.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {exam.grade} {exam.stream && `- ${exam.stream}`} • {exam.subject}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(exam.status)}`}>
                    {exam.status}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Type</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getExamTypeColor(exam.examType)}`}>
                      {exam.examType}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Date</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {new Date(exam.examDate).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Time</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {exam.startTime} - {exam.endTime}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Duration</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {exam.duration} minutes
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Venue</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {exam.venue}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Marks</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {exam.maxMarks} (Pass: {exam.passingMarks})
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Students</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {exam.attendedStudents}/{exam.totalStudents}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {exam.isExternal && (
                      <span className="text-xs px-2 py-1 bg-purple-100 text-purple-600 rounded">
                        {exam.externalBoard}
                      </span>
                    )}
                    {exam.invigilators.length > 0 && (
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded">
                        {exam.invigilators.length} Invigilators
                      </span>
                    )}
                    {exam.instructions.length > 0 && (
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                        {exam.instructions.length} Instructions
                      </span>
                    )}
                  </div>

                  {exam.description && (
                    <div className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {exam.description}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-sm text-gray-500 dark:text-gray-500">
                    Created by {exam.createdBy}
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

      {activeTab === 'schedule' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchedules.map((schedule, index) => (
            <motion.div
              key={schedule.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card card-hover"
            >
              <div className="card-body">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                      {schedule.examinationTitle}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {schedule.grade} {schedule.stream && `- ${schedule.stream}`} • {schedule.subject}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(schedule.status)}`}>
                    {schedule.status}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Date</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {new Date(schedule.date).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Time</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {schedule.startTime} - {schedule.endTime}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Venue</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {schedule.venue}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Invigilators</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {schedule.invigilators.join(', ')}
                    </span>
                  </div>

                  {schedule.notes && (
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Notes:</span> {schedule.notes}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-sm text-gray-500 dark:text-gray-500">
                    {new Date(schedule.createdAt).toLocaleDateString()}
                  </div>
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
      )}

      {activeTab === 'results' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResults.map((result, index) => (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card card-hover"
            >
              <div className="card-body">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {result.studentName}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {result.studentNumber} • {result.grade} - {result.stream}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(result.status)}`}>
                    {result.status}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Subject</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {result.subject}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Marks</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {result.marksObtained}/{result.maxMarks}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Percentage</span>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-500">
                      {result.percentage.toFixed(1)}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Grade</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getGradeColor(result.grade)}`}>
                      {result.grade}
                    </span>
                  </div>

                  {result.rank && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Rank</span>
                      <span className="text-sm text-gray-500 dark:text-gray-500">
                        #{result.rank}
                      </span>
                    </div>
                  )}

                  {result.classRank && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Class Rank</span>
                      <span className="text-sm text-gray-500 dark:text-gray-500">
                        #{result.classRank}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Graded By</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {result.gradedBy}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Graded Date</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {new Date(result.gradedDate).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {result.verifiedBy && (
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded">
                        Verified
                      </span>
                    )}
                    {result.published && (
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded">
                        Published
                      </span>
                    )}
                  </div>

                  {result.remarks && (
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Remarks:</span> {result.remarks}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-sm text-gray-500 dark:text-gray-500">
                    {new Date(result.createdAt).toLocaleDateString()}
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

      {activeTab === 'statistics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {examStatistics.map((stats, index) => (
            <motion.div
              key={stats.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card card-hover"
            >
              <div className="card-body">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                      {stats.examinationTitle}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {stats.grade} • {stats.subject}
                    </p>
                  </div>
                  <ChartBarIcon className="w-6 h-6 text-gray-400" />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Total Students</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {stats.totalStudents}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Attended</span>
                    <span className="text-sm font-medium text-blue-600">
                      {stats.attendedStudents}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Passed</span>
                    <span className="text-sm font-medium text-green-600">
                      {stats.passedStudents}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Failed</span>
                    <span className="text-sm font-medium text-red-600">
                      {stats.failedStudents}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Absent</span>
                    <span className="text-sm font-medium text-orange-600">
                      {stats.absentStudents}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Average</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {stats.averageMarks.toFixed(1)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Pass %</span>
                    <span className="text-sm font-medium text-green-600">
                      {stats.passPercentage.toFixed(1)}%
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Grade Distribution:</div>
                    <div className="space-y-1">
                      {Object.entries(stats.gradeDistribution).map(([grade, count]) => (
                        <div key={grade} className="flex items-center justify-between text-xs">
                          <span className={`px-2 py-1 rounded-full ${getGradeColor(grade)}`}>
                            {grade}
                          </span>
                          <span className="text-gray-500 dark:text-gray-500">
                            {count} students
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-sm text-gray-500 dark:text-gray-500">
                    Generated {new Date(stats.generatedDate).toLocaleDateString()}
                  </div>
                  <div className="flex gap-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      <EyeIcon className="w-4 h-4" />
                    </button>
                    <button className="text-blue-600 hover:text-blue-800">
                      <DocumentArrowDownIcon className="w-4 h-4" />
                    </button>
                    <button className="text-blue-600 hover:text-blue-800">
                      <PrinterIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Examination Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full"
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Schedule Examination
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Exam Title
                  </label>
                  <input
                    type="text"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="form-input"
                    placeholder="Examination title..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="form-input"
                    placeholder="Exam description..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Exam Type
                    </label>
                    <select
                      value={formData.examType || ''}
                      onChange={(e) => setFormData({ ...formData, examType: e.target.value as Examination['examType'] })}
                      className="form-input"
                    >
                      <option value="Mid-Term">Mid-Term</option>
                      <option value="Final">Final</option>
                      <option value="Mock">Mock</option>
                      <option value="Practical">Practical</option>
                      <option value="Assignment">Assignment</option>
                      <option value="Quiz">Quiz</option>
                      <option value="Test">Test</option>
                      <option value="National">National</option>
                      <option value="International">International</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={formData.subject || ''}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="form-input"
                      placeholder="Subject..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Grade
                    </label>
                    <select
                      value={formData.grade || ''}
                      onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                      className="form-input"
                    >
                      <option value="Form 1">Form 1</option>
                      <option value="Form 2">Form 2</option>
                      <option value="Form 3">Form 3</option>
                      <option value="Form 4">Form 4</option>
                      <option value="Form 5">Form 5</option>
                      <option value="Form 6">Form 6</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Stream
                    </label>
                    <select
                      value={formData.stream || ''}
                      onChange={(e) => setFormData({ ...formData, stream: e.target.value || undefined })}
                      className="form-input"
                    >
                      <option value="">All Streams</option>
                      <option value="A">Stream A</option>
                      <option value="B">Stream B</option>
                      <option value="C">Stream C</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Exam Date
                    </label>
                    <input
                      type="date"
                      value={formData.examDate || ''}
                      onChange={(e) => setFormData({ ...formData, examDate: e.target.value })}
                      className="form-input"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Duration (minutes)
                    </label>
                    <input
                      type="number"
                      value={formData.duration || ''}
                      onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                      className="form-input"
                      placeholder="120"
                    />
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
                    Venue
                  </label>
                  <input
                    type="text"
                    value={formData.venue || ''}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    className="form-input"
                    placeholder="Examination venue..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Max Marks
                    </label>
                    <input
                      type="number"
                      value={formData.maxMarks || ''}
                      onChange={(e) => setFormData({ ...formData, maxMarks: parseInt(e.target.value) || 0 })}
                      className="form-input"
                      placeholder="100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Passing Marks
                    </label>
                    <input
                      type="number"
                      value={formData.passingMarks || ''}
                      onChange={(e) => setFormData({ ...formData, passingMarks: parseInt(e.target.value) || 0 })}
                      className="form-input"
                      placeholder="50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Invigilators (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.invigilators?.join(', ') || ''}
                    onChange={(e) => setFormData({ ...formData, invigilators: e.target.value.split(',').map(i => i.trim()) })}
                    className="form-input"
                    placeholder="Teacher 1, Teacher 2"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isExternal || false}
                    onChange={(e) => setFormData({ ...formData, isExternal: e.target.checked })}
                    className="form-checkbox mr-2"
                  />
                  <label className="text-sm text-gray-700 dark:text-gray-300">
                    External Examination
                  </label>
                </div>

                {formData.isExternal && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      External Board
                    </label>
                    <input
                      type="text"
                      value={formData.externalBoard || ''}
                      onChange={(e) => setFormData({ ...formData, externalBoard: e.target.value })}
                      className="form-input"
                      placeholder="e.g., ZIMSEC, Cambridge"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateExam}
                  className="btn btn-primary"
                >
                  Schedule Exam
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Add Result Modal */}
      {showResultModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full"
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Add Examination Result
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Select Examination
                  </label>
                  <select
                    value={selectedExam?.id || ''}
                    onChange={(e) => {
                      const exam = examinations.find(ex => ex.id === e.target.value);
                      setSelectedExam(exam || null);
                    }}
                    className="form-input"
                  >
                    <option value="">Select Examination</option>
                    {examinations.filter(ex => ex.status === 'Completed').map(exam => (
                      <option key={exam.id} value={exam.id}>{exam.title}</option>
                    ))}
                  </select>
                </div>

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
                    <option value="student-001">John Smith (STU2024001)</option>
                    <option value="student-002">Sarah Johnson (STU2024002)</option>
                    <option value="student-003">Michael Brown (STU2024003)</option>
                    <option value="student-004">Emily Davis (STU2024004)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Marks Obtained
                  </label>
                  <input
                    type="number"
                    value={formData.marksObtained || ''}
                    onChange={(e) => setFormData({ ...formData, marksObtained: parseInt(e.target.value) || 0 })}
                    className="form-input"
                    placeholder="0"
                    max={selectedExam?.maxMarks || 100}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Grade
                  </label>
                  <select
                    value={formData.grade || ''}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    className="form-input"
                  >
                    <option value="A+">A+</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                    <option value="E">E</option>
                    <option value="F">F</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Remarks
                  </label>
                  <textarea
                    value={formData.remarks || ''}
                    onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                    rows={3}
                    className="form-input"
                    placeholder="Performance remarks..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowResultModal(false);
                    setSelectedExam(null);
                    setFormData({});
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddResult}
                  className="btn btn-primary"
                  disabled={!selectedExam}
                >
                  Add Result
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
