---
template: user-story
version: 1.2
applies_to: product-manager
---

# User Story: Backend OIDC and JWT Integration

## Story Header

**Story ID:** F0001-S0002
**Feature:** F0001 — Keycloak SSO Integration
**Title:** Backend OIDC and JWT Integration
**Priority:** High
**Phase:** MVP

## User Story

**As a** Backend Developer
**I want** the .NET backend API to authenticate requests using JWT Bearer tokens issued by Keycloak
**So that** secure endpoints are protected and user identities are correctly verified.

## Context & Background

The backend needs to validate the JWT bearer token attached to incoming HTTP headers. This validation checks signature, expiry, and issuer from the Keycloak discovery endpoint.

## Acceptance Criteria

**Happy Path:**
- **Given** an HTTP request to a protected API endpoint (e.g. `/api/apartments`) contains a valid JWT token signed by Keycloak
- **When** the backend API processes the request
- **Then** it allows access and maps the token claims to the current security context.

**Alternative Flows / Edge Cases:**
- **Given** an HTTP request contains an expired or invalid token
- **When** the backend API processes the request
- **Then** it rejects the request with a `401 Unauthorized` status code.

## Interaction Contract

Complete this section for API security middleware integration.

| Surface / Entry Point | User Action | Editable State | Save / Mutation Result | Reload / Persistence Evidence | Roles / Status Constraints |
|-----------------------|-------------|----------------|-------------------------|-------------------------------|----------------------------|
| `/api/*` protected endpoints | API Request with Header `Authorization: Bearer <token>` | N/A | Authenticates request context | Claim principles populated in controller `User` object | Allowed roles defined by token scopes/roles |

## Data Requirements

**Required Fields (JWT Claims mapping):**
- `sub`: Tenant/Manager unique user ID
- `preferred_username`: Username or Email
- `realm_access.roles`: User roles assigned in Keycloak (e.g., tenant, manager)

**Validation Rules:**
- JWT issuer (`iss`) must match Keycloak's configured realm authority URL.
- Audience (`aud`) must match backend client configurations.

## Role-Based Visibility

**Protected routes:**
- Only authenticated requests containing roles mapped to target resources are processed.

## Non-Functional Expectations

- **Performance:** Token validation must be performed in-memory using JWKS cache to keep latency under 5ms.
- **Security:** Support verification of standard cryptographic signatures (RS256).

## Dependencies

**Depends On:**
- F0001-S0001 — Setup Keycloak Identity Provider Service

**Related Stories:**
- F0001-S0003 — Frontend SSO Sign-In Integration

## Out of Scope

- Integrating Casbin ABAC rules (this story only validates authentication, not detailed ABAC authorization).

## Questions & Assumptions

**Open Questions:**
- None.

**Assumptions (to be validated):**
- Standard .NET JwtBearer authentication middleware is compatible with the version of Keycloak configured.

## Definition of Done

- [x] Acceptance criteria met
- [x] Edge cases handled
- [x] Permissions enforced (valid token validated)
- [x] Audit/timeline logged (N/A)
- [x] Tests pass (add unit tests asserting token parsing and middleware behavior)
- [x] Documentation updated (document backend configuration variables for OIDC)
- [x] Story filename matches `Story ID` prefix (`F0001-S0002-backend-auth-integration.md`)
- [x] Story index regenerated
