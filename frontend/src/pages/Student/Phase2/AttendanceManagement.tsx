import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CalendarDaysIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  UserGroupIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  DocumentArrowDownIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

// Types
interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  studentNumber: string;
  grade: string;
  stream: string;
  date: string;
  status: 'Present' | 'Absent' | 'Late' | 'Excused' | 'Sick';
  checkInTime?: string;
  checkOutTime?: string;
  markedBy: string;
  markedByRole: string;
  notes?: string;
  period?: string;
  subject?: string;
  teacherId?: string;
  teacherName?: string;
  isLateArrival: boolean;
  isEarlyDeparture: boolean;
  excusedBy?: string;
  excusedReason?: string;
  medicalCertificate?: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AttendanceSummary {
  date: string;
  totalStudents: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
  sick: number;
  attendanceRate: number;
  grade: string;
  stream?: string;
}

interface AttendancePattern {
  studentId: string;
  studentName: string;
  studentNumber: string;
  grade: string;
  stream: string;
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  excusedDays: number;
  sickDays: number;
  attendanceRate: number;
  consecutiveAbsent: number;
  consecutiveLate: number;
  pattern: 'Excellent' | 'Good' | 'Concerning' | 'Critical';
}

export const AttendanceManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'records' | 'summary' | 'patterns' | 'mark'>('records');
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [attendanceSummary, setAttendanceSummary] = useState<AttendanceSummary[]>([]);
  const [attendancePatterns, setAttendancePatterns] = useState<AttendancePattern[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [filterGrade, setFilterGrade] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showMarkModal, setShowMarkModal] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [bulkStatus, setBulkStatus] = useState<string>('Present');

  // Mock data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock attendance records
      const mockRecords: AttendanceRecord[] = [
        {
          id: 'att-001',
          studentId: 'student-001',
          studentName: 'John Smith',
          studentNumber: 'STU2024001',
          grade: 'Form 1',
          stream: 'A',
          date: '2024-01-20',
          status: 'Present',
          checkInTime: '07:45',
          checkOutTime: '16:30',
          markedBy: 'Mrs. Johnson',
          markedByRole: 'Teacher',
          period: 'Period 1',
          subject: 'Mathematics',
          teacherId: 'teacher-001',
          teacherName: 'Mrs. Johnson',
          isLateArrival: false,
          isEarlyDeparture: false,
          createdAt: '2024-01-20T07:45:00Z',
          updatedAt: '2024-01-20T07:45:00Z',
        },
        {
          id: 'att-002',
          studentId: 'student-002',
          studentName: 'Sarah Johnson',
          studentNumber: 'STU2024002',
          grade: 'Form 2',
          stream: 'B',
          date: '2024-01-20',
          status: 'Late',
          checkInTime: '08:15',
          checkOutTime: '16:30',
          markedBy: 'Mr. Smith',
          markedByRole: 'Teacher',
          period: 'Period 1',
          subject: 'English',
          teacherId: 'teacher-002',
          teacherName: 'Mr. Smith',
          isLateArrival: true,
          isEarlyDeparture: false,
          createdAt: '2024-01-20T08:15:00Z',
          updatedAt: '2024-01-20T08:15:00Z',
        },
        {
          id: 'att-003',
          studentId: 'student-003',
          studentName: 'Michael Brown',
          studentNumber: 'STU2024003',
          grade: 'Form 1',
          stream: 'C',
          date: '2024-01-20',
          status: 'Absent',
          markedBy: 'Mrs. Davis',
          markedByRole: 'Teacher',
          period: 'Period 1',
          subject: 'Science',
          teacherId: 'teacher-003',
          teacherName: 'Mrs. Davis',
          isLateArrival: false,
          isEarlyDeparture: false,
          createdAt: '2024-01-20T08:00:00Z',
          updatedAt: '2024-01-20T08:00:00Z',
        },
        {
          id: 'att-004',
          studentId: 'student-004',
          studentName: 'Emily Wilson',
          studentNumber: 'STU2024004',
          grade: 'Form 3',
          stream: 'A',
          date: '2024-01-20',
          status: 'Sick',
          checkInTime: undefined,
          checkOutTime: undefined,
          markedBy: 'Mrs. Johnson',
          markedByRole: 'Teacher',
          period: 'Period 1',
          subject: 'Mathematics',
          teacherId: 'teacher-001',
          teacherName: 'Mrs. Johnson',
          isLateArrival: false,
          isEarlyDeparture: false,
          excusedBy: 'Dr. Brown',
          excusedReason: 'Medical appointment',
          medicalCertificate: true,
          createdAt: '2024-01-20T08:00:00Z',
          updatedAt: '2024-01-20T08:00:00Z',
        },
      ];

      // Mock attendance summary
      const mockSummary: AttendanceSummary[] = [
        {
          date: '2024-01-20',
          totalStudents: 245,
          present: 220,
          absent: 15,
          late: 8,
          excused: 2,
          sick: 0,
          attendanceRate: 89.8,
          grade: 'All Grades',
        },
        {
          date: '2024-01-20',
          totalStudents: 40,
          present: 38,
          absent: 1,
          late: 1,
          excused: 0,
          sick: 0,
          attendanceRate: 95.0,
          grade: 'Form 1',
          stream: 'A',
        },
        {
          date: '2024-01-20',
          totalStudents: 35,
          present: 30,
          absent: 3,
          late: 2,
          excused: 0,
          sick: 0,
          attendanceRate: 85.7,
          grade: 'Form 2',
          stream: 'B',
        },
      ];

      // Mock attendance patterns
      const mockPatterns: AttendancePattern[] = [
        {
          studentId: 'student-001',
          studentName: 'John Smith',
          studentNumber: 'STU2024001',
          grade: 'Form 1',
          stream: 'A',
          totalDays: 20,
          presentDays: 19,
          absentDays: 0,
          lateDays: 1,
          excusedDays: 0,
          sickDays: 0,
          attendanceRate: 95.0,
          consecutiveAbsent: 0,
          consecutiveLate: 0,
          pattern: 'Excellent',
        },
        {
          studentId: 'student-002',
          studentName: 'Sarah Johnson',
          studentNumber: 'STU2024002',
          grade: 'Form 2',
          stream: 'B',
          totalDays: 20,
          presentDays: 16,
          absentDays: 2,
          lateDays: 2,
          excusedDays: 0,
          sickDays: 0,
          attendanceRate: 80.0,
          consecutiveAbsent: 0,
          consecutiveLate: 1,
          pattern: 'Good',
        },
        {
          studentId: 'student-003',
          studentName: 'Michael Brown',
          studentNumber: 'STU2024003',
          grade: 'Form 1',
          stream: 'C',
          totalDays: 20,
          presentDays: 12,
          absentDays: 5,
          lateDays: 3,
          excusedDays: 0,
          sickDays: 0,
          attendanceRate: 60.0,
          consecutiveAbsent: 2,
          consecutiveLate: 0,
          pattern: 'Critical',
        },
      ];
      
      setAttendanceRecords(mockRecords);
      setAttendanceSummary(mockSummary);
      setAttendancePatterns(mockPatterns);
      setLoading(false);
    };

    loadData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Present':
        return 'text-success-600 bg-success-100';
      case 'Absent':
        return 'text-error-600 bg-error-100';
      case 'Late':
        return 'text-warning-600 bg-warning-100';
      case 'Excused':
        return 'text-blue-600 bg-blue-100';
      case 'Sick':
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getPatternColor = (pattern: string) => {
    switch (pattern) {
      case 'Excellent':
        return 'text-green-600 bg-green-100';
      case 'Good':
        return 'text-blue-600 bg-blue-100';
      case 'Concerning':
        return 'text-yellow-600 bg-yellow-100';
      case 'Critical':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredRecords = attendanceRecords.filter(record => {
    const matchesSearch = record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.studentNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = record.date === filterDate;
    const matchesGrade = filterGrade === 'all' || record.grade === filterGrade;
    const matchesStatus = filterStatus === 'all' || record.status === filterStatus;
    return matchesSearch && matchesDate && matchesGrade && matchesStatus;
  });

  const handleBulkMarkAttendance = () => {
    // In real app, this would call API
    console.log('Marking attendance for students:', selectedStudents, 'with status:', bulkStatus);
    setSelectedStudents([]);
    setShowMarkModal(false);
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
              Attendance Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Track and manage student attendance patterns
            </p>
          </div>
          <div className="flex gap-3">
            <button className="btn btn-secondary">
              <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
              Export Report
            </button>
            {activeTab === 'mark' && (
              <button
                onClick={() => setShowMarkModal(true)}
                className="btn btn-primary"
                disabled={selectedStudents.length === 0}
              >
                <CheckCircleIcon className="w-4 h-4 mr-2" />
                Mark Attendance ({selectedStudents.length})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="flex space-x-8">
          {[
            { id: 'records', label: 'Attendance Records', icon: CalendarDaysIcon },
            { id: 'summary', label: 'Daily Summary', icon: UserGroupIcon },
            { id: 'patterns', label: 'Attendance Patterns', icon: ClockIcon },
            { id: 'mark', label: 'Mark Attendance', icon: CheckCircleIcon },
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

      {/* Filters and Search */}
      <div className="card mb-6">
        <div className="card-body">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="form-input"
              />
              <select
                value={filterGrade}
                onChange={(e) => setFilterGrade(e.target.value)}
                className="form-input"
              >
                <option value="all">All Grades</option>
                <option value="Form 1">Form 1</option>
                <option value="Form 2">Form 2</option>
                <option value="Form 3">Form 3</option>
                <option value="Form 4">Form 4</option>
                <option value="Form 5">Form 5</option>
                <option value="Form 6">Form 6</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="form-input"
              >
                <option value="all">All Status</option>
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
                <option value="Late">Late</option>
                <option value="Excused">Excused</option>
                <option value="Sick">Sick</option>
              </select>
              <button className="btn btn-secondary">
                <FunnelIcon className="w-4 h-4 mr-2" />
                Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'records' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecords.map((record, index) => (
            <motion.div
              key={record.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card card-hover"
            >
              <div className="card-body">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {record.studentName}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {record.studentNumber} • {record.grade} - {record.stream}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(record.status)}`}>
                    {record.status}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Date</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {new Date(record.date).toLocaleDateString()}
                    </span>
                  </div>

                  {record.checkInTime && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Check In</span>
                      <span className="text-sm text-gray-500 dark:text-gray-500">
                        {record.checkInTime}
                      </span>
                    </div>
                  )}

                  {record.checkOutTime && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Check Out</span>
                      <span className="text-sm text-gray-500 dark:text-gray-500">
                        {record.checkOutTime}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Period</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {record.period} - {record.subject}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Marked By</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {record.markedBy}
                    </span>
                  </div>

                  {record.isLateArrival && (
                    <div className="flex items-center text-yellow-600">
                      <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                      <span className="text-sm">Late Arrival</span>
                    </div>
                  )}

                  {record.isEarlyDeparture && (
                    <div className="flex items-center text-orange-600">
                      <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                      <span className="text-sm">Early Departure</span>
                    </div>
                  )}

                  {record.excusedReason && (
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Reason:</span> {record.excusedReason}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex gap-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'summary' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {attendanceSummary.map((summary, index) => (
            <motion.div
              key={`${summary.date}-${summary.grade}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card card-hover"
            >
              <div className="card-body">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {summary.grade}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {summary.stream && `${summary.stream} • `}{new Date(summary.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary-600">
                      {summary.attendanceRate.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-500">Attendance Rate</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Total Students</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {summary.totalStudents}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Present</span>
                    <span className="text-sm font-medium text-green-600">
                      {summary.present}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Absent</span>
                    <span className="text-sm font-medium text-red-600">
                      {summary.absent}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Late</span>
                    <span className="text-sm font-medium text-yellow-600">
                      {summary.late}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Excused</span>
                    <span className="text-sm font-medium text-blue-600">
                      {summary.excused}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Sick</span>
                    <span className="text-sm font-medium text-purple-600">
                      {summary.sick}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full"
                      style={{ width: `${summary.attendanceRate}%` }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'patterns' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {attendancePatterns.map((pattern, index) => (
            <motion.div
              key={pattern.studentId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card card-hover"
            >
              <div className="card-body">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {pattern.studentName}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {pattern.studentNumber} • {pattern.grade} - {pattern.stream}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${getPatternColor(pattern.pattern)}`}>
                    {pattern.pattern}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Attendance Rate</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {pattern.attendanceRate.toFixed(1)}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Total Days</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {pattern.totalDays}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Present</span>
                    <span className="text-sm font-medium text-green-600">
                      {pattern.presentDays}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Absent</span>
                    <span className="text-sm font-medium text-red-600">
                      {pattern.absentDays}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Late</span>
                    <span className="text-sm font-medium text-yellow-600">
                      {pattern.lateDays}
                    </span>
                  </div>

                  {(pattern.consecutiveAbsent > 0 || pattern.consecutiveLate > 0) && (
                    <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                      {pattern.consecutiveAbsent > 0 && (
                        <div className="text-sm text-yellow-800 dark:text-yellow-200">
                          {pattern.consecutiveAbsent} consecutive absent days
                        </div>
                      )}
                      {pattern.consecutiveLate > 0 && (
                        <div className="text-sm text-yellow-800 dark:text-yellow-200">
                          {pattern.consecutiveLate} consecutive late days
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full"
                      style={{ width: `${pattern.attendanceRate}%` }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'mark' && (
        <div className="card">
          <div className="card-body">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Mark Attendance - {new Date(filterDate).toLocaleDateString()}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Select students and mark their attendance status
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { id: 'student-001', name: 'John Smith', number: 'STU2024001', grade: 'Form 1', stream: 'A' },
                { id: 'student-002', name: 'Sarah Johnson', number: 'STU2024002', grade: 'Form 2', stream: 'B' },
                { id: 'student-003', name: 'Michael Brown', number: 'STU2024003', grade: 'Form 1', stream: 'C' },
                { id: 'student-004', name: 'Emily Wilson', number: 'STU2024004', grade: 'Form 3', stream: 'A' },
                { id: 'student-005', name: 'James Davis', number: 'STU2024005', grade: 'Form 4', stream: 'B' },
              ].map((student) => (
                <div
                  key={student.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedStudents.includes(student.id)
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => {
                    setSelectedStudents(prev =>
                      prev.includes(student.id)
                        ? prev.filter(id => id !== student.id)
                        : [...prev, student.id]
                    );
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(student.id)}
                      onChange={() => {}}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {student.name}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {student.number} • {student.grade} - {student.stream}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {selectedStudents.length > 0 && (
              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedStudents.length} students selected
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <select
                      value={bulkStatus}
                      onChange={(e) => setBulkStatus(e.target.value)}
                      className="form-input"
                    >
                      <option value="Present">Present</option>
                      <option value="Absent">Absent</option>
                      <option value="Late">Late</option>
                      <option value="Excused">Excused</option>
                      <option value="Sick">Sick</option>
                    </select>
                    <button
                      onClick={() => setShowMarkModal(true)}
                      className="btn btn-primary"
                    >
                      <CheckCircleIcon className="w-4 h-4 mr-2" />
                      Mark Attendance
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bulk Mark Modal */}
      {showMarkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full"
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Confirm Attendance Marking
              </h2>
              
              <div className="mb-4">
                <p className="text-gray-600 dark:text-gray-400">
                  You are about to mark {selectedStudents.length} students as <span className="font-medium">{bulkStatus}</span>.
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                  This action cannot be undone.
                </p>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowMarkModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBulkMarkAttendance}
                  className="btn btn-primary"
                >
                  Confirm
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
