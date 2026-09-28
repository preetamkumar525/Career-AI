import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useParentView } from '../context/ParentViewContext';
import govtExamsData from '../data/govtExams.json';
import {
  Landmark,
  Search,
  Calendar,
  DollarSign,
  BookOpen,
  Award,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Layers,
  FileText,
  HelpCircle,
  ExternalLink,
  Scale,
  X,
  Sparkles
} from 'lucide-react';

export default function GovtJobsHub() {
  const { language, t } = useLanguage();
  const { isParentView } = useParentView();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExam, setSelectedExam] = useState(null); // active exam detail view
  const [detailTab, setDetailTab] = useState('overview'); // overview, eligibility, pattern, syllabus, timeline, salary, resources, faqs
  const [compareExams, setCompareExams] = useState([]);
  const [isComparing, setIsComparing] = useState(false);

  const filteredExams = govtExamsData.filter((e) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const name = (e.name + ' ' + e.short_name + ' ' + (e.overview_hi || '')).toLowerCase();
    const org = e.organizer.toLowerCase();
    const roles = (e.target_roles || []).join(' ').toLowerCase();
    return name.includes(q) || org.includes(q) || roles.includes(q);
  });

  const toggleCompare = (exam, e) => {
    e.stopPropagation();
    if (compareExams.find(x => x.id === exam.id)) {
      setCompareExams(compareExams.filter(x => x.id !== exam.id));
    } else {
      if (compareExams.length >= 2) {
        setCompareExams([compareExams[1], exam]);
      } else {
        setCompareExams([...compareExams, exam]);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-300">
          <Landmark className="w-3.5 h-3.5" />
          <span>{language === 'hi' ? 'सम्पूर्ण सरकारी भर्ती गाइड' : 'Complete Govt Recruitment Hub'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
          {language === 'hi' ? 'सरकारी नौकरी हब (Govt Jobs Hub)' : 'Government Jobs & Civil Services Hub'}
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-sm max-w-3xl">
          {language === 'hi'
            ? 'UPSC, SSC, रेलवे, बैंक, रक्षा बल और राज्य आयोगों की प्रामाणिक जानकारी: आयु छूट, परीक्षा पैटर्न, वेतन, मुफ़्त अध्ययन सामग्री और 6-महीने का सटीक रोडमैप।'
            : 'Authoritative, transparent blueprints for UPSC CSE, SSC CGL/CHSL, Railways, Bank PO, Defence & State PSCs with category age relaxations, salary levels, and free resources.'}
        </p>
      </div>

      {/* Top Search & Compare Actions */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'hi' ? 'परीक्षा या पद खोजें (उदा: SSC, Police, UPSC)...' : 'Search exams, roles (e.g. SSC, Police, UPSC)...'}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {compareExams.length > 0 && (
          <button
            onClick={() => setIsComparing(true)}
            className="px-4 py-2 rounded-xl bg-warmOrange-500 hover:bg-warmOrange-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Scale className="w-4 h-4" />
            <span>{language === 'hi' ? `परीक्षा तुलना (${compareExams.length}/2)` : `Compare Exams (${compareExams.length}/2)`}</span>
          </button>
        )}
      </div>

      {/* Grid of Exams */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExams.map((exam) => {
          const isSelected = !!compareExams.find(x => x.id === exam.id);
          return (
            <div
              key={exam.id}
              onClick={() => {
                setSelectedExam(exam);
                setDetailTab('overview');
              }}
              className="group cursor-pointer rounded-3xl p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-card hover:shadow-soft-hover hover:border-emerald-500 transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    {exam.short_name}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {exam.frequency}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {exam.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {language === 'hi' ? exam.overview_hi || exam.overview : exam.overview}
                  </p>
                </div>

                {/* Target Roles */}
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    {language === 'hi' ? 'प्रमुख पद' : 'Target Roles'}:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {exam.target_roles?.slice(0, 3).map((r, ri) => (
                      <span key={ri} className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
                        {r}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Pay & Age preview */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-750 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">{language === 'hi' ? 'वेतन स्तर' : 'Pay Level'}</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 truncate block">
                      {exam.salary_and_perks?.in_hand?.split('+')[0] || 'Good Pay'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">{language === 'hi' ? 'आयु सीमा' : 'Age Limit'}</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {exam.eligibility?.min_age} - {exam.eligibility?.max_age_general} yrs
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                <button
                  onClick={(e) => toggleCompare(exam, e)}
                  className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition-all ${
                    isSelected
                      ? 'bg-warmOrange-50 dark:bg-warmOrange-950/40 border-warmOrange-500 text-warmOrange-600'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {isSelected ? '✓ In Compare' : '+ Compare'}
                </button>

                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center group-hover:translate-x-1 transition-transform">
                  <span>{language === 'hi' ? 'विस्तार से देखें' : 'View Blueprint'}</span>
                  <ChevronRight className="w-4 h-4 ml-0.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Exam Detail Modal View */}
      {selectedExam && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 dark:border-slate-700 animate-in fade-in duration-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b pb-4 border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  {selectedExam.short_name}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
                  {selectedExam.name}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {selectedExam.organizer} • {selectedExam.frequency}
                </p>
              </div>

              <button
                onClick={() => setSelectedExam(null)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 8 Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 border-b border-slate-100 dark:border-slate-800 no-scrollbar">
              {[
                { id: 'overview', label: language === 'hi' ? 'अवलोकन' : 'Overview' },
                { id: 'eligibility', label: language === 'hi' ? 'योग्यता व आयु छूट' : 'Eligibility & Age' },
                { id: 'pattern', label: language === 'hi' ? 'परीक्षा पैटर्न' : 'Exam Pattern' },
                { id: 'syllabus', label: language === 'hi' ? 'सिलेबस' : 'Syllabus' },
                { id: 'timeline', label: language === 'hi' ? 'रोडमैप टाइमलाइन' : 'Roadmap Timeline' },
                { id: 'salary', label: language === 'hi' ? 'वेतन व भत्ते' : 'Salary & Perks' },
                { id: 'resources', label: language === 'hi' ? 'मुफ़्त साधन' : 'Free Resources' },
                { id: 'faqs', label: language === 'hi' ? 'प्रश्नोत्तरी (FAQ)' : 'FAQs' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setDetailTab(tab.id)}
                  className={`whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    detailTab === tab.id
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <div className="space-y-4 text-xs sm:text-sm">
              {/* 1. Overview */}
              {detailTab === 'overview' && (
                <div className="space-y-4">
                  <p className="text-slate-700 dark:text-slate-200 leading-relaxed text-sm">
                    {language === 'hi' ? selectedExam.overview_hi || selectedExam.overview : selectedExam.overview}
                  </p>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-2">
                      {language === 'hi' ? 'नियुक्त किए जाने वाले प्रमुख पद:' : 'Target Appointments:'}
                    </h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedExam.target_roles?.map((role, i) => (
                        <li key={i} className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span className="font-medium text-slate-800 dark:text-slate-200">{role}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* 2. Eligibility & Age Relaxation */}
              {detailTab === 'eligibility' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-brand-50/60 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800">
                    <strong className="text-brand-900 dark:text-brand-300 block mb-1">
                      {language === 'hi' ? 'शैक्षणिक योग्यता' : 'Educational Qualification'}:
                    </strong>
                    <p className="text-slate-700 dark:text-slate-300">
                      {selectedExam.eligibility?.qualification}
                    </p>
                    <p className="mt-2 text-xs font-semibold text-brand-700 dark:text-brand-400">
                      General Age Limit: {selectedExam.eligibility?.min_age} - {selectedExam.eligibility?.max_age_general} years
                    </p>
                  </div>

                  {selectedExam.eligibility?.relaxations && (
                    <div className="space-y-2">
                      <h4 className="font-bold text-slate-900 dark:text-white">
                        {language === 'hi' ? 'श्रेणीवार आयु छूट (SC/ST/OBC/दिव्यांग/महिलाएं):' : 'Category Age & Attempt Relaxations:'}
                      </h4>
                      <div className="space-y-1.5">
                        {selectedExam.eligibility.relaxations.map((rel, ri) => (
                          <div key={ri} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-between text-xs">
                            <span className="font-bold text-slate-800 dark:text-slate-200">{rel.category}</span>
                            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{rel.age_limit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 3. Exam Pattern */}
              {detailTab === 'pattern' && (
                <div className="space-y-3">
                  {selectedExam.exam_pattern?.stages?.map((stage, si) => (
                    <div key={si} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                        {stage.stage}
                      </h4>
                      {stage.papers && (
                        <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300 text-xs">
                          {stage.papers.map((p, pi) => (
                            <li key={pi}>{p}</li>
                          ))}
                        </ul>
                      )}
                      {stage.details && <p className="text-xs text-slate-600 dark:text-slate-300">{stage.details}</p>}
                      {stage.duration && <span className="text-[11px] font-semibold text-slate-400 block">Duration: {stage.duration}</span>}
                    </div>
                  ))}
                </div>
              )}

              {/* 4. Syllabus */}
              {detailTab === 'syllabus' && (
                <div className="space-y-3">
                  {Object.entries(selectedExam.syllabus || {}).map(([sec, text]) => (
                    <div key={sec} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 space-y-1">
                      <h4 className="font-bold uppercase tracking-wider text-xs text-slate-700 dark:text-slate-300">
                        {sec.replace('_', ' ')}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{text}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* 5. Roadmap Timeline (Vertical Timeline) */}
              {detailTab === 'timeline' && (
                <div className="space-y-4">
                  <h4 className="font-bold text-slate-900 dark:text-white">
                    {language === 'hi' ? '6-महीने का स्टेप-बाय-स्टेप रोडमैप' : 'Recommended Preparation Roadmap'}
                  </h4>
                  <div className="relative pl-6 space-y-6 border-l-2 border-emerald-500/40 ml-2">
                    {selectedExam.roadmap_timeline?.map((phase, phi) => (
                      <div key={phi} className="relative space-y-1">
                        <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900"></span>
                        <div className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase">
                          {phase.phase}
                        </div>
                        <div className="font-bold text-slate-900 dark:text-white text-sm">
                          {phase.title}
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                          {phase.description}
                        </p>
                        <div className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                          🎯 Milestone: {phase.milestone}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 6. Salary & Perks */}
              {detailTab === 'salary' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-2">
                    <span className="text-xs uppercase font-bold text-emerald-700 dark:text-emerald-400 block">
                      {language === 'hi' ? 'वेतनमान एवं इन-हैंड सैलरी' : 'Pay Scale & Take-Home'}
                    </span>
                    <div className="text-xl font-black text-emerald-900 dark:text-emerald-100">
                      {selectedExam.salary_and_perks?.in_hand}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      {selectedExam.salary_and_perks?.pay_scale}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-2">
                      {language === 'hi' ? 'सरकारी सुविधाएं व भत्ते:' : 'Allowances & Perks:'}
                    </h4>
                    <ul className="space-y-1.5">
                      {selectedExam.salary_and_perks?.perks?.map((perk, pi) => (
                        <li key={pi} className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span className="text-slate-700 dark:text-slate-200">{perk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* 7. Free Resources */}
              {detailTab === 'resources' && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-500">
                    {language === 'hi'
                      ? 'भारत सरकार और शीर्ष पोर्टल्स द्वारा सत्यापित 100% मुफ़्त अध्ययन सामग्री:'
                      : 'Verified 100% free government portals and learning materials:'}
                  </p>
                  {selectedExam.free_resources?.map((res, ri) => (
                    <a
                      key={ri}
                      href={res.url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between hover:border-brand-500 transition-colors"
                    >
                      <div>
                        <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                          {res.title}
                        </div>
                        <span className="text-[10px] text-tealAccent-600 dark:text-tealAccent-400 font-semibold uppercase">
                          {res.type}
                        </span>
                      </div>
                      <ExternalLink className="w-4 h-4 text-slate-400" />
                    </a>
                  ))}
                </div>
              )}

              {/* 8. FAQs */}
              {detailTab === 'faqs' && (
                <div className="space-y-3">
                  {selectedExam.faqs?.map((faq, fi) => (
                    <div key={fi} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 space-y-1">
                      <div className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm flex items-start gap-2">
                        <HelpCircle className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                        <span>{faq.q}</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 pl-6 leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Compare Modal */}
      {isComparing && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between border-b pb-4 border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-warmOrange-500" />
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  {language === 'hi' ? 'सरकारी परीक्षाओं की तुलना' : 'Compare Government Exams'}
                </h3>
              </div>
              <button onClick={() => setIsComparing(false)} className="p-2 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {compareExams.length < 2 ? (
              <div className="text-center py-8 text-slate-500 text-sm">
                Please select 2 exams to compare.
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:gap-8 divide-x divide-slate-100 dark:divide-slate-800">
                {compareExams.map((ex) => (
                  <div key={ex.id} className="space-y-4 px-2 text-xs">
                    <h4 className="text-base font-black text-slate-900 dark:text-white">
                      {ex.name}
                    </h4>
                    <div>
                      <strong className="block text-slate-400">Frequency:</strong>
                      <span>{ex.frequency}</span>
                    </div>
                    <div>
                      <strong className="block text-slate-400">Qualification:</strong>
                      <span>{ex.eligibility?.qualification}</span>
                    </div>
                    <div>
                      <strong className="block text-slate-400">Age Limit (General):</strong>
                      <span>{ex.eligibility?.min_age} - {ex.eligibility?.max_age_general} yrs</span>
                    </div>
                    <div>
                      <strong className="block text-slate-400">In-hand Pay:</strong>
                      <span className="font-bold text-emerald-600">{ex.salary_and_perks?.in_hand}</span>
                    </div>
                    <div>
                      <strong className="block text-slate-400">Key Roles:</strong>
                      <span>{(ex.target_roles || []).join(', ')}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
