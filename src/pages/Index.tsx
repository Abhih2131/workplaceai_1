import { BarChart3, ArrowRight, Database, MessageSquare } from 'lucide-react';
import UploadWidget from '@/components/UploadWidget';
import { useData } from '@/contexts/DataContext';

const Index = () => {
  const { employees } = useData();

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col">
      {/* Hero */}
      <div className="bg-primary py-16 px-4">
        <div className="container max-w-3xl text-center">
          <div className="w-16 h-16 rounded-2xl bg-people mx-auto mb-6 flex items-center justify-center">
            <BarChart3 className="w-9 h-9 text-people-foreground" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-4">
            WorkplaceAI
          </h1>
          <p className="text-lg text-primary-foreground/70 mb-2">
            HR Data Copilot — Upload your employee master and get instant KPIs, charts, and AI-powered data Q&A.
          </p>
        </div>
      </div>

      {/* Upload Section */}
      <div className="flex-1 py-12 px-4">
        <div className="container max-w-3xl">
          <UploadWidget />

          {/* Features */}
          {employees.length === 0 && (
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: Database, title: 'Smart Parsing', desc: 'Auto-detect columns, validate data, handle 31K+ rows seamlessly.' },
                { icon: BarChart3, title: '24 KPIs + 20 Charts', desc: 'People, Joiners, and Attrition snapshots with production-grade accuracy.' },
                { icon: MessageSquare, title: 'Data Chatbot', desc: 'Ask questions about your HR data in natural language.' },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="rounded-xl bg-card border border-border p-6 text-center">
                  <div className="w-10 h-10 rounded-lg bg-people-muted mx-auto mb-3 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-people" />
                  </div>
                  <h3 className="font-display font-semibold text-card-foreground mb-1">{title}</h3>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </div>
              ))}
            </div>
          )}

          {/* Required Columns Info */}
          {employees.length === 0 && (
            <div className="mt-12 rounded-xl bg-card border border-border p-6">
              <h3 className="font-display font-semibold text-card-foreground mb-3">Required Columns</h3>
              <p className="text-sm text-muted-foreground mb-2">Your Excel file should ideally contain these columns (dashboard gracefully degrades if missing):</p>
              <div className="flex flex-wrap gap-2">
                {['date_of_joining', 'date_of_exit', 'date_of_birth', 'total_exp_yrs', 'training_hours', 'satisfaction_score', 'total_ctc_pa', 'gender', 'hiring_source', 'zone', 'highest_qualification', 'employment_sector', 'unique_job_role', 'exit_type', 'rating_25', 'top_talent', 'reason_for_exit', 'skills_1', 'skills_2', 'skills_3', 'competency'].map(col => (
                  <span key={col} className="inline-block px-2 py-1 rounded-md bg-secondary text-xs font-mono text-secondary-foreground">{col}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
