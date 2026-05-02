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
  CreditCardIcon,
  EnvelopeIcon,
  BellIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

// Types
interface FeeStructure {
  id: string;
  feeType: 'Tuition' | 'Boarding' | 'Examination' | 'Transport' | 'Uniform' | 'Books' | 'Stationery' | 'Sports' | 'Laboratory' | 'Library' | 'Technology' | 'Other';
  name: string;
  description: string;
  amount: number;
  currency: string;
  frequency: 'Once' | 'Monthly' | 'Termly' | 'Annually';
  grade: string;
  stream?: string;
  category: 'Mandatory' | 'Optional' | 'Special';
  status: 'Active' | 'Inactive' | 'Archived';
  applicableTo: 'All Students' | 'Specific Grade' | 'Specific Stream' | 'Boarding Students' | 'Day Scholars';
  dueDate?: string;
  lateFee: number;
  lateFeeType: 'Fixed' | 'Percentage';
  paymentMethods: string[];
  autoBilling: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

interface FeePayment {
  id: string;
  studentId: string;
  studentName: string;
  studentNumber: string;
  grade: string;
  stream: string;
  feeStructureId: string;
  feeType: string;
  feeName: string;
  amount: number;
  currency: string;
  amountPaid: number;
  balance: number;
  status: 'Paid' | 'Partial' | 'Pending' | 'Overdue' | 'Cancelled' | 'Refunded';
  paymentDate?: string;
  dueDate: string;
  paymentMethod?: 'Cash' | 'Bank Transfer' | 'Mobile Money' | 'Credit Card' | 'Check' | 'Online Payment';
  transactionId?: string;
  receiptNumber?: string;
  bankReference?: string;
  paidBy: string;
  payerName: string;
  payerContact: string;
  payerEmail?: string;
  installmentNumber?: number;
  totalInstallments?: number;
  lateFeeApplied: number;
  discountApplied: number;
  scholarshipApplied: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

interface FeeInvoice {
  id: string;
  invoiceNumber: string;
  studentId: string;
  studentName: string;
  studentNumber: string;
  grade: string;
  stream: string;
  guardianName: string;
  guardianEmail: string;
  guardianPhone: string;
  invoiceDate: string;
  dueDate: string;
  status: 'Draft' | 'Sent' | 'Paid' | 'Partially Paid' | 'Overdue' | 'Cancelled';
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  amountPaid: number;
  balance: number;
  currency: string;
  items: Array<{
    feeStructureId: string;
    feeName: string;
    amount: number;
    quantity: number;
    total: number;
  }>;
  paymentTerms: string;
  notes?: string;
  sentDate?: string;
  paidDate?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

interface FeeReport {
  id: string;
  reportType: 'Collection' | 'Outstanding' | 'Revenue' | 'Payment Method' | 'Grade Analysis' | 'Monthly Summary';
  title: string;
  description: string;
  generatedDate: string;
  period: string;
  totalAmount: number;
  currency: string;
  status: 'Active' | 'Archived';
  data: any;
  createdBy: string;
  createdAt: string;
}

export const FeeManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'structure' | 'payments' | 'invoices' | 'reports'>('structure');
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([]);
  const [feePayments, setFeePayments] = useState<FeePayment[]>([]);
  const [feeInvoices, setFeeInvoices] = useState<FeeInvoice[]>([]);
  const [feeReports, setFeeReports] = useState<FeeReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGrade, setFilterGrade] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [formData, setFormData] = useState<Partial<FeeStructure | FeePayment | FeeInvoice>>({});

