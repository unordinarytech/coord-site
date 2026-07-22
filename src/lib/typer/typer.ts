// BlockScramble — each character flickers through colored block states
// (fill, accent, inverse, accent-fill, border) with random timing per char,
// then settles into plain text. Uses rAF + frame counter like the original
// TextScramble reference, but swaps dud symbols for colored block states.
//
// Each char gets a random start point and random scramble duration so the
// wave feels organic. Adjacent chars flicker independently. Drive a single
// line with a Scrambler, or a ScramblerGroup for staggered multi-line.

const POOL = "!<>-_\\/[]{}—=+*^?#";
const STATES = ["fill", "inverse", "accent", "accent-fill", "border"] as const;

function ran(n: number) { return (Math.random() * n) | 0; }
function pick() { return { state: STATES[ran(STATES.length)], sym: POOL[ran(POOL.length)] }; }

interface Job {
  el: HTMLSpanElement;
  to: string;
  from: string;
  start: number;
  end: number;
  cur: string;
  state: string;
}

export interface ScrambleOpts {
  maxFrame?: number;
  delay?: number;
  accentWords?: Set<string>;
}

export class BlockScramble {
  private el: HTMLElement;
  private inner: string;
  private raw: string;
  private queue: Job[] = [];
  private frame = 0;
  private maxFrame: number;
  private delay: number;
  private raf: number = 0;
  private timer: number | null = null;
  private resolve: (() => void) | null = null;
  private running = false;
  private unloading = false;
  private unloadResolve: (() => void) | null = null;
  private accentWords: Set<string>;

  constructor(el: HTMLElement, opts: ScrambleOpts = {}) {
    this.el = el;
    this.inner = el.innerHTML;
    this.raw = el.textContent || "";
    this.maxFrame = opts.maxFrame ?? 90;
    this.delay = opts.delay ?? 0;
    this.accentWords = opts.accentWords ?? new Set();
    el.dataset.sc = "idle";
    if (this.raw) this.build();
  }

  private build() {
    this.el.innerHTML = "";
    const parts = this.raw.split(/(\s+)/);
    for (const token of parts) {
      if (!token.trim()) {
        this.el.appendChild(document.createTextNode(token));
        continue;
      }
      const g = document.createElement("span");
      g.className = "w";
      if (this.accentWords.has(token)) {
        g.className = "w accent-word";
      }
      for (const ch of token) {
        const span = document.createElement("span");
        span.textContent = "";
        span.className = "c";
        g.appendChild(span);
      }
      this.el.appendChild(g);
    }

    const spans = this.el.querySelectorAll<HTMLSpanElement>(".c");
    this.queue = [];
    let i = 0;
    for (const ch of this.raw.replace(/\s/g, "")) {
      const s = ran(15);
      const e = s + 8 + ran(35);
      this.queue.push({
        el: spans[i],
        to: ch,
        from: "",
        start: s,
        end: e,
        cur: "",
        state: "",
      });
      i++;
    }
  }

  reset(text: string) {
    this.halt();
    this.raw = text;
    this.frame = 0;
    this.running = false;
    this.el.dataset.sc = "idle";
    this.build();
  }

  go(): Promise<void> {
    if (this.running) return Promise.resolve();
    this.running = true;
    this.unloading = false;
    this.el.dataset.sc = "active";
    this.frame = 0;
    for (const j of this.queue) {
      j.el.textContent = "";
      j.el.className = "c";
    }

    return new Promise((resolve) => {
      this.resolve = resolve;
      const begin = () => {
        this.timer = null;
        this.raf = requestAnimationFrame(this.tick);
      };
      if (this.delay > 0) {
        this.timer = window.setTimeout(begin, this.delay * 1000);
      } else {
        begin();
      }
    });
  }

  unload(): Promise<void> {
    // Interrupt any running animation
    this.halt();
    if (!this.raw) return Promise.resolve();
    this.running = true;
    this.unloading = true;
    this.el.dataset.sc = "active";
    this.frame = 0;
    for (const j of this.queue) {
      j.el.textContent = "";
      j.el.className = "c";
    }
    return new Promise((resolve) => {
      this.unloadResolve = resolve;
      this.raf = requestAnimationFrame(this.tick);
    });
  }

  private tick = () => {
    if (!this.running) return;
    this.frame++;
    this.render();
    if (this.frame >= this.maxFrame) {
      this.finish();
      return;
    }
    this.raf = requestAnimationFrame(this.tick);
  };

  private render() {
    const f = this.frame;
    const targetEnd = this.unloading ? Math.round(this.maxFrame * 0.6) : this.maxFrame;
    for (const j of this.queue) {
      if (this.unloading) {
        // Unload: scramble then settle to empty
        if (f >= targetEnd) {
          j.el.textContent = "";
          j.el.className = "c";
          continue;
        }
        if (f >= j.start) {
          if (!j.cur || Math.random() < 0.35) {
            const p = pick();
            j.cur = p.sym;
            j.state = p.state;
          }
          j.el.textContent = j.cur;
          j.el.className = `c ${j.state}`;
        } else {
          j.el.textContent = j.to;
          j.el.className = "c";
        }
      } else if (f >= j.end) {
        if (j.el.textContent !== j.to) {
          j.el.textContent = j.to;
          j.el.className = "c";
        }
        continue;
      }
      if (f >= j.start) {
        if (!j.cur || Math.random() < 0.35) {
          const p = pick();
          j.cur = p.sym;
          j.state = p.state;
        }
        j.el.textContent = j.cur;
        j.el.className = `c ${j.state}`;
      } else {
        j.el.textContent = "";
        j.el.className = "c";
      }
    }
  }

  private finish() {
    this.running = false;
    if (this.unloading) {
      this.el.dataset.sc = "hidden";
      this.el.style.opacity = "0";
      this.el.style.transition = "opacity 0.3s";
      this.unloadResolve?.();
      this.unloadResolve = null;
      this.unloading = false;
      return;
    }
    this.el.dataset.sc = "done";
    for (const j of this.queue) {
      j.el.textContent = j.to;
      j.el.className = "c";
    }
    this.resolve?.();
  }

  private halt() {
    if (this.timer !== null) { clearTimeout(this.timer); this.timer = null; }
    if (this.raf) { cancelAnimationFrame(this.raf); this.raf = 0; }
  }

  destroy() {
    this.halt();
    this.el.innerHTML = this.inner;
    delete this.el.dataset.sc;
  }
}

export class ScrambleGroup {
  private list: BlockScramble[] = [];
  private els: HTMLElement[];
  constructor(els: HTMLElement[], opts: ScrambleOpts = {}, stagger = 0.15) {
    this.els = els;
    this.list = els.map((el, i) => new BlockScramble(el, { ...opts, delay: i * stagger }));
  }
  go() { this.list.forEach((s) => s.go()); }
  unload() { this.list.forEach((s) => s.unload()); }
  async transitionTo(texts: string[], opts: ScrambleOpts = {}, stagger = 0.15) {
    // Wait for unload to finish
    await Promise.all(this.list.map((s) => s.unload()));
    // Clear elements and set new text
    this.destroy();
    this.els.forEach((el, i) => {
      el.innerHTML = "";
      el.textContent = texts[i];
      el.dataset.sc = "idle";
    });
    // Rebuild scramblers with new text
    this.list = this.els.map((el, i) => new BlockScramble(el, { ...opts, delay: i * stagger }));
    // Play reveal
    this.go();
  }
  destroy() { this.list.forEach((s) => s.destroy()); }
}
