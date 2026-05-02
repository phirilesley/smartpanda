import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheckIcon,
  CogIcon,
  UserGroupIcon,
  ChartBarIcon,
  DocumentTextIcon,
  BellIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  UserIcon,
  BuildingOfficeIcon,
  AcademicCapIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  GlobeAltIcon,
  ServerIcon,
  KeyIcon,
  LockClosedIcon,
  DocumentArrowDownIcon,
  ArrowPathIcon,
  TruckIcon,
  ClipboardDocumentListIcon,
  UsersIcon,
  BookOpenIcon,
  BriefcaseIcon,
  BanknotesIcon,
} from '@heroicons/react/24/outline';

// Types
interface SystemUser {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'Super Admin' | 'Admin' | 'Manager' | 'Supervisor' | 'Operator';
  department: string;
  status: 'Active' | 'Inactive' | 'Suspended' | 'Pending';
  lastLogin?: string;
  loginCount: number;
  permissions: string[];
  twoFactorEnabled: boolean;
  createdDate: string;
  updatedDate: string;
}

interface SystemModule {
  id: string;
  name: string;
  description: string;
  category: 'Core' | 'Academic' | 'Finance' | 'Operations' | 'Communication' | 'Reports';
  status: 'Active' | 'Inactive' | 'Maintenance';
  version: string;
  dependencies: string[];
  userCount: number;
  lastUpdated: string;
  features: string[];
  permissions: string[];
}

interface SystemLog {
  id: string;
  timestamp: string;
  level: 'Info' | 'Warning' | 'Error' | 'Critical';
  category: 'Security' | 'System' | 'User' | 'Data' | 'Performance';
  message: string;
  details?: string;
  userId?: string;
  userName?: string;
  ipAddress?: string;
  userAgent?: string;
  resolved: boolean;
  resolvedBy?: string;
  resolvedAt?: string;
}

interface SystemBackup {
  id: string;
  name: string;
  type: 'Full' | 'Incremental' | 'Differential';
  size: number;
  status: 'Completed' | 'In Progress' | 'Failed' | 'Scheduled';
  scheduledDate: string;
  completedDate?: string;
  location: string;
  retentionPeriod: number;
  createdBy: string;
  description?: string;
  automatic: boolean;
  encrypted: boolean;
}

interface SystemAlert {
  id: string;
  type: 'System' | 'Security' | 'Performance' | 'Storage' | 'Backup' | 'Update';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  title: string;
  message: string;
  timestamp: string;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  resolved: boolean;
  resolvedBy?: string;
  resolvedAt?: string;
  actionRequired: boolean;
  actionTaken?: string;
}

interface SystemSettings {
  id: string;
  category: 'General' | 'Security' | 'Email' | 'Backup' | 'Performance' | 'Integration';
  key: string;
  value: string;
  description: string;
  type: 'string' | 'number' | 'boolean' | 'json';
  editable: boolean;
  requiresRestart: boolean;
  lastModified: string;
  modifiedBy: string;
}

