import React from 'react';
import { Award, Shield, Sparkles, BookOpen, Activity, Cpu, RefreshCw } from 'lucide-react';

interface NavbarProps {
  activeTab: 'curriculum' | 'labs' | 'trading';
  setActiveTab: (tab: 'curriculum' | 'labs' | 'trading') => void;
  xp: number;
  healthScore: number;
  onOpenCertificate: () => void;
  completedModulesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  xp,
  healthScore,
  onOpenCertificate,
  completedModulesCount
}) => {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 px-4 lg:px-8 py-3.5 flex items-center justify-between">
      {/* Brand & Tagline */}
      <div className="flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-teal-400 to-emerald-400 p-0.5 shadow-lg shadow-cyan-500/20 flex items-center justify-center">
          <div className="w-full h-full bg-[#090D16] rounded-[10px] flex items-center justify-center">
            <span className="font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400 text-lg">FQ</span>
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
              FinQuest
              <span className="text-[10px] font-mono tracking-wider uppercase px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                Aurelius AI 2.0
              </span>
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-medium hidden sm:block">
            NISM Financial Literacy for Bharat • EdTech Engine
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-white/5">
        <button
          onClick={() => setActiveTab('curriculum')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'curriculum'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/25'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>NISM Course</span>
          {completedModulesCount > 0 && (
            <span className="bg-white/20 text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono">
              {completedModulesCount}/5
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('labs')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'labs'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/25'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Concept Labs</span>
        </button>

        <button
          onClick={() => setActiveTab('trading')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'trading'
              ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md shadow-purple-500/25'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Paper Trading</span>
          <span className="md:hidden">Trade</span>
        </button>
      </nav>

      {/* Gamification & Cert Badges */}
      <div className="flex items-center gap-3">
        {/* XP Pill */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono font-bold">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{xp} XP</span>
        </div>

        {/* Health Score Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span>{healthScore}/100 FHS</span>
        </div>

        {/* Certificate Action */}
        <button
          onClick={onOpenCertificate}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold shadow-lg shadow-amber-500/20 hover:opacity-95 transition-opacity"
        >
          <Award className="w-4 h-4" />
          <span className="hidden md:inline">Certificate</span>
        </button>
      </div>
    </header>
  );
};
