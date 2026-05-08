"use client";

import { useEffect, useState } from "react";

import DashboardLayout from "./DashboardLayout";
import DashboardSectionContent from "./DashboardSectionContent";
import { useDashboardAuth } from "../../hooks/useDashboardAuth";
import { useDashboardCrud } from "../../hooks/useDashboardCrud";
import { useMounted } from "../../hooks/useMounted";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import type {
  DashboardSection,
  ExpenseRow,
  FeeRow,
  SalaryRow,
} from "../../types";
import DashboardDialogs from "./DashboardDialogs";
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
  const isAdminUser = isSuperAdmin || role === "admin";
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
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
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
        {activeSection === "schools" && (
          <Button
            disabled={crud.loading || crud.saving}
            onClick={crud.openCreateSchoolModal}
          >
            Create School
          </Button>
        )}
        {activeSection === "school-admins" && (
          <Button
            disabled={crud.loading || crud.saving || crud.schools.length === 0}
            onClick={() => crud.openCreateSchoolAdminModal()}
          >
            Create School Admin
          </Button>
        )}
        {isAdminUser && activeSection === "teachers" && (
          <Button
            disabled={crud.loading || crud.saving || crud.schools.length === 0}
            onClick={crud.openCreateTeacherModal}
          >
            Create Teacher
          </Button>
        )}
        {isAdminUser && activeSection === "classes" && (
          <Button
            disabled={crud.loading || crud.saving || crud.schools.length === 0}
            onClick={crud.openCreateClassModal}
          >
            Create Class
          </Button>
        )}
        {isAdminUser && activeSection === "students" && (
          <Button
            disabled={
              crud.loading ||
              crud.saving ||
              crud.schools.length === 0 ||
              crud.classes.length === 0
            }
            onClick={crud.openCreateStudentModal}
          >
            Create Student
          </Button>
        )}
        {!isStudent && activeSection === "attendance" && (
          <Button
            disabled={crud.loading || crud.saving || crud.students.length === 0}
            onClick={crud.openCreateAttendanceModal}
          >
            Mark Attendance
          </Button>
        )}
        {isAdminUser && activeSection === "fees" && (
          <Button
            disabled={crud.loading || crud.saving || crud.students.length === 0}
            onClick={crud.openCreateFeeModal}
          >
            Assign Fee
          </Button>
        )}
        {isAdminUser && activeSection === "salaries" && (
          <Button
            disabled={crud.loading || crud.saving || crud.teachers.length === 0}
            onClick={crud.openCreateSalaryModal}
          >
            Assign Salary
          </Button>
        )}
        {isAdminUser && activeSection === "expenses" && (
          <Button
            disabled={crud.loading || crud.saving || (!isSuperAdmin && crud.schools.length === 0)}
            onClick={crud.openCreateExpenseModal}
          >
            Add Expense
          </Button>
        )}
        {!isStudent && activeSection === "schedule" && (
          <Button
            disabled={crud.loading || crud.saving || crud.classes.length === 0}
            onClick={crud.openCreateScheduleModal}
          >
            Add Schedule
          </Button>
        )}
        {!isStudent && activeSection === "work" && (
          <Button
            disabled={crud.loading || crud.saving || crud.classes.length === 0}
            onClick={crud.openCreateWorkModal}
          >
            Add Work
          </Button>
        )}
        {!isStudent && activeSection === "results" && (
          <Button
            disabled={crud.loading || crud.saving || crud.students.length === 0}
            onClick={crud.openCreateResultModal}
          >
            Add Result
          </Button>
        )}
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
