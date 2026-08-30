import React, { useState } from 'react';
import { Mic, Bot, Sparkles, X, ArrowRight, Zap } from 'lucide-react';
import { PageRoute, LabType } from '../types';

interface FloatingVoiceWidgetProps {
  onNavigate: (page: PageRoute) => void;
  onLaunchLab: (lab: LabType) => void;
}

export const FloatingVoiceWidget: React.FC<FloatingVoiceWidgetProps> = ({
  onNavigate,
  onLaunchLab
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {isOpen && (
        <div className="mb-3 w-80 oreal-glass p-5 rounded-3xl border border-white/20 shadow-2xl space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-white">Aurelius Intelligence</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-[11px] text-slate-300 leading-relaxed">
            Need real-time voice guidance or an instant financial simulation? Talk to Aurelius Intelligence.
          </p>

          <button
            onClick={() => {
              setIsOpen(false);
              onNavigate('voice-ai');
            }}
            className="oreal-btn-primary w-full text-xs py-2.5"
          >
            <Mic className="w-4 h-4 animate-pulse" />
            <span>Launch Aurelius Intelligence</span>
          </button>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-400 via-orange-500 to-amber-600 p-0.5 shadow-[0_0_35px_rgba(245,158,11,0.5)] hover:scale-110 transition-all flex items-center justify-center cursor-pointer group"
        title="Aurelius Intelligence"
      >
        <div className="w-full h-full bg-[#121214] rounded-full flex flex-col items-center justify-center group-hover:bg-[#1a1a1e] transition-colors">
          <Bot className="w-6 h-6 text-amber-300 animate-pulse" />
        </div>
      </button>
    </div>
  );
};
