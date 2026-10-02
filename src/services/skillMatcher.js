import careersData from '../data/careers.json';
import govtExamsData from '../data/govtExams.json';
import skillsData from '../data/skillsData.json';

/**
 * Mock OCR and Certificate Extraction Service
 * Structured so that a real OCR engine (e.g. Tesseract.js, Google Cloud Vision, or Gemini Vision API)
 * can be plugged in without changing the UI interface.
 */
export async function parseCertificateMock(fileOrSample) {
  // Simulate network/OCR latency for realistic UX
  await new Promise(resolve => setTimeout(resolve, 800));

  // If a sample certificate ID or name was passed
  if (typeof fileOrSample === 'string') {
    return getPredefinedSample(fileOrSample);
  }

  // If a File object was passed
  const fileName = fileOrSample?.name?.toLowerCase() || '';

  // Smart heuristic based on file name or generic fallback
  if (fileName.includes('python') || fileName.includes('code') || fileName.includes('prog')) {
    return {
      certificateName: 'Programming in Python & Problem Solving',
      skillArea: 'Python Programming, Algorithms, Data Structures',
      issuingInstitute: 'NPTEL / IIT Madras',
      completionYear: '2025',
      detectedSkills: ['Python', 'Problem Solving', 'Data Structures & Algorithms'],
      confidence: 96,
      notes: 'Recognized by AICTE and SWAYAM National Coordinator.'
    };
  } else if (fileName.includes('electric') || fileName.includes('iti') || fileName.includes('wireman')) {
    return {
      certificateName: 'National Trade Certificate - Electrician',
      skillArea: 'Industrial Wiring, Circuit Diagnostics, Safety Standards',
      issuingInstitute: 'NCVT / Directorate General of Training (DGT)',
      completionYear: '2024',
      detectedSkills: ['Electrician work', 'Wiring & Circuits', 'Industrial Safety & Tool Handling'],
      confidence: 94,
      notes: 'Ministry of Skill Development & Entrepreneurship certified trade.'
    };
  } else if (fileName.includes('tally') || fileName.includes('gst') || fileName.includes('account')) {
    return {
      certificateName: 'Certificate in Financial Accounting & Tally Prime',
      skillArea: 'Tally Prime, GST Filing, Balance Sheet, Ledger Accounting',
      issuingInstitute: 'National Skill Development Corporation (NSDC)',
      completionYear: '2025',
      detectedSkills: ['Tally', 'Excel', 'Financial Accounting', 'Taxation Laws (GST & Income Tax)'],
      confidence: 95,
      notes: 'NSDC Skill India verified certification.'
    };
  } else if (fileName.includes('data') || fileName.includes('analytics') || fileName.includes('sql')) {
    return {
      certificateName: 'Google Data Analytics Professional Certificate',
      skillArea: 'Data Analysis, SQL Queries, Tableau, Spreadsheet Modeling',
      issuingInstitute: 'Google Career Certificates / Coursera',
      completionYear: '2025',
      detectedSkills: ['SQL', 'Data Analysis', 'Excel', 'Tableau / Power BI'],
      confidence: 97,
      notes: 'Industry recognized data foundation certificate.'
    };
  } else if (fileName.includes('design') || fileName.includes('ui') || fileName.includes('ux') || fileName.includes('figma')) {
    return {
      certificateName: 'UI/UX Design Specialist Certificate',
      skillArea: 'Figma, Wireframing, User Research, Mobile App Design',
      issuingInstitute: 'DesignX Academy / Skill India Digital',
      completionYear: '2025',
      detectedSkills: ['Graphic Design', 'Figma & Auto Layout', 'User Research & Wireframing'],
      confidence: 93,
      notes: 'Product design & digital media credential.'
    };
  } else if (fileName.includes('12') || fileName.includes('inter') || fileName.includes('hsc') || fileName.includes('cbse')) {
    return {
      certificateName: 'Senior Secondary School Examination (10+2)',
      skillArea: 'Science Stream (Physics, Chemistry, Mathematics)',
      issuingInstitute: 'Central Board of Secondary Education (CBSE)',
      completionYear: '2025',
      detectedSkills: ['Mathematics', 'Physics', 'Logical Reasoning'],
      confidence: 98,
      notes: 'Higher Secondary Qualification verified.'
    };
  } else {
    // Default smart extraction mock
    return {
      certificateName: 'Certificate of Competence & Professional Training',
      skillArea: 'Digital Literacy, Problem Solving, Applied Communication',
      issuingInstitute: 'State Technical Education Board / NSDC',
      completionYear: '2025',
      detectedSkills: ['Communication', 'Excel', 'Problem Solving'],
      confidence: 91,
      notes: 'Verified educational achievement credential.'
    };
  }
}

