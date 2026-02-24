export interface Employee {
  date_of_joining: Date | null;
  date_of_exit: Date | null;
  date_of_birth: Date | null;
  total_exp_yrs: number | null;
  training_hours: number | null;
  satisfaction_score: number | null;
  total_ctc_pa: number | null;
  gender: string | null;
  hiring_source: string | null;
  zone: string | null;
  highest_qualification: string | null;
  employment_sector: string | null;
  unique_job_role: string | null;
  exit_type: string | null;
  rating_25: string | null;
  top_talent: string | null;
  reason_for_exit: string | null;
  skills_1: string | null;
  skills_2: string | null;
  skills_3: string | null;
  competency: string | null;
  employee_name?: string | null;
  employee_id?: string | null;
  [key: string]: any;
}

export interface PeopleKPIs {
  totalEmployees: number;
  newHires: number;
  totalExits: number;
  avgAge: number;
  avgTenure: number;
  avgExperience: number;
  trainingHours: number;
  avgSatisfaction: number;
}

export interface JoinersKPIs {
  totalNewJoiners: number;
  avgAge: number;
  avgExperience: number;
  avgCTC: number;
  pctFreshers: number;
  maleToFemaleRatio: string;
  topHiringSource: string;
  topHiringZone: string;
}

export interface AttritionKPIs {
  totalAttritionPct: number;
  regrettableAttritionPct: number;
  nonRegretAttritionPct: number;
  retirementAttritionPct: number;
  avgTenureExited: number;
  topExitRegion: string;
  highPerfAttritionPct: number;
  topTalentAttritionPct: number;
}

export interface ValidationResult {
  missingColumns: string[];
  duplicateIds: number;
  invalidDates: Record<string, number>;
  invalidNumbers: Record<string, number>;
  nullRates: Record<string, number>;
}

export interface UploadResult {
  fileName: string;
  sheetName: string;
  rowCount: number;
  colCount: number;
  timestamp: Date;
  validation: ValidationResult;
  sheetNames: string[];
}

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: any;
}

export interface ChartSpec {
  title: string;
  type: 'line' | 'bar' | 'donut' | 'pie' | 'wordcloud';
  data: ChartDataPoint[];
  yLabel?: string;
}

export type SectionType = 'people' | 'joiners' | 'attrition';
