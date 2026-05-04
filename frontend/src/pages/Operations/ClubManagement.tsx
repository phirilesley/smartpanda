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
  BuildingLibraryIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

interface ClubCategory {
  id: string;
  name: string;
  description: string;
  code: string;
  isActive: boolean;
}

interface Club {
  id: string;
  name: string;
  description: string;
  code: string;
  missionStatement: string;
  objectives: string;
  meetingSchedule: string;
  meetingLocation: string;
  maxMembers: number;
  currentMembers: number;
  membershipFee: number;
  clubCategory: {
    id: string;
    name: string;
  };
  academicYear: {
    id: string;
    name: string;
  };
  advisorStaff: {
    id: string;
    firstName: string;
    lastName: string;
  } | null;
  coAdvisorStaff: {
    id: string;
    firstName: string;
    lastName: string;
  } | null;
  isActive: boolean;
}

interface ClubMember {
  id: string;
  memberType: string;
  position: string;
  joinDate: string;
  status: string;
  membershipFeePaid: boolean;
  membershipFeeAmount: number;
  attendanceRate: number;
  contribution: string;
  student: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

interface ClubMeeting {
  id: string;
  title: string;
  description: string;
  meetingDate: string;
  startTime: string;
  endTime: string | null;
  location: string;
  meetingType: string;
  agenda: string;
  attendanceCount: number;
  status: string;
}

interface ClubActivity {
  id: string;
  title: string;
  description: string;
  activityType: string;
  startDate: string;
  endDate: string | null;
  location: string;
  budget: number;
  actualCost: number;
  participantsCount: number;
  status: string;
  outcome: string;
}

const ClubManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'clubs' | 'members' | 'meetings' | 'activities'>('overview');
  const [clubs, setClubs] = useState<Club[]>([]);
  const [members, setMembers] = useState<ClubMember[]>([]);
  const [meetings, setMeetings] = useState<ClubMeeting[]>([]);
  const [activities, setActivities] = useState<ClubActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Mock data for demonstration
  useEffect(() => {
    const mockClubs: Club[] = [
      {
        id: '1',
        name: 'Science Club',
        description: 'Exploring scientific concepts and experiments',
        code: 'SCI',
        missionStatement: 'To foster scientific curiosity and innovation among students',
        objectives: 'Conduct experiments, organize science fairs, promote STEM education',
        meetingSchedule: 'Every Tuesday 3:30-4:30 PM',
        meetingLocation: 'Science Lab',
        maxMembers: 30,
        currentMembers: 25,
        membershipFee: 10,
        clubCategory: { id: '1', name: 'Academic' },
        academicYear: { id: '1', name: '2024-2025' },
        advisorStaff: { id: '1', firstName: 'Dr.', lastName: 'Smith' },
        coAdvisorStaff: { id: '2', firstName: 'Ms.', lastName: 'Johnson' },
        isActive: true
      },
      {
        id: '2',
        name: 'Drama Club',
        description: 'Theatrical performances and acting skills',
        code: 'DRAMA',
        missionStatement: 'To develop theatrical skills and appreciate performing arts',
        objectives: 'Produce plays, improve acting skills, organize drama festivals',
        meetingSchedule: 'Wednesday & Friday 4:00-5:30 PM',
        meetingLocation: 'Auditorium',
        maxMembers: 25,
        currentMembers: 20,
        membershipFee: 15,
        clubCategory: { id: '2', name: 'Arts' },
        academicYear: { id: '1', name: '2024-2025' },
        advisorStaff: { id: '3', firstName: 'Mr.', lastName: 'Brown' },
        coAdvisorStaff: null,
        isActive: true
      },
      {
        id: '3',
        name: 'Debate Club',
        description: 'Public speaking and debate competitions',
        code: 'DEBATE',
        missionStatement: 'To enhance public speaking and critical thinking skills',
        objectives: 'Organize debates, improve argumentation skills, participate in competitions',
        meetingSchedule: 'Monday 4:00-5:00 PM',
        meetingLocation: 'Conference Room',
        maxMembers: 20,
        currentMembers: 18,
        membershipFee: 12,
        clubCategory: { id: '1', name: 'Academic' },
        academicYear: { id: '1', name: '2024-2025' },
        advisorStaff: { id: '4', firstName: 'Ms.', lastName: 'Davis' },
        coAdvisorStaff: null,
        isActive: true
      }
    ];

    const mockMembers: ClubMember[] = [
      {
        id: '1',
        memberType: 'President',
        position: 'Club President',
        joinDate: '2024-09-01',
        status: 'Active',
        membershipFeePaid: true,
        membershipFeeAmount: 10,
        attendanceRate: 95.5,
        contribution: 'Excellent leadership and organization',
        student: { id: '1', firstName: 'Alice', lastName: 'Johnson' }
      },
      {
        id: '2',
        memberType: 'Member',
        position: 'Regular Member',
        joinDate: '2024-09-01',
        status: 'Active',
        membershipFeePaid: true,
        membershipFeeAmount: 10,
        attendanceRate: 88.0,
        contribution: 'Active participant in experiments',
        student: { id: '2', firstName: 'Bob', lastName: 'Smith' }
      },
      {
        id: '3',
        memberType: 'Secretary',
        position: 'Club Secretary',
        joinDate: '2024-09-01',
        status: 'Active',
        membershipFeePaid: true,
        membershipFeeAmount: 10,
        attendanceRate: 92.0,
        contribution: 'Excellent record keeping and communication',
        student: { id: '3', firstName: 'Carol', lastName: 'Williams' }
      }
    ];

    const mockMeetings: ClubMeeting[] = [
      {
        id: '1',
        title: 'Weekly Meeting',
        description: 'Regular weekly meeting to discuss club activities',
        meetingDate: '2024-03-15',
        startTime: '15:30',
        endTime: '16:30',
        location: 'Science Lab',
        meetingType: 'Regular',
        agenda: '1. Review previous experiments\n2. Plan upcoming science fair\n3. Discuss new project ideas',
        attendanceCount: 22,
        status: 'Completed'
      },
      {
        id: '2',
        title: 'Science Fair Planning',
        description: 'Special meeting to plan annual science fair',
        meetingDate: '2024-03-20',
        startTime: '16:00',
        endTime: '17:30',
        location: 'Conference Room',
        meetingType: 'Special',
        agenda: '1. Finalize science fair date\n2. Assign responsibilities\n3. Budget discussion',
        attendanceCount: 25,
        status: 'Scheduled'
      }
    ];

    const mockActivities: ClubActivity[] = [
      {
        id: '1',
        title: 'Science Exhibition',
        description: 'Annual science fair showcasing student projects',
        activityType: 'Event',
        startDate: '2024-04-15',
        endDate: '2024-04-16',
        location: 'School Auditorium',
        budget: 500,
        actualCost: 450,
        participantsCount: 30,
        status: 'Completed',
        outcome: 'Successful event with 150+ attendees'
      },
      {
        id: '2',
        title: 'Community Service',
        description: 'Teaching science concepts to elementary students',
        activityType: 'Community Service',
        startDate: '2024-03-25',
        endDate: null,
        location: 'Local Elementary School',
        budget: 100,
        actualCost: 85,
        participantsCount: 15,
        status: 'InProgress',
        outcome: ''
      }
    ];

    setClubs(mockClubs);
    setMembers(mockMembers);
    setMeetings(mockMeetings);
    setActivities(mockActivities);
    setLoading(false);
  }, []);

