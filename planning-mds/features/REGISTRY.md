# Feature Registry

**Next Available Feature Number:** F0002

**Planning Views:**
- Roadmap sequencing (`Now / Next / Later`): `ROADMAP.md`
- Story rollup index: `STORY-INDEX.md`
- Governance contract: `TRACKER-GOVERNANCE.md`

## Active Features

| Feature ID | Name | Status | Phase | Folder |
|------------|------|--------|-------|--------|
| F0001 | Keycloak SSO Integration | Done | Phase A/B | F0001-keycloak-sso/ |

## Retired Features

| Feature ID | Name | Terminal Status | Superseded By | Retired Date | Folder | Reason |
|------------|------|-----------------|---------------|--------------|--------|--------|

## Planned (Reserved IDs)

| Feature ID | Name | Status | Phase | Folder |
|------------|------|--------|-------|--------|

## Archived Features

| Feature ID | Name | Archived Date | Evidence Reentry Date | Folder |
|------------|------|---------------|-----------------------|--------|

## Numbering Rules

- Feature IDs use a 4-digit zero-padded format: `F0001`, `F0002`, ..., `F9999`
- Numbers are assigned sequentially — never reuse a retired number
- Story IDs within a feature follow `F{NNNN}-S{NNNN}` (e.g., `F0001-S0001`)
- Update **Next Available Feature Number** whenever a new feature is added

## Sync Rules

- Update REGISTRY whenever a feature is created, renamed, re-scoped, marked done, or archived.
- Keep folder paths exact and valid (`F{NNNN}-{slug}/` for active, `archive/F{NNNN}-{slug}/` for archived).
- Ensure `{PRODUCT_ROOT}/planning-mds/features/TRACKER-GOVERNANCE.md` exists.
- After registry edits, regenerate story index and run tracker validation.
