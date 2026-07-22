"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { AsciiEffect } from "three/examples/jsm/effects/AsciiEffect.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

const WORD = "COOPER";
const BOX_H = 200;

// ── 2D types ──
interface Vec2 {
  x: number;
  y: number;
}

interface LetterBody {
  mesh: THREE.Mesh;
  vy: number;
  vx: number;
  angV: number;
  posY: number;
  posX: number;
  restX: number;
  hull: Vec2[]; // convex hull in local space (centred at origin)
  hullMinY: number; // cached lowest y of hull
  settled: number;
}

// ── Andrew's monotone-chain convex hull ──
function cross2(a: Vec2, b: Vec2, c: Vec2): number {
  return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
}

function convexHull(points: Vec2[]): Vec2[] {
  if (points.length <= 2) return points.slice();
  const sorted = [...points].sort((a, b) => a.x - b.x || a.y - b.y);
  const lower: Vec2[] = [];
  for (const p of sorted) {
    while (lower.length >= 2 && cross2(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) {
      lower.pop();
    }
    lower.push(p);
  }
  const upper: Vec2[] = [];
  for (let i = sorted.length - 1; i >= 0; i--) {
    const p = sorted[i];
    while (upper.length >= 2 && cross2(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) {
      upper.pop();
    }
    upper.push(p);
  }
  lower.pop();
  upper.pop();
  return lower.concat(upper);
}

function extractHull(geometry: THREE.BufferGeometry): { hull: Vec2[]; minY: number } {
  const pos = geometry.getAttribute("position");
  const seen = new Set<string>();
  const points: Vec2[] = [];
  let minY = Infinity;

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    if (x < -1e-6 || x > 1e-6 || y < -1e-6 || y > 1e-6) {
      // skip origin
    }
    const key = `${x.toFixed(3)},${y.toFixed(3)}`;
    if (!seen.has(key)) {
      seen.add(key);
      points.push({ x, y });
      if (y < minY) minY = y;
    }
  }

  const hull = convexHull(points);
  return { hull, minY };
}

// ── SAT collision ──
interface SATResult {
  nx: number;
  ny: number;
  depth: number;
}

function projectHull(hull: Vec2[], axis: Vec2): { min: number; max: number } {
  let min = Infinity;
  let max = -Infinity;
  for (const v of hull) {
    const d = v.x * axis.x + v.y * axis.y;
    if (d < min) min = d;
    if (d > max) max = d;
  }
  return { min, max };
}

function worldHull(L: LetterBody): Vec2[] {
  const cos = Math.cos(L.mesh.rotation.z);
  const sin = Math.sin(L.mesh.rotation.z);
  return L.hull.map((v) => ({
    x: L.posX + v.x * cos - v.y * sin,
    y: L.posY + v.x * sin + v.y * cos,
  }));
}

function satCollide(a: LetterBody, b: LetterBody): SATResult | null {
  const aWorld = worldHull(a);
  const bWorld = worldHull(b);

  let bestDepth = Infinity;
  let bestNx = 0;
  let bestNy = 0;

  const polygons = [aWorld, bWorld];
  for (let pi = 0; pi < 2; pi++) {
    const poly = polygons[pi];
    for (let i = 0; i < poly.length; i++) {
      const j = (i + 1) % poly.length;
      const edgeX = poly[j].x - poly[i].x;
      const edgeY = poly[j].y - poly[i].y;
      const len = Math.sqrt(edgeX * edgeX + edgeY * edgeY);
      if (len < 0.0001) continue;
      // perpendicular normal (pointing outward isn't critical — we check sign)
      const nx = -edgeY / len;
      const ny = edgeX / len;

      const pa = projectHull(aWorld, { x: nx, y: ny });
      const pb = projectHull(bWorld, { x: nx, y: ny });

      const gap = pa.max < pb.min ? pb.min - pa.max : pb.max < pa.min ? pa.min - pb.max : 0;
      if (gap > 0.0001) return null; // separating axis found

      const overlap = pa.max < pb.max ? pa.max - pb.min : pb.max - pa.min;
      if (overlap < bestDepth) {
        bestDepth = overlap;
        bestNx = nx;
        bestNy = ny;
      }
    }
  }

  if (bestDepth === Infinity) return null;

  // ensure normal points from a toward b
  const midAx = aWorld.reduce((s, v) => s + v.x, 0) / aWorld.length;
  const midAy = aWorld.reduce((s, v) => s + v.y, 0) / aWorld.length;
  const midBx = bWorld.reduce((s, v) => s + v.x, 0) / bWorld.length;
  const midBy = bWorld.reduce((s, v) => s + v.y, 0) / bWorld.length;
  const toBX = midBx - midAx;
  const toBY = midBy - midAy;
  if (toBX * bestNx + toBY * bestNy < 0) {
    bestNx = -bestNx;
    bestNy = -bestNy;
  }

  return { nx: bestNx, ny: bestNy, depth: bestDepth };
}

// ── component ──
export default function Scene3DFooter() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const W = window.innerWidth;
    const H = BOX_H;

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);

    const effect = new AsciiEffect(renderer, " .:-=+*#%@", {
      resolution: 0.22,
      scale: 1,
      color: false,
      alpha: false,
      block: false,
      invert: false,
    });
    effect.domElement.style.pointerEvents = "none";
    effect.domElement.style.margin = "0";
    effect.domElement.style.padding = "0";
    container.appendChild(effect.domElement);
    const asciiTable = container.querySelector("table");
    if (asciiTable) asciiTable.style.color = "#009966";

    const scene = new THREE.Scene();

    const frustumSize = 30;
    const aspect = W / H;
    const camera = new THREE.OrthographicCamera(
      (frustumSize * aspect) / -2,
      (frustumSize * aspect) / 2,
      frustumSize / 2,
      frustumSize / -2,
      0.1,
      100,
    );
    camera.position.set(0, 0, 15);
    camera.lookAt(0, 0, 0);

    const ambient = new THREE.AmbientLight(0xffffff, 2);
    scene.add(ambient);
    const key = new THREE.DirectionalLight(0xffffff, 8);
    key.position.set(3, 3, 5);
    scene.add(key);

    const letters: LetterBody[] = [];
    const material = new THREE.MeshStandardMaterial({
      color: "#009966",
      metalness: 1.0,
      roughness: 0.2,
    });

    const gravity = -120;
    const restitution = 0.4;
    const floorY = -14;

    function resize() {
      const w = window.innerWidth;
      const a = w / H;
      camera.left = (frustumSize * a) / -2;
      camera.right = (frustumSize * a) / 2;
      camera.updateProjectionMatrix();
      renderer.setSize(w, H);
      effect.setSize(w, H);
    }
    window.addEventListener("resize", resize);
    resize();

    const loader = new FontLoader();
    loader.load(
      "https://unpkg.com/three@0.157.0/examples/fonts/helvetiker_regular.typeface.json",
      (font) => {
        const FONT_SIZE = 20;
        const letterSpacing = 4.8;

        const widths: number[] = [];
        for (const ch of WORD) {
          const tg = new TextGeometry(ch, {
            font,
            size: FONT_SIZE,
            depth: 4,
            curveSegments: 4,
            bevelEnabled: true,
            bevelThickness: 0.48,
            bevelSize: 0.48,
            bevelSegments: 2,
          });
          tg.computeBoundingBox();
          const bb = tg.boundingBox!;
          widths.push(bb.max.x - bb.min.x);
          tg.dispose();
        }

        const totalWidth =
          widths.reduce((a, b) => a + b, 0) +
          letterSpacing * (WORD.length - 1);

        let cursorX = 0;

        for (let i = 0; i < WORD.length; i++) {
          const ch = WORD[i];
          const tg = new TextGeometry(ch, {
            font,
            size: FONT_SIZE,
            depth: 4,
            curveSegments: 4,
            bevelEnabled: true,
            bevelThickness: 0.48,
            bevelSize: 0.48,
            bevelSegments: 2,
          });
          tg.computeBoundingBox();
          const bb = tg.boundingBox!;
          const w = bb.max.x - bb.min.x;
          const h = bb.max.y - bb.min.y;

          const mesh = new THREE.Mesh(tg, material);
          tg.translate(-(bb.min.x + w / 2), -(bb.min.y + h / 2), 0);

          // extract hull AFTER translation so it's centred at origin
          const { hull, minY } = extractHull(tg);

          const restX = cursorX + w / 2 - totalWidth / 2;
          cursorX += w + letterSpacing;

          mesh.position.x = restX;
          scene.add(mesh);

          letters.push({
            mesh,
            vy: 0,
            vx: 0,
            angV: (Math.random() - 0.5) * 3,
            posY: 18 + Math.random() * 10,
            posX: restX,
            restX,
            hull,
            hullMinY: minY,
            settled: 0,
          });
        }

        startAnimation();
      },
    );

    const clock = new THREE.Clock();

    function startAnimation() {
      function animate() {
        requestAnimationFrame(animate);
        const dt = Math.min(clock.getDelta(), 0.05);

        for (const L of letters) {
          L.settled += dt;

          L.vy += gravity * dt;
          L.posY += L.vy * dt;
          L.posX += L.vx * dt;

          // ground collision using hull minY
          const groundContact = floorY - L.hullMinY;

          if (L.posY <= groundContact) {
            L.posY = groundContact;
            if (Math.abs(L.vy) > 2) {
              L.vy = Math.abs(L.vy) * restitution;
              L.vx += (Math.random() - 0.5) * 12;
              L.angV += (Math.random() - 0.5) * 10;
              L.settled = 0;
            } else {
              L.vy = 0;
              L.vx *= 0.92;
            }
          }

          if (L.posY <= groundContact + 0.8 && Math.abs(L.vy) < 0.6) {
            const dx = L.restX - L.posX;
            L.vx += dx * 0.8 * dt;
            L.vx *= 0.95;
          }

          if (L.posY <= groundContact + 0.8 && Math.abs(L.vy) < 0.6 && L.settled > 1.5 + Math.random() * 1.5) {
            L.vy = 40 + Math.random() * 32;
            L.vx += (Math.random() - 0.5) * 16;
            L.angV += (Math.random() - 0.5) * 4;
            L.settled = 0;
          }

          L.posX = THREE.MathUtils.clamp(L.posX, L.restX - 20, L.restX + 20);
          L.mesh.position.x = L.posX;
          L.mesh.position.y = L.posY;
          L.mesh.rotation.z += L.angV * dt;
          L.angV *= 0.995;
        }

        // ── letter-to-letter SAT collision ──
        for (let i = 0; i < letters.length; i++) {
          for (let j = i + 1; j < letters.length; j++) {
            const result = satCollide(letters[i], letters[j]);
            if (!result) continue;

            const { nx, ny, depth } = result;
            // separate
            letters[i].posX -= nx * depth * 0.5;
            letters[i].posY -= ny * depth * 0.5;
            letters[j].posX += nx * depth * 0.5;
            letters[j].posY += ny * depth * 0.5;

            // relative velocity along normal
            const relVn =
              (letters[j].vx - letters[i].vx) * nx +
              (letters[j].vy - letters[i].vy) * ny;
            if (relVn < 0) {
              const impulse = relVn * 0.6;
              letters[i].vx += impulse * nx;
              letters[i].vy += impulse * ny;
              letters[j].vx -= impulse * nx;
              letters[j].vy -= impulse * ny;

              const angImpulse = relVn * 0.3;
              letters[i].angV -= angImpulse;
              letters[j].angV += angImpulse;
              letters[i].settled = 0;
              letters[j].settled = 0;
            }
          }
        }

        effect.render(scene, camera);
      }
      animate();
    }

    return () => {
      window.removeEventListener("resize", resize);
      renderer.dispose();
      material.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute bottom-0 left-0 right-0 z-0"
      style={{ height: BOX_H, pointerEvents: "none" }}
    />
  );
}
