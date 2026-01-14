'use client';

import React, { useEffect, useMemo, useState } from 'react';

type Props = {
  words?: string[];
  intervalMs?: number;
  className?: string;
};

/**
 * A lightweight gooey-like text morph (no external deps).
 * Uses an SVG filter and cross-fades two layers while slightly blurring them.
 */
export default function GooeyTextMorph({
  words = ['faster', 'smarter', 'easier'],
  intervalMs = 1600,
  className,
}: Props) {
  const [index, setIndex] = useState(0);
  const next = (index + 1) % words.length;

  useEffect(() => {
    const id = setInterval(() => setIndex(i => (i + 1) % words.length), intervalMs);
    return () => clearInterval(id);
  }, [words.length, intervalMs]);

  const filterId = useMemo(() => `gooey-${Math.random().toString(36).slice(2)}`, []);

  return (
    <span className={`inline-block relative tracking-tight ${className ?? ''}`}>
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <filter id={filterId}>
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.8" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 6 -3"
            result="goo"
          />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </svg>
      <span
        style={{
          filter: `url(#${filterId})`,
        }}
        className="relative inline-flex"
      >
        <span key={index} className="transition-all duration-500">{words[index]}</span>
      </span>
    </span>
  );
}

