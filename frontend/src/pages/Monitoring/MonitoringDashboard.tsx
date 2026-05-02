import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  BellIcon,
  ServerIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  AcademicCapIcon,
  ShieldCheckIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  BellAlertIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

interface Alert {
  id: string;
  type: string;
  title: string;
  message: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  createdAt: string;
  isAcknowledged: boolean;
}

interface SystemHealth {
  totalUsers: number;
  activeUsers: number;
  totalSchools: number;
  activeSchools: number;
  systemUptime: string;
  databaseConnectionTime: number;
  cacheHitRate: number;
}

interface StudentMetrics {
  totalStudents: number;
  activeStudents: number;
  newStudentsThisMonth: number;
  enrollmentRate: number;
}

interface AcademicMetrics {
  totalClasses: number;
  totalSubjects: number;
  totalEnrollments: number;
  averageClassSize: number;
}

interface FinancialMetrics {
  totalInvoices: number;
  paidInvoices: number;
  totalRevenue: number;
  outstandingAmount: number;
  paymentRate: number;
}

interface StaffMetrics {
  totalStaff: number;
  activeStaff: number;
  staffStudentRatio: number;
}

interface SecurityMetrics {
  recentLogins: number;
  failedLogins: number;
  loginSuccessRate: number;
}

interface MonitoringData {
  systemHealth: SystemHealth;
  studentMetrics: StudentMetrics;
  academicMetrics: AcademicMetrics;
  financialMetrics: FinancialMetrics;
  staffMetrics: StaffMetrics;
  securityMetrics: SecurityMetrics;
  activeAlerts: Alert[];
  lastUpdated: string;
}

