import React, { useState, useEffect } from 'react';
import {
  ArchiveBoxIcon,
  WrenchScrewdriverIcon,
  CalendarIcon,
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
  Cog6ToothIcon,
  TagIcon,
  CurrencyDollarIcon,
  QrCodeIcon,
  CameraIcon,
  MapPinIcon,
  UserIcon,
  BuildingOfficeIcon,
  TruckIcon,
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  DeviceTabletIcon,
  PrinterIcon,
  TvIcon,
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
  LaptopIcon,
  MonitorIcon,
} from '@heroicons/react/24/outline';

interface Asset {
  id: string;
  assetTag: string;
  serialNumber: string;
  name: string;
  description: string;
  category: 'it_equipment' | 'furniture' | 'vehicles' | 'laboratory' | 'library' | 'sports' | 'kitchen' | 'maintenance' | 'other';
  subcategory: string;
  brand: string;
  model: string;
  purchaseDate: string;
  purchaseCost: number;
  currentValue: number;
  depreciationRate: number;
  warrantyExpiry?: string;
  condition: 'excellent' | 'good' | 'fair' | 'poor' | 'damaged';
  status: 'available' | 'in_use' | 'maintenance' | 'retired' | 'lost' | 'stolen';
  location: {
    building: string;
    floor: string;
    room: string;
    coordinates?: string;
  };
  assignedTo?: {
    userId: string;
    userName: string;
    department: string;
    assignmentDate: string;
  };
  specifications: {
    [key: string]: string | number | boolean;
  };
  maintenance: {
    lastMaintenanceDate?: string;
    nextMaintenanceDate?: string;
    maintenanceInterval: string;
    maintenanceCost: number;
    maintenanceHistory: {
      id: string;
      date: string;
      type: 'preventive' | 'corrective' | 'emergency';
      description: string;
      cost: number;
      technician: string;
      parts?: string[];
    }[];
  };
  insurance: {
    insured: boolean;
    policyNumber?: string;
    provider?: string;
    coverageAmount?: number;
    premium?: number;
    expiryDate?: string;
  };
  documents: {
    type: string;
    name: string;
    uploadDate: string;
    url: string;
  }[];
  images: string[];
  qrCode: string;
  barcode: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

interface AssetTransfer {
  id: string;
  assetId: string;
  assetName: string;
  fromLocation: {
    building: string;
    floor: string;
    room: string;
  };
  toLocation: {
    building: string;
    floor: string;
    room: string;
  };
  fromAssignee?: {
    userId: string;
    userName: string;
  };
  toAssignee?: {
    userId: string;
    userName: string;
  };
  transferDate: string;
  reason: string;
  approvedBy: string;
  status: 'pending' | 'approved' | 'completed' | 'cancelled';
  notes: string;
  createdAt: string;
  updatedAt: string;
}

interface AssetAudit {
  id: string;
  auditDate: string;
  auditor: string;
  type: 'physical' | 'digital' | 'compliance';
  scope: string;
  totalAssets: number;
  auditedAssets: number;
  missingAssets: number;
  discrepancies: {
    assetId: string;
    assetName: string;
    issue: string;
    action: string;
  }[];
  findings: string;
  recommendations: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'failed';
  nextAuditDate: string;
  createdAt: string;
  updatedAt: string;
}

interface MaintenanceRequest {
  id: string;
  assetId: string;
  assetName: string;
  requestType: 'repair' | 'inspection' | 'calibration' | 'upgrade' | 'disposal';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  requestedBy: string;
  requestedDate: string;
  assignedTo?: string;
  estimatedCost?: number;
  actualCost?: number;
  estimatedDuration?: string;
  actualDuration?: string;
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled' | 'on_hold';
  completionDate?: string;
  parts: string[];
  tools: string[];
  images: {
    before: string[];
    after: string[];
  };
  workOrderNumber: string;
  vendorInfo?: {
    name: string;
    contact: string;
    license: string;
  };
  rating?: number;
  feedback?: string;
  createdAt: string;
  updatedAt: string;
}

const AssetManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'assets' | 'transfers' | 'maintenance' | 'audits' | 'reports'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Asset | AssetTransfer | AssetAudit | MaintenanceRequest | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(3);

