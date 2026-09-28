import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import scholarshipsData from '../data/scholarships.json';
import {
  GraduationCap,
  Search,
  Calendar,
  DollarSign,
  FileCheck,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Building,
  CheckCircle2
} from 'lucide-react';

export default function ScholarshipsLoans() {
  const { language, t } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedState, setSelectedState] = useState('All');

  const filteredScholarships = scholarshipsData.filter((item) => {
    if (selectedCategory !== 'All' && item.category !== selectedCategory) {
      return false;
    }
    if (selectedState !== 'All' && !item.state.includes(selectedState) && item.state !== 'All India') {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const name = (item.name + ' ' + (item.name_hi || '')).toLowerCase();
      const provider = item.provider.toLowerCase();
      const target = item.target_group.toLowerCase();
      return name.includes(q) || provider.includes(q) || target.includes(q);
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 text-xs font-bold border border-cyan-300">
          <GraduationCap className="w-3.5 h-3.5 text-cyan-600" />
          <span>{language === 'hi' ? '100% सरकारी व सीएसआर फंडिंग' : 'Verified Financial Aid & Zero-Collateral Loans'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
          {language === 'hi' ? 'छात्रवृत्ति एवं शिक्षा ऋण (Scholarships & Loans)' : 'Scholarships & Higher Education Loans'}
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-sm max-w-3xl">
          {language === 'hi'
            ? 'गरीबी या धन की कमी के कारण कोई भी होनहार छात्र पढ़ाई न छोड़े। केंद्र व राज्य सरकारों की 100% फीस माफ़ी, मेरिट छात्रवृत्ति और शून्य-गारंटी वाले एजुकेशन लोन का पूरा विवरण।'
            : 'Financial support schemes designed for first-generation and rural learners: NSP Merit-cum-Means, AICTE Pragati for Girls, Bihar Student Credit Card, and collateral-free Vidya Lakshmi loans.'}
        </p>
      </div>

      {/* Zero Collateral Loan Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-cyan-600 to-brand-700 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full uppercase tracking-wider inline-block">
            {language === 'hi' ? 'महत्वपूर्ण सरकारी नियम' : 'Government Directive'}
          </span>
          <h3 className="text-xl sm:text-2xl font-black">
            {language === 'hi'
              ? '₹7.5 लाख तक के शिक्षा ऋण पर कोई गिरवी (No Collateral) नहीं!'
              : 'Collateral-Free Education Loans Up to ₹7.5 Lakhs (CSIS)'}
          </h3>
          <p className="text-xs sm:text-sm text-cyan-100 leading-relaxed">
            {language === 'hi'
              ? 'भारत सरकार के नियम अनुसार, सार्वजनिक क्षेत्र के बैंक ₹7.5 लाख तक की उच्च शिक्षा के लिए किसी भी तीसरे पक्ष की गारंटी या जमीन/मकान गिरवी नहीं मांग सकते। साथ ही ₹4.5 लाख वार्षिक आय वाले परिवारों को ब्याज पर 100% सरकारी सब्सिडी मिलती है।'
              : 'Under the Central Sector Interest Subsidy (CSIS) scheme, eligible students with family income under ₹4.5L get full interest subsidy during the moratorium period on Vidya Lakshmi portal.'}
          </p>
        </div>

        <a
          href="https://www.vidyalakshmi.co.in"
          target="_blank"
          rel="noreferrer"
          className="px-6 py-3 rounded-2xl bg-white text-brand-800 font-extrabold text-xs sm:text-sm shadow-md hover:bg-cyan-50 transition-all shrink-0 flex items-center gap-2"
        >
          <span>{language === 'hi' ? 'विद्या लक्ष्मी पोर्टल देखें' : 'Visit Vidya Lakshmi Portal'}</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'hi' ? 'छात्रवृत्ति या योजना खोजें...' : 'Search scholarships, loans, eligibility...'}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium"
          >
            <option value="All">{language === 'hi' ? 'सभी श्रेणियां' : 'All Categories'}</option>
            <option value="Merit-cum-Means">Merit-cum-Means</option>
            <option value="Girls Empowerment">Girls Empowerment</option>
            <option value="Social Equity">Social Equity (SC/ST/OBC)</option>
            <option value="Govt Backed Education Loan">Education Loan</option>
            <option value="Corporate CSR Merit Scholarship">Corporate CSR</option>
          </select>

          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium"
          >
            <option value="All">{language === 'hi' ? 'सभी राज्य' : 'All States'}</option>
            <option value="All India">All India</option>
            <option value="Bihar">Bihar</option>
            <option value="North Eastern">North Eastern States</option>
          </select>
        </div>
      </div>

      {/* Scholarships Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredScholarships.map((sch) => (
          <div
            key={sch.id}
            className="rounded-3xl p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-card hover:shadow-soft-hover transition-all flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300">
                  {sch.category}
                </span>

                <span className="text-xs font-bold text-warmOrange-600 dark:text-warmOrange-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{sch.deadline}</span>
                </span>
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white leading-snug">
                  {language === 'hi' ? sch.name_hi || sch.name : sch.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {sch.provider} • <span className="font-semibold text-slate-700 dark:text-slate-300">{sch.target_group}</span>
                </p>
              </div>

              {/* Amount and Income Ceiling */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-750 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">
                    {language === 'hi' ? 'वित्तीय सहायता' : 'Funding Amount'}
                  </span>
                  <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">
                    {sch.amount}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">
                    {language === 'hi' ? 'आय सीमा' : 'Income Ceiling'}
                  </span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300 text-xs">
                    {sch.income_limit}
                  </span>
                </div>
              </div>

              {/* Eligibility description */}
              <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                <strong className="text-slate-800 dark:text-white block mb-0.5">
                  {language === 'hi' ? 'पात्रता:' : 'Eligibility'}:
                </strong>
                {sch.eligibility}
              </div>

              {/* Required Documents */}
              {sch.documents_needed && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-750 text-[11px] space-y-1">
                  <span className="font-bold text-slate-500 uppercase text-[10px]">
                    {language === 'hi' ? 'आवश्यक दस्तावेज़' : 'Documents Needed'}:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {sch.documents_needed.map((doc, di) => (
                      <span key={di} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        {doc}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Card Action */}
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">
                Portal: <strong className="text-slate-700 dark:text-slate-300">{sch.portal_name}</strong>
              </span>

              <a
                href={sch.apply_portal}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
              >
                <span>{language === 'hi' ? 'आवेदन करें' : 'Apply Online'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
