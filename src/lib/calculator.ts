// Nepali Interest Calculator - BS Calendar Logic
// Fixed: 30 days/month, 365 days/year (no leap years)

export interface CalculatorInputs {
  principal: string;
  interestRate: string;
  startDate: string;
  endDate: string;
}

export interface TimeDuration {
  years: number;
  months: number;
  days: number;
}

export interface BreakdownEntry {
  period: string;
  startingPrincipal: number;
  interest: number;
  endingAmount: number;
  details: string;
}

export interface CalculationResult {
  finalAmount: number;
  totalInterest: number;
  timeDuration: TimeDuration;
  breakdown: BreakdownEntry[];
  annualRate: number;
  monthlyRate: number;
}

export function parseBSDate(dateStr: string): { year: number; month: number; day: number } | null {
  const parts = dateStr.trim().split("-");
  if (parts.length !== 3) return null;

  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);

  if (isNaN(year) || isNaN(month) || isNaN(day)) return null;
  if (year < 2000 || year > 2100) return null;
  if (month < 1 || month > 12) return null;
  if (day < 1 || day > 30) return null;

  return { year, month, day };
}

export function calculateBSDateDifference(
  start: { year: number; month: number; day: number },
  end: { year: number; month: number; day: number }
): TimeDuration {
  // Convert to total days using fixed 30 days/month, 12 months/year
  const startTotalDays = start.year * 360 + (start.month - 1) * 30 + start.day;
  const endTotalDays = end.year * 360 + (end.month - 1) * 30 + end.day;

  const totalDaysDiff = endTotalDays - startTotalDays;

  if (totalDaysDiff <= 0) {
    return { years: 0, months: 0, days: 0 };
  }

  // Calculate years, months, days
  let years = 0;
  let months = 0;
  let days = 0;

  // Work with date components
  let tempYear = start.year;
  let tempMonth = start.month;
  let tempDay = start.day;

  // Count full years
  while (true) {
    const nextYear = tempYear + 1;
    if (
      nextYear < end.year ||
      (nextYear === end.year && tempMonth < end.month) ||
      (nextYear === end.year && tempMonth === end.month && tempDay <= end.day)
    ) {
      years++;
      tempYear = nextYear;
    } else {
      break;
    }
  }

  // Count full months
  while (true) {
    let nextMonth = tempMonth + 1;
    let nextYear = tempYear;
    if (nextMonth > 12) {
      nextMonth = 1;
      nextYear = tempYear + 1;
    }
    if (
      nextYear < end.year ||
      (nextYear === end.year && nextMonth < end.month) ||
      (nextYear === end.year && nextMonth === end.month && tempDay <= end.day)
    ) {
      months++;
      tempMonth = nextMonth;
      tempYear = nextYear;
    } else {
      break;
    }
  }

  // Count remaining days
  const currentTotalDays = tempYear * 360 + (tempMonth - 1) * 30 + tempDay;
  const endTotal = end.year * 360 + (end.month - 1) * 30 + end.day;
  days = endTotal - currentTotalDays;

  if (days < 0) days = 0;

  return { years, months, days };
}

