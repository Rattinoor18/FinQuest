import React, { useState } from 'react';
import { 
  PieChart as PieChartIcon, 
  TrendingUp, 
  CreditCard, 
  AlertTriangle, 
  ShieldCheck, 
  Flame, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  RefreshCw,
  Sparkles,
  Zap,
  Info
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { LabType } from '../types';

import { Lock } from 'lucide-react';

interface ConceptLabProps {
  activeLab: LabType;
  onSelectLab: (lab: LabType) => void;
  unlockedLabs?: LabType[];
  completedModules?: string[];
}

export const ConceptLab: React.FC<ConceptLabProps> = ({ 
  activeLab, 
  onSelectLab,
  unlockedLabs = ['budgeting', 'real_return', 'sip_compounding', 'debt_trap', 'scam_radar', 'insurance_matrix'],
  completedModules = []
}) => {
  // 1. Budgeting State
  const [salary, setSalary] = useState<number>(60000);
  const [needsPct, setNeedsPct] = useState<number>(50);
  const [wantsPct, setWantsPct] = useState<number>(30);
  const investPct = Math.max(0, 100 - needsPct - wantsPct);

  // 2. Real Return State
  const [fdRate, setFdRate] = useState<number>(7.0);
  const [taxSlab, setTaxSlab] = useState<number>(30);
  const [inflation, setInflation] = useState<number>(6.0);

  // 3. SIP Compounding State
  const [monthlySip, setMonthlySip] = useState<number>(5000);
  const [cagr, setCagr] = useState<number>(12);
  const [tenure, setTenure] = useState<number>(25);
  const [delayYears, setDelayYears] = useState<number>(5);

  // 4. Debt Trap State
  const [debtAmount, setDebtAmount] = useState<number>(75000);
  const [apr, setApr] = useState<number>(42);
  const [extraPayment, setExtraPayment] = useState<number>(4000);

  // 5. Scam Radar State
  const [selectedScamIndex, setSelectedScamIndex] = useState<number>(0);
  const [scamAuditResult, setScamAuditResult] = useState<boolean | null>(null);

  // Calculations for 50/30/20
  const needsVal = Math.round((salary * needsPct) / 100);
  const wantsVal = Math.round((salary * wantsPct) / 100);
  const investVal = Math.round((salary * investPct) / 100);
  const budgetPieData = [
    { name: 'Needs (50%)', value: needsVal, color: '#3B82F6' },
    { name: 'Wants (30%)', value: wantsVal, color: '#F59E0B' },
    { name: 'Investments (20%)', value: investVal, color: '#10B981' },
  ];

  // Calculations for Real Return
  const postTaxNominal = fdRate - (fdRate * (taxSlab / 100));
  const realReturn = postTaxNominal - inflation;
  const initialCorpus = 100000;
  const nominal10y = Math.round(initialCorpus * Math.pow(1 + fdRate / 100, 10));
  const realPurchasingPower10y = Math.round(initialCorpus * Math.pow(1 + realReturn / 100, 10));

  // Calculations for SIP Compounding Curve
  const monthlyRate = (cagr / 100) / 12;
  const totalMonths = tenure * 12;
  const sipFutureVal = Math.round(monthlySip * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate));
  const totalInvested = monthlySip * totalMonths;
  const wealthGain = sipFutureVal - totalInvested;

  // Delayed Start Value
  const delayedMonths = Math.max(12, (tenure - delayYears) * 12);
  const delayedFutureVal = Math.round(monthlySip * ((Math.pow(1 + monthlyRate, delayedMonths) - 1) / monthlyRate) * (1 + monthlyRate));
  const delayLoss = sipFutureVal - delayedFutureVal;

  const compoundingChartData = [];
  for (let yr = 1; yr <= tenure; yr += (tenure > 20 ? 2 : 1)) {
    const m = yr * 12;
    const fv = Math.round(monthlySip * ((Math.pow(1 + monthlyRate, m) - 1) / monthlyRate) * (1 + monthlyRate));
    const inv = monthlySip * m;
    compoundingChartData.push({
      year: `Yr ${yr}`,
      Invested: inv,
      PortfolioValue: fv,
    });
  }

  // Debt Calculations
  const monthlyApr = (apr / 100) / 12;
  let balanceMin = debtAmount;
  let monthsMin = 0;
  let totalInterestMin = 0;
  while (balanceMin > 100 && monthsMin < 240) {
    monthsMin++;
    const interest = balanceMin * monthlyApr;
    totalInterestMin += interest;
    const minPay = Math.max(500, balanceMin * 0.05);
    balanceMin = Math.max(0, balanceMin + interest - minPay);
  }

  let balanceAcc = debtAmount;
  let monthsAcc = 0;
  let totalInterestAcc = 0;
  while (balanceAcc > 50 && monthsAcc < 240) {
    monthsAcc++;
    const interest = balanceAcc * monthlyApr;
    totalInterestAcc += interest;
    balanceAcc = Math.max(0, balanceAcc + interest - extraPayment);
  }

  // Scam Samples
  const scamSamples = [
    {
      title: "VIP Telegram Option Calls (Guaranteed 20% Weekly)",
      sender: "+91 98765-XXXXX (NSE VIP TRADER)",
      message: "🚀 DHAMAKA OFFER: Guaranteed 20% weekly returns! Transfer ₹25,000 to personal UPI handle @nse_vip_profits and join private VIP group. 100% SEBI Verified, zero risk!",
      isScam: true,
      redFlags: [
        "Use of the word 'Guaranteed' on stock/option returns (illegal under SEBI).",
        "Payment requested to a personal UPI handle instead of a registered broker escrow.",
        "High pressure FOMO urgency."
      ]
    },
    {
      title: "Part-Time YouTube Like & Earn Job",
      sender: "HR Rekha (Global Media)",
      message: "Earn ₹2,500 daily by simply liking YouTube videos and rating hotels on Google. First 3 tasks free. Then deposit ₹5,000 for VIP merchant payout tier!",
      isScam: true,
      redFlags: [
        "Task-based part-time job leading to prepaid cryptocurrency deposit trap.",
        "Unsolicited WhatsApp job offer from international/unknown number.",
        "Demanding deposit money to withdraw earned salary."
      ]
    },
    {
      title: "Official Bank Nifty Index Fund SIP Notice",
      sender: "HDFC Mutual Fund (SEBI Reg: MF/012/93/4)",
      message: "Dear Investor, your monthly SIP of ₹5,000 in HDFC Nifty 50 Index Fund Direct-Growth has been scheduled for 5th of each month. View statement on portal.",
      isScam: false,
      redFlags: [
        "Verified SEBI Registration number included.",
        "Direct mutual fund investment via official AMC portal.",
        "No guarantee of unrealistic returns; transparent NAV based investment."
      ]
    }
  ];

  const labsList = [
    { id: 'budgeting', label: '50/30/20 Budgeting', icon: PieChartIcon, reqModule: 'Module 1' },
    { id: 'real_return', label: 'Real Return vs Inflation', icon: TrendingUp, reqModule: 'Module 2' },
    { id: 'sip_compounding', label: 'SIP & Compounding', icon: Flame, reqModule: 'Module 3' },
    { id: 'debt_trap', label: '42% Debt Trap', icon: CreditCard, reqModule: 'Module 4' },
    { id: 'scam_radar', label: 'Scam & Ponzi Radar', icon: AlertTriangle, reqModule: 'Module 5' },
    { id: 'insurance_matrix', label: 'Insurance Protection', icon: ShieldCheck, reqModule: 'Module 4' },
  ];

  const currentLabObj = labsList.find(l => l.id === activeLab);
  const isCurrentLabUnlocked = unlockedLabs.includes(activeLab);

  return (
    <div className="flex flex-col h-full oreal-glass rounded-3xl border border-white/10 dark:border-white/10 border-slate-200 overflow-hidden shadow-2xl">
      {/* Lab Tabs Header Ribbon */}
      <div className="px-6 py-4 border-b border-white/10 dark:border-white/10 border-slate-200 flex items-center justify-between bg-[#161619]/80 dark:bg-[#161619]/80 bg-slate-100 overflow-x-auto gap-3">
        <div className="flex items-center gap-2">
          {labsList.map((lab) => {
            const Icon = lab.icon;
            const isSelected = activeLab === lab.id;
            const isUnlocked = unlockedLabs.includes(lab.id as LabType);
            return (
              <button
                key={lab.id}
                onClick={() => onSelectLab(lab.id as LabType)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all uppercase tracking-wider ${
                  isSelected
                    ? 'bg-cyan-500 text-black font-bold shadow-md'
                    : isUnlocked
                    ? 'text-slate-300 dark:text-slate-300 text-slate-700 hover:text-cyan-400 hover:bg-white/5 border border-white/5'
                    : 'text-slate-500 bg-slate-800/40 border border-slate-800 opacity-70'
                }`}
              >
                {!isUnlocked ? <Lock className="w-3 h-3 text-amber-400" /> : <Icon className="w-3.5 h-3.5" />}
                <span>{lab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Lab Content Area */}
      <div className="flex-1 p-6 lg:p-8 overflow-y-auto">
        {!isCurrentLabUnlocked ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-xl">
              <Lock className="w-8 h-8 animate-bounce" />
            </div>
            <h2 className="text-2xl font-bold text-white dark:text-white text-slate-900">
              Concept Lab Locked
            </h2>
            <p className="text-sm text-slate-400 max-w-md">
              Complete <span className="text-cyan-400 font-bold">{currentLabObj?.reqModule}</span> in NISM Academy to unlock this interactive simulator and advance to the next learning stage!
            </p>
          </div>
        ) : (
          <>
        {/* ================= LAB 1: 50/30/20 BUDGETING ================= */}
        {activeLab === 'budgeting' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <h2 className="text-xl font-sans font-light tracking-tight text-white uppercase flex items-center gap-2">
                  <PieChartIcon className="w-5 h-5 text-amber-400" />
                  The 50/30/20 Cashflow & Budgeting Lab
                </h2>
                <p className="text-xs text-slate-400">
                  NISM Module 2 • Master cashflow discipline before investing
                </p>
              </div>
              <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-amber-400 font-mono text-xs font-bold">
                Savings Velocity: {investPct}% {investPct >= 20 ? '✨ ON TARGET' : '⚠️ LOW'}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-6 oreal-card p-6 rounded-3xl space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
                    <span>Monthly In-Hand Salary</span>
                    <span className="text-amber-400 font-mono text-sm font-bold">₹{salary.toLocaleString('en-IN')}</span>
                  </div>
                  <input
                    type="range"
                    min="15000"
                    max="300000"
                    step="5000"
                    value={salary}
                    onChange={(e) => setSalary(Number(e.target.value))}
                    className="w-full accent-white cursor-pointer h-2 bg-slate-800 rounded-lg"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
                    <span>Essential Needs (Rent, Food, EMIs)</span>
                    <span className="text-blue-400 font-mono">{needsPct}% (₹{needsVal.toLocaleString('en-IN')})</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="80"
                    value={needsPct}
                    onChange={(e) => setNeedsPct(Number(e.target.value))}
                    className="w-full accent-blue-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
                    <span>Lifestyle Wants (Dining, Shopping)</span>
                    <span className="text-amber-400 font-mono">{wantsPct}% (₹{wantsVal.toLocaleString('en-IN')})</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="60"
                    value={wantsPct}
                    onChange={(e) => setWantsPct(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Needs</span>
                    <span className="text-sm font-bold text-white font-mono">₹{needsVal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Wants</span>
                    <span className="text-sm font-bold text-amber-400 font-mono">₹{wantsVal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Invest</span>
                    <span className="text-sm font-bold text-emerald-400 font-mono">₹{investVal.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 oreal-card p-6 rounded-3xl flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10 font-mono text-xs">
                  <span className="text-slate-400">SAVINGS VELOCITY RATING:</span>
                  <span className={`font-bold px-2 py-0.5 rounded-full ${
                    investPct >= 30 ? 'bg-emerald-500/20 text-emerald-400' :
                    investPct >= 20 ? 'bg-cyan-500/20 text-cyan-400' :
                    investPct >= 10 ? 'bg-amber-500/20 text-amber-400' :
                    'bg-rose-500/20 text-rose-400'
                  }`}>
                    {investPct >= 30 ? 'EXCELLENT [Grade A+]' :
                     investPct >= 20 ? 'HEALTHY [Grade A]' :
                     investPct >= 10 ? 'MODERATE [Grade B]' :
                     'VULNERABLE [Grade C]'}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-[#121214] border border-white/10 text-xs text-left">
                  <span className="text-slate-400 block font-mono text-[10px] uppercase">6-Month Emergency Fund Target (Needs × 6):</span>
                  <span className="text-2xl font-mono font-black text-cyan-400">
                    ₹{(needsVal * 6).toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="w-full h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={budgetPieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={65}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {budgetPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(val: number) => `₹${val.toLocaleString('en-IN')}`}
                        contentStyle={{ backgroundColor: '#161619', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= LAB 2: REAL RETURN VS INFLATION ================= */}
        {activeLab === 'real_return' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <h2 className="text-xl font-sans font-light tracking-tight text-white uppercase flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  Real Return & Inflation Trap Visualizer
                </h2>
                <p className="text-xs text-slate-400">
                  NISM Module 2 & 3 • Why nominal 7% Fixed Deposits lose purchasing power
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-6 oreal-card p-6 rounded-3xl space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
                    <span>Nominal Bank FD Interest Rate</span>
                    <span className="text-amber-400 font-mono text-sm font-bold">{fdRate}% p.a.</span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="10"
                    step="0.25"
                    value={fdRate}
                    onChange={(e) => setFdRate(Number(e.target.value))}
                    className="w-full accent-white cursor-pointer h-2 bg-slate-800 rounded-lg"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
                    <span>Your Income Tax Slab</span>
                    <span className="text-white font-mono text-sm">{taxSlab}%</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[0, 10, 20, 30].map((slab) => (
                      <button
                        key={slab}
                        onClick={() => setTaxSlab(slab)}
                        className={`py-2 rounded-xl text-xs font-mono font-bold border transition-all ${
                          taxSlab === slab
                            ? 'bg-white text-black font-bold border-white'
                            : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        {slab}%
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
                    <span>Annual Consumer Inflation (CPI)</span>
                    <span className="text-rose-400 font-mono text-sm font-bold">{inflation}% p.a.</span>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="10"
                    step="0.5"
                    value={inflation}
                    onChange={(e) => setInflation(Number(e.target.value))}
                    className="w-full accent-rose-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                  />
                </div>
              </div>

              <div className="lg:col-span-6 oreal-card p-6 rounded-3xl flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10 font-mono text-xs">
                  <span className="text-slate-400">VERDICT CLASSIFICATION:</span>
                  <span className={`font-bold px-2.5 py-0.5 rounded-full ${
                    realReturn < 0 ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                    realReturn <= 4 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                    'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {realReturn < 0 ? 'WEALTH DESTROYER' : realReturn <= 4 ? 'WEALTH PRESERVER' : 'WEALTH CREATOR'}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs font-mono">
                  <div className="flex justify-between text-slate-300">
                    <span>Nominal FD Rate:</span>
                    <span className="text-white font-bold">+{fdRate.toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Tax Drag ({taxSlab}% slab):</span>
                    <span className="text-rose-400 font-bold">-{(fdRate * (taxSlab / 100)).toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Post-Tax Nominal Rate:</span>
                    <span className="text-amber-400 font-bold">+{postTaxNominal.toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Annual Inflation Drag:</span>
                    <span className="text-rose-400 font-bold">-{inflation.toFixed(2)}%</span>
                  </div>
                  <div className={`flex justify-between border-t border-white/10 pt-2 text-sm font-bold ${
                    realReturn >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    <span>REAL PURCHASING POWER:</span>
                    <span>{realReturn >= 0 ? `+${realReturn.toFixed(2)}% / yr` : `${realReturn.toFixed(2)}% / yr`}</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#121214] border border-white/10 text-xs text-left">
                  <span className="text-slate-400 block font-mono text-[10px] uppercase">10-Year ₹1,00,000 Real Purchasing Power Projection:</span>
                  <span className={`text-2xl font-mono font-black ${
                    realPurchasingPower10y >= initialCorpus ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    ₹{realPurchasingPower10y.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= LAB 3: SIP COMPOUNDING & DELAY ================= */}
        {activeLab === 'sip_compounding' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <h2 className="text-xl font-sans font-light tracking-tight text-white uppercase flex items-center gap-2">
                  <Flame className="w-5 h-5 text-amber-400" />
                  30-Year SIP Compounding & Delay Cost Sandbox
                </h2>
                <p className="text-xs text-slate-400">
                  NISM Module 3 • Experience the Rule of 72 and exponential compounding
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5 oreal-card p-6 rounded-3xl space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
                    <span>Monthly SIP Amount</span>
                    <span className="text-amber-400 font-mono text-sm font-bold">₹{monthlySip.toLocaleString('en-IN')}</span>
                  </div>
                  <input
                    type="range"
                    min="1000"
                    max="50000"
                    step="1000"
                    value={monthlySip}
                    onChange={(e) => setMonthlySip(Number(e.target.value))}
                    className="w-full accent-white cursor-pointer h-2 bg-slate-800 rounded-lg"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
                    <span>Expected Return (CAGR)</span>
                    <span className="text-emerald-400 font-mono text-sm font-bold">{cagr}% p.a.</span>
                  </div>
                  <input
                    type="range"
                    min="8"
                    max="18"
                    step="0.5"
                    value={cagr}
                    onChange={(e) => setCagr(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
                    <span>Investment Horizon</span>
                    <span className="text-white font-mono text-sm font-bold">{tenure} Years</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="35"
                    step="1"
                    value={tenure}
                    onChange={(e) => setTenure(Number(e.target.value))}
                    className="w-full accent-white cursor-pointer h-2 bg-slate-800 rounded-lg"
                  />
                </div>
              </div>

              <div className="lg:col-span-7 oreal-card p-6 rounded-3xl flex flex-col justify-between">
                <div className="grid grid-cols-4 gap-3 mb-4 text-center font-mono">
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                    <span className="text-[10px] text-slate-400 block uppercase">Total Invested</span>
                    <span className="text-xs font-bold text-white">₹{totalInvested.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                    <span className="text-[10px] text-emerald-400 block uppercase">Wealth Gain</span>
                    <span className="text-xs font-bold text-emerald-400">₹{wealthGain.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                    <span className="text-[10px] text-amber-300 block uppercase">Final Corpus</span>
                    <span className="text-xs font-black text-amber-300">₹{sipFutureVal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20">
                    <span className="text-[10px] text-rose-400 block uppercase">5-Yr Delay Loss</span>
                    <span className="text-xs font-bold text-rose-400">-₹{delayLoss.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={compoundingChartData}>
                      <XAxis dataKey="year" stroke="#64748B" fontSize={10} tickLine={false} />
                      <YAxis stroke="#64748B" fontSize={10} tickLine={false} tickFormatter={(v) => `₹${(v/100000).toFixed(0)}L`} />
                      <Tooltip
                        formatter={(v: number) => `₹${v.toLocaleString('en-IN')}`}
                        contentStyle={{ backgroundColor: '#161619', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                      />
                      <Area type="monotone" dataKey="PortfolioValue" stroke="#F59E0B" strokeWidth={2} fillOpacity={0.2} fill="#F59E0B" name="Portfolio Value" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= LAB 4: DEBT TRAP ================= */}
        {activeLab === 'debt_trap' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <h2 className="text-xl font-sans font-light tracking-tight text-white uppercase flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-rose-400" />
                  The 42% Credit Card Trap & Payoff Engine
                </h2>
                <p className="text-xs text-slate-400">
                  NISM Module 2 • Minimum Due vs Full Payment Comparison
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5 oreal-card p-6 rounded-3xl space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
                    <span>Credit Card Outstanding Debt</span>
                    <span className="text-rose-400 font-mono text-sm font-bold">₹{debtAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <input
                    type="range"
                    min="10000"
                    max="300000"
                    step="5000"
                    value={debtAmount}
                    onChange={(e) => setDebtAmount(Number(e.target.value))}
                    className="w-full accent-rose-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                  />
                </div>
              </div>

              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="oreal-card p-5 rounded-3xl border-rose-500/30 space-y-3">
                  <span className="text-[10px] font-mono text-rose-400 uppercase font-bold">ROUTE A: THE TRAP</span>
                  <h4 className="text-sm font-bold text-white">5% Minimum Due Only</h4>
                  <div className="text-xs font-mono space-y-1 text-slate-300">
                    <div>Time to Clear: <strong className="text-rose-400">{(monthsMin/12).toFixed(1)} Years</strong></div>
                    <div>Total Interest: <strong className="text-rose-400">₹{Math.round(totalInterestMin).toLocaleString('en-IN')}</strong></div>
                  </div>
                </div>

                <div className="oreal-card p-5 rounded-3xl border-emerald-500/30 space-y-3">
                  <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">ROUTE B: NISM SMART WAY</span>
                  <h4 className="text-sm font-bold text-white">Accelerated Fixed Payment</h4>
                  <div className="text-xs font-mono space-y-1 text-slate-300">
                    <div>Time to Clear: <strong className="text-emerald-400">{(monthsAcc/12).toFixed(1)} Years</strong></div>
                    <div>Interest Saved: <strong className="text-emerald-400">₹{Math.round(totalInterestMin - totalInterestAcc).toLocaleString('en-IN')}</strong></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= LAB 5: SCAM RADAR ================= */}
        {activeLab === 'scam_radar' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <h2 className="text-xl font-sans font-light tracking-tight text-white uppercase flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-400" />
                  Scam & Telegram Fraud Immunity Radar
                </h2>
                <p className="text-xs text-slate-400">
                  NISM Module 5 • Spot fraudulent financial traps before losing money
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 oreal-card p-6 rounded-3xl space-y-4">
                <div className="p-4 rounded-2xl bg-[#121214] border border-white/10 font-mono text-xs text-slate-200">
                  {scamSamples[selectedScamIndex].message}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setScamAuditResult(true)}
                    className="oreal-btn-primary flex-1 bg-rose-600 hover:bg-rose-500 text-white"
                  >
                    Flag as Scam Trap
                  </button>
                  <button
                    onClick={() => setScamAuditResult(false)}
                    className="oreal-btn-primary flex-1 bg-emerald-600 hover:bg-emerald-500 text-white"
                  >
                    Mark as Legitimate
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5 oreal-card p-6 rounded-3xl space-y-3">
                <h4 className="text-xs font-mono uppercase text-slate-400">Forensic Clues</h4>
                {scamAuditResult !== null && (
                  <div className="space-y-2 text-xs text-slate-300">
                    {scamSamples[selectedScamIndex].redFlags.map((flag, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                        • {flag}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= LAB 6: INSURANCE PROTECTION MATRIX ================= */}
        {activeLab === 'insurance_matrix' && (
          <div className="space-y-6">
            <div className="border-b border-white/10 pb-4">
              <h2 className="text-xl font-sans font-light tracking-tight text-white uppercase flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                Pure Term Insurance vs The ULIP / Endowment Trap
              </h2>
              <p className="text-xs text-slate-400">
                NISM Module 4 • Never mix investment with insurance
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="oreal-card p-6 rounded-3xl border-emerald-500/30 space-y-4 text-left">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
                  NISM RECOMMENDED
                </span>
                <h3 className="text-base font-bold text-white">Buy Pure Term + Invest Difference in SIP</h3>
                <div className="space-y-2 text-xs font-mono text-slate-300">
                  <div className="p-3 rounded-xl bg-white/5 flex justify-between">
                    <span>Annual Premium:</span>
                    <span className="text-emerald-400 font-bold">~₹10,000 / year</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 flex justify-between">
                    <span>Life Protection Cover:</span>
                    <span className="text-emerald-400 font-bold">₹1.50 Crores</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 flex justify-between">
                    <span>Wealth Created via SIP at 60:</span>
                    <span className="text-emerald-400 font-bold">₹96+ Lakhs</span>
                  </div>
                </div>
              </div>

              <div className="oreal-card p-6 rounded-3xl border-rose-500/30 space-y-4 text-left">
                <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-mono font-bold">
                  THE BANK SALES TRAP
                </span>
                <h3 className="text-base font-bold text-white">Endowment / Money-Back Policy</h3>
                <div className="space-y-2 text-xs font-mono text-slate-300">
                  <div className="p-3 rounded-xl bg-white/5 flex justify-between">
                    <span>Annual Premium:</span>
                    <span className="text-rose-400 font-bold">₹50,000 / year</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 flex justify-between">
                    <span>Life Protection Cover:</span>
                    <span className="text-rose-400 font-bold">₹5.00 Lakhs only</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 flex justify-between">
                    <span>Expected Return:</span>
                    <span className="text-rose-400 font-bold">4.5% (Loses to Inflation)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        </>
        )}
      </div>
    </div>
  );
};
