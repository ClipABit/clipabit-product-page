'use client';

import React from 'react';

type Props = {
  text: string;
  className?: string;
};

export default function GreenGradientText({ text, className }: Props) {
  return (
    <span
      className={`bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 bg-clip-text text-transparent ${className ?? ''}`}
      style={{ backgroundImage: 'linear-gradient(to right, #10b981, #22c55e, #059669)' }}
    >
      {text}
    </span>
  );
}
