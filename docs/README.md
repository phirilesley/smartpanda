# Smart Panda School Enterprise Template

This repository is scaffolded for a multi-tenant Zimbabwe school SaaS using:
- ASP.NET Core 8 Web API
- EF Core 8 + SQL Server
- Clean Architecture style layering
- Modular monolith domain organization

## Solution Layout
- backend/src/SmartSchool.API
- backend/src/SmartSchool.Application
- backend/src/SmartSchool.Domain
- backend/src/SmartSchool.Persistence
- backend/src/SmartSchool.Infrastructure

## Domain Template Scope
All enterprise modules are represented with starter models under:
- backend/src/SmartSchool.Domain/Modules

## Academic Rule
Student academic placement is tracked in `StudentEnrollment`, not directly on `Student`.
