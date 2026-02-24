import { Employee } from './types';
import { safeLower, titleCase, formatNumber } from './formatters';

interface ChatResponse {
  text: string;
  data?: any[];
}

function findByName(employees: Employee[], name: string): Employee[] {
  const lower = name.toLowerCase().trim();
  return employees.filter(e => {
    const eName = (e.employee_name || '').toLowerCase();
    return eName.includes(lower);
  });
}

export function processQuery(query: string, employees: Employee[], fyStart: Date, fyEnd: Date): ChatResponse {
  const q = query.toLowerCase().trim();

  // Average CTC queries (must be checked BEFORE individual salary lookup)
  if (q.includes('average') && (q.includes('ctc') || q.includes('salary'))) {
    let filtered = [...employees];
    let description = 'all employees';

    if (q.includes('joiner') || q.includes('joined')) {
      filtered = filtered.filter(e =>
        e.date_of_joining && e.date_of_joining >= fyStart && e.date_of_joining <= fyEnd
      );
      description = 'joiners this FY';
    }

    if (q.includes('exit') || q.includes('left')) {
      filtered = filtered.filter(e =>
        e.date_of_exit && e.date_of_exit >= fyStart && e.date_of_exit <= fyEnd
      );
      description = 'exits this FY';
    }

    const sourceMatch = q.match(/from\s+(\w+)/i);
    if (sourceMatch) {
      const source = sourceMatch[1].toLowerCase();
      filtered = filtered.filter(e => safeLower(e.hiring_source) === source);
      description += ` from ${titleCase(source)}`;
    }

    if (q.includes('female')) {
      filtered = filtered.filter(e => safeLower(e.gender) === 'female');
      description = `female ${description}`;
    } else if (q.includes('male') && !q.includes('female')) {
      filtered = filtered.filter(e => safeLower(e.gender) === 'male');
      description = `male ${description}`;
    }

    const ctcs = filtered.filter(e => e.total_ctc_pa !== null).map(e => e.total_ctc_pa!);
    const avg = ctcs.length > 0 ? ctcs.reduce((s, v) => s + v, 0) / ctcs.length : 0;
    if (ctcs.length === 0) {
      return { text: `No matching employees found for: ${description}.` };
    }
    return { text: `Average CTC of ${description}: **₹ ${formatNumber(Math.round(avg))}** (₹ ${(avg / 1e5).toFixed(1)} L)\n\nBased on **${ctcs.length}** employees.` };
  }

  // Individual salary lookup
  if (q.includes('salary') || q.includes('ctc')) {
    const nameMatch = query.match(/(?:of|for)\s+(.+?)(?:\?|$)/i);
    if (nameMatch) {
      const matches = findByName(employees, nameMatch[1]);
      if (matches.length === 0) return { text: `No employee found matching "${nameMatch[1]}".` };
      if (matches.length > 1) {
        const names = matches.map(e => `- ${e.employee_name || 'Unknown'} (ID: ${e.employee_id || 'N/A'})`).join('\n');
        return { text: `Multiple employees found. Please specify:\n${names}` };
      }
      const emp = matches[0];
      const ctc = emp.total_ctc_pa;
      return {
        text: `**${emp.employee_name}**\n- Total CTC (PA): ₹ ${ctc ? formatNumber(ctc) : 'N/A'}`,
        data: [emp],
      };
    }
  }

  // List/filter queries
  if (q.includes('list') || q.includes('show') || q.includes('employees in')) {
    let filtered = [...employees];
    let description = 'employees';

    // Zone filter
    const zoneMatch = q.match(/(?:in|from)\s+(north|south|east|west)\s*zone/i);
    if (zoneMatch) {
      const zone = zoneMatch[1].toLowerCase();
      filtered = filtered.filter(e => safeLower(e.zone) === zone);
      description += ` in ${titleCase(zone)} zone`;
    }

    // Rating filter
    const ratingMatch = q.match(/rating\s+(excellent|good|average|poor|below average)/i);
    if (ratingMatch) {
      const rating = ratingMatch[1].toLowerCase();
      filtered = filtered.filter(e => safeLower(e.rating_25) === rating);
      description += ` with rating ${titleCase(rating)}`;
    }

    // Gender filter
    if (q.includes('female')) {
      filtered = filtered.filter(e => safeLower(e.gender) === 'female');
      description += ' (Female)';
    } else if (q.includes('male') && !q.includes('female')) {
      filtered = filtered.filter(e => safeLower(e.gender) === 'male');
      description += ' (Male)';
    }

    // Sector filter
    const sectorMatch = q.match(/(?:in|from)\s+(it|finance|hr|operations|marketing|sales|engineering|admin)/i);
    if (sectorMatch) {
      const sector = sectorMatch[1].toLowerCase();
      filtered = filtered.filter(e => safeLower(e.employment_sector) === sector);
      description += ` in ${titleCase(sector)}`;
    }

    return {
      text: `Found **${formatNumber(filtered.length)}** ${description}.\n\n${filtered.slice(0, 10).map(e => `- ${e.employee_name || 'Unknown'} | ${e.zone || '-'} | Rating: ${e.rating_25 || '-'}`).join('\n')}${filtered.length > 10 ? `\n\n...and ${filtered.length - 10} more.` : ''}`,
      data: filtered.slice(0, 50),
    };
  }

  // Count queries
  if (q.includes('how many') || q.includes('count')) {
    let filtered = [...employees];
    let description = 'employees';

    if (q.includes('joiner') || q.includes('joined') || q.includes('new')) {
      filtered = filtered.filter(e =>
        e.date_of_joining && e.date_of_joining >= fyStart && e.date_of_joining <= fyEnd
      );
      description = 'joiners this FY';
    }

    if (q.includes('exit') || q.includes('left') || q.includes('attrition')) {
      filtered = filtered.filter(e =>
        e.date_of_exit && e.date_of_exit >= fyStart && e.date_of_exit <= fyEnd
      );
      description = 'exits this FY';
    }

    if (q.includes('female')) {
      filtered = filtered.filter(e => safeLower(e.gender) === 'female');
      description = `female ${description}`;
    } else if (q.includes('male') && !q.includes('female')) {
      filtered = filtered.filter(e => safeLower(e.gender) === 'male');
      description = `male ${description}`;
    }

    return { text: `There are **${formatNumber(filtered.length)}** ${description}.` };
  }

  // Default
  return {
    text: `I can help with HR data queries! Try:\n- "Show salary of [name]"\n- "List employees in East zone with rating excellent"\n- "How many female joiners this FY?"\n- "Average CTC of joiners from LinkedIn this FY?"`,
  };
}
