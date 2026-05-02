import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CurrencyDollarIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  DocumentArrowDownIcon,
  CalendarIcon,
  UserIcon,
  BanknotesIcon,
  ReceiptPercentIcon,
  ChartBarIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  AcademicCapIcon,
  TruckIcon,
  WrenchScrewdriverIcon,
  HeartIcon,
  ShieldCheckIcon,
  BeakerIcon,
  BookOpenIcon,
} from '@heroicons/react/24/outline';

// Types
interface ExpenseCategory {
  id: string;
  name: string;
  description: string;
  budgetLimit: number;
  currentSpend: number;
  remainingBudget: number;
  currency: string;
  department: string;
  status: 'Active' | 'Inactive' | 'Archived';
  requiresApproval: boolean;
  approvalLimit: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface Expense {
  id: string;
  categoryId: string;
  categoryName: string;
  title: string;
  description: string;
  amount: number;
  currency: string;
  date: string;
  vendor: string;
  vendorContact?: string;
  invoiceNumber?: string;
  receiptNumber?: string;
  paymentMethod: 'Cash' | 'Bank Transfer' | 'Credit Card' | 'Check' | 'Mobile Money';
  status: 'Draft' | 'Pending Approval' | 'Approved' | 'Paid' | 'Rejected' | 'Cancelled';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  department: string;
  requestedBy: string;
  approvedBy?: string;
  approvedDate?: string;
  paidDate?: string;
  dueDate?: string;
  recurring: boolean;
  recurringFrequency?: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Annually';
  recurringEndDate?: string;
  attachments: string[];
  tags: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface ExpenseBudget {
  id: string;
  department: string;
  category: string;
  budgetType: 'Monthly' | 'Quarterly' | 'Annually' | 'Project';
  totalBudget: number;
  allocatedBudget: number;
  spentAmount: number;
  remainingBudget: number;
  currency: string;
  period: string;
  startDate: string;
  endDate: string;
  status: 'Active' | 'Completed' | 'Exceeded' | 'Suspended';
  variance: number;
  variancePercentage: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface ExpenseReport {
  id: string;
  reportType: 'Summary' | 'Department' | 'Category' | 'Vendor' | 'Budget Analysis' | 'Monthly Comparison';
  title: string;
  description: string;
  generatedDate: string;
  period: string;
  totalExpenses: number;
  currency: string;
  status: 'Active' | 'Archived';
  data: any;
  createdBy: string;
  createdAt: string;
}

export const ExpenseManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'expenses' | 'categories' | 'budgets' | 'reports'>('expenses');
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [expenseCategories, setExpenseCategories] = useState<ExpenseCategory[]>([]);
  const [expenseBudgets, setExpenseBudgets] = useState<ExpenseBudget[]>([]);
  const [expenseReports, setExpenseReports] = useState<ExpenseReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [formData, setFormData] = useState<Partial<Expense | ExpenseCategory | ExpenseBudget>>({});

  // Mock data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock expense categories
      const mockCategories: ExpenseCategory[] = [
        {
          id: 'cat-001',
          name: 'Salaries & Wages',
          description: 'Staff salaries, wages, and related benefits',
          budgetLimit: 50000,
          currentSpend: 42000,
          remainingBudget: 8000,
          currency: 'USD',
          department: 'Administration',
          status: 'Active',
          requiresApproval: true,
          approvalLimit: 1000,
          createdBy: 'Admin',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-31T23:59:59Z',
        },
        {
          id: 'cat-002',
          name: 'Utilities',
          description: 'Electricity, water, internet, and other utilities',
          budgetLimit: 5000,
          currentSpend: 3200,
          remainingBudget: 1800,
          currency: 'USD',
          department: 'Administration',
          status: 'Active',
          requiresApproval: false,
          approvalLimit: 500,
          createdBy: 'Admin',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-31T23:59:59Z',
        },
        {
          id: 'cat-003',
          name: 'Teaching Materials',
          description: 'Books, stationery, and educational resources',
          budgetLimit: 10000,
          currentSpend: 7500,
          remainingBudget: 2500,
          currency: 'USD',
          department: 'Academic',
          status: 'Active',
          requiresApproval: true,
          approvalLimit: 200,
          createdBy: 'Admin',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-31T23:59:59Z',
        },
        {
          id: 'cat-004',
          name: 'Maintenance',
          description: 'Building maintenance, repairs, and renovations',
          budgetLimit: 8000,
          currentSpend: 6000,
          remainingBudget: 2000,
          currency: 'USD',
          department: 'Operations',
          status: 'Active',
          requiresApproval: true,
          approvalLimit: 1000,
          createdBy: 'Admin',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-31T23:59:59Z',
        },
        {
          id: 'cat-005',
          name: 'Student Services',
          description: 'Catering, transport, and student support services',
          budgetLimit: 15000,
          currentSpend: 12000,
          remainingBudget: 3000,
          currency: 'USD',
          department: 'Student Affairs',
          status: 'Active',
          requiresApproval: false,
          approvalLimit: 300,
          createdBy: 'Admin',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-31T23:59:59Z',
        },
      ];

      // Mock expenses
      const mockExpenses: Expense[] = [
        {
          id: 'exp-001',
          categoryId: 'cat-001',
          categoryName: 'Salaries & Wages',
          title: 'January Teacher Salaries',
          description: 'Monthly salaries for teaching staff',
          amount: 25000,
          currency: 'USD',
          date: '2024-01-31',
          vendor: 'School Payroll',
          invoiceNumber: 'PAY2024001',
          paymentMethod: 'Bank Transfer',
          status: 'Paid',
          priority: 'High',
          department: 'Administration',
          requestedBy: 'Mr. Admin',
          approvedBy: 'Mrs. Principal',
          approvedDate: '2024-01-25',
          paidDate: '2024-01-31',
          recurring: true,
          recurringFrequency: 'Monthly',
          attachments: ['payroll_report.pdf'],
          tags: ['salaries', 'monthly'],
          notes: 'January 2024 payroll processed',
          createdAt: '2024-01-20T00:00:00Z',
          updatedAt: '2024-01-31T15:00:00Z',
        },
        {
          id: 'exp-002',
          categoryId: 'cat-002',
          categoryName: 'Utilities',
          title: 'ZESA Electricity Bill',
          description: 'Monthly electricity bill for school premises',
          amount: 1200,
          currency: 'USD',
          date: '2024-01-28',
          vendor: 'ZESA',
          invoiceNumber: 'ZESA2024001',
          receiptNumber: 'RCP2024001',
          paymentMethod: 'Bank Transfer',
          status: 'Paid',
          priority: 'Medium',
          department: 'Administration',
          requestedBy: 'Mr. Admin',
          approvedBy: 'Mrs. Principal',
          approvedDate: '2024-01-26',
          paidDate: '2024-01-28',
          recurring: true,
          recurringFrequency: 'Monthly',
          attachments: ['zesa_bill.pdf'],
          tags: ['utilities', 'electricity'],
          notes: 'January electricity payment',
          createdAt: '2024-01-25T00:00:00Z',
          updatedAt: '2024-01-28T10:00:00Z',
        },
        {
          id: 'exp-003',
          categoryId: 'cat-003',
          categoryName: 'Teaching Materials',
          title: 'Mathematics Textbooks',
          description: 'Purchase of Form 1 mathematics textbooks',
          amount: 2500,
          currency: 'USD',
          date: '2024-01-20',
          vendor: 'Academic Books Ltd',
          invoiceNumber: 'AB2024001',
          receiptNumber: 'RCP2024002',
          paymentMethod: 'Bank Transfer',
          status: 'Approved',
          priority: 'Medium',
          department: 'Academic',
          requestedBy: 'Mrs. Johnson',
          approvedBy: 'Mr. Headmaster',
          approvedDate: '2024-01-22',
          dueDate: '2024-02-05',
          recurring: false,
          attachments: ['quotation.pdf', 'order_form.pdf'],
          tags: ['textbooks', 'mathematics'],
          notes: '50 copies of Form 1 Math textbooks',
          createdAt: '2024-01-18T00:00:00Z',
          updatedAt: '2024-01-22T14:00:00Z',
        },
        {
          id: 'exp-004',
          categoryId: 'cat-004',
          categoryName: 'Maintenance',
          title: 'Laboratory Equipment Repair',
          description: 'Repair of science laboratory equipment',
          amount: 800,
          currency: 'USD',
          date: '2024-01-25',
          vendor: 'Tech Repair Services',
          invoiceNumber: 'TRS2024001',
          paymentMethod: 'Cash',
          status: 'Pending Approval',
          priority: 'Medium',
          department: 'Operations',
          requestedBy: 'Mr. Smith',
          recurring: false,
          attachments: ['repair_quote.pdf'],
          tags: ['maintenance', 'laboratory'],
          notes: 'Urgent repair of microscopes and other equipment',
          createdAt: '2024-01-24T00:00:00Z',
          updatedAt: '2024-01-24T10:00:00Z',
        },
        {
          id: 'exp-005',
          categoryId: 'cat-005',
          categoryName: 'Student Services',
          title: 'School Bus Fuel',
          description: 'Monthly fuel for school bus operations',
          amount: 600,
          currency: 'USD',
          date: '2024-01-30',
          vendor: 'Total Service Station',
          invoiceNumber: 'TS2024001',
          receiptNumber: 'RCP2024003',
          paymentMethod: 'Mobile Money',
          status: 'Draft',
          priority: 'Low',
          department: 'Student Affairs',
          requestedBy: 'Mr. Driver',
          recurring: true,
          recurringFrequency: 'Monthly',
          attachments: ['fuel_receipt.pdf'],
          tags: ['transport', 'fuel'],
          notes: 'January fuel expenses for school bus',
          createdAt: '2024-01-30T08:00:00Z',
          updatedAt: '2024-01-30T08:00:00Z',
        },
      ];

      // Mock expense budgets
      const mockBudgets: ExpenseBudget[] = [
        {
          id: 'bud-001',
          department: 'Administration',
          category: 'Salaries & Wages',
          budgetType: 'Monthly',
          totalBudget: 50000,
          allocatedBudget: 50000,
          spentAmount: 42000,
          remainingBudget: 8000,
          currency: 'USD',
          period: 'January 2024',
          startDate: '2024-01-01',
          endDate: '2024-01-31',
          status: 'Active',
          variance: -8000,
          variancePercentage: -16,
          createdBy: 'Admin',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-31T23:59:59Z',
        },
        {
          id: 'bud-002',
          department: 'Academic',
          category: 'Teaching Materials',
          budgetType: 'Quarterly',
          totalBudget: 30000,
          allocatedBudget: 30000,
          spentAmount: 7500,
          remainingBudget: 22500,
          currency: 'USD',
          period: 'Q1 2024',
          startDate: '2024-01-01',
          endDate: '2024-03-31',
          status: 'Active',
          variance: -22500,
          variancePercentage: -75,
          createdBy: 'Admin',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-31T23:59:59Z',
        },
        {
          id: 'bud-003',
          department: 'Operations',
          category: 'Maintenance',
          budgetType: 'Annually',
          totalBudget: 96000,
          allocatedBudget: 96000,
          spentAmount: 6000,
          remainingBudget: 90000,
          currency: 'USD',
          period: '2024',
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          status: 'Active',
          variance: -90000,
          variancePercentage: -93.75,
          createdBy: 'Admin',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-31T23:59:59Z',
        },
      ];

      // Mock expense reports
      const mockReports: ExpenseReport[] = [
        {
          id: 'rep-001',
          reportType: 'Summary',
          title: 'Monthly Expense Summary',
          description: 'Complete expense summary for January 2024',
          generatedDate: '2024-01-31',
          period: 'January 2024',
          totalExpenses: 42500,
          currency: 'USD',
          status: 'Active',
          data: {
            totalExpenses: 42500,
            totalBudget: 88000,
            utilizationRate: 48.3,
            topCategory: 'Salaries & Wages',
            topDepartment: 'Administration',
          },
          createdBy: 'Admin',
          createdAt: '2024-01-31T23:59:59Z',
        },
        {
          id: 'rep-002',
          reportType: 'Department',
          title: 'Department-wise Expense Analysis',
          description: 'Expense breakdown by department',
          generatedDate: '2024-02-01',
          period: 'January 2024',
          totalExpenses: 42500,
          currency: 'USD',
          status: 'Active',
          data: {
            administration: 26200,
            academic: 2500,
            operations: 800,
            studentAffairs: 600,
          },
          createdBy: 'Admin',
          createdAt: '2024-02-01T00:00:00Z',
        },
      ];
      
      setExpenseCategories(mockCategories);
      setExpenses(mockExpenses);
      setExpenseBudgets(mockBudgets);
      setExpenseReports(mockReports);
      setLoading(false);
    };

    loadData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
      case 'Approved':
      case 'Paid':
        return 'text-success-600 bg-success-100';
      case 'Inactive':
      case 'Draft':
        return 'text-gray-600 bg-gray-100';
      case 'Pending Approval':
        return 'text-warning-600 bg-warning-100';
      case 'Completed':
        return 'text-blue-600 bg-blue-100';
      case 'Exceeded':
      case 'Rejected':
      case 'Cancelled':
      case 'Suspended':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent':
        return 'text-red-600 bg-red-100';
      case 'High':
        return 'text-orange-600 bg-orange-100';
      case 'Medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'Low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'salaries & wages':
        return <UserGroupIcon className="w-4 h-4" />;
      case 'utilities':
        return <BeakerIcon className="w-4 h-4" />;
      case 'teaching materials':
        return <BookOpenIcon className="w-4 h-4" />;
      case 'maintenance':
        return <WrenchScrewdriverIcon className="w-4 h-4" />;
      case 'student services':
        return <HeartIcon className="w-4 h-4" />;
      case 'security':
        return <ShieldCheckIcon className="w-4 h-4" />;
      case 'transport':
        return <TruckIcon className="w-4 h-4" />;
      case 'academic':
        return <AcademicCapIcon className="w-4 h-4" />;
      default:
        return <CurrencyDollarIcon className="w-4 h-4" />;
    }
  };

  const getDepartmentIcon = (department: string) => {
    switch (department.toLowerCase()) {
      case 'administration':
        return <BuildingOfficeIcon className="w-4 h-4" />;
      case 'academic':
        return <AcademicCapIcon className="w-4 h-4" />;
      case 'operations':
        return <WrenchScrewdriverIcon className="w-4 h-4" />;
      case 'student affairs':
        return <UserGroupIcon className="w-4 h-4" />;
      default:
        return <BuildingOfficeIcon className="w-4 h-4" />;
    }
  };

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.vendor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === 'all' || expense.department === filterDepartment;
    const matchesStatus = filterStatus === 'all' || expense.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || expense.categoryId === filterCategory;
    return matchesSearch && matchesDepartment && matchesStatus && matchesCategory;
  });

  const filteredCategories = expenseCategories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         category.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === 'all' || category.department === filterDepartment;
    const matchesStatus = filterStatus === 'all' || category.status === filterStatus;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const filteredBudgets = expenseBudgets.filter(budget => {
    const matchesSearch = budget.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         budget.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === 'all' || budget.department === filterDepartment;
    const matchesStatus = filterStatus === 'all' || budget.status === filterStatus;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const handleCreateExpense = () => {
    // In real app, this would call API
    const newExpense: Expense = {
      id: `exp-${Date.now()}`,
      categoryId: formData.categoryId || 'cat-001',
      categoryName: formData.categoryName || 'General',
      title: formData.title || 'New Expense',
      description: formData.description || '',
      amount: formData.amount || 0,
      currency: formData.currency || 'USD',
      date: formData.date || new Date().toISOString().split('T')[0],
      vendor: formData.vendor || 'Unknown',
      invoiceNumber: formData.invoiceNumber,
      receiptNumber: formData.receiptNumber,
      paymentMethod: formData.paymentMethod as Expense['paymentMethod'] || 'Bank Transfer',
      status: 'Draft',
      priority: formData.priority as Expense['priority'] || 'Medium',
      department: formData.department || 'Administration',
      requestedBy: formData.requestedBy || 'Current User',
      recurring: formData.recurring || false,
      recurringFrequency: formData.recurringFrequency as Expense['recurringFrequency'],
      attachments: formData.attachments as string[] || [],
      tags: formData.tags as string[] || [],
      notes: formData.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setExpenses([...expenses, newExpense]);
    setShowCreateModal(false);
    setFormData({});
  };

  const handleCreateCategory = () => {
    // In real app, this would call API
    const newCategory: ExpenseCategory = {
      id: `cat-${Date.now()}`,
      name: formData.name || 'New Category',
      description: formData.description || '',
      budgetLimit: formData.budgetLimit || 0,
      currentSpend: 0,
      remainingBudget: formData.budgetLimit || 0,
      currency: formData.currency || 'USD',
      department: formData.department || 'Administration',
      status: 'Active',
      requiresApproval: formData.requiresApproval || false,
      approvalLimit: formData.approvalLimit || 0,
      createdBy: 'Current User',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setExpenseCategories([...expenseCategories, newCategory]);
    setShowCategoryModal(false);
    setFormData({});
  };

  const handleCreateBudget = () => {
    // In real app, this would call API
    const newBudget: ExpenseBudget = {
      id: `bud-${Date.now()}`,
      department: formData.department || 'Administration',
      category: formData.category || 'General',
      budgetType: formData.budgetType as ExpenseBudget['budgetType'] || 'Monthly',
      totalBudget: formData.totalBudget || 0,
      allocatedBudget: formData.allocatedBudget || formData.totalBudget || 0,
      spentAmount: 0,
      remainingBudget: formData.totalBudget || 0,
      currency: formData.currency || 'USD',
      period: formData.period || 'Current Period',
      startDate: formData.startDate || new Date().toISOString().split('T')[0],
      endDate: formData.endDate || new Date().toISOString().split('T')[0],
      status: 'Active',
      variance: 0,
      variancePercentage: 0,
      createdBy: 'Current User',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setExpenseBudgets([...expenseBudgets, newBudget]);
    setShowBudgetModal(false);
    setFormData({});
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
              Expense Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Track expenses, manage budgets, and control spending across departments
            </p>
          </div>
          <div className="flex gap-3">
            <button className="btn btn-secondary">
              <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
              Export Reports
            </button>
            {activeTab === 'expenses' && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn btn-primary"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Add Expense
              </button>
            )}
            {activeTab === 'categories' && (
              <button
                onClick={() => setShowCategoryModal(true)}
                className="btn btn-primary"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Add Category
              </button>
            )}
            {activeTab === 'budgets' && (
              <button
                onClick={() => setShowBudgetModal(true)}
                className="btn btn-primary"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Add Budget
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="flex space-x-8">
          {[
            { id: 'expenses', label: 'Expenses', icon: CurrencyDollarIcon },
            { id: 'categories', label: 'Categories', icon: ReceiptPercentIcon },
            { id: 'budgets', label: 'Budgets', icon: ChartBarIcon },
            { id: 'reports', label: 'Reports', icon: DocumentArrowDownIcon },
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
                  placeholder="Search expenses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="form-input"
              >
                <option value="all">All Departments</option>
                <option value="Administration">Administration</option>
                <option value="Academic">Academic</option>
                <option value="Operations">Operations</option>
                <option value="Student Affairs">Student Affairs</option>
              </select>
              {activeTab === 'expenses' && (
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="form-input"
                >
                  <option value="all">All Categories</option>
                  {expenseCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              )}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="form-input"
              >
                <option value="all">All Status</option>
                <option value="Active">Active</option>
                <option value="Draft">Draft</option>
                <option value="Pending Approval">Pending Approval</option>
                <option value="Approved">Approved</option>
                <option value="Paid">Paid</option>
                <option value="Rejected">Rejected</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Completed">Completed</option>
                <option value="Exceeded">Exceeded</option>
                <option value="Suspended">Suspended</option>
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
      {activeTab === 'expenses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExpenses.map((expense, index) => (
            <motion.div
              key={expense.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card card-hover"
            >
              <div className="card-body">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {expense.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {expense.vendor}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(expense.status)}`}>
                    {expense.status}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Amount</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {expense.currency} {expense.amount.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Category</span>
                    <div className="flex items-center gap-1">
                      {getCategoryIcon(expense.categoryName)}
                      <span className="text-sm text-gray-500 dark:text-gray-500">
                        {expense.categoryName}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Department</span>
                    <div className="flex items-center gap-1">
                      {getDepartmentIcon(expense.department)}
                      <span className="text-sm text-gray-500 dark:text-gray-500">
                        {expense.department}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Priority</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(expense.priority)}`}>
                      {expense.priority}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Date</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {new Date(expense.date).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Payment Method</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {expense.paymentMethod}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Requested By</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {expense.requestedBy}
                    </span>
                  </div>

                  {expense.approvedBy && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Approved By</span>
                      <span className="text-sm text-gray-500 dark:text-gray-500">
                        {expense.approvedBy}
                      </span>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1">
                    {expense.recurring && (
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded">
                        Recurring ({expense.recurringFrequency})
                      </span>
                    )}
                    {expense.attachments.length > 0 && (
                      <span className="text-xs px-2 py-1 bg-purple-100 text-purple-600 rounded">
                        {expense.attachments.length} Attachments
                      </span>
                    )}
                    {expense.tags.map((tag, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {expense.description && (
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {expense.description}
                    </div>
                  )}

                  {expense.notes && (
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Notes:</span> {expense.notes}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-sm text-gray-500 dark:text-gray-500">
                    Created on {new Date(expense.createdAt).toLocaleDateString()}
                  </div>
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

      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card card-hover"
            >
              <div className="card-body">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(category.name)}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {category.department}
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(category.status)}`}>
                    {category.status}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Budget Limit</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {category.currency} {category.budgetLimit.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Current Spend</span>
                    <span className="text-sm font-medium text-orange-600">
                      {category.currency} {category.currentSpend.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Remaining</span>
                    <span className={`text-sm font-medium ${category.remainingBudget > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {category.currency} {category.remainingBudget.toLocaleString()}
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        category.currentSpend / category.budgetLimit > 0.9 ? 'bg-red-600' :
                        category.currentSpend / category.budgetLimit > 0.7 ? 'bg-yellow-600' : 'bg-green-600'
                      }`}
                      style={{ width: `${Math.min((category.currentSpend / category.budgetLimit) * 100, 100)}%` }}
                    />
                  </div>

                  <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                    {((category.currentSpend / category.budgetLimit) * 100).toFixed(1)}% utilized
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Approval Required</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${category.requiresApproval ? 'text-red-600 bg-red-100' : 'text-green-600 bg-green-100'}`}>
                      {category.requiresApproval ? 'Yes' : 'No'}
                    </span>
                  </div>

                  {category.requiresApproval && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Approval Limit</span>
                      <span className="text-sm text-gray-500 dark:text-gray-500">
                        {category.currency} {category.approvalLimit.toLocaleString()}
                      </span>
                    </div>
                  )}

                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {category.description}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-sm text-gray-500 dark:text-gray-500">
                    Created by {category.createdBy}
                  </div>
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

      {activeTab === 'budgets' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBudgets.map((budget, index) => (
            <motion.div
              key={budget.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card card-hover"
            >
              <div className="card-body">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {budget.department}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {budget.category}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(budget.status)}`}>
                    {budget.status}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Total Budget</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {budget.currency} {budget.totalBudget.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Allocated</span>
                    <span className="text-sm font-medium text-blue-600">
                      {budget.currency} {budget.allocatedBudget.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Spent</span>
                    <span className="text-sm font-medium text-orange-600">
                      {budget.currency} {budget.spentAmount.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Remaining</span>
                    <span className={`text-sm font-medium ${budget.remainingBudget > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {budget.currency} {budget.remainingBudget.toLocaleString()}
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        budget.spentAmount / budget.totalBudget > 0.9 ? 'bg-red-600' :
                        budget.spentAmount / budget.totalBudget > 0.7 ? 'bg-yellow-600' : 'bg-green-600'
                      }`}
                      style={{ width: `${Math.min((budget.spentAmount / budget.totalBudget) * 100, 100)}%` }}
                    />
                  </div>

                  <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                    {((budget.spentAmount / budget.totalBudget) * 100).toFixed(1)}% utilized
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Budget Type</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {budget.budgetType}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Period</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {budget.period}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Variance</span>
                    <span className={`text-sm font-medium ${budget.variance < 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {budget.currency} {Math.abs(budget.variance).toLocaleString()} ({budget.variancePercentage.toFixed(1)}%)
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Period</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {new Date(budget.startDate).toLocaleDateString()} - {new Date(budget.endDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-sm text-gray-500 dark:text-gray-500">
                    Created by {budget.createdBy}
                  </div>
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

      {activeTab === 'reports' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {expenseReports.map((report, index) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card card-hover"
            >
              <div className="card-body">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {report.title}
                    </h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(report.status)}`}>
                      {report.status}
                    </span>
                  </div>
                  <ChartBarIcon className="w-6 h-6 text-gray-400" />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Report Type</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {report.reportType}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Period</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {report.period}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Total Expenses</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {report.currency} {report.totalExpenses.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Generated</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {new Date(report.generatedDate).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {report.description}
                  </div>

                  {report.data && (
                    <div className="space-y-1 text-sm">
                      {Object.entries(report.data).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}:
                          </span>
                          <span className="text-gray-900 dark:text-white font-medium">
                            {typeof value === 'number' ? 
                              (key.toLowerCase().includes('rate') || key.toLowerCase().includes('percentage') ? `${value}%` : 
                               key.toLowerCase().includes('amount') || key.toLowerCase().includes('budget') || key.toLowerCase().includes('expenses') ? `${report.currency} ${value.toLocaleString()}` : 
                               value.toLocaleString()) : 
                              value}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-sm text-gray-500 dark:text-gray-500">
                    Generated by {report.createdBy}
                  </div>
                  <div className="flex gap-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      <DocumentArrowDownIcon className="w-4 h-4" />
                    </button>
                    <button className="text-blue-600 hover:text-blue-800">
                      <EnvelopeIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Expense Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full"
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Create Expense
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.categoryId || ''}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="form-input"
                  >
                    <option value="">Select Category</option>
                    {expenseCategories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="form-input"
                    placeholder="Expense title..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="form-input"
                    placeholder="Expense description..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Amount
                    </label>
                    <input
                      type="number"
                      value={formData.amount || ''}
                      onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                      className="form-input"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Currency
                    </label>
                    <select
                      value={formData.currency || 'USD'}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                      className="form-input"
                    >
                      <option value="USD">USD</option>
                      <option value="ZWL">ZWL</option>
                      <option value="ZAR">ZAR</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      value={formData.date || ''}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="form-input"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Priority
                    </label>
                    <select
                      value={formData.priority || ''}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value as Expense['priority'] })}
                      className="form-input"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Vendor
                  </label>
                  <input
                    type="text"
                    value={formData.vendor || ''}
                    onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                    className="form-input"
                    placeholder="Vendor name..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Payment Method
                  </label>
                  <select
                    value={formData.paymentMethod || ''}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as Expense['paymentMethod'] })}
                    className="form-input"
                  >
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Check">Check</option>
                    <option value="Mobile Money">Mobile Money</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Requested By
                  </label>
                  <input
                    type="text"
                    value={formData.requestedBy || ''}
                    onChange={(e) => setFormData({ ...formData, requestedBy: e.target.value })}
                    className="form-input"
                    placeholder="Your name..."
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.recurring || false}
                    onChange={(e) => setFormData({ ...formData, recurring: e.target.checked })}
                    className="form-checkbox mr-2"
                  />
                  <label className="text-sm text-gray-700 dark:text-gray-300">
                    Recurring Expense
                  </label>
                </div>

                {formData.recurring && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Frequency
                    </label>
                    <select
                      value={formData.recurringFrequency || ''}
                      onChange={(e) => setFormData({ ...formData, recurringFrequency: e.target.value as Expense['recurringFrequency'] })}
                      className="form-input"
                    >
                      <option value="Daily">Daily</option>
                      <option value="Weekly">Weekly</option>
                      <option value="Monthly">Monthly</option>
                      <option value="Quarterly">Quarterly</option>
                      <option value="Annually">Annually</option>
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes || ''}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    className="form-input"
                    placeholder="Additional notes..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateExpense}
                  className="btn btn-primary"
                >
                  Create Expense
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Create Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full"
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Create Expense Category
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category Name
                  </label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="form-input"
                    placeholder="Category name..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="form-input"
                    placeholder="Category description..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Budget Limit
                    </label>
                    <input
                      type="number"
                      value={formData.budgetLimit || ''}
                      onChange={(e) => setFormData({ ...formData, budgetLimit: parseFloat(e.target.value) || 0 })}
                      className="form-input"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Department
                    </label>
                    <select
                      value={formData.department || ''}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="form-input"
                    >
                      <option value="Administration">Administration</option>
                      <option value="Academic">Academic</option>
                      <option value="Operations">Operations</option>
                      <option value="Student Affairs">Student Affairs</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.requiresApproval || false}
                    onChange={(e) => setFormData({ ...formData, requiresApproval: e.target.checked })}
                    className="form-checkbox mr-2"
                  />
                  <label className="text-sm text-gray-700 dark:text-gray-300">
                    Requires Approval
                  </label>
                </div>

                {formData.requiresApproval && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Approval Limit
                    </label>
                    <input
                      type="number"
                      value={formData.approvalLimit || ''}
                      onChange={(e) => setFormData({ ...formData, approvalLimit: parseFloat(e.target.value) || 0 })}
                      className="form-input"
                      placeholder="0.00"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowCategoryModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateCategory}
                  className="btn btn-primary"
                >
                  Create Category
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Create Budget Modal */}
      {showBudgetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full"
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Create Budget
              </h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Department
                    </label>
                    <select
                      value={formData.department || ''}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="form-input"
                    >
                      <option value="Administration">Administration</option>
                      <option value="Academic">Academic</option>
                      <option value="Operations">Operations</option>
                      <option value="Student Affairs">Student Affairs</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Category
                    </label>
                    <input
                      type="text"
                      value={formData.category || ''}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="form-input"
                      placeholder="Category..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Budget Type
                    </label>
                    <select
                      value={formData.budgetType || ''}
                      onChange={(e) => setFormData({ ...formData, budgetType: e.target.value as ExpenseBudget['budgetType'] })}
                      className="form-input"
                    >
                      <option value="Monthly">Monthly</option>
                      <option value="Quarterly">Quarterly</option>
                      <option value="Annually">Annually</option>
                      <option value="Project">Project</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Total Budget
                    </label>
                    <input
                      type="number"
                      value={formData.totalBudget || ''}
                      onChange={(e) => setFormData({ ...formData, totalBudget: parseFloat(e.target.value) || 0 })}
                      className="form-input"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Period
                  </label>
                  <input
                    type="text"
                    value={formData.period || ''}
                    onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                    className="form-input"
                    placeholder="e.g., January 2024, Q1 2024, 2024"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={formData.startDate || ''}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="form-input"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={formData.endDate || ''}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowBudgetModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateBudget}
                  className="btn btn-primary"
                >
                  Create Budget
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
