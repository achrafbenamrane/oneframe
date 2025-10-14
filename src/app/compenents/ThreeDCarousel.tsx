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
  position = 'center',
  isRTL = false
}: { 
  story: Story;
  leftLabel?: string;
  rightLabel?: string;
  onLeftClick?: () => void;
  onRightClick?: () => void;
  isActive?: boolean;
  position?: 'left' | 'center' | 'right';
  isRTL?: boolean;
}) => {
  const getCardStyles = () => {
    // For RTL languages, swap left and right positions
    const effectivePosition = isRTL ? 
      (position === 'left' ? 'right' : position === 'right' ? 'left' : 'center') 
      : position;

    switch (effectivePosition) {
      case 'left':
        return {
          container: 'scale-75 opacity-60 blur-sm -translate-x-8 lg:-translate-x-12 z-10 cursor-pointer',
          image: 'scale-105',
          buttons: 'opacity-70'
        };
      case 'right':
        return {
          container: 'scale-75 opacity-60 blur-sm translate-x-8 lg:translate-x-12 z-10 cursor-pointer', 
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

  // For RTL languages, swap the button order but keep their functionality
  const buttons = isRTL ? [
    { label: rightLabel, onClick: onRightClick, className: "px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-md bg-black/70 text-white dark:bg-white/80 dark:text-gray-900 backdrop-blur border border-white/20 dark:border-black/20 shadow flex-1 text-center transition-colors duration-200" },
    { label: leftLabel, onClick: onLeftClick, className: "px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-md bg-cyan-600 text-white hover:bg-cyan-500 border border-cyan-500/50 shadow flex-1 text-center transition-colors duration-200" }
  ] : [
    { label: leftLabel, onClick: onLeftClick, className: "px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-md bg-cyan-600 text-white hover:bg-cyan-500 border border-cyan-500/50 shadow flex-1 text-center transition-colors duration-200" },
    { label: rightLabel, onClick: onRightClick, className: "px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-md bg-black/70 text-white dark:bg-white/80 dark:text-gray-900 backdrop-blur border border-white/20 dark:border-black/20 shadow flex-1 text-center transition-colors duration-200" }
  ];

  return (
    <motion.div
      className={`relative w-64 sm:w-72 h-96 flex-shrink-0 rounded-2xl overflow-hidden shadow-xl group transition-all duration-300 bg-white dark:bg-gray-800 ${styles.container}`}
      whileHover={{ 
        y: isActive ? -8 : -4, 
        transition: { type: "spring", stiffness: 300 } 
      }}
    >
      {/* TOP: Product Title - Minimal height */}
      <div className="absolute top-0 left-0 right-0 z-20 px-4 py-1 bg-white dark:bg-gray-800">
        <h3 className="font-bold text-lg sm:text-xl tracking-wide text-center text-gray-900 dark:text-white">
          {story.title}
        </h3>
      </div>

      {/* CENTER: Product Image - Maximum height */}
      <div className="absolute top-8 bottom-8 left-0 right-0">
        <Image
          src={story.imageUrl}
          alt={`Vehicle ${story.id + 1}`}
          fill
          className={`object-cover transition-transform duration-500 pointer-events-none ${styles.image}`}
          priority
        />
      </div>

      {/* BOTTOM: Buttons - Minimal height */}
      <div className="absolute bottom-0 left-0 right-0 z-10 bg-white dark:bg-gray-800">
        <div className={`p-1 transition-opacity duration-300 ${styles.buttons}`}>
          <div className="flex justify-between gap-2">
            {buttons.map((button, index) => (
              <button
                key={index}
                type="button"
                className={button.className}
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                onClick={(e) => { e.stopPropagation(); if (button.onClick) { button.onClick(); } }}
              >
                {button.label}
              </button>
            ))}
          </div>
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
  const [direction, setDirection] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const { t, lang } = useI18n();

  // Enhanced touch gesture support
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const isRTL = lang === 'ar';

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
    setDirection(1);
    setActiveIndex((current) => (current + 1) % storiesData.length);
  };

  const goToPrev = () => {
    setDirection(-1);
    setActiveIndex((current) => (current - 1 + storiesData.length) % storiesData.length);
  };

  const goToIndex = (index: number) => {
    const newDirection = index > activeIndex ? 1 : -1;
    setDirection(newDirection);
    setActiveIndex(index);
  };

  // Unified touch and mouse event handlers
  const handleDragStart = (clientX: number) => {
    touchStartX.current = clientX;
    setIsSwiping(true);
  };

  const handleDragMove = (clientX: number) => {
    if (!isSwiping) return;
    touchEndX.current = clientX;
    
    const diffX = touchStartX.current - touchEndX.current;
    if (carouselRef.current && Math.abs(diffX) > 10) {
      carouselRef.current.style.cursor = 'grabbing';
    }
  };

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches && e.touches[0]) {
      handleDragStart(e.touches[0].clientX);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches && e.touches[0]) {
      handleDragMove(e.touches[0].clientX);
    }
  };

  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    handleDragStart(e.clientX);
    e.preventDefault();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleDragMove(e.clientX);
    e.preventDefault();
  };

  const handleDragEnd = () => {
    if (!isSwiping) return;
    
    setIsSwiping(false);
    
    if (carouselRef.current) {
      carouselRef.current.style.cursor = 'grab';
    }

    if (!touchStartX.current || !touchEndX.current) return;

    const diffX = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 30;

    if (Math.abs(diffX) > minSwipeDistance) {
      // FIXED: Invert swipe direction for RTL languages
      if (isRTL) {
        // For RTL: Swipe left goes to previous, swipe right goes to next
        if (diffX > 0) {
          goToPrev(); // Swipe left in RTL = go to previous
        } else {
          goToNext(); // Swipe right in RTL = go to next
        }
      } else {
        // For LTR: Normal behavior
        if (diffX > 0) {
          goToNext(); // Swipe left in LTR = go to next
        } else {
          goToPrev(); // Swipe right in LTR = go to previous
        }
      }
    }

    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  // Click handlers for side cards
  const handleSideCardClick = (position: 'left' | 'right') => {
    if (isRTL) {
      if (position === 'left') {
        goToNext();
      } else if (position === 'right') {
        goToPrev();
      }
    } else {
      if (position === 'left') {
        goToPrev();
      } else if (position === 'right') {
        goToNext();
      }
    }
  };

  // Reset active index when language changes
  useEffect(() => {
    setActiveIndex(0);
    setDirection(0);
  }, [lang]);

  const visibleCards = getVisibleCards();

  // Animation variants for smooth scrolling - handle RTL direction
  const cardVariants = {
    enter: (direction: number) => ({
      x: isRTL ? 
        (direction > 0 ? -300 : 300) : 
        (direction > 0 ? 300 : -300),
      opacity: 0,
      scale: 0.8
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      x: isRTL ? 
        (direction < 0 ? -300 : 300) : 
        (direction < 0 ? 300 : -300),
      opacity: 0,
      scale: 0.8
    })
  };

  const sideCardVariants = {
    left: {
      x: isRTL ? 140 : -140,
      opacity: 0.6,
      scale: 0.75
    },
    right: {
      x: isRTL ? -140 : 140,
      opacity: 0.6,
      scale: 0.75
    }
  };

  // Navigation arrow icons for RTL
  const PrevIcon = () => (
    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isRTL ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"} />
    </svg>
  );

  const NextIcon = () => (
    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isRTL ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
    </svg>
  );

  return (
    <div className={`font-sans w-full py-12 md:py-20 flex flex-col items-center justify-center overflow-hidden ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="w-full max-w-6xl mx-auto px-2 sm:px-4">
        <header className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black dark:text-white px-2">
            {t('exploreVehicles')}
          </h1>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg text-gray-400 px-2">
            {t('dragToBrowse')}
          </p>
        </header>

        {/* Enhanced Main Carousel Container with better touch support */}
        <div 
          ref={carouselRef}
          className="relative h-[420px] sm:h-[500px] flex items-center justify-center overflow-visible cursor-grab active:cursor-grabbing"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleDragEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={isSwiping ? handleMouseMove : undefined}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
        >
          {/* Cards Container */}
          <div className="flex items-center justify-center relative w-full overflow-visible">
            <AnimatePresence mode="popLayout" custom={direction}>
              {visibleCards.map(({ story, position }) => (
                <motion.div
                  key={`${story.id}-${position}-${lang}`}
                  className="absolute overflow-visible select-none"
                  custom={direction}
                  variants={position === 'center' ? cardVariants : sideCardVariants}
                  initial={position === 'center' ? "enter" : position}
                  animate={position === 'center' ? "center" : position}
                  exit={position === 'center' ? "exit" : position}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30,
                    duration: 0.3
                  }}
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
                    isRTL={isRTL}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation Controls at Bottom */}
        <div className="flex items-center justify-center mt-6 sm:mt-8 space-x-4 sm:space-x-6">
          <button
            onClick={goToPrev}
            className="p-2 sm:p-3 rounded-full bg-white/80 dark:bg-gray-800/80 shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-colors backdrop-blur border border-gray-200 dark:border-gray-600"
            aria-label={isRTL ? "Next vehicle" : "Previous vehicle"}
          >
            <PrevIcon />
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

          <button
            onClick={goToNext}
            className="p-2 sm:p-3 rounded-full bg-white/80 dark:bg-gray-800/80 shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-colors backdrop-blur border border-gray-200 dark:border-gray-600"
            aria-label={isRTL ? "Previous vehicle" : "Next vehicle"}
          >
            <NextIcon />
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
            <span className={`inline-block transition-transform duration-300 group-hover:translate-x-1 ml-1 ${isRTL ? 'rotate-180' : ''}`}>
              &rarr;
            </span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ThreeDCarousel;