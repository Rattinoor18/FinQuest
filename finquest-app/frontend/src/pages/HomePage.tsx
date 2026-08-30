import React from 'react';
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
  DollarSign,
  TrendingDown,
  Shield,
  Zap,
  Activity
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
  const quickLabs = [
    {
      id: 'budgeting' as LabType,
      title: '50/30/20 Budgeting Lab',
      desc: 'Interactive salary allocator: Needs vs Wants vs Wealth.',
      icon: PieChartIcon,
      badge: 'Cashflow'
    },
    {
      id: 'real_return' as LabType,
      title: 'Real Return vs Inflation',
      desc: 'Discover why nominal 7% FDs lose -1.1% real wealth to tax & inflation.',
      icon: TrendingUp,
      badge: 'Tax Drag'
    },
    {
      id: 'sip_compounding' as LabType,
      title: '30-Yr SIP & Delay Cost',
      desc: 'Simulate Rule of 72 and the staggering ₹4+ Cr cost of waiting.',
      icon: Flame,
      badge: 'Compounding'
    },
    {
      id: 'debt_trap' as LabType,
      title: '42% Credit Card Trap',
      desc: 'Compare minimum due (15+ yrs debt) vs accelerated payoff.',
      icon: TrendingDown,
      badge: 'Debt Free'
    },
    {
      id: 'scam_radar' as LabType,
      title: 'Scam & Ponzi Radar',
      desc: 'Forensic inspection of fake Telegram tips & UPI fraud traps.',
      icon: AlertTriangle,
      badge: 'Cyber 1930'
    },
    {
      id: 'insurance_matrix' as LabType,
      title: 'Insurance Protection',
      desc: 'Pure Term Insurance (1.5 Cr cover) vs the ULIP bank trap.',
      icon: ShieldCheck,
      badge: 'Safety Net'
    },
  ];

  return (
    <div className="space-y-12 sm:space-y-16 pb-16 animate-fadeIn">
      {/* ================= HERO SHOWCASE SECTION (PITCH DECK ALIGNED) ================= */}
      <section className="relative pt-4 pb-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Hero Column */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-left">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-amber-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="uppercase tracking-wider">TEAM AURELIUS • EDTECH TRACK</span>
            </div>

            {/* Main Headline (From Pitch Deck) */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-sans font-light tracking-tight text-white uppercase leading-[1.02]">
                THE MARKET IS NOT A CLASSROOM.
              </h1>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-sans font-light tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-orange-400 uppercase leading-[1.02]">
                FINQUEST IS.
              </h1>
            </div>

            {/* Pitch Deck Core Tagline */}
            <p className="text-base sm:text-lg text-slate-300 max-w-xl font-normal leading-relaxed">
              <strong className="text-white">Learn Money by Managing Money.</strong> Drop into a simulated financial life complete with salary, rent, expenses, and real decisions — where you can make every expensive mistake without losing a single real rupee.
            </p>

            {/* Pitch Deck Highlight Quote Box */}
            <div className="p-4 rounded-2xl oreal-card border border-amber-500/20 text-xs font-mono text-amber-300">
              💬 <em>"Before you risk ₹1 in the real world, risk ₹1 Crore here. Learn the Market. Make Mistakes. Lose Nothing."</em>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onNavigate('voice-ai')}
                className="oreal-btn-primary"
              >
                <span>LAUNCH AURELIUS INTELLIGENCE</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('courses')}
                className="oreal-btn-secondary"
              >
                EXPLORE NISM ACADEMY
              </button>
            </div>
          </div>

          {/* Right Column: Finance-Focused Graphics (Replacing Debit Cards) */}
          <div className="lg:col-span-5 relative flex items-center justify-center min-h-[380px] sm:min-h-[440px]">
            {/* Ambient Lighting */}
            <div className="absolute w-72 h-72 rounded-full bg-gradient-to-tr from-amber-500/10 via-emerald-500/10 to-transparent blur-3xl pointer-events-none" />

            <div className="relative w-full max-w-md space-y-4">
              
              {/* Graphic Card 1: Simulated Net Worth Growth Chart */}
              <div className="oreal-card p-6 rounded-3xl border border-emerald-500/30 shadow-2xl relative overflow-hidden space-y-3 transform -rotate-1 hover:rotate-0 transition-transform">
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold text-white font-mono">FINANCIAL LIFE SIMULATOR</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
                    +₹3.8L COMPOUNDED
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Simulated Portfolio Value</span>
                  <span className="text-2xl sm:text-3xl font-mono font-black text-white block">
                    ₹13,84,500
                  </span>
                </div>

                {/* Simulated Sparkline Bar */}
                <div className="h-16 w-full bg-gradient-to-t from-emerald-500/15 via-emerald-500/5 to-transparent rounded-xl border border-emerald-500/20 p-2 flex items-end justify-between gap-1">
                  {[35, 42, 38, 55, 62, 58, 75, 82, 90, 100].map((val, i) => (
                    <div
                      key={i}
                      style={{ height: `${val}%` }}
                      className="flex-1 rounded-sm bg-gradient-to-t from-emerald-600 to-emerald-400"
                    />
                  ))}
                </div>
              </div>

              {/* Graphic Card 2: 50/30/20 Asset Allocation Card */}
              <div className="oreal-card p-5 rounded-3xl border border-cyan-500/30 shadow-2xl space-y-3 transform rotate-1 hover:rotate-0 transition-transform">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-cyan-300 font-bold flex items-center gap-1.5">
                    <PieChartIcon className="w-4 h-4 text-cyan-400" /> 50/30/20 Cashflow Health
                  </span>
                  <span className="text-emerald-400 font-bold">FHS: {healthScore}/100</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono">
                  <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <span className="text-slate-400 block">NEEDS</span>
                    <span className="text-blue-400 font-bold">50%</span>
                  </div>
                  <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <span className="text-slate-400 block">WANTS</span>
                    <span className="text-amber-400 font-bold">30%</span>
                  </div>
                  <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <span className="text-slate-400 block">INVEST</span>
                    <span className="text-emerald-400 font-bold">20%</span>
                  </div>
                </div>
              </div>

              {/* Graphic Card 3: Aurelius Intelligence Co-Pilot Status */}
              <div className="oreal-card p-4 rounded-2xl border border-amber-500/30 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2.5">
                  <Bot className="w-4 h-4 text-amber-400 animate-pulse" />
                  <div>
                    <span className="text-white font-bold block">Aurelius Intelligence</span>
                    <span className="text-slate-400 text-[10px]">Active Behavioral Mentor</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                  LIVE CO-PILOT
                </span>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ================= PROMINENT PROBLEM STATEMENT & STATS BLOCK (FROM PPT) ================= */}
      <section className="oreal-glass p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6">
        <div className="max-w-3xl space-y-2 text-left">
          <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
            PROBLEM STATEMENT & MARKET NEED
          </span>
          <h2 className="text-xl sm:text-3xl font-sans font-light tracking-tight text-white uppercase">
            "73% of Indian youth have never invested — and the ones who do often learn from a WhatsApp forward."
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Financial education is currently broken: it is either <strong>too theoretical</strong> (textbooks with zero stakes) or <strong>too risky</strong> (live trading with no safety net). FinQuest bridges this gap by creating an interactive, mistake-friendly learning sandbox.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4 border-t border-white/10 text-center">
          <div className="space-y-1">
            <span className="text-2xl sm:text-4xl font-sans font-light tracking-tight text-white block">
              ₹10,00,000
            </span>
            <span className="text-[11px] text-slate-400 font-mono uppercase tracking-wider block">
              Virtual Capital Sandbox
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-2xl sm:text-4xl font-sans font-light tracking-tight text-emerald-400 block">
              0 Real Risk
            </span>
            <span className="text-[11px] text-slate-400 font-mono uppercase tracking-wider block">
              Safe Mistake Environment
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-2xl sm:text-4xl font-sans font-light tracking-tight text-amber-400 block">
              5 Modules
            </span>
            <span className="text-[11px] text-slate-400 font-mono uppercase tracking-wider block">
              NISM Course for Bharat
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-2xl sm:text-4xl font-sans font-light tracking-tight text-cyan-400 block">
              Aurelius AI
            </span>
            <span className="text-[11px] text-slate-400 font-mono uppercase tracking-wider block">
              Behavioral Intelligence
            </span>
          </div>
        </div>
      </section>

      {/* ================= SECTION 3: KEY FEATURES & WORKFLOW (FROM PPT SLIDE 4) ================= */}
      <section className="space-y-6 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4 text-left">
          <div>
            <h2 className="text-2xl font-sans font-light tracking-tight text-white uppercase">
              Key Features & Simulation Workflow
            </h2>
            <p className="text-xs text-slate-400">Everything you need to master personal finance before investing real money</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="oreal-card p-6 rounded-3xl space-y-3 text-left">
            <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              <Activity className="w-5 h-5 text-cyan-400" />
            </div>
            <h3 className="text-base font-bold text-white">Simulated Financial Life</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Experience life stages: Student → First Job → Family → Wealth Building. Manage salary, rent, fixed commitments, and unexpected emergency shocks.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="oreal-card p-6 rounded-3xl space-y-3 text-left">
            <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
            </div>
            <h3 className="text-base font-bold text-white">Scam-Detection Track</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Simulated Ponzi schemes, fake Telegram stock tips, and "guaranteed 20% return" traps designed to build real-world fraud pattern recognition.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="oreal-card p-6 rounded-3xl space-y-3 text-left">
            <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              <Bot className="w-5 h-5 text-amber-400" />
            </div>
            <h3 className="text-base font-bold text-white">Aurelius Intelligence</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Proactive AI co-pilot that flags behavioral bias (over-concentration, panic-selling, lack of emergency fund) and provides real-time voice answers.
            </p>
          </div>
        </div>
      </section>

      {/* ================= 6 CONCEPT LABS RIBBON ================= */}
      <section className="space-y-6 pt-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="text-left">
            <h3 className="text-2xl font-sans font-light tracking-tight text-white uppercase">
              Financial Concept Sandboxes
            </h3>
            <p className="text-xs text-slate-400">Click any lab to jump directly into the live sandbox</p>
          </div>
          <button
            onClick={() => onNavigate('labs')}
            className="oreal-btn-secondary"
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
                className="oreal-card p-6 rounded-3xl cursor-pointer group transition-all flex flex-col justify-between space-y-4 text-left"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-white/30 transition-colors">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 font-semibold">
                      {lab.badge}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                    {lab.title}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                    {lab.desc}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-300 font-semibold pt-3 border-t border-white/5 group-hover:text-white">
                  <span className="uppercase tracking-wider font-mono text-[11px]">Open Lab</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
