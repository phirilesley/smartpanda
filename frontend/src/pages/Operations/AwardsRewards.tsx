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
  MapPinIcon,
  AcademicCapIcon,
  GiftIcon,
  CheckCircleIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

interface AwardCategory {
  id: string;
  name: string;
  description: string;
  categoryType: string;
  awardType: string;
  selectionCriteria: string;
  awardFrequency: string;
  isActive: boolean;
}

interface Award {
  id: string;
  name: string;
  description: string;
  awardLevel: string;
  value: number;
  pointsValue: number;
  certificateTemplate: string;
  physicalAward: string;
  awardCategory: {
    id: string;
    name: string;
    categoryType: string;
  };
  academicYear: {
    id: string;
    name: string;
  };
  term: {
    id: string;
    name: string;
  } | null;
  isActive: boolean;
}

interface StudentAward {
  id: string;
  awardDate: string;
  ceremonyDate: string | null;
  ceremonyName: string | null;
  reason: string;
  achievementDetails: string;
  ranking: string | null;
  certificateNumber: string | null;
  certificateIssued: boolean;
  physicalAwardIssued: boolean;
  pointsAwarded: number;
  status: string;
  award: {
    id: string;
    name: string;
    awardLevel: string;
    physicalAward: string;
  };
  awardCategory: {
    id: string;
    name: string;
    categoryType: string;
  };
  student: {
    id: string;
    firstName: string;
    lastName: string;
  };
  academicYear: {
    id: string;
    name: string;
  };
  term: {
    id: string;
    name: string;
  } | null;
  issuedByStaff: {
    id: string;
    firstName: string;
    lastName: string;
  } | null;
  presentedByStaff: {
    id: string;
    firstName: string;
    lastName: string;
  } | null;
}

interface PrizeGivingCeremony {
  id: string;
  name: string;
  description: string;
  ceremonyType: string;
  ceremonyDate: string;
  startTime: string;
  endTime: string | null;
  venue: string;
  masterOfCeremonies: string | null;
  guestOfHonor: string | null;
  expectedAttendees: number;
  actualAttendees: number;
  status: string;
  program: string;
  notes: string;
  organizerStaff: {
    id: string;
    firstName: string;
    lastName: string;
  } | null;
}

interface CeremonyAward {
  id: string;
  presentationOrder: number;
  presenterStaff: {
    id: string;
    firstName: string;
    lastName: string;
  } | null;
  presentationTime: string | null;
  photoTaken: boolean;
  photoPath: string | null;
  specialNotes: string;
  studentAward: StudentAward;
}

