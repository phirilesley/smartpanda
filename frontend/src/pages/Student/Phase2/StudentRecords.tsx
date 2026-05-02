import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  DocumentTextIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  DocumentArrowDownIcon,
  UserIcon,
  CalendarDaysIcon,
  FolderIcon,
  EyeIcon,
  CloudArrowUpIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

// Types
interface StudentDocument {
  id: string;
  studentId: string;
  studentName: string;
  studentNumber: string;
  grade: string;
  stream: string;
  documentType: 'Birth Certificate' | 'National ID' | 'Passport' | 'Medical Form' | 'Report Card' | 'Transfer Certificate' | 'Parent Consent' | 'Immunization Record' | 'Other';
  documentName: string;
  documentNumber?: string;
  issueDate?: string;
  expiryDate?: string;
  issuingAuthority?: string;
  description: string;
  status: 'Active' | 'Expired' | 'Pending' | 'Missing' | 'Under Review';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  fileFormat?: string;
  uploadedBy: string;
  uploadedAt: string;
  lastVerified?: string;
  verifiedBy?: string;
  notes?: string;
  tags: string[];
  isRequired: boolean;
  isPublic: boolean;
  shareWithParents: boolean;
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
  recordType: 'Academic' | 'Medical' | 'Disciplinary' | 'Attendance' | 'Achievement' | 'Behavior' | 'Communication' | 'Other';
  title: string;
  description: string;
  category: string;
  date: string;
  status: 'Active' | 'Archived' | 'Deleted';
  priority: 'Low' | 'Medium' | 'High';
  attachments: string[];
  tags: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  sharedWith: string[];
  isConfidential: boolean;
  retentionPeriod?: string;
  archiveDate?: string;
}

interface StudentProfile {
  id: string;
  studentId: string;
  studentName: string;
  studentNumber: string;
  grade: string;
  stream: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  nationality: string;
  religion?: string;
  languages: string[];
  medicalConditions: string[];
  allergies: string[];
  medications: string[];
  emergencyContacts: Array<{
    name: string;
    relationship: string;
    phone: string;
    email?: string;
    isPrimary: boolean;
  }>;
  guardians: Array<{
    name: string;
    relationship: string;
    phone: string;
    email: string;
    address: string;
    occupation?: string;
    isPrimary: boolean;
  }>;
  previousSchools: Array<{
    name: string;
    address: string;
    attendedFrom: string;
    attendedTo: string;
    gradeCompleted: string;
    reasonForLeaving?: string;
  }>;
  achievements: Array<{
    title: string;
    description: string;
    date: string;
    category: string;
    level: 'School' | 'District' | 'National' | 'International';
  }>;
  skills: string[];
  interests: string[];
  careerGoals?: string;
  specialNeeds?: string;
  learningStyle?: string;
  behavioralNotes?: string;
  academicNotes?: string;
  lastUpdated: string;
  updatedBy: string;
}

