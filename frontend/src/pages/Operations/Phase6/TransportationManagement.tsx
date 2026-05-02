import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TruckIcon,
  CarIcon,
  BusIcon,
  MapPinIcon,
  UserGroupIcon,
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
  ShieldCheckIcon,
  StarIcon,
  FireIcon,
  LightBulbIcon,
  CogIcon,
  ArchiveBoxIcon,
  FolderIcon,
  ReceiptIcon,
  CalculatorIcon,
  TableCellsIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  ComputerDesktopIcon,
  WifiIcon,
  QuestionMarkCircleIcon,
  InformationCircleIcon,
  XCircleIcon,
  CheckBadgeIcon,
  ExclamationCircleIcon,
  ChatBubbleLeftRightIcon,
  WrenchScrewdriverIcon,
  FuelIcon,
  GaugeIcon,
  MapIcon,
  NavigationIcon,
  RouteIcon,
  TicketIcon,
  UserCircleIcon,
  CalendarDaysIcon,
  BanknotesIcon,
  GiftIcon,
  SparklesIcon,
  TrophyIcon,
  HeartIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  AdjustmentsHorizontalIcon,
  ArchiveBoxArrowDownIcon,
  CameraIcon,
  VideoCameraIcon,
  MicrophoneIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  ForwardIcon,
  BackwardIcon,
  FastForwardIcon,
  RewindIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ChevronUpIcon,
  ChevronDownIcon,
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

// Types
interface Vehicle {
  id: string;
  plateNumber: string;
  type: 'bus' | 'van' | 'car' | 'motorcycle' | 'bicycle' | 'electric-scooter';
  make: string;
  model: string;
  year: number;
  capacity: number;
  fuelType: 'gasoline' | 'diesel' | 'electric' | 'hybrid' | 'lpg';
  status: 'active' | 'maintenance' | 'out-of-service' | 'retired';
  location: string;
  driver?: string;
  currentRoute?: string;
  mileage: number;
  fuelLevel: number;
  lastMaintenance: string;
  nextMaintenance: string;
  insuranceExpiry: string;
  registrationExpiry: string;
  specifications: {
    engine: string;
    transmission: string;
    color: string;
    vin: string;
    licenseClass: string;
  };
  documents: VehicleDocument[];
  expenses: VehicleExpense[];
}

interface VehicleDocument {
  id: string;
  type: 'registration' | 'insurance' | 'inspection' | 'permit' | 'other';
  name: string;
  expiryDate: string;
  status: 'valid' | 'expired' | 'expiring-soon';
  documentUrl?: string;
  reminderSent: boolean;
}

interface VehicleExpense {
  id: string;
  type: 'fuel' | 'maintenance' | 'repair' | 'insurance' | 'registration' | 'other';
  amount: number;
  date: string;
  description: string;
  vendor: string;
  receipt?: string;
  approvedBy?: string;
  category: string;
}

interface Route {
  id: string;
  name: string;
  description: string;
  type: 'regular' | 'express' | 'shuttle' | 'field-trip' | 'special';
  status: 'active' | 'inactive' | 'seasonal';
  startLocation: string;
  endLocation: string;
  waypoints: string[];
  distance: number;
  estimatedTime: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'on-demand';
  vehicleType: string;
  capacity: number;
  fare: number;
  schedule: RouteSchedule[];
  restrictions: string[];
  notes: string;
}

interface RouteSchedule {
  id: string;
  day: string;
  departureTime: string;
  arrivalTime: string;
  vehicleId: string;
  driverId: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'delayed';
  actualDepartureTime?: string;
  actualArrivalTime?: string;
  passengerCount: number;
}

interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  licenseType: string;
  licenseExpiry: string;
  status: 'active' | 'suspended' | 'on-leave' | 'inactive';
  hireDate: string;
  dateOfBirth: string;
  address: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  certifications: Certification[];
  trainingRecords: TrainingRecord[];
  assignedVehicle?: string;
  currentRoute?: string;
  performance: DriverPerformance;
  documents: DriverDocument[];
}

interface Certification {
  id: string;
  name: string;
  type: string;
  issueDate: string;
  expiryDate: string;
  status: 'valid' | 'expired' | 'expiring-soon';
  issuer: string;
  certificateUrl?: string;
}

