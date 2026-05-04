-- Smart School System Database Schema
-- Version 1.0 - Complete Schema with All Modules
-- Generated: March 2024

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS SmartSchool
GO

USE SmartSchool
GO

-- ========================================
-- TENANT AND SCHOOL ENTITIES
-- ========================================

CREATE TABLE Tenants (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    Name NVARCHAR(200) NOT NULL,
    Description NVARCHAR(500),
    Domain NVARCHAR(100) NOT NULL,
    ContactEmail NVARCHAR(255) NOT NULL,
    ContactPhone NVARCHAR(50),
    Address NVARCHAR(500),
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    IsDeleted BIT NOT NULL DEFAULT 0,
    RowVersion ROWVERSION NOT NULL
);

CREATE TABLE Schools (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    TenantId UNIQUEIDENTIFIER NOT NULL,
    Name NVARCHAR(200) NOT NULL,
    Code NVARCHAR(50) NOT NULL,
    Type NVARCHAR(50) NOT NULL, -- 'Primary', 'Secondary', 'University'
    Address NVARCHAR(500) NOT NULL,
    City NVARCHAR(100) NOT NULL,
    State NVARCHAR(100) NOT NULL,
    Country NVARCHAR(100) NOT NULL,
    PostalCode NVARCHAR(20),
    Phone NVARCHAR(50),
    Email NVARCHAR(255),
    Website NVARCHAR(500),
    EstablishedDate DATE,
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    IsDeleted BIT NOT NULL DEFAULT 0,
    RowVersion ROWVERSION NOT NULL,
    CONSTRAINT FK_Schools_TenantId FOREIGN KEY (TenantId) REFERENCES Tenants(Id)
);

-- ========================================
-- ACADEMIC MODULE ENTITIES
-- ========================================

CREATE TABLE AcademicYears (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    TenantId UNIQUEIDENTIFIER NOT NULL,
    SchoolId UNIQUEIDENTIFIER NOT NULL,
    Name NVARCHAR(100) NOT NULL,
    StartDate DATE NOT NULL,
    EndDate DATE NOT NULL,
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    IsDeleted BIT NOT NULL DEFAULT 0,
    RowVersion ROWVERSION NOT NULL,
    CONSTRAINT FK_AcademicYears_TenantId FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    CONSTRAINT FK_AcademicYears_SchoolId FOREIGN KEY (SchoolId) REFERENCES Schools(Id)
);

CREATE TABLE Terms (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    TenantId UNIQUEIDENTIFIER NOT NULL,
    SchoolId UNIQUEIDENTIFIER NOT NULL,
    AcademicYearId UNIQUEIDENTIFIER NOT NULL,
    Name NVARCHAR(100) NOT NULL,
    StartDate DATE NOT NULL,
    EndDate DATE NOT NULL,
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    IsDeleted BIT NOT NULL DEFAULT 0,
    RowVersion ROWVERSION NOT NULL,
    CONSTRAINT FK_Terms_TenantId FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    CONSTRAINT FK_Terms_SchoolId FOREIGN KEY (SchoolId) REFERENCES Schools(Id),
    CONSTRAINT FK_Terms_AcademicYearId FOREIGN KEY (AcademicYearId) REFERENCES AcademicYears(Id)
);

CREATE TABLE Grades (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    TenantId UNIQUEIDENTIFIER NOT NULL,
    SchoolId UNIQUEIDENTIFIER NOT NULL,
    Name NVARCHAR(100) NOT NULL,
    Code NVARCHAR(20) NOT NULL,
    Level NVARCHAR(50) NOT NULL, -- 'Kindergarten', 'Primary', 'Secondary', 'High School'
    Description NVARCHAR(500),
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    IsDeleted BIT NOT NULL DEFAULT 0,
    RowVersion ROWVERSION NOT NULL,
    CONSTRAINT FK_Grades_TenantId FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    CONSTRAINT FK_Grades_SchoolId FOREIGN KEY (SchoolId) REFERENCES Schools(Id)
);

CREATE TABLE Classes (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    TenantId UNIQUEIDENTIFIER NOT NULL,
    SchoolId UNIQUEIDENTIFIER NOT NULL,
    GradeId UNIQUEIDENTIFIER NOT NULL,
    Name NVARCHAR(100) NOT NULL,
    Code NVARCHAR(20) NOT NULL,
    MaxStudents INT NOT NULL,
    CurrentStudents INT NOT NULL DEFAULT 0,
    Room NVARCHAR(100),
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    IsDeleted BIT NOT NULL DEFAULT 0,
    RowVersion ROWVERSION NOT NULL,
    CONSTRAINT FK_Classes_TenantId FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    CONSTRAINT FK_Classes_SchoolId FOREIGN KEY (SchoolId) REFERENCES Schools(Id),
    CONSTRAINT FK_Classes_GradeId FOREIGN KEY (GradeId) REFERENCES Grades(Id)
);

CREATE TABLE Subjects (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    TenantId UNIQUEIDENTIFIER NOT NULL,
    SchoolId UNIQUEIDENTIFIER NOT NULL,
    Name NVARCHAR(100) NOT NULL,
    Code NVARCHAR(20) NOT NULL,
    Description NVARCHAR(500),
    Credits INT NOT NULL DEFAULT 1,
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    IsDeleted BIT NOT NULL DEFAULT 0,
    RowVersion ROWVERSION NOT NULL,
    CONSTRAINT FK_Subjects_TenantId FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    CONSTRAINT FK_Subjects_SchoolId FOREIGN KEY (SchoolId) REFERENCES Schools(Id)
);

CREATE TABLE SubjectAssignments (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    TenantId UNIQUEIDENTIFIER NOT NULL,
    SchoolId UNIQUEIDENTIFIER NOT NULL,
    ClassId UNIQUEIDENTIFIER NOT NULL,
    SubjectId UNIQUEIDENTIFIER NOT NULL,
    TeacherId UNIQUEIDENTIFIER,
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    IsDeleted BIT NOT NULL DEFAULT 0,
    RowVersion ROWVERSION NOT NULL,
    CONSTRAINT FK_SubjectAssignments_TenantId FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    CONSTRAINT FK_SubjectAssignments_SchoolId FOREIGN KEY (SchoolId) REFERENCES Schools(Id),
    CONSTRAINT FK_SubjectAssignments_ClassId FOREIGN KEY (ClassId) REFERENCES Classes(Id),
    CONSTRAINT FK_SubjectAssignments_SubjectId FOREIGN KEY (SubjectId) REFERENCES Subjects(Id)
);

CREATE TABLE ExamSessions (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    TenantId UNIQUEIDENTIFIER NOT NULL,
    SchoolId UNIQUEIDENTIFIER NOT NULL,
    AcademicYearId UNIQUEIDENTIFIER NOT NULL,
    TermId UNIQUEIDENTIFIER NOT NULL,
    Title NVARCHAR(200) NOT NULL,
    Description NVARCHAR(1000),
    StartDateUtc DATETIME2 NOT NULL,
    EndDateUtc DATETIME2 NOT NULL,
    MaxScore DECIMAL(10,2) NOT NULL,
    Status NVARCHAR(50) NOT NULL DEFAULT 'Scheduled',
    CreatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    IsDeleted BIT NOT NULL DEFAULT 0,
    RowVersion ROWVERSION NOT NULL,
    CONSTRAINT FK_ExamSessions_TenantId FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    CONSTRAINT FK_ExamSessions_SchoolId FOREIGN KEY (SchoolId) REFERENCES Schools(Id),
    CONSTRAINT FK_ExamSessions_AcademicYearId FOREIGN KEY (AcademicYearId) REFERENCES AcademicYears(Id),
    CONSTRAINT FK_ExamSessions_TermId FOREIGN KEY (TermId) REFERENCES Terms(Id)
);

-- ========================================
-- STUDENT MODULE ENTITIES
-- ========================================

CREATE TABLE Students (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    TenantId UNIQUEIDENTIFIER NOT NULL,
    SchoolId UNIQUEIDENTIFIER NOT NULL,
    StudentNumber NVARCHAR(50) NOT NULL,
    FirstName NVARCHAR(100) NOT NULL,
    LastName NVARCHAR(100) NOT NULL,
    MiddleName NVARCHAR(100),
    DateOfBirth DATE NOT NULL,
    Gender NVARCHAR(20) NOT NULL,
    Email NVARCHAR(255),
    Phone NVARCHAR(50),
    Address NVARCHAR(500),
    Nationality NVARCHAR(100),
    Religion NVARCHAR(50),
    AdmissionDate DATE NOT NULL,
    Status NVARCHAR(50) NOT NULL DEFAULT 'Active',
    ProfileImage NVARCHAR(500),
    CreatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    IsDeleted BIT NOT NULL DEFAULT 0,
    RowVersion ROWVERSION NOT NULL,
    CONSTRAINT UQ_Students_StudentNumber UNIQUE (StudentNumber),
    CONSTRAINT FK_Students_TenantId FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    CONSTRAINT FK_Students_SchoolId FOREIGN KEY (SchoolId) REFERENCES Schools(Id)
);

CREATE TABLE Guardians (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    TenantId UNIQUEIDENTIFIER NOT NULL,
    SchoolId UNIQUEIDENTIFIER NOT NULL,
    FirstName NVARCHAR(100) NOT NULL,
    LastName NVARCHAR(100) NOT NULL,
    Email NVARCHAR(255),
    Phone NVARCHAR(50) NOT NULL,
    Address NVARCHAR(500),
    Relationship NVARCHAR(50),
    Occupation NVARCHAR(100),
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    IsDeleted BIT NOT NULL DEFAULT 0,
    RowVersion ROWVERSION NOT NULL,
    CONSTRAINT FK_Guardians_TenantId FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    CONSTRAINT FK_Guardians_SchoolId FOREIGN KEY (SchoolId) REFERENCES Schools(Id)
);

CREATE TABLE StudentGuardians (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    TenantId UNIQUEIDENTIFIER NOT NULL,
    SchoolId UNIQUEIDENTIFIER NOT NULL,
    StudentId UNIQUEIDENTIFIER NOT NULL,
    GuardianId UNIQUEIDENTIFIER NOT NULL,
    IsPrimaryContact BIT NOT NULL DEFAULT 0,
    Relationship NVARCHAR(50) NOT NULL,
    CreatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    IsDeleted BIT NOT NULL DEFAULT 0,
    RowVersion ROWVERSION NOT NULL,
    CONSTRAINT FK_StudentGuardians_TenantId FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    CONSTRAINT FK_StudentGuardians_SchoolId FOREIGN KEY (SchoolId) REFERENCES Schools(Id),
    CONSTRAINT FK_StudentGuardians_StudentId FOREIGN KEY (StudentId) REFERENCES Students(Id),
    CONSTRAINT FK_StudentGuardians_GuardianId FOREIGN KEY (GuardianId) REFERENCES Guardians(Id)
);

