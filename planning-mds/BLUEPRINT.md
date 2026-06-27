# Blueprint: Apartment Management System

## 0) How we will work (Process + Roles)

This blueprint document serves as the master specification and single source of truth for the Apartment Management System. Development progresses in three distinct phases:
- **Phase A (Product)**: Owned by the Product Manager. Defines context, requirements, user stories, and acceptance criteria.
- **Phase B (Architecture)**: Owned by the Architect. Translates stories into solution design, API contracts, entity models, and feature assembly plans.
- **Phase C (Implementation)**: Executed by Backend Developers, Frontend Developers, AI Engineers, Quality Engineers, and DevOps.

## 1) Product Context

### 1.1 What we’re building

- **Name**: Apartment Management System
- **Domain**: Property Management SaaS Portal
- **Description**: A property management SaaS portal for managing apartment rentals, tenant communications, rent invoicing, and maintenance ticket tracking.

### 1.2 Target users

- **Tenant**: Residents leasing apartments who submit tickets, view invoices, and make payments.
- **Property Manager**: Staff overseeing operations, leasing apartments, reviewing invoices, and assigning tickets.
- **Maintenance Staff**: Staff resolving maintenance tickets.
- **System Administrator**: Admins managing system settings, users, and integrations.

### 1.3 Core entities (baseline)

- **Apartment**: A physical unit in a building.
- **Tenant**: A resident renting a unit.
- **RentInvoice**: Monthly bill generated for rent.
- **MaintenanceTicket**: Issue or repair request submitted by a tenant.
- **Payment**: Transaction resolving a RentInvoice.

## 2) Technology and Platform (baseline decisions)

The baseline technology stack consists of:
- **Backend Framework**: .NET (C#)
- **Frontend Framework**: React / Next.js
- **Database**: PostgreSQL
- **ORM**: Entity Framework Core (EF Core)
- **Authentication**: OIDC/JWT via Keycloak
- **Authorization**: Casbin ABAC
- **Workflow Orchestration**: Temporal.io

---

## 3) Product Manager Spec (TODO)

*To be populated in Phase A.*
- Vision & Non-Goals
- Personas
- Epic & Feature breakdown
- User Stories & Acceptance Criteria
- Screens & Workflows

---

## 4) Architect Spec (TODO)

*To be populated in Phase B.*
- Service boundaries & C4 C2/C3 diagrams
- Data model & ERD
- API contracts (OpenAPI)
- Authorization rules (Casbin)
- Feature Assembly Plans

---

## 5) Security & Non-Functional Requirements (TODO)

*To be populated in Phase B.*
- Threat model
- Data privacy & PII rules
- Compliance & Performance bounds

---

## 6) Operations & Deployment (TODO)

*To be populated in Phase B/C.*
- Docker & docker-compose configurations
- CI/CD deployment pipelines
- Backup & Disaster Recovery procedures
