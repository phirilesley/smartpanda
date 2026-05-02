-- Smart School System Seed Data
-- Version 1.0 - Complete Seed Data for All Modules
-- Generated: March 2024

USE SmartSchool
GO

-- ========================================
-- TENANT AND SCHOOL SEED DATA
-- ========================================

-- Insert Tenants
INSERT INTO Tenants (Id, Name, Description, Domain, ContactEmail, ContactPhone, Address, IsActive, CreatedAtUtc, UpdatedAtUtc, IsDeleted)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'Smart Education Group', 'Multi-campus educational institution', 'smartedu.local', 'admin@smartedu.local', '+1-555-0100', '123 Education Street, Learning City, LC 12345', 1, GETUTCDATE(), GETUTCDATE(), 0),
    ('22222222-2222-2222-2222-222222222222', 'Excellence Schools', 'Premium K-12 education provider', 'excellence.local', 'info@excellence.local', '+1-555-0200', '456 Excellence Avenue, Academic Town, AT 67890', 1, GETUTCDATE(), GETUTCDATE(), 0),
    ('33333333-3333-3333-3333-333333333333', 'Future Learning Academy', 'Innovative STEM-focused institution', 'futureacademy.local', 'contact@futureacademy.local', '+1-555-0300', '789 Innovation Boulevard, Tech City, TC 10111', 1, GETUTCDATE(), GETUTCDATE(), 0);

-- Insert Schools
INSERT INTO Schools (Id, TenantId, Name, Code, Type, Address, City, State, Country, PostalCode, Phone, Email, Website, EstablishedDate, IsActive, CreatedAtUtc, UpdatedAtUtc, IsDeleted)
VALUES 
    -- Smart Education Group Schools
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Smart Primary School', 'SPS-001', 'Primary', '123 Education Street, Learning City', 'Learning City', 'California', 'USA', '12345', '+1-555-0101', 'primary@smartedu.local', 'primary.smartedu.local', '2010-09-01', 1, GETUTCDATE(), GETUTCDATE(), 0),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 'Smart High School', 'SHS-002', 'Secondary', '456 Academy Road, Learning City', 'Learning City', 'California', 'USA', '12345', '+1-555-0102', 'high@smartedu.local', 'high.smartedu.local', '2005-08-15', 1, GETUTCDATE(), GETUTCDATE(), 0),
    
    -- Excellence Schools
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', '22222222-2222-2222-2222-222222222222', 'Excellence Elementary', 'EE-001', 'Primary', '789 Excellence Avenue, Academic Town', 'Academic Town', 'New York', 'USA', '67890', '+1-555-0201', 'elementary@excellence.local', 'elementary.excellence.local', '2015-08-20', 1, GETUTCDATE(), GETUTCDATE(), 0),
    ('dddddddd-dddd-dddd-dddd-dddddddddddd', '22222222-2222-2222-2222-222222222222', 'Excellence Academy', 'EA-002', 'Secondary', '012 Prestige Lane, Academic Town', 'Academic Town', 'New York', 'USA', '67890', '+1-555-0202', 'academy@excellence.local', 'academy.excellence.local', '2008-09-10', 1, GETUTCDATE(), GETUTCDATE(), 0),

    -- Future Learning Academy
    ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '33333333-3333-3333-3333-333333333333', 'Future STEM Academy', 'FSA-001', 'University', '789 Innovation Boulevard, Tech City', 'Tech City', 'Texas', 'USA', '10111', '+1-555-0301', 'info@futureacademy.local', 'futureacademy.local', '2018-01-15', 1, GETUTCDATE(), GETUTCDATE(), 0);

-- ========================================
-- USER AND ROLE SEED DATA
-- ========================================

