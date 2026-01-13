'use client';

import React, { useEffect, useRef, useState } from 'react';

type Props = {
  url: string;
  children: React.ReactNode;
  className?: string;
};

type LinkMetadata = {
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
};

export default function LinkPreview({ url, children, className }: Props) {
  const [open, setOpen] = useState(false);
  const [metadata, setMetadata] = useState<LinkMetadata | null>(null);
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (!open || metadata) return;
    const controller = new AbortController();
    
    // Parse URL and set metadata based on known URLs
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.toLowerCase();
      
      // Special handling for DaVinci Resolve URL
      if (hostname.includes('blackmagicdesign.com') || hostname.includes('davinciresolve')) {
        setMetadata({
          title: 'DaVinci Resolve',
          description: 'Professional video editing, color correction, and audio post-production software. Industry-leading tools for creative professionals.',
          siteName: 'Blackmagic Design',
        });
      } else {
        // Generic fallback
        setMetadata({
          title: urlObj.hostname.replace('www.', ''),
          description: `Visit ${urlObj.hostname}`,
          siteName: urlObj.hostname,
        });
      }
    } catch {
      setMetadata({
        title: 'Link Preview',
        description: url,
      });
    }
    
    return () => controller.abort();
  }, [open, url, metadata]);

  const onEnter = () => {
    if (ref.current) {
      const r = ref.current.getBoundingClientRect();
      // Place preview below the element
      setPos({ x: r.left, y: r.bottom + 8 });
    }
    setOpen(true);
  };
  const onLeave = () => setOpen(false);

  return (
    <>
      <span
        ref={ref}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        className={`relative inline-block cursor-pointer ${className ?? ''}`}
      >
        {children}
      </span>
      {open && (
        <div
          className="fixed z-20 w-[360px] max-w-[85vw] rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-2xl overflow-hidden"
          style={{ left: pos.x, top: pos.y }}
        >
          {metadata?.image && (
            <img
              src={metadata.image}
              alt={metadata.title}
              className="w-full h-40 object-cover"
            />
          )}
          <div className="p-4">
            <div className="text-sm text-black dark:text-white font-semibold mb-1">
              {metadata?.title ?? 'Loading...'}
            </div>
            {metadata?.siteName && (
              <div className="text-xs text-zinc-500 mb-2">{metadata.siteName}</div>
            )}
            <div className="text-sm text-zinc-700 dark:text-zinc-300 line-clamp-2">
              {metadata?.description ?? 'Loading preview...'}
            </div>
            <div className="text-[10px] mt-3 text-zinc-400 truncate">{url}</div>
          </div>
        </div>
      )}
    </>
  );
}
