import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BuildingOffice2Icon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  UserGroupIcon,
  AcademicCapIcon,
  CalendarIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';

// Types
interface School {
  id: string;
  name: string;
  code: string;
  type: 'Primary' | 'Secondary' | 'Combined' | 'Technical' | 'Special';
  status: 'Active' | 'Inactive' | 'Suspended';
  tenantId: string;
  tenantName: string;
  principalName: string;
  principalEmail: string;
  principalPhone: string;
  address: {
    street: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
  };
  contact: {
    phone: string;
    email: string;
    website?: string;
  };
  academic: {
    currentAcademicYear: string;
    currentTerm: string;
    totalStudents: number;
    totalTeachers: number;
    totalClasses: number;
    grades: string[];
  };
  facilities: {
    hasLibrary: boolean;
    hasLab: boolean;
    hasSportsGround: boolean;
    hasCanteen: boolean;
    hasComputerLab: boolean;
    hasAuditorium: boolean;
  };
  capacity: {
    maxStudents: number;
    maxTeachers: number;
    maxClasses: number;
  };
  establishedDate: string;
  registrationNumber: string;
  logoUrl?: string;
  settings: {
    allowOnlineRegistration: boolean;
    allowParentPortal: boolean;
    allowStudentPortal: boolean;
    allowTeacherPortal: boolean;
    enableSMSNotifications: boolean;
    enableEmailNotifications: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export const SchoolManagement: React.FC = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingSchool, setEditingSchool] = useState<School | null>(null);
  const [formData, setFormData] = useState<Partial<School>>({});

