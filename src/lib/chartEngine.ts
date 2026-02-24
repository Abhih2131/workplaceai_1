import { Employee, ChartSpec, ChartDataPoint } from './types';
import { diffDays, safeLower, titleCase } from './formatters';

function valueCounts(arr: (string | null | undefined)[]): ChartDataPoint[] {
  const counts: Record<string, number> = {};
  arr.forEach(v => {
    const k = v ? titleCase(v.trim()) : 'Unknown';
    counts[k] = (counts[k] || 0) + 1;
  });
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({ name, value }));
}

function bucketize(values: number[], bins: number[], labels: string[]): ChartDataPoint[] {
  const counts = new Array(labels.length).fill(0);
  for (const v of values) {
    for (let i = 0; i < bins.length - 1; i++) {
      if (v >= bins[i] && v < bins[i + 1]) { counts[i]++; break; }
    }
  }
  return labels.map((name, i) => ({ name, value: counts[i] }));
}

function getActiveAtDate(employees: Employee[], date: Date): Employee[] {
  return employees.filter(e =>
    e.date_of_joining && e.date_of_joining <= date &&
    (!e.date_of_exit || e.date_of_exit > date)
  );
}

// ===== PEOPLE SNAPSHOT CHARTS (6) =====

function manpowerGrowth(employees: Employee[]): ChartSpec {
  const data: ChartDataPoint[] = [];
  for (let yr = 2021; yr <= 2025; yr++) {
    const end = new Date(yr + 1, 2, 31); // Mar 31
    data.push({ name: `FY-${yr + 1}`, value: getActiveAtDate(employees, end).length });
  }
  return { title: 'Manpower Growth', type: 'line', data, yLabel: 'Headcount' };
}

function manpowerCost(employees: Employee[]): ChartSpec {
  const data: ChartDataPoint[] = [];
  for (let yr = 2021; yr <= 2025; yr++) {
    const end = new Date(yr + 1, 2, 31);
    const active = getActiveAtDate(employees, end);
    const cost = active.reduce((s, e) => s + (e.total_ctc_pa ?? 0), 0) / 1e7;
    data.push({ name: `FY-${yr + 1}`, value: Math.round(cost * 10) / 10 });
  }
  return { title: 'Manpower Cost', type: 'bar', data, yLabel: 'INR Cr' };
}

function attritionTrendPeople(employees: Employee[]): ChartSpec {
  const data: ChartDataPoint[] = [];
  for (let yr = 2021; yr <= 2025; yr++) {
    const start = new Date(yr, 3, 1); // Apr 1
    const end = new Date(yr + 1, 2, 31); // Mar 31
    const exits = employees.filter(e =>
      e.date_of_exit && e.date_of_exit >= start && e.date_of_exit <= end
    ).length;
    const openHC = employees.filter(e =>
      e.date_of_joining && e.date_of_joining <= start &&
      (!e.date_of_exit || e.date_of_exit > start)
    ).length;
    const closeHC = employees.filter(e =>
      e.date_of_joining && e.date_of_joining <= end &&
      (!e.date_of_exit || e.date_of_exit > end)
    ).length;
    const avgHC = (openHC + closeHC) > 0 ? (openHC + closeHC) / 2 : 1;
    data.push({ name: `FY-${yr + 1}`, value: Math.round((exits / avgHC) * 1000) / 10 });
  }
  return { title: 'Attrition Trend', type: 'bar', data, yLabel: '%' };
}

function genderDiversity(employees: Employee[], asOfDate: Date): ChartSpec {
  const active = employees.filter(e => !e.date_of_exit || e.date_of_exit > asOfDate);
  const data = valueCounts(active.map(e => e.gender ? titleCase(e.gender) : 'Unknown'));
  return { title: 'Gender Diversity', type: 'donut', data };
}

function ageDistribution(employees: Employee[], asOfDate: Date): ChartSpec {
  const active = employees.filter(e => !e.date_of_exit || e.date_of_exit > asOfDate);
  const ages = active
    .filter(e => e.date_of_birth)
    .map(e => Math.floor(diffDays(asOfDate, e.date_of_birth!) / 365.25));
  const bins = [0, 20, 25, 30, 35, 40, 45, 50, 55, 60, Infinity];
  const labels = ['<20', '20-24', '25-29', '30-34', '35-39', '40-44', '45-49', '50-54', '55-59', '60+'];
  return { title: 'Age Distribution', type: 'bar', data: bucketize(ages, bins, labels) };
}

function tenureDistribution(employees: Employee[], asOfDate: Date): ChartSpec {
  const active = employees.filter(e => !e.date_of_exit || e.date_of_exit > asOfDate);
  const tenures = active
    .filter(e => e.date_of_joining)
    .map(e => diffDays(asOfDate, e.date_of_joining!) / 365.25);
  const bins = [0, 0.5, 1, 3, 5, 10, Infinity];
  const labels = ['0–6 Months', '6–12 Months', '1–3 Years', '3–5 Years', '5–10 Years', '10+ Years'];
  return { title: 'Tenure Distribution', type: 'bar', data: bucketize(tenures, bins, labels) };
}

// ===== JOINERS SNAPSHOT CHARTS (6) =====

function hiringSourceDist(joiners: Employee[]): ChartSpec {
  return { title: 'Hiring Source Distribution', type: 'donut', data: valueCounts(joiners.map(e => e.hiring_source)) };
}

function qualificationDist(joiners: Employee[]): ChartSpec {
  return { title: 'Qualification Distribution', type: 'donut', data: valueCounts(joiners.map(e => e.highest_qualification)) };
}

