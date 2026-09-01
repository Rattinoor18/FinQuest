import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Play, 
  Pause, 
  RotateCcw, 
  Maximize2, 
  Bot, 
  User, 
  Send, 
  Zap, 
  CheckCircle2, 
  ShieldAlert, 
  Activity,
  Layers,
  Sliders,
  Tv
} from 'lucide-react';
import { LabType, VoiceResponse } from '../types';

interface AureliusVideoStudioProps {
  onTriggerLab?: (labId: LabType) => void;
  activeLab?: LabType | null;
}

export const AureliusVideoStudio: React.FC<AureliusVideoStudioProps> = ({
  onTriggerLab,
  activeLab,
}) => {
  const [cameraActive, setCameraActive] = useState(true);
  const [micActive, setMicActive] = useState(false);
  const [voiceMuted, setVoiceMuted] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'ai_avatar' | 'video_lessons'>('ai_avatar');

  // Video Lesson State
  const [currentVideoIdx, setCurrentVideoIdx] = useState(0);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Audio Spectrum / Canvas Reference
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Video Lesson Catalog
  const videoLessons = [
    {
      id: 'v1',
      title: 'NISM Module 1: 50/30/20 Budgeting Rule & Salary Allocation',
      duration: '04:15',
      category: 'PERSONAL FINANCE',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80',
      summary: 'Master how to split your monthly paycheck into 50% Needs, 30% Wants, and 20% Automated Investments on Day 1.'
    },
    {
      id: 'v2',
      title: 'NISM Module 2: The Real Inflation Drag on Fixed Deposits',
      duration: '05:40',
      category: 'TAX & WEALTH',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80',
      summary: 'Understand why a nominal 7% FD in a 30% tax slab loses -1.1% real purchasing power against 6% retail inflation.'
    },
    {
      id: 'v3',
      title: 'NISM Module 3: The 30-Year Compounding Miracle & Delay Cost',
      duration: '06:12',
      category: 'EQUITY & SIP',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=800&q=80',
      summary: 'Simulate how starting a ₹5,000 monthly SIP at age 20 generates ₹4.2 Crores more than starting at age 30.'
    },
    {
      id: 'v4',
      title: 'NISM Module 4: Exposing the 42% Credit Card Trap & Minimum Due',
      duration: '04:50',
      category: 'DEBT ELIMINATION',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
      summary: 'Why paying minimum due on credit cards locks you into a 15-year compound debt trap at 42% APR.'
    }
  ];

  // Conversation Messages
  const [messages, setMessages] = useState([
    {
      id: 'm1',
      sender: 'aurelius',
      text: "Greetings! I am Aurelius, your AI Voice & Video Co-Pilot. I am broadcasting live with real-time financial telemetry. Ask me any question or select a video module below.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  // Animated Hologram Canvas Visualizer Effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw Hologram Audio Spectrum Bars
      const bars = 32;
      const barWidth = canvas.width / bars;

      for (let i = 0; i < bars; i++) {
        const height = (isSpeaking || micActive)
          ? Math.sin(phase + i * 0.3) * 35 + Math.random() * 20 + 20
          : Math.sin(phase + i * 0.2) * 8 + 10;

        const x = i * barWidth;
        const y = canvas.height - height;

        const grad = ctx.createLinearGradient(0, y, 0, canvas.height);
        grad.addColorStop(0, '#00F0FF');
        grad.addColorStop(1, '#0066FF');

        ctx.fillStyle = grad;
        ctx.fillRect(x + 2, y, barWidth - 4, height);
      }

      phase += 0.1;
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isSpeaking, micActive]);

  // Speak Text Function
  const speakText = (text: string) => {
    if (voiceMuted || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v => v.lang.includes('en-IN') || v.lang.includes('en-GB') || v.name.includes('Google'));
    if (preferred) utterance.voice = preferred;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleSendQuery = async (queryText: string) => {
    const text = queryText.trim();
    if (!text) return;

    setMessages(prev => [
      ...prev,
      {
        id: String(Date.now()),
        sender: 'user',
        text: text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);

    setInputQuery('');
    setIsThinking(true);

    try {
      const res = await fetch('/api/voice/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, current_lab: activeLab })
      });

      if (!res.ok) throw new Error('API request failed');
      const data: VoiceResponse = await res.json();

      setMessages(prev => [
        ...prev,
        {
          id: String(Date.now() + 1),
          sender: 'aurelius',
          text: data.markdown_reply || data.speech_text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsThinking(false);

      if (data.lab_id && onTriggerLab) {
        onTriggerLab(data.lab_id as LabType);
      }

      if (data.speech_text) {
        speakText(data.speech_text);
      }
    } catch {
      let reply = `NISM Lesson Analysis for "${text}": Always maintain a 6-month emergency liquidity fund before taking equity market risk.`;
      let speech = `I have analyzed your query regarding ${text}. Let's look at the financial rules.`;

      const q = text.toLowerCase();
      if (q.includes('budget') || q.includes('salary')) {
        reply = "Opening **50/30/20 Budgeting Lab**: Allocate 50% to essential Needs, 30% to Wants, and 20% to Wealth Building.";
        speech = "Opening the 50 30 20 Budgeting Lab to structure your cashflow.";
        if (onTriggerLab) onTriggerLab('budgeting');
      } else if (q.includes('fd') || q.includes('inflation')) {
        reply = "Opening **Real Return Lab**: Fixed Deposits giving 7% before tax generate -1.1% negative real return against 6% inflation.";
        speech = "Opening the Real Return Lab. Fixed deposits lose purchasing power post-tax.";
        if (onTriggerLab) onTriggerLab('real_return');
      }

      setMessages(prev => [
        ...prev,
        {
          id: String(Date.now() + 1),
          sender: 'aurelius',
          text: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsThinking(false);
      speakText(speech);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn text-left">
      {/* Studio Header Ribbon */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-400/30 text-cyan-400 font-mono-tech text-xs mb-1">
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-ping" />
            <span>REAL-TIME AI VIDEO BROADCAST STUDIO</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
            Aurelius Video & Voice Engine
          </h2>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-[#0C1220] border border-white/10 p-1 font-mono-tech text-xs uppercase">
          <button
            onClick={() => setActiveTab('ai_avatar')}
            className={`px-5 py-2 flex items-center gap-2 transition-all ${
              activeTab === 'ai_avatar'
                ? 'bg-blue-600 text-white font-bold shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>AI LIVE AVATAR FEED</span>
          </button>
          <button
            onClick={() => setActiveTab('video_lessons')}
            className={`px-5 py-2 flex items-center gap-2 transition-all ${
              activeTab === 'video_lessons'
                ? 'bg-blue-600 text-white font-bold shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Tv className="w-4 h-4" />
            <span>NISM VIDEO LESSONS</span>
          </button>
        </div>
      </div>

      {/* Main Studio Viewport */}
      {activeTab === 'ai_avatar' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Live AI Video Feed Viewport */}
          <div className="lg:col-span-7 space-y-4">
            <div className="sharplink-card sharplink-pin p-4 border-l-4 border-l-cyan-400 shadow-2xl relative overflow-hidden bg-black">
              
              {/* Camera Video Surface Header Overlay */}
              <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-center font-mono-tech text-xs pointer-events-none">
                <div className="flex items-center gap-2 px-3 py-1 bg-black/70 backdrop-blur border border-cyan-400/40 text-cyan-400">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="font-bold">AURELIUS CAM 01 // 1080P 60FPS</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 bg-blue-600/60 text-white border border-blue-400/50 text-[10px] uppercase font-bold">
                    BIOMETRIC AUDIO SYNC
                  </span>
                </div>
              </div>

              {/* Real Video Stream / Futuristic AI HUD Viewport Surface */}
              <div className="relative w-full h-[400px] sm:h-[460px] bg-[#03060E] border border-slate-800 flex flex-col justify-between p-6 overflow-hidden">
                {/* Scanlines Effect */}
                <div className="video-canvas-scanlines absolute inset-0 z-10 pointer-events-none" />

                {/* Simulated Ambient Video Particles & Avatar Animation */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                  <div className="w-96 h-96 rounded-full bg-gradient-to-tr from-blue-600/30 via-cyan-400/20 to-purple-600/20 blur-3xl animate-pulse" />
                </div>

                {/* Avatar Core Visual */}
                <div className="relative z-10 flex flex-col items-center justify-center my-auto space-y-4 text-center">
                  <div className="relative">
                    <div className={`w-32 h-32 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
                      isSpeaking 
                        ? 'border-cyan-400 shadow-[0_0_60px_#00F0FF] scale-110' 
                        : 'border-blue-600/60 shadow-[0_0_30px_#0066FF]'
                    }`}>
                      <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-blue-900 via-slate-900 to-cyan-950 flex items-center justify-center border border-cyan-400/40">
                        <Bot className={`w-14 h-14 ${isSpeaking ? 'text-cyan-300 animate-bounce' : 'text-blue-400'}`} />
                      </div>
                    </div>
                    {isSpeaking && (
                      <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-cyan-500 text-black font-mono-tech text-[10px] font-black uppercase tracking-widest shadow-lg">
                        SPEAKING
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-white uppercase font-sans tracking-tight">
                      AURELIUS AI VOICE CO-PILOT
                    </h3>
                    <p className="text-xs font-mono-tech text-cyan-400">
                      STATUS: ONLINE • READY FOR VOICE INQUIRY
                    </p>
                  </div>
                </div>

                {/* Bottom Spectrum Canvas Overlay */}
                <div className="relative z-20 w-full space-y-2">
                  <canvas ref={canvasRef} width={500} height={50} className="w-full h-12 bg-black/40 border border-slate-800/80" />

                  {/* Camera Controls Bar */}
                  <div className="flex items-center justify-between font-mono-tech text-xs bg-slate-950/80 p-2.5 border border-slate-800">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setMicActive(!micActive)}
                        className={`p-2 border transition-all ${
                          micActive ? 'bg-rose-600 border-rose-400 text-white' : 'bg-slate-900 border-slate-700 text-cyan-400 hover:text-white'
                        }`}
                      >
                        {micActive ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => setCameraActive(!cameraActive)}
                        className={`p-2 border transition-all ${
                          cameraActive ? 'bg-blue-600 border-cyan-400 text-white' : 'bg-slate-900 border-slate-700 text-slate-400'
                        }`}
                      >
                        {cameraActive ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => setVoiceMuted(!voiceMuted)}
                        className={`p-2 border transition-all ${
                          voiceMuted ? 'bg-red-500/20 border-red-500 text-red-400' : 'bg-slate-900 border-slate-700 text-slate-300'
                        }`}
                      >
                        {voiceMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </button>
                    </div>

                    <span className="text-slate-400 text-[11px] hidden sm:inline">
                      {micActive ? '🎙️ MICROPHONE ACTIVE' : 'CLICK MIC TO TALK TO AURELIUS'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Real-Time Live Transcript Chat */}
          <div className="lg:col-span-5 space-y-4">
            <div className="sharplink-card sharplink-pin p-6 space-y-4 border-l-4 border-l-blue-600 shadow-2xl flex flex-col h-[520px]">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3 font-mono-tech text-xs">
                <span className="text-cyan-400 font-bold flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-500" />
                  // REAL-TIME SPEECH TRANSCRIPT
                </span>
                <span className="text-slate-500 text-[10px]">LIVE FEED</span>
              </div>

              {/* Messages Body */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`p-3.5 border ${
                      m.sender === 'user'
                        ? 'bg-blue-900/30 border-blue-500/40 text-slate-100 font-mono-tech'
                        : 'bg-[#05080E] border-slate-800 text-slate-200'
                    }`}
                  >
                    <div className="flex justify-between text-[10px] font-mono-tech text-slate-400 mb-1">
                      <span className="font-bold text-cyan-400 uppercase">{m.sender}</span>
                      <span>{m.timestamp}</span>
                    </div>
                    <p className="leading-relaxed">{m.text}</p>
                  </div>
                ))}
                {isThinking && (
                  <div className="p-3 bg-[#05080E] border border-slate-800 text-cyan-400 font-mono-tech text-xs flex items-center gap-2">
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Aurelius is synthesizing response...</span>
                  </div>
                )}
              </div>

              {/* Query Input Box */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendQuery(inputQuery);
                }}
                className="pt-2 border-t border-slate-800 flex gap-2"
              >
                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder="Type or ask financial question..."
                  className="bg-[#03060E] border border-slate-800 px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 flex-1 font-mono-tech uppercase"
                />
                <button type="submit" className="sharplink-btn-primary px-5 py-3">
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

        </div>
      ) : (
        /* Video Lessons Tab Viewport */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Selected Video Player */}
          <div className="lg:col-span-8 space-y-4">
            <div className="sharplink-card sharplink-pin p-4 border-l-4 border-l-cyan-400 shadow-2xl bg-black">
              <div className="relative w-full aspect-video bg-black border border-slate-800 overflow-hidden">
                <video
                  ref={videoRef}
                  src={videoLessons[currentVideoIdx].videoUrl}
                  controls
                  poster={videoLessons[currentVideoIdx].thumbnail}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-4 space-y-2 text-left font-mono-tech">
                <span className="px-2.5 py-0.5 bg-cyan-500/10 border border-cyan-400/30 text-cyan-400 text-[10px] font-bold uppercase">
                  {videoLessons[currentVideoIdx].category}
                </span>
                <h3 className="text-xl font-bold text-white font-sans uppercase">
                  {videoLessons[currentVideoIdx].title}
                </h3>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  {videoLessons[currentVideoIdx].summary}
                </p>
              </div>
            </div>
          </div>

          {/* Video Playlist Sidebar */}
          <div className="lg:col-span-4 space-y-4">
            <div className="sharplink-card sharplink-pin p-6 space-y-4 border-l-4 border-l-blue-600 shadow-2xl">
              <span className="text-xs font-mono-tech text-cyan-400 font-bold uppercase tracking-widest block border-b border-slate-800 pb-3">
                // NISM COURSE VIDEO PLAYLIST ({videoLessons.length} MODULES)
              </span>

              <div className="space-y-3">
                {videoLessons.map((v, idx) => (
                  <div
                    key={v.id}
                    onClick={() => {
                      setCurrentVideoIdx(idx);
                      setIsPlayingVideo(true);
                      if (videoRef.current) {
                        videoRef.current.play();
                      }
                    }}
                    className={`p-3.5 border cursor-pointer transition-all space-y-2 text-left ${
                      currentVideoIdx === idx
                        ? 'bg-blue-600/20 border-cyan-400 shadow-lg'
                        : 'bg-[#03060E] border-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex justify-between items-center font-mono-tech text-[10px]">
                      <span className="text-cyan-400 font-bold">MODULE 0{idx + 1}</span>
                      <span className="text-slate-400">{v.duration}</span>
                    </div>
                    <h4 className="text-xs font-bold text-white font-sans uppercase line-clamp-2">
                      {v.title}
                    </h4>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