/**
 * Pre-defined sample certificates for instant 1-click testing
 */
export const SAMPLE_CERTIFICATES = [
  {
    id: 'sample-python',
    label: 'Python Programming (IIT Madras NPTEL)',
    data: {
      certificateName: 'Programming, Data Structures & Algorithms Using Python',
      skillArea: 'Python Programming, Data Structures, Problem Solving',
      issuingInstitute: 'NPTEL - IIT Madras',
      completionYear: '2025',
      detectedSkills: ['Python', 'Data Structures & Algorithms', 'Problem Solving', 'Web Development'],
      confidence: 98,
      notes: 'Top 5% Elite Silver Certification'
    }
  },
  {
    id: 'sample-electrician',
    label: 'Electrician Trade (NCVT / Bharat Skills)',
    data: {
      certificateName: 'National Trade Certificate - Electrician & Wireman',
      skillArea: 'Electrical Wiring, Circuit Diagnostics, Industrial Safety',
      issuingInstitute: 'National Council for Vocational Training (NCVT)',
      completionYear: '2024',
      detectedSkills: ['Electrician work', 'Wiring & Circuits', 'Industrial Safety & Tool Handling', 'Equipment Troubleshooting'],
      confidence: 96,
      notes: 'Ministry of Skill Development & Entrepreneurship'
    }
  },
  {
    id: 'sample-tally',
    label: 'Tally Prime & GST (NSDC Skill India)',
    data: {
      certificateName: 'Tally Prime Financial Accounting with GST',
      skillArea: 'Accounting, GST Returns, Balance Sheets, Excel Reporting',
      issuingInstitute: 'Skill India / NSDC Certified Partner',
      completionYear: '2025',
      detectedSkills: ['Tally', 'Excel', 'Financial Accounting', 'Taxation Laws (GST & Income Tax)'],
      confidence: 97,
      notes: 'Certified Accounts & GST Executive'
    }
  },
  {
    id: 'sample-data',
    label: 'Data Analytics & SQL (Coursera / Google)',
    data: {
      certificateName: 'Google Data Analytics Professional Certificate',
      skillArea: 'SQL, Spreadsheet Modeling, Tableau, Data Cleaning',
      issuingInstitute: 'Google / Coursera Partner',
      completionYear: '2025',
      detectedSkills: ['SQL', 'Data Analysis', 'Excel', 'Tableau / Power BI', 'Python'],
      confidence: 99,
      notes: 'Completed all 8 modules and capstone project'
    }
  }
];

function getPredefinedSample(sampleId) {
  const match = SAMPLE_CERTIFICATES.find(s => s.id === sampleId);
  if (match) return { ...match.data };
  return {
    certificateName: 'Certified Applied Skills Program',
    skillArea: 'Applied Technical Skills',
    issuingInstitute: 'National Skill Development Agency',
    completionYear: '2025',
    detectedSkills: ['Excel', 'Communication', 'Problem Solving'],
    confidence: 92
  };
}

/**
 * Standardize and normalize a skill string for comparison
 */
