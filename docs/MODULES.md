# Smart Panda Enterprise Modules Guide

This is the master module checklist for the Zimbabwe school SaaS.

## Status Legend
- `Template Ready`: Domain template model exists in codebase.
- `API Started`: Initial controllers/endpoints already started.
- `Planned`: Defined here, implementation pending.

## Full Enterprise Modules (50)

| # | Module | Scope Guidance | Status | Target Phase |
|---|---|---|---|---|
| 1 | Platform & Subscription Management | Tenant onboarding, plans, billing lifecycle, activation/suspension | Template Ready, API Started | Phase 1 |
| 2 | Multi-Tenant & School Management | Tenant -> school hierarchy, school profile, branch/campus setup | Template Ready, API Started | Phase 1 |
| 3 | Identity, Auth, Roles, Permissions | Identity users, JWT/refresh tokens, RBAC, permission matrix | Template Ready, API Started | Phase 1 |
| 4 | User-School Access Control | Restrict users to assigned schools, approval scopes | Template Ready, API Started | Phase 1 |
| 5 | Academic Setup (Years, Terms, Grades, Streams, Subjects) | 3-term academic model setup and controls | Template Ready, API Started | Phase 1 |
| 6 | Student Management | Student profile registration, imports, status transitions | Template Ready, API Started | Phase 2 |
| 7 | Guardian/Parent Linking | Parent/guardian contacts, relationships, primary contact rules | Template Ready, API Started | Phase 2 |
| 8 | Student Enrollment & Academic History | Source of truth for grade/stream/term/year placement | Template Ready, API Started | Phase 2 |
| 9 | Promotion/Rollover Engine (3-term model) | End-of-year promotion/repeat/transfer/withdraw/complete | Template Ready, API Started | Phase 2 |
| 10 | Exam Setup (types, sessions, timetable) | Exam definitions by term/year/grade, scheduling | Template Ready, API Started | Phase 4 |
| 11 | Marks Entry & Approval Workflow | Teacher entry, moderation, approval chain, publish readiness | Template Ready, API Started | Phase 4 |
| 12 | Results, Report Cards, Transcripts | Calculations, ranking, publishing, transcript history | Template Ready, API Started | Phase 4 |
| 13 | Fees Setup (categories, structures) | Fee catalog by grade/term/year, mandatory/optional components | Template Ready, API Started | Phase 3 |
| 14 | Invoicing & Billing | Invoice generation, invoice lines, status tracking | Template Ready, API Started | Phase 3 |
| 15 | Payments, Receipts, Arrears, Payment Plans | Receipting, arrears analysis, installment plans | Template Ready, API Started | Phase 3 |
| 16 | Attendance (student + staff) | Daily/period attendance, absentee tracking, summaries | Template Ready, API Started | Phase 5 |
| 17 | HR (staff, contracts, leave, payroll summaries) | Staff records, contracts, leave flow, payroll period summaries | Template Ready, API Started | Phase 6 |
| 18 | Library Management | Catalog, copies, issue/return, fines, overdue management | Template Ready, API Started | Phase 6 |
| 19 | Asset Management | Asset register, assignment, maintenance, disposal tracking | Template Ready, API Started | Phase 6 |
| 20 | Visitor Management | Check-in/out logs, host linking, security reports | Template Ready, API Started | Phase 6 |
| 21 | Computer Lab Management | Labs, machines, booking and fault tracking | Template Ready, API Started | Phase 6 |
| 22 | Question Paper Bank | Categorized papers, access control, download history | Template Ready, API Started | Phase 6 |
| 23 | Memo & Approval Workflow | Multi-level approvals, comments, attachments, traceability | Template Ready, API Started | Phase 6 |
| 24 | POS/Canteen/Tuckshop | Products, stock movement, cashier sessions, sales | Template Ready, API Started | Phase 6 |
| 25 | Sports Program Administration | Houses, fixtures, competitions, sport outcomes and participation records | Template Ready, API Started | Phase 6 |
| 26 | Timetable Management | Class/teacher/room timetables with conflict handling | Template Ready, API Started | Phase 6 |
| 27 | Communication (announcements, SMS/email, messaging) | Announcements, threads, staff-parent messaging | Template Ready, API Started | Phase 5 |
| 28 | Notifications (in-app + background jobs) | Template-based alerts, status tracking, retry-safe sending | Template Ready, API Started | Phase 5 |
| 29 | Reporting & Dashboards | Operational + executive dashboards and exports | Template Ready, API Started | Phase 5 |
| 30 | File Management (uploads, metadata, storage) | File metadata, safe storage references, file ownership | Template Ready, API Started | Phase 2 |
| 31 | Audit Logs & Compliance | Audit trails for sensitive actions and compliance reporting | Template Ready, API Started | Phase 1 |
| 32 | Integrations (Paynow, Stripe, email, SMS) | Payment gateways + communication provider integrations | Template Ready, API Started | Phase 6 |
| 33 | Background Jobs (Hangfire) | Scheduled billing, reminders, SLA jobs, report jobs | API Started | Phase 5 |
| 34 | Realtime Hub (SignalR: helpdesk/chat/alerts) | Live notifications, ticket updates, chat channels | API Started | Phase 5 |
| 35 | Help Desk / Ticketing | Ticketing, comments, SLA policy and escalation | Template Ready, API Started | Phase 5 |
| 36 | System Settings & Master Data | Tenant/school settings, calendars, grading and policy controls | Template Ready, API Started | Phase 1 |
| 37 | API Gateway Layer (if needed internally) | Internal API composition, cross-cutting security/rate limits | Template Ready, API Started | Phase 7 |
| 38 | Admin Portals (platform, tenant, school) | Admin-facing UI for platform/tenant/school operations | Template Ready, API Started | Phase 5 |
| 39 | Parent Portal | Fees, attendance, results, notices, communication | Template Ready, API Started | Phase 5 |
| 40 | Student Portal | Timetable, results, assignments/resources, notices | Template Ready, API Started | Phase 5 |
| 41 | Teacher/Staff Portal | Attendance entry, marks entry, class tools, memos | Template Ready, API Started | Phase 5 |
| 42 | Events Management | School calendar events, registrations, attendance, venues | Template Ready, API Started | Phase 6 |
| 43 | Transport Management | Vehicles, routes, trips, student transport assignments | Template Ready, API Started | Phase 6 |
| 44 | Hostel Management | Hostels, rooms, bed allocation, boarding status and incidents | Template Ready, API Started | Phase 6 |
| 45 | Health Management | Student/staff health records, screenings, immunization tracking | Template Ready, API Started | Phase 6 |
| 46 | Clinic Management | Clinic visits, diagnoses, treatments, medication dispensing | Template Ready, API Started | Phase 6 |
| 47 | Sports Taxonomy & Team Lifecycle | Sport categories, team master data, rosters, team-level performance lifecycle | Template Ready, API Started | Phase 6 |
| 48 | Club Management | Club categories, membership, meetings, activities, attendance | Template Ready, API Started | Phase 6 |
| 49 | Student Leadership | Leadership positions, assignments, duties, performance tracking | Template Ready, API Started | Phase 6 |
| 50 | Awards & Rewards | Award categories, student awards, ceremonies, recognition system | Template Ready, API Started | Phase 6 |

## Scope Boundaries (No Repetition Rules)
- Module `25` owns competitions, fixtures, houses, and participation outcomes.
- Module `47` owns sport master data (categories, teams, rosters) and team lifecycle.
- Module `48` owns non-sport co-curricular clubs.
- Module `49` owns student leadership governance and duty tracking.
- Module `50` owns recognition workflows (awards, ceremonies, points, certificates).

## Non-Negotiable Zimbabwe Rules
- Academic year follows a strict 3-term structure.
- Student grade history must come from `StudentEnrollment` (not direct grade on `Student`).
- Fees and payments must be term/year-aware for period reporting.
- All business data must enforce tenant and school boundaries.

## System Status
- Backend: broad module API coverage with active integration tests.
- Frontend: module-route coverage across the enterprise module catalog.
- Remaining work: deepen workflow UX and business-rule depth in selected heavy modules.
