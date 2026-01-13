'use client';

import React from 'react';

type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function RedGradientText({ children, className }: Props) {
  return (
    <span
      className={`bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-500 bg-clip-text text-transparent ${className ?? ''}`}
      style={{ backgroundImage: 'linear-gradient(to right, #ec4899, #f43f5e, #d946ef)' }}
    >
      {children}
    </span>
  );
}