export const StudentRecords: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'documents' | 'records' | 'profile' | 'archive'>('documents');
  const [studentDocuments, setStudentDocuments] = useState<StudentDocument[]>([]);
  const [studentRecords, setStudentRecords] = useState<StudentRecord[]>([]);
  const [studentProfiles, setStudentProfiles] = useState<StudentProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGrade, setFilterGrade] = useState<string>('all');
  const [filterStream, setFilterStream] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCreateRecordModal, setShowCreateRecordModal] = useState(false);
  const [formData, setFormData] = useState<Partial<StudentDocument | StudentRecord>>({});

  // Mock data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock student documents
      const mockDocuments: StudentDocument[] = [
        {
          id: 'doc-001',
          studentId: 'student-001',
          studentName: 'John Smith',
          studentNumber: 'STU2024001',
          grade: 'Form 1',
          stream: 'A',
          documentType: 'Birth Certificate',
          documentName: 'Birth Certificate',
          documentNumber: 'BC-2008-12345',
          issueDate: '2008-03-15',
          issuingAuthority: 'Registrar General',
          description: 'Original birth certificate',
          status: 'Active',
          priority: 'High',
          fileUrl: '/documents/birth-certificates/STU2024001.pdf',
          fileName: 'STU2024001_Birth_Certificate.pdf',
          fileSize: 1024000,
          fileFormat: 'PDF',
          uploadedBy: 'Admin',
          uploadedAt: '2024-01-15T10:00:00Z',
          lastVerified: '2024-01-15T10:30:00Z',
          verifiedBy: 'Mrs. Johnson',
          notes: 'Verified and authentic',
          tags: ['verified', 'original'],
          isRequired: true,
          isPublic: false,
          shareWithParents: true,
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
        },
        {
          id: 'doc-002',
          studentId: 'student-001',
          studentName: 'John Smith',
          studentNumber: 'STU2024001',
          grade: 'Form 1',
          stream: 'A',
          documentType: 'Medical Form',
          documentName: 'Medical Examination Form',
          description: 'Annual medical examination report',
          status: 'Active',
          priority: 'Medium',
          fileUrl: '/documents/medical/STU2024001_medical.pdf',
          fileName: 'STU2024001_Medical_2024.pdf',
          fileSize: 512000,
          fileFormat: 'PDF',
          uploadedBy: 'School Nurse',
          uploadedAt: '2024-01-10T14:00:00Z',
          lastVerified: '2024-01-10T14:30:00Z',
          verifiedBy: 'Dr. Brown',
          notes: 'All vaccinations up to date',
          tags: ['medical', 'vaccination'],
          isRequired: true,
          isPublic: false,
          shareWithParents: true,
          createdAt: '2024-01-10T14:00:00Z',
          updatedAt: '2024-01-10T14:30:00Z',
        },
        {
          id: 'doc-003',
          studentId: 'student-002',
          studentName: 'Sarah Johnson',
          studentNumber: 'STU2024002',
          grade: 'Form 2',
          stream: 'B',
          documentType: 'Report Card',
          documentName: 'Term 1 Report Card 2024',
          description: 'Academic performance for Term 1',
          status: 'Active',
          priority: 'Medium',
          fileUrl: '/documents/report-cards/STU2024002_T1_2024.pdf',
          fileName: 'STU2024002_Term1_2024.pdf',
          fileSize: 256000,
          fileFormat: 'PDF',
          uploadedBy: 'Mrs. Johnson',
          uploadedAt: '2024-01-20T16:00:00Z',
          tags: ['academic', 'term1'],
          isRequired: false,
          isPublic: false,
          shareWithParents: true,
          createdAt: '2024-01-20T16:00:00Z',
          updatedAt: '2024-01-20T16:00:00Z',
        },
        {
          id: 'doc-004',
          studentId: 'student-003',
          studentName: 'Michael Brown',
          studentNumber: 'STU2024003',
          grade: 'Form 1',
          stream: 'C',
          documentType: 'National ID',
          documentName: 'National ID Card',
          documentNumber: '23-456789-A-12',
          issueDate: '2022-05-10',
          expiryDate: '2032-05-10',
          issuingAuthority: 'Registrar General',
          description: 'National identity document',
          status: 'Missing',
          priority: 'High',
          uploadedBy: 'Admin',
          uploadedAt: '2024-01-15T10:00:00Z',
          notes: 'Document not submitted yet',
          tags: ['missing', 'required'],
          isRequired: true,
          isPublic: false,
          shareWithParents: false,
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z',
        },
      ];

      // Mock student records
      const mockRecords: StudentRecord[] = [
        {
          id: 'rec-001',
          studentId: 'student-001',
          studentName: 'John Smith',
          studentNumber: 'STU2024001',
          grade: 'Form 1',
          stream: 'A',
          recordType: 'Academic',
          title: 'Mathematics Progress Report',
          description: 'Student shows excellent progress in mathematics',
          category: 'Subject Performance',
          date: '2024-01-20',
          status: 'Active',
          priority: 'Medium',
          attachments: ['math_progress_2024.pdf'],
          tags: ['mathematics', 'progress', 'excellent'],
          createdBy: 'Mrs. Johnson',
          createdAt: '2024-01-20T15:00:00Z',
          updatedAt: '2024-01-20T15:00:00Z',
          sharedWith: ['parent-001'],
          isConfidential: false,
        },
        {
          id: 'rec-002',
          studentId: 'student-001',
          studentName: 'John Smith',
          studentNumber: 'STU2024001',
          grade: 'Form 1',
          stream: 'A',
          recordType: 'Medical',
          title: 'Asthma Management Plan',
          description: 'Medical management plan for asthma condition',
          category: 'Health Management',
          date: '2024-01-15',
          status: 'Active',
          priority: 'High',
          attachments: ['asthma_plan.pdf', 'medication_list.pdf'],
          tags: ['medical', 'asthma', 'health'],
          createdBy: 'School Nurse',
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z',
          sharedWith: ['parent-001', 'teacher-001', 'teacher-002'],
          isConfidential: true,
        },
        {
          id: 'rec-003',
          studentId: 'student-002',
          studentName: 'Sarah Johnson',
          studentNumber: 'STU2024002',
          grade: 'Form 2',
          stream: 'B',
          recordType: 'Achievement',
          title: 'Science Fair Winner',
          description: 'First place in school science fair competition',
          category: 'Academic Achievement',
          date: '2024-01-18',
          status: 'Active',
          priority: 'Medium',
          attachments: ['science_fair_certificate.pdf'],
          tags: ['achievement', 'science', 'competition'],
          createdBy: 'Mr. Smith',
          createdAt: '2024-01-18T16:00:00Z',
          updatedAt: '2024-01-18T16:00:00Z',
          sharedWith: ['parent-002'],
          isConfidential: false,
        },
      ];

      // Mock student profiles
      const mockProfiles: StudentProfile[] = [
        {
          id: 'profile-001',
          studentId: 'student-001',
          studentName: 'John Smith',
          studentNumber: 'STU2024001',
          grade: 'Form 1',
          stream: 'A',
          dateOfBirth: '2008-03-15',
          gender: 'Male',
          nationality: 'Zimbabwean',
          religion: 'Christian',
          languages: ['English', 'Shona'],
          medicalConditions: ['Asthma'],
          allergies: ['Peanuts'],
          medications: ['Ventolin Inhaler'],
          emergencyContacts: [
            {
              name: 'Dr. James Brown',
              relationship: 'Family Doctor',
              phone: '+263 4 987 654',
              email: 'dr.brown@clinic.com',
              isPrimary: true,
            },
          ],
          guardians: [
            {
              name: 'Mrs. Mary Smith',
              relationship: 'Mother',
              phone: '+263 4 123 456',
              email: 'mary.smith@email.com',
              address: '123 Main Street, Harare',
              occupation: 'Teacher',
              isPrimary: true,
            },
          ],
          previousSchools: [
            {
              name: 'Harare Primary School',
              address: '456 Education Avenue, Harare',
              attendedFrom: '2016-01-15',
              attendedTo: '2023-12-15',
              gradeCompleted: 'Grade 7',
              reasonForLeaving: 'Graduation',
            },
          ],
          achievements: [
            {
              title: 'Mathematics Competition',
              description: '3rd place in regional math competition',
              date: '2023-10-15',
              category: 'Academic',
              level: 'District',
            },
          ],
          skills: ['Problem Solving', 'Leadership', 'Public Speaking'],
          interests: ['Mathematics', 'Science', 'Chess'],
          careerGoals: 'Engineer or Scientist',
          specialNeeds: 'None',
          learningStyle: 'Visual Learner',
          behavioralNotes: 'Well-behaved, respectful to teachers and peers',
          academicNotes: 'Strong in STEM subjects, needs improvement in languages',
          lastUpdated: '2024-01-20',
          updatedBy: 'Mrs. Johnson',
        },
        {
          id: 'profile-002',
          studentId: 'student-002',
          studentName: 'Sarah Johnson',
          studentNumber: 'STU2024002',
          grade: 'Form 2',
          stream: 'B',
          dateOfBirth: '2007-06-20',
          gender: 'Female',
          nationality: 'Zimbabwean',
          languages: ['English', 'Shona', 'French'],
          medicalConditions: [],
          allergies: [],
          medications: [],
          emergencyContacts: [
            {
              name: 'Dr. Alice Wilson',
              relationship: 'Family Doctor',
              phone: '+263 4 777 888',
              email: 'dr.wilson@clinic.com',
              isPrimary: true,
            },
          ],
          guardians: [
            {
              name: 'Mr. Robert Johnson',
              relationship: 'Father',
              phone: '+263 4 555 666',
              email: 'robert.johnson@email.com',
              address: '789 Student Road, Harare',
              occupation: 'Engineer',
              isPrimary: true,
            },
          ],
          previousSchools: [
            {
              name: 'Bulawayo Primary School',
              address: '123 School Street, Bulawayo',
              attendedFrom: '2015-01-15',
              attendedTo: '2022-12-15',
              gradeCompleted: 'Grade 7',
              reasonForLeaving: 'Family moved to Harare',
            },
          ],
          achievements: [
            {
              title: 'Science Fair Winner',
              description: 'First place in school science fair',
              date: '2024-01-18',
              category: 'Academic',
              level: 'School',
            },
          ],
          skills: ['Research', 'Public Speaking', 'Leadership'],
          interests: ['Science', 'Technology', 'Reading'],
          careerGoals: 'Scientist or Researcher',
          specialNeeds: 'None',
          learningStyle: 'Auditory Learner',
          behavioralNotes: 'Excellent student, participates actively in class',
          academicNotes: 'Outstanding performance across all subjects',
          lastUpdated: '2024-01-20',
          updatedBy: 'Mr. Smith',
        },
      ];
      
      setStudentDocuments(mockDocuments);
      setStudentRecords(mockRecords);
      setStudentProfiles(mockProfiles);
      setLoading(false);
    };

    loadData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'text-success-600 bg-success-100';
      case 'Expired':
        return 'text-red-600 bg-red-100';
      case 'Pending':
        return 'text-warning-600 bg-warning-100';
      case 'Missing':
        return 'text-error-600 bg-error-100';
      case 'Under Review':
        return 'text-blue-600 bg-blue-100';
      case 'Archived':
        return 'text-gray-600 bg-gray-100';
      case 'Deleted':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return 'text-red-600 bg-red-100';
      case 'High':
        return 'text-orange-600 bg-orange-100';
      case 'Medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'Low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Academic':
        return 'text-blue-600 bg-blue-100';
      case 'Medical':
        return 'text-red-600 bg-red-100';
      case 'Disciplinary':
        return 'text-purple-600 bg-purple-100';
      case 'Attendance':
        return 'text-green-600 bg-green-100';
      case 'Achievement':
        return 'text-yellow-600 bg-yellow-100';
      case 'Behavior':
        return 'text-orange-600 bg-orange-100';
      case 'Communication':
        return 'text-indigo-600 bg-indigo-100';
      case 'Other':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredDocuments = studentDocuments.filter(doc => {
    const matchesSearch = doc.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.studentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.documentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = filterGrade === 'all' || doc.grade === filterGrade;
    const matchesStream = filterStream === 'all' || doc.stream === filterStream;
    const matchesType = filterType === 'all' || doc.documentType === filterType;
    const matchesStatus = filterStatus === 'all' || doc.status === filterStatus;
    return matchesSearch && matchesGrade && matchesStream && matchesType && matchesStatus;
  });

  const filteredRecords = studentRecords.filter(record => {
    const matchesSearch = record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.studentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = filterGrade === 'all' || record.grade === filterGrade;
    const matchesStream = filterStream === 'all' || record.stream === filterStream;
    const matchesType = filterType === 'all' || record.recordType === filterType;
    const matchesStatus = filterStatus === 'all' || record.status === filterStatus;
    return matchesSearch && matchesGrade && matchesStream && matchesType && matchesStatus;
  });

  const filteredProfiles = studentProfiles.filter(profile => {
    const matchesSearch = profile.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         profile.studentNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = filterGrade === 'all' || profile.grade === filterGrade;
    const matchesStream = filterStream === 'all' || profile.stream === filterStream;
    return matchesSearch && matchesGrade && matchesStream;
  });

  const handleUploadDocument = () => {
    // In real app, this would handle file upload
    console.log('Uploading document:', formData);
    setShowUploadModal(false);
    setFormData({});
  };

  const handleCreateRecord = () => {
    // In real app, this would call API
    const newRecord: StudentRecord = {
      id: `rec-${Date.now()}`,
      studentId: formData.studentId || 'student-new',
      studentName: formData.studentName || 'New Student',
      studentNumber: formData.studentNumber || 'STU000000',
      grade: formData.grade || 'Form 1',
      stream: formData.stream || 'A',
      recordType: formData.recordType as StudentRecord['recordType'] || 'Other',
      title: formData.title || 'New Record',
      description: formData.description || '',
      category: formData.category || 'General',
      date: formData.date || new Date().toISOString().split('T')[0],
      status: 'Active',
      priority: formData.priority as StudentRecord['priority'] || 'Medium',
      attachments: formData.attachments as string[] || [],
      tags: formData.tags as string[] || [],
      createdBy: 'Current User',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sharedWith: [],
      isConfidential: false,
    };
    
    setStudentRecords([...studentRecords, newRecord]);
    setShowCreateRecordModal(false);
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
              Student Records & Documents
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage student documents, records, and comprehensive profiles
            </p>
          </div>
          <div className="flex gap-3">
            <button className="btn btn-secondary">
              <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
              Export Data
            </button>
            {activeTab === 'documents' && (
              <button
                onClick={() => setShowUploadModal(true)}
                className="btn btn-primary"
              >
                <CloudArrowUpIcon className="w-4 h-4 mr-2" />
                Upload Document
              </button>
            )}
            {activeTab === 'records' && (
              <button
                onClick={() => setShowCreateRecordModal(true)}
                className="btn btn-primary"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Add Record
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="flex space-x-8">
          {[
            { id: 'documents', label: 'Documents', icon: DocumentTextIcon },
            { id: 'records', label: 'Records', icon: FolderIcon },
            { id: 'profile', label: 'Student Profiles', icon: UserIcon },
            { id: 'archive', label: 'Archive', icon: CalendarDaysIcon },
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
              {activeTab === 'documents' && (
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="form-input"
                >
                  <option value="all">All Document Types</option>
                  <option value="Birth Certificate">Birth Certificate</option>
                  <option value="National ID">National ID</option>
                  <option value="Passport">Passport</option>
                  <option value="Medical Form">Medical Form</option>
                  <option value="Report Card">Report Card</option>
                  <option value="Transfer Certificate">Transfer Certificate</option>
                  <option value="Parent Consent">Parent Consent</option>
                  <option value="Immunization Record">Immunization Record</option>
                  <option value="Other">Other</option>
                </select>
              )}
              {activeTab === 'records' && (
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="form-input"
                >
                  <option value="all">All Record Types</option>
                  <option value="Academic">Academic</option>
                  <option value="Medical">Medical</option>
                  <option value="Disciplinary">Disciplinary</option>
                  <option value="Attendance">Attendance</option>
                  <option value="Achievement">Achievement</option>
                  <option value="Behavior">Behavior</option>
                  <option value="Communication">Communication</option>
                  <option value="Other">Other</option>
                </select>
              )}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="form-input"
              >
                <option value="all">All Status</option>
                <option value="Active">Active</option>
                <option value="Expired">Expired</option>
                <option value="Pending">Pending</option>
                <option value="Missing">Missing</option>
                <option value="Under Review">Under Review</option>
                <option value="Archived">Archived</option>
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
      {activeTab === 'documents' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((doc, index) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card card-hover"
            >
              <div className="card-body">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {doc.studentName}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {doc.studentNumber} • {doc.grade} - {doc.stream}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(doc.status)}`}>
                    {doc.status}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Document</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {doc.documentType}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Name</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {doc.documentName}
                    </span>
                  </div>

                  {doc.documentNumber && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Number</span>
                      <span className="text-sm text-gray-500 dark:text-gray-500">
                        {doc.documentNumber}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Priority</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(doc.priority)}`}>
                      {doc.priority}
                    </span>
                  </div>

                  {doc.issueDate && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Issue Date</span>
                      <span className="text-sm text-gray-500 dark:text-gray-500">
                        {new Date(doc.issueDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}

                  {doc.expiryDate && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Expiry Date</span>
                      <span className="text-sm text-gray-500 dark:text-gray-500">
                        {new Date(doc.expiryDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}

                  {doc.fileUrl && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">File Size</span>
                      <span className="text-sm text-gray-500 dark:text-gray-500">
                        {(doc.fileSize! / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1">
                    {doc.isRequired && (
                      <span className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded">
                        Required
                      </span>
                    )}
                    {doc.shareWithParents && (
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded">
                        Shared with Parents
                      </span>
                    )}
                    {doc.tags.map((tag, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {doc.notes && (
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Notes:</span> {doc.notes}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-sm text-gray-500 dark:text-gray-500">
                    Uploaded by {doc.uploadedBy} on {new Date(doc.uploadedAt).toLocaleDateString()}
                  </div>
                  <div className="flex gap-2">
                    {doc.fileUrl && (
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
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {record.studentName}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {record.studentNumber} • {record.grade} - {record.stream}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(record.status)}`}>
                    {record.status}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Type</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(record.recordType)}`}>
                      {record.recordType}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Title</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {record.title}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Category</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {record.category}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Date</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {new Date(record.date).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Priority</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(record.priority)}`}>
                      {record.priority}
                    </span>
                  </div>

                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Description:</span> {record.description}
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {record.attachments.length > 0 && (
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded">
                        {record.attachments.length} Attachments
                      </span>
                    )}
                    {record.sharedWith.length > 0 && (
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded">
                        Shared
                      </span>
                    )}
                    {record.isConfidential && (
                      <span className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded">
                        Confidential
                      </span>
                    )}
                    {record.tags.map((tag, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-sm text-gray-500 dark:text-gray-500">
                    Created by {record.createdBy} on {new Date(record.createdAt).toLocaleDateString()}
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

      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProfiles.map((profile, index) => (
            <motion.div
              key={profile.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card"
            >
              <div className="card-body">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {profile.studentName}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {profile.studentNumber} • {profile.grade} - {profile.stream}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Age</div>
                    <div className="text-lg font-medium text-gray-900 dark:text-white">
                      {new Date().getFullYear() - new Date(profile.dateOfBirth).getFullYear()} years
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Personal Information</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Gender:</span>
                        <span className="text-gray-900 dark:text-white ml-2">{profile.gender}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Nationality:</span>
                        <span className="text-gray-900 dark:text-white ml-2">{profile.nationality}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Languages:</span>
                        <span className="text-gray-900 dark:text-white ml-2">{profile.languages.join(', ')}</span>
                      </div>
                      {profile.religion && (
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Religion:</span>
                          <span className="text-gray-900 dark:text-white ml-2">{profile.religion}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Medical Information</h4>
                    <div className="space-y-1 text-sm">
                      {profile.medicalConditions.length > 0 && (
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Conditions:</span>
                          <span className="text-gray-900 dark:text-white ml-2">{profile.medicalConditions.join(', ')}</span>
                        </div>
                      )}
                      {profile.allergies.length > 0 && (
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Allergies:</span>
                          <span className="text-gray-900 dark:text-white ml-2">{profile.allergies.join(', ')}</span>
                        </div>
                      )}
                      {profile.medications.length > 0 && (
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Medications:</span>
                          <span className="text-gray-900 dark:text-white ml-2">{profile.medications.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Primary Guardian</h4>
                    <div className="space-y-1 text-sm">
                      {profile.guardians.filter(g => g.isPrimary).map((guardian, i) => (
                        <div key={i}>
                          <span className="text-gray-600 dark:text-gray-400">{guardian.relationship}:</span>
                          <span className="text-gray-900 dark:text-white ml-2">{guardian.name}</span>
                          <div className="text-gray-500 dark:text-gray-500 ml-2">{guardian.phone}</div>
                          <div className="text-gray-500 dark:text-gray-500 ml-2">{guardian.email}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Academic Information</h4>
                    <div className="space-y-1 text-sm">
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Learning Style:</span>
                        <span className="text-gray-900 dark:text-white ml-2">{profile.learningStyle}</span>
                      </div>
                      {profile.careerGoals && (
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Career Goals:</span>
                          <span className="text-gray-900 dark:text-white ml-2">{profile.careerGoals}</span>
                        </div>
                      )}
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Skills:</span>
                        <span className="text-gray-900 dark:text-white ml-2">{profile.skills.join(', ')}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Interests:</span>
                        <span className="text-gray-900 dark:text-white ml-2">{profile.interests.join(', ')}</span>
                      </div>
                    </div>
                  </div>

                  {profile.achievements.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Achievements</h4>
                      <div className="space-y-1 text-sm">
                        {profile.achievements.map((achievement, i) => (
                          <div key={i}>
                            <span className="text-gray-900 dark:text-white">{achievement.title}</span>
                            <div className="text-gray-500 dark:text-gray-500">{achievement.description}</div>
                            <div className="text-gray-500 dark:text-gray-500">{new Date(achievement.date).toLocaleDateString()} • {achievement.level}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-sm text-gray-500 dark:text-gray-500">
                    Last updated by {profile.updatedBy} on {new Date(profile.lastUpdated).toLocaleDateString()}
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

      {activeTab === 'archive' && (
        <div className="card">
          <div className="card-body">
            <div className="text-center py-12">
              <CalendarDaysIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Archive Management
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Manage archived student records and documents
              </p>
              <div className="space-y-4 max-w-md mx-auto">
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                      Records to Archive
                    </span>
                    <span className="text-lg font-bold text-yellow-800 dark:text-yellow-200">
                      23
                    </span>
                  </div>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                      Archived Records
                    </span>
                    <span className="text-lg font-bold text-blue-800 dark:text-blue-200">
                      156
                    </span>
                  </div>
                </div>
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-red-800 dark:text-red-200">
                      Records for Deletion
                    </span>
                    <span className="text-lg font-bold text-red-800 dark:text-red-200">
                      8
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Document Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full"
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Upload Document
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
                    Document Type
                  </label>
                  <select
                    value={formData.documentType || ''}
                    onChange={(e) => setFormData({ ...formData, documentType: e.target.value as StudentDocument['documentType'] })}
                    className="form-input"
                  >
                    <option value="">Select Document Type</option>
                    <option value="Birth Certificate">Birth Certificate</option>
                    <option value="National ID">National ID</option>
                    <option value="Passport">Passport</option>
                    <option value="Medical Form">Medical Form</option>
                    <option value="Report Card">Report Card</option>
                    <option value="Transfer Certificate">Transfer Certificate</option>
                    <option value="Parent Consent">Parent Consent</option>
                    <option value="Immunization Record">Immunization Record</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Choose File
                  </label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                    <CloudArrowUpIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      PDF, JPG, PNG up to 10MB
                    </p>
                  </div>
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
                    placeholder="Document description..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUploadDocument}
                  className="btn btn-primary"
                >
                  Upload Document
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Create Record Modal */}
      {showCreateRecordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full"
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Add Student Record
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
                    onChange={(e) => setFormData({ ...formData, recordType: e.target.value as StudentRecord['recordType'] })}
                    className="form-input"
                  >
                    <option value="">Select Record Type</option>
                    <option value="Academic">Academic</option>
                    <option value="Medical">Medical</option>
                    <option value="Disciplinary">Disciplinary</option>
                    <option value="Attendance">Attendance</option>
                    <option value="Achievement">Achievement</option>
                    <option value="Behavior">Behavior</option>
                    <option value="Communication">Communication</option>
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={formData.priority || ''}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as StudentRecord['priority'] })}
                    className="form-input"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowCreateRecordModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateRecord}
                  className="btn btn-primary"
                >
                  Create Record
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
