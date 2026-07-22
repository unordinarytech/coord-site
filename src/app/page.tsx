"use client";

import { useRef } from "react";
import { useScroll, useMotionValueEvent } from "motion/react";
import { pageMode } from "@/lib/page-mode";
import TyperBlock from "@/components/typer-block";
import Scene3D from "@/components/scene-3d";
import Page2Block from "@/components/page2-block";
import Page3Block from "@/components/page3-block";
import Page4Block from "@/components/page4-block";
import Page5Block from "@/components/page5-block";

export default function Home() {
  const snapRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ container: snapRef });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    pageMode.current = Math.max(0, Math.min(4, v * 4));
  });

  return (
    <>
      <Scene3D />
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-10 pb-4 pointer-events-none">
        <div className="flex items-center gap-3 font-mono text-base font-bold tracking-tighter text-[#007a55]">
          <svg width="22" height="22" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M24.5 30C24.5 28.6044 24.5 27.9067 24.3278 27.3389C23.94 26.0605 22.9395 25.06 21.6611 24.6722C21.0933 24.5 20.3956 24.5 19 24.5H14C12.6044 24.5 11.9067 24.5 11.3389 24.6722C10.0605 25.06 9.06004 26.0605 8.67224 27.3389C8.5 27.9067 8.5 28.6044 8.5 30" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8.5 3C8.5 4.3956 8.5 5.0933 8.6722 5.6611C9.06 6.9395 10.0605 7.94 11.3389 8.3278C11.9067 8.5 12.6044 8.5 14 8.5L19 8.5C20.3956 8.5 21.0934 8.5 21.6611 8.3278C22.9396 7.94 23.94 6.9395 24.3278 5.6611C24.5 5.0933 24.5 4.3956 24.5 3" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M30 8.5C28.6044 8.5 27.9067 8.5 27.3389 8.6722C26.0605 9.06 25.06 10.0605 24.6722 11.3389C24.5 11.9067 24.5 12.6044 24.5 14L24.5 19C24.5 20.3956 24.5 21.0933 24.6722 21.6611C25.06 22.9395 26.0605 23.94 27.3389 24.3278C27.9067 24.5 28.6044 24.5 30 24.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3 24.5C4.3956 24.5 5.0933 24.5 5.6611 24.3278C6.9395 23.94 7.94 22.9395 8.3278 21.6611C8.5 21.0933 8.5 20.3956 8.5 19L8.5 14C8.5 12.6044 8.5 11.9066 8.3278 11.3389C7.94 10.0604 6.9395 9.06004 5.6611 8.67224C5.0933 8.5 4.3956 8.5 3 8.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M21 16.5C21 18.9853 18.9853 21 16.5 21C14.0147 21 12 18.9853 12 16.5C12 14.0147 14.0147 12 16.5 12C18.9853 12 21 14.0147 21 16.5Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Cooper
        </div>
      </nav>
      <div ref={snapRef} className="snap-container h-dvh w-full overflow-y-scroll snap-y snap-mandatory">
        <section className="snap-start h-dvh flex items-center justify-center shrink-0">
          <TyperBlock />
        </section>
        <section className="snap-start h-dvh flex items-center justify-center shrink-0">
          <Page2Block />
        </section>
        <section className="snap-start h-dvh flex items-center justify-center shrink-0">
          <Page3Block />
        </section>
        <section className="snap-start h-dvh flex items-center justify-center shrink-0">
          <Page4Block />
        </section>
        <section className="snap-start h-dvh flex items-center justify-center shrink-0">
          <Page5Block />
        </section>
      </div>
    </>
  );
}
