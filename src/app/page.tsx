"use client";

import React, { useState, useRef } from "react";
import {
  Calculator,
  BookOpen,
  Info,
  Menu,
  X,
  Copy,
  Check,
  TrendingUp,
  DollarSign,
  Clock,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import type { CalculatorInputs, CalculationResult } from "@/lib/calculator";
import { calculateNepaliInterest } from "@/lib/calculator";

type ViewType = "calculator" | "started" | "about";

export default function NepaliInterestCalculator() {
  const [currentView, setCurrentView] = useState<ViewType>("calculator");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [inputs, setInputs] = useState<CalculatorInputs>({
    principal: "",
    interestRate: "",
    startDate: "",
    endDate: "",
  });
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [error, setError] = useState("");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [expandedBreakdown, setExpandedBreakdown] = useState(true);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Auto-format date with dashes (YYYY-MM-DD)
  const handleDateChange = (field: "startDate" | "endDate", value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, "");
    
    // Format with dashes
    let formatted = "";
    if (digits.length > 0) {
      formatted = digits.substring(0, 4); // Year
      if (digits.length > 4) {
        formatted += "-" + digits.substring(4, 6); // Month
        if (digits.length > 6) {
          formatted += "-" + digits.substring(6, 8); // Day
        }
      }
    }
    
    setInputs((p) => ({ ...p, [field]: formatted }));
  };

  const handleCalculate = () => {
    setError("");
    setResult(null);

    const calcResult = calculateNepaliInterest(inputs);

    if (typeof calcResult === "string") {
      setError(calcResult);
      return;
    }

    setResult(calcResult);

    // Auto-scroll to results on mobile
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    });
  };

  const handleReset = () => {
    setInputs({ principal: "", interestRate: "", startDate: "", endDate: "" });
    setResult(null);
    setError("");
  };

  const switchView = (view: ViewType) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
  };

  const formatNumber = (num: number | string) => {
    const n = typeof num === "string" ? parseFloat(num) : num;
    return new Intl.NumberFormat("en-NP", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(n);
  };

  const navItems: { key: ViewType; label: string; nepali: string; icon: React.ReactNode }[] = [
    { key: "calculator", label: "Calculator", nepali: "गणक", icon: <Calculator className="w-4 h-4" /> },
    { key: "started", label: "Getting Started", nepali: "सुरु गर्नुहोस्", icon: <BookOpen className="w-4 h-4" /> },
    { key: "about", label: "About", nepali: "बारेमा", icon: <Info className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-600 via-red-500 to-orange-700 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                <Calculator className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight leading-tight">
                  Nepali Interest Calculator
                </h1>
                <p className="text-xs text-orange-100 font-medium">
                  नेपाली ब्याज गणना v1.0
                </p>
              </div>
            </div>
            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => switchView(item.key)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    currentView === item.key
                      ? "bg-white/25 text-white shadow-sm"
                      : "text-orange-100 hover:bg-white/15 hover:text-white"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/15 transition"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
          {/* Mobile Nav */}
          {mobileMenuOpen && (
            <nav className="md:hidden mt-3 pb-2 border-t border-white/20 pt-3 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => switchView(item.key)}
                  className={`flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    currentView === item.key
                      ? "bg-white/25 text-white"
                      : "text-orange-100 hover:bg-white/15"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  <span className="text-xs opacity-75">({item.nepali})</span>
                </button>
              ))}
            </nav>
          )}
        </div>
      </header>

      {/* Ad Banner Top - Replace with your AdSense code */}
      <div className="bg-gray-100 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-center">
          {/* 
            ADSENSE INTEGRATION: Replace this div with your AdSense code
            Example:
            <ins className="adsbygoogle"
              style={{ display: "block" }}
              data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
              data-ad-slot="XXXXXXXXXX"
              data-ad-format="horizontal"
              data-full-width-responsive="true"></ins>
          */}
          <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg h-[90px] w-full max-w-[728px] flex items-center justify-center text-gray-400 text-sm">
            Advertisement Space (728×90)
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto px-4 py-6 w-full">
        {currentView === "calculator" && (
          <CalculatorView
            inputs={inputs}
            setInputs={setInputs}
            handleDateChange={handleDateChange}
            result={result}
            error={error}
            handleCalculate={handleCalculate}
            handleReset={handleReset}
            handleCopy={handleCopy}
            copiedField={copiedField}
            expandedBreakdown={expandedBreakdown}
            setExpandedBreakdown={setExpandedBreakdown}
            formatNumber={formatNumber}
            resultsRef={resultsRef}
          />
        )}
        {currentView === "started" && <GettingStartedView />}
        {currentView === "about" && <AboutView />}
      </main>

      {/* Ad Banner Bottom - Replace with your AdSense code */}
      <div className="bg-gray-100 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-center">
          {/* 
            ADSENSE INTEGRATION: Replace this div with your AdSense code
          */}
          <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg h-[90px] w-full max-w-[728px] flex items-center justify-center text-gray-400 text-sm">
            Advertisement Space (728×90)
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-slate-800 to-slate-900 text-slate-300 py-6">
        <div className="max-w-6xl mx-auto px-4 text-center space-y-2">
          <p className="text-sm">
            © {new Date().getFullYear()} Nepali Interest Calculator | नेपाली ब्याज गणना v1.0
          </p>
          <p className="text-xs text-slate-400">
            Built for Nepali financial calculations using Bikram Sambat calendar
          </p>
          <p className="text-sm text-slate-400">
            Made with ❤️ by{" "}
            <a
              href="https://bikashkumarsah.com.np"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white transition-colors"
            >
              Bikash Kumar Sah
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

// ============= CALCULATOR VIEW =============
interface CalculatorViewProps {
  inputs: CalculatorInputs;
  setInputs: React.Dispatch<React.SetStateAction<CalculatorInputs>>;
  handleDateChange: (field: "startDate" | "endDate", value: string) => void;
  result: CalculationResult | null;
  error: string;
  handleCalculate: () => void;
  handleReset: () => void;
  handleCopy: (text: string, field: string) => void;
  copiedField: string | null;
  expandedBreakdown: boolean;
  setExpandedBreakdown: (v: boolean) => void;
  formatNumber: (n: number | string) => string;
  resultsRef: React.RefObject<HTMLDivElement | null>;
}

function CalculatorView({
  inputs,
  setInputs,
  handleDateChange,
  result,
  error,
  handleCalculate,
  handleReset,
  handleCopy,
  copiedField,
  expandedBreakdown,
  setExpandedBreakdown,
  formatNumber,
  resultsRef,
}: CalculatorViewProps) {
  return (
    <div className="space-y-6">
      {/* Form */}
      <div className="bg-white rounded-2xl shadow-lg border border-orange-100 overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Interest Calculator | ब्याज गणक
          </h2>
          <p className="text-orange-100 text-sm mt-0.5">
            Enter your details below to calculate compound interest
          </p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Principal */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Principal Amount (मूलधन रकम)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-500 font-bold text-sm">
                  रु
                </span>
                <input
                  type="number"
                  value={inputs.principal}
                  onChange={(e) => setInputs((p) => ({ ...p, principal: e.target.value }))}
                  placeholder="e.g. 100000"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all text-lg"
                />
              </div>
            </div>

            {/* Interest Rate */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Interest Rate (ब्याज दर)
              </label>
              <div className="relative">
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-500 font-bold text-sm">
                  %
                </span>
                <input
                  type="number"
                  value={inputs.interestRate}
                  onChange={(e) => setInputs((p) => ({ ...p, interestRate: e.target.value }))}
                  placeholder="e.g. 3 (monthly) or 12 (annual)"
                  className="w-full pl-4 pr-10 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all text-lg"
                  step="0.01"
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">
                &lt;10 = Monthly rate | ≥10 = Annual rate (auto-detected)
              </p>
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Start Date (सुरु मिति) - BS
              </label>
              <input
                type="text"
                value={inputs.startDate}
                onChange={(e) => handleDateChange("startDate", e.target.value)}
                placeholder="YYYY-MM-DD (e.g. 2078-01-01)"
                maxLength={10}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all text-lg"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                End Date (अन्त्य मिति) - BS
              </label>
              <input
                type="text"
                value={inputs.endDate}
                onChange={(e) => handleDateChange("endDate", e.target.value)}
                placeholder="YYYY-MM-DD (e.g. 2080-06-15)"
                maxLength={10}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all text-lg"
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">
              ⚠️ {error}
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-wrap gap-3 mt-6">
            <button
              onClick={handleCalculate}
              className="flex-1 min-w-[200px] bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all animate-pulse-glow flex items-center justify-center gap-2 text-lg"
            >
              <Calculator className="w-5 h-5" />
              Calculate | गणना गर्नुहोस्
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-3.5 border-2 border-gray-300 text-gray-600 rounded-xl hover:bg-gray-50 transition font-medium"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div ref={resultsRef} className="space-y-5 scroll-mt-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ResultCard
              icon={<span className="font-bold text-lg leading-none antialiased select-none">रू</span>}
              label="Final Amount (कुल रकम)"
              value={`रु ${formatNumber(result.finalAmount)}`}
              color="green"
              onCopy={() => handleCopy(result.finalAmount.toFixed(2), "final")}
              copied={copiedField === "final"}
            />
            <ResultCard
              icon={<TrendingUp className="w-6 h-6 text-orange-600" />}
              label="Total Interest (कुल ब्याज)"
              value={`रु ${formatNumber(result.totalInterest)}`}
              color="orange"
              onCopy={() => handleCopy(result.totalInterest.toFixed(2), "interest")}
              copied={copiedField === "interest"}
            />
            <ResultCard
              icon={<Clock className="w-6 h-6 text-blue-600" />}
              label="Duration (अवधि)"
              value={`${result.timeDuration.years}y ${result.timeDuration.months}m ${result.timeDuration.days}d`}
              subtext={`${result.timeDuration.years} वर्ष ${result.timeDuration.months} महिना ${result.timeDuration.days} दिन`}
              color="blue"
            />
          </div>

          {/* Rate Info */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-4 flex flex-wrap gap-4 items-center text-sm">
            <div>
              <span className="text-slate-500">Annual Rate: </span>
              <span className="font-bold text-orange-700">{result.annualRate.toFixed(2)}%</span>
            </div>
            <div className="w-px h-5 bg-orange-300 hidden sm:block" />
            <div>
              <span className="text-slate-500">Monthly Rate: </span>
              <span className="font-bold text-orange-700">{result.monthlyRate.toFixed(2)}%</span>
            </div>
            <div className="w-px h-5 bg-orange-300 hidden sm:block" />
            <div>
              <span className="text-slate-500">Compounding: </span>
              <span className="font-bold text-orange-700">Yearly</span>
            </div>
          </div>

          {/* Breakdown Table */}
          <div className="bg-white rounded-2xl shadow-lg border border-orange-100 overflow-hidden">
            <button
              onClick={() => setExpandedBreakdown(!expandedBreakdown)}
              className="w-full flex items-center justify-between px-6 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white"
            >
              <h3 className="font-bold flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Year-by-Year Breakdown | वार्षिक विवरण
              </h3>
              {expandedBreakdown ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            {expandedBreakdown && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-orange-50 text-slate-700">
                      <th className="px-4 py-3 text-left font-semibold">Period (अवधि)</th>
                      <th className="px-4 py-3 text-right font-semibold">Starting (सुरु)</th>
                      <th className="px-4 py-3 text-right font-semibold">Interest (ब्याज)</th>
                      <th className="px-4 py-3 text-right font-semibold">Ending (अन्त्य)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.breakdown.map((row, i) => (
                      <tr key={i} className={`border-t border-gray-100 ${i % 2 === 0 ? "bg-white" : "bg-orange-50/30"}`}>
                        <td className="px-4 py-3 font-medium text-slate-800">{row.period}</td>
                        <td className="px-4 py-3 text-right text-slate-600">
                          रु {formatNumber(row.startingPrincipal)}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-green-700">
                          +रु {formatNumber(row.interest)}
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-orange-700">
                          रु {formatNumber(row.endingAmount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-orange-300 bg-orange-50 font-bold">
                      <td className="px-4 py-3 text-slate-800">Total</td>
                      <td className="px-4 py-3 text-right text-slate-600">
                        रु {formatNumber(inputs.principal || "0")}
                      </td>
                      <td className="px-4 py-3 text-right text-green-700">
                        +रु {formatNumber(result.totalInterest)}
                      </td>
                      <td className="px-4 py-3 text-right text-orange-700">
                        रु {formatNumber(result.finalAmount)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ============= RESULT CARD =============
function ResultCard({
  icon,
  label,
  value,
  subtext,
  color,
  onCopy,
  copied,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtext?: string;
  color: string;
  onCopy?: () => void;
  copied?: boolean;
}) {
  const borderColors: Record<string, string> = {
    green: "border-green-200 bg-gradient-to-br from-green-50 to-emerald-50",
    orange: "border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50",
    blue: "border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50",
  };

  return (
    <div className={`rounded-xl border-2 p-5 ${borderColors[color] || borderColors.orange} relative`}>
      <div className="flex items-start justify-between">
        <div className="bg-white rounded-lg p-2 shadow-sm">{icon}</div>
        {onCopy && (
          <button
            onClick={onCopy}
            className="text-slate-400 hover:text-slate-600 transition p-1"
            title="Copy value"
          >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          </button>
        )}
      </div>
      <p className="text-xs text-slate-500 mt-3 font-medium">{label}</p>
      <p className="text-xl font-bold text-slate-800 mt-1">{value}</p>
      {subtext && <p className="text-xs text-slate-400 mt-0.5">{subtext}</p>}
    </div>
  );
}

// ============= GETTING STARTED VIEW =============
function GettingStartedView() {
  const sections = [
    {
      title: "1. How to Use This Calculator | यो गणक कसरी प्रयोग गर्ने",
      content: (
        <div className="space-y-4">
          {[
            { step: "Step 1", text: "Enter the Principal Amount (मूलधन रकम) — the initial amount in Nepali Rupees (रु)." },
            { step: "Step 2", text: "Enter the Interest Rate (ब्याज दर) — will be auto-detected as monthly (<10) or annual (≥10)." },
            { step: "Step 3", text: "Enter the Start Date (सुरु मिति) — just type numbers, dashes are added automatically!" },
            { step: "Step 4", text: "Enter the End Date (अन्त्य मिति) in the same way." },
            { step: "Step 5", text: "Click 'Calculate | गणना गर्नुहोस्' to see results with year-by-year breakdown." },
          ].map((s, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="bg-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap mt-0.5">
                {s.step}
              </span>
              <p className="text-slate-700">{s.text}</p>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "2. Date Format Guide | मिति ढाँचा गाइड",
      content: (
        <div className="space-y-3">
          <p className="text-slate-700">
            This calculator uses the <strong>Bikram Sambat (BS)</strong> calendar system used in Nepal.
          </p>
          <div className="bg-slate-800 text-green-400 rounded-lg p-4 font-mono text-sm">
            <p>Format: YYYY-MM-DD (auto-formatted as you type)</p>
            <p className="mt-2">Examples:</p>
            <p className="text-gray-400">  Type: 20780101 → Shows: 2078-01-01</p>
            <p className="text-gray-400">  Type: 20800615 → Shows: 2080-06-15</p>
            <p className="text-gray-400">  Type: 20821230 → Shows: 2082-12-30</p>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <p className="text-sm text-orange-800 font-medium">
              ℹ️ Fixed Calendar: Each month = 30 days, Each year = 365 days (no leap years)
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "3. Interest Rate Guide | ब्याज दर गाइड",
      content: (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-bold text-blue-800 mb-2">Rate &lt; 10 → Monthly</h4>
              <p className="text-sm text-blue-700">
                If you enter a rate like <code className="bg-blue-100 px-1 rounded">3</code>, it is treated as 
                <strong> 3% per month</strong> = 36% annual rate.
              </p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-bold text-green-800 mb-2">Rate ≥ 10 → Annual</h4>
              <p className="text-sm text-green-700">
                If you enter a rate like <code className="bg-green-100 px-1 rounded">12</code>, it is treated as 
                <strong> 12% per year</strong> = 1% monthly rate.
              </p>
            </div>
          </div>
          <p className="text-sm text-slate-500">
            Formula: Annual Rate = Monthly Rate × 12
          </p>
        </div>
      ),
    },
    {
      title: "4. Sample Calculation | नमूना गणना",
      content: (
        <div className="space-y-3">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="font-mono text-sm text-slate-700">
              <strong>Input:</strong><br />
              Principal: रु 1,00,000<br />
              Interest Rate: 3% (monthly → 36% annual)<br />
              Start Date: 2078-01-01<br />
              End Date: 2080-04-04<br /><br />
              <strong>Duration:</strong> 2 years, 3 months, 3 days<br /><br />
              <strong>Year 1:</strong> 1,00,000 × 36% = रु 36,000 → Total: 1,36,000<br />
              <strong>Year 2:</strong> 1,36,000 × 36% = रु 48,960 → Total: 1,84,960<br />
              <strong>3 Months:</strong> 1,84,960 × 3% × 3 = रु 16,646.40<br />
              <strong>3 Days:</strong> (1,84,960 × 3% ÷ 30) × 3 = रु 554.88<br /><br />
              <strong>Final Amount: रु 2,02,161.28</strong><br />
              <strong>Total Interest: रु 1,02,161.28</strong>
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
        <BookOpen className="w-6 h-6 text-orange-500" />
        Getting Started | सुरु गर्नुहोस्
      </h2>
      {sections.map((section, i) => (
        <div key={i} className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
          <h3 className="font-bold text-slate-800 px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
            {section.title}
          </h3>
          <div className="px-6 py-5">{section.content}</div>
        </div>
      ))}
    </div>
  );
}

// ============= ABOUT VIEW =============
function AboutView() {
  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
        <Info className="w-6 h-6 text-orange-500" />
        About | बारेमा
      </h2>

      {/* Developer Info */}
      <SectionCard title="👨‍💻 Developer | विकासकर्ता">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg shrink-0">
            BK
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-slate-800">Bikash Kumar Sah</h3>
            <p className="text-slate-500 text-sm">विकास कुमार साह</p>
            <p className="text-slate-600 mt-2 text-sm">
              Full Stack Developer from Nepal, passionate about building useful tools and applications 
              that solve real-world problems for Nepali users.
            </p>
            <div className="flex flex-wrap gap-3 mt-4">
              <a
                href="https://bikashkumarsah.com.np"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-medium px-4 py-2 rounded-lg hover:from-orange-600 hover:to-red-600 transition shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                bikashkumarsah.com.np
              </a>
              <a
                href="mailto:contact@bikashkumarsah.com.np"
                className="inline-flex items-center gap-2 border-2 border-slate-300 text-slate-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-50 transition"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email
              </a>
            </div>
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-700">
                💡 <strong>Have feedback or suggestions?</strong> I would love to hear from you! 
                Feel free to reach out via email or visit my website.
              </p>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Purpose */}
      <SectionCard title="🎯 Purpose & Vision | उद्देश्य र दृष्टिकोण">
        <p className="text-slate-700">
          The Nepali Interest Calculator is designed to provide Nepali individuals, businesses, and financial professionals
          with an accurate, free, and easy-to-use compound interest calculator that follows local financial standards
          and the Bikram Sambat calendar system.
        </p>
        <p className="text-slate-600 mt-2 text-sm">
          Our vision is to become the most trusted financial calculation tool in Nepal, helping millions
          of people make informed financial decisions.
        </p>
      </SectionCard>

      {/* Key Features */}
      <SectionCard title="✨ Key Features | मुख्य विशेषताहरू">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            "BS Calendar Support",
            "Auto Rate Detection",
            "Yearly Compounding",
            "Year-by-Year Breakdown",
            "Auto Date Formatting",
            "Mobile Responsive",
            "Bilingual (EN + NE)",
            "Fast & Free to Use",
          ].map((feature, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-slate-700">
              <ArrowRight className="w-4 h-4 text-orange-500 shrink-0" />
              {feature}
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Calculation Method */}
      <SectionCard title="📐 Calculation Method | गणना विधि">
        <div className="space-y-3 text-sm text-slate-700">
          <div className="bg-slate-800 text-green-400 rounded-lg p-4 font-mono text-xs">
            <p>// Rate Auto-Detection</p>
            <p>if (rate &lt; 10) → Monthly Rate = rate, Annual = rate × 12</p>
            <p>if (rate ≥ 10) → Annual Rate = rate, Monthly = rate ÷ 12</p>
            <p className="mt-2">// Yearly Compounding</p>
            <p>Year Interest = Principal × Annual Rate%</p>
            <p>New Principal = Principal + Year Interest</p>
            <p className="mt-2">// Partial Periods</p>
            <p>Month Interest = Principal × Monthly Rate% × Months</p>
            <p>Day Interest = (Principal × Monthly Rate% ÷ 30) × Days</p>
          </div>
        </div>
      </SectionCard>

      {/* Privacy */}
      <SectionCard title="🔒 Privacy & Security | गोपनीयता र सुरक्षा">
        <ul className="list-disc list-inside space-y-2 text-sm text-slate-700">
          <li>All calculations happen in your browser</li>
          <li>No data is sent to any server</li>
          <li>No personal identification required</li>
          <li>Completely private and secure</li>
        </ul>
      </SectionCard>

      {/* Disclaimer */}
      <SectionCard title="⚠️ Disclaimer | अस्वीकरण">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
          <p>
            This calculator is for educational and informational purposes only. The calculations
            provided may differ from actual bank calculations. Always consult with your bank
            or financial advisor for exact interest calculations. We are not responsible for
            any financial decisions made based on this tool.
          </p>
        </div>
      </SectionCard>

      {/* Version */}
      <SectionCard title="📦 Version Information | संस्करण जानकारी">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-slate-500">Version</p>
            <p className="font-bold text-slate-800">1.0.0</p>
          </div>
          <div>
            <p className="text-slate-500">Calendar System</p>
            <p className="font-bold text-slate-800">Bikram Sambat (BS)</p>
          </div>
          <div>
            <p className="text-slate-500">Compounding</p>
            <p className="font-bold text-slate-800">Yearly</p>
          </div>
          <div>
            <p className="text-slate-500">Currency</p>
            <p className="font-bold text-slate-800">Nepali Rupees (रु)</p>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
      <h3 className="font-bold text-slate-800 px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
        {title}
      </h3>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}