interface TrainingRecord {
  id: string;
  title: string;
  type: string;
  date: string;
  duration: string;
  instructor: string;
  status: 'completed' | 'in-progress' | 'scheduled';
  score?: number;
  certificateUrl?: string;
}

interface DriverPerformance {
  id: string;
  rating: number;
  totalTrips: number;
  onTimeRate: number;
  safetyRecord: string;
  passengerFeedback: number;
  fuelEfficiency: number;
  lastReview: string;
  notes: string;
}

interface DriverDocument {
  id: string;
  type: 'license' | 'background-check' | 'medical' | 'contract' | 'other';
  name: string;
  expiryDate: string;
  status: 'valid' | 'expired' | 'expiring-soon';
  documentUrl?: string;
  reminderSent: boolean;
}

interface Trip {
  id: string;
  tripNumber: string;
  routeId: string;
  routeName: string;
  vehicleId: string;
  vehiclePlate: string;
  driverId: string;
  driverName: string;
  departureTime: string;
  actualDepartureTime?: string;
  arrivalTime: string;
  actualArrivalTime?: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'delayed';
  passengerCount: number;
  capacity: number;
  distance: number;
  fuelConsumed: number;
  purpose: string;
  notes: string;
  incidents: TripIncident[];
  feedback: TripFeedback[];
}

interface TripIncident {
  id: string;
  type: 'accident' | 'breakdown' | 'traffic' | 'passenger-issue' | 'other';
  description: string;
  time: string;
  location: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  resolved: boolean;
  resolution?: string;
  reportedBy: string;
}

interface TripFeedback {
  id: string;
  passengerId: string;
  passengerName: string;
  rating: number;
  comment: string;
  date: string;
  category: 'service' | 'safety' | 'comfort' | 'punctuality' | 'other';
}

interface MaintenanceRequest {
  id: string;
  vehicleId: string;
  vehiclePlate: string;
  type: 'routine' | 'repair' | 'inspection' | 'emergency';
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  requestedBy: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'in-progress' | 'completed' | 'cancelled';
  assignedTo?: string;
  estimatedCost?: number;
  actualCost?: number;
  startDate?: string;
  completionDate?: string;
  parts: MaintenancePart[];
  labor: MaintenanceLabor[];
  notes: string;
}

interface MaintenancePart {
  id: string;
  name: string;
  partNumber: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  supplier: string;
  warranty?: string;
}

interface MaintenanceLabor {
  id: string;
  description: string;
  hours: number;
  rate: number;
  totalCost: number;
  technician: string;
}

interface FuelRecord {
  id: string;
  vehicleId: string;
  vehiclePlate: string;
  date: string;
  fuelType: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  odometer: number;
  location: string;
  vendor: string;
  receipt?: string;
  notes: string;
}

interface TransportationSchedule {
  id: string;
  date: string;
  routes: ScheduledRoute[];
  vehicles: ScheduledVehicle[];
  drivers: ScheduledDriver[];
  specialEvents: SpecialEvent[];
  notes: string;
}

interface ScheduledRoute {
  id: string;
  routeId: string;
  routeName: string;
  vehicleId: string;
  vehiclePlate: string;
  driverId: string;
  driverName: string;
  departureTime: string;
  arrivalTime: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  passengerCount: number;
}

interface ScheduledVehicle {
  id: string;
  vehicleId: string;
  vehiclePlate: string;
  status: 'available' | 'assigned' | 'maintenance' | 'out-of-service';
  assignedTo?: string;
  location: string;
  fuelLevel: number;
}

interface ScheduledDriver {
  id: string;
  driverId: string;
  driverName: string;
  status: 'available' | 'assigned' | 'on-leave' | 'sick';
  assignedTo?: string;
  currentLocation: string;
  nextShift?: string;
}

interface SpecialEvent {
  id: string;
  name: string;
  type: 'field-trip' | 'sports-event' | 'conference' | 'other';
  date: string;
  time: string;
  location: string;
  participants: number;
  vehicleRequirements: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  coordinator: string;
  notes: string;
}

