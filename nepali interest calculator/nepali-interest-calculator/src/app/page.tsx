import React, { useState, useEffect } from 'react';
import { Calendar, TrendingUp, Clock, Info, Save, Trash2, FileText, BookOpen, Menu, X } from 'lucide-react';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface CalculatorInputs {
  principal: string;
  interestRate: string;
  startDate: string;
  endDate: string;
}

interface CalculationResult {
  finalAmount: number;
  totalInterest: number;
  timeDuration: {
    years: number;
    months: number;
    days: number;
  };
  breakdown: BreakdownEntry[];
}

interface BreakdownEntry {
  period: string;
  startingPrincipal: number;
  interest: number;
  endingAmount: number;
  details: string;
}

interface SavedCalculation {
  id: string;
  timestamp: number;
  inputs: CalculatorInputs;
  result: CalculationResult;
  name: string;
}

// ============================================================================
// BS (BIKRAM SAMBAT) DATE UTILITIES
// ============================================================================

const BS_DAYS_PER_MONTH = 30;
const BS_MONTHS_PER_YEAR = 12;
const BS_DAYS_PER_YEAR = 365;

function parseBSDate(dateString: string): { year: number; month: number; day: number } {
  const [year, month, day] = dateString.split('-').map(Number);
  return { year, month, day };
}

function calculateBSDateDifference(
  startDateStr: string,
  endDateStr: string
): { years: number; months: number; days: number } {
  const start = parseBSDate(startDateStr);
  const end = parseBSDate(endDateStr);

  if (
    end.year < start.year ||
    (end.year === start.year && end.month < start.month) ||
    (end.year === start.year && end.month === start.month && end.day < start.day)
  ) {
    throw new Error('End date must be after start date');
  }

  let years = end.year - start.year;
  let months = end.month - start.month;
  let days = end.day - start.day;

  if (days < 0) {
    months--;
    days += BS_DAYS_PER_MONTH;
  }

  if (months < 0) {
    years--;
    months += BS_MONTHS_PER_YEAR;
  }

  return { years, months, days };
}

// ============================================================================
// NEPALI INTEREST CALCULATION LOGIC
// ============================================================================

