"use client";

import { useEffect, useRef } from "react";
import { ScrambleGroup } from "@/lib/typer/typer";

const LINES = ["Does your", "team use", "agents?"];

export default function TyperBlock() {
  const containerRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<ScrambleGroup | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const els = [
      ...container.querySelectorAll<HTMLElement>("[data-sc]"),
    ];
    if (!els.length) return;

    const group = new ScrambleGroup(els, { maxFrame: 90 }, 0.2);
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
      className="relative z-10 w-full max-w-6xl px-8 py-24 leading-none select-none"
      style={
        {
          "--sc-fg": "#18181b",
          "--sc-bg": "#fafafa",
          "--sc-accent": "#007a55",
          "--sc-accent-ink": "#fafafa",
        } as React.CSSProperties
      }
    >
      {LINES.map((line, i) => (
        <div
          key={line}
          data-sc="idle"
          className={`font-mono text-[clamp(3rem,10vw,8rem)] font-medium tracking-tighter ${
            i === 0 ? "text-left" : i === 1 ? "text-center" : "text-right"
          }`}
        >
          {line}
        </div>
      ))}
    </div>
  );
}
