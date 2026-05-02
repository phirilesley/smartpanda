import React, { useState, useEffect } from 'react';
import {
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  CalendarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  ChartBarIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  BellIcon,
  Cog6ToothIcon,
  UserGroupIcon,
  UserIcon,
  BuildingOfficeIcon,
  AcademicCapIcon,
  SparklesIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MinusIcon,
  EllipsisHorizontalIcon,
  EllipsisVerticalIcon,
  LockClosedIcon,
  KeyIcon,
  FingerprintIcon,
  ChipIcon,
  CloudIcon,
  DevicePhoneMobileIcon,
  DeviceTabletIcon,
  LaptopIcon,
  MonitorIcon,
  PaperAirplaneIcon,
  ArchiveBoxIcon,
  TagIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';

interface Memo {
  id: string;
  referenceNumber: string;
  title: string;
  description: string;
  type: 'internal' | 'external' | 'policy' | 'announcement' | 'request' | 'report' | 'complaint' | 'suggestion';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  subcategory?: string;
  content: string;
  attachments: {
    id: string;
    name: string;
    type: string;
    size: number;
    url: string;
    uploadDate: string;
  }[];
  sender: {
    id: string;
    name: string;
    email: string;
    department: string;
    role: string;
  };
  recipients: {
    id: string;
    name: string;
    email: string;
    department: string;
    role: string;
    type: 'to' | 'cc' | 'bcc';
    read: boolean;
    readDate?: string;
  }[];
  workflow: {
    currentStep: number;
    totalSteps: number;
    steps: {
      id: string;
      name: string;
      type: 'approval' | 'review' | 'acknowledgment' | 'information';
      assignee?: {
        id: string;
        name: string;
        email: string;
        department: string;
      };
      status: 'pending' | 'approved' | 'rejected' | 'skipped';
      completedDate?: string;
      comments?: string;
      attachments?: string[];
    }[];
  };
  status: 'draft' | 'submitted' | 'in_review' | 'approved' | 'rejected' | 'archived';
  metadata: {
    createdAt: string;
    submittedAt?: string;
    completedAt?: string;
    lastModified: string;
    version: number;
    tags: string[];
    confidential: boolean;
    retentionPeriod?: string;
  };
  actions: {
    id: string;
    type: 'comment' | 'approval' | 'rejection' | 'forward' | 'delegate';
    actionBy: string;
    actionDate: string;
    comments?: string;
    attachments?: string[];
  }[];
  reminders: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'custom';
    nextReminder?: string;
    reminderCount: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  type: 'linear' | 'parallel' | 'conditional';
  steps: {
    id: string;
    name: string;
    type: 'approval' | 'review' | 'acknowledgment' | 'information';
    assigneeType: 'specific' | 'role' | 'department' | 'dynamic';
    assignee?: string;
    required: boolean;
    timeout?: number;
    timeoutAction: 'approve' | 'reject' | 'escalate';
    conditions?: {
      field: string;
      operator: string;
      value: string;
    }[];
  }[];
  isDefault: boolean;
  isActive: boolean;
  usageCount: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface ApprovalRule {
  id: string;
  name: string;
  description: string;
  category: string;
  conditions: {
    field: string;
    operator: string;
    value: string;
    logicalOperator?: 'and' | 'or';
  }[];
  actions: {
    type: 'assign' | 'skip' | 'require' | 'notify';
    target: string;
    parameters?: any;
  }[];
  priority: number;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface MemoCategory {
  id: string;
  name: string;
  description: string;
  parentId?: string;
  workflowTemplate?: string;
  approvalRequired: boolean;
  defaultPriority: 'low' | 'medium' | 'high' | 'urgent';
  retentionPeriod: number;
  isActive: boolean;
  color: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
}

const MemoApprovalWorkflow: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'memos' | 'templates' | 'workflows' | 'rules' | 'categories' | 'reports'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Memo | WorkflowTemplate | ApprovalRule | MemoCategory | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(3);

  // Mock data
  const [memos] = useState<Memo[]>([
    {
      id: '1',
      referenceNumber: 'MEM-2024-001',
      title: 'Request for Additional Laboratory Equipment',
      description: 'Request for purchase of new science laboratory equipment for Form 4 students',
      type: 'request',
      priority: 'high',
      category: 'Procurement',
      subcategory: 'Equipment',
      content: 'We request approval to purchase additional laboratory equipment including microscopes, test tubes, and chemical reagents for the upcoming academic term. The current equipment is insufficient to meet the needs of our growing student population.',
      attachments: [
        {
          id: '1',
          name: 'equipment_list.pdf',
          type: 'application/pdf',
          size: 1024000,
          url: '/attachments/equipment_list.pdf',
          uploadDate: '2024-01-20T00:00:00Z'
        }
      ],
      sender: {
        id: 'staff1',
        name: 'Dr. Sarah Johnson',
        email: 'sarah.johnson@school.edu',
        department: 'Science Department',
        role: 'Head of Department'
      },
      recipients: [
        {
          id: 'admin1',
          name: 'John Smith',
          email: 'john.smith@school.edu',
          department: 'Administration',
          role: 'Bursar',
          type: 'to',
          read: false
        },
        {
          id: 'admin2',
          name: 'Jane Doe',
          email: 'jane.doe@school.edu',
          department: 'Administration',
          role: 'Principal',
          type: 'cc',
          read: false
        }
      ],
      workflow: {
        currentStep: 1,
        totalSteps: 3,
        steps: [
          {
            id: 'step1',
            name: 'Department Head Review',
            type: 'approval',
            assignee: {
              id: 'staff1',
              name: 'Dr. Sarah Johnson',
              email: 'sarah.johnson@school.edu',
              department: 'Science Department'
            },
            status: 'approved',
            completedDate: '2024-01-20T10:30:00Z',
            comments: 'Equipment is essential for practical sessions'
          },
          {
            id: 'step2',
            name: 'Bursar Approval',
            type: 'approval',
            assignee: {
              id: 'admin1',
              name: 'John Smith',
              email: 'john.smith@school.edu',
              department: 'Administration'
            },
            status: 'pending'
          },
          {
            id: 'step3',
            name: 'Principal Approval',
            type: 'approval',
            assignee: {
              id: 'admin2',
              name: 'Jane Doe',
              email: 'jane.doe@school.edu',
              department: 'Administration'
            },
            status: 'pending'
          }
        ]
      },
      status: 'in_review',
      metadata: {
        createdAt: '2024-01-20T09:00:00Z',
        submittedAt: '2024-01-20T09:15:00Z',
        lastModified: '2024-01-20T10:30:00Z',
        version: 1,
        tags: ['procurement', 'equipment', 'science', 'urgent'],
        confidential: false,
        retentionPeriod: '7 years'
      },
      actions: [
        {
          id: '1',
          type: 'approval',
          actionBy: 'Dr. Sarah Johnson',
          actionDate: '2024-01-20T10:30:00Z',
          comments: 'Equipment is essential for practical sessions'
        }
      ],
      reminders: {
        enabled: true,
        frequency: 'daily',
        nextReminder: '2024-01-21T09:00:00Z',
        reminderCount: 1
      },
      createdAt: '2024-01-20T09:00:00Z',
      updatedAt: '2024-01-20T10:30:00Z'
    }
  ]);

  const [templates] = useState<WorkflowTemplate[]>([
    {
      id: '1',
      name: 'Standard Procurement Approval',
      description: 'Standard workflow for procurement requests',
      category: 'Procurement',
      type: 'linear',
      steps: [
        {
          id: 'step1',
          name: 'Department Head Review',
          type: 'approval',
          assigneeType: 'role',
          assignee: 'Department Head',
          required: true,
          timeout: 3,
          timeoutAction: 'escalate'
        },
        {
          id: 'step2',
          name: 'Bursar Approval',
          type: 'approval',
          assigneeType: 'specific',
          assignee: 'Bursar',
          required: true,
          timeout: 5,
          timeoutAction: 'escalate'
        },
        {
          id: 'step3',
          name: 'Principal Approval',
          type: 'approval',
          assigneeType: 'specific',
          assignee: 'Principal',
          required: true,
          timeout: 7,
          timeoutAction: 'escalate'
        }
      ],
      isDefault: true,
      isActive: true,
      usageCount: 25,
      createdBy: 'System Admin',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }
  ]);

  const [rules] = useState<ApprovalRule[]>([
    {
      id: '1',
      name: 'High Value Procurement Rule',
      description: 'Additional approval for high-value procurement requests',
      category: 'Procurement',
      conditions: [
        {
          field: 'amount',
          operator: '>',
          value: '10000'
        },
        {
          field: 'type',
          operator: '=',
          value: 'procurement',
          logicalOperator: 'and'
        }
      ],
      actions: [
        {
          type: 'require',
          target: 'Board Approval',
          parameters: {
            minAmount: 10000
          }
        }
      ],
      priority: 1,
      isActive: true,
      createdBy: 'System Admin',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }
  ]);

  const [categories] = useState<MemoCategory[]>([
    {
      id: '1',
      name: 'Procurement',
      description: 'All procurement related memos',
      workflowTemplate: '1',
      approvalRequired: true,
      defaultPriority: 'medium',
      retentionPeriod: 7,
      isActive: true,
      color: '#3B82F6',
      icon: 'shopping-cart',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }
  ]);

  const stats = {
    totalMemos: memos.length,
    pendingMemos: memos.filter(m => m.status === 'submitted' || m.status === 'in_review').length,
    approvedMemos: memos.filter(m => m.status === 'approved').length,
    rejectedMemos: memos.filter(m => m.status === 'rejected').length,
    draftMemos: memos.filter(m => m.status === 'draft').length,
    urgentMemos: memos.filter(m => m.priority === 'urgent').length
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
      case 'completed':
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'pending':
      case 'submitted':
      case 'in_review':
        return 'text-yellow-600 bg-yellow-100';
      case 'rejected':
      case 'cancelled':
      case 'inactive':
        return 'text-red-600 bg-red-100';
      case 'draft':
        return 'text-gray-600 bg-gray-100';
      case 'archived':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600 bg-red-100';
      case 'high':
        return 'text-orange-600 bg-orange-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Memos</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalMemos}</p>
            </div>
            <DocumentTextIcon className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Approval</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pendingMemos}</p>
            </div>
            <ClockIcon className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-green-600">{stats.approvedMemos}</p>
            </div>
            <CheckCircleIcon className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-red-600">{stats.rejectedMemos}</p>
            </div>
            <ExclamationTriangleIcon className="h-8 w-8 text-red-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Drafts</p>
              <p className="text-2xl font-bold text-gray-600">{stats.draftMemos}</p>
            </div>
            <DocumentTextIcon className="h-8 w-8 text-gray-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Urgent</p>
              <p className="text-2xl font-bold text-red-600">{stats.urgentMemos}</p>
            </div>
            <ExclamationTriangleIcon className="h-8 w-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Activities</h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">Dr. Sarah Johnson approved equipment request</p>
              <p className="text-xs text-gray-500">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <PaperAirplaneIcon className="h-5 w-5 text-blue-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">New procurement request submitted</p>
              <p className="text-xs text-gray-500">5 hours ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-5 w-5 text-orange-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">Urgent memo requires attention</p>
              <p className="text-xs text-gray-500">1 day ago</p>
            </div>
          </div>
        </div>
      </div>

      {/* Memo Categories */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Memos by Category</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {Object.entries(
              memos.reduce((acc, memo) => {
                acc[memo.category] = (acc[memo.category] || 0) + 1;
                return acc;
              }, {} as Record<string, number>)
            ).map(([category, count]) => (
              <div key={category} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TagIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-900">{category}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderMemos = () => (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search memos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <select
              className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
            >
              <option value="all">All Memos</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="draft">Draft</option>
            </select>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              New Memo
            </button>
          </div>
        </div>
      </div>

      {/* Memos List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="min-w-full divide-y divide-gray-200">
          <div className="bg-gray-50 px-6 py-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">All Memos</h3>
              <span className="text-sm text-gray-500">{memos.length} memos</span>
            </div>
          </div>
          <div className="bg-white divide-y divide-gray-200">
            {memos.map((memo) => (
              <div key={memo.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <DocumentTextIcon className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-lg font-medium text-gray-900">{memo.title}</h4>
                        <span className="text-sm text-gray-500">{memo.referenceNumber}</span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(memo.status)}`}>
                          {memo.status.replace('_', ' ')}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(memo.priority)}`}>
                          {memo.priority}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-gray-500">{memo.category}</span>
                        <span className="text-sm text-gray-500">From: {memo.sender.name}</span>
                        <span className="text-sm text-gray-500">
                          Step {memo.workflow.currentStep} of {memo.workflow.totalSteps}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(memo.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setSelectedItem(memo);
                        setShowDetailsModal(true);
                      }}
                      className="p-2 text-gray-400 hover:text-gray-600"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600">
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderTemplates = () => (
    <div className="space-y-6">
      {/* Workflow Templates */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Workflow Templates</h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Create Template
            </button>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {templates.map((template) => (
            <div key={template.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-lg font-medium text-gray-900">{template.name}</h4>
                    {template.isDefault && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Default
                      </span>
                    )}
                    {template.isActive && (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor('active')}`}>
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-sm text-gray-500">{template.category}</span>
                    <span className="text-sm text-gray-500">{template.type}</span>
                    <span className="text-sm text-gray-500">{template.steps.length} steps</span>
                    <span className="text-sm text-gray-500">Used {template.usageCount} times</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedItem(template);
                      setShowDetailsModal(true);
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <EyeIcon className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <PencilIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderWorkflows = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Workflow Management</h3>
        <p className="text-gray-600">Active workflows and process management coming soon...</p>
      </div>
    </div>
  );

  const renderRules = () => (
    <div className="space-y-6">
      {/* Approval Rules */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Approval Rules</h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Rule
            </button>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {rules.map((rule) => (
            <div key={rule.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-lg font-medium text-gray-900">{rule.name}</h4>
                    {rule.isActive && (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor('active')}`}>
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{rule.description}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-sm text-gray-500">{rule.category}</span>
                    <span className="text-sm text-gray-500">{rule.conditions.length} conditions</span>
                    <span className="text-sm text-gray-500">{rule.actions.length} actions</span>
                    <span className="text-sm text-gray-500">Priority: {rule.priority}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedItem(rule);
                      setShowDetailsModal(true);
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <EyeIcon className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <PencilIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCategories = () => (
    <div className="space-y-6">
      {/* Memo Categories */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Memo Categories</h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Category
            </button>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {categories.map((category) => (
            <div key={category.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full flex items-center justify-center" style={{ backgroundColor: category.color }}>
                      <TagIcon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-lg font-medium text-gray-900">{category.name}</h4>
                      {category.isActive && (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor('active')}`}>
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-sm text-gray-500">
                        {category.approvalRequired ? 'Approval Required' : 'No Approval Required'}
                      </span>
                      <span className="text-sm text-gray-500">Default: {category.defaultPriority}</span>
                      <span className="text-sm text-gray-500">Retention: {category.retentionPeriod} years</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedItem(category);
                      setShowDetailsModal(true);
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <EyeIcon className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <PencilIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      {/* Report Generation */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Generate Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
            <DocumentTextIcon className="h-8 w-8 text-blue-500 mb-2" />
            <h4 className="font-medium text-gray-900">Memo Summary</h4>
            <p className="text-sm text-gray-500">Complete memo listing</p>
          </button>
          <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
            <ChartBarIcon className="h-8 w-8 text-green-500 mb-2" />
            <h4 className="font-medium text-gray-900">Approval Analytics</h4>
            <p className="text-sm text-gray-500">Approval time and trends</p>
          </button>
          <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
            <ClipboardDocumentListIcon className="h-8 w-8 text-purple-500 mb-2" />
            <h4 className="font-medium text-gray-900">Workflow Performance</h4>
            <p className="text-sm text-gray-500">Workflow efficiency metrics</p>
          </button>
          <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
            <UserGroupIcon className="h-8 w-8 text-orange-500 mb-2" />
            <h4 className="font-medium text-gray-900">User Activity</h4>
            <p className="text-sm text-gray-500">User participation report</p>
          </button>
          <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
            <TagIcon className="h-8 w-8 text-red-500 mb-2" />
            <h4 className="font-medium text-gray-900">Category Analysis</h4>
            <p className="text-sm text-gray-500">Memo distribution by category</p>
          </button>
          <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
            <ExclamationTriangleIcon className="h-8 w-8 text-yellow-500 mb-2" />
            <h4 className="font-medium text-gray-900">Overdue Items</h4>
            <p className="text-sm text-gray-500">Pending and overdue memos</p>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <DocumentTextIcon className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">Memo & Approval Workflow</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-400 hover:text-gray-600"
              >
                <BellIcon className="h-6 w-6" />
                {notifications > 0 && (
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400"></span>
                )}
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Cog6ToothIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8" aria-label="Tabs">
            {[
              { id: 'overview', name: 'Overview', icon: ChartBarIcon },
              { id: 'memos', name: 'Memos', icon: DocumentTextIcon },
              { id: 'templates', name: 'Templates', icon: ClipboardDocumentListIcon },
              { id: 'workflows', name: 'Workflows', icon: ArrowPathIcon },
              { id: 'rules', name: 'Rules', icon: ShieldCheckIcon },
              { id: 'categories', name: 'Categories', icon: TagIcon },
              { id: 'reports', name: 'Reports', icon: ChartBarIcon }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'memos' && renderMemos()}
        {activeTab === 'templates' && renderTemplates()}
        {activeTab === 'workflows' && renderWorkflows()}
        {activeTab === 'rules' && renderRules()}
        {activeTab === 'categories' && renderCategories()}
        {activeTab === 'reports' && renderReports()}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedItem && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {selectedItem.title || selectedItem.name || selectedItem.description || 'Details'}
              </h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="mt-4">
              <pre className="text-sm text-gray-600 whitespace-pre-wrap">
                {JSON.stringify(selectedItem, null, 2)}
              </pre>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemoApprovalWorkflow;
