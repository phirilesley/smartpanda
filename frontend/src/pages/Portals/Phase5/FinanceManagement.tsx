import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CurrencyDollarIcon,
  BanknotesIcon,
  CreditCardIcon,
  ChartBarIcon,
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
  ReceiptIcon,
  CalculatorIcon,
  TableCellsIcon,
  FolderIcon,
  ArchiveBoxIcon,
  CogIcon,
  FlagIcon,
  BookmarkIcon,
  TagIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  PrinterIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  AcademicCapIcon,
  HomeIcon,
  ShoppingCartIcon,
  GiftIcon,
  PiggyBankIcon,
  CashIcon,
  WalletIcon,
  CreditCardIcon as CreditCardSolid,
  BuildingLibraryIcon,
  ScaleIcon,
  DocumentArrowDownIcon,
  DocumentArrowUpIcon,
  PaperAirplaneIcon,
  InboxIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  IdentificationIcon,
} from '@heroicons/react/24/outline';

// Types
interface Transaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  currency: string;
  date: string;
  description: string;
  reference: string;
  status: 'pending' | 'completed' | 'failed';
  paymentMethod: string;
  department?: string;
  studentId?: string;
  vendorId?: string;
  createdBy: string;
  approvedBy?: string;
  attachments: string[];
  tags: string[];
}

interface Budget {
  id: string;
  department: string;
  category: string;
  allocatedAmount: number;
  spentAmount: number;
  remainingAmount: number;
  period: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'pending';
  manager: string;
  notes: string;
  lastUpdated: string;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  type: 'sales' | 'purchase';
  vendorId?: string;
  customerId?: string;
  amount: number;
  tax: number;
  total: number;
  dueDate: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  items: InvoiceItem[];
  notes: string;
  createdAt: string;
  paidAt?: string;
}

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  tax: number;
}

interface Expense {
  id: string;
  title: string;
  category: string;
  amount: number;
  date: string;
  description: string;
  submittedBy: string;
  approvedBy?: string;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  receipt: string;
  department: string;
  project?: string;
  reimbursable: boolean;
  tags: string[];
}

interface Revenue {
  id: string;
  source: string;
  category: string;
  amount: number;
  date: string;
  description: string;
  studentId?: string;
  courseId?: string;
  status: 'confirmed' | 'pending' | 'refunded';
  paymentMethod: string;
  invoiceId?: string;
  tags: string[];
}

interface Payroll {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  position: string;
  baseSalary: number;
  allowances: number;
  deductions: number;
  overtime: number;
  bonus: number;
  netSalary: number;
  payPeriod: string;
  payDate: string;
  status: 'draft' | 'processed' | 'paid';
  bankAccount: string;
  taxInfo: string;
}

interface TaxRecord {
  id: string;
  type: string;
  period: string;
  dueDate: string;
  amount: number;
  status: 'pending' | 'filed' | 'paid' | 'overdue';
  description: string;
  jurisdiction: string;
  filedAt?: string;
  paidAt?: string;
  attachments: string[];
}

interface FinancialReport {
  id: string;
  name: string;
  type: string;
  period: string;
  generatedAt: string;
  generatedBy: string;
  status: 'generating' | 'completed' | 'failed';
  fileSize: string;
  downloadUrl: string;
  parameters: Record<string, any>;
}