  // Mock data
  const [assets] = useState<Asset[]>([
    {
      id: '1',
      assetTag: 'IT-001',
      serialNumber: 'SN123456789',
      name: 'Desktop Computer',
      description: 'Dell OptiPlex 7090',
      category: 'it_equipment',
      subcategory: 'desktop',
      brand: 'Dell',
      model: 'OptiPlex 7090',
      purchaseDate: '2022-01-15',
      purchaseCost: 1200,
      currentValue: 800,
      depreciationRate: 20,
      warrantyExpiry: '2025-01-15',
      condition: 'good',
      status: 'in_use',
      location: {
        building: 'Technology Building',
        floor: '1st Floor',
        room: 'Lab 101'
      },
      assignedTo: {
        userId: 'user1',
        userName: 'John Smith',
        department: 'IT Department',
        assignmentDate: '2022-01-20'
      },
      specifications: {
        processor: 'Intel Core i7',
        ram: '16GB',
        storage: '512GB SSD',
        os: 'Windows 11 Pro',
        warranty: '3 Years'
      },
      maintenance: {
        lastMaintenanceDate: '2023-12-15',
        nextMaintenanceDate: '2024-03-15',
        maintenanceInterval: 'Quarterly',
        maintenanceCost: 150,
        maintenanceHistory: [
          {
            id: '1',
            date: '2023-12-15',
            type: 'preventive',
            description: 'Routine cleaning and optimization',
            cost: 50,
            technician: 'IT Support Team'
          }
        ]
      },
      insurance: {
        insured: true,
        policyNumber: 'POL-12345',
        provider: 'ABC Insurance',
        coverageAmount: 1000,
        premium: 50,
        expiryDate: '2025-01-15'
      },
      documents: [
        {
          type: 'Purchase Invoice',
          name: 'Dell_Invoice_001.pdf',
          uploadDate: '2022-01-15',
          url: '/documents/assets/IT-001/invoice.pdf'
        }
      ],
      images: ['/images/assets/IT-001/front.jpg'],
      qrCode: 'QR-IT-001',
      barcode: 'BC-IT-001',
      notes: 'Assigned to IT Department for development work',
      createdAt: '2022-01-15T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z'
    },
    {
      id: '2',
      assetTag: 'VH-001',
      serialNumber: 'SN987654321',
      name: 'School Bus',
      description: 'Toyota Coaster Bus',
      category: 'vehicles',
      subcategory: 'bus',
      brand: 'Toyota',
      model: 'Coaster',
      purchaseDate: '2021-06-01',
      purchaseCost: 50000,
      currentValue: 35000,
      depreciationRate: 15,
      warrantyExpiry: '2024-06-01',
      condition: 'good',
      status: 'available',
      location: {
        building: 'Transport Department',
        floor: 'Ground Floor',
        room: 'Parking Bay 1'
      },
      specifications: {
        capacity: '30 seats',
        fuelType: 'Diesel',
        engine: '4.0L Diesel',
        transmission: 'Automatic',
        mileage: '45000 km',
        licensePlate: 'ABC 1234'
      },
      maintenance: {
        lastMaintenanceDate: '2024-01-10',
        nextMaintenanceDate: '2024-04-10',
        maintenanceInterval: 'Quarterly',
        maintenanceCost: 500,
        maintenanceHistory: [
          {
            id: '1',
            date: '2024-01-10',
            type: 'preventive',
            description: 'Oil change and general service',
            cost: 200,
            technician: 'Auto Garage',
            parts: ['Oil Filter', 'Engine Oil']
          }
        ]
      },
      insurance: {
        insured: true,
        policyNumber: 'POL-54321',
        provider: 'XYZ Insurance',
        coverageAmount: 40000,
        premium: 200,
        expiryDate: '2024-06-01'
      },
      documents: [
        {
          type: 'Registration',
          name: 'Bus_Registration.pdf',
          uploadDate: '2021-06-01',
          url: '/documents/assets/VH-001/registration.pdf'
        }
      ],
      images: ['/images/assets/VH-001/exterior.jpg'],
      qrCode: 'QR-VH-001',
      barcode: 'BC-VH-001',
      notes: 'Available for field trips and transportation',
      createdAt: '2021-06-01T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z'
    }
  ]);

