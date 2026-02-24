import { Employee, PeopleKPIs, JoinersKPIs, AttritionKPIs } from './types';
import { diffDays, mean, mode, round1, safeLower, titleCase } from './formatters';

export function computePeopleKPIs(employees: Employee[], asOfDate: Date, fyStart: Date, fyEnd: Date): PeopleKPIs {
  // df_active: date_of_exit is null OR date_of_exit > as_of_date
  const dfActive = employees.filter(e =>
    !e.date_of_exit || e.date_of_exit > asOfDate
  );

  const newHires = employees.filter(e =>
    e.date_of_joining && e.date_of_joining >= fyStart && e.date_of_joining <= fyEnd
  ).length;

  const totalExits = employees.filter(e =>
    e.date_of_exit && e.date_of_exit >= fyStart && e.date_of_exit <= fyEnd
  ).length;

  const ages = dfActive
    .filter(e => e.date_of_birth)
    .map(e => Math.floor(diffDays(asOfDate, e.date_of_birth!) / 365.25));

  const tenures = dfActive
    .filter(e => e.date_of_joining)
    .map(e => diffDays(asOfDate, e.date_of_joining!) / 365.25);

  const trainingHours = dfActive.reduce((s, e) => s + (e.training_hours ?? 0), 0);
  const satisfactionScores = dfActive.map(e => e.satisfaction_score ?? 0);

  return {
    totalEmployees: dfActive.length,
    newHires,
    totalExits,
    avgAge: ages.length ? Math.floor(mean(ages)) : 0,
    avgTenure: tenures.length ? round1(mean(tenures)) : 0,
    avgExperience: round1(mean(dfActive.map(e => e.total_exp_yrs ?? 0))),
    trainingHours: Math.floor(trainingHours),
    avgSatisfaction: round1(mean(satisfactionScores)),
  };
}

export function computeJoinersKPIs(employees: Employee[], asOfDate: Date, fyStart: Date, fyEnd: Date): JoinersKPIs {
  const dfJoiners = employees.filter(e =>
    e.date_of_joining && e.date_of_joining >= fyStart && e.date_of_joining <= fyEnd
  );

  const total = dfJoiners.length;

  const ages = dfJoiners
    .filter(e => e.date_of_birth)
    .map(e => round1(diffDays(asOfDate, e.date_of_birth!) / 365.25));

  const experiences = dfJoiners
    .filter(e => e.total_exp_yrs !== null)
    .map(e => e.total_exp_yrs!);

  const ctcs = dfJoiners
    .filter(e => e.total_ctc_pa !== null)
    .map(e => e.total_ctc_pa!);

  const freshers = total > 0
    ? (dfJoiners.filter(e => (e.total_exp_yrs ?? 0) < 1).length / total) * 100
    : 0;

  // Male to Female Ratio
  const males = dfJoiners.filter(e => safeLower(e.gender) === 'male').length;
  const females = dfJoiners.filter(e => safeLower(e.gender) === 'female').length;
  const mfRatio = females === 0
    ? (males > 0 ? 'All Male' : 'N/A')
    : `${males}:${females}`;

  const sources = dfJoiners.map(e => e.hiring_source).filter(Boolean) as string[];
  const zones = dfJoiners.map(e => e.zone).filter(Boolean) as string[];

  return {
    totalNewJoiners: total,
    avgAge: ages.length ? round1(mean(ages)) : 0,
    avgExperience: experiences.length ? round1(mean(experiences)) : 0,
    avgCTC: ctcs.length ? round1(mean(ctcs) / 1e5) : 0,
    pctFreshers: round1(freshers),
    maleToFemaleRatio: mfRatio,
    topHiringSource: mode(sources),
    topHiringZone: mode(zones),
  };
}

export function computeAttritionKPIs(employees: Employee[], _asOfDate: Date, fyStart: Date, fyEnd: Date): AttritionKPIs {
  const dfExits = employees.filter(e =>
    e.date_of_exit && e.date_of_exit >= fyStart && e.date_of_exit <= fyEnd
  );

  const openingHC = employees.filter(e =>
    e.date_of_joining && e.date_of_joining <= fyStart &&
    (!e.date_of_exit || e.date_of_exit > fyStart)
  ).length;

  const closingHC = employees.filter(e =>
    e.date_of_joining && e.date_of_joining <= fyEnd &&
    (!e.date_of_exit || e.date_of_exit > fyEnd)
  ).length;

  const avgHC = (openingHC + closingHC) > 0 ? (openingHC + closingHC) / 2 : 1;
  const totalExits = dfExits.length;

  const regrettable = dfExits.filter(e => safeLower(e.exit_type) === 'regrettable').length;
  const nonRegret = dfExits.filter(e => safeLower(e.exit_type) === 'non-regrettable').length;
  const retirement = dfExits.filter(e => safeLower(e.exit_type) === 'retirement').length;

  const exitTenures = dfExits
    .filter(e => e.date_of_joining && e.date_of_exit)
    .map(e => round1(diffDays(e.date_of_exit!, e.date_of_joining!) / 365.25));

  const zones = dfExits.map(e => e.zone).filter(Boolean) as string[];
  const highPerf = dfExits.filter(e => safeLower(e.rating_25) === 'excellent').length;
  const topTalent = dfExits.filter(e => safeLower(e.top_talent) === 'yes').length;

  return {
    totalAttritionPct: round1((totalExits / avgHC) * 100),
    regrettableAttritionPct: round1((regrettable / avgHC) * 100),
    nonRegretAttritionPct: round1((nonRegret / avgHC) * 100),
    retirementAttritionPct: round1((retirement / avgHC) * 100),
    avgTenureExited: exitTenures.length ? round1(mean(exitTenures)) : 0,
    topExitRegion: mode(zones),
    highPerfAttritionPct: round1((highPerf / avgHC) * 100),
    topTalentAttritionPct: round1((topTalent / avgHC) * 100),
  };
}
