'use client';

import React from 'react';
import { useI18n } from './LanguageProvider';


const LanguageToggle: React.FC = () => {
  const { lang, toggleLang } = useI18n();
  const isAr = lang === 'ar';

  return (
    <button
      aria-label="Toggle language"
      onClick={toggleLang}
      className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow hover:bg-gray-50 dark:hover:bg-gray-800 transition"
      title={isAr ? 'Arabic' : 'English'}
    >
      {/* Language icon */}
      {isAr ? (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-emerald-500">
          <path d="M4 4h16a1 1 0 011 1v14a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1zm8 2H5v12h6.382A8.003 8.003 0 0112 6zm2 0a10 10 0 100 12 10 10 0 000-12zm0 3a1 1 0 011 1v1h2a1 1 0 110 2h-2v1a1 1 0 11-2 0v-1h-2a1 1 0 110-2h2V10a1 1 0 011-1z" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-indigo-500">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v3m0 0c1.5 0 3 0 4.5-1.5M12 9c-1.5 0-3 0-4.5-1.5M12 9v3m0 0c1.5 0 3 0 4.5 1.5M12 12c-1.5 0-3 0-4.5 1.5M12 12v3m0 0c1.5 0 3 0 4.5 1.5M12 15c-1.5 0-3 0-4.5 1.5" />
        </svg>
      )}
    </button>
  );
};

export default LanguageToggle;
