import React, { useState, useEffect } from 'react';
import {
  ShoppingCartIcon,
  CurrencyDollarIcon,
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
  UserGroupIcon,
  TagIcon,
  ArchiveBoxIcon,
  ReceiptRefundIcon,
  CreditCardIcon,
  BanknotesIcon,
  QrCodeIcon,
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
} from '@heroicons/react/24/outline';

interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  category: 'food' | 'beverage' | 'snacks' | 'stationery' | 'uniforms' | 'books' | 'other';
  subcategory: string;
  brand?: string;
  unit: string;
  price: number;
  cost: number;
  margin: number;
  tax: number;
  discount?: {
    type: 'percentage' | 'fixed';
    value: number;
    startDate: string;
    endDate: string;
  };
  inventory: {
    currentStock: number;
    minimumStock: number;
    maximumStock: number;
    reorderLevel: number;
    reorderQuantity: number;
    location: string;
    batchNumber?: string;
    expiryDate?: string;
  };
  supplier: {
    id: string;
    name: string;
    contact: string;
    leadTime: number;
    lastOrderDate?: string;
  };
  images: string[];
  tags: string[];
  status: 'active' | 'inactive' | 'discontinued' | 'out_of_stock';
  barcode: string;
  qrCode: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  nutritionalInfo?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    allergens: string[];
  };
  createdAt: string;
  updatedAt: string;
}

