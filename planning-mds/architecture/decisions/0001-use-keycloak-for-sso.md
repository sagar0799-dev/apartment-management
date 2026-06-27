---
template: adr
version: 1.1
applies_to: architect
---

# Architecture Decision Record (ADR): Use Keycloak for Single Sign-On

## Status

- [ ] Proposed
- [x] Accepted
- [ ] Superseded
- [ ] Rejected

## Context

The Apartment Management System requires single sign-on (SSO) authentication for Tenant and Property Manager portals. The initial baseline proposed Authentik as the OIDC provider. However, the development team has identified a need for an Identity and Access Management (IAM) platform with wider native library support in both React/Next.js and .NET (C#) stacks to accelerate setup and ensure robustness.

## Decision Drivers

- Core authentication compatibility with Next.js/React and .NET 10.
- Ease of containerization and configuration within local developer Docker environments.
- Native standard OIDC and PKCE flow implementation.
- Availability of mature security review guides and templates in the workspace framework.

## Decision

We will use **Keycloak** (version `23.0` or later) as the central Identity and Access Management (IAM) provider. All authentication (login, session management, token issuance) will be delegated to Keycloak using standard OIDC Authorization Code Flow with PKCE.

## Options Considered

1. **Authentik:** An open-source IDP with rich features, but less direct OIDC library support in .NET compared to Keycloak.
2. **Keycloak:** An enterprise-grade, open-source IAM tool backed by Red Hat, widely integrated with .NET standard JWT bearer authentication and frontend Next-Auth/OIDC libraries.
3. **Okta / Auth0:** Commercial SaaS options. Rejected due to the requirement for a fully local, self-hosted developer stack.

## Pros / Cons

### Option 1 (Authentik)
- ✅ Strong resource mapping and user administration.
- ❌ Slightly higher integration friction with native .NET OIDC middleware without custom configuration.

### Option 2 (Keycloak)
- ✅ Standard OIDC integration supported out-of-the-box by standard .NET `JwtBearer` middleware.
- ✅ Extensive documentation, pre-configured templates, and docker images.
- ✅ Simple configuration of clients, roles, and realms via local import/export files.
- ❌ Slightly higher resource consumption (Java/Wildfly/Quarkus-based container) compared to lightweight IDPs.

## Consequences

- **Impact on development:** Developer stack needs a running Keycloak service. Seed configurations (realms, client IDs) must be persisted in version control.
- **Impact on operations:** Keycloak will run as a docker service in the local/dev environment and requires a dedicated PostgreSQL database schema.
- **Risks and mitigations:** Keycloak service downtime blocks user sign-in. Mitigated in production by running Keycloak in high-availability mode with a shared database.

## Security & Compliance Notes (If Applicable)

- All user password policies and MFA requirements will be configured and enforced directly at the Keycloak level.
- No plain-text passwords or secret keys will be stored or handled by the backend database or frontend client.
- Access tokens will be short-lived JWTs (15 minutes), with secure HttpOnly cookies or session-based storage for token storage in the client.

## References

- [BLUEPRINT.md](file:///c:/Users/Sagar vyavhare/Project/Nebula/apartment-management/planning-mds/BLUEPRINT.md)
- [SOLUTION-PATTERNS.md](file:///c:/Users/Sagar vyavhare/Project/Nebula/apartment-management/planning-mds/architecture/SOLUTION-PATTERNS.md)

## Follow-up Actions

- [x] Update baseline tech stack in BLUEPRINT.md.
- [ ] Create F0001 Keycloak SSO feature assembly plan.
- [ ] Create Docker compose and configuration files.
