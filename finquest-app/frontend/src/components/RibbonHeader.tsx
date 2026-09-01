import React, { useState } from 'react';
import { 
  Award, 
  Shield, 
  Sparkles, 
  BookOpen, 
  Activity, 
  Cpu, 
  Mic, 
  Home, 
  Menu,
  X,
  Bot,
  Terminal,
  Zap,
  TrendingUp
} from 'lucide-react';
import { PageRoute } from '../types';

interface RibbonHeaderProps {
  currentPage: PageRoute;
  onNavigate: (page: PageRoute) => void;
  xp: number;
  healthScore: number;
  completedModulesCount: number;
}

export const RibbonHeader: React.FC<RibbonHeaderProps> = ({
  currentPage,
  onNavigate,
  xp,
  healthScore,
  completedModulesCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: Array<{ id: PageRoute; label: string; code: string }> = [
    { id: 'home', label: 'Overview', code: 'SYS.01' },
    { id: 'courses', label: 'NISM Academy', code: 'SYS.02' },
    { id: 'labs', label: 'Concept Labs', code: 'SYS.03' },
    { id: 'voice-ai', label: 'Aurelius Intelligence', code: 'SYS.04' },
    { id: 'trading', label: 'Paper Trading', code: 'SYS.05' },
    { id: 'certifications', label: 'Certificate', code: 'SYS.06' },
  ];

  const handleNavClick = (pageId: PageRoute) => {
    onNavigate(pageId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#080C14]/40 backdrop-blur-md border-b border-white/10 transition-all">
      {/* Top Technical Status Ribbon (Transparent background) */}
      <div className="w-full bg-transparent border-b border-white/10 text-[10px] font-mono-tech text-slate-400 py-1.5 px-4 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-6 whitespace-nowrap overflow-hidden">
          <span className="text-cyan-400 font-bold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-cyan-400 rounded-none animate-pulse" />
            // SHARPLINK GAMING & DATA ENGINE
          </span>
          <span className="hidden md:inline text-slate-600">|</span>
          <span className="hidden md:inline text-slate-300">
            NISM BHARAT CERTIFIED FINANCIAL LITERACY PLATFORM
          </span>
          <span className="hidden lg:inline text-slate-600">|</span>
          <span className="hidden lg:inline text-blue-400">
            REAL-TIME MARKET DATASET PIPELINE
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono-tech">
          <span className="text-emerald-400 font-bold">{healthScore} FHS</span>
          <span className="text-slate-600">|</span>
          <span className="text-amber-400 font-bold">{xp} XP</span>
        </div>
      </div>

      {/* Main Transparent Ribbon Navbar */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 py-3.5 flex items-center justify-between">
        {/* Brand Logo: FinQuest */}
        <button 
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 text-left group"
        >
          <div className="w-9 h-9 bg-blue-600 border border-cyan-400 flex items-center justify-center font-black text-white font-mono-tech text-sm shadow-md shadow-blue-600/50">
            FQ
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-2xl tracking-tighter text-white font-sans uppercase leading-none">
              FinQuest<span className="text-cyan-400 font-mono-tech text-xs ml-1 font-bold">.AI</span>
            </span>
            <span className="text-[9px] font-mono-tech text-slate-400 tracking-widest uppercase">
              POWERED BY AURELIUS INTELLIGENCE
            </span>
          </div>
        </button>

        {/* Navigation Ribbons */}
        <nav className="hidden lg:flex items-center gap-8 font-mono-tech text-xs tracking-widest uppercase text-slate-300">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`transition-all hover:text-cyan-300 relative py-1 flex items-center gap-1.5 ${
                  isActive ? 'text-white font-bold' : 'text-slate-400'
                }`}
              >
                <span className="text-[9px] text-blue-500 font-bold">{item.code}</span>
                <span>{item.label}</span>
                {isActive && (
                  <span className="absolute -bottom-1.5 left-0 w-full h-[2px] bg-gradient-to-r from-blue-600 to-cyan-400 shadow-[0_0_8px_#00F0FF]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right CTA Action */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={() => handleNavClick('voice-ai')}
            className="sharplink-btn-pill flex items-center gap-2"
          >
            <Bot className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>AURELIUS INTELLIGENCE</span>
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 bg-[#0D1424]/60 border border-blue-500/30 text-slate-300 hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0A0E17]/95 border-b border-blue-500/30 p-4 space-y-2 font-mono-tech animate-fadeIn">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full text-left p-3 text-xs uppercase tracking-wider flex items-center justify-between border ${
                currentPage === item.id 
                  ? 'bg-blue-600 text-white font-bold border-cyan-400' 
                  : 'text-slate-300 border-white/5 hover:bg-white/5'
              }`}
            >
              <span>{item.label}</span>
              <span className="text-[10px] opacity-60">{item.code}</span>
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
