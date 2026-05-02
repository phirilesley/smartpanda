import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ComputerDesktopIcon,
  ServerIcon,
  WifiIcon,
  ShieldCheckIcon,
  CogIcon,
  CalendarIcon,
  ClockIcon,
  BellIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ArrowPathIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon,
  HomeIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  IdentificationIcon,
  CreditCardIcon,
  ChartBarIcon,
  UserIcon,
  UsersIcon,
  DocumentArrowDownIcon,
  DocumentArrowUpIcon,
  PaperAirplaneIcon,
  InboxIcon,
  FlagIcon,
  BookmarkIcon,
  TagIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  PrinterIcon,
  ClipboardDocumentListIcon,
  StarIcon,
  FireIcon,
  LightBulbIcon,
  ArchiveBoxIcon,
  FolderIcon,
  ReceiptIcon,
  CalculatorIcon,
  TableCellsIcon,
  BriefcaseIcon,
  UserGroupIcon,
  WrenchScrewdriverIcon,
  BugAntIcon,
  GlobeAltIcon,
  LockClosedIcon,
  KeyIcon,
  FingerprintIcon,
  ChipIcon,
  CloudIcon,
  DevicePhoneMobileIcon,
  DeviceTabletIcon,
  LaptopIcon,
  MonitorIcon,
  QuestionMarkCircleIcon,
  InformationCircleIcon,
  XCircleIcon,
  CheckBadgeIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';

// Types
interface ITService {
  id: string;
  name: string;
  category: string;
  description: string;
  status: 'active' | 'inactive' | 'maintenance' | 'degraded';
  availability: number;
  lastUpdated: string;
  owner: string;
  contact: {
    email: string;
    phone: string;
    slack?: string;
  };
  sla: {
    uptime: number;
    responseTime: string;
    resolutionTime: string;
  };
  documentation: string;
  dependencies: string[];
}

interface ITTicket {
  id: string;
  ticketNumber: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in-progress' | 'resolved' | 'closed' | 'reopened';
  requester: {
    name: string;
    email: string;
    department: string;
  };
  assignee?: {
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  resolvedAt?: string;
  resolution?: string;
  tags: string[];
  attachments: string[];
  comments: TicketComment[];
}

interface TicketComment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  isInternal: boolean;
}

interface NetworkDevice {
  id: string;
  name: string;
  type: 'router' | 'switch' | 'firewall' | 'access-point' | 'server';
  location: string;
  ip: string;
  mac: string;
  status: 'online' | 'offline' | 'maintenance' | 'error';
  lastSeen: string;
  uptime: number;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  temperature?: number;
  firmware: string;
  manufacturer: string;
  model: string;
}

interface SoftwareLicense {
  id: string;
  name: string;
  vendor: string;
  type: 'commercial' | 'open-source' | 'freemium' | 'trial';
  category: string;
  totalLicenses: number;
  usedLicenses: number;
  availableLicenses: number;
  costPerLicense: number;
  renewalDate: string;
  status: 'active' | 'expired' | 'expiring-soon' | 'inactive';
  department: string;
  manager: string;
  features: string[];
}

interface SecurityAlert {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: string;
  source: string;
  detectedAt: string;
  status: 'open' | 'investigating' | 'resolved' | 'false-positive';
  assignedTo?: string;
  affectedSystems: string[];
  recommendations: string[];
  references: string[];
}

interface SystemBackup {
  id: string;
  systemName: string;
  type: 'full' | 'incremental' | 'differential';
  status: 'completed' | 'in-progress' | 'failed' | 'scheduled';
  startTime: string;
  endTime?: string;
  size: number;
  location: string;
  retention: string;
  frequency: string;
  lastVerified?: string;
  verificationStatus: 'verified' | 'failed' | 'pending';
}

interface ITAsset {
  id: string;
  assetTag: string;
  type: 'laptop' | 'desktop' | 'server' | 'mobile' | 'tablet' | 'printer' | 'network-device';
  make: string;
  model: string;
  serialNumber: string;
  status: 'active' | 'inactive' | 'retired' | 'lost' | 'stolen' | 'maintenance';
  location: string;
  assignedTo?: string;
  department: string;
  purchaseDate: string;
  warrantyExpiry: string;
  lastMaintenance?: string;
  specifications: Record<string, string>;
  software: string[];
}

