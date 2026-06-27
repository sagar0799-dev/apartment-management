# SOLUTION-PATTERNS.md

> **Examples in this guide use `customers` and `orders` as illustrative entities.
> These are not prescriptive — substitute your own domain entities when applying
> these patterns. See `BOUNDARY-POLICY.md` -> "Standard Example Entities" for
> the full convention and field mapping.**

This file captures project-level implementation conventions all agents must follow.

## Metadata

- Project: Apartment Management System
- Version: 1.0.0
- Last Updated: 2026-06-27
- Owners: Architecture Team
- Scope: Backend, Frontend, and Security conventions

## Pattern Categories

- `MUST` - mandatory convention for this solution
- `SHOULD` - recommended convention unless a documented exception exists
- `MAY` - optional convention based on feature needs

## Pattern Scope Labels

Use one scope label for each pattern to make portability explicit:

- `Universal` - technology-agnostic rule expected in any stack
- `Stack-Specific` - tied to a concrete framework/tool choice
- `Hybrid` - universal policy with stack-specific implementation details

---

## 1. Authorization Pattern

### Scope
- Label: `Hybrid`
- Stack context: Casbin with ABAC (Attribute-Based Access Control) for backend, custom middleware for frontend.

### Decision
- Policy model: ABAC check on resource attributes.
- Enforcement point: API gateway and backend middleware controllers.

### Rationale
- Fine-grained access control is needed to segregate landlord/tenant/manager roles.

### Applied In
- Backend: Casbin policy files and middleware checks.
- Frontend: Route guards.
- AI layer: Token and contextual scopes.

### Enforcement Level
- `MUST`

---

## 2. Audit and Timeline Pattern

### Scope
- Label: `Universal`
- Stack context: Entity framework state tracking.

### Decision
- What gets logged: Any state mutations (create, update, delete) in domain models.
- Event immutability policy: All events are strictly append-only.

### Rationale
- Transparency for rent billing, lease signups, and maintenance ticket history.

### Applied In
- Data model: ActivityTimeline table.
- Workflow engine: Temporal saga state transitions.

### Enforcement Level
- `MUST`

---

## 3. API Design Pattern

### Scope
- Label: `Universal`
- Stack context: JSON REST API endpoints.

### Decision
- API style: RESTful API.
- Error format: RFC 7807 Problem Details.
- Pagination approach: Cursor pagination for timelines, offset pagination for listings.

### Rationale
- Consistent error formatting simplifies frontend integration.

### Applied In
- API contracts: OpenAPI YAML specs under planning-mds/api/.
- Service endpoints: Minimal APIs.

### Enforcement Level
- `MUST`

---

## 4. Clean Architecture Pattern

### Scope
- Label: `Universal`
- Stack context: Domain -> Application -> Infrastructure -> API.

### Decision
- Layer boundaries: No references from Domain to Infrastructure.
- Dependency direction: All dependencies point inward.

### Rationale
- Decouples domain rules from data storage, simplifying unit testing.

### Applied In
- `{PRODUCT_ROOT}/engine/`: Project directory boundaries.
- `{PRODUCT_ROOT}/experience/`: Feature-sliced layout.

### Enforcement Level
- `MUST`

---

## 5. Frontend Pattern

### Scope
- Label: `Stack-Specific`
- Stack context: React/Next.js.

### Decision
- Form strategy: React Hook Form.
- Data-fetching strategy: React Query/TanStack Query.
- Validation strategy: Zod / JSON Schema validation.

### Rationale
- Simplifies form tracking and state updates for complex tenant application forms.

### Applied In
- `{PRODUCT_ROOT}/experience/` pages/components.

### Enforcement Level
- `SHOULD`

---

## 6. Data Modeling Pattern

### Scope
- Label: `Universal`
- Stack context: Relational database schemas.

### Decision
- Entity identity strategy: UUIDv4.
- Soft delete policy: IsDeleted column checked on queries.
- Temporal/audit fields: CreatedAt, CreatedBy, UpdatedAt, UpdatedBy.

### Rationale
- Soft deletes prevent accidental loss of tenant or billing history.

### Applied In
- Entity model docs
- Migrations

### Enforcement Level
- `MUST`

---

## 7. Testing Pattern

### Scope
- Label: `Universal`
- Stack context: xUnit, Playwright, React Testing Library.

### Decision
- Unit/integration/e2e split: 60% unit, 30% integration, 10% E2E.
- Coverage targets: Minimum 80% coverage for Domain/Application layers.
- Test data policy: Reset databases before integration tests.

### Rationale
- Reliable quality check gate in CI.

### Applied In
- Test plans
- CI checks

### Enforcement Level
- `MUST`

---

## 8. Workflow Pattern

### Scope
- Label: `Universal`
- Stack context: State transitions for invoicing and ticket tracking.

### Decision
- State model: Explicit state machines.
- Transition constraints: Only valid status changes allowed (e.g. Invoice: Draft -> Sent -> Paid).
- Compensation/retry rules: Safe idempotency keys on payment routes.

### Rationale
- Prevent double charging of rent.

### Applied In
- Workflow specs
- Orchestration services

### Enforcement Level
- `MUST`

---

## 9. DevOps Pattern

### Scope
- Label: `Hybrid`
- Stack context: Docker, docker-compose, GitHub Actions.

### Decision
- Container strategy: Multi-stage Docker builds.
- Environment promotion model: Dev -> Staging -> Production.
- Secrets handling: Load from external vaults, no hardcoded secrets in files.

### Rationale
- Secure deployments.

### Applied In
- Dockerfiles
- GitHub Actions CI/CD workflows

### Enforcement Level
- `MUST`

---

## Pattern Update Process

1. Propose changes via ADR or architecture note.
2. Review impact across backend/frontend/AI/test/devops.
3. Update this file with rationale and enforcement level.
4. Communicate changes before implementation begins.

## Change Log

- 2026-06-27: Initial project-specific pattern set created for Apartment Management System.