  // Mock data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock fee structures
      const mockFeeStructures: FeeStructure[] = [
        {
          id: 'fee-001',
          feeType: 'Tuition',
          name: 'Form 1 Tuition Fees',
          description: 'Academic tuition for Form 1 students',
          amount: 2500,
          currency: 'USD',
          frequency: 'Termly',
          grade: 'Form 1',
          category: 'Mandatory',
          status: 'Active',
          applicableTo: 'Specific Grade',
          dueDate: '2024-02-15',
          lateFee: 100,
          lateFeeType: 'Fixed',
          paymentMethods: ['Bank Transfer', 'Mobile Money', 'Cash'],
          autoBilling: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          createdBy: 'Admin',
        },
        {
          id: 'fee-002',
          feeType: 'Boarding',
          name: 'Boarding Fees',
          description: 'Accommodation and meals for boarding students',
          amount: 1500,
          currency: 'USD',
          frequency: 'Termly',
          grade: 'Form 1',
          category: 'Mandatory',
          status: 'Active',
          applicableTo: 'Boarding Students',
          dueDate: '2024-02-15',
          lateFee: 50,
          lateFeeType: 'Fixed',
          paymentMethods: ['Bank Transfer', 'Mobile Money'],
          autoBilling: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          createdBy: 'Admin',
        },
        {
          id: 'fee-003',
          feeType: 'Examination',
          name: 'Examination Fees',
          description: 'ZIMSEC and internal examination fees',
          amount: 200,
          currency: 'USD',
          frequency: 'Termly',
          grade: 'Form 4',
          category: 'Mandatory',
          status: 'Active',
          applicableTo: 'Specific Grade',
          dueDate: '2024-03-01',
          lateFee: 25,
          lateFeeType: 'Fixed',
          paymentMethods: ['Bank Transfer', 'Cash'],
          autoBilling: false,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          createdBy: 'Admin',
        },
      ];

      // Mock fee payments
      const mockFeePayments: FeePayment[] = [
        {
          id: 'pay-001',
          studentId: 'student-001',
          studentName: 'John Smith',
          studentNumber: 'STU2024001',
          grade: 'Form 1',
          stream: 'A',
          feeStructureId: 'fee-001',
          feeType: 'Tuition',
          feeName: 'Form 1 Tuition Fees',
          amount: 2500,
          currency: 'USD',
          amountPaid: 2500,
          balance: 0,
          status: 'Paid',
          paymentDate: '2024-01-15',
          dueDate: '2024-02-15',
          paymentMethod: 'Bank Transfer',
          transactionId: 'TXN001',
          receiptNumber: 'RCP2024001',
          bankReference: 'BANK001',
          paidBy: 'Mrs. Mary Smith',
          payerName: 'Mrs. Mary Smith',
          payerContact: '+263 4 123 456',
          payerEmail: 'mary.smith@email.com',
          lateFeeApplied: 0,
          discountApplied: 0,
          scholarshipApplied: 0,
          notes: 'Full payment received on time',
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z',
          createdBy: 'Admin',
        },
        {
          id: 'pay-002',
          studentId: 'student-002',
          studentName: 'Sarah Johnson',
          studentNumber: 'STU2024002',
          grade: 'Form 2',
          stream: 'B',
          feeStructureId: 'fee-001',
          feeType: 'Tuition',
          feeName: 'Form 1 Tuition Fees',
          amount: 2500,
          currency: 'USD',
          amountPaid: 1500,
          balance: 1000,
          status: 'Partial',
          dueDate: '2024-02-15',
          paymentMethod: 'Mobile Money',
          transactionId: 'TXN002',
          receiptNumber: 'RCP2024002',
          paidBy: 'Mr. Robert Johnson',
          payerName: 'Mr. Robert Johnson',
          payerContact: '+263 4 555 666',
          payerEmail: 'robert.johnson@email.com',
          installmentNumber: 1,
          totalInstallments: 2,
          lateFeeApplied: 0,
          discountApplied: 0,
          scholarshipApplied: 0,
          notes: 'First installment payment',
          createdAt: '2024-01-20T14:00:00Z',
          updatedAt: '2024-01-20T14:00:00Z',
          createdBy: 'Admin',
        },
        {
          id: 'pay-003',
          studentId: 'student-003',
          studentName: 'Michael Brown',
          studentNumber: 'STU2024003',
          grade: 'Form 1',
          stream: 'C',
          feeStructureId: 'fee-001',
          feeType: 'Tuition',
          feeName: 'Form 1 Tuition Fees',
          amount: 2500,
          currency: 'USD',
          amountPaid: 0,
          balance: 2500,
          status: 'Overdue',
          dueDate: '2024-02-15',
          paidBy: 'Pending',
          payerName: 'Pending',
          payerContact: 'Pending',
          lateFeeApplied: 100,
          discountApplied: 0,
          scholarshipApplied: 0,
          notes: 'Payment overdue - follow up required',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-02-16T00:00:00Z',
          createdBy: 'Admin',
        },
      ];

