"use client";

import { useEffect, useRef } from "react";
import { ScrambleGroup } from "@/lib/typer/typer";
import Scene3DFooter from "@/components/scene-3d-footer";

const FOOTER_VARS = {
  "--sc-fg": "#ffffff",
  "--sc-bg": "#111111",
  "--sc-accent": "#007a55",
  "--sc-accent-ink": "#111111",
} as React.CSSProperties;

export default function Page5Block() {
  const containerRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<ScrambleGroup | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const els = [
      ...container.querySelectorAll<HTMLElement>("[data-sc]"),
    ];
    if (!els.length) return;

    const group = new ScrambleGroup(
      els,
      {
        maxFrame: 90,
        accentWords: new Set(["Coord", "early", "testers", "contributors"]),
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
      className="relative z-10 w-full h-full bg-[#111111] flex flex-col items-center justify-center gap-4 px-12 md:px-20 pb-20 leading-none select-none"
    >
      <Scene3DFooter />
      <div
        data-sc="idle"
        className="relative z-10 font-mono text-[clamp(1.8rem,5vw,3.5rem)] font-medium tracking-tighter leading-tight text-white max-w-4xl text-center"
        style={FOOTER_VARS}
      >
        Help us test Coord.
      </div>
      <div className="opacity-60">
        <div
          data-sc="idle"
          className="relative z-10 font-mono text-[clamp(1.8rem,5vw,3.5rem)] font-medium tracking-tighter leading-tight text-white max-w-4xl text-center"
          style={FOOTER_VARS}
        >
          We&rsquo;re still in development.
        </div>
      </div>
      <div
        data-sc="idle"
        className="relative z-10 font-mono text-[clamp(1.8rem,5vw,3.5rem)] font-medium tracking-tighter leading-tight text-white max-w-4xl text-center"
        style={FOOTER_VARS}
      >
        We&rsquo;re looking for early testers and contributors.
      </div>
      <p className="relative z-10 font-mono text-[clamp(1.8rem,5vw,3.5rem)] font-medium tracking-tighter leading-tight text-[#007a55]">
        Follow the work at{" "}
        <a href="https://unordinary.software" className="underline underline-offset-4 hover:text-[#009966] transition-colors">
          unordinary.software
        </a>
      </p>
    </div>
  );
}
