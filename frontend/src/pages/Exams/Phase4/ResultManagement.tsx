import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  DocumentArrowDownIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CalendarIcon,
  UserIcon,
  AcademicCapIcon,
  EyeIcon,
  PrinterIcon,
  EnvelopeIcon,
  BellIcon,
  ExclamationTriangleIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  ClockIcon,
  TrophyIcon,
  BookOpenIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';

// Types
interface StudentResult {
  id: string;
  studentId: string;
  studentName: string;
  studentNumber: string;
  grade: string;
  stream: string;
  academicYear: string;
  term: string;
  subjects: SubjectResult[];
  totalMarks: number;
  maxTotalMarks: number;
  averagePercentage: number;
  overallGrade: string;
  overallRank: number;
  classRank: number;
  streamRank: number;
  status: 'Pass' | 'Fail' | 'Promoted' | 'Retained' | 'Pending';
  remarks: string;
  published: boolean;
  publishedDate?: string;
  parentNotified: boolean;
  parentNotifiedDate?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface SubjectResult {
  subject: string;
  marksObtained: number;
  maxMarks: number;
  percentage: number;
  grade: string;
  status: 'Pass' | 'Fail' | 'Absent';
  rank?: number;
  remarks?: string;
}

interface ResultSheet {
  id: string;
  title: string;
  grade: string;
  stream?: string;
  academicYear: string;
  term: string;
  examinationType: string;
  subjects: string[];
  totalStudents: number;
  results: StudentResult[];
  statistics: ResultStatistics;
  generatedDate: string;
  generatedBy: string;
  status: 'Draft' | 'Pending Review' | 'Approved' | 'Published' | 'Archived';
  publishedDate?: string;
  fileUrl?: string;
  fileName?: string;
  createdAt: string;
  updatedAt: string;
}

interface ResultStatistics {
  totalStudents: number;
  attendedStudents: number;
  passedStudents: number;
  failedStudents: number;
  promotedStudents: number;
  retainedStudents: number;
  averagePercentage: number;
  highestPercentage: number;
  lowestPercentage: number;
  passPercentage: number;
  promotionRate: number;
  gradeDistribution: {
    'A+': number;
    'A': number;
    'B': number;
    'C': number;
    'D': number;
    'E': number;
    'F': number;
  };
  subjectAverages: Record<string, number>;
  topPerformers: Array<{
    studentName: string;
    studentNumber: string;
    percentage: number;
    rank: number;
  }>;
}

interface ResultTemplate {
  id: string;
  name: string;
  description: string;
  grade: string;
  stream?: string;
  subjects: string[];
  gradingScale: GradingScale;
  passingCriteria: PassingCriteria;
  templateType: 'Termly' | 'Annual' | 'Mock' | 'External';
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface GradingScale {
  'A+': { min: number; max: number; points: number };
  'A': { min: number; max: number; points: number };
  'B': { min: number; max: number; points: number };
  'C': { min: number; max: number; points: number };
  'D': { min: number; max: number; points: number };
  'E': { min: number; max: number; points: number };
  'F': { min: number; max: number; points: number };
}

interface PassingCriteria {
  minimumPercentage: number;
  minimumSubjects: number;
  compulsorySubjects: string[];
  maxAllowedFails: number;
}

export const ResultManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'results' | 'sheets' | 'templates' | 'analytics'>('results');
  const [studentResults, setStudentResults] = useState<StudentResult[]>([]);
  const [resultSheets, setResultSheets] = useState<ResultSheet[]>([]);
  const [resultTemplates, setResultTemplates] = useState<ResultTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGrade, setFilterGrade] = useState<string>('all');
  const [filterStream, setFilterStream] = useState<string>('all');
  const [filterTerm, setFilterTerm] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSheetModal, setShowSheetModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedResult, setSelectedResult] = useState<StudentResult | null>(null);
  const [formData, setFormData] = useState<Partial<StudentResult | ResultSheet | ResultTemplate>>({});

  // Mock data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock student results
      const mockStudentResults: StudentResult[] = [
        {
          id: 'res-001',
          studentId: 'student-001',
          studentName: 'John Smith',
          studentNumber: 'STU2024001',
          grade: 'Form 1',
          stream: 'A',
          academicYear: '2024',
          term: 'Term 1',
          subjects: [
            { subject: 'Mathematics', marksObtained: 85, maxMarks: 100, percentage: 85, grade: 'A', status: 'Pass', rank: 3 },
            { subject: 'English', marksObtained: 78, maxMarks: 100, percentage: 78, grade: 'B', status: 'Pass', rank: 5 },
            { subject: 'Science', marksObtained: 92, maxMarks: 100, percentage: 92, grade: 'A+', status: 'Pass', rank: 1 },
            { subject: 'History', marksObtained: 75, maxMarks: 100, percentage: 75, grade: 'B', status: 'Pass', rank: 4 },
            { subject: 'Geography', marksObtained: 88, maxMarks: 100, percentage: 88, grade: 'A', status: 'Pass', rank: 2 },
          ],
          totalMarks: 418,
          maxTotalMarks: 500,
          averagePercentage: 83.6,
          overallGrade: 'A',
          overallRank: 2,
          classRank: 2,
          streamRank: 1,
          status: 'Pass',
          remarks: 'Excellent performance across all subjects',
          published: true,
          publishedDate: '2024-02-20',
          parentNotified: true,
          parentNotifiedDate: '2024-02-21',
          createdBy: 'Academic Office',
          createdAt: '2024-02-18T10:00:00Z',
          updatedAt: '2024-02-20T14:00:00Z',
        },
        {
          id: 'res-002',
          studentId: 'student-002',
          studentName: 'Sarah Johnson',
          studentNumber: 'STU2024002',
          grade: 'Form 1',
          stream: 'A',
          academicYear: '2024',
          term: 'Term 1',
          subjects: [
            { subject: 'Mathematics', marksObtained: 95, maxMarks: 100, percentage: 95, grade: 'A+', status: 'Pass', rank: 1 },
            { subject: 'English', marksObtained: 88, maxMarks: 100, percentage: 88, grade: 'A', status: 'Pass', rank: 2 },
            { subject: 'Science', marksObtained: 90, maxMarks: 100, percentage: 90, grade: 'A+', status: 'Pass', rank: 2 },
            { subject: 'History', marksObtained: 82, maxMarks: 100, percentage: 82, grade: 'B', status: 'Pass', rank: 2 },
            { subject: 'Geography', marksObtained: 85, maxMarks: 100, percentage: 85, grade: 'A', status: 'Pass', rank: 3 },
          ],
          totalMarks: 440,
          maxTotalMarks: 500,
          averagePercentage: 88.0,
          overallGrade: 'A+',
          overallRank: 1,
          classRank: 1,
          streamRank: 1,
          status: 'Pass',
          remarks: 'Outstanding academic performance',
          published: true,
          publishedDate: '2024-02-20',
          parentNotified: true,
          parentNotifiedDate: '2024-02-21',
          createdBy: 'Academic Office',
          createdAt: '2024-02-18T10:00:00Z',
          updatedAt: '2024-02-20T14:00:00Z',
        },
        {
          id: 'res-003',
          studentId: 'student-003',
          studentName: 'Michael Brown',
          studentNumber: 'STU2024003',
          grade: 'Form 2',
          stream: 'B',
          academicYear: '2024',
          term: 'Term 1',
          subjects: [
            { subject: 'Mathematics', marksObtained: 45, maxMarks: 100, percentage: 45, grade: 'E', status: 'Fail', rank: 25 },
            { subject: 'English', marksObtained: 52, maxMarks: 100, percentage: 52, grade: 'D', status: 'Pass', rank: 20 },
            { subject: 'Science', marksObtained: 48, maxMarks: 100, percentage: 48, grade: 'E', status: 'Fail', rank: 22 },
            { subject: 'History', marksObtained: 58, maxMarks: 100, percentage: 58, grade: 'D', status: 'Pass', rank: 18 },
            { subject: 'Geography', marksObtained: 50, maxMarks: 100, percentage: 50, grade: 'D', status: 'Pass', rank: 21 },
          ],
          totalMarks: 253,
          maxTotalMarks: 500,
          averagePercentage: 50.6,
          overallGrade: 'D',
          overallRank: 28,
          classRank: 28,
          streamRank: 12,
          status: 'Retained',
          remarks: 'Needs significant improvement in core subjects',
          published: true,
          publishedDate: '2024-02-20',
          parentNotified: true,
          parentNotifiedDate: '2024-02-21',
          createdBy: 'Academic Office',
          createdAt: '2024-02-18T10:00:00Z',
          updatedAt: '2024-02-20T14:00:00Z',
        },
        {
          id: 'res-004',
          studentId: 'student-004',
          studentName: 'Emily Davis',
          studentNumber: 'STU2024004',
          grade: 'Form 3',
          stream: 'C',
          academicYear: '2024',
          term: 'Term 1',
          subjects: [
            { subject: 'Physics', marksObtained: 88, maxMarks: 100, percentage: 88, grade: 'A', status: 'Pass', rank: 3 },
            { subject: 'Chemistry', marksObtained: 92, maxMarks: 100, percentage: 92, grade: 'A+', status: 'Pass', rank: 2 },
            { subject: 'Biology', marksObtained: 85, maxMarks: 100, percentage: 85, grade: 'A', status: 'Pass', rank: 4 },
            { subject: 'Mathematics', marksObtained: 78, maxMarks: 100, percentage: 78, grade: 'B', status: 'Pass', rank: 6 },
            { subject: 'English', marksObtained: 80, maxMarks: 100, percentage: 80, grade: 'B', status: 'Pass', rank: 5 },
          ],
          totalMarks: 423,
          maxTotalMarks: 500,
          averagePercentage: 84.6,
          overallGrade: 'A',
          overallRank: 4,
          classRank: 4,
          streamRank: 2,
          status: 'Pass',
          remarks: 'Strong performance in science subjects',
          published: true,
          publishedDate: '2024-02-20',
          parentNotified: true,
          parentNotifiedDate: '2024-02-21',
          createdBy: 'Academic Office',
          createdAt: '2024-02-18T10:00:00Z',
          updatedAt: '2024-02-20T14:00:00Z',
        },
      ];

      // Mock result sheets
      const mockResultSheets: ResultSheet[] = [
        {
          id: 'sheet-001',
          title: 'Form 1 Term 1 Results - Stream A',
          grade: 'Form 1',
          stream: 'A',
          academicYear: '2024',
          term: 'Term 1',
          examinationType: 'Termly Examination',
          subjects: ['Mathematics', 'English', 'Science', 'History', 'Geography'],
          totalStudents: 30,
          results: mockStudentResults.filter(r => r.grade === 'Form 1' && r.stream === 'A'),
          statistics: {
            totalStudents: 30,
            attendedStudents: 30,
            passedStudents: 28,
            failedStudents: 2,
            promotedStudents: 28,
            retainedStudents: 2,
            averagePercentage: 76.5,
            highestPercentage: 88.0,
            lowestPercentage: 45.2,
            passPercentage: 93.3,
            promotionRate: 93.3,
            gradeDistribution: {
              'A+': 3,
              'A': 8,
              'B': 10,
              'C': 5,
              'D': 2,
              'E': 2,
              'F': 0,
            },
            subjectAverages: {
              'Mathematics': 72.3,
              'English': 75.8,
              'Science': 78.2,
              'History': 74.5,
              'Geography': 76.1,
            },
            topPerformers: [
              { studentName: 'Sarah Johnson', studentNumber: 'STU2024002', percentage: 88.0, rank: 1 },
              { studentName: 'John Smith', studentNumber: 'STU2024001', percentage: 83.6, rank: 2 },
              { studentName: 'Emma Wilson', studentNumber: 'STU2024005', percentage: 81.2, rank: 3 },
            ],
          },
          generatedDate: '2024-02-20',
          generatedBy: 'Academic Office',
          status: 'Published',
          publishedDate: '2024-02-20',
          fileUrl: '/results/form1_term1_streamA.pdf',
          fileName: 'form1_term1_streamA.pdf',
          createdAt: '2024-02-18T10:00:00Z',
          updatedAt: '2024-02-20T14:00:00Z',
        },
        {
          id: 'sheet-002',
          title: 'Form 2 Term 1 Results - Stream B',
          grade: 'Form 2',
          stream: 'B',
          academicYear: '2024',
          term: 'Term 1',
          examinationType: 'Termly Examination',
          subjects: ['Mathematics', 'English', 'Science', 'History', 'Geography'],
          totalStudents: 28,
          results: mockStudentResults.filter(r => r.grade === 'Form 2' && r.stream === 'B'),
          statistics: {
            totalStudents: 28,
            attendedStudents: 28,
            passedStudents: 22,
            failedStudents: 6,
            promotedStudents: 22,
            retainedStudents: 6,
            averagePercentage: 68.4,
            highestPercentage: 82.5,
            lowestPercentage: 42.1,
            passPercentage: 78.6,
            promotionRate: 78.6,
            gradeDistribution: {
              'A+': 2,
              'A': 4,
              'B': 8,
              'C': 6,
              'D': 4,
              'E': 3,
              'F': 1,
            },
            subjectAverages: {
              'Mathematics': 65.2,
              'English': 70.1,
              'Science': 68.8,
              'History': 69.5,
              'Geography': 68.4,
            },
            topPerformers: [
              { studentName: 'David Lee', studentNumber: 'STU2024010', percentage: 82.5, rank: 1 },
              { studentName: 'Sophia Martin', studentNumber: 'STU2024011', percentage: 79.8, rank: 2 },
              { studentName: 'James Brown', studentNumber: 'STU2024012', percentage: 77.2, rank: 3 },
            ],
          },
          generatedDate: '2024-02-20',
          generatedBy: 'Academic Office',
          status: 'Published',
          publishedDate: '2024-02-20',
          fileUrl: '/results/form2_term1_streamB.pdf',
          fileName: 'form2_term1_streamB.pdf',
          createdAt: '2024-02-18T10:00:00Z',
          updatedAt: '2024-02-20T14:00:00Z',
        },
      ];

      // Mock result templates
      const mockTemplates: ResultTemplate[] = [
        {
          id: 'tpl-001',
          name: 'Form 1 Termly Result Template',
          description: 'Standard template for Form 1 termly examinations',
          grade: 'Form 1',
          subjects: ['Mathematics', 'English', 'Science', 'History', 'Geography'],
          gradingScale: {
            'A+': { min: 90, max: 100, points: 12 },
            'A': { min: 80, max: 89, points: 11 },
            'B': { min: 70, max: 79, points: 10 },
            'C': { min: 60, max: 69, points: 9 },
            'D': { min: 50, max: 59, points: 8 },
            'E': { min: 40, max: 49, points: 7 },
            'F': { min: 0, max: 39, points: 6 },
          },
          passingCriteria: {
            minimumPercentage: 50,
            minimumSubjects: 4,
            compulsorySubjects: ['Mathematics', 'English'],
            maxAllowedFails: 1,
          },
          templateType: 'Termly',
          isActive: true,
          createdBy: 'Academic Office',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
        {
          id: 'tpl-002',
          name: 'O-Level Mock Exam Template',
          description: 'Template for ZIMSEC O-Level mock examinations',
          grade: 'Form 4',
          subjects: ['Mathematics', 'English', 'Science', 'History', 'Geography', 'Physics', 'Chemistry', 'Biology'],
          gradingScale: {
            'A+': { min: 90, max: 100, points: 12 },
            'A': { min: 80, max: 89, points: 11 },
            'B': { min: 70, max: 79, points: 10 },
            'C': { min: 60, max: 69, points: 9 },
            'D': { min: 50, max: 59, points: 8 },
            'E': { min: 40, max: 49, points: 7 },
            'F': { min: 0, max: 39, points: 6 },
          },
          passingCriteria: {
            minimumPercentage: 50,
            minimumSubjects: 5,
            compulsorySubjects: ['Mathematics', 'English', 'Science'],
            maxAllowedFails: 2,
          },
          templateType: 'Mock',
          isActive: true,
          createdBy: 'Academic Office',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      ];
      
      setStudentResults(mockStudentResults);
      setResultSheets(mockResultSheets);
      setResultTemplates(mockTemplates);
      setLoading(false);
    };

    loadData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pass':
      case 'Promoted':
      case 'Published':
      case 'Approved':
        return 'text-success-600 bg-success-100';
      case 'Fail':
      case 'Retained':
      case 'Rejected':
      case 'Archived':
        return 'text-red-600 bg-red-100';
      case 'Pending':
      case 'Draft':
      case 'Pending Review':
        return 'text-warning-600 bg-warning-100';
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

  const filteredResults = studentResults.filter(result => {
    const matchesSearch = result.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         result.studentNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = filterGrade === 'all' || result.grade === filterGrade;
    const matchesStream = filterStream === 'all' || result.stream === filterStream;
    const matchesTerm = filterTerm === 'all' || result.term === filterTerm;
    const matchesStatus = filterStatus === 'all' || result.status === filterStatus;
    return matchesSearch && matchesGrade && matchesStream && matchesTerm && matchesStatus;
  });

  const filteredSheets = resultSheets.filter(sheet => {
    const matchesSearch = sheet.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = filterGrade === 'all' || sheet.grade === filterGrade;
    const matchesStream = filterStream === 'all' || sheet.stream === filterStream;
    const matchesStatus = filterStatus === 'all' || sheet.status === filterStatus;
    return matchesSearch && matchesGrade && matchesStream && matchesStatus;
  });

  const handleCreateResult = () => {
    // In real app, this would call API
    const newResult: StudentResult = {
      id: `res-${Date.now()}`,
      studentId: formData.studentId || 'student-new',
      studentName: formData.studentName || 'New Student',
      studentNumber: formData.studentNumber || 'STU000000',
      grade: formData.grade || 'Form 1',
      stream: formData.stream || 'A',
      academicYear: formData.academicYear || '2024',
      term: formData.term || 'Term 1',
      subjects: formData.subjects as SubjectResult[] || [],
      totalMarks: formData.totalMarks || 0,
      maxTotalMarks: formData.maxTotalMarks || 500,
      averagePercentage: formData.averagePercentage || 0,
      overallGrade: formData.overallGrade || 'F',
      overallRank: 0,
      classRank: 0,
      streamRank: 0,
      status: formData.status as StudentResult['status'] || 'Pending',
      remarks: formData.remarks || '',
      published: false,
      parentNotified: false,
      createdBy: 'Current User',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setStudentResults([...studentResults, newResult]);
    setShowCreateModal(false);
    setFormData({});
  };

  const handleCreateSheet = () => {
    // In real app, this would call API
    const newSheet: ResultSheet = {
      id: `sheet-${Date.now()}`,
      title: formData.title || 'New Result Sheet',
      grade: formData.grade || 'Form 1',
      stream: formData.stream,
      academicYear: formData.academicYear || '2024',
      term: formData.term || 'Term 1',
      examinationType: formData.examinationType || 'Termly Examination',
      subjects: formData.subjects as string[] || [],
      totalStudents: formData.totalStudents || 0,
      results: [],
      statistics: {
        totalStudents: 0,
        attendedStudents: 0,
        passedStudents: 0,
        failedStudents: 0,
        promotedStudents: 0,
        retainedStudents: 0,
        averagePercentage: 0,
        highestPercentage: 0,
        lowestPercentage: 0,
        passPercentage: 0,
        promotionRate: 0,
        gradeDistribution: {
          'A+': 0,
          'A': 0,
          'B': 0,
          'C': 0,
          'D': 0,
          'E': 0,
          'F': 0,
        },
        subjectAverages: {},
        topPerformers: [],
      },
      generatedDate: new Date().toISOString().split('T')[0],
      generatedBy: 'Current User',
      status: 'Draft',
      createdBy: 'Current User',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setResultSheets([...resultSheets, newSheet]);
    setShowSheetModal(false);
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
              Result Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage student results, generate result sheets, and track academic performance
            </p>
          </div>
          <div className="flex gap-3">
            <button className="btn btn-secondary">
              <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
              Export Results
            </button>
            {activeTab === 'results' && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn btn-primary"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Add Result
              </button>
            )}
            {activeTab === 'sheets' && (
              <button
                onClick={() => setShowSheetModal(true)}
                className="btn btn-primary"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Generate Sheet
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="flex space-x-8">
          {[
            { id: 'results', label: 'Student Results', icon: UserIcon },
            { id: 'sheets', label: 'Result Sheets', icon: DocumentArrowDownIcon },
            { id: 'templates', label: 'Templates', icon: BookOpenIcon },
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
                  placeholder="Search results..."
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
              {activeTab === 'results' && (
                <select
                  value={filterTerm}
                  onChange={(e) => setFilterTerm(e.target.value)}
                  className="form-input"
                >
                  <option value="all">All Terms</option>
                  <option value="Term 1">Term 1</option>
                  <option value="Term 2">Term 2</option>
                  <option value="Term 3">Term 3</option>
                </select>
              )}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="form-input"
              >
                <option value="all">All Status</option>
                <option value="Pass">Pass</option>
                <option value="Fail">Fail</option>
                <option value="Promoted">Promoted</option>
                <option value="Retained">Retained</option>
                <option value="Pending">Pending</option>
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
                <option value="Approved">Approved</option>
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
                    <span className="text-sm text-gray-600 dark:text-gray-400">Total Marks</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {result.totalMarks}/{result.maxTotalMarks}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Average %</span>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-500">
                      {result.averagePercentage.toFixed(1)}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Grade</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getGradeColor(result.overallGrade)}`}>
                      {result.overallGrade}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Class Rank</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      #{result.classRank}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Stream Rank</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      #{result.streamRank}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Subject Performance:</div>
                    {result.subjects.slice(0, 3).map((subject, i) => (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-400">{subject.subject}</span>
                        <div className="flex items-center gap-1">
                          <span className="text-gray-500 dark:text-gray-500">
                            {subject.marksObtained}/{subject.maxMarks}
                          </span>
                          <span className={`text-xs px-1 py-0.5 rounded ${getGradeColor(subject.grade)}`}>
                            {subject.grade}
                          </span>
                        </div>
                      </div>
                    ))}
                    {result.subjects.length > 3 && (
                      <div className="text-xs text-gray-500 dark:text-gray-500">
                        +{result.subjects.length - 3} more subjects
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {result.published && (
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded">
                        Published
                      </span>
                    )}
                    {result.parentNotified && (
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded">
                        Parent Notified
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
                    {result.term} • {result.academicYear}
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setSelectedResult(result)}
                      className="text-blue-600 hover:text-blue-800"
                    >
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

      {activeTab === 'sheets' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSheets.map((sheet, index) => (
            <motion.div
              key={sheet.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card card-hover"
            >
              <div className="card-body">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                      {sheet.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {sheet.grade} {sheet.stream && `- ${sheet.stream}`} • {sheet.term}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(sheet.status)}`}>
                    {sheet.status}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Total Students</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {sheet.totalStudents}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Pass Rate</span>
                    <span className="text-sm font-medium text-green-600">
                      {sheet.statistics.passPercentage.toFixed(1)}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Average %</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {sheet.statistics.averagePercentage.toFixed(1)}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Highest</span>
                    <span className="text-sm font-medium text-green-600">
                      {sheet.statistics.highestPercentage.toFixed(1)}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Lowest</span>
                    <span className="text-sm font-medium text-red-600">
                      {sheet.statistics.lowestPercentage.toFixed(1)}%
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Grade Distribution:</div>
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(sheet.statistics.gradeDistribution).map(([grade, count]) => (
                        <span key={grade} className={`text-xs px-2 py-1 rounded-full ${getGradeColor(grade)}`}>
                          {grade}: {count}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Top Performers:</div>
                    {sheet.statistics.topPerformers.slice(0, 2).map((performer, i) => (
                      <div key={i} className="text-xs text-gray-500 dark:text-gray-500">
                        {i + 1}. {performer.studentName} ({performer.percentage.toFixed(1)}%)
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {sheet.fileUrl && (
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded">
                        File Available
                      </span>
                    )}
                    {sheet.publishedDate && (
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded">
                        Published
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-sm text-gray-500 dark:text-gray-500">
                    Generated {new Date(sheet.generatedDate).toLocaleDateString()}
                  </div>
                  <div className="flex gap-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      <EyeIcon className="w-4 h-4" />
                    </button>
                    <button className="text-blue-600 hover:text-blue-800">
                      <ArrowDownTrayIcon className="w-4 h-4" />
                    </button>
                    <button className="text-blue-600 hover:text-blue-800">
                      <PrinterIcon className="w-4 h-4" />
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

      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resultTemplates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card card-hover"
            >
              <div className="card-body">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {template.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {template.grade} • {template.templateType}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${template.isActive ? 'text-success-600 bg-success-100' : 'text-gray-600 bg-gray-100'}`}>
                    {template.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {template.description}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Subjects</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {template.subjects.length}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Subjects:</div>
                    <div className="flex flex-wrap gap-1">
                      {template.subjects.slice(0, 3).map((subject, i) => (
                        <span key={i} className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded">
                          {subject}
                        </span>
                      ))}
                      {template.subjects.length > 3 && (
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                          +{template.subjects.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Passing Criteria:</div>
                    <div className="text-xs text-gray-500 dark:text-gray-500">
                      • Min {template.passingCriteria.minimumPercentage}% overall
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-500">
                      • Pass {template.passingCriteria.minimumSubjects} subjects minimum
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-500">
                      • Max {template.passingCriteria.maxAllowedFails} failures allowed
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Grading Scale:</div>
                    <div className="grid grid-cols-4 gap-1 text-xs">
                      {Object.entries(template.gradingScale).map(([grade, scale]) => (
                        <div key={grade} className={`text-center px-1 py-0.5 rounded ${getGradeColor(grade)}`}>
                          {grade}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-sm text-gray-500 dark:text-gray-500">
                    Created by {template.createdBy}
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

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
          >
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Results</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {studentResults.length}
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
                  <p className="text-sm text-gray-600 dark:text-gray-400">Pass Rate</p>
                  <p className="text-2xl font-bold text-green-600">
                    {((studentResults.filter(r => r.status === 'Pass' || r.status === 'Promoted').length / studentResults.length) * 100).toFixed(1)}%
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
                  <p className="text-sm text-gray-600 dark:text-gray-400">Average %</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {(studentResults.reduce((sum, r) => sum + r.averagePercentage, 0) / studentResults.length).toFixed(1)}%
                  </p>
                </div>
                <ChartBarIcon className="w-8 h-8 text-purple-600" />
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
                  <p className="text-sm text-gray-600 dark:text-gray-400">Published</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {studentResults.filter(r => r.published).length}
                  </p>
                </div>
                <BellIcon className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Detailed Result Modal */}
      {selectedResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedResult.studentName} - Result Details
                </h2>
                <button
                  onClick={() => setSelectedResult(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XCircleIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Student Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Student Number:</span>
                      <span className="text-gray-900 dark:text-white">{selectedResult.studentNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Grade:</span>
                      <span className="text-gray-900 dark:text-white">{selectedResult.grade}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Stream:</span>
                      <span className="text-gray-900 dark:text-white">{selectedResult.stream}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Academic Year:</span>
                      <span className="text-gray-900 dark:text-white">{selectedResult.academicYear}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Term:</span>
                      <span className="text-gray-900 dark:text-white">{selectedResult.term}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Performance Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Total Marks:</span>
                      <span className="text-gray-900 dark:text-white font-bold">
                        {selectedResult.totalMarks}/{selectedResult.maxTotalMarks}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Average %:</span>
                      <span className="text-gray-900 dark:text-white font-bold">
                        {selectedResult.averagePercentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Overall Grade:</span>
                      <span className={`px-2 py-1 rounded-full ${getGradeColor(selectedResult.overallGrade)}`}>
                        {selectedResult.overallGrade}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Class Rank:</span>
                      <span className="text-gray-900 dark:text-white">#{selectedResult.classRank}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Stream Rank:</span>
                      <span className="text-gray-900 dark:text-white">#{selectedResult.streamRank}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Status:</span>
                      <span className={`px-2 py-1 rounded-full ${getStatusColor(selectedResult.status)}`}>
                        {selectedResult.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Subject-wise Performance</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Subject
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Marks
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Percentage
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Grade
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Rank
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                      {selectedResult.subjects.map((subject, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {subject.subject}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {subject.marksObtained}/{subject.maxMarks}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {subject.percentage.toFixed(1)}%
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`text-xs px-2 py-1 rounded-full ${getGradeColor(subject.grade)}`}>
                              {subject.grade}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(subject.status)}`}>
                              {subject.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {subject.rank ? `#${subject.rank}` : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {selectedResult.remarks && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Remarks</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {selectedResult.remarks}
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setSelectedResult(null)}
                  className="btn btn-secondary"
                >
                  Close
                </button>
                <button className="btn btn-primary">
                  <PrinterIcon className="w-4 h-4 mr-2" />
                  Print Result
                </button>
                <button className="btn btn-primary">
                  <EnvelopeIcon className="w-4 h-4 mr-2" />
                  Email to Parent
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Add Result Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full"
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Add Student Result
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
                    <option value="student-001">John Smith (STU2024001)</option>
                    <option value="student-002">Sarah Johnson (STU2024002)</option>
                    <option value="student-003">Michael Brown (STU2024003)</option>
                    <option value="student-004">Emily Davis (STU2024004)</option>
                  </select>
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
                      onChange={(e) => setFormData({ ...formData, stream: e.target.value })}
                      className="form-input"
                    >
                      <option value="A">Stream A</option>
                      <option value="B">Stream B</option>
                      <option value="C">Stream C</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Academic Year
                    </label>
                    <input
                      type="text"
                      value={formData.academicYear || ''}
                      onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                      className="form-input"
                      placeholder="2024"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Term
                    </label>
                    <select
                      value={formData.term || ''}
                      onChange={(e) => setFormData({ ...formData, term: e.target.value })}
                      className="form-input"
                    >
                      <option value="Term 1">Term 1</option>
                      <option value="Term 2">Term 2</option>
                      <option value="Term 3">Term 3</option>
                    </select>
                  </div>
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
                  onClick={() => setShowCreateModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateResult}
                  className="btn btn-primary"
                >
                  Add Result
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Generate Result Sheet Modal */}
      {showSheetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full"
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Generate Result Sheet
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Sheet Title
                  </label>
                  <input
                    type="text"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="form-input"
                    placeholder="Result sheet title..."
                  />
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
                      Academic Year
                    </label>
                    <input
                      type="text"
                      value={formData.academicYear || ''}
                      onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                      className="form-input"
                      placeholder="2024"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Term
                    </label>
                    <select
                      value={formData.term || ''}
                      onChange={(e) => setFormData({ ...formData, term: e.target.value })}
                      className="form-input"
                    >
                      <option value="Term 1">Term 1</option>
                      <option value="Term 2">Term 2</option>
                      <option value="Term 3">Term 3</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Examination Type
                  </label>
                  <input
                    type="text"
                    value={formData.examinationType || ''}
                    onChange={(e) => setFormData({ ...formData, examinationType: e.target.value })}
                    className="form-input"
                    placeholder="e.g., Termly Examination"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Subjects (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.subjects?.join(', ') || ''}
                    onChange={(e) => setFormData({ ...formData, subjects: e.target.value.split(',').map(s => s.trim()) })}
                    className="form-input"
                    placeholder="Mathematics, English, Science, History, Geography"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowSheetModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateSheet}
                  className="btn btn-primary"
                >
                  Generate Sheet
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