  const [transfers] = useState<AssetTransfer[]>([
    {
      id: '1',
      assetId: '1',
      assetName: 'Desktop Computer',
      fromLocation: {
        building: 'Technology Building',
        floor: '1st Floor',
        room: 'Lab 101'
      },
      toLocation: {
        building: 'Administration Building',
        floor: '2nd Floor',
        room: 'Office 201'
      },
      fromAssignee: {
        userId: 'user1',
        userName: 'John Smith'
      },
      toAssignee: {
        userId: 'user2',
        userName: 'Jane Doe'
      },
      transferDate: '2024-02-01',
      reason: 'Department reorganization',
      approvedBy: 'Admin',
      status: 'pending',
      notes: 'Transfer pending approval',
      createdAt: '2024-01-20T00:00:00Z',
      updatedAt: '2024-01-20T00:00:00Z'
    }
  ]);

  const [audits] = useState<AssetAudit[]>([
    {
      id: '1',
      auditDate: '2024-01-15',
      auditor: 'Internal Audit Team',
      type: 'physical',
      scope: 'IT Equipment',
      totalAssets: 150,
      auditedAssets: 145,
      missingAssets: 2,
      discrepancies: [
        {
          assetId: 'IT-045',
          assetName: 'Laptop Computer',
          issue: 'Asset not found at location',
          action: 'Report missing, investigate'
        }
      ],
      findings: 'Overall asset management is good with minor discrepancies',
      recommendations: 'Implement regular location verification',
      status: 'completed',
      nextAuditDate: '2024-07-15',
      createdAt: '2024-01-10T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z'
    }
  ]);

  const [maintenanceRequests] = useState<MaintenanceRequest[]>([
    {
      id: '1',
      assetId: '2',
      assetName: 'School Bus',
      requestType: 'repair',
      priority: 'medium',
      title: 'Air Conditioning Repair',
      description: 'AC system not cooling properly',
      requestedBy: 'Transport Manager',
      requestedDate: '2024-01-18',
      assignedTo: 'Auto Garage',
      estimatedCost: 300,
      status: 'assigned',
      parts: ['AC Compressor', 'Refrigerant'],
      tools: ['AC Tools', 'Diagnostic Equipment'],
      images: {
        before: [],
        after: []
      },
      workOrderNumber: 'WO-2024-001',
      vendorInfo: {
        name: 'Auto Care Center',
        contact: '+263 123 456 789',
        license: 'AUT-12345'
      },
      createdAt: '2024-01-18T00:00:00Z',
      updatedAt: '2024-01-19T00:00:00Z'
    }
  ]);

