---
name: lms-frontend-dashboard
description: Use when changing the LMS frontend in lms-frontend, including Next.js dashboard pages, DashboardView, DashboardLayout, useDashboardCrud, services/api.ts, type files, navigation, modals, tables, admin or teacher dashboard flows, and frontend build/type fixes.
---

# LMS Frontend Dashboard

## Workflow

1. Read these files before changing dashboard behavior:
   - `app/components/dashboard/DashboardView.tsx`
   - `app/hooks/useDashboardCrud.ts`
   - `app/services/api.ts`
   - `app/constants/dashboard.ts`
   - relevant files in `app/types/`
2. Keep API types, service methods, hook state, and UI views in sync.
3. Add dashboard pages under `app/dashboard/<section>/page.tsx` and include the section in `app/dashboard/[section]/page.tsx`.
4. Keep role navigation strict:
   - Admins manage schools/classes/teachers/students/attendance/fees/reports/settings/access control.
   - Teachers see assigned classes, assigned students, attendance, reports, and profile only.
   - Teachers must not see add/delete student, fees, user creation, school settings, or system settings actions.
5. Prefer existing UI components: `DataTable`, `Modal`, `StatsGrid`, `Badge`, `Button`, `Input`, `Card`.
6. Validate with:

```powershell
cd E:\LMS\lms-frontend
npm.cmd run build
```

## UI Conventions

- Use compact dashboard layouts, not marketing pages.
- Keep tables scannable with concise columns and clear actions.
- Use modal forms for create/edit flows.
- Disable submit buttons when required fields are missing or saving.
- Keep controlled form state in `useDashboardCrud`.
- Do not add decorative UI that does not support the workflow.

## References

- Read `references/dashboard-sections.md` when adding navigation or checking role access.
