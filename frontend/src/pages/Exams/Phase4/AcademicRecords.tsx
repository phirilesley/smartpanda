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
  EnvelopeIcon,
  FolderIcon,
  DocumentTextIcon,
  AwardIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  BriefcaseIcon,
} from '@heroicons/react/24/outline';

// Types
interface AcademicRecord {
  id: string;
  studentId: string;
  studentName: string;
  studentNumber: string;
  grade: string;
  stream: string;
  academicYear: string;
  term: string;
  recordType: 'Transcript' | 'Report Card' | 'Certificate' | 'Achievement' | 'Discipline' | 'Attendance' | 'Medical' | 'Other';
  title: string;
  description: string;
  category: 'Academic' | 'Achievement' | 'Disciplinary' | 'Medical' | 'Administrative';
  status: 'Active' | 'Archived' | 'Deleted';
  issueDate: string;
  expiryDate?: string;
  issuedBy: string;
  verified: boolean;
  verifiedBy?: string;
  verifiedDate?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  fileFormat?: string;
  tags: string[];
  isPublic: boolean;
  shareWithParents: boolean;
  shareWithStudents: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AcademicProfile {
  id: string;
  studentId: string;
  studentName: string;
  studentNumber: string;
  grade: string;
  stream: string;
  academicYear: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  nationality: string;
  admissionDate: string;
  admissionNumber: string;
  previousSchool?: string;
  guardianName: string;
  guardianContact: string;
  guardianEmail: string;
  emergencyContact: string;
  medicalConditions: string[];
  allergies: string[];
  specialNeeds?: string;
  learningStyle?: string;
  careerGoals?: string;
  academicSummary: {
    cumulativeAverage: number;
    totalCredits: number;
    rank: number;
    classRank: number;
    streamRank: number;
    attendanceRate: number;
    disciplinaryRecord: 'Clean' | 'Minor' | 'Major';
    achievements: number;
  };
  subjectPerformance: Array<{
    subject: string;
    average: number;
    grade: string;
    credits: number;
    status: 'Pass' | 'Fail' | 'Pending';
  }>;
  termlyPerformance: Array<{
    term: string;
    year: string;
    average: number;
    grade: string;
    rank: number;
    subjects: Array<{
      name: string;
      marks: number;
      grade: string;
    }>;
  }>;
  achievements: Array<{
    title: string;
    description: string;
    date: string;
    category: string;
    level: 'School' | 'District' | 'National' | 'International';
    certificateUrl?: string;
  }>;
  disciplinaryRecords: Array<{
    date: string;
    incident: string;
    category: string;
    severity: 'Minor' | 'Major' | 'Severe';
    action: string;
    resolved: boolean;
  }>;
  lastUpdated: string;
  updatedBy: string;
}

interface AcademicAnalytics {
  id: string;
  title: string;
  description: string;
  reportType: 'Performance Analysis' | 'Attendance Analysis' | 'Discipline Analysis' | 'Grade Distribution' | 'Subject Performance' | 'Student Progress';
  period: string;
  startDate: string;
  endDate: string;
  generatedDate: string;
  generatedBy: string;
  data: {
    totalStudents: number;
    averagePerformance: number;
    attendanceRate: number;
    disciplinaryCases: number;
    topPerformers: Array<{
      studentName: string;
      percentage: number;
      rank: number;
    }>;
    subjectAnalytics: Record<string, {
      average: number;
      highest: number;
      lowest: number;
      passRate: number;
    }>;
    gradeDistribution: Record<string, number>;
    trends: {
      performance: 'Improving' | 'Declining' | 'Stable';
      attendance: 'Improving' | 'Declining' | 'Stable';
      discipline: 'Improving' | 'Declining' | 'Stable';
    };
  };
  fileUrl?: string;
  fileName?: string;
  createdAt: string;
}

interface TranscriptRequest {
  id: string;
  studentId: string;
  studentName: string;
  studentNumber: string;
  grade: string;
  stream: string;
  requestType: 'Official' | 'Unofficial' | 'Provisional';
  purpose: 'University Application' | 'Employment' | 'Transfer' | 'Personal' | 'Other';
  requestedBy: string;
  requesterType: 'Student' | 'Parent' | 'Guardian' | 'Institution' | 'Other';
  requesterContact: string;
  status: 'Pending' | 'Processing' | 'Ready' | 'Completed' | 'Rejected';
  requestedDate: string;
  completedDate?: string;
  deliveryMethod: 'Pickup' | 'Email' | 'Post' | 'Courier';
  fee: number;
  feePaid: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export const AcademicRecords: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'records' | 'profiles' | 'analytics' | 'transcripts'>('records');
  const [academicRecords, setAcademicRecords] = useState<AcademicRecord[]>([]);
  const [academicProfiles, setAcademicProfiles] = useState<AcademicProfile[]>([]);
  const [academicAnalytics, setAcademicAnalytics] = useState<AcademicAnalytics[]>([]);
  const [transcriptRequests, setTranscriptRequests] = useState<TranscriptRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGrade, setFilterGrade] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<AcademicRecord | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<AcademicProfile | null>(null);
  const [formData, setFormData] = useState<Partial<AcademicRecord | TranscriptRequest>>({});

