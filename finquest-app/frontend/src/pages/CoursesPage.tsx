import React, { useState } from 'react';
import { 
  BookOpen, 
  CheckCircle2, 
  ChevronRight, 
  ChevronDown, 
  Sparkles, 
  HelpCircle, 
  Zap,
  Award,
  Wallet,
  PieChart as PieChartIcon,
  TrendingUp,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { NISMModule, Lesson, LabType, PageRoute } from '../types';

interface CoursesPageProps {
  curriculum: NISMModule[];
  completedLessons: string[];
  completedModules: string[];
  onSelectLesson: (lesson: Lesson, module: NISMModule) => void;
  onStartQuiz: (module: NISMModule) => void;
  onLaunchLab: (labId: LabType) => void;
  onNavigate: (page: PageRoute) => void;
}

export const CoursesPage: React.FC<CoursesPageProps> = ({
  curriculum,
  completedLessons,
  completedModules,
  onSelectLesson,
  onStartQuiz,
  onLaunchLab,
  onNavigate
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
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner Ribbon */}
      <div className="oreal-glass p-6 rounded-3xl border border-white/15 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30">
              NATIONAL INSTITUTE OF SECURITIES MARKETS
            </span>
            <span className="text-xs text-slate-400">• Official SEBI Curriculum</span>
          </div>
          <h1 className="text-2xl font-black text-white">Financial Literacy Course for Bharat</h1>
          <p className="text-xs text-slate-300 max-w-2xl mt-1">
            Comprehensive 5-module personal finance mastery program designed for Indian youth, students, and prospective investors.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center font-mono">
            <span className="text-[10px] text-slate-400 block">MODULES</span>
            <span className="text-base font-bold text-cyan-400">{completedModules.length}/5 Passed</span>
          </div>
          <button
            onClick={() => onNavigate('certifications')}
            className="px-4 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-xs shadow-lg shadow-amber-500/20 hover:scale-105 transition-all flex items-center gap-1.5"
          >
            <Award className="w-4 h-4" />
            <span>View Certificate</span>
          </button>
        </div>
      </div>

      {/* Main Multi-Column Course Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-16rem)] min-h-[580px]">
        {/* Left Modules Accordion */}
        <div className="lg:col-span-5 flex flex-col gap-3 overflow-y-auto pr-1">
          {curriculum.map((module) => {
            const Icon = getModuleIcon(module.icon);
            const isExpanded = expandedModuleId === module.id;
            const isModuleCompleted = completedModules.includes(module.id);
            const completedCount = module.lessons.filter(l => completedLessons.includes(l.id)).length;
            const progressPct = Math.round((completedCount / module.lessons.length) * 100);

            return (
              <div
                key={module.id}
                className={`oreal-card rounded-2xl border transition-all overflow-hidden ${
                  isExpanded ? 'border-cyan-400/50 shadow-lg shadow-cyan-500/10' : 'border-white/10 hover:border-white/20'
                }`}
              >
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

                  <div className="flex items-center gap-2 text-slate-400 font-mono text-xs">
                    <span>{progressPct}%</span>
                    {isExpanded ? <ChevronDown className="w-4 h-4 text-cyan-400" /> : <ChevronRight className="w-4 h-4" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="p-3 bg-slate-950/50 border-t border-white/5 space-y-2">
                    {module.lessons.map((lesson) => {
                      const isDone = completedLessons.includes(lesson.id);
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
                              ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-sm'
                              : 'bg-slate-900/40 border-white/5 hover:border-white/15 text-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                              isDone ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-slate-400'
                            }`}>
                              {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : '•'}
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

                    <div className="pt-2">
                      <button
                        onClick={() => onStartQuiz(module)}
                        className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 text-black font-extrabold text-xs shadow-lg shadow-cyan-500/20 hover:scale-102 transition-all flex items-center justify-center gap-2"
                      >
                        <HelpCircle className="w-4 h-4" />
                        Take Module {module.number} NISM Assessment (+100 XP)
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Active Lesson Reader */}
        <div className="lg:col-span-7 oreal-glass rounded-3xl border border-white/15 flex flex-col h-full overflow-hidden shadow-2xl">
          {activeLesson ? (
            <div className="flex-1 p-6 lg:p-8 overflow-y-auto space-y-6">
              <div className="border-b border-white/10 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider block mb-1">
                    MODULE {activeModule?.number} • {activeModule?.title}
                  </span>
                  <h2 className="text-xl font-bold text-white">{activeLesson.title}</h2>
                </div>

                {activeLesson.lab_id && (
                  <button
                    onClick={() => onLaunchLab(activeLesson.lab_id as LabType)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-extrabold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 hover:opacity-90 transition-opacity"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    Launch Interactive Lab
                  </button>
                )}
              </div>

              {/* Lesson Text */}
              <div className="text-slate-200 text-xs leading-relaxed space-y-4 font-normal">
                <div className="whitespace-pre-line bg-slate-900/50 p-6 rounded-2xl border border-white/10 font-sans">
                  {activeLesson.content}
                </div>
              </div>

              {/* Key Takeaways */}
              <div className="oreal-card p-5 rounded-2xl border border-cyan-500/30 bg-cyan-950/20 space-y-3">
                <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  Key NISM Bharat Takeaways
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
              <p className="text-sm">Select a lesson from the left syllabus to start reading.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
