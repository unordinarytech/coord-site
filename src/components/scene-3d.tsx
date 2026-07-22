"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { AsciiEffect } from "three/examples/jsm/effects/AsciiEffect.js";
import { pageMode } from "@/lib/page-mode";

export default function Scene3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.5;

    const effect = new AsciiEffect(renderer, " +=*#%@", {
      resolution: 0.2,
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
    const camera = new THREE.PerspectiveCamera(15, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 5);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTexture = pmremGenerator.fromScene(new RoomEnvironment(), 0, 0.1, 100).texture;
    scene.environment = envTexture;
    pmremGenerator.dispose();

    const ambient = new THREE.AmbientLight(0xffffff, 4);
    scene.add(ambient);
    const key = new THREE.DirectionalLight(0xffffff, 12);
    key.position.set(5, 5, 5);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0x88ccbb, 6);
    fill.position.set(-4, 2, -3);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(0x88bbdd, 4);
    rim.position.set(0, -5, 3);
    scene.add(rim);

    const loader = new GLTFLoader();
    let mesh: THREE.Group | null = null;
    // all 5 objects (original + 4 clones) with scatter targets
    const actors: { group: THREE.Group; mixer: THREE.AnimationMixer | null; tx: number; ty: number; tscale: number }[] = [];
    let restZ = 5;

    loader.load(
      "/coord.glb",
      (gltf) => {
        mesh = gltf.scene;
        scene.add(mesh);
        // 'YXZ' avoids gimbal lock when Y ≈ 90° — keeps X and Z independent
        mesh.rotation.order = "YXZ";

        mesh.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const m = child as THREE.Mesh;
            if (Array.isArray(m.material)) {
              m.material.forEach((mat) => mat.dispose());
            } else if (m.material) {
              m.material.dispose();
            }
            m.material = new THREE.MeshStandardMaterial({
              color: "#009966",
              metalness: 1.0,
              roughness: 0.15,
              envMapIntensity: 1.5,
              side: THREE.DoubleSide,
            });
          }
        });

        const box = new THREE.Box3().setFromObject(mesh);
        const center = box.getCenter(new THREE.Vector3());
        mesh.position.sub(center);

        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        if (maxDim > 0) {
          const fovRad = camera.fov * (Math.PI / 180);
          restZ = maxDim / (2 * Math.tan(fovRad / 2)) * 1.5;
          camera.position.z = restZ;
          camera.lookAt(0, 0, 0);
        }

        // page-3: 5 scatter targets (original + 4 clones)
        const spots = [
          { x: -1.6, y:  1.2, scale: 0.3 },
          { x:  1.8, y:  0.9, scale: 0.28 },
          { x:  1.2, y: -1.4, scale: 0.35 },
          { x: -1.4, y: -1.1, scale: 0.25 },
          { x:  0.0, y:  0.0, scale: 0.33 },
        ];

        // original is actor 0
        {
          let cmixer: THREE.AnimationMixer | null = null;
          if (gltf.animations?.length) {
            cmixer = new THREE.AnimationMixer(mesh);
            gltf.animations.forEach((clip) => cmixer!.clipAction(clip).play());
          }
          actors.push({ group: mesh, mixer: cmixer, tx: spots[0].x, ty: spots[0].y, tscale: spots[0].scale });
        }

        // 4 clones
        for (let i = 1; i < spots.length; i++) {
          const clone = mesh.clone(true) as THREE.Group;
          clone.visible = true;
          clone.rotation.order = "YXZ";
          clone.position.set(0, 0, 0);
          scene.add(clone);
          let cmixer: THREE.AnimationMixer | null = null;
          if (gltf.animations?.length) {
            cmixer = new THREE.AnimationMixer(clone);
            gltf.animations.forEach((clip) => cmixer!.clipAction(clip).play());
          }
          actors.push({ group: clone, mixer: cmixer, tx: spots[i].x, ty: spots[i].y, tscale: spots[i].scale });
        }
      },
    );

    const clock = new THREE.Clock();

    function resize() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      effect.setSize(w, h);
    }
    window.addEventListener("resize", resize);
    resize();

    // ── animation state ──
    let rotY = 0, rotX = 0, rotZ = 0;
    let spinY = 0;
    let spinX_p3 = 0; // accumulator for page 3 X spin

    const TWO_PI = Math.PI * 2;
    // keep value in [-PI, PI]
    function norm(v: number) { return v - TWO_PI * Math.round(v / TWO_PI); }

    function animate() {
      requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.1);
      for (const a of actors) { if (a.mixer) a.mixer.update(delta); }

      const s = pageMode.current;

      // drift spinY toward oscillation centre when leaving page 1,
      // so the blend into mode 1 doesn't jump
      if (s < 0.05) {
        spinY += delta * 0.3;
      } else if (s < 0.5) {
        spinY += delta * 0.3;
        spinY += (Math.PI / 2 - spinY) * delta * 1.5 * (s / 0.5);
      } else {
        spinY += (Math.PI / 2 - spinY) * delta * 2;
      }
      spinY = norm(spinY);

      const t = clock.getElapsedTime();

      // three keyframe states
      // page 1
      const y0 = norm(spinY);
      const x0 = norm(Math.sin(t * 0.6) * 0.8);
      const z0 = 0;

      // page 2
      const y1 = Math.sin(t * 0.4) * -0.8 + Math.PI / 2;
      const x1 = Math.sin(t * 0.5 + 1) * 0.35;
      const z1 = 0;

      // page 3
      spinX_p3 += delta * 0.3;
      spinX_p3 = norm(spinX_p3);
      const y2 = Math.PI / 2;
      const x2 = norm(spinX_p3);
      const z2 = 0;


      // crossfade between states
      let targetY: number, targetX: number, targetZ: number, targetCamZ: number;
      // normalise old rot before lerp so delta stays small
      rotY = norm(rotY);
      rotX = norm(rotX);
      rotZ = norm(rotZ);
      if (s <= 1) {
        const f = s;
        targetY = y0 + norm(y1 - y0) * f;
        targetX = x0 + (x1 - x0) * f;
        targetZ = z0 + (z1 - z0) * f;
        targetCamZ = restZ + (restZ / 4 - restZ) * f;
      } else if (s <= 2) {
        const f = s - 1;
        targetY = y1 + norm(y2 - y1) * f;
        targetX = x1 + (x2 - x1) * f;
        targetZ = z1 + (z2 - z1) * f;
        targetCamZ = restZ / 4 + (restZ - restZ / 4) * f;
      } else {
        // pages 3 & 4 — hold at the same state
        targetY = y2;
        targetX = x2;
        targetZ = z2;
        targetCamZ = restZ;
      }

      const k = 1 - Math.exp(-delta * 12);
      rotY += norm(targetY - rotY) * k;
      rotX += norm(targetX - rotX) * k;
      rotZ += norm(targetZ - rotZ) * k;
      camera.position.z += (targetCamZ - camera.position.z) * k;

      if (actors.length > 0) {
        // ── page 3+ → scatter all objects from origin to targets ──
        const split = s >= 2 ? Math.min(1, (s - 2)) : 0;

        for (const a of actors) {
          a.group.position.set(
            a.tx * split,
            a.ty * split,
            0,
          );
          const scale = 1 + (a.tscale - 1) * split;
          a.group.scale.setScalar(scale);
          a.group.rotation.set(rotX, rotY, rotZ);
        }
      }

      effect.render(scene, camera);
    }
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0 flex items-center justify-center overflow-hidden"
      style={{ pointerEvents: "none" }}
    />
  );
}