  const filteredClubs = clubs.filter(club => 
    club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    club.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMembers = members.filter(member => 
    member.student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMeetings = meetings.filter(meeting => 
    meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    meeting.meetingType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredActivities = activities.filter(activity => 
    activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.activityType.toLowerCase().includes(searchTerm.toLowerCase())
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
            <p className="text-sm text-gray-600">Total Clubs</p>
            <p className="text-2xl font-bold text-gray-900">{clubs.length}</p>
          </div>
          <BuildingLibraryIcon className="h-8 w-8 text-blue-500" />
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
            <p className="text-sm text-gray-600">Total Members</p>
            <p className="text-2xl font-bold text-gray-900">{members.length}</p>
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
            <p className="text-sm text-gray-600">Upcoming Meetings</p>
            <p className="text-2xl font-bold text-gray-900">{meetings.filter(m => m.status === 'Scheduled').length}</p>
          </div>
          <CalendarIcon className="h-8 w-8 text-purple-500" />
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
            <p className="text-sm text-gray-600">Active Activities</p>
            <p className="text-2xl font-bold text-gray-900">{activities.filter(a => a.status === 'InProgress').length}</p>
          </div>
          <StarIcon className="h-8 w-8 text-yellow-500" />
        </div>
      </motion.div>

      {/* Popular Clubs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="col-span-full bg-white rounded-lg shadow p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Clubs</h3>
        <div className="space-y-3">
          {clubs.slice(0, 5).map((club) => (
            <div key={club.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <BuildingLibraryIcon className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{club.name}</p>
                  <p className="text-xs text-gray-500">{club.clubCategory.name} • {club.currentMembers}/{club.maxMembers} members</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-900">{club.currentMembers} members</p>
                <p className="text-xs text-gray-500">{club.meetingSchedule}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );

  const renderClubs = () => (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Clubs</h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search clubs..."
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
              Add Club
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {filteredClubs.map((club) => (
          <motion.div
            key={club.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{club.name}</h3>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                club.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {club.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            
            <div className="space-y-2 text-sm text-gray-600">
              <p><span className="font-medium">Category:</span> {club.clubCategory.name}</p>
              <p><span className="font-medium">Members:</span> {club.currentMembers}/{club.maxMembers}</p>
              <p><span className="font-medium">Meeting:</span> {club.meetingSchedule}</p>
              <div className="flex items-center">
                <MapPinIcon className="h-4 w-4 mr-1" />
                {club.meetingLocation}
              </div>
              {club.advisorStaff && (
                <p><span className="font-medium">Advisor:</span> {club.advisorStaff.firstName} {club.advisorStaff.lastName}</p>
              )}
              {club.membershipFee > 0 && (
                <p><span className="font-medium">Fee:</span> ${club.membershipFee}</p>
              )}
            </div>

            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => handleEdit(club)}
                className="text-blue-600 hover:text-blue-900"
              >
                <PencilIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(club.id, 'club')}
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

  const renderMembers = () => (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Club Members</h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search members..."
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
              Add Member
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <AnimatePresence>
              {filteredMembers.map((member) => (
                <motion.tr
                  key={member.id}
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
                            {member.student.firstName[0]}{member.student.lastName[0]}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {member.student.firstName} {member.student.lastName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.position}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      member.memberType === 'President' ? 'bg-purple-100 text-purple-800' :
                      member.memberType === 'Secretary' ? 'bg-blue-100 text-blue-800' :
                      member.memberType === 'Treasurer' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {member.memberType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.joinDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm text-gray-900">{member.attendanceRate}%</div>
                      <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${member.attendanceRate}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      member.status === 'Active' ? 'bg-green-100 text-green-800' :
                      member.status === 'Inactive' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {member.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(member)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(member.id, 'member')}
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

  const renderMeetings = () => (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Club Meetings</h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search meetings..."
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
              Schedule Meeting
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {filteredMeetings.map((meeting) => (
          <motion.div
            key={meeting.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{meeting.title}</h3>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                meeting.status === 'Completed' ? 'bg-green-100 text-green-800' :
                meeting.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {meeting.status}
              </span>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <p><span className="font-medium">Type:</span> {meeting.meetingType}</p>
              <div className="flex items-center">
                <CalendarIcon className="h-4 w-4 mr-1" />
                {meeting.meetingDate} at {meeting.startTime}
              </div>
              <div className="flex items-center">
                <MapPinIcon className="h-4 w-4 mr-1" />
                {meeting.location}
              </div>
              <p><span className="font-medium">Attendance:</span> {meeting.attendanceCount} participants</p>
              {meeting.agenda && (
                <div>
                  <p className="font-medium">Agenda:</p>
                  <p className="text-xs whitespace-pre-line">{meeting.agenda}</p>
                </div>
              )}
            </div>

            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => handleEdit(meeting)}
                className="text-blue-600 hover:text-blue-900"
              >
                <PencilIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(meeting.id, 'meeting')}
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

  const renderActivities = () => (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Club Activities</h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search activities..."
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
              Add Activity
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participants</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <AnimatePresence>
              {filteredActivities.map((activity) => (
                <motion.tr
                  key={activity.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{activity.title}</div>
                      <div className="text-sm text-gray-500">{activity.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      activity.activityType === 'Event' ? 'bg-purple-100 text-purple-800' :
                      activity.activityType === 'Community Service' ? 'bg-green-100 text-green-800' :
                      activity.activityType === 'Competition' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {activity.activityType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {activity.startDate} {activity.endDate && `- ${activity.endDate}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${activity.actualCost} / ${activity.budget}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {activity.participantsCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      activity.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      activity.status === 'InProgress' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {activity.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(activity)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(activity.id, 'activity')}
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
        <h1 className="text-2xl font-bold text-gray-900">Club Management</h1>
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
            { key: 'clubs', label: 'Clubs', icon: BuildingLibraryIcon },
            { key: 'members', label: 'Members', icon: UserGroupIcon },
            { key: 'meetings', label: 'Meetings', icon: CalendarIcon },
            { key: 'activities', label: 'Activities', icon: StarIcon }
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
          {activeTab === 'clubs' && renderClubs()}
          {activeTab === 'members' && renderMembers()}
          {activeTab === 'meetings' && renderMeetings()}
          {activeTab === 'activities' && renderActivities()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ClubManagement;
