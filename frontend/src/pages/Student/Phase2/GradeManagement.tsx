import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  AcademicCapIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChartBarIcon,
  DocumentArrowDownIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CalendarIcon,
  UserGroupIcon,
  BookOpenIcon,
  TrophyIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

// Types
interface Grade {
  id: string;
  studentId: string;
  studentName: string;
  studentNumber: string;
  grade: string;
  stream: string;
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  term: string;
  academicYear: string;
  assessmentType: 'Assignment' | 'Quiz' | 'Test' | 'Exam' | 'Project' | 'Practical' | 'Homework';
  assessmentName: string;
  maxMarks: number;
  obtainedMarks: number;
  percentage: number;
  gradeLetter: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'E' | 'F' | 'P' | 'U';
  gradePoints: number;
  credits: number;
  status: 'Pass' | 'Fail' | 'Pending' | 'Incomplete';
  submissionDate?: string;
  markedDate?: string;
  markedBy: string;
  markedByRole: string;
  comments?: string;
  isRetake: boolean;
  originalGradeId?: string;
  parentNotified: boolean;
  createdAt: string;
  updatedAt: string;
}

interface GradeSummary {
  studentId: string;
  studentName: string;
  studentNumber: string;
  grade: string;
  stream: string;
  term: string;
  academicYear: string;
  totalSubjects: number;
  totalCredits: number;
  totalGradePoints: number;
  gpa: number;
  averagePercentage: number;
  passedSubjects: number;
  failedSubjects: number;
  pendingSubjects: number;
  overallStatus: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Critical';
  classRank?: number;
  classSize?: number;
  streamRank?: number;
  streamSize?: number;
}

interface SubjectSummary {
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  grade: string;
  stream: string;
  term: string;
  academicYear: string;
  totalStudents: number;
  passed: number;
  failed: number;
  pending: number;
  averagePercentage: number;
  highestMark: number;
  lowestMark: number;
  averageMark: number;
  passRate: number;
}

