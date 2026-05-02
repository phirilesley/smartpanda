import React, { useState, useEffect } from 'react';
import {
  SparklesIcon,
  CalendarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  ChartBarIcon,
  DocumentTextIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  BellIcon,
  Cog6ToothIcon,
  UserGroupIcon,
  UserIcon,
  BuildingOfficeIcon,
  AcademicCapIcon,
  TrophyIcon,
  FlagIcon,
  MapPinIcon,
  CameraIcon,
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
  TagIcon,
  ArchiveBoxIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
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

interface Sport {
  id: string;
  name: string;
  description: string;
  category: 'team' | 'individual' | 'water' | 'field' | 'indoor' | 'combat' | 'racing';
  subcategory: string;
  season: 'summer' | 'winter' | 'all_year';
  gender: 'male' | 'female' | 'mixed';
  ageGroups: {
    min: number;
    max: number;
    category: string;
  }[];
  teamSize: {
    min: number;
    max: number;
  };
  equipment: {
    required: string[];
    optional: string[];
    safety: string[];
  };
  facilities: {
    type: string;
    dimensions?: {
      length: number;
      width: number;
      height?: number;
    };
    surface: string;
    capacity: number;
  };
  rules: {
    duration: number;
    periods: number;
    players: number;
    substitutions: number;
    scoring: string;
    fouls: string[];
  };
  coaching: {
    qualifications: string[];
    certifications: string[];
    experience: string;
  };
  images: string[];
  status: 'active' | 'inactive' | 'seasonal';
  createdAt: string;
  updatedAt: string;
}

interface Team {
  id: string;
  name: string;
  displayName: string;
  mascot: string;
  colors: {
    primary: string;
    secondary: string;
    accent?: string;
  };
  sport: {
    id: string;
    name: string;
    category: string;
  };
  ageGroup: string;
  gender: 'male' | 'female' | 'mixed';
  division: string;
  league: string;
  season: string;
  roster: {
    id: string;
    studentId: string;
    name: string;
    position: string;
    jerseyNumber: number;
    age: number;
    grade: string;
    status: 'active' | 'injured' | 'suspended' | 'transferred';
    joinDate: string;
    medical: {
      cleared: boolean;
      lastCheckup: string;
      conditions: string[];
      emergencyContact: string;
    };
  }[];
  coaching: {
    headCoach: {
      id: string;
      name: string;
      email: string;
      phone: string;
      qualifications: string[];
      experience: string;
    };
    assistants: {
      id: string;
      name: string;
      email: string;
      role: string;
    }[];
  };
  schedule: {
    practices: {
      id: string;
      day: string;
      time: string;
      location: string;
      duration: number;
    }[];
    games: {
      id: string;
      opponent: string;
      date: string;
      time: string;
      location: string;
      home: boolean;
    }[];
  };
  performance: {
    wins: number;
    losses: number;
    draws: number;
    points: number;
    goalsFor: number;
    goalsAgainst: number;
    ranking: number;
  };
  budget: {
    equipment: number;
    travel: number;
    uniforms: number;
    facilities: number;
    other: number;
    total: number;
  };
  status: 'active' | 'inactive' | 'season_complete';
  createdAt: string;
  updatedAt: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  type: 'match' | 'tournament' | 'practice' | 'training' | 'meeting' | 'tryout' | 'award_ceremony';
  sport: {
    id: string;
    name: string;
  };
  category: 'regular_season' | 'playoffs' | 'tournament' | 'friendly' | 'championship';
  level: 'school' | 'district' | 'provincial' | 'national';
  participants: {
    teams: {
      id: string;
      name: string;
      type: 'home' | 'away';
      score?: number;
    }[];
    individuals: {
      id: string;
      name: string;
      school: string;
      result?: string;
      position?: number;
    }[];
  };
  schedule: {
    startDate: string;
    endDate: string;
    startTime: string;
    endTime?: string;
    timezone: string;
  };
  location: {
    venue: string;
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
    facilities: string[];
  };
  officials: {
    referee: string[];
    umpire: string[];
    linesman: string[];
    scorer: string;
    timekeeper: string;
  };
  results: {
    status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'postponed';
    winner?: string;
    score: {
      home: number;
      away: number;
    };
    details: {
      periods: {
        period: number;
        score: {
          home: number;
          away: number;
        };
      }[];
      statistics: {
        team: {
          name: string;
          stats: {
            [key: string]: number | string;
          };
        }[];
      };
      mvp?: string;
      highlights: string[];
    };
  };
  media: {
    photos: string[];
    videos: string[];
    articles: string[];
  };
  attendance: {
    expected: number;
    actual?: number;
    ticketPrice?: number;
    revenue?: number;
  };
  weather: {
    condition: string;
    temperature: number;
    humidity: number;
    windSpeed: number;
  };
  notes: string;
  createdAt: string;
  updatedAt: string;
}

interface Facility {
  id: string;
  name: string;
  type: 'field' | 'court' | 'track' | 'pool' | 'gym' | 'stadium' | 'hall';
  location: {
    building: string;
    floor: string;
    room?: string;
  };
  dimensions: {
    length: number;
    width: number;
    height?: number;
    area: number;
  };
  surface: string;
  capacity: {
    seating: number;
    standing: number;
    total: number;
  };
  sports: string[];
  equipment: {
    available: string[];
    maintenance: {
      item: string;
      lastService: string;
      nextService: string;
      condition: string;
    }[];
  };
  amenities: string[];
  accessibility: boolean;
  lighting: {
    type: string;
    brightness: number;
    coverage: string;
  };
  drainage: string;
  marking: string[];
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  maintenance: {
    lastInspection: string;
    nextInspection: string;
    issues: string[];
    repairs: {
      description: string;
      date: string;
      cost: number;
      contractor: string;
    }[];
  };
  booking: {
    schedule: {
      id: string;
      sport: string;
      team: string;
      startTime: string;
      endTime: string;
      recurring: boolean;
      status: 'confirmed' | 'pending' | 'cancelled';
        }[];
    availability: {
      day: string;
      startTime: string;
      endTime: string;
      available: boolean;
        }[];
    };
  status: 'available' | 'maintenance' | 'closed' | 'reserved';
  createdAt: string;
  updatedAt: string;
}

interface Equipment {
  id: string;
  name: string;
  category: 'uniform' | 'protective' | 'ball' | 'racquet' | 'stick' | 'other';
  sport: string;
  description: string;
  specifications: {
    [key: string]: string | number | boolean;
  };
  brand: string;
  model: string;
  purchaseDate: string;
  purchaseCost: number;
  currentValue: number;
  condition: 'excellent' | 'good' | 'fair' | 'poor' | 'damaged';
  quantity: {
    total: number;
    available: number;
    assigned: number;
    maintenance: number;
    lost: number;
  };
  assignment: {
    team?: string;
    individual?: string;
    assignDate: string;
    expectedReturn?: string;
  }[];
  maintenance: {
    lastService: string;
    nextService: string;
    serviceHistory: {
      date: string;
      type: string;
      cost: number;
      technician: string;
      notes: string;
    }[];
  };
  storage: {
    location: string;
    shelf?: string;
    bin?: string;
  };
  images: string[];
  status: 'available' | 'assigned' | 'maintenance' | 'lost' | 'damaged' | 'retired';
  createdAt: string;
  updatedAt: string;
}

const SportsManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'sports' | 'teams' | 'events' | 'facilities' | 'equipment' | 'reports'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Sport | Team | Event | Facility | Equipment | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(3);

  // Mock data
  const [sports] = useState<Sport[]>([
    {
      id: '1',
      name: 'Soccer',
      description: 'Association football - the world most popular sport',
      category: 'team',
      subcategory: 'field',
      season: 'all_year',
      gender: 'mixed',
      ageGroups: [
        { min: 6, max: 12, category: 'Under 12' },
        { min: 13, max: 15, category: 'Under 15' },
        { min: 16, max: 18, category: 'Under 18' },
        { min: 19, max: 25, category: 'Senior' }
      ],
      teamSize: {
        min: 11,
        max: 18
      },
      equipment: {
        required: ['Soccer ball', 'Goal posts', 'Net', 'Corner flags'],
        optional: ['Training cones', 'Whistle', 'Scoreboard'],
        safety: ['Shin guards', 'Goalkeeper gloves', 'Mouth guard']
      },
      facilities: {
        type: 'Soccer Field',
        dimensions: {
          length: 100,
          width: 64,
          height: 0
        },
        surface: 'Grass',
        capacity: 500
      },
      rules: {
        duration: 90,
        periods: 2,
        players: 11,
        substitutions: 3,
        scoring: 'Goals',
        fouls: ['Offside', 'Handball', 'Foul', 'Misconduct']
      },
      coaching: {
        qualifications: ['Coaching License Level 1', 'First Aid Certificate'],
        certifications: ['FIFA Coaching Badge', 'Referee Certificate'],
        experience: '2 years coaching experience'
      },
      images: ['/images/sports/soccer.jpg'],
      status: 'active',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }
  ]);

  const [teams] = useState<Team[]>([
    {
      id: '1',
      name: 'Lions',
      displayName: 'School Lions',
      mascot: 'Lion',
      colors: {
        primary: '#FF0000',
        secondary: '#FFFFFF',
        accent: '#000000'
      },
      sport: {
        id: '1',
        name: 'Soccer',
        category: 'team'
      },
      ageGroup: 'Under 18',
      gender: 'male',
      division: 'First Division',
      league: 'Harare Schools League',
      season: '2024',
      roster: [
        {
          id: '1',
          studentId: 'STU-001',
          name: 'John Smith',
          position: 'Goalkeeper',
          jerseyNumber: 1,
          age: 17,
          grade: 'Form 4',
          status: 'active',
          joinDate: '2023-01-15',
          medical: {
            cleared: true,
            lastCheckup: '2024-01-10',
            conditions: [],
            emergencyContact: '+263 123 456 789'
          }
        }
      ],
      coaching: {
        headCoach: {
          id: 'coach1',
          name: 'Michael Johnson',
          email: 'michael.johnson@school.edu',
          phone: '+263 123 456 001',
          qualifications: ['Coaching License Level 2', 'First Aid'],
          experience: '5 years coaching experience'
        },
        assistants: [
          {
            id: 'asst1',
            name: 'Sarah Williams',
            email: 'sarah.williams@school.edu',
            role: 'Assistant Coach'
          }
        ]
      },
      schedule: {
        practices: [
          {
            id: '1',
            day: 'Monday',
            time: '16:00',
            location: 'School Field',
            duration: 90
          }
        ],
        games: [
          {
            id: '1',
            opponent: 'Eagles High School',
            date: '2024-02-01',
            time: '15:00',
            location: 'School Field',
            home: true
          }
        ]
      },
      performance: {
        wins: 8,
        losses: 2,
        draws: 1,
        points: 25,
        goalsFor: 24,
        goalsAgainst: 8,
        ranking: 2
      },
      budget: {
        equipment: 2000,
        travel: 1500,
        uniforms: 3000,
        facilities: 1000,
        other: 500,
        total: 8000
      },
      status: 'active',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-25T00:00:00Z'
    }
  ]);

  const [events] = useState<Event[]>([
    {
      id: '1',
      title: 'School Lions vs Eagles High',
      description: 'Home match against Eagles High School',
      type: 'match',
      sport: {
        id: '1',
        name: 'Soccer'
      },
      category: 'regular_season',
      level: 'school',
      participants: {
        teams: [
          {
            id: '1',
            name: 'School Lions',
            type: 'home',
            score: 3
          },
          {
            id: '2',
            name: 'Eagles High',
            type: 'away',
            score: 1
          }
        ],
        individuals: []
      },
      schedule: {
        startDate: '2024-02-01',
        endDate: '2024-02-01',
        startTime: '15:00',
        endTime: '17:00',
        timezone: 'Africa/Harare'
      },
      location: {
        venue: 'School Soccer Field',
        address: '123 School Road, Harare',
        facilities: ['Changing rooms', 'First aid station', 'Parking']
      },
      officials: {
        referee: ['John Referee'],
        umpire: [],
        linesman: ['Assistant 1', 'Assistant 2'],
        scorer: 'Scorekeeper 1',
        timekeeper: 'Timekeeper 1'
      },
      results: {
        status: 'completed',
        winner: 'School Lions',
        score: {
          home: 3,
          away: 1
        },
        details: {
          periods: [
            {
              period: 1,
              score: {
                home: 2,
                away: 0
              }
            },
            {
              period: 2,
              score: {
                home: 1,
                away: 1
              }
            }
          ],
          statistics: [
            {
              team: {
                name: 'School Lions',
                stats: {
                  possession: '65%',
                  shots: 12,
                  corners: 6,
                  fouls: 8
                }
              }
            }
          ],
          mvp: 'John Smith',
          highlights: ['Great goal by striker', 'Excellent save by goalkeeper']
        }
      },
      media: {
        photos: ['/images/events/match1.jpg'],
        videos: ['/videos/events/match1.mp4'],
        articles: []
      },
      attendance: {
        expected: 200,
        actual: 180,
        revenue: 900
      },
      weather: {
        condition: 'Sunny',
        temperature: 25,
        humidity: 60,
        windSpeed: 10
      },
      notes: 'Great match with excellent sportsmanship',
      createdAt: '2024-01-25T00:00:00Z',
      updatedAt: '2024-02-01T00:00:00Z'
    }
  ]);

  const [facilities] = useState<Facility[]>([
    {
      id: '1',
      name: 'Main Soccer Field',
      type: 'field',
      location: {
        building: 'Sports Complex',
        floor: 'Ground Floor'
      },
      dimensions: {
        length: 100,
        width: 64,
        area: 6400
      },
      surface: 'Natural Grass',
      capacity: {
        seating: 200,
        standing: 300,
        total: 500
      },
      sports: ['Soccer', 'Rugby', 'Athletics'],
      equipment: {
        available: ['Goal posts', 'Net', 'Corner flags', 'Bench'],
        maintenance: [
          {
            item: 'Goal posts',
            lastService: '2024-01-15',
            nextService: '2024-04-15',
            condition: 'Good'
          }
        ]
      },
      amenities: ['Changing rooms', 'Showers', 'First aid station', 'Toilets', 'Canteen'],
      accessibility: true,
      lighting: {
        type: 'Floodlights',
        brightness: 500,
        coverage: 'Full field'
      },
      drainage: 'Excellent',
      marking: ['Soccer lines', 'Rugby lines', 'Athletics track'],
      condition: 'excellent',
      maintenance: {
        lastInspection: '2024-01-20',
        nextInspection: '2024-04-20',
        issues: [],
        repairs: []
      },
      booking: {
        schedule: [
          {
            id: '1',
            sport: 'Soccer',
            team: 'School Lions',
            startTime: '2024-02-01T15:00:00Z',
            endTime: '2024-02-01T17:00:00Z',
            recurring: false,
            status: 'confirmed'
          }
        ],
        availability: [
          {
            day: 'Monday',
            startTime: '08:00',
            endTime: '18:00',
            available: true
          }
        ]
      },
      status: 'available',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-25T00:00:00Z'
    }
  ]);

  const [equipment] = useState<Equipment[]>([
    {
      id: '1',
      name: 'Soccer Ball Size 5',
      category: 'ball',
      sport: 'Soccer',
      description: 'Official size 5 soccer ball for matches and training',
      specifications: {
        size: '5',
        weight: '410-450g',
        circumference: '68-70cm',
        material: 'Leather',
        brand: 'Adidas',
        model: 'Tango'
      },
      brand: 'Adidas',
      model: 'Tango',
      purchaseDate: '2024-01-10',
      purchaseCost: 50,
      currentValue: 40,
      condition: 'good',
      quantity: {
        total: 20,
        available: 8,
        assigned: 10,
        maintenance: 2,
        lost: 0
      },
      assignment: [
        {
          team: 'School Lions',
          assignDate: '2024-01-15',
          expectedReturn: '2024-06-15'
        }
      ],
      maintenance: {
        lastService: '2024-01-20',
        nextService: '2024-04-20',
        serviceHistory: [
          {
            date: '2024-01-20',
            type: 'Inspection',
            cost: 5,
            technician: 'Sports Equipment Manager',
            notes: 'Checked air pressure and condition'
          }
        ]
      },
      storage: {
        location: 'Sports Equipment Room',
        shelf: 'A1',
        bin: 'B2'
      },
      images: ['/images/equipment/soccer_ball.jpg'],
      status: 'available',
      createdAt: '2024-01-10T00:00:00Z',
      updatedAt: '2024-01-25T00:00:00Z'
    }
  ]);

  const stats = {
    totalSports: sports.length,
    activeTeams: teams.filter(t => t.status === 'active').length,
    upcomingEvents: events.filter(e => e.results.status === 'scheduled').length,
    totalFacilities: facilities.length,
    availableFacilities: facilities.filter(f => f.status === 'available').length,
    totalEquipment: equipment.reduce((acc, e) => acc + e.quantity.total, 0),
    equipmentInUse: equipment.reduce((acc, e) => acc + e.quantity.assigned, 0)
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'available':
      case 'completed':
      case 'confirmed':
        return 'text-green-600 bg-green-100';
      case 'inactive':
      case 'cancelled':
      case 'lost':
      case 'damaged':
        return 'text-red-600 bg-red-100';
      case 'scheduled':
      case 'pending':
      case 'assigned':
      case 'in_progress':
        return 'text-yellow-600 bg-yellow-100';
      case 'maintenance':
      case 'season_complete':
      case 'postponed':
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'excellent':
        return 'text-green-600 bg-green-100';
      case 'good':
        return 'text-blue-600 bg-blue-100';
      case 'fair':
        return 'text-yellow-600 bg-yellow-100';
      case 'poor':
      case 'damaged':
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Sports</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalSports}</p>
            </div>
            <SparklesIcon className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Teams</p>
              <p className="text-2xl font-bold text-green-600">{stats.activeTeams}</p>
            </div>
            <UserGroupIcon className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Upcoming Events</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.upcomingEvents}</p>
            </div>
            <CalendarIcon className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Facilities</p>
              <p className="text-2xl font-bold text-blue-600">{stats.totalFacilities}</p>
            </div>
            <BuildingOfficeIcon className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Available Facilities</p>
              <p className="text-2xl font-bold text-green-600">{stats.availableFacilities}</p>
            </div>
            <CheckCircleIcon className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Equipment in Use</p>
              <p className="text-2xl font-bold text-orange-600">{stats.equipmentInUse}/{stats.totalEquipment}</p>
            </div>
            <ArchiveBoxIcon className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Activities</h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">School Lions won their match 3-1 against Eagles High</p>
              <p className="text-xs text-gray-500">2 days ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <CalendarIcon className="h-5 w-5 text-blue-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">New practice scheduled for Lions team</p>
              <p className="text-xs text-gray-500">3 days ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <ArchiveBoxIcon className="h-5 w-5 text-orange-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">Equipment maintenance completed for soccer balls</p>
              <p className="text-xs text-gray-500">1 week ago</p>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Upcoming Events</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {events.filter(e => e.results.status === 'scheduled').slice(0, 3).map((event) => (
              <div key={event.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <CalendarIcon className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{event.title}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(event.schedule.startDate).toLocaleDateString()} {event.schedule.startTime}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{event.location.venue}</p>
                  <p className="text-xs text-gray-500">{event.participants.teams.map(t => t.name).join(' vs ')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSports = () => (
    <div className="space-y-6">
      {/* Sports List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Sports</h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Sport
            </button>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {sports.map((sport) => (
            <div key={sport.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <SparklesIcon className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-lg font-medium text-gray-900">{sport.name}</h4>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(sport.status)}`}>
                        {sport.status}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {sport.category}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-gray-500">{sport.season.replace('_', ' ')}</span>
                      <span className="text-sm text-gray-500">{sport.gender}</span>
                      <span className="text-sm text-gray-500">{sport.teamSize.min}-{sport.teamSize.max} players</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedItem(sport);
                      setShowDetailsModal(true);
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <EyeIcon className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <PencilIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTeams = () => (
    <div className="space-y-6">
      {/* Teams List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Teams</h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Team
            </button>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {teams.map((team) => (
            <div key={team.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div 
                      className="h-10 w-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: team.colors.primary }}
                    >
                      <span className="text-white font-bold text-sm">
                        {team.displayName.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-lg font-medium text-gray-900">{team.displayName}</h4>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(team.status)}`}>
                        {team.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-gray-500">{team.sport.name}</span>
                      <span className="text-sm text-gray-500">{team.ageGroup}</span>
                      <span className="text-sm text-gray-500">{team.division}</span>
                      <span className="text-sm text-gray-500">{team.roster.length} players</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedItem(team);
                      setShowDetailsModal(true);
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <EyeIcon className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <PencilIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderEvents = () => (
    <div className="space-y-6">
      {/* Events List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Events</h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Event
            </button>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {events.map((event) => (
            <div key={event.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                      <CalendarIcon className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-lg font-medium text-gray-900">{event.title}</h4>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(event.results.status)}`}>
                        {event.results.status.replace('_', ' ')}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {event.type.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-gray-500">{event.sport.name}</span>
                      <span className="text-sm text-gray-500">{new Date(event.schedule.startDate).toLocaleDateString()}</span>
                      <span className="text-sm text-gray-500">{event.location.venue}</span>
                      {event.participants.teams.length > 0 && (
                        <span className="text-sm text-gray-500">
                          {event.participants.teams.map(t => t.name).join(' vs ')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedItem(event);
                      setShowDetailsModal(true);
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <EyeIcon className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <PencilIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderFacilities = () => (
    <div className="space-y-6">
      {/* Facilities List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Facilities</h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Facility
            </button>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {facilities.map((facility) => (
            <div key={facility.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <BuildingOfficeIcon className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-lg font-medium text-gray-900">{facility.name}</h4>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(facility.status)}`}>
                        {facility.status}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getConditionColor(facility.condition)}`}>
                        {facility.condition}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-gray-500">{facility.type}</span>
                      <span className="text-sm text-gray-500">{facility.surface}</span>
                      <span className="text-sm text-gray-500">{facility.capacity.total} capacity</span>
                      <span className="text-sm text-gray-500">{facility.location.building}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedItem(facility);
                      setShowDetailsModal(true);
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <EyeIcon className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <PencilIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderEquipment = () => (
    <div className="space-y-6">
      {/* Equipment List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Equipment</h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Equipment
            </button>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {equipment.map((item) => (
            <div key={item.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                      <ArchiveBoxIcon className="h-5 w-5 text-orange-600" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-lg font-medium text-gray-900">{item.name}</h4>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getConditionColor(item.condition)}`}>
                        {item.condition}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-gray-500">{item.sport}</span>
                      <span className="text-sm text-gray-500">{item.brand} {item.model}</span>
                      <span className="text-sm text-gray-500">
                        {item.quantity.available}/{item.quantity.total} available
                      </span>
                      <span className="text-sm text-gray-500">${item.currentValue.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedItem(item);
                      setShowDetailsModal(true);
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <EyeIcon className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <PencilIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      {/* Report Generation */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Generate Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
            <SparklesIcon className="h-8 w-8 text-blue-500 mb-2" />
            <h4 className="font-medium text-gray-900">Sports Directory</h4>
            <p className="text-sm text-gray-500">Complete sports listing</p>
          </button>
          <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
            <UserGroupIcon className="h-8 w-8 text-green-500 mb-2" />
            <h4 className="font-medium text-gray-900">Team Performance</h4>
            <p className="text-sm text-gray-500">Team statistics and rankings</p>
          </button>
          <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
            <CalendarIcon className="h-8 w-8 text-yellow-500 mb-2" />
            <h4 className="font-medium text-gray-900">Event Schedule</h4>
            <p className="text-sm text-gray-500">Upcoming and past events</p>
          </button>
          <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
            <BuildingOfficeIcon className="h-8 w-8 text-purple-500 mb-2" />
            <h4 className="font-medium text-gray-900">Facility Usage</h4>
            <p className="text-sm text-gray-500">Facility utilization report</p>
          </button>
          <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
            <ArchiveBoxIcon className="h-8 w-8 text-orange-500 mb-2" />
            <h4 className="font-medium text-gray-900">Equipment Inventory</h4>
            <p className="text-sm text-gray-500">Equipment status and tracking</p>
          </button>
          <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
            <CurrencyDollarIcon className="h-8 w-8 text-red-500 mb-2" />
            <h4 className="font-medium text-gray-900">Budget Analysis</h4>
            <p className="text-sm text-gray-500">Sports department finances</p>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <SparklesIcon className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">Sports Management</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-400 hover:text-gray-600"
              >
                <BellIcon className="h-6 w-6" />
                {notifications > 0 && (
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400"></span>
                )}
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Cog6ToothIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8" aria-label="Tabs">
            {[
              { id: 'overview', name: 'Overview', icon: ChartBarIcon },
              { id: 'sports', name: 'Sports', icon: SparklesIcon },
              { id: 'teams', name: 'Teams', icon: UserGroupIcon },
              { id: 'events', name: 'Events', icon: CalendarIcon },
              { id: 'facilities', name: 'Facilities', icon: BuildingOfficeIcon },
              { id: 'equipment', name: 'Equipment', icon: ArchiveBoxIcon },
              { id: 'reports', name: 'Reports', icon: DocumentTextIcon }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'sports' && renderSports()}
        {activeTab === 'teams' && renderTeams()}
        {activeTab === 'events' && renderEvents()}
        {activeTab === 'facilities' && renderFacilities()}
        {activeTab === 'equipment' && renderEquipment()}
        {activeTab === 'reports' && renderReports()}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedItem && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {selectedItem.name || selectedItem.displayName || selectedItem.title || 'Details'}
              </h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="mt-4">
              <pre className="text-sm text-gray-600 whitespace-pre-wrap">
                {JSON.stringify(selectedItem, null, 2)}
              </pre>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SportsManagement;
