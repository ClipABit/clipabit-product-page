"use client";

import * as React from "react";

function cn(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(" ");
}

interface GooeyTextProps {
  texts: string[];
  morphTime?: number;
  cooldownTime?: number;
  className?: string;
  textClassName?: string;
}

export function GooeyText({
  texts,
  morphTime = 1,
  cooldownTime = 0.25,
  className,
  textClassName
}: GooeyTextProps) {
  const text1Ref = React.useRef<HTMLSpanElement>(null);
  const text2Ref = React.useRef<HTMLSpanElement>(null);
  const [current, setCurrent] = React.useState<string>(texts?.[0] ?? '');

  React.useEffect(() => {
    let textIndex = 0;
    let time = new Date();
    let morph = 0; // tracks morph progress (0 to morphTime)
    let cooldown = cooldownTime; // pause before starting next morph
    let isMorphing = false; // true when morphing, false when in cooldown

    const setMorph = (fraction: number) => {
      if (text1Ref.current && text2Ref.current) {
        // text2 is the new text coming in
        text2Ref.current.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
        text2Ref.current.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

        // text1 is the old text going out
        const oldFraction = 1 - fraction;
        text1Ref.current.style.filter = `blur(${Math.min(8 / oldFraction - 8, 100)}px)`;
        text1Ref.current.style.opacity = `${Math.pow(oldFraction, 0.4) * 100}%`;
      }
    };

    function animate() {
      requestAnimationFrame(animate);
      const newTime = new Date();
      const dt = (newTime.getTime() - time.getTime()) / 1000;
      time = newTime;

      if (isMorphing) {
        // Currently morphing - increment morph progress
        morph += dt;
        const fraction = Math.min(morph / morphTime, 1);

        if (fraction >= 1) {
          // Morph complete - text2 is now fully visible showing texts[textIndex + 1]
          setMorph(1);
          
          // Update text index to the new text (which is now visible in text2)
          textIndex = (textIndex + 1) % texts.length;
          setCurrent(texts[textIndex]);
          
          // Swap roles invisibly: text1 gets text2's content (the new visible text), text2 prepares for next
          // Since text2 is fully visible, we swap content without visual change
          if (text1Ref.current && text2Ref.current) {
            // Store text2's content (the newly visible text)
            const newText = text2Ref.current.textContent;
            // text1 now shows the text that was in text2 (the newly visible one)
            text1Ref.current.textContent = newText || texts[textIndex];
            // text2 prepares for the next morph (but stays hidden)
            text2Ref.current.textContent = texts[(textIndex + 1) % texts.length];
            
            // Reset visual state: text1 visible (with new text), text2 hidden
            text1Ref.current.style.filter = "";
            text1Ref.current.style.opacity = "100%";
            text2Ref.current.style.filter = "";
            text2Ref.current.style.opacity = "0%";
          }
          
          // Switch to cooldown
          morph = 0;
          isMorphing = false;
          cooldown = cooldownTime;
        } else {
          setMorph(fraction);
        }
      } else {
        // In cooldown - keep text stable, don't change anything
        cooldown -= dt;
        
        if (cooldown <= 0) {
          // Cooldown complete - prepare for morph (text2 gets next text while hidden)
          if (text1Ref.current && text2Ref.current) {
            // Ensure text1 shows current text (should already be correct)
            text1Ref.current.textContent = texts[textIndex];
            // text2 gets next text (but stays hidden until morph starts)
            text2Ref.current.textContent = texts[(textIndex + 1) % texts.length];
            
            // Ensure initial morph state: text1 visible, text2 hidden
            text1Ref.current.style.filter = "";
            text1Ref.current.style.opacity = "100%";
            text2Ref.current.style.filter = "";
            text2Ref.current.style.opacity = "0%";
          }
          
          // Start morphing
          isMorphing = true;
          morph = 0;
        }
      }
    }

    // Initialize
    if (text1Ref.current && text2Ref.current) {
      text1Ref.current.textContent = texts[0];
      text2Ref.current.textContent = texts[1 % texts.length];
      setCurrent(texts[0]);
      // Set initial state: text1 visible, text2 hidden
      text1Ref.current.style.filter = "";
      text1Ref.current.style.opacity = "100%";
      text2Ref.current.style.filter = "";
      text2Ref.current.style.opacity = "0%";
    }

    animate();

    return () => {
      // Cleanup if ever needed
    };
  }, [texts, morphTime, cooldownTime]);

  return (
    <div className={cn("relative", className)}>
      <svg className="absolute h-0 w-0" aria-hidden="true" focusable="false">
        <defs>
          <filter id="threshold">
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 255 -140"
            />
          </filter>
        </defs>
      </svg>

      <div
        className="flex items-center justify-center"
        style={{ filter: "url(#threshold)" }}
      >
        {/* Sizer element to allow inline width equal to current text */}
        <span
          aria-hidden="true"
          className={cn("invisible whitespace-pre", textClassName ?? "text-6xl md:text-[60pt]")}
        >
          {current}
        </span>
        {/*
          When textClassName is provided, use it as the sole size class so the component
          can fit inline sentences. Otherwise fall back to large demo sizes.
        */}
        {(() => {
          const size = textClassName ?? "text-6xl md:text-[60pt]";
          return (
            <>
              <span
                ref={text1Ref}
                className={cn(
                  "absolute inline-block select-none text-center",
                  size,
                  "text-foreground"
                )}
              />
              <span
                ref={text2Ref}
                className={cn(
                  "absolute inline-block select-none text-center",
                  size,
                  "text-foreground"
                )}
              />
            </>
          );
        })()}
      </div>
    </div>
  );
}

