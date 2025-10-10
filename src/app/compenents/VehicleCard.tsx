'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Button from './Button';

export interface VehicleCardProps {
  id: string; // stable id (e.g., 'van', 'camaro')
  title: string; // display name
  images: string[]; // array of image paths
  description: string;
  price: number;
  onBuy?: (id: string) => void;
  onDetails?: (id: string) => void;
  isActive?: boolean;
}

const VehicleCard: React.FC<VehicleCardProps> = ({
  id,
  title,
  images,
  description,
  price,
  onBuy,
  onDetails,
  isActive = false,
}) => {
  // Only use the first image for the carousel card preview
  const image = images && images.length > 0 ? images[0] : '';
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{
        opacity: 1,
        scale: isActive ? 1.0 : 0.96,
      }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      className={
        'w-full mx-auto rounded-2xl overflow-hidden bg-white dark:bg-gray-900 border border-gray-200/70 dark:border-gray-700/60 transition-all duration-300 shadow-sm'
      }
      style={{ backfaceVisibility: 'hidden', transformStyle: 'preserve-3d' }}
    >
      <div className="relative w-full h-72 sm:h-80 md:h-96 lg:h-[28rem]">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          priority={isActive}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 60vw, 40vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      <div className="p-5 sm:p-6">
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 text-center">
          {title}
        </h3>
        <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-4 text-center">
          {description}
        </p>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-5">
          <span className="text-3xl sm:text-4xl font-bold text-blue-600 dark:text-blue-400 text-center sm:text-left">
            ${price.toLocaleString()}
          </span>
          <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full self-center sm:self-auto">
            ID: {id}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={() => onBuy?.(id)} variant="primary" className="text-base py-3 sm:flex-[2]">
            Buy Now
          </Button>
          <Button onClick={() => onDetails?.(id)} variant="secondary" className="text-base py-3 sm:flex-[1]">
            Details
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default VehicleCard;