export function calculateNepaliInterest(inputs: CalculatorInputs): CalculationResult | string {
  const principal = parseFloat(inputs.principal);
  const rate = parseFloat(inputs.interestRate);

  if (isNaN(principal) || principal <= 0) {
    return "कृपया वैध मूलधन रकम प्रविष्ट गर्नुहोस् (Please enter a valid principal amount)";
  }

  if (isNaN(rate) || rate <= 0) {
    return "कृपया वैध ब्याज दर प्रविष्ट गर्नुहोस् (Please enter a valid interest rate)";
  }

  const startDate = parseBSDate(inputs.startDate);
  const endDate = parseBSDate(inputs.endDate);

  if (!startDate) {
    return "कृपया वैध सुरु मिति प्रविष्ट गर्नुहोस् (YYYY-MM-DD) (Please enter a valid start date)";
  }

  if (!endDate) {
    return "कृपया वैध अन्त्य मिति प्रविष्ट गर्नुहोस् (YYYY-MM-DD) (Please enter a valid end date)";
  }

  // Validate end date is after start date
  const startTotal = startDate.year * 360 + (startDate.month - 1) * 30 + startDate.day;
  const endTotal = endDate.year * 360 + (endDate.month - 1) * 30 + endDate.day;

  if (endTotal <= startTotal) {
    return "अन्त्य मिति सुरु मिति पछि हुनुपर्छ (End date must be after start date)";
  }

  // Auto-detect rate type: < 10 → Monthly, ≥ 10 → Annual
  let annualRate: number;
  let monthlyRate: number;

  if (rate < 10) {
    // Monthly rate given
    monthlyRate = rate;
    annualRate = rate * 12;
  } else {
    // Annual rate given
    annualRate = rate;
    monthlyRate = rate / 12;
  }

  const duration = calculateBSDateDifference(startDate, endDate);

  const breakdown: BreakdownEntry[] = [];
  let currentPrincipal = principal;
  let totalInterest = 0;

  // Calculate interest for each full year (yearly compounding)
  for (let i = 0; i < duration.years; i++) {
    const yearInterest = currentPrincipal * (annualRate / 100);
    const roundedInterest = Math.round(yearInterest * 100) / 100;

    breakdown.push({
      period: `Year ${i + 1} (वर्ष ${i + 1})`,
      startingPrincipal: Math.round(currentPrincipal * 100) / 100,
      interest: roundedInterest,
      endingAmount: Math.round((currentPrincipal + roundedInterest) * 100) / 100,
      details: `${currentPrincipal.toFixed(2)} × ${annualRate.toFixed(2)}% = ${roundedInterest.toFixed(2)}`,
    });

    totalInterest += roundedInterest;
    currentPrincipal += roundedInterest;
  }

  // Calculate interest for remaining months
  if (duration.months > 0) {
    const monthInterestRate = monthlyRate / 100;
    const monthsInterest = currentPrincipal * monthInterestRate * duration.months;
    const roundedMonthsInterest = Math.round(monthsInterest * 100) / 100;

    breakdown.push({
      period: `${duration.months} Month(s) (${duration.months} महिना)`,
      startingPrincipal: Math.round(currentPrincipal * 100) / 100,
      interest: roundedMonthsInterest,
      endingAmount: Math.round((currentPrincipal + roundedMonthsInterest) * 100) / 100,
      details: `${currentPrincipal.toFixed(2)} × ${monthlyRate.toFixed(4)}% × ${duration.months} = ${roundedMonthsInterest.toFixed(2)}`,
    });

    totalInterest += roundedMonthsInterest;
    currentPrincipal += roundedMonthsInterest;
  }

  // Calculate interest for remaining days
  if (duration.days > 0) {
    const dailyInterest = (currentPrincipal * (monthlyRate / 100)) / 30;
    const daysInterest = dailyInterest * duration.days;
    const roundedDaysInterest = Math.round(daysInterest * 100) / 100;

    breakdown.push({
      period: `${duration.days} Day(s) (${duration.days} दिन)`,
      startingPrincipal: Math.round(currentPrincipal * 100) / 100,
      interest: roundedDaysInterest,
      endingAmount: Math.round((currentPrincipal + roundedDaysInterest) * 100) / 100,
      details: `(${currentPrincipal.toFixed(2)} × ${monthlyRate.toFixed(4)}% ÷ 30) × ${duration.days} = ${roundedDaysInterest.toFixed(2)}`,
    });

    totalInterest += roundedDaysInterest;
    currentPrincipal += roundedDaysInterest;
  }

  const finalAmount = Math.round(currentPrincipal * 100) / 100;
  totalInterest = Math.round(totalInterest * 100) / 100;

  return {
    finalAmount,
    totalInterest,
    timeDuration: duration,
    breakdown,
    annualRate,
    monthlyRate,
  };
}
