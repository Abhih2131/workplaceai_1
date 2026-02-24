import { useMemo } from 'react';
import { Users, UserPlus, UserMinus, CalendarDays, Clock, Briefcase, BookOpen, Smile } from 'lucide-react';
import { Employee, SectionType } from '@/lib/types';
import { computePeopleKPIs } from '@/lib/kpiEngine';
import { computePeopleCharts } from '@/lib/chartEngine';
import { formatNumber, formatYears } from '@/lib/formatters';
import KPICard from '@/components/KPICard';
import SmartChart from '@/components/SmartChart';

interface Props {
  employees: Employee[];
  asOfDate: Date;
  fyStart: Date;
  fyEnd: Date;
}

const section: SectionType = 'people';

export default function PeopleSection({ employees, asOfDate, fyStart, fyEnd }: Props) {
  const kpis = useMemo(() => computePeopleKPIs(employees, asOfDate, fyStart, fyEnd), [employees, asOfDate, fyStart, fyEnd]);
  const charts = useMemo(() => computePeopleCharts(employees, asOfDate), [employees, asOfDate]);

  const kpiCards = [
    { label: 'Total Employees', value: formatNumber(kpis.totalEmployees), icon: <Users className="w-5 h-5" /> },
    { label: 'New Hires (FY)', value: formatNumber(kpis.newHires), icon: <UserPlus className="w-5 h-5" /> },
    { label: 'Total Exits (FY)', value: formatNumber(kpis.totalExits), icon: <UserMinus className="w-5 h-5" /> },
    { label: 'Average Age', value: `${kpis.avgAge} Yrs`, icon: <CalendarDays className="w-5 h-5" /> },
    { label: 'Average Tenure', value: formatYears(kpis.avgTenure), icon: <Clock className="w-5 h-5" /> },
    { label: 'Average Experience', value: formatYears(kpis.avgExperience), icon: <Briefcase className="w-5 h-5" /> },
    { label: 'Training Hours', value: formatNumber(kpis.trainingHours), icon: <BookOpen className="w-5 h-5" /> },
    { label: 'Avg Satisfaction Score', value: String(kpis.avgSatisfaction), icon: <Smile className="w-5 h-5" /> },
  ];

  return (
    <section>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1.5 h-8 rounded-full bg-people" />
        <h2 className="text-2xl font-display font-bold text-foreground">People Snapshot</h2>
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
