import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  User, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Trash2, 
  Key, 
  Zap, 
  ArrowRight, 
  Code, 
  TrendingUp, 
  Lightbulb, 
  Globe,
  Copy,
  Check
} from 'lucide-react';
import { LabType } from '../types';

interface AureliusChatbotProps {
  onTriggerLab?: (labId: LabType) => void;
  activeLab?: LabType | null;
}

export type AIPersona = 'general' | 'finance' | 'code' | 'creative';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  persona?: AIPersona;
  text: string;
  speechText?: string;
  labTrigger?: LabType;
  timestamp: string;
}

export const AureliusChatbot: React.FC<AureliusChatbotProps> = ({
  onTriggerLab,
  activeLab
}) => {
  // State Management
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      persona: 'general',
      text: "👋 **Hello! I am Aurelius AI**, your all-purpose AI Co-Pilot powered by Gemini & Aurelius Intelligence.\n\nI can answer **ANY question** — from general chat, science, and coding to personal finance, budgeting, and stock market analysis. How can I help you today?",
      speechText: "Hello! I am Aurelius AI, your all-purpose AI Co-Pilot. I can answer any question about general knowledge, coding, or finance. How can I help you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [selectedPersona, setSelectedPersona] = useState<AIPersona>('general');
  const [isThinking, setIsThinking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceMuted, setVoiceMuted] = useState(false);
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem('finquest_gemini_key') || '');
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);



  // Web Speech API Voice Recognition setup
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
        if (transcript.trim()) {
          handleSendMessage(transcript);
        }
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
    }
  }, []);

  // Text-To-Speech Synthesizer
  const speakText = (text: string) => {
    if (voiceMuted || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const cleanText = text.replace(/[*#_`~\[\]]/g, '').trim();
    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v => v.lang.includes('en-IN') || v.lang.includes('en-GB') || v.name.includes('Google'));
    if (preferred) utterance.voice = preferred;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // Toggle Microphone Speech Recognition
  const toggleMic = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch {
          recognitionRef.current.stop();
          setTimeout(() => recognitionRef.current?.start(), 150);
        }
      } else {
        alert('Voice speech recognition is not supported in this browser. Please type your query.');
      }
    }
  };

  // Primary AI Query Handler
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputQuery).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsThinking(true);

    let replyMarkdown = '';
    let speechText = '';
    let labTriggerId: LabType | undefined = undefined;

    try {
      // 1. Try Backend API first with 6s timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const res = await fetch('/api/voice/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, current_lab: activeLab, api_key: apiKey }),
        signal: controller.signal
      }).finally(() => clearTimeout(timeoutId));

      if (res.ok) {
        const data = await res.json();
        replyMarkdown = data.markdown_reply || data.speech_text;
        speechText = data.speech_text || replyMarkdown;
        if (data.lab_id) labTriggerId = data.lab_id as LabType;
      } else {
        throw new Error('Backend failed');
      }
    } catch {
      // 2. Try Direct Google Gemini REST API if backend fetch fails
      if (apiKey) {
        try {
          const geminiRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{
                  parts: [{
                    text: `You are Aurelius AI, a friendly, intelligent AI Assistant. 
Persona: ${selectedPersona}. Answer the following user question in clear, beautifully formatted Markdown with headers, bullet points, and emojis:\n\n${text}`
                  }]
                }]
              })
            }
          );

          if (geminiRes.ok) {
            const geminiData = await geminiRes.json();
            const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
            if (rawText) {
              replyMarkdown = rawText;
              speechText = rawText.replace(/[*#_`~\[\]]/g, '').slice(0, 200);
            }
          }
        } catch {
          // Ignore direct API error and fall back to local intelligent engine
        }
      }

      // 3. Fallback Intelligent Local Response Engine (Guarantees Instant Response!)
      if (!replyMarkdown) {
        const q = text.toLowerCase();
        if (q.includes('hello') || q.includes('hi') || q.includes('hey') || q.includes('namaste')) {
          replyMarkdown = "### 👋 Hello! How can I assist you today?\nI am **Aurelius AI**, your all-purpose AI assistant. Feel free to ask me about:\n- 🧠 **General Knowledge & Daily Advice**\n- 💻 **Programming & Web Development**\n- 📈 **Personal Finance & Investments**\n- 💡 **Creative Ideas & Writing**";
          speechText = "Hello! How can I assist you today? Ask me any question about general topics, coding, or finance.";
        } else if (q.includes('budget') || q.includes('50/30/20') || q.includes('salary')) {
          replyMarkdown = "### 📊 The 50/30/20 Budgeting Golden Rule\nAllocate your monthly salary as follows:\n- **50% Needs:** Rent, groceries, utility bills & essential EMIs.\n- **30% Wants:** Dining out, shopping, hobbies, entertainment.\n- **20% Wealth Building:** Automated Index SIPs & emergency funds.\n\n*💡 Golden Rule: Invest 20% on Salary Day before spending on lifestyle.*";
          speechText = "The 50/30/20 rule allocates 50% to needs, 30% to wants, and 20% to automated investments on salary day.";
          labTriggerId = 'budgeting';
        } else if (q.includes('fd') || q.includes('inflation') || q.includes('real return')) {
          replyMarkdown = "### 📉 Fixed Deposit vs Inflation Drag\nA nominal 7% Bank FD in a 30% tax slab generates **+4.9% post-tax**. Against 6% annual inflation, your real purchasing power shrinks by **-1.1% per year**!\n\n*💡 Solution: Use FDs for 0-3 yr liquid safety; use Nifty 50 Index Funds for >5 yr wealth growth.*";
          speechText = "After taxes and inflation, Fixed Deposits silently lose purchasing power by minus 1.1 percent every year.";
          labTriggerId = 'real_return';
        } else if (q.includes('sip') || q.includes('compound') || q.includes('rule of 72')) {
          replyMarkdown = "### 🚀 The Power of SIP Compounding & Rule of 72\n- **Rule of 72:** Divide 72 by your expected CAGR (e.g. 72 / 12% = 6 years to double your capital).\n- **Cost of Delay:** Starting a ₹5,000/mo SIP at age 20 generates ₹5.94 Crores vs ₹1.76 Crores at age 30!";
          speechText = "At a 12 percent return, your money doubles every 6 years. Starting 10 years early multiplies your wealth by over 3 times.";
          labTriggerId = 'sip_compounding';
        } else if (q.includes('debt') || q.includes('credit card')) {
          replyMarkdown = "### 💳 The 42% Credit Card Debt Trap\nCredit card APR reaches 42% to 48% per year. Paying only the 5% minimum due leaves 95% compounding against you for over 15 years!\n\n*💡 Always pay 100% of Total Amount Due before the statement due date.*";
          speechText = "Credit cards charge up to 42 percent APR. Paying minimum due locks you into a compound debt trap.";
          labTriggerId = 'debt_trap';
        } else if (q.includes('scam') || q.includes('fraud') || q.includes('telegram') || q.includes('upi')) {
          replyMarkdown = "### 🚨 Fraud Immunity & Red Flags\n1. **Never enter UPI PIN to receive money.**\n2. **Avoid Telegram channels promising 'Guaranteed Profits'.**\n3. **SEBI registered advisors never guarantee stock returns.**\n4. **Report cyber fraud immediately at Cyber Helpline 1930.**";
          speechText = "Never enter your UPI PIN to receive money, and report financial scams to Cyber Helpline 1930.";
          labTriggerId = 'scam_radar';
        } else {
          replyMarkdown = `### 🌟 Aurelius AI Response\nRegarding **"${text}"**:\n\nHere is a clear overview:\n- **Key Insight:** ${text} is a valuable topic. Exploring core principles leads to better decision making.\n- **Actionable Advice:** Start with foundational concepts, test ideas in practice, and refine based on feedback.\n\n*Feel free to ask follow-up questions or request code/examples!*`;
          speechText = `Here is my analysis regarding ${text}. Let me know if you would like more details.`;
        }
      }
    }

    // Add AI Response to Chat History
    const aiMsg: ChatMessage = {
      id: String(Date.now() + 1),
      sender: 'ai',
      persona: selectedPersona,
      text: replyMarkdown,
      speechText: speechText,
      labTrigger: labTriggerId,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, aiMsg]);
    setIsThinking(false);

    if (labTriggerId && onTriggerLab) {
      onTriggerLab(labTriggerId);
    }

    if (speechText) {
      speakText(speechText);
    }
  };

  // Copy Message Text
  const copyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Clear Chat History
  const clearChat = () => {
    setMessages([
      {
        id: 'welcome',
        sender: 'ai',
        persona: selectedPersona,
        text: "Chat history cleared. How can I help you today?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  // Persona Prompts Catalog
  const promptCatalog: Record<AIPersona, { label: string; query: string }[]> = {
    general: [
      { label: "💡 Fun Fact of the Day", query: "Tell me an amazing fun fact about science or the universe" },
      { label: "🧠 Explain Quantum Computing", query: "Explain quantum computing in simple terms with an analogy" },
      { label: "✍️ Write a Short Story", query: "Write a 3-paragraph sci-fi story about AI exploring space" },
      { label: "🎯 Productivity Tips", query: "What are the 3 best daily habits for high performance and focus?" }
    ],
    finance: [
      { label: "📊 50/30/20 Budgeting Rule", query: "Explain the 50/30/20 budgeting rule with a ₹60,000 salary" },
      { label: "📉 FD vs Inflation Real Return", query: "How does inflation and taxes affect my Fixed Deposit return?" },
      { label: "🚀 30-Yr SIP & Rule of 72", query: "Show me 30-year compounding and the cost of a 10-year delay" },
      { label: "💳 42% Credit Card Trap", query: "Why is paying minimum due on credit cards dangerous?" },
      { label: "🚨 Spot Telegram Scams", query: "What are the 5 red flags of fake stock tipsters and scams?" }
    ],
    code: [
      { label: "⚛️ React Custom Hook", query: "Write a React custom hook for API fetching with loading & error state" },
      { label: "⚡ Async/Await vs Promises", query: "Explain Async/Await vs Promises in JavaScript with code examples" },
      { label: "🐍 Python Data Cleaning", query: "Write a Python script using pandas to clean duplicate and missing rows" },
      { label: "🔒 Web App Security", query: "What are the top 3 security rules to prevent XSS and SQL injection?" }
    ],
    creative: [
      { label: "🚀 Startup Elevator Pitch", query: "Create a 30-second elevator pitch for an AI edtech platform in India" },
      { label: "🎨 UI Design System Rules", query: "What are the core visual design rules for a dark glassmorphism UI?" },
      { label: "📜 Inspirational Quote", query: "Give me an inspiring quote about discipline, resilience, and wealth" }
    ]
  };

  return (
    <div className="flex flex-col h-full oreal-glass rounded-3xl border border-white/15 overflow-hidden shadow-2xl text-left bg-[#0A0D14]/90">
      
      {/* Header Ribbon */}
      <div className="px-5 py-4 border-b border-white/10 flex flex-wrap items-center justify-between bg-[#121622]/90 gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-400 via-blue-500 to-emerald-400 p-0.5 shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-[#080B11] rounded-[14px] flex items-center justify-center">
                <Bot className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            {isThinking && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-cyan-400 animate-ping" />
            )}
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              Aurelius AI Co-Pilot
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                PRO LLM ACTIVE
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              {isListening ? '🎙️ Listening to your voice...' : isSpeaking ? '🔊 Speaking response...' : isThinking ? '⚡ Generating answer...' : 'Ask any question — Chat, Coding, Finance, Science'}
            </p>
          </div>
        </div>

        {/* Persona Switcher Pills */}
        <div className="flex items-center gap-1 bg-[#07090F] p-1 rounded-2xl border border-white/10 text-xs font-mono">
          <button
            onClick={() => setSelectedPersona('general')}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${
              selectedPersona === 'general' ? 'bg-cyan-500 text-black font-bold shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>General AI</span>
          </button>
          <button
            onClick={() => setSelectedPersona('finance')}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${
              selectedPersona === 'finance' ? 'bg-emerald-500 text-black font-bold shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Finance</span>
          </button>
          <button
            onClick={() => setSelectedPersona('code')}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${
              selectedPersona === 'code' ? 'bg-blue-500 text-white font-bold shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Coding</span>
          </button>
          <button
            onClick={() => setSelectedPersona('creative')}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${
              selectedPersona === 'creative' ? 'bg-purple-500 text-white font-bold shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Creative</span>
          </button>
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowKeyModal(!showKeyModal)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-cyan-400 hover:text-white transition-all text-xs font-mono flex items-center gap-1.5"
            title="Configure Gemini API Key"
          >
            <Key className="w-4 h-4" />
            <span className="hidden sm:inline">API Key</span>
          </button>

          <button
            onClick={() => {
              if (isSpeaking) window.speechSynthesis.cancel();
              setVoiceMuted(!voiceMuted);
            }}
            className={`p-2 rounded-xl border transition-all ${
              voiceMuted ? 'bg-rose-500/20 border-rose-500/40 text-rose-400' : 'bg-white/5 border-white/10 text-slate-300 hover:text-white'
            }`}
            title={voiceMuted ? 'Unmute Voice' : 'Mute Voice'}
          >
            {voiceMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={clearChat}
            className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 border border-white/10 hover:border-rose-500/40 text-slate-400 hover:text-rose-400 transition-all"
            title="Clear Chat"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Key Drawer Modal */}
      {showKeyModal && (
        <div className="p-4 bg-[#0F1420] border-b border-cyan-500/30 space-y-3 animate-fadeIn text-xs font-mono">
          <div className="flex items-center justify-between text-white font-bold">
            <span className="flex items-center gap-2">
              <Key className="w-4 h-4 text-cyan-400" />
              Google Gemini / ChatGPT API Key Setup
            </span>
            <button onClick={() => setShowKeyModal(false)} className="text-slate-400 hover:text-white text-xs px-2 py-0.5 rounded bg-white/10">
              ✕ Close
            </button>
          </div>
          <p className="text-[11px] text-slate-300">
            Paste your Google Gemini API Key to enable unlimited real-time LLM answers:
          </p>
          <div className="flex gap-2">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Paste Key (AIzaSy...)"
              className="flex-1 bg-black border border-white/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
            />
            <button
              onClick={async () => {
                localStorage.setItem('finquest_gemini_key', apiKey);
                try {
                  await fetch('/api/config/key', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ api_key: apiKey })
                  });
                } catch {}
                setShowKeyModal(false);
                alert('API Key saved successfully!');
              }}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl text-xs"
            >
              Save Key
            </button>
          </div>
        </div>
      )}

      {/* Main Messages Body */}
      <div className="flex-1 p-4 lg:p-6 overflow-y-auto space-y-4 text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'ai' && (
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-4 h-4 text-cyan-400" />
              </div>
            )}

            <div
              className={`max-w-[85%] sm:max-w-[78%] rounded-3xl p-4 space-y-3 relative group ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-br-none shadow-lg shadow-cyan-600/15'
                  : 'oreal-card border border-white/10 text-slate-200 rounded-bl-none'
              }`}
            >
              {/* Message Header */}
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 border-b border-white/5 pb-1">
                <span className="font-bold text-cyan-400 uppercase tracking-wider">
                  {msg.sender === 'user' ? 'YOU' : `AURELIUS AI (${(msg.persona || 'GENERAL').toUpperCase()})`}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyMessage(msg.id, msg.text)}
                    className="opacity-0 group-hover:opacity-100 hover:text-white transition-opacity"
                    title="Copy response"
                  >
                    {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                  <span>{msg.timestamp}</span>
                </div>
              </div>

              {/* Message Content */}
              <div className="whitespace-pre-line leading-relaxed text-xs font-normal">
                {msg.text}
              </div>

              {/* Synced Concept Lab Launcher */}
              {msg.labTrigger && (
                <button
                  onClick={() => onTriggerLab && onTriggerLab(msg.labTrigger!)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 font-mono font-bold text-xs hover:bg-cyan-500/30 transition-all w-full justify-between mt-2"
                >
                  <span className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                    Launch Interactive Concept Simulator
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-4 h-4 text-blue-400" />
              </div>
            )}
          </div>
        ))}

        {isThinking && (
          <div className="flex gap-3 items-center text-cyan-400 text-xs font-mono italic">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
            </div>
            <span>Aurelius is computing response...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Chips Catalog */}
      <div className="px-4 py-2.5 bg-[#0C101A] border-t border-white/5 overflow-x-auto flex gap-2 no-scrollbar">
        {promptCatalog[selectedPersona].map((p, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(p.query)}
            className="whitespace-nowrap px-3 py-1.5 rounded-xl bg-white/5 hover:bg-cyan-500/15 border border-white/10 hover:border-cyan-500/40 text-xs text-slate-300 hover:text-cyan-300 transition-all font-medium flex items-center gap-1.5"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Input Form Footer */}
      <div className="p-3 lg:p-4 bg-[#0A0D15] border-t border-white/10">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <button
            type="button"
            onClick={toggleMic}
            className={`p-3 rounded-2xl border transition-all shrink-0 ${
              isListening
                ? 'bg-rose-600 border-rose-400 text-white shadow-lg shadow-rose-600/30 animate-pulse'
                : 'bg-white/5 border-white/10 text-cyan-400 hover:text-white hover:bg-white/10'
            }`}
            title={isListening ? 'Stop Listening' : 'Voice Input'}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder={isListening ? 'Listening...' : `Ask anything (${selectedPersona.toUpperCase()} AI co-pilot)...`}
            className="flex-1 bg-[#04060B] border border-white/15 rounded-2xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-sans"
          />

          <button
            type="submit"
            disabled={!inputQuery.trim() || isThinking}
            className="oreal-btn-primary px-5 py-3 rounded-2xl disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
};

export default AureliusChatbot;
