"use client";

import DataTable from "./DataTable";
import StatsGrid from "./StatsGrid";
import {
  AdminOverviewProps,
  StudentOverviewProps,
  SuperAdminOverviewProps,
  TeacherOverviewProps,
} from "@/app/types/dashboard";

export function SuperAdminDashboardOverview({
  crud,
  stats,
  schoolColumns,
  schoolAdminColumns,
  activityColumns,
}: SuperAdminOverviewProps) {
  return (
    <div className="space-y-6">
      <StatsGrid stats={stats} />
      <DataTable
        title="Organizations / Schools"
        columns={schoolColumns}
        data={crud.schools}
        loading={crud.loading}
      />
      <DataTable
        title="School Admins"
        columns={schoolAdminColumns}
        data={crud.schoolAdmins}
        loading={crud.loading}
      />
      <DataTable
        title="Recent User Activities"
        columns={activityColumns}
        data={crud.activities.slice(0, 8)}
        loading={crud.loading}
      />
    </div>
  );
}

export function AdminDashboardOverview({
  crud,
  stats,
  teacherColumns,
  classColumns,
  studentColumns,
}: AdminOverviewProps) {
  return (
    <div className="space-y-6">
      <StatsGrid stats={stats} />
      <DataTable
        title="Teachers"
        columns={teacherColumns}
        data={crud.teachers}
        loading={crud.loading}
      />
      <DataTable
        title="Classes"
        columns={classColumns}
        data={crud.classes}
        loading={crud.loading}
      />
      <DataTable
        title="Students"
        columns={studentColumns}
        data={crud.students}
        loading={crud.loading}
      />
    </div>
  );
}

export function TeacherDashboardOverview({
  crud,
  stats,
  classColumns,
  studentColumns,
  attendanceColumns,
  scheduleColumns,
}: TeacherOverviewProps) {
  return (
    <div className="space-y-6">
      <StatsGrid stats={stats} />
      <DataTable
        title="My Classes"
        columns={classColumns}
        data={crud.classes}
        loading={crud.loading}
      />
      <DataTable
        title="My Students"
        columns={studentColumns}
        data={crud.students}
        loading={crud.loading}
      />
      <DataTable
        title="Recent Attendance"
        columns={attendanceColumns}
        data={crud.attendance.slice(0, 8)}
        loading={crud.loading}
      />
      <DataTable
        title="Class Schedule"
        columns={scheduleColumns}
        data={crud.schedules.slice(0, 8)}
        loading={crud.loading}
      />
    </div>
  );
}

export function StudentDashboardOverview({
  crud,
  stats,
  attendanceColumns,
  feeColumns,
  resultColumns,
  classColumns,
}: StudentOverviewProps) {
  return (
    <div className="space-y-6">
      <StatsGrid stats={stats} />
      <DataTable
        title="My Attendance"
        columns={attendanceColumns}
        data={crud.attendance.slice(0, 8)}
        loading={crud.loading}
      />
      <DataTable
        title="My Fees"
        columns={feeColumns}
        data={crud.fees.slice(0, 8)}
        loading={crud.loading}
      />
      <DataTable
        title="My Marks"
        columns={resultColumns}
        data={crud.results.slice(0, 8)}
        loading={crud.loading}
      />
      <DataTable
        title="Class & Subject Info"
        columns={classColumns}
        data={crud.classes}
        loading={crud.loading}
      />
    </div>
  );
}
