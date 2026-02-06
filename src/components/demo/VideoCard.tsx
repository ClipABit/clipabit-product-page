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
  // Raw data for debug info
  rawData?: Record<string, unknown>;
  // Actions
  onDelete?: (hashedIdentifier: string, filename: string) => void;
}

export function VideoCard({
  fileName,
  presignedUrl,
  hashedIdentifier,
  score,
  startTime,
  rawData,
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
    <>
      <div className="bg-foreground/5 border border-foreground/10 rounded-xl overflow-hidden">
        {/* Video Player with overlay buttons */}
        <div className="relative aspect-video bg-black group">
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
          
          {/* Overlay buttons - top right corner */}
          {IS_FILE_CHANGE_ENABLED && (
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {/* Info Button */}
              <button
                onClick={() => setIsInfoOpen(true)}
                className="w-8 h-8 flex items-center justify-center bg-black/60 hover:bg-black/80 rounded-full transition-colors"
                title="Video Info"
              >
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
              
              {/* Delete Button */}
              {hashedIdentifier && onDelete && (
                <button
                  onClick={handleDeleteClick}
                  className="w-8 h-8 flex items-center justify-center bg-black/60 hover:bg-red-500/80 rounded-full transition-colors"
                  title={`Delete ${displayName}`}
                >
                  <svg
                    className="w-4 h-4 text-white"
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
          )}
        </div>

        {/* File name label */}
        <div className="px-3 py-2">
          <p className="text-sm text-foreground/70 truncate" title={displayName}>
            {displayName}
          </p>
          {score !== undefined && (
            <p className="text-xs text-foreground/50">Score: {score.toFixed(2)}</p>
          )}
        </div>
      </div>

      {/* Info Dialog */}
      <AnimatePresence>
        {isInfoOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsInfoOpen(false)}
            />

            {/* Dialog */}
            <motion.div
              className="relative w-full max-w-3xl mx-4 bg-background border border-foreground/10 rounded-2xl shadow-2xl overflow-hidden max-h-[80vh] flex flex-col"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-foreground/10">
                <h2 className="text-lg font-semibold text-foreground">Video Debug Info</h2>
                <button
                  onClick={() => setIsInfoOpen(false)}
                  className="p-2 hover:bg-foreground/10 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-foreground/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto space-y-4">
                {/* Basic Info */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-foreground/80">Basic Info</h3>
                  <div className="bg-foreground/5 rounded-lg p-3 space-y-1">
                    <InfoRow label="File Name" value={displayName} />
                    {hashedIdentifier && <InfoRow label="Hashed ID" value={hashedIdentifier} />}
                    {score !== undefined && <InfoRow label="Score" value={score.toFixed(4)} />}
                    {startTime !== undefined && <InfoRow label="Start Time" value={`${startTime.toFixed(2)}s`} />}
                  </div>
                </div>

                {/* Presigned URL */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-foreground/80">Presigned URL</h3>
                  <div className="bg-foreground/5 rounded-lg p-3">
                    <p className="text-xs text-foreground/60 break-all font-mono">{presignedUrl}</p>
                  </div>
                </div>

                {/* Raw Data */}
                {rawData && Object.keys(rawData).length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-foreground/80">Raw Backend Data</h3>
                    <div className="bg-black/20 dark:bg-black/40 rounded-lg border border-foreground/10 overflow-hidden">
                      <div className="overflow-x-auto">
                        <pre className="text-xs text-foreground/70 p-4 font-mono leading-relaxed">
                          <code className="whitespace-pre">
                            {JSON.stringify(rawData, null, 2)}
                          </code>
                        </pre>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-foreground/10">
                <button
                  onClick={() => setIsInfoOpen(false)}
                  className="w-full py-2 bg-foreground/10 hover:bg-foreground/20 text-foreground font-medium rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-xs text-foreground/50">{label}</span>
      <span className="text-xs text-foreground/70 text-right break-all">{value}</span>
    </div>
  );
}
