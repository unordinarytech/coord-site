"use client";

import { useEffect, useRef } from "react";
import { ScrambleGroup } from "@/lib/typer/typer";

const LINES = ["so your team", "repeats work", "and loses context"];

export default function Page2Block() {
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
      { maxFrame: 90, accentWords: new Set(["repeats", "context"]) },
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
      className="relative z-10 w-full h-full flex items-center justify-center px-8 leading-none select-none"
      style={
        {
          "--sc-fg": "#18181b",
          "--sc-bg": "#fafafa",
          "--sc-accent": "#007a55",
          "--sc-accent-ink": "#fafafa",
        } as React.CSSProperties
      }
    >
      {/* top-right box */}
      <div className="absolute top-[12%] w-fit p-2 right-[10%] w-[clamp(200px,25vw,400px)] bg-[#007a55]"
        style={{ aspectRatio: "4 / 0.8" }} >
        <div className="border-y-2 border-white/30 items-center flex text-white/60 font-mono text-[2vw] whitespace-nowrap leading-[1.3] size-full" >
          &gt; *CUSSES AT AGENT*</div>
      </div>

      {/* bottom box */}
      <div className="absolute bottom-[10%] left-[14%] w-[clamp(220px,24vw,420px)] bg-[#007a55]"
        style={{ aspectRatio: "3 / 2" }} >

        <div className="absolute inset-0 flex flex-col justify-end p-3">
          <pre className="font-mono mb-auto text-[clamp(10px,1.8vw,15px)] leading-[1.3] text-white/80 whitespace-pre select-none">
            {` ▐▛███▜▌   Claude Code v2.1.217
▝▜█████▛▘  Opus 4.6 (1M) · medium effort
  ▘▘ ▝▝     API Usage Billing`}
          </pre>
          <div className="w-full gap-1 mt-1 h-fit py-0.5 font-mono text-[clamp(10px,1.8vw,15px)] text-white/60 bg-white/20 leading-[1.3] flex items-center" >
            &gt; add retry handling
          </div>
          <div className="w-full mt-1 text-white/60 font-mono text-[clamp(10px,1.8vw,15px)] leading-[1.3]" >I can&rsquo;t find any earlier context for this</div>
          <div className="w-full gap-1 mt-1 border-y border-white/30 py-1 text-white/60 flex items-center font-mono text-[clamp(10px,1.8vw,15px)] leading-[1.3]">
            &gt; <span>we shipped this last week</span>
            <span className="inline-block w-[0.6em] h-[1em] bg-white/80 align-middle animate-[blink_1s_step-end_infinite] ml-px" />
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-6xl">
        {LINES.map((line, i) => (
          <div
            key={line}
            data-sc="idle"
            className={`font-mono text-[clamp(3rem,10vw,8rem)] font-medium tracking-tighter ${i === 0 ? "text-left" : i === 1 ? "text-center" : "text-right"
              }`}
          >
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}
