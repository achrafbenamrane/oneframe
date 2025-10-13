'use client';

import React from 'react';
import Image from 'next/image';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';



const TopBar: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full py-3 bg-gray-50 dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95">
      
<div className="max-w-5xl mx-auto px-3 sm:px-4 w-full">
        <div className="relative flex items-center justify-center">
          {/* Left: Theme */}
          <div className="absolute left-0">
            <ThemeToggle />
          </div>

          {/* Center: Logo */}
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="Logo" width={184} height={55} priority className="select-none w-28 h-auto sm:w-44" />
          </div> 

          {/* Right: Language */}
          <div className="absolute right-0">
            <LanguageToggle />
          </div>
        </div>
      </div>
     
    </header>
  );
};

export default TopBar;
