import React from 'react';
import { useParentView } from '../context/ParentViewContext';
import { useLanguage } from '../context/LanguageContext';
import { ShieldCheck, HeartHandshake, X } from 'lucide-react';

export default function ParentViewBanner() {
  const { isParentView, toggleParentView } = useParentView();
  const { language } = useLanguage();

  if (!isParentView) return null;

  return (
    <div className="bg-amber-500/15 border-b border-amber-500/30 text-amber-900 dark:text-amber-200 px-4 py-2.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-2.5">
          <span className="p-1.5 bg-amber-500 text-white rounded-lg inline-flex">
            <HeartHandshake className="w-4 h-4" />
          </span>
          <div>
            <span className="font-bold mr-1">
              {language === 'hi' ? 'अभिभावक व्यू सक्रिय:' : 'Parent View Active:'}
            </span>
            <span className="text-amber-800 dark:text-amber-300">
              {language === 'hi'
                ? 'सभी करियर और परीक्षाओं की जानकारी को आसान भाषा में बजट खर्च, नौकरी की सुरक्षा, और भविष्य की स्थिरता पर केंद्रित किया गया है।'
                : 'Content is simplified to highlight Course Fees, Job Security, Physical Safety, and Return on Investment.'}
            </span>
          </div>
        </div>
        <button
          onClick={toggleParentView}
          className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-md bg-amber-200/60 dark:bg-amber-900/60 hover:bg-amber-300 transition-colors shrink-0"
        >
          <span>{language === 'hi' ? 'छात्र व्यू पर लौटें' : 'Back to Student View'}</span>
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
