import React from 'react';
import { Award, CheckCircle2, Shield, Download, Sparkles, TrendingUp, AlertTriangle, Users } from 'lucide-react';
import { PageRoute } from '../types';

interface CertificationsPageProps {
  completedModulesCount: number;
  xp: number;
  healthScore: number;
  onNavigate: (page: PageRoute) => void;
}

export const CertificationsPage: React.FC<CertificationsPageProps> = ({
  completedModulesCount,
  xp,
  healthScore,
  onNavigate
}) => {
  const isFullyCertified = completedModulesCount >= 5;
  const issueDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  const leaderboard = [
    { rank: 1, name: "Pragya Mehta", fhs: 96, xp: 1250, badge: "Master Compounder" },
    { rank: 2, name: "Nikita Khatter", fhs: 94, xp: 1100, badge: "Debt Free Leader" },
    { rank: 3, name: "Prathamjot Singh", fhs: 91, xp: 950, badge: "Scam Immune" },
    { rank: 4, name: "Ratti Noor Singh", fhs: 89, xp: 850, badge: "Cashflow Pro" },
    { rank: 5, name: "Bharat Scholar (You)", fhs: healthScore, xp: xp, badge: "NISM Apprentice" },
  ];

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Top Banner */}
      <div className="oreal-glass p-6 rounded-3xl border border-white/15 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30">
            OFFICIAL CERTIFICATION PORTAL
          </span>
          <h1 className="text-2xl font-black text-white mt-1">
            NISM Certificate of Financial Literacy for Bharat
          </h1>
          <p className="text-xs text-slate-300 max-w-xl mt-1">
            Earned by demonstrating mastery over 5 NISM modules, risk management, and cyber fraud immunity.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-extrabold text-xs shadow-lg shadow-amber-500/25 hover:scale-105 transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Download / Print Credential</span>
          </button>
        </div>
      </div>

      {/* Main Certificate Frame */}
      <div className="w-full relative p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-[#0F172A] via-[#090D16] to-[#070A12] border-4 border-double border-amber-500/40 shadow-2xl text-center space-y-6 oreal-glass">
        <div className="flex items-center justify-between border-b border-amber-500/20 pb-4">
          <div className="text-left">
            <span className="text-[10px] font-mono tracking-widest text-amber-400 font-bold block">
              NATIONAL INSTITUTE OF SECURITIES MARKETS
            </span>
            <span className="text-xs text-slate-300 font-semibold">An Educational Initiative of SEBI</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 p-0.5 shadow-lg shadow-amber-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-[#090D16] rounded-[14px] flex items-center justify-center">
              <Award className="w-6 h-6 text-amber-400" />
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <span className="text-xs tracking-widest uppercase font-mono text-cyan-400 font-bold">
            CREDENTIAL OF FINANCIAL MASTERY
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-orange-400 tracking-tight">
            Financial Literacy Course for Bharat
          </h2>
          <p className="text-xs text-slate-400 max-w-xl mx-auto font-medium">
            This certifies comprehensive understanding of Personal Finance, Inflation Dynamics, 30-Year Compounding, Debt Safety & Cyber Fraud Prevention.
          </p>
        </div>

        <div className="py-4 border-y border-amber-500/20">
          <span className="text-[11px] text-slate-400 block font-mono">CONFERRED UPON</span>
          <span className="text-2xl sm:text-3xl font-black text-white font-mono tracking-wider">
            BHARAT SCHOLAR
          </span>
        </div>

        {/* 4 Competency Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs font-mono">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-slate-300">
            <span className="text-amber-400 block font-bold">NISM Modules</span>
            <span>{completedModulesCount} / 5 Cleared</span>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-slate-300">
            <span className="text-cyan-400 block font-bold">Literacy Points</span>
            <span>{xp} XP Earned</span>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-slate-300">
            <span className="text-emerald-400 block font-bold">Health Score</span>
            <span>{healthScore} / 100 FHS</span>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-slate-300">
            <span className="text-purple-400 block font-bold">AI Co-Pilot</span>
            <span>Aurelius Verified</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-amber-500/20 text-left text-xs font-mono">
          <div>
            <span className="text-slate-400 text-[10px] block">ISSUANCE DATE:</span>
            <span className="text-slate-200 font-bold">{issueDate}</span>
          </div>
          <div className="text-right">
            <span className="text-amber-400 font-bold block text-sm tracking-wider">TEAM AURELIUS</span>
            <span className="text-slate-500 text-[10px]">FinQuest EdTech Engine</span>
          </div>
        </div>
      </div>

      {/* Leaderboard Section (Ranking on Financial Health, not PnL!) */}
      <section className="oreal-glass p-6 sm:p-8 rounded-3xl border border-white/15 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider block">
              FINANCIAL HEALTH SCORE (FHS) LEADERBOARD
            </span>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-400" />
              National Literacy Ranking
            </h3>
            <p className="text-xs text-slate-400">
              Rankings reward sound financial habits, emergency liquidity, and scam immunity — not lucky gambling bets.
            </p>
          </div>
        </div>

        <div className="space-y-2.5">
          {leaderboard.map((user) => (
            <div
              key={user.rank}
              className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                user.name.includes("You")
                  ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-md'
                  : 'bg-slate-900/40 border-white/5 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-mono font-bold text-xs ${
                  user.rank === 1 ? 'bg-amber-500 text-black' : user.rank === 2 ? 'bg-slate-300 text-black' : user.rank === 3 ? 'bg-amber-700 text-white' : 'bg-white/10 text-slate-400'
                }`}>
                  #{user.rank}
                </span>
                <div>
                  <h4 className="text-xs font-bold text-white">{user.name}</h4>
                  <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 px-2 py-0.2 rounded-md">
                    {user.badge}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-6 font-mono text-xs">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">LITERACY XP</span>
                  <span className="text-amber-400 font-bold">{user.xp} XP</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">HEALTH SCORE</span>
                  <span className="text-emerald-400 font-bold text-sm">{user.fhs}/100</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
