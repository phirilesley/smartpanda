# 🏫 Smart Panda School Management System (SaaS)

## 📌 Overview

Smart Panda is a multi-tenant school management system designed for organizations managing one or multiple schools.

It supports full academic lifecycle management based on the Zimbabwe 3-term academic model.

---

## 🎯 Purpose

To provide a scalable SaaS platform for managing:

* Students
* Academics
* Fees
* Exams & Results
* Attendance
* Staff & HR
* Library
* POS & Operations

---

## 🧠 Core Design Principle

The system is built around an **Academic Lifecycle Engine**:

* Students do NOT store a fixed grade
* Academic placement is tracked using **StudentEnrollments**
* Promotions are handled through **StudentPromotions**
* Historical data is never overwritten

---

## 🏗️ Academic Structure

* AcademicYear → Term → Grade → Stream → StudentEnrollment

### Key Rules:

* 3 Terms per year
* Student remains in same grade within a year
* Promotion occurs after Term 3
* Full academic history is preserved

---

## 🚀 Features

### Academics

* Academic Years & Terms
* Grades & Streams
* Subjects & Courses

### Students

* Registration
* Enrollment
* Transfers
* Promotions

### Exams & Results

* Exam Sessions
* Mark Entry
* Report Cards
* Result Analysis

### Finance

* Fee Structures
* Invoices
* Payments
* Receipts
* Arrears Tracking

### Operations

* Attendance
* Library
* POS
* Assets
* Visitor Management

### Portals

* Parent Portal
* Student Portal
* Teacher Portal
* Admin Dashboard

---

## 🛠️ Tech Stack

* ASP.NET Core Web API
* Entity Framework Core
* SQL Server
* React + TypeScript
* SignalR (real-time features)
* Hangfire (background jobs)
* ClosedXML (Excel)
* QuestPDF (PDF reports)

---

## 📂 Architecture

* Modular Monolith
* Clean Architecture
* Multi-Tenant Ready

Modules:

* Students
* Academics
* Finance
* Exams
* Attendance
* HR
* Library
* POS

---

## 📌 Key Models

* Student
* StudentEnrollment
* StudentPromotion
* AcademicYear
* Term
* ExamSession
* StudentMarks
* StudentInvoice
* Payment

---

## 🔥 Why This Project Matters

This system demonstrates:

* SaaS architecture
* Academic lifecycle modeling
* Financial system integration
* Enterprise-level data design

---

## 🚀 Future Enhancements

* Mobile App
* AI Assistant
* Advanced Analytics
* External Integrations

---

## 👨‍💻 Author

Built as an enterprise-grade SaaS platform.
