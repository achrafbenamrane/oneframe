'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useI18n } from './LanguageProvider';

interface ProductDetailsProps {
  id: string;
  title: string;
  price: string | number;
  description: string;
  images?: string[];
  onBuy: () => void;
  onClose?: () => void;
}


const ProductDetails: React.FC<ProductDetailsProps> = ({ id, title, price, description, images = [], onBuy, onClose }) => {
  const { t } = useI18n();
  const [visible, setVisible] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      setVisible(false);
    }
  };

  if (!visible) return null;

  // Carousel navigation handlers
  const showPrev = () => setCurrentIndex((prev) => (prev === 0 ? (images.length - 1) : prev - 1));
  const showNext = () => setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  // Center the card on any screen size
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <div className="w-full max-w-md sm:max-w-lg bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        {/* Media/Carousel - now with multiple images */}
        <div className="relative h-74 sm:h-96 bg-gray-200 dark:bg-gray-800 flex items-center justify-center group">
          {images && images.length > 0 && images[currentIndex] ? (
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Left arrow - only show on hover (desktop) or always on mobile */}
              {images.length > 1 && (
                <button
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/90 dark:bg-gray-900 rounded-full p-2 sm:p-3 shadow text-2xl sm:text-3xl opacity-80 hover:opacity-100 transition group-hover:opacity-100 focus:opacity-100"
                  onClick={showPrev}
                  aria-label="Previous image"
                  type="button"
                  style={{display: 'block'}}
                >
                  &#8592;
                </button>
              )}
              <Image 
                src={images[currentIndex]} 
                alt={title}
                width={400}
                height={900}
                className="w-full h-full object-cover transition-all duration-300 rounded-2xl"
                priority
                onError={(e) => {
                  console.error('Image failed to load:', images[currentIndex]);
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
              {/* Right arrow - only show on hover (desktop) or always on mobile */}
              {images.length > 1 && (
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/90 dark:bg-gray-900 rounded-full p-2 sm:p-3 shadow text-2xl sm:text-3xl opacity-80 hover:opacity-100 transition group-hover:opacity-100 focus:opacity-100"
                  onClick={showNext}
                  aria-label="Next image"
                  type="button"
                  style={{display: 'block'}}
                >
                  &#8594;
                </button>
              )}
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 text-sm">
              <div>No image available</div>
              <div className="text-xs mt-2">Expected: {images[0]}</div>
            </div>
          )}

          {/* Top-left badge */}
          <div className="absolute top-3 left-3 z-10">
            <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-black/60 text-white backdrop-blur">
              {t('bestSeller')}
            </span>
          </div>

          {/* Top-right close button */}
          <div className="absolute top-3 right-3 z-10">
            <button
              type="button"
              aria-label="Close"
              onClick={handleClose}
              className="w-8 h-8 rounded-full bg-white/90 dark:bg-gray-900 flex items-center justify-center text-gray-900 dark:text-gray-100 text-lg font-bold shadow hover:bg-gray-200 dark:hover:bg-gray-800 transition"
            >
              &times;
            </button>
          </div>

          {/* Dots indicator - show for multiple images, highlight current */}
          {images && images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
              {images.map((_, index) => (
                <span
                  key={index}
                  className={`w-2 h-2 rounded-full border border-white/70 ${index === currentIndex ? 'bg-white/90' : 'bg-white/40'}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('ownIt')}</p>
            </div>
            <span className="sr-only">Product ID: {id}</span>
          </div>

          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            {description}
          </p>

          <div className="mt-4 flex items-center justify-between">
            <span className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100 text-sm font-semibold border border-gray-200 dark:border-gray-700">
              {t('priceSymbol')}{typeof price === 'number' ? price.toFixed(2) : price}
            </span>
            <button
              onClick={onBuy}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-black text-white hover:bg-gray-900 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 transition-colors shadow"
            >
              {t('buyNow')} <span aria-hidden>↗</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
