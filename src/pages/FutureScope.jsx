import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  Rocket,
  Users,
  Mic,
  Languages,
  MessageCircle,
  WifiOff,
  Video,
  CheckCircle,
  Bell,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function FutureScope() {
  const { language } = useLanguage();
  const [subscribed, setSubscribed] = useState({});

  const handleNotify = (id) => {
    setSubscribed(prev => ({ ...prev, [id]: true }));
  };

  const futureModules = [
    {
      id: 'mentor_connect',
      title: language === 'hi' ? '1. मेंटॉर कनेक्ट (सफल अधिकारियों से 1-on-1)' : '1. 1-on-1 Verified Mentor Connect',
      desc: language === 'hi' ? 'IAS, IPS, बैंक PO, और सॉफ्टवेयर इंजीनियर्स से सीधे वीडियो कॉल और मार्गदर्शन सत्र।' : 'Connect directly with working officers and engineers who cleared competitive exams from similar rural backgrounds.',
      icon: Users,
      badge: 'Phase 2 (Q1 2027)',
      details: 'Book 20-minute video slots with verified government officers and tech leads. Free for scholarship students.'
    },
    {
      id: 'ai_mock_interviews',
      title: language === 'hi' ? '2. AI वीडियो मॉक इंटरव्यू' : '2. Real-Time AI Video Mock Interviews',
      desc: language === 'hi' ? 'UPSC, Bank PO और SSC के लिए वेबकैम आधारित AI इंटरव्यूअर जो आपके बॉडी लैंग्वेज और उत्तरों का विश्लेषण करेगा।' : 'Interactive AI interviewer evaluating voice clarity, hesitation, posture, and answer quality with instant rubric feedback.',
      icon: Video,
      badge: 'Phase 2 (Q1 2027)',
      details: 'Simulation of SSB military interviews and Bank PO panels with situational questions in Hindi & English.'
    },
    {
      id: 'voice_input',
      title: language === 'hi' ? '3. वॉइस इनपुट व संवाद (बोलो और जानो)' : '3. Vernacular Voice Input & Speech AI',
      desc: language === 'hi' ? 'कम पढ़े-लिखे माता-पिता और छात्रों के लिए बोलकर सवाल पूछने की सुविधा।' : 'Speech-to-text allowing first-generation students and parents to simply speak their doubts in regional dialects.',
      icon: Mic,
      badge: 'Under Pilot',
      details: 'Integrated with Bhashini (Govt of India National Language Translation Mission) API.'
    },
    {
      id: 'regional_languages',
      title: language === 'hi' ? '4. 8 भारतीय भाषाओं में अनुवाद' : '4. 8 Indian Regional Languages',
      desc: language === 'hi' ? 'तमिल, तेलुगु, बंगाली, मराठी, गुजराती, कन्नड़, ओडिया और असमिया में संपूर्ण इंटरफेस।' : 'Expanding beyond Hindi and English to Bengali, Marathi, Tamil, Telugu, Gujarati, and Kannada.',
      icon: Languages,
      badge: 'Phase 3',
      details: 'Localization of state-level recruitment exams (WBPSC, MPSC, TNPSC, APPSC).'
    },
    {
      id: 'whatsapp_bot',
      title: language === 'hi' ? '5. व्हाट्सऐप करियर बॉट' : '5. WhatsApp Interactive Bot & Daily Alerts',
      desc: language === 'hi' ? 'बिना इंटरनेट ऐप खोले सिर्फ व्हाट्सऐप पर परीक्षा तिथियां, स्कॉलरशिप अलर्ट और क्विज़ सहायता।' : 'Zero-friction daily notifications, exam countdowns, and quiz assistance delivered straight to WhatsApp.',
      icon: MessageCircle,
      badge: 'Under Testing',
      details: 'Students can text "SSC" or "12th" to a WhatsApp number and receive instant PDF roadmaps directly.'
    },
    {
      id: 'offline_mode',
      title: language === 'hi' ? '6. पूर्ण ऑफलाइन PWA मोड (कम नेटवर्क हेतु)' : '6. Ultra-Light Offline PWA Mode',
      desc: language === 'hi' ? 'कमजोर 2G/3G नेटवर्क या बिना इंटरनेट के भी पूरा रोडमैप और परीक्षा सिलेबस फोन में सुरक्षित।' : 'Progressive Web App (PWA) with local caching so students in zero-connectivity villages can access saved blueprints.',
      icon: WifiOff,
      badge: 'Ready for Rollout',
      details: 'Full local SQLite/IndexedDB offline engine with 0 bytes bandwidth consumption after initial load.'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 text-xs font-bold border border-indigo-300">
          <Rocket className="w-3.5 h-3.5 text-indigo-600" />
          <span>{language === 'hi' ? 'आगामी उत्पाद रोडमैप' : 'Hackathon Vision & Future Scope'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
          {language === 'hi' ? 'भविष्य की योजनाएं (Future Scope & Scalability)' : 'Future Roadmap & Vision'}
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-sm max-w-3xl">
          {language === 'hi'
            ? 'करियरपाथ AI को भारत के हर गांव और कस्बे तक ले जाने के लिए तैयार किए जा रहे 6 आगामी क्रांतिकारी फीचर्स।'
            : 'How CareerPath AI scales to empower 10 Million+ Indian students through vernacular voice AI, mentor linkages, and offline edge computing.'}
        </p>
      </div>

      {/* Grid of 6 Future Scope Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {futureModules.map((mod) => {
          const Icon = mod.icon;
          const isNotified = !!subscribed[mod.id];
          return (
            <div
              key={mod.id}
              className="rounded-3xl p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-card hover:shadow-soft-hover transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                    {mod.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    {mod.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {mod.desc}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 text-[11px] text-slate-600 dark:text-slate-300">
                  {mod.details}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-700">
                <button
                  onClick={() => handleNotify(mod.id)}
                  disabled={isNotified}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    isNotified
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                      : 'bg-brand-600 hover:bg-brand-700 text-white'
                  }`}
                >
                  {isNotified ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{language === 'hi' ? 'रिमाइंडर पंजीकृत ✓' : 'Interest Registered ✓'}</span>
                    </>
                  ) : (
                    <>
                      <Bell className="w-3.5 h-3.5" />
                      <span>{language === 'hi' ? 'लॉन्च पर मुझे सूचित करें' : 'Notify Me on Launch'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
