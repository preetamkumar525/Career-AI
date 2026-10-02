import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useGamification } from '../context/GamificationContext';
import { useSkillProfile } from '../context/SkillProfileContext';
import { extractSkillsFromCertificate } from '../services/skillMatcher';
import {
  getTop3Recommendations,
  getStreamLabel
} from '../services/examRecommender';
import {
  ScanLine,
  Upload,
  Camera,
  CheckCircle2,
  Sparkles,
  BookmarkCheck,
  ArrowRight,
  ExternalLink,
  BookOpen,
  Briefcase,
  Landmark,
  ShieldCheck,
  GraduationCap,
  Award,
  ChevronDown,
  ChevronUp,
  Edit3,
  AlertTriangle,
  TrendingUp,
  Cpu,
  FileText,
  RotateCcw,
  X
} from 'lucide-react';

// ── Icon map (string → component) so examRecommender can stay icon-agnostic ──
const ICON_MAP = {
  Cpu: Cpu,
  ShieldCheck: ShieldCheck,
  Landmark: Landmark,
  Award: Award,
  BookOpen: BookOpen,
  Briefcase: Briefcase,
  TrendingUp: TrendingUp,
  GraduationCap: GraduationCap,
  FileText: FileText,
};

// ── Match % ring colour ───────────────────────────────────────────────────────
function matchColor(pct) {
  if (pct >= 85) return 'text-emerald-600 dark:text-emerald-400';
  if (pct >= 70) return 'text-tealAccent-600 dark:text-tealAccent-400';
  return 'text-amber-500 dark:text-amber-400';
}
function matchRingColor(pct) {
  if (pct >= 85) return '#10b981';
  if (pct >= 70) return '#14b8a6';
  return '#f59e0b';
}

