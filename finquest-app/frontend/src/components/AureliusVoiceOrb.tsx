import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Sparkles, Send, Bot, User, ArrowRight, Activity, Zap } from 'lucide-react';
import { LabType, VoiceResponse } from '../types';

interface AureliusVoiceOrbProps {
  onTriggerLab: (labId: LabType) => void;
  activeLab: LabType | null;
}

interface MessageItem {
  id: string;
  sender: 'user' | 'aurelius';
  text: string;
  speechText?: string;
  labTrigger?: LabType;
  timestamp: string;
}

export const AureliusVoiceOrb: React.FC<AureliusVoiceOrbProps> = ({
  onTriggerLab,
  activeLab,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [voiceMuted, setVoiceMuted] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: 'welcome',
      sender: 'aurelius',
      text: "Namaste! I am Aurelius, your NISM Financial Literacy Voice Mentor. Speak into your mic or click any prompt below to explore budgeting, inflation, compounding, debt traps, or scam immunity.",
      speechText: "Namaste! I am Aurelius, your financial literacy voice mentor. Speak to me or click any prompt to explore real-world money mechanics.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // Initialize Web Speech API for voice recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-IN'; // Indian English dialect

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setIsListening(false);
        if (transcript.trim()) {
          handleSendQuery(transcript);
        }
      };

      recognition.onerror = (err: any) => {
        console.warn('Speech recognition error:', err);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  // Text-To-Speech Synthesizer
  const speakText = (text: string) => {
    if (voiceMuted || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel(); // Stop prior speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    
    // Pick an English voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.lang.includes('en-IN') || v.lang.includes('en-GB') || v.name.includes('Google'));
    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const toggleMic = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          recognitionRef.current.stop();
          setTimeout(() => recognitionRef.current.start(), 200);
        }
      } else {
        alert('Voice speech recognition is not supported in this browser. Please type your query.');
      }
    }
  };

  const handleSendQuery = async (queryText: string) => {
    const text = queryText.trim();
    if (!text) return;

    const userMsg: MessageItem = {
      id: String(Date.now()),
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsThinking(true);

    try {
      // Call backend API (try relative endpoint first, fallback to localhost port 8000)
      let res: Response;
      try {
        res = await fetch('/api/voice/ask', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: text, current_lab: activeLab })
        });
      } catch {
        res = await fetch('http://127.0.0.1:8000/api/voice/ask', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: text, current_lab: activeLab })
        });
      }

      if (!res.ok) throw new Error('API failed');
      const data: VoiceResponse = await res.json();

      const aiMsg: MessageItem = {
        id: String(Date.now() + 1),
        sender: 'aurelius',
        text: data.markdown_reply || data.speech_text,
        speechText: data.speech_text,
        labTrigger: (data.lab_id as LabType) || undefined,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsThinking(false);

      // Trigger UI sync if requested by AI
      if (data.lab_id) {
        onTriggerLab(data.lab_id as LabType);
      }

      // Speak response
      if (data.speech_text) {
        speakText(data.speech_text);
      }
    } catch (err) {
      // Fallback local intelligent answers
      let replyText = `Here is what NISM teaches about "${text}": Always ensure you follow the 50/30/20 rule, build an Emergency Fund of 6 months expenses, and invest in Direct Index Funds.`;
      let speech = `I have analyzed your question about ${text}. Let's look at the numbers together.`;
      let trigger: LabType | undefined = undefined;

      const q = text.toLowerCase();
      if (q.includes('budget') || q.includes('50/30/20') || q.includes('salary')) {
        replyText = "Opening the **50/30/20 Budgeting Lab**. Allocate 50% for Needs, 30% for Wants, and invest 20% on the day your salary arrives!";
        speech = "Opening the 50/30/20 Budgeting Lab. Invest 20% on salary day before spending on lifestyle.";
        trigger = 'budgeting';
      } else if (q.includes('fd') || q.includes('inflation') || q.includes('real return')) {
        replyText = "Opening the **Real Return Lab**. A 7% FD gives only 4.9% post-tax in 30% bracket. Against 6% inflation, real wealth shrinks by -1.1% p.a.";
        speech = "Opening the Real Return Lab. After taxes and inflation, Fixed Deposits silently lose purchasing power.";
        trigger = 'real_return';
      } else if (q.includes('sip') || q.includes('compound') || q.includes('rule of 72')) {
        replyText = "Opening the **SIP Compounding Sandbox**. The Rule of 72 shows money doubles in 6 years at 12% CAGR. Delaying by 10 years costs over ₹4 Crores!";
        speech = "Displaying the 30-Year Compounding Sandbox. Starting early in your twenties is the single biggest wealth multiplier.";
        trigger = 'sip_compounding';
      } else if (q.includes('debt') || q.includes('credit card') || q.includes('emi')) {
        replyText = "Opening the **Debt Trap Lab**. Credit cards charge 42% APR. Paying only minimum due keeps you trapped for over 15 years!";
        speech = "Opening the Debt Trap Lab. Credit card debt is an extreme wealth destroyer.";
        trigger = 'debt_trap';
      } else if (q.includes('scam') || q.includes('fraud') || q.includes('telegram') || q.includes('upi')) {
        replyText = "Opening the **Scam Radar**. Remember: You NEVER enter your UPI PIN to receive money, and SEBI registered advisors never guarantee returns.";
        speech = "Opening the Scam Radar. Never enter your UPI PIN to receive money, and beware of guaranteed return traps.";
        trigger = 'scam_radar';
      }

      const aiMsg: MessageItem = {
        id: String(Date.now() + 1),
        sender: 'aurelius',
        text: replyText,
        speechText: speech,
        labTrigger: trigger,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsThinking(false);

      if (trigger) onTriggerLab(trigger);
      speakText(speech);
    }
  };

  const quickPrompts = [
    { label: "📊 50/30/20 Budgeting Rule", query: "Explain the 50/30/20 rule and how to budget" },
    { label: "📉 How Inflation Eats my FD", query: "How does inflation and taxes affect my Fixed Deposit return?" },
    { label: "🚀 30-Yr SIP vs 10-Yr Delay", query: "Show me 30-year compounding and the cost of a 10-year delay" },
    { label: "💳 The 42% Credit Card Trap", query: "Why is paying minimum due on credit cards dangerous?" },
    { label: "🚨 How to Spot Telegram Scams", query: "What are the 5 red flags of fake stock tipsters and scams?" },
  ];

  return (
    <div className="flex flex-col h-full glass-panel rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-slate-900/60">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 to-emerald-400 p-0.5">
              <div className="w-full h-full bg-[#090D16] rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            {(isSpeaking || isListening) && (
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
            )}
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
              Aurelius Voice Co-Pilot
              <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Live Speech
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">
              {isListening ? '🎙️ Listening to you...' : isSpeaking ? '🔊 Aurelius is speaking...' : isThinking ? '⚡ Analyzing financial concepts...' : 'Ready for voice query'}
            </p>
          </div>
        </div>

        {/* Audio Mute Toggle */}
        <button
          onClick={() => {
            if (isSpeaking) window.speechSynthesis.cancel();
            setVoiceMuted(!voiceMuted);
          }}
          className={`p-2 rounded-xl border transition-all ${
            voiceMuted
              ? 'bg-red-500/10 border-red-500/30 text-red-400'
              : 'bg-white/5 border-white/10 text-slate-300 hover:text-white'
          }`}
          title={voiceMuted ? 'Unmute voice' : 'Mute voice'}
        >
          {voiceMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Voice Orb Showstopper Visualizer */}
      <div className="p-6 bg-gradient-to-b from-slate-900/40 via-transparent to-slate-950/60 border-b border-white/5 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute w-56 h-56 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

        {/* Main Pulsing Orb */}
        <div className="relative my-2">
          <button
            onClick={toggleMic}
            className={`relative z-10 w-24 h-24 rounded-full flex flex-col items-center justify-center transition-all duration-300 cursor-pointer ${
              isListening
                ? 'bg-gradient-to-tr from-rose-500 via-red-500 to-amber-500 shadow-[0_0_50px_rgba(244,63,94,0.6)] scale-110'
                : isSpeaking
                ? 'bg-gradient-to-tr from-cyan-400 via-teal-500 to-emerald-400 shadow-[0_0_50px_rgba(0,242,254,0.6)] animate-orb-pulse'
                : 'bg-gradient-to-tr from-slate-800 via-slate-900 to-cyan-950/80 border border-cyan-500/30 hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(0,242,254,0.3)]'
            }`}
          >
            {isListening ? (
              <MicOff className="w-8 h-8 text-white animate-bounce" />
            ) : (
              <Mic className="w-8 h-8 text-cyan-300" />
            )}
            <span className="text-[10px] font-mono font-bold mt-1 text-white/90">
              {isListening ? 'LISTENING' : isSpeaking ? 'SPEAKING' : 'TAP TO TALK'}
            </span>
          </button>
        </div>

        {/* Dynamic Waveform Bars */}
        <div className="flex items-center gap-1.5 h-8 mt-3">
          <div className={`w-1 rounded-full bg-cyan-400 ${isSpeaking || isListening ? 'animate-wave-1' : 'h-1.5 opacity-40'}`} />
          <div className={`w-1 rounded-full bg-teal-400 ${isSpeaking || isListening ? 'animate-wave-2' : 'h-2 opacity-40'}`} />
          <div className={`w-1 rounded-full bg-emerald-400 ${isSpeaking || isListening ? 'animate-wave-3' : 'h-3 opacity-60'}`} />
          <div className={`w-1 rounded-full bg-cyan-300 ${isSpeaking || isListening ? 'animate-wave-4' : 'h-2 opacity-40'}`} />
          <div className={`w-1 rounded-full bg-blue-400 ${isSpeaking || isListening ? 'animate-wave-5' : 'h-1.5 opacity-40'}`} />
        </div>
      </div>

      {/* Conversation Feed */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'aurelius' && (
              <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5 text-cyan-400" />
              </div>
            )}
            <div
              className={`max-w-[85%] rounded-2xl p-3.5 space-y-2 ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-br-none shadow-lg shadow-cyan-600/20'
                  : 'glass-card border border-white/10 text-slate-200 rounded-bl-none'
              }`}
            >
              <p className="whitespace-pre-line leading-relaxed font-normal">{msg.text}</p>
              
              {/* Lab trigger button if synced */}
              {msg.labTrigger && (
                <button
                  onClick={() => onTriggerLab(msg.labTrigger!)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-semibold text-[11px] hover:bg-cyan-500/30 transition-colors w-full justify-between"
                >
                  <span className="flex items-center gap-1">
                    <Zap className="w-3 h-3 text-cyan-400" />
                    Launch Synced Concept Lab
                  </span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
              
              <div className="text-[9px] text-slate-400/80 text-right font-mono">
                {msg.timestamp}
              </div>
            </div>
            {msg.sender === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-3.5 h-3.5 text-blue-400" />
              </div>
            )}
          </div>
        ))}
        {isThinking && (
          <div className="flex gap-3 items-center text-slate-400 text-xs italic">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <Bot className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
            </div>
            <span>Aurelius is computing financial formula & lessons...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Voice Prompts */}
      <div className="px-4 py-2 bg-slate-900/60 border-t border-white/5 overflow-x-auto flex gap-2 no-scrollbar">
        {quickPrompts.map((p, i) => (
          <button
            key={i}
            onClick={() => handleSendQuery(p.query)}
            className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-white/5 hover:bg-cyan-500/15 border border-white/10 hover:border-cyan-500/30 text-[11px] text-slate-300 hover:text-cyan-300 transition-all font-medium flex items-center gap-1"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Text / Voice Input Footer */}
      <div className="p-3 bg-slate-900/90 border-t border-white/10">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendQuery(inputQuery);
          }}
          className="flex items-center gap-2"
        >
          <button
            type="button"
            onClick={toggleMic}
            className={`p-2.5 rounded-xl border transition-all ${
              isListening
                ? 'bg-rose-500 text-white border-rose-400 animate-pulse'
                : 'bg-white/5 text-cyan-400 border-white/10 hover:bg-cyan-500/10'
            }`}
            title="Speak with Aurelius"
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask anything or click mic to speak..."
            className="flex-1 bg-[#090D16] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />

          <button
            type="submit"
            disabled={!inputQuery.trim()}
            className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-95 transition-opacity"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
