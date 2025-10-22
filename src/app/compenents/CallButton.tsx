'use client';

import React from 'react';

const CallButton: React.FC = () => {
  const handleCall = () => {
    window.location.href = 'tel:+213558780131';
  };

  return (
    <button
      onClick={handleCall}
      aria-label="Call us at +213558780131"
      className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-green-500 bg-green-500 hover:bg-green-600 transition-all duration-200 shadow-sm"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-5 h-5 text-white"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
        />
      </svg>
    </button>
  );
};

export default CallButton;