function normalizeSkill(str = '') {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Check if a user's skill matches any required skill keywords
 */
function skillMatches(userSkill, targetSkill) {
  const u = normalizeSkill(userSkill);
  const t = normalizeSkill(targetSkill);
  if (!u || !t) return false;
  return u.includes(t) || t.includes(u);
}

/**
 * Match user's Skill Profile against Career paths
 * Returns top 5 matched careers with match %, reasons, and missing skills
 */
export function matchCareers(skillProfile) {
  if (!skillProfile) return [];

  const userSkills = (skillProfile.skills || []).map(s => typeof s === 'string' ? s : s.name);
  const userEducation = (skillProfile.educationLevel || '').toLowerCase();
  const userStream = (skillProfile.stream || '').toLowerCase();
  const userCourses = (skillProfile.courses || []).map(c => c.toLowerCase());

  const scoredCareers = careersData.map(career => {
    let score = 30; // base potential
    const matchingSkills = [];
    const missingSkills = [];

    // 1. Skill overlap matching
    (career.skills_needed || []).forEach(neededSkill => {
      const found = userSkills.find(uSkill => {
        const u = normalizeSkill(uSkill);
        const n = normalizeSkill(neededSkill);
        return (
          u.includes(n) || n.includes(u) ||
          // Keyword shortcuts
          (u.includes('python') && n.includes('python')) ||
          (u.includes('excel') && (n.includes('excel') || n.includes('data') || n.includes('account'))) ||
          (u.includes('tally') && (n.includes('account') || n.includes('tax') || n.includes('budget'))) ||
          (u.includes('electric') && (n.includes('circuit') || n.includes('wiring') || n.includes('equipment'))) ||
          (u.includes('tailor') && (n.includes('design') || n.includes('creative'))) ||
          (u.includes('sql') && (n.includes('data') || n.includes('database'))) ||
          (u.includes('communicat') && (n.includes('communicat') || n.includes('english') || n.includes('essay') || n.includes('speaking')))
        );
      });

      if (found) {
        matchingSkills.push({ required: neededSkill, matchedBy: found });
        score += 15;
      } else {
        missingSkills.push(neededSkill);
      }
    });

    // 2. Stream alignment
    const eligibleStreams = (career.eligible_streams || []).map(s => s.toLowerCase());
    const streamMatched = eligibleStreams.some(st => {
      if (userStream.includes('pcm') && st.includes('pcm')) return true;
      if (userStream.includes('pcb') && st.includes('pcb')) return true;
      if (userStream.includes('commerce') && st.includes('commerce')) return true;
      if (userStream.includes('arts') && st.includes('arts')) return true;
      if (st.includes('any')) return true;
      return false;
    });

    if (streamMatched) {
      score += 15;
    }

    // 3. Education path compatibility
    const careerPath = (career.education_path || '').toLowerCase();
    if (userEducation.includes('graduate') || userEducation.includes('degree') || userEducation.includes('b.tech') || userEducation.includes('bca')) {
      score += 15;
    } else if (userEducation.includes('12th') || userEducation.includes('intermediate')) {
      if (careerPath.includes('10+2') || careerPath.includes('12th')) {
        score += 12;
      }
    } else if (userEducation.includes('iti') || userEducation.includes('diploma') || userEducation.includes('polytechnic')) {
      if (career.category === 'vocational' || career.id === 'iti_polytechnic' || careerPath.includes('diploma') || careerPath.includes('iti')) {
        score += 25;
      }
    }

    // 4. Course / certificate keywords
    userCourses.forEach(c => {
      if (career.title.toLowerCase().includes(c) || career.summary.toLowerCase().includes(c)) {
        score += 10;
      }
    });

    // Normalize match percentage realistically between 55% and 98%
    const matchPercentage = Math.min(98, Math.max(52, Math.round(score)));

    // Generate detailed why-it-matches rationale
    const whyItMatches = [];
    if (matchingSkills.length > 0) {
      const topMatchedNames = matchingSkills.slice(0, 3).map(m => m.matchedBy).join(', ');
      whyItMatches.push(`Direct skill synergy: You have verified proficiency in ${topMatchedNames}.`);
    } else {
      whyItMatches.push(`Foundational interest alignment: Your educational background provides an accessible stepping stone.`);
    }

    if (streamMatched) {
      whyItMatches.push(`Your stream (${skillProfile.stream || 'Current'}) directly satisfies entry prerequisites.`);
    } else if (career.eligible_streams?.includes('12th Arts') && career.eligible_streams?.includes('12th Science (PCM)')) {
      whyItMatches.push(`Open eligibility across all education streams with accessible entry criteria.`);
    }

    if (career.category === 'govt') {
      whyItMatches.push(`Provides long-term job security, pension benefits, and official career status.`);
    } else if (career.future_demand?.toLowerCase().includes('high')) {
      whyItMatches.push(`High future growth outlook (${career.future_demand}) with rapid market demand.`);
    }

    return {
      id: career.id,
      title: career.title,
      title_hi: career.title_hi,
      category: career.category,
      matchPercentage,
      salary_range: career.salary_range,
      difficulty: career.difficulty,
      summary: career.summary,
      summary_hi: career.summary_hi,
      education_path: career.education_path,
      matchingSkills,
      missingSkills,
      whyItMatches,
      freeResources: career.free_resources || []
    };
  });

  // Sort descending by match percentage and return top 5
  return scoredCareers.sort((a, b) => b.matchPercentage - a.matchPercentage).slice(0, 5);
}

/**
 * Match user's Skill Profile against Government Job Examinations
 */
export function matchGovtExams(skillProfile) {
  if (!skillProfile) return [];

  const edu = (skillProfile.educationLevel || '').toLowerCase();
  const stream = (skillProfile.stream || '').toLowerCase();
  const skills = (skillProfile.skills || []).map(s => (typeof s === 'string' ? s : s.name).toLowerCase());

  const hasMath = skills.some(s => s.includes('math') || s.includes('problem')) || stream.includes('pcm');
  const hasTypingOrComputer = skills.some(s => s.includes('computer') || s.includes('excel') || s.includes('tally') || s.includes('typing'));

  return govtExamsData.map(exam => {
    const qual = exam.eligibility?.qualification || '';
    const qualLower = qual.toLowerCase();

    let isDirectlyEligible = false;
    let isClose = false;
    let eligibilityNote = '';
    let matchScore = 70;

    // Check graduation vs 12th vs 10th
    const isGraduate = edu.includes('graduate') || edu.includes('degree') || edu.includes('post graduate') || edu.includes('b.tech') || edu.includes('bca') || edu.includes('ba') || edu.includes('b.com');
    const is12th = edu.includes('12th') || edu.includes('intermediate') || isGraduate;
    const is10th = edu.includes('10th') || edu.includes('matric') || is12th;
    const isDiploma = edu.includes('diploma') || edu.includes('polytechnic') || edu.includes('iti');

    if (exam.id === 'rrb-ntpc') {
      if (is12th) {
        isDirectlyEligible = true;
        eligibilityNote = 'Immediately eligible for Level 2 & 3 posts (Junior Clerk cum Typist, Accounts Clerk, Trains Clerk).';
        matchScore = 95;
      } else {
        isClose = true;
        eligibilityNote = 'Requires 12th pass for undergraduate posts. Once 12th is completed, immediate eligibility.';
        matchScore = 75;
      }
    } else if (exam.id === 'state-police') {
      if (is12th) {
        isDirectlyEligible = true;
        eligibilityNote = isGraduate
          ? 'Eligible for both Sub-Inspector (SI) and Police Constable posts.'
          : 'Directly eligible for Police Constable posts (12th Pass requirement). For SI, graduation is required.';
        matchScore = isGraduate ? 94 : 88;
      } else {
        isClose = true;
        eligibilityNote = 'Constable posts require 12th pass. Clear 12th to sit for police recruitment.';
        matchScore = 72;
      }
    } else if (exam.id === 'nda-cds') {
      if (is12th && !isGraduate) {
        isDirectlyEligible = true;
        eligibilityNote = stream.includes('pcm')
          ? 'Directly eligible for NDA Army, Air Force, and Navy wings (12th PCM).'
          : 'Directly eligible for NDA Army Wing (Any stream accepted).';
        matchScore = 92;
      } else if (isGraduate) {
        isDirectlyEligible = true;
        eligibilityNote = 'Directly eligible for CDS (Combined Defence Services) for Army, Navy, Air Force officer training.';
        matchScore = 90;
      } else {
        isClose = true;
        eligibilityNote = 'Prepare foundations now. 12th pass required for NDA application (Age limit 16.5-19.5 yrs).';
        matchScore = 74;
      }
    } else if (exam.id === 'ctet-tet') {
      if (isGraduate || edu.includes('diploma')) {
        isClose = true;
        eligibilityNote = 'Requires professional teaching qualification (B.Ed or D.El.Ed). Your degree qualifies you for B.Ed admission.';
        matchScore = 78;
      } else {
        isClose = true;
        eligibilityNote = 'Paper 1 (PRT) accepts 12th + 2-year D.El.Ed. Enroll in D.El.Ed after 12th to qualify.';
        matchScore = 70;
      }
    } else {
      // Exams requiring graduation (UPSC, SSC CGL, IBPS PO, SBI PO, State PSC)
      if (isGraduate) {
        isDirectlyEligible = true;
        eligibilityNote = 'Directly eligible: You hold a recognized graduation qualification.';
        matchScore = 92;
      } else {
        isClose = true;
        eligibilityNote = 'Requires graduation degree in any stream. You can pursue regular or low-cost distance degree while preparing.';
        matchScore = 76;
      }
    }

    if (hasMath) matchScore += 3;
    if (hasTypingOrComputer && (exam.id === 'rrb-ntpc' || exam.id === 'ssc-cgl')) matchScore += 3;

    return {
      id: exam.id,
      name: exam.name,
      short_name: exam.short_name,
      organizer: exam.organizer,
      frequency: exam.frequency,
      target_roles: exam.target_roles || [],
      qualificationRequired: qual,
      isDirectlyEligible,
      isClose,
      statusLabel: isDirectlyEligible ? 'Directly Eligible' : 'Pathway Ready (Close to Qualifying)',
      statusColor: isDirectlyEligible ? 'emerald' : 'amber',
      eligibilityNote,
      matchScore: Math.min(99, matchScore),
      syllabusOverview: exam.overview
    };
  }).sort((a, b) => b.matchScore - a.matchScore);
}

/**
 * Determine Missing Skills & Curated Free Learning Resources
 */
export function getMissingSkillsAndResources(skillProfile, topCareers = []) {
  const userSkills = (skillProfile.skills || []).map(s => typeof s === 'string' ? s : s.name);

  // If no careers passed, get top careers
  const careers = topCareers.length > 0 ? topCareers : matchCareers(skillProfile);
  const missingMap = new Map();

  careers.forEach(career => {
    const careerSkillsDef = skillsData.careers.find(c => c.id === career.id);
    const needed = careerSkillsDef ? careerSkillsDef.skills : (career.missingSkills || []).map(s => ({ name: s, requiredLevel: 80 }));

    needed.forEach(skillObj => {
      const skillName = typeof skillObj === 'string' ? skillObj : skillObj.name;
      const alreadyHas = userSkills.some(u => skillMatches(u, skillName));

      if (!alreadyHas && !missingMap.has(skillName)) {
        // Find recommendations from skillsData
        const courses = careerSkillsDef?.courseRecommendations || [];
        const matchedCourses = courses.filter(c => 
          c.title.toLowerCase().includes(skillName.toLowerCase()) ||
          c.platform.toLowerCase().includes('nptel') ||
          c.platform.toLowerCase().includes('swayam') ||
          c.platform.toLowerCase().includes('skill india')
        );

        missingMap.set(skillName, {
          skillName,
          category: skillObj.category || 'Core Skill',
          requiredLevel: skillObj.requiredLevel || 80,
          relevantCareer: career.title,
          courses: matchedCourses.length > 0 ? matchedCourses : [
            {
              title: `${skillName} Complete Beginner to Advanced Masterclass`,
              platform: 'SWAYAM / NPTEL Free Portal',
              url: 'https://swayam.gov.in',
              duration: '4-8 Weeks',
              free: true
            },
            {
              title: `${skillName} Hands-On Industry Course in Hindi`,
              platform: 'Skill India Digital & YouTube',
              url: 'https://skillindiadigital.gov.in',
              duration: 'Self-paced',
              free: true
            }
          ]
        });
      }
    });
  });

  return Array.from(missingMap.values()).slice(0, 6);
}