export const FinanceManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'transactions' | 'budget' | 'invoices' | 'expenses' | 'revenue' | 'payroll' | 'tax' | 'reports'>('dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [revenue, setRevenue] = useState<Revenue[]>([]);
  const [payroll, setPayroll] = useState<Payroll[]>([]);
  const [taxRecords, setTaxRecords] = useState<TaxRecord[]>([]);
  const [financialReports, setFinancialReports] = useState<FinancialReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

  useEffect(() => {
    // Load mock data
    setTimeout(() => {
      setTransactions([
        {
          id: '1',
          type: 'income',
          category: 'Tuition Fees',
          amount: 15000,
          currency: 'USD',
          date: '2024-01-15',
          description: 'Semester tuition payment - John Doe',
          reference: 'TUITION-2024-001',
          status: 'completed',
          paymentMethod: 'Bank Transfer',
          department: 'Academics',
          studentId: 'STU001',
          createdBy: 'Sarah Johnson',
          attachments: ['receipt.pdf'],
          tags: ['tuition', 'semester-1'],
        },
        {
          id: '2',
          type: 'expense',
          category: 'Salaries',
          amount: 8500,
          currency: 'USD',
          date: '2024-01-15',
          description: 'Monthly teacher salaries',
          reference: 'SALARY-2024-01',
          status: 'completed',
          paymentMethod: 'Bank Transfer',
          department: 'HR',
          createdBy: 'Michael Chen',
          approvedBy: 'David Wilson',
          attachments: ['payroll.pdf'],
          tags: ['salaries', 'monthly'],
        },
        {
          id: '3',
          type: 'expense',
          category: 'Supplies',
          amount: 1200,
          currency: 'USD',
          date: '2024-01-16',
          description: 'Office supplies and equipment',
          reference: 'SUP-2024-016',
          status: 'pending',
          paymentMethod: 'Credit Card',
          department: 'Administration',
          vendorId: 'VEN001',
          createdBy: 'Emily Davis',
          attachments: ['invoice.pdf'],
          tags: ['supplies', 'office'],
        },
      ]);

      setBudgets([
        {
          id: '1',
          department: 'Academics',
          category: 'Teaching Materials',
          allocatedAmount: 50000,
          spentAmount: 15000,
          remainingAmount: 35000,
          period: 'Q1 2024',
          startDate: '2024-01-01',
          endDate: '2024-03-31',
          status: 'active',
          manager: 'Dr. Sarah Johnson',
          notes: 'Budget for textbooks and digital resources',
          lastUpdated: '2024-01-15',
        },
        {
          id: '2',
          department: 'Operations',
          category: 'Facilities Maintenance',
          allocatedAmount: 25000,
          spentAmount: 18000,
          remainingAmount: 7000,
          period: 'Q1 2024',
          startDate: '2024-01-01',
          endDate: '2024-03-31',
          status: 'active',
          manager: 'Michael Chen',
          notes: 'Maintenance and repairs budget',
          lastUpdated: '2024-01-14',
        },
      ]);

      setInvoices([
        {
          id: '1',
          invoiceNumber: 'INV-2024-001',
          type: 'sales',
          customerId: 'CUST001',
          amount: 15000,
          tax: 1500,
          total: 16500,
          dueDate: '2024-02-15',
          status: 'sent',
          items: [
            {
              id: '1',
              description: 'Semester Tuition Fee',
              quantity: 1,
              unitPrice: 15000,
              total: 15000,
              tax: 1500,
            },
          ],
          notes: 'Tuition for Spring 2024 semester',
          createdAt: '2024-01-15',
        },
        {
          id: '2',
          invoiceNumber: 'INV-2024-002',
          type: 'purchase',
          vendorId: 'VEN001',
          amount: 2500,
          tax: 250,
          total: 2750,
          dueDate: '2024-02-01',
          status: 'paid',
          items: [
            {
              id: '1',
              description: 'Office Furniture',
              quantity: 5,
              unitPrice: 500,
              total: 2500,
              tax: 250,
            },
          ],
          notes: 'New desks for administration office',
          createdAt: '2024-01-10',
          paidAt: '2024-01-12',
        },
      ]);

      setExpenses([
        {
          id: '1',
          title: 'Teacher Training Workshop',
          category: 'Professional Development',
          amount: 3500,
          date: '2024-01-12',
          description: 'Advanced teaching methodologies workshop',
          submittedBy: 'Sarah Johnson',
          approvedBy: 'David Wilson',
          status: 'approved',
          receipt: 'receipt.pdf',
          department: 'Academics',
          reimbursable: false,
          tags: ['training', 'development'],
        },
        {
          id: '2',
          title: 'School Event Supplies',
          category: 'Events',
          amount: 800,
          date: '2024-01-14',
          description: 'Decorations and catering for school fair',
          submittedBy: 'Emily Davis',
          status: 'pending',
          receipt: 'invoice.pdf',
          department: 'Administration',
          reimbursable: false,
          tags: ['event', 'supplies'],
        },
      ]);

      setRevenue([
        {
          id: '1',
          source: 'Tuition Fees',
          category: 'Academic',
          amount: 15000,
          date: '2024-01-15',
          description: 'Spring semester tuition',
          studentId: 'STU001',
          status: 'confirmed',
          paymentMethod: 'Bank Transfer',
          tags: ['tuition', 'spring-2024'],
        },
        {
          id: '2',
          source: 'Book Sales',
          category: 'Ancillary',
          amount: 450,
          date: '2024-01-16',
          description: 'Textbook sales',
          status: 'confirmed',
          paymentMethod: 'Cash',
          tags: ['books', 'sales'],
        },
      ]);

      setPayroll([
        {
          id: '1',
          employeeId: 'EMP001',
          employeeName: 'Sarah Johnson',
          department: 'Academics',
          position: 'Senior Teacher',
          baseSalary: 5000,
          allowances: 500,
          deductions: 800,
          overtime: 300,
          bonus: 200,
          netSalary: 5200,
          payPeriod: 'January 2024',
          payDate: '2024-01-31',
          status: 'processed',
          bankAccount: '****1234',
          taxInfo: 'TX-12345',
        },
        {
          id: '2',
          employeeId: 'EMP002',
          employeeName: 'Michael Chen',
          department: 'Operations',
          position: 'Operations Manager',
          baseSalary: 6000,
          allowances: 600,
          deductions: 950,
          overtime: 200,
          bonus: 300,
          netSalary: 6150,
          payPeriod: 'January 2024',
          payDate: '2024-01-31',
          status: 'draft',
          bankAccount: '****5678',
          taxInfo: 'TX-67890',
        },
      ]);

      setTaxRecords([
        {
          id: '1',
          type: 'VAT',
          period: 'Q4 2023',
          dueDate: '2024-01-20',
          amount: 2500,
          status: 'pending',
          description: 'Quarterly VAT return',
          jurisdiction: 'Federal',
          attachments: ['vat-return.pdf'],
        },
        {
          id: '2',
          type: 'Income Tax',
          period: '2023 Annual',
          dueDate: '2024-03-31',
          amount: 15000,
          status: 'pending',
          description: 'Annual income tax filing',
          jurisdiction: 'Federal',
          attachments: ['tax-docs.pdf'],
        },
      ]);

      setFinancialReports([
        {
          id: '1',
          name: 'Monthly Financial Summary',
          type: 'Summary',
          period: 'January 2024',
          generatedAt: '2024-02-01',
          generatedBy: 'Sarah Johnson',
          status: 'completed',
          fileSize: '2.5 MB',
          downloadUrl: '/reports/financial-summary-jan-2024.pdf',
          parameters: { includeCharts: true, format: 'PDF' },
        },
        {
          id: '2',
          name: 'Budget vs Actual Report',
          type: 'Budget Analysis',
          period: 'Q1 2024',
          generatedAt: '2024-01-15',
          generatedBy: 'Michael Chen',
          status: 'completed',
          fileSize: '1.8 MB',
          downloadUrl: '/reports/budget-vs-actual-q1-2024.pdf',
          parameters: { departments: ['all'], format: 'PDF' },
        },
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'paid':
      case 'active':
      case 'confirmed':
      case 'approved':
      case 'filed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending':
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'failed':
      case 'overdue':
      case 'rejected':
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'sent':
      case 'processing':
      case 'generating':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getTransactionTypeColor = (type: string) => {
    return type === 'income' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Finance Management</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage financial operations, budgets, and reporting</p>
      </div>

      {/* Alert */}
      <div className="mb-6 bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <div className="flex items-center">
          <BellIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-3" />
          <div>
            <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Pending Approvals</h3>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">You have 3 expenses and 2 invoices awaiting approval</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: ChartBarIcon },
            { id: 'transactions', label: 'Transactions', icon: CurrencyDollarIcon },
            { id: 'budget', label: 'Budget', icon: CalculatorIcon },
            { id: 'invoices', label: 'Invoices', icon: ReceiptIcon },
            { id: 'expenses', label: 'Expenses', icon: CreditCardIcon },
            { id: 'revenue', label: 'Revenue', icon: BanknotesIcon },
            { id: 'payroll', label: 'Payroll', icon: UserGroupIcon },
            { id: 'tax', label: 'Tax', icon: ScaleIcon },
            { id: 'reports', label: 'Reports', icon: DocumentTextIcon },
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
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">$45,230</p>
                </div>
                <div className="bg-green-100 dark:bg-green-900 rounded-full p-3">
                  <BanknotesIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-green-600 dark:text-green-400">+12%</span>
                <span className="text-gray-500 dark:text-gray-400 ml-2">vs last month</span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Expenses</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">$32,150</p>
                </div>
                <div className="bg-red-100 dark:bg-red-900 rounded-full p-3">
                  <CreditCardIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-red-600 dark:text-red-400">+8%</span>
                <span className="text-gray-500 dark:text-gray-400 ml-2">vs last month</span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Net Profit</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">$13,080</p>
                </div>
                <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-3">
                  <CurrencyDollarIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-green-600 dark:text-green-400">+18%</span>
                <span className="text-gray-500 dark:text-gray-400 ml-2">vs last month</span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Invoices</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">$8,450</p>
                </div>
                <div className="bg-yellow-100 dark:bg-yellow-900 rounded-full p-3">
                  <ReceiptIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-yellow-600 dark:text-yellow-400">3 pending</span>
                <span className="text-gray-500 dark:text-gray-400 ml-2">invoices</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Transactions</h2>
                <div className="flex items-center space-x-3">
                  <button className="flex items-center px-3 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add Transaction
                  </button>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{transaction.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{transaction.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{transaction.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`font-medium ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                          {transaction.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => setSelectedTransaction(transaction)}
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

        {activeTab === 'budget' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {budgets.map((budget) => (
              <div key={budget.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{budget.department}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(budget.status)}`}>
                    {budget.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{budget.category}</p>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Allocated</span>
                    <span className="font-medium text-gray-900 dark:text-white">${budget.allocatedAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Spent</span>
                    <span className="font-medium text-gray-900 dark:text-white">${budget.spentAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Remaining</span>
                    <span className="font-medium text-green-600 dark:text-green-400">${budget.remainingAmount.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full"
                      style={{ width: `${(budget.spentAmount / budget.allocatedAmount) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Manager: {budget.manager}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Period: {budget.period}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'invoices' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{invoice.invoiceNumber}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(invoice.status)}`}>
                    {invoice.status}
                  </span>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Type</span>
                    <span className="font-medium text-gray-900 dark:text-white capitalize">{invoice.type}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Amount</span>
                    <span className="font-medium text-gray-900 dark:text-white">${invoice.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Tax</span>
                    <span className="font-medium text-gray-900 dark:text-white">${invoice.tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Total</span>
                    <span className="font-medium text-lg text-primary-600 dark:text-primary-400">${invoice.total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Due Date</span>
                    <span className="font-medium text-gray-900 dark:text-white">{invoice.dueDate}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setSelectedInvoice(invoice)}
                    className="flex items-center text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                  >
                    <EyeIcon className="w-4 h-4 mr-1" />
                    View Details
                  </button>
                  <div className="flex items-center space-x-2">
                    <button className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300">
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300">
                      <ArrowDownTrayIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'expenses' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {expenses.map((expense) => (
              <div key={expense.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{expense.title}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(expense.status)}`}>
                    {expense.status}
                  </span>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Category</span>
                    <span className="font-medium text-gray-900 dark:text-white">{expense.category}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Amount</span>
                    <span className="font-medium text-lg text-red-600 dark:text-red-400">${expense.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Department</span>
                    <span className="font-medium text-gray-900 dark:text-white">{expense.department}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Submitted By</span>
                    <span className="font-medium text-gray-900 dark:text-white">{expense.submittedBy}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Date</span>
                    <span className="font-medium text-gray-900 dark:text-white">{expense.date}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setSelectedExpense(expense)}
                    className="flex items-center text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                  >
                    <EyeIcon className="w-4 h-4 mr-1" />
                    View Details
                  </button>
                  <div className="flex items-center space-x-2">
                    <button className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300">
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300">
                      <DocumentArrowDownIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'revenue' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {revenue.map((rev) => (
              <div key={rev.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{rev.source}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(rev.status)}`}>
                    {rev.status}
                  </span>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Category</span>
                    <span className="font-medium text-gray-900 dark:text-white">{rev.category}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Amount</span>
                    <span className="font-medium text-lg text-green-600 dark:text-green-400">${rev.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Payment Method</span>
                    <span className="font-medium text-gray-900 dark:text-white">{rev.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Date</span>
                    <span className="font-medium text-gray-900 dark:text-white">{rev.date}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{rev.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {rev.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300">
                    <EyeIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'payroll' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Payroll Management</h2>
                <button className="flex items-center px-3 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Process Payroll
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Employee</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Base Salary</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Net Salary</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Pay Period</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {payroll.map((pay) => (
                    <tr key={pay.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{pay.employeeName}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{pay.position}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{pay.department}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">${pay.baseSalary.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">${pay.netSalary.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{pay.payPeriod}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(pay.status)}`}>
                          {pay.status}
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

        {activeTab === 'tax' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {taxRecords.map((tax) => (
              <div key={tax.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{tax.type}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(tax.status)}`}>
                    {tax.status}
                  </span>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Period</span>
                    <span className="font-medium text-gray-900 dark:text-white">{tax.period}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Amount</span>
                    <span className="font-medium text-lg text-red-600 dark:text-red-400">${tax.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Due Date</span>
                    <span className="font-medium text-gray-900 dark:text-white">{tax.dueDate}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Jurisdiction</span>
                    <span className="font-medium text-gray-900 dark:text-white">{tax.jurisdiction}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{tax.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {tax.attachments.map((attachment, index) => (
                      <span key={index} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full">
                        📎 {attachment}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300">
                      <EyeIcon className="w-4 h-4" />
                    </button>
                    <button className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300">
                      <PaperAirplaneIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {financialReports.map((report) => (
              <div key={report.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{report.name}</h3>
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
                    <span className="font-medium text-gray-900 dark:text-white">{report.generatedAt}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">File Size</span>
                    <span className="font-medium text-gray-900 dark:text-white">{report.fileSize}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Generated by {report.generatedBy}</p>
                  <div className="flex items-center space-x-2">
                    <button className="flex items-center text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300">
                      <ArrowDownTrayIcon className="w-4 h-4 mr-1" />
                      Download
                    </button>
                    <button className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300">
                      <PrinterIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Transaction Detail Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Transaction Details</h3>
                <button
                  onClick={() => setSelectedTransaction(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Transaction ID</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedTransaction.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Date</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedTransaction.date}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Type</p>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTransactionTypeColor(selectedTransaction.type)}`}>
                    {selectedTransaction.type}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedTransaction.status)}`}>
                    {selectedTransaction.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Amount</p>
                  <p className={`font-medium text-lg ${selectedTransaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {selectedTransaction.type === 'income' ? '+' : '-'}${selectedTransaction.amount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Payment Method</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedTransaction.paymentMethod}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Description</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedTransaction.description}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Reference</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedTransaction.reference}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Attachments</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedTransaction.attachments.map((attachment, index) => (
                      <span key={index} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full">
                        📎 {attachment}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Detail Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Invoice Details</h3>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Invoice Number</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedInvoice.invoiceNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Type</p>
                  <p className="font-medium text-gray-900 dark:text-white capitalize">{selectedInvoice.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedInvoice.status)}`}>
                    {selectedInvoice.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Due Date</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedInvoice.dueDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Created Date</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedInvoice.createdAt}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Paid Date</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedInvoice.paidAt || 'Not paid yet'}</p>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Items</h4>
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Description</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Quantity</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Unit Price</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Total</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {selectedInvoice.items.map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">{item.description}</td>
                          <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">{item.quantity}</td>
                          <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">${item.unitPrice.toLocaleString()}</td>
                          <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">${item.total.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Subtotal</p>
                  <p className="font-medium text-gray-900 dark:text-white">${selectedInvoice.amount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Tax</p>
                  <p className="font-medium text-gray-900 dark:text-white">${selectedInvoice.tax.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                  <p className="font-medium text-lg text-primary-600 dark:text-primary-400">${selectedInvoice.total.toLocaleString()}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Notes</p>
                <p className="font-medium text-gray-900 dark:text-white">{selectedInvoice.notes}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Expense Detail Modal */}
      {selectedExpense && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Expense Details</h3>
                <button
                  onClick={() => setSelectedExpense(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Expense Title</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedExpense.title}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Category</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedExpense.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Amount</p>
                  <p className="font-medium text-lg text-red-600 dark:text-red-400">${selectedExpense.amount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedExpense.status)}`}>
                    {selectedExpense.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Department</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedExpense.department}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Date</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedExpense.date}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Submitted By</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedExpense.submittedBy}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Approved By</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedExpense.approvedBy || 'Pending approval'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Description</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedExpense.description}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Receipt</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full">
                      📎 {selectedExpense.receipt}
                    </span>
                  </div>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Tags</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedExpense.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
