'use client';

import React, { useEffect, useRef, useState } from 'react';

type Props = {
  word: string;
  children: React.ReactNode;
};

type Definition = {
  partOfSpeech?: string;
  definition?: string;
  phonetic?: string;
};

export default function HoverDefinition({ word, children }: Props) {
  const [open, setOpen] = useState(false);
  const [defn, setDefn] = useState<Definition | null>(null);
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (!open || defn) return;
    const controller = new AbortController();
    // Use a free dictionary API to populate preview content
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`, {
      signal: controller.signal,
    })
      .then((r) => r.json())
      .then((json) => {
        try {
          const entry = json?.[0];
          const phon = entry?.phonetic ?? entry?.phonetics?.[0]?.text;
          const meaning = entry?.meanings?.[0];
          const def = meaning?.definitions?.[0]?.definition;
          const part = meaning?.partOfSpeech;
          setDefn({ definition: def, phonetic: phon, partOfSpeech: part });
        } catch {
          setDefn(null);
        }
      })
      .catch(() => { });
    return () => controller.abort();
  }, [open, word, defn]);

  const onEnter = () => {
    if (ref.current) {
      const r = ref.current.getBoundingClientRect();
      // Place preview slightly below and to the right of the word
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
        className="relative inline-block"
      >
        {children}
      </span>
      {open && (
        <div
          className="fixed z-20 w-[320px] max-w-[85vw] rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-2xl p-4"
          style={{ left: pos.x, top: pos.y }}
        >
          <div className="text-sm text-black dark:text-white font-semibold">
            {word}
            {defn?.phonetic ? <span className="text-zinc-500 ml-2">{defn.phonetic}</span> : null}
          </div>
          {defn?.partOfSpeech ? (
            <div className="text-xs text-zinc-500 mt-0.5">{defn.partOfSpeech}</div>
          ) : null}
          <div className="text-sm mt-2 text-zinc-700 dark:text-zinc-300">
            {defn?.definition ?? 'Loading definition…'}
          </div>
          <div className="text-[10px] mt-3 text-zinc-400">Preview (dictionaryapi.dev)</div>
        </div>
      )}
    </>
  );
}

