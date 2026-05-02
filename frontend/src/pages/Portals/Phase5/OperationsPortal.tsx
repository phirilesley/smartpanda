import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BuildingOfficeIcon,
  TruckIcon,
  ClipboardDocumentListIcon,
  UsersIcon,
  ChartBarIcon,
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
  PackageIcon,
  WrenchScrewdriverIcon,
  HomeIcon,
  ShieldCheckIcon,
  FireIcon,
  LightBulbIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  UserGroupIcon,
  IdentificationIcon,
  CreditCardIcon,
  ReceiptIcon,
  CalculatorIcon,
  TableCellsIcon,
  FolderIcon,
  ArchiveBoxIcon,
  CogIcon,
  FlagIcon,
  BookmarkIcon,
  TagIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  PrinterIcon,
} from '@heroicons/react/24/outline';

// Types
interface Facility {
  id: string;
  name: string;
  type: 'Classroom' | 'Laboratory' | 'Library' | 'Cafeteria' | 'Sports Hall' | 'Auditorium' | 'Office' | 'Storage' | 'Other';
  building: string;
  floor: string;
  capacity: number;
  currentOccupancy: number;
  status: 'Available' | 'Occupied' | 'Maintenance' | 'Out of Service' | 'Reserved';
  condition: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  equipment: Array<{
    id: string;
    name: string;
    type: string;
    quantity: number;
    working: number;
    needsMaintenance: boolean;
  }>;
  schedule: Array<{
    day: string;
    startTime: string;
    endTime: string;
    purpose: string;
    assignedTo: string;
  }>;
  maintenance: {
    lastDate: string;
    nextDate: string;
    provider: string;
    cost: number;
    status: 'Scheduled' | 'In Progress' | 'Completed' | 'Overdue';
  };
  utilities: {
    electricity: 'Working' | 'Issue' | 'Out';
    water: 'Working' | 'Issue' | 'Out';
    internet: 'Working' | 'Issue' | 'Out';
    hvac: 'Working' | 'Issue' | 'Out';
  };
  safety: {
    fireExtinguisher: boolean;
    firstAidKit: boolean;
    emergencyExit: boolean;
    lastInspection: string;
    issues: string[];
  };
  createdAt: string;
  updatedAt: string;
}

interface Inventory {
  id: string;
  itemCode: string;
  name: string;
  description: string;
  category: 'Stationery' | 'Books' | 'Equipment' | 'Supplies' | 'Furniture' | 'Technology' | 'Sports' | 'Cleaning' | 'Food' | 'Other';
  type: 'Consumable' | 'Non-Consumable' | 'Asset';
  unit: string;
  currentStock: number;
  minimumStock: number;
  maximumStock: number;
  reorderLevel: number;
  unitCost: number;
  totalValue: number;
  supplier: string;
  location: string;
  condition: 'New' | 'Good' | 'Fair' | 'Poor' | 'Damaged';
  lastRestock: string;
  nextRestock?: string;
  usage: {
    daily: number;
    weekly: number;
    monthly: number;
    trend: 'Increasing' | 'Decreasing' | 'Stable';
  };
  alerts: {
    lowStock: boolean;
    overStock: boolean;
    expiring: boolean;
    expired: boolean;
  };
  barcode?: string;
  qrCode?: string;
  images: string[];
  notes: string[];
  createdAt: string;
  updatedAt: string;
}

interface MaintenanceRequest {
  id: string;
  title: string;
  description: string;
  facilityId: string;
  facilityName: string;
  location: string;
  category: 'Electrical' | 'Plumbing' | 'HVAC' | 'Structural' | 'Equipment' | 'Cleaning' | 'Safety' | 'Other';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Pending' | 'Assigned' | 'In Progress' | 'Completed' | 'Cancelled';
  requestedBy: string;
  requestedDate: string;
  assignedTo?: string;
  assignedDate?: string;
  estimatedCost?: number;
  actualCost?: number;
  estimatedDuration?: number;
  actualDuration?: number;
  materials: Array<{
    name: string;
    quantity: number;
    cost: number;
  }>;
  labor: {
    hours: number;
    rate: number;
    total: number;
  };
  completionDate?: string;
  notes: string[];
  images: string[];
  followUpRequired: boolean;
  followUpDate?: string;
  rating?: number;
  feedback?: string;
  createdAt: string;
  updatedAt: string;
}

interface Transport {
  id: string;
  vehicleNumber: string;
  type: 'Bus' | 'Van' | 'Car' | 'Truck' | 'Motorcycle' | 'Other';
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  capacity: number;
  driver: {
    id: string;
    name: string;
    license: string;
    phone: string;
    experience: number;
  };
  status: 'Available' | 'In Use' | 'Maintenance' | 'Out of Service';
  condition: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  fuel: {
    current: number;
    capacity: number;
    type: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid';
    lastRefuel: string;
    cost: number;
  };
  maintenance: {
    lastService: string;
    nextService: string;
    mileage: number;
    cost: number;
    provider: string;
    issues: string[];
  };
  insurance: {
    provider: string;
    policyNumber: string;
    expiryDate: string;
    coverage: string;
    premium: number;
  };
  routes: Array<{
    id: string;
    name: string;
    stops: Array<{
      location: string;
      time: string;
      students: number;
    }>;
    distance: number;
    duration: number;
    frequency: string;
  }>;
  schedule: Array<{
    date: string;
    route: string;
    startTime: string;
    endTime: string;
    purpose: string;
    passengers: number;
  }>;
  documents: {
    registration: string;
    insurance: string;
    roadworthy: string;
    permits: string[];
  };
  createdAt: string;
  updatedAt: string;
}

