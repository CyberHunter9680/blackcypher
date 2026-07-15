import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Terminal, Bot, Shield, Zap, BookOpen, Award, Video } from 'lucide-react';

interface ChatMessage {
  sender: 'bot' | 'user';
  text: string;
  timestamp: Date;
}

const quickPrompts = [
  { label: '🗺️ Roadmap', text: 'Cyber Roadmap?' },
  { label: '📜 Certs', text: 'How to get Certificates?' },
  { label: '📹 Doubt Sessions', text: 'Saturday Doubt Meetings?' },
  { label: '🏫 Campus', text: 'Book School Session?' },
];

export const AIChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'bot',
      text: "Hello! I'm Cypher-AI, your Black Cypher assistant. Ask me about our courses, certifications, doubt sessions, or campus booking!",
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollChat = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollChat();
  }, [messages, isOpen, isTyping]);

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      sender: 'user',
      text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = "I'm not sure about that. You can ask me about Roadmap, Certificates, Doubt Sessions, Pricing, or Campus Bookings!";
      const query = text.toLowerCase();

      if (query.includes('roadmap') || query.includes('path') || query.includes('course')) {
        reply = "Our Roadmap takes you from Cyber Fundamentals → OSINT → Ethical Hacking (CEH) → Web Pentesting → SOC Defense → Linux Privesc → Active Directory → Reverse Engineering.\n\nFree tier: first 2 nodes. Pro Operator: full access to all 8 tracks!";
      } else if (query.includes('cert') || query.includes('diploma') || query.includes('certificate')) {
        reply = "Certificates are awarded exclusively for our campus training programs (1-week, 1-month, 2-month, 3-month plans), which include verified syllabus exams and direct trainer assessment.";
      } else if (query.includes('meet') || query.includes('doubt') || query.includes('saturday') || query.includes('sunday') || query.includes('session')) {
        reply = "Pro Operators get 1 month of Sat & Sun doubt-clearing via Google Meet — 2+ hours per session, max 15 operators, direct trainer access. You can extend with 1, 2, or 3-month renewal packs!";
      } else if (query.includes('book') || query.includes('school') || query.includes('college') || query.includes('campus')) {
        reply = "We offer institutional campus bookings from 1-week bootcamps (₹14,999) to 3-month full programs (₹1,29,999). Includes custom syllabus, live labs, and student certificates. Scroll to Campus Bookings on the Pricing page!";
      } else if (query.includes('price') || query.includes('plan') || query.includes('free') || query.includes('pro') || query.includes('cost')) {
        reply = "Black Cypher has two core plans:\n\n🆓 Free Recruit: Basic access to roadmaps & cheatsheets\n⚡ Pro Operator: ₹2,999/mo — full course library, books, live doubt sessions, sandbox arenas & pro badge!";
      } else if (query.includes('hi') || query.includes('hello') || query.includes('hey')) {
        reply = "Hey there, Operator! 👋 How can I help you today? I can guide you on:\n• Cyber Roadmap\n• Certificates\n• Doubt Sessions\n• Campus Bookings\n• Pricing Plans";
      } else if (query.includes('contact') || query.includes('email') || query.includes('support')) {
        reply = "For support, reach out at admin@blackcypher.org or visit the Contact page. Our team typically responds within 24 hours!";
      }

      setIsTyping(false);
      const botMsg: ChatMessage = { sender: 'bot', text: reply, timestamp: new Date() };
      setMessages(prev => [...prev, botMsg]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[99]" style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
      
      {/* Floating trigger button */}
      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full flex items-center justify-center cursor-pointer relative shadow-[0_0_25px_rgba(6,182,212,0.4)] bg-gradient-to-br from-accent-cyan to-cyan-600 text-black transition-all"
      >
        <span className="absolute inset-0 rounded-full border-2 border-accent-cyan/40 animate-ping opacity-40 pointer-events-none" />
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <X className="w-6 h-6" />
            </motion.span>
          ) : (
            <motion.span key="bot" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <Bot className="w-6 h-6" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-[68px] right-0 w-[360px] sm:w-[400px] h-[540px] flex flex-col rounded-2xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.6)] border border-white/[0.08]"
            style={{ background: 'linear-gradient(to bottom, #0a0f1e, #050912)' }}
          >
            {/* Header */}
            <div className="relative px-4 py-3 flex items-center justify-between border-b border-white/[0.06] shrink-0"
              style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.08), rgba(139,92,246,0.05))' }}
            >
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:20px_20px]" />
              <div className="relative flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-accent-cyan/15 border border-accent-cyan/25 flex items-center justify-center shadow-[0_0_12px_rgba(6,182,212,0.2)]">
                  <Shield className="w-4.5 h-4.5 text-accent-cyan" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white tracking-wide">Cypher-AI</span>
                    <span className="flex items-center gap-1 text-[9px] font-mono text-accent-emerald bg-accent-emerald/10 border border-accent-emerald/20 px-1.5 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-emerald animate-pulse" />
                      ONLINE
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-mono">Black Cypher Assistant</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="relative text-slate-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/[0.05]">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'bot' && (
                    <div className="w-7 h-7 rounded-full bg-accent-cyan/15 border border-accent-cyan/25 flex items-center justify-center shrink-0 mb-1">
                      <Bot className="w-3.5 h-3.5 text-accent-cyan" />
                    </div>
                  )}
                  <div className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed whitespace-pre-line ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-br from-accent-cyan to-cyan-700 text-black font-medium rounded-br-md'
                      : 'bg-white/[0.05] border border-white/[0.07] text-slate-200 rounded-bl-md'
                  }`}>
                    {msg.text}
                  </div>
                  {msg.sender === 'user' && (
                    <div className="w-7 h-7 rounded-full bg-accent-violet/15 border border-accent-violet/25 flex items-center justify-center shrink-0 mb-1">
                      <Zap className="w-3.5 h-3.5 text-accent-violet" />
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-end gap-2">
                  <div className="w-7 h-7 rounded-full bg-accent-cyan/15 border border-accent-cyan/25 flex items-center justify-center shrink-0">
                    <Bot className="w-3.5 h-3.5 text-accent-cyan" />
                  </div>
                  <div className="bg-white/[0.05] border border-white/[0.07] rounded-2xl rounded-bl-md px-4 py-3 flex gap-1.5 items-center">
                    {[0, 0.15, 0.3].map((delay, j) => (
                      <motion.span
                        key={j}
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 0.7, delay, ease: 'easeInOut' }}
                        className="w-1.5 h-1.5 rounded-full bg-accent-cyan/60"
                      />
                    ))}
                  </div>
                </motion.div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick prompts */}
            <div className="px-4 py-2 border-t border-white/[0.04] bg-black/20 flex gap-2 overflow-x-auto shrink-0" style={{ scrollbarWidth: 'none' }}>
              {quickPrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(prompt.text)}
                  className="text-[10px] font-medium text-accent-cyan bg-accent-cyan/8 border border-accent-cyan/20 hover:bg-accent-cyan/15 px-3 py-1.5 rounded-full transition-all whitespace-nowrap shrink-0 hover:border-accent-cyan/40"
                >
                  {prompt.label}
                </button>
              ))}
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="p-3 border-t border-white/[0.06] flex gap-2 items-center bg-black/30 shrink-0"
            >
              <input
                type="text"
                placeholder="Ask Cypher-AI anything..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 bg-white/[0.04] border border-white/[0.08] focus:border-accent-cyan/50 rounded-xl px-4 py-2.5 text-white text-sm outline-none transition-all placeholder:text-slate-600 font-sans"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={!inputText.trim()}
                className="w-10 h-10 rounded-xl bg-accent-cyan hover:bg-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed text-black flex items-center justify-center cursor-pointer transition-colors shrink-0"
              >
                <Send className="w-4 h-4" />
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
