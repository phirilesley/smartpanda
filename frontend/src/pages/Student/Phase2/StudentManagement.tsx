import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  UserGroupIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  AcademicCapIcon,
  MapPinIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  DocumentArrowDownIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

// Types
interface Student {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  studentNumber: string;
  nationalId?: string;
  passportNumber?: string;
  status: 'Active' | 'Inactive' | 'Graduated' | 'Transferred' | 'Withdrawn';
  admissionDate: string;
  enrollmentStatus: 'Enrolled' | 'Pending' | 'Suspended' | 'Graduated';
  currentGrade: string;
  currentStream: string;
  academicYear: string;
  term: string;
  schoolId: string;
  schoolName: string;
  guardianId?: string;
  guardianName?: string;
  guardianRelationship?: string;
  guardianPhone?: string;
  guardianEmail?: string;
  contact: {
    phone: string;
    email?: string;
    address: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
  };
  medical: {
    bloodType?: string;
    allergies: string[];
    medicalConditions: string[];
    emergencyContact: string;
    emergencyPhone: string;
    emergencyRelationship: string;
  };
  academic: {
    previousSchool?: string;
    previousGrade?: string;
    gpa?: number;
    totalCredits: number;
    attendanceRate: number;
    behaviorStatus: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  };
  fees: {
    outstandingBalance: number;
    lastPaymentDate?: string;
    paymentPlan: boolean;
    scholarship: boolean;
  };
  documents: {
    birthCertificate: boolean;
    nationalIdCard: boolean;
    passportPhoto: boolean;
    medicalForm: boolean;
    reportCard: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export const StudentManagement: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterGrade, setFilterGrade] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState<Partial<Student>>({});

