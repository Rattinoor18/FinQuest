import React, { useState, useEffect } from 'react';
import { RibbonHeader } from './components/RibbonHeader';
import { HomePage } from './pages/HomePage';
import { CoursesPage } from './pages/CoursesPage';
import { VoiceAIPage } from './pages/VoiceAIPage';
import { CertificationsPage } from './pages/CertificationsPage';
import { ConceptLab } from './components/ConceptLab';
import { TradingSandbox } from './components/TradingSandbox';
import { QuizModal } from './components/QuizModal';
import { CertificateModal } from './components/CertificateModal';
import { FloatingVoiceWidget } from './components/FloatingVoiceWidget';
import { NISM_DATA } from './data/nismCurriculum';
import { NISMModule, Lesson, LabType, PageRoute } from './types';

export function App() {
  const [currentPage, setCurrentPage] = useState<PageRoute>('home');
  const [activeLab, setActiveLab] = useState<LabType>('budgeting');
  const [curriculum, setCurriculum] = useState<NISMModule[]>(NISM_DATA);
  const [completedLessons, setCompletedLessons] = useState<string[]>(['m1-l1', 'm2-l1']);
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  const [unlockedLabs, setUnlockedLabs] = useState<LabType[]>(['budgeting']);
  const [xp, setXp] = useState<number>(350);
  const [healthScore, setHealthScore] = useState<number>(88);

  // Theme State Persistent in LocalStorage
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('finquest_theme') as 'dark' | 'light') || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('finquest_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Modals
  const [quizModule, setQuizModule] = useState<NISMModule | null>(null);
  const [showCertificate, setShowCertificate] = useState<boolean>(false);

  // Fetch curriculum from backend if available
  useEffect(() => {
    fetch('/api/curriculum')
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('Failed to fetch backend curriculum');
      })
      .then(data => setCurriculum(data))
      .catch(() => console.log('Using pre-bundled NISM curriculum data'));
  }, []);

  // Jump to specific lab from anywhere
  const handleLaunchLab = (labId: LabType) => {
    setActiveLab(labId);
    setCurrentPage('labs');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLessonSelect = (lesson: Lesson, module: NISMModule) => {
    if (!completedLessons.includes(lesson.id)) {
      setCompletedLessons(prev => [...prev, lesson.id]);
      setXp(prev => prev + 25);
    }
  };

  const handleQuizComplete = (moduleId: string, score: number, xpEarned: number) => {
    if (!completedModules.includes(moduleId)) {
      setCompletedModules(prev => [...prev, moduleId]);
      setXp(prev => prev + xpEarned);
      setHealthScore(prev => Math.min(100, prev + 3));

      // Unlock linked lab for this completed module
      const modObj = curriculum.find(m => m.id === moduleId);
      if (modObj && modObj.linked_lab_id) {
        setUnlockedLabs(prev => Array.from(new Set([...prev, modObj.linked_lab_id])));
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#060913] dark:bg-[#060913] bg-slate-50 text-slate-100 dark:text-slate-100 text-slate-900 selection:bg-cyan-500 selection:text-black transition-colors duration-200">
      {/* Signature Ribbon Navigation Header */}
      <RibbonHeader
        currentPage={currentPage}
        onNavigate={(page) => {
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        xp={xp}
        healthScore={healthScore}
        completedModulesCount={completedModules.length}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Multi-Page Route Viewport */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 sm:p-6 lg:p-8">
        {/* 1. Overview / Landing Showcase */}
        {currentPage === 'home' && (
          <HomePage
            onNavigate={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onLaunchLab={handleLaunchLab}
            xp={xp}
            healthScore={healthScore}
            completedModulesCount={completedModules.length}
          />
        )}

        {/* 2. NISM Certified Courses Academy */}
        {currentPage === 'courses' && (
          <CoursesPage
            curriculum={curriculum}
            completedLessons={completedLessons}
            completedModules={completedModules}
            onSelectLesson={handleLessonSelect}
            onStartQuiz={(mod) => setQuizModule(mod)}
            onLaunchLab={handleLaunchLab}
            onNavigate={setCurrentPage}
          />
        )}

        {/* 3. Interactive Concept Labs & Simulators */}
        {currentPage === 'labs' && (
          <div className="h-[calc(100vh-10rem)] min-h-[600px] animate-fadeIn">
            <ConceptLab
              activeLab={activeLab}
              onSelectLab={(lab) => setActiveLab(lab)}
              unlockedLabs={unlockedLabs}
              completedModules={completedModules}
            />
          </div>
        )}

        {/* 4. Aurelius Intelligence Studio */}
        {currentPage === 'voice-ai' && (
          <VoiceAIPage
            onTriggerLab={handleLaunchLab}
            onNavigate={setCurrentPage}
          />
        )}

        {/* 5. Paper Trading & Portfolio Analytics */}
        {currentPage === 'trading' && (
          <div className="h-[calc(100vh-10rem)] min-h-[600px] animate-fadeIn">
            <TradingSandbox />
          </div>
        )}

        {/* 6. Official Certifications & FHS Leaderboard */}
        {currentPage === 'certifications' && (
          <CertificationsPage
            completedModulesCount={completedModules.length}
            xp={xp}
            healthScore={healthScore}
            onNavigate={setCurrentPage}
          />
        )}
      </main>

      {/* Persistent Floating Aurelius Voice Button on All Pages */}
      {currentPage !== 'voice-ai' && (
        <FloatingVoiceWidget
          onNavigate={setCurrentPage}
          onLaunchLab={handleLaunchLab}
        />
      )}

      {/* Assessment Quiz Modal */}
      {quizModule && (
        <QuizModal
          module={quizModule}
          onClose={() => setQuizModule(null)}
          onComplete={handleQuizComplete}
        />
      )}

      {/* Certificate Modal */}
      {showCertificate && (
        <CertificateModal
          onClose={() => setShowCertificate(false)}
          completedModulesCount={completedModules.length}
          xp={xp}
          healthScore={healthScore}
        />
      )}
    </div>
  );
}

export default App;
