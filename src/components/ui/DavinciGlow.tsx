'use client';

import Image from 'next/image';
import React, { useRef, useState } from 'react';

type Props = {
  src: string;
  width: number;
  height: number;
  className?: string;
};

export default function DavinciGlow({ src, width, height, className }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [rx, setRx] = useState(0);
  const [ry, setRy] = useState(0);
  const [hovered, setHovered] = useState(false);

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5..0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    // Increased multiplier for more intense tilt and sensitivity
    const rotateY = x * 70; // degrees - more intense and sensitive
    const rotateX = -y * 70;
    setRy(rotateY);
    setRx(rotateX);
    el.style.setProperty('--mx', `${(x + 0.5) * 100}%`);
    el.style.setProperty('--my', `${(y + 0.5) * 100}%`);
  }

  function onLeave() {
    setRx(0);
    setRy(0);
    setHovered(false);
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--mx', `50%`);
    el.style.setProperty('--my', `50%`);
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={onLeave}
      className={`relative select-none [perspective:800px] ${className ?? ''}`}
      style={
        {
          ['--mx' as any]: '50%',
          ['--my' as any]: '50%',
        } as React.CSSProperties
      }
    >
      {/* Yellow glow - only visible when hovered */}
      {hovered && (
        <div
          className="pointer-events-none absolute inset-0 rounded-full transition-opacity duration-150"
          style={{
            opacity: 1,
            transform: `rotateX(${rx}deg) rotateY(${ry}deg) translateZ(30px)`,
            transformStyle: 'preserve-3d',
            background: 'radial-gradient(260px circle at var(--mx) var(--my), rgba(250,175,4,0.28), transparent 60%)',
            filter: 'blur(18px)',
          }}
        />
      )}
      <div
        className="relative rounded-xl transition-transform duration-75 will-change-transform drop-shadow-[0_8px_24px_rgba(0,0,0,0.35)]"
        style={{ transform: `rotateX(${rx}deg) rotateY(${ry}deg) translateZ(20px)`, transformStyle: 'preserve-3d' }}
      >
        <Image
          src={src}
          alt="Davinci Logo"
          width={width}
          height={height}
          className="w-full h-auto"
          priority
        />
      </div>
    </div>
  );
}