export const GradeManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'grades' | 'summary' | 'subjects' | 'analytics'>('grades');
  const [grades, setGrades] = useState<Grade[]>([]);
  const [gradeSummaries, setGradeSummaries] = useState<GradeSummary[]>([]);
  const [subjectSummaries, setSubjectSummaries] = useState<SubjectSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGrade, setFilterGrade] = useState<string>('all');
  const [filterStream, setFilterStream] = useState<string>('all');
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [filterTerm, setFilterTerm] = useState<string>('current');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Mock data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock grades
      const mockGrades: Grade[] = [
        {
          id: 'grade-001',
          studentId: 'student-001',
          studentName: 'John Smith',
          studentNumber: 'STU2024001',
          grade: 'Form 1',
          stream: 'A',
          subjectId: 'subject-001',
          subjectName: 'Mathematics',
          subjectCode: 'MATH',
          term: 'Term 1',
          academicYear: '2024',
          assessmentType: 'Test',
          assessmentName: 'Mid-Term Test',
          maxMarks: 100,
          obtainedMarks: 85,
          percentage: 85,
          gradeLetter: 'B',
          gradePoints: 3.0,
          credits: 5,
          status: 'Pass',
          submissionDate: '2024-01-15',
          markedDate: '2024-01-18',
          markedBy: 'Mrs. Johnson',
          markedByRole: 'Teacher',
          comments: 'Good performance, needs improvement in algebra',
          isRetake: false,
          parentNotified: true,
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-18T14:30:00Z',
        },
        {
          id: 'grade-002',
          studentId: 'student-001',
          studentName: 'John Smith',
          studentNumber: 'STU2024001',
          grade: 'Form 1',
          stream: 'A',
          subjectId: 'subject-002',
          subjectName: 'English Language',
          subjectCode: 'ENG',
          term: 'Term 1',
          academicYear: '2024',
          assessmentType: 'Assignment',
          assessmentName: 'Essay Writing',
          maxMarks: 50,
          obtainedMarks: 45,
          percentage: 90,
          gradeLetter: 'A',
          gradePoints: 4.0,
          credits: 4,
          status: 'Pass',
          submissionDate: '2024-01-12',
          markedDate: '2024-01-14',
          markedBy: 'Mr. Smith',
          markedByRole: 'Teacher',
          comments: 'Excellent essay structure and content',
          isRetake: false,
          parentNotified: true,
          createdAt: '2024-01-12T10:00:00Z',
          updatedAt: '2024-01-14T16:45:00Z',
        },
        {
          id: 'grade-003',
          studentId: 'student-002',
          studentName: 'Sarah Johnson',
          studentNumber: 'STU2024002',
          grade: 'Form 2',
          stream: 'B',
          subjectId: 'subject-001',
          subjectName: 'Mathematics',
          subjectCode: 'MATH',
          term: 'Term 1',
          academicYear: '2024',
          assessmentType: 'Exam',
          assessmentName: 'Final Exam',
          maxMarks: 150,
          obtainedMarks: 120,
          percentage: 80,
          gradeLetter: 'B',
          gradePoints: 3.0,
          credits: 5,
          status: 'Pass',
          submissionDate: '2024-01-20',
          markedDate: '2024-01-22',
          markedBy: 'Mrs. Johnson',
          markedByRole: 'Teacher',
          comments: 'Good understanding of concepts',
          isRetake: false,
          parentNotified: false,
          createdAt: '2024-01-20T10:00:00Z',
          updatedAt: '2024-01-22T11:20:00Z',
        },
        {
          id: 'grade-004',
          studentId: 'student-003',
          studentName: 'Michael Brown',
          studentNumber: 'STU2024003',
          grade: 'Form 1',
          stream: 'C',
          subjectId: 'subject-001',
          subjectName: 'Mathematics',
          subjectCode: 'MATH',
          term: 'Term 1',
          academicYear: '2024',
          assessmentType: 'Quiz',
          assessmentName: 'Weekly Quiz',
          maxMarks: 20,
          obtainedMarks: 8,
          percentage: 40,
          gradeLetter: 'E',
          gradePoints: 1.0,
          credits: 1,
          status: 'Fail',
          submissionDate: '2024-01-19',
          markedDate: '2024-01-19',
          markedBy: 'Mrs. Johnson',
          markedByRole: 'Teacher',
          comments: 'Needs significant improvement',
          isRetake: false,
          parentNotified: true,
          createdAt: '2024-01-19T10:00:00Z',
          updatedAt: '2024-01-19T14:00:00Z',
        },
      ];

      // Mock grade summaries
      const mockSummaries: GradeSummary[] = [
        {
          studentId: 'student-001',
          studentName: 'John Smith',
          studentNumber: 'STU2024001',
          grade: 'Form 1',
          stream: 'A',
          term: 'Term 1',
          academicYear: '2024',
          totalSubjects: 8,
          totalCredits: 35,
          totalGradePoints: 28.5,
          gpa: 3.43,
          averagePercentage: 87.5,
          passedSubjects: 7,
          failedSubjects: 1,
          pendingSubjects: 0,
          overallStatus: 'Good',
          classRank: 3,
          classSize: 40,
          streamRank: 1,
          streamSize: 15,
        },
        {
          studentId: 'student-002',
          studentName: 'Sarah Johnson',
          studentNumber: 'STU2024002',
          grade: 'Form 2',
          stream: 'B',
          term: 'Term 1',
          academicYear: '2024',
          totalSubjects: 8,
          totalCredits: 35,
          totalGradePoints: 30.2,
          gpa: 3.77,
          averagePercentage: 82.3,
          passedSubjects: 8,
          failedSubjects: 0,
          pendingSubjects: 0,
          overallStatus: 'Excellent',
          classRank: 1,
          classSize: 35,
          streamRank: 1,
          streamSize: 12,
        },
        {
          studentId: 'student-003',
          studentName: 'Michael Brown',
          studentNumber: 'STU2024003',
          grade: 'Form 1',
          stream: 'C',
          term: 'Term 1',
          academicYear: '2024',
          totalSubjects: 8,
          totalCredits: 35,
          totalGradePoints: 18.5,
          gpa: 2.31,
          averagePercentage: 65.8,
          passedSubjects: 5,
          failedSubjects: 3,
          pendingSubjects: 0,
          overallStatus: 'Poor',
          classRank: 38,
          classSize: 40,
          streamRank: 13,
          streamSize: 13,
        },
      ];

      // Mock subject summaries
      const mockSubjectSummaries: SubjectSummary[] = [
        {
          subjectId: 'subject-001',
          subjectName: 'Mathematics',
          subjectCode: 'MATH',
          grade: 'Form 1',
          stream: 'A',
          term: 'Term 1',
          academicYear: '2024',
          totalStudents: 40,
          passed: 35,
          failed: 5,
          pending: 0,
          averagePercentage: 78.5,
          highestMark: 95,
          lowestMark: 45,
          averageMark: 78.5,
          passRate: 87.5,
        },
        {
          subjectId: 'subject-002',
          subjectName: 'English Language',
          subjectCode: 'ENG',
          grade: 'Form 1',
          stream: 'A',
          term: 'Term 1',
          academicYear: '2024',
          totalStudents: 40,
          passed: 38,
          failed: 2,
          pending: 0,
          averagePercentage: 82.3,
          highestMark: 98,
          lowestMark: 55,
          averageMark: 82.3,
          passRate: 95.0,
        },
      ];
      
      setGrades(mockGrades);
      setGradeSummaries(mockSummaries);
      setSubjectSummaries(mockSubjectSummaries);
      setLoading(false);
    };

    loadData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pass':
        return 'text-success-600 bg-success-100';
      case 'Fail':
        return 'text-error-600 bg-error-100';
      case 'Pending':
        return 'text-warning-600 bg-warning-100';
      case 'Incomplete':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+':
      case 'A':
        return 'text-green-600 bg-green-100';
      case 'B+':
      case 'B':
        return 'text-blue-600 bg-blue-100';
      case 'C+':
      case 'C':
        return 'text-yellow-600 bg-yellow-100';
      case 'D':
        return 'text-orange-600 bg-orange-100';
      case 'E':
      case 'F':
        return 'text-red-600 bg-red-100';
      case 'P':
        return 'text-purple-600 bg-purple-100';
      case 'U':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getOverallStatusColor = (status: string) => {
    switch (status) {
      case 'Excellent':
        return 'text-green-600 bg-green-100';
      case 'Good':
        return 'text-blue-600 bg-blue-100';
      case 'Fair':
        return 'text-yellow-600 bg-yellow-100';
      case 'Poor':
      case 'Critical':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getAssessmentTypeColor = (type: string) => {
    switch (type) {
      case 'Exam':
        return 'text-purple-600 bg-purple-100';
      case 'Test':
        return 'text-blue-600 bg-blue-100';
      case 'Quiz':
        return 'text-green-600 bg-green-100';
      case 'Assignment':
        return 'text-orange-600 bg-orange-100';
      case 'Project':
        return 'text-pink-600 bg-pink-100';
      case 'Practical':
        return 'text-indigo-600 bg-indigo-100';
      case 'Homework':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredGrades = grades.filter(grade => {
    const matchesSearch = grade.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         grade.studentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         grade.subjectName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = filterGrade === 'all' || grade.grade === filterGrade;
    const matchesStream = filterStream === 'all' || grade.stream === filterStream;
    const matchesSubject = filterSubject === 'all' || grade.subjectName === filterSubject;
    const matchesTerm = filterTerm === 'all' || grade.term === filterTerm;
    const matchesStatus = filterStatus === 'all' || grade.status === filterStatus;
    return matchesSearch && matchesGrade && matchesStream && matchesSubject && matchesTerm && matchesStatus;
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
              Grade Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Track and manage student grades and academic performance
            </p>
          </div>
          <div className="flex gap-3">
            <button className="btn btn-secondary">
              <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
              Export Report
            </button>
            <button className="btn btn-primary">
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Grade
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="flex space-x-8">
          {[
            { id: 'grades', label: 'Individual Grades', icon: AcademicCapIcon },
            { id: 'summary', label: 'Student Summaries', icon: UserGroupIcon },
            { id: 'subjects', label: 'Subject Performance', icon: BookOpenIcon },
            { id: 'analytics', label: 'Analytics', icon: ChartBarIcon },
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
                  placeholder="Search grades..."
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
              <select
                value={filterStream}
                onChange={(e) => setFilterStream(e.target.value)}
                className="form-input"
              >
                <option value="all">All Streams</option>
                <option value="A">Stream A</option>
                <option value="B">Stream B</option>
                <option value="C">Stream C</option>
              </select>
              <select
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
                className="form-input"
              >
                <option value="all">All Subjects</option>
                <option value="Mathematics">Mathematics</option>
                <option value="English Language">English Language</option>
                <option value="Science">Science</option>
                <option value="History">History</option>
                <option value="Geography">Geography</option>
              </select>
              <select
                value={filterTerm}
                onChange={(e) => setFilterTerm(e.target.value)}
                className="form-input"
              >
                <option value="current">Current Term</option>
                <option value="Term 1">Term 1</option>
                <option value="Term 2">Term 2</option>
                <option value="Term 3">Term 3</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="form-input"
              >
                <option value="all">All Status</option>
                <option value="Pass">Pass</option>
                <option value="Fail">Fail</option>
                <option value="Pending">Pending</option>
                <option value="Incomplete">Incomplete</option>
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
      {activeTab === 'grades' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGrades.map((grade, index) => (
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
                      {grade.studentName}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {grade.studentNumber} • {grade.grade} - {grade.stream}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(grade.status)}`}>
                    {grade.status}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Subject</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {grade.subjectName}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Assessment</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {grade.assessmentName}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Type</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getAssessmentTypeColor(grade.assessmentType)}`}>
                      {grade.assessmentType}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Marks</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {grade.obtainedMarks}/{grade.maxMarks}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Percentage</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {grade.percentage.toFixed(1)}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Grade</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getGradeColor(grade.gradeLetter)}`}>
                      {grade.gradeLetter}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Grade Points</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {grade.gradePoints.toFixed(1)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Credits</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {grade.credits}
                    </span>
                  </div>

                  {grade.comments && (
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Comments:</span> {grade.comments}
                    </div>
                  )}

                  {grade.isRetake && (
                    <div className="flex items-center text-orange-600">
                      <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                      <span className="text-sm">Retake</span>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1">
                    {grade.parentNotified && (
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded">
                        Parent Notified
                      </span>
                    )}
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                      {grade.term}
                    </span>
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                      {grade.academicYear}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-sm text-gray-500 dark:text-gray-500">
                    Marked by {grade.markedBy}
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

      {activeTab === 'summary' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gradeSummaries.map((summary, index) => (
            <motion.div
              key={summary.studentId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card card-hover"
            >
              <div className="card-body">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {summary.studentName}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {summary.studentNumber} • {summary.grade} - {summary.stream}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${getOverallStatusColor(summary.overallStatus)}`}>
                    {summary.overallStatus}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">GPA</span>
                    <span className="text-lg font-bold text-primary-600">
                      {summary.gpa.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Average</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {summary.averagePercentage.toFixed(1)}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Total Credits</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {summary.totalCredits}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Subjects</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {summary.totalSubjects} total
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Passed</span>
                    <span className="text-sm font-medium text-green-600">
                      {summary.passedSubjects}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Failed</span>
                    <span className="text-sm font-medium text-red-600">
                      {summary.failedSubjects}
                    </span>
                  </div>

                  {summary.classRank && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Class Rank</span>
                      <span className="text-sm text-gray-500 dark:text-gray-500">
                        {summary.classRank}/{summary.classSize}
                      </span>
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full"
                        style={{ width: `${summary.averagePercentage}%` }}
                      />
                    </div>
                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-500 text-center">
                      {summary.averagePercentage.toFixed(1)}% Average
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'subjects' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjectSummaries.map((summary, index) => (
            <motion.div
              key={`${summary.subjectId}-${summary.grade}-${summary.stream}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card card-hover"
            >
              <div className="card-body">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {summary.subjectName}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {summary.subjectCode} • {summary.grade} - {summary.stream}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary-600">
                      {summary.averagePercentage.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-500">Average</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Total Students</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {summary.totalStudents}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Pass Rate</span>
                    <span className="text-sm font-medium text-green-600">
                      {summary.passRate.toFixed(1)}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Passed</span>
                    <span className="text-sm font-medium text-green-600">
                      {summary.passed}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Failed</span>
                    <span className="text-sm font-medium text-red-600">
                      {summary.failed}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Highest</span>
                    <span className="text-sm font-medium text-green-600">
                      {summary.highestMark}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Lowest</span>
                    <span className="text-sm font-medium text-red-600">
                      {summary.lowestMark}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Average Mark</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {summary.averageMark.toFixed(1)}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full"
                      style={{ width: `${summary.passRate}%` }}
                    />
                  </div>
                  <div className="mt-1 text-xs text-gray-500 dark:text-gray-500 text-center">
                    {summary.passRate.toFixed(1)}% Pass Rate
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <div className="card-body">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Grade Distribution
              </h3>
              <div className="space-y-3">
                {[
                  { grade: 'A+', count: 15, color: 'bg-green-500' },
                  { grade: 'A', count: 25, color: 'bg-green-400' },
                  { grade: 'B+', count: 30, color: 'bg-blue-400' },
                  { grade: 'B', count: 35, color: 'bg-blue-300' },
                  { grade: 'C+', count: 25, color: 'bg-yellow-400' },
                  { grade: 'C', count: 20, color: 'bg-yellow-300' },
                  { grade: 'D', count: 15, color: 'bg-orange-400' },
                  { grade: 'E', count: 10, color: 'bg-red-400' },
                  { grade: 'F', count: 5, color: 'bg-red-500' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 ${item.color} rounded-full flex items-center justify-center text-white text-xs font-medium`}>
                        {item.grade}
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {item.grade} Grade
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(item.count / 180) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-500 w-8">
                        {item.count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Performance Analytics
              </h3>
              <div className="space-y-4">
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-green-800 dark:text-green-200">
                      Overall Pass Rate
                    </span>
                    <span className="text-lg font-bold text-green-800 dark:text-green-200">
                      87.5%
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                      Average GPA
                    </span>
                    <span className="text-lg font-bold text-blue-800 dark:text-blue-200">
                      3.4
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                      Students Needing Support
                    </span>
                    <span className="text-lg font-bold text-yellow-800 dark:text-yellow-200">
                      23
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-red-800 dark:text-red-200">
                      Critical Cases
                    </span>
                    <span className="text-lg font-bold text-red-800 dark:text-red-200">
                      5
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
