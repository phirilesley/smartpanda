# Remaining Work Checklist (Current Baseline)

Date: 2026-05-03  
Scope: production hardening after enterprise scope alignment to 50 modules.

## Historical note
This file previously tracked expansion from 41 to 46 modules. That baseline is now superseded by:
- `docs/MODULES.md` (50 modules)
- `docs/PHASES.md` (phase mapping for all 50)

## 1) Current baseline
- Module catalog and phase map are aligned at 50 modules.
- Backend builds successfully.
- Integration tests pass on current suite (`221/221`).
- Consolidated SQL script exists at `database/sql/000_full_idempotent_latest.sql`.

## 2) Remaining engineering depth (quality, not catalog count)

### A. Workflow depth
- Expand selected module workflows from starter CRUD to full business lifecycle where needed.
- Prioritize high-risk domains: finance approvals, clinic/health safety checks, hostel allocation edge cases, transport lifecycle exceptions.

### B. Authorization depth
- Tighten fine-grained permissions per action beyond module-level policy gates.
- Validate role matrices for school operations personas (matron, nurse, transport officer, events coordinator, bursar, etc.).

### C. Rule hardening
- Add/expand cross-entity invariants and conflict checks.
- Ensure all sensitive paths remain tenant/school isolated with explicit test coverage.

### D. UI workflow maturity
- Ensure module screens have full task flows: search/filter, create/edit validation, history/timeline, and export-friendly views.

### E. Operational readiness
- Keep migration and consolidated SQL artifacts synchronized after each schema change.
- Maintain seed/demo datasets for Zimbabwe day-school and boarding-school scenarios.

## 3) Definition of done for "100% complete"
- Every module has:
  - backend APIs with complete lifecycle behavior
  - UI workflows beyond placeholders
  - integration tests for authz/isolation/rules
  - auditable trails for sensitive actions
  - documentation updated across `MODULES.md`, `PHASES.md`, and API references
