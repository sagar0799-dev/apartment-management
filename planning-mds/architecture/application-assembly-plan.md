# Application Assembly Plan

## Scope
- **Project:** Apartment Management System
- **Date:** 2026-06-27
- **Owner:** Architect Agent

## Story Slices

| Slice | Stories | Owner Agents | Dependencies | Status |
|-------|---------|--------------|--------------|--------|
| Slice-1: Auth Foundation (Keycloak) | F0001-S0001, F0001-S0002, F0001-S0003 | DevOps, Backend Developer, Frontend Developer | None | In Progress |

## Integration Checkpoints

| Checkpoint | Required Inputs | Validation | Owner |
|------------|-----------------|-----------|-------|
| API Contract Match | OpenAPI specification matching backend controllers | Verify `/api/apartments` requires authorization header | Backend Developer |
| UI/API Integration | Next.js callback exchanging code for token | Login redirects to Keycloak, completes flow, returns to Dashboard | Frontend Developer |
| Test Readiness | Mock JWT token utility for tests | xUnit test suite executes with mock token injection passing | Quality Engineer |
| Runtime/Deploy Readiness | Docker compose configurations with PostgreSQL DB and Keycloak service | `docker compose up` starts DB and Keycloak cleanly | DevOps |

## Risks and Blockers

| Item | Severity | Mitigation | Owner |
|------|----------|------------|-------|
| Keycloak container boot delay | Low | Add healthcheck parameters in compose file | DevOps |
| OIDC library compatibility | Medium | Utilize standard .NET JwtBearer authentication and next-auth libraries | Architect |

## Definition of Done
- [x] Every planned story mapped to a slice
- [x] Every slice has explicit owners
- [x] All dependencies are documented
- [x] Integration checkpoints are measurable
- [x] Build/test/run path is documented
