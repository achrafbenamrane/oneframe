'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface CarouselCardProps {
  id: string;
  title: string;
  image: string;
  description: string;
  price: number;
  onBuy?: () => void;
  onDetails?: () => void;
  isVisible?: boolean;
}

const CarouselCard: React.FC<CarouselCardProps> = ({
  id,
  title,
  image,
  description,
  price,
  onBuy,
  onDetails,
  isVisible = true
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: isVisible ? 1 : 0.3, 
        scale: isVisible ? 1 : 0.8,
        rotateY: isVisible ? 0 : 180
      }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className={`
        relative w-full h-full max-w-sm mx-auto
        ${isVisible ? 'z-10' : 'z-0'}
      `}
      style={{ 
        backfaceVisibility: 'hidden',
        transformStyle: 'preserve-3d'
      }}
    >
      <div className="w-full h-full rounded-2xl overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg dark:shadow-gray-900/50 transition-all duration-300 hover:shadow-2xl dark:hover:shadow-gray-900/70 hover:scale-105">
        {/* Image Container */}
        <div className="relative w-full h-48 sm:h-56 md:h-64">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">
            {title}
          </h3>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
            {description}
          </p>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
              ${price.toLocaleString()}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
              ID: {id}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 sm:gap-3">
            <button
              onClick={onBuy}
              className="flex-1 px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              Buy Now
            </button>
            <button
              onClick={onDetails}
              className="flex-1 px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              Details
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CarouselCard;
