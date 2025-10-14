'use client';

import React, { ReactNode, useEffect } from 'react';

interface DetailsModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children?: ReactNode;
}

const DetailsModal = ({ open, onClose, children }: DetailsModalProps) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-gray-950 transition-opacity duration-200" onClick={onClose} />
      <div className="relative w-full sm:max-w-lg sm:rounded-2xl shadow-xl border border-white/20 dark:border-gray-700 p-4 sm:p-20 m-0 sm:m-20 bg-white dark:bg-gray-900">
        {children}
      </div>
    </div>
  );
};

export default DetailsModal;
