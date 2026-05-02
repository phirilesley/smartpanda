export interface ModuleDefinition {
  id: number;
  slug: string;
  name: string;
  phase: string;
  backendStatus: 'implemented' | 'partial' | 'missing';
  frontendStatus: 'implemented' | 'partial' | 'missing';
  viewPath: string;
  backendArea: string;
}

export const moduleCatalog: ModuleDefinition[] = [
  { id: 1, slug: 'platform-subscription', name: 'Platform & Subscription Management', phase: 'Phase 1', backendStatus: 'implemented', frontendStatus: 'implemented', viewPath: '/modules/platform-subscription', backendArea: 'Controllers/Phase1/Tenants, SubscriptionPlans, TenantSubscriptions' },
  { id: 2, slug: 'multi-tenant-school', name: 'Multi-Tenant & School Management', phase: 'Phase 1', backendStatus: 'implemented', frontendStatus: 'implemented', viewPath: '/modules/multi-tenant-school', backendArea: 'Controllers/Phase1/Schools' },
  { id: 3, slug: 'identity-auth-rbac', name: 'Identity, Auth, Roles, Permissions', phase: 'Phase 1', backendStatus: 'implemented', frontendStatus: 'implemented', viewPath: '/modules/identity-auth-rbac', backendArea: 'Controllers/Auth + Controllers/Phase1/SecurityAdmin' },
  { id: 4, slug: 'user-school-access', name: 'User-School Access Control', phase: 'Phase 1', backendStatus: 'implemented', frontendStatus: 'implemented', viewPath: '/modules/user-school-access', backendArea: 'Security/SchoolAccess + Controllers/Phase1/SecurityAdmin' },
  { id: 5, slug: 'academic-setup', name: 'Academic Setup', phase: 'Phase 1', backendStatus: 'implemented', frontendStatus: 'implemented', viewPath: '/modules/academic-setup', backendArea: 'Controllers/Phase1/AcademicYears Terms Grades Streams Subjects' },
  { id: 6, slug: 'student-management', name: 'Student Management', phase: 'Phase 2', backendStatus: 'implemented', frontendStatus: 'implemented', viewPath: '/modules/student-management', backendArea: 'Controllers/Phase2/Students' },
  { id: 7, slug: 'guardian-linking', name: 'Guardian/Parent Linking', phase: 'Phase 2', backendStatus: 'implemented', frontendStatus: 'implemented', viewPath: '/modules/guardian-linking', backendArea: 'Controllers/Phase2/Guardians StudentGuardians' },
  { id: 8, slug: 'student-enrollment-history', name: 'Student Enrollment & Academic History', phase: 'Phase 2', backendStatus: 'implemented', frontendStatus: 'implemented', viewPath: '/modules/student-enrollment-history', backendArea: 'Controllers/Phase2/StudentEnrollments' },
  { id: 9, slug: 'promotion-rollover', name: 'Promotion/Rollover Engine', phase: 'Phase 2', backendStatus: 'implemented', frontendStatus: 'implemented', viewPath: '/modules/promotion-rollover', backendArea: 'Controllers/Phase2/StudentPromotions' },
  { id: 10, slug: 'exam-setup', name: 'Exam Setup', phase: 'Phase 4', backendStatus: 'implemented', frontendStatus: 'implemented', viewPath: '/modules/exam-setup', backendArea: 'Controllers/Phase4/ExamTypes ExamSessions' },
  { id: 11, slug: 'marks-workflow', name: 'Marks Entry & Approval Workflow', phase: 'Phase 4', backendStatus: 'implemented', frontendStatus: 'implemented', viewPath: '/modules/marks-workflow', backendArea: 'Controllers/Phase4/StudentMarks ResultApprovals' },
  { id: 12, slug: 'results-reportcards', name: 'Results, Report Cards, Transcripts', phase: 'Phase 4', backendStatus: 'implemented', frontendStatus: 'implemented', viewPath: '/modules/results-reportcards', backendArea: 'Controllers/Phase4/ReportCards' },
  { id: 13, slug: 'fees-setup', name: 'Fees Setup', phase: 'Phase 3', backendStatus: 'implemented', frontendStatus: 'implemented', viewPath: '/modules/fees-setup', backendArea: 'Controllers/Phase3/FeeCategories FeeStructures' },
  { id: 14, slug: 'invoicing-billing', name: 'Invoicing & Billing', phase: 'Phase 3', backendStatus: 'implemented', frontendStatus: 'implemented', viewPath: '/modules/invoicing-billing', backendArea: 'Controllers/Phase3/StudentInvoices' },
  { id: 15, slug: 'payments-receipts', name: 'Payments, Receipts, Arrears, Payment Plans', phase: 'Phase 3', backendStatus: 'implemented', frontendStatus: 'implemented', viewPath: '/modules/payments-receipts', backendArea: 'Controllers/Phase3/Payments Arrears PaymentPlans' },
  { id: 16, slug: 'attendance', name: 'Attendance (student + staff)', phase: 'Phase 5', backendStatus: 'implemented', frontendStatus: 'implemented', viewPath: '/modules/attendance', backendArea: 'Controllers/Phase5/Attendance' },
  { id: 17, slug: 'hr', name: 'HR Management', phase: 'Phase 6', backendStatus: 'implemented', frontendStatus: 'implemented', viewPath: '/modules/hr', backendArea: 'Controllers/Phase6/Hr' },
  { id: 18, slug: 'library', name: 'Library Management', phase: 'Phase 6', backendStatus: 'implemented', frontendStatus: 'implemented', viewPath: '/modules/library', backendArea: 'Controllers/Phase6/Library' },
  { id: 19, slug: 'assets', name: 'Asset Management', phase: 'Phase 6', backendStatus: 'implemented', frontendStatus: 'implemented', viewPath: '/modules/assets', backendArea: 'Controllers/Phase6/Assets' },
  { id: 20, slug: 'visitors', name: 'Visitor Management', phase: 'Phase 6', backendStatus: 'implemented', frontendStatus: 'implemented', viewPath: '/modules/visitors', backendArea: 'Controllers/Phase6/Visitors' },
  { id: 21, slug: 'computer-lab', name: 'Computer Lab Management', phase: 'Phase 6', backendStatus: 'implemented', frontendStatus: 'implemented', viewPath: '/modules/computer-lab', backendArea: 'Controllers/Phase6/Labs' },
  { id: 22, slug: 'question-bank', name: 'Question Paper Bank', phase: 'Phase 6', backendStatus: 'implemented', frontendStatus: 'implemented', viewPath: '/modules/question-bank', backendArea: 'Controllers/Phase6/QuestionBank' },
  { id: 23, slug: 'memos-approval', name: 'Memo & Approval Workflow', phase: 'Phase 6', backendStatus: 'implemented', frontendStatus: 'implemented', viewPath: '/modules/memos-approval', backendArea: 'Controllers/Phase6/Memos' },
  { id: 24, slug: 'pos', name: 'POS/Canteen/Tuckshop', phase: 'Phase 6', backendStatus: 'implemented', frontendStatus: 'implemented', viewPath: '/modules/pos', backendArea: 'Controllers/Phase6/Pos' },
  { id: 25, slug: 'sports', name: 'Sports Management', phase: 'Phase 6', backendStatus: 'implemented', frontendStatus: 'implemented', viewPath: '/modules/sports', backendArea: 'Controllers/Phase6/Sports' },
  { id: 26, slug: 'timetable', name: 'Timetable Management', phase: 'Phase 6', backendStatus: 'implemented', frontendStatus: 'implemented', viewPath: '/modules/timetable', backendArea: 'Controllers/Phase6/Timetable' },
  { id: 27, slug: 'communication', name: 'Communication', phase: 'Phase 5', backendStatus: 'implemented', frontendStatus: 'implemented', viewPath: '/modules/communication', backendArea: 'Controllers/Phase5/Communication' },
  { id: 28, slug: 'notifications', name: 'Notifications', phase: 'Phase 5', backendStatus: 'implemented', frontendStatus: 'implemented', viewPath: '/modules/notifications', backendArea: 'Controllers/Phase5/Notifications' },
  { id: 29, slug: 'reporting', name: 'Reporting & Dashboards', phase: 'Phase 5', backendStatus: 'implemented', frontendStatus: 'implemented', viewPath: '/modules/reporting', backendArea: 'Controllers/Phase5/Reports + Phase8/Analytics' },
  { id: 30, slug: 'file-management', name: 'File Management', phase: 'Phase 2', backendStatus: 'implemented', frontendStatus: 'implemented', viewPath: '/modules/file-management', backendArea: 'Controllers/Phase2/FileManagement' },
  { id: 31, slug: 'audit-compliance', name: 'Audit Logs & Compliance', phase: 'Phase 1', backendStatus: 'implemented', frontendStatus: 'implemented', viewPath: '/modules/audit-compliance', backendArea: 'Middleware/Audit + Controllers/Phase1/AuditLogs' },
  { id: 32, slug: 'integrations', name: 'Integrations (Paynow/Stripe/Email/SMS)', phase: 'Phase 6', backendStatus: 'implemented', frontendStatus: 'implemented', viewPath: '/modules/integrations', backendArea: 'Controllers/Phase6/Integrations' },
  { id: 33, slug: 'background-jobs', name: 'Background Jobs', phase: 'Phase 5', backendStatus: 'implemented', frontendStatus: 'implemented', viewPath: '/modules/background-jobs', backendArea: 'Jobs/* + Controllers/Phase5/BackgroundJobs' },
  { id: 34, slug: 'realtime-hub', name: 'Realtime Hub (SignalR)', phase: 'Phase 5', backendStatus: 'implemented', frontendStatus: 'implemented', viewPath: '/modules/realtime-hub', backendArea: 'Realtime/NotificationsHub + Controllers/Phase5/Realtime' },
  { id: 35, slug: 'helpdesk', name: 'Help Desk / Ticketing', phase: 'Phase 5', backendStatus: 'implemented', frontendStatus: 'implemented', viewPath: '/modules/helpdesk', backendArea: 'Controllers/Phase5/HelpDesk' },
  { id: 36, slug: 'system-settings', name: 'System Settings & Master Data', phase: 'Phase 1', backendStatus: 'implemented', frontendStatus: 'implemented', viewPath: '/modules/system-settings', backendArea: 'Controllers/Phase1/SystemSettings' },
  { id: 37, slug: 'api-gateway', name: 'API Gateway Layer', phase: 'Phase 7', backendStatus: 'implemented', frontendStatus: 'implemented', viewPath: '/modules/api-gateway', backendArea: 'Controllers/Phase7/ApiGateway' },
  { id: 38, slug: 'admin-portals', name: 'Admin Portals', phase: 'Phase 5', backendStatus: 'implemented', frontendStatus: 'implemented', viewPath: '/modules/admin-portals', backendArea: 'Controllers/Portals/AdminPortal + frontend/src/pages/Portals/Phase5/AdminPortal' },
  { id: 39, slug: 'parent-portal', name: 'Parent Portal', phase: 'Phase 5', backendStatus: 'implemented', frontendStatus: 'implemented', viewPath: '/modules/parent-portal', backendArea: 'Controllers/Portals/ParentPortal' },
  { id: 40, slug: 'student-portal', name: 'Student Portal', phase: 'Phase 5', backendStatus: 'implemented', frontendStatus: 'implemented', viewPath: '/modules/student-portal', backendArea: 'Controllers/Portals/StudentPortal' },
  { id: 41, slug: 'teacher-portal', name: 'Teacher/Staff Portal', phase: 'Phase 5', backendStatus: 'implemented', frontendStatus: 'implemented', viewPath: '/modules/teacher-portal', backendArea: 'Controllers/Portals/StaffPortal' },
  { id: 42, slug: 'events-management', name: 'Events Management', phase: 'Phase 6', backendStatus: 'implemented', frontendStatus: 'implemented', viewPath: '/operations/events-management', backendArea: 'Controllers/Phase6/Events' },
  { id: 43, slug: 'transport-management', name: 'Transport Management', phase: 'Phase 6', backendStatus: 'implemented', frontendStatus: 'implemented', viewPath: '/operations/transport-management', backendArea: 'Controllers/Phase6/Transport' },
  { id: 44, slug: 'hostel-management', name: 'Hostel Management', phase: 'Phase 6', backendStatus: 'implemented', frontendStatus: 'implemented', viewPath: '/operations/hostel-management', backendArea: 'Controllers/Phase6/Hostels' },
  { id: 45, slug: 'health-management', name: 'Health Management', phase: 'Phase 6', backendStatus: 'implemented', frontendStatus: 'implemented', viewPath: '/operations/health-management', backendArea: 'Controllers/Phase6/Health' },
  { id: 46, slug: 'clinic-management', name: 'Clinic Management', phase: 'Phase 6', backendStatus: 'implemented', frontendStatus: 'implemented', viewPath: '/operations/clinic-management', backendArea: 'Controllers/Phase6/Clinic' }
];

export const getModuleBySlug = (slug: string) =>
  moduleCatalog.find((module) => module.slug === slug);
