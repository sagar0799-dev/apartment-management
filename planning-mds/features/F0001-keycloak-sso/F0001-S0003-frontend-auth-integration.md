---
template: user-story
version: 1.2
applies_to: product-manager
---

# User Story: Frontend SSO Sign-In Integration

## Story Header

**Story ID:** F0001-S0003
**Feature:** F0001 — Keycloak SSO Integration
**Title:** Frontend SSO Sign-In Integration
**Priority:** High
**Phase:** MVP

## User Story

**As a** Tenant or Property Manager
**I want** to click "Login" and be redirected to Keycloak's secure sign-in page
**So that** I can authenticate and return to the application with an active session.

## Context & Background

The frontend needs to implement standard OIDC Authorization Code Flow with PKCE. Clicking "Sign In" directs the browser to Keycloak, and returning users are processed by a callback route that exchanges the code for tokens.

## Acceptance Criteria

**Happy Path:**
- **Given** an unauthenticated user visits the portal
- **When** they click the "Login" button
- **Then** they are redirected to the Keycloak login screen.
- **Given** the user enters valid credentials on the Keycloak screen
- **When** Keycloak redirects them back to the portal callback route
- **Then** the application retrieves the tokens, establishes an active session, and redirects to the dashboard.

**Alternative Flows / Edge Cases:**
- **Given** the user cancels the login at the Keycloak screen
- **When** they return to the application callback
- **Then** they are shown an error message and given the option to try logging in again.

## Interaction Contract

Complete this section for login redirect and callback behavior.

| Surface / Entry Point | User Action | Editable State | Save / Mutation Result | Reload / Persistence Evidence | Roles / Status Constraints |
|-----------------------|-------------|----------------|-------------------------|-------------------------------|----------------------------|
| Landing Page `/login` | Click "Login" button | Enabled | Redirects to Keycloak SSO login page | N/A | Guest / Any role |
| Callback route `/auth/callback` | Auto-triggered redirect from Keycloak | N/A | Authenticates session and stores token | Redirects to `/dashboard` with valid access token | Returns to landing page `/login` if auth fails |

## Data Requirements

**Required Fields:**
- `access_token`: Bearer access token
- `refresh_token`: OIDC session refresh token
- `id_token`: User identity details (name, email)

**Validation Rules:**
- Keycloak parameters (client_id, authority url) must be loaded from environment variables.

## Role-Based Visibility

- Anyone can access the login button.
- Protected views (e.g. `/dashboard`, `/tickets`) are only visible to users with an active authenticated session.

## Non-Functional Expectations

- **Performance:** Callback processing and redirect to dashboard should take under 1 second.
- **Security:** Use OIDC Authorization Code Flow with PKCE (Proof Key for Code Exchange). Prevent storing tokens in localStorage if vulnerable to XSS; prefer HTTP-only secure cookie or in-memory React context.

## Dependencies

**Depends On:**
- F0001-S0001 — Setup Keycloak Identity Provider Service
- F0001-S0002 — Backend OIDC and JWT Integration

**Related Stories:** None

## Out of Scope

- User profile edit view on Keycloak (delegated to standard Keycloak account manager console).

## Questions & Assumptions

**Open Questions:**
- None.

**Assumptions (to be validated):**
- Frontend application runs on `localhost:3000` or standard Next.js port and callback URL is registered in Keycloak client redirect URIs list.

## Definition of Done

- [x] Acceptance criteria met
- [x] Edge cases handled
- [x] Permissions enforced (redirect only for guests, routes protected)
- [x] Audit/timeline logged (N/A)
- [x] Tests pass (verify route guards and callback hook logic with mock OIDC provider)
- [x] Documentation updated (update README with environment variables needed for UI)
- [x] Story filename matches `Story ID` prefix (`F0001-S0003-frontend-auth-integration.md`)
- [x] Story index regenerated
