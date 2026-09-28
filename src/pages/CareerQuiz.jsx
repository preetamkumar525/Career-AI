import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useQuiz } from '../context/QuizContext';
import { useGamification } from '../context/GamificationContext';
import { useParentView } from '../context/ParentViewContext';
import questionsData from '../data/quizQuestions.json';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  RotateCcw,
  Target,
  MapPin,
  TrendingUp,
  Award,
  BookOpen,
  DollarSign,
  Clock,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export default function CareerQuiz() {
  const { language, t } = useLanguage();
  const { quizResult, calculateResults, clearQuizResult } = useQuiz();
  const { addXP, unlockBadge } = useGamification();
  const { isParentView } = useParentView();
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState(quizResult?.answers || {});
  const [isSubmitted, setIsSubmitted] = useState(!!quizResult);

  const currentQ = questionsData[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / questionsData.length) * 100);

  const handleSelectOption = (optionId) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQ.id]: optionId
    }));
  };

  const handleNext = () => {
    if (currentIndex < questionsData.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Final submission
      const result = calculateResults(selectedAnswers, questionsData);
      setIsSubmitted(true);
      addXP(100, 'Completed Career Quiz');
      unlockBadge('quiz_master');
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleRetake = () => {
    clearQuizResult();
    setSelectedAnswers({});
    setCurrentIndex(0);
    setIsSubmitted(false);
  };

  // If results are ready to display
  if (isSubmitted && quizResult?.topCareers) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-300">
        {/* Results Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-300">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>{language === 'hi' ? 'क्विज़ पूरा हुआ! +100 XP अर्जित' : 'Quiz Completed! +100 XP Earned'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            {t('quiz_results_title')}
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm max-w-xl mx-auto">
            {language === 'hi'
              ? 'आपके उत्तरों, रुचि, रिस्क प्रोफाइल और बजट के आधार पर AI द्वारा चयनित शीर्ष 3 करियर मार्ग:'
              : 'Synthesized from your 12 behavioral, aptitude, and financial preferences:'}
          </p>
        </div>

        {/* Top 3 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quizResult.topCareers.map((career, idx) => {
            const isTop = idx === 0;
            return (
              <div
                key={career.id}
                className={`relative rounded-3xl p-6 bg-white dark:bg-slate-800 border transition-all flex flex-col justify-between ${
                  isTop
                    ? 'border-brand-500 shadow-xl shadow-brand-500/10 ring-2 ring-brand-500/20 md:-translate-y-2'
                    : 'border-slate-200 dark:border-slate-700 shadow-card'
                }`}
              >
                {/* Rank Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider ${
                      idx === 0
                        ? 'bg-brand-600 text-white'
                        : idx === 1
                        ? 'bg-tealAccent-600 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    #{idx + 1} {idx === 0 ? (language === 'hi' ? 'सर्वोत्तम मैच' : 'Best Match') : ''}
                  </span>

                  <div className="flex items-center gap-1 text-sm font-black text-emerald-600 dark:text-emerald-400">
                    <Sparkles className="w-4 h-4" />
                    <span>{career.matchScore}% {t('quiz_match_score')}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight">
                      {language === 'hi' ? career.title_hi || career.title : career.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {language === 'hi' ? career.summary_hi || career.summary : career.summary}
                    </p>
                  </div>

                  {/* Why this fits you */}
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-750 space-y-1.5 text-xs">
                    <span className="font-bold text-slate-700 dark:text-slate-200 block text-[11px] uppercase tracking-wider">
                      {t('quiz_why_fit')}:
                    </span>
                    <ul className="space-y-1 text-slate-600 dark:text-slate-300 list-disc list-inside">
                      {career.reasons?.slice(0, 2).map((r, ri) => (
                        <li key={ri} className="text-[11px] leading-tight">{r}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Key Metrics */}
                  <div className="space-y-2 text-xs">
                    <div className="flex items-start gap-2">
                      <DollarSign className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-slate-700 dark:text-slate-300">
                          {t('quiz_salary')}:
                        </span>
                        <div className="text-slate-600 dark:text-slate-400 font-medium">
                          {career.salary_range}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Clock className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-slate-700 dark:text-slate-300">
                          {t('quiz_duration')}:
                        </span>
                        <div className="text-slate-600 dark:text-slate-400">
                          {career.duration}
                        </div>
                      </div>
                    </div>

                    {/* Parent View Extra Insights */}
                    {isParentView && career.parent_view && (
                      <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-900 dark:text-amber-200 space-y-1">
                        <div className="font-bold flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                          <span>{language === 'hi' ? 'अभिभावक विश्लेषण:' : 'Parent Insight:'}</span>
                        </div>
                        <p><strong>{language === 'hi' ? 'कोर्स खर्च' : 'Cost'}:</strong> {career.parent_view.cost_range}</p>
                        <p><strong>{language === 'hi' ? 'जॉब सुरक्षा' : 'Security'}:</strong> {career.parent_view.job_security_score}/10 ({career.parent_view.safety_level})</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700 flex flex-col gap-2">
                  <button
                    onClick={() => navigate(`/roadmap?career=${encodeURIComponent(career.title)}`)}
                    className="w-full py-2.5 px-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{t('quiz_get_roadmap')}</span>
                  </button>
                  <button
                    onClick={() => navigate(`/skill-gap?career=${career.id}`)}
                    className="w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-650 text-slate-800 dark:text-slate-100 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Target className="w-3.5 h-3.5 text-rose-500" />
                    <span>{t('quiz_analyze_gap')}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Retake Button & AI prompt */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={handleRetake}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t('quiz_retake')}</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/explore')}
              className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:underline"
            >
              {language === 'hi' ? 'सभी 100+ करियर देखें →' : 'Browse All 100+ Careers →'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active Quiz View (1 Question per screen)
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* Top Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
          <span>
            {t('quiz_question_counter')} {currentIndex + 1} of {questionsData.length}
          </span>
          <span className="text-brand-600 dark:text-brand-400">{progressPercent}%</span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-600 to-tealAccent-500 transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-card space-y-6">
        <div className="space-y-2">
          <span className="inline-block text-xs font-extrabold uppercase tracking-wider text-tealAccent-600 dark:text-tealAccent-400">
            {language === 'hi' ? 'करियर मैच प्रश्न' : 'Career Aptitude Indicator'}
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-snug">
            {language === 'hi' ? currentQ.question_hi || currentQ.question : currentQ.question}
          </h2>
        </div>

        {/* Options List */}
        <div className="space-y-3">
          {currentQ.options.map((opt) => {
            const isSelected = selectedAnswers[currentQ.id] === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => handleSelectOption(opt.id)}
                className={`w-full text-left p-4 sm:p-5 rounded-2xl border-2 transition-all flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'border-brand-600 bg-brand-50/70 dark:bg-brand-950/50 shadow-md text-brand-950 dark:text-white'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'border-brand-600 bg-brand-600 text-white'
                        : 'border-slate-300 dark:border-slate-600'
                    }`}
                  >
                    {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <span className="text-xs sm:text-sm font-semibold leading-relaxed">
                    {language === 'hi' ? opt.text_hi || opt.text : opt.text}
                  </span>
                </div>
                {isSelected && <ChevronRight className="w-4 h-4 text-brand-600 shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Navigation Buttons: Back / Next */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={currentIndex === 0}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('quiz_back')}</span>
          </button>

          <button
            onClick={handleNext}
            disabled={!selectedAnswers[currentQ.id]}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-warmOrange-500 hover:bg-warmOrange-600 active:scale-95 text-white text-xs font-bold shadow-md shadow-warmOrange-500/20 disabled:opacity-50 disabled:pointer-events-none transition-all"
          >
            <span>
              {currentIndex === questionsData.length - 1 ? t('quiz_submit') : t('quiz_next')}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
