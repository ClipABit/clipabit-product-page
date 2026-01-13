'use client';

import React from 'react';

type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function GradientText({ children, className }: Props) {
  return (
    <span
      className={`bg-gradient-to-r from-zinc-400 via-zinc-500 to-zinc-700 dark:from-zinc-200 dark:via-zinc-300 dark:to-zinc-500 bg-clip-text text-transparent ${className ?? ''}`}
    >
      {children}
    </span>
  );
}

