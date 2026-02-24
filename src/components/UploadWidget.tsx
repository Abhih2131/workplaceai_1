import { useCallback, useState } from 'react';
import { Upload, FileSpreadsheet, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { parseExcelFile } from '@/lib/excelParser';
import { useData } from '@/contexts/DataContext';
import { useNavigate } from 'react-router-dom';

export default function UploadWidget() {
  const { setData, loadDemo, uploadResult } = useData();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback(async (file: File) => {
    setLoading(true);
    setError(null);
    try {
      const result = await parseExcelFile(file);
      setData(result.employees, result.upload);
    } catch (e: any) {
      setError(e.message || 'Failed to parse file');
    } finally {
      setLoading(false);
    }
  }, [setData]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const onFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  if (uploadResult) {
    return (
      <div className="animate-fade-in">
        <div className="rounded-2xl bg-card border border-border p-8 shadow-sm max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-joiners-muted flex items-center justify-center">
              <CheckCircle className="w-7 h-7 text-joiners" />
            </div>
            <div>
              <h3 className="text-lg font-display font-bold text-card-foreground">Upload Successful</h3>
              <p className="text-sm text-muted-foreground">{uploadResult.timestamp.toLocaleString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="rounded-lg bg-secondary p-3">
              <p className="text-xs text-muted-foreground">File Name</p>
              <p className="font-semibold text-sm text-secondary-foreground">{uploadResult.fileName}</p>
            </div>
            <div className="rounded-lg bg-secondary p-3">
              <p className="text-xs text-muted-foreground">Sheet</p>
              <p className="font-semibold text-sm text-secondary-foreground">{uploadResult.sheetName}</p>
            </div>
            <div className="rounded-lg bg-secondary p-3">
              <p className="text-xs text-muted-foreground">Rows</p>
              <p className="font-semibold text-sm text-secondary-foreground">{uploadResult.rowCount.toLocaleString()}</p>
            </div>
            <div className="rounded-lg bg-secondary p-3">
              <p className="text-xs text-muted-foreground">Columns</p>
              <p className="font-semibold text-sm text-secondary-foreground">{uploadResult.colCount}</p>
            </div>
          </div>

          {/* Validation Summary */}
          {uploadResult.validation.missingColumns.length > 0 && (
            <div className="rounded-lg bg-attrition-muted border border-attrition/20 p-3 mb-4">
              <p className="text-xs font-semibold text-attrition mb-1">Missing Columns ({uploadResult.validation.missingColumns.length})</p>
              <p className="text-xs text-muted-foreground">{uploadResult.validation.missingColumns.join(', ')}</p>
            </div>
          )}

          {uploadResult.validation.duplicateIds > 0 && (
            <div className="rounded-lg bg-attrition-muted border border-attrition/20 p-3 mb-4">
              <p className="text-xs font-semibold text-attrition">Duplicate IDs: {uploadResult.validation.duplicateIds}</p>
            </div>
          )}

          {Object.keys(uploadResult.validation.invalidDates).length > 0 && (
            <div className="rounded-lg bg-people-muted border border-people/20 p-3 mb-4">
              <p className="text-xs font-semibold text-people mb-1">Invalid Dates</p>
              {Object.entries(uploadResult.validation.invalidDates).map(([col, count]) => (
                <p key={col} className="text-xs text-muted-foreground">{col}: {count} invalid</p>
              ))}
            </div>
          )}

          <Button onClick={() => navigate('/dashboard')} className="w-full mt-2 bg-primary text-primary-foreground hover:bg-primary/90" size="lg">
            Open Dashboard →
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div
        className={`rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-300 cursor-pointer ${
          dragOver ? 'border-people bg-people-muted scale-[1.02]' : 'border-border bg-card hover:border-people/50'
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <input id="file-input" type="file" accept=".xlsx,.xls,.csv" onChange={onFileInput} className="hidden" />
        <div className="w-16 h-16 rounded-2xl bg-people-muted mx-auto mb-4 flex items-center justify-center">
          {loading ? (
            <div className="w-8 h-8 border-3 border-people border-t-transparent rounded-full animate-spin" />
          ) : (
            <Upload className="w-8 h-8 text-people" />
          )}
        </div>
        <h3 className="text-lg font-display font-bold text-card-foreground mb-2">
          {loading ? 'Processing...' : 'Upload Employee Master'}
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Drag & drop your Excel file or click to browse
        </p>
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <FileSpreadsheet className="w-4 h-4" />
          <span>.xlsx, .xls, .csv supported</span>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive text-center">
          {error}
        </div>
      )}

      <div className="text-center mt-6">
        <p className="text-sm text-muted-foreground mb-3">Or try with sample data</p>
        <Button variant="outline" onClick={() => { loadDemo(); }} className="border-people/30 text-people hover:bg-people-muted">
          <FileSpreadsheet className="w-4 h-4 mr-2" />
          Load Demo Data
        </Button>
      </div>
    </div>
  );
}
