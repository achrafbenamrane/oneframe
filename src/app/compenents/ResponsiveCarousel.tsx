'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import VehicleCard, { VehicleCardProps } from './VehicleCard';

interface ResponsiveCarouselProps {
  vehicles: VehicleCardProps[];
  onBuy?: (id: string) => void;
  onDetails?: (id: string) => void;
}

// Utility to get relative position in a circular array: -1 (left), 0 (active), 1 (right)
const getRelativePosition = (index: number, current: number, length: number): -1 | 0 | 1 | 2 | -2 => {
  if (index === current) return 0;
  // next with wrap
  if ((current + 1) % length === index) return 1;
  // prev with wrap
  if ((current - 1 + length) % length === index) return -1;
  // for hidden items we can mark as far
  if ((current + 2) % length === index) return 2;
  if ((current - 2 + length) % length === index) return -2;
  return 2;
};

const ResponsiveCarousel: React.FC<ResponsiveCarouselProps> = ({ vehicles, onBuy, onDetails }) => {
  const [current, setCurrent] = useState(0);

  // Replace react-responsive with a lightweight internal hook
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const handlePrev = useCallback(() => {
    setCurrent((prev) => (prev === 0 ? vehicles.length - 1 : prev - 1));
  }, [vehicles.length]);

  const handleNext = useCallback(() => {
    setCurrent((prev) => (prev + 1) % vehicles.length);
  }, [vehicles.length]);

  // Wheel navigation (throttled) for quickly promoting the next/prev card to foreground
  const lastWheelTimeRef = useRef(0);
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      const now = Date.now();
      if (now - lastWheelTimeRef.current < 350) return;
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (delta > 16) {
        handleNext();
        lastWheelTimeRef.current = now;
      } else if (delta < -16) {
        handlePrev();
        lastWheelTimeRef.current = now;
      }
    },
    [handleNext, handlePrev]
  );

  // Motion values for drag to add subtle depth illusion on active card
  const dragX = useMotionValue(0);
  const rotateY = useTransform(dragX, [-200, 0, 200], [10, 0, -10]);
  const scaleActive = useTransform(dragX, [-200, 0, 200], [1.08, 1.16, 1.08]);
  const shadowActive = useTransform(
    dragX,
    [-200, 0, 200],
    [
      '0 10px 28px rgba(31, 38, 135, 0.24)',
      '0 18px 56px rgba(31, 38, 135, 0.36)',
      '0 10px 28px rgba(31, 38, 135, 0.24)'
    ]
  );

  // Precompute visible indexes for desktop (active, left, right). On mobile, only active.
  const visibleIndexes = useMemo(() => {
    if (isMobile) return [current];
    const left = (current - 1 + vehicles.length) % vehicles.length;
    const right = (current + 1) % vehicles.length;
    return [left, current, right];
  }, [current, vehicles.length, isMobile]);

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div
        className="relative w-full max-w-6xl mx-auto flex items-center justify-center"
        style={{ perspective: 1200 }}
      >
        {/* Left Arrow - hidden on mobile */}
        {!isMobile && vehicles.length > 1 && (
          <button
            onClick={handlePrev}
            className="absolute left-0 z-20 p-2 sm:p-3 rounded-full bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            aria-label="Previous vehicle"
          >
            <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Cards Stage */}
        <div className="relative flex-1 flex items-center justify-center h-[520px] sm:h-[560px] md:h-[600px]" onWheel={handleWheel}>
          <AnimatePresence initial={false} mode="wait">
            {vehicles.map((vehicle, idx) => {
              if (!visibleIndexes.includes(idx)) return null;

              const pos = getRelativePosition(idx, current, vehicles.length);
              const isActive = idx === current;

              // Desktop: spread left/right with depth, Mobile: center single card
              const desktopX = pos === -1 ? -340 : pos === 1 ? 340 : 0;
              const desktopRotate = pos === -1 ? 8 : pos === 1 ? -8 : 0;
              const desktopScale = pos === 0 ? 1.0 : 0.82;

              return (
                <motion.div
                  key={vehicle.id}
                  layout
                  initial={{ opacity: 0, x: pos === -1 ? -120 : pos === 1 ? 120 : 0, scale: 0.9 }}
                  animate={{
                    opacity: 1,
                    x: isMobile ? 0 : desktopX,
                    rotateY: isMobile ? 0 : desktopRotate,
                    scale: isMobile ? 1.0 : desktopScale,
                    zIndex: isActive ? 30 : 20,
                  }}
                  exit={{ opacity: 0, x: pos === -1 ? -120 : pos === 1 ? 120 : 0, scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 26, mass: 0.8 }}
                  className={`absolute w-full flex items-center justify-center ${isActive ? 'pointer-events-auto' : 'pointer-events-none'}`}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <motion.div
                    drag="x"
                    dragElastic={0.18}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragSnapToOrigin
                    onDragEnd={(_, info) => {
                      if (info.offset.x < -80) handleNext();
                      else if (info.offset.x > 80) handlePrev();
                    }}
                    style={isActive ? { x: dragX, rotateY, scale: scaleActive, boxShadow: shadowActive } : {}}
                    className={`w-full ${isActive ? 'max-w-[94%] sm:max-w-[76%] md:max-w-[60%] lg:max-w-[52%]' : 'max-w-[60%] sm:max-w-[44%] md:max-w-[34%] lg:max-w-[30%]'} ${!isActive ? 'opacity-70 brightness-95 grayscale-[20%] blur-[0.5px] sm:blur-[1px]' : ''}`}
                  >
                    <VehicleCard
                      {...vehicle}
                      isActive={isActive}
                      onBuy={onBuy}
                      onDetails={onDetails}
                    />
                  </motion.div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Right Arrow - hidden on mobile */}
        {!isMobile && vehicles.length > 1 && (
          <button
            onClick={handleNext}
            className="absolute right-0 z-20 p-2 sm:p-3 rounded-full bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            aria-label="Next vehicle"
          >
            <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center mt-6 space-x-2">
        {vehicles.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
              idx === current
                ? 'bg-blue-600 dark:bg-blue-400 scale-125'
                : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
            }`}
            aria-label={`Go to vehicle ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ResponsiveCarousel;
