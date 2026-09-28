import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useGamification } from '../context/GamificationContext';
import { improveResumeBullet } from '../services/aiService';
import {
  FileText,
  Sparkles,
  Printer,
  Download,
  Plus,
  Trash2,
  Eye,
  Edit3,
  CheckCircle2,
  Wand2,
  ChevronRight,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';

export default function ResumeBuilder() {
  const { language, t } = useLanguage();
  const { addXP, unlockBadge } = useGamification();

  const [activeTemplate, setActiveTemplate] = useState('modern'); // 'modern' or 'classic'
  const [activeTab, setActiveTab] = useState('edit'); // for mobile: 'edit' or 'preview'
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancedSuggestions, setEnhancedSuggestions] = useState([]);
  const [enhancingIndex, setEnhancingIndex] = useState(null);

  const [resumeData, setResumeData] = useState({
    fullName: 'Aman Kumar Sharma',
    targetRole: 'Aspiring Junior Software Engineer / Web Developer',
    email: 'aman.sharma2026@email.com',
    phone: '+91 98765 43210',
    location: 'Varanasi, Uttar Pradesh',
    summary: 'Diligent 12th PCM passout with practical foundation in Python, React, and Database systems. Passionate about solving real-world challenges through technology and fast learning.',
    education: [
      { id: 1, institution: 'Govt Boys Inter College, Varanasi', degree: 'Class 12 (Science - PCM)', year: '2024 - 2026', grade: '86.4%' },
      { id: 2, institution: 'SVM High School', degree: 'Class 10 (Matriculation)', year: '2022 - 2024', grade: '91.2%' }
    ],
    skills: 'Python, JavaScript, React.js, Tailwind CSS, SQL, Git & GitHub, Problem Solving, Communication',
    projects: [
      {
        id: 1,
        title: 'Kisan Seva - Crop Price Advisory Web App',
        description: 'Built a responsive web dashboard tracking local mandi agricultural prices for 10+ crops using public government open APIs.'
      },
      {
        id: 2,
        title: 'Gramin Library Management Portal',
        description: 'Designed a simple inventory system to help village study circles catalogue and issue competitive exam preparation books.'
      }
    ],
    achievements: [
      'District Science Exhibition 2nd Prize for Automated Irrigation Model',
      'Completed CS50 Introduction to Computer Science certificate (Harvard edX)',
      'National Scholarship Portal (NSP) Merit Scholar 2025'
    ]
  });

  const handleEnhanceBullet = async (index, currentText) => {
    setIsEnhancing(true);
    setEnhancingIndex(index);
    const suggestions = await improveResumeBullet(currentText, resumeData.targetRole);
    setEnhancedSuggestions(suggestions);
    setIsEnhancing(false);
  };

  const applySuggestion = (projIndex, newText) => {
    setResumeData(prev => {
      const updatedProjects = [...prev.projects];
      updatedProjects[projIndex].description = newText;
      return { ...prev, projects: updatedProjects };
    });
    setEnhancedSuggestions([]);
    setEnhancingIndex(null);
    addXP(25, 'Used AI Resume Enhancer');
    unlockBadge('resume_ready');
  };

  const handlePrint = () => {
    addXP(40, 'Exported Resume');
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header (Hidden in print) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 no-print">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs font-bold border border-amber-300">
            <FileText className="w-3.5 h-3.5 text-amber-600" />
            <span>{language === 'hi' ? 'नौकरी एवं इंटर्नशिप हेतु रिज्यूमे' : 'Job-Ready Resume Generator'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            {language === 'hi' ? 'AI रिज्यूमे बिल्डर (Resume Builder)' : 'AI Resume Builder & Enhancer'}
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm max-w-2xl">
            {language === 'hi'
              ? '10वीं, 12वीं या कॉलेज छात्रों के लिए उपयुक्त। 2 मॉडर्न टेम्पलेट्स, AI बुलेट पॉइंट इम्प्रूवर और साफ़ PDF डाउनलोड।'
              : 'Designed for freshers and students. Switch between 2 professional templates, polish achievements with AI, and download as clean PDF.'}
          </p>
        </div>

        {/* Template Selector & Print Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700 text-xs font-bold">
            <button
              onClick={() => setActiveTemplate('modern')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTemplate === 'modern' ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-white shadow-sm' : 'text-slate-500'
              }`}
            >
              Modern Tech
            </button>
            <button
              onClick={() => setActiveTemplate('classic')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTemplate === 'classic' ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-white shadow-sm' : 'text-slate-500'
              }`}
            >
              Classic Executive
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl bg-warmOrange-500 hover:bg-warmOrange-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-warmOrange-500/20 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>{language === 'hi' ? 'PDF डाउनलोड / प्रिंट' : 'Print / Download PDF'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Tab Toggle (Edit / Preview) */}
      <div className="lg:hidden flex border-b border-slate-200 dark:border-slate-800 no-print">
        <button
          onClick={() => setActiveTab('edit')}
          className={`flex-1 py-3 text-xs font-bold border-b-2 ${
            activeTab === 'edit' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500'
          }`}
        >
          {language === 'hi' ? 'जानकारी भरें' : 'Edit Information'}
        </button>
        <button
          onClick={() => setActiveTab('preview')}
          className={`flex-1 py-3 text-xs font-bold border-b-2 ${
            activeTab === 'preview' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500'
          }`}
        >
          {language === 'hi' ? 'लाइव प्रीव्यू' : 'Live Preview'}
        </button>
      </div>

      {/* Main Builder Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Editor (5 cols) */}
        <div className={`lg:col-span-5 space-y-6 no-print ${activeTab === 'preview' ? 'hidden lg:block' : 'block'}`}>
          {/* Section: Personal Info */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-card space-y-3">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
              {language === 'hi' ? '1. व्यक्तिगत जानकारी' : '1. Personal Information'}
            </h3>
            <div className="space-y-2 text-xs">
              <div>
                <label className="font-semibold text-slate-600 dark:text-slate-400 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={resumeData.fullName}
                  onChange={(e) => setResumeData({ ...resumeData, fullName: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-semibold"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-600 dark:text-slate-400 block mb-1">Target Designation</label>
                <input
                  type="text"
                  value={resumeData.targetRole}
                  onChange={(e) => setResumeData({ ...resumeData, targetRole: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-600 dark:text-slate-400 block mb-1">Email</label>
                  <input
                    type="email"
                    value={resumeData.email}
                    onChange={(e) => setResumeData({ ...resumeData, email: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-600 dark:text-slate-400 block mb-1">Phone</label>
                  <input
                    type="text"
                    value={resumeData.phone}
                    onChange={(e) => setResumeData({ ...resumeData, phone: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-600 dark:text-slate-400 block mb-1">City, State</label>
                <input
                  type="text"
                  value={resumeData.location}
                  onChange={(e) => setResumeData({ ...resumeData, location: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-600 dark:text-slate-400 block mb-1">Profile Objective / Summary</label>
                <textarea
                  rows="2"
                  value={resumeData.summary}
                  onChange={(e) => setResumeData({ ...resumeData, summary: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Section: Skills */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-card space-y-3">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
              {language === 'hi' ? '2. कौशल (Skills)' : '2. Key Skills'}
            </h3>
            <div>
              <label className="font-semibold text-slate-600 dark:text-slate-400 block text-xs mb-1">
                Comma separated skills:
              </label>
              <textarea
                rows="2"
                value={resumeData.skills}
                onChange={(e) => setResumeData({ ...resumeData, skills: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-mono"
              />
            </div>
          </div>

          {/* Section: Projects with AI Enhancer */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-card space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                {language === 'hi' ? '3. प्रोजेक्ट्स (AI सुधारक सहित)' : '3. Projects & Proof-of-Work'}
              </h3>
            </div>

            <div className="space-y-4">
              {resumeData.projects.map((proj, pIdx) => (
                <div key={proj.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-2">
                  <input
                    type="text"
                    value={proj.title}
                    onChange={(e) => {
                      const updated = [...resumeData.projects];
                      updated[pIdx].title = e.target.value;
                      setResumeData({ ...resumeData, projects: updated });
                    }}
                    placeholder="Project Title"
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold"
                  />

                  <textarea
                    rows="2"
                    value={proj.description}
                    onChange={(e) => {
                      const updated = [...resumeData.projects];
                      updated[pIdx].description = e.target.value;
                      setResumeData({ ...resumeData, projects: updated });
                    }}
                    placeholder="Describe what you built..."
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs"
                  />

                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={() => handleEnhanceBullet(pIdx, proj.description)}
                      disabled={isEnhancing}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-tealAccent-500/20 text-tealAccent-700 dark:text-tealAccent-300 text-[11px] font-bold hover:bg-tealAccent-500/30 transition-colors"
                    >
                      <Wand2 className="w-3.5 h-3.5" />
                      <span>{isEnhancing && enhancingIndex === pIdx ? 'Refining...' : 'AI Enhance Bullet'}</span>
                    </button>
                  </div>

                  {/* AI Suggestions dropdown if triggered for this project */}
                  {enhancingIndex === pIdx && enhancedSuggestions.length > 0 && (
                    <div className="mt-2 p-3 rounded-xl bg-white dark:bg-slate-800 border border-tealAccent-400 space-y-2 text-xs">
                      <span className="font-bold text-tealAccent-600 block text-[11px]">
                        ✨ AI Professional Variations (Click to Apply):
                      </span>
                      {enhancedSuggestions.map((sug, si) => (
                        <button
                          key={si}
                          type="button"
                          onClick={() => applySuggestion(pIdx, sug)}
                          className="w-full text-left p-2 rounded-lg bg-slate-50 dark:bg-slate-750 hover:bg-tealAccent-50 dark:hover:bg-tealAccent-950/60 border border-slate-200 dark:border-slate-700 text-[11px] leading-relaxed transition-colors"
                        >
                          "{sug}"
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live Printable Preview (7 cols) */}
        <div className={`lg:col-span-7 ${activeTab === 'edit' ? 'hidden lg:block' : 'block'}`}>
          {/* Resume Paper Container */}
          <div
            id="resume-printable-doc"
            className={`w-full min-h-[700px] bg-white text-slate-900 p-8 sm:p-10 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 space-y-6 transition-all ${
              activeTemplate === 'classic' ? 'font-serif' : 'font-sans'
            }`}
          >
            {/* Template Header */}
            {activeTemplate === 'modern' ? (
              // Modern Template Header
              <div className="border-b-2 border-tealAccent-600 pb-5 space-y-2">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {resumeData.fullName}
                </h2>
                <p className="text-xs sm:text-sm font-bold text-tealAccent-700 uppercase tracking-wider">
                  {resumeData.targetRole}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-600 pt-1">
                  <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-tealAccent-600" />{resumeData.email}</span>
                  <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-tealAccent-600" />{resumeData.phone}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-tealAccent-600" />{resumeData.location}</span>
                </div>
              </div>
            ) : (
              // Classic Template Header
              <div className="text-center border-b border-slate-400 pb-4 space-y-1">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 uppercase tracking-wider">
                  {resumeData.fullName}
                </h2>
                <p className="text-xs font-semibold text-slate-700">
                  {resumeData.targetRole}
                </p>
                <p className="text-[11px] text-slate-600">
                  {resumeData.location} • {resumeData.phone} • {resumeData.email}
                </p>
              </div>
            )}

            {/* Summary */}
            {resumeData.summary && (
              <div className="space-y-1">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
                  Professional Profile
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed pt-1">
                  {resumeData.summary}
                </p>
              </div>
            )}

            {/* Education */}
            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
                Education
              </h4>
              <div className="space-y-2 pt-1">
                {resumeData.education.map((edu) => (
                  <div key={edu.id} className="flex items-start justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-900">{edu.degree}</span>
                      <p className="text-slate-600 text-[11px]">{edu.institution}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-slate-700">{edu.year}</span>
                      <span className="block text-[11px] font-bold text-tealAccent-700">{edu.grade}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
                Technical & Core Skills
              </h4>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {resumeData.skills.split(',').map((skill, si) => (
                  <span
                    key={si}
                    className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-800"
                  >
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </div>

            {/* Projects */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
                Key Projects & Proof of Work
              </h4>
              <div className="space-y-2.5 pt-1">
                {resumeData.projects.map((proj) => (
                  <div key={proj.id} className="space-y-0.5 text-xs">
                    <span className="font-bold text-slate-900 block">{proj.title}</span>
                    <p className="text-slate-700 text-[11px] leading-relaxed">
                      • {proj.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
                Achievements & Certifications
              </h4>
              <ul className="list-disc list-inside space-y-1 text-xs text-slate-700 pt-1">
                {resumeData.achievements.map((ach, ai) => (
                  <li key={ai} className="text-[11px]">{ach}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
