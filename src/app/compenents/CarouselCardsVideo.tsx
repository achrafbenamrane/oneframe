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
      className={`relative w-64 h-80 sm:w-72 sm:h-96 flex-shrink-0 rounded-2xl overflow-hidden shadow-2xl group mx-2 transition-all duration-300 ${
        isActive ? 'ring-4 ring-blue-500 shadow-2xl scale-105' : 'shadow-lg'
      }`}
      whileHover={{ y: -8, scale: 1.02, transition: { type: "spring", stiffness: 300 } }}
    >
      {/* Video play indicator overlay */}
      {!isActive && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
            <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-900 ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
            <p className="text-white text-sm mt-2 font-medium">Click to play</p>
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
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 pointer-events-none rounded-2xl"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent rounded-2xl"></div>
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
  const [dragConstraint, setDragConstraint] = useState(0);
  const [activeVideo, setActiveVideo] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const calculateConstraints = () => {
      if (containerRef.current && trackRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const trackWidth = trackRef.current.scrollWidth;
        // Calculate proper constraint to allow full scrolling
        const constraint = containerWidth - trackWidth;
        setDragConstraint(constraint);
      }
    };

    calculateConstraints();
    window.addEventListener("resize", calculateConstraints);

    return () => window.removeEventListener("resize", calculateConstraints);
  }, []);

  // Handle video play on hover
  const handleCardHover = (storyId: number | null) => {
    setActiveVideo(storyId);
  };

  // Navigation functions
  const nextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % storiesData.length);
  };

  const prevCard = () => {
    setCurrentIndex((prev) => (prev - 1 + storiesData.length) % storiesData.length);
  };

  // Update active video when current index changes
  useEffect(() => {
    setActiveVideo(storiesData[currentIndex].id);
  }, [currentIndex]);

  return (
    <div className="font-sans w-full py-8 sm:py-12 md:py-20 flex flex-col items-center justify-center">
      <div className="w-full max-w-7xl mx-auto px-4">
        <header className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black dark:text-white">
            Explore Worlds
          </h1>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg text-gray-400">
            Drag to journey through magical landscapes.
          </p>
        </header>

        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={prevCard}
            className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 z-30 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200"
            aria-label="Previous card"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextCard}
            className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 z-30 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200"
            aria-label="Next card"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div 
            ref={containerRef}
            className="overflow-hidden cursor-grab relative mx-10 sm:mx-12"
          >
            <motion.div
              ref={trackRef}
              className="flex space-x-4 sm:space-x-6 pb-6"
              drag="x"
              dragConstraints={{
                right: 0,
                left: dragConstraint,
              }}
              dragElastic={0.1}
              onDragEnd={(event, info) => {
                // Simple swipe detection
                if (info.offset.x < -50) {
                  nextCard();
                } else if (info.offset.x > 50) {
                  prevCard();
                }
              }}
              style={{ 
                paddingLeft: 'calc(50% - 8rem)',
                paddingRight: 'calc(50% - 8rem)'
              }}
              whileTap={{ cursor: "grabbing" }}
            >
              {storiesData.map((story, index) => (
                <div
                  key={story.id}
                  onMouseEnter={() => handleCardHover(story.id)}
                  onMouseLeave={() => handleCardHover(null)}
                  onTouchStart={() => handleCardHover(story.id)}
                  onTouchEnd={() => handleCardHover(null)}
                  onClick={() => setCurrentIndex(index)}
                  className="flex justify-center cursor-pointer"
                >
                  <StoryCard 
                    story={story} 
                    isActive={activeVideo === story.id}
                  />
                </div>
              ))}
            </motion.div>

            {/* Gradient overlays to indicate more content */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white dark:from-gray-900 to-transparent pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white dark:from-gray-900 to-transparent pointer-events-none"></div>
          </div>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center space-x-3 mt-6">
          {storiesData.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
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