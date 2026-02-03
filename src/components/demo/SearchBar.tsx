'use client';

import { useCallback, KeyboardEvent } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
  onClear: () => void;
  isSearching?: boolean;
  hasResults?: boolean;
}

export function SearchBar({
  value,
  onChange,
  onSearch,
  onClear,
  isSearching = false,
  hasResults = false,
}: SearchBarProps) {
  const handleSearch = useCallback(() => {
    if (value.trim() && !isSearching) {
      onSearch(value.trim());
    }
  }, [value, isSearching, onSearch]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        handleSearch();
      }
    },
    [handleSearch]
  );

  const handleClear = useCallback(() => {
    onClear();
  }, [onClear]);

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search Input Container - flex on mobile to keep button inline */}
      <div className="flex-1 relative flex items-stretch gap-2 sm:block">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type to search..."
          className="w-full px-4 py-3 pr-12 sm:pr-4 bg-foreground/5 border border-foreground/10 rounded-xl text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          disabled={isSearching}
        />
        {/* Search icon - hidden on mobile, shown on desktop */}
        <div className="hidden sm:block absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg
            className="w-5 h-5 text-foreground/30"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        
        {/* Mobile Search Icon Button */}
        <button
          onClick={handleSearch}
          disabled={isSearching || !value.trim()}
          className="sm:hidden flex-shrink-0 w-12 flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          title="Search"
        >
          {isSearching ? (
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Action Buttons - Desktop only */}
      <div className="hidden sm:flex gap-2">
        {/* Search Button */}
        <button
          onClick={handleSearch}
          disabled={isSearching || !value.trim()}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
        >
          {isSearching ? (
            <>
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>Searching...</span>
            </>
          ) : (
            'Search'
          )}
        </button>

        {/* Clear Button - only show when there are results */}
        {hasResults && (
          <button
            onClick={handleClear}
            className="px-6 py-3 bg-foreground/10 hover:bg-foreground/20 text-foreground font-medium rounded-xl transition-all"
          >
            Clear
          </button>
        )}
      </div>

      {/* Mobile Clear Button - show below search bar if needed */}
      {hasResults && (
        <button
          onClick={handleClear}
          className="sm:hidden px-4 py-2 bg-foreground/10 hover:bg-foreground/20 text-foreground font-medium rounded-xl transition-all text-sm self-start"
        >
          Clear
        </button>
      )}
    </div>
  );
}
