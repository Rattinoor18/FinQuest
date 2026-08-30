import React from 'react';
import { X, Award, CheckCircle2, Shield, Download, Sparkles, Share2 } from 'lucide-react';

interface CertificateModalProps {
  onClose: () => void;
  completedModulesCount: number;
  xp: number;
  healthScore: number;
  userName?: string;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  onClose,
  completedModulesCount,
  xp,
  healthScore,
  userName = "Financial Literacy Scholar"
}) => {
  const isFullyCertified = completedModulesCount >= 5;
  const issueDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl glass-panel rounded-3xl border border-amber-500/30 overflow-hidden shadow-2xl bg-[#090D16] flex flex-col max-h-[95vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h2 className="text-sm font-bold text-white">
              NISM Financial Literacy Certificate for Bharat
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Certificate Canvas Frame */}
        <div className="flex-1 p-6 sm:p-8 overflow-y-auto flex items-center justify-center">
          <div className="w-full relative p-8 sm:p-12 rounded-2xl bg-gradient-to-b from-[#0F172A] via-[#090D16] to-[#0B132B] border-4 border-double border-amber-500/40 shadow-2xl text-center space-y-6">
            {/* Top Emblem & Watermark */}
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-4">
              <div className="text-left">
                <span className="text-[10px] font-mono tracking-widest text-amber-400 font-bold block">
                  NATIONAL INSTITUTE OF SECURITIES MARKETS
                </span>
                <span className="text-xs text-slate-300 font-semibold">An Educational Initiative of SEBI</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 p-0.5 shadow-lg shadow-amber-500/20 flex items-center justify-center">
                <div className="w-full h-full bg-[#090D16] rounded-[10px] flex items-center justify-center">
                  <Award className="w-6 h-6 text-amber-400" />
                </div>
              </div>
            </div>

            {/* Title */}
            <div className="space-y-1.5">
              <span className="text-xs tracking-widest uppercase font-mono text-cyan-400 font-bold">
                CERTIFICATE OF LITERACY MASTERY
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-orange-400 tracking-tight">
                Financial Literacy Course for Bharat
              </h1>
              <p className="text-xs text-slate-400 font-medium">
                This credential recognizes proficiency in Indian Personal Finance, Risk Management & Cyber Fraud Immunity
              </p>
            </div>

            {/* Recipient */}
            <div className="py-2 border-y border-amber-500/20">
              <span className="text-[11px] text-slate-400 block font-mono">PROUDLY PRESENTED TO</span>
              <span className="text-xl sm:text-2xl font-bold text-white font-mono tracking-wide">
                {userName}
              </span>
            </div>

            {/* Competencies Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[11px] font-mono">
              <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300">
                <span className="text-amber-400 block font-bold">Modules Cleared</span>
                <span>{completedModulesCount} / 5 Modules</span>
              </div>
              <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300">
                <span className="text-cyan-400 block font-bold">Literacy XP</span>
                <span>{xp} XP Earned</span>
              </div>
              <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300">
                <span className="text-emerald-400 block font-bold">Health Score</span>
                <span>{healthScore} / 100 FHS</span>
              </div>
              <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300">
                <span className="text-purple-400 block font-bold">AI Co-Pilot</span>
                <span>Aurelius Verified</span>
              </div>
            </div>

            {/* Signatures & Issue Date */}
            <div className="flex items-center justify-between pt-6 border-t border-amber-500/20 text-left text-xs font-mono">
              <div>
                <span className="text-slate-400 text-[10px] block">DATE OF ISSUANCE:</span>
                <span className="text-slate-200 font-bold">{issueDate}</span>
              </div>
              <div className="text-right">
                <span className="text-amber-400 font-bold block text-sm tracking-wider">TEAM AURELIUS</span>
                <span className="text-slate-500 text-[10px]">FinQuest EdTech Engine</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 bg-slate-900/80 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-mono">
            Status: {isFullyCertified ? '🏆 100% NISM Certified' : `In Progress (${completedModulesCount}/5 completed)`}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Download / Print
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-xs shadow-lg shadow-amber-500/20"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
