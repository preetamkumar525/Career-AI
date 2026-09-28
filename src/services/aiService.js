/**
 * CareerPath AI - Unified AI Service Layer
 * 
 * DESIGN:
 * - Pure client-side mock intelligence by default (100% offline & fast for demos).
 * - Real LLM Plug-and-Play: Set VITE_GEMINI_API_KEY in your .env file to automatically
 *   switch to Google Gemini 1.5 Flash API!
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

/**
 * Call real Google Gemini API if key is present, otherwise fallback to local smart mock
 */
async function callGeminiIfAvailable(systemPrompt, userPrompt) {
  if (!GEMINI_API_KEY) return null;
  try {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          { role: 'user', parts: [{ text: `${systemPrompt}\n\nUser Question: ${userPrompt}` }] }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
        }
      })
    });
    const data = await response.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
  } catch (err) {
    console.warn('Real Gemini API call failed or timed out, falling back to smart local engine:', err);
    return null;
  }
}

/**
 * AI Counselor Chatbot Engine
 * Supports Hindi, English & Hinglish intent parsing with student profile context
 */
export async function askCounselor(query, history = [], quizContext = null, language = 'en') {
  // Check if real LLM is plugged in
  const systemPrompt = `You are CareerPath AI's friendly Indian Career Counselor. 
  You specialize in guiding rural, semi-urban, and first-generation 10th and 12th students.
  Answer warmly in Hindi or English (matching the user's tone/language).
  Current Student Context: ${quizContext ? JSON.stringify(quizContext) : 'Not taken quiz yet'}.`;
  
  const realLLMResponse = await callGeminiIfAvailable(systemPrompt, query);
  if (realLLMResponse) return realLLMResponse;

  // Simulate network latency for realistic chat feel
  await new Promise(r => setTimeout(r, 600));

  const q = query.toLowerCase().trim();

  // 1. Contextual Quiz Inquiry
  if (q.includes('quiz') || q.includes('test') || q.includes('mera result') || q.includes('my result')) {
    if (quizContext && quizContext.topCareers && quizContext.topCareers.length > 0) {
      const top = quizContext.topCareers[0];
      return language === 'hi'
        ? `आपके करियर क्विज़ के आधार पर, आपका सबसे बेहतर मैच **${top.title_hi || top.title}** (${top.matchScore}% मैच) है! इसके लिए आपको ${top.skills_needed?.slice(0, 3).join(', ')} जैसी स्किल्स पर ध्यान देना चाहिए। क्या आप इसका स्टेप-बाय-स्टेप रोडमैप देखना चाहते हैं?`
        : `Based on your Career Quiz, your #1 recommended path is **${top.title}** (${top.matchScore}% Match)! Key strengths needed: ${top.skills_needed?.slice(0, 3).join(', ')}. Would you like me to generate a personalized month-wise study roadmap for this?`;
    } else {
      return language === 'hi'
        ? `आपने अभी तक हमारा 12 सवालों वाला करियर क्विज़ नहीं दिया है। सिर्फ 3 मिनट में अपनी ताकत और पसंदीदा सेक्टर जानने के लिए नेवबार से **'Take Quiz'** पर क्लिक करें!`
        : `You haven't completed the 12-question Career Quiz yet! Take our quick 3-minute quiz from the top menu to discover your top 3 personalized career matches.`;
    }
  }

  // 2. 12th Pass Guidance
  if (q.includes('12th') || q.includes('barahvi') || q.includes('after 12')) {
    if (q.includes('arts') || q.includes('humanities')) {
      return language === 'hi'
        ? `12वीं आर्ट्स के बाद कई शानदार विकल्प हैं:\n1. **UPSC / सिविल सेवा**: BA के 3 साल के साथ फ्री NCERT तैयारी करें।\n2. **लॉ (CLAT)**: 5-साल का BA LLB करके कॉर्पोरेट वकील या जज बनें।\n3. **सरकारी शिक्षक**: BA + B.Ed / D.El.Ed करके CTET दें।\n4. **UI/UX डिज़ाइन या डिजिटल मार्केटिंग**: बिना किसी महंगी डिग्री के 6 महीने में स्किल सीखकर जॉब पाएं।`
        : `Top options after 12th Arts:\n1. **Civil Services (IAS/IPS)**: Pursue BA and build core NCERT foundations.\n2. **Law (CLAT)**: 5-year integrated BA LLB for corporate law or judicial services.\n3. **Govt Teaching**: BA + B.Ed/D.El.Ed to qualify CTET/TET.\n4. **UI/UX Design or Digital Marketing**: High-demand tech skills requiring no coding degree!`;
    }
    if (q.includes('science') || q.includes('pcm') || q.includes('pcb')) {
      return language === 'hi'
        ? `12वीं साइंस के बाद:\n• **PCM वाले**: JEE Main से B.Tech, NDA (सेना में सीधा ऑफिसर), कमर्शियल पायलट, या ITI/पॉलिटेक्निक डिप्लोमा।\n• **PCB वाले**: NEET से MBBS/BAMS, B.Sc नर्सिंग (विदेश में 100% जॉब गारंटी), या B.Sc एग्रीकल्चर (सरकारी कृषि अधिकारी)।`
        : `Options after 12th Science:\n• **PCM Stream**: B.Tech CSE/AI, NDA (Commissioned Defence Officer directly after 12th), or IIT Madras Online BS in Data Science.\n• **PCB Stream**: NEET (MBBS/BAMS), B.Sc Nursing (massive global demand in Germany & UK), or B.Sc Agriculture (Govt Banking/AFO jobs).`;
    }
    return language === 'hi'
      ? `12वीं के बाद सही राह चुनने के लिए 3 चीजें देखें:\n1. **सरकारी नौकरी या प्राइवेट?**\n2. **बजट कितना है?** (अगर कम बजट है तो IIT Madras Online BS या सरकारी कॉलेज + स्कॉलरशिप चुनें)\n3. **जल्द कमाई चाहिए या लंबी पढ़ाई?**\nअपनी स्ट्रीम (Science/Commerce/Arts) बताएं, मैं सटीक कॉलेज और रोडमैप बता दूंगा!`
      : `To pick the right path after 12th, consider:\n1. **Govt vs Corporate preference**\n2. **Family budget & timelines** (Look into Post-Matric scholarships & PM-USP if budget is tight)\n3. **Immediate earning vs 4-5 year degree**\nTell me your stream (Science, Commerce, or Arts) for specific options!`;
  }

  // 3. 10th Pass Guidance
  if (q.includes('10th') || q.includes('dasvi') || q.includes('after 10')) {
    return language === 'hi'
      ? `10वीं के बाद आपके पास 3 मुख्य रास्ते हैं:\n1. **11वीं-12वीं (Science/Commerce/Arts)**: अगर आप ग्रेजुएशन या बड़ी प्रतियोगी परीक्षाएं देना चाहते हैं।\n2. **पॉलिटेक्निक डिप्लोमा (3 साल)**: 10वीं के बाद जूनियर इंजीनियर (JE) बनने का सबसे सस्ता व पक्का रास्ता। बाद में सीधे B.Tech 2nd year में एडमिशन मिल सकता है।\n3. **ITI (1-2 साल)**: इलेक्ट्रीशियन, फिटर या वेल्डर ट्रेड सीखकर रेलवे लोको पायलट या बिजली विभाग में सीधी भर्ती पाएं।`
      : `Top 3 pathways after Class 10:\n1. **Standard 11th-12th**: Choose Science, Commerce, or Arts based on your long-term goals.\n2. **Polytechnic Diploma (3 years)**: Fastest technical route to becoming a Junior Engineer with lateral entry to B.Tech 2nd year.\n3. **ITI Skilled Trades (1-2 years)**: Electrician, Fitter, or Welder for direct PSU and Railway Technician vacancies.`;
  }

  // 4. SSC CGL / Government Exams
  if (q.includes('ssc') || q.includes('cgl') || q.includes('chsl')) {
    return language === 'hi'
      ? `**SSC CGL की पूरी रणनीति:**\n• **योग्यता**: किसी भी विषय में ग्रेजुएशन (उम्र 18-30 वर्ष)।\n• **सैलरी**: ₹65,000 - ₹82,000 / महीना (इनकम टैक्स इंस्पेक्टर, GST इंस्पेक्टर, ASO)।\n• **सिलेबस**: 4 विषय - मैथ्स (अंकगणित + एडवांस), रीजनिंग, इंग्लिश और सामान्य ज्ञान (GK)।\n• **सुझाव**: इंटरव्यू खत्म हो चुका है! केवल कंप्यूटर टेस्ट (Tier-2) के नंबरों पर मेरिट बनती है। पिछले 5 साल के TCS पेपर्स रोज़ लगाएं।`
      : `**SSC CGL Complete Strategy:**\n• **Eligibility**: Any Graduate (18-30 yrs, relaxations for OBC/SC/ST).\n• **Salary**: ₹65,000 - ₹82,000/month (Income Tax Inspector, GST Inspector, ASO).\n• **Pattern**: Tier-1 (Qualifying) + Tier-2 (Final Merit on 390 marks) + Computer & Typing test.\n• **Pro Tip**: No interview! Focus heavily on TCS previous year questions (PYQs) and daily 15-min typing practice.`;
  }

  // 5. UPSC / Civil Services
  if (q.includes('upsc') || q.includes('ias') || q.includes('ips') || q.includes('collector')) {
    return language === 'hi'
      ? `**IAS/IPS बनने की सटीक शुरुआत:**\n1. **कक्षा 6 से 12 की NCERT किताबें**: इतिहास, भूगोल, राजनीति (Polity) और अर्थशास्त्र को 2 बार ध्यान से पढ़ें।\n2. **दैनिक अख़बार**: PIB और संसद टीवी (Sansad TV) के डिबेट्स सुनें।\n3. **ग्रेजुएशन**: आप किसी भी सस्ते सरकारी कॉलेज से BA/B.Sc करते हुए 3 साल लगातार तैयारी कर सकते हैं।\n4. **कोचिंग ज़रूरी नहीं**: सही किताबों और इंटरनेट से हज़ारों ग्रामीण छात्र हर साल टॉप रैंक लाते हैं।`
      : `**Blueprint for UPSC IAS / IPS:**\n1. **NCERT Foundation**: Read Class 6-12 NCERTs for History, Geography, Polity, and Economics.\n2. **Daily Routine**: Read Indian Express/The Hindu and track PIB summaries.\n3. **Degree Choice**: Pursue a 3-year standard degree with manageable workload so you can devote 4-6 hours daily to preparation.\n4. **No expensive coaching needed**: All syllabus, PYQs, and topper answer copies are available 100% free online.`;
  }

  // 6. Low budget / Family financial problems
  if (q.includes('paisa') || q.includes('budget') || q.includes('garib') || q.includes('poor') || q.includes('low cost') || q.includes('fees') || q.includes('kharcha')) {
    return language === 'hi'
      ? `बिल्कुल चिंता न करें! आपके लिए बेहतरीन सरकारी योजनाएं और कम खर्च वाले रास्ते उपलब्ध हैं:\n1. **नेशनल स्कॉलरशिप पोर्टल (NSP)**: पोस्ट-मैट्रिक स्कॉलरशिप से पूरी ट्यूशन फीस माफ और ₹12,000 वार्षिक भत्ता मिलता है।\n2. **बिहार स्टूडेंट क्रेडिट कार्ड / विद्या लक्ष्मी**: ₹4 लाख से ₹7.5 लाख तक बिना किसी गिरवी (Zero Collateral) के शिक्षा ऋण।\n3. **सरकारी ITI / पॉलिटेक्निक**: फीस मात्र ₹8,000 - ₹12,000 प्रति वर्ष होती है जो स्कॉलरशिप से पूरी वापस आ जाती है।\n4. **फ्री ऑनलाइन कोर्सेस**: NPTEL, SWAYAM और Bharat Skills पर भारत सरकार के मुफ्त सर्टिफिकेट्स लें।`
      : `Financial constraints should never stop your ambition! Here are verified low-cost and funded avenues:\n1. **National Scholarship Portal (NSP)**: Post-Matric and PM-USP schemes provide 100% fee waiver plus living stipends.\n2. **Vidya Lakshmi Portal**: Up to ₹7.5 Lakh collateral-free education loans backed by the Central Government.\n3. **Govt ITI & Polytechnic**: Annual fee under ₹10,000, usually fully reimbursed via state scholarships.\n4. **Govt-funded Free Tech Certifications**: SWAYAM, NPTEL, and Skill India Digital provide free degrees & certificates.`;
  }

  // 7. Coding / Software / AI
  if (q.includes('coding') || q.includes('software') || q.includes('python') || q.includes('ai') || q.includes('computer')) {
    return language === 'hi'
      ? `सॉफ्टवेयर और AI में जाने के लिए आपको किसी महंगे प्राइवेट कॉलेज की ज़रूरत नहीं है!\n• **कहाँ से शुरू करें**: Python भाषा से शुरुआत करें। Harvard का 'CS50' या यूट्यूब पर 'CodeWithHarry' 100% फ्री है।\n• **डिग्री का सस्ता विकल्प**: IIT मद्रास का 'Online BS in Data Science' घर बैठे केवल 12वीं पास करके किया जा सकता है (JEE की ज़रूरत नहीं)।\n• **पोर्टफोलियो बनाएं**: GitHub पर अपने 3-4 प्रोजेक्ट्स बनाएं। टेक कंपनियां डिग्री से ज़्यादा आपका कोड देखती हैं!`
      : `Software & AI Career Roadmap:\n• **Start with Python**: Free resources like Harvard's CS50 or freeCodeCamp.\n• **Low-Cost Degree Hack**: IIT Madras Online BS in Data Science can be pursued from home without clearing JEE!\n• **Focus on Proof-of-Work**: Build 3-4 GitHub projects and showcase live web apps. Modern tech firms hire for skills over college pedigree.`;
  }

  // Default Fallback
  return language === 'hi'
    ? `यह एक बहुत अच्छा सवाल है! करियर का सही चुनाव आपकी रुचि, बजट और समयसीमा पर निर्भर करता है।\n\nआप मुझसे किसी भी विषय पर पूछ सकते हैं: जैसे **'12वीं के बाद क्या करें'**, **'SSC CGL की तैयारी'**, **'बिना पैसे के इंजीनियरिंग'**, या **'सरकारी स्कॉलरशिप'**।\n\nयदि आपने अभी तक क्विज़ नहीं दिया है, तो 'Take Career Quiz' से शुरुआत करें!`
    : `That's a thoughtful question! Career clarity begins with mapping your personal strengths, financial timeline, and risk appetite.\n\nYou can ask me specific questions like: **"Options after 12th PCM"**, **"How to prepare for SSC CGL"**, **"Low-budget engineering degrees"**, or **"Government scholarships"**.\n\nBe sure to take our 12-question Career Quiz for personalized data-backed recommendations!`;
}

