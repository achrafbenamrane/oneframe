'use client';
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useI18n } from "./LanguageProvider";

// ... (keep all your existing interfaces and constants)

const ThreeDCarousel = ({
  images = DEFAULT_IMAGES,
  leftButtonLabel = 'Info',
  rightButtonLabel = 'Buy',
  onLeftButtonClick,
  onRightButtonClick,
}: ThreeDCarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const { t, lang } = useI18n();

  // Enhanced touch gesture support
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const carouselRef = useRef<HTMLDivElement>(null);

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

  // Enhanced touch gesture handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping) return;
    touchEndX.current = e.touches[0].clientX;
    
    // Optional: Add visual feedback during swipe
    const diffX = touchStartX.current - touchEndX.current;
    if (carouselRef.current && Math.abs(diffX) > 10) {
      carouselRef.current.style.cursor = 'grabbing';
    }
  };

  const handleTouchEnd = () => {
    if (!isSwiping) return;
    
    setIsSwiping(false);
    
    if (carouselRef.current) {
      carouselRef.current.style.cursor = 'grab';
    }

    if (!touchStartX.current || !touchEndX.current) return;

    const diffX = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 30; // Reduced for better sensitivity
    const swipeVelocity = Math.abs(diffX);

    // Only trigger if swipe distance is sufficient
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

  // Auto-play functionality (pauses during swipe)
  useEffect(() => {
    if (isSwiping) return;
    
    const interval = setInterval(goToNext, 5000);
    return () => clearInterval(interval);
  }, [isSwiping]);

  // Reset active index when language changes
  useEffect(() => {
    setActiveIndex(0);
  }, [lang]);

  const visibleCards = getVisibleCards();

  return (
    <div className="font-sans w-full py-12 md:py-20 flex flex-col items-center justify-center overflow-hidden">
      <div className="w-full max-w-6xl mx-auto px-2 sm:px-4">
        <header className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black dark:text-white px-2">
            {t('exploreVehicles')}
          </h1>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg text-gray-400 px-2">
            {t('dragToBrowse')} {/* Make sure this text encourages swiping */}
          </p>
        </header>

        {/* Enhanced Main Carousel Container with better touch support */}
        <div 
          ref={carouselRef}
          className="relative h-[420px] sm:h-[500px] flex items-center justify-center overflow-visible cursor-grab active:cursor-grabbing"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          // Add mouse drag support for desktop touch devices
          onMouseDown={handleTouchStart as any}
          onMouseMove={handleTouchMove as any}
          onMouseUp={handleTouchEnd as any}
          onMouseLeave={handleTouchEnd} // Handle case when mouse leaves during drag
        >
          {/* Cards Container */}
          <div className="flex items-center justify-center relative w-full overflow-visible">
            <AnimatePresence mode="wait">
              {visibleCards.map(({ story, position }) => (
                <motion.div
                  key={`${story.id}-${position}-${lang}`}
                  className="absolute overflow-visible select-none" // Prevent text selection during swipe
                  initial={{ 
                    opacity: 0,
                    x: position === 'left' ? -80 : position === 'right' ? 80 : 0,
                    scale: 0.8
                  }}
                  animate={{ 
                    opacity: 1,
                    x: position === 'left' ? -140 : position === 'right' ? 140 : 0,
                    scale: position === 'center' ? 1 : 0.75
                  }}
                  exit={{ 
                    opacity: 0,
                    x: position === 'left' ? -80 : position === 'right' ? 80 : 0,
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

        {/* Rest of your code remains the same */}
        {/* Navigation Controls at Bottom */}
        <div className="flex items-center justify-center mt-6 sm:mt-8 space-x-4 sm:space-x-6">
          {/* Previous Button */}
          <button
            onClick={goToPrev}
            className="p-2 sm:p-3 rounded-full bg-white/80 dark:bg-gray-800/80 shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-colors backdrop-blur border border-gray-200 dark:border-gray-600"
            aria-label="Previous vehicle"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Dot Indicators */}
          <div className="flex space-x-2 sm:space-x-3">
            {storiesData.map((_, index) => (
              <button
                key={index}
                onClick={() => goToIndex(index)}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
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
            className="p-2 sm:p-3 rounded-full bg-white/80 dark:bg-gray-800/80 shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-colors backdrop-blur border border-gray-200 dark:border-gray-600"
            aria-label="Next vehicle"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Order Now Link */}
        <div className="mt-8 sm:mt-10 flex items-center justify-center">
          <a
            href="#order-form-section"
            className="text-gray-300 font-semibold hover:text-white transition-colors duration-300 group text-sm sm:text-base"
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