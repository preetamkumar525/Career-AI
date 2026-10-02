import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { ParentViewProvider } from './context/ParentViewContext';
import { QuizProvider } from './context/QuizContext';
import { GamificationProvider } from './context/GamificationContext';
import { SkillProfileProvider } from './context/SkillProfileContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ParentViewBanner from './components/ParentViewBanner';
import AICounselorChat from './components/AICounselorChat';

import Home from './pages/Home';
import CareerQuiz from './pages/CareerQuiz';
import CareerExplorer from './pages/CareerExplorer';
import GovtJobsHub from './pages/GovtJobsHub';
import TrendingDashboard from './pages/TrendingDashboard';
import SkillScanner from './pages/SkillScanner';
import RoadmapGenerator from './pages/RoadmapGenerator';
import SkillGapAnalyzer from './pages/SkillGapAnalyzer';
import ResumeBuilder from './pages/ResumeBuilder';
import ScholarshipsLoans from './pages/ScholarshipsLoans';
import ExamCalendarTracker from './pages/ExamCalendarTracker';
import FutureScope from './pages/FutureScope';

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <ParentViewProvider>
          <QuizProvider>
            <GamificationProvider>
              <SkillProfileProvider>
                <Router>
                  <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans selection:bg-brand-500 selection:text-white transition-colors duration-200">
                    {/* Sticky Navbar */}
                    <Navbar />

                    {/* Persistent Parent View Reassurance Banner if active */}
                    <ParentViewBanner />

                    {/* Main Page Route Views */}
                    <main className="flex-1">
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/quiz" element={<CareerQuiz />} />
                        <Route path="/explore" element={<CareerExplorer />} />
                        <Route path="/govt-jobs" element={<GovtJobsHub />} />
                        <Route path="/trending" element={<TrendingDashboard />} />
                        <Route path="/skill-scanner" element={<SkillScanner />} />
                        <Route path="/roadmap" element={<RoadmapGenerator />} />
                        <Route path="/skill-gap" element={<SkillGapAnalyzer />} />
                        <Route path="/resume" element={<ResumeBuilder />} />
                        <Route path="/scholarships" element={<ScholarshipsLoans />} />
                        <Route path="/calendar" element={<ExamCalendarTracker />} />
                        <Route path="/future" element={<FutureScope />} />
                      </Routes>
                    </main>

                    {/* Floating AI Counselor on every page */}
                    <AICounselorChat />

                    {/* Universal Footer */}
                    <Footer />
                  </div>
                </Router>
              </SkillProfileProvider>
            </GamificationProvider>
          </QuizProvider>
        </ParentViewProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
