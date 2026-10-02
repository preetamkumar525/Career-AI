/**
 * examRecommender.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Converts raw OCR output (text extracted from a certificate / marksheet) into
 * a ranked list of the top 3 career + exam recommendations.
 *
 * This file is intentionally self-contained so the recommendation logic can be
 * replaced with a real AI/ML API call later without touching any UI code.
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ─── Stream Detection Keywords ────────────────────────────────────────────────

const STREAM_SIGNALS = {
  pcm: [
    'physics', 'chemistry', 'mathematics', 'maths', 'pcm', 'engineering',
    'jee', 'bitsat', 'b.tech', 'btech', 'mechanical', 'electrical engineering',
    'civil engineering', 'computer science', 'electronics', 'nda', 'iit', 'nit',
    'भौतिकी', 'रसायन', 'गणित'
  ],
  pcb: [
    'biology', 'zoology', 'botany', 'pcb', 'neet', 'mbbs', 'bds', 'nursing',
    'pharmacy', 'b.pharm', 'physiotherapy', 'life science', 'biochemistry',
    'जीव विज्ञान', 'नर्सिंग', 'बायोलॉजी'
  ],
  commerce: [
    'commerce', 'accountancy', 'accounting', 'economics', 'business studies',
    'ca foundation', 'cs foundation', 'tally', 'gst', 'bcom', 'b.com',
    'banking', 'ibps', 'sbi', 'ca', 'cs', 'cma', 'finance', 'taxation',
    'वाणिज्य', 'लेखाकार', 'बैंकिंग'
  ],
  arts: [
    'arts', 'history', 'political science', 'geography', 'sociology',
    'psychology', 'english literature', 'hindi', 'upsc', 'ctet', 'tet',
    'teaching', 'humanities', 'social science', 'ba', 'b.a', 'journalism',
    'कला', 'इतिहास', 'भूगोल', 'राजनीति'
  ],
  vocational: [
    'iti', 'electrician', 'wireman', 'fitter', 'machinist', 'welder',
    'plumber', 'carpenter', 'mechanic', 'ncvt', 'scvt', 'dgt', 'trade',
    'technician', 'operator', 'nsdc', 'skill india', 'आईटीआई', 'वेल्डर'
  ]
};

// ─── Marks / Percentage Extraction ───────────────────────────────────────────

/**
 * Extract the highest numeric percentage or marks from raw OCR text.
 * Looks for patterns like "85%", "85.6%", "85/100", "marks: 420", "score: 720"
 */
export function extractMarksFromText(text) {
  if (!text) return null;

  // Percentage patterns: "85%", "85.5 %", "eighty five percent"
  const pctMatches = text.match(/(\d{1,3}(?:\.\d{1,2})?)\s*%/g);
  if (pctMatches && pctMatches.length > 0) {
    const values = pctMatches
      .map(m => parseFloat(m))
      .filter(v => v >= 30 && v <= 100);
    if (values.length > 0) return Math.max(...values);
  }

  // Fraction patterns: "450/500", "85/100"
  const fracMatches = text.match(/(\d{2,3})\s*\/\s*(100|500|600|720|900)/g);
  if (fracMatches && fracMatches.length > 0) {
    for (const m of fracMatches) {
      const [num, den] = m.split('/').map(n => parseFloat(n.trim()));
      const pct = Math.round((num / den) * 100);
      if (pct >= 30 && pct <= 100) return pct;
    }
  }

  return null;
}

// ─── Stream Detection ─────────────────────────────────────────────────────────

/**
 * Detect stream from raw OCR text.
 * Returns: 'pcm' | 'pcb' | 'commerce' | 'arts' | 'vocational' | 'general'
 */
export function detectStreamFromText(text) {
  if (!text) return 'general';
  const lower = text.toLowerCase();

  const scores = { pcm: 0, pcb: 0, commerce: 0, arts: 0, vocational: 0 };

  for (const [stream, keywords] of Object.entries(STREAM_SIGNALS)) {
    for (const kw of keywords) {
      if (lower.includes(kw)) scores[stream] += 1;
    }
  }

  const maxScore = Math.max(...Object.values(scores));
  if (maxScore === 0) return 'general';

  // If two streams are tied, prefer the one that comes first in priority order
  const priority = ['pcm', 'pcb', 'commerce', 'arts', 'vocational'];
  return priority.find(s => scores[s] === maxScore) || 'general';
}