CREATE TABLE StudentEnrollments (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    TenantId UNIQUEIDENTIFIER NOT NULL,
    SchoolId UNIQUEIDENTIFIER NOT NULL,
    StudentId UNIQUEIDENTIFIER NOT NULL,
    ClassId UNIQUEIDENTIFIER NOT NULL,
    AcademicYearId UNIQUEIDENTIFIER NOT NULL,
    TermId UNIQUEIDENTIFIER NOT NULL,
    EnrollmentDate DATE NOT NULL,
    Status NVARCHAR(50) NOT NULL DEFAULT 'Active',
    RollNumber INT,
    CreatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    IsDeleted BIT NOT NULL DEFAULT 0,
    RowVersion ROWVERSION NOT NULL,
    CONSTRAINT UQ_StudentEnrollments_Student_AcademicYear_Term UNIQUE (StudentId, AcademicYearId, TermId),
    CONSTRAINT FK_StudentEnrollments_TenantId FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    CONSTRAINT FK_StudentEnrollments_SchoolId FOREIGN KEY (SchoolId) REFERENCES Schools(Id),
    CONSTRAINT FK_StudentEnrollments_StudentId FOREIGN KEY (StudentId) REFERENCES Students(Id),
    CONSTRAINT FK_StudentEnrollments_ClassId FOREIGN KEY (ClassId) REFERENCES Classes(Id),
    CONSTRAINT FK_StudentEnrollments_AcademicYearId FOREIGN KEY (AcademicYearId) REFERENCES AcademicYears(Id),
    CONSTRAINT FK_StudentEnrollments_TermId FOREIGN KEY (TermId) REFERENCES Terms(Id)
);

CREATE TABLE StudentMarks (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    TenantId UNIQUEIDENTIFIER NOT NULL,
    SchoolId UNIQUEIDENTIFIER NOT NULL,
    StudentId UNIQUEIDENTIFIER NOT NULL,
    SubjectId UNIQUEIDENTIFIER NOT NULL,
    ExamSessionId UNIQUEIDENTIFIER NOT NULL,
    Score DECIMAL(10,2) NOT NULL,
    Grade NVARCHAR(10),
    Remarks NVARCHAR(1000),
    CreatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    IsDeleted BIT NOT NULL DEFAULT 0,
    RowVersion ROWVERSION NOT NULL,
    CONSTRAINT FK_StudentMarks_TenantId FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    CONSTRAINT FK_StudentMarks_SchoolId FOREIGN KEY (SchoolId) REFERENCES Schools(Id),
    CONSTRAINT FK_StudentMarks_StudentId FOREIGN KEY (StudentId) REFERENCES Students(Id),
    CONSTRAINT FK_StudentMarks_SubjectId FOREIGN KEY (SubjectId) REFERENCES Subjects(Id),
    CONSTRAINT FK_StudentMarks_ExamSessionId FOREIGN KEY (ExamSessionId) REFERENCES ExamSessions(Id)
);

-- ========================================
-- FINANCE MODULE ENTITIES
-- ========================================

CREATE TABLE FeeCategories (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    TenantId UNIQUEIDENTIFIER NOT NULL,
    SchoolId UNIQUEIDENTIFIER NOT NULL,
    Name NVARCHAR(100) NOT NULL,
    Description NVARCHAR(500),
    IsMandatory BIT NOT NULL DEFAULT 0,
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    IsDeleted BIT NOT NULL DEFAULT 0,
    RowVersion ROWVERSION NOT NULL,
    CONSTRAINT FK_FeeCategories_TenantId FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    CONSTRAINT FK_FeeCategories_SchoolId FOREIGN KEY (SchoolId) REFERENCES Schools(Id)
);

CREATE TABLE FeeStructures (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    TenantId UNIQUEIDENTIFIER NOT NULL,
    SchoolId UNIQUEIDENTIFIER NOT NULL,
    AcademicYearId UNIQUEIDENTIFIER NOT NULL,
    TermId UNIQUEIDENTIFIER NOT NULL,
    GradeId UNIQUEIDENTIFIER NOT NULL,
    FeeCategoryId UNIQUEIDENTIFIER NOT NULL,
    Amount DECIMAL(18,2) NOT NULL,
    Currency NVARCHAR(10) NOT NULL DEFAULT 'USD',
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    IsDeleted BIT NOT NULL DEFAULT 0,
    RowVersion ROWVERSION NOT NULL,
    CONSTRAINT FK_FeeStructures_TenantId FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    CONSTRAINT_FeeStructures_SchoolId FOREIGN KEY (SchoolId) REFERENCES Schools(Id),
    CONSTRAINT_FeeStructures_AcademicYearId FOREIGN KEY (AcademicYearId) REFERENCES AcademicYears(Id),
    CONSTRAINT_FeeStructures_TermId FOREIGN KEY (TermId) REFERENCES Terms(Id),
    CONSTRAINT_FeeStructures_GradeId FOREIGN KEY (GradeId) REFERENCES Grades(Id),
    CONSTRAINT_FeeStructures_FeeCategoryId FOREIGN KEY (FeeCategoryId) REFERENCES FeeCategories(Id)
);

CREATE TABLE StudentInvoices (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    TenantId UNIQUEIDENTIFIER NOT NULL,
    SchoolId UNIQUEIDENTIFIER NOT NULL,
    StudentId UNIQUEIDENTIFIER NOT NULL,
    AcademicYearId UNIQUEIDENTIFIER NOT NULL,
    TermId UNIQUEIDENTIFIER NOT NULL,
    GradeId UNIQUEIDENTIFIER NOT NULL,
    InvoiceNumber NVARCHAR(100) NOT NULL,
    TotalAmount DECIMAL(18,2) NOT NULL,
    Currency NVARCHAR(10) NOT NULL DEFAULT 'USD',
    Status NVARCHAR(50) NOT NULL DEFAULT 'Draft',
    DueDate DATE NOT NULL,
    IssuedDate DATE,
    CreatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    IsDeleted BIT NOT NULL DEFAULT 0,
    RowVersion ROWVERSION NOT NULL,
    CONSTRAINT UQ_StudentInvoices_InvoiceNumber UNIQUE (InvoiceNumber),
    CONSTRAINT FK_StudentInvoices_TenantId FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    CONSTRAINT FK_StudentInvoices_SchoolId FOREIGN KEY (SchoolId) REFERENCES Schools(Id),
    CONSTRAINT FK_StudentInvoices_StudentId FOREIGN KEY (StudentId) REFERENCES Students(Id),
    CONSTRAINT FK_StudentInvoices_AcademicYearId FOREIGN KEY (AcademicYearId) REFERENCES AcademicYears(Id),
    CONSTRAINT FK_StudentInvoices_TermId FOREIGN KEY (TermId) REFERENCES Terms(Id),
    CONSTRAINT FK_StudentInvoices_GradeId FOREIGN KEY (GradeId) REFERENCES Grades(Id)
);

CREATE TABLE StudentInvoiceLines (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    TenantId UNIQUEIDENTIFIER NOT NULL,
    SchoolId UNIQUEIDENTIFIER NOT NULL,
    StudentInvoiceId UNIQUEIDENTIFIER NOT NULL,
    FeeCategoryId UNIQUEIDENTIFIER NOT NULL,
    Description NVARCHAR(500) NOT NULL,
    Amount DECIMAL(18,2) NOT NULL,
    CreatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    IsDeleted BIT NOT NULL DEFAULT 0,
    RowVersion ROWVERSION NOT NULL,
    CONSTRAINT FK_StudentInvoiceLines_TenantId FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    CONSTRAINT FK_StudentInvoiceLines_SchoolId FOREIGN KEY (SchoolId) REFERENCES Schools(Id),
    CONSTRAINT_StudentInvoiceLines_StudentInvoiceId FOREIGN KEY (StudentInvoiceId) REFERENCES StudentInvoices(Id),
    CONSTRAINT_StudentInvoiceLines_FeeCategoryId FOREIGN KEY (FeeCategoryId) REFERENCES FeeCategories(Id)
);

CREATE TABLE Payments (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    TenantId UNIQUEIDENTIFIER NOT NULL,
    SchoolId UNIQUEIDENTIFIER NOT NULL,
    StudentId UNIQUEIDENTIFIER NOT NULL,
    InvoiceId UNIQUEIDENTIFIER NOT NULL,
    AcademicYearId UNIQUEIDENTIFIER NOT NULL,
    TermId UNIQUEIDENTIFIER NOT NULL,
    Amount DECIMAL(18,2) NOT NULL,
    Currency NVARCHAR(10) NOT NULL DEFAULT 'USD',
    Method NVARCHAR(50) NOT NULL,
    Reference NVARCHAR(100),
    PaymentDate DATE NOT NULL,
    ReceivedByUserId UNIQUEIDENTIFIER NOT NULL,
    Status NVARCHAR(50) NOT NULL DEFAULT 'Completed',
    Notes NVARCHAR(1000),
    CreatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    IsDeleted BIT NOT NULL DEFAULT 0,
    RowVersion ROWVERSION NOT NULL,
    CONSTRAINT FK_Payments_TenantId FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    CONSTRAINT FK_Payments_SchoolId FOREIGN KEY (SchoolId) REFERENCES Schools(Id),
    CONSTRAINT FK_Payments_StudentId FOREIGN KEY (StudentId) REFERENCES Students(Id),
    CONSTRAINT FK_Payments_InvoiceId FOREIGN KEY (InvoiceId) REFERENCES StudentInvoices(Id),
    CONSTRAINT FK_Payments_AcademicYearId FOREIGN KEY (AcademicYearId) REFERENCES AcademicYears(Id),
    CONSTRAINT FK_Payments_TermId FOREIGN KEY (TermId) REFERENCES Terms(Id)
);

CREATE TABLE Receipts (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    TenantId UNIQUEIDENTIFIER NOT NULL,
    SchoolId UNIQUEIDENTIFIER NOT NULL,
    PaymentId UNIQUEIDENTIFIER NOT NULL,
    ReceiptNumber NVARCHAR(100) NOT NULL,
    IssuedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    Amount DECIMAL(18,2) NOT NULL,
    CreatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    IsDeleted BIT NOT NULL DEFAULT 0,
    RowVersion ROWVERSION NOT NULL,
    CONSTRAINT UQ_Receipts_ReceiptNumber UNIQUE (ReceiptNumber),
    CONSTRAINT FK_Receipts_TenantId FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    CONSTRAINT FK_Receipts_SchoolId FOREIGN KEY (SchoolId) REFERENCES Schools(Id),
    CONSTRAINT FK_Receipts_PaymentId FOREIGN KEY (PaymentId) REFERENCES Payments(Id)
);

CREATE TABLE Discounts (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    TenantId UNIQUEIDENTIFIER NOT NULL,
    SchoolId UNIQUEIDENTIFIER NOT NULL,
    StudentId UNIQUEIDENTIFIER NOT NULL,
    AcademicYearId UNIQUEIDENTIFIER NOT NULL,
    TermId UNIQUEIDENTIFIER NOT NULL,
    Amount DECIMAL(18,2) NOT NULL,
    Reason NVARCHAR(500) NOT NULL,
    Status NVARCHAR(50) NOT NULL DEFAULT 'Active',
    CreatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    IsDeleted BIT NOT NULL DEFAULT 0,
    RowVersion ROWVERSION NOT NULL,
    CONSTRAINT FK_Discounts_TenantId FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    CONSTRAINT FK_Discounts_SchoolId FOREIGN KEY (SchoolId) REFERENCES Schools(Id),
    CONSTRAINT FK_Discounts_StudentId FOREIGN KEY (StudentId) REFERENCES Students(Id),
    CONSTRAINT FK_Discounts_AcademicYearId FOREIGN KEY (AcademicYearId) REFERENCES AcademicYears(Id),
    CONSTRAINT FK_Discounts_TermId FOREIGN KEY (TermId) REFERENCES Terms(Id)
);

