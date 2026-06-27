# Feature Assembly Plan — F0001: Keycloak SSO Integration

**Created:** 2026-06-27
**Author:** Architect Agent
**Status:** Approved

## Overview

This feature integrates Keycloak as the centralized single sign-on (SSO) authentication system for the Apartment Management System. It defines the docker-compose setup for local development, configures the .NET backend API to authorize requests using JWT Bearer tokens issued by Keycloak, and implements the React/Next.js frontend login redirect flow using OIDC PKCE.

## Build Order

| Step | Scope | Stories | Rationale |
|------|-------|---------|-----------|
| 1 | DevOps / Infra | F0001-S0001 | Spin up Keycloak connected to PostgreSQL database in docker-compose. |
| 2 | Backend API | F0001-S0002 | Set up .NET JwtBearer authentication middleware and token verification logic. |
| 3 | Frontend App | F0001-S0003 | Implement frontend redirect to Keycloak and OIDC auth token extraction. |

## Existing Code (Must Be Modified)

*Note: Since the codebase is in framework-bootstrap phase, these represent the target files to be modified/created in the app codebase once implemented.*

| File | Current State | F0001 Change |
|------|---------------|----------------|
| `{PRODUCT_ROOT}/docker-compose.yml` | Not created | **Create** — Add PostgreSQL and Keycloak services. |
| `{PRODUCT_ROOT}/engine/src/ApartmentManagement.Api/Program.cs` | Minimal template | **Modify** — Register `AddAuthentication().AddJwtBearer()` and map claims. |
| `{PRODUCT_ROOT}/engine/src/ApartmentManagement.Api/appsettings.json` | Minimal template | **Modify** — Add Keycloak authority and client options. |
| `{PRODUCT_ROOT}/experience/package.json` | Standard Next.js | **Modify** — Add `oidc-client-ts` and `react-oidc-context` dependencies. |

## New Files

| File | Layer | Purpose |
|------|-------|---------|
| `{PRODUCT_ROOT}/docker/keycloak/realm-export.json` | DevOps | Keycloak pre-configured realm export containing client configurations. |
| `{PRODUCT_ROOT}/engine/src/ApartmentManagement.Application/Options/KeycloakOptions.cs` | Backend Application | C# options class to bind Keycloak settings. |
| `{PRODUCT_ROOT}/experience/src/context/AuthContext.tsx` | Frontend Shared | React Context provider managing user tokens and session lifecycle. |
| `{PRODUCT_ROOT}/experience/src/pages/login.tsx` | Frontend Page | Redirects guest user to Keycloak login screen. |
| `{PRODUCT_ROOT}/experience/src/pages/auth/callback.tsx` | Frontend Page | Callback landing route to process OIDC authorization code and redirect to dashboard. |

---

## Step 1 — Setup Keycloak Identity Provider (F0001-S0001)

### New Files

| File | Layer |
|------|-------|
| `{PRODUCT_ROOT}/docker-compose.yml` | DevOps |
| `{PRODUCT_ROOT}/docker/keycloak/realm-export.json` | DevOps |

### docker-compose.yml Configuration

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: ams-postgres
    environment:
      POSTGRES_DB: apartment_management
      POSTGRES_USER: ams_user
      POSTGRES_PASSWORD: ams_password
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ams_user -d apartment_management"]
      interval: 5s
      timeout: 5s
      retries: 5

  keycloak:
    image: quay.io/keycloak/keycloak:23.0.0
    container_name: ams-keycloak
    command: start-dev --import-realm
    environment:
      KEYCLOAK_ADMIN: admin
      KEYCLOAK_ADMIN_PASSWORD: admin
      KC_DB: postgres
      KC_DB_URL: jdbc:postgresql://postgres:5432/apartment_management
      KC_DB_USERNAME: ams_user
      KC_DB_PASSWORD: ams_password
    ports:
      - "8080:8080"
    volumes:
      - ./docker/keycloak/realm-export.json:/opt/keycloak/data/import/realm.json
    depends_on:
      postgres:
        condition: service_healthy

volumes:
  pgdata:
```

### Keycloak Realm Export Configuration (Outline)
The `realm-export.json` must bootstrap a realm named `apartment-management` with:
- Client `web-client`: Public client with PKCE enabled, redirect URI `http://localhost:3000/auth/callback`, post-logout URI `http://localhost:3000/`.
- Client `backend-api`: Confidential/bearer-only client for resource verification.
- Roles: `tenant`, `property-manager`, `maintenance-staff`, `administrator`.

---

## Step 2 — Backend OIDC Integration (F0001-S0002)

### New Files

| File | Layer |
|------|-------|
| `{PRODUCT_ROOT}/engine/src/ApartmentManagement.Application/Options/KeycloakOptions.cs` | Backend Application |

### Modified Files

| File | Change |
|------|--------|
| `{PRODUCT_ROOT}/engine/src/ApartmentManagement.Api/Program.cs` | Configure authentication middleware |
| `{PRODUCT_ROOT}/engine/src/ApartmentManagement.Api/appsettings.json` | Add Keycloak configuration values |

### KeycloakOptions.cs Record Definition

```csharp
namespace ApartmentManagement.Application.Options;

public record KeycloakOptions
{
    public const string SectionName = "Keycloak";

    public string Authority { get; init; } = string.Empty;
    public string Realm { get; init; } = string.Empty;
    public string ClientId { get; init; } = string.Empty;
    public bool RequireHttpsMetadata { get; init; } = false;
}
```

