import React, { useState } from 'react';
import { 
  BookOpen, 
  CheckCircle2, 
  ChevronRight, 
  ChevronDown, 
  Sparkles, 
  Clock, 
  Zap, 
  HelpCircle,
  ShieldAlert,
  Wallet,
  PieChart as PieChartIcon,
  TrendingUp,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { NISMModule, Lesson, LabType } from '../types';

interface CurriculumViewProps {
  curriculum: NISMModule[];
  completedLessons: string[];
  completedModules: string[];
  onSelectLesson: (lesson: Lesson, module: NISMModule) => void;
  onStartQuiz: (module: NISMModule) => void;
  onLaunchLab: (labId: LabType) => void;
}

export const CurriculumView: React.FC<CurriculumViewProps> = ({
  curriculum,
  completedLessons,
  completedModules,
  onSelectLesson,
  onStartQuiz,
  onLaunchLab
}) => {
  const [expandedModuleId, setExpandedModuleId] = useState<string>(curriculum[0]?.id || 'module-1');
  const [activeLesson, setActiveLesson] = useState<Lesson>(curriculum[0]?.lessons[0]);
  const [activeModule, setActiveModule] = useState<NISMModule>(curriculum[0]);

  const getModuleIcon = (iconName: string) => {
    switch (iconName) {
      case 'Wallet': return Wallet;
      case 'PieChart': return PieChartIcon;
      case 'TrendingUp': return TrendingUp;
      case 'ShieldCheck': return ShieldCheck;
      case 'AlertTriangle': return AlertTriangle;
      default: return BookOpen;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
      {/* Left Column: 5 Modules Accordion List */}
      <div className="lg:col-span-5 flex flex-col gap-3 overflow-y-auto pr-1">
        <div className="p-4 glass-panel rounded-2xl border border-white/10 bg-slate-900/60 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold block">
              OFFICIAL CURRICULUM
            </span>
            <h2 className="text-sm font-bold text-white">NISM Financial Literacy for Bharat</h2>
          </div>
          <span className="px-2.5 py-1 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-mono text-xs font-bold">
            5 Modules
          </span>
        </div>

        {curriculum.map((module) => {
          const Icon = getModuleIcon(module.icon);
          const isExpanded = expandedModuleId === module.id;
          const isModuleCompleted = completedModules.includes(module.id);
          const completedLessonCount = module.lessons.filter(l => completedLessons.includes(l.id)).length;
          const progressPct = Math.round((completedLessonCount / module.lessons.length) * 100);

          return (
            <div
              key={module.id}
              className={`glass-panel rounded-2xl border transition-all overflow-hidden ${
                isExpanded ? 'border-cyan-500/40 shadow-lg shadow-cyan-500/5' : 'border-white/10 hover:border-white/20'
              }`}
            >
              {/* Module Header */}
              <button
                onClick={() => {
                  setExpandedModuleId(isExpanded ? '' : module.id);
                  if (!isExpanded) {
                    setActiveModule(module);
                    setActiveLesson(module.lessons[0]);
                  }
                }}
                className="w-full p-4 flex items-center justify-between text-left bg-slate-900/40 hover:bg-slate-900/80 transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${module.color} p-0.5 shadow-md flex items-center justify-center shrink-0`}>
                    <div className="w-full h-full bg-[#090D16] rounded-[10px] flex items-center justify-center">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-cyan-400 font-bold">MODULE {module.number}</span>
                      {isModuleCompleted && (
                        <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.2 rounded-full">
                          <CheckCircle2 className="w-3 h-3" /> PASSED
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-white">{module.title}</h3>
                    <p className="text-[11px] text-slate-400 line-clamp-1">{module.tagline}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-400">
                  <span className="text-[11px] font-mono hidden sm:inline">{progressPct}%</span>
                  {isExpanded ? <ChevronDown className="w-4 h-4 text-cyan-400" /> : <ChevronRight className="w-4 h-4" />}
                </div>
              </button>

              {/* Module Lessons Dropdown */}
              {isExpanded && (
                <div className="p-3 bg-slate-950/40 border-t border-white/5 space-y-2">
                  {module.lessons.map((lesson) => {
                    const isLessonDone = completedLessons.includes(lesson.id);
                    const isCurrent = activeLesson?.id === lesson.id;

                    return (
                      <button
                        key={lesson.id}
                        onClick={() => {
                          setActiveLesson(lesson);
                          setActiveModule(module);
                          onSelectLesson(lesson, module);
                        }}
                        className={`w-full p-3 rounded-xl text-left flex items-center justify-between border transition-all ${
                          isCurrent
                            ? 'bg-cyan-500/15 border-cyan-400/50 text-white shadow-sm'
                            : 'glass-card border-white/5 hover:border-white/10 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            isLessonDone ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-slate-400'
                          }`}>
                            {isLessonDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : '•'}
                          </div>
                          <div>
                            <h4 className="text-xs font-semibold">{lesson.title}</h4>
                            <p className="text-[10px] text-slate-400 line-clamp-1">{lesson.summary}</p>
                          </div>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                      </button>
                    );
                  })}

                  {/* Take Quiz Button */}
                  <div className="pt-2">
                    <button
                      onClick={() => onStartQuiz(module)}
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 text-black font-bold text-xs shadow-lg shadow-cyan-500/20 hover:opacity-95 transition-opacity flex items-center justify-center gap-2"
                    >
                      <HelpCircle className="w-4 h-4" />
                      Take Module {module.number} NISM Quiz (+100 XP)
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Right Column: Active Lesson Workspace & Whiteboard */}
      <div className="lg:col-span-7 glass-panel rounded-2xl border border-white/10 flex flex-col h-full overflow-hidden shadow-2xl">
        {activeLesson ? (
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            {/* Header */}
            <div className="border-b border-white/10 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider block mb-1">
                  MODULE {activeModule?.number} • {activeModule?.title}
                </span>
                <h2 className="text-lg font-bold text-white">{activeLesson.title}</h2>
              </div>

              {activeLesson.lab_id && (
                <button
                  onClick={() => onLaunchLab(activeLesson.lab_id as LabType)}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 hover:opacity-90 transition-opacity"
                >
                  <Zap className="w-3.5 h-3.5" />
                  Launch Interactive Lab
                </button>
              )}
            </div>

            {/* Main Lesson Content */}
            <div className="prose prose-invert max-w-none text-slate-200 text-xs leading-relaxed space-y-4 font-normal">
              <div className="whitespace-pre-line bg-slate-900/40 p-5 rounded-2xl border border-white/5">
                {activeLesson.content}
              </div>
            </div>

            {/* Key Takeaways Card */}
            <div className="glass-card p-5 rounded-2xl border border-cyan-500/20 bg-cyan-950/10 space-y-3">
              <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Key NISM Takeaways for Bharat
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                {activeLesson.key_takeaways.map((takeaway, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold">•</span>
                    <span>{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center text-slate-400">
            <BookOpen className="w-12 h-12 text-slate-600 mb-3" />
            <p className="text-sm">Select a lesson from the left syllabus to start learning.</p>
          </div>
        )}
      </div>
    </div>
  );
};
