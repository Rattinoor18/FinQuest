import React, { useState } from 'react';
import { AureliusChatbot } from '../components/AureliusChatbot';
import { AureliusVideoStudio } from '../components/AureliusVideoStudio';
import { LabType, PageRoute } from '../types';
import { Bot, Video, Sparkles } from 'lucide-react';

interface VoiceAIPageProps {
  onTriggerLab: (labId: LabType) => void;
  onNavigate: (page: PageRoute) => void;
  activeLab?: LabType | null;
}

export const VoiceAIPage: React.FC<VoiceAIPageProps> = ({ onTriggerLab, onNavigate, activeLab = null }) => {
  const [activeTab, setActiveTab] = useState<'chatbot' | 'studio'>('chatbot');

  return (
    <div className="space-y-6 py-2 text-left animate-fadeIn">
      {/* Top Header Ribbon & Tab Switcher */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-400/30 text-cyan-400 font-mono text-xs mb-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>AURELIUS INTELLIGENCE ALL-PURPOSE AI CO-PILOT</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white uppercase tracking-tight">
            Aurelius AI Chatbot & Voice Mentor
          </h1>
        </div>

        {/* View Mode Switcher */}
        <div className="flex bg-[#0C1220] border border-white/10 p-1 font-mono text-xs uppercase rounded-xl">
          <button
            onClick={() => setActiveTab('chatbot')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
              activeTab === 'chatbot'
                ? 'bg-cyan-500 text-black font-bold shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>AI INTERACTIVE CHATBOT</span>
          </button>
          <button
            onClick={() => setActiveTab('studio')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
              activeTab === 'studio'
                ? 'bg-cyan-500 text-black font-bold shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>NISM VIDEO STUDIO</span>
          </button>
        </div>
      </div>

      {/* Main Container View */}
      {activeTab === 'chatbot' ? (
        <div className="h-[640px]">
          <AureliusChatbot
            onTriggerLab={onTriggerLab}
            activeLab={activeLab}
          />
        </div>
      ) : (
        <AureliusVideoStudio
          onTriggerLab={onTriggerLab}
        />
      )}
    </div>
  );
};

export default VoiceAIPage;
