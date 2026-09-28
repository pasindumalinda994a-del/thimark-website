"use client";

import { useEffect, useImperativeHandle, useRef, type Ref } from "react";
import type { Mesh, MeshBasicMaterial, PlaneGeometry, Texture } from "three";
import { frameSrc, type GalleryFrame } from "@/app/gallery/records";

export type GalleryStripHandle = {
  step: (direction: 1 | -1) => void;
};

const HEIGHTS = [1, 1.35, 1.12, 1.48, 1.2];
const ASPECT = 1.45;
const GAP = 0.14;
const CREAM = 0xf4f4ed;

const config = {
  smoothing: 0.08,
  distortionStrength: 1.15,
  distortionSmoothing: 0.12,
  momentumFriction: 0.92,
  momentumThreshold: 0.001,
  wheelSpeed: 0.008,
  wheelMax: 120,
  dragSpeed: 0.008,
  dragMomentum: 0.012,
  touchSpeed: 0.009,
  touchMomentum: 0.08,
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
      const THREE = await import("three");
      if (disposed) return;

      const pinned = slides.length < 2;
      const total = slides.length;
      const heights = slides.map((_, index) => HEIGHTS[index % HEIGHTS.length]);
      const offsets: number[] = [];
      let stack = 0;

      for (let index = 0; index < total; index += 1) {
        if (index === 0) {
          offsets.push(0);
          stack = heights[0] / 2;
        } else {
          stack += GAP + heights[index] / 2;
          offsets.push(stack);
          stack += heights[index] / 2;
        }
      }

      const loopLength = Math.max(stack + GAP + heights[0] / 2, 0.001);
      const halfLoop = loopLength / 2;
      const wrap = (value: number, range: number) =>
        ((value % range) + range) % range;

      const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: false,
      });
      renderer.setClearColor(CREAM, 1);
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
        const height = heights[index];
        const width = height * ASPECT;
        const geometry = new THREE.PlaneGeometry(width, height, 32, 16);
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
        const source = frameSrc(slides[index].image);
        loader.load(source, (texture) => {
          if (disposed) {
            texture.dispose();
            return;
          }
          texture.colorSpace = THREE.SRGBColorSpace;
          textures.push(texture);
          const image = texture.image as { width: number; height: number };
          const imageAspect = image.width / Math.max(image.height, 1);
          const planeAspect = width / height;

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
        });

        scene.add(mesh);
        meshes.push(mesh);
      }

      const applyDistortion = (mesh: SlideMesh, positionY: number, strength: number) => {
        const positions = mesh.geometry.attributes.position;
        const original = mesh.userData.originalVertices as number[];
        for (let index = 0; index < positions.count; index += 1) {
          const x = original[index * 3];
          const y = original[index * 3 + 1];
          const distance = Math.sqrt(x * x + (positionY + y) ** 2);
          const falloff = Math.max(0, 1 - distance / 2);
          const bend = Math.pow(Math.sin((falloff * Math.PI) / 2), 1.5);
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
        const width = parent.clientWidth;
        const height = parent.clientHeight;
        if (!width || !height) return;
        camera.aspect = width / height;
        const vFov = THREE.MathUtils.degToRad(camera.fov);
        const planeW = 1.15 * ASPECT;
        const desiredVisibleW = planeW / 0.68;
        const zForWidth =
          desiredVisibleW / (2 * Math.tan(vFov / 2) * Math.max(camera.aspect, 0.01));
        const zForHeight = 1.85 / (2 * Math.tan(vFov / 2));
        camera.position.z = Math.max(zForWidth, zForHeight);
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
      };

      const place = (strength: number) => {
        let closestDistance = Infinity;
        let closestIndex = 0;
        const bend = Math.abs(strength) > 0.001 || wasBent;

        meshes.forEach((mesh) => {
          const offset = mesh.userData.offset as number;
          let y = -(offset - wrap(scrollPosition, loopLength));
          y = wrap(y + halfLoop, loopLength) - halfLoop;
          mesh.position.y = y;
          if (Math.abs(y) < closestDistance) {
            closestDistance = Math.abs(y);
            closestIndex = mesh.userData.index as number;
          }
          if (bend && Math.abs(y) < halfLoop + 1.5) {
            applyDistortion(mesh, y, strength);
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
        distortionTarget = Math.min(1, distortionTarget + amount);
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
        burst(0.42);
        armScrollEnd(700);
      };

      const onWheel = (event: WheelEvent) => {
        if (pinned) return;
        event.preventDefault();
        event.stopPropagation();
        const clamped =
          Math.sign(event.deltaY) *
          Math.min(Math.abs(event.deltaY), config.wheelMax);
        burst(Math.abs(clamped) * 0.001);
        scrollTarget += clamped * config.wheelSpeed;
        isScrolling = true;
        armScrollEnd(150);
      };

      let dragging = false;
      let dragStartY = 0;
      let dragDelta = 0;
      let pointerStartX = 0;
      let pointerStartY = 0;
      let moved = false;
      let pointerId = -1;

      const onPointerDown = (event: PointerEvent) => {
        if (event.button !== 0) return;
        dragging = true;
        moved = false;
        dragStartY = event.clientY;
        pointerStartX = event.clientX;
        pointerStartY = event.clientY;
        dragDelta = 0;
        scrollMomentum = 0;
        pointerId = event.pointerId;
        canvas.setPointerCapture(event.pointerId);
      };

      const onPointerMove = (event: PointerEvent) => {
        if (!dragging || event.pointerId !== pointerId) return;
        const dx = event.clientX - pointerStartX;
        const dy = event.clientY - pointerStartY;
        if (dx * dx + dy * dy > 25) moved = true;
        if (pinned) return;
        const deltaY = event.clientY - dragStartY;
        dragStartY = event.clientY;
        dragDelta = deltaY;
        const touch = event.pointerType === "touch";
        burst(Math.abs(deltaY) * (touch ? 0.02 : 0.015));
        scrollTarget -= deltaY * (touch ? config.touchSpeed : config.dragSpeed);
        isScrolling = true;
      };

      const onPointerUp = (event: PointerEvent) => {
        if (!dragging || event.pointerId !== pointerId) return;
        dragging = false;
        if (canvas.hasPointerCapture(event.pointerId)) {
          canvas.releasePointerCapture(event.pointerId);
        }

        if (!moved) {
          const rect = canvas.getBoundingClientRect();
          if (!rect.width || !rect.height) return;
          pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
          pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
          raycaster.setFromCamera(pointer, camera);
          const hit = raycaster.intersectObjects(meshes)[0];
          const id = hit?.object.userData.id as string | undefined;
          if (id) onOpenRef.current(id);
          return;
        }

        if (pinned) return;
        const touch = event.pointerType === "touch";
        if (Math.abs(dragDelta) > (touch ? 4 : 2)) {
          scrollMomentum =
            -dragDelta * (touch ? config.touchMomentum : config.dragMomentum);
          burst(Math.abs(dragDelta) * (touch ? 0.02 : 0.004));
          isScrolling = true;
          armScrollEnd(800);
        }
      };

      const onTouchMove = (event: TouchEvent) => {
        if (!pinned && event.cancelable) event.preventDefault();
      };

      canvas.addEventListener("wheel", onWheel, { passive: false });
      canvas.addEventListener("pointerdown", onPointerDown);
      canvas.addEventListener("pointermove", onPointerMove);
      canvas.addEventListener("pointerup", onPointerUp);
      canvas.addEventListener("pointercancel", onPointerUp);
      canvas.addEventListener("touchmove", onTouchMove, { passive: false });

      const observer = new ResizeObserver(resize);
      if (canvas.parentElement) observer.observe(canvas.parentElement);
      resize();

      let raf = 0;
      const animate = (time: number) => {
        raf = requestAnimationFrame(animate);
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
        scrollDirection += (directionTarget - scrollDirection) * 0.08;

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

        if (!pinned && velocity > 0.05) {
          distortionTarget = Math.max(
            distortionTarget,
            Math.min(1, velocity * 0.1),
          );
        }
        if (decelerating || average < 0.2) {
          distortionTarget *= decelerating ? 0.95 : 0.855;
        }
        distortionAmount +=
          (distortionTarget - distortionAmount) * config.distortionSmoothing;

        const strength = pinned
          ? 0
          : config.distortionStrength * distortionAmount * scrollDirection;
        place(strength);
        renderer.render(scene, camera);
      };

      onActiveRef.current(0);
      raf = requestAnimationFrame(animate);

      cleanup = () => {
        cancelAnimationFrame(raf);
        window.clearTimeout(scrollTimeout);
        observer.disconnect();
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
