'use client';

import React from 'react';
import { useI18n } from './LanguageProvider';


const LanguageToggle: React.FC = () => {
  const { lang, toggleLang } = useI18n();
  const isAr = lang === 'ar';

  return (
    <button
      aria-label={isAr ? 'Switch to English' : 'تغيير إلى العربية'}
      onClick={toggleLang}
      className="inline-flex items-center justify-center w-12 h-8 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 hover:shadow-md"
      title={isAr ? 'Switch to English' : 'تغيير إلى العربية'}
    >
      {/* Language icon - showing the language you can switch to */}
      {!isAr ? (
        <div className="flex items-center justify-center">
          <span className="text-lg font-bold text-emerald-600 dark:text-emerald-500 font-arabic">
            AR
          </span>
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <span className="text-sm font-bold text-indigo-600 dark:text-indigo-500">
            EN
          </span>
        </div>
      )}
    </button>
  );
};

export default LanguageToggle;
