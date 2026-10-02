import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useGamification } from '../context/GamificationContext';
import { useSkillProfile } from '../context/SkillProfileContext';
import {
  parseCertificateMock,
  SAMPLE_CERTIFICATES,
  matchCareers,
  matchGovtExams,
  getMissingSkillsAndResources
} from '../services/skillMatcher';
import {
  ScanLine,
  Upload,
  Camera,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Plus,
  Trash2,
  Edit3,
  BookmarkCheck,
  ArrowRight,
  ExternalLink,
  BookOpen,
  Briefcase,
  Landmark,
  ShieldCheck,
  GraduationCap,
  Award,
  RefreshCw,
  HelpCircle,
  X,
  FileCheck,
  ChevronRight,
  TrendingUp,
  Cpu
} from 'lucide-react';

const COMMON_SKILLS = [
  // Technical
  { name: 'Python', category: 'Technical' },
  { name: 'JavaScript', category: 'Technical' },
  { name: 'React.js', category: 'Technical' },
  { name: 'SQL', category: 'Technical' },
  { name: 'Excel', category: 'Technical' },
  { name: 'Data Analysis', category: 'Technical' },
  { name: 'Graphic Design', category: 'Technical' },
  { name: 'Figma', category: 'Technical' },
  // Vocational & Hands-on
  { name: 'Electrician work', category: 'Vocational' },
  { name: 'Wiring & Circuits', category: 'Vocational' },
  { name: 'Tally', category: 'Vocational' },
  { name: 'Tailoring', category: 'Vocational' },
  { name: 'Welding', category: 'Vocational' },
  { name: 'Driving', category: 'Vocational' },
  { name: 'AutoCAD / Mechanical Tools', category: 'Vocational' },
  { name: 'Solar Panel Installation', category: 'Vocational' },
  // Core & Administrative
  { name: 'Communication', category: 'Core' },
  { name: 'English Speaking', category: 'Core' },
  { name: 'Typing & Stenography', category: 'Core' },
  { name: 'Financial Accounting', category: 'Core' },
  { name: 'Problem Solving', category: 'Core' },
  { name: 'Customer Service', category: 'Core' }
];

const EDUCATION_LEVELS = [
  '10th Pass (Matriculation)',
  '12th Pass (Intermediate)',
  'Diploma / Polytechnic',
  'ITI Certificate',
  'Graduate (BA, B.Sc, B.Com, B.Tech, BCA, etc.)',
  'Post Graduate (MA, M.Sc, M.Tech, MCA, MBA)'
];

const STREAMS = [
  'Science (PCM)',
  'Science (PCB)',
  'Commerce',
  'Arts / Humanities',
  'Vocational / Technical',
  'Other / General'
];