CREATE TABLE Scholarships (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    TenantId UNIQUEIDENTIFIER NOT NULL,
    SchoolId UNIQUEIDENTIFIER NOT NULL,
    StudentId UNIQUEIDENTIFIER NOT NULL,
    AcademicYearId UNIQUEIDENTIFIER NOT NULL,
    TermId UNIQUEIDENTIFIER NOT NULL,
    Amount DECIMAL(18,2) NOT NULL,
    Sponsor NVARCHAR(200) NOT NULL,
    Status NVARCHAR(50) NOT NULL DEFAULT 'Active',
    CreatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    IsDeleted BIT NOT NULL DEFAULT 0,
    RowVersion ROWVERSION NOT NULL,
    CONSTRAINT FK_Scholarships_TenantId FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    CONSTRAINT_Scholarships_SchoolId FOREIGN KEY (SchoolId) REFERENCES Schools(Id),
    CONSTRAINT_Scholarships_StudentId FOREIGN KEY (StudentId) REFERENCES Students(Id),
    CONSTRAINT_Scholarships_AcademicYearId FOREIGN KEY (AcademicYearId) REFERENCES AcademicYears(Id),
    CONSTRAINT_Scholarships_TermId FOREIGN KEY (TermId) REFERENCES Terms(Id)
);

CREATE TABLE PaymentPlans (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    TenantId UNIQUEIDENTIFIER NOT NULL,
    SchoolId UNIQUEIDENTIFIER NOT NULL,
    StudentId UNIQUEIDENTIFIER NOT NULL,
    InvoiceId UNIQUEIDENTIFIER NOT NULL,
    Installments INT NOT NULL,
    StartDate DATE NOT NULL,
    EndDate DATE NOT NULL,
    Status NVARCHAR(50) NOT NULL DEFAULT 'Active',
    CreatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    IsDeleted BIT NOT NULL DEFAULT 0,
    RowVersion ROWVERSION NOT NULL,
    CONSTRAINT FK_PaymentPlans_TenantId FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    CONSTRAINT_PaymentPlans_SchoolId FOREIGN KEY (SchoolId) REFERENCES Schools(Id),
    CONSTRAINT_PaymentPlans_StudentId FOREIGN KEY (StudentId) REFERENCES Students(Id),
    CONSTRAINT_PaymentPlans_InvoiceId FOREIGN KEY (InvoiceId) REFERENCES StudentInvoices(Id)
);

-- ========================================
-- STAFF MODULE ENTITIES
-- ========================================

CREATE TABLE Staff (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    TenantId UNIQUEIDENTIFIER NOT NULL,
    SchoolId UNIQUEIDENTIFIER NOT NULL,
    EmployeeId NVARCHAR(50) NOT NULL,
    FirstName NVARCHAR(100) NOT NULL,
    LastName NVARCHAR(100) NOT NULL,
    Email NVARCHAR(255) NOT NULL,
    Phone NVARCHAR(50),
    Address NVARCHAR(500),
    DateOfBirth DATE,
    Gender NVARCHAR(20),
    Department NVARCHAR(100) NOT NULL,
    Position NVARCHAR(100) NOT NULL,
    EmploymentType NVARCHAR(50) NOT NULL, -- 'Full-time', 'Part-time', 'Contract'
    HireDate DATE NOT NULL,
    Salary DECIMAL(18,2),
    Qualifications NVARCHAR(1000),
    Status NVARCHAR(50) NOT NULL DEFAULT 'Active',
    ProfileImage NVARCHAR(500),
    CreatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    IsDeleted BIT NOT NULL DEFAULT 0,
    RowVersion ROWVERSION NOT NULL,
    CONSTRAINT UQ_Staff_EmployeeId UNIQUE (EmployeeId),
    CONSTRAINT FK_Staff_TenantId FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    CONSTRAINT FK_Staff_SchoolId FOREIGN KEY (SchoolId) REFERENCES Schools(Id)
);

-- ========================================
-- EVENTS MODULE ENTITIES
-- ========================================

CREATE TABLE SchoolEvents (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    TenantId UNIQUEIDENTIFIER NOT NULL,
    SchoolId UNIQUEIDENTIFIER NOT NULL,
    AcademicYearId UNIQUEIDENTIFIER,
    TermId UNIQUEIDENTIFIER,
    Title NVARCHAR(200) NOT NULL,
    Description NVARCHAR(2000),
    StartAtUtc DATETIME2 NOT NULL,
    EndAtUtc DATETIME2 NOT NULL,
    Venue NVARCHAR(200) NOT NULL,
    MaxParticipants INT,
    OrganizerStaffId UNIQUEIDENTIFIER,
    Status NVARCHAR(50) NOT NULL DEFAULT 'Scheduled',
    Category NVARCHAR(50),
    Priority NVARCHAR(20) DEFAULT 'Medium',
    CreatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    IsDeleted BIT NOT NULL DEFAULT 0,
    RowVersion ROWVERSION NOT NULL,
    CONSTRAINT FK_SchoolEvents_TenantId FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    CONSTRAINT FK_SchoolEvents_SchoolId FOREIGN KEY (SchoolId) REFERENCES Schools(Id),
    CONSTRAINT FK_SchoolEvents_OrganizerStaffId FOREIGN KEY (OrganizerStaffId) REFERENCES Staff(Id),
    CONSTRAINT FK_SchoolEvents_AcademicYearId FOREIGN KEY (AcademicYearId) REFERENCES AcademicYears(Id),
    CONSTRAINT FK_SchoolEvents_TermId FOREIGN KEY (TermId) REFERENCES Terms(Id)
);

CREATE TABLE EventParticipants (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    TenantId UNIQUEIDENTIFIER NOT NULL,
    SchoolId UNIQUEIDENTIFIER NOT NULL,
    SchoolEventId UNIQUEIDENTIFIER NOT NULL,
    StudentId UNIQUEIDENTIFIER,
    GuardianId UNIQUEIDENTIFIER,
    StaffId UNIQUEIDENTIFIER,
    ParticipantType NVARCHAR(20) NOT NULL DEFAULT 'Student',
    AttendanceStatus NVARCHAR(20) NOT NULL DEFAULT 'Registered',
    CreatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    IsDeleted BIT NOT NULL DEFAULT 0,
    RowVersion ROWVERSION NOT NULL,
    CONSTRAINT FK_EventParticipants_TenantId FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    CONSTRAINT FK_EventParticipants_SchoolId FOREIGN KEY (SchoolId) REFERENCES Schools(Id),
    CONSTRAINT FK_EventParticipants_SchoolEventId FOREIGN KEY (SchoolEventId) REFERENCES SchoolEvents(Id),
    CONSTRAINT FK_EventParticipants_StudentId FOREIGN KEY (StudentId) REFERENCES Students(Id),
    CONSTRAINT FK_EventParticipants_GuardianId FOREIGN KEY (GuardianId) REFERENCES Guardians(Id),
    CONSTRAINT FK_EventParticipants_StaffId FOREIGN KEY (StaffId) REFERENCES Staff(Id)
);

-- ========================================
-- TRANSPORT MODULE ENTITIES
-- ========================================

CREATE TABLE TransportVehicles (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    TenantId UNIQUEIDENTIFIER NOT NULL,
    SchoolId UNIQUEIDENTIFIER NOT NULL,
    RegistrationNumber NVARCHAR(50) NOT NULL,
    Make NVARCHAR(100) NOT NULL,
    Model NVARCHAR(100) NOT NULL,
    Year INT NOT NULL,
    Capacity INT NOT NULL,
    FuelType NVARCHAR(50) NOT NULL,
    Status NVARCHAR(50) NOT NULL DEFAULT 'Active',
    LastMaintenanceDate DATE,
    NextMaintenanceDue DATE,
    CurrentDriverStaffId UNIQUEIDENTIFIER,
    CreatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTDATE(),
    UpdatedAtUTC DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    IsDeleted BIT NOT NULL DEFAULT 0,
    RowVersion ROWVERSION NOT NULL,
    CONSTRAINT UQ_TransportVehicles_RegistrationNumber UNIQUE (RegistrationNumber),
    CONSTRAINT FK_TransportVehicles_TenantId FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    CONSTRAINT_TransportVehicles_SchoolId FOREIGN KEY (SchoolId) REFERENCES Schools(Id),
    CONSTRAINT_TransportVehicles_CurrentDriverStaffId FOREIGN KEY (CurrentDriverStaffId) REFERENCES Staff(Id)
);

CREATE TABLE TransportRoutes (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    TenantId UNIQUEIDENTIFIER NOT NULL,
    SchoolId UNIQUEIDENTIFIER NOT NULL,
    Name NVARCHAR(200) NOT NULL,
    StartLocation NVARCHAR(500) NOT NULL,
    EndLocation NVARCHAR(500) NOT NULL,
    Distance DECIMAL(10,2) NOT NULL,
    EstimatedDuration TIME NOT NULL,
    Status NVARCHAR(50) NOT NULL DEFAULT 'Active',
    CreatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    IsDeleted BIT NOT NULL DEFAULT 0,
    RowVersion ROWVERSION NOT NULL,
    CONSTRAINT_TransportRoutes_TenantId FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    CONSTRAINT_TransportRoutes_SchoolId FOREIGN KEY (SchoolId) REFERENCES Schools(Id)
);

CREATE TABLE TransportRouteStops (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    TenantId UNIQUEIDENTIFIER NOT NULL,
    SchoolId UNIQUEIDENTIFIER NOT NULL,
    TransportRouteId UNIQUEIDENTIFIER NOT NULL,
    Name NVARCHAR(200) NOT NULL,
    Location NVARCHAR(500) NOT NULL,
    EstimatedArrival TIME NOT NULL,
    [Order] INT NOT NULL,
    IsPickupPoint BIT NOT NULL DEFAULT 0,
    IsDropoffPoint BIT NOT NULL DEFAULT 0,
    CreatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    IsDeleted BIT NOT NULL DEFAULT 0,
    RowVersion ROWVERSION NOT NULL,
    CONSTRAINT_TransportRouteStops_TenantId FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    CONSTRAINT_TransportRouteStops_SchoolId FOREIGN KEY (SchoolId) REFERENCES Schools(Id),
    CONSTRAINT_TransportRouteStops_TransportRouteId FOREIGN KEY (TransportRouteId) REFERENCES TransportRoutes(Id)
);

CREATE TABLE TransportStudentAssignments (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    TenantId UNIQUEIDENTIFIER NOT NULL,
    SchoolId UNIQUEIDENTIFIER NOT NULL,
    StudentId UNIQUEIDENTIFIER NOT NULL,
    TransportRouteId UNIQUEIDENTIFIER NOT NULL,
    PickupStopId UNIQUEIDENTIFIER,
    DropoffStopId UNIQUEIDENTIFIER,
    StartDate DATE NOT NULL,
    EndDate DATE,
    Status NVARCHAR(50) NOT NULL DEFAULT 'Active',
    CreatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    IsDeleted BIT NOT NULL DEFAULT 0,
    RowVersion ROWVERSION NOT NULL,
    CONSTRAINT FK_TransportStudentAssignments_TenantId FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    CONSTRAINT_TransportStudentAssignments_SchoolId FOREIGN KEY (SchoolId) REFERENCES Schools(Id),
    CONSTRAINT_TransportStudentAssignments_StudentId FOREIGN KEY (StudentId) REFERENCES Students(Id),
    CONSTRAINT_TransportStudentAssignments_TransportRouteId FOREIGN KEY (TransportRouteId) REFERENCES TransportRoutes(Id),
    CONSTRAINT_TransportStudentAssignments_PickupStopId REFERENCES TransportRouteStops(Id),
    CONSTRAINT_TransportStudentAssignments_DropoffStopId REFERENCES TransportRouteStops(Id)
);