// ── Circular progress ring ────────────────────────────────────────────────────
function MatchRing({ percent }) {
  const r = 22;
  const circ = 2 * Math.PI * r;
  const dash = (percent / 100) * circ;
  return (
    <svg width="56" height="56" className="rotate-[-90deg]">
      <circle cx="28" cy="28" r={r} fill="none" stroke="#e2e8f0" strokeWidth="4" />
      <circle
        cx="28" cy="28" r={r} fill="none"
        stroke={matchRingColor(percent)}
        strokeWidth="4"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 0.8s ease' }}
      />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
export default function SkillScanner() {
  const { language } = useLanguage();
  const { addXP, unlockBadge } = useGamification();
  const { saveSkillProfile } = useSkillProfile();

  // ── View state machine: 'upload' | 'scanning' | 'results' ─────────────────
  const [view, setView] = useState('upload');

  // ── OCR progress ──────────────────────────────────────────────────────────
  const [ocrProgress, setOcrProgress] = useState({ status: '', progress: 0 });

  // ── Results ───────────────────────────────────────────────────────────────
  const [recommendations, setRecommendations] = useState([]);
  const [ocrData, setOcrData] = useState(null);          // raw OCR result
  const [previewUrl, setPreviewUrl] = useState(null);    // image preview
  const [fileName, setFileName] = useState('');

  // ── Collapsed "See detected details" panel ────────────────────────────────
  const [detailsOpen, setDetailsOpen] = useState(false);

  // ── Inline edit of detected details ──────────────────────────────────────
  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState(null);

  // ── Error banner ──────────────────────────────────────────────────────────
  const [errorMsg, setErrorMsg] = useState('');

  // ── Saved-to-profile notice ───────────────────────────────────────────────
  const [savedNotice, setSavedNotice] = useState(false);

  // ── File input refs ───────────────────────────────────────────────────────
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  // ── Drag state ────────────────────────────────────────────────────────────
  const [isDragging, setIsDragging] = useState(false);

  // ─────────────────────────────────────────────────────────────────────────
  // Core scan handler — called with a File object
  // ─────────────────────────────────────────────────────────────────────────
  async function runScan(file) {
    setErrorMsg('');
    setDetailsOpen(false);
    setEditMode(false);
    setView('scanning');
    setOcrProgress({ status: 'Preparing image…', progress: 0.05 });

    // Preview
    if (file.type.startsWith('image/')) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
    setFileName(file.name);

    try {
      const parsed = await extractSkillsFromCertificate(file, (p) =>
        setOcrProgress(p)
      );

      // Low-quality OCR gate
      if (parsed.lowQuality) {
        setErrorMsg(
          `⚠️ Scan quality too low (${parsed.confidence}% confidence). ` +
          `The photo may be blurry or poorly lit. Try again with a clearer image, ` +
          `or use the sample certificates below to see the feature in action.`
        );
        setView('upload');
        return;
      }

      const recs = getTop3Recommendations(parsed);
      setOcrData(parsed);
      setEditedData({ ...parsed });
      setRecommendations(recs);
      addXP(20, 'Certificate Scanned');
      unlockBadge('scanner_pro');
      setView('results');
    } catch (err) {
      console.error(err);
      setErrorMsg('Something went wrong during OCR. Please try a different image or use a sample below.');
      setView('upload');
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Re-run recommendations after user edits detected details
  // ─────────────────────────────────────────────────────────────────────────
  function applyEdits() {
    const recs = getTop3Recommendations(editedData);
    setOcrData({ ...editedData });
    setRecommendations(recs);
    setEditMode(false);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Save to profile
  // ─────────────────────────────────────────────────────────────────────────
  function handleSaveToProfile() {
    if (!ocrData) return;
    saveSkillProfile({
      skills: ocrData.detectedSkills || [],
      courses: [ocrData.certificateName].filter(Boolean),
      bestCareerMatch: recommendations[0] || null,
      stream: ocrData.detectedStream || '',
      educationLevel: ''
    });
    addXP(50, 'Smart Skill Profile Saved');
    unlockBadge('scanner_pro');
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 5000);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Sample certificate handler (uses predefined IDs in skillMatcher)
  // ─────────────────────────────────────────────────────────────────────────
  async function handleSample(sampleId, label) {
    setErrorMsg('');
    setDetailsOpen(false);
    setEditMode(false);
    setView('scanning');
    setPreviewUrl(null);
    setFileName(`${label} (Sample)`);
    setOcrProgress({ status: `Loading sample: ${label}…`, progress: 0.4 });

    try {
      const parsed = await extractSkillsFromCertificate(sampleId, (p) =>
        setOcrProgress(p)
      );
      const recs = getTop3Recommendations(parsed);
      setOcrData(parsed);
      setEditedData({ ...parsed });
      setRecommendations(recs);
      addXP(20, 'Sample Certificate Scanned');
      setView('results');
    } catch {
      setErrorMsg('Failed to load sample. Please try again.');
      setView('upload');
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Drag & Drop handlers
  // ─────────────────────────────────────────────────────────────────────────
  function onDragOver(e) { e.preventDefault(); setIsDragging(true); }
  function onDragLeave()  { setIsDragging(false); }
  function onDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) runScan(file);
  }
  function onFileChange(e) {
    const file = e.target.files?.[0];
    if (file) runScan(file);
    e.target.value = '';
  }

  // ─────────────────────────────────────────────────────────────────────────
  // SAMPLE CERTIFICATES list
  // ─────────────────────────────────────────────────────────────────────────
  const SAMPLES = [
    { id: 'sample-python',      label: 'Python / IIT Madras (NPTEL)' },
    { id: 'sample-electrician', label: 'Electrician Trade (NCVT)' },
    { id: 'sample-tally',       label: 'Tally Prime & GST (NSDC)' },
    { id: 'sample-data',        label: 'Data Analytics (Coursera/Google)' },
  ];

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">

      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div className="space-y-2 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-tealAccent-500/10 to-brand-500/10 text-tealAccent-700 dark:text-tealAccent-300 text-xs font-bold border border-tealAccent-200 dark:border-tealAccent-800 mb-1">
          <ScanLine className="w-4 h-4 animate-pulse" />
          <span>Smart Skill Scanner</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          {language === 'hi' ? 'स्कैन करें → टॉप 3 नौकरियाँ पाएं' : 'Scan & Get Your Top 3 Jobs'}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xl mx-auto">
          {language === 'hi'
            ? 'अपना सर्टिफिकेट या मार्कशीट अपलोड करें — हम तुरंत आपके लिए सबसे अच्छे 3 करियर विकल्प सुझाएंगे।'
            : 'Upload your certificate or marksheet — we\'ll instantly show the 3 best career paths that match your background.'}
        </p>
      </div>

      {/* ── Error Banner ─────────────────────────────────────────────────── */}
      {errorMsg && (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-sm">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <p>{errorMsg}</p>
          <button onClick={() => setErrorMsg('')} className="ml-auto shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── Saved Notice ─────────────────────────────────────────────────── */}
      {savedNotice && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-tealAccent-50 dark:bg-tealAccent-950/40 border border-tealAccent-200 dark:border-tealAccent-800 text-tealAccent-800 dark:text-tealAccent-200 text-sm animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-tealAccent-600" />
          <div className="flex-1">
            <span className="font-bold">Profile saved!</span> Your data will auto-fill in Roadmap & Resume Builder.
          </div>
          <div className="flex gap-2 shrink-0">
            <Link to="/roadmap" className="px-3 py-1.5 rounded-lg bg-tealAccent-600 text-white text-xs font-bold">Roadmap</Link>
            <Link to="/resume" className="px-3 py-1.5 rounded-lg border border-tealAccent-400 text-xs font-bold">Resume</Link>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════
          VIEW: UPLOAD
          ════════════════════════════════════════════════════════════════════ */}
      {view === 'upload' && (
        <div className="space-y-6">
          {/* Drop Zone */}
          <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            className={`relative rounded-3xl border-2 border-dashed transition-all duration-200 p-10 text-center cursor-pointer
              ${isDragging
                ? 'border-tealAccent-500 bg-tealAccent-50 dark:bg-tealAccent-950/20 scale-[1.01]'
                : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-brand-400 hover:bg-brand-50/40 dark:hover:bg-brand-950/20'
              }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,application/pdf"
              onChange={onFileChange}
              className="hidden"
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={onFileChange}
              className="hidden"
            />

            {/* Icon */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-tealAccent-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-500/20">
              <Upload className="w-7 h-7 text-white" />
            </div>

            <p className="text-base font-black text-slate-800 dark:text-slate-100 mb-1">
              {language === 'hi' ? 'यहाँ फाइल छोड़ें या क्लिक करें' : 'Drop your certificate here, or click to browse'}
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-5">
              Supports JPG, PNG, WebP, PDF · Max 10 MB
            </p>

            {/* CTA buttons — stop propagation so they trigger their own refs */}
            <div className="flex flex-wrap justify-center gap-3" onClick={e => e.stopPropagation()}>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold shadow-sm transition-colors"
              >
                <Upload className="w-4 h-4" />
                {language === 'hi' ? 'फ़ाइल चुनें' : 'Browse File'}
              </button>
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-tealAccent-600 hover:bg-tealAccent-700 text-white text-sm font-bold shadow-sm transition-colors"
              >
                <Camera className="w-4 h-4" />
                {language === 'hi' ? 'कैमरा' : 'Take Photo'}
              </button>
            </div>

            {/* OCR badge */}
            <p className="text-[10px] text-slate-400 dark:text-slate-600 mt-5 font-semibold">
              Powered by Tesseract.js OCR · eng+hin · Grayscale + Contrast preprocessing
            </p>
          </div>

          {/* Sample Certificates */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide text-center">
              ✨ Try a sample certificate instantly
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {SAMPLES.map(s => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleSample(s.id, s.label)}
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-brand-400 dark:hover:border-brand-600 hover:shadow-sm transition-all text-left group"
                >
                  <div className="w-8 h-8 rounded-xl bg-brand-50 dark:bg-brand-950 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                  </div>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 group-hover:text-brand-600 dark:group-hover:text-brand-400">
                    {s.label}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 ml-auto group-hover:text-brand-500 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════
          VIEW: SCANNING (loading state)
          ════════════════════════════════════════════════════════════════════ */}
      {view === 'scanning' && (
        <div className="py-16 flex flex-col items-center gap-6 text-center">
          {/* Animated Rings */}
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 rounded-full border-4 border-slate-200 dark:border-slate-700" />
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-tealAccent-500 border-r-brand-500 animate-spin" />
            <div className="absolute inset-2 rounded-full border-4 border-transparent border-b-brand-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.4s' }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <ScanLine className="w-7 h-7 text-tealAccent-500 animate-pulse" />
            </div>
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl font-black text-slate-800 dark:text-white">
              {language === 'hi' ? 'सर्टिफिकेट स्कैन हो रहा है…' : 'Scanning your certificate…'}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">
              {ocrProgress.status || 'Initializing Tesseract.js OCR engine (eng+hin)…'}
            </p>
          </div>

          {/* Progress bar */}
          <div className="w-64 max-w-full">
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-tealAccent-500 to-brand-500 rounded-full transition-all duration-300"
                style={{ width: `${Math.max(8, Math.min(100, Math.round((ocrProgress.progress || 0) * 100)))}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5 font-semibold">
              {Math.max(5, Math.round((ocrProgress.progress || 0) * 100))}% — {fileName || 'Processing…'}
            </p>
          </div>

          <p className="text-[11px] text-slate-300 dark:text-slate-600 font-medium">
            Grayscale + contrast preprocessing → eng+hin OCR → skill keyword matching
          </p>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════
          VIEW: RESULTS
          ════════════════════════════════════════════════════════════════════ */}
      {view === 'results' && recommendations.length > 0 && (
        <div className="space-y-6 animate-fadeIn">

          {/* ── Results header ──────────────────────────────────────────── */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-tealAccent-500" />
                {language === 'hi' ? 'आपके टॉप 3 करियर' : 'Your Top 3 Career Matches'}
              </h2>
              {ocrData && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Based on: <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {getStreamLabel(recommendations[0]?.detectedStream || 'general')} stream
                    {recommendations[0]?.detectedMarks ? ` · ${recommendations[0].detectedMarks}% marks` : ''}
                  </span>
                  {ocrData.detectedSkills?.length > 0 && ` · ${ocrData.detectedSkills.length} skills detected`}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => { setView('upload'); setErrorMsg(''); }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Scan again
            </button>
          </div>

          {/* ── 3 Recommendation Cards ──────────────────────────────────── */}
          <div className="space-y-4">
            {recommendations.map((rec, idx) => {
              const Icon = ICON_MAP[rec.icon] || Briefcase;
              const rankColors = [
                'from-brand-600 to-tealAccent-600',
                'from-tealAccent-600 to-emerald-600',
                'from-slate-500 to-slate-600',
              ];
              const isTop = idx === 0;
              return (
                <div
                  key={rec.id}
                  className={`rounded-3xl border bg-white dark:bg-slate-800 shadow-card overflow-hidden transition-all
                    ${isTop
                      ? 'border-tealAccent-300 dark:border-tealAccent-700 shadow-tealAccent-100 dark:shadow-tealAccent-950/30'
                      : 'border-slate-200 dark:border-slate-700'
                    }`}
                >
                  {/* Top accent bar */}
                  <div className={`h-1 bg-gradient-to-r ${rankColors[idx]}`} />

                  <div className="p-5 sm:p-6 space-y-4">
                    {/* Row 1: rank + title + match ring */}
                    <div className="flex items-start gap-4">
                      {/* Rank badge */}
                      <div className={`w-9 h-9 rounded-2xl bg-gradient-to-br ${rankColors[idx]} flex items-center justify-center text-white font-black text-sm shrink-0 shadow-sm`}>
                        #{rec.rank}
                      </div>

                      {/* Title + badge */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-0.5">
                          <h3 className="text-base font-black text-slate-900 dark:text-white leading-tight">
                            {rec.title}
                          </h3>
                          {rec.badge && (
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0
                              ${isTop
                                ? 'bg-tealAccent-100 dark:bg-tealAccent-950 text-tealAccent-700 dark:text-tealAccent-300'
                                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                              }`}>
                              {rec.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                          {rec.salaryRange}
                        </p>
                      </div>

                      {/* Match % ring */}
                      <div className="relative shrink-0 flex flex-col items-center">
                        <MatchRing percent={rec.matchPercent} />
                        <span className={`absolute inset-0 flex items-center justify-center text-xs font-black ${matchColor(rec.matchPercent)}`}>
                          {rec.matchPercent}%
                        </span>
                        <span className="text-[9px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5">match</span>
                      </div>
                    </div>

                    {/* Row 2: Icon + Reason */}
                    <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/50">
                      <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 shadow-sm">
                        <Icon className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                        {rec.reason}
                      </p>
                    </div>

                    {/* Row 3: Next step */}
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-lg bg-tealAccent-100 dark:bg-tealAccent-950 flex items-center justify-center shrink-0 mt-0.5">
                        <ArrowRight className="w-3.5 h-3.5 text-tealAccent-700 dark:text-tealAccent-300" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-0.5">
                          Next Step
                        </p>
                        <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                          {rec.nextStep}
                        </p>
                      </div>
                      {rec.nextStepUrl && (
                        <a
                          href={rec.nextStepUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 p-1.5 rounded-lg text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/40 transition-colors"
                          title="Open official portal"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Save to Profile ─────────────────────────────────────────── */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleSaveToProfile}
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-brand-600 to-tealAccent-600 text-white text-sm font-black shadow-lg shadow-brand-500/20 hover:opacity-90 transition-opacity"
            >
              <BookmarkCheck className="w-4 h-4" />
              Save to My Profile
            </button>
            <Link
              to="/roadmap"
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors"
            >
              Build Roadmap <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* ── Collapsible "See Detected Details" ─────────────────────── */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
            <button
              type="button"
              onClick={() => { setDetailsOpen(o => !o); setEditMode(false); }}
              className="w-full flex items-center justify-between px-5 py-3.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors"
            >
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-400" />
                See detected details
                <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">
                  {ocrData?.confidence ?? 0}% OCR confidence
                </span>
              </span>
              {detailsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {detailsOpen && (
              <div className="border-t border-slate-100 dark:border-slate-700/60 px-5 py-5 space-y-4 animate-fadeIn">
                {/* Demo note */}
                <p className="text-[11px] text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl px-3 py-2">
                  ℹ️ This is a demo OCR scan. Real accuracy depends on image quality. All fields are editable — fix any mistakes, then click "Update Recommendations".
                </p>

                {!editMode ? (
                  // ── Read-only detail view ──────────────────────────────
                  <div className="space-y-3">
                    {[
                      { label: 'Certificate / Course', value: ocrData?.certificateName },
                      { label: 'Skill / Subject Area', value: ocrData?.skillArea },
                      { label: 'Issuing Institute', value: ocrData?.issuingInstitute },
                      { label: 'Year', value: ocrData?.completionYear },
                    ].map(({ label, value }) => value && (
                      <div key={label} className="flex gap-3">
                        <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 w-32 shrink-0 pt-0.5">{label}</span>
                        <span className="text-xs text-slate-700 dark:text-slate-200">{value}</span>
                      </div>
                    ))}

                    {/* Detected skills chips */}
                    {ocrData?.detectedSkills?.length > 0 && (
                      <div className="flex gap-3">
                        <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 w-32 shrink-0 pt-1">Detected Skills</span>
                        <div className="flex flex-wrap gap-1.5">
                          {ocrData.detectedSkills.map(sk => (
                            <span key={sk} className="px-2.5 py-0.5 rounded-lg bg-tealAccent-100 dark:bg-tealAccent-950 text-tealAccent-800 dark:text-tealAccent-200 text-[11px] font-semibold">
                              {sk}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => setEditMode(true)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit details
                    </button>
                  </div>
                ) : (
                  // ── Editable form ──────────────────────────────────────
                  <div className="space-y-3">
                    {[
                      { key: 'certificateName', label: 'Certificate / Course Name' },
                      { key: 'skillArea',        label: 'Skill / Subject Area' },
                      { key: 'issuingInstitute', label: 'Issuing Institute' },
                      { key: 'completionYear',   label: 'Year of Completion' },
                    ].map(({ key, label }) => (
                      <div key={key} className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">{label}</label>
                        <input
                          type="text"
                          value={editedData?.[key] || ''}
                          onChange={e => setEditedData(d => ({ ...d, [key]: e.target.value }))}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-tealAccent-500"
                        />
                      </div>
                    ))}

                    {/* Skills chips editor */}
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">Detected Skills</label>
                      <div className="flex flex-wrap gap-1.5 min-h-[28px]">
                        {(editedData?.detectedSkills || []).map(sk => (
                          <span key={sk} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-tealAccent-100 dark:bg-tealAccent-950 text-tealAccent-800 dark:text-tealAccent-200 text-[11px] font-semibold">
                            {sk}
                            <button
                              type="button"
                              onClick={() => setEditedData(d => ({ ...d, detectedSkills: d.detectedSkills.filter(s => s !== sk) }))}
                              className="hover:text-rose-600"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={applyEdits}
                        className="px-4 py-2 rounded-xl bg-tealAccent-600 hover:bg-tealAccent-700 text-white text-xs font-black transition-colors"
                      >
                        Update Recommendations
                      </button>
                      <button
                        type="button"
                        onClick={() => { setEditMode(false); setEditedData({ ...ocrData }); }}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
