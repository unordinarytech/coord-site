"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { AsciiEffect } from "three/examples/jsm/effects/AsciiEffect.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

const WORD = "COOPER";
const BOX_H = 200;

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

    const material = new THREE.MeshBasicMaterial({
      color: "#009966",
    });

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

        // measure total width
        const widths: number[] = [];
        for (const ch of WORD) {
          const tg = new TextGeometry(ch, {
            font,
            size: FONT_SIZE,
            depth: 3,
            curveSegments: 4,
            bevelEnabled: true,
            bevelThickness: 0.36,
            bevelSize: 0.36,
            bevelSegments: 2,
          });
          tg.computeBoundingBox();
          widths.push(tg.boundingBox!.max.x - tg.boundingBox!.min.x);
          tg.dispose();
        }

        const totalWidth =
          widths.reduce((a, b) => a + b, 0) +
          letterSpacing * (WORD.length - 1);

        let cursorX = 0;
        const meshes: THREE.Mesh[] = [];

        for (let i = 0; i < WORD.length; i++) {
          const ch = WORD[i];
          const tg = new TextGeometry(ch, {
            font,
            size: FONT_SIZE,
            depth: 3,
            curveSegments: 4,
            bevelEnabled: true,
            bevelThickness: 0.36,
            bevelSize: 0.36,
            bevelSegments: 2,
          });
          tg.computeBoundingBox();
          const bb = tg.boundingBox!;
          const w = bb.max.x - bb.min.x;
          const h = bb.max.y - bb.min.y;

          const mesh = new THREE.Mesh(tg, material);
          tg.translate(-(bb.min.x + w / 2), -(bb.min.y + h / 2), 0);

          const cx = cursorX + w / 2 - totalWidth / 2;
          cursorX += w + letterSpacing;

          mesh.position.set(cx, 0, 0);
          // random initial rotation
          mesh.rotation.set(
            (Math.random() - 0.5) * 0.6,
            (Math.random() - 0.5) * 0.8,
            (Math.random() - 0.5) * 0.6,
          );

          scene.add(mesh);
          meshes.push(mesh);
        }

        // gentle continuous rotation
        function animate() {
          requestAnimationFrame(animate);
          for (const m of meshes) {
            m.rotation.y += 0.003;
          }
          effect.render(scene, camera);
        }
        animate();
      },
    );

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
