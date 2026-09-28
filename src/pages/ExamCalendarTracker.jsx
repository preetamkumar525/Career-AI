import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useGamification } from '../context/GamificationContext';
import {
  Calendar as CalendarIcon,
  Flame,
  Award,
  CheckCircle2,
  Square,
  Sparkles,
  Trophy,
  Clock,
  ExternalLink,
  ChevronRight,
  Zap
} from 'lucide-react';

const UPCOMING_EXAM_SCHEDULE = [
  { id: 'ex-1', name: 'UPSC NDA & NA (II) 2026', date: 'October 05, 2026', daysLeft: 7, type: 'Defence' },
  { id: 'ex-2', name: 'IBPS PO Preliminary Exam', date: 'October 19, 2026', daysLeft: 21, type: 'Banking' },
  { id: 'ex-3', name: 'RRB Assistant Loco Pilot (ALP) CBT-1', date: 'November 15, 2026', daysLeft: 48, type: 'Railways' },
  { id: 'ex-4', name: 'CTET Central Teacher Eligibility Test', date: 'December 06, 2026', daysLeft: 69, type: 'Teaching' },
  { id: 'ex-5', name: 'SSC Combined Graduate Level (CGL) Tier-1', date: 'December 18, 2026', daysLeft: 81, type: 'Central SSC' },
  { id: 'ex-6', name: 'SBI Junior Associate Prelims', date: 'January 10, 2027', daysLeft: 104, type: 'Banking' }
];

const DAILY_TASKS = [
  { id: 'dt-1', text: 'Read PIB Daily Summary or 1 editorial in Hindi/English', xp: 25 },
  { id: 'dt-2', text: 'Solve 20 Quantitative Aptitude / Speed Math questions', xp: 30 },
  { id: 'dt-3', text: 'Review 1 chapter short notes from your Personalized Roadmap', xp: 25 },
  { id: 'dt-4', text: 'Check 1 active job notification or scholarship deadline', xp: 20 }
];

export default function ExamCalendarTracker() {
  const { language } = useLanguage();
  const {
    xp,
    level,
    xpInCurrentLevel,
    streak,
    badges,
    completedTasks,
    toggleTask,
    addXP
  } = useGamification();

  const [selectedMonth, setSelectedMonth] = useState('All');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-warmOrange-100 dark:bg-warmOrange-950 text-warmOrange-800 dark:text-warmOrange-300 text-xs font-bold border border-warmOrange-300">
          <CalendarIcon className="w-3.5 h-3.5 text-warmOrange-500" />
          <span>{language === 'hi' ? 'परीक्षा तिथियां व प्रगति ट्रैकर' : 'Exam Dates & Gamified Progress'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
          {language === 'hi' ? 'परीक्षा कैलेंडर एवं प्रोग्रेस ट्रैकर' : 'Exam Calendar & Daily Habit Tracker'}
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-sm max-w-3xl">
          {language === 'hi'
            ? 'आगामी राष्ट्रीय प्रतियोगी परीक्षाओं की सटीक तिथियां, उल्टी गिनती (कैलेंडर) और दैनिक अध्ययन लक्ष्यों को पूरा करके XP और बैज अर्जित करें।'
            : 'Track official exam countdowns and build disciplined daily study habits. Earn XP, maintain streaks, and unlock achievements.'}
        </p>
      </div>

      {/* Gamification Dashboard: Level, XP Bar, Daily Streak */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-brand-800 via-brand-700 to-tealAccent-700 text-white shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center text-3xl font-black shadow-inner">
              🏆
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-tealAccent-200">
                Aspirant Level {level}
              </span>
              <h2 className="text-2xl font-black text-white">
                {level === 1 ? 'Career Explorer' : level === 2 ? 'Goal Setter' : 'Ready Achiever'}
              </h2>
            </div>
          </div>

          {/* Streak pill */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
            <Flame className="w-6 h-6 text-warmOrange-400 animate-bounce" />
            <div>
              <div className="text-lg font-black leading-none">{streak} Days</div>
              <div className="text-[10px] text-tealAccent-200 uppercase font-bold">Continuous Streak</div>
            </div>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold text-tealAccent-100">
            <span>Total Experience: {xp} XP</span>
            <span>Next Level: {100 - xpInCurrentLevel} XP to Level {level + 1}</span>
          </div>
          <div className="w-full h-3 rounded-full bg-black/20 overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-warmOrange-400 to-amber-300 rounded-full transition-all duration-500"
              style={{ width: `${xpInCurrentLevel}%` }}
            />
          </div>
        </div>
      </div>

      {/* Grid: Daily Tasks + Badges */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Daily Study Checklist */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-warmOrange-500" />
              <span>{language === 'hi' ? 'आज के अध्ययन कार्य (XP अर्जित करें)' : 'Today\'s Study Tasks (Earn XP)'}</span>
            </h3>
            <span className="text-xs text-slate-400 font-medium">Daily Refresh</span>
          </div>

          <div className="space-y-2.5">
            {DAILY_TASKS.map((task) => {
              const isDone = completedTasks.includes(task.id);
              return (
                <button
                  key={task.id}
                  onClick={() => toggleTask(task.id, task.xp)}
                  className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between gap-3 transition-all ${
                    isDone
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 text-emerald-900 dark:text-emerald-200'
                      : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-400 shrink-0" />
                    )}
                    <span className={`text-xs font-semibold ${isDone ? 'line-through text-slate-400' : ''}`}>
                      {task.text}
                    </span>
                  </div>

                  <span className="text-[11px] font-black px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border text-warmOrange-600 shrink-0">
                    +{task.xp} XP
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Badges Showcase */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-500" />
              <span>{language === 'hi' ? 'आपकी उपलब्धियां व बैज' : 'Unlocked Badges'}</span>
            </h3>
            <span className="text-xs text-slate-400 font-medium">
              {badges.filter(b => b.unlocked).length} / {badges.length}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all ${
                  badge.unlocked
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-950 dark:text-amber-200'
                    : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-750 opacity-60'
                }`}
              >
                <span className="text-2xl">{badge.icon}</span>
                <div>
                  <h4 className="font-bold text-xs">
                    {language === 'hi' ? badge.name_hi || badge.name : badge.name}
                  </h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                    {badge.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Exam Calendar Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-brand-600" />
            <span>{language === 'hi' ? 'आगामी परीक्षा समय सारिणी' : 'Upcoming Exam Schedule & Countdowns'}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {UPCOMING_EXAM_SCHEDULE.map((ex) => (
            <div
              key={ex.id}
              className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-card transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                  {ex.type}
                </span>

                <span className="text-xs font-black text-warmOrange-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{ex.daysLeft} Days to go</span>
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {ex.name}
                </h4>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                  <CalendarIcon className="w-3.5 h-3.5 text-brand-500" />
                  <span>{ex.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
