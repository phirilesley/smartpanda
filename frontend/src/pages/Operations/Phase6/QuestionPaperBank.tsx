import React, { useState, useEffect } from 'react';
import {
  DocumentTextIcon,
  AcademicCapIcon,
  CalendarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  ChartBarIcon,
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
  TagIcon,
  FolderIcon,
  FolderOpenIcon,
  ArchiveBoxIcon,
  ShieldCheckIcon,
  SparklesIcon,
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

interface QuestionPaper {
  id: string;
  title: string;
  description: string;
  subject: string;
  grade: string;
  level: 'form1' | 'form2' | 'form3' | 'form4' | 'form6' | 'lower6' | 'upper6';
  examType: 'mid_term' | 'final' | 'mock' | 'quiz' | 'assignment' | 'practical' | 'test';
  year: number;
  term: 'term1' | 'term2' | 'term3';
  duration: number; // in minutes
  totalMarks: number;
  passingMarks: number;
  instructions: string[];
  sections: {
    id: string;
    title: string;
    description: string;
    compulsory: boolean;
    questionsToAnswer: number;
    totalQuestions: number;
    marks: number;
    questions: {
      id: string;
      type: 'multiple_choice' | 'short_answer' | 'essay' | 'true_false' | 'fill_blank' | 'matching' | 'practical';
      question: string;
      options?: string[];
      correctAnswer?: string | string[];
      marks: number;
      difficulty: 'easy' | 'medium' | 'hard';
      category: string;
      subcategory?: string;
      explanation?: string;
      reference?: string;
      attachment?: string;
    }[];
  }[];
  metadata: {
    createdBy: string;
    createdAt: string;
    lastModifiedBy: string;
    lastModifiedAt: string;
    version: string;
    status: 'draft' | 'review' | 'approved' | 'published' | 'archived';
    tags: string[];
    category: string;
    difficulty: 'easy' | 'medium' | 'hard';
    estimatedTime: number;
  };
  settings: {
    allowRandomQuestions: boolean;
    shuffleOptions: boolean;
    showMarks: boolean;
    showTime: boolean;
    allowReview: boolean;
    autoSubmit: boolean;
    negativeMarking: boolean;
    negativeMarkingValue: number;
  };
  distribution: {
    teachers: {
      id: string;
      name: string;
      access: 'view' | 'edit' | 'admin';
      sharedAt: string;
    }[];
    departments: {
      id: string;
      name: string;
      access: 'view' | 'edit';
      sharedAt: string;
    }[];
  };
  analytics: {
    usageCount: number;
    averageScore: number;
    averageTime: number;
    difficultyRating: number;
    feedbackCount: number;
    lastUsed?: string;
  };
  attachments: {
    type: 'image' | 'document' | 'audio' | 'video';
    name: string;
    url: string;
    size: number;
    uploadDate: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

interface QuestionTemplate {
  id: string;
  name: string;
  description: string;
  subject: string;
  grade: string;
  template: {
    sections: {
      title: string;
      questionCount: number;
      marksPerQuestion: number;
      questionTypes: string[];
      compulsory: boolean;
    }[];
    totalMarks: number;
    duration: number;
    instructions: string[];
  };
  isDefault: boolean;
  usageCount: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface QuestionBank {
  id: string;
  question: string;
  type: 'multiple_choice' | 'short_answer' | 'essay' | 'true_false' | 'fill_blank' | 'matching' | 'practical';
  subject: string;
  grade: string;
  topic: string;
  subtopic?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  marks: number;
  options?: string[];
  correctAnswer?: string | string[];
  explanation?: string;
  reference?: string;
  tags: string[];
  attachments: {
    type: 'image' | 'document' | 'audio' | 'video';
    name: string;
    url: string;
  }[];
  metadata: {
    createdBy: string;
    createdAt: string;
    lastUsed?: string;
    usageCount: number;
    successRate: number;
    averageTime: number;
  };
  status: 'active' | 'inactive' | 'review' | 'archived';
  createdAt: string;
  updatedAt: string;
}

interface ExamSession {
  id: string;
  paperId: string;
  paperTitle: string;
  subject: string;
  grade: string;
  examDate: string;
  startTime: string;
  endTime: string;
  duration: number;
  venue: string;
  invigilators: {
    id: string;
    name: string;
    role: 'chief' | 'assistant';
  }[];
  students: {
    id: string;
    name: string;
    class: string;
    present: boolean;
    startTime?: string;
    submitTime?: string;
    status: 'not_started' | 'in_progress' | 'submitted' | 'absent';
    score?: number;
    marks?: {
      section: string;
      obtained: number;
      total: number;
    }[];
  }[];
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  settings: {
    allowLateEntry: boolean;
    allowEarlyExit: boolean;
    extraTimeAllowed: boolean;
    extraTimeMinutes: number;
  };
  incidents: {
    type: string;
    description: string;
    time: string;
    resolved: boolean;
  }[];
  createdAt: string;
  updatedAt: string;
}

const QuestionPaperBank: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'papers' | 'templates' | 'question_bank' | 'sessions' | 'analytics' | 'settings'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<QuestionPaper | QuestionTemplate | QuestionBank | ExamSession | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(3);

  // Mock data
  const [questionPapers] = useState<QuestionPaper[]>([
    {
      id: '1',
      title: 'Mathematics Final Exam - Form 4',
      description: 'Comprehensive mathematics examination covering all topics',
      subject: 'Mathematics',
      grade: 'Form 4',
      level: 'form4',
      examType: 'final',
      year: 2024,
      term: 'term3',
      duration: 180,
      totalMarks: 100,
      passingMarks: 50,
      instructions: [
        'Read all questions carefully',
        'Answer all questions in Section A',
        'Answer any 3 questions in Section B',
        'Show all working steps',
        'No calculators allowed'
      ],
      sections: [
        {
          id: '1',
          title: 'Section A - Multiple Choice',
          description: 'Answer all questions',
          compulsory: true,
          questionsToAnswer: 20,
          totalQuestions: 20,
          marks: 40,
          questions: [
            {
              id: '1',
              type: 'multiple_choice',
              question: 'What is the value of x in the equation 2x + 5 = 15?',
              options: ['5', '10', '15', '20'],
              correctAnswer: '5',
              marks: 2,
              difficulty: 'easy',
              category: 'Algebra',
              explanation: '2x + 5 = 15 => 2x = 10 => x = 5'
            }
          ]
        },
        {
          id: '2',
          title: 'Section B - Structured Questions',
          description: 'Answer any 3 questions',
          compulsory: false,
          questionsToAnswer: 3,
          totalQuestions: 5,
          marks: 60,
          questions: [
            {
              id: '21',
              type: 'short_answer',
              question: 'Solve the quadratic equation: x² - 5x + 6 = 0',
              correctAnswer: 'x = 2, x = 3',
              marks: 20,
              difficulty: 'medium',
              category: 'Algebra',
              explanation: 'Factorize: (x-2)(x-3) = 0 => x = 2, 3'
            }
          ]
        }
      ],
      metadata: {
        createdBy: 'John Smith',
        createdAt: '2024-01-15T00:00:00Z',
        lastModifiedBy: 'John Smith',
        lastModifiedAt: '2024-01-20T00:00:00Z',
        version: '1.2',
        status: 'approved',
        tags: ['mathematics', 'algebra', 'geometry', 'final'],
        category: 'Core Mathematics',
        difficulty: 'medium',
        estimatedTime: 180
      },
      settings: {
        allowRandomQuestions: false,
        shuffleOptions: true,
        showMarks: true,
        showTime: true,
        allowReview: false,
        autoSubmit: true,
        negativeMarking: false,
        negativeMarkingValue: 0
      },
      distribution: {
        teachers: [
          {
            id: 't1',
            name: 'John Smith',
            access: 'admin',
            sharedAt: '2024-01-15T00:00:00Z'
          }
        ],
        departments: [
          {
            id: 'math_dept',
            name: 'Mathematics Department',
            access: 'edit',
            sharedAt: '2024-01-15T00:00:00Z'
          }
        ]
      },
      analytics: {
        usageCount: 5,
        averageScore: 68.5,
        averageTime: 165,
        difficultyRating: 3.2,
        feedbackCount: 12,
        lastUsed: '2024-01-20T00:00:00Z'
      },
      attachments: [
        {
          type: 'document',
          name: 'formula_sheet.pdf',
          url: '/attachments/formula_sheet.pdf',
          size: 1024000,
          uploadDate: '2024-01-15T00:00:00Z'
        }
      ],
      createdAt: '2024-01-15T00:00:00Z',
      updatedAt: '2024-01-20T00:00:00Z'
    }
  ]);

  const [templates] = useState<QuestionTemplate[]>([
    {
      id: '1',
      name: 'Standard Mathematics Template',
      description: 'Standard template for mathematics examinations',
      subject: 'Mathematics',
      grade: 'Form 4',
      template: {
        sections: [
          {
            title: 'Multiple Choice',
            questionCount: 20,
            marksPerQuestion: 2,
            questionTypes: ['multiple_choice'],
            compulsory: true
          },
          {
            title: 'Structured Questions',
            questionCount: 5,
            marksPerQuestion: 20,
            questionTypes: ['short_answer', 'essay'],
            compulsory: false
          }
        ],
        totalMarks: 100,
        duration: 180,
        instructions: [
          'Read all questions carefully',
          'Show all working steps',
          'Manage your time effectively'
        ]
      },
      isDefault: true,
      usageCount: 15,
      createdBy: 'John Smith',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }
  ]);

  const [questionBank] = useState<QuestionBank[]>([
    {
      id: '1',
      question: 'What is the derivative of x²?',
      type: 'short_answer',
      subject: 'Mathematics',
      grade: 'Form 4',
      topic: 'Calculus',
      difficulty: 'medium',
      marks: 5,
      correctAnswer: '2x',
      explanation: 'Using the power rule: d/dx(x^n) = nx^(n-1)',
      tags: ['calculus', 'derivative', 'power rule'],
      metadata: {
        createdBy: 'John Smith',
        createdAt: '2024-01-10T00:00:00Z',
        lastUsed: '2024-01-20T00:00:00Z',
        usageCount: 8,
        successRate: 75.5,
        averageTime: 3.5
      },
      status: 'active',
      createdAt: '2024-01-10T00:00:00Z',
      updatedAt: '2024-01-10T00:00:00Z'
    }
  ]);

  const [examSessions] = useState<ExamSession[]>([
    {
      id: '1',
      paperId: '1',
      paperTitle: 'Mathematics Final Exam - Form 4',
      subject: 'Mathematics',
      grade: 'Form 4',
      examDate: '2024-01-20',
      startTime: '09:00',
      endTime: '12:00',
      duration: 180,
      venue: 'Main Hall',
      invigilators: [
        {
          id: 'inv1',
          name: 'Sarah Johnson',
          role: 'chief'
        },
        {
          id: 'inv2',
          name: 'Mike Wilson',
          role: 'assistant'
        }
      ],
      students: [
        {
          id: 'stu1',
          name: 'Alice Johnson',
          class: '4A',
          present: true,
          startTime: '09:00',
          submitTime: '11:45',
          status: 'submitted',
          score: 78,
          marks: [
            {
              section: 'Section A',
              obtained: 35,
              total: 40
            },
            {
              section: 'Section B',
              obtained: 43,
              total: 60
            }
          ]
        }
      ],
      status: 'completed',
      settings: {
        allowLateEntry: true,
        allowEarlyExit: false,
        extraTimeAllowed: true,
        extraTimeMinutes: 30
      },
      incidents: [],
      createdAt: '2024-01-15T00:00:00Z',
      updatedAt: '2024-01-20T00:00:00Z'
    }
  ]);

  const stats = {
    totalPapers: questionPapers.length,
    publishedPapers: questionPapers.filter(p => p.metadata.status === 'published').length,
    draftPapers: questionPapers.filter(p => p.metadata.status === 'draft').length,
    totalQuestions: questionBank.length,
    activeSessions: examSessions.filter(s => s.status === 'in_progress').length,
    totalTemplates: templates.length
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
      case 'completed':
      case 'submitted':
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'draft':
      case 'scheduled':
      case 'in_progress':
      case 'review':
        return 'text-yellow-600 bg-yellow-100';
      case 'archived':
      case 'cancelled':
      case 'inactive':
        return 'text-gray-600 bg-gray-100';
      case 'approved':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-600 bg-green-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'hard':
        return 'text-red-600 bg-red-100';
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
              <p className="text-sm text-gray-600">Total Papers</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalPapers}</p>
            </div>
            <DocumentTextIcon className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Published Papers</p>
              <p className="text-2xl font-bold text-green-600">{stats.publishedPapers}</p>
            </div>
            <CheckCircleIcon className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Draft Papers</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.draftPapers}</p>
            </div>
            <DocumentTextIcon className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Question Bank</p>
              <p className="text-2xl font-bold text-purple-600">{stats.totalQuestions}</p>
            </div>
            <AcademicCapIcon className="h-8 w-8 text-purple-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Sessions</p>
              <p className="text-2xl font-bold text-orange-600">{stats.activeSessions}</p>
            </div>
            <ClockIcon className="h-8 w-8 text-orange-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Templates</p>
              <p className="text-2xl font-bold text-blue-600">{stats.totalTemplates}</p>
            </div>
            <FolderIcon className="h-8 w-8 text-blue-500" />
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
              <p className="text-sm text-gray-900">Mathematics Final Exam completed successfully</p>
              <p className="text-xs text-gray-500">2 days ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <DocumentTextIcon className="h-5 w-5 text-blue-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">New question paper created: Science Form 3</p>
              <p className="text-xs text-gray-500">5 days ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <AcademicCapIcon className="h-5 w-5 text-purple-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">15 new questions added to Mathematics bank</p>
              <p className="text-xs text-gray-500">1 week ago</p>
            </div>
          </div>
        </div>
      </div>

      {/* Subject Distribution */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Papers by Subject</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {Object.entries(
              questionPapers.reduce((acc, paper) => {
                acc[paper.subject] = (acc[paper.subject] || 0) + 1;
                return acc;
              }, {} as Record<string, number>)
            ).map(([subject, count]) => (
              <div key={subject} className="flex items-center justify-between">
                <span className="text-sm text-gray-900">{subject}</span>
                <span className="text-sm font-medium text-gray-900">{count} papers</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPapers = () => (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search question papers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <select
              className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
            >
              <option value="all">All Papers</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="review">Under Review</option>
              <option value="archived">Archived</option>
            </select>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Create Paper
            </button>
          </div>
        </div>
      </div>

      {/* Papers List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="min-w-full divide-y divide-gray-200">
          <div className="bg-gray-50 px-6 py-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">All Question Papers</h3>
              <span className="text-sm text-gray-500">{questionPapers.length} papers</span>
            </div>
          </div>
          <div className="bg-white divide-y divide-gray-200">
            {questionPapers.map((paper) => (
              <div key={paper.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <DocumentTextIcon className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-lg font-medium text-gray-900">{paper.title}</h4>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(paper.metadata.status)}`}>
                          {paper.metadata.status}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(paper.metadata.difficulty)}`}>
                          {paper.metadata.difficulty}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-gray-500">{paper.subject}</span>
                        <span className="text-sm text-gray-500">{paper.grade}</span>
                        <span className="text-sm text-gray-500">{paper.examType}</span>
                        <span className="text-sm text-gray-500">{paper.duration} minutes</span>
                        <span className="text-sm text-gray-500">{paper.totalMarks} marks</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setSelectedItem(paper);
                        setShowDetailsModal(true);
                      }}
                      className="p-2 text-gray-400 hover:text-gray-600"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600">
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderTemplates = () => (
    <div className="space-y-6">
      {/* Templates List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Question Paper Templates</h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Create Template
            </button>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {templates.map((template) => (
            <div key={template.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-lg font-medium text-gray-900">{template.name}</h4>
                    {template.isDefault && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-sm text-gray-500">{template.subject}</span>
                    <span className="text-sm text-gray-500">{template.grade}</span>
                    <span className="text-sm text-gray-500">{template.template.totalMarks} marks</span>
                    <span className="text-sm text-gray-500">{template.template.duration} minutes</span>
                    <span className="text-sm text-gray-500">Used {template.usageCount} times</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedItem(template);
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

  const renderQuestionBank = () => (
    <div className="space-y-6">
      {/* Question Bank */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Question Bank</h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Question
            </button>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {questionBank.map((question) => (
            <div key={question.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-lg font-medium text-gray-900">{question.question}</h4>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(question.status)}`}>
                      {question.status}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                      {question.difficulty}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {question.type.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-sm text-gray-500">{question.subject}</span>
                    <span className="text-sm text-gray-500">{question.grade}</span>
                    <span className="text-sm text-gray-500">{question.topic}</span>
                    <span className="text-sm text-gray-500">{question.marks} marks</span>
                    <span className="text-sm text-gray-500">Used {question.metadata.usageCount} times</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedItem(question);
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

  const renderSessions = () => (
    <div className="space-y-6">
      {/* Exam Sessions */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Exam Sessions</h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Schedule Session
            </button>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {examSessions.map((session) => (
            <div key={session.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-lg font-medium text-gray-900">{session.paperTitle}</h4>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                      {session.status}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-sm text-gray-500">{session.subject}</span>
                    <span className="text-sm text-gray-500">{session.grade}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(session.examDate).toLocaleDateString()} {session.startTime} - {session.endTime}
                    </span>
                    <span className="text-sm text-gray-500">{session.venue}</span>
                    <span className="text-sm text-gray-500">
                      {session.students.filter(s => s.present).length}/{session.students.length} present
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedItem(session);
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

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Analytics Dashboard</h3>
        <p className="text-gray-600">Question paper analytics and performance metrics coming soon...</p>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Settings</h3>
        <p className="text-gray-600">Question paper bank settings and configuration coming soon...</p>
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
              <DocumentTextIcon className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">Question Paper Bank</h1>
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
              { id: 'papers', name: 'Question Papers', icon: DocumentTextIcon },
              { id: 'templates', name: 'Templates', icon: FolderIcon },
              { id: 'question_bank', name: 'Question Bank', icon: AcademicCapIcon },
              { id: 'sessions', name: 'Exam Sessions', icon: CalendarIcon },
              { id: 'analytics', name: 'Analytics', icon: ChartBarIcon },
              { id: 'settings', name: 'Settings', icon: Cog6ToothIcon }
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
        {activeTab === 'papers' && renderPapers()}
        {activeTab === 'templates' && renderTemplates()}
        {activeTab === 'question_bank' && renderQuestionBank()}
        {activeTab === 'sessions' && renderSessions()}
        {activeTab === 'analytics' && renderAnalytics()}
        {activeTab === 'settings' && renderSettings()}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedItem && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {selectedItem.title || selectedItem.name || selectedItem.question || selectedItem.paperTitle || 'Details'}
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

export default QuestionPaperBank;
