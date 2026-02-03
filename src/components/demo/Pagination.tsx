'use client';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalVideos: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  isLoading: boolean;
  onPrev: () => void;
  onNext: () => void;
}

export function Pagination({
  currentPage,
  totalPages,
  totalVideos,
  hasNextPage,
  hasPrevPage,
  isLoading,
  onPrev,
  onNext,
}: PaginationProps) {
  const displayPage = totalPages > 0 ? currentPage : 0;
  const videoSuffix = totalVideos === 1 ? 'video' : 'videos';

  return (
    <div className="flex items-center justify-between gap-4">
      {/* Page Info */}
      <div className="text-foreground/70 text-sm sm:text-base">
        <span className="font-medium">
          Page {displayPage} of {totalPages}
        </span>
        <span className="mx-2">•</span>
        <span>
          {totalVideos} {videoSuffix}
        </span>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center gap-2">
        {/* Previous Button */}
        <button
          onClick={onPrev}
          disabled={!hasPrevPage || isLoading}
          className="p-2 sm:px-4 sm:py-2 bg-foreground/10 hover:bg-foreground/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-1"
          aria-label="Previous page"
        >
          <svg
            className="w-5 h-5 text-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span className="hidden sm:inline text-foreground font-medium">Prev</span>
        </button>

        {/* Next Button */}
        <button
          onClick={onNext}
          disabled={!hasNextPage || isLoading}
          className="p-2 sm:px-4 sm:py-2 bg-foreground/10 hover:bg-foreground/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-1"
          aria-label="Next page"
        >
          <span className="hidden sm:inline text-foreground font-medium">Next</span>
          <svg
            className="w-5 h-5 text-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
