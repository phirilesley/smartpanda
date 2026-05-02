BEGIN TRANSACTION;
GO

CREATE TABLE [ClinicMedications] (
    [Id] uniqueidentifier NOT NULL,
    [Name] nvarchar(450) NOT NULL,
    [Unit] nvarchar(max) NOT NULL,
    [QuantityInStock] decimal(18,2) NOT NULL,
    [ReorderLevel] decimal(18,2) NOT NULL,
    [IsActive] bit NOT NULL,
    [CreatedAtUtc] datetime2 NOT NULL,
    [UpdatedAtUtc] datetime2 NULL,
    [DeletedAtUtc] datetime2 NULL,
    [IsDeleted] bit NOT NULL,
    [TenantId] uniqueidentifier NOT NULL,
    [SchoolId] uniqueidentifier NOT NULL,
    CONSTRAINT [PK_ClinicMedications] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [ClinicVisits] (
    [Id] uniqueidentifier NOT NULL,
    [PatientType] nvarchar(450) NOT NULL,
    [StudentId] uniqueidentifier NULL,
    [StaffId] uniqueidentifier NULL,
    [VisitDateUtc] datetime2 NOT NULL,
    [Complaint] nvarchar(max) NOT NULL,
    [Diagnosis] nvarchar(max) NOT NULL,
    [Treatment] nvarchar(max) NOT NULL,
    [AttendedByStaffId] uniqueidentifier NOT NULL,
    [FollowUpDateUtc] datetime2 NULL,
    [Status] nvarchar(max) NOT NULL,
    [CreatedAtUtc] datetime2 NOT NULL,
    [UpdatedAtUtc] datetime2 NULL,
    [DeletedAtUtc] datetime2 NULL,
    [IsDeleted] bit NOT NULL,
    [TenantId] uniqueidentifier NOT NULL,
    [SchoolId] uniqueidentifier NOT NULL,
    CONSTRAINT [PK_ClinicVisits] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [EventParticipants] (
    [Id] uniqueidentifier NOT NULL,
    [SchoolEventId] uniqueidentifier NOT NULL,
    [StudentId] uniqueidentifier NULL,
    [GuardianId] uniqueidentifier NULL,
    [StaffId] uniqueidentifier NULL,
    [ParticipantType] nvarchar(max) NOT NULL,
    [AttendanceStatus] nvarchar(max) NOT NULL,
    [CreatedAtUtc] datetime2 NOT NULL,
    [UpdatedAtUtc] datetime2 NULL,
    [DeletedAtUtc] datetime2 NULL,
    [IsDeleted] bit NOT NULL,
    [TenantId] uniqueidentifier NOT NULL,
    [SchoolId] uniqueidentifier NOT NULL,
    CONSTRAINT [PK_EventParticipants] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [HealthProfiles] (
    [Id] uniqueidentifier NOT NULL,
    [StudentId] uniqueidentifier NULL,
    [StaffId] uniqueidentifier NULL,
    [BloodGroup] nvarchar(max) NOT NULL,
    [Allergies] nvarchar(max) NOT NULL,
    [ChronicConditions] nvarchar(max) NOT NULL,
    [EmergencyContactName] nvarchar(max) NOT NULL,
    [EmergencyContactPhone] nvarchar(max) NOT NULL,
    [CreatedAtUtc] datetime2 NOT NULL,
    [UpdatedAtUtc] datetime2 NULL,
    [DeletedAtUtc] datetime2 NULL,
    [IsDeleted] bit NOT NULL,
    [TenantId] uniqueidentifier NOT NULL,
    [SchoolId] uniqueidentifier NOT NULL,
    CONSTRAINT [PK_HealthProfiles] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [HealthScreenings] (
    [Id] uniqueidentifier NOT NULL,
    [HealthProfileId] uniqueidentifier NOT NULL,
    [ScreeningDateUtc] datetime2 NOT NULL,
    [HeightCm] decimal(18,2) NULL,
    [WeightKg] decimal(18,2) NULL,
    [BloodPressure] nvarchar(max) NOT NULL,
    [Notes] nvarchar(max) NOT NULL,
    [ScreenedByStaffId] uniqueidentifier NOT NULL,
    [CreatedAtUtc] datetime2 NOT NULL,
    [UpdatedAtUtc] datetime2 NULL,
    [DeletedAtUtc] datetime2 NULL,
    [IsDeleted] bit NOT NULL,
    [TenantId] uniqueidentifier NOT NULL,
    [SchoolId] uniqueidentifier NOT NULL,
    CONSTRAINT [PK_HealthScreenings] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [HostelAllocations] (
    [Id] uniqueidentifier NOT NULL,
    [StudentId] uniqueidentifier NOT NULL,
    [HostelBedId] uniqueidentifier NOT NULL,
    [AcademicYearId] uniqueidentifier NOT NULL,
    [TermId] uniqueidentifier NOT NULL,
    [StartDate] datetime2 NOT NULL,
    [EndDate] datetime2 NULL,
    [IsCurrent] bit NOT NULL,
    [Status] nvarchar(max) NOT NULL,
    [CreatedAtUtc] datetime2 NOT NULL,
    [UpdatedAtUtc] datetime2 NULL,
    [DeletedAtUtc] datetime2 NULL,
    [IsDeleted] bit NOT NULL,
    [TenantId] uniqueidentifier NOT NULL,
    [SchoolId] uniqueidentifier NOT NULL,
    CONSTRAINT [PK_HostelAllocations] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [HostelBeds] (
    [Id] uniqueidentifier NOT NULL,
    [HostelRoomId] uniqueidentifier NOT NULL,
    [BedCode] nvarchar(450) NOT NULL,
    [Status] nvarchar(max) NOT NULL,
    [CreatedAtUtc] datetime2 NOT NULL,
    [UpdatedAtUtc] datetime2 NULL,
    [DeletedAtUtc] datetime2 NULL,
    [IsDeleted] bit NOT NULL,
    [TenantId] uniqueidentifier NOT NULL,
    [SchoolId] uniqueidentifier NOT NULL,
    CONSTRAINT [PK_HostelBeds] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [HostelIncidents] (
    [Id] uniqueidentifier NOT NULL,
    [HostelId] uniqueidentifier NOT NULL,
    [StudentId] uniqueidentifier NOT NULL,
    [ReportedByStaffId] uniqueidentifier NOT NULL,
    [OccurredAtUtc] datetime2 NOT NULL,
    [Category] nvarchar(max) NOT NULL,
    [Notes] nvarchar(max) NOT NULL,
    [CreatedAtUtc] datetime2 NOT NULL,
    [UpdatedAtUtc] datetime2 NULL,
    [DeletedAtUtc] datetime2 NULL,
    [IsDeleted] bit NOT NULL,
    [TenantId] uniqueidentifier NOT NULL,
    [SchoolId] uniqueidentifier NOT NULL,
    CONSTRAINT [PK_HostelIncidents] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [HostelRooms] (
    [Id] uniqueidentifier NOT NULL,
    [HostelId] uniqueidentifier NOT NULL,
    [Name] nvarchar(450) NOT NULL,
    [Capacity] int NOT NULL,
    [FloorName] nvarchar(max) NOT NULL,
    [CreatedAtUtc] datetime2 NOT NULL,
    [UpdatedAtUtc] datetime2 NULL,
    [DeletedAtUtc] datetime2 NULL,
    [IsDeleted] bit NOT NULL,
    [TenantId] uniqueidentifier NOT NULL,
    [SchoolId] uniqueidentifier NOT NULL,
    CONSTRAINT [PK_HostelRooms] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [Hostels] (
    [Id] uniqueidentifier NOT NULL,
    [Name] nvarchar(450) NOT NULL,
    [GenderPolicy] nvarchar(max) NOT NULL,
    [Capacity] int NOT NULL,
    [MatronStaffId] uniqueidentifier NULL,
    [IsActive] bit NOT NULL,
    [CreatedAtUtc] datetime2 NOT NULL,
    [UpdatedAtUtc] datetime2 NULL,
    [DeletedAtUtc] datetime2 NULL,
    [IsDeleted] bit NOT NULL,
    [TenantId] uniqueidentifier NOT NULL,
    [SchoolId] uniqueidentifier NOT NULL,
    CONSTRAINT [PK_Hostels] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [ImmunizationRecords] (
    [Id] uniqueidentifier NOT NULL,
    [HealthProfileId] uniqueidentifier NOT NULL,
    [VaccineName] nvarchar(450) NOT NULL,
    [DoseNumber] int NOT NULL,
    [DateGivenUtc] datetime2 NOT NULL,
    [NextDueDateUtc] datetime2 NULL,
    [Notes] nvarchar(max) NOT NULL,
    [CreatedAtUtc] datetime2 NOT NULL,
    [UpdatedAtUtc] datetime2 NULL,
    [DeletedAtUtc] datetime2 NULL,
    [IsDeleted] bit NOT NULL,
    [TenantId] uniqueidentifier NOT NULL,
    [SchoolId] uniqueidentifier NOT NULL,
    CONSTRAINT [PK_ImmunizationRecords] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [MedicationDispenses] (
    [Id] uniqueidentifier NOT NULL,
    [ClinicVisitId] uniqueidentifier NOT NULL,
    [ClinicMedicationId] uniqueidentifier NOT NULL,
    [Quantity] decimal(18,2) NOT NULL,
    [Instructions] nvarchar(max) NOT NULL,
    [DispensedByStaffId] uniqueidentifier NOT NULL,
    [CreatedAtUtc] datetime2 NOT NULL,
    [UpdatedAtUtc] datetime2 NULL,
    [DeletedAtUtc] datetime2 NULL,
    [IsDeleted] bit NOT NULL,
    [TenantId] uniqueidentifier NOT NULL,
    [SchoolId] uniqueidentifier NOT NULL,
    CONSTRAINT [PK_MedicationDispenses] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [SchoolEvents] (
    [Id] uniqueidentifier NOT NULL,
    [AcademicYearId] uniqueidentifier NULL,
    [TermId] uniqueidentifier NULL,
    [Title] nvarchar(450) NOT NULL,
    [Description] nvarchar(max) NOT NULL,
    [EventDateUtc] datetime2 NOT NULL,
    [Venue] nvarchar(max) NOT NULL,
    [OrganizerStaffId] uniqueidentifier NULL,
    [Status] nvarchar(max) NOT NULL,
    [CreatedAtUtc] datetime2 NOT NULL,
    [UpdatedAtUtc] datetime2 NULL,
    [DeletedAtUtc] datetime2 NULL,
    [IsDeleted] bit NOT NULL,
    [TenantId] uniqueidentifier NOT NULL,
    [SchoolId] uniqueidentifier NOT NULL,
    CONSTRAINT [PK_SchoolEvents] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [TransportRoutes] (
    [Id] uniqueidentifier NOT NULL,
    [RouteCode] nvarchar(450) NOT NULL,
    [Name] nvarchar(max) NOT NULL,
    [StartLocation] nvarchar(max) NOT NULL,
    [EndLocation] nvarchar(max) NOT NULL,
    [IsActive] bit NOT NULL,
    [CreatedAtUtc] datetime2 NOT NULL,
    [UpdatedAtUtc] datetime2 NULL,
    [DeletedAtUtc] datetime2 NULL,
    [IsDeleted] bit NOT NULL,
    [TenantId] uniqueidentifier NOT NULL,
    [SchoolId] uniqueidentifier NOT NULL,
    CONSTRAINT [PK_TransportRoutes] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [TransportRouteStops] (
    [Id] uniqueidentifier NOT NULL,
    [TransportRouteId] uniqueidentifier NOT NULL,
    [StopName] nvarchar(max) NOT NULL,
    [StopOrder] int NOT NULL,
    [PlannedTime] time NOT NULL,
    [CreatedAtUtc] datetime2 NOT NULL,
    [UpdatedAtUtc] datetime2 NULL,
    [DeletedAtUtc] datetime2 NULL,
    [IsDeleted] bit NOT NULL,
    [TenantId] uniqueidentifier NOT NULL,
    [SchoolId] uniqueidentifier NOT NULL,
    CONSTRAINT [PK_TransportRouteStops] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [TransportStudentAssignments] (
    [Id] uniqueidentifier NOT NULL,
    [StudentId] uniqueidentifier NOT NULL,
    [TransportRouteId] uniqueidentifier NOT NULL,
    [PickupStopId] uniqueidentifier NULL,
    [DropoffStopId] uniqueidentifier NULL,
    [EffectiveFrom] datetime2 NOT NULL,
    [EffectiveTo] datetime2 NULL,
    [Status] nvarchar(450) NOT NULL,
    [CreatedAtUtc] datetime2 NOT NULL,
    [UpdatedAtUtc] datetime2 NULL,
    [DeletedAtUtc] datetime2 NULL,
    [IsDeleted] bit NOT NULL,
    [TenantId] uniqueidentifier NOT NULL,
    [SchoolId] uniqueidentifier NOT NULL,
    CONSTRAINT [PK_TransportStudentAssignments] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [TransportTrips] (
    [Id] uniqueidentifier NOT NULL,
    [TransportVehicleId] uniqueidentifier NOT NULL,
    [TransportRouteId] uniqueidentifier NOT NULL,
    [DriverStaffId] uniqueidentifier NOT NULL,
    [TripDate] date NOT NULL,
    [Direction] nvarchar(450) NOT NULL,
    [DepartureAtUtc] datetime2 NULL,
    [ArrivalAtUtc] datetime2 NULL,
    [Status] nvarchar(max) NOT NULL,
    [CreatedAtUtc] datetime2 NOT NULL,
    [UpdatedAtUtc] datetime2 NULL,
    [DeletedAtUtc] datetime2 NULL,
    [IsDeleted] bit NOT NULL,
    [TenantId] uniqueidentifier NOT NULL,
    [SchoolId] uniqueidentifier NOT NULL,
    CONSTRAINT [PK_TransportTrips] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [TransportVehicles] (
    [Id] uniqueidentifier NOT NULL,
    [RegistrationNumber] nvarchar(450) NOT NULL,
    [Name] nvarchar(max) NOT NULL,
    [Capacity] int NOT NULL,
    [DriverStaffId] uniqueidentifier NOT NULL,
    [IsActive] bit NOT NULL,
    [CreatedAtUtc] datetime2 NOT NULL,
    [UpdatedAtUtc] datetime2 NULL,
    [DeletedAtUtc] datetime2 NULL,
    [IsDeleted] bit NOT NULL,
    [TenantId] uniqueidentifier NOT NULL,
    [SchoolId] uniqueidentifier NOT NULL,
    CONSTRAINT [PK_TransportVehicles] PRIMARY KEY ([Id])
);
GO

CREATE UNIQUE INDEX [IX_ClinicMedications_TenantId_SchoolId_Name] ON [ClinicMedications] ([TenantId], [SchoolId], [Name]);
GO

CREATE INDEX [IX_ClinicVisits_TenantId_SchoolId_VisitDateUtc_PatientType] ON [ClinicVisits] ([TenantId], [SchoolId], [VisitDateUtc], [PatientType]);
GO

CREATE UNIQUE INDEX [IX_EventParticipants_TenantId_SchoolId_SchoolEventId_StudentId_StaffId_GuardianId] ON [EventParticipants] ([TenantId], [SchoolId], [SchoolEventId], [StudentId], [StaffId], [GuardianId]) WHERE [StudentId] IS NOT NULL AND [StaffId] IS NOT NULL AND [GuardianId] IS NOT NULL;
GO

CREATE UNIQUE INDEX [IX_HealthProfiles_TenantId_SchoolId_StudentId_StaffId] ON [HealthProfiles] ([TenantId], [SchoolId], [StudentId], [StaffId]) WHERE [StudentId] IS NOT NULL AND [StaffId] IS NOT NULL;
GO

CREATE INDEX [IX_HealthScreenings_TenantId_SchoolId_HealthProfileId_ScreeningDateUtc] ON [HealthScreenings] ([TenantId], [SchoolId], [HealthProfileId], [ScreeningDateUtc]);
GO

CREATE UNIQUE INDEX [IX_HostelAllocations_TenantId_SchoolId_StudentId_IsCurrent] ON [HostelAllocations] ([TenantId], [SchoolId], [StudentId], [IsCurrent]) WHERE [IsCurrent] = 1;
GO

CREATE UNIQUE INDEX [IX_HostelBeds_TenantId_SchoolId_HostelRoomId_BedCode] ON [HostelBeds] ([TenantId], [SchoolId], [HostelRoomId], [BedCode]);
GO

CREATE INDEX [IX_HostelIncidents_TenantId_SchoolId_HostelId_OccurredAtUtc] ON [HostelIncidents] ([TenantId], [SchoolId], [HostelId], [OccurredAtUtc]);
GO

CREATE UNIQUE INDEX [IX_HostelRooms_TenantId_SchoolId_HostelId_Name] ON [HostelRooms] ([TenantId], [SchoolId], [HostelId], [Name]);
GO

CREATE UNIQUE INDEX [IX_Hostels_TenantId_SchoolId_Name] ON [Hostels] ([TenantId], [SchoolId], [Name]);
GO

CREATE UNIQUE INDEX [IX_ImmunizationRecords_TenantId_SchoolId_HealthProfileId_VaccineName_DoseNumber] ON [ImmunizationRecords] ([TenantId], [SchoolId], [HealthProfileId], [VaccineName], [DoseNumber]);
GO

CREATE INDEX [IX_MedicationDispenses_TenantId_SchoolId_ClinicVisitId_ClinicMedicationId_CreatedAtUtc] ON [MedicationDispenses] ([TenantId], [SchoolId], [ClinicVisitId], [ClinicMedicationId], [CreatedAtUtc]);
GO

CREATE INDEX [IX_SchoolEvents_TenantId_SchoolId_EventDateUtc_Title] ON [SchoolEvents] ([TenantId], [SchoolId], [EventDateUtc], [Title]);
GO

CREATE UNIQUE INDEX [IX_TransportRoutes_TenantId_SchoolId_RouteCode] ON [TransportRoutes] ([TenantId], [SchoolId], [RouteCode]);
GO

CREATE UNIQUE INDEX [IX_TransportRouteStops_TenantId_SchoolId_TransportRouteId_StopOrder] ON [TransportRouteStops] ([TenantId], [SchoolId], [TransportRouteId], [StopOrder]);
GO

CREATE INDEX [IX_TransportStudentAssignments_TenantId_SchoolId_StudentId_TransportRouteId_Status] ON [TransportStudentAssignments] ([TenantId], [SchoolId], [StudentId], [TransportRouteId], [Status]);
GO

CREATE INDEX [IX_TransportTrips_TenantId_SchoolId_TransportVehicleId_TripDate_Direction] ON [TransportTrips] ([TenantId], [SchoolId], [TransportVehicleId], [TripDate], [Direction]);
GO

CREATE UNIQUE INDEX [IX_TransportVehicles_TenantId_SchoolId_RegistrationNumber] ON [TransportVehicles] ([TenantId], [SchoolId], [RegistrationNumber]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260502185604_20260502_Phase6_EventsTransportHostelHealthClinic', N'8.0.6');
GO

COMMIT;
GO

