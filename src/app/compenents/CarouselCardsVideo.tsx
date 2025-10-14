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
      className="relative w-64 h-80 sm:w-72 sm:h-96 flex-shrink-0 rounded-2xl overflow-hidden shadow-2xl group mx-2"
      whileHover={{ y: -8, scale: 1.02, transition: { type: "spring", stiffness: 300 } }}
    >
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

  useEffect(() => {
    const calculateConstraints = () => {
      if (containerRef.current && trackRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const trackWidth = trackRef.current.scrollWidth;
        // Calculate the maximum drag constraint to show all cards
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

  return (
    <div className="font-sans w-full py-8 sm:py-12 md:py-20 flex flex-col items-center justify-center">
      <div className="w-full max-w-7xl mx-auto px-4">
        <header className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black dark:text-white">
            Explore Our Products
          </h1>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg text-gray-400">
             
          </p>
        </header>

        <div 
          ref={containerRef}
          className="overflow-hidden cursor-grab relative"
        >
          <motion.div
            ref={trackRef}
            className="flex space-x-4 sm:space-x-6 pb-6"
            drag="x"
            dragConstraints={{
              right: 0,
              left: dragConstraint,
            }}
            dragElastic={0.2}
            // Add padding to ensure all cards are visible when dragging to extremes
            style={{ 
              paddingLeft: 'calc(50% - 8rem)',
              paddingRight: 'calc(50% - 8rem)'
            }}
            whileTap={{ cursor: "grabbing" }}
          >
            {storiesData.map((story) => (
              <div
                key={story.id}
                onMouseEnter={() => handleCardHover(story.id)}
                onMouseLeave={() => handleCardHover(null)}
                onTouchStart={() => handleCardHover(story.id)}
                onTouchEnd={() => handleCardHover(null)}
                className="flex justify-center"
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

        <div className="mt-8 sm:mt-10 flex items-center justify-center">
          <a
            href="#"
            className="text-gray-300 font-semibold hover:text-white transition-colors duration-300 group text-sm sm:text-base"
          >
            Make Order Now
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1 ml-1">
              &rarr;
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}