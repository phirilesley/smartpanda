import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserGroupIcon,
  CalendarIcon,
  ChartBarIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  StarIcon,
  ClockIcon,
  MapPinIcon,
  AcademicCapIcon,
  UserIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

interface LeadershipPosition {
  id: string;
  title: string;
  description: string;
  positionType: string;
  level: string;
  hierarchyOrder: number;
  responsibilities: string;
  qualifications: string;
  selectionProcess: string;
  termDuration: string;
  isActive: boolean;
}

interface StudentLeadershipAssignment {
  id: string;
  appointmentDate: string;
  endDate: string | null;
  status: string;
  appointmentType: string;
  reasonForAppointment: string;
  reasonForTermination: string | null;
  performanceRating: number | null;
  dutiesFulfilled: string;
  student: {
    id: string;
    firstName: string;
    lastName: string;
  };
  leadershipPosition: {
    id: string;
    title: string;
    positionType: string;
    level: string;
    hierarchyOrder: number;
  };
  academicYear: {
    id: string;
    name: string;
  };
  grade: {
    id: string;
    name: string;
  } | null;
  class: {
    id: string;
    name: string;
  } | null;
  appointedByStaff: {
    id: string;
    firstName: string;
    lastName: string;
  } | null;
}

interface LeadershipDuty {
  id: string;
  dutyTitle: string;
  dutyDescription: string;
  frequency: string;
  priority: string;
  estimatedTimeMinutes: number;
  isRecurring: boolean;
  isActive: boolean;
}

interface LeadershipDutyLog {
  id: string;
  dutyDate: string;
  startTime: string | null;
  endTime: string | null;
  durationMinutes: number | null;
  status: string;
  performanceNotes: string;
  supervisorRating: number | null;
  supervisorComments: string | null;
  leadershipDuty: {
    id: string;
    dutyTitle: string;
  };
  studentLeadershipAssignment: {
    id: string;
    student: {
      id: string;
      firstName: string;
      lastName: string;
    };
  };
}

