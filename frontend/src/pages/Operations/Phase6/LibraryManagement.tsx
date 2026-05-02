import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpenIcon,
  BuildingLibraryIcon,
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
  MapPinIcon,
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
  ShoppingCartIcon,
} from '@heroicons/react/24/outline';

// Types
interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  publisher: string;
  publicationYear: number;
  category: string;
  subcategory: string;
  language: string;
  pages: number;
  format: 'hardcover' | 'paperback' | 'ebook' | 'audiobook';
  location: string;
  shelf: string;
  status: 'available' | 'checked-out' | 'reserved' | 'lost' | 'damaged' | 'in-processing';
  totalCopies: number;
  availableCopies: number;
  price: number;
  acquisitionDate: string;
  description: string;
  keywords: string[];
  coverImage?: string;
}

interface Member {
  id: string;
  memberId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  memberType: 'student' | 'faculty' | 'staff' | 'alumni' | 'community';
  department?: string;
  studentId?: string;
  joinDate: string;
  expiryDate: string;
  status: 'active' | 'inactive' | 'suspended' | 'expired';
  totalCheckouts: number;
  currentCheckouts: number;
  overdueItems: number;
  fines: number;
  reservedItems: number;
  preferences: {
    genres: string[];
    languages: string[];
    formats: string[];
  };
}

interface Checkout {
  id: string;
  bookId: string;
  bookTitle: string;
  memberId: string;
  memberName: string;
  checkoutDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'active' | 'returned' | 'overdue' | 'lost';
  renewalCount: number;
  maxRenewals: number;
  fine?: number;
  notes?: string;
}

interface Reservation {
  id: string;
  bookId: string;
  bookTitle: string;
  memberId: string;
  memberName: string;
  reservationDate: string;
  status: 'active' | 'fulfilled' | 'cancelled' | 'expired';
  priority: number;
  notificationSent: boolean;
  expiryDate: string;
}

interface Fine {
  id: string;
  memberId: string;
  memberName: string;
  bookId: string;
  bookTitle: string;
  type: 'overdue' | 'damage' | 'lost' | 'other';
  amount: number;
  date: string;
  status: 'pending' | 'paid' | 'waived' | 'disputed';
  description: string;
  dueDate: string;
  paymentDate?: string;
  paymentMethod?: string;
}

interface Acquisition {
  id: string;
  title: string;
  author: string;
  isbn: string;
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
  vendor: string;
  orderDate: string;
  expectedDelivery: string;
  receivedDate?: string;
  status: 'ordered' | 'received' | 'processing' | 'cancelled';
  requestedBy: string;
  approvedBy: string;
  budgetCode: string;
  category: string;
  justification: string;
}

interface StudyRoom {
  id: string;
  name: string;
  location: string;
  capacity: number;
  equipment: string[];
  features: string[];
  status: 'available' | 'occupied' | 'maintenance' | 'reserved';
  currentOccupancy: number;
  bookings: RoomBooking[];
  hourlyRate?: number;
  description: string;
  rules: string[];
}

interface RoomBooking {
  id: string;
  roomId: string;
  roomName: string;
  memberId: string;
  memberName: string;
  startTime: string;
  endTime: string;
  date: string;
  purpose: string;
  status: 'active' | 'completed' | 'cancelled' | 'no-show';
  participantCount: number;
  notes?: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  type: 'workshop' | 'seminar' | 'reading-club' | 'author-visit' | 'training' | 'other';
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  maxParticipants: number;
  currentParticipants: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  organizer: string;
  speaker?: string;
  registrationRequired: boolean;
  fee?: number;
  materials: string[];
  targetAudience: string[];
}

interface Staff {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  specialization: string[];
  hireDate: string;
  status: 'active' | 'on-leave' | 'inactive';
  qualifications: Qualification[];
  schedule: WorkSchedule[];
  office: string;
  officeHours: string;
}

interface Qualification {
  id: string;
  degree: string;
  institution: string;
  year: string;
  field: string;
}

interface WorkSchedule {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  location: string;
}

interface Report {
  id: string;
  title: string;
  type: 'circulation' | 'acquisition' | 'usage' | 'inventory' | 'financial' | 'custom';
  description: string;
  generatedDate: string;
  period: string;
  format: 'pdf' | 'excel' | 'csv';
  status: 'generating' | 'completed' | 'failed';
  generatedBy: string;
  parameters: Record<string, any>;
  downloadUrl?: string;
}