CREATE TABLE TransportTrips (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    TenantId UNIQUEIDENTIFIER NOT NULL,
    SchoolId UNIQUEIDENTIFIER NOT NULL,
    VehicleId UNIQUEIDENTIFIER NOT NULL,
    RouteId UNIQUEIDENTIFIER NOT NULL,
    DriverStaffId UNIQUEIDENTIFIER NOT NULL,
    ScheduledStartTimeUtc DATETIME2 NOT NULL,
    ScheduledEndTimeUtc DATETIME2 NOT NULL,
    ActualStartTimeUtc DATETIME2,
    ActualEndTimeUtc DATETIME2,
    Status NVARCHAR(50) NOT NULL DEFAULT 'Scheduled',
    PassengerCount INT NOT NULL DEFAULT 0,
    Distance DECIMAL(10,2),
    FuelConsumed DECIMAL(10,2),
    Notes NVARCHAR(1000),
    CreatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    IsDeleted BIT NOT NULL DEFAULT 0,
    RowVersion ROWVERSION NOT NULL,
    CONSTRAINT_TransportTrips_TenantId FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    CONSTRAINT_TransportTrips_SchoolId FOREIGN KEY (SchoolId) REFERENCES Schools(Id),
    CONSTRAINT_TransportTrips_VehicleId FOREIGN KEY (VehicleId) REFERENCES TransportVehicles(Id),
    CONSTRAINT_TransportTrips_RouteId FOREIGN KEY (RouteId) REFERENCES TransportRoutes(Id),
    CONSTRAINT_TransportTrips_DriverStaffId FOREIGN KEY (DriverStaffId) REFERENCES Staff(Id)
);

-- ========================================
-- HOSTELS MODULE ENTITIES
-- ========================================

CREATE TABLE Hostels (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    TenantId UNIQUEIDENTIFIER NOT NULL,
    SchoolId UNIQUEIDENTIFIER NOT NULL,
    Name NVARCHAR(200) NOT NULL,
    GenderPolicy NVARCHAR(20) NOT NULL DEFAULT 'Any',
    Capacity INT NOT NULL,
    MatronStaffId UNIQUEIDENTIFIER,
    IsActive BIT NOT NULL DEFAULT 1,
    Address NVARCHAR(500),
    Phone NVARCHAR(50),
    Facilities NVARCHAR(1000),
    Rules NVARCHAR(1000),
    CreatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    IsDeleted BIT NOT NULL DEFAULT 0,
    RowVersion ROWVERSION NOT NULL,
    CONSTRAINT FK_Hostels_TenantId FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    CONSTRAINT_Hostels_SchoolId FOREIGN KEY (SchoolId) REFERENCES Schools(Id),
    CONSTRAINT_Hostels_MatronStaffId FOREIGN KEY (MatronStaffId) REFERENCES Staff(Id)
);

CREATE TABLE HostelRooms (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    TenantId UNIQUEIDENTIFIER NOT NULL,
    SchoolId UNIQUEIDENTIFIER NOT NULL,
    HostelId UNIQUEIDENTIFIER NOT NULL,
    Name NVARCHAR(100) NOT NULL,
    FloorName NVARCHAR(50) NOT NULL,
    Capacity INT NOT NULL,
    Status NVARCHAR(50) NOT NULL DEFAULT 'Available',
    Facilities NVARCHAR(1000),
    BedPrice DECIMAL(18,2),
    CreatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTDATE(),
    IsDeleted BIT NOT NULL DEFAULT 0,
    RowVersion ROWVERSION NOT NULL,
    CONSTRAINT_HostelRooms_TenantId FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    CONSTRAINT_HostelRooms_SchoolId FOREIGN KEY (SchoolId) REFERENCES Schools(Id),
    CONSTRAINT_HostelRooms_HostelId FOREIGN KEY (HostelId) REFERENCES Hostels(Id)
);

CREATE TABLE HostelBeds (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    TenantId UNIQUEIDENTIFIER NOT NULL,
    SchoolId UNIQUEIDENTIFIER NOT NULL,
    HostelRoomId UNIQUEIDENTIFIER NOT NULL,
    BedCode NVARCHAR(50) NOT NULL,
    Status NVARCHAR(50) NOT NULL DEFAULT 'Available',
    CreatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAtUtc DATETIME2 NOT NULL GETUTCDATE(),
    IsDeleted BIT NOT NULL DEFAULT 0,
    RowVersion ROWVERSION NOT NULL,
    CONSTRAINT UQ_HostelBeds_BedCode UNIQUE (BedCode),
    CONSTRAINT_HostelBeds_TenantId FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    CONSTRAINT_HostelBeds_SchoolId FOREIGN KEY (SchoolId) REFERENCES Schools(Id),
    CONSTRAINT_HostelBeds_HostelRoomId FOREIGN KEY (HostelRoomId) REFERENCES HostelRooms(Id)
);

CREATE TABLE HostelAllocations (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    TenantId UNIQUEIDENTIFIER NOT NULL,
    SchoolId UNIQUEIDENTIFIER NOT NULL,
    StudentId UNIQUEIDENTIFIER NOT NULL,
    HostelBedId UNIQUEIDENTIFIER NOT NULL,
    AcademicYearId UNIQUEIDENTIFIER NOT NULL,
    TermId UNIQUEIDENTIFIER NOT NULL,
    StartDate DATE NOT NULL,
    EndDate DATE,
    Status NVARCHAR(50) NOT NULL DEFAULT 'Active',
    CreatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    IsDeleted BIT NOT NULL DEFAULT 0,
    RowVersion ROWVERSION NOT NULL,
    CONSTRAINT UQ_HostelAllocations_Student_AcademicYear_Term UNIQUE (StudentId, AcademicYearId, TermId),
    CONSTRAINT FK_HostelAllocations_TenantId FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    CONSTRAINT_HostelAllocations_SchoolId FOREIGN KEY (SchoolId) REFERENCES Schools(Id),
    CONSTRAINT_HostelAllocations_StudentId FOREIGN KEY (StudentId) REFERENCES Students(Id),
    CONSTRAINT_HostelAllocations_HostelBedId FOREIGN KEY (HostelBeds.Id) REFERENCES HostelBeds(Id),
    CONSTRAINT_HostelAllocations_AcademicYearId FOREIGN KEY (AcademicYearId) REFERENCES AcademicYears(Id),
    CONSTRAINT_HostelAllocations_TermId FOREIGN KEY (TermId) REFERENCES Terms(Id)
);

CREATE TABLE HostelIncidents (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    TenantId UNIQUEIDENTIFIER NOT NULL,
    SchoolId UNIQUEIDENTIFIER NOT NULL,
    HostelId UNIQUEIDENTIFIER NOT NULL,
    StudentId UNIQUEIDENTIFIER NOT NULL,
    ReportedByStaffId UNIQUEIDENTIFIER NOT NULL,
    OccurredAtUtc DATETIME2 NOT NULL,
    Category NVARCHAR(50) NOT NULL,
    Notes NVARCHAR(1000),
    Status NVARCHAR(50) NOT NULL DEFAULT 'Open',
    ResolvedAtUtc DATETIME2,
    ResolvedByStaffId UNIQUEIDENTIFIER,
    CreatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    IsDeleted BIT NOT NULL DEFAULT 0,
    RowVersion ROWVERSION NOT NULL,
    CONSTRAINT FK_HostelIncidents_TenantId FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    CONSTRAINT_HostelIncidents_SchoolId FOREIGN KEY (SchoolId) REFERENCES Schools(Id),
    CONSTRAINT_HostelIncidents_HostelId FOREIGN KEY (HostelId) REFERENCES Hostels(Id),
    CONSTRAINT_HostelIncidents_StudentId FOREIGN KEY (StudentId) REFERENCES Students(Id),
    CONSTRAINT_HostelIncidents_ReportedByStaffId FOREIGN KEY (ReportedByStaffId) REFERENCES Staff(Id),
    CONSTRAINT_HostelIncidents_ResolvedByStaffId FOREIGN KEY (ResolvedByStaffId) REFERENCES Staff(Id)
);

-- ========================================
-- HEALTH MODULE ENTITIES
-- ========================================

CREATE TABLE HealthProfiles (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    TenantId UNIQUEIDENTIFIER NOT NULL,
    SchoolId UNIQUEIDENTIFIER NOT NULL,
    StudentId UNIQUEIDENTIFIER,
    StaffId UNIQUEIDENTIFIER,
    BloodGroup NVARCHAR(10) NOT NULL,
    Allergies NVARCHAR(1000),
    ChronicConditions NVARCHAR(1000),
    EmergencyContactName NVARCHAR(200),
    EmergencyContactPhone NVARCHAR(50),
    EmergencyContactRelationship NVARCHAR(50),
    Medications NVARCHAR(500),
    DietaryRestrictions NVARCHAR(500),
    PhysicalLimitations NVARCHAR(500),
    CreatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    IsDeleted BIT NOT NULL DEFAULT 0,
    RowVersion ROWVERSION NOT NULL,
    CONSTRAINT FK_HealthProfiles_TenantId FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    CONSTRAINT_HealthProfiles_SchoolId FOREIGN KEY (SchoolId) REFERENCES Schools(Id),
    CONSTRAINT_HealthProfiles_StudentId FOREIGN KEY (StudentId) REFERENCES Students(Id),
    CONSTRAINT_HealthProfiles_StaffId FOREIGN KEY (StaffId) REFERENCES Staff(Id)
);

CREATE TABLE HealthScreenings (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    TenantId UNIQUEIDENTIFIER NOT NULL,
    SchoolId UNIQUEIDENTIFIER NOT NULL,
    HealthProfileId UNIQUEIDENTIFIER NOT NULL,
    ScreeningDateUtc DATETIME2 NOT NULL,
    HeightCm DECIMAL(10,2),
    WeightKg DECIMAL(10,2),
    BloodPressure NVARCHAR(20),
    Notes NVARCHAR(1000),
    ScreenedByStaffId UNIQUEIDENTIFIER NOT NULL,
    CreatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    IsDeleted BIT NOT NULL DEFAULT 0,
    RowVersion ROWVERSION NOT NULL,
    CONSTRAINT_HealthScreenings_TenantId FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    CONSTRAINT_HealthScreenings_SchoolId FOREIGN KEY (SchoolId) REFERENCES Schools(Id),
    CONSTRAINT_HealthScreenings_HealthProfileId FOREIGN KEY (HealthProfileId) REFERENCES HealthProfiles(Id),
    CONSTRAINT_HealthScreenings_ScreenedByStaffId FOREIGN KEY (ScreenedByStaffId) REFERENCES Staff(Id)
);

CREATE TABLE ImmunizationRecords (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    TenantId UNIQUEIDENTIFIER NOT NULL,
    SchoolId UNIQUEIDENTIFIER NOT NULL,
    HealthProfileId UNIQUEIDENTIFIER NOT NULL,
    VaccineName NVARCHAR(200) NOT NULL,
    DoseNumber INT NOT NULL,
    AdministeredDateUtc DATETIME2 NOT NULL,
    NextDueDateUtc DATETIME2,
    AdministeredByStaffId UNIQUEIDENTIFIER NOT NULL,
    BatchNumber NVARCHAR(50),
    Notes NVARCHAR(1000),
    Status NVARCHAR(50) NOT NULL DEFAULT 'Completed',
    CreatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    IsDeleted BIT NOT NULL DEFAULT 0,
    RowVersion ROWVERSION NOT NULL,
    CONSTRAINT_ImmunizationRecords_TenantId FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    CONSTRAINT_ImmunizationRecords_SchoolId FOREIGN KEY (SchoolId) REFERENCES Schools(Id),
    CONSTRAINT_ImmunizationRecords_HealthProfileId FOREIGN KEY (HealthProfileId) REFERENCES HealthProfiles(Id),
    CONSTRAINT_ImmunizationRecords_AdministeredByStaffId FOREIGN KEY (AdministeredByStaffId) REFERENCES Staff(Id)
);

