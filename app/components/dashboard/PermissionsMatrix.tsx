'use client';

import { RotateCcw, Save } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { PERMISSION_COLUMNS, PERMISSION_GROUPS, PERMISSION_PAGE_TITLES, type PermissionColumnKey } from '../../constants/permissions';
import type { DashboardSection } from '../../types';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

type PermissionSection = Extract<DashboardSection, 'admin-permissions' | 'teacher-permissions' | 'student-permissions'>;
type PermissionState = Record<string, Record<PermissionColumnKey, boolean>>;

interface PermissionsMatrixProps {
  section: PermissionSection;
  title?: string;
  description?: string;
  value?: string[];
  onSave?: (permissions: string[]) => void;
  saving?: boolean;
}

function permissionKey(ruleId: string, columnKey: PermissionColumnKey) {
  return `${ruleId}:${columnKey}`;
}

function buildDefaultState(section: PermissionSection): PermissionState {
  return PERMISSION_GROUPS[section].reduce<PermissionState>((state, group) => {
    group.rules.forEach((rule) => {
      state[rule.id] = { ...rule.defaults };
    });
    return state;
  }, {});
}

function buildStateFromList(section: PermissionSection, permissions: string[]): PermissionState {
  const state = buildDefaultState(section);
  Object.keys(state).forEach((ruleId) => {
    PERMISSION_COLUMNS.forEach((column) => {
      state[ruleId][column.key] = permissions.includes(permissionKey(ruleId, column.key));
    });
  });
  return state;
}

function stateToList(state: PermissionState) {
  return Object.entries(state).flatMap(([ruleId, actions]) =>
    PERMISSION_COLUMNS
      .filter((column) => actions[column.key])
      .map((column) => permissionKey(ruleId, column.key))
  );
}

export default function PermissionsMatrix({ section, title, description, value, onSave, saving = false }: PermissionsMatrixProps) {
  const storageKey = `lms:${section}`;
  const defaultState = useMemo(() => buildDefaultState(section), [section]);
  const [permissions, setPermissions] = useState<PermissionState>(defaultState);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      if (value) {
        setPermissions(buildStateFromList(section, value));
        return;
      }

      const storedPermissions = window.localStorage.getItem(storageKey);
      if (!storedPermissions) {
        setPermissions(defaultState);
        return;
      }

      try {
        setPermissions({ ...defaultState, ...(JSON.parse(storedPermissions) as PermissionState) });
      } catch {
        setPermissions(defaultState);
      }
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [defaultState, section, storageKey, value]);

  const togglePermission = (ruleId: string, key: PermissionColumnKey) => {
    setSaved(false);
    setPermissions((current) => ({
      ...current,
      [ruleId]: {
        ...current[ruleId],
        [key]: !current[ruleId]?.[key],
      },
    }));
  };

  const resetPermissions = () => {
    setPermissions(defaultState);
    if (!onSave) window.localStorage.removeItem(storageKey);
    setSaved(false);
  };

  const savePermissions = () => {
    const permissionList = stateToList(permissions);
    if (onSave) {
      onSave(permissionList);
      setSaved(true);
      return;
    }

    window.localStorage.setItem(storageKey, JSON.stringify(permissions));
    setSaved(true);
  };

  return (
    <Card>
      <CardHeader className="border-b border-slate-200">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>{title || PERMISSION_PAGE_TITLES[section]}</CardTitle>
            <p className="mt-1 text-sm text-slate-500">{description || 'Manage access by module and action.'}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={resetPermissions}>
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
            <Button disabled={saving} onClick={savePermissions}>
              <Save className="h-4 w-4" />
              {saving ? 'Saving...' : saved ? 'Saved' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <div className="min-w-[680px]">
            <div className="grid grid-cols-[minmax(260px,1fr)_repeat(4,96px)] border-b border-slate-200 bg-slate-50 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <div>Permission</div>
              {PERMISSION_COLUMNS.map((column) => (
                <div key={column.key} className="text-center">{column.label}</div>
              ))}
            </div>
            {PERMISSION_GROUPS[section].map((group) => (
              <div key={group.title}>
                <div className="border-b border-slate-200 bg-slate-50/70 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-blue-800">
                  {group.title}
                </div>
                {group.rules.map((rule) => (
                  <div key={rule.id} className="grid grid-cols-[minmax(260px,1fr)_repeat(4,96px)] items-center border-b border-slate-100 px-6 py-4 last:border-b-0">
                    <div>
                      <p className="text-sm font-semibold text-slate-950">{rule.label}</p>
                      <p className="mt-1 text-xs text-slate-500">{rule.description}</p>
                    </div>
                    {PERMISSION_COLUMNS.map((column) => (
                      <label key={column.key} className="flex justify-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-slate-300 accent-blue-800"
                          checked={Boolean(permissions[rule.id]?.[column.key])}
                          onChange={() => togglePermission(rule.id, column.key)}
                          aria-label={`${rule.label} ${column.label}`}
                        />
                      </label>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