  // Mock data
  useEffect(() => {
    const loadStudents = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockStudents: Student[] = [
        {
          id: 'student-001',
          firstName: 'John',
          lastName: 'Smith',
          middleName: 'Michael',
          dateOfBirth: '2008-03-15',
          gender: 'Male',
          studentNumber: 'STU2024001',
          nationalId: '23-456789-A-12',
          status: 'Active',
          admissionDate: '2024-01-15',
          enrollmentStatus: 'Enrolled',
          currentGrade: 'Form 1',
          currentStream: 'A',
          academicYear: '2024',
          term: 'Term 1',
          schoolId: 'school-001',
          schoolName: 'Harare High School',
          guardianId: 'guardian-001',
          guardianName: 'Mrs. Mary Smith',
          guardianRelationship: 'Mother',
          guardianPhone: '+263 4 123 456',
          guardianEmail: 'mary.smith@email.com',
          contact: {
            phone: '+263 4 123 456',
            email: 'john.smith@student.school',
            address: '123 Main Street',
            city: 'Harare',
            province: 'Harare',
            postalCode: '00123',
            country: 'Zimbabwe',
          },
          medical: {
            bloodType: 'O+',
            allergies: ['Peanuts'],
            medicalConditions: ['Asthma'],
            emergencyContact: 'Dr. James Brown',
            emergencyPhone: '+263 4 987 654',
            emergencyRelationship: 'Family Doctor',
          },
          academic: {
            previousSchool: 'Harare Primary School',
            previousGrade: 'Grade 7',
            gpa: 3.8,
            totalCredits: 45,
            attendanceRate: 95.5,
            behaviorStatus: 'Excellent',
          },
          fees: {
            outstandingBalance: 0,
            lastPaymentDate: '2024-01-10',
            paymentPlan: false,
            scholarship: true,
          },
          documents: {
            birthCertificate: true,
            nationalIdCard: true,
            passportPhoto: true,
            medicalForm: true,
            reportCard: false,
          },
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-20T14:30:00Z',
        },
        {
          id: 'student-002',
          firstName: 'Sarah',
          lastName: 'Johnson',
          middleName: 'Elizabeth',
          dateOfBirth: '2007-06-20',
          gender: 'Female',
          studentNumber: 'STU2024002',
          nationalId: '23-456790-B-34',
          status: 'Active',
          admissionDate: '2024-01-15',
          enrollmentStatus: 'Enrolled',
          currentGrade: 'Form 2',
          currentStream: 'B',
          academicYear: '2024',
          term: 'Term 1',
          schoolId: 'school-001',
          schoolName: 'Harare High School',
          guardianId: 'guardian-002',
          guardianName: 'Mr. Robert Johnson',
          guardianRelationship: 'Father',
          guardianPhone: '+263 4 555 666',
          guardianEmail: 'robert.johnson@email.com',
          contact: {
            phone: '+263 4 555 666',
            email: 'sarah.johnson@student.school',
            address: '456 Education Avenue',
            city: 'Harare',
            province: 'Harare',
            postalCode: '00456',
            country: 'Zimbabwe',
          },
          medical: {
            bloodType: 'A+',
            allergies: [],
            medicalConditions: [],
            emergencyContact: 'Dr. Alice Wilson',
            emergencyPhone: '+263 4 777 888',
            emergencyRelationship: 'Family Doctor',
          },
          academic: {
            previousSchool: 'Bulawayo Primary School',
            previousGrade: 'Grade 7',
            gpa: 3.9,
            totalCredits: 90,
            attendanceRate: 98.2,
            behaviorStatus: 'Excellent',
          },
          fees: {
            outstandingBalance: 2500,
            lastPaymentDate: '2024-01-01',
            paymentPlan: true,
            scholarship: false,
          },
          documents: {
            birthCertificate: true,
            nationalIdCard: true,
            passportPhoto: true,
            medicalForm: true,
            reportCard: true,
          },
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-18T16:45:00Z',
        },
        {
          id: 'student-003',
          firstName: 'Michael',
          lastName: 'Brown',
          dateOfBirth: '2009-11-10',
          gender: 'Male',
          studentNumber: 'STU2024003',
          status: 'Active',
          admissionDate: '2024-01-20',
          enrollmentStatus: 'Enrolled',
          currentGrade: 'Form 1',
          currentStream: 'C',
          academicYear: '2024',
          term: 'Term 1',
          schoolId: 'school-001',
          schoolName: 'Harare High School',
          guardianId: 'guardian-003',
          guardianName: 'Mrs. Linda Brown',
          guardianRelationship: 'Mother',
          guardianPhone: '+263 4 999 888',
          guardianEmail: 'linda.brown@email.com',
          contact: {
            phone: '+263 4 999 888',
            address: '789 Student Road',
            city: 'Harare',
            province: 'Harare',
            postalCode: '00789',
            country: 'Zimbabwe',
          },
          medical: {
            bloodType: 'B+',
            allergies: ['Dairy', 'Eggs'],
            medicalConditions: [],
            emergencyContact: 'Dr. Charles Davis',
            emergencyPhone: '+263 4 333 444',
            emergencyRelationship: 'Family Doctor',
          },
          academic: {
            previousSchool: 'Mutare Primary School',
            previousGrade: 'Grade 7',
            gpa: 3.5,
            totalCredits: 0,
            attendanceRate: 92.0,
            behaviorStatus: 'Good',
          },
          fees: {
            outstandingBalance: 5000,
            lastPaymentDate: '2024-01-15',
            paymentPlan: false,
            scholarship: false,
          },
          documents: {
            birthCertificate: true,
            nationalIdCard: false,
            passportPhoto: true,
            medicalForm: true,
            reportCard: false,
          },
          createdAt: '2024-01-20T10:00:00Z',
          updatedAt: '2024-01-20T10:00:00Z',
        },
      ];
      
      setStudents(mockStudents);
      setLoading(false);
    };

    loadStudents();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
      case 'Enrolled':
        return 'text-success-600 bg-success-100';
      case 'Inactive':
      case 'Withdrawn':
        return 'text-gray-600 bg-gray-100';
      case 'Suspended':
        return 'text-warning-600 bg-warning-100';
      case 'Graduated':
        return 'text-blue-600 bg-blue-100';
      case 'Transferred':
        return 'text-purple-600 bg-purple-100';
      case 'Pending':
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getBehaviorColor = (status: string) => {
    switch (status) {
      case 'Excellent':
        return 'text-green-600 bg-green-100';
      case 'Good':
        return 'text-blue-600 bg-blue-100';
      case 'Fair':
        return 'text-yellow-600 bg-yellow-100';
      case 'Poor':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.studentNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || student.status === filterStatus;
    const matchesGrade = filterGrade === 'all' || student.currentGrade === filterGrade;
    return matchesSearch && matchesStatus && matchesGrade;
  });

  const handleCreateStudent = () => {
    // In real app, this would call API
    const newStudent: Student = {
      id: `student-${Date.now()}`,
      firstName: formData.firstName || 'New',
      lastName: formData.lastName || 'Student',
      dateOfBirth: formData.dateOfBirth || new Date().toISOString().split('T')[0],
      gender: formData.gender || 'Male',
      studentNumber: formData.studentNumber || `STU${new Date().getFullYear()}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      status: 'Active',
      admissionDate: new Date().toISOString().split('T')[0],
      enrollmentStatus: 'Enrolled',
      currentGrade: formData.currentGrade || 'Form 1',
      currentStream: formData.currentStream || 'A',
      academicYear: '2024',
      term: 'Term 1',
      schoolId: 'school-001',
      schoolName: 'Harare High School',
      contact: formData.contact || {
        phone: '',
        address: '',
        city: '',
        province: '',
        postalCode: '',
        country: 'Zimbabwe',
      },
      medical: formData.medical || {
        allergies: [],
        medicalConditions: [],
        emergencyContact: '',
        emergencyPhone: '',
        emergencyRelationship: '',
      },
      academic: formData.academic || {
        totalCredits: 0,
        attendanceRate: 0,
        behaviorStatus: 'Good',
      },
      fees: formData.fees || {
        outstandingBalance: 0,
        paymentPlan: false,
        scholarship: false,
      },
      documents: formData.documents || {
        birthCertificate: false,
        nationalIdCard: false,
        passportPhoto: false,
        medicalForm: false,
        reportCard: false,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setStudents([...students, newStudent]);
    setShowCreateModal(false);
    setFormData({});
  };

  const handleUpdateStudent = () => {
    if (!editingStudent) return;
    
    setStudents(students.map(student => 
      student.id === editingStudent.id 
        ? { ...student, ...formData }
        : student
    ));
    setEditingStudent(null);
    setFormData({});
  };

  const handleDeleteStudent = (studentId: string) => {
    setStudents(students.filter(student => student.id !== studentId));
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
              Student Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage student records, enrollment, and academic information
            </p>
          </div>
          <div className="flex gap-3">
            <button className="btn btn-secondary">
              <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
              Export
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn btn-primary"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Student
            </button>
          </div>
        </div>
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
                  placeholder="Search students..."
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
                <option value="Graduated">Graduated</option>
                <option value="Transferred">Transferred</option>
                <option value="Withdrawn">Withdrawn</option>
              </select>
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
              <button className="btn btn-secondary">
                <FunnelIcon className="w-4 h-4 mr-2" />
                Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map((student, index) => (
          <motion.div
            key={student.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card card-hover"
          >
            <div className="card-body">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <UserIcon className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {student.firstName} {student.lastName}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {student.studentNumber}
                    </p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(student.status)}`}>
                  {student.status}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Grade</span>
                  <span className="text-sm text-gray-500 dark:text-gray-500">
                    {student.currentGrade} - {student.currentStream}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Age</span>
                  <span className="text-sm text-gray-500 dark:text-gray-500">
                    {new Date().getFullYear() - new Date(student.dateOfBirth).getFullYear()} years
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Guardian</span>
                  <span className="text-sm text-gray-500 dark:text-gray-500">
                    {student.guardianName}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Attendance</span>
                  <span className="text-sm text-gray-500 dark:text-gray-500">
                    {student.academic.attendanceRate}%
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Behavior</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${getBehaviorColor(student.academic.behaviorStatus)}`}>
                    {student.academic.behaviorStatus}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Fees</span>
                  <span className={`text-sm ${student.fees.outstandingBalance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    ${student.fees.outstandingBalance}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {student.fees.scholarship && (
                    <span className="text-xs px-2 py-1 bg-purple-100 text-purple-600 rounded">
                      Scholarship
                    </span>
                  )}
                  {student.fees.paymentPlan && (
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded">
                      Payment Plan
                    </span>
                  )}
                  {student.medical.allergies.length > 0 && (
                    <span className="text-xs px-2 py-1 bg-orange-100 text-orange-600 rounded">
                      Allergies
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingStudent(student);
                      setFormData(student);
                    }}
                    className="text-blue-600 hover:text-blue-800"
                    title="Edit Student"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteStudent(student.id)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete Student"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || editingStudent) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {editingStudent ? 'Edit Student' : 'Add New Student'}
              </h2>
              
              <div className="space-y-4">
                {/* Basic Information */}
                <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={formData.firstName || ''}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={formData.lastName || ''}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        value={formData.dateOfBirth || ''}
                        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Gender
                      </label>
                      <select
                        value={formData.gender || ''}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value as Student['gender'] })}
                        className="form-input"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Student Number
                      </label>
                      <input
                        type="text"
                        value={formData.studentNumber || ''}
                        onChange={(e) => setFormData({ ...formData, studentNumber: e.target.value })}
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        National ID
                      </label>
                      <input
                        type="text"
                        value={formData.nationalId || ''}
                        onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })}
                        className="form-input"
                      />
                    </div>
                  </div>
                </div>

                {/* Academic Information */}
                <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Academic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Current Grade
                      </label>
                      <select
                        value={formData.currentGrade || ''}
                        onChange={(e) => setFormData({ ...formData, currentGrade: e.target.value })}
                        className="form-input"
                      >
                        <option value="">Select Grade</option>
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
                        value={formData.currentStream || ''}
                        onChange={(e) => setFormData({ ...formData, currentStream: e.target.value })}
                        className="form-input"
                      >
                        <option value="">Select Stream</option>
                        <option value="A">Stream A</option>
                        <option value="B">Stream B</option>
                        <option value="C">Stream C</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Previous School
                      </label>
                      <input
                        type="text"
                        value={formData.academic?.previousSchool || ''}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          academic: { ...formData.academic, previousSchool: e.target.value }
                        })}
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Previous Grade
                      </label>
                      <input
                        type="text"
                        value={formData.academic?.previousGrade || ''}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          academic: { ...formData.academic, previousGrade: e.target.value }
                        })}
                        className="form-input"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Phone
                      </label>
                      <input
                        type="text"
                        value={formData.contact?.phone || ''}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          contact: { ...formData.contact, phone: e.target.value }
                        })}
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.contact?.email || ''}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          contact: { ...formData.contact, email: e.target.value }
                        })}
                        className="form-input"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Address
                      </label>
                      <input
                        type="text"
                        value={formData.contact?.address || ''}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          contact: { ...formData.contact, address: e.target.value }
                        })}
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        value={formData.contact?.city || ''}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          contact: { ...formData.contact, city: e.target.value }
                        })}
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Province
                      </label>
                      <input
                        type="text"
                        value={formData.contact?.province || ''}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          contact: { ...formData.contact, province: e.target.value }
                        })}
                        className="form-input"
                      />
                    </div>
                  </div>
                </div>

                {/* Guardian Information */}
                <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Guardian Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Guardian Name
                      </label>
                      <input
                        type="text"
                        value={formData.guardianName || ''}
                        onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Relationship
                      </label>
                      <select
                        value={formData.guardianRelationship || ''}
                        onChange={(e) => setFormData({ ...formData, guardianRelationship: e.target.value })}
                        className="form-input"
                      >
                        <option value="">Select Relationship</option>
                        <option value="Mother">Mother</option>
                        <option value="Father">Father</option>
                        <option value="Guardian">Guardian</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Guardian Phone
                      </label>
                      <input
                        type="text"
                        value={formData.guardianPhone || ''}
                        onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Guardian Email
                      </label>
                      <input
                        type="email"
                        value={formData.guardianEmail || ''}
                        onChange={(e) => setFormData({ ...formData, guardianEmail: e.target.value })}
                        className="form-input"
                      />
                    </div>
                  </div>
                </div>

                {/* Medical Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Medical Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Blood Type
                      </label>
                      <select
                        value={formData.medical?.bloodType || ''}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          medical: { ...formData.medical, bloodType: e.target.value }
                        })}
                        className="form-input"
                      >
                        <option value="">Select Blood Type</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Emergency Contact
                      </label>
                      <input
                        type="text"
                        value={formData.medical?.emergencyContact || ''}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          medical: { ...formData.medical, emergencyContact: e.target.value }
                        })}
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Emergency Phone
                      </label>
                      <input
                        type="text"
                        value={formData.medical?.emergencyPhone || ''}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          medical: { ...formData.medical, emergencyPhone: e.target.value }
                        })}
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Emergency Relationship
                      </label>
                      <input
                        type="text"
                        value={formData.medical?.emergencyRelationship || ''}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          medical: { ...formData.medical, emergencyRelationship: e.target.value }
                        })}
                        className="form-input"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingStudent(null);
                    setFormData({});
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={editingStudent ? handleUpdateStudent : handleCreateStudent}
                  className="btn btn-primary"
                >
                  {editingStudent ? 'Update Student' : 'Create Student'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
