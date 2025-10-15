'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Frame as FrameIcon, Palette } from 'lucide-react';

export default function TabsViewClassic() {
  const [activeTab, setActiveTab] = useState(1);
  const [isHovering, setIsHovering] = useState<number | null>(null);

  const tabs = [
    {
      id: 1,
      name: 'LED',
      icon: <Lightbulb className='w-8 h-8' />,
      color: 'bg-blue-600',
      content:
        'Integrated LED with presence detector: the light turns on automatically when you enter the room for an effortless, welcoming glow.',
    },
    {
      id: 2,
      name: 'Frame',
      icon: <FrameIcon className='w-8 h-8' />,
      color: 'bg-blue-600',
      content:
        'Solid wooden frame for durability and a premium finish — built to protect and showcase your piece beautifully.',
    },
    {
      id: 3,
      name: 'Artwork Base',
      icon: <Palette className='w-8 h-8' />,
      color: 'bg-blue-600',
      content:
        'High‑quality UV-printed background for crisp color and detail, plus a mini metal card (iron) for an authentic, premium touch.',
    },
  ];

  return (
    <div className='w-full max-w-2xl mx-auto'>
      {/* Tabs layout with cards */}
      <div className='grid grid-cols-3 gap-4 mb-8'>
        {tabs.map((tab) => (
          <motion.div
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            onMouseEnter={() => setIsHovering(tab.id)}
            onMouseLeave={() => setIsHovering(null)}
            tabIndex={0}
            className={`relative overflow-hidden rounded-xl cursor-pointer border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white border-blue-600 shadow-lg'
                : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 shadow'
            }`}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.98 }}
            layout
          >
            <div
              className={`p-4 flex flex-col items-center justify-center aspect-[4/3] ${
                activeTab === tab.id
                  ? 'text-white'
                  : 'text-gray-900 dark:text-gray-100'
              }`}
            >
              <motion.div
                className='text-4xl mb-2'
                initial={false}
                animate={{
                  scale:
                    isHovering === tab.id || activeTab === tab.id ? 1.2 : 1,
                  rotate:
                    isHovering === tab.id && activeTab !== tab.id ? 10 : 0,
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                {tab.icon}
              </motion.div>
              <span className='font-medium tracking-wide text-center'>
                {tab.name}
              </span>
            </div>

            {isHovering === tab.id && activeTab !== tab.id && (
              <motion.div
                className='absolute inset-0 bg-blue-500/10'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            )}
          </motion.div>
        ))}
      </div>

      {/* Content Area with dynamic colors based on active tab */}
      <AnimatePresence mode='wait'>
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className='relative overflow-hidden rounded-xl p-6 bg-white dark:bg-gray-900 shadow-lg border-t-4 border-blue-600 dark:border-blue-500'
        >
          <div className='absolute top-0 right-0 p-2 flex items-center justify-center'>
            <motion.div
              className='text-2xl opacity-50'
              animate={{
                rotate: [0, 10, 0, -10, 0],
                scale: [1, 1.2, 1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                ease: 'easeInOut',
                repeat: Infinity,
                repeatDelay: 3,
              }}
            >
              {tabs.find((t) => t.id === activeTab)?.icon}
            </motion.div>
          </div>

          <h3 className='text-xl font-bold mb-4 text-gray-900 dark:text-white'>
            {tabs.find((t) => t.id === activeTab)?.name}
          </h3>

          <div className='prose dark:prose-invert'>
            <p>{tabs.find((t) => t.id === activeTab)?.content}</p>
          </div>

          
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
