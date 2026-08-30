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
  Bot
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

  const navItems: Array<{ id: PageRoute; label: string }> = [
    { id: 'home', label: 'Overview' },
    { id: 'courses', label: 'NISM Academy' },
    { id: 'labs', label: 'Concept Labs' },
    { id: 'voice-ai', label: 'Aurelius Intelligence' },
    { id: 'trading', label: 'Paper Trading' },
    { id: 'certifications', label: 'Certificate' },
  ];

  const handleNavClick = (pageId: PageRoute) => {
    onNavigate(pageId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full oreal-glass border-b border-white/10">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 py-3.5 flex items-center justify-between">
        {/* Brand Logo */}
        <button 
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2.5 text-left group"
        >
          <div className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center font-bold text-white font-mono text-sm">
            FQ
          </div>
          <span className="font-sans font-light tracking-tight text-2xl text-white lowercase">
            finquest<span className="text-amber-400 text-xs font-mono ml-1 font-bold">.ai</span>
          </span>
        </button>

        {/* Desktop Navigation Ribbons */}
        <nav className="hidden lg:flex items-center gap-7 text-xs font-medium tracking-wider uppercase text-slate-300">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`transition-all hover:text-white relative py-1 ${
                  isActive ? 'text-white font-bold' : 'text-slate-400'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-white rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Status Pill & Actions */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="flex items-center gap-2 font-mono text-xs text-slate-300 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10">
            <span className="text-emerald-400 font-bold">{healthScore} FHS</span>
            <span className="text-slate-600">|</span>
            <span className="text-amber-400 font-bold">{xp} XP</span>
          </div>

          <button
            onClick={() => handleNavClick('voice-ai')}
            className="oreal-btn-pill flex items-center gap-2"
          >
            <Bot className="w-3.5 h-3.5 text-emerald-400" />
            <span>AURELIUS INTELLIGENCE</span>
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#161619] border-b border-white/10 p-4 space-y-2 animate-fadeIn">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full text-left p-3 rounded-xl text-xs font-semibold uppercase tracking-wider ${
                currentPage === item.id ? 'bg-white text-black font-bold' : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-300 px-2">
            <span>FHS Score: <strong className="text-emerald-400">{healthScore}</strong></span>
            <span>XP Points: <strong className="text-amber-400">{xp}</strong></span>
          </div>
        </div>
      )}
    </header>
  );
};
