import { notFound } from 'next/navigation';
import DashboardView from '../../components/dashboard/DashboardView';
import type { DashboardSection } from '../../types';

const validSections: DashboardSection[] = [
  'schools',
  'school-admins',
  'activities',
  'expenses',
  'admin-permissions',
  'teachers',
  'students',
  'teacher-permissions',
  'student-permissions',
];

interface DashboardSectionPageProps {
  params: {
    section: string;
  };
}

export default function DashboardSectionPage({ params }: DashboardSectionPageProps) {
  if (!validSections.includes(params.section as DashboardSection)) {
    notFound();
  }

  return <DashboardView initialSection={params.section as DashboardSection} />;
}
