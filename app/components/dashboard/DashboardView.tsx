"use client";

import { useEffect, useState } from "react";

import DashboardLayout from "@/app/components/dashboard/DashboardLayout";
import DashboardSectionContent from "@/app/components/dashboard/DashboardSectionContent";
import DashboardDialogs from "@/app/components/modals/DashboardDialogs";
import { useDashboardAuth } from "@/app/hooks/useDashboardAuth";
import { useDashboardCrud } from "@/app/hooks/useDashboardCrud";
import { useMounted } from "@/app/hooks/useMounted";
import { Skeleton } from "@/app/components/ui/skeleton";
import type { DashboardSection, ExpenseRow, FeeRow, SalaryRow } from "@/app/types";
import {
  DashboardDeleteTarget,
  DashboardPermissionTarget,
} from "@/app/types/dashboard";

interface DashboardViewProps {
  initialSection?: DashboardSection;
}

export default function DashboardView({
  initialSection = "overview",
}: DashboardViewProps) {
  const mounted = useMounted();
  const [activeSection, setActiveSection] =
    useState<DashboardSection>(initialSection);
  const [searchTerm, setSearchTerm] = useState("");
  const [attendanceDateFilter, setAttendanceDateFilter] = useState("");
  const [attendanceClassFilter, setAttendanceClassFilter] = useState(0);
  const [attendanceSchoolFilter, setAttendanceSchoolFilter] = useState(0);
  const [feeMonthFilter, setFeeMonthFilter] = useState("");
  const [feeStatusFilter, setFeeStatusFilter] = useState<
    "all" | FeeRow["status"]
  >("all");
  const [feeClassFilter, setFeeClassFilter] = useState(0);
  const [salaryMonthFilter, setSalaryMonthFilter] = useState("");
  const [salaryStatusFilter, setSalaryStatusFilter] = useState<
    "all" | SalaryRow["status"]
  >("all");
  const [expenseDateFilter, setExpenseDateFilter] = useState("");
  const [expensePeriodFilter, setExpensePeriodFilter] = useState<
    "all" | ExpenseRow["period"]
  >("all");
  const [deleteTarget, setDeleteTarget] =
    useState<DashboardDeleteTarget | null>(null);
  const [permissionTarget, setPermissionTarget] =
    useState<DashboardPermissionTarget | null>(null);
  const {
    user,
    role,
    isAuthenticated,
    isSuperAdmin,
    organizationId,
    schoolId,
    handleLogout,
  } = useDashboardAuth();
  const isTeacher = role === "teacher";
  const isStudent = role === "student";
  const crud = useDashboardCrud({
    isSuperAdmin,
    organizationId,
    schoolId,
    searchTerm,
    enabled: isAuthenticated,
    currentUser: user,
  });

  useEffect(() => {
    setActiveSection(initialSection);
  }, [initialSection]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-100 p-6">
        <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
          <Skeleton className="hidden h-[calc(100vh-3rem)] lg:block" />
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <DashboardLayout
      user={user}
      role={role}
      activeSection={activeSection}
      searchTerm={searchTerm}
      onSectionChange={setActiveSection}
      onSearchChange={setSearchTerm}
      onLogout={handleLogout}
    >
      <div className="mb-6">
        <div>
          <p className="text-sm font-medium capitalize text-slate-500">
            {isSuperAdmin
              ? "Full system control"
              : isTeacher
                ? "Teacher classroom access"
                : isStudent
                  ? "Student self-service access"
                  : "Organization-scoped access"}
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-normal text-slate-950">
            {isSuperAdmin
              ? "Super Admin Dashboard"
              : isTeacher
                ? "Teacher Dashboard"
                : isStudent
                  ? "Student Dashboard"
              : "School Admin Dashboard"}
          </h1>
        </div>
      </div>

      <DashboardSectionContent
        activeSection={activeSection}
        crud={crud}
        user={user}
        isSuperAdmin={isSuperAdmin}
        isTeacher={isTeacher}
        isStudent={isStudent}
        attendanceDateFilter={attendanceDateFilter}
        setAttendanceDateFilter={setAttendanceDateFilter}
        attendanceClassFilter={attendanceClassFilter}
        setAttendanceClassFilter={setAttendanceClassFilter}
        attendanceSchoolFilter={attendanceSchoolFilter}
        setAttendanceSchoolFilter={setAttendanceSchoolFilter}
        feeMonthFilter={feeMonthFilter}
        setFeeMonthFilter={setFeeMonthFilter}
        feeStatusFilter={feeStatusFilter}
        setFeeStatusFilter={setFeeStatusFilter}
        feeClassFilter={feeClassFilter}
        setFeeClassFilter={setFeeClassFilter}
        salaryMonthFilter={salaryMonthFilter}
        setSalaryMonthFilter={setSalaryMonthFilter}
        salaryStatusFilter={salaryStatusFilter}
        setSalaryStatusFilter={setSalaryStatusFilter}
        expenseDateFilter={expenseDateFilter}
        setExpenseDateFilter={setExpenseDateFilter}
        expensePeriodFilter={expensePeriodFilter}
        setExpensePeriodFilter={setExpensePeriodFilter}
      />

      <DashboardDialogs
        crud={crud}
        isSuperAdmin={isSuperAdmin}
        deleteTarget={deleteTarget}
        setDeleteTarget={setDeleteTarget}
        permissionTarget={permissionTarget}
        setPermissionTarget={setPermissionTarget}
      />
    </DashboardLayout>
  );
}
