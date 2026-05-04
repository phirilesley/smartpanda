import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrophyIcon,
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
  MapPinIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

interface Sport {
  id: string;
  name: string;
  description: string;
  code: string;
  teamSize: number;
  isTeamSport: boolean;
  equipmentRequired: string;
  season: string;
  sportCategory: {
    id: string;
    name: string;
  };
  isActive: boolean;
}

interface SportTeam {
  id: string;
  name: string;
  description: string;
  teamType: string;
  maxMembers: number;
  currentMembers: number;
  practiceSchedule: string;
  homeVenue: string;
  sport: {
    id: string;
    name: string;
  };
  grade: {
    id: string;
    name: string;
  };
  coachStaff: {
    id: string;
    firstName: string;
    lastName: string;
  } | null;
  isActive: boolean;
}

interface SportEvent {
  id: string;
  name: string;
  description: string;
  eventType: string;
  eventDate: string;
  startTime: string;
  location: string;
  opponentTeam: string;
  homeGame: boolean;
  status: string;
  score: string;
  result: string;
  sport: {
    id: string;
    name: string;
  };
}

interface SportAchievement {
  id: string;
  title: string;
  description: string;
  achievementType: string;
  achievementDate: string;
  level: string;
  position: string;
  medal: string;
  student: {
    id: string;
    firstName: string;
    lastName: string;
  };
  sportTeam: {
    id: string;
    name: string;
  } | null;
}

const SportsManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'sports' | 'teams' | 'events' | 'achievements'>('overview');
  const [sports, setSports] = useState<Sport[]>([]);
  const [teams, setTeams] = useState<SportTeam[]>([]);
  const [events, setEvents] = useState<SportEvent[]>([]);
  const [achievements, setAchievements] = useState<SportAchievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Mock data for demonstration
  useEffect(() => {
    const mockSports: Sport[] = [
      {
        id: '1',
        name: 'Basketball',
        description: 'Team basketball sport',
        code: 'BASKET',
        teamSize: 5,
        isTeamSport: true,
        equipmentRequired: 'Basketball, jerseys, shoes',
        season: 'Winter',
        sportCategory: { id: '1', name: 'Team Sports' },
        isActive: true
      },
      {
        id: '2',
        name: 'Soccer',
        description: 'Football team sport',
        code: 'SOCCER',
        teamSize: 11,
        isTeamSport: true,
        equipmentRequired: 'Soccer ball, jerseys, cleats',
        season: 'Fall',
        sportCategory: { id: '1', name: 'Team Sports' },
        isActive: true
      },
      {
        id: '3',
        name: 'Tennis',
        description: 'Individual tennis sport',
        code: 'TENNIS',
        teamSize: 1,
        isTeamSport: false,
        equipmentRequired: 'Racket, balls, court shoes',
        season: 'Spring',
        sportCategory: { id: '2', name: 'Individual Sports' },
        isActive: true
      }
    ];

    const mockTeams: SportTeam[] = [
      {
        id: '1',
        name: 'Varsity Basketball',
        description: 'Senior basketball team',
        teamType: 'Varsity',
        maxMembers: 12,
        currentMembers: 10,
        practiceSchedule: 'Mon, Wed, Fri 4:00-6:00 PM',
        homeVenue: 'Main Gym',
        sport: { id: '1', name: 'Basketball' },
        grade: { id: '11', name: 'Grade 11-12' },
        coachStaff: { id: '1', firstName: 'John', lastName: 'Smith' },
        isActive: true
      },
      {
        id: '2',
        name: 'Junior Soccer',
        description: 'Junior soccer team',
        teamType: 'Junior Varsity',
        maxMembers: 18,
        currentMembers: 15,
        practiceSchedule: 'Tue, Thu 3:30-5:00 PM',
        homeVenue: 'Soccer Field',
        sport: { id: '2', name: 'Soccer' },
        grade: { id: '10', name: 'Grade 9-10' },
        coachStaff: { id: '2', firstName: 'Sarah', lastName: 'Johnson' },
        isActive: true
      }
    ];

    const mockEvents: SportEvent[] = [
      {
        id: '1',
        name: 'Basketball Championship',
        description: 'Regional championship game',
        eventType: 'Game',
        eventDate: '2024-03-15',
        startTime: '19:00',
        location: 'Main Gym',
        opponentTeam: 'Rival High School',
        homeGame: true,
        status: 'Scheduled',
        score: '',
        result: '',
        sport: { id: '1', name: 'Basketball' }
      },
      {
        id: '2',
        name: 'Soccer Tournament',
        description: 'Annual soccer tournament',
        eventType: 'Tournament',
        eventDate: '2024-03-20',
        startTime: '09:00',
        location: 'Sports Complex',
        opponentTeam: 'Multiple Teams',
        homeGame: false,
        status: 'Scheduled',
        score: '',
        result: '',
        sport: { id: '2', name: 'Soccer' }
      }
    ];

    const mockAchievements: SportAchievement[] = [
      {
        id: '1',
        title: 'MVP Basketball',
        description: 'Most Valuable Player in championship',
        achievementType: 'MVP',
        achievementDate: '2024-02-28',
        level: 'Regional',
        position: '1st',
        medal: 'Gold',
        student: { id: '1', firstName: 'Michael', lastName: 'Jordan' },
        sportTeam: { id: '1', name: 'Varsity Basketball' }
      },
      {
        id: '2',
        title: 'Top Scorer',
        description: 'Leading goal scorer in tournament',
        achievementType: 'Top Scorer',
        achievementDate: '2024-03-01',
        level: 'District',
        position: '1st',
        medal: 'Gold',
        student: { id: '2', firstName: 'Lionel', lastName: 'Messi' },
        sportTeam: { id: '2', name: 'Junior Soccer' }
      }
    ];

    setSports(mockSports);
    setTeams(mockTeams);
    setEvents(mockEvents);
    setAchievements(mockAchievements);
    setLoading(false);
  }, []);

  const filteredSports = sports.filter(sport => 
    sport.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sport.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTeams = teams.filter(team => 
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.sport.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredEvents = events.filter(event => 
    event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.sport.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAchievements = achievements.filter(achievement => 
    achievement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    achievement.student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    achievement.student.lastName.toLowerCase().includes(searchTerm.toLowerCase())
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
            <p className="text-sm text-gray-600">Total Sports</p>
            <p className="text-2xl font-bold text-gray-900">{sports.length}</p>
          </div>
          <TrophyIcon className="h-8 w-8 text-blue-500" />
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
            <p className="text-sm text-gray-600">Active Teams</p>
            <p className="text-2xl font-bold text-gray-900">{teams.length}</p>
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
            <p className="text-sm text-gray-600">Upcoming Events</p>
            <p className="text-2xl font-bold text-gray-900">{events.length}</p>
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
            <p className="text-sm text-gray-600">Achievements</p>
            <p className="text-2xl font-bold text-gray-900">{achievements.length}</p>
          </div>
          <StarIcon className="h-8 w-8 text-yellow-500" />
        </div>
      </motion.div>

      {/* Recent Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="col-span-full bg-white rounded-lg shadow p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Achievements</h3>
        <div className="space-y-3">
          {achievements.slice(0, 5).map((achievement) => (
            <div key={achievement.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <TrophyIcon className="h-6 w-6 text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{achievement.title}</p>
                  <p className="text-xs text-gray-500">
                    {achievement.student.firstName} {achievement.student.lastName} • {achievement.sportTeam?.name}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-900">{achievement.medal}</p>
                <p className="text-xs text-gray-500">{achievement.level}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );

  const renderSports = () => (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Sports</h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search sports..."
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
              Add Sport
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team Size</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Season</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <AnimatePresence>
              {filteredSports.map((sport) => (
                <motion.tr
                  key={sport.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{sport.name}</div>
                      <div className="text-sm text-gray-500">{sport.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {sport.sportCategory.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {sport.teamSize} {sport.isTeamSport ? '(Team)' : '(Individual)'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sport.season}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      sport.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {sport.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(sport)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(sport.id, 'sport')}
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

  const renderTeams = () => (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Sport Teams</h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search teams..."
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
              Add Team
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {filteredTeams.map((team) => (
          <motion.div
            key={team.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{team.name}</h3>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                team.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {team.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            
            <div className="space-y-2 text-sm text-gray-600">
              <p><span className="font-medium">Sport:</span> {team.sport.name}</p>
              <p><span className="font-medium">Type:</span> {team.teamType}</p>
              <p><span className="font-medium">Grade:</span> {team.grade.name}</p>
              <p><span className="font-medium">Members:</span> {team.currentMembers}/{team.maxMembers}</p>
              {team.coachStaff && (
                <p><span className="font-medium">Coach:</span> {team.coachStaff.firstName} {team.coachStaff.lastName}</p>
              )}
              {team.practiceSchedule && (
                <p><span className="font-medium">Practice:</span> {team.practiceSchedule}</p>
              )}
              {team.homeVenue && (
                <div className="flex items-center">
                  <MapPinIcon className="h-4 w-4 mr-1" />
                  {team.homeVenue}
                </div>
              )}
            </div>

            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => handleEdit(team)}
                className="text-blue-600 hover:text-blue-900"
              >
                <PencilIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(team.id, 'team')}
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

  const renderEvents = () => (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Sport Events</h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search events..."
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
              Add Event
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {filteredEvents.map((event) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{event.name}</h3>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                event.status === 'Completed' ? 'bg-green-100 text-green-800' :
                event.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {event.status}
              </span>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <p><span className="font-medium">Sport:</span> {event.sport.name}</p>
              <p><span className="font-medium">Type:</span> {event.eventType}</p>
              <div className="flex items-center">
                <CalendarIcon className="h-4 w-4 mr-1" />
                {event.eventDate} at {event.startTime}
              </div>
              <div className="flex items-center">
                <MapPinIcon className="h-4 w-4 mr-1" />
                {event.location}
              </div>
              {event.opponentTeam && (
                <p><span className="font-medium">Opponent:</span> {event.opponentTeam}</p>
              )}
              {event.score && (
                <p><span className="font-medium">Score:</span> {event.score}</p>
              )}
              {event.result && (
                <p><span className="font-medium">Result:</span> {event.result}</p>
              )}
            </div>

            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => handleEdit(event)}
                className="text-blue-600 hover:text-blue-900"
              >
                <PencilIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(event.id, 'event')}
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

  const renderAchievements = () => (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Sport Achievements</h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search achievements..."
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
              Add Achievement
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <AnimatePresence>
              {filteredAchievements.map((achievement) => (
                <motion.tr
                  key={achievement.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <TrophyIcon className="h-5 w-5 text-yellow-500 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{achievement.title}</div>
                        <div className="text-sm text-gray-500">{achievement.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {achievement.student.firstName} {achievement.student.lastName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {achievement.sportTeam?.name || 'Individual'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                      {achievement.achievementType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      achievement.level === 'National' ? 'bg-red-100 text-red-800' :
                      achievement.level === 'Regional' ? 'bg-orange-100 text-orange-800' :
                      achievement.level === 'District' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {achievement.level}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {achievement.achievementDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(achievement)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(achievement.id, 'achievement')}
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
        <h1 className="text-2xl font-bold text-gray-900">Sports Management</h1>
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
            { key: 'sports', label: 'Sports', icon: TrophyIcon },
            { key: 'teams', label: 'Teams', icon: UserGroupIcon },
            { key: 'events', label: 'Events', icon: CalendarIcon },
            { key: 'achievements', label: 'Achievements', icon: StarIcon }
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
          {activeTab === 'sports' && renderSports()}
          {activeTab === 'teams' && renderTeams()}
          {activeTab === 'events' && renderEvents()}
          {activeTab === 'achievements' && renderAchievements()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default SportsManagement;