/**
 * Generate a Month-by-Month Structured Roadmap
 */
export function generateRoadmap(formData) {
  const { currentClass, stream, targetCareer, budget, studyHours, state } = formData;

  const totalMonths = 6;
  const plan = [];

  const monthFocusAreas = [
    {
      month: 1,
      title: "Foundations & Diagnostic Assessment",
      title_hi: "नींव की तैयारी एवं प्रारंभिक मूल्यांकन",
      weeklyGoals: [
        "Review official syllabus line-by-line and print exam blueprint",
        "Collect previous 5 years question papers (PYQs)",
        "Establish baseline diagnostic test score",
        "Set daily routine of " + (studyHours || 4) + " focused hours"
      ],
      skills: ["Core Concepts", "Time Management", "Daily Reading Routine"],
      freeResources: ["NCERT Textbooks (Free PDF on ePathshala)", "Previous Year Question Bank"]
    },
    {
      month: 2,
      title: "Core Subject Deep Dive - Part 1",
      title_hi: "मूल विषयों का गहन अध्ययन - भाग 1",
      weeklyGoals: [
        "Complete 50% of the foundational syllabus modules",
        "Create concise one-page formula / rule summaries",
        "Attempt chapter-end objective quizzes",
        "Clear doubts via SWAYAM / NPTEL video archives"
      ],
      skills: ["Conceptual Clarity", "Short Note Taking", "Formula Memorization"],
      freeResources: ["SWAYAM Video Lectures", "Khan Academy India"]
    },
    {
      month: 3,
      title: "Core Subject Deep Dive - Part 2",
      title_hi: "मूल विषयों का गहन अध्ययन - भाग 2",
      weeklyGoals: [
        "Finish remaining 50% theoretical curriculum",
        "Begin timed sectional quizzes (20 mins per topic)",
        "Target 80%+ accuracy before moving to speed drills",
        "Review mistake log weekly"
      ],
      skills: ["Speed Calculation", "Error Log Maintenance", "Analytical Problem Solving"],
      freeResources: ["Bharat Skills / Skill India Digital", "National Digital Library of India"]
    },
    {
      month: 4,
      title: "Speed, Accuracy & Sectional Drills",
      title_hi: "गति, सटीकता एवं सेक्शनल टेस्ट अभ्यास",
      weeklyGoals: [
        "Take 2 sectional tests every alternate day",
        "Reduce time per question by 25%",
        "Eliminate recurring silly errors",
        "Revise high-weightage chapters twice"
      ],
      skills: ["Speed Aptitude", "Negative Marking Avoidance", "Stress Management"],
      freeResources: ["Free Mock Test Series on Govt Portals", "YouTube Problem Solving Sets"]
    },
    {
      month: 5,
      title: "Full-Length Mock Test Simulation",
      title_hi: "फुल-लेंथ मॉक टेस्ट एवं वास्तविक परीक्षा माहौल",
      weeklyGoals: [
        "Solve 3 full-length exams per week under exact exam timings",
        "Analyze weak topics and revise target notes",
        "Build stamina for sitting 2-3 hours continuously",
        "Check eligibility for State & Central scholarships"
      ],
      skills: ["Exam Day Strategy", "Question Selection & Skipping", "Stamina"],
      freeResources: ["Official Model Papers", "Testbook / Adda Free Mini Mocks"]
    },
    {
      month: 6,
      title: "Final Revision, High-Yield Formulas & Exam Readiness",
      title_hi: "अंतिम पुनरावृत्ति, फॉर्मूला रिवीजन एवं अंतिम तैयारी",
      weeklyGoals: [
        "Revise all short notes and formula flashcards 3 times",
        "Sleep 7-8 hours and maintain physical fitness",
        "Double check admit card and document requirements",
        "Enter exam hall with peak confidence"
      ],
      skills: ["Peak Mental Focus", "Revision Discipline", "Confidence"],
      freeResources: ["Quick Formula Cheat Sheets", "Mindfulness and Breathing Exercises"]
    }
  ];

  return {
    careerTarget: targetCareer || "Selected Career Path",
    profile: { currentClass, stream, budget, studyHours, state },
    generatedAt: new Date().toLocaleDateString('en-IN'),
    phases: monthFocusAreas,
    checklist: [
      { id: 'c1', text: "Download official syllabus copy and paste on study desk", done: false },
      { id: 'c2', text: "Read Class 9 to 12 fundamental NCERTs or Trade books", done: false },
      { id: 'c3', text: "Solve minimum 10 previous year papers under timer", done: false },
      { id: 'c4', text: "Apply for relevant state / national scholarships on NSP portal", done: false },
      { id: 'c5', text: "Complete 1 free certification from NPTEL / Skill India", done: false },
      { id: 'c6', text: "Prepare 1-page resume / portfolio of projects or achievements", done: false }
    ]
  };
}

/**
 * AI Resume Bullet Improver
 * Upgrades simple student sentences into impactful, metric-oriented bullet points
 */
export async function improveResumeBullet(rawText, role = 'Fresher') {
  await new Promise(r => setTimeout(r, 400));
  
  if (!rawText || rawText.trim().length === 0) {
    return [
      "Led end-to-end task execution, collaborating with team members to deliver milestones ahead of deadline.",
      "Identified process bottlenecks and streamlined workflow, improving operational efficiency by 20%.",
      "Actively applied core domain principles to build practical projects showcased during academic evaluation."
    ];
  }

  const clean = rawText.trim();

  return [
    `Spearheaded ${clean}, streamlining execution and delivering measurable outcomes 15% ahead of scheduled timeline.`,
    `Demonstrated hands-on technical proficiency by executing ${clean}, adhering to industry best practices and quality standards.`,
    `Collaborated with cross-functional peers to implement ${clean}, improving team productivity and project documentation.`
  ];
}
