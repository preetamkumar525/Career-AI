import React, { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useParentView } from '../context/ParentViewContext';
import careersData from '../data/careers.json';
import {
  Search,
  Filter,
  ArrowRight,
  Sparkles,
  BookOpen,
  DollarSign,
  Clock,
  Gauge,
  TrendingUp,
  X,
  Scale,
  ShieldCheck,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

export default function CareerExplorer() {
  const { language, t } = useLanguage();
  const { isParentView } = useParentView();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get('tab') || 'all';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [compareList, setCompareList] = useState([]);
  const [isComparing, setIsComparing] = useState(false);

  const tabs = [
    { id: 'all', label: language === 'hi' ? 'सभी मार्ग' : 'All Paths' },
    { id: '10th', label: language === 'hi' ? '10वीं के बाद (ITI/डिप्लोमा)' : 'After 10th' },
    { id: 'pcm', label: language === 'hi' ? '12वीं PCM (इंजीनियरिंग/डिफेंस)' : '12th Science (PCM)' },
    { id: 'pcb', label: language === 'hi' ? '12वीं PCB (मेडिकल/कृषि)' : '12th Science (PCB)' },
    { id: 'commerce', label: language === 'hi' ? '12वीं कॉमर्स (CA/बैंक/बिज़नेस)' : '12th Commerce' },
    { id: 'arts', label: language === 'hi' ? '12वीं आर्ट्स (UPSC/लॉ/टीचिंग)' : '12th Arts' }
  ];

  const handleTabChange = (tabId) => {
    setSearchParams(tabId === 'all' ? {} : { tab: tabId });
  };

  const filteredCareers = useMemo(() => {
    return careersData.filter((c) => {
      // Tab filter
      if (activeTab === '10th') {
        if (!c.eligible_streams?.includes('After 10th') && c.stream !== 'After 10th') return false;
      } else if (activeTab === 'pcm') {
        if (!c.eligible_streams?.includes('12th Science (PCM)') && c.stream !== '12th Science (PCM)') return false;
      } else if (activeTab === 'pcb') {
        if (!c.eligible_streams?.includes('12th Science (PCB)') && c.stream !== '12th Science (PCB)') return false;
      } else if (activeTab === 'commerce') {
        if (!c.eligible_streams?.includes('12th Commerce') && c.stream !== '12th Commerce') return false;
      } else if (activeTab === 'arts') {
        if (!c.eligible_streams?.includes('12th Arts') && c.stream !== '12th Arts') return false;
      }

      // Difficulty filter
      if (selectedDifficulty !== 'all' && c.difficulty.toLowerCase() !== selectedDifficulty.toLowerCase()) {
        return false;
      }

      // Category filter (govt, private, professional, vocational)
      if (selectedCategory !== 'all' && c.category !== selectedCategory) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const title = (c.title + ' ' + (c.title_hi || '')).toLowerCase();
        const summary = (c.summary + ' ' + (c.summary_hi || '')).toLowerCase();
        const exams = (c.entrance_exams || []).join(' ').toLowerCase();
        const skills = (c.skills_needed || []).join(' ').toLowerCase();
        return title.includes(q) || summary.includes(q) || exams.includes(q) || skills.includes(q);
      }

      return true;
    });
  }, [activeTab, searchQuery, selectedDifficulty, selectedCategory]);

  const toggleCompare = (career) => {
    if (compareList.find((item) => item.id === career.id)) {
      setCompareList(compareList.filter((item) => item.id !== career.id));
    } else {
      if (compareList.length >= 2) {
        setCompareList([compareList[1], career]);
      } else {
        setCompareList([...compareList, career]);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
          {language === 'hi' ? 'करियर एक्सप्लोरर (10वीं एवं 12वीं के बाद)' : 'Career Explorer (After 10th & 12th)'}
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-sm max-w-3xl">
          {language === 'hi'
            ? 'पारंपरिक डिग्रियों के साथ-साथ ITI, पॉलिटेक्निक डिप्लोमा, अग्निवीर और आधुनिक कौशल कोर्सेज की संपूर्ण जानकारी, पात्रता, कॉलेज व संभावित सैलरी।'
            : 'Comprehensive career pathways covering engineering, civil services, medical, and high-impact vocational avenues (ITI, Polytechnic, NSDC Skills).'}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800 no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`whitespace-nowrap px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('search_placeholder')}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Difficulty filter */}
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium"
          >
            <option value="all">{language === 'hi' ? 'सभी कठिनाई स्तर' : 'All Difficulties'}</option>
            <option value="moderate">{language === 'hi' ? 'सामान्य (Moderate)' : 'Moderate'}</option>
            <option value="high">{language === 'hi' ? 'कठिन (High)' : 'High'}</option>
            <option value="very high">{language === 'hi' ? 'अत्यंत कठिन (Very High)' : 'Very High'}</option>
          </select>

          {/* Category filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium"
          >
            <option value="all">{language === 'hi' ? 'सभी श्रेणियां' : 'All Sectors'}</option>
            <option value="govt">{language === 'hi' ? 'सरकारी क्षेत्र' : 'Government Sector'}</option>
            <option value="private">{language === 'hi' ? 'प्राइवेट / टेक' : 'Corporate & Tech'}</option>
            <option value="vocational">{language === 'hi' ? 'वोकेशनल / डिप्लोमा' : 'Vocational & ITI'}</option>
            <option value="professional">{language === 'hi' ? 'प्रोफेशनल डिग्री' : 'Professional Degrees'}</option>
          </select>

          {/* Compare Button */}
          {compareList.length > 0 && (
            <button
              onClick={() => setIsComparing(true)}
              className="px-3 py-2 rounded-xl bg-warmOrange-500 hover:bg-warmOrange-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? `तुलना (${compareList.length}/2)` : `Compare (${compareList.length}/2)`}</span>
            </button>
          )}
        </div>
      </div>

      {/* Careers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCareers.map((c) => {
          const isSelectedForCompare = !!compareList.find((item) => item.id === c.id);
          return (
            <div
              key={c.id}
              className="rounded-3xl p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-card hover:shadow-soft-hover transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Badges */}
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      c.category === 'govt'
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                        : c.category === 'vocational'
                        ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                        : 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                    }`}
                  >
                    {c.category}
                  </span>

                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Gauge className="w-3.5 h-3.5 text-warmOrange-500" />
                    <span>{c.difficulty}</span>
                  </span>
                </div>

                {/* Title & Summary */}
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight">
                    {language === 'hi' ? c.title_hi || c.title : c.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {language === 'hi' ? c.summary_hi || c.summary : c.summary}
                  </p>
                </div>

                {/* Key Details */}
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-750 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">{language === 'hi' ? 'अवधि' : 'Duration'}:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{c.duration}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">{language === 'hi' ? 'सैलरी' : 'Salary'}:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{c.salary_range}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">{language === 'hi' ? 'मांग' : 'Demand'}:</span>
                    <span className="font-semibold text-brand-600 dark:text-brand-400">{c.future_demand}</span>
                  </div>
                </div>

                {/* Top entrance exams */}
                {c.entrance_exams && (
                  <div className="text-[11px] space-y-1">
                    <span className="font-bold text-slate-600 dark:text-slate-400">
                      {language === 'hi' ? 'प्रमुख प्रवेश परीक्षाएं' : 'Top Entrance Exams'}:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {c.entrance_exams.map((ex, ei) => (
                        <span key={ei} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
                          {ex}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Parent View Information */}
                {isParentView && c.parent_view && (
                  <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-[11px] text-amber-900 dark:text-amber-200 space-y-1">
                    <div className="font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                      <span>{language === 'hi' ? 'अभिभावक व्यू विवरण:' : 'Parent Insight:'}</span>
                    </div>
                    <p><strong>{language === 'hi' ? 'खर्च' : 'Cost'}:</strong> {c.parent_view.cost_range}</p>
                    <p><strong>{language === 'hi' ? 'नौकरी सुरक्षा' : 'Security'}:</strong> {c.parent_view.job_security_score}/10 ({c.parent_view.safety_level})</p>
                    <p className="text-[10px] text-amber-800 dark:text-amber-300 italic">{c.parent_view.parent_tip}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center gap-2">
                <button
                  onClick={() => toggleCompare(c)}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    isSelectedForCompare
                      ? 'bg-warmOrange-50 dark:bg-warmOrange-950/40 border-warmOrange-500 text-warmOrange-600'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {isSelectedForCompare
                    ? (language === 'hi' ? 'चयनित ✓' : 'Selected ✓')
                    : (language === 'hi' ? 'तुलना करें' : 'Compare')}
                </button>

                <button
                  onClick={() => navigate(`/roadmap?career=${encodeURIComponent(c.title)}`)}
                  className="p-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs"
                  title="Generate Roadmap"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredCareers.length === 0 && (
        <div className="text-center py-12 p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
          <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 dark:text-white">
            {language === 'hi' ? 'कोई करियर नहीं मिला' : 'No Careers Found'}
          </h3>
          <p className="text-xs text-slate-500">
            {language === 'hi' ? 'कृपया अपनी सर्च क्वेरी या फ़िल्टर बदलें।' : 'Try adjusting your search keywords or resetting filters.'}
          </p>
        </div>
      )}

      {/* Compare Modal / Drawer */}
      {isComparing && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between border-b pb-4 border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-warmOrange-500" />
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  {language === 'hi' ? 'करियर तुलना (साइड-बाय-साइड)' : 'Compare Career Pathways'}
                </h3>
              </div>
              <button
                onClick={() => setIsComparing(false)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {compareList.length < 2 ? (
              <div className="text-center py-8 text-slate-500 text-sm">
                {language === 'hi' ? 'तुलना के लिए कृपया कम से कम 2 करियर चुनें।' : 'Please select 2 careers from the cards to compare.'}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:gap-8 divide-x divide-slate-100 dark:divide-slate-800">
                {compareList.map((item) => (
                  <div key={item.id} className="space-y-4 px-2">
                    <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                      {language === 'hi' ? item.title_hi || item.title : item.title}
                    </h4>
                    <div className="space-y-2 text-xs">
                      <div>
                        <strong className="block text-slate-500">{language === 'hi' ? 'सैलरी रेंज' : 'Salary'}:</strong>
                        <span className="font-bold text-emerald-600">{item.salary_range}</span>
                      </div>
                      <div>
                        <strong className="block text-slate-500">{language === 'hi' ? 'समय अवधि' : 'Duration'}:</strong>
                        <span>{item.duration}</span>
                      </div>
                      <div>
                        <strong className="block text-slate-500">{language === 'hi' ? 'कठिनाई' : 'Difficulty'}:</strong>
                        <span>{item.difficulty}</span>
                      </div>
                      <div>
                        <strong className="block text-slate-500">{language === 'hi' ? 'भविष्य की मांग' : 'Future Demand'}:</strong>
                        <span>{item.future_demand}</span>
                      </div>
                      <div>
                        <strong className="block text-slate-500">{language === 'hi' ? 'शिक्षा मार्ग' : 'Education Path'}:</strong>
                        <span className="text-[11px] leading-relaxed">{item.education_path}</span>
                      </div>
                      <div>
                        <strong className="block text-slate-500">{language === 'hi' ? 'प्रवेश परीक्षा' : 'Entrance Exams'}:</strong>
                        <span className="text-[11px] leading-relaxed">{(item.entrance_exams || []).join(', ')}</span>
                      </div>
                      {item.parent_view && (
                        <div className="p-3 bg-amber-500/10 rounded-xl space-y-1 text-[11px]">
                          <strong>{language === 'hi' ? 'माता-पिता के लिए बजट:' : 'Parent Budget:'}</strong>
                          <p>{item.parent_view.cost_range}</p>
                          <p><strong>{language === 'hi' ? 'जॉब सुरक्षा:' : 'Security:'}</strong> {item.parent_view.job_security_score}/10</p>
                        </div>
                      )}
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
