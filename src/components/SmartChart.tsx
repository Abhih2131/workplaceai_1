import { useMemo } from 'react';
import {
  ResponsiveContainer, LineChart, BarChart, PieChart,
  Line, Bar, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import { ChartSpec } from '@/lib/types';

const COLORS = [
  'hsl(190, 80%, 42%)', 'hsl(152, 70%, 40%)', 'hsl(25, 95%, 53%)',
  'hsl(280, 65%, 55%)', 'hsl(340, 75%, 55%)', 'hsl(45, 90%, 50%)',
  'hsl(200, 70%, 55%)', 'hsl(120, 50%, 45%)', 'hsl(0, 70%, 55%)',
  'hsl(60, 70%, 45%)',
];

function WordCloud({ data }: { data: { name: string; value: number }[] }) {
  const maxVal = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="flex flex-wrap gap-2 justify-center items-center p-4 min-h-[250px]">
      {data.map((item, i) => {
        const size = 0.7 + (item.value / maxVal) * 1.3;
        return (
          <span
            key={i}
            className="inline-block px-2 py-1 rounded-md font-medium transition-transform hover:scale-110"
            style={{
              fontSize: `${size}rem`,
              color: COLORS[i % COLORS.length],
              opacity: 0.7 + (item.value / maxVal) * 0.3,
            }}
          >
            {item.name}
          </span>
        );
      })}
    </div>
  );
}

export default function SmartChart({ spec }: { spec: ChartSpec }) {
  const { type, data, yLabel } = spec;

  const content = useMemo(() => {
    if (!data || data.length === 0) {
      return <div className="flex items-center justify-center h-[280px] text-muted-foreground">No data available</div>;
    }

    switch (type) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 90%)" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} label={yLabel ? { value: yLabel, angle: -90, position: 'insideLeft', style: { fontSize: 12 } } : undefined} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke={COLORS[0]} strokeWidth={3} dot={{ r: 5, fill: COLORS[0] }} />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 90%)" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={data.length > 6 ? -30 : 0} textAnchor={data.length > 6 ? 'end' : 'middle'} height={60} />
              <YAxis tick={{ fontSize: 12 }} label={yLabel ? { value: yLabel, angle: -90, position: 'insideLeft', style: { fontSize: 12 } } : undefined} />
              <Tooltip />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );

      case 'donut':
        return (
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={95} dataKey="value" paddingAngle={2} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" outerRadius={95} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine>
                {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'wordcloud':
        return <WordCloud data={data} />;

      default:
        return null;
    }
  }, [type, data, yLabel]);

  return (
    <div className="rounded-xl bg-card border border-border p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-card-foreground mb-4 font-display">{spec.title}</h3>
      {content}
    </div>
  );
}