  const stats = {
    totalAssets: assets.length,
    assetsInUse: assets.filter(a => a.status === 'in_use').length,
    assetsAvailable: assets.filter(a => a.status === 'available').length,
    maintenanceRequired: assets.filter(a => a.status === 'maintenance').length,
    totalValue: assets.reduce((acc, a) => acc + a.currentValue, 0),
    pendingTransfers: transfers.filter(t => t.status === 'pending').length
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
      case 'completed':
      case 'approved':
        return 'text-green-600 bg-green-100';
      case 'in_use':
      case 'pending':
      case 'assigned':
      case 'in_progress':
        return 'text-yellow-600 bg-yellow-100';
      case 'maintenance':
      case 'on_hold':
        return 'text-orange-600 bg-orange-100';
      case 'retired':
      case 'cancelled':
      case 'failed':
      case 'lost':
      case 'stolen':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'excellent':
        return 'text-green-600 bg-green-100';
      case 'good':
        return 'text-blue-600 bg-blue-100';
      case 'fair':
        return 'text-yellow-600 bg-yellow-100';
      case 'poor':
        return 'text-orange-600 bg-orange-100';
      case 'damaged':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'it_equipment':
        return <ComputerDesktopIcon className="h-5 w-5" />;
      case 'vehicles':
        return <TruckIcon className="h-5 w-5" />;
      case 'furniture':
        return <ArchiveBoxIcon className="h-5 w-5" />;
      case 'laboratory':
        return <SparklesIcon className="h-5 w-5" />;
      case 'library':
        return <ArchiveBoxIcon className="h-5 w-5" />;
      case 'sports':
        return <SparklesIcon className="h-5 w-5" />;
      default:
        return <ArchiveBoxIcon className="h-5 w-5" />;
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Assets</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalAssets}</p>
            </div>
            <ArchiveBoxIcon className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Assets In Use</p>
              <p className="text-2xl font-bold text-green-600">{stats.assetsInUse}</p>
            </div>
            <CheckCircleIcon className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Available</p>
              <p className="text-2xl font-bold text-blue-600">{stats.assetsAvailable}</p>
            </div>
            <ArchiveBoxIcon className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Maintenance Required</p>
              <p className="text-2xl font-bold text-orange-600">{stats.maintenanceRequired}</p>
            </div>
            <WrenchScrewdriverIcon className="h-8 w-8 text-orange-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">${stats.totalValue.toLocaleString()}</p>
            </div>
            <CurrencyDollarIcon className="h-8 w-8 text-purple-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Transfers</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pendingTransfers}</p>
            </div>
            <TruckIcon className="h-8 w-8 text-yellow-500" />
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
              <WrenchScrewdriverIcon className="h-5 w-5 text-orange-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">Maintenance request for School Bus (AC Repair)</p>
              <p className="text-xs text-gray-500">2 days ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <TruckIcon className="h-5 w-5 text-blue-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">Asset transfer requested for Desktop Computer</p>
              <p className="text-xs text-gray-500">5 days ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <ShieldCheckIcon className="h-5 w-5 text-green-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">Physical audit completed for IT Equipment</p>
              <p className="text-xs text-gray-500">1 week ago</p>
            </div>
          </div>
        </div>
      </div>

