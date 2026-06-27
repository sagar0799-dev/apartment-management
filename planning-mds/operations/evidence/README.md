# Operations Evidence

This directory stores the structured audit logs and verification records for actions run on the **Apartment Management System**.

## Profile Types

### Base Run Profile
Any non-feature/manual execution (such as `init`, `plan`, `plan-review`, `review`, or `validate`). Each base run creates a directory under `runs/{RUN_ID}/` containing the six base files:
- `README.md` — Human entry point.
- `action-context.md` — Metadata about run identity, inputs, and scope boundaries.
- `artifact-trace.md` — Detailed list of files read, written, or generated.
- `gate-decisions.md` — Log of gate approvals, rationale, and follow-ups.
- `commands.log` — JSON Lines command execution telemetry.
- `lifecycle-gates.log` — Log outputs from lifecycle validators.

### Feature Evidence Profile
For completed terminal features. It includes the six base files listed above, plus a formal `evidence-manifest.json` declaring required roles, gate/role results, scopes, and waivers. A pointer is written as `latest-run.json` inside the feature index folder at closeout.

## Global Lanes
Shared quality lanes referenced (but not replaced) by feature runs:
- `frontend-quality/` — Global frontend quality metrics.
- `frontend-ux/` — UX audit files.

## Path Class Extensions

```yaml
# Add custom project-specific path mappings for scope booleans here if different from framework defaults.
# Format:
# extensions:
#   - boolean_name: runtime_bearing
#     globs:
#       - "custom-folder/**"
```
