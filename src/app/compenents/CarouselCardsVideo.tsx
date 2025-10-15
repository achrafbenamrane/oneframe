"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface Story {
  id: number;
  videoUrl: string;
  title: string;
}

// Only 3 videos - replace these with your actual video file names
const storiesData: Story[] = [
  {
    id: 1,
    videoUrl: "/videos/video1.mp4", // Replace with your actual video file
    title: "Adventure Awaits",
  },
  {
    id: 2,
    videoUrl: "/videos/video2.mp4", // Replace with your actual video file
    title: "Mountain Journey",
  },
  {
    id: 3,
    videoUrl: "/videos/video3.mp4", // Replace with your actual video file
    title: "Ocean Dreams",
  },
];

const StoryCard = ({ story, isActive = false }: { story: Story; isActive?: boolean }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        // Add error handling for video playback
        videoRef.current.play().catch(error => {
          console.warn(`Video playback failed for ${story.title}:`, error);
        });
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isActive, story.title]);

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error(`Error loading video: ${story.videoUrl}`, e);
  };

  return (
    <motion.div
      className={`relative w-64 h-[24rem] sm:w-72 sm:h-[28rem] md:w-80 md:h-[30rem] flex-shrink-0 rounded-2xl overflow-hidden group mx-2 transition-all duration-300 ${
        isActive ? 'shadow-2xl' : 'shadow-lg'
      }`}
      whileHover={{ y: -8, transition: { type: "spring", stiffness: 300 } }}
    >
      {/* Soft blurred border halo matching background */}
      <div className="absolute -inset-1 rounded-3xl bg-white/60 dark:bg-gray-900/60 blur-xl pointer-events-none" />

      {/* Video play indicator overlay */}
      {!isActive && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
            <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-900 ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
            <p className="text-white text-sm mt-2 font-medium">Hover to play</p>
          </div>
        </div>
      )}
      
      <video
        ref={videoRef}
        src={story.videoUrl}
        muted
        loop
        playsInline
        preload="metadata"
        onError={handleVideoError}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 pointer-events-none rounded-2xl"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent rounded-2xl"></div>
      {/* Subtle inner border to blend with background */}
      <div className="absolute inset-0 rounded-2xl ring-1 ring-white/20 dark:ring-gray-900/20 pointer-events-none" />
      <div className="relative z-10 flex flex-col justify-end h-full p-4 sm:p-6 text-white">
        <h3 className="font-bold text-xl sm:text-2xl tracking-wide">{story.title}</h3>
        {/* Video play indicator */}
        <div className="flex items-center mt-2 text-xs sm:text-sm opacity-80">
          <div className={`w-2 h-2 rounded-full mr-2 ${isActive ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
          {isActive ? 'Playing' : 'Hover to play'}
        </div>
      </div>
    </motion.div>
  );
};

export default function CarouselCards() {
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [activeVideo, setActiveVideo] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  // measurements for precise centering and stepping
  const [step, setStep] = useState(0); // distance between consecutive cards
  const [cardWidth, setCardWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [x, setX] = useState(0); // animated x offset for the track
  const leftBtnRef = useRef<HTMLButtonElement>(null);
  const rightBtnRef = useRef<HTMLButtonElement>(null);
  const [innerLeft, setInnerLeft] = useState(0); // left boundary after left button
  const [innerWidth, setInnerWidth] = useState(0); // width between buttons' inner edges

  // Measure sizes to compute step and centering
  const measure = () => {
    if (!viewportRef.current || !trackRef.current) return;
    const cW = viewportRef.current.clientWidth;
    const items = trackRef.current.children;
    if (!items || items.length === 0) return;
    const firstEl = items[0] as HTMLElement;
    const cw = firstEl.offsetWidth;
    let s = cw;
    if (items.length >= 2) {
      const secondEl = items[1] as HTMLElement;
      // offsetLeft is relative to track and not affected by transform, safe to use
      s = secondEl.offsetLeft - firstEl.offsetLeft;
    }
    // Measure inner viewport between buttons (relative to viewport container)
    const viewportRect = viewportRef.current.getBoundingClientRect();
    const leftRect = leftBtnRef.current?.getBoundingClientRect();
    const rightRect = rightBtnRef.current?.getBoundingClientRect();
    let leftInner = 0;
    let rightInnerCoord = cW; // coordinate from viewport's left
    if (leftRect) leftInner = Math.max(0, leftRect.right - viewportRect.left);
    if (rightRect) rightInnerCoord = Math.max(0, rightRect.left - viewportRect.left);
    let iWidth = Math.max(0, rightInnerCoord - leftInner);
    if (iWidth === 0 || iWidth > cW) {
      // fallback to full container width if measurements unavailable
      leftInner = 0;
      iWidth = cW;
    }
    setContainerWidth(cW);
    setCardWidth(cw);
    setStep(s);
    setInnerLeft(leftInner);
    setInnerWidth(iWidth);
    // recenter to current index
    const centerX = leftInner + (iWidth - cw) / 2;
    setX(centerX - currentIndex * s);
  };

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle video play on hover
  const handleCardHover = (storyId: number | null) => {
    setActiveVideo(storyId);
  };

  // Compute and animate to a given index, centering the card in view
  const goToIndex = (index: number) => {
    const clamped = ((index % storiesData.length) + storiesData.length) % storiesData.length;
    setCurrentIndex(clamped);
    setActiveVideo(storiesData[clamped].id);
    // compute target x
    const cW = containerWidth || containerRef.current?.clientWidth || 0;
    const cw = cardWidth || (trackRef.current?.children[0] as HTMLElement | undefined)?.offsetWidth || 288;
    const s = step || (trackRef.current?.children[1] as HTMLElement | undefined)?.offsetLeft || cw;
    const iLeft = innerLeft;
    const iWidth = innerWidth || cW;
    const centerX = iLeft + (iWidth - cw) / 2;
    setX(centerX - clamped * s);
  };

  // Navigation functions - scroll to previous/next card
  const nextCard = () => {
    goToIndex(currentIndex + 1);
  };

  const prevCard = () => {
    goToIndex(currentIndex - 1);
  };

  // Update active video when current index changes
  useEffect(() => {
    setActiveVideo(storiesData[currentIndex].id);
  }, [currentIndex]);

  // Handle drag end to update current index
  const handleDragEnd = (event: any, info: { offset: { x: number }; velocity: { x: number } }) => {
    const threshold = 50;
    
    if (info.offset.x < -threshold || info.velocity.x < -500) {
      nextCard();
    } else if (info.offset.x > threshold || info.velocity.x > 500) {
      prevCard();
    }
  };

  return (
    <div className="font-sans w-full py-8 sm:py-12 md:py-20 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-7xl mx-auto">
        <header className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black dark:text-white">
            Explore Worlds
          </h1>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg text-gray-400">
            Drag to journey through magical landscapes.
          </p>
        </header>

        <div className="relative w-full" ref={containerRef}>
          {/* Navigation Buttons - FIXED: Made buttons functional */}
          <button
            onClick={prevCard}
            ref={leftBtnRef}
            className="absolute left-0 sm:left-2 top-1/2 -translate-y-1/2 z-30 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200"
            aria-label="Previous card"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextCard}
            ref={rightBtnRef}
            className="absolute right-0 sm:right-2 top-1/2 -translate-y-1/2 z-30 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200"
            aria-label="Next card"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div 
            ref={viewportRef}
            className="overflow-x-hidden relative mx-4 sm:mx-8 md:mx-16 pt-4 sm:pt-6"
          >
            <motion.div
              ref={trackRef}
              className="flex space-x-4 sm:space-x-6 pb-6 items-stretch cursor-grab"
              drag="x"
              dragElastic={0.1}
              onDragEnd={handleDragEnd}
              animate={{ x }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              whileTap={{ cursor: "grabbing" }}
            >
              {storiesData.map((story, index) => (
                <div
                  key={story.id}
                  onMouseEnter={() => handleCardHover(story.id)}
                  onMouseLeave={() => handleCardHover(null)}
                  onTouchStart={() => handleCardHover(story.id)}
                  onTouchEnd={() => handleCardHover(null)}
                  onClick={() => {
                    goToIndex(index);
                  }}
                  className="flex justify-center cursor-pointer"
                >
                  <StoryCard 
                    story={story} 
                    isActive={activeVideo === story.id}
                  />
                </div>
              ))}
            </motion.div>

            {/* Side gradients removed per request */}
          </div>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center space-x-3 mt-6">
          {storiesData.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                goToIndex(index);
              }}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-blue-500 scale-125' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to card ${index + 1}`}
            />
          ))}
        </div>

        <div className="mt-8 sm:mt-10 flex items-center justify-center">
          <a
            href="#"
            className="text-gray-300 font-semibold hover:text-white transition-colors duration-300 group text-sm sm:text-base"
          >
            Discover More
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1 ml-1">
              &rarr;
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}