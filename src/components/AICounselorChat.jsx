import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useQuiz } from '../context/QuizContext';
import { askCounselor } from '../services/aiService';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  RotateCcw,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

const QUICK_CHIPS_EN = [
  "What to do after 12th?",
  "SSC CGL preparation roadmap",
  "How to crack UPSC IAS without coaching?",
  "Low budget engineering options",
  "Govt jobs for 10th pass",
  "Tell me about my quiz result"
];

const QUICK_CHIPS_HI = [
  "12th ke baad kya karein?",
  "SSC CGL ka roadmap",
  "Bina coaching ke UPSC kaise nikalein?",
  "Kam kharche me engineering",
  "10वीं पास के लिए सरकारी नौकरियां",
  "Mera quiz result kya batata hai?"
];

export default function AICounselorChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: 'Namaste! 🙏 I am your CareerPath AI Counselor. How can I guide you today? Ask in Hindi, English, or Hinglish!',
      time: 'Just now'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const { language } = useLanguage();
  const { quizResult } = useQuiz();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const handleSend = async (userText) => {
    const textToSend = userText || input;
    if (!textToSend.trim() || isTyping) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const aiReply = await askCounselor(textToSend, messages, quizResult, language);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: aiReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: language === 'hi' 
            ? 'माफ़ कीजिए, सर्वर से संपर्क नहीं हो पाया। कृपया दोबारा पूछें।'
            : 'Sorry, I encountered an issue. Please try asking again.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: Date.now(),
        sender: 'ai',
        text: language === 'hi'
          ? 'नमस्ते! 🙏 मैं आपका करियर AI सहायक हूँ। 10वीं, 12वीं या सरकारी नौकरियों से जुड़ा कोई भी सवाल पूछें!'
          : 'Hello! 🙏 I am your CareerPath AI Counselor. Ask me anything about streams, careers, or exams!',
        time: 'Just now'
      }
    ]);
  };

  const quickChips = language === 'hi' ? QUICK_CHIPS_HI : QUICK_CHIPS_EN;

  return (
    <div className="fixed bottom-5 right-5 z-50 floating-ai-widget">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-brand-700 via-brand-600 to-tealAccent-600 text-white shadow-xl shadow-brand-700/30 hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200"
          aria-label="Open AI Career Counselor"
        >
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
          </div>
          <div className="text-left pr-1">
            <div className="text-[11px] font-bold text-tealAccent-200 uppercase tracking-wider">
              {language === 'hi' ? 'ऑनलाइन AI गाइड' : 'Instant AI Advice'}
            </div>
            <div className="text-sm font-extrabold leading-tight">
              {language === 'hi' ? 'करियर काउंसलर' : 'Ask AI Counselor'}
            </div>
          </div>
          {/* Notification Ping Badge */}
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-warmOrange-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-warmOrange-500"></span>
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-[94vw] sm:w-[410px] h-[550px] max-h-[82vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-brand-700 to-tealAccent-700 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
                <Bot className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h3 className="text-sm font-bold flex items-center gap-1.5">
                  <span>{language === 'hi' ? 'AI करियर काउंसलर' : 'CareerPath AI Counselor'}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                </h3>
                <p className="text-[10px] text-tealAccent-200">
                  {language === 'hi' ? 'हिंदी + इंग्लिश + हिंग्लिश सहायता' : 'Bilingual • Gemini/Mock AI Enabled'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-slate-200">
              <button
                onClick={handleResetChat}
                title="Restart Chat"
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close Chat"
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Context Banner if quiz is taken */}
          {quizResult && quizResult.topCareers && (
            <div className="bg-brand-50 dark:bg-brand-950/60 px-3 py-1.5 border-b border-brand-100 dark:border-brand-900/50 flex items-center justify-between text-[11px] text-brand-800 dark:text-brand-300">
              <span className="truncate">
                🎯 Quiz Top Match: <strong>{quizResult.topCareers[0]?.title}</strong> ({quizResult.topCareers[0]?.matchScore}%)
              </span>
              <span className="text-[10px] bg-brand-200 dark:bg-brand-800 text-brand-900 dark:text-brand-100 px-1.5 py-0.5 rounded font-bold">
                Context Active
              </span>
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50 dark:bg-slate-950/50">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-lg bg-tealAccent-500/20 text-tealAccent-700 dark:text-tealAccent-300 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-sm whitespace-pre-line ${
                    m.sender === 'user'
                      ? 'bg-brand-600 text-white rounded-tr-none'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700 rounded-tl-none'
                  }`}
                >
                  {m.text}
                  <div
                    className={`text-[9px] mt-1 text-right ${
                      m.sender === 'user' ? 'text-brand-200' : 'text-slate-400'
                    }`}
                  >
                    {m.time}
                  </div>
                </div>
                {m.sender === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-brand-600/20 text-brand-700 dark:text-brand-300 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 text-slate-400 text-xs">
                <div className="w-7 h-7 rounded-lg bg-tealAccent-500/20 text-tealAccent-600 flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white dark:bg-slate-800 px-3 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Reply Chips */}
          <div className="p-2 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            {quickChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(chip)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 dark:hover:bg-brand-950 text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-300 border border-slate-200 dark:border-slate-700 transition-colors shrink-0"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={language === 'hi' ? 'अपना प्रश्न यहाँ लिखें...' : 'Ask about streams, exams, scholarships...'}
              className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="p-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-tealAccent-600 text-white font-bold hover:opacity-90 disabled:opacity-50 transition-all shrink-0"
              aria-label="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