CREATE TABLE HealthActionPlans (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    TenantId UNIQUEIDENTIFIER NOT NULL,
    SchoolId UNIQUEIDENTIFIER NOT NULL,
    HealthProfileId UNIQUEIDENTIFIER NOT NULL,
    Title NVARCHAR(200) NOT NULL,
    Description NVARCHAR(1000),
    StartDateUtc DATETIME2 NOT NULL,
    EndDateUtc DATETIME2,
    AssignedToStaffId UNIQUEIDENTIFIER NOT NULL,
    Status NVARCHAR(50) NOT NULL DEFAULT 'Active',
    Priority NVARCHAR(20) NOT NULL DEFAULT 'Medium',
    CreatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    IsDeleted BIT NOT NULL DEFAULT 0,
    RowVersion ROWVERSION NOT NULL,
    CONSTRAINT_HealthActionPlans_TenantId FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    CONSTRAINT_HealthActionPlans_SchoolId FOREIGN KEY (SchoolId) REFERENCES Schools(Id),
    CONSTRAINT_HealthActionPlans_HealthProfileId FOREIGN KEY (HealthProfileId) REFERENCES HealthProfiles(Id),
    CONSTRAINT_HealthActionPlans_AssignedToStaffId FOREIGN KEY (AssignedToStaffId) REFERENCES Staff(Id)
);

-- ========================================
-- CLINIC MODULE ENTITIES
-- ========================================

CREATE TABLE ClinicVisits (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    TenantId UNIQUEIDENTIFIER NOT NULL,
    SchoolId UNIQUEIDENTIFIER NOT NULL,
    StudentId UNIQUEIDENTIFIER NOT NULL,
    VisitDateUtc DATETIME2 NOT NULL,
    ReasonForVisit NVARCHAR(500) NOT NULL,
    Symptoms NVARCHAR(1000),
    Diagnosis NVARCHAR(1000),
    Treatment NVARCHAR(1000),
    Status NVARCHAR(50) NOT NULL DEFAULT 'Completed',
    AttendingStaffId UNIQUEIDENTIFIER NOT NULL,
    Notes NVARCHAR(1000),
    FollowUpRequired BIT NOT NULL DEFAULT 0,
    FollowUpDate DATE,
    ReferredTo NVARCHAR(200),
    ReferralReason NVARCHAR(500),
    CreatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    IsDeleted BIT NOT NULL DEFAULT 0,
    RowVersion ROWVERSION NOT NULL,
    CONSTRAINT_ClinicVisits_TenantId FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    CONSTRAINT_ClinicVisits_SchoolId FOREIGN KEY (SchoolId) REFERENCES Schools(Id),
    CONSTRAINT_ClinicVisits_StudentId FOREIGN KEY (StudentId) REFERENCES Students(Id),
    CONSTRAINT_ClinicVisits_AttendingStaffId FOREIGN KEY (AttendingStaffId) REFERENCES Staff(Id)
);

CREATE TABLE ClinicMedications (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    TenantId UNIQUEIDENTIFIER NOT NULL,
    SchoolId UNIQUEIDENTIFIER NOT NULL,
    Name NVARCHAR(200) NOT NULL,
    Description NVARCHAR(1000),
    Category NVARCHAR(100) NOT NULL,
    Unit NVARCHAR(50) NOT NULL,
    CurrentStock INT NOT NULL,
    MinimumStock INT NOT NULL,
    MaximumStock INT NOT NULL,
    ExpiryDate DATE NOT NULL,
    Status NVARCHAR(50) NOT NULL DEFAULT 'Active',
    Manufacturer NVARCHAR(200),
    BatchNumber NVARCHAR(50),
    Price DECIMAL(18,2) NOT NULL,
    StorageConditions NVARCHAR(500),
    SideEffects NVARCHAR(1000),
    CreatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    IsDeleted BIT NOT NULL DEFAULT 0,
    RowVersion ROWVERSION NOT NULL,
    UQ_ClinicMedications_Name UNIQUE (Name),
    CONSTRAINT_ClinicMedications_TenantId FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    CONSTRAINT_ClinicMedications_SchoolId FOREIGN KEY (SchoolId) REFERENCES Schools(Id)
);

CREATE TABLE ClinicPrescriptions (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    TenantId UNIQUEIDENTIFIER NOT NULL,
    SchoolId UNIQUEIDENTIFIER NOT NULL,
    ClinicVisitId UNIQUEIDENTIFIER NOT NULL,
    PrescribedByStaffId UNIQUEIDENTIFIER NOT NULL,
    Notes NVARCHAR(1000),
    Status NVARCHAR(50) NOT NULL DEFAULT 'Active',
    CreatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAtUtc DATETIME2 NOT NULL GETUTCDATE(),
    IsDeleted BIT NOT NULL DEFAULT 0,
    RowVersion ROWVERSION NOT NULL,
    CONSTRAINT_ClinicPrescriptions_TenantId FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    CONSTRAINT_ClinicPrescriptions_SchoolId FOREIGN KEY (SchoolId) REFERENCES Schools(Id),
    CONSTRAINT_ClinicPrescriptions_ClinicVisitId FOREIGN KEY (ClinicVisits.Id) REFERENCES ClinicVisits(Id),
    CONSTRAINT_ClinicPrescriptions_PrescribedByStaffId FOREIGN KEY (PrescribedByStaffId) REFERENCES Staff(Id)
);

CREATE TABLE ClinicPrescriptionItems (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    TenantId UNIQUEIDENTIFIER NOT NULL,
    SchoolId UNIQUEIDENTIFIER NOT NULL,
    ClinicPrescriptionId UNIQUEIDENTIFIER NOT NULL,
    ClinicMedicationId UNIQUEIDENTIFIER NOT NULL,
    Dosage NVARCHAR(100) NOT NULL,
    Frequency NVARCHAR(100) NOT NULL,
    Duration NVARCHAR(100) NOT NULL,
    Quantity INT NOT NULL,
    Instructions NVARCHAR(500) NOT NULL,
    Dispensed BIT NOT NULL DEFAULT 0,
    DispensedQuantity INT,
    DispensedDate DATE,
    CreatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    IsDeleted BIT NOT NULL DEFAULT 0,
    RowVersion ROWVERSION NOT NULL,
    CONSTRAINT_ClinicPrescriptionItems_TenantId FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    CONSTRAINT_ClinicPrescriptionItems_SchoolId FOREIGN KEY (SchoolId) REFERENCES Schools(Id),
    CONSTRAINT_ClinicPrescriptionItems_ClinicPrescriptionId FOREIGN KEY (ClinicPrescriptions.Id) REFERENCES ClinicPrescriptions(Id),
    CONSTRAINT_ClinicPrescriptionItems_ClinicMedicationId FOREIGN KEY (ClinicMedications.Id),
);

CREATE TABLE MedicationDispenses (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    TenantId UNIQUEIDENTIFIER NOT NULL,
    SchoolId UNIQUEIDENTIFIER NOT NULL,
    ClinicMedicationId UNIQUEIDENTIFIER NOT NULL,
    QuantityDispensed INT NOT NULL,
    DispensedToStudentId UNIQUEIDENTIFIER NOT NULL,
    DispensedByStaffId UNIQUEIDENTIFIER NOT NULL,
    DispensedAtUtc DATETIME2 NOT NULL,
    PrescriptionId UNIQUEIDENTIFIER NOT NULL,
    Notes NVARCHAR(1000),
    RemainingStock INT NOT NULL,
    CreatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAtUtc DATETIME2 NOT NULL GETUTCDATE(),
    IsDeleted BIT NOT NULL DEFAULT 0,
    RowVersion ROWVERSION NOT NULL,
    CONSTRAINT_MedicationDispenses_TenantId FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    CONSTRAINT_MedicationDispenses_SchoolId FOREIGN KEY (SchoolId) REFERENCES Schools(Id),
    CONSTRAINT_MedicationDispenses_ClinicMedicationId FOREIGN KEY (ClinicMedications.Id),
    CONSTRAINT_MedicationDispenses_DispensedToStudentId FOREIGN KEY (Students.Id) REFERENCES Students(Id),
    CONSTRAINT_MedicationDispenses_DispensedByStaffId FOREIGN KEY (Staff.Id) REFERENCES Staff(Id),
    CONSTRAINT_MedicationDispenses_PrescriptionId FOREIGN KEY (ClinicPrescriptions.Id) REFERENCES ClinicPrescriptions(Id)
);

-- ========================================
-- INDEXES
-- ========================================

-- Performance indexes for frequently queried tables
CREATE INDEX IX_Students_TenantId_SchoolId ON Students(TenantId, SchoolId, IsDeleted);
CREATE INDEX IX_StudentEnrollments_StudentId_AcademicYearId_TermId ON StudentEnrollments(StudentId, AcademicYearId, TermId, IsDeleted);
CREATE INDEX IX_StudentInvoices_StudentId_AcademicYearId_TermId ON StudentInvoices(StudentId, AcademicYearId, TermId, IsDeleted);
CREATE INDEX _IX_Payments_StudentId_InvoiceId ON Payments(StudentId, InvoiceId, IsDeleted);
CREATE INDEX _IX_TransportStudentAssignments_StudentId_RouteId ON TransportStudentAssignments(StudentId, TransportRouteId, IsDeleted);
CREATE INDEX _IX_HostelAllocations_StudentId_AcademicYear_TermId ON HostelAllocations(StudentId, AcademicYearId, TermId, IsDeleted);
CREATE INDEX _IX_HealthProfiles_StudentId ON HealthProfiles(StudentId, IsDeleted);
CREATE INDEX _IX_ClinicVisits_StudentId_VisitDate ON ClinicVisits(StudentId, VisitDateUtc, IsDeleted);
CREATE INDEX _IX_ClinicPrescriptions_PrescribedByStaffId ON ClinicPrescriptions(PrescribedByStaffId, IsDeleted);
CREATE INDEX _IX_MedicationDispenses_MedicationId_DispensedDate ON MedicationDispenses(MedicationId, DispensedAtUtc, IsDeleted);

-- ========================================
-- TRIGGERS AND STORED PROCEDURES
-- ========================================

CREATE TRIGGER TR_Students_UpdatedAt ON Students
AFTER UPDATE
AS
BEGIN
    UPDATE Students SET UpdatedAtUtc = GETUTCDATE() WHERE Id = (SELECT Id FROM inserted);
END;

CREATE TRIGGER TR_StudentEnrollments_UpdatedAt ON StudentEnrollments
AFTER UPDATE
AS
BEGIN
    UPDATE StudentEnrollments SET UpdatedAtUtc = GETUTCDATE() WHERE Id = (SELECT Id FROM inserted);
END;

CREATE TRIGGER TR_StudentInvoices_UpdatedAt ON StudentInvoices
AFTER UPDATE
AS
BEGIN
    UPDATE StudentInvoices SET UpdatedAtUtc = GETUTCDATE() WHERE Id = (SELECT Id FROM inserted);
END;

-- ========================================
-- SPORTS MANAGEMENT MODULE
-- ========================================

CREATE TABLE SportsCategories (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    TenantId UNIQUEIDENTIFIER NOT NULL,
    SchoolId UNIQUEIDENTIFIER NOT NULL,
    Name NVARCHAR(100) NOT NULL,
    Description NVARCHAR(500),
    Code NVARCHAR(20) NOT NULL,
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    IsDeleted BIT NOT NULL DEFAULT 0,
    RowVersion ROWVERSION NOT NULL,

    CONSTRAINT FK_SportsCategories_Tenants FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    CONSTRAINT FK_SportsCategories_Schools FOREIGN KEY (SchoolId) REFERENCES Schools(Id),
    CONSTRAINT UQ_SportsCategories_TenantSchoolCode UNIQUE (TenantId, SchoolId, Code)
);

