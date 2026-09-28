# 🧭 CareerPath AI (करियरपाथ AI)
> **Theme:** AI-Powered Career Readiness & Employability Platform  
> **Tagline:** *"Apna sahi career chuno, AI ke saath"*  
> **Built for:** Hackathon Prototype – Dedicated to Indian students after 10th & 12th, particularly from rural and first-generation backgrounds.

---

## 🌟 Executive Summary & Problem Solved
Indian high school students—especially from tier-2/tier-3 cities, rural areas, and first-generation learner families—often lack access to expensive career counselors, causing them to fall into default choices or high-risk traps.

**CareerPath AI** bridges this gap by unifying:
1. **Interactive Career Discovery:** 12-question weighted psychometric quiz mapping students to 15+ modern and traditional careers.
2. **Government Exam Blueprints:** UPSC CSE, SSC CGL/CHSL, Railways, Banking (IBPS/SBI), Defence (NDA/CDS), CTET, State PSCs with category age relaxations and 6-month timelines.
3. **Parent View Toggle:** Reassures parents by filtering choices based on Course Fees, Physical Safety, Job Security score (1-10), and Return on Investment (ROI).
4. **Actionable Roadmap Generator:** Generates a personalized month-by-month study blueprint with free curated resources (NPTEL, SWAYAM, Skill India, YouTube) and PDF download.
5. **Skill Gap Radar Analyzer:** Live Recharts radar diagram highlighting student competencies versus industry needs.
6. **Fresher AI Resume Builder:** 2 templates with AI bullet point enhancer.
7. **Scholarships & Zero-Collateral Loans:** Directory of NSP schemes, Pragati for girls, Bihar Student Credit Card, and Vidya Lakshmi education loans.
8. **Bilingual & Accessible:** Full English and Hindi toggle, dark/light theme, and daily study gamification (XP, streaks, badges).

---

## 🚀 Live Demo & How to Run

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation & Launch
```bash
# 1. Clone or navigate to the workspace
cd "c:\Users\Lenovo\Downloads\CAREER - AI"

# 2. Install dependencies (handles system root CA certificates smoothly)
$env:NODE_OPTIONS="--use-system-ca"
npm install

# 3. Start development server
npm run dev
```

App will be available at:
👉 **`http://localhost:3000`**

### Production Build
```bash
$env:NODE_OPTIONS="--use-system-ca"
npm run build
```

---

## 🤖 How to Plug in a Real LLM (Gemini / Claude)

The AI architecture is cleanly encapsulated in a single file:  
📁 [`src/services/aiService.js`](file:///c:/Users/Lenovo/Downloads/CAREER%20-%20AI/src/services/aiService.js)

By default, CareerPath AI uses an offline smart intent engine that matches keywords, Hindi questions, and student quiz context with zero latency and zero API cost.

### To Enable Google Gemini 1.5 Flash:
1. Create a `.env` file in the project root:
   ```env
   VITE_GEMINI_API_KEY=your_google_gemini_api_key_here
   ```
2. Restart the Vite dev server (`npm run dev`).
3. `aiService.js` automatically detects `VITE_GEMINI_API_KEY` and routes requests through `gemini-1.5-flash` with the student's profile context passed into the system prompt!

---

## 📱 Pages & Features Overview

| Page / Feature | Key Functionality |
|---|---|
| **1. Home** | Hero section with "Apna Sahi Career Chuno", 3 CTAs, animated stat counters, 3-step guide, feature grid, testimonials, and footer. |
| **2. Career Quiz** | 12 interactive questions, progress bar, weighted scoring engine mapping to 15+ careers, top 3 matches with % fit, reasons, skills, and salaries. |
| **3. Career Explorer** | Tabs for 10th, 12th PCM, 12th PCB, Commerce, Arts, ITI, Polytechnic, Agniveer; search, difficulty filter, and side-by-side comparison modal. |
| **4. Govt Jobs Hub** | 10 major exams (UPSC, SSC, RRB, Banking, Police, CTET) with 8-tab detail view: Overview, Eligibility (Age relaxation for SC/ST/OBC/Women), Pattern, Syllabus, Roadmap Timeline, Perks, Free Resources, FAQs, and Compare Exams. |
| **5. Trending & Vacancy Dashboard** | Interactive Recharts (vacancies by department bar chart, exam popularity pie chart, 5-year trend line chart), latest notification list with "Set Reminder" toggle. |
| **6. Roadmap Generator** | Form parameters (stream, target exam, budget, study hours) producing a 6-month weekly action plan, tickable milestones checklist, and PDF export. |
| **7. Skill Gap Analyzer** | Select career and toggle current skills to generate an interactive Recharts Radar chart, priority gaps, and recommended free courses (NPTEL, SWAYAM). |
| **8. AI Counselor Chatbot** | Floating widget on all pages, bilingual (Hindi/English/Hinglish), quick reply chips, context awareness of user's quiz result. |
| **9. AI Resume Builder** | Personal info, education, skills, proof-of-work projects, AI bullet point enhancer, 2 templates (Modern Tech & Classic Executive), and clean PDF print. |
| **10. Scholarships & Loans** | Directory of 8+ major schemes with income caps, deadlines, documents needed, and guidance on ₹7.5 Lakh collateral-free loans. |
| **11. Exam Calendar & Habits** | Upcoming exam countdowns, XP system, level progression, badges unlocked, and daily study checklist. |
| **12. Parent View** | Global toggle that simplifies metrics into Course Fees, Physical Safety, Job Security (1-10), and ROI timeline. |
| **13. Future Scope** | Roadmap showcasing 1-on-1 mentor connect, AI video mock interviews, voice input via Bhashini, 8 regional languages, WhatsApp bot, and offline PWA mode. |

---

## 🎨 Design System
- **Primary Color:** Deep Blue (`#1d3557` / `#0e86d4`)
- **Accent Color:** Teal Green (`#14b8a6` / `#0d9488`)
- **Action/CTA Color:** Warm Orange (`#f97316` / `#ea580c`)
- **Typography:** Inter (Latin) + Noto Sans Devanagari (Hindi)
- **Visuals:** Rounded-3xl containers, soft shadows, dark mode support.

---

## 🛡️ Hackathon Disclaimer
> *Note: Sample data for demo. Verify details on official government websites (upsc.gov.in, ssc.gov.in, scholarships.gov.in).*
