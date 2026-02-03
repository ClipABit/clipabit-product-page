'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { IS_FILE_CHANGE_ENABLED } from '@/src/lib/demo/config';

interface VideoCardProps {
  // For repository videos
  fileName?: string;
  presignedUrl: string;
  hashedIdentifier?: string;
  // For search results
  score?: number;
  startTime?: number;
  // Actions
  onDelete?: (hashedIdentifier: string, filename: string) => void;
}

export function VideoCard({
  fileName,
  presignedUrl,
  hashedIdentifier,
  score,
  startTime,
  onDelete,
}: VideoCardProps) {
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const displayName = fileName || 'Unknown Video';

  const handleDeleteClick = () => {
    if (hashedIdentifier && onDelete) {
      onDelete(hashedIdentifier, displayName);
    }
  };

  return (
    <div className="bg-foreground/5 border border-foreground/10 rounded-xl overflow-hidden">
      {/* Video Player */}
      <div className="relative aspect-video bg-black">
        <video
          className="w-full h-full object-contain"
          src={presignedUrl}
          controls
          preload="metadata"
          {...(startTime !== undefined && startTime > 0 ? { 
            onLoadedMetadata: (e) => {
              const video = e.currentTarget;
              video.currentTime = startTime;
            }
          } : {})}
        />
      </div>

      {/* Info Section */}
      <div className="p-3">
        <div className="flex items-center gap-2">
          {/* Info Accordion Button */}
          <button
            onClick={() => setIsInfoOpen(!isInfoOpen)}
            className="flex-1 flex items-center justify-between px-3 py-2 bg-foreground/5 hover:bg-foreground/10 rounded-lg transition-colors text-left"
          >
            <span className="text-sm text-foreground/70">Info</span>
            <motion.svg
              animate={{ rotate: isInfoOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="w-4 h-4 text-foreground/50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </motion.svg>
          </button>

          {/* Delete Button */}
          {IS_FILE_CHANGE_ENABLED && hashedIdentifier && onDelete && (
            <button
              onClick={handleDeleteClick}
              className="p-2 bg-foreground/5 hover:bg-red-500/20 rounded-lg transition-colors group"
              title={`Delete ${displayName}`}
            >
              <svg
                className="w-5 h-5 text-foreground/50 group-hover:text-red-500 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Expandable Info Content */}
        <AnimatePresence>
          {isInfoOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="pt-3 space-y-1">
                <p className="text-sm text-foreground/60">
                  <span className="font-medium text-foreground/80">File:</span>{' '}
                  <span className="break-all">{displayName}</span>
                </p>
                {score !== undefined && (
                  <p className="text-sm text-foreground/60">
                    <span className="font-medium text-foreground/80">Score:</span>{' '}
                    {score.toFixed(2)}
                  </p>
                )}
                {startTime !== undefined && startTime > 0 && (
                  <p className="text-sm text-foreground/60">
                    <span className="font-medium text-foreground/80">Start:</span>{' '}
                    {startTime.toFixed(1)}s
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
