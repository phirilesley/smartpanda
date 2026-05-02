import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BuildingOffice2Icon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';

// Types
interface Tenant {
  id: string;
  name: string;
  code: string;
  domain: string;
  status: 'Active' | 'Suspended' | 'Pending' | 'Trial';
  subscriptionPlan: string;
  maxSchools: number;
  currentSchools: number;
  maxUsers: number;
  currentUsers: number;
  storageQuota: number;
  storageUsed: number;
  createdAt: string;
  expiresAt?: string;
  contactEmail: string;
  contactPhone: string;
  billingAddress: string;
  features: string[];
  settings: {
    allowCustomBranding: boolean;
    allowCustomDomains: boolean;
    allowApiAccess: boolean;
    maintenanceMode: boolean;
  };
}

export const TenantManagement: React.FC = () => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  const [formData, setFormData] = useState<Partial<Tenant>>({});

  // Mock data - in real app, this would come from API
  useEffect(() => {
    const loadTenants = async () => {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockTenants: Tenant[] = [
        {
          id: 'tenant-001',
          name: 'Harare School District',
          code: 'HARARE001',
          domain: 'harare.smartpanda.school',
          status: 'Active',
          subscriptionPlan: 'Enterprise',
          maxSchools: 50,
          currentSchools: 12,
          maxUsers: 5000,
          currentUsers: 3420,
          storageQuota: 100000, // MB
          storageUsed: 45000,
          createdAt: '2024-01-15T10:00:00Z',
          expiresAt: '2025-01-15T10:00:00Z',
          contactEmail: 'admin@harare.smartpanda.school',
          contactPhone: '+263 4 123 456',
          billingAddress: '123 School Street, Harare, Zimbabwe',
          features: ['All Features', 'Priority Support', 'Custom Branding', 'API Access'],
          settings: {
            allowCustomBranding: true,
            allowCustomDomains: true,
            allowApiAccess: true,
            maintenanceMode: false,
          },
        },
        {
          id: 'tenant-002',
          name: 'Bulawayo Education Group',
          code: 'BULAWAYO001',
          domain: 'bulawayo.smartpanda.school',
          status: 'Active',
          subscriptionPlan: 'Professional',
          maxSchools: 20,
          currentSchools: 8,
          maxUsers: 2000,
          currentUsers: 1250,
          storageQuota: 50000,
          storageUsed: 23000,
          createdAt: '2024-02-01T10:00:00Z',
          expiresAt: '2025-02-01T10:00:00Z',
          contactEmail: 'info@bulawayo.smartpanda.school',
          contactPhone: '+263 9 987 654',
          billingAddress: '456 Education Ave, Bulawayo, Zimbabwe',
          features: ['Core Features', 'Standard Support', 'Basic Branding'],
          settings: {
            allowCustomBranding: true,
            allowCustomDomains: false,
            allowApiAccess: false,
            maintenanceMode: false,
          },
        },
        {
          id: 'tenant-003',
          name: 'Mutare Schools Trust',
          code: 'MUTARE001',
          domain: 'mutare.smartpanda.school',
          status: 'Trial',
          subscriptionPlan: 'Trial',
          maxSchools: 5,
          currentSchools: 2,
          maxUsers: 500,
          currentUsers: 180,
          storageQuota: 10000,
          storageUsed: 3500,
          createdAt: '2024-03-01T10:00:00Z',
          expiresAt: '2024-04-01T10:00:00Z',
          contactEmail: 'trial@mutare.smartpanda.school',
          contactPhone: '+263 20 555 123',
          billingAddress: '789 Trust Road, Mutare, Zimbabwe',
          features: ['Basic Features', 'Email Support'],
          settings: {
            allowCustomBranding: false,
            allowCustomDomains: false,
            allowApiAccess: false,
            maintenanceMode: false,
          },
        },
      ];
      
      setTenants(mockTenants);
      setLoading(false);
    };

    loadTenants();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'text-success-600 bg-success-100';
      case 'Suspended':
        return 'text-error-600 bg-error-100';
      case 'Pending':
        return 'text-warning-600 bg-warning-100';
      case 'Trial':
        return 'text-primary-600 bg-primary-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'Enterprise':
        return 'text-purple-600 bg-purple-100';
      case 'Professional':
        return 'text-blue-600 bg-blue-100';
      case 'Trial':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredTenants = tenants.filter(tenant => {
    const matchesSearch = tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tenant.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tenant.domain.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || tenant.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleCreateTenant = () => {
    // In real app, this would call API
    const newTenant: Tenant = {
      id: `tenant-${Date.now()}`,
      name: formData.name || 'New Tenant',
      code: formData.code || 'NEW001',
      domain: formData.domain || 'new.smartpanda.school',
      status: 'Pending',
      subscriptionPlan: formData.subscriptionPlan || 'Trial',
      maxSchools: formData.maxSchools || 5,
      currentSchools: 0,
      maxUsers: formData.maxUsers || 500,
      currentUsers: 0,
      storageQuota: formData.storageQuota || 10000,
      storageUsed: 0,
      createdAt: new Date().toISOString(),
      contactEmail: formData.contactEmail || '',
      contactPhone: formData.contactPhone || '',
      billingAddress: formData.billingAddress || '',
      features: formData.features || [],
      settings: formData.settings || {
        allowCustomBranding: false,
        allowCustomDomains: false,
        allowApiAccess: false,
        maintenanceMode: false,
      },
    };
    
    setTenants([...tenants, newTenant]);
    setShowCreateModal(false);
    setFormData({});
  };

  const handleUpdateTenant = () => {
    if (!editingTenant) return;
    
    // In real app, this would call API
    setTenants(tenants.map(tenant => 
      tenant.id === editingTenant.id 
        ? { ...tenant, ...formData }
        : tenant
    ));
    setEditingTenant(null);
    setFormData({});
  };

  const handleDeleteTenant = (tenantId: string) => {
    // In real app, this would call API
    setTenants(tenants.filter(tenant => tenant.id !== tenantId));
  };

  const handleStatusChange = (tenantId: string, newStatus: string) => {
    // In real app, this would call API
    setTenants(tenants.map(tenant => 
      tenant.id === tenantId 
        ? { ...tenant, status: newStatus as Tenant['status'] }
        : tenant
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
              Tenant Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage platform tenants and subscriptions
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Tenant
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
                  placeholder="Search tenants..."
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
                <option value="Suspended">Suspended</option>
                <option value="Pending">Pending</option>
                <option value="Trial">Trial</option>
              </select>
              <button className="btn btn-secondary">
                <FunnelIcon className="w-4 h-4 mr-2" />
                Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tenants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTenants.map((tenant, index) => (
          <motion.div
            key={tenant.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card card-hover"
          >
            <div className="card-body">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {tenant.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {tenant.code} • {tenant.domain}
                  </p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(tenant.status)}`}>
                  {tenant.status}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Plan</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${getPlanColor(tenant.subscriptionPlan)}`}>
                    {tenant.subscriptionPlan}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Schools</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {tenant.currentSchools}/{tenant.maxSchools}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Users</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {tenant.currentUsers}/{tenant.maxUsers}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Storage</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {Math.round(tenant.storageUsed / 1000)}/{Math.round(tenant.storageQuota / 1000)} GB
                  </span>
                </div>

                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full"
                    style={{ width: `${(tenant.storageUsed / tenant.storageQuota) * 100}%` }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Created</span>
                  <span className="text-sm text-gray-500 dark:text-gray-500">
                    {new Date(tenant.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {tenant.expiresAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Expires</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {new Date(tenant.expiresAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingTenant(tenant);
                      setFormData(tenant);
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteTenant(tenant.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex gap-2">
                  {tenant.status === 'Active' && (
                    <button
                      onClick={() => handleStatusChange(tenant.id, 'Suspended')}
                      className="text-yellow-600 hover:text-yellow-800"
                    >
                      <XCircleIcon className="w-4 h-4" />
                    </button>
                  )}
                  {tenant.status === 'Suspended' && (
                    <button
                      onClick={() => handleStatusChange(tenant.id, 'Active')}
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
      {(showCreateModal || editingTenant) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {editingTenant ? 'Edit Tenant' : 'Create New Tenant'}
              </h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Tenant Name
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
                      Tenant Code
                    </label>
                    <input
                      type="text"
                      value={formData.code || ''}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Domain
                    </label>
                    <input
                      type="text"
                      value={formData.domain || ''}
                      onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Subscription Plan
                    </label>
                    <select
                      value={formData.subscriptionPlan || ''}
                      onChange={(e) => setFormData({ ...formData, subscriptionPlan: e.target.value })}
                      className="form-input"
                    >
                      <option value="Trial">Trial</option>
                      <option value="Professional">Professional</option>
                      <option value="Enterprise">Enterprise</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Max Schools
                    </label>
                    <input
                      type="number"
                      value={formData.maxSchools || ''}
                      onChange={(e) => setFormData({ ...formData, maxSchools: parseInt(e.target.value) })}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Max Users
                    </label>
                    <input
                      type="number"
                      value={formData.maxUsers || ''}
                      onChange={(e) => setFormData({ ...formData, maxUsers: parseInt(e.target.value) })}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Storage Quota (MB)
                    </label>
                    <input
                      type="number"
                      value={formData.storageQuota || ''}
                      onChange={(e) => setFormData({ ...formData, storageQuota: parseInt(e.target.value) })}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      value={formData.contactEmail || ''}
                      onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Contact Phone
                    </label>
                    <input
                      type="text"
                      value={formData.contactPhone || ''}
                      onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Billing Address
                  </label>
                  <textarea
                    value={formData.billingAddress || ''}
                    onChange={(e) => setFormData({ ...formData, billingAddress: e.target.value })}
                    className="form-input"
                    rows={3}
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.settings?.allowCustomBranding || false}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        settings: { ...formData.settings, allowCustomBranding: e.target.checked }
                      })}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Allow Custom Branding</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.settings?.allowCustomDomains || false}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        settings: { ...formData.settings, allowCustomDomains: e.target.checked }
                      })}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Allow Custom Domains</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.settings?.allowApiAccess || false}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        settings: { ...formData.settings, allowApiAccess: e.target.checked }
                      })}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Allow API Access</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingTenant(null);
                    setFormData({});
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={editingTenant ? handleUpdateTenant : handleCreateTenant}
                  className="btn btn-primary"
                >
                  {editingTenant ? 'Update Tenant' : 'Create Tenant'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
