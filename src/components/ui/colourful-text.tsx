'use client';

import React from 'react';

type Props = {
  text: string;
  className?: string;
};

export default function ColourfulText({ text, className }: Props) {
  return (
    <span className={`relative inline-block bg-clip-text text-transparent ${className ?? ''}`}>
      <span className="bg-[length:200%_200%] bg-gradient-to-r from-pink-500 via-orange-400 via-yellow-400 via-emerald-400 via-sky-400 to-fuchsia-500 animate-[rainbow_6s_ease_infinite] bg-clip-text text-transparent">
        {text}
      </span>
      <style jsx>{`
        @keyframes rainbow {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </span>
  );
}

