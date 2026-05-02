import React, { useState, useEffect } from 'react';
import {
  DevicePhoneMobileIcon,
  CloudIcon,
  WifiIcon,
  DownloadIcon,
  UploadIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  Cog6ToothIcon,
  BellIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  ServerIcon,
  DatabaseIcon,
  ChartBarIcon,
  DocumentTextIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
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
  ArrowPathIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CurrencyDollarIcon,
  TagIcon,
  ArchiveBoxIcon,
  ReceiptRefundIcon,
  TruckIcon,
  BuildingOfficeIcon,
  UserIcon,
  AcademicCapIcon,
  SparklesIcon,
  CameraIcon,
  VideoCameraIcon,
  VolumeUpIcon,
  VolumeDownIcon,
  MapPinIcon,
  ClockIcon,
  CalendarIcon,
  UserGroupIcon,
  CreditCardIcon,
  BanknotesIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  NewspaperIcon,
  BookOpenIcon,
  PencilSquareIcon,
  ClipboardDocumentListIcon,
  FolderIcon,
  FolderOpenIcon,
  DocumentArrowDownIcon,
  DocumentArrowUpIcon,
} from '@heroicons/react/24/outline';

interface PWAConfig {
  id: string;
  name: string;
  description: string;
  version: string;
  status: 'active' | 'inactive' | 'development' | 'testing';
  manifest: {
    name: string;
    shortName: string;
    description: string;
    startUrl: string;
    display: 'standalone' | 'fullscreen' | 'minimal-ui' | 'browser';
    orientation: 'portrait' | 'landscape' | 'any';
    themeColor: string;
    backgroundColor: string;
    icons: {
      sizes: string[];
      src: string;
      type: string;
    }[];
    shortcuts: {
      name: string;
      shortName: string;
      description: string;
      url: string;
      icons: {
        sizes: string[];
        src: string;
      };
    }[];
  };
  serviceWorker: {
    enabled: boolean;
    version: string;
    registrationDate: string;
    lastUpdate: string;
    cacheStrategy: 'cacheFirst' | 'networkFirst' | 'cacheOnly' | 'networkOnly';
    cacheExpiration: number;
    offlineEnabled: boolean;
    backgroundSync: boolean;
    pushNotifications: boolean;
  };
  offline: {
    enabled: boolean;
    cacheSize: number;
    maxCacheSize: number;
    cachedPages: string[];
    cachedAssets: string[];
    offlineData: {
      [key: string]: any;
    };
  };
  performance: {
    loadTime: number;
    firstContentfulPaint: number;
    largestContentfulPaint: number;
    cumulativeLayoutShift: number;
    firstInputDelay: number;
    totalBlockingTime: number;
    score: number;
    lastAudit: string;
  };
  security: {
    https: boolean;
    csp: boolean;
    hsts: boolean;
    certificate: {
      issuer: string;
      validFrom: string;
      validUntil: string;
      fingerprint: string;
    };
    permissions: string[];
  };
  features: {
    installable: boolean;
    standalone: boolean;
    fullscreen: boolean;
    orientation: boolean;
    geolocation: boolean;
    camera: boolean;
    microphone: boolean;
    notifications: boolean;
    backgroundSync: boolean;
    share: boolean;
  };
  compatibility: {
    chrome: boolean;
    firefox: boolean;
    safari: boolean;
    edge: boolean;
    ios: boolean;
    android: boolean;
    version: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface CacheEntry {
  id: string;
  url: string;
  method: string;
  status: number;
  headers: {
    [key: string]: string;
  };
  size: number;
  cachedAt: string;
  expiresAt: string;
  lastAccessed: string;
  hitCount: number;
  type: 'document' | 'script' | 'style' | 'image' | 'font' | 'api' | 'data';
  priority: 'high' | 'medium' | 'low';
}

interface BackgroundSync {
  id: string;
  name: string;
  description: string;
  tag: string;
  url: string;
  method: string;
  headers: {
    [key: string]: string;
  };
  body: any;
  options: {
    method: string;
    headers: {
      [key: string]: string;
    };
    body: any;
    includeCredentials: boolean;
  };
  state: 'pending' | 'running' | 'completed' | 'failed';
  lastSync: string;
  nextSync: string;
  retryCount: number;
  maxRetries: number;
  successCount: number;
  failureCount: number;
  averageResponseTime: number;
  createdAt: string;
  updatedAt: string;
}

interface PushSubscription {
  id: string;
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
  expirationTime?: string;
  userAgent: string;
  enabled: boolean;
  createdAt: string;
  lastUsed: string;
  notifications: {
    id: string;
    title: string;
    body: string;
    icon?: string;
    badge?: string;
    tag?: string;
    data?: any;
    timestamp: string;
    read: boolean;
    clicked: boolean;
  }[];
}

interface OfflineQueue {
  id: string;
  type: 'api_call' | 'form_submit' | 'file_upload' | 'sync_request';
  url: string;
  method: string;
  headers: {
    [key: string]: string;
  };
  body: any;
  priority: 'high' | 'medium' | 'low';
  retryCount: number;
  maxRetries: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: string;
  processedAt?: string;
  error?: string;
}

const PWACapabilities: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'config' | 'cache' | 'sync' | 'notifications' | 'offline' | 'performance' | 'security'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PWAConfig | CacheEntry | BackgroundSync | PushSubscription | OfflineQueue | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(3);

  // Mock data
  const [pwaConfig] = useState<PWAConfig>({
    id: '1',
    name: 'Smart Panda School System',
    description: 'Progressive Web App for school management',
    version: '2.1.0',
    status: 'active',
    manifest: {
      name: 'Smart Panda School System',
      shortName: 'Smart Panda',
      description: 'Complete school management system',
      startUrl: '/',
      display: 'standalone',
      orientation: 'portrait',
      themeColor: '#3B82F6',
      backgroundColor: '#FFFFFF',
      icons: [
        {
          sizes: '192x192',
          src: '/icons/icon-192.png',
          type: 'image/png'
        },
        {
          sizes: '512x512',
          src: '/icons/icon-512.png',
          type: 'image/png'
        }
      ],
      shortcuts: [
        {
          name: 'Dashboard',
          shortName: 'Dashboard',
          description: 'Quick access to dashboard',
          url: '/dashboard',
          icons: {
            sizes: '96x96',
            src: '/icons/dashboard.png'
          }
        }
      ]
    },
    serviceWorker: {
      enabled: true,
      version: '2.1.0',
      registrationDate: '2024-01-15T00:00:00Z',
      lastUpdate: '2024-01-20T00:00:00Z',
      cacheStrategy: 'cacheFirst',
      cacheExpiration: 86400,
      offlineEnabled: true,
      backgroundSync: true,
      pushNotifications: true
    },
    offline: {
      enabled: true,
      cacheSize: 52428800,
      maxCacheSize: 104857600,
      cachedPages: ['/dashboard', '/grades', '/attendance', '/timetable'],
      cachedAssets: ['/icons/icon-192.png', '/icons/icon-512.png', '/styles/main.css'],
      offlineData: {
        userSettings: {},
        cachedGrades: [],
        offlineForms: []
      }
    },
    performance: {
      loadTime: 1200,
      firstContentfulPaint: 800,
      largestContentfulPaint: 1500,
      cumulativeLayoutShift: 0.1,
      firstInputDelay: 50,
      totalBlockingTime: 100,
      score: 92,
      lastAudit: '2024-01-25T00:00:00Z'
    },
    security: {
      https: true,
      csp: true,
      hsts: true,
      certificate: {
        issuer: 'Let\'s Encrypt',
        validFrom: '2024-01-01T00:00:00Z',
        validUntil: '2024-04-01T00:00:00Z',
        fingerprint: 'SHA256:ABC123...'
      },
      permissions: ['geolocation', 'camera', 'microphone', 'notifications']
    },
    features: {
      installable: true,
      standalone: true,
      fullscreen: true,
      orientation: true,
      geolocation: true,
      camera: true,
      microphone: true,
      notifications: true,
      backgroundSync: true,
      share: true
    },
    compatibility: {
      chrome: true,
      firefox: true,
      safari: true,
      edge: true,
      ios: true,
      android: true,
      version: '2.1.0'
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-25T00:00:00Z'
  });

  const [cacheEntries] = useState<CacheEntry[]>([
    {
      id: '1',
      url: '/dashboard',
      method: 'GET',
      status: 200,
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'max-age=3600'
      },
      size: 524288,
      cachedAt: '2024-01-25T10:00:00Z',
      expiresAt: '2024-01-25T11:00:00Z',
      lastAccessed: '2024-01-25T10:30:00Z',
      hitCount: 5,
      type: 'document',
      priority: 'high'
    },
    {
      id: '2',
      url: '/api/students',
      method: 'GET',
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'max-age=300'
      },
      size: 102400,
      cachedAt: '2024-01-25T09:00:00Z',
      expiresAt: '2024-01-25T09:05:00Z',
      lastAccessed: '2024-01-25T10:15:00Z',
      hitCount: 3,
      type: 'api',
      priority: 'medium'
    }
  ]);

