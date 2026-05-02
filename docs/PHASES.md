# Delivery Phases (Enterprise Matrix)

This file maps all 46 modules to delivery phases.

## Phase 1 - Foundation
- 1. Platform & Subscription Management
- 2. Multi-Tenant & School Management
- 3. Identity, Auth, Roles, Permissions
- 4. User-School Access Control
- 5. Academic Setup (Years, Terms, Grades, Streams, Subjects)
- 31. Audit Logs & Compliance
- 36. System Settings & Master Data

## Phase 2 - Student Core
- 6. Student Management
- 7. Guardian/Parent Linking
- 8. Student Enrollment & Academic History
- 9. Promotion/Rollover Engine (3-term model)
- 30. File Management (uploads, metadata, storage)

## Phase 3 - Finance Core
- 13. Fees Setup (categories, structures)
- 14. Invoicing & Billing
- 15. Payments, Receipts, Arrears, Payment Plans

## Phase 4 - Exams and Results
- 10. Exam Setup (types, sessions, timetable)
- 11. Marks Entry & Approval Workflow
- 12. Results, Report Cards, Transcripts

## Phase 5 - Portals, Communication, and Service Operations
- 16. Attendance (student + staff)
- 27. Communication (announcements, SMS/email, messaging)
- 28. Notifications (in-app + background jobs)
- 29. Reporting & Dashboards
- 33. Background Jobs (Hangfire)
- 34. Realtime Hub (SignalR: helpdesk/chat/alerts)
- 35. Help Desk / Ticketing
- 38. Admin Portals (platform, tenant, school)
- 39. Parent Portal
- 40. Student Portal
- 41. Teacher/Staff Portal

## Phase 6 - School Operations Expansion
- 17. HR (staff, contracts, leave, payroll summaries)
- 18. Library Management
- 19. Asset Management
- 20. Visitor Management
- 21. Computer Lab Management
- 22. Question Paper Bank
- 23. Memo & Approval Workflow
- 24. POS/Canteen/Tuckshop
- 25. Sports Management
- 26. Timetable Management
- 32. Integrations (Paynow, Stripe, email, SMS)
- 42. Events Management
- 43. Transport Management
- 44. Hostel Management
- 45. Health Management
- 46. Clinic Management

## Phase 7 - Platform Optimization (Conditional)
- 37. API Gateway Layer (if needed internally)

### Phase 7 Hardening Started
- API versioning enabled (`X-API-Version` / `api-version`, default `1.0`).
- Rate limiting enabled (global partition + named sensitive-write policy).
- Tenant feature flags implemented (`TenantFeatureFlags` + `/api/feature-flags`).
- Integration secret protection/rotation implemented for integration settings.

## Notes
- Zimbabwe academic lifecycle uses a strict 3-term year model.
- Student academic placement history must come from `StudentEnrollment`.
- Term/year-aware finance is mandatory for billing and reporting integrity.
