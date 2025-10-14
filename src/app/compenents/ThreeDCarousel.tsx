'use client';
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useI18n } from "./LanguageProvider";

interface ThreeDCarouselProps {
  images?: string[];
  leftButtonLabel?: string;
  rightButtonLabel?: string;
  onLeftButtonClick?: (index: number, src: string) => void;
  onRightButtonClick?: (index: number, src: string) => void;
}

const DEFAULT_IMAGES: string[] = [
  '/Van.jpg',
  '/Camaro.jpg', 
  '/Brezina.jpg',
  '/Bike.jpg',
  '/f1.jpg',
  '/Mercedes.jpg',
];

const VEHICLE_NAMES = [
  'van',
  'camaro', 
  'landRover',
  'bike',
  'f1',
  'mercedesGTR'
] as const;

interface Story {
  id: number;
  imageUrl: string;
  title: string;
}

const StoryCard = ({ 
  story, 
  leftLabel, 
  rightLabel, 
  onLeftClick, 
  onRightClick,
  isActive = false,
  position = 'center'
}: { 
  story: Story;
  leftLabel?: string;
  rightLabel?: string;
  onLeftClick?: () => void;
  onRightClick?: () => void;
  isActive?: boolean;
  position?: 'left' | 'center' | 'right';
}) => {
  const getCardStyles = () => {
    switch (position) {
      case 'left':
        return {
          container: 'scale-75 opacity-60 blur-sm -translate-x-12 z-10 cursor-pointer',
          image: 'scale-105',
          buttons: 'opacity-70'
        };
      case 'right':
        return {
          container: 'scale-75 opacity-60 blur-sm translate-x-12 z-10 cursor-pointer', 
          image: 'scale-105',
          buttons: 'opacity-70'
        };
      case 'center':
      default:
        return {
          container: 'scale-100 opacity-100 blur-0 z-20',
          image: 'scale-100',
          buttons: 'opacity-100'
        };
    }
  };

  const styles = getCardStyles();

  return (
    <motion.div
      className={`relative w-72 h-96 flex-shrink-0 rounded-2xl overflow-hidden shadow-xl group mx-3 transition-all duration-500 ${styles.container}`}
      whileHover={{ 
        y: isActive ? -8 : -4, 
        transition: { type: "spring", stiffness: 300 } 
      }}
    >
      {/* Title at the top */}
      <div className="absolute top-4 left-0 right-0 z-20 px-4">
        <h3 className="font-bold text-xl tracking-wide text-center text-white bg-black/40 backdrop-blur-sm rounded-lg py-2 px-3">
          {story.title}
        </h3>
      </div>

      <Image
        src={story.imageUrl}
        alt={story.title}
        width={288}
        height={384}
        className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 pointer-events-none ${styles.image}`}
        priority={isActive}
      />
      
      {/* Gradient overlay - moved down to create space between image and buttons */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pt-16"></div>
      
      {/* Buttons container with margin from image */}
      <div className="relative z-10 flex flex-col justify-end h-full pb-6 px-6 text-white">
        <div className={`flex justify-between gap-2 transition-opacity duration-300 ${styles.buttons}`}>
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium rounded-md bg-cyan-600 text-white hover:bg-cyan-500 border border-cyan-500/50 shadow flex-1 text-center transition-colors duration-200"
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); if (onLeftClick) { onLeftClick(); } }}
          >
            {leftLabel}
          </button>
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium rounded-md bg-black/70 text-white dark:bg-white/80 dark:text-gray-900 backdrop-blur border border-white/20 dark:border-black/20 shadow flex-1 text-center transition-colors duration-200"
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); if (onRightClick) { onRightClick(); } }}
          >
            {rightLabel}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const ThreeDCarousel = ({
  images = DEFAULT_IMAGES,
  leftButtonLabel = 'Info',
  rightButtonLabel = 'Buy',
  onLeftButtonClick,
  onRightButtonClick,
}: ThreeDCarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { t, lang } = useI18n();

  // Touch gesture support
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Convert your images to stories data with proper translated names
  const storiesData: Story[] = images.map((imageUrl, index) => ({
    id: index + 1,
    imageUrl: imageUrl,
    title: t(VEHICLE_NAMES[index]),
  }));

  // Calculate indices for previous, active, and next cards
  const getVisibleCards = () => {
    const totalCards = storiesData.length;
    
    const prevIndex = (activeIndex - 1 + totalCards) % totalCards;
    const nextIndex = (activeIndex + 1) % totalCards;

    return [
      { story: storiesData[prevIndex], position: 'left' as const },
      { story: storiesData[activeIndex], position: 'center' as const },
      { story: storiesData[nextIndex], position: 'right' as const },
    ];
  };

  const goToNext = () => {
    setActiveIndex((current) => (current + 1) % storiesData.length);
  };

  const goToPrev = () => {
    setActiveIndex((current) => (current - 1 + storiesData.length) % storiesData.length);
  };

  const goToIndex = (index: number) => {
    setActiveIndex(index);
  };

  // Touch gesture handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;

    const diffX = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50; // Minimum distance for a swipe

    if (Math.abs(diffX) > minSwipeDistance) {
      if (diffX > 0) {
        // Swipe left - go to next
        goToNext();
      } else {
        // Swipe right - go to previous
        goToPrev();
      }
    }

    // Reset values
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  // Click handlers for side cards
  const handleSideCardClick = (position: 'left' | 'right') => {
    if (position === 'left') {
      goToPrev();
    } else if (position === 'right') {
      goToNext();
    }
  };

  // Auto-play functionality
  useEffect(() => {
    const interval = setInterval(goToNext, 5000);
    return () => clearInterval(interval);
  }, []);

  // Reset active index when language changes
  useEffect(() => {
    setActiveIndex(0);
  }, [lang]);

  const visibleCards = getVisibleCards();

  return (
    <div className="font-sans w-full py-12 md:py-20 flex flex-col items-center justify-center">
      <div className="w-full max-w-7xl mx-auto px-4">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-black dark:text-white">
            {t('exploreVehicles')}
          </h1>
          <p className="mt-4 text-lg text-gray-400">
            {t('dragToBrowse')}
          </p>
        </header>

        {/* Main Carousel Container with touch support */}
        <div 
          className="relative h-[500px] flex items-center justify-center"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Cards Container */}
          <div className="flex items-center justify-center relative w-full">
            <AnimatePresence mode="wait">
              {visibleCards.map(({ story, position }) => (
                <motion.div
                  key={`${story.id}-${position}-${lang}`}
                  className="absolute"
                  initial={{ 
                    opacity: 0,
                    x: position === 'left' ? -100 : position === 'right' ? 100 : 0,
                    scale: 0.8
                  }}
                  animate={{ 
                    opacity: 1,
                    x: position === 'left' ? -180 : position === 'right' ? 180 : 0,
                    scale: position === 'center' ? 1 : 0.75
                  }}
                  exit={{ 
                    opacity: 0,
                    x: position === 'left' ? -100 : position === 'right' ? 100 : 0,
                    scale: 0.8
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  onClick={() => position !== 'center' && handleSideCardClick(position)}
                >
                  <StoryCard 
                    story={story}
                    leftLabel={leftButtonLabel}
                    rightLabel={rightButtonLabel}
                    onLeftClick={onLeftButtonClick ? () => onLeftButtonClick(story.id - 1, story.imageUrl) : undefined}
                    onRightClick={onRightButtonClick ? () => onRightButtonClick(story.id - 1, story.imageUrl) : undefined}
                    isActive={position === 'center'}
                    position={position}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation Controls at Bottom */}
        <div className="flex items-center justify-center mt-8 space-x-6">
          {/* Previous Button */}
          <button
            onClick={goToPrev}
            className="p-3 rounded-full bg-white/80 dark:bg-gray-800/80 shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-colors backdrop-blur border border-gray-200 dark:border-gray-600"
            aria-label="Previous vehicle"
          >
            <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Dot Indicators */}
          <div className="flex space-x-3">
            {storiesData.map((_, index) => (
              <button
                key={index}
                onClick={() => goToIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === activeIndex
                    ? 'bg-cyan-500 scale-125'
                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
                }`}
                aria-label={`Go to vehicle ${index + 1}`}
              />
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={goToNext}
            className="p-3 rounded-full bg-white/80 dark:bg-gray-800/80 shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-colors backdrop-blur border border-gray-200 dark:border-gray-600"
            aria-label="Next vehicle"
          >
            <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Order Now Link */}
        <div className="mt-10 flex items-center justify-center">
          <a
            href="#order-form-section"
            className="text-gray-300 font-semibold hover:text-white transition-colors duration-300 group"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('order-form-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            {t('orderNow')}
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1 ml-1">
              &rarr;
            </span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ThreeDCarousel;