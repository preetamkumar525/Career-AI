import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import analyticsData from '../data/analyticsData.json';
import notificationsData from '../data/notifications.json';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend
} from 'recharts';
import {
  TrendingUp,
  Flame,
  Bell,
  Check,
  Search,
  Filter,
  Calendar,
  ExternalLink,
  Building2,
  Users,
  Award
} from 'lucide-react';

export default function TrendingDashboard() {
  const { language, t } = useLanguage();

  const [selectedState, setSelectedState] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedQualification, setSelectedQualification] = useState('All');
  const [reminders, setReminders] = useState({});

  const handleToggleReminder = (id) => {
    setReminders(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filteredNotifications = notificationsData.filter((item) => {
    if (selectedState !== 'All' && !item.state.includes(selectedState) && item.state !== 'All India') {
      return false;
    }
    if (selectedCategory !== 'All' && item.category !== selectedCategory) {
      return false;
    }
    if (selectedQualification !== 'All' && !item.qualification.toLowerCase().includes(selectedQualification.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-warmOrange-100 dark:bg-warmOrange-950 text-warmOrange-800 dark:text-warmOrange-300 text-xs font-bold border border-warmOrange-300">
          <Flame className="w-3.5 h-3.5 text-warmOrange-500" />
          <span>{language === 'hi' ? 'ताज़ा भर्तियां एवं भर्ती ट्रेंड्स' : 'Live Job Market Pulse'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
          {language === 'hi' ? 'ट्रेंडिंग व रिक्तियां डैशबोर्ड' : 'Trending & Vacancy Dashboard'}
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-sm max-w-3xl">
          {language === 'hi'
            ? 'विभिन्न सरकारी विभागों में कुल रिक्तियों के आधिकारिक आंकड़े, 5-वर्षीय भर्ती रुझान और 2026 की नवीनतम अधिसूचनाएं।'
            : 'Track live government vacancies across ministries, 5-year hiring trajectories, and receive deadline reminders.'}
        </p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-card">
          <span className="text-[11px] font-bold text-slate-400 uppercase">
            {language === 'hi' ? 'सक्रिय रिक्तियां' : 'Active Vacancies'}
          </span>
          <div className="text-2xl sm:text-3xl font-black text-brand-600 dark:text-brand-400 mt-1">
            {analyticsData.summaryStats.totalActiveVacancies}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-card">
          <span className="text-[11px] font-bold text-slate-400 uppercase">
            {language === 'hi' ? 'वार्षिक आवेदक संख्या' : 'Annual Aspirants'}
          </span>
          <div className="text-2xl sm:text-3xl font-black text-tealAccent-600 dark:text-tealAccent-400 mt-1">
            {analyticsData.summaryStats.totalRegisteredAspirants}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-card">
          <span className="text-[11px] font-bold text-slate-400 uppercase">
            {language === 'hi' ? 'औसत चयन अनुपात' : 'Selection Ratio'}
          </span>
          <div className="text-2xl sm:text-3xl font-black text-warmOrange-500 mt-1">
            {analyticsData.summaryStats.avgSelectionRatio}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-card">
          <span className="text-[11px] font-bold text-slate-400 uppercase">
            {language === 'hi' ? 'शीर्ष ग्रोथ सेक्टर' : 'Fastest Growing'}
          </span>
          <div className="text-base sm:text-lg font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {analyticsData.summaryStats.topGrowingSector}
          </div>
        </div>
      </div>

      {/* 3 Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 1. Bar Chart: Vacancies by Department */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-brand-600" />
              <span>{language === 'hi' ? 'विभागवार सरकारी रिक्तियां' : 'Vacancies by Ministry / Department'}</span>
            </h3>
            <span className="text-xs text-slate-400 font-medium">2026 Official</span>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData.vacanciesByDepartment} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="department" tick={{ fontSize: 11 }} interval={0} angle={-20} textAnchor="end" />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val) => [val.toLocaleString() + ' Posts', 'Vacancies']}
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="vacancies" fill="#0e86d4" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Pie Chart: Exam Popularity */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-card space-y-4">
          <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-tealAccent-500" />
            <span>{language === 'hi' ? 'परीक्षा लोकप्रियता शेयर (%)' : 'Aspirant Share (%)'}</span>
          </h3>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analyticsData.examPopularity}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {analyticsData.examPopularity.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val) => [`${val}% of total applicants`, 'Popularity']}
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-1 text-[11px]">
            {analyticsData.examPopularity.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5 truncate">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-slate-600 dark:text-slate-300 truncate">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Line Chart: 5-Year Vacancy Trend */}
        <div className="lg:col-span-3 p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-warmOrange-500" />
              <span>{language === 'hi' ? '5-वर्षीय कुल रिक्ति वृद्धि रुझान' : '5-Year Government Vacancy Growth Trend'}</span>
            </h3>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">+68% Growth since 2022</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analyticsData.fiveYearVacancyTrend} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val) => [val.toLocaleString() + ' Vacancies', 'Total Announced']}
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Line type="monotone" dataKey="vacancies" stroke="#f97316" strokeWidth={3} dot={{ r: 5, fill: '#f97316' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Latest Notifications Section with Filters */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-red-500" />
              <span>{language === 'hi' ? 'नवीनतम नौकरी अधिसूचनाएं 2026' : 'Latest Job Notifications'}</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {language === 'hi' ? 'आवेदन करने के लिए सीधे आधिकारिक लिंक और अंतिम तिथि रिमाइंडर सेट करें' : 'Apply directly on official portals and set calendar reminders.'}
            </p>
          </div>

          {/* Notification Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium"
            >
              <option value="All">{language === 'hi' ? 'सभी राज्य (All States)' : 'All States'}</option>
              <option value="All India">All India (Central)</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Bihar">Bihar</option>
            </select>

            <select
              value={selectedQualification}
              onChange={(e) => setSelectedQualification(e.target.value)}
              className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium"
            >
              <option value="All">{language === 'hi' ? 'सभी योग्यताएं' : 'All Qualifications'}</option>
              <option value="10th">10th Pass</option>
              <option value="12th">12th Pass</option>
              <option value="Graduation">Graduation</option>
              <option value="ITI">ITI / Diploma</option>
            </select>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.map((notif) => {
            const hasReminder = !!reminders[notif.id];
            return (
              <div
                key={notif.id}
                className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-card transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full text-white ${notif.badge_color}`}
                    >
                      {notif.badge}
                    </span>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      {notif.organization}
                    </span>
                    <span className="text-[11px] text-slate-400">• {notif.state}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {language === 'hi' ? notif.title_hi || notif.title : notif.title}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                    {notif.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-semibold pt-1 text-slate-600 dark:text-slate-300">
                    <span className="text-emerald-600 dark:text-emerald-400">
                      🎯 {notif.vacancies.toLocaleString()} {language === 'hi' ? 'पद' : 'Vacancies'}
                    </span>
                    <span>
                      🎓 {notif.qualification}
                    </span>
                    <span className="text-warmOrange-600 dark:text-warmOrange-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {language === 'hi' ? 'अंतिम तिथि' : 'Last Date'}: {notif.last_date}
                    </span>
                  </div>
                </div>

                {/* Right Action buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleToggleReminder(notif.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      hasReminder
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-400'
                        : 'border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-750'
                    }`}
                  >
                    {hasReminder ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Bell className="w-3.5 h-3.5" />}
                    <span>{hasReminder ? (language === 'hi' ? 'रिमाइंडर सेट' : 'Reminder Set') : (language === 'hi' ? 'रिमाइंडर' : 'Set Reminder')}</span>
                  </button>

                  <a
                    href={notif.apply_url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <span>{language === 'hi' ? 'आवेदन लिंक' : 'Apply Portal'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
