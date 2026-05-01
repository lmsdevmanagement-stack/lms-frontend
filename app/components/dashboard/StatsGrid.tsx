import { Card, CardContent } from '../ui/card';
import type { StatCard } from '../../types';

interface StatsGridProps {
  stats: StatCard[];
}

export default function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent>
            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            <p className="mt-2 text-3xl font-semibold tracking-normal text-slate-950">{stat.value}</p>
            <p className="mt-1 text-sm text-slate-500">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
