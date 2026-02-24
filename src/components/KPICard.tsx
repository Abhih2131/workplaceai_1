import { ReactNode } from 'react';
import { SectionType } from '@/lib/types';

interface KPICardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  section: SectionType;
  delay?: number;
}

const sectionStyles: Record<SectionType, string> = {
  people: 'border-l-people bg-card',
  joiners: 'border-l-joiners bg-card',
  attrition: 'border-l-attrition bg-card',
};

const iconBg: Record<SectionType, string> = {
  people: 'bg-people-muted text-people',
  joiners: 'bg-joiners-muted text-joiners',
  attrition: 'bg-attrition-muted text-attrition',
};

export default function KPICard({ label, value, icon, section, delay = 0 }: KPICardProps) {
  return (
    <div
      className={`rounded-xl border-l-4 p-5 shadow-sm hover:shadow-md transition-all duration-300 ${sectionStyles[section]} animate-fade-in`}
      style={{ animationDelay: `${delay * 80}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-1">{label}</p>
          <p className="text-2xl font-display font-bold text-card-foreground">{value}</p>
        </div>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconBg[section]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
