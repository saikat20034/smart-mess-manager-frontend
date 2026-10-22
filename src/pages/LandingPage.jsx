import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Building2,
  UtensilsCrossed,
  Calculator,
  Receipt,
  Users,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  HelpCircle,
  Smartphone,
  ChevronDown,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { formatBDT } from '../utils/calculations';
import { ThemeToggle } from '../components/ThemeToggle';
import { HeroCarousel } from '../components/HeroCarousel';
import { Footer } from '../components/Footer';

export const LandingPage = () => {
  const { loginAsManager, loginAsMember } = useAuth();
  const navigate = useNavigate();

  // Interactive Live Calculator state on landing page
  const [calcMeals, setCalcMeals] = useState(120);
  const [calcBazar, setCalcBazar] = useState(4800);
  const [calcCook, setCalcCook] = useState(2500);
  const [calcMembers, setCalcMembers] = useState(5);

  const calculatedMealRate = calcMeals > 0 ? calcBazar / calcMeals : 0;
  const calculatedSharedPerMember = calcMembers > 0 ? calcCook / calcMembers : 0;
  // Sample student with 25 meals:
  const sampleStudentCost = (25 * calculatedMealRate) + calculatedSharedPerMember;

  const handleLaunchDemo = (role = 'manager') => {
    if (role === 'manager') {
      loginAsManager();
    } else {
      loginAsMember();
    }
    navigate('/dashboard');
  };

  // FAQ state
  const [openFaq, setOpenFaq] = useState(null);
  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const faqs = [
    {
      q: 'How is the meal rate calculated?',
      a: 'The meal rate is calculated purely from food and bazar expenses divided by the total meal units consumed in that month: Meal Rate = Total Bazar Expenses ÷ Total Meal Units. Shared bills like cook (khala) salary, gas cylinder, and WiFi are split equally among members.'
    },
    {
      q: 'Can members have half meals or guest meals?',
      a: 'Yes! The manager can configure breakfast (default 0.5 unit), lunch (1.0 unit), and dinner (1.0 unit), and enter custom units or guest meals with automated decimal precision.'
    },
    {
      q: 'How are bKash or Nagad deposits handled?',
      a: 'The mess manager records payments made by members via bKash, Nagad, Cash, or Bank Transfer along with optional transaction IDs (TrxID). The net balance updates automatically.'
    },
    {
      q: 'What happens at the end of the month?',
      a: 'The manager generates a Monthly Settlement Sheet. The system automatically reconciles meal costs, shared bills, and deposits to compute exact payable or refundable balances for every resident, which can be printed or exported as CSV.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      {/* Top Navigation */}
      <nav className="border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md sticky top-0 z-40 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-xs">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="font-bold text-slate-900 dark:text-white text-base tracking-tight">
              Smart Mess <span className="text-emerald-500 dark:text-emerald-400">Manager</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <a href="#features" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Features</a>
            <a href="#calculator" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Live Rate Calculator</a>
            <a href="#how-it-works" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">How It Works</a>
            <a href="#faqs" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">FAQs</a>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle size="sm" showLabel={false} />
            <Link
              to="/register"
              className="flex items-center gap-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <span>Get Started</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 text-xs font-medium mb-6">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span>Built specifically for Bangladeshi Bachelor Messes, Hostels & Shared Flats</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight">
            Manage Your Mess.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
              Simplify Your Life.
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Eliminate messy paper khata notebooks and calculation arguments. Track daily meals, bazar expenses, bKash advances, and automated meal rates with total financial transparency.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => handleLaunchDemo('manager')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-semibold text-sm px-6 py-3 rounded-xl shadow-md transition-all cursor-pointer"
            >
              <span>Explore Instant Demo (No signup)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <Link
              to="/register"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-sm px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs transition-all"
            >
              <span>Start Managing Your Mess</span>
            </Link>
          </div>

          <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">
            No credit card needed • Ready for bKash, Nagad & Bangladeshi Taka (৳)
          </p>

          {/* Interactive Hero Carousel with Curated Images */}
          <HeroCarousel onLaunchDemo={handleLaunchDemo} />
        </div>
      </section>

      {/* Interactive Live Meal Rate Calculator Simulation */}
      <section id="calculator" className="py-12 bg-white dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Interactive Meal Rate Simulator
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Try the calculation logic live. Adjust meals, grocery costs, and cook salary to see real-time BDT results.
            </p>
          </div>

          <div className="bg-slate-900 dark:bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Sliders */}
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-300">Total Mess Meals (This Month):</span>
                  <span className="font-mono text-emerald-400 font-bold">{calcMeals} meals</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="300"
                  step="5"
                  value={calcMeals}
                  onChange={(e) => setCalcMeals(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-300">Food & Bazar Expenses:</span>
                  <span className="font-mono text-emerald-400 font-bold">{formatBDT(calcBazar)}</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="20000"
                  step="100"
                  value={calcBazar}
                  onChange={(e) => setCalcBazar(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-300">Shared Bills (Cook Khala, Gas, WiFi):</span>
                  <span className="font-mono text-indigo-400 font-bold">{formatBDT(calcCook)}</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="10000"
                  step="100"
                  value={calcCook}
                  onChange={(e) => setCalcCook(Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-300">Mess Residents Count:</span>
                  <span className="font-mono text-slate-200 font-bold">{calcMembers} members</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="15"
                  step="1"
                  value={calcMembers}
                  onChange={(e) => setCalcMembers(Number(e.target.value))}
                  className="w-full accent-slate-400 cursor-pointer"
                />
              </div>
            </div>

            {/* Live Calculation Output Card */}
            <div className="bg-slate-800/90 rounded-xl p-6 border border-slate-700 space-y-4">
              <div className="border-b border-slate-700/80 pb-3">
                <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold block">
                  Calculated Meal Rate
                </span>
                <div className="text-3xl font-bold font-mono text-emerald-400 mt-1">
                  {formatBDT(calculatedMealRate)} <span className="text-xs text-slate-400 font-normal">/ meal</span>
                </div>
                <span className="text-[11px] text-slate-400 mt-0.5 block">
                  Formula: {formatBDT(calcBazar)} ÷ {calcMeals} meal units
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Shared Overhead / Member:</span>
                  <span className="font-mono font-semibold text-indigo-300">{formatBDT(calculatedSharedPerMember)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Sample Resident (25 meals):</span>
                  <span className="font-mono font-bold text-white">{formatBDT(sampleStudentCost)}</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => handleLaunchDemo('manager')}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                >
                  Open Full Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-16 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Built for Real Student Mess Needs
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Everything required to maintain perfect transparency and eliminate hostel accounting friction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Daily Bulk Matrix</h3>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Record Breakfast (0.5), Lunch (1.0), and Dinner (1.0) for every member on a single screen with 1-click presets.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                <Receipt className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Bazar & Shared Overhead</h3>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Log groceries and divide shared bills like Cook Khala bill, WiFi, and LPG cylinders according to custom rules.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
                <Calculator className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Auto Meal Rate Calculation</h3>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Automated decimal precision in BDT. No more manual notebook mistakes or rounding disputes between members.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 flex items-center justify-center mb-4">
                <Smartphone className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">bKash & Nagad Tracking</h3>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Track deposit advances paid by members with transaction references (TrxID) and live balance updates.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Monthly Settlement & CSV</h3>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Finalize settlements with immutable audit snapshots, printable PDF-ready views, and downloadable Excel/CSV files.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Dual Roles & Privacy</h3>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Mess Managers have full edit rights; residents have real-time transparency into their personal food bill and balance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works (3 Steps) */}
      <section id="how-it-works" className="py-16 bg-slate-100/70 dark:bg-slate-900/40 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">How It Works in 3 Steps</h2>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Straightforward mess accounting designed for busy roommates and residents.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center mx-auto text-lg mb-4">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Create Mess & Invite</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2">
                Manager registers the mess and shares a 6-letter invite code with roommates to join instantly.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center mx-auto text-lg mb-4">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Log Daily Meals & Bazar</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2">
                Use the daily bulk matrix to record breakfast, lunch, and dinner, and log market expenses as they happen.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center mx-auto text-lg mb-4">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Auto Settle & Export</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2">
                At month-end, click Finalize Settlement to see who pays and who receives refunds with 100% transparency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section id="faqs" className="py-16 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Frequently Asked Questions</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Common questions about Bangladeshi mess management.</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-4 text-left font-semibold text-xs text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      openFaq === idx ? 'rotate-180 text-emerald-600' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Production-Level Multi-Column Footer */}
      <Footer onLaunchDemo={handleLaunchDemo} />
    </div>
  );
};
