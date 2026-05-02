# Remaining Work Checklist

Date: 2026-05-02  
Scope: production hardening after module expansion from 41 to 46 modules.

## 1) Current baseline
- Domain and Persistence projects compile with the new module schema.
- Full API project build is currently blocked by existing Phase 5 portal controller compile errors that predate this pass.
- Frontend module catalog route coverage is present for all modules.
- Frontend production build passes.
- EF migration generated for modules `#42-#46` plus SQL script: `008_phase6_events_transport_hostel_health_clinic.sql`.
- New modules added in this pass:
  - `#42 Events Management`
  - `#43 Transport Management`
  - `#44 Hostel Management`
  - `#45 Health Management`
  - `#46 Clinic Management`

## 2) Remaining engineering work

### A. Deep workflow completion (per module)
- Expand advanced business workflows for modules that currently have starter CRUD only:
  - `#42` event registration, event attendance, venue conflict checks.
  - `#43` trip scheduling, route stop sequencing, parent pickup/drop notifications.
  - `#44` room/bed transfer workflow, hostel discipline logs, checkout/clearance.
  - `#45` immunization schedule engine, chronic condition action plans, alerts.
  - `#46` pharmacy stock movement, prescription fulfillment, referral workflow.

### B. Authorization hardening
- Enforce fine-grained permissions for create/update/delete across all Phase 6 modules (not only policy-level module guards).
- Add role matrices for nurse/matron/transport officer/event coordinator roles.

### C. Validation and domain rules
- Add cross-entity validation rules:
  - no student can have overlapping hostel bed allocations.
  - no vehicle can run overlapping active trips.
  - clinic visits must respect tenant-school isolation and patient ownership.
  - medication dispense quantity cannot exceed available stock.

### D. Integration test expansion
- Add module-level integration tests for `#42-#46` covering:
  - authz behavior
  - tenant/school isolation
  - invalid-relationship rejection
  - workflow correctness

### E. Frontend UX depth
- Replace module starter views with full task-oriented screens:
  - search/filter/sort
  - create/edit forms with validation feedback
  - detail views + timeline/history
  - export-ready tabular grids

### F. Data and operations
- Regenerate consolidated `database/sql/000_full_idempotent_latest.sql` to include migration `008_phase6_events_transport_hostel_health_clinic.sql`.
- Run seed data refresh for Zimbabwe school demo tenants (day school + boarding school).
- Add monitoring dashboards and operational alerts for new module jobs.

## 3) Definition of done for “100% complete”
- Every module has:
  - backend APIs with complete lifecycle behavior
  - UI workflows (not just route placeholders)
  - integration tests for security/isolation/rules
  - auditability on sensitive actions
  - documentation updated in `MODULES.md`, `PHASES.md`, and API docs
