import React, { useState, useEffect } from 'react';
import {
  Cog6ToothIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  ChartBarIcon,
  DocumentTextIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  BellIcon,
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
  CreditCardIcon,
  BanknotesIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  GlobeAltIcon,
  ServerIcon,
  DatabaseIcon,
  WifiIcon,
  DocumentArrowDownIcon,
  DocumentArrowUpIcon,
  QrCodeIcon,
  CameraIcon,
  MapPinIcon,
  UserGroupIcon,
  AcademicCapIcon,
  SparklesIcon,
  TagIcon,
  ArchiveBoxIcon,
  CurrencyDollarIcon,
  ReceiptRefundIcon,
  TruckIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline';

interface Integration {
  id: string;
  name: string;
  description: string;
  category: 'payment' | 'communication' | 'analytics' | 'storage' | 'authentication' | 'third_party' | 'hardware' | 'api';
  type: 'api' | 'webhook' | 'sdk' | 'plugin' | 'service';
  provider: string;
  version: string;
  status: 'active' | 'inactive' | 'error' | 'testing' | 'maintenance';
  configuration: {
    endpoint?: string;
    apiKey?: string;
    secret?: string;
    webhookUrl?: string;
    credentials: {
      [key: string]: string | number | boolean;
    };
    settings: {
      [key: string]: string | number | boolean;
    };
  };
  features: string[];
  capabilities: {
    inbound: boolean;
    outbound: boolean;
    realtime: boolean;
    batch: boolean;
    scheduling: boolean;
  };
  usage: {
    requests: {
      total: number;
      thisMonth: number;
      lastMonth: number;
      limit?: number;
    };
    data: {
      total: number;
      thisMonth: number;
      limit?: number;
    };
    errors: {
      total: number;
      thisMonth: number;
      rate: number;
    };
  };
  security: {
    encryption: boolean;
    authentication: string[];
    compliance: string[];
    lastSecurityAudit: string;
    vulnerabilities: {
      severity: 'low' | 'medium' | 'high' | 'critical';
      count: number;
    }[];
  };
  monitoring: {
    enabled: boolean;
    uptime: number;
    responseTime: number;
    lastCheck: string;
    alerts: {
      enabled: boolean;
      channels: string[];
      thresholds: {
        responseTime: number;
        errorRate: number;
        uptime: number;
      };
    };
  };
  documentation: {
    apiDocs: string;
    userGuide: string;
    troubleshooting: string;
    changelog: string;
  };
  support: {
    provider: string;
    email: string;
    phone: string;
    website: string;
    responseTime: string;
  };
  billing: {
    model: 'free' | 'tiered' | 'usage_based' | 'enterprise';
    plan: string;
    cost: number;
    currency: string;
    billingCycle: 'monthly' | 'yearly';
    nextBillingDate?: string;
  };
  metadata: {
    createdBy: string;
    createdAt: string;
    lastModifiedBy: string;
    lastModifiedAt: string;
    version: number;
    tags: string[];
  };
  logs: {
    id: string;
    timestamp: string;
    level: 'info' | 'warn' | 'error' | 'debug';
    message: string;
    details?: any;
  }[];
  createdAt: string;
  updatedAt: string;
}

interface Webhook {
  id: string;
  name: string;
  description: string;
  event: string;
  url: string;
  method: 'POST' | 'PUT' | 'PATCH';
  headers: {
    [key: string]: string;
  };
  payload: {
    format: 'json' | 'xml' | 'form';
    fields: string[];
  };
  authentication: {
    type: 'none' | 'basic' | 'bearer' | 'signature';
    credentials?: {
      username?: string;
      password?: string;
      token?: string;
      secret?: string;
    };
  };
  retry: {
    enabled: boolean;
    maxAttempts: number;
    backoffStrategy: 'linear' | 'exponential';
    delay: number;
  };
  status: 'active' | 'inactive' | 'error';
  delivery: {
    total: number;
    successful: number;
    failed: number;
    pending: number;
    rate: number;
  };
  lastDelivery?: {
    timestamp: string;
    status: 'success' | 'failed';
    responseCode: number;
    responseTime: number;
    error?: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface ApiKey {
  id: string;
  name: string;
  description: string;
  key: string;
  prefix: string;
  permissions: string[];
  restrictions: {
    ipAddresses: string[];
    domains: string[];
    rateLimit: {
      requests: number;
      window: number;
    };
    expiration?: string;
  };
  usage: {
    totalRequests: number;
    lastUsed: string;
    currentPeriod: {
      requests: number;
      startDate: string;
      endDate: string;
    };
  };
  status: 'active' | 'inactive' | 'expired' | 'revoked';
  createdBy: string;
  createdAt: string;
  expiresAt?: string;
  lastUsed?: string;
}

interface DataSync {
  id: string;
  name: string;
  description: string;
  source: {
    type: 'database' | 'api' | 'file' | 'service';
    connection: string;
    entity: string;
  };
  destination: {
    type: 'database' | 'api' | 'file' | 'service';
    connection: string;
    entity: string;
  };
  mapping: {
    source: string;
    destination: string;
    transformation?: string;
  }[];
  schedule: {
    type: 'realtime' | 'interval' | 'cron' | 'manual';
    frequency?: string;
    cronExpression?: string;
    timezone: string;
    lastRun: string;
    nextRun: string;
  };
  status: 'active' | 'inactive' | 'error' | 'running';
  performance: {
    lastRunDuration: number;
    averageDuration: number;
    recordsProcessed: number;
    recordsPerSecond: number;
    errorRate: number;
  };
  monitoring: {
    enabled: boolean;
    alerts: {
      failure: boolean;
      performance: boolean;
      dataQuality: boolean;
    };
  };
  logs: {
    id: string;
    timestamp: string;
    type: 'info' | 'warning' | 'error';
    message: string;
    records?: number;
    duration?: number;
  }[];
  createdAt: string;
  updatedAt: string;
}

const Integrations: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'integrations' | 'webhooks' | 'api_keys' | 'data_sync' | 'monitoring' | 'settings'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Integration | Webhook | ApiKey | DataSync | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(3);

  // Mock data
  const [integrations] = useState<Integration[]>([
    {
      id: '1',
      name: 'PayNow Payment Gateway',
      description: 'Zimbabwean payment gateway for online payments',
      category: 'payment',
      type: 'api',
      provider: 'PayNow',
      version: '2.1',
      status: 'active',
      configuration: {
        endpoint: 'https://api.paynow.co.zw/v2',
        apiKey: 'pk_live_123456789',
        secret: 'sk_live_987654321',
        credentials: {
          merchantId: 'MERCHANT123',
          merchantKey: 'KEY456'
        },
        settings: {
          sandbox: false,
          currency: 'ZWL',
          timeout: 30000
        }
      },
      features: ['Credit Card', 'Mobile Money', 'Bank Transfer', 'Recurring Payments'],
      capabilities: {
        inbound: true,
        outbound: true,
        realtime: true,
        batch: false,
        scheduling: true
      },
      usage: {
        requests: {
          total: 15420,
          thisMonth: 2340,
          lastMonth: 2100,
          limit: 10000
        },
        data: {
          total: 5242880,
          thisMonth: 1048576,
          limit: 10485760
        },
        errors: {
          total: 45,
          thisMonth: 8,
          rate: 0.34
        }
      },
      security: {
        encryption: true,
        authentication: ['API Key', 'HMAC Signature'],
        compliance: ['PCI DSS', 'GDPR'],
        lastSecurityAudit: '2024-01-15',
        vulnerabilities: []
      },
      monitoring: {
        enabled: true,
        uptime: 99.8,
        responseTime: 250,
        lastCheck: '2024-01-25T10:30:00Z',
        alerts: {
          enabled: true,
          channels: ['email', 'sms'],
          thresholds: {
            responseTime: 1000,
            errorRate: 5.0,
            uptime: 99.0
          }
        }
      },
      documentation: {
        apiDocs: 'https://docs.paynow.co.zw/api',
        userGuide: 'https://docs.paynow.co.zw/guide',
        troubleshooting: 'https://docs.paynow.co.zw/troubleshooting',
        changelog: 'https://docs.paynow.co.zw/changelog'
      },
      support: {
        provider: 'PayNow Support',
        email: 'support@paynow.co.zw',
        phone: '+263 123 456 789',
        website: 'https://www.paynow.co.zw',
        responseTime: '24 hours'
      },
      billing: {
        model: 'usage_based',
        plan: 'Professional',
        cost: 0.029,
        currency: 'USD',
        billingCycle: 'monthly',
        nextBillingDate: '2024-02-01'
      },
      metadata: {
        createdBy: 'Admin',
        createdAt: '2024-01-01T00:00:00Z',
        lastModifiedBy: 'Admin',
        lastModifiedAt: '2024-01-15T00:00:00Z',
        version: 1,
        tags: ['payment', 'zimbabwe', 'gateway']
      },
      logs: [
        {
          id: '1',
          timestamp: '2024-01-25T10:30:00Z',
          level: 'info',
          message: 'Payment processed successfully',
          details: { transactionId: 'TXN123456', amount: 50.00 }
        }
      ],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-25T10:30:00Z'
    },
    {
      id: '2',
      name: 'Stripe Payment Gateway',
      description: 'International payment gateway for credit card processing',
      category: 'payment',
      type: 'api',
      provider: 'Stripe',
      version: '2023-10-16',
      status: 'active',
      configuration: {
        endpoint: 'https://api.stripe.com/v1',
        apiKey: 'sk_test_123456789',
        credentials: {
          publishableKey: 'pk_test_987654321'
        },
        settings: {
          sandbox: true,
          currency: 'USD',
          webhookSecret: 'whsec_123456789'
        }
      },
      features: ['Credit Card', 'Debit Card', 'Apple Pay', 'Google Pay'],
      capabilities: {
        inbound: true,
        outbound: true,
        realtime: true,
        batch: true,
        scheduling: false
      },
      usage: {
        requests: {
          total: 8500,
          thisMonth: 1200,
          lastMonth: 980,
          limit: 5000
        },
        data: {
          total: 2097152,
          thisMonth: 524288,
          limit: 5242880
        },
        errors: {
          total: 23,
          thisMonth: 4,
          rate: 0.33
        }
      },
      security: {
        encryption: true,
        authentication: ['API Key', 'OAuth 2.0'],
        compliance: ['PCI DSS', 'SOC 2'],
        lastSecurityAudit: '2024-01-10',
        vulnerabilities: []
      },
      monitoring: {
        enabled: true,
        uptime: 99.9,
        responseTime: 180,
        lastCheck: '2024-01-25T10:35:00Z',
        alerts: {
          enabled: true,
          channels: ['email'],
          thresholds: {
            responseTime: 500,
            errorRate: 1.0,
            uptime: 99.5
          }
        }
      },
      documentation: {
        apiDocs: 'https://stripe.com/docs/api',
        userGuide: 'https://stripe.com/docs/guides',
        troubleshooting: 'https://stripe.com/docs/troubleshooting',
        changelog: 'https://stripe.com/docs/upgrades'
      },
      support: {
        provider: 'Stripe Support',
        email: 'support@stripe.com',
        phone: '+1-415-555-4378',
        website: 'https://stripe.com',
        responseTime: '2 hours'
      },
      billing: {
        model: 'tiered',
        plan: 'Standard',
        cost: 0.029,
        currency: 'USD',
        billingCycle: 'monthly',
        nextBillingDate: '2024-02-01'
      },
      metadata: {
        createdBy: 'Admin',
        createdAt: '2024-01-05T00:00:00Z',
        lastModifiedBy: 'Admin',
        lastModifiedAt: '2024-01-20T00:00:00Z',
        version: 1,
        tags: ['payment', 'international', 'credit_card']
      },
      logs: [],
      createdAt: '2024-01-05T00:00:00Z',
      updatedAt: '2024-01-20T00:00:00Z'
    }
  ]);

  const [webhooks] = useState<Webhook[]>([
    {
      id: '1',
      name: 'Payment Confirmation Webhook',
      description: 'Receives payment confirmation notifications from PayNow',
      event: 'payment.completed',
      url: 'https://school.edu/api/webhooks/payment-confirmation',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Signature': '{{signature}}'
      },
      payload: {
        format: 'json',
        fields: ['transactionId', 'amount', 'status', 'timestamp']
      },
      authentication: {
        type: 'signature',
        secret: 'webhook_secret_123456789'
      },
      retry: {
        enabled: true,
        maxAttempts: 3,
        backoffStrategy: 'exponential',
        delay: 1000
      },
      status: 'active',
      delivery: {
        total: 1250,
        successful: 1242,
        failed: 8,
        pending: 0,
        rate: 99.36
      },
      lastDelivery: {
        timestamp: '2024-01-25T10:30:00Z',
        status: 'success',
        responseCode: 200,
        responseTime: 150
      },
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-25T10:30:00Z'
    }
  ]);

  const [apiKeys] = useState<ApiKey[]>([
    {
      id: '1',
      name: 'Mobile App API Key',
      description: 'API key for mobile application access',
      key: 'sk_live_1234567890abcdef',
      prefix: 'sk_live_',
      permissions: ['read:students', 'read:grades', 'write:attendance'],
      restrictions: {
        ipAddresses: ['192.168.1.0/24', '10.0.0.0/8'],
        domains: ['school.edu', 'mobile.school.edu'],
        rateLimit: {
          requests: 1000,
          window: 3600
        },
        expiration: '2025-01-01T00:00:00Z'
      },
      usage: {
        totalRequests: 45678,
        lastUsed: '2024-01-25T10:30:00Z',
        currentPeriod: {
          requests: 2340,
          startDate: '2024-01-01',
          endDate: '2024-02-01'
        }
      },
      status: 'active',
      createdBy: 'Admin',
      createdAt: '2024-01-01T00:00:00Z',
      expiresAt: '2025-01-01T00:00:00Z',
      lastUsed: '2024-01-25T10:30:00Z'
    }
  ]);

  const [dataSyncs] = useState<DataSync[]>([
    {
      id: '1',
      name: 'Student Data Sync',
      description: 'Sync student data with external student management system',
      source: {
        type: 'api',
        connection: 'https://external-system.edu/api',
        entity: 'students'
      },
      destination: {
        type: 'database',
        connection: 'internal_db',
        entity: 'students'
      },
      mapping: [
        { source: 'student_id', destination: 'id' },
        { source: 'first_name', destination: 'firstName' },
        { source: 'last_name', destination: 'lastName' },
        { source: 'email', destination: 'email' }
      ],
      schedule: {
        type: 'interval',
        frequency: '0 2 * * *',
        timezone: 'Africa/Harare',
        lastRun: '2024-01-25T02:00:00Z',
        nextRun: '2024-01-26T02:00:00Z'
      },
      status: 'active',
      performance: {
        lastRunDuration: 45,
        averageDuration: 42,
        recordsProcessed: 1250,
        recordsPerSecond: 27.78,
        errorRate: 0.0
      },
      monitoring: {
        enabled: true,
        alerts: {
          failure: true,
          performance: true,
          dataQuality: true
        }
      },
      logs: [
        {
          id: '1',
          timestamp: '2024-01-25T02:00:00Z',
          type: 'info',
          message: 'Sync completed successfully',
          records: 1250,
          duration: 45
        }
      ],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-25T02:00:00Z'
    }
  ]);

  const stats = {
    totalIntegrations: integrations.length,
    activeIntegrations: integrations.filter(i => i.status === 'active').length,
    totalWebhooks: webhooks.length,
    activeWebhooks: webhooks.filter(w => w.status === 'active').length,
    totalApiKeys: apiKeys.length,
    activeApiKeys: apiKeys.filter(k => k.status === 'active').length,
    totalDataSyncs: dataSyncs.length,
    activeDataSyncs: dataSyncs.filter(d => d.status === 'active').length
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'success':
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'inactive':
      case 'failed':
      case 'error':
      case 'expired':
      case 'revoked':
        return 'text-red-600 bg-red-100';
      case 'testing':
      case 'pending':
      case 'warning':
        return 'text-yellow-600 bg-yellow-100';
      case 'maintenance':
      case 'running':
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'payment':
        return <CreditCardIcon className="h-5 w-5" />;
      case 'communication':
        return <ChatBubbleLeftRightIcon className="h-5 w-5" />;
      case 'analytics':
        return <ChartBarIcon className="h-5 w-5" />;
      case 'storage':
        return <DatabaseIcon className="h-5 w-5" />;
      case 'authentication':
        return <ShieldCheckIcon className="h-5 w-5" />;
      case 'third_party':
        return <GlobeAltIcon className="h-5 w-5" />;
      case 'hardware':
        return <ServerIcon className="h-5 w-5" />;
      case 'api':
        return <WifiIcon className="h-5 w-5" />;
      default:
        return <Cog6ToothIcon className="h-5 w-5" />;
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Integrations</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalIntegrations}</p>
            </div>
            <Cog6ToothIcon className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Integrations</p>
              <p className="text-2xl font-bold text-green-600">{stats.activeIntegrations}</p>
            </div>
            <CheckCircleIcon className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Webhooks</p>
              <p className="text-2xl font-bold text-blue-600">{stats.totalWebhooks}</p>
            </div>
            <GlobeAltIcon className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">API Keys</p>
              <p className="text-2xl font-bold text-purple-600">{stats.totalApiKeys}</p>
            </div>
            <KeyIcon className="h-8 w-8 text-purple-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Data Syncs</p>
              <p className="text-2xl font-bold text-orange-600">{stats.totalDataSyncs}</p>
            </div>
            <ArrowPathIcon className="h-8 w-8 text-orange-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">System Health</p>
              <p className="text-2xl font-bold text-green-600">98%</p>
            </div>
            <ShieldCheckIcon className="h-8 w-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Integration Status */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Integration Status</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {integrations.map((integration) => (
              <div key={integration.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {getCategoryIcon(integration.category)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{integration.name}</p>
                    <p className="text-xs text-gray-500">{integration.provider}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(integration.status)}`}>
                    {integration.status}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    {integration.monitoring.uptime}% uptime
                  </p>
                </div>
              </div>
            ))}
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
              <p className="text-sm text-gray-900">PayNow payment processed successfully</p>
              <p className="text-xs text-gray-500">5 minutes ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <ArrowPathIcon className="h-5 w-5 text-blue-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">Student data sync completed</p>
              <p className="text-xs text-gray-500">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-5 w-5 text-orange-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">Webhook delivery failed - retrying</p>
              <p className="text-xs text-gray-500">3 hours ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderIntegrations = () => (
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
                placeholder="Search integrations..."
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
              <option value="all">All Categories</option>
              <option value="payment">Payment</option>
              <option value="communication">Communication</option>
              <option value="analytics">Analytics</option>
              <option value="storage">Storage</option>
              <option value="authentication">Authentication</option>
            </select>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Integration
            </button>
          </div>
        </div>
      </div>

      {/* Integrations List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="min-w-full divide-y divide-gray-200">
          <div className="bg-gray-50 px-6 py-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">All Integrations</h3>
              <span className="text-sm text-gray-500">{integrations.length} integrations</span>
            </div>
          </div>
          <div className="bg-white divide-y divide-gray-200">
            {integrations.map((integration) => (
              <div key={integration.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        {getCategoryIcon(integration.category)}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-lg font-medium text-gray-900">{integration.name}</h4>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(integration.status)}`}>
                          {integration.status}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {integration.category}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-gray-500">{integration.provider}</span>
                        <span className="text-sm text-gray-500">v{integration.version}</span>
                        <span className="text-sm text-gray-500">{integration.usage.requests.thisMonth} requests this month</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setSelectedItem(integration);
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
    </div>
  );

  const renderWebhooks = () => (
    <div className="space-y-6">
      {/* Webhooks List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Webhooks</h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Webhook
            </button>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {webhooks.map((webhook) => (
            <div key={webhook.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                      <GlobeAltIcon className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-lg font-medium text-gray-900">{webhook.name}</h4>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(webhook.status)}`}>
                        {webhook.status}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-gray-500">{webhook.event}</span>
                      <span className="text-sm text-gray-500">{webhook.method}</span>
                      <span className="text-sm text-gray-500">{webhook.delivery.rate}% delivery rate</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedItem(webhook);
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

  const renderApiKeys = () => (
    <div className="space-y-6">
      {/* API Keys List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">API Keys</h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Generate API Key
            </button>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {apiKeys.map((apiKey) => (
            <div key={apiKey.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <KeyIcon className="h-5 w-5 text-purple-600" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-lg font-medium text-gray-900">{apiKey.name}</h4>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(apiKey.status)}`}>
                        {apiKey.status}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-gray-500">{apiKey.prefix}•••••••••</span>
                      <span className="text-sm text-gray-500">{apiKey.permissions.length} permissions</span>
                      <span className="text-sm text-gray-500">{apiKey.usage.currentPeriod.requests} requests this period</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedItem(apiKey);
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

  const renderDataSync = () => (
    <div className="space-y-6">
      {/* Data Sync List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Data Syncs</h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Data Sync
            </button>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {dataSyncs.map((dataSync) => (
            <div key={dataSync.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                      <ArrowPathIcon className="h-5 w-5 text-orange-600" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-lg font-medium text-gray-900">{dataSync.name}</h4>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(dataSync.status)}`}>
                        {dataSync.status}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-gray-500">{dataSync.source.type} → {dataSync.destination.type}</span>
                      <span className="text-sm text-gray-500">{dataSync.schedule.type}</span>
                      <span className="text-sm text-gray-500">{dataSync.performance.recordsPerSecond} records/sec</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedItem(dataSync);
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

  const renderMonitoring = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">System Monitoring</h3>
        <p className="text-gray-600">Integration monitoring and health checks coming soon...</p>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Integration Settings</h3>
        <p className="text-gray-600">Global integration settings and configurations coming soon...</p>
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
              <Cog6ToothIcon className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">Integrations</h1>
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
              { id: 'integrations', name: 'Integrations', icon: Cog6ToothIcon },
              { id: 'webhooks', name: 'Webhooks', icon: GlobeAltIcon },
              { id: 'api_keys', name: 'API Keys', icon: KeyIcon },
              { id: 'data_sync', name: 'Data Sync', icon: ArrowPathIcon },
              { id: 'monitoring', name: 'Monitoring', icon: ShieldCheckIcon },
              { id: 'settings', name: 'Settings', icon: Cog6ToothIcon }
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
        {activeTab === 'integrations' && renderIntegrations()}
        {activeTab === 'webhooks' && renderWebhooks()}
        {activeTab === 'api_keys' && renderApiKeys()}
        {activeTab === 'data_sync' && renderDataSync()}
        {activeTab === 'monitoring' && renderMonitoring()}
        {activeTab === 'settings' && renderSettings()}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedItem && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {selectedItem.name || 'Details'}
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

export default Integrations;
