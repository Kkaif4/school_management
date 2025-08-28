// components/HomeContent.tsx
import { Student } from '@/api/students';
import { Teacher } from '@/api/teachers';
import { School as SchoolType } from '@/api/school';
import SchoolHeader from './SchoolHeader';
import SchoolInfo from './SchoolInfo';
import StatsOverview from './StatsOverview';

interface HomeContentProps {
  school: SchoolType;
  students: Student[];
  teachers: Teacher[];
}

export default function HomeContent({
  school,
  students,
  teachers,
}: HomeContentProps) {
  return (
    <div className="space-y-8">
      <SchoolHeader school={school} />
      <StatsOverview students={students} teachers={teachers} />
      <SchoolInfo school={school} />
    </div>
  );
}