  const [backgroundSyncs] = useState<BackgroundSync[]>([
    {
      id: '1',
      name: 'Student Data Sync',
      description: 'Sync student data in background',
      tag: 'student-sync',
      url: '/api/sync/students',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        lastSync: '2024-01-25T09:00:00Z',
        changes: []
      },
      options: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          lastSync: '2024-01-25T09:00:00Z',
          changes: []
        },
        includeCredentials: true
      },
      state: 'completed',
      lastSync: '2024-01-25T10:00:00Z',
      nextSync: '2024-01-25T11:00:00Z',
      retryCount: 0,
      maxRetries: 3,
      successCount: 15,
      failureCount: 0,
      averageResponseTime: 500,
      createdAt: '2024-01-25T09:00:00Z',
      updatedAt: '2024-01-25T10:00:00Z'
    }
  ]);

  const [pushSubscriptions] = useState<PushSubscription[]>([
    {
      id: '1',
      endpoint: 'https://fcm.googleapis.com/fcm/send/...',
      keys: {
        p256dh: 'BN_xR4...',
        auth: 'v4...'
      },
      expirationTime: '2024-04-01T00:00:00Z',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      enabled: true,
      createdAt: '2024-01-15T00:00:00Z',
      lastUsed: '2024-01-25T10:30:00Z',
      notifications: [
        {
          id: 'notif1',
          title: 'New Grade Posted',
          body: 'Mathematics grade for Form 4A has been posted',
          icon: '/icons/notification.png',
          badge: '/icons/badge.png',
          tag: 'grade',
          data: {
            type: 'grade',
            studentId: '123',
            subject: 'Mathematics'
          },
          timestamp: '2024-01-25T10:30:00Z',
          read: false,
          clicked: false
        }
      ]
    }
  ]);

  const [offlineQueue] = useState<OfflineQueue[]>([
    {
      id: '1',
      type: 'api_call',
      url: '/api/attendance/mark',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        studentId: '123',
        date: '2024-01-25',
        status: 'present'
      },
      priority: 'high',
      retryCount: 2,
      maxRetries: 5,
      status: 'pending',
      createdAt: '2024-01-25T08:00:00Z'
    }
  ]);

  const stats = {
    totalCacheEntries: cacheEntries.length,
    cacheSize: cacheEntries.reduce((acc, entry) => acc + entry.size, 0),
    activeSyncs: backgroundSyncs.filter(s => s.state === 'running').length,
    completedSyncs: backgroundSyncs.filter(s => s.state === 'completed').length,
    activeSubscriptions: pushSubscriptions.filter(s => s.enabled).length,
    totalNotifications: pushSubscriptions.reduce((acc, sub) => acc + sub.notifications.length, 0),
    unreadNotifications: pushSubscriptions.reduce((acc, sub) => acc + sub.notifications.filter(n => !n.read).length, 0),
    queuedItems: offlineQueue.filter(q => q.status === 'pending').length,
    performanceScore: pwaConfig.performance.score,
    cacheHitRate: cacheEntries.reduce((acc, entry) => acc + entry.hitCount, 0) / cacheEntries.length || 0
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'completed':
      case 'enabled':
      case 'success':
        return 'text-green-600 bg-green-100';
      case 'inactive':
      case 'disabled':
      case 'failed':
      case 'error':
        return 'text-red-600 bg-red-100';
      case 'pending':
      case 'development':
      case 'testing':
      case 'processing':
      case 'warning':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 70) return 'text-blue-600 bg-blue-100';
    if (score >= 50) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* PWA Status */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">PWA Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-8 w-8 text-green-500" />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-900">Installable</p>
              <p className="text-sm text-gray-500">
                {pwaConfig.features.installable ? 'Yes' : 'No'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <DevicePhoneMobileIcon className="h-8 w-8 text-blue-500" />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-900">Standalone</p>
              <p className="text-sm text-gray-500">
                {pwaConfig.features.standalone ? 'Yes' : 'No'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <WifiIcon className="h-8 w-8 text-green-500" />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-900">Offline Ready</p>
              <p className="text-sm text-gray-500">
                {pwaConfig.offline.enabled ? 'Yes' : 'No'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <BellIcon className="h-8 w-8 text-purple-500" />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-900">Push Notifications</p>
              <p className="text-sm text-gray-500">
                {pwaConfig.serviceWorker.pushNotifications ? 'Enabled' : 'Disabled'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{stats.performanceScore}</p>
            <p className="text-sm text-gray-500">Performance Score</p>
            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPerformanceColor(stats.performanceScore)}`}>
              {stats.performanceScore >= 90 ? 'Excellent' : stats.performanceScore >= 70 ? 'Good' : stats.performanceScore >= 50 ? 'Fair' : 'Poor'}
            </div>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{pwaConfig.performance.loadTime}ms</p>
            <p className="text-sm text-gray-500">Load Time</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{pwaConfig.performance.firstContentfulPaint}ms</p>
            <p className="text-sm text-gray-500">First Contentful Paint</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{pwaConfig.performance.largestContentfulPaint}ms</p>
            <p className="text-sm text-gray-500">Largest Contentful Paint</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{pwaConfig.performance.firstInputDelay}ms</p>
            <p className="text-sm text-gray-500">First Input Delay</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{stats.cacheHitRate.toFixed(1)}x</p>
            <p className="text-sm text-gray-500">Cache Hit Rate</p>
          </div>
        </div>
      </div>

      {/* Cache Statistics */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Cache Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{stats.totalCacheEntries}</p>
            <p className="text-sm text-gray-500">Cache Entries</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{(stats.cacheSize / 1024 / 1024).toFixed(1)}MB</p>
            <p className="text-sm text-gray-500">Cache Size</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{(pwaConfig.offline.cacheSize / 1024 / 1024).toFixed(1)}MB</p>
            <p className="text-sm text-gray-500">Max Cache Size</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{((stats.cacheSize / pwaConfig.offline.cacheSize) * 100).toFixed(0)}%</p>
            <p className="text-sm text-gray-500">Cache Usage</p>
          </div>
        </div>
      </div>

      {/* Background Sync Status */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Background Sync</h3>
        <div className="space-y-4">
          {backgroundSyncs.slice(0, 5).map((sync) => (
            <div key={sync.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${getStatusColor(sync.state)}`}>
                  {sync.state === 'completed' ? (
                    <CheckCircleIcon className="h-4 w-4 text-white" />
                  ) : sync.state === 'running' ? (
                    <ArrowPathIcon className="h-4 w-4 text-white animate-spin" />
                  ) : (
                    <ExclamationTriangleIcon className="h-4 w-4 text-white" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{sync.name}</p>
                  <p className="text-xs text-gray-500">{sync.description}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Last sync: {new Date(sync.lastSync).toLocaleString()}</p>
                <p className="text-xs text-gray-500">
                  {sync.successCount} successful, {sync.failureCount} failed
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Push Notifications */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Push Notifications</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{stats.activeSubscriptions}</p>
            <p className="text-sm text-gray-500">Active Subscriptions</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{stats.totalNotifications}</p>
            <p className="text-sm text-gray-500">Total Notifications</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{stats.unreadNotifications}</p>
            <p className="text-sm text-gray-500">Unread Notifications</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderConfig = () => (
    <div className="space-y-6">
      {/* PWA Configuration */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">PWA Configuration</h3>
        <div className="space-y-6">
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-3">App Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">App Name</label>
                <input
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={pwaConfig.manifest.name}
                  readOnly
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Short Name</label>
                <input
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={pwaConfig.manifest.shortName}
                  readOnly
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Version</label>
                <input
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={pwaConfig.version}
                  readOnly
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Status</label>
                <div className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(pwaConfig.status)}`}>
                  {pwaConfig.status}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-md font-medium text-gray-900 mb-3">Display Settings</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Display Mode</label>
                <select
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={pwaConfig.manifest.display}
                >
                  <option value="standalone">Standalone</option>
                  <option value="fullscreen">Fullscreen</option>
                  <option value="minimal-ui">Minimal UI</option>
                  <option value="browser">Browser</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Orientation</label>
                <select
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={pwaConfig.manifest.orientation}
                >
                  <option value="portrait">Portrait</option>
                  <option value="landscape">Landscape</option>
                  <option value="any">Any</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-md font-medium text-gray-900 mb-3">Colors</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Theme Color</label>
                <div className="mt-1 flex items-center space-x-2">
                  <input
                    type="color"
                    className="h-10 w-10 border border-gray-300 rounded"
                    value={pwaConfig.manifest.themeColor}
                  />
                  <input
                    type="text"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={pwaConfig.manifest.themeColor}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Background Color</label>
                <div className="mt-1 flex items-center space-x-2">
                  <input
                    type="color"
                    className="h-10 w-10 border border-gray-300 rounded"
                    value={pwaConfig.manifest.backgroundColor}
                  />
                  <input
                    type="text"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={pwaConfig.manifest.backgroundColor}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCache = () => (
    <div className="space-y-6">
      {/* Cache Management */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Cache Management</h3>
          <button
            onClick={() => setShowDetailsModal(true)}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            Clear Cache
          </button>
        </div>
        
        <div className="space-y-4">
          {cacheEntries.map((entry) => (
            <div key={entry.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${getStatusColor(entry.status === 200 ? 'active' : 'inactive')}`}>
                    <DatabaseIcon className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{entry.url}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-gray-500">{entry.method}</span>
                    <span className="text-xs text-gray-500">{entry.type}</span>
                    <span className="text-xs text-gray-500">{(entry.size / 1024).toFixed(1)}KB</span>
                    <span className="text-xs text-gray-500">{entry.hitCount} hits</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setSelectedItem(entry);
                    setShowDetailsModal(true);
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <EyeIcon className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSync = () => (
    <div className="space-y-6">
      {/* Background Sync */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Background Sync</h3>
          <button
            onClick={() => setShowDetailsModal(true)}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            Add Sync
          </button>
        </div>
        
        <div className="space-y-4">
          {backgroundSyncs.map((sync) => (
            <div key={sync.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${getStatusColor(sync.state)}`}>
                    {sync.state === 'completed' ? (
                      <CheckCircleIcon className="h-4 w-4 text-white" />
                    ) : sync.state === 'running' ? (
                      <ArrowPathIcon className="h-4 w-4 text-white animate-spin" />
                    ) : (
                      <ExclamationTriangleIcon className="h-4 w-4 text-white" />
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{sync.name}</p>
                  <p className="text-xs text-gray-500">{sync.description}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-gray-500">Last: {new Date(sync.lastSync).toLocaleString()}</span>
                    <span className="text-xs text-gray-500">Next: {new Date(sync.nextSync).toLocaleString()}</span>
                    <span className="text-xs text-gray-500">
                      {sync.successCount} success, {sync.failureCount} failed
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setSelectedItem(sync);
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
          ))}
        </div>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6">
      {/* Push Notifications */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Push Notifications</h3>
          <button
            onClick={() => setShowDetailsModal(true)}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            Test Notification
          </button>
        </div>
        
        <div className="space-y-4">
          {pushSubscriptions.map((subscription) => (
            <div key={subscription.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${getStatusColor(subscription.enabled ? 'active' : 'inactive')}`}>
                    <BellIcon className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Subscription {subscription.id}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-gray-500">
                      {subscription.notifications.length} notifications
                    </span>
                    <span className="text-xs text-gray-500">
                      {subscription.notifications.filter(n => !n.read).length} unread
                    </span>
                    <span className="text-xs text-gray-500">
                      Last used: {new Date(subscription.lastUsed).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setSelectedItem(subscription);
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
          ))}
        </div>
      </div>
    </div>
  );

  const renderOffline = () => (
    <div className="space-y-6">
      {/* Offline Queue */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Offline Queue</h3>
          <button
            onClick={() => setShowDetailsModal(true)}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            Process Queue
          </button>
        </div>
        
        <div className="space-y-4">
          {offlineQueue.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${getStatusColor(item.status)}`}>
                    {item.status === 'completed' ? (
                      <CheckCircleIcon className="h-4 w-4 text-white" />
                    ) : item.status === 'processing' ? (
                      <ArrowPathIcon className="h-4 w-4 text-white animate-spin" />
                    ) : (
                      <ExclamationTriangleIcon className="h-4 w-4 text-white" />
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.type.replace('_', ' ')}</p>
                  <p className="text-xs text-gray-500">{item.url}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-gray-500">
                      {item.retryCount}/{item.maxRetries} retries
                    </span>
                    <span className="text-xs text-gray-500">
                      Created: {new Date(item.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setSelectedItem(item);
                    setShowDetailsModal(true);
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <EyeIcon className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPerformance = () => (
    <div className="space-y-6">
      {/* Performance Metrics */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Metrics</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{pwaConfig.performance.score}</p>
            <p className="text-sm text-gray-500">Performance Score</p>
            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPerformanceColor(pwaConfig.performance.score)}`}>
              {pwaConfig.performance.score >= 90 ? 'Excellent' : pwaConfig.performance.score >= 70 ? 'Good' : pwaConfig.performance.score >= 50 ? 'Fair' : 'Poor'}
            </div>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{pwaConfig.performance.loadTime}ms</p>
            <p className="text-sm text-gray-500">Load Time</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{pwaConfig.performance.firstContentfulPaint}ms</p>
            <p className="text-sm text-gray-500">First Contentful Paint</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{pwaConfig.performance.largestContentfulPaint}ms</p>
            <p className="text-sm text-gray-500">Largest Contentful Paint</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{pwaConfig.performance.firstInputDelay}ms</p>
            <p className="text-sm text-gray-500">First Input Delay</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{pwaConfig.performance.totalBlockingTime}ms</p>
            <p className="text-sm text-gray-500">Total Blocking Time</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-6">
      {/* Security Settings */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Security Settings</h3>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <ShieldCheckIcon className="h-8 w-8 text-green-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">HTTPS</p>
                <p className="text-xs text-gray-500">
                  {pwaConfig.security.https ? 'Enabled' : 'Disabled'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <ShieldCheckIcon className="h-8 w-8 text-green-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">CSP</p>
                <p className="text-xs text-gray-500">
                  {pwaConfig.security.csp ? 'Enabled' : 'Disabled'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <ShieldCheckIcon className="h-8 w-8 text-green-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">HSTS</p>
                <p className="text-xs text-gray-500">
                  {pwaConfig.security.hsts ? 'Enabled' : 'Disabled'}
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-3">SSL Certificate</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Issuer:</span>
                  <span className="text-sm text-gray-900">{pwaConfig.security.certificate.issuer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Valid From:</span>
                  <span className="text-sm text-gray-900">{new Date(pwaConfig.security.certificate.validFrom).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Valid Until:</span>
                  <span className="text-sm text-gray-900">{new Date(pwaConfig.security.certificate.validUntil).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
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
              <DevicePhoneMobileIcon className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">PWA Capabilities</h1>
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
              { id: 'config', name: 'Configuration', icon: Cog6ToothIcon },
              { id: 'cache', name: 'Cache', icon: DatabaseIcon },
              { id: 'sync', name: 'Sync', icon: ArrowPathIcon },
              { id: 'notifications', name: 'Notifications', icon: BellIcon },
              { id: 'offline', name: 'Offline', icon: CloudIcon },
              { id: 'performance', name: 'Performance', icon: ChartBarIcon },
              { id: 'security', name: 'Security', icon: ShieldCheckIcon }
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
        {activeTab === 'config' && renderConfig()}
        {activeTab === 'cache' && renderCache()}
        {activeTab === 'sync' && renderSync()}
        {activeTab === 'notifications' && renderNotifications()}
        {activeTab === 'offline' && renderOffline()}
        {activeTab === 'performance' && renderPerformance()}
        {activeTab === 'security' && renderSecurity()}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedItem && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {selectedItem.url || selectedItem.name || selectedItem.title || 'Details'}
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

export default PWACapabilities;