CREATE TABLE Sports (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    TenantId UNIQUEIDENTIFIER NOT NULL,
    SchoolId UNIQUEIDENTIFIER NOT NULL,
    SportCategoryId UNIQUEIDENTIFIER NOT NULL,
    Name NVARCHAR(100) NOT NULL,
    Description NVARCHAR(500),
    Code NVARCHAR(20) NOT NULL,
    TeamSize INT NOT NULL DEFAULT 1,
    IsTeamSport BIT NOT NULL DEFAULT 0,
    EquipmentRequired NVARCHAR(1000),
    Season NVARCHAR(50), -- 'Spring', 'Summer', 'Fall', 'Winter', 'Year-round'
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    IsDeleted BIT NOT NULL DEFAULT 0,
    RowVersion ROWVERSION NOT NULL,

    CONSTRAINT FK_Sports_Tenants FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    CONSTRAINT FK_Sports_Schools FOREIGN KEY (SchoolId) REFERENCES Schools(Id),
    CONSTRAINT FK_Sports_SportsCategories FOREIGN KEY (SportCategoryId) REFERENCES SportsCategories(Id),
    CONSTRAINT UQ_Sports_TenantSchoolCode UNIQUE (TenantId, SchoolId, Code)
);

CREATE TABLE SportTeams (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    TenantId UNIQUEIDENTIFIER NOT NULL,
    SchoolId UNIQUEIDENTIFIER NOT NULL,
    SportId UNIQUEIDENTIFIER NOT NULL,
    Name NVARCHAR(100) NOT NULL,
    Description NVARCHAR(500),
    TeamType NVARCHAR(50) NOT NULL, -- 'Varsity', 'Junior Varsity', 'Freshman', 'Club'
    GradeId UNIQUEIDENTIFIER,
    AcademicYearId UNIQUEIDENTIFIER NOT NULL,
    CoachStaffId UNIQUEIDENTIFIER,
    AssistantCoachStaffId UNIQUEIDENTIFIER,
    MaxMembers INT NOT NULL DEFAULT 20,
    CurrentMembers INT NOT NULL DEFAULT 0,
    PracticeSchedule NVARCHAR(500),
    HomeVenue NVARCHAR(200),
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    IsDeleted BIT NOT NULL DEFAULT 0,
    RowVersion ROWVERSION NOT NULL,

    CONSTRAINT FK_SportTeams_Tenants FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    CONSTRAINT FK_SportTeams_Schools FOREIGN KEY (SchoolId) REFERENCES Schools(Id),
    CONSTRAINT FK_SportTeams_Sports FOREIGN KEY (SportId) REFERENCES Sports(Id),
    CONSTRAINT FK_SportTeams_Grades FOREIGN KEY (GradeId) REFERENCES Grades(Id),
    CONSTRAINT FK_SportTeams_AcademicYears FOREIGN KEY (AcademicYearId) REFERENCES AcademicYears(Id),
    CONSTRAINT FK_SportTeams_Coach FOREIGN KEY (CoachStaffId) REFERENCES StaffMembers(Id),
    CONSTRAINT FK_SportTeams_AssistantCoach FOREIGN KEY (AssistantCoachStaffId) REFERENCES StaffMembers(Id)
);

CREATE TABLE SportTeamMembers (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    TenantId UNIQUEIDENTIFIER NOT NULL,
    SchoolId UNIQUEIDENTIFIER NOT NULL,
    SportTeamId UNIQUEIDENTIFIER NOT NULL,
    StudentId UNIQUEIDENTIFIER NOT NULL,
    Position NVARCHAR(100),
    JerseyNumber INT,
    JoinDate DATE NOT NULL,
    LeaveDate DATE,
    Status NVARCHAR(20) NOT NULL DEFAULT 'Active', -- 'Active', 'Inactive', 'Suspended'
    Captain BIT NOT NULL DEFAULT 0,
    ViceCaptain BIT NOT NULL DEFAULT 0,
    PerformanceRating DECIMAL(3,2), -- 1.00 to 5.00
    Notes NVARCHAR(1000),
    CreatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    IsDeleted BIT NOT NULL DEFAULT 0,
    RowVersion ROWVERSION NOT NULL,

    CONSTRAINT FK_SportTeamMembers_Tenants FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    CONSTRAINT FK_SportTeamMembers_Schools FOREIGN KEY (SchoolId) REFERENCES Schools(Id),
    CONSTRAINT FK_SportTeamMembers_SportTeams FOREIGN KEY (SportTeamId) REFERENCES SportTeams(Id),
    CONSTRAINT FK_SportTeamMembers_Students FOREIGN KEY (StudentId) REFERENCES Students(Id),
    CONSTRAINT UQ_SportTeamMembers_TeamStudent UNIQUE (SportTeamId, StudentId)
);

CREATE TABLE SportEvents (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    TenantId UNIQUEIDENTIFIER NOT NULL,
    SchoolId UNIQUEIDENTIFIER NOT NULL,
    SportId UNIQUEIDENTIFIER NOT NULL,
    Name NVARCHAR(200) NOT NULL,
    Description NVARCHAR(1000),
    EventType NVARCHAR(50) NOT NULL, -- 'Practice', 'Game', 'Tournament', 'Meet', 'Competition'
    EventDate DATE NOT NULL,
    StartTime TIME NOT NULL,
    EndTime TIME,
    Location NVARCHAR(200),
    OpponentTeam NVARCHAR(200), -- For games/tournaments
    HomeGame BIT NOT NULL DEFAULT 1,
    Status NVARCHAR(20) NOT NULL DEFAULT 'Scheduled', -- 'Scheduled', 'InProgress', 'Completed', 'Cancelled', 'Postponed'
    Weather NVARCHAR(100),
    Attendance INT,
    Score NVARCHAR(50), -- e.g., "2-1", "95-82"
    Result NVARCHAR(20), -- 'Win', 'Loss', 'Draw', 'TBD'
    Notes NVARCHAR(1000),
    CreatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    IsDeleted BIT NOT NULL DEFAULT 0,
    RowVersion ROWVERSION NOT NULL,

    CONSTRAINT FK_SportEvents_Tenants FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    CONSTRAINT FK_SportEvents_Schools FOREIGN KEY (SchoolId) REFERENCES Schools(Id),
    CONSTRAINT FK_SportEvents_Sports FOREIGN KEY (SportId) REFERENCES Sports(Id)
);

CREATE TABLE SportEventParticipants (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    TenantId UNIQUEIDENTIFIER NOT NULL,
    SchoolId UNIQUEIDENTIFIER NOT NULL,
    SportEventId UNIQUEIDENTIFIER NOT NULL,
    SportTeamId UNIQUEIDENTIFIER,
    StudentId UNIQUEIDENTIFIER,
    Role NVARCHAR(50) NOT NULL, -- 'Player', 'Starter', 'Bench', 'Captain', 'Coach', 'Referee'
    ParticipationStatus NVARCHAR(20) NOT NULL DEFAULT 'Confirmed', -- 'Confirmed', 'Declined', 'Injured', 'Absent'
    Performance NVARCHAR(500), -- Performance notes, stats, etc.
    MinutesPlayed INT,
    PointsScored INT,
    Assists INT,
    Goals INT,
    CreatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    IsDeleted BIT NOT NULL DEFAULT 0,
    RowVersion ROWVERSION NOT NULL,

    CONSTRAINT FK_SportEventParticipants_Tenants FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    CONSTRAINT FK_SportEventParticipants_Schools FOREIGN KEY (SchoolId) REFERENCES Schools(Id),
    CONSTRAINT FK_SportEventParticipants_SportEvents FOREIGN KEY (SportEventId) REFERENCES SportEvents(Id),
    CONSTRAINT FK_SportEventParticipants_SportTeams FOREIGN KEY (SportTeamId) REFERENCES SportTeams(Id),
    CONSTRAINT FK_SportEventParticipants_Students FOREIGN KEY (StudentId) REFERENCES Students(Id)
);

CREATE TABLE SportAchievements (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    TenantId UNIQUEIDENTIFIER NOT NULL,
    SchoolId UNIQUEIDENTIFIER NOT NULL,
    StudentId UNIQUEIDENTIFIER,
    SportTeamId UNIQUEIDENTIFIER,
    SportEventId UNIQUEIDENTIFIER,
    AchievementType NVARCHAR(50) NOT NULL, -- 'MVP', 'Best Player', 'Top Scorer', 'Champion', 'Runner-up', 'Participation'
    Title NVARCHAR(200) NOT NULL,
    Description NVARCHAR(1000),
    AchievementDate DATE NOT NULL,
    Level NVARCHAR(50) NOT NULL, -- 'School', 'District', 'Regional', 'National', 'International'
    Position NVARCHAR(50), -- '1st', '2nd', '3rd', etc.
    Medal NVARCHAR(20), -- 'Gold', 'Silver', 'Bronze', 'None'
    Certificate BIT NOT NULL DEFAULT 0,
    Trophy BIT NOT NULL DEFAULT 0,
    PointsAwarded INT DEFAULT 0,
    CreatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    IsDeleted BIT NOT NULL DEFAULT 0,
    RowVersion ROWVERSION NOT NULL,

    CONSTRAINT FK_SportAchievements_Tenants FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    CONSTRAINT FK_SportAchievements_Schools FOREIGN KEY (SchoolId) REFERENCES Schools(Id),
    CONSTRAINT FK_SportAchievements_Students FOREIGN KEY (StudentId) REFERENCES Students(Id),
    CONSTRAINT FK_SportAchievements_SportTeams FOREIGN KEY (SportTeamId) REFERENCES SportTeams(Id),
    CONSTRAINT FK_SportAchievements_SportEvents FOREIGN KEY (SportEventId) REFERENCES SportEvents(Id)
);

-- ========================================
-- CLUB MANAGEMENT MODULE
-- ========================================

CREATE TABLE ClubCategories (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    TenantId UNIQUEIDENTIFIER NOT NULL,
    SchoolId UNIQUEIDENTIFIER NOT NULL,
    Name NVARCHAR(100) NOT NULL,
    Description NVARCHAR(500),
    Code NVARCHAR(20) NOT NULL,
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    IsDeleted BIT NOT NULL DEFAULT 0,
    RowVersion ROWVERSION NOT NULL,

    CONSTRAINT FK_ClubCategories_Tenants FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    CONSTRAINT FK_ClubCategories_Schools FOREIGN KEY (SchoolId) REFERENCES Schools(Id),
    CONSTRAINT UQ_ClubCategories_TenantSchoolCode UNIQUE (TenantId, SchoolId, Code)
);

