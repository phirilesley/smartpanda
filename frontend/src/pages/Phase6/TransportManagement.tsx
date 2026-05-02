import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TruckIcon,
  MapIcon,
  UserGroupIcon,
  ClockIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ChartBarIcon,
  BellIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowPathIcon,
  DocumentTextIcon,
  UserIcon,
  BuildingOfficeIcon,
  AcademicCapIcon,
  MapPinIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  WrenchScrewdriverIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';

interface Vehicle {
  id: string;
  registrationNumber: string;
  make: string;
  model: string;
  year: number;
  capacity: number;
  status: 'Active' | 'Maintenance' | 'Inactive';
  fuelType: string;
  lastMaintenanceDate: string;
  nextMaintenanceDue: string;
  driverId?: string;
  driverName?: string;
  currentRouteId?: string;
  currentRouteName?: string;
}

interface Route {
  id: string;
  name: string;
  startLocation: string;
  endLocation: string;
  distance: number;
  estimatedDuration: string;
  status: 'Active' | 'Inactive' | 'Suspended';
  capacity: number;
  currentAssignments: number;
  vehicleId?: string;
  vehicleRegistration?: string;
  driverId?: string;
  driverName?: string;
  stops: RouteStop[];
}

interface RouteStop {
  id: string;
  name: string;
  location: string;
  estimatedArrival: string;
  order: number;
  isPickupPoint: boolean;
  isDropoffPoint: boolean;
}

interface StudentAssignment {
  id: string;
  studentId: string;
  studentName: string;
  studentNumber: string;
  routeId: string;
  routeName: string;
  pickupStopId?: string;
  pickupStopName?: string;
  dropoffStopId?: string;
  dropoffStopName?: string;
  startDate: string;
  endDate?: string;
  status: 'Active' | 'Inactive' | 'Suspended';
  guardianContact: string;
  specialRequirements?: string;
}

interface Trip {
  id: string;
  vehicleId: string;
  vehicleRegistration: string;
  routeId: string;
  routeName: string;
  driverId: string;
  driverName: string;
  scheduledStartTime: string;
  scheduledEndTime: string;
  actualStartTime?: string;
  actualEndTime?: string;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
  passengerCount: number;
  distance: number;
  fuelConsumed?: number;
  notes?: string;
}

interface TransportAnalytics {
  totalVehicles: number;
  activeVehicles: number;
  totalRoutes: number;
  activeRoutes: number;
  totalAssignments: number;
  totalTrips: number;
  averageCapacity: number;
  fuelEfficiency: number;
  maintenanceAlerts: number;
  upcomingTrips: number;
  popularRoutes: Array<{ name: string; assignments: number }>;
  vehicleUtilization: Array<{ registration: string; utilization: number }>;
  monthlyTrends: Array<{ month: string; trips: number; passengers: number; fuel: number }>;
}