const MonitoringDashboard: React.FC = () => {
  const [monitoringData, setMonitoringData] = useState<MonitoringData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');

  useEffect(() => {
    fetchMonitoringData();
    const interval = setInterval(fetchMonitoringData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchMonitoringData = async () => {
    try {
      setLoading(true);
      // Mock data for demonstration
      const mockData: MonitoringData = {
        systemHealth: {
          totalUsers: 1250,
          activeUsers: 1180,
          totalSchools: 5,
          activeSchools: 5,
          systemUptime: '15 days, 7 hours',
          databaseConnectionTime: 45,
          cacheHitRate: 92.5
        },
        studentMetrics: {
          totalStudents: 8450,
          activeStudents: 8120,
          newStudentsThisMonth: 127,
          enrollmentRate: 1.5
        },
        academicMetrics: {
          totalClasses: 245,
          totalSubjects: 68,
          totalEnrollments: 12450,
          averageClassSize: 25.3
        },
        financialMetrics: {
          totalInvoices: 3420,
          paidInvoices: 3089,
          totalRevenue: 2456789.50,
          outstandingAmount: 234567.25,
          paymentRate: 90.3
        },
        staffMetrics: {
          totalStaff: 320,
          activeStaff: 298,
          staffStudentRatio: 0.037
        },
        securityMetrics: {
          recentLogins: 5678,
          failedLogins: 23,
          loginSuccessRate: 99.6
        },
        activeAlerts: [
          {
            id: '1',
            type: 'Performance',
            title: 'High Memory Usage',
            message: 'Memory usage is above 85% threshold',
            severity: 'Medium',
            createdAt: '2024-01-15T10:30:00Z',
            isAcknowledged: false
          },
          {
            id: '2',
            type: 'Financial',
            title: 'Outstanding Payments',
            message: 'Outstanding amount exceeds $200,000',
            severity: 'High',
            createdAt: '2024-01-15T09:15:00Z',
            isAcknowledged: false
          },
          {
            id: '3',
            type: 'Security',
            title: 'Multiple Failed Logins',
            message: 'Detected unusual login activity',
            severity: 'High',
            createdAt: '2024-01-15T08:45:00Z',
            isAcknowledged: true
          }
        ],
        lastUpdated: new Date().toISOString()
      };
      
      setMonitoringData(mockData);
      setAlerts(mockData.activeAlerts);
    } catch (error) {
      console.error('Error fetching monitoring data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcknowledgeAlert = async (alertId: string) => {
    try {
      // Mock API call
      setAlerts(prev => prev.map(alert => 
        alert.id === alertId ? { ...alert, isAcknowledged: true } : alert
      ));
    } catch (error) {
      console.error('Error acknowledging alert:', error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'text-red-600 bg-red-100';
      case 'High': return 'text-orange-600 bg-orange-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getHealthStatus = (value: number, threshold: { good: number; warning: number }) => {
    if (value >= threshold.good) return 'text-green-600';
    if (value >= threshold.warning) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === 'all' || alert.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!monitoringData) {
    return (
      <div className="text-center text-gray-500 py-8">
        Unable to load monitoring data
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Monitoring</h1>
          <p className="text-gray-600 mt-1">Real-time system health and operational metrics</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            Last updated: {new Date(monitoringData.lastUpdated).toLocaleString()}
          </div>
          <button
            onClick={fetchMonitoringData}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowPathIcon className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Alert Banner */}
      {alerts.filter(a => !a.isAcknowledged).length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <BellAlertIcon className="h-5 w-5 text-red-600 mr-2" />
            <span className="text-red-800 font-medium">
              {alerts.filter(a => !a.isAcknowledged).length} active alerts require attention
            </span>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {['overview', 'alerts', 'performance', 'security'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* System Health */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">System Health</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {Math.round((monitoringData.systemHealth.activeUsers / monitoringData.systemHealth.totalUsers) * 100)}%
                  </p>
                </div>
                <ServerIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="mt-4 flex items-center text-sm">
                <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-600">All systems operational</span>
              </div>
            </div>

            {/* Active Users */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Users</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {monitoringData.systemHealth.activeUsers.toLocaleString()}
                  </p>
                </div>
                <UserGroupIcon className="h-8 w-8 text-green-600" />
              </div>
              <div className="mt-4 text-sm text-gray-500">
                of {monitoringData.systemHealth.totalUsers.toLocaleString()} total
              </div>
            </div>

            {/* Revenue */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    ${(monitoringData.financialMetrics.totalRevenue / 1000000).toFixed(1)}M
                  </p>
                </div>
                <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
              </div>
              <div className="mt-4 text-sm text-gray-500">
                {monitoringData.financialMetrics.paymentRate.toFixed(1)}% payment rate
              </div>
            </div>

            {/* Students */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Students</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {monitoringData.studentMetrics.activeStudents.toLocaleString()}
                  </p>
                </div>
                <AcademicCapIcon className="h-8 w-8 text-purple-600" />
              </div>
              <div className="mt-4 text-sm text-gray-500">
                +{monitoringData.studentMetrics.newStudentsThisMonth} this month
              </div>
            </div>
          </div>

          {/* Detailed Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Metrics */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Performance Metrics</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Database Connection</span>
                  <span className={`text-sm font-medium ${getHealthStatus(monitoringData.systemHealth.databaseConnectionTime, { good: 100, warning: 500 })}`}>
                    {monitoringData.systemHealth.databaseConnectionTime}ms
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Cache Hit Rate</span>
                  <span className={`text-sm font-medium ${getHealthStatus(monitoringData.systemHealth.cacheHitRate, { good: 90, warning: 75 })}`}>
                    {monitoringData.systemHealth.cacheHitRate}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">System Uptime</span>
                  <span className="text-sm font-medium text-green-600">
                    {monitoringData.systemHealth.systemUptime}
                  </span>
                </div>
              </div>
            </div>

            {/* Security Metrics */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Security Metrics</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Recent Logins</span>
                  <span className="text-sm font-medium text-green-600">
                    {monitoringData.securityMetrics.recentLogins.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Failed Logins</span>
                  <span className="text-sm font-medium text-yellow-600">
                    {monitoringData.securityMetrics.failedLogins}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Success Rate</span>
                  <span className={`text-sm font-medium ${getHealthStatus(monitoringData.securityMetrics.loginSuccessRate, { good: 99, warning: 95 })}`}>
                    {monitoringData.securityMetrics.loginSuccessRate}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Alerts Tab */}
      {activeTab === 'alerts' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Alert Filters */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search alerts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Severities</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          {/* Alerts List */}
          <div className="space-y-4">
            {filteredAlerts.map((alert) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className={`bg-white rounded-lg shadow p-6 ${
                  alert.isAcknowledged ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(alert.severity)}`}>
                        {alert.severity}
                      </span>
                      <h4 className="text-lg font-medium text-gray-900">{alert.title}</h4>
                      {alert.isAcknowledged && (
                        <CheckCircleIcon className="h-5 w-5 text-green-600" />
                      )}
                    </div>
                    <p className="text-gray-600 mt-2">{alert.message}</p>
                    <div className="flex items-center mt-4 text-sm text-gray-500">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      {new Date(alert.createdAt).toLocaleString()}
                    </div>
                  </div>
                  {!alert.isAcknowledged && (
                    <button
                      onClick={() => handleAcknowledgeAlert(alert.id)}
                      className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Acknowledge
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Performance Tab */}
      {activeTab === 'performance' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* System Performance */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">System Performance</h3>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">CPU Usage</span>
                    <span className="text-sm text-gray-500">45.2%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '45.2%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Memory Usage</span>
                    <span className="text-sm text-gray-500">68.5%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '68.5%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Disk Usage</span>
                    <span className="text-sm text-gray-500">32.1%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '32.1%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Database Performance */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Database Performance</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Connection Time</span>
                  <span className="text-sm font-medium text-green-600">45ms</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Query Response Time</span>
                  <span className="text-sm font-medium text-green-600">120ms</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active Connections</span>
                  <span className="text-sm font-medium text-blue-600">25</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Cache Hit Rate</span>
                  <span className="text-sm font-medium text-green-600">92.5%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Request Metrics */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Request Metrics</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">1,247</p>
                  <p className="text-sm text-gray-600 mt-1">Requests/min</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">98.5%</p>
                  <p className="text-sm text-gray-600 mt-1">Success Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">245ms</p>
                  <p className="text-sm text-gray-600 mt-1">Avg Response</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-600">3</p>
                  <p className="text-sm text-gray-600 mt-1">Queue Length</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Authentication Metrics */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Authentication Metrics</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Logins (24h)</span>
                  <span className="text-sm font-medium text-blue-600">5,678</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Successful Logins</span>
                  <span className="text-sm font-medium text-green-600">5,655</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Failed Logins</span>
                  <span className="text-sm font-medium text-red-600">23</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Success Rate</span>
                  <span className="text-sm font-medium text-green-600">99.6%</span>
                </div>
              </div>
            </div>

            {/* Security Events */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Security Events</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Blocked IPs</span>
                  <span className="text-sm font-medium text-red-600">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Suspicious Activities</span>
                  <span className="text-sm font-medium text-yellow-600">3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Password Resets</span>
                  <span className="text-sm font-medium text-blue-600">45</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active Sessions</span>
                  <span className="text-sm font-medium text-green-600">1,180</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Security Events */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Recent Security Events</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center">
                    <XCircleIcon className="h-5 w-5 text-red-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Multiple Failed Login Attempts</p>
                      <p className="text-xs text-gray-500">IP: 192.168.1.100 - 15 attempts</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">2 hours ago</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center">
                    <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Unusual Login Pattern</p>
                      <p className="text-xs text-gray-500">User: admin@example.com - 3AM login</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">4 hours ago</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <ShieldCheckIcon className="h-5 w-5 text-blue-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Password Reset Request</p>
                      <p className="text-xs text-gray-500">User: teacher@school.edu</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">6 hours ago</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default MonitoringDashboard;
