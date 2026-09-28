import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useParentView } from '../context/ParentViewContext';
import { useQuiz } from '../context/QuizContext';
import {
  Sparkles,
  Compass,
  Landmark,
  Bot,
  MapPin,
  TrendingUp,
  Target,
  FileText,
  GraduationCap,
  Calendar,
  CheckCircle2,
  Users,
  ShieldCheck,
  ArrowRight,
  Award,
  Zap,
  Star,
  Quote
} from 'lucide-react';

export default function Home() {
  const { language, t } = useLanguage();
  const { isParentView, toggleParentView } = useParentView();
  const { quizResult } = useQuiz();

  const features = [
    {
      to: '/quiz',
      title: language === 'hi' ? '1. AI करियर मैच क्विज़' : '1. AI Career Match Quiz',
      desc: language === 'hi' ? '12 आसान सवालों में अपनी ताकत, रुचि और पसंदीदा क्षेत्र (Govt/Pvt) जानें।' : '12 intuitive questions mapping your strengths and risk profile to 15+ career options.',
      icon: Sparkles,
      color: 'bg-indigo-500',
      badge: 'Start Here'
    },
    {
      to: '/govt-jobs',
      title: language === 'hi' ? '2. सरकारी नौकरी हब' : '2. Government Jobs Hub',
      desc: language === 'hi' ? 'UPSC, SSC, रेलवे, बैंक, पुलिस - उम्र छूट, परीक्षा पैटर्न, सिलेबस व सैलरी।' : 'UPSC, SSC, Railways, Bank, Police - age relaxations, syllabus, pay scale and perks.',
      icon: Landmark,
      color: 'bg-emerald-500',
      badge: '35+ Exams'
    },
    {
      to: '/explore',
      title: language === 'hi' ? '3. करियर एक्सप्लोरर' : '3. Career Explorer (10th/12th)',
      desc: language === 'hi' ? 'साइंस, कॉमर्स, आर्ट्स के अलावा ITI, पॉलिटेक्निक और डिप्लोमा के व्यावहारिक मार्ग।' : 'Science, Commerce, Arts plus ITI, Polytechnic, Agniveer and NSDC skill programs.',
      icon: Compass,
      color: 'bg-tealAccent-500',
      badge: 'Compare Paths'
    },
    {
      to: '/trending',
      title: language === 'hi' ? '4. ट्रेंडिंग व रिक्तियां डैशबोर्ड' : '4. Trending Vacancy Dashboard',
      desc: language === 'hi' ? 'विभागवार रिक्तियां, आवेदन ग्राफ और आगामी भर्तियों की ताज़ा जानकारी।' : 'Visual vacancy charts by department, 5-year trends, and real-time job alerts.',
      icon: TrendingUp,
      color: 'bg-warmOrange-500',
      badge: 'Live Data'
    },
    {
      to: '/roadmap',
      title: language === 'hi' ? '5. पर्सनलाइज़्ड रोडमैप जनरेटर' : '5. Personalised Roadmap Generator',
      desc: language === 'hi' ? 'अपनी कक्षा, बजट व समय के अनुसार महीने-दर-महीने का स्टडी प्लान और PDF डाउनलोड।' : 'Custom month-wise milestones, daily schedules, free courses, and PDF export.',
      icon: MapPin,
      color: 'bg-blue-600',
      badge: 'Free PDF'
    },
    {
      to: '/skill-gap',
      title: language === 'hi' ? '6. स्किल गैप एनालाइज़र' : '6. Skill Gap Radar Analyzer',
      desc: language === 'hi' ? 'रडार चार्ट से देखें कि आपके पास कौन सी स्किल्स हैं और NPTEL/SWAYAM से क्या सीखना है।' : 'Interactive radar chart comparing your current skills with industry requirements.',
      icon: Target,
      color: 'bg-rose-500',
      badge: 'Free Courses'
    },
    {
      to: '/resume',
      title: language === 'hi' ? '7. AI रिज्यूमे बिल्डर' : '7. AI Resume Builder',
      desc: language === 'hi' ? '10वीं/12वीं व कॉलेज छात्रों के लिए प्रोफेशनल रिज्यूमे बनाएं, AI बुलेट पॉइंट सुधारें।' : 'Fresher-friendly resume templates with AI bullet point enhancer and PDF print.',
      icon: FileText,
      color: 'bg-amber-500',
      badge: '2 Templates'
    },
    {
      to: '/scholarships',
      title: language === 'hi' ? '8. छात्रवृत्ति एवं एजुकेशन लोन' : '8. Scholarships & Zero-Collateral Loans',
      desc: language === 'hi' ? 'नेशनल स्कॉलरशिप पोर्टल (NSP), राज्य योजनाएं और बिना गारंटी वाले सरकारी लोन।' : 'NSP Central Sector, Pragati for Girls, Bihar Credit Card, and Vidya Lakshmi loans.',
      icon: GraduationCap,
      color: 'bg-cyan-600',
      badge: 'Funding'
    }
  ];

  const testimonials = [
    {
      name: "Rahul Verma",
      location: "Gorakhpur, Uttar Pradesh",
      role: "Class 12 (PCM)",
      avatar: "👨‍🎓",
      text: language === 'hi'
        ? "मेरे परिवार में कोई इंजीनियर नहीं था। करियरपाथ AI के क्विज़ से मुझे पता चला कि मैं IIT मद्रास का ऑनलाइन BS डेटा साइंस घर बैठे बहुत कम खर्च में कर सकता हूँ!"
        : "Coming from a rural farming family, I had zero guidance. CareerPath AI showed me how to pursue IIT Madras's online degree while staying at home with zero JEE pressure."
    },
    {
      name: "Pooja Kumari",
      location: "Samastipur, Bihar",
      role: "College 1st Year (BA)",
      avatar: "👩‍🎓",
      text: language === 'hi'
        ? "SSC CGL की पूरी प्रक्रिया - बिना किसी कोचिंग के - महीने दर महीने कैसे तैयार करनी है, यहाँ के रोडमैप ने मेरा डर निकाल दिया। CTET और BPSC का फर्क भी समझ आया।"
        : "The step-by-step SSC CGL roadmap broke down the preparation into manageable monthly tasks. The free NCERT and PYQ links saved me thousands in coaching fees."
    },
    {
      name: "Dharmesh Saini",
      location: "Alwar, Rajasthan",
      role: "ITI Electrician Aspirant",
      avatar: "🧑‍🔧",
      text: language === 'hi'
        ? "10वीं के बाद घर की आर्थिक स्थिति ठीक नहीं थी। 'Parent View' देखकर मेरे पिताजी ने मुझे पॉलिटेक्निक डिप्लोमा में दाखिला दिला दिया, क्योंकि सरकारी फीस बहुत कम थी।"
        : "The Parent View made it so easy to convince my father! He saw the exact government fees and the railway loco pilot job security, and agreed immediately."
    }
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-24 bg-gradient-to-b from-brand-50/80 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900/60 dark:to-slate-950 border-b border-slate-200/60 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            {/* Tagline Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100/70 dark:bg-brand-900/50 border border-brand-200 dark:border-brand-700/60 text-brand-800 dark:text-brand-300 text-xs sm:text-sm font-bold shadow-sm">
              <Sparkles className="w-4 h-4 text-warmOrange-500 animate-spin-slow" />
              <span>
                {language === 'hi'
                  ? '🇮🇳 भारत के 10वीं व 12वीं छात्रों के लिए AI करियर मार्गदर्शक'
                  : 'AI-Powered Career Readiness & Employability Platform'}
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15]">
              {language === 'hi' ? (
                <>
                  अपना सही करियर चुनो, <br />
                  <span className="bg-gradient-to-r from-brand-600 via-tealAccent-600 to-warmOrange-500 bg-clip-text text-transparent">
                    AI और सही दिशा
                  </span> के साथ
                </>
              ) : (
                <>
                  Apna Sahi Career Chuno, <br />
                  <span className="bg-gradient-to-r from-brand-600 via-tealAccent-600 to-warmOrange-500 bg-clip-text text-transparent">
                    AI Ke Saath
                  </span>
                </>
              )}
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
              {t('hero_subtitle')}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
              <Link
                to="/quiz"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-warmOrange-500 hover:bg-warmOrange-600 active:scale-95 text-white font-bold text-sm sm:text-base shadow-lg shadow-warmOrange-500/25 transition-all group"
              >
                <Sparkles className="w-5 h-5 text-amber-200 group-hover:rotate-12 transition-transform" />
                <span>{t('hero_cta_quiz')}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/govt-jobs"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-sm sm:text-base shadow-lg shadow-brand-700/20 transition-all"
              >
                <Landmark className="w-5 h-5 text-tealAccent-300" />
                <span>{t('hero_cta_govt')}</span>
              </Link>

              <button
                onClick={() => {
                  const floatingBtn = document.querySelector('.floating-ai-widget button');
                  if (floatingBtn) floatingBtn.click();
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-brand-500 text-slate-800 dark:text-slate-200 font-bold text-sm sm:text-base shadow-sm hover:shadow-md transition-all"
              >
                <Bot className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                <span>{t('hero_cta_ai')}</span>
              </button>
            </div>

            {/* Active Quiz Match Alert if completed */}
            {quizResult && quizResult.topCareers && (
              <div className="mt-4 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 inline-flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  {language === 'hi'
                    ? `आपका पिछला क्विज़ सक्रिय है: टॉप मैच ${quizResult.topCareers[0]?.title} (${quizResult.topCareers[0]?.matchScore}%)`
                    : `Active Quiz Match: ${quizResult.topCareers[0]?.title} (${quizResult.topCareers[0]?.matchScore}% Match)`}
                </span>
                <Link to="/roadmap" className="font-bold underline ml-1 hover:text-emerald-950">
                  {language === 'hi' ? 'रोडमैप देखें →' : 'View Roadmap →'}
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Decorative Blurred Color Spots */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-400/10 dark:bg-brand-500/10 blur-[100px] pointer-events-none -z-0"></div>
      </section>

      {/* Animated Stat Counters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-soft text-center group hover:border-brand-500 transition-colors">
            <div className="text-2xl sm:text-4xl font-extrabold text-brand-600 dark:text-brand-400 group-hover:scale-105 transition-transform">
              {t('stat_students')}
            </div>
            <div className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">
              {t('stat_students_label')}
            </div>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-soft text-center group hover:border-tealAccent-500 transition-colors">
            <div className="text-2xl sm:text-4xl font-extrabold text-tealAccent-600 dark:text-tealAccent-400 group-hover:scale-105 transition-transform">
              {t('stat_careers')}
            </div>
            <div className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">
              {t('stat_careers_label')}
            </div>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-soft text-center group hover:border-warmOrange-500 transition-colors">
            <div className="text-2xl sm:text-4xl font-extrabold text-warmOrange-500 group-hover:scale-105 transition-transform">
              {t('stat_exams')}
            </div>
            <div className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">
              {t('stat_exams_label')}
            </div>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-soft text-center group hover:border-cyan-500 transition-colors">
            <div className="text-2xl sm:text-4xl font-extrabold text-cyan-600 dark:text-cyan-400 group-hover:scale-105 transition-transform">
              {t('stat_scholarships')}
            </div>
            <div className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">
              {t('stat_scholarships_label')}
            </div>
          </div>
        </div>
      </section>

      {/* How it works in 3 steps */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {t('how_it_works_title')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
            {language === 'hi'
              ? 'बिना किसी उलझन के सिर्फ 3 चरणों में अपना भविष्य निर्धारित करें।'
              : 'Demystifying career choices with structured AI guidance for every student.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="relative p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-card hover:shadow-soft-hover transition-all">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-900/60 text-brand-600 dark:text-brand-300 flex items-center justify-center font-black text-xl mb-4">
              01
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              {t('how_step1_title')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {t('how_step1_desc')}
            </p>
          </div>

          {/* Step 2 */}
          <div className="relative p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-card hover:shadow-soft-hover transition-all">
            <div className="w-12 h-12 rounded-2xl bg-tealAccent-50 dark:bg-tealAccent-900/60 text-tealAccent-600 dark:text-tealAccent-300 flex items-center justify-center font-black text-xl mb-4">
              02
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              {t('how_step2_title')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {t('how_step2_desc')}
            </p>
          </div>

          {/* Step 3 */}
          <div className="relative p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-card hover:shadow-soft-hover transition-all">
            <div className="w-12 h-12 rounded-2xl bg-warmOrange-50 dark:bg-warmOrange-900/60 text-warmOrange-500 flex items-center justify-center font-black text-xl mb-4">
              03
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              {t('how_step3_title')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {t('how_step3_desc')}
            </p>
          </div>
        </div>
      </section>

      {/* Parent View Callout Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-tealAccent-500/10 border-2 border-amber-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500 text-white text-xs font-bold">
              <Users className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'विशेष फीचर: अभिभावक व्यू' : 'Special Feature: Parent View'}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {language === 'hi'
                ? 'माता-पिता के मन की हर शंका का सीधा समाधान'
                : 'Empowering Parents with Clear Insights on Cost, Safety & Job Security'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {language === 'hi'
                ? 'अक्सर अभिभावक बच्चों के नए करियर विकल्पों को लेकर चिंतित रहते हैं। हमारे \'Parent View\' टॉगल से हर कोर्स का सरकारी फीस खर्च, स्कॉलरशिप, रहने की सुरक्षा और सरकारी नौकरी की गारंटी सीधे समझें।'
                : 'Rural and first-generation parents often worry about course fees and future security. Toggle Parent View to evaluate any career on Course Fees, Govt Subsidies, Physical Safety, and Return on Investment.'}
            </p>
          </div>
          <button
            onClick={toggleParentView}
            className={`px-6 py-3 rounded-2xl font-bold text-sm shadow-md transition-all shrink-0 ${
              isParentView
                ? 'bg-amber-600 text-white hover:bg-amber-700'
                : 'bg-amber-500 text-white hover:bg-amber-600'
            }`}
          >
            {isParentView
              ? (language === 'hi' ? 'अभिभावक व्यू चालू है (बंद करें)' : 'Parent View Active (Toggle Off)')
              : (language === 'hi' ? 'अभिभावक व्यू आज़माएं' : 'Try Parent View Now')}
          </button>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {t('features_title')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
            {language === 'hi'
              ? 'क्विज़ से लेकर रिज्यूमे और स्कॉलरशिप तक - आपकी तैयारी के सभी साधन एक ही मंच पर।'
              : 'A full-stack ecosystem designed to take you from career discovery to first job readiness.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <Link
                key={i}
                to={f.to}
                className="group relative p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-card hover:shadow-soft-hover hover:border-brand-500 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl ${f.color} text-white flex items-center justify-center shadow-md`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      {f.badge}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors mb-1.5">
                    {f.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {f.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-750 flex items-center text-xs font-bold text-brand-600 dark:text-brand-400 group-hover:translate-x-1 transition-transform">
                  <span>{language === 'hi' ? 'खोलें' : 'Explore Tool'}</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {t('testimonials_title')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
            {language === 'hi'
              ? 'देखें कैसे हमारे प्लेटफॉर्म ने ग्रामीण और अर्ध-शहरी युवाओं को नई उम्मीद दी।'
              : 'Real stories from students and parents finding clarity and confidence.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((tItem, i) => (
            <div
              key={i}
              className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-card flex flex-col justify-between"
            >
              <div className="space-y-3">
                <Quote className="w-6 h-6 text-brand-400 opacity-60" />
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 italic leading-relaxed">
                  "{tItem.text}"
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center gap-3">
                <span className="text-2xl">{tItem.avatar}</span>
                <div>
                  <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                    {tItem.name}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {tItem.role} • {tItem.location}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="rounded-3xl bg-gradient-to-r from-brand-800 via-brand-700 to-tealAccent-700 text-white p-8 sm:p-12 text-center space-y-5 shadow-xl">
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
            {language === 'hi'
              ? 'आज ही अपने सपनों के करियर की ओर पहला कदम उठाएं'
              : 'Take Your First Confident Step Towards Your Dream Career'}
          </h2>
          <p className="text-xs sm:text-base text-tealAccent-100 max-w-xl mx-auto">
            {language === 'hi'
              ? 'सिर्फ 3 मिनट का क्विज़ दें या सीधे सरकारी नौकरियों का सिलेबस और रोडमैप डाउनलोड करें।'
              : 'No coaching fees. No confusing jargon. Just transparent, AI-guided clarity.'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/quiz"
              className="px-6 py-3.5 rounded-2xl bg-warmOrange-500 hover:bg-warmOrange-600 text-white font-bold text-sm shadow-lg shadow-warmOrange-600/30 transition-all"
            >
              {language === 'hi' ? 'करियर क्विज़ शुरू करें' : 'Start 3-Min Quiz'}
            </Link>
            <Link
              to="/explore"
              className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition-all"
            >
              {language === 'hi' ? 'करियर एक्सप्लोर करें' : 'Explore All Paths'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