// ─── Course / Certificate Name Extraction ────────────────────────────────────

/**
 * Extract a course or certificate name from raw OCR text.
 */
export function extractCourseFromText(text) {
  if (!text) return null;
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 4);

  for (const line of lines) {
    const l = line.toLowerCase();
    if (
      l.includes('certificate') ||
      l.includes('diploma') ||
      l.includes('course in') ||
      l.includes('program in') ||
      l.includes('training in') ||
      l.includes('specialization')
    ) {
      return line.slice(0, 80);
    }
  }

  // Return first significant line as fallback
  return lines[0]?.slice(0, 60) || null;
}

// ─── Recommendation Catalogue ────────────────────────────────────────────────

/**
 * All recommendation options with stream tags and scoring weights.
 * matchBase: base match % before marks/skill bonuses.
 * streams: which detected streams this recommendation applies to.
 */
const RECOMMENDATION_CATALOGUE = [
  // PCM
  {
    id: 'jee_engineering',
    title: 'Engineering via JEE (B.Tech / B.E.)',
    icon: 'Cpu',
    streams: ['pcm'],
    matchBase: 88,
    salaryRange: '₹4.5–35+ LPA',
    reasonTemplate: (stream, marks) =>
      `Your ${stream === 'pcm' ? 'PCM background' : 'technical skills'}${marks ? ` and ${marks}% score` : ''} align directly with JEE engineering pathways.`,
    nextStep: 'Start JEE Main preparation — focus on NCERT Physics, Chemistry & Maths (Class 11–12).',
    nextStepUrl: 'https://jeemain.nta.nic.in',
    badge: 'Top Pick for PCM'
  },
  {
    id: 'nda_defence',
    title: 'Defence Officer via NDA / CDS',
    icon: 'ShieldCheck',
    streams: ['pcm', 'general'],
    matchBase: 80,
    salaryRange: '₹56,100–2,50,000 / month + Perks',
    reasonTemplate: (stream, marks) =>
      `NDA accepts 12th PCM students directly. ${marks && marks >= 60 ? `A ${marks}% score gives you a strong competitive edge.` : 'Academic performance + fitness is the key.'}`,
    nextStep: 'Apply for NDA (I) / NDA (II) via UPSC — written exam + SSB interview. Age: 16.5–19.5 yrs.',
    nextStepUrl: 'https://upsc.gov.in',
    badge: 'Govt Job'
  },
  {
    id: 'btech_govt_jobs',
    title: 'Technical Govt Jobs (GATE / PSU / SSC JE)',
    icon: 'Landmark',
    streams: ['pcm', 'vocational'],
    matchBase: 76,
    salaryRange: '₹40,000–1,60,000 / month',
    reasonTemplate: (stream, marks) =>
      `Science/Technical background opens doors to GATE, PSU recruitment, and SSC Junior Engineer exams.`,
    nextStep: 'Prepare for SSC JE or GATE after B.Tech — eligibility from Diploma level onwards.',
    nextStepUrl: 'https://ssc.nic.in',
    badge: 'Stable Career'
  },

  // PCB
  {
    id: 'neet_medical',
    title: 'Medical Career via NEET (MBBS / BDS)',
    icon: 'Award',
    streams: ['pcb'],
    matchBase: 90,
    salaryRange: '₹8–30+ LPA (Specialist: ₹30–80 LPA)',
    reasonTemplate: (stream, marks) =>
      `Your Biology background${marks ? ` and ${marks}% score` : ''} positions you well for NEET — India's single medical entrance exam.`,
    nextStep: 'Register for NEET-UG. Focus on NCERT Biology, Physics & Chemistry. Target top Govt Medical Colleges.',
    nextStepUrl: 'https://neet.nta.nic.in',
    badge: 'Top Pick for PCB'
  },
  {
    id: 'nursing_pharmacy',
    title: 'Nursing / Pharmacy / Allied Health',
    icon: 'BookOpen',
    streams: ['pcb'],
    matchBase: 80,
    salaryRange: '₹3–10 LPA (Govt hospital: ₹35,000–80,000/mo)',
    reasonTemplate: (stream, marks) =>
      `Science + Biology qualifies you for B.Sc Nursing, B.Pharm, and Allied Health Science programmes with strong placement.`,
    nextStep: 'Apply for B.Sc Nursing / B.Pharm via state CET or direct admission. AIIMS BSc Nursing exam is highly competitive.',
    nextStepUrl: 'https://aiimsexams.ac.in',
    badge: 'High Demand'
  },
  {
    id: 'govt_health_jobs',
    title: 'Govt Health & Lab Technician Jobs',
    icon: 'Briefcase',
    streams: ['pcb'],
    matchBase: 74,
    salaryRange: '₹25,000–75,000 / month',
    reasonTemplate: () =>
      `Diploma / certificate in Medical Lab Technology (MLT) or Radiology opens direct govt hospital employment.`,
    nextStep: 'Complete DMLT or similar allied health diploma, then apply to State Health Dept / ESIC / Railway hospitals.',
    nextStepUrl: 'https://esic.gov.in',
    badge: 'Stable Career'
  },

  // Commerce
  {
    id: 'ca_cs_foundation',
    title: 'Chartered Accountant / Company Secretary (CA/CS)',
    icon: 'TrendingUp',
    streams: ['commerce'],
    matchBase: 88,
    salaryRange: '₹7–40+ LPA (Big 4: ₹20–60 LPA)',
    reasonTemplate: (stream, marks) =>
      `Commerce background${marks ? ` with ${marks}%` : ''} is the ideal starting point for CA Foundation or CS Foundation exams.`,
    nextStep: 'Register for ICAI CA Foundation or ICSI CS Foundation. Both can be started right after Class 12.',
    nextStepUrl: 'https://icai.org',
    badge: 'Top Pick for Commerce'
  },
  {
    id: 'banking_ibps_sbi',
    title: 'Banking & Finance (IBPS PO / SBI PO / Clerk)',
    icon: 'Landmark',
    streams: ['commerce', 'general', 'arts'],
    matchBase: 82,
    salaryRange: '₹35,000–75,000 / month + Benefits',
    reasonTemplate: (stream, marks) =>
      `Commerce / Economics skills and numerical aptitude are highly valued in IBPS PO, SBI PO and Clerk exams.`,
    nextStep: 'Apply for IBPS PO / SBI PO after graduation. Practice Quantitative Aptitude, Reasoning, and English daily.',
    nextStepUrl: 'https://ibps.in',
    badge: 'High Demand'
  },
  {
    id: 'cuet_bcom',
    title: 'BCom / BBA via CUET (Top Central Universities)',
    icon: 'GraduationCap',
    streams: ['commerce'],
    matchBase: 75,
    salaryRange: '₹3–12 LPA (starting) → ₹15–35 LPA (5 yrs exp)',
    reasonTemplate: () =>
      `CUET (Common University Entrance Test) opens BCom/BBA seats at DU, BHU, JNU and 250+ Central Universities.`,
    nextStep: 'Register for CUET-UG. Prepare Domain Subjects (Accountancy, Economics) + English & General Test sections.',
    nextStepUrl: 'https://cuet.samarth.ac.in',
    badge: 'Govt University'
  },

  // Arts / Humanities
  {
    id: 'upsc_civil_services',
    title: 'Civil Services / IAS / IPS (UPSC)',
    icon: 'Award',
    streams: ['arts', 'general', 'commerce'],
    matchBase: 82,
    salaryRange: '₹56,100–2,50,000 / month + Official Residence',
    reasonTemplate: (stream, marks) =>
      `Arts / Humanities is the traditional powerhouse for UPSC Civil Services. Begin foundation reading now.`,
    nextStep: 'Complete graduation in any stream, then appear for UPSC CSE. Start with NCERTs and current affairs from today.',
    nextStepUrl: 'https://upsc.gov.in',
    badge: 'Prestigious'
  },
  {
    id: 'ctet_teaching',
    title: 'Teaching Career via CTET / TET / KVS',
    icon: 'BookOpen',
    streams: ['arts', 'general'],
    matchBase: 75,
    salaryRange: '₹35,000–80,000 / month (Govt School)',
    reasonTemplate: () =>
      `Arts & Humanities graduates with a B.Ed or D.El.Ed degree are eligible for CTET, TET and direct KVS/NVS recruitment.`,
    nextStep: 'Complete B.Ed after graduation, then clear CTET Paper I or II based on the grade you want to teach.',
    nextStepUrl: 'https://ctet.nic.in',
    badge: 'Job Security'
  },
  {
    id: 'cuet_arts',
    title: 'BA (Hons) via CUET — Top Universities',
    icon: 'GraduationCap',
    streams: ['arts'],
    matchBase: 72,
    salaryRange: '₹3–10 LPA (starting) → Highly variable',
    reasonTemplate: () =>
      `CUET-UG opens BA Hons seats in History, Political Science, English, Psychology at DU, BHU, JNU and more.`,
    nextStep: 'Register for CUET-UG. Prepare domain subjects (History / Pol. Sci / English) + General Test section.',
    nextStepUrl: 'https://cuet.samarth.ac.in',
    badge: 'Govt University'
  },

  // Vocational / ITI
  {
    id: 'apprenticeship_ncvt',
    title: 'Apprenticeship & NCVT Trade Certificate Jobs',
    icon: 'ShieldCheck',
    streams: ['vocational'],
    matchBase: 88,
    salaryRange: '₹18,000–55,000 / month',
    reasonTemplate: (stream, marks) =>
      `ITI / Trade certificate holders are directly eligible for NCVT-certified apprenticeships and DGT-listed jobs.`,
    nextStep: 'Register on the Apprenticeship Portal (apprenticeshipindia.org) and apply to PSUs, Railways & private firms.',
    nextStepUrl: 'https://apprenticeshipindia.org',
    badge: 'Top Pick for ITI'
  },
  {
    id: 'railways_rrb',
    title: 'Railways Technician / RRB ALP / Group D',
    icon: 'Landmark',
    streams: ['vocational', 'general'],
    matchBase: 82,
    salaryRange: '₹19,900–63,200 / month + Allowances',
    reasonTemplate: () =>
      `ITI / Trade certificate is directly accepted for RRB ALP (Loco Pilot) and Group D technical posts in Indian Railways.`,
    nextStep: 'Apply for RRB ALP / Technician. ITI trade must match the qualifying trade list. Prepare CBT Maths + GS + Technical.',
    nextStepUrl: 'https://indianrailways.gov.in',
    badge: 'Govt Job'
  },

  // General / Fallback — open to most streams
  {
    id: 'ssc_cgl',
    title: 'SSC CGL — Central Govt Officer (Group B/C)',
    icon: 'Briefcase',
    streams: ['general', 'arts', 'commerce', 'pcm', 'pcb'],
    matchBase: 78,
    salaryRange: '₹35,400–1,12,400 / month',
    reasonTemplate: () =>
      `SSC CGL is open to any graduate — no specific stream required. It leads to Inspector, Auditor, Tax Assistant posts.`,
    nextStep: 'Prepare for SSC CGL Tier-1 (Reasoning, Maths, English, GK) after graduation. Lakhs of vacancies yearly.',
    nextStepUrl: 'https://ssc.nic.in',
    badge: 'Open to All'
  },
  {
    id: 'rrb_ntpc',
    title: 'Railways NTPC — Station Master / Clerk / Traffic',
    icon: 'Landmark',
    streams: ['general', 'arts', 'commerce'],
    matchBase: 74,
    salaryRange: '₹19,900–63,200 / month',
    reasonTemplate: () =>
      `RRB NTPC posts (Clerk, Account Clerk, Station Master) require only 12th pass or graduation — open to all streams.`,
    nextStep: 'Register at rrbapply.gov.in when NTPC notification is released. Prepare Reasoning, Maths & General Awareness.',
    nextStepUrl: 'https://rrbapply.gov.in',
    badge: 'Open to All'
  },
  {
    id: 'ssc_chsl',
    title: 'SSC CHSL — LDC / DEO / Postal Assistant (10+2)',
    icon: 'FileText',
    streams: ['general', 'arts', 'commerce', 'pcm', 'pcb'],
    matchBase: 70,
    salaryRange: '₹19,900–63,200 / month',
    reasonTemplate: () =>
      `SSC CHSL accepts 12th pass candidates for Lower Division Clerk (LDC), Postal Assistant, and Data Entry Operator roles.`,
    nextStep: 'Apply for SSC CHSL Tier-1 (Reasoning, English, Maths, GK). Requires only 10+2 — one of the easiest entry-level govt exams.',
    nextStepUrl: 'https://ssc.nic.in',
    badge: 'After 12th'
  }
];