-- Insert Users
INSERT INTO Users (Id, TenantId, SchoolId, FirstName, LastName, Email, PhoneNumber, Role, IsActive, CreatedAtUtc, UpdatedAtUtc, IsDeleted)
VALUES 
    -- Smart Education Group Users
    ('u1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'John', 'Smith', 'john.smith@smartedu.local', '+1-555-1111', 'Admin', 1, GETUTCDATE(), GETUTCDATE(), 0),
    ('u1111111-1111-1111-1111-111111111112', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Sarah', 'Johnson', 'sarah.johnson@smartedu.local', '+1-555-1112', 'Teacher', 1, GETUTCDATE(), GETUTCDATE(), 0),
    ('u1111111-1111-1111-1111-111111111113', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Michael', 'Brown', 'michael.brown@smartedu.local', '+1-555-1113', 'Student', 1, GETUTCDATE(), GETUTCDATE(), 0),
    ('u1111111-1111-1111-1111-111111111114', '11111111-1111-1111-1111-111111111111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Emily', 'Davis', 'emily.davis@smartedu.local', '+1-555-1114', 'Admin', 1, GETUTCDATE(), GETUTCDATE(), 0),
    
    -- Excellence Schools Users
    ('u2222222-2222-2222-2222-222222222221', '22222222-2222-2222-2222-222222222222', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Robert', 'Wilson', 'robert.wilson@excellence.local', '+1-555-2221', 'Admin', 1, GETUTCDATE(), GETUTCDATE(), 0),
    ('u2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Lisa', 'Anderson', 'lisa.anderson@excellence.local', '+1-555-2222', 'Teacher', 1, GETUTCDATE(), GETUTCDATE(), 0),
    ('u2222222-2222-2222-2222-222222222223', '22222222-2222-2222-2222-222222222222', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'David', 'Martinez', 'david.martinez@excellence.local', '+1-555-2223', 'Student', 1, GETUTCDATE(), GETUTCDATE(), 0),

    -- Future Learning Academy Users
    ('u3333333-3333-3333-3333-333333333331', '33333333-3333-3333-3333-333333333333', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Jennifer', 'Taylor', 'jennifer.taylor@futureacademy.local', '+1-555-3331', 'Admin', 1, GETUTCDATE(), GETUTCDATE(), 0),
    ('u3333333-3333-3333-3333-333333333332', '33333333-3333-3333-3333-333333333333', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Christopher', 'Thomas', 'christopher.thomas@futureacademy.local', '+1-555-3332', 'Teacher', 1, GETUTCDATE(), GETUTCDATE(), 0),
    ('u3333333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Amanda', 'Jackson', 'amanda.jackson@futureacademy.local', '+1-555-3333', 'Student', 1, GETUTCDATE(), GETUTCDATE(), 0);

-- ========================================
-- ACADEMIC SEED DATA
-- ========================================

-- Insert Academic Years
INSERT INTO AcademicYears (Id, TenantId, SchoolId, Name, StartDate, EndDate, IsActive, CreatedAtUtc, UpdatedAtUtc, IsDeleted)
VALUES 
    ('ay111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '2023-2024', '2023-09-01', '2024-06-30', 1, GETUTCDATE(), GETUTCDATE(), 0),
    ('ay111111-1111-1111-1111-111111111112', '11111111-1111-1111-1111-111111111111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '2023-2024', '2023-09-01', '2024-06-30', 1, GETUTCDATE(), GETUTCDATE(), 0),
    ('ay222222-2222-2222-2222-222222222221', '22222222-2222-2222-2222-222222222222', 'cccccccc-cccc-cccc-cccc-cccccccccccc', '2023-2024', '2023-09-01', '2024-06-30', 1, GETUTCDATE(), GETUTCDATE(), 0),
    ('ay333333-3333-3333-3333-333333333331', '33333333-3333-3333-3333-333333333333', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '2023-2024', '2023-09-01', '2024-06-30', 1, GETUTCDATE(), GETUTCDATE(), 0);

-- Insert Terms
INSERT INTO Terms (Id, TenantId, SchoolId, AcademicYearId, Name, StartDate, EndDate, IsActive, CreatedAtUtc, UpdatedAtUtc, IsDeleted)
VALUES 
    ('t1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'ay111111-1111-1111-1111-111111111111', 'Term 1', '2023-09-01', '2023-12-15', 1, GETUTCDATE(), GETUTCDATE(), 0),
    ('t1111111-1111-1111-1111-111111111112', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'ay111111-1111-1111-1111-111111111111', 'Term 2', '2024-01-08', '2024-03-22', 1, GETUTCDATE(), GETUTCDATE(), 0),
    ('t1111111-1111-1111-1111-111111111113', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'ay111111-1111-1111-1111-111111111111', 'Term 3', '2024-04-08', '2024-06-30', 1, GETUTCDATE(), GETUTCDATE(), 0);

-- Insert Grades
INSERT INTO Grades (Id, TenantId, SchoolId, Name, Code, Level, OrderIndex, IsActive, CreatedAtUtc, UpdatedAtUtc, IsDeleted)
VALUES 
    -- Smart Primary School Grades
    ('g1111111-1111-1111-1111-111111111101', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Grade 1', 'G1', 1, 1, 1, GETUTCDATE(), GETUTCDATE(), 0),
    ('g1111111-1111-1111-1111-111111111102', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Grade 2', 'G2', 2, 2, 1, GETUTCDATE(), GETUTCDATE(), 0),
    ('g1111111-1111-1111-1111-111111111103', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Grade 3', 'G3', 3, 3, 1, GETUTCDATE(), GETUTCDATE(), 0),
    ('g1111111-1111-1111-1111-111111111104', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Grade 4', 'G4', 4, 4, 1, GETUTCDATE(), GETUTCDATE(), 0),
    ('g1111111-1111-1111-1111-111111111105', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Grade 5', 'G5', 5, 5, 1, GETUTCDATE(), GETUTCDATE(), 0),
    
    -- Smart High School Grades
    ('g1111111-1111-1111-1111-111111111106', '11111111-1111-1111-1111-111111111111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Grade 6', 'G6', 6, 6, 1, GETUTCDATE(), GETUTCDATE(), 0),
    ('g1111111-1111-1111-1111-111111111107', '11111111-1111-1111-1111-111111111111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Grade 7', 'G7', 7, 7, 1, GETUTCDATE(), GETUTCDATE(), 0),
    ('g1111111-1111-1111-1111-111111111108', '11111111-1111-1111-1111-111111111111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Grade 8', 'G8', 8, 8, 1, GETUTCDATE(), GETUTCDATE(), 0),
    ('g1111111-1111-1111-1111-111111111109', '11111111-1111-1111-1111-111111111111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Grade 9', 'G9', 9, 9, 1, GETUTCDATE(), GETUTCDATE(), 0),
    ('g1111111-1111-1111-1111-111111111110', '11111111-1111-1111-1111-111111111111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Grade 10', 'G10', 10, 10, 1, GETUTCDATE(), GETUTCDATE(), 0),

    -- Excellence Elementary Grades
    ('g2222222-2222-2222-2222-222222222201', '22222222-2222-2222-2222-222222222222', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Kindergarten', 'KG', 0, 0, 1, GETUTCDATE(), GETUTCDATE(), 0),
    ('g2222222-2222-2222-2222-222222222202', '22222222-2222-2222-2222-222222222222', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Grade 1', 'G1', 1, 1, 1, GETUTCDATE(), GETUTCDATE(), 0),
    ('g2222222-2222-2222-2222-222222222203', '22222222-2222-2222-2222-222222222222', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Grade 2', 'G2', 2, 2, 1, GETUTCDATE(), GETUTCDATE(), 0),
    ('g2222222-2222-2222-2222-222222222204', '22222222-2222-2222-2222-222222222222', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Grade 3', 'G3', 3, 3, 1, GETUTCDATE(), GETUTCDATE(), 0),
    ('g2222222-2222-2222-2222-222222222205', '22222222-2222-2222-2222-222222222222', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Grade 4', 'G4', 4, 4, 1, GETUTCDATE(), GETUTCDATE(), 0),
    ('g2222222-2222-2222-2222-222222222206', '22222222-2222-2222-2222-222222222222', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Grade 5', 'G5', 5, 5, 1, GETUTCDATE(), GETUTCDATE(), 0);

-- Insert Subjects
INSERT INTO Subjects (Id, TenantId, SchoolId, Name, Code, Description, IsActive, CreatedAtUtc, UpdatedAtUtc, IsDeleted)
VALUES 
    -- Core Subjects
    ('s1111111-1111-1111-1111-111111111101', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Mathematics', 'MATH', 'Fundamental mathematical concepts and problem-solving', 1, GETUTCDATE(), GETUTCDATE(), 0),
    ('s1111111-1111-1111-1111-111111111102', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'English Language', 'ENG', 'Reading, writing, and communication skills', 1, GETUTCDATE(), GETUTCDATE(), 0),
    ('s1111111-1111-1111-1111-111111111103', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Science', 'SCI', 'General science concepts and experiments', 1, GETUTCDATE(), GETUTCDATE(), 0),
    ('s1111111-1111-1111-1111-111111111104', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Social Studies', 'SS', 'History, geography, and social concepts', 1, GETUTCDATE(), GETUTCDATE(), 0),
    
    -- Additional Subjects
    ('s1111111-1111-1111-1111-111111111105', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Physical Education', 'PE', 'Physical fitness and sports activities', 1, GETUTCDATE(), GETUTCDATE(), 0),
    ('s1111111-1111-1111-1111-111111111106', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Art', 'ART', 'Creative expression and visual arts', 1, GETUTCDATE(), GETUTCDATE(), 0),
    ('s1111111-1111-1111-1111-111111111107', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Music', 'MUSIC', 'Musical education and performance', 1, GETUTCDATE(), GETUTCDATE(), 0),
    ('s1111111-1111-1111-1111-111111111108', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Computer Science', 'CS', 'Digital literacy and programming', 1, GETUTCDATE(), GETUTCDATE(), 0);

-- ========================================
-- STUDENT SEED DATA
-- ========================================

-- Insert Students
INSERT INTO Students (Id, TenantId, SchoolId, FirstName, LastName, Email, DateOfBirth, Gender, AdmissionNumber, GradeId, IsActive, CreatedAtUtc, UpdatedAtUtc, IsDeleted)
VALUES 
    -- Smart Primary School Students
    ('st111111-1111-1111-1111-111111111101', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Emma', 'Williams', 'emma.williams@smartedu.local', '2017-03-15', 'Female', 'SPS001', 'g1111111-1111-1111-1111-111111111101', 1, GETUTCDATE(), GETUTCDATE(), 0),
    ('st111111-1111-1111-1111-111111111102', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Oliver', 'Jones', 'oliver.jones@smartedu.local', '2016-07-22', 'Male', 'SPS002', 'g1111111-1111-1111-1111-111111111102', 1, GETUTCDATE(), GETUTCDATE(), 0),
    ('st111111-1111-1111-1111-111111111103', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Sophia', 'Brown', 'sophia.brown@smartedu.local', '2018-01-10', 'Female', 'SPS003', 'g1111111-1111-1111-1111-111111111101', 1, GETUTCDATE(), GETUTCDATE(), 0),
    ('st111111-1111-1111-1111-111111111104', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Lucas', 'Davis', 'lucas.davis@smartedu.local', '2017-09-05', 'Male', 'SPS004', 'g1111111-1111-1111-1111-111111111102', 1, GETUTCDATE(), GETUTCDATE(), 0),
    ('st111111-1111-1111-1111-111111111105', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Ava', 'Miller', 'ava.miller@smartedu.local', '2018-05-18', 'Female', 'SPS005', 'g1111111-1111-1111-1111-111111111101', 1, GETUTCDATE(), GETUTCDATE(), 0),

    -- Smart High School Students
    ('st111111-1111-1111-1111-111111111106', '11111111-1111-1111-1111-111111111111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Noah', 'Wilson', 'noah.wilson@smartedu.local', '2012-04-12', 'Male', 'SHS001', 'g1111111-1111-1111-1111-111111111107', 1, GETUTCDATE(), GETUTCDATE(), 0),
    ('st111111-1111-1111-1111-111111111107', '11111111-1111-1111-1111-111111111111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Isabella', 'Moore', 'isabella.moore@smartedu.local', '2013-08-25', 'Female', 'SHS002', 'g1111111-1111-1111-1111-111111111106', 1, GETUTCDATE(), GETUTCDATE(), 0),
    ('st111111-1111-1111-1111-111111111108', '11111111-1111-1111-1111-111111111111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Ethan', 'Taylor', 'ethan.taylor@smartedu.local', '2012-11-30', 'Male', 'SHS003', 'g1111111-1111-1111-1111-111111111107', 1, GETUTCDATE(), GETUTCDATE(), 0),

    -- Excellence Elementary Students
    ('st222222-2222-2222-2222-222222222201', '22222222-2222-2222-2222-222222222222', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Mia', 'Anderson', 'mia.anderson@excellence.local', '2018-12-03', 'Female', 'EE001', 'g2222222-2222-2222-2222-222222222201', 1, GETUTCDATE(), GETUTCDATE(), 0),
    ('st222222-2222-2222-2222-222222222202', '22222222-2222-2222-2222-222222222222', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Jackson', 'Thomas', 'jackson.thomas@excellence.local', '2017-06-14', 'Male', 'EE002', 'g2222222-2222-2222-2222-222222222202', 1, GETUTCDATE(), GETUTCDATE(), 0),
    ('st222222-2222-2222-2222-222222222203', '22222222-2222-2222-2222-222222222222', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Lily', 'Jackson', 'lily.jackson@excellence.local', '2019-02-28', 'Female', 'EE003', 'g2222222-2222-2222-2222-222222222201', 1, GETUTCDATE(), GETUTCDATE(), 0);

-- Insert Guardians
INSERT INTO Guardians (Id, TenantId, SchoolId, FirstName, LastName, Email, PhoneNumber, Relationship, Occupation, IsActive, CreatedAtUtc, UpdatedAtUtc, IsDeleted)
VALUES 
    ('g1111111-1111-1111-1111-111111111101', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Robert', 'Williams', 'robert.williams@email.com', '+1-555-1001', 'Father', 'Engineer', 1, GETUTCDATE(), GETUTCDATE(), 0),
    ('g1111111-1111-1111-1111-111111111102', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Jennifer', 'Williams', 'jennifer.williams@email.com', '+1-555-1002', 'Mother', 'Teacher', 1, GETUTCDATE(), GETUTCDATE(), 0),
    ('g1111111-1111-1111-1111-111111111103', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'David', 'Jones', 'david.jones@email.com', '+1-555-1003', 'Father', 'Doctor', 1, GETUTCDATE(), GETUTCDATE(), 0),
    ('g1111111-1111-1111-1111-111111111104', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Maria', 'Jones', 'maria.jones@email.com', '+1-555-1004', 'Mother', 'Nurse', 1, GETUTCDATE(), GETUTCDATE(), 0);

-- ========================================
-- FINANCIAL SEED DATA
-- ========================================

-- Insert Fee Categories
INSERT INTO FeeCategories (Id, TenantId, SchoolId, Name, Description, IsActive, CreatedAtUtc, UpdatedAtUtc, IsDeleted)
VALUES 
    ('fc111111-1111-1111-1111-111111111101', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Tuition Fee', 'Regular academic tuition fees', 1, GETUTCDATE(), GETUTCDATE(), 0),
    ('fc111111-1111-1111-1111-111111111102', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Registration Fee', 'One-time registration fee', 1, GETUTCDATE(), GETUTCDATE(), 0),
    ('fc111111-1111-1111-1111-111111111103', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Transportation Fee', 'School bus transportation', 1, GETUTCDATE(), GETUTCDATE(), 0),
    ('fc111111-1111-1111-1111-111111111104', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Lunch Program', 'School lunch program fees', 1, GETUTCDATE(), GETUTCDATE(), 0),
    ('fc111111-1111-1111-1111-111111111105', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Uniform Fee', 'School uniform costs', 1, GETUTCDATE(), GETUTCDATE(), 0);

-- Insert Fee Structures
INSERT INTO FeeStructures (Id, TenantId, SchoolId, GradeId, FeeCategoryId, Amount, PaymentFrequency, Description, IsActive, CreatedAtUtc, UpdatedAtUtc, IsDeleted)
VALUES 
    -- Grade 1 Fees
    ('fs111111-1111-1111-1111-111111111101', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'g1111111-1111-1111-1111-111111111101', 'fc111111-1111-1111-1111-111111111101', 5000.00, 'Monthly', 'Grade 1 Tuition Fee', 1, GETUTCDATE(), GETUTCDATE(), 0),
    ('fs111111-1111-1111-1111-111111111102', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'g1111111-1111-1111-1111-111111111101', 'fc111111-1111-1111-1111-111111111103', 200.00, 'Monthly', 'Grade 1 Transportation Fee', 1, GETUTCDATE(), GETUTCDATE(), 0),
    ('fs111111-1111-1111-1111-111111111103', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'g1111111-1111-1111-1111-111111111101', 'fc111111-1111-1111-1111-111111111104', 150.00, 'Monthly', 'Grade 1 Lunch Program', 1, GETUTCDATE(), GETUTCDATE(), 0),

    -- Grade 2 Fees
    ('fs111111-1111-1111-1111-111111111104', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'g1111111-1111-1111-1111-111111111102', 'fc111111-1111-1111-1111-111111111101', 5200.00, 'Monthly', 'Grade 2 Tuition Fee', 1, GETUTCDATE(), GETUTCDATE(), 0),
    ('fs111111-1111-1111-1111-111111111105', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'g1111111-1111-1111-1111-111111111102', 'fc111111-1111-1111-1111-111111111103', 200.00, 'Monthly', 'Grade 2 Transportation Fee', 1, GETUTCDATE(), GETUTCDATE(), 0),

    -- High School Fees
    ('fs111111-1111-1111-1111-111111111106', '11111111-1111-1111-1111-111111111111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'g1111111-1111-1111-1111-111111111107', 'fc111111-1111-1111-1111-111111111101', 6500.00, 'Monthly', 'Grade 7 Tuition Fee', 1, GETUTCDATE(), GETUTCDATE(), 0),
    ('fs111111-1111-1111-1111-111111111107', '11111111-1111-1111-1111-111111111111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'g1111111-1111-1111-1111-111111111107', 'fc111111-1111-1111-1111-111111111103', 250.00, 'Monthly', 'Grade 7 Transportation Fee', 1, GETUTCDATE(), GETUTCDATE(), 0);

-- Insert Student Invoices
INSERT INTO StudentInvoices (Id, TenantId, SchoolId, StudentId, InvoiceNumber, TotalAmount, PaidAmount, DueDate, Status, IsPaid, CreatedAtUtc, UpdatedAtUtc, IsDeleted)
VALUES 
    ('inv111111-1111-1111-1111-111111111101', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'st111111-1111-1111-1111-111111111101', 'INV-2024-001', 5350.00, 5350.00, '2024-01-31', 'Paid', 1, GETUTCDATE(), GETUTCDATE(), 0),
    ('inv111111-1111-1111-1111-111111111102', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'st111111-1111-1111-1111-111111111102', 'INV-2024-002', 5400.00, 2700.00, '2024-01-31', 'Partially Paid', 0, GETUTCDATE(), GETUTCDATE(), 0),
    ('inv111111-1111-1111-1111-111111111103', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'st111111-1111-1111-1111-111111111103', 'INV-2024-003', 5350.00, 0.00, '2024-01-31', 'Unpaid', 0, GETUTCDATE(), GETUTCDATE(), 0),
    ('inv111111-1111-1111-1111-111111111104', '11111111-1111-1111-1111-111111111111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'st111111-1111-1111-1111-111111111106', 'INV-2024-004', 6750.00, 6750.00, '2024-01-31', 'Paid', 1, GETUTCDATE(), GETUTCDATE(), 0);

-- Insert Payments
INSERT INTO Payments (Id, TenantId, SchoolId, StudentId, InvoiceId, Amount, PaymentDate, PaymentMethod, ReferenceNumber, Status, CreatedAtUtc, UpdatedAtUtc, IsDeleted)
VALUES 
    ('pay111111-1111-1111-1111-111111111101', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'st111111-1111-1111-1111-111111111101', 'inv111111-1111-1111-1111-111111111101', 5350.00, '2024-01-15', 'Bank Transfer', 'BT-2024-001', 'Completed', GETUTCDATE(), GETUTCDATE(), 0),
    ('pay111111-1111-1111-1111-111111111102', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'st111111-1111-1111-1111-111111111102', 'inv111111-1111-1111-1111-111111111102', 2700.00, '2024-01-20', 'Credit Card', 'CC-2024-001', 'Completed', GETUTCDATE(), GETUTCDATE(), 0),
    ('pay111111-1111-1111-1111-111111111103', '11111111-1111-1111-1111-111111111111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'st111111-1111-1111-1111-111111111106', 'inv111111-1111-1111-1111-111111111104', 6750.00, '2024-01-10', 'Bank Transfer', 'BT-2024-002', 'Completed', GETUTCDATE(), GETUTCDATE(), 0);

-- ========================================
-- STAFF SEED DATA
-- ========================================

-- Insert Staff
INSERT INTO Staff (Id, TenantId, SchoolId, FirstName, LastName, Email, PhoneNumber, EmployeeNumber, Department, Position, HireDate, IsActive, CreatedAtUtc, UpdatedAtUtc, IsDeleted)
VALUES 
    -- Smart Primary School Staff
    ('sf111111-1111-1111-1111-111111111101', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Sarah', 'Johnson', 'sarah.johnson@smartedu.local', '+1-555-2001', 'EMP001', 'Academic', 'Grade 1 Teacher', '2020-08-15', 1, GETUTCDATE(), GETUTCDATE(), 0),
    ('sf111111-1111-1111-1111-111111111102', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Michael', 'Brown', 'michael.brown@smartedu.local', '+1-555-2002', 'EMP002', 'Academic', 'Grade 2 Teacher', '2019-07-20', 1, GETUTCDATE(), GETUTCDATE(), 0),
    ('sf111111-1111-1111-1111-111111111103', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Patricia', 'Garcia', 'patricia.garcia@smartedu.local', '+1-555-2003', 'EMP003', 'Academic', 'Grade 3 Teacher', '2021-08-10', 1, GETUTCDATE(), GETUTCDATE(), 0),
    ('sf111111-1111-1111-1111-111111111104', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'James', 'Martinez', 'james.martinez@smartedu.local', '+1-555-2004', 'EMP004', 'Administration', 'Principal', '2018-06-01', 1, GETUTCDATE(), GETUTCDATE(), 0),
    ('sf111111-1111-1111-1111-111111111105', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Linda', 'Rodriguez', 'linda.rodriguez@smartedu.local', '+1-555-2005', 'EMP005', 'Administration', 'School Secretary', '2019-03-15', 1, GETUTCDATE(), GETUTCDATE(), 0),

    -- Smart High School Staff
    ('sf111111-1111-1111-1111-111111111106', '11111111-1111-1111-1111-111111111111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Emily', 'Davis', 'emily.davis@smartedu.local', '+1-555-2006', 'EMP006', 'Academic', 'Mathematics Teacher', '2020-08-20', 1, GETUTCDATE(), GETUTCDATE(), 0),
    ('sf111111-1111-1111-1111-111111111107', '11111111-1111-1111-1111-111111111111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'William', 'Hernandez', 'william.hernandez@smartedu.local', '+1-555-2007', 'EMP007', 'Academic', 'Science Teacher', '2019-07-25', 1, GETUTCDATE(), GETUTCDATE(), 0),
    ('sf111111-1111-1111-1111-111111111108', '11111111-1111-1111-1111-111111111111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Barbara', 'Lopez', 'barbara.lopez@smartedu.local', '+1-555-2008', 'EMP008', 'Administration', 'High School Principal', '2017-08-01', 1, GETUTCDATE(), GETUTCDATE(), 0);

-- ========================================
-- MONITORING SEED DATA
-- ========================================

-- Insert Alert Rules
INSERT INTO AlertRules (Id, TenantId, Name, MetricName, Operator, ThresholdValue, Severity, IsActive, CreatedAtUtc, UpdatedAtUtc)
VALUES 
    ('ar111111-1111-1111-1111-111111111101', '11111111-1111-1111-1111-111111111111', 'Low User Activity', 'UserActivity', 'LessThan', 80.0, 'Medium', 1, GETUTCDATE(), GETUTCDATE()),
    ('ar111111-1111-1111-1111-111111111102', '11111111-1111-1111-1111-111111111111', 'High Outstanding Payments', 'OutstandingPayments', 'GreaterThan', 100000.0, 'High', 1, GETUTCDATE(), GETUTCDATE()),
    ('ar111111-1111-1111-1111-111111111103', '11111111-1111-1111-1111-111111111111', 'Low Payment Rate', 'PaymentRate', 'LessThan', 85.0, 'Medium', 1, GETUTCDATE(), GETUTCDATE()),
    ('ar111111-1111-1111-1111-111111111104', '11111111-1111-1111-1111-111111111111', 'High Failed Logins', 'FailedLogins', 'GreaterThan', 50.0, 'High', 1, GETUTCDATE(), GETUTCDATE()),
    ('ar111111-1111-1111-1111-111111111105', '11111111-1111-1111-1111-111111111111', 'High Memory Usage', 'MemoryUsage', 'GreaterThan', 85.0, 'High', 1, GETUTCDATE(), GETUTCDATE());

-- Insert Sample Alerts
INSERT INTO Alerts (Id, TenantId, Type, Title, Message, Severity, IsActive, IsAcknowledged, CreatedAtUtc, CreatedBy)
VALUES 
    ('al111111-1111-1111-1111-111111111101', '11111111-1111-1111-1111-111111111111', 'System Health', 'Database Connection Slow', 'Database connection time exceeded threshold', 'Medium', 1, 0, GETUTCDATE(), 'System'),
    ('al111111-1111-1111-1111-111111111102', '11111111-1111-1111-1111-111111111111', 'Financial', 'Outstanding Payment Alert', 'Outstanding payments exceed $100,000', 'High', 1, 0, GETUTCDATE(), 'System'),
    ('al111111-1111-1111-1111-111111111103', '11111111-1111-1111-1111-111111111111', 'Security', 'Failed Login Attempts', 'Multiple failed login attempts detected', 'High', 1, 1, DATEADD(day, -1, GETUTCDATE()), 'System');

-- ========================================
-- SYSTEM SETTINGS SEED DATA
-- ========================================

-- Insert System Settings
INSERT INTO SystemSettings (Id, TenantId, SchoolId, Key, Value, Description, IsActive, CreatedAtUtc, UpdatedAtUtc, IsDeleted)
VALUES 
    ('ss111111-1111-1111-1111-111111111101', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'SchoolName', 'Smart Primary School', 'Display name of the school', 1, GETUTCDATE(), GETUTCDATE(), 0),
    ('ss111111-1111-1111-1111-111111111102', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'AcademicYear', '2023-2024', 'Current academic year', 1, GETUTCDATE(), GETUTCDATE(), 0),
    ('ss111111-1111-1111-1111-111111111103', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Term', 'Term 1', 'Current term', 1, GETUTCDATE(), GETUTCDATE(), 0),
    ('ss111111-1111-1111-1111-111111111104', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Currency', 'USD', 'Default currency', 1, GETUTCDATE(), GETUTCDATE(), 0),
    ('ss111111-1111-1111-1111-111111111105', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'TimeZone', 'UTC-8', 'School timezone', 1, GETUTCDATE(), GETUTCDATE(), 0);

PRINT 'Smart School System seed data inserted successfully!'
PRINT 'Summary:'
PRINT '- 3 Tenants created'
PRINT '- 5 Schools created'
PRINT '- 10 Users created'
PRINT '- 4 Academic Years created'
PRINT '- 3 Terms created'
PRINT '- 11 Grades created'
PRINT '- 8 Subjects created'
PRINT '- 9 Students created'
PRINT '- 4 Guardians created'
PRINT '- 5 Fee Categories created'
PRINT '- 7 Fee Structures created'
PRINT '- 4 Student Invoices created'
PRINT '- 3 Payments created'
PRINT '- 8 Staff members created'
PRINT '- 5 Alert Rules created'
PRINT '- 3 Sample Alerts created'
PRINT '- 5 System Settings created'
GO
