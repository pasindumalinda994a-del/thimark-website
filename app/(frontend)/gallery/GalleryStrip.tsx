"use client";

import { useEffect, useImperativeHandle, useRef, type Ref } from "react";
import type { Mesh, MeshBasicMaterial, PlaneGeometry, Texture } from "three";
import { frameSrc, type GalleryFrame } from "@/app/(frontend)/gallery/records";

export type GalleryStripHandle = {
  step: (direction: 1 | -1) => void;
};

const HEIGHT = 1;
const WIDTH = 1.45;
const GAP = 0.32;
const CREAM = 0xf4f4ed;

const config = {
  smoothing: 0.062,
  distortionStrength: 0.7,
  distortionSmoothing: 0.042,
  momentumFriction: 0.955,
  momentumThreshold: 0.0004,
  wheelSpeed: 0.0066,
  wheelMax: 64,
  dragSpeed: 0.0084,
  dragMomentum: 0.012,
  touchSpeed: 0.0082,
  touchMomentum: 0.046,
};

type GalleryStripProps = {
  frames: GalleryFrame[];
  onActiveIndex: (index: number) => void;
  onOpen: (id: string) => void;
  ref?: Ref<GalleryStripHandle>;
};

export default function GalleryStrip({
  frames,
  onActiveIndex,
  onOpen,
  ref,
}: GalleryStripProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef(frames);
  const onActiveRef = useRef(onActiveIndex);
  const onOpenRef = useRef(onOpen);
  const stepRef = useRef<(direction: 1 | -1) => void>(() => {});
  const signature = frames.map((frame) => frame.id).join("|");

  framesRef.current = frames;
  onActiveRef.current = onActiveIndex;
  onOpenRef.current = onOpen;

  useImperativeHandle(ref, () => ({
    step: (direction) => stepRef.current(direction),
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const slides = framesRef.current;
    if (!slides.length) return;

    let disposed = false;
    let cleanup = () => {};

    void (async () => {
      const THREE = await import("@/app/(frontend)/gallery/three");
      if (disposed) return;

      const pinned = slides.length < 2;
      const total = slides.length;
      const widths = slides.map(() => WIDTH);
      const offsets: number[] = [];
      let stack = 0;

      for (let index = 0; index < total; index += 1) {
        if (index === 0) {
          offsets.push(0);
          stack = widths[0] / 2;
        } else {
          stack += GAP + widths[index] / 2;
          offsets.push(stack);
          stack += widths[index] / 2;
        }
      }

      const loopLength = Math.max(stack + GAP + widths[0] / 2, 0.001);
      const halfLoop = loopLength / 2;
      const wrap = (value: number, range: number) =>
        ((value % range) + range) % range;

      const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
      });
      renderer.setClearColor(0x000000, 0);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
      camera.position.z = 5;

      const raycaster = new THREE.Raycaster();
      const pointer = new THREE.Vector2();
      const loader = new THREE.TextureLoader();
      const textures: Texture[] = [];

      type SlideMesh = Mesh<PlaneGeometry, MeshBasicMaterial>;

      const meshes: SlideMesh[] = [];

      const applyCover = (
        texture: Texture,
        imageAspect: number,
        planeAspect: number,
      ) => {
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        const ratio = imageAspect / planeAspect;
        if (ratio > 1) {
          const repeatX = 1 / ratio;
          texture.repeat.set(repeatX, 1);
          texture.offset.set((1 - repeatX) / 2, 0);
        } else {
          texture.repeat.set(1, ratio);
          texture.offset.set(0, (1 - ratio) / 2);
        }
      };

      for (let index = 0; index < total; index += 1) {
        const width = widths[index];
        const geometry = new THREE.PlaneGeometry(width, HEIGHT, 48, 12);
        const material = new THREE.MeshBasicMaterial({
          color: CREAM,
          side: THREE.DoubleSide,
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.frustumCulled = false;
        mesh.userData = {
          originalVertices: Array.from(geometry.attributes.position.array),
          offset: offsets[index],
          index,
          id: slides[index].id,
        };

        const fit = slides[index].fit;
        const source = frameSrc(slides[index].texture);
        loader.load(source, (texture) => {
          if (disposed) {
            texture.dispose();
            return;
          }
          texture.colorSpace = THREE.SRGBColorSpace;
          textures.push(texture);
          const image = texture.image as { width: number; height: number };
          const imageAspect = image.width / Math.max(image.height, 1);
          const planeAspect = width / HEIGHT;

          if (fit === "contain") {
            const pad = 0.78;
            if (imageAspect > planeAspect) {
              mesh.scale.set(pad, (pad * planeAspect) / imageAspect, 1);
            } else {
              mesh.scale.set((pad * imageAspect) / planeAspect, pad, 1);
            }
          } else {
            applyCover(texture, imageAspect, planeAspect);
          }

          material.map = texture;
          material.color.set(0xffffff);
          material.needsUpdate = true;
          wake();
        });

        scene.add(mesh);
        meshes.push(mesh);
      }

      const applyDistortion = (mesh: SlideMesh, positionX: number, strength: number) => {
        const positions = mesh.geometry.attributes.position;
        const original = mesh.userData.originalVertices as number[];
        for (let index = 0; index < positions.count; index += 1) {
          const x = original[index * 3];
          const y = original[index * 3 + 1];
          const distance = Math.sqrt((positionX + x) ** 2 + y * y);
          const falloff = Math.max(0, 1 - distance / 2.6);
          const bend = Math.pow(Math.sin((falloff * Math.PI) / 2), 1.7);
          positions.setZ(index, bend * strength);
        }
        positions.needsUpdate = true;
      };

      let scrollPosition = 0;
      let scrollTarget = 0;
      let scrollMomentum = 0;
      let isScrolling = false;
      let lastFrameTime = 0;
      let distortionAmount = 0;
      let distortionTarget = 0;
      let velocityPeak = 0;
      let scrollDirection = 0;
      let directionTarget = 0;
      let wasBent = false;
      let activeSlideIndex = 0;
      let scrollTimeout = 0;
      const velocityHistory = [0, 0, 0, 0, 0];

      const resize = () => {
        const parent = canvas.parentElement;
        if (!parent) return;
        const viewW = parent.clientWidth;
        const viewH = parent.clientHeight;
        if (!viewW || !viewH) return;
        camera.aspect = viewW / viewH;
        const vFov = THREE.MathUtils.degToRad(camera.fov);
        const tan = Math.tan(vFov / 2);
        const aspect = Math.max(camera.aspect, 0.01);
        const avgW = widths.reduce((sum, value) => sum + value, 0) / widths.length;
        const widest = Math.max(...widths);
        const zFill = HEIGHT / 0.92 / (2 * tan);
        const zPeek = (avgW * 2.35 + GAP * 2) / (2 * tan * aspect);
        const zFit = (widest + GAP) / (2 * tan * aspect);
        camera.position.z = Math.max(zFill, zPeek, zFit);
        camera.updateProjectionMatrix();
        renderer.setSize(viewW, viewH, false);
      };

      const place = (strength: number) => {
        let closestDistance = Infinity;
        let closestIndex = 0;
        const bend = Math.abs(strength) > 0.001 || wasBent;

        meshes.forEach((mesh) => {
          const offset = mesh.userData.offset as number;
          let x = -(offset - wrap(scrollPosition, loopLength));
          x = wrap(x + halfLoop, loopLength) - halfLoop;
          mesh.position.x = x;
          mesh.position.y = 0;
          if (Math.abs(x) < closestDistance) {
            closestDistance = Math.abs(x);
            closestIndex = mesh.userData.index as number;
          }
          if (bend && Math.abs(x) < halfLoop + 1.5) {
            applyDistortion(mesh, x, strength);
          }
        });

        wasBent = Math.abs(strength) > 0.001;
        if (closestIndex !== activeSlideIndex) {
          activeSlideIndex = closestIndex;
          onActiveRef.current(activeSlideIndex);
        }
      };

      const burst = (amount: number) => {
        if (pinned) return;
        distortionTarget = Math.min(0.84, distortionTarget + amount);
      };

      const armScrollEnd = (delay: number) => {
        window.clearTimeout(scrollTimeout);
        scrollTimeout = window.setTimeout(() => {
          isScrolling = false;
        }, delay);
      };

      stepRef.current = (direction) => {
        if (pinned) return;
        const next = (activeSlideIndex + direction + total) % total;
        const base = scrollPosition - wrap(scrollPosition, loopLength);
        let dest = base + offsets[next];
        if (direction > 0 && dest <= scrollPosition + 0.0001) dest += loopLength;
        if (direction < 0 && dest >= scrollPosition - 0.0001) dest -= loopLength;
        scrollTarget = dest;
        scrollMomentum = 0;
        isScrolling = true;
        burst(0.22);
        armScrollEnd(900);
        wake();
      };

      const onWheel = (event: WheelEvent) => {
        if (pinned) return;
        event.preventDefault();
        event.stopPropagation();
        const raw =
          Math.abs(event.deltaX) > Math.abs(event.deltaY)
            ? event.deltaX
            : event.deltaY;
        const clamped =
          Math.sign(raw) * Math.min(Math.abs(raw), config.wheelMax);
        burst(Math.abs(clamped) * 0.001);
        scrollTarget += clamped * config.wheelSpeed;
        isScrolling = true;
        armScrollEnd(520);
        wake();
      };

      let dragging = false;
      let axisLock: "x" | "y" | null = null;
      let dragStartX = 0;
      let dragDelta = 0;
      let pointerStartX = 0;
      let pointerStartY = 0;
      let moved = false;
      let pointerId = -1;

      const onPointerDown = (event: PointerEvent) => {
        if (event.button !== 0) return;
        dragging = true;
        moved = false;
        axisLock = null;
        dragStartX = event.clientX;
        pointerStartX = event.clientX;
        pointerStartY = event.clientY;
        dragDelta = 0;
        scrollMomentum = 0;
        pointerId = event.pointerId;
      };

      const onPointerMove = (event: PointerEvent) => {
        if (!dragging || event.pointerId !== pointerId) return;
        const dx = event.clientX - pointerStartX;
        const dy = event.clientY - pointerStartY;
        if (!axisLock && dx * dx + dy * dy > 25) {
          moved = true;
          axisLock = Math.abs(dx) >= Math.abs(dy) ? "x" : "y";
          if (axisLock === "y") {
            dragging = false;
            return;
          }
          canvas.setPointerCapture(event.pointerId);
        }
        if (axisLock !== "x" || pinned) return;
        const deltaX = event.clientX - dragStartX;
        dragStartX = event.clientX;
        dragDelta = deltaX;
        const touch = event.pointerType === "touch";
        burst(Math.abs(deltaX) * (touch ? 0.02 : 0.015));
        scrollTarget -= deltaX * (touch ? config.touchSpeed : config.dragSpeed);
        isScrolling = true;
        wake();
      };

      const onPointerUp = (event: PointerEvent) => {
        if (event.pointerId !== pointerId || (!dragging && axisLock !== "x")) return;
        const wasHorizontal = axisLock === "x";
        const didMove = moved;
        dragging = false;
        axisLock = null;
        if (canvas.hasPointerCapture(event.pointerId)) {
          canvas.releasePointerCapture(event.pointerId);
        }

        if (!didMove) {
          const rect = canvas.getBoundingClientRect();
          if (!rect.width || !rect.height) return;
          pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
          pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
          raycaster.setFromCamera(pointer, camera);
          const hit = raycaster.intersectObjects(meshes)[0];
          const id = hit?.object.userData.id as string | undefined;
          if (!id) return;
          const frame = framesRef.current.find((item) => item.id === id);
          if (frame?.href) onOpenRef.current(id);
          return;
        }

        if (pinned || !wasHorizontal) return;
        const touch = event.pointerType === "touch";
        if (Math.abs(dragDelta) > (touch ? 4 : 2)) {
          scrollMomentum =
            -dragDelta * (touch ? config.touchMomentum : config.dragMomentum);
          burst(Math.abs(dragDelta) * (touch ? 0.02 : 0.004));
          isScrolling = true;
          armScrollEnd(1100);
          wake();
        }
      };

      const onTouchMove = (event: TouchEvent) => {
        if (axisLock === "x" && !pinned && event.cancelable) event.preventDefault();
      };

      canvas.addEventListener("wheel", onWheel, { passive: false });
      canvas.addEventListener("pointerdown", onPointerDown);
      canvas.addEventListener("pointermove", onPointerMove);
      canvas.addEventListener("pointerup", onPointerUp);
      canvas.addEventListener("pointercancel", onPointerUp);
      canvas.addEventListener("touchmove", onTouchMove, { passive: false });

      const observer = new ResizeObserver(() => {
        resize();
        wake();
      });
      if (canvas.parentElement) observer.observe(canvas.parentElement);
      resize();

      let raf = 0;
      let onScreen = true;

      // The loop sleeps once the strip settles and wakes on input, resize or texture load.
      const wake = () => {
        if (raf || !onScreen || disposed) return;
        lastFrameTime = 0;
        raf = requestAnimationFrame(animate);
      };

      const animate = (time: number) => {
        raf = 0;
        const deltaTime = lastFrameTime ? (time - lastFrameTime) / 1000 : 0.016;
        lastFrameTime = time;
        const previous = scrollPosition;

        if (!pinned && isScrolling) {
          scrollTarget += scrollMomentum;
          scrollMomentum *= config.momentumFriction;
          if (Math.abs(scrollMomentum) < config.momentumThreshold) scrollMomentum = 0;
        }

        if (pinned) {
          scrollPosition = 0;
          scrollTarget = 0;
        } else {
          scrollPosition += (scrollTarget - scrollPosition) * config.smoothing;
        }

        const frameDelta = scrollPosition - previous;
        if (Math.abs(frameDelta) > 0.00001) {
          directionTarget = frameDelta > 0 ? 1 : -1;
        }
        scrollDirection += (directionTarget - scrollDirection) * 0.032;

        const velocity = Math.abs(frameDelta) / Math.max(deltaTime, 0.001);
        velocityHistory.push(velocity);
        velocityHistory.shift();
        const average =
          velocityHistory.reduce((sum, value) => sum + value, 0) /
          velocityHistory.length;
        if (average > velocityPeak) velocityPeak = average;
        const decelerating =
          average / (velocityPeak + 0.001) < 0.7 && velocityPeak > 0.5;
        velocityPeak *= 0.99;

        if (!pinned && velocity > 0.06) {
          distortionTarget = Math.max(
            distortionTarget,
            Math.min(0.84, velocity * 0.085),
          );
        }
        if (decelerating || average < 0.16) {
          distortionTarget *= decelerating ? 0.975 : 0.93;
        }
        distortionAmount +=
          (distortionTarget - distortionAmount) * config.distortionSmoothing;

        // Same popdown (negative Z) for forward and reverse scroll.
        const strength = pinned
          ? 0
          : -config.distortionStrength * distortionAmount;
        place(strength);
        renderer.render(scene, camera);

        const settled =
          !isScrolling &&
          Math.abs(scrollTarget - scrollPosition) < 0.0001 &&
          distortionAmount < 0.0005 &&
          distortionTarget < 0.0005;
        if (!settled && onScreen) raf = requestAnimationFrame(animate);
      };

      const visibility = new IntersectionObserver(([entry]) => {
        onScreen = entry?.isIntersecting ?? true;
        if (onScreen) wake();
        else {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      });
      visibility.observe(canvas);

      onActiveRef.current(0);
      wake();

      cleanup = () => {
        cancelAnimationFrame(raf);
        window.clearTimeout(scrollTimeout);
        observer.disconnect();
        visibility.disconnect();
        canvas.removeEventListener("wheel", onWheel);
        canvas.removeEventListener("pointerdown", onPointerDown);
        canvas.removeEventListener("pointermove", onPointerMove);
        canvas.removeEventListener("pointerup", onPointerUp);
        canvas.removeEventListener("pointercancel", onPointerUp);
        canvas.removeEventListener("touchmove", onTouchMove);
        meshes.forEach((mesh) => {
          mesh.geometry.dispose();
          mesh.material.dispose();
        });
        textures.forEach((texture) => texture.dispose());
        renderer.dispose();
        stepRef.current = () => {};
      };
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, [signature]);

  return (
    <canvas
      ref={canvasRef}
      className="gallery-reel-canvas"
      aria-hidden
      data-cursor="explore"
    />
  );
}