      // Mock fee invoices
      const mockFeeInvoices: FeeInvoice[] = [
        {
          id: 'inv-001',
          invoiceNumber: 'INV2024001',
          studentId: 'student-001',
          studentName: 'John Smith',
          studentNumber: 'STU2024001',
          grade: 'Form 1',
          stream: 'A',
          guardianName: 'Mrs. Mary Smith',
          guardianEmail: 'mary.smith@email.com',
          guardianPhone: '+263 4 123 456',
          invoiceDate: '2024-01-01',
          dueDate: '2024-02-15',
          status: 'Paid',
          subtotal: 4000,
          taxAmount: 0,
          discountAmount: 0,
          totalAmount: 4000,
          amountPaid: 4000,
          balance: 0,
          currency: 'USD',
          items: [
            {
              feeStructureId: 'fee-001',
              feeName: 'Form 1 Tuition Fees',
              amount: 2500,
              quantity: 1,
              total: 2500,
            },
            {
              feeStructureId: 'fee-002',
              feeName: 'Boarding Fees',
              amount: 1500,
              quantity: 1,
              total: 1500,
            },
          ],
          paymentTerms: 'Payment due within 45 days',
          sentDate: '2024-01-02',
          paidDate: '2024-01-15',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z',
          createdBy: 'Admin',
        },
        {
          id: 'inv-002',
          invoiceNumber: 'INV2024002',
          studentId: 'student-002',
          studentName: 'Sarah Johnson',
          studentNumber: 'STU2024002',
          grade: 'Form 2',
          stream: 'B',
          guardianName: 'Mr. Robert Johnson',
          guardianEmail: 'robert.johnson@email.com',
          guardianPhone: '+263 4 555 666',
          invoiceDate: '2024-01-01',
          dueDate: '2024-02-15',
          status: 'Partially Paid',
          subtotal: 2500,
          taxAmount: 0,
          discountAmount: 0,
          totalAmount: 2500,
          amountPaid: 1500,
          balance: 1000,
          currency: 'USD',
          items: [
            {
              feeStructureId: 'fee-001',
              feeName: 'Form 1 Tuition Fees',
              amount: 2500,
              quantity: 1,
              total: 2500,
            },
          ],
          paymentTerms: 'Payment due within 45 days',
          sentDate: '2024-01-02',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-20T14:00:00Z',
          createdBy: 'Admin',
        },
      ];

      // Mock fee reports
      const mockFeeReports: FeeReport[] = [
        {
          id: 'rep-001',
          reportType: 'Collection',
          title: 'Monthly Fee Collection Report',
          description: 'Fee collection summary for January 2024',
          generatedDate: '2024-01-31',
          period: 'January 2024',
          totalAmount: 15000,
          currency: 'USD',
          status: 'Active',
          data: {
            totalCollected: 15000,
            totalOutstanding: 5000,
            collectionRate: 75,
          },
          createdBy: 'Admin',
          createdAt: '2024-01-31T23:59:59Z',
        },
        {
          id: 'rep-002',
          reportType: 'Outstanding',
          title: 'Outstanding Fees Report',
          description: 'Students with outstanding fee payments',
          generatedDate: '2024-02-01',
          period: 'February 2024',
          totalAmount: 5000,
          currency: 'USD',
          status: 'Active',
          data: {
            totalStudents: 3,
            totalOutstanding: 5000,
            overdueAmount: 2600,
          },
          createdBy: 'Admin',
          createdAt: '2024-02-01T00:00:00Z',
        },
      ];
      
