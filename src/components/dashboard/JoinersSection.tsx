import { useMemo } from 'react';
import { UserPlus, CalendarDays, Briefcase, IndianRupee, GraduationCap, Users, MapPin, Globe } from 'lucide-react';
import { Employee, SectionType } from '@/lib/types';
import { computeJoinersKPIs } from '@/lib/kpiEngine';
import { computeJoinersCharts } from '@/lib/chartEngine';
import { formatNumber, formatCurrency, formatPercent, formatYears } from '@/lib/formatters';
import KPICard from '@/components/KPICard';
import SmartChart from '@/components/SmartChart';

interface Props {
  employees: Employee[];
  asOfDate: Date;
  fyStart: Date;
  fyEnd: Date;
}

const section: SectionType = 'joiners';

export default function JoinersSection({ employees, asOfDate, fyStart, fyEnd }: Props) {
  const kpis = useMemo(() => computeJoinersKPIs(employees, asOfDate, fyStart, fyEnd), [employees, asOfDate, fyStart, fyEnd]);
  const charts = useMemo(() => computeJoinersCharts(employees, fyStart, fyEnd), [employees, fyStart, fyEnd]);

  const kpiCards = [
    { label: 'Total New Joiners', value: formatNumber(kpis.totalNewJoiners), icon: <UserPlus className="w-5 h-5" /> },
    { label: 'Average Age', value: `${kpis.avgAge} Yrs`, icon: <CalendarDays className="w-5 h-5" /> },
    { label: 'Average Experience', value: formatYears(kpis.avgExperience), icon: <Briefcase className="w-5 h-5" /> },
    { label: 'Average CTC', value: formatCurrency(kpis.avgCTC), icon: <IndianRupee className="w-5 h-5" /> },
    { label: 'Percentage of Freshers', value: formatPercent(kpis.pctFreshers), icon: <GraduationCap className="w-5 h-5" /> },
    { label: 'Male to Female Ratio', value: kpis.maleToFemaleRatio, icon: <Users className="w-5 h-5" /> },
    { label: 'Top Hiring Source', value: kpis.topHiringSource, icon: <Globe className="w-5 h-5" /> },
    { label: 'Top Hiring Zone', value: kpis.topHiringZone, icon: <MapPin className="w-5 h-5" /> },
  ];

  return (
    <section>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1.5 h-8 rounded-full bg-joiners" />
        <h2 className="text-2xl font-display font-bold text-foreground">Joiners Snapshot</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {kpiCards.map((kpi, i) => (
          <KPICard key={kpi.label} {...kpi} section={section} delay={i} />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {charts.map((spec) => (
          <SmartChart key={spec.title} spec={spec} />
        ))}
      </div>
    </section>
  );
}
