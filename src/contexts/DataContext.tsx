import React, { createContext, useContext, useState, useCallback } from 'react';
import { Employee, UploadResult } from '@/lib/types';
import { generateDemoData } from '@/lib/demoData';

interface DataContextType {
  employees: Employee[];
  uploadResult: UploadResult | null;
  isDemo: boolean;
  setData: (employees: Employee[], upload: UploadResult) => void;
  loadDemo: () => void;
  asOfDate: Date;
  fyStart: Date;
  fyEnd: Date;
  setAsOfDate: (d: Date) => void;
  setFyStart: (d: Date) => void;
  setFyEnd: (d: Date) => void;
}

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [asOfDate, setAsOfDate] = useState(new Date(2025, 3, 30)); // 2025-04-30
  const [fyStart, setFyStart] = useState(new Date(2025, 3, 1));    // 2025-04-01
  const [fyEnd, setFyEnd] = useState(new Date(2026, 2, 31));       // 2026-03-31

  const setData = useCallback((emps: Employee[], upload: UploadResult) => {
    setEmployees(emps);
    setUploadResult(upload);
    setIsDemo(false);
  }, []);

  const loadDemo = useCallback(() => {
    const demo = generateDemoData(250);
    setEmployees(demo);
    setUploadResult({
      fileName: 'demo_data.xlsx',
      sheetName: 'Master',
      rowCount: demo.length,
      colCount: 22,
      timestamp: new Date(),
      validation: { missingColumns: [], duplicateIds: 0, invalidDates: {}, invalidNumbers: {}, nullRates: {} },
      sheetNames: ['Master'],
    });
    setIsDemo(true);
  }, []);

  return (
    <DataContext.Provider value={{
      employees, uploadResult, isDemo,
      setData, loadDemo,
      asOfDate, fyStart, fyEnd,
      setAsOfDate, setFyStart, setFyEnd,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be within DataProvider');
  return ctx;
}
