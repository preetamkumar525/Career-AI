import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useParentView } from '../context/ParentViewContext';
import { useGamification } from '../context/GamificationContext';
import {
  Compass,
  Sparkles,
  BookOpen,
  Landmark,
  TrendingUp,
  MapPin,
  Target,
  FileText,
  GraduationCap,
  Calendar,
  Flame,
  Sun,
  Moon,
  Users,
  Menu,
  X,
  Rocket,
  ScanLine
} from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { language, toggleLanguage, t } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const { isParentView, toggleParentView } = useParentView();
  const { streak, xp, level } = useGamification();

  const navLinks = [
    { to: '/', label: t('nav_home'), icon: Compass },
    { to: '/quiz', label: t('nav_quiz'), icon: Sparkles, highlight: true },
    { to: '/skill-scanner', label: t('nav_scanner') || 'Skill Scanner', icon: ScanLine, highlight: true },
    { to: '/explore', label: t('nav_explore'), icon: BookOpen },
    { to: '/govt-jobs', label: t('nav_govt'), icon: Landmark },
    { to: '/trending', label: t('nav_trending'), icon: TrendingUp },
    { to: '/roadmap', label: t('nav_roadmap'), icon: MapPin },
    { to: '/skill-gap', label: t('nav_skills'), icon: Target },
    { to: '/resume', label: t('nav_resume'), icon: FileText },
    { to: '/scholarships', label: t('nav_scholarships'), icon: GraduationCap },
    { to: '/calendar', label: t('nav_calendar'), icon: Calendar },
    { to: '/future', label: t('nav_future'), icon: Rocket }
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 via-brand-600 to-tealAccent-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Compass className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-brand-700 dark:text-brand-300">
                CareerPath <span className="text-tealAccent-600 dark:text-tealAccent-400">AI</span>
              </span>
              <span className="hidden sm:block text-[10px] uppercase font-bold tracking-widest text-slate-400 dark:text-slate-500">
                {language === 'hi' ? 'भविष्य की सही राह' : 'Navigating India\'s Youth'}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.slice(0, 7).map((item) => {
              const Icon = item.icon;
              const active = isActive(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    active
                      ? 'bg-brand-50 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-700'
                      : item.highlight
                      ? 'text-warmOrange-600 dark:text-warmOrange-400 hover:bg-warmOrange-50 dark:hover:bg-warmOrange-950/40'
                      : 'text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            
            {/* More dropdown or secondary links */}
            <div className="relative group">
              <button className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-brand-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <span>{language === 'hi' ? 'अन्य टूल्स' : 'More'}</span>
                <span className="text-[10px]">▼</span>
              </button>
              <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 hidden group-hover:block transition-all">
                {navLinks.slice(7).map((subItem) => {
                  const SubIcon = subItem.icon;
                  return (
                    <Link
                      key={subItem.to}
                      to={subItem.to}
                      className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-brand-50 dark:hover:bg-slate-700"
                    >
                      <SubIcon className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                      <span>{subItem.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </nav>

          {/* Action Buttons: Parent View, Lang, Dark Mode, Gamification */}
          <div className="flex items-center gap-2">
            {/* Streak & XP pill */}
            <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold">
              <span className="flex items-center text-warmOrange-500" title="Daily Streak">
                <Flame className="w-3.5 h-3.5 mr-0.5" />
                {streak}d
              </span>
              <span className="text-slate-300 dark:text-slate-600">|</span>
              <span className="text-brand-600 dark:text-brand-400" title={`Level ${level}`}>
                L{level} • {xp} XP
              </span>
            </div>

            {/* Parent View Toggle */}
            <button
              onClick={toggleParentView}
              title={isParentView ? "Switch back to Student Mode" : "Activate Parent View (simplified focus on costs, safety, job security)"}
              className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                isParentView
                  ? 'bg-amber-500 text-white border-amber-600 shadow-sm animate-pulse-subtle'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-amber-400'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {isParentView ? t('parent_view_active') : t('parent_view_btn')}
              </span>
            </button>

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              title="Toggle English / हिंदी"
              className="px-2.5 py-1.5 rounded-lg text-xs font-bold border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              {language === 'en' ? '🇮🇳 हिंदी' : '🇬🇧 EN'}
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              title="Toggle Dark Mode"
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 space-y-1 shadow-2xl">
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 text-xs font-bold">
              <span className="flex items-center text-warmOrange-500">
                <Flame className="w-4 h-4 mr-0.5" /> {streak} Day Streak
              </span>
              <span className="text-brand-600 dark:text-brand-400">
                Level {level} ({xp} XP)
              </span>
            </div>
            <button
              onClick={toggleParentView}
              className={`px-2 py-1 rounded text-xs font-bold ${
                isParentView ? 'bg-amber-500 text-white' : 'bg-slate-100 dark:bg-slate-800'
              }`}
            >
              {isParentView ? 'Parent ON' : 'Parent View'}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold ${
                    active
                      ? 'bg-brand-600 text-white'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
