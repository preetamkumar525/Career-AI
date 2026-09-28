import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useGamification } from '../context/GamificationContext';
import skillsData from '../data/skillsData.json';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';
import {
  Target,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  BookOpen,
  Zap,
  Award
} from 'lucide-react';

export default function SkillGapAnalyzer() {
  const { language, t } = useLanguage();
  const { addXP, unlockBadge } = useGamification();
  const [searchParams] = useSearchParams();

  const careerParam = searchParams.get('career');

  const [selectedCareerId, setSelectedCareerId] = useState(
    careerParam || skillsData.careers[0]?.id || 'software_engineer'
  );

  const currentCareer = skillsData.careers.find(c => c.id === selectedCareerId) || skillsData.careers[0];

  // User possesses these skills (selected skill names)
  const [userSkills, setUserSkills] = useState(['Python / JS Programming', 'Git & Open Source Collaboration']);

  const toggleSkill = (skillName) => {
    setUserSkills(prev => {
      if (prev.includes(skillName)) {
        return prev.filter(s => s !== skillName);
      } else {
        addXP(10, 'Added Skill to Profile');
        unlockBadge('gap_analyzer');
        return [...prev, skillName];
      }
    });
  };

  // Build Radar Data
  const radarChartData = useMemo(() => {
    return currentCareer.skills.map(s => {
      const hasSkill = userSkills.includes(s.name);
      return {
        subject: s.name,
        Required: s.requiredLevel,
        YourProficiency: hasSkill ? Math.max(75, s.requiredLevel - 5) : 25,
        fullMark: 100
      };
    });
  }, [currentCareer, userSkills]);

  // Identify Priority Gaps
  const priorityGaps = useMemo(() => {
    return currentCareer.skills.filter(s => !userSkills.includes(s.name));
  }, [currentCareer, userSkills]);

  const overallReadinessScore = useMemo(() => {
    const totalRequired = currentCareer.skills.reduce((acc, curr) => acc + curr.requiredLevel, 0);
    const totalUser = radarChartData.reduce((acc, curr) => acc + curr.YourProficiency, 0);
    return Math.round((totalUser / totalRequired) * 100);
  }, [radarChartData, currentCareer]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 text-xs font-bold border border-rose-300">
          <Target className="w-3.5 h-3.5 text-rose-600" />
          <span>{language === 'hi' ? 'कौशल अंतर एवं तैयारी विश्लेषण' : 'Skill Readiness & Radar Audit'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
          {language === 'hi' ? 'स्किल गैप एनालाइज़र (Skill Gap Analyzer)' : 'Skill Gap Analyzer & Learning Radar'}
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-sm max-w-3xl">
          {language === 'hi'
            ? 'अपने लक्ष्य करियर का चयन करें, अपने मौजूदा हुनर पर क्लिक करें और देखें कि उद्योग की मांग के मुकाबले आप कहां खड़े हैं।'
            : 'Interactive radar analysis comparing your current skills with industry standards. Identifies critical gaps and recommends free certified courses.'}
        </p>
      </div>

      {/* Career Selector & Overall Score */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-card space-y-4">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
            {language === 'hi' ? 'लक्ष्य करियर चुनें:' : 'Select Target Career:'}
          </label>
          <div className="flex flex-wrap gap-2">
            {skillsData.careers.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setSelectedCareerId(c.id);
                  setUserSkills([]); // reset for new career
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedCareerId === c.id
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Readiness Meter */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-brand-700 to-tealAccent-700 text-white shadow-card flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-bold text-tealAccent-200 uppercase tracking-wider block">
              {language === 'hi' ? 'तैयारी स्कोर' : 'Employability Readiness'}
            </span>
            <div className="text-4xl sm:text-5xl font-black mt-2">
              {overallReadinessScore}%
            </div>
            <p className="text-xs text-tealAccent-100 mt-1">
              {overallReadinessScore >= 75
                ? 'Strong Job Ready Foundation!'
                : overallReadinessScore >= 50
                ? 'Moderate - Focus on priority gaps.'
                : 'Early Stage - Complete recommended free courses.'}
            </p>
          </div>
          <div className="pt-3 border-t border-white/20 text-xs font-medium text-white/90">
            {userSkills.length} of {currentCareer.skills.length} core competencies checked
          </div>
        </div>
      </div>

      {/* Main Grid: Skills Chips + Radar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Interactive Skills Selector */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-card space-y-6">
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              {language === 'hi' ? 'अपने वर्तमान कौशल चुनें (क्लिक करें):' : 'Select Skills You Currently Possess:'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {language === 'hi'
                ? 'जिन कौशलों पर आप सहज हैं, उन्हें टिक करें। रडार चार्ट तुरंत अपडेट होगा।'
                : 'Click skills you are confident in. The radar chart updates instantly.'}
            </p>
          </div>

          <div className="space-y-3">
            {currentCareer.skills.map((s) => {
              const has = userSkills.includes(s.name);
              return (
                <button
                  key={s.name}
                  onClick={() => toggleSkill(s.name)}
                  className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    has
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 text-emerald-900 dark:text-emerald-200'
                      : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-xs sm:text-sm flex items-center gap-2">
                      <span>{s.name}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500">
                        {s.category}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      Industry Requirement: {s.requiredLevel}/100
                    </span>
                  </div>

                  <div className="shrink-0">
                    {has ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                        {language === 'hi' ? 'सक्षम' : 'Acquired'}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400">
                        + {language === 'hi' ? 'जोड़ें' : 'Add'}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Radar Chart */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-card flex flex-col justify-between">
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              {language === 'hi' ? 'कौशल तुलना रडार (Required vs You)' : 'Competency Radar Chart'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Blue represents required standard; Green represents your current mastery.
            </p>
          </div>

          <div className="h-72 sm:h-80 w-full my-4">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarChartData}>
                <PolarGrid stroke="#cbd5e1" opacity={0.3} />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#64748b' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                <Radar name="Industry Required" dataKey="Required" stroke="#0e86d4" fill="#0e86d4" fillOpacity={0.3} />
                <Radar name="Your Current Level" dataKey="YourProficiency" stroke="#10b981" fill="#10b981" fillOpacity={0.5} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-800 dark:text-amber-300 flex items-start gap-2">
            <Zap className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <span>
              {language === 'hi'
                ? `शीर्ष प्राथमिकता अंतराल: ${priorityGaps.map(p => p.name).join(', ') || 'सभी कौशल प्राप्त हैं! बधाई!'}`
                : `Priority gaps to focus on: ${priorityGaps.map(p => p.name).join(', ') || 'All critical competencies acquired!'}`}
            </span>
          </div>
        </div>
      </div>

      {/* Free Recommended Courses (NPTEL, SWAYAM, Skill India, YouTube) */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-emerald-600" />
            <span>{language === 'hi' ? 'अंतर पाटने के लिए मुफ़्त अनुशंसित कोर्सेज' : 'Free Recommended Courses for Gap Closure'}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Official government platforms (NPTEL, SWAYAM, Skill India Digital) & verified free tutorials.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentCareer.courseRecommendations?.map((course, idx) => (
            <a
              key={idx}
              href={course.url}
              target="_blank"
              rel="noreferrer"
              className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-card hover:border-brand-500 transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    100% Free
                  </span>
                  <span className="text-xs text-slate-400 font-medium">{course.duration}</span>
                </div>

                <h4 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2">
                  {course.title}
                </h4>

                <span className="text-xs font-semibold text-brand-600 dark:text-brand-400 block">
                  {course.platform}
                </span>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
                <span>Enroll Free</span>
                <ExternalLink className="w-4 h-4 text-slate-400" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
