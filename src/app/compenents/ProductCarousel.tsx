'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CarouselCard from './CarouselCard';

export interface Product {
  id: string;
  title: string;
  images: string[];
  description: string;
  price: number;
}

interface ProductCarouselProps {
  products: Product[];
  onBuy?: (product: Product) => void;
  onDetails?: (product: Product) => void;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({
  products,
  onBuy,
  onDetails,
  autoPlay = true,
  autoPlayInterval = 3000
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || isHovered || products.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, isHovered, products.length]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? products.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (products.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500 dark:text-gray-400">No products available</p>
      </div>
    );
  }

  return (
    <div 
      className="relative w-full max-w-4xl mx-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Carousel Container */}
      <div className="relative overflow-hidden rounded-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="w-full"
          >
            <CarouselCard
              id={products[currentIndex].id}
              title={products[currentIndex].title}
              images={products[currentIndex].images}
              description={products[currentIndex].description}
              price={products[currentIndex].price}
              onBuy={() => onBuy?.(products[currentIndex])}
              onDetails={() => onDetails?.(products[currentIndex])}
              isVisible={true}
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        {products.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 rounded-full bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              aria-label="Previous product"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button
              onClick={goToNext}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 rounded-full bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              aria-label="Next product"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Dots Indicator */}
      {products.length > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {products.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
                index === currentIndex
                  ? 'bg-blue-600 dark:bg-blue-400 scale-125'
                  : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Product Counter */}
      <div className="text-center mt-4">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {currentIndex + 1} of {products.length}
        </span>
      </div>
    </div>
  );
};

export default ProductCarousel;


