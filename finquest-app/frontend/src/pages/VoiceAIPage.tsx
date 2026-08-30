import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Bot, 
  User, 
  ArrowRight, 
  Zap, 
  Send, 
  Sparkles
} from 'lucide-react';
import { LabType, VoiceResponse, PageRoute } from '../types';

interface VoiceAIPageProps {
  onTriggerLab: (labId: LabType) => void;
  onNavigate: (page: PageRoute) => void;
}

interface MessageItem {
  id: string;
  sender: 'user' | 'aurelius';
  text: string;
  speechText?: string;
  labTrigger?: LabType;
  timestamp: string;
}

export const VoiceAIPage: React.FC<VoiceAIPageProps> = ({ onTriggerLab, onNavigate }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [voiceMuted, setVoiceMuted] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: 'welcome',
      sender: 'aurelius',
      text: "Namaste! I am Aurelius Intelligence, your NISM Financial Literacy Co-Pilot. Speak into your microphone or choose any category below to simulate and understand real-world financial mechanics.",
      speechText: "Namaste! I am Aurelius Intelligence, your financial literacy co-pilot. Speak to me or click any prompt to explore real-world money mechanics.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-IN';

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setIsListening(false);
        if (transcript.trim()) handleSendQuery(transcript);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
    }
  }, []);

  const speakText = (text: string) => {
    if (voiceMuted || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

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
        alert('Speech recognition is not supported in this browser. Please type your query in the input box.');
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
      const res = await fetch('/api/voice/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });

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

      if (data.speech_text) speakText(data.speech_text);
    } catch (err) {
      let replyText = `Here is what NISM teaches about "${text}": Follow the 50/30/20 rule, maintain an Emergency Fund of 6 months expenses, and invest in Direct Index Funds.`;
      let speech = `I have analyzed your query about ${text}. Let's examine the numbers.`;
      let trigger: LabType | undefined = undefined;

      const q = text.toLowerCase();
      if (q.includes('budget') || q.includes('50/30/20') || q.includes('salary')) {
        replyText = "Opening the **50/30/20 Budgeting Lab**. Allocate 50% for Needs, 30% for Wants, and invest 20% on the day your salary arrives!";
        speech = "Opening the 50/30/20 Budgeting Lab. Always invest 20% before lifestyle spending.";
        trigger = 'budgeting';
      } else if (q.includes('fd') || q.includes('inflation') || q.includes('real return')) {
        replyText = "Opening the **Real Return Lab**. A 7% FD gives only 4.9% post-tax in the 30% slab. Against 6% inflation, real wealth shrinks by -1.1% p.a.";
        speech = "Opening the Real Return Lab. Fixed deposits lose purchasing power after taxes and inflation.";
        trigger = 'real_return';
      } else if (q.includes('sip') || q.includes('compound') || q.includes('rule of 72')) {
        replyText = "Opening the **SIP Compounding Sandbox**. The Rule of 72 shows money doubles in 6 years at 12% CAGR. Delaying by 10 years costs over ₹4 Crores!";
        speech = "Displaying the 30-Year Compounding Sandbox. Compounding early in your twenties is the single biggest wealth multiplier.";
        trigger = 'sip_compounding';
      } else if (q.includes('debt') || q.includes('credit card') || q.includes('emi')) {
        replyText = "Opening the **Debt Trap Lab**. Credit cards charge 42% APR. Paying only minimum due keeps you trapped for over 15 years!";
        speech = "Opening the Debt Trap Lab. Credit card revolving debt is an extreme wealth destroyer.";
        trigger = 'debt_trap';
      } else if (q.includes('scam') || q.includes('fraud') || q.includes('telegram') || q.includes('upi')) {
        replyText = "Opening the **Scam Radar**. Remember: You NEVER enter your UPI PIN to receive money, and SEBI registered advisors never guarantee returns.";
        speech = "Opening the Scam Radar. Never enter your UPI PIN to receive money, and beware of guaranteed return schemes.";
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
      speakText(speech);
    }
  };

  const categories = [
    { title: "📊 Budgeting & Salary", query: "Explain the 50/30/20 rule and how to budget salary" },
    { title: "📉 FD vs Inflation Trap", query: "How does inflation and taxes eat my Fixed Deposit returns?" },
    { title: "🚀 30-Yr SIP & Compounding", query: "Show me 30-year compounding and the cost of a 10-year delay" },
    { title: "💳 42% Credit Card Trap", query: "Why is paying minimum due on credit cards dangerous?" },
    { title: "🚨 Telegram Scam Radar", query: "What are the 5 red flags of fake stock tipsters and scams?" },
    { title: "🛡️ Pure Term vs ULIP", query: "Why should I buy pure term insurance instead of ULIPs?" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-8.5rem)] min-h-[600px] animate-fadeIn">
      {/* Left Column: Voice Studio & Orb Visualizer */}
      <div className="lg:col-span-5 oreal-glass rounded-3xl p-6 border border-white/15 flex flex-col justify-between items-center text-center shadow-2xl relative overflow-hidden">
        <div className="absolute w-72 h-72 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        <div className="w-full flex items-center justify-between border-b border-white/10 pb-4">
          <div className="text-left">
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold block">
              AI COMMAND CENTER
            </span>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              Aurelius Intelligence Studio
            </h2>
          </div>
          <button
            onClick={() => {
              if (isSpeaking) window.speechSynthesis.cancel();
              setVoiceMuted(!voiceMuted);
            }}
            className={`p-2 rounded-xl border transition-all ${
              voiceMuted ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-white/5 border-white/10 text-slate-300'
            }`}
          >
            {voiceMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Master Voice Orb */}
        <div className="my-auto py-6 flex flex-col items-center">
          <button
            onClick={toggleMic}
            className={`relative z-10 w-36 h-36 rounded-full flex flex-col items-center justify-center transition-all duration-500 cursor-pointer ${
              isListening
                ? 'bg-gradient-to-tr from-rose-500 via-red-500 to-amber-500 shadow-[0_0_70px_rgba(244,63,94,0.7)] scale-110'
                : isSpeaking
                ? 'bg-gradient-to-tr from-amber-400 via-orange-500 to-amber-600 shadow-[0_0_70px_rgba(245,158,11,0.7)] animate-oreal-orb'
                : 'bg-gradient-to-tr from-[#25252b] via-[#19191c] to-[#121214] border-2 border-amber-500/40 hover:border-amber-300 hover:shadow-[0_0_50px_rgba(245,158,11,0.4)]'
            }`}
          >
            {isListening ? (
              <MicOff className="w-12 h-12 text-white animate-bounce" />
            ) : (
              <Mic className="w-12 h-12 text-amber-300" />
            )}
            <span className="text-[11px] font-mono font-bold mt-2 text-white tracking-wider">
              {isListening ? 'LISTENING...' : isSpeaking ? 'AURELIUS TALKING' : 'TAP TO SPEAK'}
            </span>
          </button>

          {/* Dynamic Frequency Audio Bars */}
          <div className="flex items-center gap-2 h-10 mt-6">
            <div className={`w-1.5 rounded-full bg-amber-400 ${isSpeaking || isListening ? 'animate-wave-1' : 'h-2 opacity-40'}`} />
            <div className={`w-1.5 rounded-full bg-orange-400 ${isSpeaking || isListening ? 'animate-wave-2' : 'h-3 opacity-40'}`} />
            <div className={`w-1.5 rounded-full bg-amber-300 ${isSpeaking || isListening ? 'animate-wave-3' : 'h-4 opacity-60'}`} />
            <div className={`w-1.5 rounded-full bg-yellow-400 ${isSpeaking || isListening ? 'animate-wave-4' : 'h-3 opacity-40'}`} />
            <div className={`w-1.5 rounded-full bg-amber-500 ${isSpeaking || isListening ? 'animate-wave-5' : 'h-2 opacity-40'}`} />
          </div>

          <p className="text-xs text-slate-400 mt-2 font-mono">
            {isListening ? 'Listening to your voice...' : isSpeaking ? 'Synthesizing voice answer...' : isThinking ? 'Computing financial simulation...' : 'Speak in English or Hinglish'}
          </p>
        </div>

        {/* Quick Voice Topics Ribbon */}
        <div className="w-full space-y-2 text-left pt-3 border-t border-white/10">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
            RECOMMENDED VOICE PROMPTS:
          </span>
          <div className="grid grid-cols-2 gap-2">
            {categories.slice(0, 4).map((c, i) => (
              <button
                key={i}
                onClick={() => handleSendQuery(c.query)}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-amber-500/15 border border-white/10 hover:border-amber-500/40 text-[11px] text-slate-300 hover:text-amber-300 transition-all font-medium truncate text-left"
              >
                {c.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column: Live Transcript */}
      <div className="lg:col-span-7 oreal-glass rounded-3xl border border-white/15 flex flex-col h-full overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-white/10 bg-slate-900/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Bot className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Aurelius Intelligence Transcript</h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            {messages.length} messages
          </span>
        </div>

        <div className="flex-1 p-5 overflow-y-auto space-y-4 text-xs">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'aurelius' && (
                <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4 text-amber-400" />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-2xl p-4 space-y-3 ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-br-none shadow-lg shadow-amber-600/20'
                    : 'oreal-card text-slate-200 rounded-bl-none'
                }`}
              >
                <p className="whitespace-pre-line leading-relaxed font-normal">{msg.text}</p>

                {msg.labTrigger && (
                  <div className="pt-1">
                    <button
                      onClick={() => {
                        onTriggerLab(msg.labTrigger!);
                        onNavigate('labs');
                      }}
                      className="oreal-btn-primary w-full justify-between text-xs py-2"
                    >
                      <span className="flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5" />
                        Launch Synced Concept Lab on Screen
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <div className="text-[10px] text-slate-400 text-right font-mono">
                  {msg.timestamp}
                </div>
              </div>
              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          ))}
          {isThinking && (
            <div className="flex gap-3 items-center text-slate-400 text-xs italic">
              <Bot className="w-4 h-4 text-amber-400 animate-spin" />
              <span>Aurelius Intelligence is computing financial simulation...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-slate-900/90 border-t border-white/10">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendQuery(inputQuery);
            }}
            className="flex items-center gap-3"
          >
            <button
              type="button"
              onClick={toggleMic}
              className={`p-3 rounded-2xl border transition-all ${
                isListening
                  ? 'bg-rose-500 text-white border-rose-400 animate-pulse'
                  : 'bg-white/5 text-amber-400 border-white/10 hover:bg-amber-500/10'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask Aurelius Intelligence anything or tap mic..."
              className="flex-1 bg-[#121214] border border-white/15 rounded-2xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors font-mono"
            />

            <button
              type="submit"
              disabled={!inputQuery.trim()}
              className="p-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white disabled:opacity-40 hover:scale-105 transition-all shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