interface Sale {
  id: string;
  receiptNumber: string;
  date: string;
  time: string;
  items: {
    productId: string;
    productName: string;
    sku: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    discount: number;
    tax: number;
  }[];
  customer: {
    id: string;
    name: string;
    type: 'student' | 'staff' | 'visitor' | 'parent';
    studentId?: string;
    class?: string;
    department?: string;
  };
  payment: {
    method: 'cash' | 'card' | 'mobile_money' | 'student_account' | 'voucher' | 'credit';
    amount: number;
    reference?: string;
    status: 'paid' | 'pending' | 'failed' | 'refunded';
  };
  totals: {
    subtotal: number;
    discount: number;
    tax: number;
    total: number;
    paid: number;
    change: number;
  };
  cashier: {
    id: string;
    name: string;
  };
  terminal: {
    id: string;
    name: string;
    location: string;
  };
  status: 'completed' | 'cancelled' | 'refunded';
  notes?: string;
  refunded?: {
    amount: number;
    reason: string;
    date: string;
    approvedBy: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface Supplier {
  id: string;
  name: string;
  contact: {
    phone: string;
    email: string;
    address: string;
    person: string;
  };
  products: {
    productId: string;
    productName: string;
    sku: string;
    unitPrice: number;
    lastOrderDate: string;
    lastOrderQuantity: number;
  }[];
  payment: {
    terms: string;
    method: string;
    creditLimit: number;
    currentBalance: number;
  };
  performance: {
    onTimeDelivery: number;
    qualityRating: number;
    orderAccuracy: number;
    totalOrders: number;
  };
  status: 'active' | 'inactive' | 'suspended';
  notes: string;
  createdAt: string;
  updatedAt: string;
}

interface PurchaseOrder {
  id: string;
  orderNumber: string;
  supplier: {
    id: string;
    name: string;
  };
  orderDate: string;
  expectedDeliveryDate: string;
  actualDeliveryDate?: string;
  items: {
    productId: string;
    productName: string;
    sku: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    receivedQuantity?: number;
    remainingQuantity?: number;
  }[];
  totals: {
    subtotal: number;
    discount: number;
    tax: number;
    total: number;
  };
  status: 'draft' | 'sent' | 'confirmed' | 'partial' | 'received' | 'cancelled';
  payment: {
    method: string;
    status: 'pending' | 'paid' | 'partial';
    paidAmount?: number;
  };
  delivery: {
    address: string;
    instructions: string;
    contact: string;
  };
  notes: string;
  createdBy: string;
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
}

interface POS {
  id: string;
  name: string;
  location: string;
  type: 'canteen' | 'tuckshop' | 'bookshop' | 'uniform_shop';
  terminal: {
    id: string;
    name: string;
    model: string;
    serialNumber: string;
    status: 'online' | 'offline' | 'maintenance';
  }[];
  cashDrawer: {
    id: string;
    balance: number;
    lastClosed: string;
    closedBy: string;
  };
  printer: {
    id: string;
    name: string;
    model: string;
    status: 'online' | 'offline' | 'out_of_paper';
  };
  scanner: {
    id: string;
    name: string;
    model: string;
    status: 'online' | 'offline';
  };
  paymentDevices: {
    type: 'card_reader' | 'mobile_money' | 'qr_scanner';
    name: string;
    model: string;
    status: 'online' | 'offline';
  }[];
  operatingHours: {
    monday: { open: string; close: string };
    tuesday: { open: string; close: string };
    wednesday: { open: string; close: string };
    thursday: { open: string; close: string };
    friday: { open: string; close: string };
    saturday: { open: string; close: string };
    sunday: { open: string; close: string };
  };
  status: 'open' | 'closed' | 'maintenance';
  manager: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

const POSCanteenTuckshop: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'sales' | 'products' | 'inventory' | 'suppliers' | 'pos' | 'reports'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Sale | Product | Supplier | PurchaseOrder | POS | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(3);

  // Mock data
  const [sales] = useState<Sale[]>([
    {
      id: '1',
      receiptNumber: 'RCP-2024-001',
      date: '2024-01-25',
      time: '10:30',
      items: [
        {
          productId: '1',
          productName: 'Chicken Sandwich',
          sku: 'FOOD-001',
          quantity: 2,
          unitPrice: 3.50,
          totalPrice: 7.00,
          discount: 0,
          tax: 0.70
        },
        {
          productId: '2',
          productName: 'Orange Juice',
          sku: 'BEV-001',
          quantity: 1,
          unitPrice: 2.00,
          totalPrice: 2.00,
          discount: 0,
          tax: 0.20
        }
      ],
      customer: {
        id: 'stu1',
        name: 'Alice Johnson',
        type: 'student',
        studentId: 'STU-2024-001',
        class: 'Form 4A'
      },
      payment: {
        method: 'student_account',
        amount: 9.90,
        reference: 'ACC-001',
        status: 'paid'
      },
      totals: {
        subtotal: 9.00,
        discount: 0,
        tax: 0.90,
        total: 9.90,
        paid: 9.90,
        change: 0
      },
      cashier: {
        id: 'cash1',
        name: 'Mary Smith'
      },
      terminal: {
        id: 'pos1',
        name: 'Canteen POS 1',
        location: 'Main Canteen'
      },
      status: 'completed',
      createdAt: '2024-01-25T10:30:00Z',
      updatedAt: '2024-01-25T10:30:00Z'
    }
  ]);

  const [products] = useState<Product[]>([
    {
      id: '1',
      sku: 'FOOD-001',
      name: 'Chicken Sandwich',
      description: 'Fresh chicken sandwich with vegetables',
      category: 'food',
      subcategory: 'sandwiches',
      brand: 'School Kitchen',
      unit: 'piece',
      price: 3.50,
      cost: 2.00,
      margin: 42.86,
      tax: 10,
      inventory: {
        currentStock: 45,
        minimumStock: 10,
        maximumStock: 100,
        reorderLevel: 15,
        reorderQuantity: 50,
        location: 'Fridge A',
        batchNumber: 'BATCH-001',
        expiryDate: '2024-01-30'
      },
      supplier: {
        id: 'sup1',
        name: 'Fresh Foods Ltd',
        contact: '+263 123 456 789',
        leadTime: 2,
        lastOrderDate: '2024-01-20'
      },
      images: ['/images/products/chicken_sandwich.jpg'],
      tags: ['food', 'chicken', 'sandwich', 'fresh'],
      status: 'active',
      barcode: '1234567890123',
      qrCode: 'QR-FOOD-001',
      nutritionalInfo: {
        calories: 350,
        protein: 25,
        carbs: 30,
        fat: 15,
        allergens: ['gluten', 'dairy']
      },
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-25T00:00:00Z'
    }
  ]);

  const [suppliers] = useState<Supplier[]>([
    {
      id: '1',
      name: 'Fresh Foods Ltd',
      contact: {
        phone: '+263 123 456 789',
        email: 'info@freshfoods.co.zw',
        address: '123 Industrial Road, Harare',
        person: 'John Manager'
      },
      products: [
        {
          productId: '1',
          productName: 'Chicken Sandwich',
          sku: 'FOOD-001',
          unitPrice: 2.00,
          lastOrderDate: '2024-01-20',
          lastOrderQuantity: 100
        }
      ],
      payment: {
        terms: 'Net 30 days',
        method: 'Bank Transfer',
        creditLimit: 5000,
        currentBalance: 1500
      },
      performance: {
        onTimeDelivery: 95,
        qualityRating: 4.5,
        orderAccuracy: 98,
        totalOrders: 45
      },
      status: 'active',
      notes: 'Reliable supplier with good quality products',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-25T00:00:00Z'
    }
  ]);

  const [purchaseOrders] = useState<PurchaseOrder[]>([
    {
      id: '1',
      orderNumber: 'PO-2024-001',
      supplier: {
        id: '1',
        name: 'Fresh Foods Ltd'
      },
      orderDate: '2024-01-20',
      expectedDeliveryDate: '2024-01-22',
      actualDeliveryDate: '2024-01-22',
      items: [
        {
          productId: '1',
          productName: 'Chicken Sandwich',
          sku: 'FOOD-001',
          quantity: 100,
          unitPrice: 2.00,
          totalPrice: 200.00,
          receivedQuantity: 100,
          remainingQuantity: 0
        }
      ],
      totals: {
        subtotal: 200.00,
        discount: 10.00,
        tax: 38.00,
        total: 228.00
      },
      status: 'received',
      payment: {
        method: 'Bank Transfer',
        status: 'paid',
        paidAmount: 228.00
      },
      delivery: {
        address: 'School Canteen, Main Campus',
        instructions: 'Deliver to back entrance',
        contact: 'Mary Smith'
      },
      notes: 'Regular weekly order',
      createdBy: 'Mary Smith',
      approvedBy: 'John Manager',
      createdAt: '2024-01-20T00:00:00Z',
      updatedAt: '2024-01-22T00:00:00Z'
    }
  ]);

  const [posTerminals] = useState<POS[]>([
    {
      id: '1',
      name: 'Main Canteen',
      location: 'Main Building',
      type: 'canteen',
      terminal: [
        {
          id: 'pos1',
          name: 'Canteen POS 1',
          model: 'POS-X200',
          serialNumber: 'SN-POS-001',
          status: 'online'
        }
      ],
      cashDrawer: {
        id: 'cd1',
        balance: 500.00,
        lastClosed: '2024-01-24',
        closedBy: 'Mary Smith'
      },
      printer: {
        id: 'prt1',
        name: 'Receipt Printer 1',
        model: 'RP-300',
        status: 'online'
      },
      scanner: {
        id: 'sc1',
        name: 'Barcode Scanner 1',
        model: 'BS-100',
        status: 'online'
      },
      paymentDevices: [
        {
          type: 'card_reader',
          name: 'Card Reader 1',
          model: 'CR-200',
          status: 'online'
        }
      ],
      operatingHours: {
        monday: { open: '07:30', close: '16:30' },
        tuesday: { open: '07:30', close: '16:30' },
        wednesday: { open: '07:30', close: '16:30' },
        thursday: { open: '07:30', close: '16:30' },
        friday: { open: '07:30', close: '16:30' },
        saturday: { open: '08:00', close: '12:00' },
        sunday: { open: 'closed', close: 'closed' }
      },
      status: 'open',
      manager: {
        id: 'mgr1',
        name: 'Mary Smith'
      },
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-25T00:00:00Z'
    }
  ]);

  const stats = {
    totalSales: sales.length,
    todaySales: sales.filter(s => s.date === new Date().toISOString().split('T')[0]).length,
    totalRevenue: sales.reduce((acc, sale) => acc + sale.totals.total, 0),
    todayRevenue: sales.filter(s => s.date === new Date().toISOString().split('T')[0])
      .reduce((acc, sale) => acc + sale.totals.total, 0),
    totalProducts: products.length,
    lowStockProducts: products.filter(p => p.inventory.currentStock <= p.inventory.minimumStock).length,
    activeSuppliers: suppliers.filter(s => s.status === 'active').length,
    pendingOrders: purchaseOrders.filter(po => po.status === 'sent' || po.status === 'confirmed').length
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'paid':
      case 'received':
      case 'active':
      case 'online':
      case 'open':
        return 'text-green-600 bg-green-100';
      case 'pending':
      case 'sent':
      case 'confirmed':
      case 'partial':
        return 'text-yellow-600 bg-yellow-100';
      case 'cancelled':
      case 'failed':
      case 'refunded':
      case 'inactive':
      case 'offline':
      case 'closed':
        return 'text-red-600 bg-red-100';
      case 'out_of_stock':
      case 'discontinued':
      case 'suspended':
      case 'maintenance':
        return 'text-orange-600 bg-orange-100';
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
              <p className="text-sm text-gray-600">Total Sales Today</p>
              <p className="text-2xl font-bold text-gray-900">{stats.todaySales}</p>
            </div>
            <ShoppingCartIcon className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Today's Revenue</p>
              <p className="text-2xl font-bold text-green-600">${stats.todayRevenue.toFixed(2)}</p>
            </div>
            <CurrencyDollarIcon className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-blue-600">{stats.totalProducts}</p>
            </div>
            <ArchiveBoxIcon className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Low Stock Items</p>
              <p className="text-2xl font-bold text-orange-600">{stats.lowStockProducts}</p>
            </div>
            <ExclamationTriangleIcon className="h-8 w-8 text-orange-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Suppliers</p>
              <p className="text-2xl font-bold text-purple-600">{stats.activeSuppliers}</p>
            </div>
            <UserGroupIcon className="h-8 w-8 text-purple-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Orders</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pendingOrders}</p>
            </div>
            <ClockIcon className="h-8 w-8 text-yellow-500" />
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
              <p className="text-sm text-gray-900">New sale completed - Receipt #RCP-2024-001</p>
              <p className="text-xs text-gray-500">30 minutes ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <ShoppingCartIcon className="h-5 w-5 text-blue-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">Purchase order received from Fresh Foods Ltd</p>
              <p className="text-xs text-gray-500">3 days ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-5 w-5 text-orange-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">Low stock alert for Chicken Sandwich</p>
              <p className="text-xs text-gray-500">1 week ago</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Top Selling Products</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {products.slice(0, 5).map((product) => (
              <div key={product.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <ArchiveBoxIcon className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">${product.price.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">Stock: {product.inventory.currentStock}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSales = () => (
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
                placeholder="Search sales..."
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
              <option value="all">All Sales</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              New Sale
            </button>
          </div>
        </div>
      </div>

      {/* Sales List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="min-w-full divide-y divide-gray-200">
          <div className="bg-gray-50 px-6 py-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">All Sales</h3>
              <span className="text-sm text-gray-500">{sales.length} sales</span>
            </div>
          </div>
          <div className="bg-white divide-y divide-gray-200">
            {sales.map((sale) => (
              <div key={sale.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                        <ShoppingCartIcon className="h-5 w-5 text-green-600" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-lg font-medium text-gray-900">{sale.receiptNumber}</h4>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(sale.status)}`}>
                          {sale.status}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(sale.payment.status)}`}>
                          {sale.payment.status}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-gray-500">{sale.customer.name}</span>
                        <span className="text-sm text-gray-500">{sale.customer.type}</span>
                        <span className="text-sm text-gray-500">{sale.date} {sale.time}</span>
                        <span className="text-sm text-gray-500">{sale.items.length} items</span>
                        <span className="text-sm text-gray-500">{sale.payment.method.replace('_', ' ')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-right">
                      <p className="text-lg font-medium text-gray-900">${sale.totals.total.toFixed(2)}</p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedItem(sale);
                        setShowDetailsModal(true);
                      }}
                      className="p-2 text-gray-400 hover:text-gray-600"
                    >
                      <EyeIcon className="h-5 w-5" />
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

  const renderProducts = () => (
    <div className="space-y-6">
      {/* Products List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Products</h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Product
            </button>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {products.map((product) => (
            <div key={product.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <ArchiveBoxIcon className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-lg font-medium text-gray-900">{product.name}</h4>
                      <span className="text-sm text-gray-500">{product.sku}</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                        {product.status.replace('_', ' ')}
                      </span>
                      {product.inventory.currentStock <= product.inventory.minimumStock && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          Low Stock
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-gray-500">{product.category}</span>
                      <span className="text-sm text-gray-500">${product.price.toFixed(2)}</span>
                      <span className="text-sm text-gray-500">Stock: {product.inventory.currentStock}</span>
                      <span className="text-sm text-gray-500">{product.supplier.name}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedItem(product);
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

  const renderInventory = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Inventory Management</h3>
        <p className="text-gray-600">Inventory tracking and management coming soon...</p>
      </div>
    </div>
  );

  const renderSuppliers = () => (
    <div className="space-y-6">
      {/* Suppliers List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Suppliers</h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Supplier
            </button>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {suppliers.map((supplier) => (
            <div key={supplier.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <UserGroupIcon className="h-5 w-5 text-purple-600" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-lg font-medium text-gray-900">{supplier.name}</h4>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(supplier.status)}`}>
                        {supplier.status}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-gray-500">{supplier.contact.person}</span>
                      <span className="text-sm text-gray-500">{supplier.contact.phone}</span>
                      <span className="text-sm text-gray-500">{supplier.products.length} products</span>
                      <span className="text-sm text-gray-500">Rating: {supplier.performance.qualityRating}/5</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedItem(supplier);
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

  const renderPOS = () => (
    <div className="space-y-6">
      {/* POS Terminals */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">POS Terminals</h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Terminal
            </button>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {posTerminals.map((pos) => (
            <div key={pos.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                      <ShoppingCartIcon className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-lg font-medium text-gray-900">{pos.name}</h4>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(pos.status)}`}>
                        {pos.status}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {pos.type.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-gray-500">{pos.location}</span>
                      <span className="text-sm text-gray-500">{pos.terminal.length} terminals</span>
                      <span className="text-sm text-gray-500">Manager: {pos.manager.name}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedItem(pos);
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
            <ShoppingCartIcon className="h-8 w-8 text-blue-500 mb-2" />
            <h4 className="font-medium text-gray-900">Sales Report</h4>
            <p className="text-sm text-gray-500">Daily, weekly, monthly sales</p>
          </button>
          <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
            <ArchiveBoxIcon className="h-8 w-8 text-green-500 mb-2" />
            <h4 className="font-medium text-gray-900">Inventory Report</h4>
            <p className="text-sm text-gray-500">Stock levels and movements</p>
          </button>
          <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
            <CurrencyDollarIcon className="h-8 w-8 text-purple-500 mb-2" />
            <h4 className="font-medium text-gray-900">Financial Report</h4>
            <p className="text-sm text-gray-500">Revenue and profit analysis</p>
          </button>
          <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
            <UserGroupIcon className="h-8 w-8 text-orange-500 mb-2" />
            <h4 className="font-medium text-gray-900">Supplier Report</h4>
            <p className="text-sm text-gray-500">Supplier performance</p>
          </button>
          <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
            <TagIcon className="h-8 w-8 text-red-500 mb-2" />
            <h4 className="font-medium text-gray-900">Product Analysis</h4>
            <p className="text-sm text-gray-500">Top selling products</p>
          </button>
          <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
            <ChartBarIcon className="h-8 w-8 text-yellow-500 mb-2" />
            <h4 className="font-medium text-gray-900">Trend Analysis</h4>
            <p className="text-sm text-gray-500">Sales trends and forecasts</p>
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
              <ShoppingCartIcon className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">POS / Canteen / Tuckshop</h1>
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
              { id: 'sales', name: 'Sales', icon: ShoppingCartIcon },
              { id: 'products', name: 'Products', icon: ArchiveBoxIcon },
              { id: 'inventory', name: 'Inventory', icon: ArchiveBoxIcon },
              { id: 'suppliers', name: 'Suppliers', icon: UserGroupIcon },
              { id: 'pos', name: 'POS', icon: ShoppingCartIcon },
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
        {activeTab === 'sales' && renderSales()}
        {activeTab === 'products' && renderProducts()}
        {activeTab === 'inventory' && renderInventory()}
        {activeTab === 'suppliers' && renderSuppliers()}
        {activeTab === 'pos' && renderPOS()}
        {activeTab === 'reports' && renderReports()}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedItem && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {selectedItem.receiptNumber || selectedItem.name || selectedItem.orderNumber || selectedItem.name || 'Details'}
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

export default POSCanteenTuckshop;
