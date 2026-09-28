import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useQuiz } from '../context/QuizContext';
import { useGamification } from '../context/GamificationContext';
import { generateRoadmap } from '../services/aiService';
import careersData from '../data/careers.json';
import {
  MapPin,
  Sparkles,
  Download,
  Printer,
  CheckSquare,
  Square,
  Calendar,
  Clock,
  Target,
  BookOpen,
  DollarSign,
  Share2,
  CheckCircle2,
  Award
} from 'lucide-react';

export default function RoadmapGenerator() {
  const { language, t } = useLanguage();
  const { quizResult } = useQuiz();
  const { addXP, unlockBadge } = useGamification();
  const [searchParams] = useSearchParams();

  const careerParam = searchParams.get('career');

  const [formData, setFormData] = useState({
    currentClass: '12th',
    stream: 'Science (PCM)',
    targetCareer: careerParam || (quizResult?.topCareers?.[0]?.title) || 'Software Engineer / AI Developer',
    state: 'Uttar Pradesh',
    budget: 'Under ₹25,000 / year (Low Budget)',
    studyHours: 4,
    preferredLanguage: language === 'hi' ? 'Hindi' : 'English'
  });

  const [roadmap, setRoadmap] = useState(null);
  const [checklistState, setChecklistState] = useState({});

  useEffect(() => {
    // Generate initial roadmap on load
    const initial = generateRoadmap(formData);
    setRoadmap(initial);
    const initialChecks = {};
    initial.checklist.forEach(item => { initialChecks[item.id] = false; });
    setChecklistState(initialChecks);
  }, []);

  const handleGenerate = (e) => {
    e.preventDefault();
    const generated = generateRoadmap(formData);
    setRoadmap(generated);
    const initialChecks = {};
    generated.checklist.forEach(item => { initialChecks[item.id] = false; });
    setChecklistState(initialChecks);
    addXP(50, 'Generated Custom Roadmap');
    unlockBadge('roadmap_pioneer');
  };

  const toggleChecklistItem = (id) => {
    setChecklistState(prev => {
      const next = { ...prev, [id]: !prev[id] };
      if (!prev[id]) {
        addXP(15, 'Completed Study Roadmap Goal');
      }
      return next;
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      {/* Header (Hidden in print) */}
      <div className="space-y-3 no-print">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 text-xs font-bold border border-blue-300">
          <MapPin className="w-3.5 h-3.5 text-blue-600" />
          <span>{language === 'hi' ? 'व्यक्तिगत अध्ययन योजना' : 'Personalised AI Study Planner'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
          {language === 'hi' ? 'पर्सनलाइज़्ड रोडमैप जनरेटर' : 'Personalised Roadmap Generator'}
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-sm max-w-3xl">
          {language === 'hi'
            ? 'अपनी कक्षा, लक्ष्य, पारिवारिक बजट और दैनिक अध्ययन समय के आधार पर 6-महीने का सटीक एक्शन प्लान बनाएं। मुफ़्त संसाधनों की सूची और पीडीएफ डाउनलोड।'
            : 'Generate a realistic 6-month preparation blueprint tailored to your target exam, available hours, and family budget. Export to PDF.'}
        </p>
      </div>

      {/* Input Form Card (Hidden in print) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-card space-y-6 no-print">
        <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-warmOrange-500" />
          <span>{language === 'hi' ? 'अपनी वर्तमान स्थिति दर्ज करें' : 'Configure Your Study Parameters'}</span>
        </h3>

        <form onSubmit={handleGenerate} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {/* Target Career or Exam */}
          <div className="space-y-1 lg:col-span-2">
            <label className="font-bold text-slate-700 dark:text-slate-300">
              {language === 'hi' ? 'लक्ष्य करियर या सरकारी परीक्षा' : 'Target Career or Government Exam'}
            </label>
            <input
              type="text"
              value={formData.targetCareer}
              onChange={(e) => setFormData({ ...formData, targetCareer: e.target.value })}
              placeholder="e.g. SSC CGL Inspector, Software Developer, B.Sc Nursing"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
              required
            />
          </div>

          {/* Current Class */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-300">
              {language === 'hi' ? 'वर्तमान कक्षा / योग्यता' : 'Current Class / Qualification'}
            </label>
            <select
              value={formData.currentClass}
              onChange={(e) => setFormData({ ...formData, currentClass: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-medium"
            >
              <option value="10th">Class 10th</option>
              <option value="11th">Class 11th</option>
              <option value="12th">Class 12th</option>
              <option value="Diploma/ITI">Diploma / ITI</option>
              <option value="Graduation 1st/2nd Yr">College Undergrad (1st/2nd Year)</option>
              <option value="Graduate">Completed Graduation</option>
            </select>
          </div>

          {/* Stream */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-300">
              {language === 'hi' ? 'विषय / स्ट्रीम' : 'Stream / Specialization'}
            </label>
            <select
              value={formData.stream}
              onChange={(e) => setFormData({ ...formData, stream: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-medium"
            >
              <option value="Science (PCM)">Science (PCM - Maths)</option>
              <option value="Science (PCB)">Science (PCB - Biology)</option>
              <option value="Commerce">Commerce</option>
              <option value="Arts / Humanities">Arts / Humanities</option>
              <option value="Vocational / ITI">Vocational / ITI</option>
            </select>
          </div>

          {/* Budget */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-300">
              {language === 'hi' ? 'वार्षिक तैयारी बजट' : 'Preparation Budget'}
            </label>
            <select
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-medium"
            >
              <option value="Zero Budget (100% Free Self Study)">Zero Budget (100% Free Self Study)</option>
              <option value="Under ₹25,000 / year (Low Budget)">Under ₹25,000 / year (Low Budget)</option>
              <option value="₹25,000 - ₹75,000 / year (Moderate)">₹25,000 - ₹75,000 / year (Moderate)</option>
              <option value="Above ₹75,000 (Open to Loans)">Above ₹75,000 (Open to Education Loans)</option>
            </select>
          </div>

          {/* Daily Study Hours */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>{language === 'hi' ? 'दैनिक अध्ययन समय:' : 'Daily Study Hours:'}</span>
              <span className="text-brand-600 font-black">{formData.studyHours} hrs/day</span>
            </label>
            <input
              type="range"
              min="2"
              max="12"
              step="1"
              value={formData.studyHours}
              onChange={(e) => setFormData({ ...formData, studyHours: parseInt(e.target.value) })}
              className="w-full accent-brand-600 mt-2"
            />
          </div>

          {/* Submit */}
          <div className="sm:col-span-2 lg:col-span-3 flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-warmOrange-500 hover:bg-warmOrange-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-warmOrange-500/20 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{language === 'hi' ? 'नया 6-महीने का रोडमैप बनाएं' : 'Generate 6-Month Roadmap'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Generated Roadmap Document Area (Printable) */}
      {roadmap && (
        <div id="roadmap-printable-doc" className="space-y-8 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-card">
          {/* Document Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b pb-6 border-slate-200 dark:border-slate-800 gap-4">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-tealAccent-600 dark:text-tealAccent-400">
                CareerPath AI Personalised Blueprint
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
                {roadmap.careerTarget}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Profile: {roadmap.profile.currentClass} • {roadmap.profile.stream} • Budget: {roadmap.profile.budget} • Generated: {roadmap.generatedAt}
              </p>
            </div>

            <div className="flex items-center gap-2 no-print shrink-0">
              <button
                onClick={handlePrint}
                className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
              >
                <Printer className="w-4 h-4" />
                <span>{language === 'hi' ? 'प्रिंट / PDF सेव करें' : 'Print / Save as PDF'}</span>
              </button>
            </div>
          </div>

          {/* Interactive Tickable Checklist */}
          <div className="p-5 rounded-2xl bg-brand-50/70 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-brand-900 dark:text-brand-200 flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-brand-600" />
                <span>{language === 'hi' ? 'तैयारी का मुख्य चेकलिस्ट (टिक करें)' : 'Essential Milestones Checklist'}</span>
              </h3>
              <span className="text-[11px] font-bold text-brand-700 dark:text-brand-300">
                {Object.values(checklistState).filter(Boolean).length} / {roadmap.checklist.length} Completed
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {roadmap.checklist.map((item) => {
                const isChecked = checklistState[item.id];
                return (
                  <button
                    key={item.id}
                    onClick={() => toggleChecklistItem(item.id)}
                    className={`text-left p-3 rounded-xl border flex items-center gap-2.5 transition-all ${
                      isChecked
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 text-emerald-800 dark:text-emerald-300 line-through'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    {isChecked ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                    <span className="text-xs font-medium">{item.text}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Month-wise Preparation Plan */}
          <div className="space-y-6">
            <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-warmOrange-500" />
              <span>{language === 'hi' ? 'महीने-दर-महीने की कार्य योजना (6 माह)' : 'Month-by-Month Action Plan'}</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {roadmap.phases.map((phase) => (
                <div
                  key={phase.month}
                  className="rounded-3xl p-5 sm:p-6 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-4 shadow-sm"
                >
                  <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-700">
                    <span className="text-xs font-black px-3 py-1 rounded-full bg-brand-600 text-white">
                      Month {phase.month}
                    </span>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      {formData.studyHours * 30} Hours Target
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      {language === 'hi' ? phase.title_hi || phase.title : phase.title}
                    </h4>
                  </div>

                  {/* Weekly Targets */}
                  <div className="space-y-1.5 text-xs">
                    <span className="font-bold text-slate-600 dark:text-slate-400 uppercase text-[10px]">
                      Weekly Action Goals:
                    </span>
                    <ul className="space-y-1 list-disc list-inside text-slate-700 dark:text-slate-300">
                      {phase.weeklyGoals.map((g, gi) => (
                        <li key={gi} className="text-xs">{g}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Free Resources */}
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 space-y-1 text-xs">
                    <span className="font-bold text-tealAccent-600 dark:text-tealAccent-400 text-[11px] block">
                      Recommended 100% Free Learning:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {phase.freeResources.map((res, ri) => (
                        <span key={ri} className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-[11px] border border-slate-200 dark:border-slate-600">
                          {res}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