  // Mock data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock academic records
      const mockRecords: AcademicRecord[] = [
        {
          id: 'rec-001',
          studentId: 'student-001',
          studentName: 'John Smith',
          studentNumber: 'STU2024001',
          grade: 'Form 1',
          stream: 'A',
          academicYear: '2024',
          term: 'Term 1',
          recordType: 'Transcript',
          title: 'Form 1 Term 1 Transcript',
          description: 'Official academic transcript for Term 1 2024',
          category: 'Academic',
          status: 'Active',
          issueDate: '2024-02-20',
          issuedBy: 'Academic Office',
          verified: true,
          verifiedBy: 'Principal',
          verifiedDate: '2024-02-21',
          fileUrl: '/records/transcripts/STU2024001_T1_2024.pdf',
          fileName: 'STU2024001_T1_2024.pdf',
          fileSize: 1024000,
          fileFormat: 'PDF',
          tags: ['transcript', 'term1', '2024'],
          isPublic: false,
          shareWithParents: true,
          shareWithStudents: false,
          createdAt: '2024-02-18T10:00:00Z',
          updatedAt: '2024-02-21T14:00:00Z',
        },
        {
          id: 'rec-002',
          studentId: 'student-001',
          studentName: 'John Smith',
          studentNumber: 'STU2024001',
          grade: 'Form 1',
          stream: 'A',
          academicYear: '2024',
          term: 'Term 1',
          recordType: 'Report Card',
          title: 'Form 1 Term 1 Report Card',
          description: 'Comprehensive report card with all subject grades and remarks',
          category: 'Academic',
          status: 'Active',
          issueDate: '2024-02-20',
          issuedBy: 'Class Teacher',
          verified: true,
          verifiedBy: 'Head of Department',
          verifiedDate: '2024-02-21',
          fileUrl: '/records/report-cards/STU2024001_T1_2024.pdf',
          fileName: 'STU2024001_T1_2024.pdf',
          fileSize: 512000,
          fileFormat: 'PDF',
          tags: ['report-card', 'term1', '2024'],
          isPublic: false,
          shareWithParents: true,
          shareWithStudents: true,
          createdAt: '2024-02-18T10:00:00Z',
          updatedAt: '2024-02-21T14:00:00Z',
        },
        {
          id: 'rec-003',
          studentId: 'student-002',
          studentName: 'Sarah Johnson',
          studentNumber: 'STU2024002',
          grade: 'Form 2',
          stream: 'B',
          academicYear: '2024',
          term: 'Term 1',
          recordType: 'Achievement',
          title: 'Science Fair Winner Certificate',
          description: 'Certificate for winning first place in school science fair',
          category: 'Achievement',
          status: 'Active',
          issueDate: '2024-01-15',
          issuedBy: 'Science Department',
          verified: true,
          verifiedBy: 'Principal',
          verifiedDate: '2024-01-16',
          fileUrl: '/records/certificates/science_fair_STU2024002.pdf',
          fileName: 'science_fair_STU2024002.pdf',
          fileSize: 256000,
          fileFormat: 'PDF',
          tags: ['achievement', 'science', 'certificate'],
          isPublic: true,
          shareWithParents: true,
          shareWithStudents: true,
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-16T14:00:00Z',
        },
        {
          id: 'rec-004',
          studentId: 'student-003',
          studentName: 'Michael Brown',
          studentNumber: 'STU2024003',
          grade: 'Form 3',
          stream: 'C',
          academicYear: '2024',
          term: 'Term 1',
          recordType: 'Medical',
          title: 'Medical Examination Report',
          description: 'Annual medical examination and health assessment',
          category: 'Medical',
          status: 'Active',
          issueDate: '2024-01-10',
          issuedBy: 'School Nurse',
          verified: true,
          verifiedBy: 'Medical Officer',
          verifiedDate: '2024-01-11',
          fileUrl: '/records/medical/STU2024003_medical_2024.pdf',
          fileName: 'STU2024003_medical_2024.pdf',
          fileSize: 768000,
          fileFormat: 'PDF',
          tags: ['medical', 'health', 'examination'],
          isPublic: false,
          shareWithParents: true,
          shareWithStudents: false,
          createdAt: '2024-01-10T10:00:00Z',
          updatedAt: '2024-01-11T14:00:00Z',
        },
      ];