export const AdminPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'modules' | 'logs' | 'backups' | 'alerts' | 'settings'>('dashboard');
  const [systemUsers, setSystemUsers] = useState<SystemUser[]>([]);
  const [systemModules, setSystemModules] = useState<SystemModule[]>([]);
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>([]);
  const [systemBackups, setSystemBackups] = useState<SystemBackup[]>([]);
  const [systemAlerts, setSystemAlerts] = useState<SystemAlert[]>([]);
  const [systemSettings, setSystemSettings] = useState<SystemSettings[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null);
  const [formData, setFormData] = useState<Partial<SystemUser | SystemBackup>>({});

  // Mock data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock system users
      const mockUsers: SystemUser[] = [
        {
          id: 'user-001',
          username: 'admin',
          email: 'admin@smartpanda.edu',
          firstName: 'System',
          lastName: 'Administrator',
          role: 'Super Admin',
          department: 'IT',
          status: 'Active',
          lastLogin: '2024-02-20T14:30:00Z',
          loginCount: 1247,
          permissions: ['all'],
          twoFactorEnabled: true,
          createdDate: '2023-01-01T00:00:00Z',
          updatedDate: '2024-02-20T14:30:00Z',
        },
        {
          id: 'user-002',
          username: 'academic_admin',
          email: 'academic.admin@smartpanda.edu',
          firstName: 'Sarah',
          lastName: 'Johnson',
          role: 'Admin',
          department: 'Academic',
          status: 'Active',
          lastLogin: '2024-02-20T09:15:00Z',
          loginCount: 892,
          permissions: ['academic', 'students', 'exams', 'results'],
          twoFactorEnabled: true,
          createdDate: '2023-02-15T00:00:00Z',
          updatedDate: '2024-02-20T09:15:00Z',
        },
        {
          id: 'user-003',
          username: 'finance_manager',
          email: 'finance.manager@smartpanda.edu',
          firstName: 'Michael',
          lastName: 'Brown',
          role: 'Manager',
          department: 'Finance',
          status: 'Active',
          lastLogin: '2024-02-19T16:45:00Z',
          loginCount: 567,
          permissions: ['finance', 'fees', 'expenses', 'reports'],
          twoFactorEnabled: false,
          createdDate: '2023-03-10T00:00:00Z',
          updatedDate: '2024-02-19T16:45:00Z',
        },
        {
          id: 'user-004',
          username: 'operations_supervisor',
          email: 'ops.supervisor@smartpanda.edu',
          firstName: 'Emily',
          lastName: 'Davis',
          role: 'Supervisor',
          department: 'Operations',
          status: 'Active',
          lastLogin: '2024-02-20T11:20:00Z',
          loginCount: 423,
          permissions: ['operations', 'inventory', 'facilities'],
          twoFactorEnabled: true,
          createdDate: '2023-04-20T00:00:00Z',
          updatedDate: '2024-02-20T11:20:00Z',
        },
      ];

      // Mock system modules
      const mockModules: SystemModule[] = [
        {
          id: 'mod-001',
          name: 'User Management',
          description: 'Complete user administration and role management',
          category: 'Core',
          status: 'Active',
          version: '2.1.0',
          dependencies: ['Authentication', 'Database'],
          userCount: 1247,
          lastUpdated: '2024-02-15',
          features: ['User CRUD', 'Role Management', 'Permissions', '2FA', 'Audit Logs'],
          permissions: ['users.read', 'users.write', 'users.delete', 'roles.manage'],
        },
        {
          id: 'mod-002',
          name: 'Academic Management',
          description: 'Student records, grades, and academic performance',
          category: 'Academic',
          status: 'Active',
          version: '3.2.1',
          dependencies: ['User Management', 'Database'],
          userCount: 892,
          lastUpdated: '2024-02-18',
          features: ['Student Records', 'Grade Management', 'Attendance', 'Transcripts'],
          permissions: ['academic.read', 'academic.write', 'grades.manage', 'reports.generate'],
        },
        {
          id: 'mod-003',
          name: 'Finance Management',
          description: 'Fee collection, expense tracking, and financial reporting',
          category: 'Finance',
          status: 'Active',
          version: '2.5.0',
          dependencies: ['User Management', 'Payment Gateway'],
          userCount: 567,
          lastUpdated: '2024-02-10',
          features: ['Fee Management', 'Invoicing', 'Payment Processing', 'Financial Reports'],
          permissions: ['finance.read', 'finance.write', 'payments.process', 'reports.finance'],
        },
        {
          id: 'mod-004',
          name: 'Examination System',
          description: 'Exam scheduling, result management, and analytics',
          category: 'Academic',
          status: 'Active',
          version: '1.8.2',
          dependencies: ['Academic Management', 'Notifications'],
          userCount: 445,
          lastUpdated: '2024-02-12',
          features: ['Exam Scheduling', 'Result Management', 'Analytics', 'External Integration'],
          permissions: ['exams.read', 'exams.write', 'results.manage', 'analytics.view'],
        },
      ];

      // Mock system logs
      const mockLogs: SystemLog[] = [
        {
          id: 'log-001',
          timestamp: '2024-02-20T14:30:00Z',
          level: 'Info',
          category: 'User',
          message: 'User admin logged in successfully',
          userId: 'user-001',
          userName: 'System Administrator',
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          resolved: true,
        },
        {
          id: 'log-002',
          timestamp: '2024-02-20T14:25:00Z',
          level: 'Warning',
          category: 'Security',
          message: 'Multiple failed login attempts detected',
          details: '5 failed attempts from IP 192.168.1.200 for user test',
          ipAddress: '192.168.1.200',
          resolved: false,
        },
        {
          id: 'log-003',
          timestamp: '2024-02-20T14:20:00Z',
          level: 'Error',
          category: 'System',
          message: 'Database connection timeout',
          details: 'Connection to primary database failed after 30 seconds',
          resolved: true,
          resolvedBy: 'admin',
          resolvedAt: '2024-02-20T14:22:00Z',
        },
        {
          id: 'log-004',
          timestamp: '2024-02-20T14:15:00Z',
          level: 'Critical',
          category: 'Security',
          message: 'Unauthorized access attempt detected',
          details: 'Attempt to access admin panel without proper permissions',
          userId: 'user-999',
          ipAddress: '192.168.1.250',
          resolved: true,
          resolvedBy: 'admin',
          resolvedAt: '2024-02-20T14:16:00Z',
        },
      ];

      // Mock system backups
      const mockBackups: SystemBackup[] = [
        {
          id: 'backup-001',
          name: 'Daily Full Backup',
          type: 'Full',
          size: 2147483648,
          status: 'Completed',
          scheduledDate: '2024-02-20T02:00:00Z',
          completedDate: '2024-02-20T02:45:00Z',
          location: 's3://backups/smartpanda/daily/',
          retentionPeriod: 30,
          createdBy: 'system',
          description: 'Automated daily full system backup',
          automatic: true,
          encrypted: true,
        },
        {
          id: 'backup-002',
          name: 'Weekly Incremental Backup',
          type: 'Incremental',
          size: 536870912,
          status: 'Completed',
          scheduledDate: '2024-02-19T02:00:00Z',
          completedDate: '2024-02-19T02:15:00Z',
          location: 's3://backups/smartpanda/weekly/',
          retentionPeriod: 90,
          createdBy: 'system',
          description: 'Automated weekly incremental backup',
          automatic: true,
          encrypted: true,
        },
        {
          id: 'backup-003',
          name: 'Manual Backup Before Update',
          type: 'Full',
          size: 2147483648,
          status: 'Completed',
          scheduledDate: '2024-02-18T15:00:00Z',
          completedDate: '2024-02-18T15:35:00Z',
          location: 's3://backups/smartpanda/manual/',
          retentionPeriod: 365,
          createdBy: 'admin',
          description: 'Manual backup before system update',
          automatic: false,
          encrypted: true,
        },
      ];

      // Mock system alerts
      const mockAlerts: SystemAlert[] = [
        {
          id: 'alert-001',
          type: 'Security',
          severity: 'High',
          title: 'Suspicious Login Activity',
          message: 'Multiple failed login attempts from unknown IP addresses',
          timestamp: '2024-02-20T14:25:00Z',
          acknowledged: false,
          actionRequired: true,
        },
        {
          id: 'alert-002',
          type: 'System',
          severity: 'Medium',
          title: 'Database Performance Degradation',
          message: 'Database response time increased by 40%',
          timestamp: '2024-02-20T13:45:00Z',
          acknowledged: true,
          acknowledgedBy: 'admin',
          acknowledgedAt: '2024-02-20T13:50:00Z',
          actionRequired: false,
        },
        {
          id: 'alert-003',
          type: 'Storage',
          severity: 'Low',
          title: 'Disk Space Warning',
          message: 'Available disk space below 20%',
          timestamp: '2024-02-20T12:30:00Z',
          acknowledged: true,
          acknowledgedBy: 'system',
          acknowledgedAt: '2024-02-20T12:35:00Z',
          resolved: true,
          resolvedBy: 'admin',
          resolvedAt: '2024-02-20T13:00:00Z',
          actionRequired: false,
        },
      ];

      // Mock system settings
      const mockSettings: SystemSettings[] = [
        {
          id: 'setting-001',
          category: 'General',
          key: 'system_name',
          value: 'Smart Panda School System',
          description: 'Name of the school management system',
          type: 'string',
          editable: true,
          requiresRestart: false,
          lastModified: '2024-02-15T10:00:00Z',
          modifiedBy: 'admin',
        },
        {
          id: 'setting-002',
          category: 'Security',
          key: 'session_timeout',
          value: '3600',
          description: 'Session timeout in seconds',
          type: 'number',
          editable: true,
          requiresRestart: false,
          lastModified: '2024-02-10T15:30:00Z',
          modifiedBy: 'admin',
        },
        {
          id: 'setting-003',
          category: 'Security',
          key: 'require_2fa',
          value: 'true',
          description: 'Require two-factor authentication for admin users',
          type: 'boolean',
          editable: true,
          requiresRestart: false,
          lastModified: '2024-02-01T09:00:00Z',
          modifiedBy: 'admin',
        },
        {
          id: 'setting-004',
          category: 'Email',
          key: 'smtp_host',
          value: 'smtp.smartpanda.edu',
          description: 'SMTP server hostname',
          type: 'string',
          editable: true,
          requiresRestart: true,
          lastModified: '2024-01-20T14:00:00Z',
          modifiedBy: 'admin',
        },
      ];
      
      setSystemUsers(mockUsers);
      setSystemModules(mockModules);
      setSystemLogs(mockLogs);
      setSystemBackups(mockBackups);
      setSystemAlerts(mockAlerts);
      setSystemSettings(mockSettings);
      setLoading(false);
    };

    loadData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
      case 'Completed':
        return 'text-success-600 bg-success-100';
      case 'Inactive':
      case 'Failed':
        return 'text-red-600 bg-red-100';
      case 'Pending':
      case 'In Progress':
      case 'Scheduled':
        return 'text-warning-600 bg-warning-100';
      case 'Suspended':
      case 'Maintenance':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Critical':
        return 'text-red-600 bg-red-100';
      case 'Error':
        return 'text-orange-600 bg-orange-100';
      case 'Warning':
        return 'text-yellow-600 bg-yellow-100';
      case 'Info':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return 'text-red-600 bg-red-100';
      case 'High':
        return 'text-orange-600 bg-orange-100';
      case 'Medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'Low':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Core':
        return 'text-purple-600 bg-purple-100';
      case 'Academic':
        return 'text-blue-600 bg-blue-100';
      case 'Finance':
        return 'text-green-600 bg-green-100';
      case 'Operations':
        return 'text-orange-600 bg-orange-100';
      case 'Communication':
        return 'text-indigo-600 bg-indigo-100';
      case 'Reports':
        return 'text-pink-600 bg-pink-100';
      case 'Security':
        return 'text-red-600 bg-red-100';
      case 'System':
        return 'text-gray-600 bg-gray-100';
      case 'User':
        return 'text-blue-600 bg-blue-100';
      case 'Data':
        return 'text-purple-600 bg-purple-100';
      case 'Performance':
        return 'text-yellow-600 bg-yellow-100';
      case 'Storage':
        return 'text-orange-600 bg-orange-100';
      case 'Backup':
        return 'text-green-600 bg-green-100';
      case 'Update':
        return 'text-indigo-600 bg-indigo-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredUsers = systemUsers.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.lastName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const filteredLogs = systemLogs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = filterLevel === 'all' || log.level === filterLevel;
    return matchesSearch && matchesLevel;
  });

  const handleCreateUser = () => {
    // In real app, this would call API
    const newUser: SystemUser = {
      id: `user-${Date.now()}`,
      username: formData.username || 'newuser',
      email: formData.email || 'newuser@smartpanda.edu',
      firstName: formData.firstName || 'New',
      lastName: formData.lastName || 'User',
      role: formData.role as SystemUser['role'] || 'Operator',
      department: formData.department || 'General',
      status: 'Active',
      loginCount: 0,
      permissions: formData.permissions as string[] || [],
      twoFactorEnabled: false,
      createdDate: new Date().toISOString(),
      updatedDate: new Date().toISOString(),
    };
    
    setSystemUsers([...systemUsers, newUser]);
    setShowCreateModal(false);
    setFormData({});
  };

  const handleCreateBackup = () => {
    // In real app, this would call API
    const newBackup: SystemBackup = {
      id: `backup-${Date.now()}`,
      name: formData.name || 'Manual Backup',
      type: formData.type as SystemBackup['type'] || 'Full',
      size: 0,
      status: 'Scheduled',
      scheduledDate: new Date().toISOString(),
      location: formData.location || 's3://backups/smartpanda/manual/',
      retentionPeriod: formData.retentionPeriod || 30,
      createdBy: 'Current User',
      description: formData.description || 'Manual backup created by admin',
      automatic: false,
      encrypted: true,
    };
    
    setSystemBackups([...systemBackups, newBackup]);
    setShowBackupModal(false);
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
              Admin Portal
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              System administration, user management, and configuration
            </p>
          </div>
          <div className="flex gap-3">
            <button className="btn btn-secondary">
              <ArrowPathIcon className="w-4 h-4 mr-2" />
              System Status
            </button>
            {activeTab === 'users' && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn btn-primary"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Add User
              </button>
            )}
            {activeTab === 'backups' && (
              <button
                onClick={() => setShowBackupModal(true)}
                className="btn btn-primary"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Create Backup
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="flex space-x-8">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: ChartBarIcon },
            { id: 'users', label: 'Users', icon: UserGroupIcon },
            { id: 'modules', label: 'Modules', icon: CogIcon },
            { id: 'logs', label: 'System Logs', icon: DocumentTextIcon },
            { id: 'backups', label: 'Backups', icon: ServerIcon },
            { id: 'alerts', label: 'Alerts', icon: BellIcon },
            { id: 'settings', label: 'Settings', icon: ShieldCheckIcon },
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
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              {activeTab === 'users' && (
                <>
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="form-input"
                  >
                    <option value="all">All Roles</option>
                    <option value="Super Admin">Super Admin</option>
                    <option value="Admin">Admin</option>
                    <option value="Manager">Manager</option>
                    <option value="Supervisor">Supervisor</option>
                    <option value="Operator">Operator</option>
                  </select>
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
                </>
              )}
              {activeTab === 'logs' && (
                <select
                  value={filterLevel}
                  onChange={(e) => setFilterLevel(e.target.value)}
                  className="form-input"
                >
                  <option value="all">All Levels</option>
                  <option value="Critical">Critical</option>
                  <option value="Error">Error</option>
                  <option value="Warning">Warning</option>
                  <option value="Info">Info</option>
                </select>
              )}
              <button className="btn btn-secondary">
                <FunnelIcon className="w-4 h-4 mr-2" />
                Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
          >
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {systemUsers.length}
                  </p>
                </div>
                <UserGroupIcon className="w-8 h-8 text-blue-600" />
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
                  <p className="text-sm text-gray-600 dark:text-gray-400">Active Modules</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {systemModules.filter(m => m.status === 'Active').length}
                  </p>
                </div>
                <CogIcon className="w-8 h-8 text-green-600" />
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
                  <p className="text-sm text-gray-600 dark:text-gray-400">System Alerts</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {systemAlerts.filter(a => !a.resolved).length}
                  </p>
                </div>
                <BellIcon className="w-8 h-8 text-red-600" />
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
                  <p className="text-sm text-gray-600 dark:text-gray-400">Backups</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {systemBackups.filter(b => b.status === 'Completed').length}
                  </p>
                </div>
                <ServerIcon className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {activeTab === 'users' && (
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
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      @{user.username} • {user.department}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(user.status)}`}>
                    {user.status}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Email</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {user.email}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Role</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      user.role === 'Super Admin' ? 'text-red-600 bg-red-100' :
                      user.role === 'Admin' ? 'text-orange-600 bg-orange-100' :
                      user.role === 'Manager' ? 'text-blue-600 bg-blue-100' :
                      user.role === 'Supervisor' ? 'text-green-600 bg-green-100' :
                      'text-gray-600 bg-gray-100'
                    }`}>
                      {user.role}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Login Count</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {user.loginCount}
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
                      user.twoFactorEnabled ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
                    }`}>
                      {user.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {user.permissions.slice(0, 3).map((permission, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded">
                        {permission}
                      </span>
                    ))}
                    {user.permissions.length > 3 && (
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                        +{user.permissions.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-sm text-gray-500 dark:text-gray-500">
                    Created {new Date(user.createdDate).toLocaleDateString()}
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setSelectedUser(user)}
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

      {activeTab === 'modules' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {systemModules.map((module, index) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card card-hover"
            >
              <div className="card-body">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {module.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {module.description}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(module.status)}`}>
                    {module.status}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Category</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(module.category)}`}>
                      {module.category}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Version</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {module.version}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Active Users</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {module.userCount}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Last Updated</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {new Date(module.lastUpdated).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Features:</div>
                    <div className="flex flex-wrap gap-1">
                      {module.features.slice(0, 3).map((feature, i) => (
                        <span key={i} className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded">
                          {feature}
                        </span>
                      ))}
                      {module.features.length > 3 && (
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                          +{module.features.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Dependencies:</div>
                    <div className="flex flex-wrap gap-1">
                      {module.dependencies.map((dep, i) => (
                        <span key={i} className="text-xs px-2 py-1 bg-purple-100 text-purple-600 rounded">
                          {dep}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-sm text-gray-500 dark:text-gray-500">
                    ID: {module.id}
                  </div>
                  <div className="flex gap-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      <EyeIcon className="w-4 h-4" />
                    </button>
                    <button className="text-blue-600 hover:text-blue-800">
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button className="text-orange-600 hover:text-orange-800">
                      <ArrowPathIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'logs' && (
        <div className="space-y-4">
          {filteredLogs.map((log, index) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card"
            >
              <div className="card-body">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${getLevelColor(log.level)}`}>
                        {log.level}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(log.category)}`}>
                        {log.category}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-500">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                      {log.message}
                    </h4>
                    {log.details && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {log.details}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                      {log.userName && <span>User: {log.userName}</span>}
                      {log.ipAddress && <span>IP: {log.ipAddress}</span>}
                      {log.resolved && (
                        <span className="text-green-600">
                          Resolved by {log.resolvedBy} at {new Date(log.resolvedAt!).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!log.resolved && (
                      <button className="text-green-600 hover:text-green-800">
                        <CheckCircleIcon className="w-4 h-4" />
                      </button>
                    )}
                    <button className="text-blue-600 hover:text-blue-800">
                      <EyeIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'backups' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {systemBackups.map((backup, index) => (
            <motion.div
              key={backup.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card card-hover"
            >
              <div className="card-body">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {backup.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {backup.description}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(backup.status)}`}>
                    {backup.status}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Type</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      backup.type === 'Full' ? 'text-blue-600 bg-blue-100' :
                      backup.type === 'Incremental' ? 'text-green-600 bg-green-100' :
                      'text-purple-600 bg-purple-100'
                    }`}>
                      {backup.type}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Size</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {(backup.size / 1024 / 1024 / 1024).toFixed(2)} GB
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Scheduled</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {new Date(backup.scheduledDate).toLocaleString()}
                    </span>
                  </div>

                  {backup.completedDate && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Completed</span>
                      <span className="text-sm text-gray-500 dark:text-gray-500">
                        {new Date(backup.completedDate).toLocaleString()}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Retention</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {backup.retentionPeriod} days
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Created By</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {backup.createdBy}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {backup.automatic && (
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded">
                        Automatic
                      </span>
                    )}
                    {backup.encrypted && (
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded">
                        Encrypted
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-sm text-gray-500 dark:text-gray-500">
                    {backup.location}
                  </div>
                  <div className="flex gap-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      <EyeIcon className="w-4 h-4" />
                    </button>
                    <button className="text-blue-600 hover:text-blue-800">
                      <DocumentArrowDownIcon className="w-4 h-4" />
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

      {activeTab === 'alerts' && (
        <div className="space-y-4">
          {systemAlerts.map((alert, index) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card"
            >
              <div className="card-body">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${getSeverityColor(alert.severity)}`}>
                        {alert.severity}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(alert.type)}`}>
                        {alert.type}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-500">
                        {new Date(alert.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                      {alert.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {alert.message}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                      {alert.acknowledged && (
                        <span className="text-yellow-600">
                          Acknowledged by {alert.acknowledgedBy} at {new Date(alert.acknowledgedAt!).toLocaleString()}
                        </span>
                      )}
                      {alert.resolved && (
                        <span className="text-green-600">
                          Resolved by {alert.resolvedBy} at {new Date(alert.resolvedAt!).toLocaleString()}
                        </span>
                      )}
                      {alert.actionRequired && !alert.resolved && (
                        <span className="text-red-600 font-medium">
                          Action Required
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!alert.acknowledged && (
                      <button className="text-yellow-600 hover:text-yellow-800">
                        <BellIcon className="w-4 h-4" />
                      </button>
                    )}
                    {!alert.resolved && (
                      <button className="text-green-600 hover:text-green-800">
                        <CheckCircleIcon className="w-4 h-4" />
                      </button>
                    )}
                    <button className="text-blue-600 hover:text-blue-800">
                      <EyeIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {systemSettings.map((setting, index) => (
            <motion.div
              key={setting.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card card-hover"
            >
              <div className="card-body">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {setting.key}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {setting.description}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(setting.category)}`}>
                    {setting.category}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Value</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {setting.value}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Type</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {setting.type}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Editable</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      setting.editable ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
                    }`}>
                      {setting.editable ? 'Yes' : 'No'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Requires Restart</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      setting.requiresRestart ? 'text-orange-600 bg-orange-100' : 'text-green-600 bg-green-100'
                    }`}>
                      {setting.requiresRestart ? 'Yes' : 'No'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Last Modified</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {new Date(setting.lastModified).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Modified By</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {setting.modifiedBy}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-sm text-gray-500 dark:text-gray-500">
                    ID: {setting.id}
                  </div>
                  <div className="flex gap-2">
                    {setting.editable && (
                      <button className="text-blue-600 hover:text-blue-800">
                        <PencilIcon className="w-4 h-4" />
                      </button>
                    )}
                    <button className="text-blue-600 hover:text-blue-800">
                      <EyeIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full"
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Add System User
              </h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={formData.firstName || ''}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="form-input"
                      placeholder="First name"
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
                      placeholder="Last name"
                    />
                  </div>
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
                    placeholder="Username"
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
                    placeholder="Email address"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Role
                    </label>
                    <select
                      value={formData.role || ''}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="form-input"
                    >
                      <option value="Super Admin">Super Admin</option>
                      <option value="Admin">Admin</option>
                      <option value="Manager">Manager</option>
                      <option value="Supervisor">Supervisor</option>
                      <option value="Operator">Operator</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Department
                    </label>
                    <select
                      value={formData.department || ''}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="form-input"
                    >
                      <option value="IT">IT</option>
                      <option value="Academic">Academic</option>
                      <option value="Finance">Finance</option>
                      <option value="Operations">Operations</option>
                      <option value="General">General</option>
                    </select>
                  </div>
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
                  onClick={handleCreateUser}
                  className="btn btn-primary"
                >
                  Add User
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Create Backup Modal */}
      {showBackupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full"
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Create System Backup
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Backup Name
                  </label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="form-input"
                    placeholder="Backup name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Backup Type
                  </label>
                  <select
                    value={formData.type || ''}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="form-input"
                  >
                    <option value="Full">Full Backup</option>
                    <option value="Incremental">Incremental Backup</option>
                    <option value="Differential">Differential Backup</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location || ''}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="form-input"
                    placeholder="Backup location"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Retention Period (days)
                  </label>
                  <input
                    type="number"
                    value={formData.retentionPeriod || ''}
                    onChange={(e) => setFormData({ ...formData, retentionPeriod: parseInt(e.target.value) || 30 })}
                    className="form-input"
                    placeholder="30"
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
                    placeholder="Backup description..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowBackupModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateBackup}
                  className="btn btn-primary"
                >
                  Create Backup
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  User Details
                </h2>
                <button
                  onClick={() => setSelectedUser(null)}
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
                      <span className="text-gray-600 dark:text-gray-400">Name:</span>
                      <span className="text-gray-900 dark:text-white">{selectedUser.firstName} {selectedUser.lastName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Username:</span>
                      <span className="text-gray-900 dark:text-white">@{selectedUser.username}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Email:</span>
                      <span className="text-gray-900 dark:text-white">{selectedUser.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Department:</span>
                      <span className="text-gray-900 dark:text-white">{selectedUser.department}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Role:</span>
                      <span className="text-gray-900 dark:text-white">{selectedUser.role}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Activity & Security</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Status:</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(selectedUser.status)}`}>
                        {selectedUser.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Login Count:</span>
                      <span className="text-gray-900 dark:text-white">{selectedUser.loginCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Last Login:</span>
                      <span className="text-gray-900 dark:text-white">
                        {selectedUser.lastLogin ? new Date(selectedUser.lastLogin).toLocaleString() : 'Never'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">2FA Enabled:</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        selectedUser.twoFactorEnabled ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
                      }`}>
                        {selectedUser.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Created:</span>
                      <span className="text-gray-900 dark:text-white">
                        {new Date(selectedUser.createdDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Permissions</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedUser.permissions.map((permission, index) => (
                    <span key={index} className="text-xs px-3 py-1 bg-blue-100 text-blue-600 rounded-full">
                      {permission}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="btn btn-secondary"
                >
                  Close
                </button>
                <button className="btn btn-primary">
                  <PencilIcon className="w-4 h-4 mr-2" />
                  Edit User
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