interface TransportationReport {
  id: string;
  title: string;
  type: 'usage' | 'efficiency' | 'maintenance' | 'cost' | 'safety' | 'custom';
  description: string;
  generatedDate: string;
  period: string;
  format: 'pdf' | 'excel' | 'csv';
  status: 'generating' | 'completed' | 'failed';
  generatedBy: string;
  parameters: Record<string, any>;
  downloadUrl?: string;
}

export const TransportationManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'vehicles' | 'routes' | 'drivers' | 'trips' | 'maintenance' | 'fuel' | 'schedule' | 'reports'>('dashboard');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([]);
  const [fuelRecords, setFuelRecords] = useState<FuelRecord[]>([]);
  const [schedules, setSchedules] = useState<TransportationSchedule[]>([]);
  const [reports, setReports] = useState<TransportationReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

  useEffect(() => {
    // Load mock data
    setTimeout(() => {
      setVehicles([
        {
          id: '1',
          plateNumber: 'ABC-1234',
          type: 'bus',
          make: 'Ford',
          model: 'Transit',
          year: 2022,
          capacity: 45,
          fuelType: 'diesel',
          status: 'active',
          location: 'Main Campus',
          driver: 'John Smith',
          currentRoute: 'Route 1 - Downtown Express',
          mileage: 45000,
          fuelLevel: 75,
          lastMaintenance: '2024-01-15',
          nextMaintenance: '2024-04-15',
          insuranceExpiry: '2024-06-30',
          registrationExpiry: '2024-12-31',
          specifications: {
            engine: '3.5L V6',
            transmission: 'Automatic',
            color: 'White',
            vin: '1FTYS2EF1NK123456',
            licenseClass: 'Commercial',
          },
          documents: [
            {
              id: '1',
              type: 'registration',
              name: 'Vehicle Registration',
              expiryDate: '2024-12-31',
              status: 'valid',
              reminderSent: false,
            },
          ],
          expenses: [],
        },
        {
          id: '2',
          plateNumber: 'XYZ-5678',
          type: 'van',
          make: 'Chevrolet',
          model: 'Express',
          year: 2021,
          capacity: 12,
          fuelType: 'gasoline',
          status: 'maintenance',
          location: 'Maintenance Garage',
          driver: undefined,
          currentRoute: undefined,
          mileage: 32000,
          fuelLevel: 25,
          lastMaintenance: '2024-02-01',
          nextMaintenance: '2024-02-15',
          insuranceExpiry: '2024-05-15',
          registrationExpiry: '2024-11-30',
          specifications: {
            engine: '4.3L V6',
            transmission: 'Automatic',
            color: 'Blue',
            vin: '1GCEK14T35Z123456',
            licenseClass: 'Commercial',
          },
          documents: [],
          expenses: [],
        },
      ]);

      setRoutes([
        {
          id: '1',
          name: 'Downtown Express',
          description: 'Express route from main campus to downtown',
          type: 'express',
          status: 'active',
          startLocation: 'Main Campus - Building A',
          endLocation: 'Downtown Station',
          waypoints: ['City Hall', 'Central Park'],
          distance: 15.5,
          estimatedTime: '25 minutes',
          frequency: 'daily',
          vehicleType: 'bus',
          capacity: 45,
          fare: 2.50,
          schedule: [
            {
              id: '1',
              day: 'Monday',
              departureTime: '07:00',
              arrivalTime: '07:25',
              vehicleId: '1',
              driverId: '1',
              status: 'scheduled',
              passengerCount: 0,
            },
          ],
          restrictions: ['No large luggage', 'No pets except service animals'],
          notes: 'High-demand route during rush hours',
        },
        {
          id: '2',
          name: 'Campus Shuttle',
          description: 'Internal campus transportation',
          type: 'shuttle',
          status: 'active',
          startLocation: 'North Campus',
          endLocation: 'South Campus',
          waypoints: ['Library', 'Student Center', 'Gym'],
          distance: 3.2,
          estimatedTime: '12 minutes',
          frequency: 'on-demand',
          vehicleType: 'van',
          capacity: 12,
          fare: 0,
          schedule: [],
          restrictions: [],
          notes: 'Free service for students and staff',
        },
      ]);

      setDrivers([
        {
          id: '1',
          firstName: 'John',
          lastName: 'Smith',
          email: 'john.smith@smartpanda.edu',
          phone: '+1-555-0101',
          licenseNumber: 'DL123456789',
          licenseType: 'Commercial Class B',
          licenseExpiry: '2024-08-15',
          status: 'active',
          hireDate: '2020-03-15',
          dateOfBirth: '1985-06-20',
          address: '123 Main St, City, State 12345',
          emergencyContact: {
            name: 'Jane Smith',
            relationship: 'Spouse',
            phone: '+1-555-0102',
          },
          certifications: [
            {
              id: '1',
              name: 'Commercial Driver License',
              type: 'License',
              issueDate: '2020-03-15',
              expiryDate: '2024-08-15',
              status: 'valid',
              issuer: 'DMV',
            },
          ],
          trainingRecords: [
            {
              id: '1',
              title: 'Defensive Driving',
              type: 'Safety',
              date: '2023-11-15',
              duration: '4 hours',
              instructor: 'Safety Training Center',
              status: 'completed',
              score: 95,
            },
          ],
          assignedVehicle: '1',
          currentRoute: '1',
          performance: {
            id: '1',
            rating: 4.8,
            totalTrips: 1250,
            onTimeRate: 96.5,
            safetyRecord: 'Clean',
            passengerFeedback: 4.7,
            fuelEfficiency: 85,
            lastReview: '2024-01-15',
            notes: 'Excellent driver with strong safety record',
          },
          documents: [
            {
              id: '1',
              type: 'license',
              name: 'Driver License',
              expiryDate: '2024-08-15',
              status: 'valid',
              reminderSent: false,
            },
          ],
        },
      ]);

      setTrips([
        {
          id: '1',
          tripNumber: 'TR-2024-001',
          routeId: '1',
          routeName: 'Downtown Express',
          vehicleId: '1',
          vehiclePlate: 'ABC-1234',
          driverId: '1',
          driverName: 'John Smith',
          departureTime: '2024-01-20T07:00:00Z',
          actualDepartureTime: '2024-01-20T07:02:00Z',
          arrivalTime: '2024-01-20T07:25:00Z',
          actualArrivalTime: '2024-01-20T07:27:00Z',
          status: 'completed',
          passengerCount: 38,
          capacity: 45,
          distance: 15.5,
          fuelConsumed: 4.2,
          purpose: 'Regular Service',
          notes: 'Light traffic, good weather',
          incidents: [],
          feedback: [
            {
              id: '1',
              passengerId: 'P001',
              passengerName: 'Student A',
              rating: 5,
              comment: 'Great service, on time',
              date: '2024-01-20',
              category: 'punctuality',
            },
          ],
        },
      ]);

      setMaintenanceRequests([
        {
          id: '1',
          vehicleId: '2',
          vehiclePlate: 'XYZ-5678',
          type: 'repair',
          priority: 'medium',
          description: 'Brake replacement needed',
          requestedBy: 'John Smith',
          requestDate: '2024-01-18',
          status: 'in-progress',
          assignedTo: 'Auto Shop',
          estimatedCost: 450,
          actualCost: 425,
          startDate: '2024-01-20',
          completionDate: undefined,
          parts: [
            {
              id: '1',
              name: 'Brake Pads',
              partNumber: 'BP-12345',
              quantity: 2,
              unitPrice: 85,
              totalPrice: 170,
              supplier: 'Auto Parts Inc',
              warranty: '12 months',
            },
          ],
          labor: [
            {
              id: '1',
              description: 'Brake replacement labor',
              hours: 3,
              rate: 85,
              totalCost: 255,
              technician: 'Mike Johnson',
            },
          ],
          notes: 'Front brakes only, rear brakes OK',
        },
      ]);

      setFuelRecords([
        {
          id: '1',
          vehicleId: '1',
          vehiclePlate: 'ABC-1234',
          date: '2024-01-19',
          fuelType: 'diesel',
          quantity: 45.5,
          unitPrice: 3.85,
          totalPrice: 175.18,
          odometer: 45023,
          location: 'Campus Fuel Station',
          vendor: 'Shell',
          receipt: 'receipt_123.pdf',
          notes: 'Regular fill-up',
        },
      ]);

      setSchedules([
        {
          id: '1',
          date: '2024-01-20',
          routes: [
            {
              id: '1',
              routeId: '1',
              routeName: 'Downtown Express',
              vehicleId: '1',
              vehiclePlate: 'ABC-1234',
              driverId: '1',
              driverName: 'John Smith',
              departureTime: '07:00',
              arrivalTime: '07:25',
              status: 'completed',
              passengerCount: 38,
            },
          ],
          vehicles: [
            {
              id: '1',
              vehicleId: '1',
              vehiclePlate: 'ABC-1234',
              status: 'assigned',
              assignedTo: 'Route 1',
              location: 'En Route',
              fuelLevel: 70,
            },
          ],
          drivers: [
            {
              id: '1',
              driverId: '1',
              driverName: 'John Smith',
              status: 'assigned',
              assignedTo: 'Route 1',
              currentLocation: 'En Route',
              nextShift: '14:00',
            },
          ],
          specialEvents: [],
          notes: 'Normal operations today',
        },
      ]);

      setReports([
        {
          id: '1',
          title: 'Monthly Vehicle Usage Report',
          type: 'usage',
          description: 'Monthly statistics on vehicle utilization and performance',
          generatedDate: '2024-01-31',
          period: 'January 2024',
          format: 'pdf',
          status: 'completed',
          generatedBy: 'Transportation System',
          parameters: {
            startDate: '2024-01-01',
            endDate: '2024-01-31',
            includeDetails: true,
          },
          downloadUrl: '/reports/vehicle-usage-jan-2024.pdf',
        },
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'completed':
      case 'valid':
      case 'scheduled':
      case 'available':
      case 'confirmed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'maintenance':
      case 'out-of-service':
      case 'expired':
      case 'cancelled':
      case 'delayed':
      case 'suspended':
      case 'on-leave':
      case 'inactive':
      case 'retired':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'pending':
      case 'in-progress':
      case 'expiring-soon':
      case 'on-demand':
      case 'assigned':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'seasonal':
      case 'sick':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Transportation Management</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage fleet, routes, drivers, and transportation operations</p>
      </div>

      {/* Alert */}
      <div className="mb-6 bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <div className="flex items-center">
          <BellIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-3" />
          <div>
            <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Transportation Alerts</h3>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">1 vehicle in maintenance, 2 maintenance requests pending, 1 driver on leave</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: ChartBarIcon },
            { id: 'vehicles', label: 'Vehicles', icon: TruckIcon },
            { id: 'routes', label: 'Routes', icon: RouteIcon },
            { id: 'drivers', label: 'Drivers', icon: UserGroupIcon },
            { id: 'trips', label: 'Trips', icon: NavigationIcon },
            { id: 'maintenance', label: 'Maintenance', icon: WrenchScrewdriverIcon },
            { id: 'fuel', label: 'Fuel', icon: FuelIcon },
            { id: 'schedule', label: 'Schedule', icon: CalendarDaysIcon },
            { id: 'reports', label: 'Reports', icon: DocumentTextIcon },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center px-1 py-2 border-b-2 text-sm font-medium whitespace-nowrap ${
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
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Vehicles</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">24</p>
                </div>
                <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-3">
                  <TruckIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-green-600 dark:text-green-400">20</span>
                <span className="text-gray-500 dark:text-gray-400 ml-2">active</span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Drivers</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">18</p>
                </div>
                <div className="bg-green-100 dark:bg-green-900 rounded-full p-3">
                  <UserGroupIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-yellow-600 dark:text-yellow-400">1</span>
                <span className="text-gray-500 dark:text-gray-400 ml-2">on leave</span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Today's Trips</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">142</p>
                </div>
                <div className="bg-purple-100 dark:bg-purple-900 rounded-full p-3">
                  <NavigationIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-green-600 dark:text-green-400">96%</span>
                <span className="text-gray-500 dark:text-gray-400 ml-2">on-time rate</span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Fuel Efficiency</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">8.2</p>
                </div>
                <div className="bg-orange-100 dark:bg-orange-900 rounded-full p-3">
                  <GaugeIcon className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-green-600 dark:text-green-400">MPG</span>
                <span className="text-gray-500 dark:text-gray-400 ml-2">average</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'vehicles' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Vehicle Fleet</h2>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search vehicles..."
                      className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                    <MagnifyingGlassIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                  </div>
                  <button className="flex items-center px-3 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add Vehicle
                  </button>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Vehicle</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Capacity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Driver</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Fuel</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {vehicles.map((vehicle) => (
                    <tr key={vehicle.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{vehicle.make} {vehicle.model}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{vehicle.plateNumber}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{vehicle.year}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{vehicle.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{vehicle.capacity}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{vehicle.driver || 'Unassigned'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{vehicle.location}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <div className="flex items-center">
                          <span className={vehicle.fuelLevel < 25 ? 'text-red-600 dark:text-red-400' : vehicle.fuelLevel < 50 ? 'text-yellow-600 dark:text-yellow-400' : 'text-green-600 dark:text-green-400'}>
                            {vehicle.fuelLevel}%
                          </span>
                          <FuelIcon className="w-4 h-4 ml-1 text-gray-400" />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(vehicle.status)}`}>
                          {vehicle.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => setSelectedVehicle(vehicle)}
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

        {activeTab === 'routes' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {routes.map((route) => (
              <div key={route.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{route.name}</h3>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(route.status)}`}>
                      {route.status}
                    </span>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                      {route.type}
                    </span>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Route</span>
                    <span className="font-medium text-gray-900 dark:text-white">{route.startLocation} → {route.endLocation}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Distance</span>
                    <span className="font-medium text-gray-900 dark:text-white">{route.distance} km</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Duration</span>
                    <span className="font-medium text-gray-900 dark:text-white">{route.estimatedTime}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Frequency</span>
                    <span className="font-medium text-gray-900 dark:text-white">{route.frequency}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Capacity</span>
                    <span className="font-medium text-gray-900 dark:text-white">{route.capacity} passengers</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Fare</span>
                    <span className="font-medium text-gray-900 dark:text-white">${route.fare.toFixed(2)}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{route.description}</p>
                <div className="mb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Waypoints:</p>
                  <div className="flex flex-wrap gap-1">
                    {route.waypoints.map((waypoint, index) => (
                      <span key={index} className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                        {waypoint}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Vehicle Type:</span> {route.vehicleType}
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

        {activeTab === 'drivers' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Drivers</h2>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search drivers..."
                      className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                    <MagnifyingGlassIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                  </div>
                  <button className="flex items-center px-3 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add Driver
                  </button>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Driver</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">License</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Vehicle</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Route</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rating</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {drivers.map((driver) => (
                    <tr key={driver.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {driver.firstName} {driver.lastName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{driver.email}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{driver.phone}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <div>{driver.licenseType}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Expires: {driver.licenseExpiry}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{driver.assignedVehicle || 'Unassigned'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{driver.currentRoute || 'Not assigned'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <div className="flex items-center">
                          <span className="text-yellow-500 mr-1">★</span>
                          {driver.performance.rating}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(driver.status)}`}>
                          {driver.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => setSelectedDriver(driver)}
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

        {activeTab === 'trips' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Trips</h2>
                <div className="flex items-center space-x-3">
                  <select className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
                    <option value="">All Status</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="delayed">Delayed</option>
                  </select>
                  <button className="flex items-center px-3 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Schedule Trip
                  </button>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Trip</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Route</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Vehicle</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Driver</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Passengers</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {trips.map((trip) => (
                    <tr key={trip.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{trip.tripNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{trip.routeName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{trip.vehiclePlate}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{trip.driverName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <div>{new Date(trip.departureTime).toLocaleTimeString()}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">→ {new Date(trip.arrivalTime).toLocaleTimeString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{trip.passengerCount}/{trip.capacity}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(trip.status)}`}>
                          {trip.status}
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

        {activeTab === 'maintenance' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Maintenance Requests</h2>
                <div className="flex items-center space-x-3">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Total Cost: <span className="font-bold text-red-600 dark:text-red-400">$1,245.00</span>
                  </div>
                  <button className="flex items-center px-3 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                    <PlusIcon className="w-4 h-4 mr-2" />
                    New Request
                  </button>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Vehicle</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Priority</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Requested</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Cost</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {maintenanceRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{request.vehiclePlate}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{request.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(request.priority)}`}>
                          {request.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{request.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{request.requestDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        ${request.actualCost || request.estimatedCost || 0}
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

        {activeTab === 'fuel' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Fuel Records</h2>
                <div className="flex items-center space-x-3">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Total Cost: <span className="font-bold text-orange-600 dark:text-orange-400">$875.42</span>
                  </div>
                  <button className="flex items-center px-3 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add Record
                  </button>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Vehicle</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Fuel Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Price/Unit</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Odometer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {fuelRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{record.vehiclePlate}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{record.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{record.fuelType}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{record.quantity}L</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">${record.unitPrice.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">${record.totalPrice.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{record.odometer.toLocaleString()} km</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{record.location}</td>
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

        {activeTab === 'schedule' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Transportation Schedule</h2>
                <div className="flex items-center space-x-3">
                  <input
                    type="date"
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    defaultValue={new Date().toISOString().split('T')[0]}
                  />
                  <button className="flex items-center px-3 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add Schedule
                  </button>
                </div>
              </div>
            </div>
            <div className="p-6">
              {schedules.map((schedule) => (
                <div key={schedule.id} className="mb-6">
                  <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-4">{schedule.date}</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Scheduled Routes</h4>
                      <div className="space-y-2">
                        {schedule.routes.map((route) => (
                          <div key={route.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-900 dark:text-white">{route.routeName}</span>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(route.status)}`}>
                                {route.status}
                              </span>
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              {route.vehiclePlate} • {route.driverName} • {route.departureTime} → {route.arrivalTime}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Vehicle Status</h4>
                      <div className="space-y-2">
                        {schedule.vehicles.map((vehicle) => (
                          <div key={vehicle.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-900 dark:text-white">{vehicle.vehiclePlate}</span>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(vehicle.status)}`}>
                                {vehicle.status}
                              </span>
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              {vehicle.location} • Fuel: {vehicle.fuelLevel}%
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Driver Status</h4>
                      <div className="space-y-2">
                        {schedule.drivers.map((driver) => (
                          <div key={driver.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-900 dark:text-white">{driver.driverName}</span>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(driver.status)}`}>
                                {driver.status}
                              </span>
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              {driver.currentLocation} • Next shift: {driver.nextShift || 'Not scheduled'}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  {schedule.specialEvents.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Special Events</h4>
                      <div className="space-y-2">
                        {schedule.specialEvents.map((event) => (
                          <div key={event.id} className="bg-purple-50 dark:bg-purple-900 rounded-lg p-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-900 dark:text-white">{event.name}</span>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(event.status)}`}>
                                {event.status}
                              </span>
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              {event.type} • {event.time} • {event.location} • {event.participants} participants
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {schedule.notes && (
                    <div className="mt-6">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Notes</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{schedule.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {reports.map((report) => (
              <div key={report.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{report.title}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(report.status)}`}>
                    {report.status}
                  </span>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Type</span>
                    <span className="font-medium text-gray-900 dark:text-white">{report.type}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Period</span>
                    <span className="font-medium text-gray-900 dark:text-white">{report.period}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Generated</span>
                    <span className="font-medium text-gray-900 dark:text-white">{report.generatedDate}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Format</span>
                    <span className="font-medium text-gray-900 dark:text-white">{report.format.toUpperCase()}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{report.description}</p>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Generated by: {report.generatedBy}
                  </div>
                  <div className="flex items-center space-x-2">
                    {report.status === 'completed' && (
                      <button className="flex items-center text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300">
                        <ArrowDownTrayIcon className="w-4 h-4 mr-1" />
                        Download
                      </button>
                    )}
                    <button className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300">
                      <EyeIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Vehicle Detail Modal */}
      {selectedVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Vehicle Details</h3>
                <button
                  onClick={() => setSelectedVehicle(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {selectedVehicle.make} {selectedVehicle.model}
                </h4>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedVehicle.status)}`}>
                  {selectedVehicle.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Plate Number</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedVehicle.plateNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Type</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedVehicle.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Year</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedVehicle.year}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Capacity</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedVehicle.capacity} passengers</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Fuel Type</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedVehicle.fuelType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Current Driver</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedVehicle.driver || 'Unassigned'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Current Location</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedVehicle.location}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Current Route</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedVehicle.currentRoute || 'Not assigned'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Mileage</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedVehicle.mileage.toLocaleString()} km</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Fuel Level</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedVehicle.fuelLevel}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Last Maintenance</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedVehicle.lastMaintenance}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Next Maintenance</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedVehicle.nextMaintenance}</p>
                </div>
              </div>

              <div className="mb-6">
                <h5 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Specifications</h5>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Engine</span>
                    <span className="font-medium text-gray-900 dark:text-white">{selectedVehicle.specifications.engine}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Transmission</span>
                    <span className="font-medium text-gray-900 dark:text-white">{selectedVehicle.specifications.transmission}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Color</span>
                    <span className="font-medium text-gray-900 dark:text-white">{selectedVehicle.specifications.color}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">VIN</span>
                    <span className="font-medium text-gray-900 dark:text-white">{selectedVehicle.specifications.vin}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">License Class</span>
                    <span className="font-medium text-gray-900 dark:text-white">{selectedVehicle.specifications.licenseClass}</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h5 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Documents</h5>
                <div className="space-y-2">
                  {selectedVehicle.documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{doc.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{doc.type} • Expires: {doc.expiryDate}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(doc.status)}`}>
                        {doc.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Insurance Expires:</span> {selectedVehicle.insuranceExpiry}
                </div>
                <div className="flex items-center space-x-2">
                  <button className="flex items-center px-4 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                    <WrenchScrewdriverIcon className="w-4 h-4 mr-2" />
                    Schedule Maintenance
                  </button>
                  <button className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300">
                    <PencilIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Driver Detail Modal */}
      {selectedDriver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Driver Details</h3>
                <button
                  onClick={() => setSelectedDriver(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {selectedDriver.firstName} {selectedDriver.lastName}
                </h4>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedDriver.status)}`}>
                  {selectedDriver.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedDriver.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedDriver.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">License Number</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedDriver.licenseNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">License Type</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedDriver.licenseType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">License Expiry</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedDriver.licenseExpiry}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Hire Date</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedDriver.hireDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Date of Birth</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedDriver.dateOfBirth}</p>
                </div>
              </div>

              <div className="mb-6">
                <h5 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Address</h5>
                <p className="text-sm text-gray-600 dark:text-gray-400">{selectedDriver.address}</p>
              </div>

              <div className="mb-6">
                <h5 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Emergency Contact</h5>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Name</span>
                    <span className="font-medium text-gray-900 dark:text-white">{selectedDriver.emergencyContact.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Relationship</span>
                    <span className="font-medium text-gray-900 dark:text-white">{selectedDriver.emergencyContact.relationship}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Phone</span>
                    <span className="font-medium text-gray-900 dark:text-white">{selectedDriver.emergencyContact.phone}</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h5 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Performance</h5>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{selectedDriver.performance.rating}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Rating</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{selectedDriver.performance.totalTrips}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Trips</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{selectedDriver.performance.onTimeRate}%</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">On-Time Rate</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{selectedDriver.performance.fuelEfficiency}%</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Fuel Efficiency</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Safety Record</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedDriver.performance.safetyRecord}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Last Review: {selectedDriver.performance.lastReview}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{selectedDriver.performance.notes}</p>
                </div>
              </div>

              <div className="mb-6">
                <h5 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Certifications</h5>
                <div className="space-y-2">
                  {selectedDriver.certifications.map((cert) => (
                    <div key={cert.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{cert.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{cert.type} • {cert.issuer}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Issued: {cert.issueDate} • Expires: {cert.expiryDate}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(cert.status)}`}>
                        {cert.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h5 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Training Records</h5>
                <div className="space-y-2">
                  {selectedDriver.trainingRecords.map((training) => (
                    <div key={training.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{training.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{training.type} • {training.duration}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Instructor: {training.instructor} • Date: {training.date}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(training.status)}`}>
                          {training.status}
                        </span>
                        {training.score && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Score: {training.score}/100</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Assigned Vehicle:</span> {selectedDriver.assignedVehicle || 'None'}
                </div>
                <div className="flex items-center space-x-2">
                  <button className="flex items-center px-4 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                    <ClipboardDocumentListIcon className="w-4 h-4 mr-2" />
                    Assign Route
                  </button>
                  <button className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300">
                    <PencilIcon className="w-4 h-4" />
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