export const LibraryManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'books' | 'members' | 'checkouts' | 'reservations' | 'fines' | 'acquisitions' | 'study-rooms' | 'events' | 'staff' | 'reports'>('dashboard');
  const [books, setBooks] = useState<Book[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [checkouts, setCheckouts] = useState<Checkout[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [fines, setFines] = useState<Fine[]>([]);
  const [acquisitions, setAcquisitions] = useState<Acquisition[]>([]);
  const [studyRooms, setStudyRooms] = useState<StudyRoom[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  useEffect(() => {
    // Load mock data
    setTimeout(() => {
      setBooks([
        {
          id: '1',
          title: 'Introduction to Computer Science',
          author: 'John Smith',
          isbn: '978-0-123456-789-0',
          publisher: 'Tech Publications',
          publicationYear: 2023,
          category: 'Computer Science',
          subcategory: 'Programming',
          language: 'English',
          pages: 450,
          format: 'hardcover',
          location: 'Main Library',
          shelf: 'CS-101',
          status: 'available',
          totalCopies: 5,
          availableCopies: 3,
          price: 89.99,
          acquisitionDate: '2023-08-15',
          description: 'A comprehensive introduction to computer science fundamentals',
          keywords: ['programming', 'algorithms', 'data structures', 'computer science'],
        },
        {
          id: '2',
          title: 'Advanced Mathematics',
          author: 'Dr. Sarah Johnson',
          isbn: '978-0-987654-321-0',
          publisher: 'Academic Press',
          publicationYear: 2022,
          category: 'Mathematics',
          subcategory: 'Calculus',
          language: 'English',
          pages: 380,
          format: 'paperback',
          location: 'Main Library',
          shelf: 'MATH-201',
          status: 'checked-out',
          totalCopies: 3,
          availableCopies: 0,
          price: 75.50,
          acquisitionDate: '2022-09-20',
          description: 'Advanced calculus topics for undergraduate students',
          keywords: ['calculus', 'mathematics', 'derivatives', 'integrals'],
        },
      ]);

      setMembers([
        {
          id: '1',
          memberId: 'LIB-2024-001',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@smartpanda.edu',
          phone: '+1-555-0123',
          address: '123 Main St, City, State 12345',
          memberType: 'student',
          department: 'Computer Science',
          studentId: 'STU001',
          joinDate: '2023-09-01',
          expiryDate: '2024-09-01',
          status: 'active',
          totalCheckouts: 15,
          currentCheckouts: 2,
          overdueItems: 0,
          fines: 0,
          reservedItems: 1,
          preferences: {
            genres: ['Science Fiction', 'Technology', 'Mathematics'],
            languages: ['English'],
            formats: ['hardcover', 'ebook'],
          },
        },
        {
          id: '2',
          memberId: 'LIB-2024-002',
          firstName: 'Dr. Sarah',
          lastName: 'Johnson',
          email: 'sarah.johnson@smartpanda.edu',
          phone: '+1-555-0124',
          address: '456 University Ave, City, State 12345',
          memberType: 'faculty',
          department: 'Mathematics',
          joinDate: '2020-08-15',
          expiryDate: '2025-08-15',
          status: 'active',
          totalCheckouts: 45,
          currentCheckouts: 5,
          overdueItems: 1,
          fines: 25.00,
          reservedItems: 2,
          preferences: {
            genres: ['Mathematics', 'Science', 'History'],
            languages: ['English', 'French'],
            formats: ['hardcover', 'paperback'],
          },
        },
      ]);

      setCheckouts([
        {
          id: '1',
          bookId: '1',
          bookTitle: 'Introduction to Computer Science',
          memberId: '1',
          memberName: 'John Doe',
          checkoutDate: '2024-01-15',
          dueDate: '2024-02-15',
          status: 'active',
          renewalCount: 0,
          maxRenewals: 2,
        },
        {
          id: '2',
          bookId: '2',
          bookTitle: 'Advanced Mathematics',
          memberId: '2',
          memberName: 'Dr. Sarah Johnson',
          checkoutDate: '2023-12-01',
          dueDate: '2023-12-31',
          returnDate: '2024-01-15',
          status: 'overdue',
          renewalCount: 1,
          maxRenewals: 2,
          fine: 25.00,
        },
      ]);

      setReservations([
        {
          id: '1',
          bookId: '2',
          bookTitle: 'Advanced Mathematics',
          memberId: '1',
          memberName: 'John Doe',
          reservationDate: '2024-01-20',
          status: 'active',
          priority: 1,
          notificationSent: false,
          expiryDate: '2024-02-20',
        },
      ]);

      setFines([
        {
          id: '1',
          memberId: '2',
          memberName: 'Dr. Sarah Johnson',
          bookId: '2',
          bookTitle: 'Advanced Mathematics',
          type: 'overdue',
          amount: 25.00,
          date: '2024-01-15',
          status: 'pending',
          description: 'Overdue fine for 15 days',
          dueDate: '2024-02-15',
        },
      ]);

      setAcquisitions([
        {
          id: '1',
          title: 'Machine Learning Fundamentals',
          author: 'Dr. Michael Chen',
          isbn: '978-0-555666-777-0',
          quantity: 5,
          pricePerUnit: 95.00,
          totalPrice: 475.00,
          vendor: 'Tech Books Inc.',
          orderDate: '2024-01-10',
          expectedDelivery: '2024-02-01',
          status: 'ordered',
          requestedBy: 'Dr. Sarah Johnson',
          approvedBy: 'Library Director',
          budgetCode: 'LIB-2024-001',
          category: 'Computer Science',
          justification: 'Required for new CS course offering',
        },
      ]);

      setStudyRooms([
        {
          id: '1',
          name: 'Study Room A',
          location: '2nd Floor, Room 201',
          capacity: 4,
          equipment: ['Whiteboard', 'Projector', 'Computer'],
          features: ['WiFi', 'Power outlets', 'Air conditioning'],
          status: 'available',
          currentOccupancy: 0,
          bookings: [],
          hourlyRate: 5.00,
          description: 'Small group study room with presentation equipment',
          rules: ['Maximum 4 hours per booking', 'Food and drinks not allowed', 'Clean up after use'],
        },
        {
          id: '2',
          name: 'Group Study Room B',
          location: '3rd Floor, Room 301',
          capacity: 8,
          equipment: ['Large whiteboard', 'Video conferencing', 'Smart TV'],
          features: ['High-speed WiFi', 'Multiple power outlets', 'Presentation tools'],
          status: 'occupied',
          currentOccupancy: 6,
          bookings: [],
          hourlyRate: 10.00,
          description: 'Large group study room for collaborative work',
          rules: ['Maximum 6 hours per booking', 'Reservation required', 'Staff supervision for large groups'],
        },
      ]);

      setEvents([
        {
          id: '1',
          title: 'Research Skills Workshop',
          description: 'Learn effective research techniques and citation methods',
          type: 'workshop',
          date: '2024-02-15',
          startTime: '2:00 PM',
          endTime: '4:00 PM',
          location: 'Conference Room A',
          maxParticipants: 30,
          currentParticipants: 18,
          status: 'upcoming',
          organizer: 'Library Staff',
          speaker: 'Dr. Emily Davis',
          registrationRequired: true,
          fee: 0,
          materials: ['Handbook', 'Citation guide'],
          targetAudience: ['Students', 'Faculty'],
        },
        {
          id: '2',
          title: 'Book Club Meeting',
          description: 'Monthly book club discussion',
          type: 'reading-club',
          date: '2024-02-20',
          startTime: '6:00 PM',
          endTime: '7:30 PM',
          location: 'Reading Lounge',
          maxParticipants: 20,
          currentParticipants: 12,
          status: 'upcoming',
          organizer: 'Library Staff',
          registrationRequired: false,
          fee: 0,
          materials: ['Discussion questions', 'Book summary'],
          targetAudience: ['All members'],
        },
      ]);

      setStaff([
        {
          id: '1',
          firstName: 'Emily',
          lastName: 'Davis',
          email: 'emily.davis@smartpanda.edu',
          phone: '+1-555-0301',
          position: 'Head Librarian',
          department: 'Library Administration',
          specialization: ['Library Management', 'Digital Resources', 'Information Science'],
          hireDate: '2018-07-15',
          status: 'active',
          qualifications: [
            {
              id: '1',
              degree: 'MLS',
              institution: 'University of Information Science',
              year: '2018',
              field: 'Library Science',
            },
          ],
          schedule: [
            {
              id: '1',
              day: 'Monday',
              startTime: '9:00 AM',
              endTime: '5:00 PM',
              location: 'Main Office',
            },
          ],
          office: 'Room 105',
          officeHours: 'Monday-Friday 9:00 AM - 5:00 PM',
        },
      ]);

      setReports([
        {
          id: '1',
          title: 'Monthly Circulation Report',
          type: 'circulation',
          description: 'Monthly statistics on book checkouts and returns',
          generatedDate: '2024-01-31',
          period: 'January 2024',
          format: 'pdf',
          status: 'completed',
          generatedBy: 'Library System',
          parameters: {
            startDate: '2024-01-01',
            endDate: '2024-01-31',
            includeDetails: true,
          },
          downloadUrl: '/reports/circulation-jan-2024.pdf',
        },
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'available':
      case 'completed':
      case 'fulfilled':
      case 'paid':
      case 'received':
      case 'upcoming':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'inactive':
      case 'expired':
      case 'suspended':
      case 'cancelled':
      case 'lost':
      case 'damaged':
      case 'failed':
      case 'overdue':
      case 'no-show':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'pending':
      case 'ordered':
      case 'processing':
      case 'reserved':
      case 'in-processing':
      case 'generating':
      case 'ongoing':
      case 'active':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'on-leave':
      case 'maintenance':
      case 'occupied':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Library Management</h1>
        <p className="text-gray-600 dark:text-gray-400">Comprehensive library operations and resource management</p>
      </div>

      {/* Alert */}
      <div className="mb-6 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-center">
          <BellIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3" />
          <div>
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">Library Updates</h3>
            <p className="text-sm text-blue-700 dark:text-blue-300">2 books overdue, 5 reservations pending, new acquisitions arriving next week</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: ChartBarIcon },
            { id: 'books', label: 'Books', icon: BookOpenIcon },
            { id: 'members', label: 'Members', icon: UserGroupIcon },
            { id: 'checkouts', label: 'Checkouts', icon: ClipboardDocumentListIcon },
            { id: 'reservations', label: 'Reservations', icon: BookmarkIcon },
            { id: 'fines', label: 'Fines', icon: CurrencyDollarIcon },
            { id: 'acquisitions', label: 'Acquisitions', icon: PlusIcon },
            { id: 'study-rooms', label: 'Study Rooms', icon: BuildingOfficeIcon },
            { id: 'events', label: 'Events', icon: CalendarIcon },
            { id: 'staff', label: 'Staff', icon: UsersIcon },
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
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Books</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">12,456</p>
                </div>
                <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-3">
                  <BookOpenIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-green-600 dark:text-green-400">156</span>
                <span className="text-gray-500 dark:text-gray-400 ml-2">added this month</span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Members</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">3,247</p>
                </div>
                <div className="bg-green-100 dark:bg-green-900 rounded-full p-3">
                  <UserGroupIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-green-600 dark:text-green-400">89</span>
                <span className="text-gray-500 dark:text-gray-400 ml-2">new this month</span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Current Checkouts</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">1,234</p>
                </div>
                <div className="bg-yellow-100 dark:bg-yellow-900 rounded-full p-3">
                  <ClipboardDocumentListIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-red-600 dark:text-red-400">23</span>
                <span className="text-gray-500 dark:text-gray-400 ml-2">overdue</span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Fines</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">$1,847</p>
                </div>
                <div className="bg-red-100 dark:bg-red-900 rounded-full p-3">
                  <CurrencyDollarIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-yellow-600 dark:text-yellow-400">45</span>
                <span className="text-gray-500 dark:text-gray-400 ml-2">unpaid fines</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'books' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Book Catalog</h2>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search books..."
                      className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                    <MagnifyingGlassIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                  </div>
                  <button className="flex items-center px-3 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add Book
                  </button>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Author</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Copies</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {books.map((book) => (
                    <tr key={book.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{book.title}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">ISBN: {book.isbn}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{book.author}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{book.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <div>{book.location}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{book.shelf}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <div>{book.availableCopies}/{book.totalCopies}</div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                          <div
                            className={`h-2 rounded-full ${
                              book.availableCopies === 0 ? 'bg-red-500' : book.availableCopies <= book.totalCopies * 0.2 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${(book.availableCopies / book.totalCopies) * 100}%` }}
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(book.status)}`}>
                          {book.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => setSelectedBook(book)}
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

        {activeTab === 'members' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Library Members</h2>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search members..."
                      className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                    <MagnifyingGlassIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                  </div>
                  <button className="flex items-center px-3 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add Member
                  </button>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Member</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Member Since</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Current</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Fines</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {members.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {member.firstName} {member.lastName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{member.memberId}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{member.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{member.memberType}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{member.department || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{member.joinDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <div>{member.currentCheckouts} checkouts</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{member.reservedItems} reserved</div>
                        {member.overdueItems > 0 && (
                          <div className="text-xs text-red-600 dark:text-red-400">{member.overdueItems} overdue</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <span className={member.fines > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}>
                          ${member.fines.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(member.status)}`}>
                          {member.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => setSelectedMember(member)}
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

        {activeTab === 'checkouts' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Book Checkouts</h2>
                <div className="flex items-center space-x-3">
                  <select className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="returned">Returned</option>
                    <option value="overdue">Overdue</option>
                    <option value="lost">Lost</option>
                  </select>
                  <button className="flex items-center px-3 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                    <PlusIcon className="w-4 h-4 mr-2" />
                    New Checkout
                  </button>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Book</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Member</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Checkout Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Due Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Return Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Renewals</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {checkouts.map((checkout) => (
                    <tr key={checkout.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{checkout.bookTitle}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{checkout.memberName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{checkout.checkoutDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{checkout.dueDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{checkout.returnDate || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {checkout.renewalCount}/{checkout.maxRenewals}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(checkout.status)}`}>
                          {checkout.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 mr-3">
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        {checkout.status === 'active' && (
                          <button className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 mr-3">
                            <ArrowPathIcon className="w-4 h-4" />
                          </button>
                        )}
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

        {activeTab === 'reservations' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Book Reservations</h2>
                <button className="flex items-center px-3 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                  <PlusIcon className="w-4 h-4 mr-2" />
                  New Reservation
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Book</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Member</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Reservation Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Expiry Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Priority</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {reservations.map((reservation) => (
                    <tr key={reservation.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{reservation.bookTitle}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{reservation.memberName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{reservation.reservationDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{reservation.expiryDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{reservation.priority}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(reservation.status)}`}>
                          {reservation.status}
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

        {activeTab === 'fines' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Library Fines</h2>
                <div className="flex items-center space-x-3">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Total Outstanding: <span className="font-bold text-red-600 dark:text-red-400">$1,847.00</span>
                  </div>
                  <button className="flex items-center px-3 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add Fine
                  </button>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Member</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Book</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Due Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {fines.map((fine) => (
                    <tr key={fine.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{fine.memberName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{fine.bookTitle}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{fine.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">${fine.amount.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{fine.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{fine.dueDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(fine.status)}`}>
                          {fine.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 mr-3">
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        {fine.status === 'pending' && (
                          <button className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 mr-3">
                            <CreditCardIcon className="w-4 h-4" />
                          </button>
                        )}
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

        {activeTab === 'acquisitions' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Book Acquisitions</h2>
                <button className="flex items-center px-3 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                  <PlusIcon className="w-4 h-4 mr-2" />
                  New Acquisition
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Author</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Vendor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Expected Delivery</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {acquisitions.map((acquisition) => (
                    <tr key={acquisition.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{acquisition.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{acquisition.author}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{acquisition.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">${acquisition.totalPrice.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{acquisition.vendor}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{acquisition.expectedDelivery}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(acquisition.status)}`}>
                          {acquisition.status}
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

        {activeTab === 'study-rooms' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {studyRooms.map((room) => (
              <div key={room.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{room.name}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(room.status)}`}>
                    {room.status}
                  </span>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Location</span>
                    <span className="font-medium text-gray-900 dark:text-white">{room.location}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Capacity</span>
                    <span className="font-medium text-gray-900 dark:text-white">{room.currentOccupancy}/{room.capacity}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Hourly Rate</span>
                    <span className="font-medium text-gray-900 dark:text-white">${room.hourlyRate || 0}/hour</span>
                  </div>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Equipment:</p>
                  <div className="flex flex-wrap gap-1">
                    {room.equipment.map((item, index) => (
                      <span key={index} className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Features:</p>
                  <div className="flex flex-wrap gap-1">
                    {room.features.map((feature, index) => (
                      <span key={index} className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{room.description}</p>
                <div className="flex items-center justify-between">
                  <button className="flex items-center text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300">
                    <CalendarIcon className="w-4 h-4 mr-1" />
                    Book Room
                  </button>
                  <div className="flex items-center space-x-2">
                    <button className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300">
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

        {activeTab === 'events' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {events.map((event) => (
              <div key={event.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{event.title}</h3>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(event.status)}`}>
                      {event.status}
                    </span>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                      {event.type}
                    </span>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Date & Time</span>
                    <span className="font-medium text-gray-900 dark:text-white">{event.date} at {event.startTime}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Location</span>
                    <span className="font-medium text-gray-900 dark:text-white">{event.location}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Participants</span>
                    <span className="font-medium text-gray-900 dark:text-white">{event.currentParticipants}/{event.maxParticipants}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Organizer</span>
                    <span className="font-medium text-gray-900 dark:text-white">{event.organizer}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{event.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs">
                    {event.registrationRequired && (
                      <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full">
                        Registration Required
                      </span>
                    )}
                    {event.fee && event.fee > 0 && (
                      <span className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-full">
                        ${event.fee}
                      </span>
                    )}
                  </div>
                  <button className="flex items-center px-3 py-1 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                    {event.registrationRequired ? 'Register' : 'Join'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'staff' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Library Staff</h2>
                <button className="flex items-center px-3 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Add Staff
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Staff Member</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Position</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Office</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Office Hours</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {staff.map((staffMember) => (
                    <tr key={staffMember.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {staffMember.firstName} {staffMember.lastName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{staffMember.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{staffMember.position}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{staffMember.department}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{staffMember.office}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{staffMember.officeHours}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(staffMember.status)}`}>
                          {staffMember.status}
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

      {/* Book Detail Modal */}
      {selectedBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Book Details</h3>
                <button
                  onClick={() => setSelectedBook(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{selectedBook.title}</h4>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedBook.status)}`}>
                  {selectedBook.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Author</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedBook.author}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">ISBN</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedBook.isbn}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Publisher</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedBook.publisher}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Publication Year</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedBook.publicationYear}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Category</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedBook.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Format</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedBook.format}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Pages</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedBook.pages}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Price</p>
                  <p className="font-medium text-gray-900 dark:text-white">${selectedBook.price.toFixed(2)}</p>
                </div>
              </div>

              <div className="mb-6">
                <h5 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Description</h5>
                <p className="text-sm text-gray-600 dark:text-gray-400">{selectedBook.description}</p>
              </div>

              <div className="mb-6">
                <h5 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Availability</h5>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Total Copies</span>
                    <span className="font-medium text-gray-900 dark:text-white">{selectedBook.totalCopies}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Available Copies</span>
                    <span className="font-medium text-gray-900 dark:text-white">{selectedBook.availableCopies}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Location</span>
                    <span className="font-medium text-gray-900 dark:text-white">{selectedBook.location}, {selectedBook.shelf}</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h5 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Keywords</h5>
                <div className="flex flex-wrap gap-2">
                  {selectedBook.keywords.map((keyword, index) => (
                    <span key={index} className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Acquired:</span> {selectedBook.acquisitionDate}
                </div>
                <div className="flex items-center space-x-2">
                  <button className="flex items-center px-4 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                    <ClipboardDocumentListIcon className="w-4 h-4 mr-2" />
                    Checkout
                  </button>
                  <button className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300">
                    <BookmarkIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Member Detail Modal */}
      {selectedMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Member Details</h3>
                <button
                  onClick={() => setSelectedMember(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {selectedMember.firstName} {selectedMember.lastName}
                </h4>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedMember.status)}`}>
                  {selectedMember.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Member ID</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedMember.memberId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Member Type</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedMember.memberType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedMember.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedMember.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Department</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedMember.department || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Student ID</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedMember.studentId || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Join Date</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedMember.joinDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Expiry Date</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedMember.expiryDate}</p>
                </div>
              </div>

              <div className="mb-6">
                <h5 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Address</h5>
                <p className="text-sm text-gray-600 dark:text-gray-400">{selectedMember.address}</p>
              </div>

              <div className="mb-6">
                <h5 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Statistics</h5>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{selectedMember.totalCheckouts}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Checkouts</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{selectedMember.currentCheckouts}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Current Checkouts</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">{selectedMember.overdueItems}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Overdue Items</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">${selectedMember.fines.toFixed(2)}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Outstanding Fines</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h5 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Preferences</h5>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Favorite Genres</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedMember.preferences.genres.map((genre, index) => (
                        <span key={index} className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Languages</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedMember.preferences.languages.map((lang, index) => (
                        <span key={index} className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Preferred Formats</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedMember.preferences.formats.map((format, index) => (
                        <span key={index} className="px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full">
                          {format}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Reserved Items:</span> {selectedMember.reservedItems}
                </div>
                <div className="flex items-center space-x-2">
                  <button className="flex items-center px-4 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                    <ClipboardDocumentListIcon className="w-4 h-4 mr-2" />
                    Checkout Book
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