function genderSplitJoiners(joiners: Employee[]): ChartSpec {
  return { title: 'Gender Split of Joiners', type: 'pie', data: valueCounts(joiners.map(e => e.gender)) };
}

function sectorDist(joiners: Employee[]): ChartSpec {
  return { title: 'Employment Sector Distribution', type: 'bar', data: valueCounts(joiners.map(e => e.employment_sector)) };
}

function expRangeJoiners(joiners: Employee[]): ChartSpec {
  const exps = joiners.filter(e => e.total_exp_yrs !== null).map(e => e.total_exp_yrs!);
  const bins = [0, 1, 3, 5, 10, Infinity];
  const labels = ['<1 Yr', '1–3 Yrs', '3–5 Yrs', '5–10 Yrs', '10+ Yrs'];
  return { title: 'Experience Range of Joiners', type: 'bar', data: bucketize(exps, bins, labels) };
}

function jobRolesHired(joiners: Employee[]): ChartSpec {
  const roles = joiners.map(e => e.unique_job_role).filter(Boolean) as string[];
  const data = valueCounts(roles).slice(0, 30);
  return { title: 'Unique Job Roles Hired', type: 'wordcloud', data };
}

// ===== ATTRITION SNAPSHOT CHARTS (8) =====

function attritionTrendAll(employees: Employee[]): ChartSpec {
  const allExits = employees.filter(e => e.date_of_exit instanceof Date && !isNaN(e.date_of_exit.getTime()));
  const fyMap: Record<string, number> = {};
  const allowedFYs = ['FY-2022', 'FY-2023', 'FY-2024', 'FY-2025', 'FY-2026'];
  allExits.forEach(e => {
    const d = e.date_of_exit!;
    const month = d.getMonth();
    const year = d.getFullYear();
    const fy = month >= 3 ? `FY-${year + 1}` : `FY-${year}`;
    if (allowedFYs.includes(fy)) fyMap[fy] = (fyMap[fy] || 0) + 1;
  });
  const data = allowedFYs.map(fy => ({ name: fy, value: fyMap[fy] || 0 }));
  return { title: 'Attrition Trend', type: 'bar', data, yLabel: 'Exits' };
}

function attritionByExitType(exits: Employee[]): ChartSpec {
  return { title: 'Attrition by Exit Type', type: 'donut', data: valueCounts(exits.map(e => e.exit_type)) };
}

function tenureExited(exits: Employee[]): ChartSpec {
  const tenures = exits
    .filter(e => e.date_of_joining && e.date_of_exit)
    .map(e => diffDays(e.date_of_exit!, e.date_of_joining!) / 365.25);
  const bins = [0, 1, 3, 5, 10, Infinity];
  const labels = ['<1', '1–3', '3–5', '5–10', '10+'];
  return { title: 'Tenure of Exited Employees', type: 'bar', data: bucketize(tenures, bins, labels), yLabel: 'Years' };
}

function attritionByGender(exits: Employee[]): ChartSpec {
  return { title: 'Attrition by Gender', type: 'pie', data: valueCounts(exits.map(e => e.gender)) };
}

function attritionByRating(exits: Employee[]): ChartSpec {
  return { title: 'Attrition by Rating (FY)', type: 'bar', data: valueCounts(exits.map(e => e.rating_25)) };
}

function exitReasonDist(exits: Employee[]): ChartSpec {
  return { title: 'Exit Reason Distribution', type: 'donut', data: valueCounts(exits.map(e => e.reason_for_exit)) };
}

function skillLoss(exits: Employee[]): ChartSpec {
  const skills: string[] = [];
  exits.forEach(e => {
    [e.skills_1, e.skills_2, e.skills_3].forEach(s => {
      if (s) skills.push(s.toLowerCase().trim());
    });
  });
  return { title: 'Skill Loss', type: 'wordcloud', data: valueCounts(skills).slice(0, 30) };
}

function competencyLoss(exits: Employee[]): ChartSpec {
  const comps = exits.map(e => e.competency).filter(Boolean).map(c => c!.toLowerCase().trim());
  return { title: 'Competency Loss', type: 'wordcloud', data: valueCounts(comps).slice(0, 30) };
}

// ===== PUBLIC API =====

export function computePeopleCharts(employees: Employee[], asOfDate: Date): ChartSpec[] {
  return [
    manpowerGrowth(employees),
    manpowerCost(employees),
    attritionTrendPeople(employees),
    genderDiversity(employees, asOfDate),
    ageDistribution(employees, asOfDate),
    tenureDistribution(employees, asOfDate),
  ];
}

export function computeJoinersCharts(employees: Employee[], fyStart: Date, fyEnd: Date): ChartSpec[] {
  const joiners = employees.filter(e =>
    e.date_of_joining && e.date_of_joining >= fyStart && e.date_of_joining <= fyEnd
  );
  return [
    hiringSourceDist(joiners),
    qualificationDist(joiners),
    genderSplitJoiners(joiners),
    sectorDist(joiners),
    expRangeJoiners(joiners),
    jobRolesHired(joiners),
  ];
}

export function computeAttritionCharts(employees: Employee[], fyStart: Date, fyEnd: Date): ChartSpec[] {
  const exits = employees.filter(e =>
    e.date_of_exit && e.date_of_exit >= fyStart && e.date_of_exit <= fyEnd
  );
  return [
    attritionTrendAll(employees),
    attritionByExitType(exits),
    tenureExited(exits),
    attritionByGender(exits),
    attritionByRating(exits),
    exitReasonDist(exits),
    skillLoss(exits),
    competencyLoss(exits),
  ];
}