      {/* Asset Categories */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Assets by Category</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {Object.entries(
              assets.reduce((acc, asset) => {
                acc[asset.category] = (acc[asset.category] || 0) + 1;
                return acc;
              }, {} as Record<string, number>)
            ).map(([category, count]) => (
              <div key={category} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getCategoryIcon(category)}
                  <span className="text-sm text-gray-900 capitalize">{category.replace('_', ' ')}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAssets = () => (
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
                placeholder="Search assets..."
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
              <option value="all">All Assets</option>
              <option value="it_equipment">IT Equipment</option>
              <option value="vehicles">Vehicles</option>
              <option value="furniture">Furniture</option>
              <option value="laboratory">Laboratory</option>
              <option value="library">Library</option>
            </select>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Asset
            </button>
          </div>
        </div>
      </div>

      {/* Assets List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="min-w-full divide-y divide-gray-200">
          <div className="bg-gray-50 px-6 py-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">All Assets</h3>
              <span className="text-sm text-gray-500">{assets.length} assets</span>
            </div>
          </div>
          <div className="bg-white divide-y divide-gray-200">
            {assets.map((asset) => (
              <div key={asset.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        {getCategoryIcon(asset.category)}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-lg font-medium text-gray-900">{asset.name}</h4>
                        <span className="text-sm text-gray-500">{asset.assetTag}</span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(asset.status)}`}>
                          {asset.status}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getConditionColor(asset.condition)}`}>
                          {asset.condition}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-gray-500">{asset.brand} {asset.model}</span>
                        <span className="text-sm text-gray-500">{asset.location.building} - {asset.location.room}</span>
                        <span className="text-sm text-gray-500">${asset.currentValue.toLocaleString()}</span>
                        {asset.assignedTo && (
                          <span className="text-sm text-gray-500">Assigned to: {asset.assignedTo.userName}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <QrCodeIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedItem(asset);
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

  const renderTransfers = () => (
    <div className="space-y-6">
      {/* Asset Transfers */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Asset Transfers</h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              New Transfer
            </button>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {transfers.map((transfer) => (
            <div key={transfer.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-lg font-medium text-gray-900">{transfer.assetName}</h4>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transfer.status)}`}>
                      {transfer.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{transfer.reason}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-sm text-gray-500">
                      From: {transfer.fromLocation.building} - {transfer.fromLocation.room}
                    </span>
                    <span className="text-sm text-gray-500">
                      To: {transfer.toLocation.building} - {transfer.toLocation.room}
                    </span>
                    <span className="text-sm text-gray-500">
                      Date: {new Date(transfer.transferDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedItem(transfer);
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

  const renderMaintenance = () => (
    <div className="space-y-6">
      {/* Maintenance Requests */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Maintenance Requests</h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              New Request
            </button>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {maintenanceRequests.map((request) => (
            <div key={request.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-lg font-medium text-gray-900">{request.title}</h4>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                      {request.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{request.assetName}</p>
                  <p className="text-sm text-gray-500 mt-1">{request.description}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-sm text-gray-500">Requested by: {request.requestedBy}</span>
                    <span className="text-sm text-gray-500">WO#: {request.workOrderNumber}</span>
                    {request.estimatedCost && (
                      <span className="text-sm text-gray-500">Est. Cost: ${request.estimatedCost}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedItem(request);
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

  const renderAudits = () => (
    <div className="space-y-6">
      {/* Asset Audits */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Asset Audits</h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Schedule Audit
            </button>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {audits.map((audit) => (
            <div key={audit.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-lg font-medium text-gray-900">{audit.type} Audit</h4>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(audit.status)}`}>
                      {audit.status}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {audit.scope}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-sm text-gray-500">Date: {new Date(audit.auditDate).toLocaleDateString()}</span>
                    <span className="text-sm text-gray-500">Auditor: {audit.auditor}</span>
                    <span className="text-sm text-gray-500">Assets: {audit.auditedAssets}/{audit.totalAssets}</span>
                    <span className="text-sm text-gray-500">Missing: {audit.missingAssets}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedItem(audit);
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
            <ArchiveBoxIcon className="h-8 w-8 text-blue-500 mb-2" />
            <h4 className="font-medium text-gray-900">Asset Inventory</h4>
            <p className="text-sm text-gray-500">Complete asset listing</p>
          </button>
          <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
            <CurrencyDollarIcon className="h-8 w-8 text-green-500 mb-2" />
            <h4 className="font-medium text-gray-900">Asset Valuation</h4>
            <p className="text-sm text-gray-500">Depreciation and value analysis</p>
          </button>
          <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
            <WrenchScrewdriverIcon className="h-8 w-8 text-orange-500 mb-2" />
            <h4 className="font-medium text-gray-900">Maintenance Report</h4>
            <p className="text-sm text-gray-500">Maintenance history and costs</p>
          </button>
          <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
            <ShieldCheckIcon className="h-8 w-8 text-purple-500 mb-2" />
            <h4 className="font-medium text-gray-900">Audit Summary</h4>
            <p className="text-sm text-gray-500">Audit findings and compliance</p>
          </button>
          <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
            <TruckIcon className="h-8 w-8 text-yellow-500 mb-2" />
            <h4 className="font-medium text-gray-900">Transfer History</h4>
            <p className="text-sm text-gray-500">Asset movement tracking</p>
          </button>
          <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
            <ChartBarIcon className="h-8 w-8 text-red-500 mb-2" />
            <h4 className="font-medium text-gray-900">Utilization Report</h4>
            <p className="text-sm text-gray-500">Asset usage statistics</p>
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
              <ArchiveBoxIcon className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">Asset Management</h1>
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
              { id: 'assets', name: 'Assets', icon: ArchiveBoxIcon },
              { id: 'transfers', name: 'Transfers', icon: TruckIcon },
              { id: 'maintenance', name: 'Maintenance', icon: WrenchScrewdriverIcon },
              { id: 'audits', name: 'Audits', icon: ShieldCheckIcon },
              { id: 'reports', name: 'Reports', icon: DocumentTextIcon }
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
        {activeTab === 'assets' && renderAssets()}
        {activeTab === 'transfers' && renderTransfers()}
        {activeTab === 'maintenance' && renderMaintenance()}
        {activeTab === 'audits' && renderAudits()}
        {activeTab === 'reports' && renderReports()}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedItem && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {selectedItem.name || selectedItem.assetName || selectedItem.title || `${selectedItem.type} Audit`}
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

export default AssetManagement;
