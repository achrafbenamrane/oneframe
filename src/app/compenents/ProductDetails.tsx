'use client';

import React from 'react';
import Image from 'next/image';
import { useI18n } from './LanguageProvider';

interface ProductDetailsProps {
  id: string;
  title: string;
  price: string | number;
  description: string;
  images?: string[];
  onBuy: () => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ id, title, price, description, images = [], onBuy }) => {
  const { t } = useI18n();
  
  console.log('ProductDetails images:', images);
  console.log('ProductDetails title:', title);

  return (
    <div className="w-full max-w-md sm:max-w-lg bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
      {/* Media/Carousel - FIXED: Better image handling */}
      <div className="relative h-56 sm:h-64 bg-gray-200 dark:bg-gray-800">
        {images && images.length > 0 && images[0] ? (
          <div className="relative w-full h-full">
            <Image 
              src={images[0]} 
              alt={title}
              width={400}
              height={300}
              className="w-full h-full object-cover"
              priority
              onError={(e) => {
                console.error('Image failed to load:', images[0]);
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
              onLoad={() => console.log('Image loaded successfully:', images[0])}
            />
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

        {/* Top-right brand placeholder */}
        <div className="absolute top-3 right-3 z-10">
          <div className="w-8 h-8 rounded-full bg-white/90 dark:bg-gray-900 flex items-center justify-center text-xs font-semibold shadow">
            LOGO
          </div>
        </div>

        {/* Dots indicator placeholder - only show if multiple images */}
        {images && images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
            {images.map((_, index) => (
              <span 
                key={index}
                className={`w-1.5 h-1.5 rounded-full ${index === 0 ? 'bg-white/70' : 'bg-white/50'}`} 
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
  );
};

export default ProductDetails;