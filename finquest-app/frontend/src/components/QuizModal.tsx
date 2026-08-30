import React, { useState } from 'react';
import { X, CheckCircle2, XCircle, Award, Sparkles, ArrowRight, RefreshCw, HelpCircle } from 'lucide-react';
import { NISMModule } from '../types';

interface QuizModalProps {
  module: NISMModule;
  onClose: () => void;
  onComplete: (moduleId: string, score: number, xp: number) => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({ module, onClose, onComplete }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const questions = module.quiz || [];
  const allAnswered = questions.length > 0 && Object.keys(selectedAnswers).length === questions.length;

  const handleSelect = (qIdx: number, optIdx: number) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  const calculateResults = () => {
    let correct = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correct_index) {
        correct++;
      }
    });
    const scorePct = (correct / questions.length) * 100;
    const passed = scorePct >= 50;
    const xpEarned = correct * 50;
    return { correct, scorePct, passed, xpEarned };
  };

  const { correct, scorePct, passed, xpEarned } = calculateResults();

  const handleSubmit = () => {
    setIsSubmitted(true);
    if (passed) {
      onComplete(module.id, scorePct, xpEarned);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl glass-panel rounded-3xl border border-white/15 overflow-hidden shadow-2xl bg-[#090D16] flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-slate-900/80">
          <div>
            <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider block">
              MODULE {module.number} ASSESSMENT
            </span>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              {module.title} • NISM Mastery Challenge
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {!isSubmitted ? (
            <div className="space-y-6">
              {questions.map((q, qIdx) => (
                <div key={qIdx} className="glass-card p-5 rounded-2xl border border-white/10 space-y-3">
                  <span className="text-[10px] font-mono text-cyan-400 font-bold block">
                    QUESTION {qIdx + 1} OF {questions.length}
                  </span>
                  <h3 className="text-sm font-semibold text-white leading-snug">{q.question}</h3>

                  <div className="space-y-2 pt-1">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = selectedAnswers[qIdx] === optIdx;
                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelect(qIdx, optIdx)}
                          className={`w-full p-3 rounded-xl text-left text-xs transition-all border flex items-center gap-3 ${
                            isSelected
                              ? 'bg-cyan-500/20 border-cyan-400 text-white font-medium shadow-md shadow-cyan-500/10'
                              : 'bg-slate-900/60 border-white/5 text-slate-300 hover:bg-white/5 hover:border-white/15'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-mono shrink-0 ${
                            isSelected ? 'border-cyan-400 bg-cyan-400 text-black font-bold' : 'border-slate-600 text-slate-400'
                          }`}>
                            {String.fromCharCode(65 + optIdx)}
                          </div>
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Results Screen */
            <div className="space-y-6 animate-fadeIn">
              {/* Score Banner */}
              <div className={`p-6 rounded-3xl border text-center space-y-2 ${
                passed
                  ? 'bg-gradient-to-b from-emerald-950/60 to-slate-900 border-emerald-500/40'
                  : 'bg-gradient-to-b from-rose-950/60 to-slate-900 border-rose-500/40'
              }`}>
                <div className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center mb-2">
                  {passed ? (
                    <Award className="w-10 h-10 text-emerald-400 animate-bounce" />
                  ) : (
                    <XCircle className="w-10 h-10 text-rose-400" />
                  )}
                </div>
                <h3 className="text-lg font-bold text-white">
                  {passed ? '🎉 Module Passed! NISM Credit Earned' : '❌ Passing Mark is 50%. Keep Practicing!'}
                </h3>
                <p className="text-xs text-slate-400">
                  You scored <span className="font-bold text-white">{correct}/{questions.length} ({scorePct.toFixed(0)}%)</span> • Earned <span className="font-bold text-amber-400 font-mono">+{xpEarned} XP</span>
                </p>
              </div>

              {/* Explanations List */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Answer Key & Explanations:</h4>
                {questions.map((q, qIdx) => {
                  const isCorrect = selectedAnswers[qIdx] === q.correct_index;
                  return (
                    <div
                      key={qIdx}
                      className={`p-4 rounded-2xl border text-xs space-y-2 ${
                        isCorrect ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-rose-950/20 border-rose-500/30'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-semibold text-white">{q.question}</span>
                        {isCorrect ? (
                          <span className="text-emerald-400 font-bold flex items-center gap-1 shrink-0">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                          </span>
                        ) : (
                          <span className="text-rose-400 font-bold flex items-center gap-1 shrink-0">
                            <XCircle className="w-3.5 h-3.5" /> Incorrect
                          </span>
                        )}
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-900/80 text-[11px] text-slate-300 leading-relaxed font-mono">
                        💡 <strong>Explanation:</strong> {q.explanation}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-white/10 bg-slate-900/80 flex items-center justify-between">
          {!isSubmitted ? (
            <>
              <span className="text-xs text-slate-400 font-mono">
                Answered: {Object.keys(selectedAnswers).length}/{questions.length}
              </span>
              <button
                onClick={handleSubmit}
                disabled={!allAnswered}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-95 transition-opacity"
              >
                Submit NISM Assessment
              </button>
            </>
          ) : (
            <div className="w-full flex justify-end gap-3">
              {!passed && (
                <button
                  onClick={() => {
                    setSelectedAnswers({});
                    setIsSubmitted(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white"
                >
                  Retry Assessment
                </button>
              )}
              <button
                onClick={onClose}
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-black font-bold text-xs"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
