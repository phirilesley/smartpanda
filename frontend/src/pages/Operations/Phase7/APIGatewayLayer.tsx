import React, { useState, useEffect } from 'react';
import {
  ServerIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
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
  Cog6ToothIcon,
  UserGroupIcon,
  KeyIcon,
  FingerprintIcon,
  ChipIcon,
  CloudIcon,
  DevicePhoneMobileIcon,
  DeviceTabletIcon,
  LaptopIcon,
  MonitorIcon,
  WifiIcon,
  DatabaseIcon,
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
  ExclamationTriangleIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
  TagIcon,
  ArchiveBoxIcon,
  ReceiptRefundIcon,
  TruckIcon,
  BuildingOfficeIcon,
  AcademicCapIcon,
  SparklesIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';

interface APIRoute {
  id: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
  description: string;
  category: 'academic' | 'finance' | 'operations' | 'communication' | 'analytics' | 'system';
  service: string;
  version: string;
  deprecated: boolean;
  deprecationDate?: string;
  migrationGuide?: string;
  authentication: {
    required: boolean;
    type: 'bearer' | 'basic' | 'api_key' | 'oauth2' | 'none';
    permissions: string[];
  };
  rateLimit: {
    enabled: boolean;
    requests: number;
    window: number;
    policy: string;
    burstLimit?: number;
    burstWindow?: number;
  };
  caching: {
    enabled: boolean;
    ttl: number;
    key: string;
    vary: string[];
    invalidation: {
      enabled: boolean;
      triggers: string[];
    };
  };
  validation: {
    schema: {
      type: string;
      properties: {
        [key: string]: {
          type: string;
          required: boolean;
          format?: string;
          minLength?: number;
          maxLength?: number;
          pattern?: string;
        };
      };
    };
    middleware: string[];
  };
  transformation: {
    enabled: boolean;
    type: 'request' | 'response' | 'both';
    rules: {
      from: string;
      to: string;
      condition?: string;
    }[];
  };
  monitoring: {
    enabled: boolean;
    logging: boolean;
    metrics: string[];
    alerts: {
      enabled: boolean;
      thresholds: {
        responseTime: number;
        errorRate: number;
        throughput: number;
      };
    };
  };
  documentation: {
    swaggerUrl: string;
    postmanCollection: string;
    examples: string;
    testing: {
      sandbox: boolean;
      mockData: boolean;
    };
  };
  deployment: {
    environments: {
      name: string;
      url: string;
      version: string;
      status: 'active' | 'inactive' | 'maintenance';
      lastDeployed: string;
    }[];
  };
  security: {
    cors: {
      enabled: boolean;
      origins: string[];
      methods: string[];
      headers: string[];
      credentials: boolean;
    };
    https: {
      required: boolean;
      redirect: boolean;
      hsts: boolean;
    };
    validation: {
      input: boolean;
      output: boolean;
      sanitization: boolean;
    };
  };
  metadata: {
    createdBy: string;
    createdAt: string;
    lastModifiedBy: string;
    lastModifiedAt: string;
    version: number;
    tags: string[];
  };
  usage: {
    totalRequests: number;
    requestsPerMonth: number;
    averageResponseTime: number;
    errorRate: number;
    topEndpoints: {
      path: string;
      requests: number;
      averageResponseTime: number;
    }[];
  };
  createdAt: string;
  updatedAt: string;
}

interface APIPolicy {
  id: string;
  name: string;
  description: string;
  type: 'rate_limit' | 'security' | 'caching' | 'transformation' | 'validation' | 'monitoring';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'inactive' | 'testing' | 'error';
  configuration: {
    [key: string]: any;
  };
  conditions: {
    path: string;
    method: string;
    headers: string[];
    query: string[];
    body: string[];
  }[];
  actions: {
    type: 'allow' | 'deny' | 'modify' | 'redirect';
    parameters: {
      [key: string]: any;
    };
  }[];
  exceptions: {
    path: string;
    reason: string;
    expires?: string;
  }[];
  metrics: {
    hits: number;
    blocked: number;
    allowed: number;
    modified: number;
    redirected: number;
  };
  metadata: {
    createdBy: string;
    createdAt: string;
    lastModifiedBy: string;
    lastModifiedAt: string;
    version: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface APIKey {
  id: string;
  name: string;
  description: string;
  key: string;
  prefix: string;
  permissions: string[];
  restrictions: {
    paths: string[];
    methods: string[];
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
    topEndpoints: {
      path: string;
      requests: number;
    }[];
  };
  status: 'active' | 'inactive' | 'expired' | 'revoked';
  createdBy: string;
  createdAt: string;
  expiresAt?: string;
  lastUsed?: string;
}

interface APIMetrics {
  id: string;
  timestamp: string;
  endpoint: string;
  method: string;
  statusCode: number;
  responseTime: number;
  requestSize: number;
  responseSize: number;
  userAgent: string;
  ipAddress: string;
  userId?: string;
  apiKey?: string;
  error?: {
    type: string;
    message: string;
    stack?: string;
  };
  cache: {
    hit: boolean;
    key: string;
    ttl: number;
  };
  security: {
    authenticated: boolean;
    authorized: boolean;
    userId?: string;
    permissions: string[];
  };
  performance: {
    databaseTime: number;
    processingTime: number;
    serializationTime: number;
  };
}

interface APIVersion {
  id: string;
  version: string;
  description: string;
  status: 'stable' | 'beta' | 'alpha' | 'deprecated';
  releaseDate: string;
  deprecationDate?: string;
  migrationGuide?: string;
  breakingChanges: {
    type: string;
    description: string;
    impact: string;
    solution: string;
  }[];
  newFeatures: {
    name: string;
    description: string;
    documentation: string;
  }[];
  bugFixes: {
    id: string;
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
  }[];
  compatibility: {
    minVersion: string;
    maxVersion: string;
    supportedVersions: string[];
  };
  rollout: {
    percentage: number;
    environments: string[];
    startDate: string;
    targetDate: string;
  };
  metadata: {
    createdBy: string;
    createdAt: string;
    lastModifiedBy: string;
    lastModifiedAt: string;
  };
}

const APIGatewayLayer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'routes' | 'policies' | 'keys' | 'metrics' | 'versions' | 'settings'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<APIRoute | APIPolicy | APIKey | APIMetrics | APIVersion | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(3);

  // Mock data
  const [routes] = useState<APIRoute[]>([
    {
      id: '1',
      path: '/api/v1/students',
      method: 'GET',
      description: 'Retrieve student information',
      category: 'academic',
      service: 'Student Management',
      version: 'v1',
      deprecated: false,
      authentication: {
        required: true,
        type: 'bearer',
        permissions: ['students:read']
      },
      rateLimit: {
        enabled: true,
        requests: 1000,
        window: 3600,
        policy: 'sliding_window',
        burstLimit: 100,
        burstWindow: 60
      },
      caching: {
        enabled: true,
        ttl: 300,
        key: 'students',
        vary: ['Authorization', 'Accept-Language'],
        invalidation: {
          enabled: true,
          triggers: ['student_update', 'grade_change']
        }
      },
      validation: {
        schema: {
          type: 'object',
          properties: {
            grade: { type: 'string', required: false },
            class: { type: 'string', required: false },
            page: { type: 'integer', required: false, minimum: 1 },
            limit: { type: 'integer', required: false, minimum: 1, maximum: 100 }
          }
        },
        middleware: ['validation', 'sanitization']
      },
      transformation: {
        enabled: true,
        type: 'response',
        rules: [
          { from: 'studentId', to: 'id' },
          { from: 'studentName', to: 'name' }
        ]
      },
      monitoring: {
        enabled: true,
        logging: true,
        metrics: ['response_time', 'error_rate', 'throughput'],
        alerts: {
          enabled: true,
          thresholds: {
            responseTime: 1000,
            errorRate: 5,
            throughput: 100
          }
        }
      },
      documentation: {
        swaggerUrl: 'https://api.school.edu/swagger/v1/students',
        postmanCollection: 'https://api.school.edu/postman/students',
        examples: 'https://api.school.edu/examples/students',
        testing: {
          sandbox: true,
          mockData: true
        }
      },
      deployment: {
        environments: [
          {
            name: 'Production',
            url: 'https://api.school.edu',
            version: 'v1.0.0',
            status: 'active',
            lastDeployed: '2024-01-20T00:00:00Z'
          },
          {
            name: 'Staging',
            url: 'https://staging-api.school.edu',
            version: 'v1.0.0',
            status: 'active',
            lastDeployed: '2024-01-20T00:00:00Z'
          }
        ]
      },
      security: {
        cors: {
          enabled: true,
          origins: ['https://school.edu', 'https://app.school.edu'],
          methods: ['GET', 'POST', 'PUT', 'DELETE'],
          headers: ['Content-Type', 'Authorization'],
          credentials: true
        },
        https: {
          required: true,
          redirect: true,
          hsts: true
        },
        validation: {
          input: true,
          output: true,
          sanitization: true
        }
      },
      metadata: {
        createdBy: 'API Team',
        createdAt: '2024-01-01T00:00:00Z',
        lastModifiedBy: 'API Team',
        lastModifiedAt: '2024-01-20T00:00:00Z',
        version: 1,
        tags: ['students', 'academic', 'v1']
      },
      usage: {
        totalRequests: 15420,
        requestsPerMonth: 2340,
        averageResponseTime: 250,
        errorRate: 0.5,
        topEndpoints: [
          { path: '/api/v1/students', requests: 8500, averageResponseTime: 200 },
          { path: '/api/v1/students/{id}', requests: 4200, averageResponseTime: 150 }
        ]
      },
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-20T00:00:00Z'
    }
  ]);

  const [policies] = useState<APIPolicy[]>([
    {
      id: '1',
      name: 'Rate Limiting Policy',
      description: 'Global rate limiting for all API endpoints',
      type: 'rate_limit',
      priority: 'high',
      status: 'active',
      configuration: {
        requests: 1000,
        window: 3600,
        policy: 'sliding_window',
        burstLimit: 100,
        burstWindow: 60
      },
      conditions: [
        {
          path: '/api/v1/*',
          method: '*',
          headers: [],
          query: [],
          body: []
        }
      ],
      actions: [
        {
          type: 'allow',
          parameters: {
            rateLimit: 1000,
            window: 3600
          }
        }
      ],
      exceptions: [],
      metrics: {
        hits: 150000,
        blocked: 500,
        allowed: 149500,
        modified: 0,
        redirected: 0
      },
      metadata: {
        createdBy: 'API Team',
        createdAt: '2024-01-01T00:00:00Z',
        lastModifiedBy: 'API Team',
        lastModifiedAt: '2024-01-15T00:00:00Z',
        version: 1
      },
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z'
    }
  ]);

  const [apiKeys] = useState<APIKey[]>([
    {
      id: '1',
      name: 'Mobile App API Key',
      description: 'API key for mobile application access',
      key: 'sk_live_1234567890abcdef',
      prefix: 'sk_live_',
      permissions: ['students:read', 'grades:read', 'attendance:read', 'attendance:write'],
      restrictions: {
        paths: ['/api/v1/students', '/api/v1/grades', '/api/v1/attendance'],
        methods: ['GET', 'POST', 'PUT'],
        ipAddresses: ['192.168.1.0/24', '10.0.0.0/8'],
        domains: ['mobile.school.edu', 'app.school.edu'],
        rateLimit: {
          requests: 5000,
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
        },
        topEndpoints: [
          { path: '/api/v1/students', requests: 15000 },
          { path: '/api/v1/attendance', requests: 12000 }
        ]
      },
      status: 'active',
      createdBy: 'Admin',
      createdAt: '2024-01-01T00:00:00Z',
      expiresAt: '2025-01-01T00:00:00Z',
      lastUsed: '2024-01-25T10:30:00Z'
    }
  ]);

  const [metrics] = useState<APIMetrics[]>([
    {
      id: '1',
      timestamp: '2024-01-25T10:30:00Z',
      endpoint: '/api/v1/students',
      method: 'GET',
      statusCode: 200,
      responseTime: 250,
      requestSize: 1024,
      responseSize: 2048,
      userAgent: 'Mozilla/5.0 (Mobile App)',
      ipAddress: '192.168.1.100',
      userId: 'user123',
      apiKey: 'sk_live_1234567890abcdef',
      cache: {
        hit: false,
        key: null,
        ttl: 0
      },
      security: {
        authenticated: true,
        authorized: true,
        userId: 'user123',
        permissions: ['students:read']
      },
      performance: {
        databaseTime: 100,
        processingTime: 120,
        serializationTime: 30
      }
    }
  ]);

  const [versions] = useState<APIVersion[]>([
    {
      id: '1',
      version: 'v1.0.0',
      description: 'Stable version 1.0.0 with core API features',
      status: 'stable',
      releaseDate: '2024-01-15',
      breakingChanges: [],
      newFeatures: [
        {
          name: 'Enhanced Error Handling',
          description: 'Improved error responses with detailed error codes',
          documentation: 'https://docs.school.edu/api/v1/error-handling'
        }
      ],
      bugFixes: [
        {
          id: 'BUG-123',
          description: 'Fixed pagination issue in student endpoints',
          severity: 'medium'
        }
      ],
      compatibility: {
        minVersion: 'v0.9.0',
        maxVersion: 'v1.0.0',
        supportedVersions: ['v0.9.0', 'v0.9.5', 'v1.0.0']
      },
      rollout: {
        percentage: 100,
        environments: ['Production', 'Staging'],
        startDate: '2024-01-15',
        targetDate: '2024-01-15'
      },
      metadata: {
        createdBy: 'API Team',
        createdAt: '2024-01-15T00:00:00Z',
        lastModifiedBy: 'API Team',
        lastModifiedAt: '2024-01-15T00:00:00Z',
        version: 1
      }
    }
  ]);

  const stats = {
    totalRoutes: routes.length,
    activeRoutes: routes.filter(r => !r.deprecated).length,
    totalPolicies: policies.length,
    activePolicies: policies.filter(p => p.status === 'active').length,
    totalApiKeys: apiKeys.length,
    activeApiKeys: apiKeys.filter(k => k.status === 'active').length,
    totalRequests: metrics.length,
    averageResponseTime: metrics.reduce((acc, m) => acc + m.responseTime, 0) / metrics.length,
    errorRate: metrics.filter(m => m.statusCode >= 400).length / metrics.length * 100
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'stable':
      case 'completed':
      case 'allowed':
        return 'text-green-600 bg-green-100';
      case 'inactive':
      case 'deprecated':
      case 'blocked':
      case 'denied':
      case 'expired':
      case 'revoked':
        return 'text-red-600 bg-red-100';
      case 'testing':
      case 'beta':
      case 'alpha':
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'maintenance':
      case 'error':
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET':
        return 'text-green-600 bg-green-100';
      case 'POST':
        return 'text-blue-600 bg-blue-100';
      case 'PUT':
        return 'text-orange-600 bg-orange-100';
      case 'DELETE':
        return 'text-red-600 bg-red-100';
      case 'PATCH':
        return 'text-purple-600 bg-purple-100';
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
              <p className="text-sm text-gray-600">Total Routes</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalRoutes}</p>
            </div>
            <ServerIcon className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Routes</p>
              <p className="text-2xl font-bold text-green-600">{stats.activeRoutes}</p>
            </div>
            <CheckCircleIcon className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">API Policies</p>
              <p className="text-2xl font-bold text-blue-600">{stats.totalPolicies}</p>
            </div>
            <ShieldCheckIcon className="h-8 w-8 text-blue-500" />
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
              <p className="text-sm text-gray-600">Avg Response Time</p>
              <p className="text-2xl font-bold text-green-600">{stats.averageResponseTime.toFixed(0)}ms</p>
            </div>
            <ClockIcon className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Error Rate</p>
              <p className="text-2xl font-bold text-red-600">{stats.errorRate.toFixed(1)}%</p>
            </div>
            <ExclamationTriangleIcon className="h-8 w-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* API Health Status */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">API Gateway Health</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-8 w-8 text-green-500" />
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900">Gateway Status</p>
                <p className="text-sm text-gray-500">All systems operational</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <WifiIcon className="h-8 w-8 text-green-500" />
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900">Connectivity</p>
                <p className="text-sm text-gray-500">99.9% uptime</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <DatabaseIcon className="h-8 w-8 text-blue-500" />
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900">Database</p>
                <p className="text-sm text-gray-500">Optimal performance</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <ShieldCheckIcon className="h-8 w-8 text-green-500" />
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900">Security</p>
                <p className="text-sm text-gray-500">No threats detected</p>
              </div>
            </div>
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
              <p className="text-sm text-gray-900">API v1.0.0 successfully deployed to production</p>
              <p className="text-xs text-gray-500">2 days ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-5 w-5 text-orange-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">High traffic detected on student endpoints</p>
              <p className="text-xs text-gray-500">5 hours ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <KeyIcon className="h-5 w-5 text-blue-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">New API key generated for mobile app</p>
              <p className="text-xs text-gray-500">1 week ago</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Endpoints */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Top Endpoints</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {routes[0]?.usage.topEndpoints.map((endpoint, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <ServerIcon className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{endpoint.path}</p>
                    <p className="text-xs text-gray-500">{endpoint.requests.toLocaleString()} requests</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">{endpoint.averageResponseTime}ms avg</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderRoutes = () => (
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
                placeholder="Search routes..."
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
              <option value="all">All Routes</option>
              <option value="academic">Academic</option>
              <option value="finance">Finance</option>
              <option value="operations">Operations</option>
              <option value="communication">Communication</option>
              <option value="analytics">Analytics</option>
              <option value="system">System</option>
            </select>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Route
            </button>
          </div>
        </div>
      </div>

      {/* Routes List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="min-w-full divide-y divide-gray-200">
          <div className="bg-gray-50 px-6 py-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">All API Routes</h3>
              <span className="text-sm text-gray-500">{routes.length} routes</span>
            </div>
          </div>
          <div className="bg-white divide-y divide-gray-200">
            {routes.map((route) => (
              <div key={route.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${getMethodColor(route.method)}`}>
                        <span className="text-white font-bold text-sm">
                          {route.method}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-lg font-medium text-gray-900">{route.path}</h4>
                        {route.deprecated && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            Deprecated
                          </span>
                        )}
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800`}>
                          {route.category}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-gray-500">{route.service}</span>
                        <span className="text-sm text-gray-500">{route.version}</span>
                        <span className="text-sm text-gray-500">{route.usage.requestsPerMonth}/month</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setSelectedItem(route);
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

  const renderPolicies = () => (
    <div className="space-y-6">
      {/* Policies List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">API Policies</h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Policy
            </button>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {policies.map((policy) => (
            <div key={policy.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <ShieldCheckIcon className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-lg font-medium text-gray-900">{policy.name}</h4>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(policy.status)}`}>
                        {policy.status}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800`}>
                        {policy.type.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-gray-500">{policy.description}</span>
                      <span className="text-sm text-gray-500">Priority: {policy.priority}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedItem(policy);
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
              Generate Key
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

  const renderMetrics = () => (
    <div className="space-y-6">
      {/* Metrics Dashboard */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">API Metrics Dashboard</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{stats.totalRequests.toLocaleString()}</p>
            <p className="text-sm text-gray-500">Total Requests</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{stats.averageResponseTime.toFixed(0)}ms</p>
            <p className="text-sm text-gray-500">Avg Response Time</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">{stats.errorRate.toFixed(1)}%</p>
            <p className="text-sm text-gray-500">Error Rate</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{stats.activeApiKeys}</p>
            <p className="text-sm text-gray-500">Active Keys</p>
          </div>
        </div>
      </div>

      {/* Recent Metrics */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent API Calls</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {metrics.slice(0, 10).map((metric, index) => (
            <div key={index} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${metric.statusCode < 400 ? 'bg-green-100' : metric.statusCode < 500 ? 'bg-yellow-100' : 'bg-red-100'}`}>
                    <span className={`text-xs font-bold ${metric.statusCode < 400 ? 'text-green-600' : metric.statusCode < 500 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {metric.statusCode}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{metric.endpoint}</p>
                    <p className="text-xs text-gray-500">{metric.method} - {metric.responseTime}ms</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">{new Date(metric.timestamp).toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderVersions = () => (
    <div className="space-y-6">
      {/* Versions List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">API Versions</h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Release Version
            </button>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {versions.map((version) => (
            <div key={version.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${getStatusColor(version.status)}`}>
                      <TagIcon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-lg font-medium text-gray-900">{version.version}</h4>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(version.status)}`}>
                        {version.status}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-gray-500">{version.description}</span>
                      <span className="text-sm text-gray-500">{version.releaseDate}</span>
                      <span className="text-sm text-gray-500">{version.rollout.percentage}% deployed</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedItem(version);
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

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">API Gateway Settings</h3>
        <p className="text-gray-600">Global API gateway configuration and management settings coming soon...</p>
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
              <ServerIcon className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">API Gateway Layer</h1>
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
              { id: 'routes', name: 'Routes', icon: ServerIcon },
              { id: 'policies', name: 'Policies', icon: ShieldCheckIcon },
              { id: 'keys', name: 'API Keys', icon: KeyIcon },
              { id: 'metrics', name: 'Metrics', icon: ChartBarIcon },
              { id: 'versions', name: 'Versions', icon: TagIcon },
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
        {activeTab === 'routes' && renderRoutes()}
        {activeTab === 'policies' && renderPolicies()}
        {activeTab === 'keys' && renderApiKeys()}
        {activeTab === 'metrics' && renderMetrics()}
        {activeTab === 'versions' && renderVersions()}
        {activeTab === 'settings' && renderSettings()}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedItem && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {selectedItem.path || selectedItem.name || selectedItem.version || 'Details'}
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

export default APIGatewayLayer;
