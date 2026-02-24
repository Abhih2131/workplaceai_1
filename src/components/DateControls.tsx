import { useData } from '@/contexts/DataContext';
import { Calendar, RefreshCw } from 'lucide-react';

function formatDateInput(d: Date): string {
  return d.toISOString().split('T')[0];
}

export default function DateControls({ onRefresh }: { onRefresh?: () => void }) {
  const { asOfDate, fyStart, fyEnd, setAsOfDate, setFyStart, setFyEnd } = useData();

  return (
    <div className="flex flex-wrap items-center gap-4 rounded-xl bg-card border border-border p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 text-muted-foreground" />
        <label className="text-xs font-medium text-muted-foreground">As of Date</label>
        <input
          type="date"
          value={formatDateInput(asOfDate)}
          onChange={(e) => setAsOfDate(new Date(e.target.value))}
          className="rounded-md border border-input bg-background px-3 py-1.5 text-sm text-foreground"
        />
      </div>
      <div className="flex items-center gap-2">
        <label className="text-xs font-medium text-muted-foreground">FY Start</label>
        <input
          type="date"
          value={formatDateInput(fyStart)}
          onChange={(e) => setFyStart(new Date(e.target.value))}
          className="rounded-md border border-input bg-background px-3 py-1.5 text-sm text-foreground"
        />
      </div>
      <div className="flex items-center gap-2">
        <label className="text-xs font-medium text-muted-foreground">FY End</label>
        <input
          type="date"
          value={formatDateInput(fyEnd)}
          onChange={(e) => setFyEnd(new Date(e.target.value))}
          className="rounded-md border border-input bg-background px-3 py-1.5 text-sm text-foreground"
        />
      </div>
      {onRefresh && (
        <button onClick={onRefresh} className="ml-auto flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          <RefreshCw className="w-4 h-4" />
          Recompute
        </button>
      )}
    </div>
  );
}
