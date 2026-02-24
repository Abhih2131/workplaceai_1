import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import DateControls from '@/components/DateControls';
import PeopleSection from '@/components/dashboard/PeopleSection';
import JoinersSection from '@/components/dashboard/JoinersSection';
import AttritionSection from '@/components/dashboard/AttritionSection';

export default function Dashboard() {
  const { employees, uploadResult, isDemo, asOfDate, fyStart, fyEnd, loadDemo } = useData();
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = useCallback(() => setRefreshKey(k => k + 1), []);

  if (employees.length === 0) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <AlertTriangle className="w-12 h-12 text-attrition mx-auto mb-4" />
          <h2 className="text-xl font-display font-bold text-foreground mb-2">No Data Loaded</h2>
          <p className="text-muted-foreground mb-6">Upload an employee master Excel file or load demo data to view the dashboard.</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => navigate('/')} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
              Go to Upload
            </button>
            <button onClick={loadDemo} className="px-4 py-2 rounded-lg border border-border text-foreground text-sm font-medium hover:bg-secondary transition-colors">
              Load Demo
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] p-6">
      <div className="container max-w-7xl space-y-10">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground mb-1">HR Dashboard</h1>
          <p className="text-muted-foreground text-sm">
            {isDemo ? 'Viewing demo data' : `Viewing ${uploadResult?.fileName}`} · {employees.length.toLocaleString()} employees
          </p>
        </div>

        <DateControls onRefresh={handleRefresh} />

        <PeopleSection key={`p-${refreshKey}`} employees={employees} asOfDate={asOfDate} fyStart={fyStart} fyEnd={fyEnd} />
        <JoinersSection key={`j-${refreshKey}`} employees={employees} asOfDate={asOfDate} fyStart={fyStart} fyEnd={fyEnd} />
        <AttritionSection key={`a-${refreshKey}`} employees={employees} asOfDate={asOfDate} fyStart={fyStart} fyEnd={fyEnd} />
      </div>
    </div>
  );
}
