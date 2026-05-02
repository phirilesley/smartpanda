import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  UserIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  KeyIcon,
  ShieldCheckIcon,
  BuildingOffice2Icon,
  EnvelopeIcon,
  PhoneIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';

// Types
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  username: string;
  role: 'Admin' | 'Teacher' | 'Student' | 'Parent' | 'Staff';
  status: 'Active' | 'Inactive' | 'Suspended' | 'Pending';
  tenantId: string;
  tenantName: string;
  schoolId: string;
  schoolName: string;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
  permissions: string[];
  profile: {
    dateOfBirth?: string;
    gender?: 'Male' | 'Female' | 'Other';
    address?: string;
    emergencyContact?: string;
    emergencyPhone?: string;
  };
  settings: {
    allowEmailNotifications: boolean;
    allowSMSNotifications: boolean;
    allowPushNotifications: boolean;
    twoFactorEnabled: boolean;
    language: string;
    timezone: string;
  };
}

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<Partial<User>>({});

  // Mock data - in real app, this would come from API
  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUsers: User[] = [
        {
          id: 'user-001',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@smartpanda.school',
          phone: '+263 4 123 456',
          username: 'johndoe',
          role: 'Admin',
          status: 'Active',
          tenantId: 'tenant-001',
          tenantName: 'Harare School District',
          schoolId: 'school-001',
          schoolName: 'Harare High School',
          lastLogin: '2024-01-20T10:30:00Z',
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-20T10:30:00Z',
          permissions: ['user.create', 'user.update', 'user.delete', 'system.admin'],
          profile: {
            dateOfBirth: '1985-05-15',
            gender: 'Male',
            address: '123 Main St, Harare, Zimbabwe',
            emergencyContact: 'Jane Doe',
            emergencyPhone: '+263 4 123 457',
          },
          settings: {
            allowEmailNotifications: true,
            allowSMSNotifications: true,
            allowPushNotifications: true,
            twoFactorEnabled: true,
            language: 'en',
            timezone: 'Africa/Harare',
          },
        },
        {
          id: 'user-002',
          firstName: 'Sarah',
          lastName: 'Johnson',
          email: 'sarah.johnson@smartpanda.school',
          phone: '+263 4 987 654',
          username: 'sarahj',
          role: 'Teacher',
          status: 'Active',
          tenantId: 'tenant-001',
          tenantName: 'Harare School District',
          schoolId: 'school-001',
          schoolName: 'Harare High School',
          lastLogin: '2024-01-19T14:20:00Z',
          createdAt: '2024-01-10T10:00:00Z',
          updatedAt: '2024-01-19T14:20:00Z',
          permissions: ['attendance.mark', 'grades.enter', 'assignments.create'],
          profile: {
            dateOfBirth: '1990-03-20',
            gender: 'Female',
            address: '456 Teacher Ave, Harare, Zimbabwe',
            emergencyContact: 'Michael Johnson',
            emergencyPhone: '+263 4 987 655',
          },
          settings: {
            allowEmailNotifications: true,
            allowSMSNotifications: false,
            allowPushNotifications: true,
            twoFactorEnabled: false,
            language: 'en',
            timezone: 'Africa/Harare',
          },
        },
        {
          id: 'user-003',
          firstName: 'Michael',
          lastName: 'Smith',
          email: 'michael.smith@smartpanda.school',
          phone: '+263 9 555 123',
          username: 'mikesmith',
          role: 'Student',
          status: 'Active',
          tenantId: 'tenant-001',
          tenantName: 'Harare School District',
          schoolId: 'school-001',
          schoolName: 'Harare High School',
          lastLogin: '2024-01-18T09:15:00Z',
          createdAt: '2024-01-05T10:00:00Z',
          updatedAt: '2024-01-18T09:15:00Z',
          permissions: ['profile.view', 'grades.view', 'assignments.view'],
          profile: {
            dateOfBirth: '2005-08-10',
            gender: 'Male',
            address: '789 Student Rd, Harare, Zimbabwe',
            emergencyContact: 'Mrs. Smith',
            emergencyPhone: '+263 9 555 124',
          },
          settings: {
            allowEmailNotifications: true,
            allowSMSNotifications: true,
            allowPushNotifications: true,
            twoFactorEnabled: false,
            language: 'en',
            timezone: 'Africa/Harare',
          },
        },
        {
          id: 'user-004',
          firstName: 'Emily',
          lastName: 'Brown',
          email: 'emily.brown@smartpanda.school',
          phone: '+263 9 777 888',
          username: 'emilyb',
          role: 'Parent',
          status: 'Active',
          tenantId: 'tenant-001',
          tenantName: 'Harare School District',
          schoolId: 'school-001',
          schoolName: 'Harare High School',
          lastLogin: '2024-01-17T16:45:00Z',
          createdAt: '2024-01-08T10:00:00Z',
          updatedAt: '2024-01-17T16:45:00Z',
          permissions: ['children.view', 'grades.view', 'attendance.view', 'fees.view'],
          profile: {
            dateOfBirth: '1982-11-25',
            gender: 'Female',
            address: '321 Parent St, Harare, Zimbabwe',
            emergencyContact: 'Robert Brown',
            emergencyPhone: '+263 9 777 889',
          },
          settings: {
            allowEmailNotifications: true,
            allowSMSNotifications: true,
            allowPushNotifications: true,
            twoFactorEnabled: false,
            language: 'en',
            timezone: 'Africa/Harare',
          },
        },
      ];
      
      setUsers(mockUsers);
      setLoading(false);
    };

    loadUsers();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'text-success-600 bg-success-100';
      case 'Inactive':
        return 'text-gray-600 bg-gray-100';
      case 'Suspended':
        return 'text-error-600 bg-error-100';
      case 'Pending':
        return 'text-warning-600 bg-warning-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin':
        return 'text-purple-600 bg-purple-100';
      case 'Teacher':
        return 'text-blue-600 bg-blue-100';
      case 'Student':
        return 'text-green-600 bg-green-100';
      case 'Parent':
        return 'text-orange-600 bg-orange-100';
      case 'Staff':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesStatus && matchesRole;
  });

  const handleCreateUser = () => {
    // In real app, this would call API
    const newUser: User = {
      id: `user-${Date.now()}`,
      firstName: formData.firstName || 'New',
      lastName: formData.lastName || 'User',
      email: formData.email || 'newuser@smartpanda.school',
      phone: formData.phone || '+263 4 000 000',
      username: formData.username || 'newuser',
      role: formData.role || 'Student',
      status: 'Active',
      tenantId: formData.tenantId || 'tenant-001',
      tenantName: formData.tenantName || 'Default Tenant',
      schoolId: formData.schoolId || 'school-001',
      schoolName: formData.schoolName || 'Default School',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      permissions: formData.permissions || ['profile.view'],
      profile: formData.profile || {},
      settings: formData.settings || {
        allowEmailNotifications: true,
        allowSMSNotifications: false,
        allowPushNotifications: true,
        twoFactorEnabled: false,
        language: 'en',
        timezone: 'Africa/Harare',
      },
    };
    
    setUsers([...users, newUser]);
    setShowCreateModal(false);
    setFormData({});
  };

  const handleUpdateUser = () => {
    if (!editingUser) return;
    
    // In real app, this would call API
    setUsers(users.map(user => 
      user.id === editingUser.id 
        ? { ...user, ...formData }
        : user
    ));
    setEditingUser(null);
    setFormData({});
  };

  const handleDeleteUser = (userId: string) => {
    // In real app, this would call API
    setUsers(users.filter(user => user.id !== userId));
  };

  const handleStatusChange = (userId: string, newStatus: string) => {
    // In real app, this would call API
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: newStatus as User['status'] }
        : user
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
              User Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage users, roles, and permissions
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Add User
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
                  placeholder="Search users..."
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
                <option value="Pending">Pending</option>
              </select>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="form-input"
              >
                <option value="all">All Roles</option>
                <option value="Admin">Admin</option>
                <option value="Teacher">Teacher</option>
                <option value="Student">Student</option>
                <option value="Parent">Parent</option>
                <option value="Staff">Staff</option>
              </select>
              <button className="btn btn-secondary">
                <FunnelIcon className="w-4 h-4 mr-2" />
                Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user, index) => (
          <motion.div
            key={user.id}
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
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      @{user.username}
                    </p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(user.status)}`}>
                  {user.status}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Role</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${getRoleColor(user.role)}`}>
                    {user.role}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Email</span>
                  <span className="text-sm text-gray-500 dark:text-gray-500 truncate">
                    {user.email}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Phone</span>
                  <span className="text-sm text-gray-500 dark:text-gray-500">
                    {user.phone}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">School</span>
                  <span className="text-sm text-gray-500 dark:text-gray-500">
                    {user.schoolName}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Last Login</span>
                  <span className="text-sm text-gray-500 dark:text-gray-500">
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">2FA</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    user.settings.twoFactorEnabled 
                      ? 'text-success-600 bg-success-100' 
                      : 'text-gray-600 bg-gray-100'
                  }`}>
                    {user.settings.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {user.permissions.slice(0, 3).map((permission, index) => (
                    <span key={index} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                      {permission}
                    </span>
                  ))}
                  {user.permissions.length > 3 && (
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                      +{user.permissions.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingUser(user);
                      setFormData(user);
                    }}
                    className="text-blue-600 hover:text-blue-800"
                    title="Edit User"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete User"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                  <button
                    className="text-green-600 hover:text-green-800"
                    title="Reset Password"
                  >
                    <KeyIcon className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex gap-2">
                  {user.status === 'Active' && (
                    <button
                      onClick={() => handleStatusChange(user.id, 'Suspended')}
                      className="text-yellow-600 hover:text-yellow-800"
                      title="Suspend User"
                    >
                      <XCircleIcon className="w-4 h-4" />
                    </button>
                  )}
                  {user.status === 'Suspended' && (
                    <button
                      onClick={() => handleStatusChange(user.id, 'Active')}
                      className="text-green-600 hover:text-green-800"
                      title="Activate User"
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
      {(showCreateModal || editingUser) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {editingUser ? 'Edit User' : 'Create New User'}
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
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.email || ''}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Phone
                      </label>
                      <input
                        type="text"
                        value={formData.phone || ''}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Username
                      </label>
                      <input
                        type="text"
                        value={formData.username || ''}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Role
                      </label>
                      <select
                        value={formData.role || ''}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value as User['role'] })}
                        className="form-input"
                      >
                        <option value="Admin">Admin</option>
                        <option value="Teacher">Teacher</option>
                        <option value="Student">Student</option>
                        <option value="Parent">Parent</option>
                        <option value="Staff">Staff</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* School Assignment */}
                <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">School Assignment</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Tenant
                      </label>
                      <select
                        value={formData.tenantId || ''}
                        onChange={(e) => setFormData({ ...formData, tenantId: e.target.value })}
                        className="form-input"
                      >
                        <option value="tenant-001">Harare School District</option>
                        <option value="tenant-002">Bulawayo Education Group</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        School
                      </label>
                      <select
                        value={formData.schoolId || ''}
                        onChange={(e) => setFormData({ ...formData, schoolId: e.target.value })}
                        className="form-input"
                      >
                        <option value="school-001">Harare High School</option>
                        <option value="school-002">Bulawayo Primary School</option>
                        <option value="school-003">Mutare Technical College</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Profile Information */}
                <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Profile Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        value={formData.profile?.dateOfBirth || ''}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          profile: { ...formData.profile, dateOfBirth: e.target.value }
                        })}
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Gender
                      </label>
                      <select
                        value={formData.profile?.gender || ''}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          profile: { ...formData.profile, gender: e.target.value as User['profile']['gender'] }
                        })}
                        className="form-input"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Address
                      </label>
                      <input
                        type="text"
                        value={formData.profile?.address || ''}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          profile: { ...formData.profile, address: e.target.value }
                        })}
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Emergency Contact
                      </label>
                      <input
                        type="text"
                        value={formData.profile?.emergencyContact || ''}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          profile: { ...formData.profile, emergencyContact: e.target.value }
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
                        value={formData.profile?.emergencyPhone || ''}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          profile: { ...formData.profile, emergencyPhone: e.target.value }
                        })}
                        className="form-input"
                      />
                    </div>
                  </div>
                </div>

                {/* Settings */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Language
                      </label>
                      <select
                        value={formData.settings?.language || ''}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          settings: { ...formData.settings, language: e.target.value }
                        })}
                        className="form-input"
                      >
                        <option value="en">English</option>
                        <option value="sh">Shona</option>
                        <option value="nd">Ndebele</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Timezone
                      </label>
                      <select
                        value={formData.settings?.timezone || ''}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          settings: { ...formData.settings, timezone: e.target.value }
                        })}
                        className="form-input"
                      >
                        <option value="Africa/Harare">Africa/Harare</option>
                        <option value="Africa/Johannesburg">Africa/Johannesburg</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.settings?.allowEmailNotifications || false}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          settings: { ...formData.settings, allowEmailNotifications: e.target.checked }
                        })}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Email Notifications</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.settings?.allowSMSNotifications || false}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          settings: { ...formData.settings, allowSMSNotifications: e.target.checked }
                        })}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">SMS Notifications</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.settings?.allowPushNotifications || false}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          settings: { ...formData.settings, allowPushNotifications: e.target.checked }
                        })}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Push Notifications</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.settings?.twoFactorEnabled || false}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          settings: { ...formData.settings, twoFactorEnabled: e.target.checked }
                        })}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Two-Factor Authentication</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingUser(null);
                    setFormData({});
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={editingUser ? handleUpdateUser : handleCreateUser}
                  className="btn btn-primary"
                >
                  {editingUser ? 'Update User' : 'Create User'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