      setFeeStructures(mockFeeStructures);
      setFeePayments(mockFeePayments);
      setFeeInvoices(mockFeeInvoices);
      setFeeReports(mockFeeReports);
      setLoading(false);
    };

    loadData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
      case 'Paid':
        return 'text-success-600 bg-success-100';
      case 'Inactive':
      case 'Cancelled':
        return 'text-gray-600 bg-gray-100';
      case 'Pending':
      case 'Draft':
        return 'text-warning-600 bg-warning-100';
      case 'Overdue':
      case 'Archived':
        return 'text-red-600 bg-red-100';
      case 'Partial':
      case 'Partially Paid':
        return 'text-blue-600 bg-blue-100';
      case 'Refunded':
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getFeeTypeColor = (feeType: string) => {
    switch (feeType) {
      case 'Tuition':
        return 'text-blue-600 bg-blue-100';
      case 'Boarding':
        return 'text-green-600 bg-green-100';
      case 'Examination':
        return 'text-purple-600 bg-purple-100';
      case 'Transport':
        return 'text-orange-600 bg-orange-100';
      case 'Uniform':
        return 'text-pink-600 bg-pink-100';
      case 'Books':
        return 'text-indigo-600 bg-indigo-100';
      case 'Stationery':
        return 'text-yellow-600 bg-yellow-100';
      case 'Sports':
        return 'text-red-600 bg-red-100';
      case 'Laboratory':
        return 'text-teal-600 bg-teal-100';
      case 'Library':
        return 'text-cyan-600 bg-cyan-100';
      case 'Technology':
        return 'text-gray-600 bg-gray-100';
      case 'Other':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getPaymentMethodIcon = (method?: string) => {
    switch (method) {
      case 'Cash':
        return <BanknotesIcon className="w-4 h-4" />;
      case 'Bank Transfer':
        return <CurrencyDollarIcon className="w-4 h-4" />;
      case 'Mobile Money':
        return <CreditCardIcon className="w-4 h-4" />;
      case 'Credit Card':
        return <CreditCardIcon className="w-4 h-4" />;
      case 'Check':
        return <DocumentArrowDownIcon className="w-4 h-4" />;
      case 'Online Payment':
        return <CreditCardIcon className="w-4 h-4" />;
      default:
        return <BanknotesIcon className="w-4 h-4" />;
    }
  };

  const filteredStructures = feeStructures.filter(structure => {
    const matchesSearch = structure.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         structure.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = filterGrade === 'all' || structure.grade === filterGrade;
    const matchesStatus = filterStatus === 'all' || structure.status === filterStatus;
    const matchesType = filterType === 'all' || structure.feeType === filterType;
    return matchesSearch && matchesGrade && matchesStatus && matchesType;
  });

  const filteredPayments = feePayments.filter(payment => {
    const matchesSearch = payment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.studentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.feeName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = filterGrade === 'all' || payment.grade === filterGrade;
    const matchesStatus = filterStatus === 'all' || payment.status === filterStatus;
    const matchesType = filterType === 'all' || payment.feeType === filterType;
    return matchesSearch && matchesGrade && matchesStatus && matchesType;
  });

  const filteredInvoices = feeInvoices.filter(invoice => {
    const matchesSearch = invoice.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.studentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = filterGrade === 'all' || invoice.grade === filterGrade;
    const matchesStatus = filterStatus === 'all' || invoice.status === filterStatus;
    return matchesSearch && matchesGrade && matchesStatus;
  });

  const handleCreateStructure = () => {
    // In real app, this would call API
    const newStructure: FeeStructure = {
      id: `fee-${Date.now()}`,
      feeType: formData.feeType as FeeStructure['feeType'] || 'Tuition',
      name: formData.name || 'New Fee',
      description: formData.description || '',
      amount: formData.amount || 0,
      currency: formData.currency || 'USD',
      frequency: formData.frequency as FeeStructure['frequency'] || 'Termly',
      grade: formData.grade || 'Form 1',
      category: formData.category as FeeStructure['category'] || 'Mandatory',
      status: 'Active',
      applicableTo: formData.applicableTo as FeeStructure['applicableTo'] || 'All Students',
      dueDate: formData.dueDate,
      lateFee: formData.lateFee || 0,
      lateFeeType: formData.lateFeeType as FeeStructure['lateFeeType'] || 'Fixed',
      paymentMethods: formData.paymentMethods as string[] || ['Bank Transfer'],
      autoBilling: formData.autoBilling || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'Current User',
    };
    
    setFeeStructures([...feeStructures, newStructure]);
    setShowCreateModal(false);
    setFormData({});
  };

  const handlePayment = () => {
    // In real app, this would call API
    const newPayment: FeePayment = {
      id: `pay-${Date.now()}`,
      studentId: formData.studentId || 'student-new',
      studentName: formData.studentName || 'New Student',
      studentNumber: formData.studentNumber || 'STU000000',
      grade: formData.grade || 'Form 1',
      stream: formData.stream || 'A',
      feeStructureId: formData.feeStructureId || 'fee-001',
      feeType: formData.feeType as FeePayment['feeType'] || 'Tuition',
      feeName: formData.feeName || 'Fee',
      amount: formData.amount || 0,
      currency: formData.currency || 'USD',
      amountPaid: formData.amountPaid || 0,
      balance: (formData.amount || 0) - (formData.amountPaid || 0),
      status: formData.amountPaid === formData.amount ? 'Paid' : formData.amountPaid && formData.amountPaid > 0 ? 'Partial' : 'Pending',
      paymentDate: formData.amountPaid ? new Date().toISOString().split('T')[0] : undefined,
      dueDate: formData.dueDate || new Date().toISOString().split('T')[0],
      paymentMethod: formData.paymentMethod as FeePayment['paymentMethod'],
      transactionId: formData.transactionId,
      receiptNumber: formData.receiptNumber,
      paidBy: formData.paidBy || 'Unknown',
      payerName: formData.payerName || 'Unknown',
      payerContact: formData.payerContact || 'Unknown',
      payerEmail: formData.payerEmail,
      lateFeeApplied: formData.lateFeeApplied || 0,
      discountApplied: formData.discountApplied || 0,
      scholarshipApplied: formData.scholarshipApplied || 0,
      notes: formData.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'Current User',
    };
    
    setFeePayments([...feePayments, newPayment]);
    setShowPaymentModal(false);
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
              Fee Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage fee structures, payments, invoices, and financial reporting
            </p>
          </div>
          <div className="flex gap-3">
            <button className="btn btn-secondary">
              <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
              Export Reports
            </button>
            {activeTab === 'structure' && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn btn-primary"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Add Fee Structure
              </button>
            )}
            {activeTab === 'payments' && (
              <button
                onClick={() => setShowPaymentModal(true)}
                className="btn btn-primary"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Record Payment
              </button>
            )}
            {activeTab === 'invoices' && (
              <button
                onClick={() => setShowInvoiceModal(true)}
                className="btn btn-primary"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Generate Invoice
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="flex space-x-8">
          {[
            { id: 'structure', label: 'Fee Structures', icon: CurrencyDollarIcon },
            { id: 'payments', label: 'Payments', icon: BanknotesIcon },
            { id: 'invoices', label: 'Invoices', icon: DocumentArrowDownIcon },
            { id: 'reports', label: 'Reports', icon: ChartBarIcon },
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
                  placeholder="Search fees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
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
              {activeTab === 'structure' && (
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="form-input"
                >
                  <option value="all">All Fee Types</option>
                  <option value="Tuition">Tuition</option>
                  <option value="Boarding">Boarding</option>
                  <option value="Examination">Examination</option>
                  <option value="Transport">Transport</option>
                  <option value="Uniform">Uniform</option>
                  <option value="Books">Books</option>
                  <option value="Stationery">Stationery</option>
                  <option value="Sports">Sports</option>
                  <option value="Laboratory">Laboratory</option>
                  <option value="Library">Library</option>
                  <option value="Technology">Technology</option>
                  <option value="Other">Other</option>
                </select>
              )}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="form-input"
              >
                <option value="all">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Paid">Paid</option>
                <option value="Partial">Partial</option>
                <option value="Pending">Pending</option>
                <option value="Overdue">Overdue</option>
                <option value="Draft">Draft</option>
                <option value="Sent">Sent</option>
                <option value="Cancelled">Cancelled</option>
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
      {activeTab === 'structure' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStructures.map((structure, index) => (
            <motion.div
              key={structure.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card card-hover"
            >
              <div className="card-body">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {structure.name}
                    </h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${getFeeTypeColor(structure.feeType)}`}>
                      {structure.feeType}
                    </span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(structure.status)}`}>
                    {structure.status}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Amount</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {structure.currency} {structure.amount.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Frequency</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {structure.frequency}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Grade</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {structure.grade}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Category</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {structure.category}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Applicable To</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {structure.applicableTo}
                    </span>
                  </div>

                  {structure.dueDate && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Due Date</span>
                      <span className="text-sm text-gray-500 dark:text-gray-500">
                        {new Date(structure.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Late Fee</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {structure.currency} {structure.lateFee} ({structure.lateFeeType})
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {structure.autoBilling && (
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded">
                        Auto Billing
                      </span>
                    )}
                    {structure.paymentMethods.map((method, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                        {method}
                      </span>
                    ))}
                  </div>

                  {structure.description && (
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {structure.description}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-sm text-gray-500 dark:text-gray-500">
                    Created by {structure.createdBy} on {new Date(structure.createdAt).toLocaleDateString()}
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

      {activeTab === 'payments' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPayments.map((payment, index) => (
            <motion.div
              key={payment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card card-hover"
            >
              <div className="card-body">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {payment.studentName}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {payment.studentNumber} • {payment.grade} - {payment.stream}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(payment.status)}`}>
                    {payment.status}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Fee Type</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getFeeTypeColor(payment.feeType)}`}>
                      {payment.feeType}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Fee Name</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {payment.feeName}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Total Amount</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {payment.currency} {payment.amount.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Amount Paid</span>
                    <span className="text-sm font-medium text-green-600">
                      {payment.currency} {payment.amountPaid.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Balance</span>
                    <span className={`text-sm font-medium ${payment.balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {payment.currency} {payment.balance.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Due Date</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {new Date(payment.dueDate).toLocaleDateString()}
                    </span>
                  </div>

                  {payment.paymentDate && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Payment Date</span>
                      <span className="text-sm text-gray-500 dark:text-gray-500">
                        {new Date(payment.paymentDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}

                  {payment.paymentMethod && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Payment Method</span>
                      <div className="flex items-center gap-1">
                        {getPaymentMethodIcon(payment.paymentMethod)}
                        <span className="text-sm text-gray-500 dark:text-gray-500">
                          {payment.paymentMethod}
                        </span>
                      </div>
                    </div>
                  )}

                  {payment.receiptNumber && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Receipt</span>
                      <span className="text-sm text-gray-500 dark:text-gray-500">
                        {payment.receiptNumber}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Paid By</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {payment.payerName}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {payment.installmentNumber && payment.totalInstallments && (
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded">
                        Installment {payment.installmentNumber}/{payment.totalInstallments}
                      </span>
                    )}
                    {payment.lateFeeApplied > 0 && (
                      <span className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded">
                        Late Fee Applied
                      </span>
                    )}
                    {payment.discountApplied > 0 && (
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded">
                        Discount Applied
                      </span>
                    )}
                    {payment.scholarshipApplied > 0 && (
                      <span className="text-xs px-2 py-1 bg-purple-100 text-purple-600 rounded">
                        Scholarship Applied
                      </span>
                    )}
                  </div>

                  {payment.notes && (
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Notes:</span> {payment.notes}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-sm text-gray-500 dark:text-gray-500">
                    Created on {new Date(payment.createdAt).toLocaleDateString()}
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

      {activeTab === 'invoices' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInvoices.map((invoice, index) => (
            <motion.div
              key={invoice.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card card-hover"
            >
              <div className="card-body">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {invoice.studentName}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {invoice.studentNumber} • {invoice.grade} - {invoice.stream}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(invoice.status)}`}>
                    {invoice.status}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Invoice Number</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {invoice.invoiceNumber}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Invoice Date</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {new Date(invoice.invoiceDate).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Due Date</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {new Date(invoice.dueDate).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Total Amount</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {invoice.currency} {invoice.totalAmount.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Amount Paid</span>
                    <span className="text-sm font-medium text-green-600">
                      {invoice.currency} {invoice.amountPaid.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Balance</span>
                    <span className={`text-sm font-medium ${invoice.balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {invoice.currency} {invoice.balance.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Guardian</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {invoice.guardianName}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Contact</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {invoice.guardianPhone}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {invoice.sentDate && (
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded">
                        Sent {new Date(invoice.sentDate).toLocaleDateString()}
                      </span>
                    )}
                    {invoice.paidDate && (
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded">
                        Paid {new Date(invoice.paidDate).toLocaleDateString()}
                      </span>
                    )}
                    {invoice.items.length > 1 && (
                      <span className="text-xs px-2 py-1 bg-purple-100 text-purple-600 rounded">
                        {invoice.items.length} Items
                      </span>
                    )}
                  </div>

                  {invoice.notes && (
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Notes:</span> {invoice.notes}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-sm text-gray-500 dark:text-gray-500">
                    Created on {new Date(invoice.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex gap-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      <EnvelopeIcon className="w-4 h-4" />
                    </button>
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
          {feeReports.map((report, index) => (
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
                    <span className="text-sm text-gray-600 dark:text-gray-400">Total Amount</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {report.currency} {report.totalAmount.toLocaleString()}
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
                              (key.toLowerCase().includes('rate') ? `${value}%` : 
                               key.toLowerCase().includes('amount') ? `${report.currency} ${value.toLocaleString()}` : 
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

      {/* Create Fee Structure Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full"
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Create Fee Structure
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Fee Type
                  </label>
                  <select
                    value={formData.feeType || ''}
                    onChange={(e) => setFormData({ ...formData, feeType: e.target.value })}
                    className="form-input"
                  >
                    <option value="">Select Fee Type</option>
                    <option value="Tuition">Tuition</option>
                    <option value="Boarding">Boarding</option>
                    <option value="Examination">Examination</option>
                    <option value="Transport">Transport</option>
                    <option value="Uniform">Uniform</option>
                    <option value="Books">Books</option>
                    <option value="Stationery">Stationery</option>
                    <option value="Sports">Sports</option>
                    <option value="Laboratory">Laboratory</option>
                    <option value="Library">Library</option>
                    <option value="Technology">Technology</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Fee Name
                  </label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="form-input"
                    placeholder="Fee name..."
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
                    placeholder="Fee description..."
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
                      Frequency
                    </label>
                    <select
                      value={formData.frequency || ''}
                      onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                      className="form-input"
                    >
                      <option value="Once">Once</option>
                      <option value="Monthly">Monthly</option>
                      <option value="Termly">Termly</option>
                      <option value="Annually">Annually</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Grade
                    </label>
                    <select
                      value={formData.grade || ''}
                      onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                      className="form-input"
                    >
                      <option value="Form 1">Form 1</option>
                      <option value="Form 2">Form 2</option>
                      <option value="Form 3">Form 3</option>
                      <option value="Form 4">Form 4</option>
                      <option value="Form 5">Form 5</option>
                      <option value="Form 6">Form 6</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Category
                    </label>
                    <select
                      value={formData.category || ''}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="form-input"
                    >
                      <option value="Mandatory">Mandatory</option>
                      <option value="Optional">Optional</option>
                      <option value="Special">Special</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Late Fee
                    </label>
                    <input
                      type="number"
                      value={formData.lateFee || ''}
                      onChange={(e) => setFormData({ ...formData, lateFee: parseFloat(e.target.value) || 0 })}
                      className="form-input"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate || ''}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.autoBilling || false}
                    onChange={(e) => setFormData({ ...formData, autoBilling: e.target.checked })}
                    className="form-checkbox mr-2"
                  />
                  <label className="text-sm text-gray-700 dark:text-gray-300">
                    Enable Auto Billing
                  </label>
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
                  onClick={handleCreateStructure}
                  className="btn btn-primary"
                >
                  Create Fee Structure
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Record Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full"
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Record Payment
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Select Student
                  </label>
                  <select
                    value={formData.studentId || ''}
                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                    className="form-input"
                  >
                    <option value="">Select Student</option>
                    <option value="student-001">John Smith (STU2024001)</option>
                    <option value="student-002">Sarah Johnson (STU2024002)</option>
                    <option value="student-003">Michael Brown (STU2024003)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Fee Structure
                  </label>
                  <select
                    value={formData.feeStructureId || ''}
                    onChange={(e) => setFormData({ ...formData, feeStructureId: e.target.value })}
                    className="form-input"
                  >
                    <option value="">Select Fee</option>
                    <option value="fee-001">Form 1 Tuition Fees - $2,500</option>
                    <option value="fee-002">Boarding Fees - $1,500</option>
                    <option value="fee-003">Examination Fees - $200</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Total Amount
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
                      Amount Paid
                    </label>
                    <input
                      type="number"
                      value={formData.amountPaid || ''}
                      onChange={(e) => setFormData({ ...formData, amountPaid: parseFloat(e.target.value) || 0 })}
                      className="form-input"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Payment Method
                  </label>
                  <select
                    value={formData.paymentMethod || ''}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as FeePayment['paymentMethod'] })}
                    className="form-input"
                  >
                    <option value="">Select Method</option>
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Mobile Money">Mobile Money</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Check">Check</option>
                    <option value="Online Payment">Online Payment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Transaction ID
                  </label>
                  <input
                    type="text"
                    value={formData.transactionId || ''}
                    onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                    className="form-input"
                    placeholder="Transaction ID..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Receipt Number
                  </label>
                  <input
                    type="text"
                    value={formData.receiptNumber || ''}
                    onChange={(e) => setFormData({ ...formData, receiptNumber: e.target.value })}
                    className="form-input"
                    placeholder="Receipt number..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Payer Name
                  </label>
                  <input
                    type="text"
                    value={formData.payerName || ''}
                    onChange={(e) => setFormData({ ...formData, payerName: e.target.value })}
                    className="form-input"
                    placeholder="Payer name..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Payer Contact
                  </label>
                  <input
                    type="text"
                    value={formData.payerContact || ''}
                    onChange={(e) => setFormData({ ...formData, payerContact: e.target.value })}
                    className="form-input"
                    placeholder="Phone or email..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes || ''}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    className="form-input"
                    placeholder="Payment notes..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePayment}
                  className="btn btn-primary"
                >
                  Record Payment
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
