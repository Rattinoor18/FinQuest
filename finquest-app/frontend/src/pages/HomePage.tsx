import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  TrendingUp, 
  Cpu, 
  Bot, 
  PieChart as PieChartIcon, 
  Award, 
  AlertTriangle,
  Flame,
  CheckCircle2,
  TrendingDown,
  Activity,
  Quote,
  ChevronRight,
  Play,
  RotateCcw
} from 'lucide-react';
import { PageRoute, LabType } from '../types';

interface HomePageProps {
  onNavigate: (page: PageRoute) => void;
  onLaunchLab: (lab: LabType) => void;
  xp: number;
  healthScore: number;
  completedModulesCount: number;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onLaunchLab,
  xp,
  healthScore,
  completedModulesCount
}) => {
  // Live 10-Year Stock Trajectory Dataset (2016 to 2026 Real Market History)
  const stock10YearData = [
    { year: '2016', price: 7850, label: 'Demotes & GST' },
    { year: '2017', price: 10400, label: 'Bull Run' },
    { year: '2018', price: 10900, label: 'Midcap Dip' },
    { year: '2019', price: 12150, label: 'Pre-Covid High' },
    { year: '2020', price: 7600, label: 'Covid Panic Crash' },
    { year: '2021', price: 17350, label: 'Liquidity Surge' },
    { year: '2022', price: 18100, label: 'Global Inflation' },
    { year: '2023', price: 21700, label: 'Retail SIP Boom' },
    { year: '2024', price: 24200, label: 'Institutional Inflow' },
    { year: '2025', price: 24850, label: 'Nifty ATH' }
  ];

  // Animated Loop Progress State
  const [loopProgress, setLoopProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setLoopProgress(prev => (prev >= 100 ? 0 : prev + 0.8));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Famous Financial Quotes Dataset with Author Details
  const financialQuotes = [
    {
      quote: "Rule No. 1: Never lose money. Rule No. 2: Never forget rule No. 1.",
      author: "Warren Buffett",
      title: "Chairman & CEO, Berkshire Hathaway",
      category: "RISK MANAGEMENT"
    },
    {
      quote: "The investor's chief problem — and even his worst enemy — is likely to be himself.",
      author: "Benjamin Graham",
      title: "Father of Value Investing & Author of Intelligent Investor",
      category: "BEHAVIORAL FINANCE"
    },
    {
      quote: "The big money is not in the buying and selling, but in the waiting.",
      author: "Charlie Munger",
      title: "Vice Chairman, Berkshire Hathaway",
      category: "COMPOUNDING MASTERY"
    },
    {
      quote: "Know what you own, and know why you own it.",
      author: "Peter Lynch",
      title: "Legendary Manager, Fidelity Magellan Fund",
      category: "PORTFOLIO DISCIPLINE"
    }
  ];

  const [activeQuoteIndex, setActiveQuoteIndex] = useState(0);

  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setActiveQuoteIndex(prev => (prev + 1) % financialQuotes.length);
    }, 6000);
    return () => clearInterval(quoteInterval);
  }, []);

  const quickLabs = [
    {
      id: 'budgeting' as LabType,
      title: '50/30/20 Budgeting Lab',
      desc: 'Interactive salary allocator: Needs vs Wants vs Wealth.',
      icon: PieChartIcon,
      badge: 'CASHFLOW'
    },
    {
      id: 'real_return' as LabType,
      title: 'Real Return vs Inflation',
      desc: 'Discover why nominal 7% FDs lose -1.1% real wealth to tax & inflation.',
      icon: TrendingUp,
      badge: 'TAX DRAG'
    },
    {
      id: 'sip_compounding' as LabType,
      title: '30-Yr SIP & Delay Cost',
      desc: 'Simulate Rule of 72 and the staggering ₹4+ Cr cost of waiting.',
      icon: Flame,
      badge: 'COMPOUNDING'
    },
    {
      id: 'debt_trap' as LabType,
      title: '42% Credit Card Trap',
      desc: 'Compare minimum due (15+ yrs debt) vs accelerated payoff.',
      icon: TrendingDown,
      badge: 'DEBT FREE'
    },
    {
      id: 'scam_radar' as LabType,
      title: 'Scam & Ponzi Radar',
      desc: 'Forensic inspection of fake Telegram tips & UPI fraud traps.',
      icon: AlertTriangle,
      badge: 'CYBER 1930'
    },
    {
      id: 'insurance_matrix' as LabType,
      title: 'Insurance Protection',
      desc: 'Pure Term Insurance (1.5 Cr cover) vs the ULIP bank trap.',
      icon: ShieldCheck,
      badge: 'SAFETY NET'
    },
  ];

  // Calculate current simulated index value based on loop progress
  const currentSimulatedIdx = Math.min(
    stock10YearData.length - 1,
    Math.floor((loopProgress / 100) * stock10YearData.length)
  );
  const currentPrice = stock10YearData[currentSimulatedIdx]?.price || 24850;
  const currentYear = stock10YearData[currentSimulatedIdx]?.year || '2026';
  const currentLabel = stock10YearData[currentSimulatedIdx]?.label || 'ATH';

  return (
    <div className="space-y-12 sm:space-y-16 pb-16 animate-fadeIn">
      {/* ================= HERO SHOWCASE SECTION (SHARPLINK STYLE) ================= */}
      <section className="relative pt-4 pb-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Hero Column */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-left">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 bg-blue-600/10 border border-blue-500/30 text-xs font-mono-tech text-cyan-400">
              <span className="w-2 h-2 bg-cyan-400 shadow-[0_0_8px_#00F0FF] animate-pulse" />
              <span>// FINQUEST FINANCIAL LITERACY PLATFORM</span>
            </div>

            {/* Giant SharpLink Style Headline */}
            <div className="space-y-1">
              <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter text-white uppercase leading-[0.92]">
                THE MARKET IS NOT A CLASSROOM.
              </h1>
              <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-cyan-400 to-white uppercase leading-[0.92]">
                FINQUEST IS.
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 max-w-xl font-medium leading-relaxed">
              <strong className="text-white">Learn Money by Managing Money.</strong> Drop into a simulated financial life complete with salary, rent, expenses, and real decisions — where you can make every expensive mistake without losing a single real rupee.
            </p>

            {/* Sharp CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onNavigate('voice-ai')}
                className="sharplink-btn-primary"
              >
                <span>LAUNCH AURELIUS INTELLIGENCE</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('courses')}
                className="sharplink-btn-secondary"
              >
                EXPLORE NISM ACADEMY
              </button>
            </div>
          </div>

          {/* Right Column: 10-Year Live Stock Graph Video Loop Graphic */}
          <div className="lg:col-span-5 relative flex items-center justify-center min-h-[380px] sm:min-h-[440px]">
            <div className="relative w-full max-w-md space-y-4">
              
              {/* 10-YEAR LIVE ANIMATED GRAPH VIDEO LOOP CONTAINER */}
              <div className="sharplink-card sharplink-pin p-6 space-y-4 border-l-4 border-l-cyan-400 shadow-2xl">
                <div className="flex justify-between items-center text-xs font-mono-tech">
                  <div className="flex items-center gap-2 text-cyan-400">
                    <Activity className="w-4 h-4 text-blue-500 animate-spin" />
                    <span className="font-bold">10-YEAR REAL STOCK DATASET LOOP</span>
                  </div>
                  <span className="px-2 py-0.5 bg-blue-500/20 text-cyan-300 border border-blue-400/30 text-[10px] flex items-center gap-1 font-mono-tech">
                    <Play className="w-3 h-3 fill-cyan-300" /> LIVE LOOP
                  </span>
                </div>

                {/* Ticker Metric Header */}
                <div className="flex justify-between items-end border-b border-slate-800 pb-3 font-mono-tech">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">NIFTY 50 REAL HISTORICAL TICK ({currentYear})</span>
                    <span className="text-3xl font-black text-white block">
                      {currentPrice.toLocaleString('en-IN')} <span className="text-xs text-emerald-400 font-normal">PTS</span>
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block uppercase">PHASE EVENT</span>
                    <span className="text-xs font-bold text-amber-400">{currentLabel}</span>
                  </div>
                </div>

                {/* Animated SVG Graph Video Canvas */}
                <div className="relative h-44 w-full bg-[#05080E] border border-slate-800 p-2 overflow-hidden flex flex-col justify-end">
                  {/* SVG Line path representing 10-year stock cycle */}
                  <svg className="w-full h-full" viewBox="0 0 300 120" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="stockGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#0066FF" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    
                    {/* Area shading */}
                    <polygon
                      points="0,120 0,90 30,70 60,65 90,50 120,110 150,40 180,35 210,20 240,10 270,5 300,5 300,120"
                      fill="url(#stockGrad)"
                    />

                    {/* Stock Price Curve Line */}
                    <path
                      d="M0,90 Q30,70 60,65 T120,110 T180,35 T240,10 T300,5"
                      fill="none"
                      stroke="#00F0FF"
                      strokeWidth="2.5"
                    />

                    {/* Moving Loop Progress Vertical Line & Tracer Point */}
                    <line
                      x1={`${(loopProgress / 100) * 300}`}
                      y1="0"
                      x2={`${(loopProgress / 100) * 300}`}
                      y2="120"
                      stroke="#38BDF8"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                    />
                    <circle
                      cx={`${(loopProgress / 100) * 300}`}
                      cy={`${120 - ((currentPrice - 7000) / 18000) * 110}`}
                      r="5"
                      fill="#00F0FF"
                      className="shadow-[0_0_12px_#00F0FF]"
                    />
                  </svg>

                  {/* Loop Progress Status Ribbon */}
                  <div className="w-full bg-slate-900 h-1 mt-2">
                    <div
                      style={{ width: `${loopProgress}%` }}
                      className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-75"
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ================= FAMOUS FINANCIAL QUOTES SECTION (WITH AUTHOR DETAILS) ================= */}
      <section className="sharplink-card sharplink-pin p-8 border-l-4 border-l-blue-600 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <span className="text-[10px] font-mono-tech text-cyan-400 font-bold uppercase tracking-widest flex items-center gap-2">
            <Quote className="w-4 h-4 text-blue-500" />
            // LEGENDARY FINANCIAL CODES & WISDOM
          </span>
          <span className="text-[10px] font-mono-tech text-slate-400 uppercase">
            QUOTE {activeQuoteIndex + 1} OF {financialQuotes.length}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center py-2">
          {/* Quote Text */}
          <div className="lg:col-span-8 space-y-2 text-left">
            <span className="text-xs font-mono-tech px-2.5 py-0.5 bg-blue-500/10 border border-blue-500/30 text-cyan-300 font-bold inline-block mb-2">
              {financialQuotes[activeQuoteIndex].category}
            </span>
            <p className="text-xl sm:text-2xl font-sans font-medium text-white italic leading-relaxed">
              "{financialQuotes[activeQuoteIndex].quote}"
            </p>
          </div>

          {/* Author Details Card */}
          <div className="lg:col-span-4 p-5 bg-[#05080E] border border-slate-800 text-left font-mono-tech space-y-1">
            <span className="text-[10px] text-slate-400 uppercase block">AUTHOR & CREDENTIALS</span>
            <span className="text-lg font-black text-cyan-400 block">
              {financialQuotes[activeQuoteIndex].author}
            </span>
            <span className="text-xs text-slate-300 block font-normal">
              {financialQuotes[activeQuoteIndex].title}
            </span>
          </div>
        </div>

        {/* Carousel Indicators */}
        <div className="flex gap-2 pt-2 border-t border-slate-800">
          {financialQuotes.map((q, idx) => (
            <button
              key={idx}
              onClick={() => setActiveQuoteIndex(idx)}
              className={`h-1.5 flex-1 transition-all ${
                activeQuoteIndex === idx ? 'bg-cyan-400' : 'bg-slate-800 hover:bg-slate-700'
              }`}
            />
          ))}
        </div>
      </section>

      {/* ================= PROMINENT USAGE & TRUST STATS BLOCK ================= */}
      <section className="sharplink-card sharplink-pin p-8 border-t-2 border-t-blue-500 shadow-2xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-slate-800">
          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-mono-tech font-black text-white block">
              100,000+
            </span>
            <span className="text-xs text-slate-400 font-mono-tech uppercase tracking-wider block">
              Active Learners
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-mono-tech font-black text-cyan-400 block">
              ₹10 CRORE+
            </span>
            <span className="text-xs text-slate-400 font-mono-tech uppercase tracking-wider block">
              Simulated Capital
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-mono-tech font-black text-emerald-400 block">
              99.4%
            </span>
            <span className="text-xs text-slate-400 font-mono-tech uppercase tracking-wider block">
              NISM Quiz Pass Rate
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-mono-tech font-black text-blue-400 block">
              5 MODULES
            </span>
            <span className="text-xs text-slate-400 font-mono-tech uppercase tracking-wider block">
              SEBI Course for Bharat
            </span>
          </div>
        </div>
      </section>

      {/* ================= 6 CONCEPT LABS RIBBON ================= */}
      <section className="space-y-6 pt-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="text-left">
            <span className="text-[10px] font-mono-tech text-cyan-400 font-bold block mb-1">
              // INTERACTIVE LABS
            </span>
            <h3 className="text-2xl font-black text-white uppercase tracking-tight">
              Financial Simulation Sandboxes
            </h3>
          </div>
          <button
            onClick={() => onNavigate('labs')}
            className="sharplink-btn-secondary"
          >
            VIEW ALL LABS
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickLabs.map((lab) => {
            const Icon = lab.icon;
            return (
              <div
                key={lab.id}
                onClick={() => onLaunchLab(lab.id)}
                className="sharplink-card sharplink-pin p-6 cursor-pointer group transition-all space-y-4 text-left"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div className="w-9 h-9 bg-slate-900 border border-slate-700 flex items-center justify-center group-hover:border-blue-500 transition-colors">
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-[9px] font-mono-tech px-2 py-0.5 bg-blue-500/10 border border-blue-500/30 text-cyan-300 font-bold">
                      {lab.badge}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors font-mono-tech">
                    {lab.title}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                    {lab.desc}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-cyan-400 font-semibold pt-3 border-t border-slate-800 group-hover:text-white font-mono-tech">
                  <span className="uppercase tracking-widest text-[10px]">Open Lab</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