CREATE TABLE Clubs (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    TenantId UNIQUEIDENTIFIER NOT NULL,
    SchoolId UNIQUEIDENTIFIER NOT NULL,
    ClubCategoryId UNIQUEIDENTIFIER NOT NULL,
    Name NVARCHAR(100) NOT NULL,
    Description NVARCHAR(1000),
    Code NVARCHAR(20) NOT NULL,
    MissionStatement NVARCHAR(1000),
    Objectives NVARCHAR(1000),
    MeetingSchedule NVARCHAR(500),
    MeetingLocation NVARCHAR(200),
    MaxMembers INT NOT NULL DEFAULT 50,
    CurrentMembers INT NOT NULL DEFAULT 0,
    MembershipFee DECIMAL(10,2) DEFAULT 0,
    AcademicYearId UNIQUEIDENTIFIER NOT NULL,
    AdvisorStaffId UNIQUEIDENTIFIER,
    CoAdvisorStaffId UNIQUEIDENTIFIER,
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    IsDeleted BIT NOT NULL DEFAULT 0,
    RowVersion ROWVERSION NOT NULL,

    CONSTRAINT FK_Clubs_Tenants FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    CONSTRAINT FK_Clubs_Schools FOREIGN KEY (SchoolId) REFERENCES Schools(Id),
    CONSTRAINT FK_Clubs_ClubCategories FOREIGN KEY (ClubCategoryId) REFERENCES ClubCategories(Id),
    CONSTRAINT FK_Clubs_AcademicYears FOREIGN KEY (AcademicYearId) REFERENCES AcademicYears(Id),
    CONSTRAINT FK_Clubs_Advisor FOREIGN KEY (AdvisorStaffId) REFERENCES StaffMembers(Id),
    CONSTRAINT FK_Clubs_CoAdvisor FOREIGN KEY (CoAdvisorStaffId) REFERENCES StaffMembers(Id),
    CONSTRAINT UQ_Clubs_TenantSchoolCode UNIQUE (TenantId, SchoolId, Code)
);

CREATE TABLE ClubMembers (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    TenantId UNIQUEIDENTIFIER NOT NULL,
    SchoolId UNIQUEIDENTIFIER NOT NULL,
    ClubId UNIQUEIDENTIFIER NOT NULL,
    StudentId UNIQUEIDENTIFIER NOT NULL,
    MemberType NVARCHAR(50) NOT NULL DEFAULT 'Member', -- 'Member', 'Officer', 'President', 'Vice President', 'Secretary', 'Treasurer'
    Position NVARCHAR(100),
    JoinDate DATE NOT NULL,
    LeaveDate DATE,
    Status NVARCHAR(20) NOT NULL DEFAULT 'Active', -- 'Active', 'Inactive', 'Suspended', 'Graduated'
    MembershipFeePaid BIT NOT NULL DEFAULT 0,
    MembershipFeeAmount DECIMAL(10,2) DEFAULT 0,
    AttendanceRate DECIMAL(5,2), -- Percentage
    Contribution NVARCHAR(500),
    CreatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    IsDeleted BIT NOT NULL DEFAULT 0,
    RowVersion ROWVERSION NOT NULL,

    CONSTRAINT FK_ClubMembers_Tenants FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    CONSTRAINT FK_ClubMembers_Schools FOREIGN KEY (SchoolId) REFERENCES Schools(Id),
    CONSTRAINT FK_ClubMembers_Clubs FOREIGN KEY (ClubId) REFERENCES Clubs(Id),
    CONSTRAINT FK_ClubMembers_Students FOREIGN KEY (StudentId) REFERENCES Students(Id),
    CONSTRAINT UQ_ClubMembers_ClubStudent UNIQUE (ClubId, StudentId)
);

CREATE TABLE ClubMeetings (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    TenantId UNIQUEIDENTIFIER NOT NULL,
    SchoolId UNIQUEIDENTIFIER NOT NULL,
    ClubId UNIQUEIDENTIFIER NOT NULL,
    Title NVARCHAR(200) NOT NULL,
    Description NVARCHAR(1000),
    MeetingDate DATE NOT NULL,
    StartTime TIME NOT NULL,
    EndTime TIME,
    Location NVARCHAR(200),
    MeetingType NVARCHAR(50) NOT NULL DEFAULT 'Regular', -- 'Regular', 'Special', 'Emergency', 'Planning'
    Agenda NVARCHAR(1000),
    Minutes NVARCHAR(2000),
    AttendanceCount INT DEFAULT 0,
    Status NVARCHAR(20) NOT NULL DEFAULT 'Scheduled', -- 'Scheduled', 'InProgress', 'Completed', 'Cancelled'
    CreatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    IsDeleted BIT NOT NULL DEFAULT 0,
    RowVersion ROWVERSION NOT NULL,

    CONSTRAINT FK_ClubMeetings_Tenants FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    CONSTRAINT FK_ClubMeetings_Schools FOREIGN KEY (SchoolId) REFERENCES Schools(Id),
    CONSTRAINT FK_ClubMeetings_Clubs FOREIGN KEY (ClubId) REFERENCES Clubs(Id)
);

CREATE TABLE ClubMeetingAttendances (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    TenantId UNIQUEIDENTIFIER NOT NULL,
    SchoolId UNIQUEIDENTIFIER NOT NULL,
    ClubMeetingId UNIQUEIDENTIFIER NOT NULL,
    ClubMemberId UNIQUEIDENTIFIER NOT NULL,
    AttendanceStatus NVARCHAR(20) NOT NULL DEFAULT 'Present', -- 'Present', 'Absent', 'Late', 'Excused'
    ArrivalTime TIME,
    DepartureTime TIME,
    Participation NVARCHAR(500),
    Notes NVARCHAR(500),
    CreatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    IsDeleted BIT NOT NULL DEFAULT 0,
    RowVersion ROWVERSION NOT NULL,

    CONSTRAINT FK_ClubMeetingAttendances_Tenants FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    CONSTRAINT FK_ClubMeetingAttendances_Schools FOREIGN KEY (SchoolId) REFERENCES Schools(Id),
    CONSTRAINT FK_ClubMeetingAttendances_ClubMeetings FOREIGN KEY (ClubMeetingId) REFERENCES ClubMeetings(Id),
    CONSTRAINT FK_ClubMeetingAttendances_ClubMembers FOREIGN KEY (ClubMemberId) REFERENCES ClubMembers(Id),
    CONSTRAINT UQ_ClubMeetingAttendances_MeetingMember UNIQUE (ClubMeetingId, ClubMemberId)
);

CREATE TABLE ClubActivities (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    TenantId UNIQUEIDENTIFIER NOT NULL,
    SchoolId UNIQUEIDENTIFIER NOT NULL,
    ClubId UNIQUEIDENTIFIER NOT NULL,
    Title NVARCHAR(200) NOT NULL,
    Description NVARCHAR(1000),
    ActivityType NVARCHAR(50) NOT NULL, -- 'Event', 'Project', 'Competition', 'Workshop', 'Community Service'
    StartDate DATE NOT NULL,
    EndDate DATE,
    Location NVARCHAR(200),
    Budget DECIMAL(10,2) DEFAULT 0,
    ActualCost DECIMAL(10,2) DEFAULT 0,
    ParticipantsCount INT DEFAULT 0,
    Status NVARCHAR(20) NOT NULL DEFAULT 'Planned', -- 'Planned', 'InProgress', 'Completed', 'Cancelled'
    Outcome NVARCHAR(1000),
    CreatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    IsDeleted BIT NOT NULL DEFAULT 0,
    RowVersion ROWVERSION NOT NULL,

    CONSTRAINT FK_ClubActivities_Tenants FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    CONSTRAINT FK_ClubActivities_Schools FOREIGN KEY (SchoolId) REFERENCES Schools(Id),
    CONSTRAINT FK_ClubActivities_Clubs FOREIGN KEY (ClubId) REFERENCES Clubs(Id)
);

-- ========================================
-- STUDENT LEADERSHIP MODULE
-- ========================================

CREATE TABLE LeadershipPositions (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    TenantId UNIQUEIDENTIFIER NOT NULL,
    SchoolId UNIQUEIDENTIFIER NOT NULL,
    Title NVARCHAR(100) NOT NULL,
    Description NVARCHAR(1000),
    PositionType NVARCHAR(50) NOT NULL, -- 'Prefect', 'Class Monitor', 'Head Girl', 'Head Boy', 'House Captain', 'Club President'
    Level NVARCHAR(50) NOT NULL, -- 'School', 'Grade', 'Class', 'House', 'Club'
    HierarchyOrder INT NOT NULL DEFAULT 0,
    Responsibilities NVARCHAR(1000),
    Qualifications NVARCHAR(500),
    SelectionProcess NVARCHAR(500),
    TermDuration NVARCHAR(50), -- 'Academic Year', 'Semester', 'Term'
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    IsDeleted BIT NOT NULL DEFAULT 0,
    RowVersion ROWVERSION NOT NULL,

    CONSTRAINT FK_LeadershipPositions_Tenants FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    CONSTRAINT FK_LeadershipPositions_Schools FOREIGN KEY (SchoolId) REFERENCES Schools(Id)
);

CREATE TABLE StudentLeadershipAssignments (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    TenantId UNIQUEIDENTIFIER NOT NULL,
    SchoolId UNIQUEIDENTIFIER NOT NULL,
    StudentId UNIQUEIDENTIFIER NOT NULL,
    LeadershipPositionId UNIQUEIDENTIFIER NOT NULL,
    AcademicYearId UNIQUEIDENTIFIER NOT NULL,
    GradeId UNIQUEIDENTIFIER,
    ClassId UNIQUEIDENTIFIER,
    HouseId UNIQUEIDENTIFIER,
    ClubId UNIQUEIDENTIFIER,
    AppointmentDate DATE NOT NULL,
    EndDate DATE,
    Status NVARCHAR(20) NOT NULL DEFAULT 'Active', -- 'Active', 'Inactive', 'Suspended', 'Terminated', 'Graduated'
    AppointmentType NVARCHAR(50) NOT NULL DEFAULT 'Elected', -- 'Elected', 'Appointed', 'Selected'
    AppointedByStaffId UNIQUEIDENTIFIER,
    ReasonForAppointment NVARCHAR(500),
    ReasonForTermination NVARCHAR(500),
    PerformanceRating DECIMAL(3,2), -- 1.00 to 5.00
    DutiesFulfilled NVARCHAR(1000),
    CreatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    IsDeleted BIT NOT NULL DEFAULT 0,
    RowVersion ROWVERSION NOT NULL,

    CONSTRAINT FK_StudentLeadershipAssignments_Tenants FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    CONSTRAINT FK_StudentLeadershipAssignments_Schools FOREIGN KEY (SchoolId) REFERENCES Schools(Id),
    CONSTRAINT FK_StudentLeadershipAssignments_Students FOREIGN KEY (StudentId) REFERENCES Students(Id),
    CONSTRAINT FK_StudentLeadershipAssignments_LeadershipPositions FOREIGN KEY (LeadershipPositionId) REFERENCES LeadershipPositions(Id),
    CONSTRAINT FK_StudentLeadershipAssignments_AcademicYears FOREIGN KEY (AcademicYearId) REFERENCES AcademicYears(Id),
    CONSTRAINT FK_StudentLeadershipAssignments_Grades FOREIGN KEY (GradeId) REFERENCES Grades(Id),
    CONSTRAINT FK_StudentLeadershipAssignments_Classes FOREIGN KEY (ClassId) REFERENCES Classes(Id),
    CONSTRAINT FK_StudentLeadershipAssignments_Houses FOREIGN KEY (HouseId) REFERENCES Houses(Id),
    CONSTRAINT FK_StudentLeadershipAssignments_Clubs FOREIGN KEY (ClubId) REFERENCES Clubs(Id),
    CONSTRAINT FK_StudentLeadershipAssignments_AppointedBy FOREIGN KEY (AppointedByStaffId) REFERENCES StaffMembers(Id),
    CONSTRAINT UQ_StudentLeadershipAssignments_PositionStudentYear UNIQUE (LeadershipPositionId, StudentId, AcademicYearId)
);

