"use client";
import React, { useCallback } from "react";

function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export const Highlight = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <span
      className={cn(
        "group/highlight relative inline-block font-bold px-1 py-0.5 rounded-sm transition-all duration-500",
        className
      )}
      style={{ fontFamily: '-apple-system, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}
    >
      <span className="absolute inset-0 rounded-sm opacity-0 group-hover/highlight:opacity-100 transition-opacity duration-500" style={{ backgroundColor: '#fbbf24' }}></span>
      <span className="relative z-10 text-black dark:text-white transition-colors duration-500">
        {children}
      </span>
    </span>
  );
};

export const HeroHighlight = ({
  children,
  className,
  containerClassName,
}: {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
}) => {
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = e.currentTarget;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      el.style.setProperty("--mouse-x", `${x}px`);
      el.style.setProperty("--mouse-y", `${y}px`);
    },
    []
  );

  return (
    <div
      onMouseMove={handleMouseMove}
      className={cn(
        "group relative rounded-xl bg-transparent dark:bg-transparent",
        containerClassName || "p-4"
      )}
      style={
        {
          ["--mouse-x"]: "50%",
          ["--mouse-y"]: "50%",
        } as React.CSSProperties
      }
    >
      <div className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div
          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"
          style={{
            background:
              "radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(29, 78, 216, 0.15), transparent 40%)",
          }}
        />
      </div>
      <div className={cn("relative z-10", className)}>{children}</div>
    </div>
  );
};