export const TransportManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'vehicles' | 'routes' | 'assignments' | 'trips' | 'analytics'>('vehicles');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [assignments, setAssignments] = useState<StudentAssignment[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [analytics, setAnalytics] = useState<TransportAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API calls
      const mockVehicles: Vehicle[] = [
        {
          id: '1',
          registrationNumber: 'BUS-001',
          make: 'Toyota',
          model: 'Coaster',
          year: 2023,
          capacity: 40,
          status: 'Active',
          fuelType: 'Diesel',
          lastMaintenanceDate: '2024-01-15',
          nextMaintenanceDue: '2024-04-15',
          driverId: 'driver-1',
          driverName: 'John Smith',
          currentRouteId: 'route-1',
          currentRouteName: 'Morning Route A'
        },
        {
          id: '2',
          registrationNumber: 'VAN-002',
          make: 'Honda',
          model: 'CR-V',
          year: 2022,
          capacity: 7,
          status: 'Active',
          fuelType: 'Petrol',
          lastMaintenanceDate: '2024-02-01',
          nextMaintenanceDue: '2024-05-01',
          driverId: 'driver-2',
          driverName: 'Sarah Johnson'
        },
        {
          id: '3',
          registrationNumber: 'BUS-003',
          make: 'Mercedes',
          model: 'Sprinter',
          year: 2021,
          capacity: 25,
          status: 'Maintenance',
          fuelType: 'Diesel',
          lastMaintenanceDate: '2024-02-10',
          nextMaintenanceDue: '2024-02-25'
        }
      ];

      const mockRoutes: Route[] = [
        {
          id: 'route-1',
          name: 'Morning Route A',
          startLocation: 'City Center',
          endLocation: 'Smart School',
          distance: 12.5,
          estimatedDuration: '00:35:00',
          status: 'Active',
          capacity: 40,
          currentAssignments: 35,
          vehicleId: '1',
          vehicleRegistration: 'BUS-001',
          driverId: 'driver-1',
          driverName: 'John Smith',
          stops: [
            {
              id: 'stop-1',
              name: 'Central Station',
              location: '123 Main St',
              estimatedArrival: '07:30',
              order: 1,
              isPickupPoint: true,
              isDropoffPoint: false
            },
            {
              id: 'stop-2',
              name: 'Park Avenue',
              location: '456 Park Ave',
              estimatedArrival: '07:45',
              order: 2,
              isPickupPoint: true,
              isDropoffPoint: false
            }
          ]
        },
        {
          id: 'route-2',
          name: 'Afternoon Route B',
          startLocation: 'Smart School',
          endLocation: 'Suburb Mall',
          distance: 8.3,
          estimatedDuration: '00:25:00',
          status: 'Active',
          capacity: 30,
          currentAssignments: 22,
          vehicleId: '2',
          vehicleRegistration: 'VAN-002',
          driverId: 'driver-2',
          driverName: 'Sarah Johnson'
        }
      ];

      const mockAssignments: StudentAssignment[] = [
        {
          id: '1',
          studentId: 'stu-1',
          studentName: 'Alice Johnson',
          studentNumber: 'STU001',
          routeId: 'route-1',
          routeName: 'Morning Route A',
          pickupStopId: 'stop-1',
          pickupStopName: 'Central Station',
          dropoffStopId: 'stop-2',
          dropoffStopName: 'Park Avenue',
          startDate: '2024-01-15',
          status: 'Active',
          guardianContact: '+1234567890',
          specialRequirements: 'Wheelchair access'
        },
        {
          id: '2',
          studentId: 'stu-2',
          studentName: 'Bob Smith',
          studentNumber: 'STU002',
          routeId: 'route-2',
          routeName: 'Afternoon Route B',
          startDate: '2024-01-15',
          status: 'Active',
          guardianContact: '+0987654321'
        }
      ];

      const mockTrips: Trip[] = [
        {
          id: '1',
          vehicleId: '1',
          vehicleRegistration: 'BUS-001',
          routeId: 'route-1',
          routeName: 'Morning Route A',
          driverId: 'driver-1',
          driverName: 'John Smith',
          scheduledStartTime: '2024-03-15T07:00:00Z',
          scheduledEndTime: '2024-03-15T08:30:00Z',
          actualStartTime: '2024-03-15T07:05:00Z',
          status: 'Completed',
          passengerCount: 35,
          distance: 12.5,
          fuelConsumed: 8.2
        },
        {
          id: '2',
          vehicleId: '2',
          vehicleRegistration: 'VAN-002',
          routeId: 'route-2',
          routeName: 'Afternoon Route B',
          driverId: 'driver-2',
          driverName: 'Sarah Johnson',
          scheduledStartTime: '2024-03-15T15:30:00Z',
          scheduledEndTime: '2024-03-15T16:00:00Z',
          status: 'Scheduled',
          passengerCount: 22,
          distance: 8.3
        }
      ];

      const mockAnalytics: TransportAnalytics = {
        totalVehicles: 15,
        activeVehicles: 12,
        totalRoutes: 8,
        activeRoutes: 7,
        totalAssignments: 245,
        totalTrips: 1560,
        averageCapacity: 28,
        fuelEfficiency: 8.5,
        maintenanceAlerts: 3,
        upcomingTrips: 24,
        popularRoutes: [
          { name: 'Morning Route A', assignments: 45 },
          { name: 'Afternoon Route B', assignments: 38 },
          { name: 'Weekend Shuttle', assignments: 25 }
        ],
        vehicleUtilization: [
          { registration: 'BUS-001', utilization: 87.5 },
          { registration: 'VAN-002', utilization: 73.3 },
          { registration: 'BUS-003', utilization: 0 }
        ],
        monthlyTrends: [
          { month: 'Jan', trips: 520, passengers: 12450, fuel: 4200 },
          { month: 'Feb', trips: 480, passengers: 11200, fuel: 3900 },
          { month: 'Mar', trips: 560, passengers: 13500, fuel: 4500 }
        ]
      };

      setVehicles(mockVehicles);
      setRoutes(mockRoutes);
      setAssignments(mockAssignments);
      setTrips(mockTrips);
      setAnalytics(mockAnalytics);
    } catch (error) {
      console.error('Error loading transport data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Maintenance':
      case 'Suspended':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Inactive':
      case 'Cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'Scheduled':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'In Progress':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'Completed':
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Transport Management</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage vehicles, routes, student assignments, and trips</p>
      </div>

      {/* Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Vehicles</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.activeVehicles}/{analytics.totalVehicles}</p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-3">
                <TruckIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600 dark:text-green-400">{analytics.maintenanceAlerts} need maintenance</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Assignments</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.totalAssignments}</p>
              </div>
              <div className="bg-green-100 dark:bg-green-900 rounded-full p-3">
                <UserGroupIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-blue-600 dark:text-blue-400">{analytics.averageCapacity} avg capacity</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Routes</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.activeRoutes}/{analytics.totalRoutes}</p>
              </div>
              <div className="bg-purple-100 dark:bg-purple-900 rounded-full p-3">
                <MapIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-gray-500 dark:text-gray-400">{analytics.upcomingTrips} trips today</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Fuel Efficiency</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.fuelEfficiency} km/L</p>
              </div>
              <div className="bg-yellow-100 dark:bg-yellow-900 rounded-full p-3">
                <CurrencyDollarIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-gray-500 dark:text-gray-400">This month</span>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'vehicles', label: 'Vehicles', icon: TruckIcon },
            { id: 'routes', label: 'Routes', icon: MapIcon },
            { id: 'assignments', label: 'Assignments', icon: UserGroupIcon },
            { id: 'trips', label: 'Trips', icon: ClockIcon },
            { id: 'analytics', label: 'Analytics', icon: ChartBarIcon }
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
        {activeTab === 'vehicles' && (
          <div>
            {/* Actions Bar */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search vehicles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="all">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Add Vehicle
                </button>
                <button className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <ArrowPathIcon className="w-4 h-4 mr-2" />
                  Refresh
                </button>
              </div>
            </div>

            {/* Vehicles Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {vehicles.filter(v => 
                v.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) &&
                (filterStatus === 'all' || v.status === filterStatus)
              ).map((vehicle) => (
                <motion.div
                  key={vehicle.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                          {vehicle.registrationNumber}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {vehicle.make} {vehicle.model} ({vehicle.year})
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(vehicle.status)}`}>
                        {vehicle.status}
                      </span>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Capacity</span>
                        <span className="font-medium text-gray-900 dark:text-white">{vehicle.capacity} seats</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Fuel Type</span>
                        <span className="font-medium text-gray-900 dark:text-white">{vehicle.fuelType}</span>
                      </div>
                      {vehicle.driverName && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Driver</span>
                          <span className="font-medium text-gray-900 dark:text-white">{vehicle.driverName}</span>
                        </div>
                      )}
                      {vehicle.currentRouteName && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Current Route</span>
                          <span className="font-medium text-gray-900 dark:text-white">{vehicle.currentRouteName}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Next Maintenance</span>
                        <span className={`font-medium ${
                          new Date(vehicle.nextMaintenanceDue) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-gray-900 dark:text-white'
                        }`}>
                          {new Date(vehicle.nextMaintenanceDue).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors">
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors">
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors">
                          <WrenchScrewdriverIcon className="w-4 h-4" />
                        </button>
                      </div>
                      <button className="px-3 py-1 text-sm bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'routes' && (
          <div>
            {/* Routes List */}
            <div className="space-y-4">
              {routes.map((route) => (
                <motion.div
                  key={route.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                          {route.name}
                        </h3>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <MapPinIcon className="w-4 h-4 mr-1" />
                          {route.startLocation} → {route.endLocation}
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(route.status)}`}>
                        {route.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Distance</p>
                        <p className="font-medium text-gray-900 dark:text-white">{route.distance} km</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Duration</p>
                        <p className="font-medium text-gray-900 dark:text-white">{route.estimatedDuration}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Capacity</p>
                        <p className="font-medium text-gray-900 dark:text-white">{route.currentAssignments}/{route.capacity}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Vehicle</p>
                        <p className="font-medium text-gray-900 dark:text-white">{route.vehicleRegistration || 'Not assigned'}</p>
                      </div>
                    </div>

                    {route.stops && route.stops.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Route Stops</p>
                        <div className="space-y-2">
                          {route.stops.map((stop, index) => (
                            <div key={stop.id} className="flex items-center text-sm">
                              <div className="w-6 h-6 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mr-3">
                                <span className="text-xs font-medium text-primary-600 dark:text-primary-400">{index + 1}</span>
                              </div>
                              <div className="flex-1">
                                <span className="font-medium text-gray-900 dark:text-white">{stop.name}</span>
                                <span className="text-gray-600 dark:text-gray-400 ml-2">({stop.estimatedArrival})</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                {stop.isPickupPoint && (
                                  <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded">
                                    Pickup
                                  </span>
                                )}
                                {stop.isDropoffPoint && (
                                  <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                                    Dropoff
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors">
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors">
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors">
                          <MapIcon className="w-4 h-4" />
                        </button>
                      </div>
                      <button className="px-3 py-1 text-sm bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors">
                        Manage Route
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'assignments' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Student Assignments</h2>
              <div className="flex items-center space-x-4">
                <select className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
                  <option value="">All Routes</option>
                  {routes.map((route) => (
                    <option key={route.id} value={route.id}>
                      {route.name}
                    </option>
                  ))}
                </select>
                <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                  New Assignment
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Route
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Stops
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {assignments.map((assignment) => (
                    <tr key={assignment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                            <UserIcon className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{assignment.studentName}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{assignment.studentNumber}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">{assignment.routeName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {assignment.pickupStopName && <div>Pickup: {assignment.pickupStopName}</div>}
                          {assignment.dropoffStopName && <div>Dropoff: {assignment.dropoffStopName}</div>}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(assignment.status)}`}>
                          {assignment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <PhoneIcon className="w-4 h-4 mr-1" />
                          {assignment.guardianContact}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 mr-3">
                          Edit
                        </button>
                        <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                          Remove
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
          <div className="space-y-4">
            {trips.map((trip) => (
              <motion.div
                key={trip.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        {trip.routeName}
                      </h3>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <TruckIcon className="w-4 h-4 mr-1" />
                        {trip.vehicleRegistration} • Driver: {trip.driverName}
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(trip.status)}`}>
                      {trip.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Scheduled</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {new Date(trip.scheduledStartTime).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Duration</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {trip.scheduledEndTime && trip.scheduledStartTime ? 
                          Math.round((new Date(trip.scheduledEndTime).getTime() - new Date(trip.scheduledStartTime).getTime()) / 60000) + ' min'
                          : 'N/A'
                        }
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Passengers</p>
                      <p className="font-medium text-gray-900 dark:text-white">{trip.passengerCount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Distance</p>
                      <p className="font-medium text-gray-900 dark:text-white">{trip.distance} km</p>
                    </div>
                  </div>

                  {trip.fuelConsumed && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Fuel Consumption</p>
                      <p className="font-medium text-gray-900 dark:text-white">{trip.fuelConsumed} L</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors">
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors">
                        <DocumentTextIcon className="w-4 h-4" />
                      </button>
                    </div>
                    <button className="px-3 py-1 text-sm bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'analytics' && analytics && (
          <div className="space-y-6">
            {/* Popular Routes */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Popular Routes</h3>
              <div className="space-y-3">
                {analytics.popularRoutes.map((route, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <MapIcon className="w-4 h-4 text-blue-500 mr-2" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{route.name}</span>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{route.assignments} assignments</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Vehicle Utilization */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Vehicle Utilization</h3>
              <div className="space-y-3">
                {analytics.vehicleUtilization.map((vehicle, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <TruckIcon className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{vehicle.registration}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${vehicle.utilization}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">{vehicle.utilization}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Monthly Trends */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Monthly Trends</h3>
              <div className="space-y-4">
                {analytics.monthlyTrends.map((trend, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{trend.month}</span>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <ClockIcon className="w-4 h-4 text-blue-500 mr-1" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{trend.trips} trips</span>
                      </div>
                      <div className="flex items-center">
                        <UserGroupIcon className="w-4 h-4 text-green-500 mr-1" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{trend.passengers} passengers</span>
                      </div>
                      <div className="flex items-center">
                        <CurrencyDollarIcon className="w-4 h-4 text-yellow-500 mr-1" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{trend.fuel}L fuel</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
