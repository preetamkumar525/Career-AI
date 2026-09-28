import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Compass, Heart, ShieldAlert, PhoneCall, ExternalLink } from 'lucide-react';

export default function Footer() {
  const { language, t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-tealAccent-500 flex items-center justify-center text-slate-900 font-bold">
                <Compass className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl text-white">
                CareerPath <span className="text-tealAccent-400">AI</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {language === 'hi'
                ? 'भारत के 10वीं व 12वीं के विद्यार्थियों और अभिभावकों के लिए समर्पित निःशुल्क AI करियर मार्गदर्शक। हर युवा का अधिकार, सही दिशा और उज्ज्वल भविष्य।'
                : 'Empowering India\'s post-10th & 12th students with AI-driven career roadmaps, government exam blueprints, and free verified study material.'}
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-amber-300">
              <ShieldAlert className="w-4 h-4 shrink-0 text-amber-400" />
              <span>{t('demo_disclaimer')}</span>
            </div>
          </div>

          {/* Quick Pathways */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              {language === 'hi' ? 'करियर श्रेणियां' : 'Career Pathways'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/explore?tab=10th" className="hover:text-tealAccent-400 transition-colors">
                  {language === 'hi' ? '10वीं के बाद (ITI, डिप्लोमा)' : 'After 10th (ITI, Diploma)'}
                </Link>
              </li>
              <li>
                <Link to="/explore?tab=pcm" className="hover:text-tealAccent-400 transition-colors">
                  {language === 'hi' ? '12वीं साइंस (PCM/PCB)' : '12th Science (Engineering / Medical)'}
                </Link>
              </li>
              <li>
                <Link to="/explore?tab=commerce" className="hover:text-tealAccent-400 transition-colors">
                  {language === 'hi' ? '12वीं कॉमर्स (CA, बैंकिंग)' : '12th Commerce (CA, Banking)'}
                </Link>
              </li>
              <li>
                <Link to="/explore?tab=arts" className="hover:text-tealAccent-400 transition-colors">
                  {language === 'hi' ? '12वीं आर्ट्स (UPSC, लॉ, टीचिंग)' : '12th Arts (UPSC, Law, Teaching)'}
                </Link>
              </li>
              <li>
                <Link to="/govt-jobs" className="hover:text-tealAccent-400 transition-colors">
                  {language === 'hi' ? 'सरकारी नौकरियां (SSC, रेलवे, डिफेंस)' : 'Govt Jobs Hub (SSC, Railways, Defence)'}
                </Link>
              </li>
            </ul>
          </div>

          {/* AI Tools */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              {language === 'hi' ? 'स्मार्ट AI टूल्स' : 'Free AI Tools'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/quiz" className="hover:text-tealAccent-400 transition-colors">
                  {language === 'hi' ? '3-मिनट करियर क्विज़' : '3-Min Career Match Quiz'}
                </Link>
              </li>
              <li>
                <Link to="/roadmap" className="hover:text-tealAccent-400 transition-colors">
                  {language === 'hi' ? 'पर्सनलाइज़्ड रोडमैप जनरेटर' : 'Personalised Roadmap Generator'}
                </Link>
              </li>
              <li>
                <Link to="/skill-gap" className="hover:text-tealAccent-400 transition-colors">
                  {language === 'hi' ? 'स्किल गैप एनालाइज़र (रडार चार्ट)' : 'Skill Gap Radar Analyzer'}
                </Link>
              </li>
              <li>
                <Link to="/resume" className="hover:text-tealAccent-400 transition-colors">
                  {language === 'hi' ? 'AI रिज्यूमे बिल्डर (2 टेम्पलेट्स)' : 'AI Resume Builder & PDF'}
                </Link>
              </li>
              <li>
                <Link to="/scholarships" className="hover:text-tealAccent-400 transition-colors">
                  {language === 'hi' ? 'स्कॉलरशिप व लोन खोजक' : 'Scholarships & Zero-Collateral Loans'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Govt Helplines & Portals */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              {language === 'hi' ? 'सरकारी हेल्पलाइन एवं पोर्टल' : 'Official Portals & Support'}
            </h4>
            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                <div className="flex items-center gap-1.5 text-tealAccent-400 font-semibold mb-1">
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>National Career Service (NCS)</span>
                </div>
                <p className="text-slate-400">Toll-Free Helpline: <span className="text-white font-bold">1514</span></p>
                <p className="text-[11px] text-slate-500">Ministry of Labour & Employment</p>
              </div>

              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                <div className="flex items-center gap-1.5 text-tealAccent-400 font-semibold mb-1">
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>National Scholarship Portal</span>
                </div>
                <p className="text-slate-400">Helpline: <span className="text-white font-bold">0120 - 6619540</span></p>
                <p className="text-[11px] text-slate-500">scholarships.gov.in</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} CareerPath AI. Built with ❤️ for Bharat's Students.</p>
          <div className="flex items-center gap-6">
            <Link to="/future" className="hover:text-white transition-colors">
              {language === 'hi' ? 'भविष्य का रोडमैप (Future Scope)' : 'Hackathon Roadmap & Future Scope'}
            </Link>
            <span className="text-slate-700">•</span>
            <a href="https://swayam.gov.in" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
              SWAYAM Portal
            </a>
            <span className="text-slate-700">•</span>
            <a href="https://nptel.ac.in" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
              NPTEL Online
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