  // Mock data - in real app, this would come from API
  useEffect(() => {
    const loadSchools = async () => {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockSchools: School[] = [
        {
          id: 'school-001',
          name: 'Harare High School',
          code: 'HHS001',
          type: 'Secondary',
          status: 'Active',
          tenantId: 'tenant-001',
          tenantName: 'Harare School District',
          principalName: 'Dr. Sarah Johnson',
          principalEmail: 'principal@hararehigh.school',
          principalPhone: '+263 4 123 456',
          address: {
            street: '123 School Street',
            city: 'Harare',
            province: 'Harare',
            postalCode: '00123',
            country: 'Zimbabwe',
          },
          contact: {
            phone: '+263 4 123 456',
            email: 'info@hararehigh.school',
            website: 'www.hararehigh.school',
          },
          academic: {
            currentAcademicYear: '2024',
            currentTerm: 'Term 1',
            totalStudents: 850,
            totalTeachers: 45,
            totalClasses: 28,
            grades: ['Form 1', 'Form 2', 'Form 3', 'Form 4', 'Form 5', 'Form 6'],
          },
          facilities: {
            hasLibrary: true,
            hasLab: true,
            hasSportsGround: true,
            hasCanteen: true,
            hasComputerLab: true,
            hasAuditorium: true,
          },
          capacity: {
            maxStudents: 1000,
            maxTeachers: 50,
            maxClasses: 30,
          },
          establishedDate: '1985-01-15',
          registrationNumber: 'REG1985/001',
          logoUrl: '/api/placeholder/100/100',
          settings: {
            allowOnlineRegistration: true,
            allowParentPortal: true,
            allowStudentPortal: true,
            allowTeacherPortal: true,
            enableSMSNotifications: true,
            enableEmailNotifications: true,
          },
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z',
        },
        {
          id: 'school-002',
          name: 'Bulawayo Primary School',
          code: 'BPS001',
          type: 'Primary',
          status: 'Active',
          tenantId: 'tenant-001',
          tenantName: 'Harare School District',
          principalName: 'Mrs. Mary Smith',
          principalEmail: 'principal@bulawayoprimary.school',
          principalPhone: '+263 9 987 654',
          address: {
            street: '456 Education Avenue',
            city: 'Bulawayo',
            province: 'Bulawayo',
            postalCode: '00456',
            country: 'Zimbabwe',
          },
          contact: {
            phone: '+263 9 987 654',
            email: 'info@bulawayoprimary.school',
            website: 'www.bulawayoprimary.school',
          },
          academic: {
            currentAcademicYear: '2024',
            currentTerm: 'Term 1',
            totalStudents: 620,
            totalTeachers: 32,
            totalClasses: 22,
            grades: ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7'],
          },
          facilities: {
            hasLibrary: true,
            hasLab: false,
            hasSportsGround: true,
            hasCanteen: true,
            hasComputerLab: true,
            hasAuditorium: false,
          },
          capacity: {
            maxStudents: 800,
            maxTeachers: 40,
            maxClasses: 25,
          },
          establishedDate: '1992-03-20',
          registrationNumber: 'REG1992/002',
          logoUrl: '/api/placeholder/100/100',
          settings: {
            allowOnlineRegistration: true,
            allowParentPortal: true,
            allowStudentPortal: false,
            allowTeacherPortal: true,
            enableSMSNotifications: true,
            enableEmailNotifications: true,
          },
          createdAt: '2024-01-20T10:00:00Z',
          updatedAt: '2024-01-20T10:00:00Z',
        },
        {
          id: 'school-003',
          name: 'Mutare Technical College',
          code: 'MTC001',
          type: 'Technical',
          status: 'Active',
          tenantId: 'tenant-002',
          tenantName: 'Bulawayo Education Group',
          principalName: 'Mr. James Wilson',
          principalEmail: 'principal@mutaretech.school',
          principalPhone: '+263 20 555 123',
          address: {
            street: '789 Technical Road',
            city: 'Mutare',
            province: 'Manicaland',
            postalCode: '00789',
            country: 'Zimbabwe',
          },
          contact: {
            phone: '+263 20 555 123',
            email: 'info@mutaretech.school',
            website: 'www.mutaretech.school',
          },
          academic: {
            currentAcademicYear: '2024',
            currentTerm: 'Term 1',
            totalStudents: 450,
            totalTeachers: 28,
            totalClasses: 18,
            grades: ['Form 1', 'Form 2', 'Form 3', 'Form 4', 'Form 5', 'Form 6'],
          },
          facilities: {
            hasLibrary: true,
            hasLab: true,
            hasSportsGround: true,
            hasCanteen: true,
            hasComputerLab: true,
            hasAuditorium: true,
          },
          capacity: {
            maxStudents: 600,
            maxTeachers: 35,
            maxClasses: 20,
          },
          establishedDate: '2000-06-15',
          registrationNumber: 'REG2000/003',
          logoUrl: '/api/placeholder/100/100',
          settings: {
            allowOnlineRegistration: true,
            allowParentPortal: true,
            allowStudentPortal: true,
            allowTeacherPortal: true,
            enableSMSNotifications: false,
            enableEmailNotifications: true,
          },
          createdAt: '2024-02-01T10:00:00Z',
          updatedAt: '2024-02-01T10:00:00Z',
        },
      ];
      
      setSchools(mockSchools);
      setLoading(false);
    };

    loadSchools();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'text-success-600 bg-success-100';
      case 'Inactive':
        return 'text-gray-600 bg-gray-100';
      case 'Suspended':
        return 'text-error-600 bg-error-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Primary':
        return 'text-blue-600 bg-blue-100';
      case 'Secondary':
        return 'text-green-600 bg-green-100';
      case 'Combined':
        return 'text-purple-600 bg-purple-100';
      case 'Technical':
        return 'text-orange-600 bg-orange-100';
      case 'Special':
        return 'text-pink-600 bg-pink-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredSchools = schools.filter(school => {
    const matchesSearch = school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         school.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         school.principalName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || school.status === filterStatus;
    const matchesType = filterType === 'all' || school.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleCreateSchool = () => {
    // In real app, this would call API
    const newSchool: School = {
      id: `school-${Date.now()}`,
      name: formData.name || 'New School',
      code: formData.code || 'NEW001',
      type: formData.type || 'Primary',
      status: 'Active',
      tenantId: formData.tenantId || 'tenant-001',
      tenantName: formData.tenantName || 'Default Tenant',
      principalName: formData.principalName || '',
      principalEmail: formData.principalEmail || '',
      principalPhone: formData.principalPhone || '',
      address: formData.address || {
        street: '',
        city: '',
        province: '',
        postalCode: '',
        country: 'Zimbabwe',
      },
      contact: formData.contact || {
        phone: '',
        email: '',
      },
      academic: formData.academic || {
        currentAcademicYear: '2024',
        currentTerm: 'Term 1',
        totalStudents: 0,
        totalTeachers: 0,
        totalClasses: 0,
        grades: [],
      },
      facilities: formData.facilities || {
        hasLibrary: false,
        hasLab: false,
        hasSportsGround: false,
        hasCanteen: false,
        hasComputerLab: false,
        hasAuditorium: false,
      },
      capacity: formData.capacity || {
        maxStudents: 500,
        maxTeachers: 30,
        maxClasses: 20,
      },
      establishedDate: formData.establishedDate || new Date().toISOString().split('T')[0],
      registrationNumber: formData.registrationNumber || '',
      settings: formData.settings || {
        allowOnlineRegistration: false,
        allowParentPortal: false,
        allowStudentPortal: false,
        allowTeacherPortal: false,
        enableSMSNotifications: false,
        enableEmailNotifications: false,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setSchools([...schools, newSchool]);
    setShowCreateModal(false);
    setFormData({});
  };

  const handleUpdateSchool = () => {
    if (!editingSchool) return;
    
    // In real app, this would call API
    setSchools(schools.map(school => 
      school.id === editingSchool.id 
        ? { ...school, ...formData }
        : school
    ));
    setEditingSchool(null);
    setFormData({});
  };

  const handleDeleteSchool = (schoolId: string) => {
    // In real app, this would call API
    setSchools(schools.filter(school => school.id !== schoolId));
  };

  const handleStatusChange = (schoolId: string, newStatus: string) => {
    // In real app, this would call API
    setSchools(schools.map(school => 
      school.id === schoolId 
        ? { ...school, status: newStatus as School['status'] }
        : school
    ));
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
              School Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage schools and their academic programs
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Add School
          </button>
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
                  placeholder="Search schools..."
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
                <option value="Suspended">Suspended</option>
              </select>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="form-input"
              >
                <option value="all">All Types</option>
                <option value="Primary">Primary</option>
                <option value="Secondary">Secondary</option>
                <option value="Combined">Combined</option>
                <option value="Technical">Technical</option>
                <option value="Special">Special</option>
              </select>
              <button className="btn btn-secondary">
                <FunnelIcon className="w-4 h-4 mr-2" />
                Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Schools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSchools.map((school, index) => (
          <motion.div
            key={school.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card card-hover"
          >
            <div className="card-body">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {school.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {school.code} • {school.type}
                  </p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(school.status)}`}>
                  {school.status}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Type</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(school.type)}`}>
                    {school.type}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Students</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {school.academic.totalStudents}/{school.capacity.maxStudents}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Teachers</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {school.academic.totalTeachers}/{school.capacity.maxTeachers}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Classes</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {school.academic.totalClasses}/{school.capacity.maxClasses}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Principal</span>
                  <span className="text-sm text-gray-500 dark:text-gray-500">
                    {school.principalName}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Location</span>
                  <span className="text-sm text-gray-500 dark:text-gray-500">
                    {school.address.city}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Academic Year</span>
                  <span className="text-sm text-gray-500 dark:text-gray-500">
                    {school.academic.currentAcademicYear} - {school.academic.currentTerm}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {school.facilities.hasLibrary && (
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded">
                      Library
                    </span>
                  )}
                  {school.facilities.hasLab && (
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded">
                      Lab
                    </span>
                  )}
                  {school.facilities.hasSportsGround && (
                    <span className="text-xs px-2 py-1 bg-purple-100 text-purple-600 rounded">
                      Sports
                    </span>
                  )}
                  {school.facilities.hasComputerLab && (
                    <span className="text-xs px-2 py-1 bg-orange-100 text-orange-600 rounded">
                      IT Lab
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingSchool(school);
                      setFormData(school);
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteSchool(school.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex gap-2">
                  {school.status === 'Active' && (
                    <button
                      onClick={() => handleStatusChange(school.id, 'Suspended')}
                      className="text-yellow-600 hover:text-yellow-800"
                    >
                      <XCircleIcon className="w-4 h-4" />
                    </button>
                  )}
                  {school.status === 'Suspended' && (
                    <button
                      onClick={() => handleStatusChange(school.id, 'Active')}
                      className="text-green-600 hover:text-green-800"
                    >
                      <CheckCircleIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || editingSchool) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {editingSchool ? 'Edit School' : 'Create New School'}
              </h2>
              
              <div className="space-y-4">
                {/* Basic Information */}
                <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        School Name
                      </label>
                      <input
                        type="text"
                        value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        School Code
                      </label>
                      <input
                        type="text"
                        value={formData.code || ''}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        School Type
                      </label>
                      <select
                        value={formData.type || ''}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value as School['type'] })}
                        className="form-input"
                      >
                        <option value="Primary">Primary</option>
                        <option value="Secondary">Secondary</option>
                        <option value="Combined">Combined</option>
                        <option value="Technical">Technical</option>
                        <option value="Special">Special</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Registration Number
                      </label>
                      <input
                        type="text"
                        value={formData.registrationNumber || ''}
                        onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                        className="form-input"
                      />
                    </div>
                  </div>
                </div>

                {/* Principal Information */}
                <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Principal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Principal Name
                      </label>
                      <input
                        type="text"
                        value={formData.principalName || ''}
                        onChange={(e) => setFormData({ ...formData, principalName: e.target.value })}
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Principal Email
                      </label>
                      <input
                        type="email"
                        value={formData.principalEmail || ''}
                        onChange={(e) => setFormData({ ...formData, principalEmail: e.target.value })}
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Principal Phone
                      </label>
                      <input
                        type="text"
                        value={formData.principalPhone || ''}
                        onChange={(e) => setFormData({ ...formData, principalPhone: e.target.value })}
                        className="form-input"
                      />
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Address Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Street Address
                      </label>
                      <input
                        type="text"
                        value={formData.address?.street || ''}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          address: { ...formData.address, street: e.target.value }
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
                        value={formData.address?.city || ''}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          address: { ...formData.address, city: e.target.value }
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
                        value={formData.address?.province || ''}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          address: { ...formData.address, province: e.target.value }
                        })}
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        value={formData.address?.postalCode || ''}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          address: { ...formData.address, postalCode: e.target.value }
                        })}
                        className="form-input"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Website
                      </label>
                      <input
                        type="text"
                        value={formData.contact?.website || ''}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          contact: { ...formData.contact, website: e.target.value }
                        })}
                        className="form-input"
                      />
                    </div>
                  </div>
                </div>

                {/* Academic Information */}
                <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Academic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Academic Year
                      </label>
                      <input
                        type="text"
                        value={formData.academic?.currentAcademicYear || ''}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          academic: { ...formData.academic, currentAcademicYear: e.target.value }
                        })}
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Current Term
                      </label>
                      <select
                        value={formData.academic?.currentTerm || ''}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          academic: { ...formData.academic, currentTerm: e.target.value }
                        })}
                        className="form-input"
                      >
                        <option value="Term 1">Term 1</option>
                        <option value="Term 2">Term 2</option>
                        <option value="Term 3">Term 3</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Established Date
                      </label>
                      <input
                        type="date"
                        value={formData.establishedDate || ''}
                        onChange={(e) => setFormData({ ...formData, establishedDate: e.target.value })}
                        className="form-input"
                      />
                    </div>
                  </div>
                </div>

                {/* Capacity Information */}
                <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Capacity Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Max Students
                      </label>
                      <input
                        type="number"
                        value={formData.capacity?.maxStudents || ''}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          capacity: { ...formData.capacity, maxStudents: parseInt(e.target.value) }
                        })}
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Max Teachers
                      </label>
                      <input
                        type="number"
                        value={formData.capacity?.maxTeachers || ''}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          capacity: { ...formData.capacity, maxTeachers: parseInt(e.target.value) }
                        })}
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Max Classes
                      </label>
                      <input
                        type="number"
                        value={formData.capacity?.maxClasses || ''}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          capacity: { ...formData.capacity, maxClasses: parseInt(e.target.value) }
                        })}
                        className="form-input"
                      />
                    </div>
                  </div>
                </div>

                {/* Facilities */}
                <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Facilities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.facilities?.hasLibrary || false}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          facilities: { ...formData.facilities, hasLibrary: e.target.checked }
                        })}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Library</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.facilities?.hasLab || false}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          facilities: { ...formData.facilities, hasLab: e.target.checked }
                        })}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Laboratory</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.facilities?.hasSportsGround || false}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          facilities: { ...formData.facilities, hasSportsGround: e.target.checked }
                        })}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Sports Ground</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.facilities?.hasCanteen || false}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          facilities: { ...formData.facilities, hasCanteen: e.target.checked }
                        })}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Canteen</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.facilities?.hasComputerLab || false}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          facilities: { ...formData.facilities, hasComputerLab: e.target.checked }
                        })}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Computer Lab</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.facilities?.hasAuditorium || false}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          facilities: { ...formData.facilities, hasAuditorium: e.target.checked }
                        })}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Auditorium</span>
                    </label>
                  </div>
                </div>

                {/* Settings */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Settings</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.settings?.allowOnlineRegistration || false}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          settings: { ...formData.settings, allowOnlineRegistration: e.target.checked }
                        })}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Allow Online Registration</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.settings?.allowParentPortal || false}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          settings: { ...formData.settings, allowParentPortal: e.target.checked }
                        })}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Allow Parent Portal</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.settings?.allowStudentPortal || false}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          settings: { ...formData.settings, allowStudentPortal: e.target.checked }
                        })}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Allow Student Portal</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.settings?.allowTeacherPortal || false}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          settings: { ...formData.settings, allowTeacherPortal: e.target.checked }
                        })}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Allow Teacher Portal</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.settings?.enableSMSNotifications || false}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          settings: { ...formData.settings, enableSMSNotifications: e.target.checked }
                        })}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Enable SMS Notifications</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.settings?.enableEmailNotifications || false}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          settings: { ...formData.settings, enableEmailNotifications: e.target.checked }
                        })}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Enable Email Notifications</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingSchool(null);
                    setFormData({});
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={editingSchool ? handleUpdateSchool : handleCreateSchool}
                  className="btn btn-primary"
                >
                  {editingSchool ? 'Update School' : 'Create School'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