interface ITProject {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'in-progress' | 'testing' | 'deployed' | 'completed' | 'on-hold' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  startDate: string;
  endDate?: string;
  estimatedEndDate: string;
  budget: number;
  spent: number;
  manager: string;
  team: string[];
  milestones: ProjectMilestone[];
  progress: number;
  risks: string[];
  dependencies: string[];
}

interface ProjectMilestone {
  id: string;
  name: string;
  description: string;
  dueDate: string;
  status: 'completed' | 'in-progress' | 'upcoming' | 'overdue';
  completedDate?: string;
}

export const ITServices: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'services' | 'tickets' | 'network' | 'licenses' | 'security' | 'backups' | 'assets' | 'projects'>('dashboard');
  const [itServices, setITServices] = useState<ITService[]>([]);
  const [tickets, setTickets] = useState<ITTicket[]>([]);
  const [networkDevices, setNetworkDevices] = useState<NetworkDevice[]>([]);
  const [softwareLicenses, setSoftwareLicenses] = useState<SoftwareLicense[]>([]);
  const [securityAlerts, setSecurityAlerts] = useState<SecurityAlert[]>([]);
  const [systemBackups, setSystemBackups] = useState<SystemBackup[]>([]);
  const [itAssets, setITAssets] = useState<ITAsset[]>([]);
  const [itProjects, setITProjects] = useState<ITProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<ITService | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<ITTicket | null>(null);

  useEffect(() => {
    // Load mock data
    setTimeout(() => {
      setITServices([
        {
          id: '1',
          name: 'Student Portal',
          category: 'Web Application',
          description: 'Main student information and registration portal',
          status: 'active',
          availability: 99.9,
          lastUpdated: '2024-01-20T10:30:00Z',
          owner: 'Web Services Team',
          contact: {
            email: 'webservices@smartpanda.edu',
            phone: '+1-555-0201',
            slack: '#webservices',
          },
          sla: {
            uptime: 99.5,
            responseTime: '< 2 hours',
            resolutionTime: '< 8 hours',
          },
          documentation: 'https://docs.smartpanda.edu/student-portal',
          dependencies: ['Database Server', 'Authentication Service', 'Email Service'],
        },
        {
          id: '2',
          name: 'Campus WiFi',
          category: 'Network Service',
          description: 'Wireless network coverage across campus',
          status: 'active',
          availability: 98.5,
          lastUpdated: '2024-01-20T09:15:00Z',
          owner: 'Network Team',
          contact: {
            email: 'network@smartpanda.edu',
            phone: '+1-555-0202',
          },
          sla: {
            uptime: 98.0,
            responseTime: '< 4 hours',
            resolutionTime: '< 24 hours',
          },
          documentation: 'https://docs.smartpanda.edu/wifi',
          dependencies: ['Core Network Infrastructure', 'Authentication Service'],
        },
        {
          id: '3',
          name: 'Email System',
          category: 'Communication',
          description: 'Institutional email and calendar service',
          status: 'active',
          availability: 99.8,
          lastUpdated: '2024-01-20T08:45:00Z',
          owner: 'Infrastructure Team',
          contact: {
            email: 'infra@smartpanda.edu',
            phone: '+1-555-0203',
          },
          sla: {
            uptime: 99.5,
            responseTime: '< 1 hour',
            resolutionTime: '< 4 hours',
          },
          documentation: 'https://docs.smartpanda.edu/email',
          dependencies: ['Mail Servers', 'Spam Filter', 'Storage Systems'],
        },
      ]);

      setTickets([
        {
          id: '1',
          ticketNumber: 'IT-2024-001',
          title: 'Cannot connect to campus WiFi',
          description: 'Student unable to connect to WiFi in the library building',
          category: 'Network',
          priority: 'high',
          status: 'in-progress',
          requester: {
            name: 'John Doe',
            email: 'john.doe@smartpanda.edu',
            department: 'Student',
          },
          assignee: {
            name: 'Network Team',
            email: 'network@smartpanda.edu',
          },
          createdAt: '2024-01-19T14:30:00Z',
          updatedAt: '2024-01-20T09:15:00Z',
          dueDate: '2024-01-20T17:00:00Z',
          tags: ['wifi', 'library', 'urgent'],
          attachments: ['network_diagnostic.png'],
          comments: [
            {
              id: '1',
              author: 'Network Team',
              content: 'Investigating the issue. Access point in library may need reboot.',
              createdAt: '2024-01-19T15:00:00Z',
              isInternal: false,
            },
          ],
        },
        {
          id: '2',
          ticketNumber: 'IT-2024-002',
          title: 'Password reset request',
          description: 'Faculty member needs password reset for email account',
          category: 'Account Management',
          priority: 'medium',
          status: 'resolved',
          requester: {
            name: 'Dr. Sarah Johnson',
            email: 'sarah.johnson@smartpanda.edu',
            department: 'Mathematics',
          },
          assignee: {
            name: 'Help Desk',
            email: 'helpdesk@smartpanda.edu',
          },
          createdAt: '2024-01-20T08:00:00Z',
          updatedAt: '2024-01-20T08:45:00Z',
          resolvedAt: '2024-01-20T08:45:00Z',
          resolution: 'Password successfully reset. User notified via email.',
          tags: ['password', 'email'],
          attachments: [],
          comments: [
            {
              id: '1',
              author: 'Help Desk',
              content: 'Identity verified. Password reset completed.',
              createdAt: '2024-01-20T08:30:00Z',
              isInternal: false,
            },
          ],
        },
      ]);

      setNetworkDevices([
        {
          id: '1',
          name: 'CORE-ROUTER-01',
          type: 'router',
          location: 'Data Center - Rack A1',
          ip: '192.168.1.1',
          mac: '00:1A:2B:3C:4D:5E',
          status: 'online',
          lastSeen: '2024-01-20T10:30:00Z',
          uptime: 99.8,
          cpuUsage: 15.2,
          memoryUsage: 45.8,
          diskUsage: 23.1,
          temperature: 42.5,
          firmware: 'IOS 15.1(4)M6',
          manufacturer: 'Cisco',
          model: 'ISR4331/K9',
        },
        {
          id: '2',
          name: 'SWITCH-LIBRARY-01',
          type: 'switch',
          location: 'Library - Room 203',
          ip: '192.168.2.10',
          mac: '00:1A:2B:3C:4D:5F',
          status: 'online',
          lastSeen: '2024-01-20T10:25:00Z',
          uptime: 98.5,
          cpuUsage: 8.7,
          memoryUsage: 32.4,
          diskUsage: 12.8,
          temperature: 38.2,
          firmware: 'IOS 12.2(58)SE2',
          manufacturer: 'Cisco',
          model: 'Catalyst 2960X-24TS-L',
        },
        {
          id: '3',
          name: 'AP-LIBRARY-FLOOR1',
          type: 'access-point',
          location: 'Library - Floor 1',
          ip: '192.168.3.101',
          mac: '00:1A:2B:3C:4D:60',
          status: 'error',
          lastSeen: '2024-01-20T08:15:00Z',
          uptime: 0,
          cpuUsage: 0,
          memoryUsage: 0,
          diskUsage: 0,
          firmware: 'UniFi 6.0.24',
          manufacturer: 'Ubiquiti',
          model: 'UniFi AP AC Pro',
        },
      ]);

      setSoftwareLicenses([
        {
          id: '1',
          name: 'Microsoft Office 365',
          vendor: 'Microsoft',
          type: 'commercial',
          category: 'Productivity Suite',
          totalLicenses: 5000,
          usedLicenses: 3421,
          availableLicenses: 1579,
          costPerLicense: 12.50,
          renewalDate: '2024-06-30',
          status: 'active',
          department: 'All Departments',
          manager: 'IT Procurement',
          features: ['Word', 'Excel', 'PowerPoint', 'Outlook', 'Teams', 'OneDrive'],
        },
        {
          id: '2',
          name: 'Adobe Creative Cloud',
          vendor: 'Adobe',
          type: 'commercial',
          category: 'Design Software',
          totalLicenses: 100,
          usedLicenses: 87,
          availableLicenses: 13,
          costPerLicense: 35.00,
          renewalDate: '2024-03-31',
          status: 'expiring-soon',
          department: 'Design & Marketing',
          manager: 'Design Department Head',
          features: ['Photoshop', 'Illustrator', 'InDesign', 'Premiere Pro', 'After Effects'],
        },
      ]);

      setSecurityAlerts([
        {
          id: '1',
          title: 'Suspicious login activity detected',
          description: 'Multiple failed login attempts from unusual IP address',
          severity: 'high',
          type: 'Security Incident',
          source: 'Authentication Service',
          detectedAt: '2024-01-20T07:45:00Z',
          status: 'investigating',
          assignedTo: 'Security Team',
          affectedSystems: ['Authentication Service', 'User Database'],
          recommendations: [
            'Block suspicious IP addresses',
            'Review user account activity',
            'Enable multi-factor authentication',
          ],
          references: ['SEC-2024-001', 'LOG-2024-0156'],
        },
        {
          id: '2',
          title: 'Outdated software vulnerability',
          description: 'Critical vulnerability detected in Apache Struts framework',
          severity: 'critical',
          type: 'Vulnerability',
          source: 'Vulnerability Scanner',
          detectedAt: '2024-01-19T23:30:00Z',
          status: 'open',
          affectedSystems: ['Student Portal', 'Admin Portal'],
          recommendations: [
            'Apply security patches immediately',
            'Temporary workaround available',
            'Monitor for exploitation attempts',
          ],
          references: ['CVE-2024-1234', 'SEC-2024-002'],
        },
      ]);

      setSystemBackups([
        {
          id: '1',
          systemName: 'Student Database',
          type: 'full',
          status: 'completed',
          startTime: '2024-01-20T02:00:00Z',
          endTime: '2024-01-20T03:15:00Z',
          size: 15.6,
          location: 'Primary Backup Server',
          retention: '30 days',
          frequency: 'Daily',
          lastVerified: '2024-01-19T10:00:00Z',
          verificationStatus: 'verified',
        },
        {
          id: '2',
          systemName: 'Email Servers',
          type: 'incremental',
          status: 'in-progress',
          startTime: '2024-01-20T10:30:00Z',
          size: 2.3,
          location: 'Cloud Backup Storage',
          retention: '90 days',
          frequency: 'Every 4 hours',
          verificationStatus: 'pending',
        },
        {
          id: '3',
          systemName: 'Financial Systems',
          type: 'full',
          status: 'failed',
          startTime: '2024-01-20T01:00:00Z',
          size: 0,
          location: 'Primary Backup Server',
          retention: '1 year',
          frequency: 'Weekly',
          verificationStatus: 'failed',
        },
      ]);

      setITAssets([
        {
          id: '1',
          assetTag: 'IT-001234',
          type: 'laptop',
          make: 'Dell',
          model: 'Latitude 7420',
          serialNumber: 'DL123456789',
          status: 'active',
          location: 'Admin Building - Room 201',
          assignedTo: 'Dr. Sarah Johnson',
          department: 'Mathematics',
          purchaseDate: '2023-01-15',
          warrantyExpiry: '2025-01-15',
          lastMaintenance: '2024-01-10',
          specifications: {
            'CPU': 'Intel Core i7-1260P',
            'RAM': '16GB DDR4',
            'Storage': '512GB NVMe SSD',
            'OS': 'Windows 11 Pro',
          },
          software: ['Microsoft Office 365', 'Adobe Reader', 'VPN Client'],
        },
        {
          id: '2',
          assetTag: 'IT-001235',
          type: 'desktop',
          make: 'HP',
          model: 'EliteDesk 800 G9',
          serialNumber: 'HP987654321',
          status: 'active',
          location: 'Library - Front Desk',
          assignedTo: 'Library Staff',
          department: 'Library',
          purchaseDate: '2022-08-20',
          warrantyExpiry: '2024-08-20',
          specifications: {
            'CPU': 'Intel Core i5-12400',
            'RAM': '8GB DDR4',
            'Storage': '256GB SSD',
            'OS': 'Windows 10 Pro',
          },
          software: ['Library Management System', 'Microsoft Office 365'],
        },
      ]);

      setITProjects([
        {
          id: '1',
          name: 'Campus Network Upgrade',
          description: 'Upgrade network infrastructure to support 10Gbps connectivity',
          status: 'in-progress',
          priority: 'high',
          startDate: '2024-01-01',
          estimatedEndDate: '2024-06-30',
          budget: 250000,
          spent: 75000,
          manager: 'Network Infrastructure Lead',
          team: ['Network Team', 'Infrastructure Team', 'Vendor Support'],
          milestones: [
            {
              id: '1',
              name: 'Phase 1 - Core Network',
              description: 'Upgrade core routers and switches',
              dueDate: '2024-03-31',
              status: 'in-progress',
            },
            {
              id: '2',
              name: 'Phase 2 - Edge Network',
              description: 'Upgrade edge switches and access points',
              dueDate: '2024-05-31',
              status: 'upcoming',
            },
          ],
          progress: 30,
          risks: ['Vendor delays', 'Budget overruns', 'Downtime during migration'],
          dependencies: ['Budget approval', 'Vendor contracts'],
        },
        {
          id: '2',
          name: 'Cloud Migration Project',
          description: 'Migrate on-premise services to cloud infrastructure',
          status: 'planning',
          priority: 'medium',
          startDate: '2024-02-01',
          estimatedEndDate: '2024-12-31',
          budget: 500000,
          spent: 25000,
          manager: 'Cloud Services Lead',
          team: ['Cloud Team', 'Security Team', 'Application Teams'],
          milestones: [
            {
              id: '1',
              name: 'Assessment Phase',
              description: 'Assess applications for cloud readiness',
              dueDate: '2024-04-30',
              status: 'upcoming',
            },
          ],
          progress: 5,
          risks: ['Data security', 'Application compatibility', 'Cost management'],
          dependencies: ['Cloud provider selection', 'Security review'],
        },
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'completed':
      case 'online':
      case 'resolved':
      case 'verified':
      case 'deployed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'inactive':
      case 'offline':
      case 'failed':
      case 'closed':
      case 'cancelled':
      case 'retired':
      case 'lost':
      case 'stolen':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'maintenance':
      case 'degraded':
      case 'in-progress':
      case 'testing':
      case 'investigating':
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'expiring-soon':
      case 'on-hold':
      case 'reopened':
      case 'planning':
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'error':
      case 'critical':
      case 'overdue':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">IT Services</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage IT infrastructure, services, and support</p>
      </div>

      {/* Alert */}
      <div className="mb-6 bg-orange-50 dark:bg-orange-900 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
        <div className="flex items-center">
          <BellIcon className="w-5 h-5 text-orange-600 dark:text-orange-400 mr-3" />
          <div>
            <h3 className="text-sm font-medium text-orange-800 dark:text-orange-200">System Alerts</h3>
            <p className="text-sm text-orange-700 dark:text-orange-300">1 critical security alert and 2 network devices require attention</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: ChartBarIcon },
            { id: 'services', label: 'Services', icon: ServerIcon },
            { id: 'tickets', label: 'Tickets', icon: ClipboardDocumentListIcon },
            { id: 'network', label: 'Network', icon: WifiIcon },
            { id: 'licenses', label: 'Licenses', icon: KeyIcon },
            { id: 'security', label: 'Security', icon: ShieldCheckIcon },
            { id: 'backups', label: 'Backups', icon: CloudIcon },
            { id: 'assets', label: 'Assets', icon: ComputerDesktopIcon },
            { id: 'projects', label: 'Projects', icon: BriefcaseIcon },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center px-1 py-2 border-b-2 text-sm font-medium ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Service Uptime</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">99.2%</p>
                </div>
                <div className="bg-green-100 dark:bg-green-900 rounded-full p-3">
                  <CheckCircleIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-green-600 dark:text-green-400">+0.3%</span>
                <span className="text-gray-500 dark:text-gray-400 ml-2">from last month</span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Open Tickets</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">47</p>
                </div>
                <div className="bg-yellow-100 dark:bg-yellow-900 rounded-full p-3">
                  <InboxIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-yellow-600 dark:text-yellow-400">12</span>
                <span className="text-gray-500 dark:text-gray-400 ml-2">high priority</span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Security Alerts</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">3</p>
                </div>
                <div className="bg-red-100 dark:bg-red-900 rounded-full p-3">
                  <ShieldCheckIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-red-600 dark:text-red-400">1 critical</span>
                <span className="text-gray-500 dark:text-gray-400 ml-2">requires action</span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Projects</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">8</p>
                </div>
                <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-3">
                  <BriefcaseIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-blue-600 dark:text-blue-400">2</span>
                <span className="text-gray-500 dark:text-gray-400 ml-2">in progress</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'services' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">IT Services Status</h2>
                <button className="flex items-center px-3 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Add Service
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Service</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Availability</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Owner</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {itServices.map((service) => (
                    <tr key={service.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{service.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Updated: {new Date(service.lastUpdated).toLocaleDateString()}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{service.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <div className="flex items-center">
                          <span className={`font-medium ${service.availability >= 99 ? 'text-green-600' : service.availability >= 95 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {service.availability}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{service.owner}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(service.status)}`}>
                          {service.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => setSelectedService(service)}
                          className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 mr-3"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300">
                          <PencilIcon className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'tickets' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Support Tickets</h2>
                <button className="flex items-center px-3 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                  <PlusIcon className="w-4 h-4 mr-2" />
                  New Ticket
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ticket</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Requester</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Priority</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Created</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {tickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{ticket.ticketNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{ticket.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <div>{ticket.requester.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{ticket.requester.department}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                          {ticket.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Date(ticket.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => setSelectedTicket(ticket)}
                          className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 mr-3"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300">
                          <PencilIcon className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'network' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Network Devices</h2>
                <button className="flex items-center px-3 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Add Device
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Device</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">IP Address</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Uptime</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {networkDevices.map((device) => (
                    <tr key={device.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{device.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{device.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{device.location}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{device.ip}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(device.status)}`}>
                          {device.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{device.uptime}%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 mr-3">
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300">
                          <CogIcon className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'licenses' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Software Licenses</h2>
                <button className="flex items-center px-3 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Add License
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Software</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Vendor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Licenses</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Cost/License</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Renewal Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {softwareLicenses.map((license) => (
                    <tr key={license.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{license.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{license.vendor}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{license.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <div>{license.usedLicenses}/{license.totalLicenses}</div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                          <div
                            className={`h-2 rounded-full ${
                              license.availableLicenses / license.totalLicenses < 0.2
                                ? 'bg-red-500'
                                : license.availableLicenses / license.totalLicenses < 0.5
                                ? 'bg-yellow-500'
                                : 'bg-green-500'
                            }`}
                            style={{ width: `${(license.usedLicenses / license.totalLicenses) * 100}%` }}
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">${license.costPerLicense.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{license.renewalDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(license.status)}`}>
                          {license.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 mr-3">
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300">
                          <PencilIcon className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Security Alerts</h2>
                <button className="flex items-center px-3 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Report Alert
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Alert</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Severity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Source</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Detected</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {securityAlerts.map((alert) => (
                    <tr key={alert.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{alert.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{alert.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getSeverityColor(alert.severity)}`}>
                          {alert.severity}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{alert.source}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Date(alert.detectedAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(alert.status)}`}>
                          {alert.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 mr-3">
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300">
                          <PencilIcon className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'backups' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">System Backups</h2>
                <button className="flex items-center px-3 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Configure Backup
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">System</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Start Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Size (GB)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Verification</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {systemBackups.map((backup) => (
                    <tr key={backup.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{backup.systemName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{backup.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(backup.status)}`}>
                          {backup.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Date(backup.startTime).toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{backup.size.toFixed(1)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{backup.location}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(backup.verificationStatus)}`}>
                          {backup.verificationStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 mr-3">
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300">
                          <ArrowDownTrayIcon className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'assets' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">IT Assets</h2>
                <button className="flex items-center px-3 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Add Asset
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Asset</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Make/Model</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Assigned To</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Warranty</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {itAssets.map((asset) => (
                    <tr key={asset.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{asset.assetTag}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{asset.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{asset.make} {asset.model}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{asset.assignedTo || 'Unassigned'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{asset.location}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{asset.warrantyExpiry}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(asset.status)}`}>
                          {asset.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 mr-3">
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300">
                          <PencilIcon className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {itProjects.map((project) => (
              <div key={project.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{project.name}</h3>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(project.priority)}`}>
                      {project.priority}
                    </span>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Manager</span>
                    <span className="font-medium text-gray-900 dark:text-white">{project.manager}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Budget</span>
                    <span className="font-medium text-gray-900 dark:text-white">${project.spent.toLocaleString()} / ${project.budget.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Timeline</span>
                    <span className="font-medium text-gray-900 dark:text-white">{project.startDate} - {project.estimatedEndDate}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{project.description}</p>
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Progress</span>
                    <span className="font-medium text-gray-900 dark:text-white">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Team:</span> {project.team.length} members
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300">
                      <EyeIcon className="w-4 h-4" />
                    </button>
                    <button className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300">
                      <PencilIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Service Detail Modal */}
      {selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Service Details</h3>
                <button
                  onClick={() => setSelectedService(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{selectedService.name}</h4>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedService.status)}`}>
                  {selectedService.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Category</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedService.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Owner</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedService.owner}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Availability</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedService.availability}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Last Updated</p>
                  <p className="font-medium text-gray-900 dark:text-white">{new Date(selectedService.lastUpdated).toLocaleString()}</p>
                </div>
              </div>

              <div className="mb-6">
                <h5 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Description</h5>
                <p className="text-sm text-gray-600 dark:text-gray-400">{selectedService.description}</p>
              </div>

              <div className="mb-6">
                <h5 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Service Level Agreement</h5>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Uptime Target</span>
                    <span className="font-medium text-gray-900 dark:text-white">{selectedService.sla.uptime}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Response Time</span>
                    <span className="font-medium text-gray-900 dark:text-white">{selectedService.sla.responseTime}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Resolution Time</span>
                    <span className="font-medium text-gray-900 dark:text-white">{selectedService.sla.resolutionTime}</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h5 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Contact Information</h5>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <EnvelopeIcon className="w-4 h-4 mr-2" />
                    {selectedService.contact.email}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <PhoneIcon className="w-4 h-4 mr-2" />
                    {selectedService.contact.phone}
                  </div>
                  {selectedService.contact.slack && (
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <ChatBubbleLeftRightIcon className="w-4 h-4 mr-2" />
                      {selectedService.contact.slack}
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <h5 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Dependencies</h5>
                <div className="flex flex-wrap gap-2">
                  {selectedService.dependencies.map((dep, index) => (
                    <span key={index} className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full">
                      {dep}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Documentation:</span> {selectedService.documentation}
                </div>
                <div className="flex items-center space-x-2">
                  <button className="flex items-center px-4 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                    <DocumentTextIcon className="w-4 h-4 mr-2" />
                    View Docs
                  </button>
                  <button className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300">
                    <BellIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Ticket Details</h3>
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-white">{selectedTicket.title}</h4>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(selectedTicket.priority)}`}>
                      {selectedTicket.priority}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedTicket.status)}`}>
                      {selectedTicket.status}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Ticket #{selectedTicket.ticketNumber}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Requester</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedTicket.requester.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{selectedTicket.requester.email}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{selectedTicket.requester.department}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Assignee</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedTicket.assignee?.name || 'Unassigned'}</p>
                  {selectedTicket.assignee && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">{selectedTicket.assignee.email}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Category</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedTicket.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Created</p>
                  <p className="font-medium text-gray-900 dark:text-white">{new Date(selectedTicket.createdAt).toLocaleString()}</p>
                </div>
              </div>

              <div className="mb-6">
                <h5 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Description</h5>
                <p className="text-sm text-gray-600 dark:text-gray-400">{selectedTicket.description}</p>
              </div>

              {selectedTicket.resolution && (
                <div className="mb-6">
                  <h5 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Resolution</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{selectedTicket.resolution}</p>
                </div>
              )}

              <div className="mb-6">
                <h5 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Comments</h5>
                <div className="space-y-3">
                  {selectedTicket.comments.map((comment) => (
                    <div key={comment.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{comment.author}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(comment.createdAt).toLocaleString()}</p>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{comment.content}</p>
                      {comment.isInternal && (
                        <p className="text-xs text-orange-600 dark:text-orange-400 mt-2">Internal comment</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {selectedTicket.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center space-x-2">
                  <button className="flex items-center px-4 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                    <PencilIcon className="w-4 h-4 mr-2" />
                    Update
                  </button>
                  <button className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300">
                    <PrinterIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