function calculateNepaliInterest(
  principal: number,
  interestRate: number,
  startDate: string,
  endDate: string
): CalculationResult {
  if (principal <= 0) throw new Error('Principal must be greater than 0');
  if (interestRate < 0) throw new Error('Interest rate cannot be negative');

  const dateDiff = calculateBSDateDifference(startDate, endDate);
  
  const isMonthlyRate = interestRate < 10;
  const monthlyRate = isMonthlyRate ? interestRate : interestRate / 12;
  const annualRate = isMonthlyRate ? interestRate * 12 : interestRate;

  const breakdown: BreakdownEntry[] = [];
  let currentPrincipal = principal;

  for (let year = 1; year <= dateDiff.years; year++) {
    const yearlyInterest = (currentPrincipal * annualRate) / 100;
    const newAmount = currentPrincipal + yearlyInterest;

    breakdown.push({
      period: `Year ${year}`,
      startingPrincipal: currentPrincipal,
      interest: yearlyInterest,
      endingAmount: newAmount,
      details: `${currentPrincipal.toFixed(2)} × ${annualRate}% = ${yearlyInterest.toFixed(2)}`,
    });

    currentPrincipal = newAmount;
  }

  if (dateDiff.months > 0 || dateDiff.days > 0) {
    const monthlyInterestAmount = (currentPrincipal * monthlyRate) / 100;
    const monthsInterest = monthlyInterestAmount * dateDiff.months;
    
    const dailyInterestAmount = monthlyInterestAmount / BS_DAYS_PER_MONTH;
    const daysInterest = dailyInterestAmount * dateDiff.days;
    
    const partialInterest = monthsInterest + daysInterest;
    const newAmount = currentPrincipal + partialInterest;

    const periodLabel = [];
    if (dateDiff.months > 0) periodLabel.push(`${dateDiff.months} month${dateDiff.months > 1 ? 's' : ''}`);
    if (dateDiff.days > 0) periodLabel.push(`${dateDiff.days} day${dateDiff.days > 1 ? 's' : ''}`);

    let details = '';
    if (dateDiff.months > 0) {
      details += `${dateDiff.months} months: ${monthlyInterestAmount.toFixed(2)} × ${dateDiff.months} = ${monthsInterest.toFixed(2)}`;
    }
    if (dateDiff.days > 0) {
      if (details) details += ', ';
      details += `${dateDiff.days} days: ${dailyInterestAmount.toFixed(2)} × ${dateDiff.days} = ${daysInterest.toFixed(2)}`;
    }

    breakdown.push({
      period: periodLabel.join(' '),
      startingPrincipal: currentPrincipal,
      interest: partialInterest,
      endingAmount: newAmount,
      details: details,
    });

    currentPrincipal = newAmount;
  }

  const finalAmount = currentPrincipal;
  const totalInterest = finalAmount - principal;

  return {
    finalAmount: Math.round(finalAmount * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    timeDuration: dateDiff,
    breakdown,
  };
}

// ============================================================================
// REACT COMPONENT
// ============================================================================

export default function NepaliInterestCalculator() {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    principal: '100000',
    interestRate: '3',
    startDate: '2078-01-01',
    endDate: '2080-04-04',
  });

  const [result, setResult] = useState<CalculationResult | null>(null);
  const [error, setError] = useState<string>('');
  const [savedCalculations, setSavedCalculations] = useState<SavedCalculation[]>([]);
  const [currentView, setCurrentView] = useState<'calculator' | 'saved' | 'about' | 'started'>('calculator');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('nepaliInterestCalculations');
    if (saved) {
      try {
        setSavedCalculations(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load saved calculations');
      }
    }
  }, []);

  const handleInputChange = (field: keyof CalculatorInputs, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleCalculate = () => {
    try {
      setError('');

      const principal = parseFloat(inputs.principal);
      const interestRate = parseFloat(inputs.interestRate);

      if (isNaN(principal) || principal <= 0) {
        throw new Error('Please enter a valid principal amount greater than 0');
      }
      if (isNaN(interestRate) || interestRate < 0) {
        throw new Error('Please enter a valid interest rate (0 or greater)');
      }

      const datePattern = /^\d{4}-\d{2}-\d{2}$/;
      if (!datePattern.test(inputs.startDate) || !datePattern.test(inputs.endDate)) {
        throw new Error('Please enter dates in YYYY-MM-DD format (BS calendar)');
      }

      const calculationResult = calculateNepaliInterest(
        principal,
        interestRate,
        inputs.startDate,
        inputs.endDate
      );

      setResult(calculationResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during calculation');
      setResult(null);
    }
  };

  const handleSaveCalculation = () => {
    if (!result) return;

    const name = prompt('Enter a name for this calculation:', `Calculation ${new Date().toLocaleDateString()}`);
    if (!name) return;

    const newCalculation: SavedCalculation = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      inputs,
      result,
      name,
    };

    const updated = [...savedCalculations, newCalculation];
    setSavedCalculations(updated);
    localStorage.setItem('nepaliInterestCalculations', JSON.stringify(updated));
    alert('Calculation saved successfully!');
  };

  const handleLoadCalculation = (calc: SavedCalculation) => {
    setInputs(calc.inputs);
    setResult(calc.result);
    setCurrentView('calculator');
    setMobileMenuOpen(false);
  };

  const handleDeleteCalculation = (id: string) => {
    if (!confirm('Are you sure you want to delete this calculation?')) return;

    const updated = savedCalculations.filter((c) => c.id !== id);
    setSavedCalculations(updated);
    localStorage.setItem('nepaliInterestCalculations', JSON.stringify(updated));
  };

  const NavButton = ({ view, icon: Icon, label }: { view: typeof currentView; icon: any; label: string }) => (
    <button
      onClick={() => {
        setCurrentView(view);
        setMobileMenuOpen(false);
      }}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
        currentView === view
          ? 'bg-red-600 text-white'
          : 'bg-white text-gray-700 hover:bg-red-50'
      }`}
    >
      <Icon className="w-4 h-4" />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100">
      {/* Google AdSense Placeholder - Top */}
      <div className="bg-gray-200 border-2 border-dashed border-gray-400 p-4 text-center text-gray-600">
        <p className="text-sm font-medium">Advertisement Space (Google AdSense)</p>
        <p className="text-xs mt-1">Place your AdSense code here</p>
      </div>

      <div className="py-8 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
              <TrendingUp className="w-10 h-10 text-red-600" />
              Nepali Interest Calculator
            </h1>
            <p className="text-gray-700 font-medium">नेपाली ब्याज गणना (BS Calendar)</p>
            <p className="text-gray-600 text-sm mt-1">Compound Interest with Nepali Banking Method</p>
          </div>

          {/* Navigation */}
          <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
            <div className="md:hidden flex justify-between items-center">
              <span className="font-semibold text-gray-900">Menu</span>
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2">
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            <div className={`${mobileMenuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row gap-2 mt-4 md:mt-0`}>
              <NavButton view="calculator" icon={TrendingUp} label="Calculator" />
              <NavButton view="saved" icon={Save} label={`Saved (${savedCalculations.length})`} />
              <NavButton view="started" icon={BookOpen} label="Getting Started" />
              <NavButton view="about" icon={FileText} label="About" />
            </div>
          </div>

          {/* Main Content - Calculator View */}
          {currentView === 'calculator' && (
            <>
              <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Principal Amount (रु)
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-3.5 text-gray-500 font-medium">रु</span>
                      <input
                        type="number"
                        value={inputs.principal}
                        onChange={(e) => handleInputChange('principal', e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none transition"
                        placeholder="100000"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Interest Rate (ब्याज दर)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={inputs.interestRate}
                        onChange={(e) => handleInputChange('interestRate', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none transition"
                        placeholder="3"
                        min="0"
                        step="0.01"
                      />
                      <span className="absolute right-4 top-3.5 text-gray-500">%</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">If rate &lt; 10, it's treated as monthly rate</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Start Date (BS)
                    </label>
                    <input
                      type="text"
                      value={inputs.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none transition font-mono"
                      placeholder="2078-01-01"
                    />
                    <p className="text-xs text-gray-500 mt-1">Format: YYYY-MM-DD</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      End Date (BS)
                    </label>
                    <input
                      type="text"
                      value={inputs.endDate}
                      onChange={(e) => handleInputChange('endDate', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none transition font-mono"
                      placeholder="2080-04-04"
                    />
                    <p className="text-xs text-gray-500 mt-1">Format: YYYY-MM-DD</p>
                  </div>
                </div>

                {error && (
                  <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                    <p className="font-semibold">Error</p>
                    <p>{error}</p>
                  </div>
                )}

                <button
                  onClick={handleCalculate}
                  className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-lg transition transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                >
                  गणना गर्नुहोस् (Calculate)
                </button>
              </div>

              {result && (
                <>
                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
                      <p className="text-sm text-gray-600 mb-1">Final Amount (कुल रकम)</p>
                      <p className="text-3xl font-bold text-gray-900">
                        रु {result.finalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
                      <p className="text-sm text-gray-600 mb-1">Total Interest (कुल ब्याज)</p>
                      <p className="text-3xl font-bold text-blue-600">
                        रु {result.totalInterest.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
                      <p className="text-sm text-gray-600 mb-1">
                        <Clock className="w-4 h-4 inline mr-1" />
                        Time Duration (अवधि)
                      </p>
                      <p className="text-xl font-bold text-gray-900">
                        {result.timeDuration.years} वर्ष {result.timeDuration.months} महिना {result.timeDuration.days} दिन
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {result.timeDuration.years}y {result.timeDuration.months}m {result.timeDuration.days}d
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end mb-4">
                    <button
                      onClick={handleSaveCalculation}
                      className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition shadow-lg"
                    >
                      <Save className="w-5 h-5" />
                      Save Calculation
                    </button>
                  </div>

                  <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Detailed Breakdown (विस्तृत विवरण)</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b-2 border-gray-200">
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Period</th>
                            <th className="text-right py-3 px-4 font-semibold text-gray-700">Starting Principal</th>
                            <th className="text-right py-3 px-4 font-semibold text-gray-700">Interest Earned</th>
                            <th className="text-right py-3 px-4 font-semibold text-gray-700">Ending Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {result.breakdown.map((entry, index) => (
                            <React.Fragment key={index}>
                              <tr className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="py-3 px-4 font-medium text-gray-900">{entry.period}</td>
                                <td className="py-3 px-4 text-right text-gray-700">
                                  रु {entry.startingPrincipal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                </td>
                                <td className="py-3 px-4 text-right text-green-600 font-semibold">
                                  +रु {entry.interest.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                </td>
                                <td className="py-3 px-4 text-right text-gray-900 font-bold">
                                  रु {entry.endingAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                </td>
                              </tr>
                              {entry.details && (
                                <tr className="border-b border-gray-100">
                                  <td colSpan={4} className="py-2 px-4 text-sm text-gray-600 bg-gray-50">
                                    Calculation: {entry.details}
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                    <div className="flex items-start">
                      <Info className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-blue-900">
                        <p className="font-semibold mb-1">Calculation Method (गणना विधि)</p>
                        <p className="mb-2">
                          <strong>Yearly Compounding:</strong> Interest = Principal × Rate% × 12 (annual), added to principal each year
                        </p>
                        <p className="mb-2">
                          <strong>Monthly/Daily:</strong> Monthly rate = Annual rate ÷ 12, Daily rate = Monthly rate ÷ 30
                        </p>
                        <p>
                          <strong>Example:</strong> 100,000 @ 3% for 2y 3m 4d = Year1: 36,000 + Year2: 48,960 + 3m&4d: 17,386.24 = Total: रु 202,346.24
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {/* Saved Calculations View */}
          {currentView === 'saved' && (
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Saved Calculations</h2>
              {savedCalculations.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Save className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No saved calculations yet</p>
                  <p className="text-sm mt-2">Calculate and save your results to access them later</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {savedCalculations.map((calc) => (
                    <div key={calc.id} className="border-2 border-gray-200 rounded-lg p-4 hover:border-red-300 transition"></div>