const StudentLeadership: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'positions' | 'assignments' | 'prefects' | 'headStudents' | 'duties'>('overview');
  const [positions, setPositions] = useState<LeadershipPosition[]>([]);
  const [assignments, setAssignments] = useState<StudentLeadershipAssignment[]>([]);
  const [duties, setDuties] = useState<LeadershipDuty[]>([]);
  const [dutyLogs, setDutyLogs] = useState<LeadershipDutyLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Mock data for demonstration
  useEffect(() => {
    const mockPositions: LeadershipPosition[] = [
      {
        id: '1',
        title: 'Head Boy',
        description: 'Senior male student leader representing the entire school',
        positionType: 'Head Boy',
        level: 'School',
        hierarchyOrder: 1,
        responsibilities: 'Lead student body, represent school at events, coordinate prefect activities',
        qualifications: 'Excellent academic standing, leadership experience, good communication skills',
        selectionProcess: 'Application, interview, voting by students and staff',
        termDuration: 'Academic Year',
        isActive: true
      },
      {
        id: '2',
        title: 'Head Girl',
        description: 'Senior female student leader representing the entire school',
        positionType: 'Head Girl',
        level: 'School',
        hierarchyOrder: 2,
        responsibilities: 'Lead student body, represent school at events, coordinate prefect activities',
        qualifications: 'Excellent academic standing, leadership experience, good communication skills',
        selectionProcess: 'Application, interview, voting by students and staff',
        termDuration: 'Academic Year',
        isActive: true
      },
      {
        id: '3',
        title: 'Senior Prefect',
        description: 'Senior student leader with disciplinary responsibilities',
        positionType: 'Prefect',
        level: 'School',
        hierarchyOrder: 3,
        responsibilities: 'Maintain discipline, supervise junior students, assist staff',
        qualifications: 'Good academic record, responsible, trustworthy',
        selectionProcess: 'Staff recommendation, interview',
        termDuration: 'Academic Year',
        isActive: true
      },
      {
        id: '4',
        title: 'Class Monitor',
        description: 'Student leader responsible for classroom management',
        positionType: 'Class Monitor',
        level: 'Class',
        hierarchyOrder: 10,
        responsibilities: 'Maintain class discipline, assist teacher, collect assignments',
        qualifications: 'Responsible, organized, good communication',
        selectionProcess: 'Teacher nomination, class vote',
        termDuration: 'Term',
        isActive: true
      }
    ];

    const mockAssignments: StudentLeadershipAssignment[] = [
      {
        id: '1',
        appointmentDate: '2024-09-01',
        endDate: null,
        status: 'Active',
        appointmentType: 'Elected',
        reasonForAppointment: 'Excellent leadership qualities and student support',
        reasonForTermination: null,
        performanceRating: 4.5,
        dutiesFulfilled: 'Successfully organized school events, maintained discipline, represented school at conferences',
        student: { id: '1', firstName: 'James', lastName: 'Wilson' },
        leadershipPosition: { id: '1', title: 'Head Boy', positionType: 'Head Boy', level: 'School', hierarchyOrder: 1 },
        academicYear: { id: '1', name: '2024-2025' },
        grade: { id: '12', name: 'Grade 12' },
        class: { id: '1', name: '12A' },
        appointedByStaff: { id: '1', firstName: 'Mr.', lastName: 'Anderson' }
      },
      {
        id: '2',
        appointmentDate: '2024-09-01',
        endDate: null,
        status: 'Active',
        appointmentType: 'Elected',
        reasonForAppointment: 'Strong leadership skills and academic excellence',
        reasonForTermination: null,
        performanceRating: 4.8,
        dutiesFulfilled: 'Led student council, organized charity events, mentored junior students',
        student: { id: '2', firstName: 'Emma', lastName: 'Thompson' },
        leadershipPosition: { id: '2', title: 'Head Girl', positionType: 'Head Girl', level: 'School', hierarchyOrder: 2 },
        academicYear: { id: '1', name: '2024-2025' },
        grade: { id: '12', name: 'Grade 12' },
        class: { id: '2', name: '12B' },
        appointedByStaff: { id: '1', firstName: 'Mr.', lastName: 'Anderson' }
      },
      {
        id: '3',
        appointmentDate: '2024-09-01',
        endDate: null,
        status: 'Active',
        appointmentType: 'Appointed',
        reasonForAppointment: 'Excellent disciplinary record and responsibility',
        reasonForTermination: null,
        performanceRating: 4.2,
        dutiesFulfilled: 'Maintained school discipline, supervised junior students, assisted in school events',
        student: { id: '3', firstName: 'Michael', lastName: 'Brown' },
        leadershipPosition: { id: '3', title: 'Senior Prefect', positionType: 'Prefect', level: 'School', hierarchyOrder: 3 },
        academicYear: { id: '1', name: '2024-2025' },
        grade: { id: '11', name: 'Grade 11' },
        class: { id: '3', name: '11A' },
        appointedByStaff: { id: '2', firstName: 'Ms.', lastName: 'Davis' }
      }
    ];

    const mockDuties: LeadershipDuty[] = [
      {
        id: '1',
        dutyTitle: 'Morning Assembly Supervision',
        dutyDescription: 'Supervise students during morning assembly',
        frequency: 'Daily',
        priority: 'High',
        estimatedTimeMinutes: 30,
        isRecurring: true,
        isActive: true
      },
      {
        id: '2',
        dutyTitle: 'Hallway Monitoring',
        dutyDescription: 'Monitor hallways during class changes',
        frequency: 'Daily',
        priority: 'Medium',
        estimatedTimeMinutes: 15,
        isRecurring: true,
        isActive: true
      },
      {
        id: '3',
        dutyTitle: 'Event Organization',
        dutyDescription: 'Plan and organize school events',
        frequency: 'Monthly',
        priority: 'High',
        estimatedTimeMinutes: 120,
        isRecurring: true,
        isActive: true
      }
    ];

    const mockDutyLogs: LeadershipDutyLog[] = [
      {
        id: '1',
        dutyDate: '2024-03-15',
        startTime: '08:00',
        endTime: '08:30',
        durationMinutes: 30,
        status: 'Completed',
        performanceNotes: 'Successfully supervised assembly, maintained order',
        supervisorRating: 4.5,
        supervisorComments: 'Excellent performance',
        leadershipDuty: { id: '1', dutyTitle: 'Morning Assembly Supervision' },
        studentLeadershipAssignment: { 
          id: '1', 
          student: { id: '1', firstName: 'James', lastName: 'Wilson' }
        }
      },
      {
        id: '2',
        dutyDate: '2024-03-15',
        startTime: '09:15',
        endTime: '09:30',
        durationMinutes: 15,
        status: 'Completed',
        performanceNotes: 'Monitored hallways effectively',
        supervisorRating: 4.0,
        supervisorComments: 'Good performance',
        leadershipDuty: { id: '2', dutyTitle: 'Hallway Monitoring' },
        studentLeadershipAssignment: { 
          id: '3', 
          student: { id: '3', firstName: 'Michael', lastName: 'Brown' }
        }
      }
    ];

    setPositions(mockPositions);
    setAssignments(mockAssignments);
    setDuties(mockDuties);
    setDutyLogs(mockDutyLogs);
    setLoading(false);
  }, []);

  const filteredPositions = positions.filter(position => 
    position.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    position.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAssignments = assignments.filter(assignment => 
    assignment.student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.leadershipPosition.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDuties = duties.filter(duty => 
    duty.dutyTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    duty.dutyDescription.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDutyLogs = dutyLogs.filter(log => 
    log.studentLeadershipAssignment.student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.studentLeadershipAssignment.student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.leadershipDuty.dutyTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string, type: string) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;
    
    try {
      // API call would go here
      toast.success(`${type} deleted successfully`);
    } catch (error) {
      toast.error(`Failed to delete ${type}`);
    }
  };

  const handleEdit = (item: any) => {
    setSelectedItem(item);
    setShowEditModal(true);
  };

  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Positions</p>
            <p className="text-2xl font-bold text-gray-900">{positions.length}</p>
          </div>
          <UserIcon className="h-8 w-8 text-blue-500" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg shadow p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Active Leaders</p>
            <p className="text-2xl font-bold text-gray-900">{assignments.filter(a => a.status === 'Active').length}</p>
          </div>
          <UserGroupIcon className="h-8 w-8 text-green-500" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg shadow p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Completed Duties</p>
            <p className="text-2xl font-bold text-gray-900">{dutyLogs.filter(d => d.status === 'Completed').length}</p>
          </div>
          <CheckCircleIcon className="h-8 w-8 text-purple-500" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-lg shadow p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Avg Performance</p>
            <p className="text-2xl font-bold text-gray-900">
              {assignments.length > 0 ? (assignments.reduce((sum, a) => sum + (a.performanceRating || 0), 0) / assignments.length).toFixed(1) : '0'}
            </p>
          </div>
          <StarIcon className="h-8 w-8 text-yellow-500" />
        </div>
      </motion.div>

      {/* Current Leaders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="col-span-full bg-white rounded-lg shadow p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Student Leaders</h3>
        <div className="space-y-3">
          {assignments.filter(a => a.status === 'Active').slice(0, 5).map((assignment) => (
            <div key={assignment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <UserIcon className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {assignment.student.firstName} {assignment.student.lastName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {assignment.leadershipPosition.title} • {assignment.grade?.name}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-900">{assignment.performanceRating || 0}/5.0</p>
                <p className="text-xs text-gray-500">Performance</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );

  const renderPositions = () => (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Leadership Positions</h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search positions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Position
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {filteredPositions.map((position) => (
          <motion.div
            key={position.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{position.title}</h3>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                position.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {position.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            
            <div className="space-y-2 text-sm text-gray-600">
              <p><span className="font-medium">Type:</span> {position.positionType}</p>
              <p><span className="font-medium">Level:</span> {position.level}</p>
              <p><span className="font-medium">Hierarchy:</span> #{position.hierarchyOrder}</p>
              <p><span className="font-medium">Term:</span> {position.termDuration}</p>
              {position.responsibilities && (
                <div>
                  <p className="font-medium">Responsibilities:</p>
                  <p className="text-xs">{position.responsibilities}</p>
                </div>
              )}
              {position.qualifications && (
                <div>
                  <p className="font-medium">Qualifications:</p>
                  <p className="text-xs">{position.qualifications}</p>
                </div>
              )}
            </div>

            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => handleEdit(position)}
                className="text-blue-600 hover:text-blue-900"
              >
                <PencilIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(position.id, 'position')}
                className="text-red-600 hover:text-red-900"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderAssignments = () => (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Leadership Assignments</h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search assignments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Assign Leader
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Appointment</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <AnimatePresence>
              {filteredAssignments.map((assignment) => (
                <motion.tr
                  key={assignment.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {assignment.student.firstName[0]}{assignment.student.lastName[0]}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {assignment.student.firstName} {assignment.student.lastName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{assignment.leadershipPosition.title}</div>
                      <div className="text-sm text-gray-500">{assignment.leadershipPosition.level}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {assignment.grade?.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900">{assignment.appointmentDate}</div>
                      <div className="text-sm text-gray-500">{assignment.appointmentType}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {assignment.performanceRating ? (
                      <div className="flex items-center">
                        <span className="text-sm text-gray-900">{assignment.performanceRating}/5.0</span>
                        <div className="ml-2 flex">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(assignment.performanceRating!)
                                  ? 'text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">Not rated</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      assignment.status === 'Active' ? 'bg-green-100 text-green-800' :
                      assignment.status === 'Inactive' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {assignment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(assignment)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(assignment.id, 'assignment')}
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPrefects = () => {
    const prefectAssignments = assignments.filter(a => 
      a.leadershipPosition.positionType.includes('Prefect') && a.status === 'Active'
    );

    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Prefects</h2>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search prefects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Assign Prefect
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {prefectAssignments.map((assignment) => (
            <motion.div
              key={assignment.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {assignment.student.firstName} {assignment.student.lastName}
                </h3>
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                  {assignment.leadershipPosition.title}
                </span>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <p><span className="font-medium">Grade:</span> {assignment.grade?.name}</p>
                <p><span className="font-medium">Class:</span> {assignment.class?.name}</p>
                <p><span className="font-medium">Appointment:</span> {assignment.appointmentDate}</p>
                {assignment.performanceRating && (
                  <div className="flex items-center">
                    <span className="font-medium">Performance:</span>
                    <div className="ml-2 flex">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(assignment.performanceRating!)
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-1">{assignment.performanceRating}/5.0</span>
                  </div>
                )}
                {assignment.dutiesFulfilled && (
                  <div>
                    <p className="font-medium">Duties Fulfilled:</p>
                    <p className="text-xs">{assignment.dutiesFulfilled}</p>
                  </div>
                )}
              </div>

              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={() => handleEdit(assignment)}
                  className="text-blue-600 hover:text-blue-900"
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(assignment.id, 'prefect assignment')}
                  className="text-red-600 hover:text-red-900"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  const renderHeadStudents = () => {
    const headStudentAssignments = assignments.filter(a => 
      (a.leadershipPosition.positionType.includes('Head Boy') || a.leadershipPosition.positionType.includes('Head Girl')) && 
      a.status === 'Active'
    );

    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Head Students</h2>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search head students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Assign Head Student
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          {headStudentAssignments.map((assignment) => (
            <motion.div
              key={assignment.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {assignment.student.firstName} {assignment.student.lastName}
                </h3>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  assignment.leadershipPosition.positionType.includes('Head Boy') 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-pink-100 text-pink-800'
                }`}>
                  {assignment.leadershipPosition.title}
                </span>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <p><span className="font-medium">Grade:</span> {assignment.grade?.name}</p>
                <p><span className="font-medium">Class:</span> {assignment.class?.name}</p>
                <p><span className="font-medium">Appointment:</span> {assignment.appointmentDate}</p>
                <p><span className="font-medium">Type:</span> {assignment.appointmentType}</p>
                {assignment.reasonForAppointment && (
                  <div>
                    <p className="font-medium">Reason for Appointment:</p>
                    <p className="text-xs">{assignment.reasonForAppointment}</p>
                  </div>
                )}
                {assignment.performanceRating && (
                  <div className="flex items-center">
                    <span className="font-medium">Performance:</span>
                    <div className="ml-2 flex">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(assignment.performanceRating!)
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-1">{assignment.performanceRating}/5.0</span>
                  </div>
                )}
                {assignment.dutiesFulfilled && (
                  <div>
                    <p className="font-medium">Key Achievements:</p>
                    <p className="text-xs">{assignment.dutiesFulfilled}</p>
                  </div>
                )}
              </div>

              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={() => handleEdit(assignment)}
                  className="text-blue-600 hover:text-blue-900"
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(assignment.id, 'head student assignment')}
                  className="text-red-600 hover:text-red-900"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  const renderDuties = () => (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Leadership Duties</h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search duties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Duty
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Duties List */}
        <div className="p-6 border-r border-gray-200">
          <h3 className="text-md font-semibold text-gray-900 mb-4">Defined Duties</h3>
          <div className="space-y-3">
            {filteredDuties.map((duty) => (
              <motion.div
                key={duty.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gray-50 rounded-lg p-4 border border-gray-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{duty.dutyTitle}</h4>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    duty.priority === 'High' ? 'bg-red-100 text-red-800' :
                    duty.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {duty.priority}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{duty.dutyDescription}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{duty.frequency} • {duty.estimatedTimeMinutes}min</span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(duty)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <PencilIcon className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => handleDelete(duty.id, 'duty')}
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Duty Logs */}
        <div className="p-6">
          <h3 className="text-md font-semibold text-gray-900 mb-4">Recent Duty Logs</h3>
          <div className="space-y-3">
            {filteredDutyLogs.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gray-50 rounded-lg p-4 border border-gray-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{log.leadershipDuty.dutyTitle}</h4>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    log.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    log.status === 'Incomplete' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {log.status}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  <p>Student: {log.studentLeadershipAssignment.student.firstName} {log.studentLeadershipAssignment.student.lastName}</p>
                  <p>Date: {log.dutyDate} {log.startTime && `at ${log.startTime}`}</p>
                  {log.durationMinutes && <p>Duration: {log.durationMinutes} minutes</p>}
                </div>
                {log.performanceNotes && (
                  <p className="text-xs text-gray-500 mb-1">{log.performanceNotes}</p>
                )}
                {log.supervisorRating && (
                  <div className="flex items-center text-xs text-gray-500">
                    <span className="mr-2">Supervisor Rating:</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`h-3 w-3 ${
                            i < Math.floor(log.supervisorRating!)
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-1">{log.supervisorRating}/5.0</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Student Leadership</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => window.location.reload()}
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            <ChartBarIcon className="h-5 w-5 mr-2" />
            Dashboard
          </button>
        </div>
      </div>

      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { key: 'overview', label: 'Overview', icon: ChartBarIcon },
            { key: 'positions', label: 'Positions', icon: UserIcon },
            { key: 'assignments', label: 'Assignments', icon: UserGroupIcon },
            { key: 'prefects', label: 'Prefects', icon: AcademicCapIcon },
            { key: 'headStudents', label: 'Head Students', icon: StarIcon },
            { key: 'duties', label: 'Duties', icon: CheckCircleIcon }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center px-1 py-4 border-b-2 text-sm font-medium ${
                activeTab === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-5 w-5 mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'positions' && renderPositions()}
          {activeTab === 'assignments' && renderAssignments()}
          {activeTab === 'prefects' && renderPrefects()}
          {activeTab === 'headStudents' && renderHeadStudents()}
          {activeTab === 'duties' && renderDuties()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default StudentLeadership;