export default function SkillScanner() {
  const { language, t } = useLanguage();
  const { addXP, unlockBadge } = useGamification();
  const { skillProfile: savedProfile, saveSkillProfile, clearSkillProfile } = useSkillProfile();
  const navigate = useNavigate();

  // Active view tab: 'scanner' (Input & Profile) vs 'matches' (Career & Govt Opportunities)
  const [activeTab, setActiveTab] = useState('scanner'); // 'scanner' | 'results'

  // Input Method A: Certificate State
  const [certificates, setCertificates] = useState(() => {
    return savedProfile?.certificates || [];
  });
  const [isScanning, setIsScanning] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [certificatePreview, setCertificatePreview] = useState(null); // { url, type, name, size }
  
  // OCR Review Modal / Drawer State
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [editingCertIndex, setEditingCertIndex] = useState(null);
  const [extractedData, setExtractedData] = useState({
    certificateName: '',
    skillArea: '',
    issuingInstitute: '',
    completionYear: new Date().getFullYear().toString(),
    detectedSkills: [],
    confidence: 95,
    notes: ''
  });
  const [tempSkillInput, setTempSkillInput] = useState('');

  // Input Method B: Manual Entry State
  const [manualForm, setManualForm] = useState(() => {
    return {
      educationLevel: savedProfile?.educationLevel || '12th Pass (Intermediate)',
      boardUniversity: savedProfile?.boardUniversity || 'CBSE / State Board',
      stream: savedProfile?.stream || 'Science (PCM)',
      subjects: savedProfile?.subjects || ['Mathematics', 'Physics', 'Computer Science'],
      skills: savedProfile?.manualSkills || ['Python', 'Excel', 'Communication'],
      courses: savedProfile?.manualCourses || ['Basic Computer Concepts (CCC)'],
      experienceYears: savedProfile?.experienceYears || 'Fresher (0 years)'
    };
  });

  const [subjectInput, setSubjectInput] = useState('');
  const [courseInput, setCourseInput] = useState('');
  const [customSkillInput, setCustomSkillInput] = useState('');

  // Notification state
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);

  // File input refs (for drag-drop, mobile camera, and standard upload)
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  // --- Combined Skill Profile Computation (Part 2) ---
  const combinedProfile = useMemo(() => {
    // 1. Gather skills from certificates
    const certSkills = [];
    certificates.forEach(c => {
      (c.detectedSkills || []).forEach(s => {
        if (!certSkills.includes(s)) {
          certSkills.push(s);
        }
      });
    });

    // 2. Gather skills from manual entry
    const manualSkills = manualForm.skills || [];

    // 3. Merge and deduplicate
    const allSkills = Array.from(new Set([...certSkills, ...manualSkills]));

    // 4. Combined courses
    const certCourses = certificates.map(c => c.certificateName).filter(Boolean);
    const allCourses = Array.from(new Set([...certCourses, ...(manualForm.courses || [])]));

    return {
      educationLevel: manualForm.educationLevel,
      boardUniversity: manualForm.boardUniversity,
      stream: manualForm.stream,
      subjects: manualForm.subjects,
      skills: allSkills,
      certSkills,
      manualSkills,
      courses: allCourses,
      certificates,
      experienceYears: manualForm.experienceYears
    };
  }, [certificates, manualForm]);

  // --- Job & Career Matching (Part 3) ---
  const matchedCareers = useMemo(() => {
    return matchCareers(combinedProfile);
  }, [combinedProfile]);

  const matchedGovtExams = useMemo(() => {
    return matchGovtExams(combinedProfile);
  }, [combinedProfile]);

  const missingSkillsData = useMemo(() => {
    return getMissingSkillsAndResources(combinedProfile, matchedCareers);
  }, [combinedProfile, matchedCareers]);

  // Handle Certificate File selection (Upload or Camera)
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError('');
    setIsScanning(true);

    // Create object URL for preview
    const isImage = file.type.startsWith('image/');
    const previewObj = {
      name: file.name,
      size: (file.size / 1024).toFixed(1) + ' KB',
      type: isImage ? 'image' : 'pdf',
      url: isImage ? URL.createObjectURL(file) : null
    };
    setCertificatePreview(previewObj);

    try {
      const parsed = await parseCertificateMock(file);
      setExtractedData({
        ...parsed,
        previewUrl: previewObj.url,
        fileName: file.name
      });
      setEditingCertIndex(null);
      setShowReviewModal(true);
    } catch (err) {
      setUploadError('Unable to scan document. Please try again or enter details manually.');
    } finally {
      setIsScanning(false);
      // Reset input value so same file can be selected again
      e.target.value = '';
    }
  };

  // Handle Quick Sample Certificate Selection
  const handleSelectSample = async (sample) => {
    setIsScanning(true);
    setUploadError('');
    setCertificatePreview({
      name: `${sample.label}.png`,
      size: '240 KB',
      type: 'image',
      url: null
    });

    try {
      const parsed = await parseCertificateMock(sample.id);
      setExtractedData({
        ...parsed,
        previewUrl: null,
        fileName: `${sample.label}.pdf`
      });
      setEditingCertIndex(null);
      setShowReviewModal(true);
    } catch (err) {
      setUploadError('Failed to load sample certificate.');
    } finally {
      setIsScanning(false);
    }
  };

  // Confirm / Save Extracted Certificate
  const handleConfirmCertificate = () => {
    if (!extractedData.certificateName.trim()) {
      alert('Please provide a certificate name.');
      return;
    }

    const newCert = {
      id: editingCertIndex !== null ? certificates[editingCertIndex].id : `cert-${Date.now()}`,
      certificateName: extractedData.certificateName,
      skillArea: extractedData.skillArea,
      issuingInstitute: extractedData.issuingInstitute,
      completionYear: extractedData.completionYear,
      detectedSkills: extractedData.detectedSkills || [],
      confidence: extractedData.confidence || 95,
      previewUrl: extractedData.previewUrl || certificatePreview?.url || null,
      fileName: extractedData.fileName || certificatePreview?.name || 'Certificate.pdf'
    };

    if (editingCertIndex !== null) {
      setCertificates(prev => {
        const copy = [...prev];
        copy[editingCertIndex] = newCert;
        return copy;
      });
    } else {
      setCertificates(prev => [...prev, newCert]);
      addXP(30, 'Certificate Scanned & Verified');
      unlockBadge('scanner_pro');
    }

    setShowReviewModal(false);
    setEditingCertIndex(null);
  };

  // Edit an existing certificate card
  const handleEditCertificate = (index) => {
    const cert = certificates[index];
    setExtractedData({
      certificateName: cert.certificateName,
      skillArea: cert.skillArea,
      issuingInstitute: cert.issuingInstitute,
      completionYear: cert.completionYear,
      detectedSkills: [...cert.detectedSkills],
      confidence: cert.confidence,
      previewUrl: cert.previewUrl,
      fileName: cert.fileName
    });
    setEditingCertIndex(index);
    setShowReviewModal(true);
  };

  // Remove certificate
  const handleRemoveCertificate = (index) => {
    setCertificates(prev => prev.filter((_, i) => i !== index));
  };

  // Add skill tag to modal
  const handleAddModalSkill = () => {
    if (!tempSkillInput.trim()) return;
    if (!extractedData.detectedSkills.includes(tempSkillInput.trim())) {
      setExtractedData(prev => ({
        ...prev,
        detectedSkills: [...prev.detectedSkills, tempSkillInput.trim()]
      }));
    }
    setTempSkillInput('');
  };

  const handleRemoveModalSkill = (skill) => {
    setExtractedData(prev => ({
      ...prev,
      detectedSkills: prev.detectedSkills.filter(s => s !== skill)
    }));
  };

  // Manual Form Handlers
  const handleToggleManualSkill = (skillName) => {
    setManualForm(prev => {
      const exists = prev.skills.includes(skillName);
      const updated = exists ? prev.skills.filter(s => s !== skillName) : [...prev.skills, skillName];
      return { ...prev, skills: updated };
    });
  };

  const handleAddCustomSkill = (e) => {
    e.preventDefault();
    if (!customSkillInput.trim()) return;
    const skill = customSkillInput.trim();
    if (!manualForm.skills.includes(skill)) {
      setManualForm(prev => ({ ...prev, skills: [...prev.skills, skill] }));
    }
    setCustomSkillInput('');
  };

  const handleAddSubject = (e) => {
    e.preventDefault();
    if (!subjectInput.trim()) return;
    if (!manualForm.subjects.includes(subjectInput.trim())) {
      setManualForm(prev => ({ ...prev, subjects: [...prev.subjects, subjectInput.trim()] }));
    }
    setSubjectInput('');
  };

  const handleRemoveSubject = (subject) => {
    setManualForm(prev => ({ ...prev, subjects: prev.subjects.filter(s => s !== subject) }));
  };

  const handleAddCourse = (e) => {
    e.preventDefault();
    if (!courseInput.trim()) return;
    if (!manualForm.courses.includes(courseInput.trim())) {
      setManualForm(prev => ({ ...prev, courses: [...prev.courses, courseInput.trim()] }));
    }
    setCourseInput('');
  };

  const handleRemoveCourse = (course) => {
    setManualForm(prev => ({ ...prev, courses: prev.courses.filter(c => c !== course) }));
  };

  // Save to App State (Part 4)
  const handleSaveToProfile = () => {
    const profileToSave = {
      ...combinedProfile,
      bestCareerMatch: matchedCareers[0] || null
    };

    saveSkillProfile(profileToSave);
    addXP(50, 'Smart Skill Profile Saved');
    unlockBadge('scanner_pro');
    setSaveSuccessNotice(true);
    setTimeout(() => setSaveSuccessNotice(false), 5000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      {/* Page Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-tealAccent-500/10 to-brand-500/10 text-tealAccent-700 dark:text-tealAccent-300 text-xs font-bold border border-tealAccent-200 dark:border-tealAccent-800">
          <ScanLine className="w-4 h-4 text-tealAccent-600 dark:text-tealAccent-400 animate-pulse" />
          <span>{language === 'hi' ? 'स्मार्ट स्किल स्कैनर' : 'Smart Skill Scanner & Opportunity Finder'}</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              {language === 'hi' ? 'स्मार्ट स्किल स्कैनर (Smart Skill Scanner)' : 'Smart Skill Scanner'}
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base max-w-3xl mt-1">
              {language === 'hi'
                ? 'अपने प्रमाण पत्र स्कैन करें या विवरण दर्ज करें। हम आपकी शिक्षा व कौशल का विश्लेषण करके करियर, सरकारी नौकरी और सीखने की सही दिशा बताएंगे।'
                : 'Discover high-paying careers, government exam opportunities, and required skills based on your certificates and education. Scan documents or fill details manually.'}
            </p>
          </div>

          {/* Quick Action Navigation / Tabs */}
          <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 self-start md:self-auto">
            <button
              onClick={() => setActiveTab('scanner')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'scanner'
                  ? 'bg-white dark:bg-slate-700 text-brand-700 dark:text-brand-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'स्कैन व विवरण' : 'Scan & Profile'}</span>
            </button>
            <button
              onClick={() => setActiveTab('results')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'results'
                  ? 'bg-tealAccent-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'अवसर व मैच' : 'Matched Opportunities'}</span>
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-tealAccent-500 text-[10px] text-white font-extrabold">
                {matchedCareers.length + matchedGovtExams.length}
              </span>
            </button>
          </div>
        </div>

        {/* Global Save Notice Banner */}
        {saveSuccessNotice && (
          <div className="p-4 rounded-2xl bg-tealAccent-50 dark:bg-tealAccent-950/40 border border-tealAccent-200 dark:border-tealAccent-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-tealAccent-600 shrink-0" />
              <div>
                <p className="text-xs sm:text-sm font-bold text-tealAccent-900 dark:text-tealAccent-100">
                  {language === 'hi'
                    ? 'प्रोफ़ाइल सफलतापूर्वक सेव हो गई! आपके विवरण रोडमैप और रिज्यूमे से लिंक हो चुके हैं।'
                    : 'Skill Profile saved successfully! Your details will now auto-fill into Roadmap Generator and Resume Builder.'}
                </p>
                <p className="text-[11px] text-tealAccent-700 dark:text-tealAccent-300">
                  {language === 'hi' ? '+50 XP व "स्किल स्काउट" बैज अर्जित किया!' : '+50 XP awarded & "Skill Scout" badge unlocked!'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to="/roadmap"
                className="px-3 py-1.5 rounded-xl bg-tealAccent-600 hover:bg-tealAccent-700 text-white text-xs font-bold shadow-sm transition-colors"
              >
                {language === 'hi' ? 'रोडमैप देखें' : 'Go to Roadmap'}
              </Link>
              <Link
                to="/resume"
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-tealAccent-300 dark:border-tealAccent-700 text-xs font-bold hover:bg-tealAccent-50 transition-colors"
              >
                {language === 'hi' ? 'रिज्यूमे बनाएं' : 'Build Resume'}
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Main Grid View */}
      {activeTab === 'scanner' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT COLUMN: Input Methods A (Certificate Scan) & B (Manual Entry) */}
          <div className="lg:col-span-7 space-y-8">
            {/* PART 1 - METHOD A: CERTIFICATE SCAN CARD */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-card space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-brand-50 dark:bg-brand-950 flex items-center justify-center text-brand-600 dark:text-brand-400">
                    <ScanLine className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <span>Method A: Certificate Scan</span>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300">
                        OCR AI
                      </span>
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {language === 'hi' ? 'प्रमाणपत्र या मार्कशीट अपलोड करें' : 'Upload photo or PDF of course or trade certificate'}
                    </p>
                  </div>
                </div>

                {certificates.length > 0 && (
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-tealAccent-100 dark:bg-tealAccent-950 text-tealAccent-700 dark:text-tealAccent-300">
                    {certificates.length} {certificates.length === 1 ? 'Certificate' : 'Certificates'}
                  </span>
                )}
              </div>

              {/* Upload Box with Dropzone styling */}
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-3xl p-6 sm:p-8 text-center bg-slate-50/60 dark:bg-slate-850 hover:bg-brand-50/30 dark:hover:bg-slate-800/80 transition-all group">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {isScanning ? (
                  <div className="py-6 space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-tealAccent-100 dark:bg-tealAccent-950 text-tealAccent-600 dark:text-tealAccent-400 flex items-center justify-center mx-auto animate-spin">
                      <RefreshCw className="w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                        {language === 'hi' ? 'AI प्रमाण पत्र को स्कैन कर रहा है...' : 'Scanning & extracting certificate metadata...'}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        {language === 'hi' ? 'शीर्षक, संस्थान, विषय व वर्ष को पहचाना जा रहा है' : 'Detecting issuing institute, skills, and credential validity'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-slate-200/70 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center mx-auto group-hover:scale-105 transition-transform">
                      <Upload className="w-6 h-6 text-brand-600 dark:text-brand-400" />
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                        {language === 'hi' ? 'प्रमाणपत्र ड्रैग करें या यहाँ क्लिक करें' : 'Drop your certificate here, or browse'}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Supports JPG, PNG, WebP, PDF (Max 10MB)
                      </p>
                    </div>

                    {/* Dual Action Buttons: Mobile Camera + File Browser */}
                    <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-sm transition-colors"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{language === 'hi' ? 'फ़ाइल चुनें' : 'Browse File'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => cameraInputRef.current?.click()}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-tealAccent-600 hover:bg-tealAccent-700 text-white text-xs font-bold shadow-sm transition-colors"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>{language === 'hi' ? 'कैमरा से फोटो लें' : 'Take Photo (Camera)'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Demo Scan Disclaimer Note */}
              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs text-blue-800 dark:text-blue-300">
                <HelpCircle className="w-4 h-4 shrink-0 text-blue-600 mt-0.5" />
                <p>
                  <strong>{language === 'hi' ? 'डेमो सूचना: ' : 'Sample/Demo Note: '}</strong>
                  {language === 'hi'
                    ? 'यह एक डेमो स्कैन है। बेहतर परिणामों के लिए, निकाले गए विवरणों को सेव करने से पहले अवश्य जांचें और संपादित करें।'
                    : 'This is a demo scan. For best results, verify extracted details before saving.'}
                </p>
              </div>

              {/* 1-Click Sample Certificates for Instant Testing */}
              <div className="space-y-2 pt-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                  {language === 'hi' ? '⚡ टेस्ट करने के लिए सैंपल प्रमाणपत्र चुनें:' : '⚡ Or test instantly with a sample certificate:'}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {SAMPLE_CERTIFICATES.map(sample => (
                    <button
                      key={sample.id}
                      type="button"
                      onClick={() => handleSelectSample(sample)}
                      className="text-left p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 hover:border-brand-400 dark:hover:border-brand-500 hover:bg-brand-50/40 dark:hover:bg-slate-700/60 transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <FileCheck className="w-4 h-4 text-tealAccent-600 shrink-0" />
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">
                          {sample.label}
                        </span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-600 transition-transform group-hover:translate-x-0.5 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Uploaded Certificates List */}
              {certificates.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {language === 'hi' ? 'जोड़े गए प्रमाणपत्र (' + certificates.length + ')' : 'Scanned Certificates (' + certificates.length + ')'}
                  </h4>
                  <div className="space-y-2.5">
                    {certificates.map((cert, index) => (
                      <div
                        key={cert.id || index}
                        className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 shadow-sm flex items-start justify-between gap-3 hover:border-brand-300 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-xl bg-tealAccent-50 dark:bg-tealAccent-950/60 text-tealAccent-600 flex items-center justify-center shrink-0 mt-0.5">
                            <Award className="w-5 h-5" />
                          </div>
                          <div className="space-y-1">
                            <h5 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-snug">
                              {cert.certificateName}
                            </h5>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                              {cert.issuingInstitute} • Year: <span className="font-semibold text-slate-700 dark:text-slate-300">{cert.completionYear}</span>
                            </p>
                            <div className="flex flex-wrap gap-1 pt-1">
                              {(cert.detectedSkills || []).map((sk, idx) => (
                                <span
                                  key={idx}
                                  className="text-[10px] px-2 py-0.5 rounded-md bg-tealAccent-50 dark:bg-tealAccent-950 text-tealAccent-700 dark:text-tealAccent-300 font-medium border border-tealAccent-200/60 dark:border-tealAccent-800"
                                >
                                  {sk}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleEditCertificate(index)}
                            title="Edit details"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveCertificate(index)}
                            title="Remove certificate"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* PART 1 - METHOD B: MANUAL ENTRY FORM */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-card space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-700/60 pb-4">
                <div className="w-10 h-10 rounded-2xl bg-tealAccent-50 dark:bg-tealAccent-950 flex items-center justify-center text-tealAccent-600 dark:text-tealAccent-400">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <span>Method B: Manual Entry</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      No Certificate Needed
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {language === 'hi' ? 'अपनी शिक्षा, बोर्ड, विषय और हुनर सीधे दर्ज करें' : 'Provide your education, stream, subjects, and vocational/technical skills'}
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                {/* Education Level & Board */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                      {language === 'hi' ? 'वर्तमान / उच्चतम शिक्षा स्तर' : 'Current / Highest Education Level'}
                    </label>
                    <select
                      value={manualForm.educationLevel}
                      onChange={(e) => setManualForm({ ...manualForm, educationLevel: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-tealAccent-500"
                    >
                      {EDUCATION_LEVELS.map(lvl => (
                        <option key={lvl} value={lvl}>{lvl}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                      {language === 'hi' ? 'बोर्ड या विश्वविद्यालय' : 'Board / University'}
                    </label>
                    <input
                      type="text"
                      value={manualForm.boardUniversity}
                      onChange={(e) => setManualForm({ ...manualForm, boardUniversity: e.target.value })}
                      placeholder="e.g. CBSE, UP Board, Delhi University"
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-tealAccent-500"
                    >
                    </input>
                  </div>
                </div>

                {/* Stream & Experience */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                      {language === 'hi' ? 'विषय स्ट्रीम (Stream)' : 'Stream / Specialization'}
                    </label>
                    <select
                      value={manualForm.stream}
                      onChange={(e) => setManualForm({ ...manualForm, stream: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-tealAccent-500"
                    >
                      {STREAMS.map(st => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                      {language === 'hi' ? 'कार्य अनुभव (यदि कोई हो)' : 'Years of Experience (If any)'}
                    </label>
                    <select
                      value={manualForm.experienceYears}
                      onChange={(e) => setManualForm({ ...manualForm, experienceYears: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-tealAccent-500"
                    >
                      <option value="Fresher (0 years)">Fresher (0 years)</option>
                      <option value="1-2 years">1-2 years</option>
                      <option value="3-5 years">3-5 years</option>
                      <option value="5+ years">5+ years</option>
                    </select>
                  </div>
                </div>

                {/* Subjects Studied */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    {language === 'hi' ? 'पढ़े गए मुख्य विषय (Subjects Studied)' : 'Subjects Studied'}
                  </label>
                  <div className="flex flex-wrap gap-1.5 min-h-[36px]">
                    {manualForm.subjects.map(subj => (
                      <span
                        key={subj}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium"
                      >
                        {subj}
                        <button
                          type="button"
                          onClick={() => handleRemoveSubject(subj)}
                          className="hover:text-rose-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>

                  <form onSubmit={handleAddSubject} className="flex gap-2">
                    <input
                      type="text"
                      value={subjectInput}
                      onChange={(e) => setSubjectInput(e.target.value)}
                      placeholder="Add subject (e.g. Mathematics, Accountancy, Economics) and press Enter"
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-tealAccent-500"
                    />
                    <button
                      type="submit"
                      className="px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                    >
                      Add
                    </button>
                  </form>
                </div>

                {/* Skills Multi-Select Chips (Technical + Vocational) */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                      {language === 'hi' ? 'कौशल एवं हुनर (Skills - तकनीकी व वोकेशनल)' : 'Skills (Select all technical & vocational skills you know)'}
                    </label>
                    <span className="text-[11px] text-tealAccent-600 font-bold">
                      {manualForm.skills.length} selected
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1 border border-slate-100 dark:border-slate-700/50 rounded-2xl">
                    {COMMON_SKILLS.map(sk => {
                      const isSelected = manualForm.skills.includes(sk.name);
                      return (
                        <button
                          key={sk.name}
                          type="button"
                          onClick={() => handleToggleManualSkill(sk.name)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 border ${
                            isSelected
                              ? 'bg-tealAccent-600 text-white border-tealAccent-700 shadow-sm scale-102'
                              : 'bg-white dark:bg-slate-750 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-tealAccent-300'
                          }`}
                        >
                          <span>{sk.name}</span>
                          <span className={`text-[9px] px-1 rounded ${
                            isSelected ? 'bg-tealAccent-700 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                          }`}>
                            {sk.category}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Add Custom Skill input */}
                  <form onSubmit={handleAddCustomSkill} className="flex gap-2 pt-1">
                    <input
                      type="text"
                      value={customSkillInput}
                      onChange={(e) => setCustomSkillInput(e.target.value)}
                      placeholder="Add custom skill (e.g. CNC Machine, Flutter, Video Editing)"
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-tealAccent-500"
                    />
                    <button
                      type="submit"
                      className="px-3.5 py-2 rounded-xl bg-tealAccent-600 text-white text-xs font-bold hover:bg-tealAccent-700 transition-colors"
                    >
                      + Add Skill
                    </button>
                  </form>
                </div>

                {/* Courses Completed */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    {language === 'hi' ? 'पूर्ण किए गए अन्य कोर्स (Courses Completed)' : 'Other Courses Completed'}
                  </label>
                  <div className="flex flex-wrap gap-1.5 min-h-[32px]">
                    {manualForm.courses.map(course => (
                      <span
                        key={course}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 text-xs font-medium border border-brand-200 dark:border-brand-800"
                      >
                        {course}
                        <button
                          type="button"
                          onClick={() => handleRemoveCourse(course)}
                          className="hover:text-rose-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>

                  <form onSubmit={handleAddCourse} className="flex gap-2">
                    <input
                      type="text"
                      value={courseInput}
                      onChange={(e) => setCourseInput(e.target.value)}
                      placeholder="e.g. CCC, DCA, Solar Power Workshop, Spoken English"
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-tealAccent-500"
                    />
                    <button
                      type="submit"
                      className="px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                    >
                      Add Course
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: PART 2 - COMBINED SKILL PROFILE SUMMARY & ACTIONS */}
          <div className="lg:col-span-5 space-y-6">
            <div className="sticky top-20 space-y-6">
              {/* Profile Card */}
              <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-b from-white to-slate-50 dark:from-slate-800 dark:to-slate-850 border border-slate-200 dark:border-slate-700 shadow-soft space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-tealAccent-500 text-white flex items-center justify-center font-black">
                      <BookmarkCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-slate-900 dark:text-white">
                        {language === 'hi' ? 'आपकी स्किल प्रोफ़ाइल' : 'Your Combined Profile'}
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        {combinedProfile.skills.length} skills • {combinedProfile.certificates.length} certificates
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-tealAccent-100 dark:bg-tealAccent-950 text-tealAccent-700 dark:text-tealAccent-300">
                    Auto-Merged
                  </span>
                </div>

                {/* Education & Stream badge */}
                <div className="space-y-3 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-750">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Education</span>
                    <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                      {combinedProfile.educationLevel}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Stream / Board</span>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {combinedProfile.stream} • {combinedProfile.boardUniversity}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Experience</span>
                    <span className="text-xs font-semibold text-tealAccent-600 dark:text-tealAccent-400">
                      {combinedProfile.experienceYears}
                    </span>
                  </div>
                </div>

                {/* Detected & Combined Skills Tags */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {language === 'hi' ? 'पहचाने गए हुनर (All Detected Skills)' : 'All Detected Skills'}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {combinedProfile.skills.length} Total
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 max-h-52 overflow-y-auto pr-1">
                    {combinedProfile.skills.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">
                        {language === 'hi' ? 'कोई हुनर नहीं चुना गया। ऊपर से चुनें या स्कैन करें।' : 'No skills detected yet. Scan a certificate or select from manual list.'}
                      </p>
                    ) : (
                      combinedProfile.skills.map(sk => {
                        const fromCert = combinedProfile.certSkills.includes(sk);
                        return (
                          <span
                            key={sk}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold ${
                              fromCert
                                ? 'bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800'
                                : 'bg-tealAccent-50 dark:bg-tealAccent-950 text-tealAccent-800 dark:text-tealAccent-200 border border-tealAccent-200 dark:border-tealAccent-800'
                            }`}
                          >
                            <span>{sk}</span>
                            <span className="text-[9px] opacity-75 font-normal">
                              {fromCert ? '• Cert' : '• Manual'}
                            </span>
                          </span>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Combined Courses */}
                {combinedProfile.courses.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                      {language === 'hi' ? 'कोर्स एवं क्रेडेंशियल' : 'Courses & Certifications'}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {combinedProfile.courses.map(crs => (
                        <span
                          key={crs}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-medium"
                        >
                          {crs}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* PART 4: SAVE TO MY PROFILE BUTTON */}
                <div className="pt-2 space-y-3">
                  <button
                    type="button"
                    onClick={handleSaveToProfile}
                    className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-tealAccent-600 via-tealAccent-500 to-brand-600 hover:from-tealAccent-700 hover:to-brand-700 text-white font-black text-sm shadow-lg shadow-tealAccent-500/20 hover:shadow-tealAccent-500/30 transition-all flex items-center justify-center gap-2 group"
                  >
                    <BookmarkCheck className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>{language === 'hi' ? '💾 प्रोफ़ाइल में सेव करें (Save to Profile)' : 'Save to My Profile'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('results')}
                    className="w-full py-3 px-4 rounded-2xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-650 text-slate-800 dark:text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>{language === 'hi' ? 'मैच किए गए अवसर देखें (View Matches)' : 'View Matched Opportunities'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <p className="text-[11px] text-center text-slate-500 dark:text-slate-400">
                    {language === 'hi'
                      ? '💡 सेव करने से आपके विवरण रोडमैप और रिज्यूमे बिल्डर में अपने-आप भर जाएंगे।'
                      : '💡 Saving auto-fills Roadmap Generator and Resume Builder pages.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* TAB 2: PART 3 - JOB & CAREER MATCHING RESULTS */
        <div className="space-y-12">
          {/* Top Return Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-tealAccent-100 dark:bg-tealAccent-950 text-tealAccent-600 flex items-center justify-center font-bold">
                ✓
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  Matching computed for: <span className="text-tealAccent-600">{combinedProfile.educationLevel}</span> ({combinedProfile.stream})
                </h4>
                <p className="text-[11px] text-slate-500">
                  {combinedProfile.skills.length} skills evaluated against 16+ career paths and 9 major government recruitment portals.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSaveToProfile}
                className="px-3.5 py-1.5 rounded-xl bg-tealAccent-600 hover:bg-tealAccent-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <BookmarkCheck className="w-3.5 h-3.5" />
                <span>Save Profile</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('scanner')}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 transition-colors"
              >
                Edit Inputs
              </button>
            </div>
          </div>

          {/* SECTION 1: BEST MATCHING CAREERS (TOP 5) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-brand-50 dark:bg-brand-950 flex items-center justify-center text-brand-600 dark:text-brand-400">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    1. Best Matching Careers
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  {language === 'hi' ? 'शीर्ष 5 करियर आपके कौशल, शिक्षा और स्ट्रीम के आधार पर' : 'Top 5 career paths based on your verified skills and education alignment'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matchedCareers.map((career, idx) => (
                <div
                  key={career.id}
                  className="rounded-3xl p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-card hover:shadow-soft-hover transition-all flex flex-col justify-between space-y-5 group"
                >
                  <div className="space-y-3.5">
                    {/* Top Row: Rank & Match Score */}
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                        #{idx + 1} Best Fit
                      </span>
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-tealAccent-50 dark:bg-tealAccent-950/80 text-tealAccent-700 dark:text-tealAccent-300 border border-tealAccent-200 dark:border-tealAccent-800 text-xs font-black">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{career.matchPercentage}% Match</span>
                      </div>
                    </div>

                    {/* Title & Category */}
                    <div>
                      <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                        {language === 'hi' ? career.title_hi || career.title : career.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                        {language === 'hi' ? career.summary_hi || career.summary : career.summary}
                      </p>
                    </div>

                    {/* Salary & Education Path */}
                    <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-700/60 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-semibold">Expected Salary:</span>
                        <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                          {career.salary_range}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Difficulty:</span>
                        <span className="font-bold text-slate-700 dark:text-slate-300">{career.difficulty}</span>
                      </div>
                    </div>

                    {/* Why It Matches Rationale */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                        Why It Matches:
                      </span>
                      <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                        {career.whyItMatches.slice(0, 2).map((reason, rIdx) => (
                          <li key={rIdx} className="flex items-start gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-tealAccent-500 shrink-0 mt-0.5" />
                            <span className="leading-tight">{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Matching Skills Chips */}
                    {career.matchingSkills.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-tealAccent-600 block">
                          Verified Matching Skills:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {career.matchingSkills.map((m, mIdx) => (
                            <span
                              key={mIdx}
                              className="text-[10px] px-2 py-0.5 rounded-md bg-tealAccent-50 dark:bg-tealAccent-950 text-tealAccent-700 dark:text-tealAccent-300 font-medium"
                            >
                              ✓ {m.matchedBy}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions: Roadmap & Skill Gap */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center gap-2">
                    <Link
                      to={`/roadmap?career=${encodeURIComponent(career.title)}`}
                      className="flex-1 py-2 px-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold text-center transition-colors flex items-center justify-center gap-1"
                    >
                      <span>Roadmap</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                    <Link
                      to={`/skill-gap?career=${encodeURIComponent(career.id)}`}
                      className="py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors"
                    >
                      Skill Gap
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 2: GOVERNMENT JOB OPPORTUNITIES */}
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Landmark className="w-4 h-4" />
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  2. Government Job Opportunities
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                {language === 'hi'
                  ? 'आपकी योग्यता के अनुसार प्रासंगिक सरकारी परीक्षाएं (पात्रता स्थिति व सलाह के साथ)'
                  : 'Relevant government recruitments your education qualifies for or is close to qualifying for'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matchedGovtExams.map(exam => (
                <div
                  key={exam.id}
                  className="rounded-3xl p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-card flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                          exam.isDirectlyEligible
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                            : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                        }`}
                      >
                        {exam.statusLabel}
                      </span>
                      <span className="text-xs font-black text-slate-500">
                        {exam.matchScore}% Synergy
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-black text-slate-900 dark:text-white">
                        {exam.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Organizer: {exam.organizer} • {exam.frequency}
                      </p>
                    </div>

                    {/* Eligibility Note */}
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-700/60 space-y-1 text-xs">
                      <span className="font-bold text-slate-700 dark:text-slate-300 block">
                        Eligibility Analysis:
                      </span>
                      <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                        {exam.eligibilityNote}
                      </p>
                    </div>

                    {/* Target Roles */}
                    {exam.target_roles.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          Target Posts:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {exam.target_roles.slice(0, 3).map((r, rIdx) => (
                            <span
                              key={rIdx}
                              className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-750 text-slate-700 dark:text-slate-300"
                            >
                              {r}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <Link
                    to="/govt-jobs"
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-white text-xs font-bold text-center transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>View Exam Blueprint & Syllabus</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 3: SKILLS YOU'RE MISSING & FREE RESOURCES */}
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950 flex items-center justify-center text-rose-600 dark:text-rose-400">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  3. Skills You're Missing for Next-Level Opportunities
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                {language === 'hi'
                  ? 'अगले स्तर के अवसरों के लिए आवश्यक हुनर और मुफ़्त मान्यता प्राप्त सरकारी व ओपन कोर्सेस'
                  : 'High-value skills required for your top matching careers, paired with 100% free courses from NPTEL, SWAYAM, Skill India & YouTube'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {missingSkillsData.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-3xl p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-card flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                        {item.category} Gap
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500">
                        Needed for: {item.relevantCareer.split('/')[0]}
                      </span>
                    </div>

                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                      {item.skillName}
                    </h3>

                    {/* Free Courses Links */}
                    <div className="space-y-2 pt-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Free Certified Learning Resources:
                      </span>
                      <div className="space-y-2">
                        {item.courses.map((course, cIdx) => (
                          <a
                            key={cIdx}
                            href={course.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-brand-400 dark:hover:border-brand-500 bg-slate-50 dark:bg-slate-850 hover:bg-white dark:hover:bg-slate-800 transition-all block group"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                                  {course.title}
                                </h5>
                                <p className="text-[10px] text-tealAccent-600 dark:text-tealAccent-400 font-medium mt-0.5">
                                  {course.platform} • {course.duration || 'Free'}
                                </p>
                              </div>
                              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-600 shrink-0 mt-0.5" />
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* OCR EXTRACTION CONFIRMATION / EDIT MODAL */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-850 rounded-3xl max-w-xl w-full p-6 sm:p-7 border border-slate-200 dark:border-slate-700 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-tealAccent-500 text-white flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    {editingCertIndex !== null ? 'Edit Certificate Details' : 'Verify Extracted Certificate Details'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    OCR scanned with {extractedData.confidence || 95}% confidence. Please correct any inaccuracies.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowReviewModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Certificate Preview (if available) */}
            {extractedData.previewUrl && (
              <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 max-h-40 bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
                <img
                  src={extractedData.previewUrl}
                  alt="Certificate Preview"
                  className="max-h-40 object-contain w-full"
                />
              </div>
            )}

            {/* Editable Form Fields */}
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Certificate / Course Name *
                </label>
                <input
                  type="text"
                  value={extractedData.certificateName}
                  onChange={(e) => setExtractedData({ ...extractedData, certificateName: e.target.value })}
                  placeholder="e.g. Programming in Python"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-tealAccent-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    Issuing Institute / Board
                  </label>
                  <input
                    type="text"
                    value={extractedData.issuingInstitute}
                    onChange={(e) => setExtractedData({ ...extractedData, issuingInstitute: e.target.value })}
                    placeholder="e.g. NPTEL / IIT Madras, NCVT, CBSE"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-tealAccent-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    Year of Completion
                  </label>
                  <input
                    type="text"
                    value={extractedData.completionYear}
                    onChange={(e) => setExtractedData({ ...extractedData, completionYear: e.target.value })}
                    placeholder="e.g. 2025"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-tealAccent-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Skill or Subject Area
                </label>
                <input
                  type="text"
                  value={extractedData.skillArea}
                  onChange={(e) => setExtractedData({ ...extractedData, skillArea: e.target.value })}
                  placeholder="e.g. Python Programming, Algorithms"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-tealAccent-500"
                />
              </div>

              {/* Skills Extracted */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Detected Skills to Add to Profile
                </label>
                <div className="flex flex-wrap gap-1.5 min-h-[32px]">
                  {(extractedData.detectedSkills || []).map(sk => (
                    <span
                      key={sk}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-tealAccent-100 dark:bg-tealAccent-950 text-tealAccent-800 dark:text-tealAccent-200 text-xs font-medium"
                    >
                      {sk}
                      <button
                        type="button"
                        onClick={() => handleRemoveModalSkill(sk)}
                        className="hover:text-rose-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tempSkillInput}
                    onChange={(e) => setTempSkillInput(e.target.value)}
                    placeholder="Add extra skill from certificate"
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-tealAccent-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddModalSkill}
                    className="px-3 py-2 rounded-xl bg-tealAccent-600 text-white text-xs font-bold hover:bg-tealAccent-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-700/60">
              <button
                type="button"
                onClick={() => setShowReviewModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmCertificate}
                className="px-5 py-2.5 rounded-xl bg-tealAccent-600 hover:bg-tealAccent-700 text-white text-xs font-black shadow-md shadow-tealAccent-500/20 transition-all flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm & Add to Profile</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