// ─── Main Recommender Function ────────────────────────────────────────────────

/**
 * getTop3Recommendations
 * ─────────────────────────────────────────────────────────────────────────────
 * @param {Object} ocrData  — result from extractSkillsFromCertificate()
 *   Expected shape:
 *     { rawText, detectedSkills, confidence, certificateName, skillArea, ... }
 *
 * @returns {Array<Object>} — top 3 ranked recommendations, each:
 *   { id, title, icon, matchPercent, reason, nextStep, nextStepUrl,
 *     salaryRange, badge, detectedStream, detectedMarks }
 */
export function getTop3Recommendations(ocrData = {}) {
  const rawText = [
    ocrData.rawText || '',
    ocrData.certificateName || '',
    ocrData.skillArea || '',
    (ocrData.detectedSkills || []).join(' ')
  ].join(' ');

  // 1. Detect stream and marks
  const detectedStream = detectStreamFromText(rawText);
  const detectedMarks = extractMarksFromText(rawText);

  // 2. Score each recommendation
  const scored = RECOMMENDATION_CATALOGUE.map(rec => {
    const streamMatch = rec.streams.includes(detectedStream);
    const generalFallback = rec.streams.includes('general');

    let score = rec.matchBase;

    // Stream match bonus
    if (streamMatch && detectedStream !== 'general') score += 10;
    else if (generalFallback && !streamMatch) score -= 8;
    else if (!streamMatch && !generalFallback) score -= 20; // strong mismatch

    // Marks bonus/penalty
    if (detectedMarks !== null) {
      if (detectedMarks >= 85) score += 8;
      else if (detectedMarks >= 70) score += 4;
      else if (detectedMarks < 50) score -= 6;
    }

    // Skill keyword bonus — check if any of the user's detected skills hint at this path
    const skillText = (ocrData.detectedSkills || []).join(' ').toLowerCase();
    if (rec.id === 'jee_engineering' && (skillText.includes('python') || skillText.includes('algorithm'))) score += 5;
    if (rec.id === 'ca_cs_foundation' && (skillText.includes('tally') || skillText.includes('accounting'))) score += 6;
    if (rec.id === 'banking_ibps_sbi' && skillText.includes('excel')) score += 4;
    if (rec.id === 'apprenticeship_ncvt' && (skillText.includes('electrician') || skillText.includes('welding'))) score += 8;
    if (rec.id === 'railways_rrb' && skillText.includes('electrician')) score += 6;

    // Clamp to [50, 98]
    score = Math.min(98, Math.max(50, Math.round(score)));

    return {
      ...rec,
      matchPercent: score,
      reason: rec.reasonTemplate(detectedStream, detectedMarks),
      detectedStream,
      detectedMarks
    };
  });

  // 3. Sort descending, take top 3
  scored.sort((a, b) => b.matchPercent - a.matchPercent);

  // 4. Deduplicate streams — avoid showing 3 items from the same bucket
  const seen = new Set();
  const top3 = [];
  for (const rec of scored) {
    const primaryStream = rec.streams[0];
    if (!seen.has(primaryStream) || top3.length < 2) {
      top3.push(rec);
      seen.add(primaryStream);
    }
    if (top3.length === 3) break;
  }

  // If still < 3 after dedup, fill from the sorted list
  if (top3.length < 3) {
    for (const rec of scored) {
      if (!top3.find(r => r.id === rec.id)) {
        top3.push(rec);
      }
      if (top3.length === 3) break;
    }
  }

  return top3.map((rec, idx) => ({
    rank: idx + 1,
    id: rec.id,
    title: rec.title,
    icon: rec.icon,
    matchPercent: rec.matchPercent,
    salaryRange: rec.salaryRange,
    reason: rec.reason,
    nextStep: rec.nextStep,
    nextStepUrl: rec.nextStepUrl,
    badge: rec.badge,
    detectedStream: rec.detectedStream,
    detectedMarks: rec.detectedMarks
  }));
}

/**
 * getStreamLabel — human readable stream name for display
 */
export function getStreamLabel(streamKey) {
  const map = {
    pcm: 'Science (PCM)',
    pcb: 'Science (PCB)',
    commerce: 'Commerce',
    arts: 'Arts / Humanities',
    vocational: 'Vocational / ITI',
    general: 'General / Open'
  };
  return map[streamKey] || 'General';
}
