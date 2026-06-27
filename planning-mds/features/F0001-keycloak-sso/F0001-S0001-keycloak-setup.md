---
template: user-story
version: 1.2
applies_to: product-manager
---

# User Story: Setup Keycloak Identity Provider Service

## Story Header

**Story ID:** F0001-S0001
**Feature:** F0001 — Keycloak SSO Integration
**Title:** Setup Keycloak Identity Provider Service
**Priority:** High
**Phase:** Infrastructure

## User Story

**As a** DevOps Engineer
**I want** a containerized Keycloak service configured with PostgreSQL in docker-compose
**So that** the application has a local identity provider running for SSO authentication.

## Context & Background

To support single sign-on (SSO) login for Tenants and Property Managers, the system needs an identity provider. We are using Keycloak containerized inside docker-compose. This story tracks the deployment, PostgreSQL integration, and baseline realm configuration.

## Acceptance Criteria

**Happy Path:**
- **Given** the docker-compose stack is initialized
- **When** Keycloak service launches
- **Then** it successfully connects to PostgreSQL and exposes the admin portal on `http://localhost:8080`.

**Edge Cases:**
- **Given** Keycloak starts before the database is ready
- **When** DB connection attempts fail
- **Then** Keycloak should retry connection and boot once PostgreSQL is healthy.

## Interaction Contract

N/A — Infrastructure setup story. No direct application UI interactions.

## Data Requirements

**Required Fields (Configuration):**
- `KEYCLOAK_ADMIN`: Admin username
- `KEYCLOAK_ADMIN_PASSWORD`: Admin password
- `KC_DB_URL`: JDBC database URL for PostgreSQL
- `KC_DB_USERNAME`: Postgres username
- `KC_DB_PASSWORD`: Postgres password

**Validation Rules:**
- Database must be a separate service. Keycloak credentials must be read from environment variables, not hardcoded.

## Role-Based Visibility

**Allowed executions:**
- DevOps / System Administrator can manage the Docker containers and configuration.

## Non-Functional Expectations

- **Security:** Admin password must not be checked into repository in plain text (must use environment/secrets placeholder).
- **Performance:** Keycloak startup time under 30 seconds.

## Dependencies

**Depends On:** None

**Related Stories:**
- F0001-S0002 — Backend OIDC and JWT Integration

## Out of Scope

- Integrating other external social identity providers (Google, GitHub etc.).
- Designing Keycloak custom login theme.

## Questions & Assumptions

**Open Questions:**
- None.

**Assumptions (to be validated):**
- Keycloak will run successfully under Docker on local machines.

## Definition of Done

- [x] Acceptance criteria met
- [x] Edge cases handled
- [x] Permissions enforced (N/A — infrastructure setup)
- [x] Audit/timeline logged (N/A — infrastructure setup)
- [x] Tests pass (verify Keycloak containers log shows successful boot)
- [x] Documentation updated (update README with Keycloak local run steps)
- [x] Story filename matches `Story ID` prefix (`F0001-S0001-keycloak-setup.md`)
- [x] Story index regenerated
