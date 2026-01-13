'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { useTheme } from '../../lib/theme';
import { useLoading } from '../../lib/loading-context';

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const { setIsLoading: setLoadingContext } = useLoading();
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState(0);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
    // Ensure page starts at top
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }

    // Animate progress bar (video export simulation)
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        // Simulate video export: slower at start, faster in middle, slower at end
        const increment = prev < 20 ? 0.5 : prev < 80 ? 2 : 0.8;
        return Math.min(prev + increment, 100);
      });
    }, 30);

    // Complete loading after progress reaches 100%
    const completeTimer = setTimeout(() => {
      setIsLoading(false);
      setLoadingContext(false);
      // Scroll to top after loading screen
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, 3500); // Total ~3.5 seconds

    // Also check if page is fully loaded
    if (typeof window !== 'undefined') {
      if (document.readyState === 'complete') {
        setTimeout(() => {
          setIsLoading(false);
          setLoadingContext(false);
          window.scrollTo({ top: 0, behavior: 'instant' });
        }, 3000);
      } else {
        window.addEventListener('load', () => {
          setTimeout(() => {
            setIsLoading(false);
            setLoadingContext(false);
            window.scrollTo({ top: 0, behavior: 'instant' });
          }, 3000);
        });
      }
    }

    return () => {
      clearInterval(progressInterval);
      clearTimeout(completeTimer);
    };
  }, []);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--background)]"
        >
          <div className="flex flex-col items-center justify-center">
            {/* Magnifying glass animation with play button */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 1,
              }}
              transition={{ 
                duration: 0.6, 
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative flex items-center justify-center"
            >
              {/* Magnifying glass zoom/search animation - moves like searching */}
              <motion.div
                animate={progress < 95 ? {
                  scale: [1, 1.15, 1, 1.08, 1],
                  x: [0, 15, -15, 10, 0],
                  y: [0, -8, 8, -5, 0],
                  rotate: [0, 3, -3, 2, 0],
                } : {
                  scale: 1,
                  x: 0,
                  y: 0,
                  rotate: 0,
                }}
                transition={{
                  duration: progress < 95 ? 2.5 : 0.3,
                  repeat: progress < 95 ? Infinity : 0,
                  ease: 'easeInOut',
                }}
                className="relative"
              >
                <motion.div
                  animate={progress >= 95 ? {
                    scale: [1, 0.88, 0.92, 1],
                  } : {}}
                  transition={{
                    duration: 0.5,
                    delay: progress >= 95 ? 0.2 : 0,
                    ease: 'easeInOut',
                  }}
                >
                  <Image
                    src={theme === 'dark' ? '/play2.svg' : '/play1.svg'}
                    alt="Play Button"
                    width={86}
                    height={96}
                    className="w-24 md:w-32 h-auto"
                    priority
                  />
                </motion.div>
                
                {/* Cursor that appears and presses the play button when loading completes */}
                {progress >= 95 && (
                  <motion.div
                    initial={{ opacity: 0, x: -30, y: -30 }}
                    animate={{ 
                      opacity: [0, 1, 1, 0],
                      x: [-30, -5, -5, -30],
                      y: [-30, -5, -5, -30],
                    }}
                    transition={{ 
                      duration: 0.8,
                      ease: 'easeInOut',
                    }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10"
                  >
                    {/* Cursor pointer */}
                    <motion.svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      animate={{
                        y: [0, 8, 0],
                      }}
                      transition={{
                        duration: 0.4,
                        repeat: 1,
                        ease: 'easeInOut',
                        delay: 0.2,
                      }}
                    >
                      <path
                        d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z"
                        fill="currentColor"
                        className="text-gray-800 dark:text-gray-200"
                      />
                    </motion.svg>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>

            {/* Video export style progress bar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="mt-12 w-80 md:w-96"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  Exporting video...
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  {Math.round(progress)}%
                </span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#FAAF04] via-[#FF6B35] to-[#FAAF04] rounded-full relative"
                  initial={{ width: '0%' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.1, ease: 'linear' }}
                >
                  {/* Shimmer effect for video export feel */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{
                      x: ['-100%', '200%'],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
