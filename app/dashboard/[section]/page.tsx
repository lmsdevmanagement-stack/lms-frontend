import { notFound } from "next/navigation";
import DashboardView from "@/app/components/dashboard/DashboardView";
import type { DashboardSection } from "../../types";

const validSections: DashboardSection[] = [
  "schools",
  "school-admins",
  "activities",
  "expenses",
  "admin-permissions",
  "teachers",
  "classes",
  "students",
  "attendance",
  "fees",
  "salaries",
  "schedule",
  "work",
  "results",
  "reports",
  "organization-settings",
  "access-control",
  "profile",
  "teacher-permissions",
  "student-permissions",
];

interface DashboardSectionPageProps {
  params: {
    section: string;
  };
}

export default function DashboardSectionPage({
  params,
}: DashboardSectionPageProps) {
  if (!validSections.includes(params.section as DashboardSection)) {
    notFound();
  }

  return <DashboardView initialSection={params.section as DashboardSection} />;
}
