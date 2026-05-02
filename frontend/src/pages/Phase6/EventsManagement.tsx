import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CalendarIcon,
  MapPinIcon,
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
  AcademicCapIcon
} from '@heroicons/react/24/outline';

interface Event {
  id: string;
  title: string;
  description: string;
  startAtUtc: string;
  endAtUtc: string;
  venue: string;
  maxParticipants?: number;
  currentParticipants: number;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
  organizer: string;
  academicYear: string;
  term: string;
  category: string;
  priority: 'Low' | 'Medium' | 'High';
  tags: string[];
  createdAt: string;
}

interface EventParticipant {
  id: string;
  studentId?: string;
  guardianId?: string;
  staffId?: string;
  participantType: 'Student' | 'Guardian' | 'Staff';
  participantName: string;
  attendanceStatus: 'Registered' | 'Present' | 'Absent' | 'Excused';
  registeredAt: string;
}

interface EventAnalytics {
  totalEvents: number;
  upcomingEvents: number;
  completedEvents: number;
  totalParticipants: number;
  averageAttendance: number;
  popularVenues: Array<{ name: string; count: number }>;
  eventsByCategory: Array<{ category: string; count: number }>;
  monthlyTrends: Array<{ month: string; events: number; participants: number }>;
}

export const EventsManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'events' | 'participants' | 'analytics' | 'calendar'>('events');
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [participants, setParticipants] = useState<EventParticipant[]>([]);
  const [analytics, setAnalytics] = useState<EventAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);

  useEffect(() => {
    loadEvents();
    loadAnalytics();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockEvents: Event[] = [
        {
          id: '1',
          title: 'Annual Science Fair',
          description: 'Students showcase their science projects and experiments',
          startAtUtc: '2024-03-15T09:00:00Z',
          endAtUtc: '2024-03-15T17:00:00Z',
          venue: 'School Auditorium',
          maxParticipants: 200,
          currentParticipants: 156,
          status: 'Scheduled',
          organizer: 'Dr. Sarah Johnson',
          academicYear: '2023-2024',
          term: 'Spring',
          category: 'Academic',
          priority: 'High',
          tags: ['science', 'exhibition', 'competition'],
          createdAt: '2024-02-01T10:00:00Z'
        },
        {
          id: '2',
          title: 'Sports Day',
          description: 'Annual sports competition with various athletic events',
          startAtUtc: '2024-03-20T08:00:00Z',
          endAtUtc: '2024-03-20T18:00:00Z',
          venue: 'School Ground',
          maxParticipants: 300,
          currentParticipants: 245,
          status: 'Scheduled',
          organizer: 'Mr. Michael Chen',
          academicYear: '2023-2024',
          term: 'Spring',
          category: 'Sports',
          priority: 'Medium',
          tags: ['sports', 'competition', 'athletics'],
          createdAt: '2024-02-05T14:30:00Z'
        },
        {
          id: '3',
          title: 'Parent-Teacher Meeting',
          description: 'Quarterly meeting to discuss student progress',
          startAtUtc: '2024-02-28T16:00:00Z',
          endAtUtc: '2024-02-28T19:00:00Z',
          venue: 'Conference Hall',
          maxParticipants: 150,
          currentParticipants: 89,
          status: 'Completed',
          organizer: 'Ms. Emily Davis',
          academicYear: '2023-2024',
          term: 'Winter',
          category: 'Meeting',
          priority: 'Medium',
          tags: ['parents', 'teachers', 'meeting'],
          createdAt: '2024-02-01T09:00:00Z'
        }
      ];
      setEvents(mockEvents);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAnalytics = async () => {
    try {
      // Mock analytics data
      const mockAnalytics: EventAnalytics = {
        totalEvents: 45,
        upcomingEvents: 8,
        completedEvents: 37,
        totalParticipants: 2340,
        averageAttendance: 87.5,
        popularVenues: [
          { name: 'School Auditorium', count: 15 },
          { name: 'School Ground', count: 12 },
          { name: 'Conference Hall', count: 8 }
        ],
        eventsByCategory: [
          { category: 'Academic', count: 18 },
          { category: 'Sports', count: 12 },
          { category: 'Cultural', count: 8 },
          { category: 'Meeting', count: 7 }
        ],
        monthlyTrends: [
          { month: 'Jan', events: 8, participants: 420 },
          { month: 'Feb', events: 12, participants: 680 },
          { month: 'Mar', events: 15, participants: 890 },
          { month: 'Apr', events: 10, participants: 350 }
        ]
      };
      setAnalytics(mockAnalytics);
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Scheduled':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.venue.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || event.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Events Management</h1>
        <p className="text-gray-600 dark:text-gray-400">Organize and manage school events, participants, and attendance</p>
      </div>

      {/* Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Events</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.totalEvents}</p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-3">
                <CalendarIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600 dark:text-green-400">{analytics.upcomingEvents} upcoming</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Participants</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.totalParticipants}</p>
              </div>
              <div className="bg-green-100 dark:bg-green-900 rounded-full p-3">
                <UserGroupIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-blue-600 dark:text-blue-400">{analytics.averageAttendance}% avg attendance</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed Events</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.completedEvents}</p>
              </div>
              <div className="bg-green-100 dark:bg-green-900 rounded-full p-3">
                <CheckCircleIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-gray-500 dark:text-gray-400">This term</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Popular Venue</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white truncate">
                  {analytics.popularVenues[0]?.name || 'N/A'}
                </p>
              </div>
              <div className="bg-purple-100 dark:bg-purple-900 rounded-full p-3">
                <MapPinIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-gray-500 dark:text-gray-400">
                {analytics.popularVenues[0]?.count || 0} events
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'events', label: 'Events', icon: CalendarIcon },
            { id: 'participants', label: 'Participants', icon: UserGroupIcon },
            { id: 'analytics', label: 'Analytics', icon: ChartBarIcon },
            { id: 'calendar', label: 'Calendar', icon: ClockIcon }
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
        {activeTab === 'events' && (
          <div>
            {/* Actions Bar */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search events..."
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
                  <option value="Scheduled">Scheduled</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Create Event
                </button>
                <button className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <ArrowPathIcon className="w-4 h-4 mr-2" />
                  Refresh
                </button>
              </div>
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {event.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {event.description}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(event.status)}`}>
                          {event.status}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(event.priority)}`}>
                          {event.priority}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        {new Date(event.startAtUtc).toLocaleDateString()} - {new Date(event.startAtUtc).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <MapPinIcon className="w-4 h-4 mr-2" />
                        {event.venue}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <UserGroupIcon className="w-4 h-4 mr-2" />
                        {event.currentParticipants} / {event.maxParticipants || '∞'} participants
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <UserIcon className="w-4 h-4 mr-2" />
                        {event.organizer}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {event.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedEvent(event)}
                          className="p-2 text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors">
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors">
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedEvent(event);
                          setShowParticipantsModal(true);
                        }}
                        className="px-3 py-1 text-sm bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors"
                      >
                        Manage Participants
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'participants' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Event Participants</h2>
              <div className="flex items-center space-x-4">
                <select className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
                  <option value="">Select Event</option>
                  {events.map((event) => (
                    <option key={event.id} value={event.id}>
                      {event.title}
                    </option>
                  ))}
                </select>
                <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                  Load Participants
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Participant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Registered
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {/* Mock participant data */}
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                          <UserIcon className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">John Doe</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">STU001</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                        Student
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
                        Present
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      2024-02-15
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
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && analytics && (
          <div className="space-y-6">
            {/* Events by Category */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Events by Category</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {analytics.eventsByCategory.map((category, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                      {category.count}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{category.category}</div>
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
                        <CalendarIcon className="w-4 h-4 text-blue-500 mr-1" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{trend.events} events</span>
                      </div>
                      <div className="flex items-center">
                        <UserGroupIcon className="w-4 h-4 text-green-500 mr-1" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{trend.participants} participants</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular Venues */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Popular Venues</h3>
              <div className="space-y-3">
                {analytics.popularVenues.map((venue, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <MapPinIcon className="w-4 h-4 text-red-500 mr-2" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{venue.name}</span>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{venue.count} events</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'calendar' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Event Calendar</h3>
            <div className="grid grid-cols-7 gap-4">
              {/* Calendar implementation would go here */}
              <div className="text-center text-sm font-medium text-gray-500 dark:text-gray-400">Sun</div>
              <div className="text-center text-sm font-medium text-gray-500 dark:text-gray-400">Mon</div>
              <div className="text-center text-sm font-medium text-gray-500 dark:text-gray-400">Tue</div>
              <div className="text-center text-sm font-medium text-gray-500 dark:text-gray-400">Wed</div>
              <div className="text-center text-sm font-medium text-gray-500 dark:text-gray-400">Thu</div>
              <div className="text-center text-sm font-medium text-gray-500 dark:text-gray-400">Fri</div>
              <div className="text-center text-sm font-medium text-gray-500 dark:text-gray-400">Sat</div>
              {/* Calendar days would be rendered here */}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