### Program.cs JWT Bearer Middleware Setup

```csharp
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using ApartmentManagement.Application.Options;

var builder = WebApplication.CreateBuilder(args);

// Bind Keycloak Options
var keycloakOptions = new KeycloakOptions();
builder.Configuration.GetSection(KeycloakOptions.SectionName).Bind(keycloakOptions);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.Authority = $"{keycloakOptions.Authority}/realms/{keycloakOptions.Realm}";
    options.Audience = keycloakOptions.ClientId;
    options.RequireHttpsMetadata = keycloakOptions.RequireHttpsMetadata;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = $"{keycloakOptions.Authority}/realms/{keycloakOptions.Realm}"
    };
});

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("TenantOnly", policy => policy.RequireClaim("realm_access.roles", "tenant"));
    options.AddPolicy("ManagerOnly", policy => policy.RequireClaim("realm_access.roles", "property-manager"));
});

var app = builder.Build();

app.UseAuthentication();
app.UseAuthorization();
```

### HTTP Responses

| Status | Body | Condition |
|--------|------|-----------|
| 200 OK | `{ApartmentDto}` | Request succeeds with valid token and authorized role |
| 401 Unauthorized | N/A | Missing or invalid/expired Authorization header token |
| 403 Forbidden | ProblemDetails (`policy_denied`) | Valid token, but missing required role claim (e.g. tenant requests property manager resource) |

---

## Step 3 — Frontend Next.js SSO Integration (F0001-S0003)

### New Files

| File | Layer |
|------|-------|
| `{PRODUCT_ROOT}/experience/src/context/AuthContext.tsx` | Frontend Shared |
| `{PRODUCT_ROOT}/experience/src/pages/login.tsx` | Frontend Page |
| `{PRODUCT_ROOT}/experience/src/pages/auth/callback.tsx` | Frontend Page |

### Modified Files

| File | Change |
|------|--------|
| `{PRODUCT_ROOT}/experience/package.json` | Add `oidc-client-ts` and `react-oidc-context` dependencies |

### AuthContext.tsx Hook Definition

```typescript
import React, { createContext, useContext, useEffect } from 'react';
import { AuthProvider, useAuth } from 'react-oidc-context';

const oidcConfig = {
  authority: "http://localhost:8080/realms/apartment-management",
  client_id: "web-client",
  redirect_uri: "http://localhost:3000/auth/callback",
  response_type: "code",
  scope: "openid profile email",
};

export const CustomAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthProvider {...oidcConfig}>
      {children}
    </AuthProvider>
  );
};
```

### Login and Callback Interaction Contract

| Screen / Entry Point | User Action | Endpoint | Service Method | Entity / Carrier | Authorization | Concurrency | Validation Failure | Audit / Timeline | Test Expectation |
|----------------------|-------------|----------|----------------|------------------|---------------|-------------|--------------------|------------------|------------------|
| `/login` | Click Login | Redirect to Keycloak | N/A | N/A | Guest Access | N/A | Redirect fails if server offline | N/A | Redirects to `localhost:8080` |
| `/auth/callback` | Load callback | Token Exchange | N/A | JWT payload | JWT validated | N/A | 400 bad request if code invalid | N/A | Active session stored, redirects to `/dashboard` |

---

## Scope Breakdown

| Layer | Required Work | Owner | Status |
|------|----------------|-------|--------|
| Backend (`{PRODUCT_ROOT}/engine/`) | Binding options, registering Authentication middleware in Program.cs | Backend Developer | Not Started |
| Frontend (`{PRODUCT_ROOT}/experience/`) | Installing react-oidc-context, creating AuthContext and Callback component | Frontend Developer | Not Started |
| DevOps/Runtime | Docker compose configure Postgres + Keycloak service, configuration export | DevOps | Not Started |
| Quality | Unit/Integration tests mocking JwtBearer context | Quality Engineer | Not Started |

## Dependency Order

```
Step 1 (DevOps):    PostgreSQL + Keycloak container setup & realm schema export
  ──── DevOps checkpoint: Keycloak accessible at http://localhost:8080 ────
Step 2 (Backend):   Program.cs JwtBearer configuration & token validation policy
  ──── Backend checkpoint: API returns 401 on protected requests without token ────
Step 3 (Frontend):  react-oidc-context provider config & Redirect logic
  ──── Frontend checkpoint: User completes full login redirection and returns successfully ────
```

## Integration Checkpoints

### After Step 1 (DevOps Setup)
- [ ] Admin dashboard accessible at `http://localhost:8080/admin/`.
- [ ] Database contains schema tables initialized by Keycloak.

### After Step 2 (Backend Auth)
- [ ] API endpoints returned `401 Unauthorized` for anonymous requests.
- [ ] API successfully returns `200 OK` when requesting resources with a valid mock JWT.

### After Step 3 (Frontend Callback)
- [ ] Clicking login initiates redirect to Keycloak authentication page.
- [ ] Returning user is successfully redirected to `/dashboard` with session token stored.

## Risks and Blockers

| Item | Severity | Mitigation | Owner |
|------|----------|------------|-------|
| Docker container ports conflict (port 8080/5432 occupied) | Low | Allow overriding ports via local `.env` variables. | DevOps |
| Keycloak cold startup time | Low | Configure depend_on parameters with service_healthy checks. | DevOps |
