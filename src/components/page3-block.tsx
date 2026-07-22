"use client";

import { useEffect, useRef } from "react";
import { ScrambleGroup } from "@/lib/typer/typer";

const LINES = [
  "Coord gives agents",
  "one shared memory",
];

export default function Page3Block() {
  const containerRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<ScrambleGroup | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const containerEl: HTMLDivElement = container;

    const els = [
      ...containerEl.querySelectorAll<HTMLElement>("[data-sc]"),
    ];
    if (!els.length) return;

    const group = new ScrambleGroup(
      els,
      {
        maxFrame: 90,
        accentWords: new Set(["Coord", "shared", "memory"]),
      },
      0.2,
    );
    groupRef.current = group;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          group.go();
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(container);

    return () => {
      io.disconnect();
      group.destroy();
      groupRef.current = null;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative z-10 w-full h-full flex items-center justify-center px-4 md:px-8 leading-none select-none"
      style={
        {
          "--sc-fg": "#18181b",
          "--sc-bg": "#fafafa",
          "--sc-accent": "#007a55",
          "--sc-accent-ink": "#fafafa",
        } as React.CSSProperties
      }
    >
      <div className="relative z-10 max-w-4xl flex flex-col items-center gap-6">
        {LINES.map((line) => (
          <div
            key={line}
            data-sc="idle"
            className="font-mono text-[clamp(1.75rem,7vw,5rem)] font-medium tracking-tighter text-center leading-tight"
          >
            {line}
          </div>
        ))}

        {/* terminals row */}
        <div className="flex items-center w-full justify-center mt-4">
          {/* left terminal — Claude Code */}
          <div className="w-[clamp(132px,22vw,380px)] bg-[#D97757] shrink-0">
            <div className="flex flex-col">
              <div className="w-full px-3 py-1.5 font-mono text-[clamp(9px,1.5vw,13px)] text-white/70 leading-none border-b border-white/20 flex items-center gap-1.5">
                <svg height="1em" viewBox="0 0 24 24" width="1em" className="shrink-0">
                  <path clipRule="evenodd" d="M20.998 10.949H24v3.102h-3v3.028h-1.487V20H18v-2.921h-1.487V20H15v-2.921H9V20H7.488v-2.921H6V20H4.487v-2.921H3V14.05H0V10.95h3V5h17.998v5.949zM6 10.949h1.488V8.102H6v2.847zm10.51 0H18V8.102h-1.49v2.847z" fill="white" fillRule="evenodd" />
                </svg>
                Claude Code
              </div>
              <div className="p-3">
                <div className="w-full gap-1 h-fit py-0.5 font-mono text-[clamp(10px,1.8vw,15px)] text-white/60 bg-white/20 leading-[1.3] flex items-center">
                  &gt; add retry handling
                </div>
                <div className="w-full mt-1 text-white/70 font-mono text-[clamp(10px,1.8vw,15px)] leading-[1.3] flex items-center gap-1">
                  <span className="text-white">✓</span> Checked Coord
                </div>
                <div className="w-full mt-1 text-white/70 font-mono text-[clamp(10px,1.8vw,15px)] leading-[1.3] flex items-start">
                  <span className="shrink-0 text-[0.5em] mt-[0.55em] leading-none text-white/80">●</span>
                  <span className="ml-1.5">Found retry logic from @ronishrohan</span>
                </div>
                <div className="w-full gap-1 mt-1 border-y border-white/30 py-1 text-white/70 flex items-center font-mono text-[clamp(10px,1.8vw,15px)] leading-[1.3]">
                  &gt; <span>extending the existing path</span>
                  <span className="inline-block w-[0.6em] h-[1em] bg-white/80 align-middle animate-[blink_1s_step-end_infinite] ml-px" />
                </div>
              </div>
            </div>
          </div>

          {/* connector */}
          <div className="h-0.5 w-5 bg-[#007a55] shrink-0" />

          {/* Coord hub */}
          <div className="w-10 h-10 bg-[#007a55] flex items-center justify-center shrink-0">
            <svg width="16" height="16" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M24.5 30C24.5 28.6044 24.5 27.9067 24.3278 27.3389C23.94 26.0605 22.9395 25.06 21.6611 24.6722C21.0933 24.5 20.3956 24.5 19 24.5H14C12.6044 24.5 11.9067 24.5 11.3389 24.6722C10.0605 25.06 9.06004 26.0605 8.67224 27.3389C8.5 27.9067 8.5 28.6044 8.5 30" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8.5 3C8.5 4.3956 8.5 5.0933 8.6722 5.6611C9.06 6.9395 10.0605 7.94 11.3389 8.3278C11.9067 8.5 12.6044 8.5 14 8.5L19 8.5C20.3956 8.5 21.0934 8.5 21.6611 8.3278C22.9396 7.94 23.94 6.9395 24.3278 5.6611C24.5 5.0933 24.5 4.3956 24.5 3" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M30 8.5C28.6044 8.5 27.9067 8.5 27.3389 8.6722C26.0605 9.06 25.06 10.0605 24.6722 11.3389C24.5 11.9067 24.5 12.6044 24.5 14L24.5 19C24.5 20.3956 24.5 21.0933 24.6722 21.6611C25.06 22.9395 26.0605 23.94 27.3389 24.3278C27.9067 24.5 28.6044 24.5 30 24.5" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 24.5C4.3956 24.5 5.0933 24.5 5.6611 24.3278C6.9395 23.94 7.94 22.9395 8.3278 21.6611C8.5 21.0933 8.5 20.3956 8.5 19L8.5 14C8.5 12.6044 8.5 11.9066 8.3278 11.3389C7.94 10.0604 6.9395 9.06004 5.6611 8.67224C5.0933 8.5 4.3956 8.5 3 8.5" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 16.5C21 18.9853 18.9853 21 16.5 21C14.0147 21 12 18.9853 12 16.5C12 14.0147 14.0147 12 16.5 12C18.9853 12 21 14.0147 21 16.5Z" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          {/* connector */}
          <div className="h-0.5 w-5 bg-[#007a55] shrink-0" />

          {/* right terminal — OpenAI Codex */}
          <div className="w-[clamp(132px,22vw,380px)] bg-[#3941FF] shrink-0">
            <div className="flex flex-col">
              <div className="w-full px-3 py-1.5 font-mono text-[clamp(9px,1.5vw,13px)] text-white/70 leading-none border-b border-white/20 flex items-center gap-1.5">
                <svg height="1em" viewBox="0 0 24 24" width="1em" className="shrink-0">
                  <path d="M9.064 3.344a4.578 4.578 0 012.285-.312c1 .115 1.891.54 2.673 1.275.01.01.024.017.037.021a.09.09 0 00.043 0 4.55 4.55 0 013.046.275l.047.022.116.057a4.581 4.581 0 012.188 2.399c.209.51.313 1.041.315 1.595a4.24 4.24 0 01-.134 1.223.123.123 0 00.03.115c.594.607.988 1.33 1.183 2.17.289 1.425-.007 2.71-.887 3.854l-.136.166a4.548 4.548 0 01-2.201 1.388.123.123 0 00-.081.076c-.191.551-.383 1.023-.74 1.494-.9 1.187-2.222 1.846-3.711 1.838-1.187-.006-2.239-.44-3.157-1.302a.107.107 0 00-.105-.024c-.388.125-.78.143-1.204.138a4.441 4.441 0 01-1.945-.466 4.544 4.544 0 01-1.61-1.335c-.152-.202-.303-.392-.414-.617a5.81 5.81 0 01-.37-.961 4.582 4.582 0 01-.014-2.298.124.124 0 00.006-.056.085.085 0 00-.027-.048 4.467 4.467 0 01-1.034-1.651 3.896 3.896 0 01-.251-1.192 5.189 5.189 0 01.141-1.6c.337-1.112.982-1.985 1.933-2.618.212-.141.413-.251.601-.33.215-.089.43-.164.646-.227a.098.098 0 00.065-.066 4.51 4.51 0 01.829-1.615 4.535 4.535 0 011.837-1.388zm3.482 10.565a.637.637 0 000 1.272h3.636a.637.637 0 100-1.272h-3.636zM8.462 9.23a.637.637 0 00-1.106.631l1.272 2.224-1.266 2.136a.636.636 0 101.095.649l1.454-2.455a.636.636 0 00.005-.64L8.462 9.23z" fill="white" />
                </svg>
                OpenAI Codex
              </div>
              <div className="p-3">
                <div className="w-full gap-1 h-fit py-0.5 font-mono text-[clamp(10px,1.8vw,15px)] text-white/60 bg-white/20 leading-[1.3] flex items-center">
                  &gt; deploy the new API
                </div>
                <div className="w-full mt-1 text-white/70 font-mono text-[clamp(10px,1.8vw,15px)] leading-[1.3] flex items-center gap-1">
                  <span className="text-white">✓</span> Checked Coord
                </div>
                <div className="w-full mt-1 text-white/70 font-mono text-[clamp(10px,1.8vw,15px)] leading-[1.3] flex items-start">
                  <span className="shrink-0 text-[0.5em] mt-[0.55em] leading-none text-white/80">●</span>
                  <span className="ml-1.5">Found rollout notes from @kushagra2503</span>
                </div>
                <div className="w-full gap-1 mt-1 border-y border-white/30 py-1 text-white/70 flex items-center font-mono text-[clamp(10px,1.8vw,15px)] leading-[1.3]">
                  &gt; <span>continuing from those notes</span>
                  <span className="inline-block w-[0.6em] h-[1em] bg-white/80 align-middle animate-[blink_1s_step-end_infinite] ml-px" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
