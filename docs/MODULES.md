# Smart Panda Enterprise Modules Guide

This is the master module checklist for the Zimbabwe school SaaS.

## Status Legend
- `Template Ready`: Domain template model exists in codebase.
- `API Started`: Initial controllers/endpoints already started.
- `Planned`: Defined here, implementation pending.

## Full Enterprise Modules (41)

| # | Module | Scope Guidance | Status | Target Phase |
|---|---|---|---|---|
| 1 | Platform & Subscription Management | Tenant onboarding, plans, billing lifecycle, activation/suspension | Template Ready, API Started | Phase 1 |
| 2 | Multi-Tenant & School Management | Tenant -> School hierarchy, school profile, branch/campus setup | Template Ready, API Started | Phase 1 |
| 3 | Identity, Auth, Roles, Permissions | Identity users, JWT/refresh tokens, RBAC, permission matrix | Template Ready | Phase 1 |
| 4 | User-School Access Control | Restrict users to assigned schools, approval scopes | Template Ready | Phase 1 |
| 5 | Academic Setup (Years, Terms, Grades, Streams, Subjects) | 3-term academic model setup and controls | Template Ready, API Started (AcademicYear) | Phase 1 |
| 6 | Student Management | Student profile registration, imports, status transitions | Template Ready, API Started | Phase 2 |
| 7 | Guardian/Parent Linking | Parent/guardian contacts, relationships, primary contact rules | Template Ready, API Started | Phase 2 |
| 8 | Student Enrollment & Academic History | Source of truth for grade/stream/term/year placement | Template Ready, API Started | Phase 2 |
| 9 | Promotion/Rollover Engine (3-term model) | End-of-year promotion/repeat/transfer/withdraw/complete | Template Ready, API Started | Phase 2 |
| 10 | Exam Setup (types, sessions, timetable) | Exam definitions by term/year/grade, scheduling | Template Ready | Phase 4 |
| 11 | Marks Entry & Approval Workflow | Teacher entry, moderation, approval chain, publish readiness | Template Ready | Phase 4 |
| 12 | Results, Report Cards, Transcripts | Calculations, ranking, publishing, transcript history | Template Ready | Phase 4 |
| 13 | Fees Setup (categories, structures) | Fee catalog by grade/term/year, mandatory/optional components | Template Ready | Phase 3 |
| 14 | Invoicing & Billing | Invoice generation, invoice lines, status tracking | Template Ready | Phase 3 |
| 15 | Payments, Receipts, Arrears, Payment Plans | Receipting, arrears analysis, installment plans | Template Ready | Phase 3 |
| 16 | Attendance (student + staff) | Daily/period attendance, absentee tracking, summaries | Template Ready | Phase 5 |
| 17 | HR (staff, contracts, leave, payroll summaries) | Staff records, contracts, leave flow, payroll period summaries | Template Ready | Phase 6 |
| 18 | Library Management | Catalog, copies, issue/return, fines, overdue management | Template Ready | Phase 6 |
| 19 | Asset Management | Asset register, assignment, maintenance, disposal tracking | Template Ready | Phase 6 |
| 20 | Visitor Management | Check-in/out logs, host linking, security reports | Template Ready | Phase 6 |
| 21 | Computer Lab Management | Labs, machines, booking and fault tracking | Template Ready | Phase 6 |
| 22 | Question Paper Bank | Categorized papers, access control, download history | Template Ready | Phase 6 |
| 23 | Memo & Approval Workflow | Multi-level approvals, comments, attachments, traceability | Template Ready | Phase 6 |
| 24 | POS/Canteen/Tuckshop | Products, stock movement, cashier sessions, sales | Template Ready | Phase 6 |
| 25 | Sports Management | Houses, teams, fixtures, results, student participation | Template Ready | Phase 6 |
| 26 | Timetable Management | Class/teacher/room timetables with conflict handling | Template Ready | Phase 6 |
| 27 | Communication (announcements, SMS/email, messaging) | Announcements, threads, staff-parent messaging | Template Ready | Phase 5 |
| 28 | Notifications (in-app + background jobs) | Template-based alerts, status tracking, retry-safe sending | Template Ready | Phase 5 |
| 29 | Reporting & Dashboards | Operational + executive dashboards and exports | Template Ready | Phase 5 |
| 30 | File Management (uploads, metadata, storage) | File metadata, safe storage references, file ownership | Template Ready | Phase 2 |
| 31 | Audit Logs & Compliance | Audit trails for sensitive actions and compliance reporting | Template Ready | Phase 1 |
| 32 | Integrations (Paynow, Stripe, email, SMS) | Payment gateways + communication provider integrations | Template Ready | Phase 6 |
| 33 | Background Jobs (Hangfire) | Scheduled billing, reminders, SLA jobs, report jobs | Planned | Phase 5 |
| 34 | Realtime Hub (SignalR: helpdesk/chat/alerts) | Live notifications, ticket updates, chat channels | Planned | Phase 5 |
| 35 | Help Desk / Ticketing | Ticketing, comments, SLA policy and escalation | Template Ready | Phase 5 |
| 36 | System Settings & Master Data | Tenant/school settings, calendars, grading and policy controls | Template Ready, API Started | Phase 1 |
| 37 | API Gateway Layer (if needed internally) | Internal API composition, cross-cutting security/rate limits | Planned | Phase 7 |
| 38 | Admin Portals (platform, tenant, school) | Admin-facing UI for platform/tenant/school operations | Template Ready (portal prefs) | Phase 5 |
| 39 | Parent Portal | Fees, attendance, results, notices, communication | Template Ready (portal prefs) | Phase 5 |
| 40 | Student Portal | Timetable, results, assignments/resources, notices | Template Ready (portal prefs) | Phase 5 |
| 41 | Teacher/Staff Portal | Attendance entry, marks entry, class tools, memos | Template Ready (portal prefs) | Phase 5 |

## Non-Negotiable Zimbabwe Rules
- Academic year follows 3-term structure.
- Student grade history must come from `StudentEnrollment` (not direct grade on `Student`).
- Fees and payments must be term/year-aware for period reporting.
- All business data must enforce tenant and school boundaries.

## Next Execution Order
1. Complete Phase 1 APIs: terms, grades, streams, subjects, permissions, school access filtering.
2. Add Identity + JWT + refresh token flow.
3. Add first EF migration and SQL script baseline.