interface Staff {
  id: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: 'Operations' | 'Maintenance' | 'Security' | 'Catering' | 'Cleaning' | 'Transport' | 'Administration' | 'Other';
  position: string;
  role: 'Staff' | 'Supervisor' | 'Manager' | 'Director';
  status: 'Active' | 'On Leave' | 'Suspended' | 'Terminated';
  employmentType: 'Full-time' | 'Part-time' | 'Contract' | 'Temporary';
  hireDate: string;
  salary: number;
  benefits: string[];
  skills: string[];
  certifications: Array<{
    name: string;
    issuer: string;
    date: string;
    expiryDate?: string;
  }>;
  schedule: Array<{
    day: string;
    startTime: string;
    endTime: string;
    duties: string[];
  }>;
  performance: {
    rating: number;
    lastReview: string;
    goals: string[];
    achievements: string[];
    areas: string[];
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  documents: {
    id: string;
    contract: string;
    resume: string;
    certificates: string[];
    background: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface Vendor {
  id: string;
  name: string;
  type: 'Supplier' | 'Service Provider' | 'Contractor' | 'Consultant' | 'Other';
  category: 'Stationery' | 'Food' | 'Equipment' | 'Maintenance' | 'Cleaning' | 'Security' | 'Transport' | 'Technology' | 'Other';
  contact: {
    person: string;
    title: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
  };
  services: Array<{
    name: string;
    description: string;
    price: number;
    unit: string;
  }>;
  products: Array<{
    name: string;
    description: string;
    price: number;
    unit: string;
    availability: boolean;
  }>;
  contracts: Array<{
    id: string;
    title: string;
    type: string;
    startDate: string;
    endDate: string;
    value: number;
    status: 'Active' | 'Expired' | 'Terminated' | 'Pending';
    terms: string;
    renewalDate?: string;
  }>;
  performance: {
    rating: number;
    reviews: number;
    onTimeDelivery: number;
    qualityScore: number;
    lastReview: string;
    issues: string[];
  };
  payments: {
    totalPaid: number;
    totalOwed: number;
    lastPayment: string;
    paymentTerms: string;
    creditLimit: number;
  };
  documents: {
    agreement: string;
    insurance: string;
    licenses: string[];
    certificates: string[];
  };
  status: 'Active' | 'Inactive' | 'Blacklisted' | 'Under Review';
  notes: string[];
  createdAt: string;
  updatedAt: string;
}

interface Security {
  id: string;
  type: 'Incident' | 'Alert' | 'Patrol' | 'Access' | 'Visitor' | 'Equipment' | 'Other';
  title: string;
  description: string;
  location: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Open' | 'Investigating' | 'Resolved' | 'Closed';
  reportedBy: string;
  reportedDate: string;
  assignedTo?: string;
  resolvedBy?: string;
  resolvedDate?: string;
  category: 'Theft' | 'Vandalism' | 'Safety' | 'Access' | 'Disturbance' | 'Emergency' | 'Other';
  involved: Array<{
    type: 'Student' | 'Staff' | 'Visitor' | 'Unknown';
    name: string;
    id?: string;
  }>;
  witnesses: Array<{
    name: string;
    contact: string;
    statement: string;
  }>;
  evidence: Array<{
    type: 'Photo' | 'Video' | 'Document' | 'Other';
    description: string;
    url: string;
  }>;
  actions: Array<{
    action: string;
    takenBy: string;
    date: string;
  }>;
  followUp: {
    required: boolean;
    actions: string[];
    dueDate?: string;
    completed: boolean;
  };
  cost: {
    estimated?: number;
    actual?: number;
    breakdown: Array<{
      item: string;
      cost: number;
    }>;
  };
  prevention: string[];
  report: {
    filed: boolean;
    reference: string;
    authority: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface Compliance {
  id: string;
  type: 'Regulation' | 'License' | 'Permit' | 'Inspection' | 'Audit' | 'Certification' | 'Other';
  title: string;
  description: string;
  authority: string;
  category: 'Safety' | 'Health' | 'Environmental' | 'Educational' | 'Employment' | 'Financial' | 'Other';
  status: 'Compliant' | 'Non-Compliant' | 'Pending' | 'Expired' | 'Under Review';
  requirement: string;
  dueDate: string;
  expiryDate?: string;
  frequency: 'One-time' | 'Monthly' | 'Quarterly' | 'Semi-Annual' | 'Annual' | 'Other';
  lastCompleted?: string;
  nextDue: string;
  responsible: string;
  evidence: Array<{
    type: string;
    description: string;
    url: string;
    uploadDate: string;
  }>;
  findings: Array<{
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
    description: string;
    actionRequired: boolean;
    dueDate?: string;
    status: 'Open' | 'In Progress' | 'Resolved';
  }>;
  cost: {
    compliance: number;
    nonCompliance?: number;
    fines?: number;
  };
  documents: Array<{
    name: string;
    type: string;
    url: string;
    uploadDate: string;
  }>;
  reminders: Array<{
    date: string;
    sent: boolean;
    recipient: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export const OperationsPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'facilities' | 'inventory' | 'maintenance' | 'transport' | 'staff' | 'vendors' | 'security' | 'compliance'>('dashboard');
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([]);
  const [transport, setTransport] = useState<Transport[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [security, setSecurity] = useState<Security[]>([]);
  const [compliance, setCompliance] = useState<Compliance[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [selectedMaintenance, setSelectedMaintenance] = useState<MaintenanceRequest | null>(null);

  // Mock data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock facilities
      const mockFacilities: Facility[] = [
        {
          id: 'fac-001',
          name: 'Classroom 101',
          type: 'Classroom',
          building: 'Main Building',
          floor: '1',
          capacity: 30,
          currentOccupancy: 28,
          status: 'Available',
          condition: 'Good',
          equipment: [
            {
              id: 'eq-001',
              name: 'Projector',
              type: 'AV Equipment',
              quantity: 1,
              working: 1,
              needsMaintenance: false,
            },
            {
              id: 'eq-002',
              name: 'Whiteboard',
              type: 'Furniture',
              quantity: 1,
              working: 1,
              needsMaintenance: false,
            },
          ],
          schedule: [
            {
              day: 'Monday',
              startTime: '08:00',
              endTime: '09:00',
              purpose: 'Mathematics Class',
              assignedTo: 'Mrs. Sarah Johnson',
            },
          ],
          maintenance: {
            lastDate: '2024-01-15',
            nextDate: '2024-04-15',
            provider: 'Facility Management Co.',
            cost: 500,
            status: 'Scheduled',
          },
          utilities: {
            electricity: 'Working',
            water: 'Working',
            internet: 'Working',
            hvac: 'Working',
          },
          safety: {
            fireExtinguisher: true,
            firstAidKit: true,
            emergencyExit: true,
            lastInspection: '2024-01-20',
            issues: [],
          },
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2024-02-20T10:00:00Z',
        },
        {
          id: 'fac-002',
          name: 'Science Laboratory',
          type: 'Laboratory',
          building: 'Science Building',
          floor: '2',
          capacity: 24,
          currentOccupancy: 0,
          status: 'Available',
          condition: 'Excellent',
          equipment: [
            {
              id: 'eq-003',
              name: 'Microscope',
              type: 'Lab Equipment',
              quantity: 15,
              working: 14,
              needsMaintenance: true,
            },
          ],
          schedule: [],
          maintenance: {
            lastDate: '2024-02-01',
            nextDate: '2024-05-01',
            provider: 'Lab Services Inc.',
            cost: 1200,
            status: 'Scheduled',
          },
          utilities: {
            electricity: 'Working',
            water: 'Working',
            internet: 'Working',
            hvac: 'Working',
          },
          safety: {
            fireExtinguisher: true,
            firstAidKit: true,
            emergencyExit: true,
            lastInspection: '2024-02-01',
            issues: [],
          },
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2024-02-20T10:00:00Z',
        },
      ];

      // Mock inventory
      const mockInventory: Inventory[] = [
        {
          id: 'inv-001',
          itemCode: 'STAT001',
          name: 'Exercise Books',
          description: 'A4 size exercise books for students',
          category: 'Stationery',
          type: 'Consumable',
          unit: 'Units',
          currentStock: 500,
          minimumStock: 100,
          maximumStock: 1000,
          reorderLevel: 150,
          unitCost: 2.50,
          totalValue: 1250,
          supplier: 'Office Supplies Ltd.',
          location: 'Stationery Store',
          condition: 'New',
          lastRestock: '2024-02-15',
          nextRestock: '2024-03-15',
          usage: {
            daily: 10,
            weekly: 50,
            monthly: 200,
            trend: 'Stable',
          },
          alerts: {
            lowStock: false,
            overStock: false,
            expiring: false,
            expired: false,
          },
          barcode: '1234567890123',
          qrCode: 'QR1234567890123',
          images: [],
          notes: ['Popular item, monitor stock levels closely'],
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2024-02-20T10:00:00Z',
        },
        {
          id: 'inv-002',
          itemCode: 'LAB001',
          name: 'Microscope Slides',
          description: 'Glass microscope slides for science lab',
          category: 'Equipment',
          type: 'Non-Consumable',
          unit: 'Units',
          currentStock: 100,
          minimumStock: 20,
          maximumStock: 200,
          reorderLevel: 30,
          unitCost: 5.00,
          totalValue: 500,
          supplier: 'Lab Supplies Co.',
          location: 'Science Lab Storage',
          condition: 'Good',
          lastRestock: '2024-01-20',
          usage: {
            daily: 2,
            weekly: 10,
            monthly: 40,
            trend: 'Increasing',
          },
          alerts: {
            lowStock: false,
            overStock: false,
            expiring: false,
            expired: false,
          },
          images: [],
          notes: ['Handle with care', 'Store in dry place'],
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2024-02-20T10:00:00Z',
        },
      ];

      // Mock maintenance requests
      const mockMaintenanceRequests: MaintenanceRequest[] = [
        {
          id: 'maint-001',
          title: 'Broken Projector in Classroom 101',
          description: 'Projector not turning on, need replacement bulb',
          facilityId: 'fac-001',
          facilityName: 'Classroom 101',
          location: 'Main Building, Floor 1',
          category: 'Electrical',
          priority: 'Medium',
          status: 'Pending',
          requestedBy: 'Mrs. Sarah Johnson',
          requestedDate: '2024-02-20T09:00:00Z',
          estimatedCost: 150,
          estimatedDuration: 2,
          materials: [
            {
              name: 'Projector Bulb',
              quantity: 1,
              cost: 80,
            },
          ],
          labor: {
            hours: 2,
            rate: 35,
            total: 70,
          },
          notes: ['Urgent as classes affected'],
          images: [],
          followUpRequired: false,
          createdAt: '2024-02-20T09:00:00Z',
          updatedAt: '2024-02-20T09:00:00Z',
        },
        {
          id: 'maint-002',
          title: 'Water Leak in Science Lab',
          description: 'Water leak from sink in science laboratory',
          facilityId: 'fac-002',
          facilityName: 'Science Laboratory',
          location: 'Science Building, Floor 2',
          category: 'Plumbing',
          priority: 'High',
          status: 'In Progress',
          requestedBy: 'Lab Technician',
          requestedDate: '2024-02-19T14:30:00Z',
          assignedTo: 'John Smith',
          assignedDate: '2024-02-20T08:00:00Z',
          estimatedCost: 300,
          actualCost: 250,
          estimatedDuration: 4,
          actualDuration: 3,
          materials: [
            {
              name: 'Pipe Fittings',
              quantity: 5,
              cost: 50,
            },
          ],
          labor: {
            hours: 3,
            rate: 40,
            total: 120,
          },
          completionDate: '2024-02-20T11:30:00Z',
          notes: ['Repaired temporary fix', 'Need to replace main pipe next month'],
          images: [],
          followUpRequired: true,
          followUpDate: '2024-03-20',
          rating: 4,
          feedback: 'Quick response, good work',
          createdAt: '2024-02-19T14:30:00Z',
          updatedAt: '2024-02-20T11:30:00Z',
        },
      ];

      // Mock transport
      const mockTransport: Transport[] = [
        {
          id: 'trans-001',
          vehicleNumber: 'SCH001',
          type: 'Bus',
          make: 'Toyota',
          model: 'Coaster',
          year: 2020,
          licensePlate: 'ABC 123 GP',
          capacity: 35,
          driver: {
            id: 'driver-001',
            name: 'Michael Davis',
            license: 'DL123456',
            phone: '+263 4 555 666',
            experience: 5,
          },
          status: 'Available',
          condition: 'Good',
          fuel: {
            current: 45,
            capacity: 60,
            type: 'Diesel',
            lastRefuel: '2024-02-18',
            cost: 450,
          },
          maintenance: {
            lastService: '2024-01-15',
            nextService: '2024-04-15',
            mileage: 45000,
            cost: 800,
            provider: 'Auto Care Center',
            issues: [],
          },
          insurance: {
            provider: 'ZimInsure',
            policyNumber: 'POL123456',
            expiryDate: '2024-12-31',
            coverage: 'Comprehensive',
            premium: 1200,
          },
          routes: [
            {
              id: 'route-001',
              name: 'Morning Route A',
              stops: [
                {
                  location: 'Central Park',
                  time: '07:00',
                  students: 8,
                },
                {
                  location: 'Main Street',
                  time: '07:15',
                  students: 12,
                },
              ],
              distance: 15,
              duration: 45,
              frequency: 'Daily',
            },
          ],
          schedule: [
            {
              date: '2024-02-21',
              route: 'Morning Route A',
              startTime: '06:30',
              endTime: '08:30',
              purpose: 'Student Transport',
              passengers: 20,
            },
          ],
          documents: {
            registration: 'REG123456',
            insurance: 'INS123456',
            roadworthy: 'RW123456',
            permits: ['PERM123456'],
          },
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2024-02-20T10:00:00Z',
        },
      ];

      // Mock staff
      const mockStaff: Staff[] = [
        {
          id: 'staff-001',
          employeeNumber: 'EMP2024001',
          firstName: 'John',
          lastName: 'Smith',
          email: 'john.smith@smartpanda.edu',
          phone: '+263 4 777 888',
          department: 'Maintenance',
          position: 'Maintenance Technician',
          role: 'Staff',
          status: 'Active',
          employmentType: 'Full-time',
          hireDate: '2023-01-15',
          salary: 18000,
          benefits: ['Health Insurance', 'Pension', 'Transport Allowance'],
          skills: ['Electrical', 'Plumbing', 'HVAC', 'Carpentry'],
          certifications: [
            {
              name: 'Electrical License',
              issuer: 'Zimbabwe Engineering Council',
              date: '2022-06-15',
              expiryDate: '2025-06-15',
            },
          ],
          schedule: [
            {
              day: 'Monday',
              startTime: '08:00',
              endTime: '17:00',
              duties: ['Facility Maintenance', 'Emergency Response'],
            },
          ],
          performance: {
            rating: 4.2,
            lastReview: '2024-01-15',
            goals: ['Complete HVAC certification', 'Improve response time'],
            achievements: ['Reduced maintenance costs by 15%', 'Implemented preventive maintenance program'],
            areas: ['Time management', 'Documentation'],
          },
          emergencyContact: {
            name: 'Jane Smith',
            relationship: 'Spouse',
            phone: '+263 4 999 888',
          },
          documents: {
            id: 'DOC001',
            contract: 'contract.pdf',
            resume: 'resume.pdf',
            certificates: ['electrical_license.pdf'],
            background: 'background_check.pdf',
          },
          createdAt: '2023-01-15T00:00:00Z',
          updatedAt: '2024-02-20T10:00:00Z',
        },
      ];

      // Mock vendors
      const mockVendors: Vendor[] = [
        {
          id: 'vendor-001',
          name: 'Office Supplies Ltd.',
          type: 'Supplier',
          category: 'Stationery',
          contact: {
            person: 'James Wilson',
            title: 'Sales Manager',
            email: 'james@officesupplies.co.zw',
            phone: '+263 4 123 456',
            address: '123 Supply Street',
            city: 'Harare',
            country: 'Zimbabwe',
          },
          services: [
            {
              name: 'Stationery Delivery',
              description: 'Regular stationery delivery service',
              price: 50,
              unit: 'Delivery',
            },
          ],
          products: [
            {
              name: 'Exercise Books',
              description: 'A4 exercise books',
              price: 2.50,
              unit: 'Unit',
              availability: true,
            },
          ],
          contracts: [
            {
              id: 'contract-001',
              title: 'Stationery Supply Agreement',
              type: 'Supply',
              startDate: '2024-01-01',
              endDate: '2024-12-31',
              value: 50000,
              status: 'Active',
              terms: 'Net 30 days',
              renewalDate: '2024-11-01',
            },
          ],
          performance: {
            rating: 4.5,
            reviews: 12,
            onTimeDelivery: 95,
            qualityScore: 4.7,
            lastReview: '2024-02-15',
            issues: [],
          },
          payments: {
            totalPaid: 15000,
            totalOwed: 5000,
            lastPayment: '2024-02-10',
            paymentTerms: 'Net 30',
            creditLimit: 20000,
          },
          documents: {
            agreement: 'supply_agreement.pdf',
            insurance: 'insurance_certificate.pdf',
            licenses: ['business_license.pdf'],
            certificates: ['quality_certificate.pdf'],
          },
          status: 'Active',
          notes: ['Reliable supplier', 'Good quality products'],
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2024-02-20T10:00:00Z',
        },
      ];

      // Mock security
      const mockSecurity: Security[] = [
        {
          id: 'sec-001',
          type: 'Incident',
          title: 'Vandalism in School Garden',
          description: 'Students found damaging school garden plants',
          location: 'School Garden',
          severity: 'Medium',
          status: 'Resolved',
          reportedBy: 'Security Guard',
          reportedDate: '2024-02-19T16:30:00Z',
          assignedTo: 'Discipline Master',
          resolvedBy: 'Discipline Master',
          resolvedDate: '2024-02-20T09:00:00Z',
          category: 'Vandalism',
          involved: [
            {
              type: 'Student',
              name: 'Student A',
              id: 'student-001',
            },
          ],
          witnesses: [
            {
              name: 'Teacher B',
              contact: '+263 4 555 666',
              statement: 'Saw students damaging plants',
            },
          ],
          evidence: [
            {
              type: 'Photo',
              description: 'Photo of damaged plants',
              url: '/evidence/photo1.jpg',
            },
          ],
          actions: [
            {
              action: 'Students disciplined',
              takenBy: 'Discipline Master',
              date: '2024-02-20T09:00:00Z',
            },
          ],
          followUp: {
            required: true,
            actions: ['Monitor student behavior', 'Repair garden'],
            dueDate: '2024-02-25',
            completed: false,
          },
          cost: {
            estimated: 200,
            actual: 150,
            breakdown: [
              {
                item: 'Plant replacement',
                cost: 100,
              },
              {
                item: 'Labor',
                cost: 50,
              },
            ],
          },
          prevention: ['Increase security patrols', 'Install CCTV'],
          report: {
            filed: true,
            reference: 'SEC001',
            authority: 'School Management',
          },
          createdAt: '2024-02-19T16:30:00Z',
          updatedAt: '2024-02-20T09:00:00Z',
        },
      ];

      // Mock compliance
      const mockCompliance: Compliance[] = [
        {
          id: 'comp-001',
          type: 'Inspection',
          title: 'Fire Safety Inspection',
          description: 'Annual fire safety inspection for all buildings',
          authority: 'Zimbabwe Fire Service',
          category: 'Safety',
          status: 'Compliant',
          requirement: 'Annual fire safety inspection required by law',
          dueDate: '2024-03-31',
          frequency: 'Annual',
          lastCompleted: '2024-02-15',
          nextDue: '2025-02-15',
          responsible: 'Safety Officer',
          evidence: [
            {
              type: 'Certificate',
              description: 'Fire safety certificate',
              url: '/compliance/fire_certificate.pdf',
              uploadDate: '2024-02-15',
            },
          ],
          findings: [],
          cost: {
            compliance: 500,
          },
          documents: [
            {
              name: 'Fire Safety Report',
              type: 'Report',
              url: '/compliance/fire_report.pdf',
              uploadDate: '2024-02-15',
            },
          ],
          reminders: [
            {
              date: '2024-02-01',
              sent: true,
              recipient: 'safety.officer@smartpanda.edu',
            },
          ],
          createdAt: '2024-02-01T00:00:00Z',
          updatedAt: '2024-02-15T14:00:00Z',
        },
      ];
      
      setFacilities(mockFacilities);
      setInventory(mockInventory);
      setMaintenanceRequests(mockMaintenanceRequests);
      setTransport(mockTransport);
      setStaff(mockStaff);
      setVendors(mockVendors);
      setSecurity(mockSecurity);
      setCompliance(mockCompliance);
      setLoading(false);
    };

    loadData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
      case 'Available':
      case 'Completed':
      case 'Resolved':
      case 'Compliant':
      case 'Working':
        return 'text-success-600 bg-success-100';
      case 'Pending':
      case 'In Progress':
      case 'Scheduled':
      case 'Investigating':
      case 'Under Review':
        return 'text-warning-600 bg-warning-100';
      case 'Maintenance':
      case 'Out of Service':
      case 'Overdue':
      case 'Non-Compliant':
      case 'Expired':
      case 'Issue':
      case 'Out':
        return 'text-red-600 bg-red-100';
      case 'Occupied':
      case 'In Use':
      case 'Open':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical':
      case 'Urgent':
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

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'Excellent':
        return 'text-green-600 bg-green-100';
      case 'Good':
        return 'text-blue-600 bg-blue-100';
      case 'Fair':
        return 'text-yellow-600 bg-yellow-100';
      case 'Poor':
      case 'Damaged':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Operations Portal
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage facilities, inventory, maintenance, and school operations
            </p>
          </div>
          <div className="flex gap-3">
            <button className="btn btn-secondary">
              <BellIcon className="w-4 h-4 mr-2" />
              Alerts ({maintenanceRequests.filter(r => r.status === 'Pending').length})
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="flex space-x-8">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: ChartBarIcon },
            { id: 'facilities', label: 'Facilities', icon: BuildingOfficeIcon },
            { id: 'inventory', label: 'Inventory', icon: PackageIcon },
            { id: 'maintenance', label: 'Maintenance', icon: WrenchScrewdriverIcon },
            { id: 'transport', label: 'Transport', icon: TruckIcon },
            { id: 'staff', label: 'Staff', icon: UsersIcon },
            { id: 'vendors', label: 'Vendors', icon: ClipboardDocumentListIcon },
            { id: 'security', label: 'Security', icon: ShieldCheckIcon },
            { id: 'compliance', label: 'Compliance', icon: FlagIcon },
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
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Facilities</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {facilities.length}
                  </p>
                </div>
                <BuildingOfficeIcon className="w-8 h-8 text-blue-600" />
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
                  <p className="text-sm text-gray-600 dark:text-gray-400">Pending Maintenance</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {maintenanceRequests.filter(r => r.status === 'Pending').length}
                  </p>
                </div>
                <WrenchScrewdriverIcon className="w-8 h-8 text-orange-600" />
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
                  <p className="text-sm text-gray-600 dark:text-gray-400">Low Stock Items</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {inventory.filter(i => i.alerts.lowStock).length}
                  </p>
                </div>
                <PackageIcon className="w-8 h-8 text-red-600" />
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
                  <p className="text-sm text-gray-600 dark:text-gray-400">Active Vehicles</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {transport.filter(t => t.status === 'Available').length}
                  </p>
                </div>
                <TruckIcon className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {activeTab === 'facilities' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facilities.map((facility, index) => (
            <motion.div
              key={facility.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card card-hover"
            >
              <div className="card-body">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {facility.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {facility.type} • {facility.building}
                    </p>
                  </div>
                  <button 
                    onClick={() => setSelectedFacility(facility)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <EyeIcon className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Capacity</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {facility.currentOccupancy}/{facility.capacity}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(facility.status)}`}>
                      {facility.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Condition</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getConditionColor(facility.condition)}`}>
                      {facility.condition}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Equipment</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {facility.equipment.length} items
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Utilities:</div>
                    <div className="grid grid-cols-2 gap-1 text-xs">
                      <span className={`px-1 py-0.5 rounded ${getStatusColor(facility.utilities.electricity)}`}>
                        Electricity: {facility.utilities.electricity}
                      </span>
                      <span className={`px-1 py-0.5 rounded ${getStatusColor(facility.utilities.water)}`}>
                        Water: {facility.utilities.water}
                      </span>
                      <span className={`px-1 py-0.5 rounded ${getStatusColor(facility.utilities.internet)}`}>
                        Internet: {facility.utilities.internet}
                      </span>
                      <span className={`px-1 py-0.5 rounded ${getStatusColor(facility.utilities.hvac)}`}>
                        HVAC: {facility.utilities.hvac}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Next Maintenance</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {new Date(facility.maintenance.nextDate).toLocaleDateString()}
                    </span>
                  </div>

                  {facility.safety.issues.length > 0 && (
                    <div className="text-xs text-red-600 dark:text-red-400">
                      {facility.safety.issues.length} safety issue(s)
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-sm text-gray-500 dark:text-gray-500">
                    Floor {facility.floor}
                  </div>
                  <div className="flex gap-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      <CalendarIcon className="w-4 h-4" />
                    </button>
                    <button className="text-blue-600 hover:text-blue-800">
                      <WrenchScrewdriverIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'inventory' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {inventory.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card card-hover"
            >
              <div className="card-body">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {item.category} • {item.type}
                    </p>
                  </div>
                  <PackageIcon className="w-6 h-6 text-gray-400" />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Current Stock</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {item.currentStock} {item.unit}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Reorder Level</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {item.reorderLevel} {item.unit}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Unit Cost</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      ${item.unitCost.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Total Value</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      ${item.totalValue.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Condition</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getConditionColor(item.condition)}`}>
                      {item.condition}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Usage Trend:</div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 dark:text-gray-500">
                        Daily: {item.usage.daily} {item.unit}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        item.usage.trend === 'Increasing' ? 'text-red-600 bg-red-100' :
                        item.usage.trend === 'Decreasing' ? 'text-green-600 bg-green-100' :
                        'text-blue-600 bg-blue-100'
                      }`}>
                        {item.usage.trend}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {item.alerts.lowStock && (
                      <span className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded">
                        Low Stock
                      </span>
                    )}
                    {item.alerts.overStock && (
                      <span className="text-xs px-2 py-1 bg-orange-100 text-orange-600 rounded">
                        Over Stock
                      </span>
                    )}
                    {item.alerts.expiring && (
                      <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-600 rounded">
                        Expiring
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-gray-500 dark:text-gray-500">
                    Location: {item.location}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-sm text-gray-500 dark:text-gray-500">
                    Last restock: {new Date(item.lastRestock).toLocaleDateString()}
                  </div>
                  <div className="flex gap-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      <ArrowDownTrayIcon className="w-4 h-4" />
                    </button>
                    <button className="text-blue-600 hover:text-blue-800">
                      <PencilIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'maintenance' && (
        <div className="space-y-4">
          {maintenanceRequests.map((request, index) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card"
            >
              <div className="card-body">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(request.priority)}`}>
                        {request.priority}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-500">
                        {new Date(request.requestedDate).toLocaleString()}
                      </span>
                    </div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                      {request.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {request.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                      <span>Facility: {request.facilityName}</span>
                      <span>Category: {request.category}</span>
                      <span>Requested by: {request.requestedBy}</span>
                      {request.assignedTo && <span>Assigned to: {request.assignedTo}</span>}
                    </div>
                    {request.estimatedCost && (
                      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500 mt-2">
                        <span>Estimated Cost: ${request.estimatedCost}</span>
                        <span>Duration: {request.estimatedDuration}h</span>
                      </div>
                    )}
                    {request.followUpRequired && (
                      <div className="text-xs text-orange-600 font-medium mt-2">
                        Follow-up Required
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setSelectedMaintenance(request)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </button>
                    <button className="text-blue-600 hover:text-blue-800">
                      <PencilIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'transport' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {transport.map((vehicle, index) => (
            <motion.div
              key={vehicle.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card card-hover"
            >
              <div className="card-body">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {vehicle.vehicleNumber}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {vehicle.type} • {vehicle.make} {vehicle.model}
                    </p>
                  </div>
                  <TruckIcon className="w-6 h-6 text-gray-400" />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Capacity</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {vehicle.capacity} passengers
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(vehicle.status)}`}>
                      {vehicle.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Condition</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getConditionColor(vehicle.condition)}`}>
                      {vehicle.condition}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Driver</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {vehicle.driver.name}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Fuel</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500 dark:text-gray-500">
                        {vehicle.fuel.current}/{vehicle.fuel.capacity}L
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        (vehicle.fuel.current / vehicle.fuel.capacity) > 0.5 ? 'text-green-600 bg-green-100' :
                        (vehicle.fuel.current / vehicle.fuel.capacity) > 0.25 ? 'text-yellow-600 bg-yellow-100' :
                        'text-red-600 bg-red-100'
                      }`}>
                        {Math.round((vehicle.fuel.current / vehicle.fuel.capacity) * 100)}%
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Mileage</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {vehicle.mileage.toLocaleString()} km
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Next Service</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {new Date(vehicle.maintenance.nextService).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Insurance</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      new Date(vehicle.insurance.expiryDate) > new Date() ? 'text-green-600 bg-green-100' :
                      'text-red-600 bg-red-100'
                    }`}>
                      Expires: {new Date(vehicle.insurance.expiryDate).toLocaleDateString()}
                    </span>
                  </div>

                  {vehicle.maintenance.issues.length > 0 && (
                    <div className="text-xs text-red-600 dark:text-red-400">
                      {vehicle.maintenance.issues.length} maintenance issue(s)
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-sm text-gray-500 dark:text-gray-500">
                    {vehicle.licensePlate}
                  </div>
                  <div className="flex gap-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      <CalendarIcon className="w-4 h-4" />
                    </button>
                    <button className="text-blue-600 hover:text-blue-800">
                      <WrenchScrewdriverIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'staff' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {staff.map((employee, index) => (
            <motion.div
              key={employee.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card card-hover"
            >
              <div className="card-body">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {employee.firstName} {employee.lastName}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {employee.position} • {employee.department}
                    </p>
                  </div>
                  <UsersIcon className="w-6 h-6 text-gray-400" />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Employee #</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {employee.employeeNumber}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(employee.status)}`}>
                      {employee.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Employment</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {employee.employmentType}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Hire Date</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {new Date(employee.hireDate).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Performance</span>
                    <div className="flex items-center gap-1">
                      <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-500 dark:text-gray-500">
                        {employee.performance.rating}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Skills</span>
                    <div className="flex flex-wrap gap-1">
                      {employee.skills.slice(0, 2).map((skill, i) => (
                        <span key={i} className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded">
                          {skill}
                        </span>
                      ))}
                      {employee.skills.length > 2 && (
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                          +{employee.skills.length - 2}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 dark:text-gray-500">
                    Contact: {employee.phone}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-sm text-gray-500 dark:text-gray-500">
                    {employee.email}
                  </div>
                  <div className="flex gap-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      <PhoneIcon className="w-4 h-4" />
                    </button>
                    <button className="text-blue-600 hover:text-blue-800">
                      <EnvelopeIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'vendors' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vendors.map((vendor, index) => (
            <motion.div
              key={vendor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card card-hover"
            >
              <div className="card-body">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {vendor.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {vendor.type} • {vendor.category}
                    </p>
                  </div>
                  <ClipboardDocumentListIcon className="w-6 h-6 text-gray-400" />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Contact</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {vendor.contact.person}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      vendor.status === 'Active' ? 'text-green-600 bg-green-100' :
                      vendor.status === 'Inactive' ? 'text-gray-600 bg-gray-100' :
                      vendor.status === 'Blacklisted' ? 'text-red-600 bg-red-100' :
                      'text-yellow-600 bg-yellow-100'
                    }`}>
                      {vendor.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Performance</span>
                    <div className="flex items-center gap-1">
                      <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-500 dark:text-gray-500">
                        {vendor.performance.rating}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">On-time Delivery</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {vendor.performance.onTimeDelivery}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Total Owed</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      ${vendor.payments.totalOwed}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Credit Limit</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      ${vendor.payments.creditLimit}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Contracts:</div>
                    {vendor.contracts.map((contract, i) => (
                      <div key={i} className="text-xs text-gray-500 dark:text-gray-500">
                        {contract.title} - {contract.status}
                      </div>
                    ))}
                  </div>

                  <div className="text-xs text-gray-500 dark:text-gray-500">
                    {vendor.contact.city}, {vendor.contact.country}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-sm text-gray-500 dark:text-gray-500">
                    {vendor.contracts.length} contract(s)
                  </div>
                  <div className="flex gap-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      <EnvelopeIcon className="w-4 h-4" />
                    </button>
                    <button className="text-blue-600 hover:text-blue-800">
                      <DocumentTextIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'security' && (
        <div className="space-y-4">
          {security.map((incident, index) => (
            <motion.div
              key={incident.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card"
            >
              <div className="card-body">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(incident.status)}`}>
                        {incident.status}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(incident.severity)}`}>
                        {incident.severity}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-500">
                        {new Date(incident.reportedDate).toLocaleString()}
                      </span>
                    </div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                      {incident.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {incident.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                      <span>Location: {incident.location}</span>
                      <span>Category: {incident.category}</span>
                      <span>Reported by: {incident.reportedBy}</span>
                      {incident.assignedTo && <span>Assigned to: {incident.assignedTo}</span>}
                    </div>
                    {incident.cost.actual && (
                      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500 mt-2">
                        <span>Cost: ${incident.cost.actual}</span>
                        {incident.resolvedDate && <span>Resolved: {new Date(incident.resolvedDate).toLocaleDateString()}</span>}
                      </div>
                    )}
                    {incident.followUp.required && (
                      <div className="text-xs text-orange-600 font-medium mt-2">
                        Follow-up Required
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      <EyeIcon className="w-4 h-4" />
                    </button>
                    <button className="text-blue-600 hover:text-blue-800">
                      <PencilIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'compliance' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {compliance.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card card-hover"
            >
              <div className="card-body">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {item.type} • {item.category}
                    </p>
                  </div>
                  <FlagIcon className="w-6 h-6 text-gray-400" />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Authority</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {item.authority}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Frequency</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {item.frequency}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Due Date</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {new Date(item.dueDate).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Responsible</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {item.responsible}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Cost</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      ${item.cost.compliance}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Findings:</div>
                    {item.findings.length > 0 ? (
                      <div className="space-y-1">
                        {item.findings.slice(0, 2).map((finding, i) => (
                          <div key={i} className="text-xs text-gray-500 dark:text-gray-500">
                            {finding.severity}: {finding.description}
                          </div>
                        ))}
                        {item.findings.length > 2 && (
                          <div className="text-xs text-gray-500 dark:text-gray-500">
                            +{item.findings.length - 2} more
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-xs text-green-600 dark:text-green-400">
                        No findings
                      </div>
                    )}
                  </div>

                  {item.expiryDate && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Expires</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        new Date(item.expiryDate) > new Date() ? 'text-green-600 bg-green-100' :
                        'text-red-600 bg-red-100'
                      }`}>
                        {new Date(item.expiryDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-sm text-gray-500 dark:text-gray-500">
                    Next due: {new Date(item.nextDue).toLocaleDateString()}
                  </div>
                  <div className="flex gap-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      <DocumentTextIcon className="w-4 h-4" />
                    </button>
                    <button className="text-blue-600 hover:text-blue-800">
                      <ArchiveBoxIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Facility Details Modal */}
      {selectedFacility && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedFacility.name}
                </h2>
                <button
                  onClick={() => setSelectedFacility(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XCircleIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Facility Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Type:</span>
                      <span className="text-gray-900 dark:text-white">{selectedFacility.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Building:</span>
                      <span className="text-gray-900 dark:text-white">{selectedFacility.building}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Floor:</span>
                      <span className="text-gray-900 dark:text-white">{selectedFacility.floor}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Capacity:</span>
                      <span className="text-gray-900 dark:text-white">{selectedFacility.capacity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Current Occupancy:</span>
                      <span className="text-gray-900 dark:text-white">{selectedFacility.currentOccupancy}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Condition:</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getConditionColor(selectedFacility.condition)}`}>
                        {selectedFacility.condition}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Utilities Status</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Electricity:</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(selectedFacility.utilities.electricity)}`}>
                        {selectedFacility.utilities.electricity}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Water:</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(selectedFacility.utilities.water)}`}>
                        {selectedFacility.utilities.water}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Internet:</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(selectedFacility.utilities.internet)}`}>
                        {selectedFacility.utilities.internet}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">HVAC:</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(selectedFacility.utilities.hvac)}`}>
                        {selectedFacility.utilities.hvac}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Equipment</h3>
                <div className="space-y-2">
                  {selectedFacility.equipment.map((equipment, index) => (
                    <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">{equipment.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{equipment.type}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500 dark:text-gray-500">
                            {equipment.working}/{equipment.quantity}
                          </span>
                          {equipment.needsMaintenance && (
                            <span className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded">
                              Maintenance Required
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Schedule</h3>
                <div className="space-y-2">
                  {selectedFacility.schedule.map((schedule, index) => (
                    <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">{schedule.day}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {schedule.startTime} - {schedule.endTime}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {schedule.purpose} - {schedule.assignedTo}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Safety Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Fire Extinguisher:</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        selectedFacility.safety.fireExtinguisher ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
                      }`}>
                        {selectedFacility.safety.fireExtinguisher ? 'Available' : 'Missing'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">First Aid Kit:</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        selectedFacility.safety.firstAidKit ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
                      }`}>
                        {selectedFacility.safety.firstAidKit ? 'Available' : 'Missing'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Emergency Exit:</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        selectedFacility.safety.emergencyExit ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
                      }`}>
                        {selectedFacility.safety.emergencyExit ? 'Clear' : 'Blocked'}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Last Inspection:</span>
                      <span className="text-sm text-gray-500 dark:text-gray-500">
                        {new Date(selectedFacility.safety.lastInspection).toLocaleDateString()}
                      </span>
                    </div>
                    {selectedFacility.safety.issues.length > 0 && (
                      <div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Safety Issues:</span>
                        <div className="space-y-1">
                          {selectedFacility.safety.issues.map((issue, i) => (
                            <div key={i} className="text-xs text-red-600 dark:text-red-400">
                              • {issue}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setSelectedFacility(null)}
                  className="btn btn-secondary"
                >
                  Close
                </button>
                <button className="btn btn-primary">
                  <WrenchScrewdriverIcon className="w-4 h-4 mr-2" />
                  Request Maintenance
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Maintenance Details Modal */}
      {selectedMaintenance && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedMaintenance.title}
                </h2>
                <button
                  onClick={() => setSelectedMaintenance(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XCircleIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Request Details</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Facility:</span>
                      <span className="text-gray-900 dark:text-white">{selectedMaintenance.facilityName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Location:</span>
                      <span className="text-gray-900 dark:text-white">{selectedMaintenance.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Category:</span>
                      <span className="text-gray-900 dark:text-white">{selectedMaintenance.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Priority:</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(selectedMaintenance.priority)}`}>
                        {selectedMaintenance.priority}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Status:</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(selectedMaintenance.status)}`}>
                        {selectedMaintenance.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Requested By:</span>
                      <span className="text-gray-900 dark:text-white">{selectedMaintenance.requestedBy}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Requested Date:</span>
                      <span className="text-gray-900 dark:text-white">
                        {new Date(selectedMaintenance.requestedDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Cost & Duration</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Estimated Cost:</span>
                      <span className="text-gray-900 dark:text-white">
                        ${selectedMaintenance.estimatedCost || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Actual Cost:</span>
                      <span className="text-gray-900 dark:text-white">
                        ${selectedMaintenance.actualCost || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Estimated Duration:</span>
                      <span className="text-gray-900 dark:text-white">
                        {selectedMaintenance.estimatedDuration || 0} hours
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Actual Duration:</span>
                      <span className="text-gray-900 dark:text-white">
                        {selectedMaintenance.actualDuration || 0} hours
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Description</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedMaintenance.description}
                </p>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Materials Required</h3>
                <div className="space-y-2">
                  {selectedMaintenance.materials.map((material, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">{material.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Quantity: {material.quantity}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          ${material.cost}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Labor Cost</h3>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">Labor</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedMaintenance.labor.hours} hours @ ${selectedMaintenance.labor.rate}/hr
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        ${selectedMaintenance.labor.total}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Notes</h3>
                <div className="space-y-2">
                  {selectedMaintenance.notes.map((note, index) => (
                    <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400">{note}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setSelectedMaintenance(null)}
                  className="btn btn-secondary"
                >
                  Close
                </button>
                <button className="btn btn-primary">
                  <WrenchScrewdriverIcon className="w-4 h-4 mr-2" />
                  Update Status
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
