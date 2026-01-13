"use client";

import * as React from "react";

function cn(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(" ");
}

interface GooeyTextProps {
  texts: string[];
  interval?: number;
  className?: string;
  textClassName?: string;
}

export function GooeyText({
  texts,
  interval = 2000,
  className,
  textClassName
}: GooeyTextProps) {
  const textRef = React.useRef<HTMLSpanElement>(null);
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    if (texts.length === 0) return;

    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
    }, interval);

    return () => {
      clearInterval(intervalId);
    };
  }, [texts, interval]);

  React.useEffect(() => {
    if (textRef.current) {
      textRef.current.textContent = texts[currentIndex];
    }
  }, [currentIndex, texts]);

  return (
    <div className={cn("relative", className)}>
      <div className="flex items-center justify-center">
        <span
          ref={textRef}
          className={cn(
            "inline-block select-none text-center text-6xl md:text-[60pt]",
            "text-foreground",
            textClassName
          )}
        />
      </div>
    </div>
  );
}