CREATE TABLE LeadershipDuties (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    TenantId UNIQUEIDENTIFIER NOT NULL,
    SchoolId UNIQUEIDENTIFIER NOT NULL,
    LeadershipPositionId UNIQUEIDENTIFIER NOT NULL,
    DutyTitle NVARCHAR(200) NOT NULL,
    DutyDescription NVARCHAR(1000),
    Frequency NVARCHAR(50) NOT NULL, -- 'Daily', 'Weekly', 'Monthly', 'As Needed'
    Priority NVARCHAR(20) NOT NULL DEFAULT 'Medium', -- 'High', 'Medium', 'Low'
    EstimatedTimeMinutes INT DEFAULT 30,
    IsRecurring BIT NOT NULL DEFAULT 0,
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    IsDeleted BIT NOT NULL DEFAULT 0,
    RowVersion ROWVERSION NOT NULL,

    CONSTRAINT FK_LeadershipDuties_Tenants FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    CONSTRAINT FK_LeadershipDuties_Schools FOREIGN KEY (SchoolId) REFERENCES Schools(Id),
    CONSTRAINT FK_LeadershipDuties_LeadershipPositions FOREIGN KEY (LeadershipPositionId) REFERENCES LeadershipPositions(Id)
);

CREATE TABLE LeadershipDutyLogs (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    TenantId UNIQUEIDENTIFIER NOT NULL,
    SchoolId UNIQUEIDENTIFIER NOT NULL,
    StudentLeadershipAssignmentId UNIQUEIDENTIFIER NOT NULL,
    LeadershipDutyId UNIQUEIDENTIFIER NOT NULL,
    DutyDate DATE NOT NULL,
    StartTime TIME,
    EndTime TIME,
    DurationMinutes INT,
    Status NVARCHAR(20) NOT NULL DEFAULT 'Completed', -- 'Completed', 'Incomplete', 'Skipped', 'Postponed'
    PerformanceNotes NVARCHAR(1000),
    SupervisorStaffId UNIQUEIDENTIFIER,
    SupervisorRating DECIMAL(3,2), -- 1.00 to 5.00
    SupervisorComments NVARCHAR(500),
    CreatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    IsDeleted BIT NOT NULL DEFAULT 0,
    RowVersion ROWVERSION NOT NULL,

    CONSTRAINT FK_LeadershipDutyLogs_Tenants FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    CONSTRAINT FK_LeadershipDutyLogs_Schools FOREIGN KEY (SchoolId) REFERENCES Schools(Id),
    CONSTRAINT FK_LeadershipDutyLogs_StudentLeadershipAssignments FOREIGN KEY (StudentLeadershipAssignmentId) REFERENCES StudentLeadershipAssignments(Id),
    CONSTRAINT FK_LeadershipDutyLogs_LeadershipDuties FOREIGN KEY (LeadershipDutyId) REFERENCES LeadershipDuties(Id),
    CONSTRAINT FK_LeadershipDutyLogs_Supervisor FOREIGN KEY (SupervisorStaffId) REFERENCES StaffMembers(Id)
);

-- ========================================
-- AWARDS AND REWARDS MODULE
-- ========================================

CREATE TABLE AwardCategories (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    TenantId UNIQUEIDENTIFIER NOT NULL,
    SchoolId UNIQUEIDENTIFIER NOT NULL,
    Name NVARCHAR(100) NOT NULL,
    Description NVARCHAR(500),
    CategoryType NVARCHAR(50) NOT NULL, -- 'Academic', 'Sports', 'Leadership', 'Club', 'Attendance', 'Conduct', 'Special'
    AwardType NVARCHAR(50) NOT NULL, -- 'Certificate', 'Medal', 'Trophy', 'Prize', 'Scholarship'
    SelectionCriteria NVARCHAR(1000),
    AwardFrequency NVARCHAR(50) NOT NULL, -- 'Weekly', 'Monthly', 'Termly', 'Yearly', 'Event-based'
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    IsDeleted BIT NOT NULL DEFAULT 0,
    RowVersion ROWVERSION NOT NULL,

    CONSTRAINT FK_AwardCategories_Tenants FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    CONSTRAINT FK_AwardCategories_Schools FOREIGN KEY (SchoolId) REFERENCES Schools(Id)
);

CREATE TABLE Awards (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    TenantId UNIQUEIDENTIFIER NOT NULL,
    SchoolId UNIQUEIDENTIFIER NOT NULL,
    AwardCategoryId UNIQUEIDENTIFIER NOT NULL,
    Name NVARCHAR(200) NOT NULL,
    Description NVARCHAR(1000),
    AwardLevel NVARCHAR(50) NOT NULL, -- 'School', 'Grade', 'Class', 'Subject'
    Value DECIMAL(10,2) DEFAULT 0, -- Monetary value if applicable
    PointsValue INT DEFAULT 0,
    CertificateTemplate NVARCHAR(500),
    PhysicalAward NVARCHAR(50), -- 'Certificate', 'Medal', 'Trophy', 'Plaque', 'Badge'
    AcademicYearId UNIQUEIDENTIFIER NOT NULL,
    TermId UNIQUEIDENTIFIER,
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    IsDeleted BIT NOT NULL DEFAULT 0,
    RowVersion ROWVERSION NOT NULL,

    CONSTRAINT FK_Awards_Tenants FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    CONSTRAINT FK_Awards_Schools FOREIGN KEY (SchoolId) REFERENCES Schools(Id),
    CONSTRAINT FK_Awards_AwardCategories FOREIGN KEY (AwardCategoryId) REFERENCES AwardCategories(Id),
    CONSTRAINT FK_Awards_AcademicYears FOREIGN KEY (AcademicYearId) REFERENCES AcademicYears(Id),
    CONSTRAINT FK_Awards_Terms FOREIGN KEY (TermId) REFERENCES Terms(Id)
);

CREATE TABLE StudentAwards (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    TenantId UNIQUEIDENTIFIER NOT NULL,
    SchoolId UNIQUEIDENTIFIER NOT NULL,
    AwardId UNIQUEIDENTIFIER NOT NULL,
    StudentId UNIQUEIDENTIFIER NOT NULL,
    AcademicYearId UNIQUEIDENTIFIER NOT NULL,
    TermId UNIQUEIDENTIFIER,
    AwardDate DATE NOT NULL,
    CeremonyDate DATE,
    CeremonyName NVARCHAR(200),
    Reason NVARCHAR(1000),
    AchievementDetails NVARCHAR(1000),
    Ranking NVARCHAR(50), -- '1st', '2nd', '3rd', 'Honorable Mention', etc.
    CertificateNumber NVARCHAR(50),
    IssuedByStaffId UNIQUEIDENTIFIER,
    PresentedByStaffId UNIQUEIDENTIFIER,
    CertificateIssued BIT NOT NULL DEFAULT 0,
    PhysicalAwardIssued BIT NOT NULL DEFAULT 0,
    PointsAwarded INT DEFAULT 0,
    Status NVARCHAR(20) NOT NULL DEFAULT 'Awarded', -- 'Awarded', 'Pending', 'Declined', 'Revoked'
    CreatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    IsDeleted BIT NOT NULL DEFAULT 0,
    RowVersion ROWVERSION NOT NULL,

    CONSTRAINT FK_StudentAwards_Tenants FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    CONSTRAINT FK_StudentAwards_Schools FOREIGN KEY (SchoolId) REFERENCES Schools(Id),
    CONSTRAINT FK_StudentAwards_Awards FOREIGN KEY (AwardId) REFERENCES Awards(Id),
    CONSTRAINT FK_StudentAwards_Students FOREIGN KEY (StudentId) REFERENCES Students(Id),
    CONSTRAINT FK_StudentAwards_AcademicYears FOREIGN KEY (AcademicYearId) REFERENCES AcademicYears(Id),
    CONSTRAINT FK_StudentAwards_Terms FOREIGN KEY (TermId) REFERENCES Terms(Id),
    CONSTRAINT FK_StudentAwards_IssuedBy FOREIGN KEY (IssuedByStaffId) REFERENCES StaffMembers(Id),
    CONSTRAINT FK_StudentAwards_PresentedBy FOREIGN KEY (PresentedByStaffId) REFERENCES StaffMembers(Id),
    CONSTRAINT UQ_StudentAwards_AwardStudentYear UNIQUE (AwardId, StudentId, AcademicYearId)
);

CREATE TABLE PrizeGivingCeremonies (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    TenantId UNIQUEIDENTIFIER NOT NULL,
    SchoolId UNIQUEIDENTIFIER NOT NULL,
    Name NVARCHAR(200) NOT NULL,
    Description NVARCHAR(1000),
    CeremonyType NVARCHAR(50) NOT NULL, -- 'Graduation', 'Awards Day', 'Sports Day', 'Annual Prize Giving'
    CeremonyDate DATE NOT NULL,
    StartTime TIME NOT NULL,
    EndTime TIME,
    Venue NVARCHAR(200),
    OrganizerStaffId UNIQUEIDENTIFIER,
    MasterOfCeremonies NVARCHAR(200),
    GuestOfHonor NVARCHAR(200),
    ExpectedAttendees INT DEFAULT 0,
    ActualAttendees INT DEFAULT 0,
    Status NVARCHAR(20) NOT NULL DEFAULT 'Planned', -- 'Planned', 'InProgress', 'Completed', 'Cancelled'
    Program NVARCHAR(2000), -- Ceremony program/agenda
    Notes NVARCHAR(1000),
    CreatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    IsDeleted BIT NOT NULL DEFAULT 0,
    RowVersion ROWVERSION NOT NULL,

    CONSTRAINT FK_PrizeGivingCeremonies_Tenants FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    CONSTRAINT FK_PrizeGivingCeremonies_Schools FOREIGN KEY (SchoolId) REFERENCES Schools(Id),
    CONSTRAINT FK_PrizeGivingCeremonies_Organizer FOREIGN KEY (OrganizerStaffId) REFERENCES StaffMembers(Id)
);

CREATE TABLE CeremonyAwards (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    TenantId UNIQUEIDENTIFIER NOT NULL,
    SchoolId UNIQUEIDENTIFIER NOT NULL,
    PrizeGivingCeremonyId UNIQUEIDENTIFIER NOT NULL,
    StudentAwardId UNIQUEIDENTIFIER NOT NULL,
    PresentationOrder INT DEFAULT 0,
    PresenterStaffId UNIQUEIDENTIFIER,
    PresentationTime TIME,
    PhotoTaken BIT NOT NULL DEFAULT 0,
    PhotoPath NVARCHAR(500),
    SpecialNotes NVARCHAR(500),
    CreatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAtUtc DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    IsDeleted BIT NOT NULL DEFAULT 0,
    RowVersion ROWVERSION NOT NULL,

    CONSTRAINT FK_CeremonyAwards_Tenants FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    CONSTRAINT FK_CeremonyAwards_Schools FOREIGN KEY (SchoolId) REFERENCES Schools(Id),
    CONSTRAINT FK_CeremonyAwards_PrizeGivingCeremonies FOREIGN KEY (PrizeGivingCeremonyId) REFERENCES PrizeGivingCeremonies(Id),
    CONSTRAINT FK_CeremonyAwards_StudentAwards FOREIGN KEY (StudentAwardId) REFERENCES StudentAwards(Id),
    CONSTRAINT FK_CeremonyAwards_Presenter FOREIGN KEY (PresenterStaffId) REFERENCES StaffMembers(Id),
    CONSTRAINT UQ_CeremonyAwards_CeremonyAward UNIQUE (PrizeGivingCeremonyId, StudentAwardId)
);

-- ========================================
-- SAMPLE DATA INSERTS
-- ========================================

-- This will be populated by the seed data script

GO

PRINT 'Database schema created successfully!';
PRINT 'Ready for data population.';