      // Mock academic profiles
      const mockProfiles: AcademicProfile[] = [
        {
          id: 'profile-001',
          studentId: 'student-001',
          studentName: 'John Smith',
          studentNumber: 'STU2024001',
          grade: 'Form 1',
          stream: 'A',
          academicYear: '2024',
          dateOfBirth: '2008-03-15',
          gender: 'Male',
          nationality: 'Zimbabwean',
          admissionDate: '2024-01-15',
          admissionNumber: 'ADM2024001',
          guardianName: 'Mrs. Mary Smith',
          guardianContact: '+263 4 123 456',
          guardianEmail: 'mary.smith@email.com',
          emergencyContact: '+263 4 987 654',
          medicalConditions: ['Asthma'],
          allergies: ['Peanuts'],
          specialNeeds: 'None',
          learningStyle: 'Visual Learner',
          careerGoals: 'Engineer',
          academicSummary: {
            cumulativeAverage: 83.6,
            totalCredits: 25,
            rank: 2,
            classRank: 2,
            streamRank: 1,
            attendanceRate: 95.2,
            disciplinaryRecord: 'Clean',
            achievements: 3,
          },
          subjectPerformance: [
            { subject: 'Mathematics', average: 85, grade: 'A', credits: 5, status: 'Pass' },
            { subject: 'English', average: 78, grade: 'B', credits: 5, status: 'Pass' },
            { subject: 'Science', average: 92, grade: 'A+', credits: 5, status: 'Pass' },
            { subject: 'History', average: 75, grade: 'B', credits: 5, status: 'Pass' },
            { subject: 'Geography', average: 88, grade: 'A', credits: 5, status: 'Pass' },
          ],
          termlyPerformance: [
            {
              term: 'Term 1',
              year: '2024',
              average: 83.6,
              grade: 'A',
              rank: 2,
              subjects: [
                { name: 'Mathematics', marks: 85, grade: 'A' },
                { name: 'English', marks: 78, grade: 'B' },
                { name: 'Science', marks: 92, grade: 'A+' },
                { name: 'History', marks: 75, grade: 'B' },
                { name: 'Geography', marks: 88, grade: 'A' },
              ],
            },
          ],
          achievements: [
            {
              title: 'Mathematics Competition',
              description: '3rd place in regional math competition',
              date: '2024-01-20',
              category: 'Academic',
              level: 'District',
              certificateUrl: '/certificates/math_competition.pdf',
            },
            {
              title: 'Science Fair Winner',
              description: 'First place in school science fair',
              date: '2023-11-15',
              category: 'Academic',
              level: 'School',
              certificateUrl: '/certificates/science_fair.pdf',
            },
          ],
          disciplinaryRecords: [],
          lastUpdated: '2024-02-20',
          updatedBy: 'Academic Office',
        },
        {
          id: 'profile-002',
          studentId: 'student-002',
          studentName: 'Sarah Johnson',
          studentNumber: 'STU2024002',
          grade: 'Form 2',
          stream: 'B',
          academicYear: '2024',
          dateOfBirth: '2007-06-20',
          gender: 'Female',
          nationality: 'Zimbabwean',
          admissionDate: '2024-01-15',
          admissionNumber: 'ADM2024002',
          guardianName: 'Mr. Robert Johnson',
          guardianContact: '+263 4 555 666',
          guardianEmail: 'robert.johnson@email.com',
          emergencyContact: '+263 4 777 888',
          medicalConditions: [],
          allergies: [],
          specialNeeds: 'None',
          learningStyle: 'Auditory Learner',
          careerGoals: 'Doctor',
          academicSummary: {
            cumulativeAverage: 88.0,
            totalCredits: 30,
            rank: 1,
            classRank: 1,
            streamRank: 1,
            attendanceRate: 98.5,
            disciplinaryRecord: 'Clean',
            achievements: 5,
          },
          subjectPerformance: [
            { subject: 'Mathematics', average: 95, grade: 'A+', credits: 5, status: 'Pass' },
            { subject: 'English', average: 88, grade: 'A', credits: 5, status: 'Pass' },
            { subject: 'Science', average: 90, grade: 'A+', credits: 5, status: 'Pass' },
            { subject: 'History', average: 82, grade: 'B', credits: 5, status: 'Pass' },
            { subject: 'Geography', average: 85, grade: 'A', credits: 5, status: 'Pass' },
            { subject: 'Physics', average: 78, grade: 'B', credits: 5, status: 'Pass' },
          ],
          termlyPerformance: [
            {
              term: 'Term 1',
              year: '2024',
              average: 88.0,
              grade: 'A+',
              rank: 1,
              subjects: [
                { name: 'Mathematics', marks: 95, grade: 'A+' },
                { name: 'English', marks: 88, grade: 'A' },
                { name: 'Science', marks: 90, grade: 'A+' },
                { name: 'History', marks: 82, grade: 'B' },
                { name: 'Geography', marks: 85, grade: 'A' },
                { name: 'Physics', marks: 78, grade: 'B' },
              ],
            },
          ],
          achievements: [
            {
              title: 'Science Fair Winner',
              description: 'First place in school science fair',
              date: '2024-01-18',
              category: 'Academic',
              level: 'School',
              certificateUrl: '/certificates/science_fair.pdf',
            },
            {
              title: 'Debate Competition',
              description: 'Best speaker in inter-school debate',
              date: '2023-10-10',
              category: 'Leadership',
              level: 'District',
              certificateUrl: '/certificates/debate.pdf',
            },
          ],
          disciplinaryRecords: [],
          lastUpdated: '2024-02-20',
          updatedBy: 'Academic Office',
        },
      ];

