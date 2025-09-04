import { School } from '@/types/school';
import SchoolHeader from './SchoolHeader';
import SchoolInfo from './SchoolInfo';
import StatsOverview from './StatsOverview';

interface HomeContentProps {
  school: School;
}

export default function HomeContent({ school }: HomeContentProps) {
  return (
    <div className="space-y-8">
      <SchoolHeader school={school} />
      <StatsOverview school={school} />
      <SchoolInfo school={school} />
    </div>
  );
}
