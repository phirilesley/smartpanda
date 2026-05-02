# Cross-Entity Validation Rules

This document outlines the comprehensive cross-entity validation rules implemented in the Smart School System to ensure data integrity and business logic compliance across different modules.

## Overview

Cross-entity validation ensures that operations in one module don't violate business rules or create inconsistencies in other modules. This is critical for maintaining data integrity in a complex school management system.

## Validation Categories

### 1. Student-Related Validations

#### Student Enrollment Validation
**Controller**: `StudentEnrollmentsController`
**Action**: `Create`
**Validations Performed**:
- ✅ Student exists and is active
- ✅ Class exists and is in the same school
- ✅ Academic year exists and is valid
- ✅ Student not already enrolled in another class for the same academic year
- ✅ Class capacity not exceeded
- ✅ Age appropriateness for the class
- ✅ Hostel compatibility checks
- ✅ Fee structure availability

**Error Examples**:
- `"Student is already enrolled in a class for this academic year"`
- `"Class has reached maximum capacity of 30 students"`
- `"Student is too young for this class. Minimum age: 6"`

**Warning Examples**:
- `"Student gender (Male) may not match hostel policy (Female)"`
- `"No fee structure defined for this grade and academic year"`

### 2. Finance-Related Validations

#### Student Invoice Generation Validation
**Controller**: `StudentInvoicesController`
**Action**: `Create`
**Validations Performed**:
- ✅ Student has active enrollment
- ✅ Term belongs to the specified academic year
- ✅ No duplicate invoice for the same term
- ✅ Outstanding balance checks
- ✅ Applicable discounts identification

**Error Examples**:
- `"Student is not enrolled for this academic year"`
- `"Invoice already exists for this student, academic year, and term"`

**Warning Examples**:
- `"Student has outstanding balance of $1,250.00"`
- `"2 discount(s) will be applied to this invoice"`

#### Payment Processing Validation
**Controller**: `PaymentsController`
**Action**: `Create`
**Validations Performed**:
- ✅ Invoice exists and is not already paid
- ✅ Payment amount doesn't exceed outstanding balance
- ✅ Payment amount is positive
- ✅ Payment plan compliance checks

**Error Examples**:
- `"Payment amount ($500.00) exceeds outstanding balance ($450.00)"`
- `"Invoice is already paid"`

**Warning Examples**:
- `"Payment amount is less than the typical installment amount of $150.00"`

### 3. Event-Related Validations

#### Event Registration Validation
**Controller**: `EventsController`
**Action**: `RegisterParticipants`
**Validations Performed**:
- ✅ Event exists and is in the future
- ✅ Event capacity not exceeded
- ✅ Participants not already registered
- ✅ No conflicting events for participants

**Error Examples**:
- `"Cannot register for past events"`
- `"Only 5 spot(s) available. Requested: 8"`

**Warning Examples**:
- `"Participant has conflicting events: Annual Sports Day, Science Fair"`

### 4. Transport-Related Validations

#### Transport Assignment Validation
**Controller**: `TransportController`
**Action**: `CreateAssignment`
**Validations Performed**:
- ✅ Student exists and is active
- ✅ Route exists
- ✅ Stops belong to the specified route
- ✅ No existing transport assignment
- ✅ Route capacity not exceeded
- ✅ Hostel compatibility checks

**Error Examples**:
- `"Pickup stop does not belong to the specified route"`
- `"Transport route has reached maximum capacity of 50 students"`

**Warning Examples**:
- `"Student already has transport assignment for route: Downtown Express"`
- `"Transport route may not serve the student's hostel location"`

### 5. Hostel-Related Validations

#### Hostel Allocation Validation
**Controller**: `HostelsController`
**Action**: `CreateAllocation`
**Validations Performed**:
- ✅ Student exists
- ✅ Bed exists and is available
- ✅ Gender policy compliance
- ✅ No overlapping allocations
- ✅ Room capacity not exceeded

**Error Examples**:
- `"Bed is not available. Current status: Occupied"`
- `"Student gender (Male) does not match hostel policy (Female)"`

**Warning Examples**:
- `"Student already allocated to bed: A101 in Main Hostel"`
- `"Room has reached maximum capacity of 4 occupants"`

### 6. Health-Related Validations

#### Health Record Creation Validation
**Controller**: `HealthController`
**Action**: `CreateProfile`
**Validations Performed**:
- ✅ Student exists
- ✅ Duplicate health profile checks
- ✅ Severe allergy identification
- ✅ Age-appropriate health screening requirements

**Error Examples**:
- `"Student not found"`

**Warning Examples**:
- `"Student already has a health profile. Consider updating the existing profile"`
- `"Student has severe allergies that may require special arrangements in cafeteria and clinic"`
- `"Student may need the following health screenings: Vision, Hearing, Dental"`

### 7. Academic-Related Validations

#### Grade Assignment Validation
**Controller**: `StudentMarksController`
**Action**: `Create`
**Validations Performed**:
- ✅ Student exists and is enrolled
- ✅ Subject exists
- ✅ Exam exists
- ✅ Score range validation
- ✅ Duplicate grade checks
- ✅ Class-subject enrollment verification

**Error Examples**:
- `"Score must be between 0 and 100"`
- `"Student is not enrolled in any class"`

**Warning Examples**:
- `"Student already has a grade for this subject and exam. Consider updating the existing grade"`
- `"Student may not be enrolled in a class that offers this subject"`

## Implementation Details

### Validation Service
The `CrossEntityValidationService` provides centralized validation logic that can be used across different controllers and services.

### Validation Filter
The `CrossEntityValidationFilter` automatically applies validation to specified controller actions, providing a seamless validation experience.

### Response Format
All validation responses follow a consistent format:

```json
{
  "success": false,
  "errors": [
    "Class has reached maximum capacity of 30 students"
  ],
  "warnings": [
    "Student gender (Male) may not match hostel policy (Female)"
  ],
  "message": "Cross-entity validation failed"
}
```

## Benefits

1. **Data Integrity**: Prevents inconsistent data across modules
2. **Business Rule Enforcement**: Ensures compliance with school policies
3. **User Experience**: Provides clear, actionable error messages
4. **Proactive Warnings**: Alerts users to potential issues before they become problems
5. **Audit Trail**: Maintains validation history for compliance

## Configuration

Validation rules can be configured per:
- **Tenant**: Different validation rules for different schools
- **Academic Year**: Year-specific validation requirements
- **User Role**: Different validation strictness for different roles

## Monitoring

All validation failures are logged with:
- Timestamp
- User performing the operation
- Validation rule that failed
- Data provided for validation
- IP address and session information

This monitoring helps in:
- Identifying common validation failures
- Improving user guidance
- Detecting potential system abuse
- Compliance reporting