      // Mock academic analytics
      const mockAnalytics: AcademicAnalytics[] = [
        {
          id: 'analytics-001',
          title: 'Term 1 Performance Analysis',
          description: 'Comprehensive analysis of student performance for Term 1 2024',
          reportType: 'Performance Analysis',
          period: 'Term 1 2024',
          startDate: '2024-01-08',
          endDate: '2024-04-05',
          generatedDate: '2024-04-10',
          generatedBy: 'Academic Office',
          data: {
            totalStudents: 156,
            averagePerformance: 76.5,
            attendanceRate: 94.2,
            disciplinaryCases: 12,
            topPerformers: [
              { studentName: 'Sarah Johnson', percentage: 88.0, rank: 1 },
              { studentName: 'John Smith', percentage: 83.6, rank: 2 },
              { studentName: 'Emma Wilson', percentage: 81.2, rank: 3 },
            ],
            subjectAnalytics: {
              'Mathematics': { average: 72.3, highest: 95, lowest: 45, passRate: 85.2 },
              'English': { average: 75.8, highest: 92, lowest: 48, passRate: 88.5 },
              'Science': { average: 78.2, highest: 94, lowest: 52, passRate: 91.3 },
            },
            gradeDistribution: {
              'A+': 8, 'A': 15, 'B': 32, 'C': 28, 'D': 18, 'E': 12, 'F': 3,
            },
            trends: {
              performance: 'Improving',
              attendance: 'Stable',
              discipline: 'Improving',
            },
          },
          fileUrl: '/analytics/term1_performance_2024.pdf',
          fileName: 'term1_performance_2024.pdf',
          createdAt: '2024-04-10T10:00:00Z',
        },
        {
          id: 'analytics-002',
          title: 'Grade Distribution Report',
          description: 'Analysis of grade distribution across all subjects and grades',
          reportType: 'Grade Distribution',
          period: 'Academic Year 2024',
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          generatedDate: '2024-02-15',
          generatedBy: 'Academic Office',
          data: {
            totalStudents: 156,
            averagePerformance: 76.5,
            attendanceRate: 94.2,
            disciplinaryCases: 12,
            topPerformers: [
              { studentName: 'Sarah Johnson', percentage: 88.0, rank: 1 },
              { studentName: 'John Smith', percentage: 83.6, rank: 2 },
              { studentName: 'Emma Wilson', percentage: 81.2, rank: 3 },
            ],
            subjectAnalytics: {
              'Mathematics': { average: 72.3, highest: 95, lowest: 45, passRate: 85.2 },
              'English': { average: 75.8, highest: 92, lowest: 48, passRate: 88.5 },
              'Science': { average: 78.2, highest: 94, lowest: 52, passRate: 91.3 },
            },
            gradeDistribution: {
              'A+': 8, 'A': 15, 'B': 32, 'C': 28, 'D': 18, 'E': 12, 'F': 3,
            },
            trends: {
              performance: 'Improving',
              attendance: 'Stable',
              discipline: 'Improving',
            },
          },
          fileUrl: '/analytics/grade_distribution_2024.pdf',
          fileName: 'grade_distribution_2024.pdf',
          createdAt: '2024-02-15T14:00:00Z',
        },
      ];

      // Mock transcript requests
      const mockRequests: TranscriptRequest[] = [
        {
          id: 'req-001',
          studentId: 'student-001',
          studentName: 'John Smith',
          studentNumber: 'STU2024001',
          grade: 'Form 1',
          stream: 'A',
          requestType: 'Official',
          purpose: 'University Application',
          requestedBy: 'Mrs. Mary Smith',
          requesterType: 'Parent',
          requesterContact: '+263 4 123 456',
          status: 'Completed',
          requestedDate: '2024-02-15',
          completedDate: '2024-02-18',
          deliveryMethod: 'Pickup',
          fee: 25,
          feePaid: true,
          notes: 'Required for university application',
          createdAt: '2024-02-15T10:00:00Z',
          updatedAt: '2024-02-18T14:00:00Z',
        },
        {
          id: 'req-002',
          studentId: 'student-002',
          studentName: 'Sarah Johnson',
          studentNumber: 'STU2024002',
          grade: 'Form 2',
          stream: 'B',
          requestType: 'Unofficial',
          purpose: 'Personal',
          requestedBy: 'Sarah Johnson',
          requesterType: 'Student',
          requesterContact: '+263 4 555 666',
          status: 'Processing',
          requestedDate: '2024-02-20',
          deliveryMethod: 'Email',
          fee: 0,
          feePaid: true,
          notes: 'Personal record request',
          createdAt: '2024-02-20T09:00:00Z',
          updatedAt: '2024-02-20T09:00:00Z',
        },
        {
          id: 'req-003',
          studentId: 'student-003',
          studentName: 'Michael Brown',
          studentNumber: 'STU2024003',
          grade: 'Form 3',
          stream: 'C',
          requestType: 'Official',
          purpose: 'Transfer',
          requestedBy: 'University of Zimbabwe',
          requesterType: 'Institution',
          requesterContact: 'admissions@uz.ac.zw',
          status: 'Pending',
          requestedDate: '2024-02-22',
          deliveryMethod: 'Courier',
          fee: 50,
          feePaid: false,
          notes: 'Transfer application to university',
          createdAt: '2024-02-22T11:00:00Z',
          updatedAt: '2024-02-22T11:00:00Z',
        },
      ];
      