const AwardsRewards: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'categories' | 'awards' | 'studentAwards' | 'ceremonies'>('overview');
  const [categories, setCategories] = useState<AwardCategory[]>([]);
  const [awards, setAwards] = useState<Award[]>([]);
  const [studentAwards, setStudentAwards] = useState<StudentAward[]>([]);
  const [ceremonies, setCeremonies] = useState<PrizeGivingCeremony[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Mock data for demonstration
  useEffect(() => {
    const mockCategories: AwardCategory[] = [
      {
        id: '1',
        name: 'Academic Excellence',
        description: 'Awards for outstanding academic performance',
        categoryType: 'Academic',
        awardType: 'Certificate',
        selectionCriteria: 'Top 5% in class, consistent high grades',
        awardFrequency: 'Termly',
        isActive: true
      },
      {
        id: '2',
        name: 'Sports Achievement',
        description: 'Awards for sports excellence and sportsmanship',
        categoryType: 'Sports',
        awardType: 'Medal',
        selectionCriteria: 'Outstanding performance in sports, good sportsmanship',
        awardFrequency: 'Yearly',
        isActive: true
      },
      {
        id: '3',
        name: 'Leadership Award',
        description: 'Recognition of exceptional leadership qualities',
        categoryType: 'Leadership',
        awardType: 'Trophy',
        selectionCriteria: 'Demonstrated leadership, initiative, responsibility',
        awardFrequency: 'Yearly',
        isActive: true
      },
      {
        id: '4',
        name: 'Perfect Attendance',
        description: 'Award for consistent school attendance',
        categoryType: 'Attendance',
        awardType: 'Certificate',
        selectionCriteria: '100% attendance for the term/year',
        awardFrequency: 'Termly',
        isActive: true
      }
    ];

    const mockAwards: Award[] = [
      {
        id: '1',
        name: 'Academic Excellence Award',
        description: 'Awarded to students with outstanding academic performance',
        awardLevel: 'School',
        value: 0,
        pointsValue: 100,
        certificateTemplate: 'Academic Excellence Template',
        physicalAward: 'Certificate',
        awardCategory: { id: '1', name: 'Academic Excellence', categoryType: 'Academic' },
        academicYear: { id: '1', name: '2024-2025' },
        term: { id: '1', name: 'Term 1' },
        isActive: true
      },
      {
        id: '2',
        name: 'Sports Champion Award',
        description: 'Awarded to outstanding sports performers',
        awardLevel: 'School',
        value: 0,
        pointsValue: 150,
        certificateTemplate: 'Sports Champion Template',
        physicalAward: 'Medal',
        awardCategory: { id: '2', name: 'Sports Achievement', categoryType: 'Sports' },
        academicYear: { id: '1', name: '2024-2025' },
        term: null,
        isActive: true
      },
      {
        id: '3',
        name: 'Leadership Excellence Trophy',
        description: 'Awarded to students demonstrating exceptional leadership',
        awardLevel: 'School',
        value: 0,
        pointsValue: 200,
        certificateTemplate: 'Leadership Excellence Template',
        physicalAward: 'Trophy',
        awardCategory: { id: '3', name: 'Leadership Award', categoryType: 'Leadership' },
        academicYear: { id: '1', name: '2024-2025' },
        term: null,
        isActive: true
      }
    ];

    const mockStudentAwards: StudentAward[] = [
      {
        id: '1',
        awardDate: '2024-03-10',
        ceremonyDate: '2024-03-15',
        ceremonyName: 'Term 1 Awards Ceremony',
        reason: 'Outstanding academic performance with 95% average',
        achievementDetails: 'Achieved highest grades in Mathematics, Science, and English',
        ranking: '1st',
        certificateNumber: 'ACAD-2024-001',
        certificateIssued: true,
        physicalAwardIssued: true,
        pointsAwarded: 100,
        status: 'Awarded',
        award: { id: '1', name: 'Academic Excellence Award', awardLevel: 'School', physicalAward: 'Certificate' },
        awardCategory: { id: '1', name: 'Academic Excellence', categoryType: 'Academic' },
        student: { id: '1', firstName: 'Sarah', lastName: 'Johnson' },
        academicYear: { id: '1', name: '2024-2025' },
        term: { id: '1', name: 'Term 1' },
        issuedByStaff: { id: '1', firstName: 'Mr.', lastName: 'Anderson' },
        presentedByStaff: { id: '2', firstName: 'Ms.', lastName: 'Davis' }
      },
      {
        id: '2',
        awardDate: '2024-03-10',
        ceremonyDate: '2024-03-15',
        ceremonyName: 'Term 1 Awards Ceremony',
        reason: 'Exceptional performance in basketball tournament',
        achievementDetails: 'Led team to victory with 25 points, 8 rebounds, 5 assists',
        ranking: '1st',
        certificateNumber: 'SPORT-2024-001',
        certificateIssued: true,
        physicalAwardIssued: true,
        pointsAwarded: 150,
        status: 'Awarded',
        award: { id: '2', name: 'Sports Champion Award', awardLevel: 'School', physicalAward: 'Medal' },
        awardCategory: { id: '2', name: 'Sports Achievement', categoryType: 'Sports' },
        student: { id: '2', firstName: 'Michael', lastName: 'Brown' },
        academicYear: { id: '1', name: '2024-2025' },
        term: null,
        issuedByStaff: { id: '1', firstName: 'Mr.', lastName: 'Anderson' },
        presentedByStaff: { id: '2', firstName: 'Ms.', lastName: 'Davis' }
      },
      {
        id: '3',
        awardDate: '2024-03-10',
        ceremonyDate: '2024-03-15',
        ceremonyName: 'Term 1 Awards Ceremony',
        reason: 'Exceptional leadership as Head Boy',
        achievementDetails: 'Successfully organized school events, mentored junior students',
        ranking: '1st',
        certificateNumber: 'LEAD-2024-001',
        certificateIssued: true,
        physicalAwardIssued: true,
        pointsAwarded: 200,
        status: 'Awarded',
        award: { id: '3', name: 'Leadership Excellence Trophy', awardLevel: 'School', physicalAward: 'Trophy' },
        awardCategory: { id: '3', name: 'Leadership Award', categoryType: 'Leadership' },
        student: { id: '3', firstName: 'James', lastName: 'Wilson' },
        academicYear: { id: '1', name: '2024-2025' },
        term: null,
        issuedByStaff: { id: '1', firstName: 'Mr.', lastName: 'Anderson' },
        presentedByStaff: { id: '2', firstName: 'Ms.', lastName: 'Davis' }
      }
    ];

    const mockCeremonies: PrizeGivingCeremony[] = [
      {
        id: '1',
        name: 'Term 1 Awards Ceremony',
        description: 'Annual awards ceremony for Term 1 achievements',
        ceremonyType: 'Awards Day',
        ceremonyDate: '2024-03-15',
        startTime: '10:00',
        endTime: '12:00',
        venue: 'School Auditorium',
        masterOfCeremonies: 'Ms. Davis',
        guestOfHonor: 'Dr. Smith - Education Director',
        expectedAttendees: 200,
        actualAttendees: 185,
        status: 'Completed',
        program: '10:00 - Welcome\n10:15 - Academic Awards\n10:45 - Sports Awards\n11:15 - Leadership Awards\n11:45 - Special Awards\n12:00 - Closing',
        notes: 'Very successful ceremony with excellent attendance',
        organizerStaff: { id: '1', firstName: 'Mr.', lastName: 'Anderson' }
      },
      {
        id: '2',
        name: 'Sports Day Awards',
        description: 'Annual sports day awards ceremony',
        ceremonyType: 'Sports Day',
        ceremonyDate: '2024-04-20',
        startTime: '14:00',
        endTime: '16:00',
        venue: 'Sports Field',
        masterOfCeremonies: 'Mr. Brown',
        guestOfHonor: 'Olympic Athlete - Jane Smith',
        expectedAttendees: 300,
        actualAttendees: 0,
        status: 'Planned',
        program: '14:00 - Welcome\n14:15 - Individual Sports Awards\n14:45 - Team Sports Awards\n15:15 - Special Recognition\n15:45 - Closing',
        notes: 'Expected to be the largest sports ceremony ever',
        organizerStaff: { id: '1', firstName: 'Mr.', lastName: 'Anderson' }
      }
    ];

    setCategories(mockCategories);
    setAwards(mockAwards);
    setStudentAwards(mockStudentAwards);
    setCeremonies(mockCeremonies);
    setLoading(false);
  }, []);

  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAwards = awards.filter(award => 
    award.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    award.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredStudentAwards = studentAwards.filter(award => 
    award.student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    award.student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    award.award.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCeremonies = ceremonies.filter(ceremony => 
    ceremony.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ceremony.description.toLowerCase().includes(searchTerm.toLowerCase())
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

  const getAwardIcon = (awardType: string) => {
    switch (awardType) {
      case 'Certificate':
        return <AcademicCapIcon className="h-6 w-6 text-blue-500" />;
      case 'Medal':
        return <TrophyIcon className="h-6 w-6 text-yellow-500" />;
      case 'Trophy':
        return <TrophyIcon className="h-6 w-6 text-purple-500" />;
      case 'Prize':
        return <GiftIcon className="h-6 w-6 text-green-500" />;
      default:
        return <StarIcon className="h-6 w-6 text-gray-500" />;
    }
  };

  const getAwardStats = () => {
    const totalAwards = studentAwards.length;
    const totalPoints = studentAwards.reduce((sum, award) => sum + award.pointsAwarded, 0);
    const uniqueStudents = new Set(studentAwards.map(a => a.student.id)).size;
    const upcomingCeremonies = ceremonies.filter(c => c.status === 'Planned').length;

    return { totalAwards, totalPoints, uniqueStudents, upcomingCeremonies };
  };

  const renderOverview = () => {
    const stats = getAwardStats();

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Awards</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalAwards}</p>
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
                <p className="text-sm text-gray-600">Total Points</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalPoints}</p>
              </div>
              <StarIcon className="h-8 w-8 text-yellow-500" />
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
                <p className="text-sm text-gray-600">Awarded Students</p>
                <p className="text-2xl font-bold text-gray-900">{stats.uniqueStudents}</p>
              </div>
              <UserGroupIcon className="h-8 w-8 text-green-500" />
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
                <p className="text-sm text-gray-600">Upcoming Ceremonies</p>
                <p className="text-2xl font-bold text-gray-900">{stats.upcomingCeremonies}</p>
              </div>
              <CalendarIcon className="h-8 w-8 text-purple-500" />
            </div>
          </motion.div>
        </div>

        {/* Recent Awards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Awards</h3>
          <div className="space-y-3">
            {studentAwards.slice(0, 5).map((award) => (
              <div key={award.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {getAwardIcon(award.award.physicalAward)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{award.award.name}</p>
                    <p className="text-xs text-gray-500">
                      {award.student.firstName} {award.student.lastName} • {award.awardDate}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-900">{award.pointsAwarded} pts</p>
                  <p className="text-xs text-gray-500">{award.awardCategory.categoryType}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Award Categories Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Award Categories</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((category) => {
              const categoryAwards = studentAwards.filter(a => a.awardCategory.id === category.id);
              return (
                <div key={category.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{category.name}</h4>
                    <span className="text-sm text-gray-500">{categoryAwards.length}</span>
                  </div>
                  <p className="text-xs text-gray-600">{category.description}</p>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    );
  };

  const renderCategories = () => (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Award Categories</h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search categories..."
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
              Add Category
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {filteredCategories.map((category) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                category.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {category.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            
            <div className="space-y-2 text-sm text-gray-600">
              <p><span className="font-medium">Type:</span> {category.categoryType}</p>
              <p><span className="font-medium">Award:</span> {category.awardType}</p>
              <p><span className="font-medium">Frequency:</span> {category.awardFrequency}</p>
              {category.selectionCriteria && (
                <div>
                  <p className="font-medium">Criteria:</p>
                  <p className="text-xs">{category.selectionCriteria}</p>
                </div>
              )}
            </div>

            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => handleEdit(category)}
                className="text-blue-600 hover:text-blue-900"
              >
                <PencilIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(category.id, 'category')}
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

  const renderAwards = () => (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Awards</h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search awards..."
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
              Add Award
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Physical Award</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <AnimatePresence>
              {filteredAwards.map((award) => (
                <motion.tr
                  key={award.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 mr-3">
                        {getAwardIcon(award.physicalAward)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{award.name}</div>
                        <div className="text-sm text-gray-500">{award.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {award.awardCategory.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{award.awardLevel}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{award.pointsValue}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{award.physicalAward}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      award.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {award.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(award)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(award.id, 'award')}
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

  const renderStudentAwards = () => (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Student Awards</h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search student awards..."
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
              Award Student
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {filteredStudentAwards.map((studentAward) => (
          <motion.div
            key={studentAward.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 mr-3">
                  {getAwardIcon(studentAward.award.physicalAward)}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{studentAward.award.name}</h3>
              </div>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                studentAward.status === 'Awarded' ? 'bg-green-100 text-green-800' :
                studentAward.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {studentAward.status}
              </span>
            </div>
            
            <div className="space-y-2 text-sm text-gray-600">
              <p><span className="font-medium">Student:</span> {studentAward.student.firstName} {studentAward.student.lastName}</p>
              <p><span className="font-medium">Date:</span> {studentAward.awardDate}</p>
              {studentAward.ceremonyName && (
                <p><span className="font-medium">Ceremony:</span> {studentAward.ceremonyName}</p>
              )}
              <p><span className="font-medium">Category:</span> {studentAward.awardCategory.categoryType}</p>
              <p><span className="font-medium">Points:</span> {studentAward.pointsAwarded}</p>
              {studentAward.ranking && (
                <p><span className="font-medium">Ranking:</span> {studentAward.ranking}</p>
              )}
              {studentAward.reason && (
                <div>
                  <p className="font-medium">Reason:</p>
                  <p className="text-xs">{studentAward.reason}</p>
                </div>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex space-x-2">
                {studentAward.certificateIssued && (
                  <span className="flex items-center text-xs text-green-600">
                    <CheckCircleIcon className="h-3 w-3 mr-1" />
                    Certificate
                  </span>
                )}
                {studentAward.physicalAwardIssued && (
                  <span className="flex items-center text-xs text-green-600">
                    <CheckCircleIcon className="h-3 w-3 mr-1" />
                    Award
                  </span>
                )}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(studentAward)}
                  className="text-blue-600 hover:text-blue-900"
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(studentAward.id, 'student award')}
                  className="text-red-600 hover:text-red-900"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderCeremonies = () => (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Prize Giving Ceremonies</h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search ceremonies..."
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
              Schedule Ceremony
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        {filteredCeremonies.map((ceremony) => (
          <motion.div
            key={ceremony.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{ceremony.name}</h3>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                ceremony.status === 'Completed' ? 'bg-green-100 text-green-800' :
                ceremony.status === 'Planned' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {ceremony.status}
              </span>
            </div>
            
            <div className="space-y-2 text-sm text-gray-600">
              <p><span className="font-medium">Type:</span> {ceremony.ceremonyType}</p>
              <div className="flex items-center">
                <CalendarIcon className="h-4 w-4 mr-1" />
                {ceremony.ceremonyDate} at {ceremony.startTime}
              </div>
              <div className="flex items-center">
                <MapPinIcon className="h-4 w-4 mr-1" />
                {ceremony.venue}
              </div>
              <p><span className="font-medium">Attendance:</span> {ceremony.actualAttendees || 0}/{ceremony.expectedAttendees}</p>
              {ceremony.masterOfCeremonies && (
                <p><span className="font-medium">MC:</span> {ceremony.masterOfCeremonies}</p>
              )}
              {ceremony.guestOfHonor && (
                <p><span className="font-medium">Guest of Honor:</span> {ceremony.guestOfHonor}</p>
              )}
            </div>

            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => handleEdit(ceremony)}
                className="text-blue-600 hover:text-blue-900"
              >
                <PencilIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(ceremony.id, 'ceremony')}
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
        <h1 className="text-2xl font-bold text-gray-900">Awards & Rewards</h1>
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
            { key: 'categories', label: 'Categories', icon: TrophyIcon },
            { key: 'awards', label: 'Awards', icon: TrophyIcon },
            { key: 'studentAwards', label: 'Student Awards', icon: StarIcon },
            { key: 'ceremonies', label: 'Ceremonies', icon: SparklesIcon }
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
          {activeTab === 'categories' && renderCategories()}
          {activeTab === 'awards' && renderAwards()}
          {activeTab === 'studentAwards' && renderStudentAwards()}
          {activeTab === 'ceremonies' && renderCeremonies()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AwardsRewards;
