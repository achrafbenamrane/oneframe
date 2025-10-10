'use client';
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useI18n } from "./LanguageProvider";

interface ThreeDCarouselProps {
  images?: string[];
  leftButtonLabel?: string;
  rightButtonLabel?: string;
  onLeftButtonClick?: (index: number, src: string) => void;
  onRightButtonClick?: (index: number, src: string) => void;
}

// Remove the DEFAULT_IMAGES or update it to use your actual images
const DEFAULT_IMAGES: string[] = [
  '/Van.jpg',
  '/Camaro.jpg', 
  '/Brezina.jpg',
  '/Bike.jpg',
  '/f1.jpg',
  '/Mercedes.jpg',
];

// Vehicle names mapping - use the same keys as in your dictionary
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
  onRightClick 
}: { 
  story: Story;
  leftLabel?: string;
  rightLabel?: string;
  onLeftClick?: () => void;
  onRightClick?: () => void;
}) => {
  return (
    <motion.div
      className="relative w-72 h-96 flex-shrink-0 rounded-lg overflow-hidden shadow-xl group"
      whileHover={{ y: -8, transition: { type: "spring", stiffness: 300 } }}
    >
      <Image
        src={story.imageUrl}
        alt={story.title}
        width={288}
        height={384}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 pointer-events-none"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
      <div className="relative z-10 flex flex-col justify-end h-full p-6 text-white">
        <h3 className="font-bold text-2xl tracking-wide">{story.title}</h3>
        
        {/* Buttons - matching your existing functionality */}
        <div className="pointer-events-none mt-4 flex justify-between gap-2">
          <button
            type="button"
            className="pointer-events-auto px-3 py-1.5 text-xs font-medium rounded-md bg-cyan-600 text-white hover:bg-cyan-500 border border-cyan-500/50 shadow"
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); if (onLeftClick) { onLeftClick(); } }}
          >
            {leftLabel}
          </button>
          <button
            type="button"
            className="pointer-events-auto px-3 py-1.5 text-xs font-medium rounded-md bg-black/70 text-white dark:bg-white/80 dark:text-gray-900 backdrop-blur border border-white/20 dark:border-black/20 shadow"
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
  images = DEFAULT_IMAGES, // This will use the passed images or fallback to DEFAULT_IMAGES
  leftButtonLabel = 'Info',
  rightButtonLabel = 'Buy',
  onLeftButtonClick,
  onRightButtonClick,
}: ThreeDCarouselProps) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragConstraint, setDragConstraint] = useState(0);
  const { t } = useI18n();

  // Convert your images to stories data with proper translated names
  const storiesData: Story[] = images.map((imageUrl, index) => ({
    id: index + 1,
    imageUrl: imageUrl, // This will use the actual image from the prop
    title: t(VEHICLE_NAMES[index]),
  }));

  useEffect(() => {
    const calculateConstraints = () => {
      if (containerRef.current && trackRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const trackWidth = trackRef.current.scrollWidth;
        setDragConstraint(containerWidth - trackWidth);
      }
    };

    calculateConstraints();
    window.addEventListener("resize", calculateConstraints);

    return () => window.removeEventListener("resize", calculateConstraints);
  }, [images]);

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

        <motion.div
          ref={containerRef}
          className="overflow-hidden cursor-grab"
          whileTap={{ cursor: "grabbing" }}
        >
          <motion.div
            ref={trackRef}
            className="flex space-x-6 pb-6 px-4"
            drag="x"
            dragConstraints={{
              right: 0,
              left: dragConstraint - 32,
            }}
            dragElastic={0.15}
          >
            {storiesData.map((story) => (
              <StoryCard 
                key={story.id} 
                story={story}
                leftLabel={leftButtonLabel}
                rightLabel={rightButtonLabel}
                onLeftClick={onLeftButtonClick ? () => onLeftButtonClick(story.id - 1, story.imageUrl) : undefined}
                onRightClick={onRightButtonClick ? () => onRightButtonClick(story.id - 1, story.imageUrl) : undefined}
              />
            ))}
          </motion.div>
        </motion.div>

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