      setAcademicRecords(mockRecords);
      setAcademicProfiles(mockProfiles);
      setAcademicAnalytics(mockAnalytics);
      setTranscriptRequests(mockRequests);
      setLoading(false);
    };

    loadData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
      case 'Completed':
      case 'Ready':
      case 'Verified':
        return 'text-success-600 bg-success-100';
      case 'Pending':
      case 'Processing':
        return 'text-warning-600 bg-warning-100';
      case 'Archived':
      case 'Deleted':
      case 'Rejected':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getRecordTypeColor = (type: string) => {
    switch (type) {
      case 'Transcript':
        return 'text-blue-600 bg-blue-100';
      case 'Report Card':
        return 'text-green-600 bg-green-100';
      case 'Certificate':
        return 'text-purple-600 bg-purple-100';
      case 'Achievement':
        return 'text-yellow-600 bg-yellow-100';
      case 'Discipline':
        return 'text-red-600 bg-red-100';
      case 'Medical':
        return 'text-orange-600 bg-orange-100';
      case 'Attendance':
        return 'text-indigo-600 bg-indigo-100';
      case 'Other':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Academic':
        return 'text-blue-600 bg-blue-100';
      case 'Achievement':
        return 'text-yellow-600 bg-yellow-100';
      case 'Disciplinary':
        return 'text-red-600 bg-red-100';
      case 'Medical':
        return 'text-orange-600 bg-orange-100';
      case 'Administrative':
        return 'text-gray-600 bg-gray-100';
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

  const filteredRecords = academicRecords.filter(record => {
    const matchesSearch = record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.studentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = filterGrade === 'all' || record.grade === filterGrade;
    const matchesType = filterType === 'all' || record.recordType === filterType;
    const matchesCategory = filterCategory === 'all' || record.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || record.status === filterStatus;
    return matchesSearch && matchesGrade && matchesType && matchesCategory && matchesStatus;
  });

  const filteredProfiles = academicProfiles.filter(profile => {
    const matchesSearch = profile.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         profile.studentNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = filterGrade === 'all' || profile.grade === filterGrade;
    return matchesSearch && matchesGrade;
  });

  const filteredRequests = transcriptRequests.filter(request => {
    const matchesSearch = request.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.studentNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = filterGrade === 'all' || request.grade === filterGrade;
    const matchesStatus = filterStatus === 'all' || request.status === filterStatus;
    return matchesSearch && matchesGrade && matchesStatus;
  });

  const handleCreateRecord = () => {
    // In real app, this would call API
    const newRecord: AcademicRecord = {
      id: `rec-${Date.now()}`,
      studentId: formData.studentId || 'student-new',
      studentName: formData.studentName || 'New Student',
      studentNumber: formData.studentNumber || 'STU000000',
      grade: formData.grade || 'Form 1',
      stream: formData.stream || 'A',
      academicYear: formData.academicYear || '2024',
      term: formData.term || 'Term 1',
      recordType: formData.recordType as AcademicRecord['recordType'] || 'Other',
      title: formData.title || 'New Record',
      description: formData.description || '',
      category: formData.category as AcademicRecord['category'] || 'Administrative',
      status: 'Active',
      issueDate: formData.issueDate || new Date().toISOString().split('T')[0],
      issuedBy: 'Current User',
      verified: false,
      tags: formData.tags as string[] || [],
      isPublic: formData.isPublic || false,
      shareWithParents: formData.shareWithParents || false,
      shareWithStudents: formData.shareWithStudents || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setAcademicRecords([...academicRecords, newRecord]);
    setShowCreateModal(false);
    setFormData({});
  };

  const handleRequestTranscript = () => {
    // In real app, this would call API
    const newRequest: TranscriptRequest = {
      id: `req-${Date.now()}`,
      studentId: formData.studentId || 'student-new',
      studentName: formData.studentName || 'New Student',
      studentNumber: formData.studentNumber || 'STU000000',
      grade: formData.grade || 'Form 1',
      stream: formData.stream || 'A',
      requestType: formData.requestType as TranscriptRequest['requestType'] || 'Unofficial',
      purpose: formData.purpose as TranscriptRequest['purpose'] || 'Personal',
      requestedBy: formData.requestedBy || 'Current User',
      requesterType: formData.requesterType as TranscriptRequest['requesterType'] || 'Student',
      requesterContact: formData.requesterContact || '',
      status: 'Pending',
      requestedDate: new Date().toISOString().split('T')[0],
      deliveryMethod: formData.deliveryMethod as TranscriptRequest['deliveryMethod'] || 'Pickup',
      fee: formData.fee || 0,
      feePaid: false,
      notes: formData.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setTranscriptRequests([...transcriptRequests, newRequest]);
    setShowRequestModal(false);
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
              Academic Records
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage student academic records, profiles, and transcript requests
            </p>
          </div>
          <div className="flex gap-3">
            <button className="btn btn-secondary">
              <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
              Export Records
            </button>
            {activeTab === 'records' && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn btn-primary"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Add Record
              </button>
            )}
            {activeTab === 'transcripts' && (
              <button
                onClick={() => setShowRequestModal(true)}
                className="btn btn-primary"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Request Transcript
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="flex space-x-8">
          {[
            { id: 'records', label: 'Academic Records', icon: DocumentTextIcon },
            { id: 'profiles', label: 'Student Profiles', icon: UserIcon },
            { id: 'analytics', label: 'Analytics', icon: ChartBarIcon },
            { id: 'transcripts', label: 'Transcript Requests', icon: BriefcaseIcon },
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
                  placeholder="Search records..."
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
              {activeTab === 'records' && (
                <>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="form-input"
                  >
                    <option value="all">All Types</option>
                    <option value="Transcript">Transcript</option>
                    <option value="Report Card">Report Card</option>
                    <option value="Certificate">Certificate</option>
                    <option value="Achievement">Achievement</option>
                    <option value="Discipline">Discipline</option>
                    <option value="Medical">Medical</option>
                    <option value="Attendance">Attendance</option>
                    <option value="Other">Other</option>
                  </select>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="form-input"
                  >
                    <option value="all">All Categories</option>
                    <option value="Academic">Academic</option>
                    <option value="Achievement">Achievement</option>
                    <option value="Disciplinary">Disciplinary</option>
                    <option value="Medical">Medical</option>
                    <option value="Administrative">Administrative</option>
                  </select>
                </>
              )}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="form-input"
              >
                <option value="all">All Status</option>
                <option value="Active">Active</option>
                <option value="Archived">Archived</option>
                <option value="Deleted">Deleted</option>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Completed">Completed</option>
                <option value="Ready">Ready</option>
                <option value="Rejected">Rejected</option>
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
      {activeTab === 'records' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecords.map((record, index) => (
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
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                      {record.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {record.studentName} • {record.grade} - {record.stream}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(record.status)}`}>
                    {record.status}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Type</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getRecordTypeColor(record.recordType)}`}>
                      {record.recordType}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Category</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(record.category)}`}>
                      {record.category}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Issue Date</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {new Date(record.issueDate).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Issued By</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {record.issuedBy}
                    </span>
                  </div>

                  {record.expiryDate && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Expires</span>
                      <span className="text-sm text-gray-500 dark:text-gray-500">
                        {new Date(record.expiryDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}

                  {record.fileUrl && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">File</span>
                      <span className="text-sm text-gray-500 dark:text-gray-500">
                        {record.fileName} ({(record.fileSize! / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1">
                    {record.verified && (
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded">
                        Verified
                      </span>
                    )}
                    {record.isPublic && (
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded">
                        Public
                      </span>
                    )}
                    {record.shareWithParents && (
                      <span className="text-xs px-2 py-1 bg-purple-100 text-purple-600 rounded">
                        Shared with Parents
                      </span>
                    )}
                    {record.shareWithStudents && (
                      <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-600 rounded">
                        Shared with Students
                      </span>
                    )}
                    {record.tags.map((tag, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {record.description && (
                    <div className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {record.description}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-sm text-gray-500 dark:text-gray-500">
                    Created {new Date(record.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex gap-2">
                    {record.fileUrl && (
                      <button className="text-blue-600 hover:text-blue-800">
                        <EyeIcon className="w-4 h-4" />
                      </button>
                    )}
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

      {activeTab === 'profiles' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfiles.map((profile, index) => (
            <motion.div
              key={profile.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card card-hover"
            >
              <div className="card-body">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {profile.studentName}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {profile.studentNumber} • {profile.grade} - {profile.stream}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Average</div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {profile.academicSummary.cumulativeAverage.toFixed(1)}%
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Class Rank:</span>
                      <span className="text-gray-900 dark:text-white ml-1">#{profile.academicSummary.classRank}</span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Stream Rank:</span>
                      <span className="text-gray-900 dark:text-white ml-1">#{profile.academicSummary.streamRank}</span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Attendance:</span>
                      <span className="text-gray-900 dark:text-white ml-1">{profile.academicSummary.attendanceRate.toFixed(1)}%</span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Discipline:</span>
                      <span className="text-gray-900 dark:text-white ml-1">{profile.academicSummary.disciplinaryRecord}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Subject Performance:</div>
                    {profile.subjectPerformance.slice(0, 3).map((subject, i) => (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-400">{subject.subject}</span>
                        <div className="flex items-center gap-1">
                          <span className="text-gray-500 dark:text-gray-500">
                            {subject.average.toFixed(1)}%
                          </span>
                          <span className={`text-xs px-1 py-0.5 rounded ${getGradeColor(subject.grade)}`}>
                            {subject.grade}
                          </span>
                        </div>
                      </div>
                    ))}
                    {profile.subjectPerformance.length > 3 && (
                      <div className="text-xs text-gray-500 dark:text-gray-500">
                        +{profile.subjectPerformance.length - 3} more subjects
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {profile.achievements.length > 0 && (
                      <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-600 rounded">
                        {profile.achievements.length} Achievements
                      </span>
                    )}
                    {profile.disciplinaryRecords.length > 0 && (
                      <span className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded">
                        {profile.disciplinaryRecords.length} Records
                      </span>
                    )}
                    {profile.specialNeeds && (
                      <span className="text-xs px-2 py-1 bg-orange-100 text-orange-600 rounded">
                        Special Needs
                      </span>
                    )}
                  </div>

                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Career Goals:</span> {profile.careerGoals}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-sm text-gray-500 dark:text-gray-500">
                    Last updated {new Date(profile.lastUpdated).toLocaleDateString()}
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setSelectedProfile(profile)}
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

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {academicAnalytics.map((analytics, index) => (
            <motion.div
              key={analytics.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card card-hover"
            >
              <div className="card-body">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                      {analytics.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {analytics.reportType}
                    </p>
                  </div>
                  <ChartBarIcon className="w-6 h-6 text-gray-400" />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Period</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {analytics.period}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Students</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {analytics.data.totalStudents}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Average %</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {analytics.data.averagePerformance.toFixed(1)}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Attendance</span>
                    <span className="text-sm font-medium text-green-600">
                      {analytics.data.attendanceRate.toFixed(1)}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Discipline</span>
                    <span className="text-sm font-medium text-red-600">
                      {analytics.data.disciplinaryCases} cases
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Top Performers:</div>
                    {analytics.data.topPerformers.slice(0, 2).map((performer, i) => (
                      <div key={i} className="text-xs text-gray-500 dark:text-gray-500">
                        {i + 1}. {performer.studentName} ({performer.percentage.toFixed(1)}%)
                      </div>
                    ))}
                  </div>

                  <div className="space-y-1">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Trends:</div>
                    <div className="flex flex-wrap gap-1">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        analytics.data.trends.performance === 'Improving' ? 'bg-green-100 text-green-600' :
                        analytics.data.trends.performance === 'Declining' ? 'bg-red-100 text-red-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        Performance: {analytics.data.trends.performance}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        analytics.data.trends.attendance === 'Improving' ? 'bg-green-100 text-green-600' :
                        analytics.data.trends.attendance === 'Declining' ? 'bg-red-100 text-red-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        Attendance: {analytics.data.trends.attendance}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        analytics.data.trends.discipline === 'Improving' ? 'bg-green-100 text-green-600' :
                        analytics.data.trends.discipline === 'Declining' ? 'bg-red-100 text-red-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        Discipline: {analytics.data.trends.discipline}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {analytics.fileUrl && (
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded">
                        File Available
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-sm text-gray-500 dark:text-gray-500">
                    Generated {new Date(analytics.generatedDate).toLocaleDateString()}
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

      {activeTab === 'transcripts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRequests.map((request, index) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card card-hover"
            >
              <div className="card-body">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {request.studentName}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {request.studentNumber} • {request.grade} - {request.stream}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(request.status)}`}>
                    {request.status}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Type</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      request.requestType === 'Official' ? 'text-red-600 bg-red-100' :
                      request.requestType === 'Unofficial' ? 'text-blue-600 bg-blue-100' :
                      'text-gray-600 bg-gray-100'
                    }`}>
                      {request.requestType}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Purpose</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {request.purpose}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Requested By</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {request.requestedBy}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Requester</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {request.requesterType}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Requested</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {new Date(request.requestedDate).toLocaleDateString()}
                    </span>
                  </div>

                  {request.completedDate && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Completed</span>
                      <span className="text-sm text-gray-500 dark:text-gray-500">
                        {new Date(request.completedDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Delivery</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {request.deliveryMethod}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Fee</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      ${request.fee}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {request.feePaid && (
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded">
                        Paid
                      </span>
                    )}
                    {!request.feePaid && request.fee > 0 && (
                      <span className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded">
                        Unpaid
                      </span>
                    )}
                  </div>

                  {request.notes && (
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Notes:</span> {request.notes}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-sm text-gray-500 dark:text-gray-500">
                    Requested {new Date(request.createdAt).toLocaleDateString()}
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

      {/* Add Academic Record Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full"
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Add Academic Record
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
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Record Type
                  </label>
                  <select
                    value={formData.recordType || ''}
                    onChange={(e) => setFormData({ ...formData, recordType: e.target.value as AcademicRecord['recordType'] })}
                    className="form-input"
                  >
                    <option value="Transcript">Transcript</option>
                    <option value="Report Card">Report Card</option>
                    <option value="Certificate">Certificate</option>
                    <option value="Achievement">Achievement</option>
                    <option value="Discipline">Discipline</option>
                    <option value="Medical">Medical</option>
                    <option value="Attendance">Attendance</option>
                    <option value="Other">Other</option>
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
                    placeholder="Record title..."
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
                    placeholder="Record description..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Category
                    </label>
                    <select
                      value={formData.category || ''}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as AcademicRecord['category'] })}
                      className="form-input"
                    >
                      <option value="Academic">Academic</option>
                      <option value="Achievement">Achievement</option>
                      <option value="Disciplinary">Disciplinary</option>
                      <option value="Medical">Medical</option>
                      <option value="Administrative">Administrative</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Issue Date
                    </label>
                    <input
                      type="date"
                      value={formData.issueDate || ''}
                      onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isPublic || false}
                    onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                    className="form-checkbox mr-2"
                  />
                  <label className="text-sm text-gray-700 dark:text-gray-300">
                    Public Record
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.shareWithParents || false}
                    onChange={(e) => setFormData({ ...formData, shareWithParents: e.target.checked })}
                    className="form-checkbox mr-2"
                  />
                  <label className="text-sm text-gray-700 dark:text-gray-300">
                    Share with Parents
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.shareWithStudents || false}
                    onChange={(e) => setFormData({ ...formData, shareWithStudents: e.target.checked })}
                    className="form-checkbox mr-2"
                  />
                  <label className="text-sm text-gray-700 dark:text-gray-300">
                    Share with Students
                  </label>
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
                  onClick={handleCreateRecord}
                  className="btn btn-primary"
                >
                  Add Record
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Request Transcript Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full"
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Request Transcript
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
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Request Type
                    </label>
                    <select
                      value={formData.requestType || ''}
                      onChange={(e) => setFormData({ ...formData, requestType: e.target.value as TranscriptRequest['requestType'] })}
                      className="form-input"
                    >
                      <option value="Official">Official</option>
                      <option value="Unofficial">Unofficial</option>
                      <option value="Provisional">Provisional</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Purpose
                    </label>
                    <select
                      value={formData.purpose || ''}
                      onChange={(e) => setFormData({ ...formData, purpose: e.target.value as TranscriptRequest['purpose'] })}
                      className="form-input"
                    >
                      <option value="University Application">University Application</option>
                      <option value="Employment">Employment</option>
                      <option value="Transfer">Transfer</option>
                      <option value="Personal">Personal</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Requested By
                  </label>
                  <input
                    type="text"
                    value={formData.requestedBy || ''}
                    onChange={(e) => setFormData({ ...formData, requestedBy: e.target.value })}
                    className="form-input"
                    placeholder="Your name..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Requester Type
                    </label>
                    <select
                      value={formData.requesterType || ''}
                      onChange={(e) => setFormData({ ...formData, requesterType: e.target.value as TranscriptRequest['requesterType'] })}
                      className="form-input"
                    >
                      <option value="Student">Student</option>
                      <option value="Parent">Parent</option>
                      <option value="Guardian">Guardian</option>
                      <option value="Institution">Institution</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Contact
                    </label>
                    <input
                      type="text"
                      value={formData.requesterContact || ''}
                      onChange={(e) => setFormData({ ...formData, requesterContact: e.target.value })}
                      className="form-input"
                      placeholder="Email or phone..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Delivery Method
                    </label>
                    <select
                      value={formData.deliveryMethod || ''}
                      onChange={(e) => setFormData({ ...formData, deliveryMethod: e.target.value as TranscriptRequest['deliveryMethod'] })}
                      className="form-input"
                    >
                      <option value="Pickup">Pickup</option>
                      <option value="Email">Email</option>
                      <option value="Post">Post</option>
                      <option value="Courier">Courier</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Fee ($)
                    </label>
                    <input
                      type="number"
                      value={formData.fee || ''}
                      onChange={(e) => setFormData({ ...formData, fee: parseFloat(e.target.value) || 0 })}
                      className="form-input"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes || ''}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    className="form-input"
                    placeholder="Additional notes..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowRequestModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRequestTranscript}
                  className="btn btn-primary"
                >
                  Submit Request
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Detailed Profile Modal */}
      {selectedProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedProfile.studentName} - Academic Profile
                </h2>
                <button
                  onClick={() => setSelectedProfile(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XCircleIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Personal Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Student Number:</span>
                      <span className="text-gray-900 dark:text-white">{selectedProfile.studentNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Grade:</span>
                      <span className="text-gray-900 dark:text-white">{selectedProfile.grade}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Stream:</span>
                      <span className="text-gray-900 dark:text-white">{selectedProfile.stream}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Date of Birth:</span>
                      <span className="text-gray-900 dark:text-white">{new Date(selectedProfile.dateOfBirth).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Gender:</span>
                      <span className="text-gray-900 dark:text-white">{selectedProfile.gender}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Nationality:</span>
                      <span className="text-gray-900 dark:text-white">{selectedProfile.nationality}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Admission Date:</span>
                      <span className="text-gray-900 dark:text-white">{new Date(selectedProfile.admissionDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Guardian:</span>
                      <span className="text-gray-900 dark:text-white">{selectedProfile.guardianName}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Academic Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Cumulative Average:</span>
                      <span className="text-gray-900 dark:text-white font-bold">{selectedProfile.academicSummary.cumulativeAverage.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Class Rank:</span>
                      <span className="text-gray-900 dark:text-white">#{selectedProfile.academicSummary.classRank}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Stream Rank:</span>
                      <span className="text-gray-900 dark:text-white">#{selectedProfile.academicSummary.streamRank}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Attendance Rate:</span>
                      <span className="text-gray-900 dark:text-white">{selectedProfile.academicSummary.attendanceRate.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Disciplinary Record:</span>
                      <span className="text-gray-900 dark:text-white">{selectedProfile.academicSummary.disciplinaryRecord}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Total Achievements:</span>
                      <span className="text-gray-900 dark:text-white">{selectedProfile.academicSummary.achievements}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Subject Performance</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Subject
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Average
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Grade
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Credits
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                      {selectedProfile.subjectPerformance.map((subject, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {subject.subject}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {subject.average.toFixed(1)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`text-xs px-2 py-1 rounded-full ${getGradeColor(subject.grade)}`}>
                              {subject.grade}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {subject.credits}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`text-xs px-2 py-1 rounded-full ${subject.status === 'Pass' ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'}`}>
                              {subject.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Achievements</h3>
                <div className="space-y-2">
                  {selectedProfile.achievements.map((achievement, index) => (
                    <div key={index} className="border-l-4 border-yellow-400 pl-4 py-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">{achievement.title}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{achievement.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500 dark:text-gray-500">{new Date(achievement.date).toLocaleDateString()}</p>
                          <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-600 rounded">
                            {achievement.level}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setSelectedProfile(null)}
                  className="btn btn-secondary"
                >
                  Close
                </button>
                <button className="btn btn-primary">
                  <PrinterIcon className="w-4 h-4 mr-2" />
                  Print Profile
                </button>
                <button className="btn btn-primary">
                  <EnvelopeIcon className="w-4 h-4 mr-2" />
                  Email Profile
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
