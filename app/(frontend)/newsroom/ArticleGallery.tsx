"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import CarouselControls from "@/app/(frontend)/components/CarouselControls";
import { bindSnapCarousel } from "@/app/(frontend)/components/snapCarousel";
import { recordSrc } from "@/app/(frontend)/newsroom/records";

gsap.registerPlugin(useGSAP);

/** Further photographs. A two-column sheet from md up; a swipe track on phones. */
export default function ArticleGallery({ images, alt }: { images: string[]; alt: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const swipe = images.length > 1;

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || !swipe) return;
      const track = root.querySelector<HTMLElement>("[data-gallery-track]");
      const slides = gsap.utils.toArray<HTMLElement>("[data-gallery-slide]", root);
      const mm = gsap.matchMedia();

      mm.add(
        { phone: "(max-width: 767px)", reduce: "(prefers-reduced-motion: reduce)" },
        (ctx) => {
          const { phone, reduce } = ctx.conditions ?? {};
          if (!phone || !track) return;
          const carousel = bindSnapCarousel({
            track,
            slides,
            controls: root.querySelector<HTMLElement>("[data-carousel-controls]"),
            reduced: Boolean(reduce),
          });
          return () => carousel.destroy();
        },
      );

      return () => mm.revert();
    },
    { scope: rootRef, dependencies: [swipe] },
  );

  return (
    <div ref={rootRef} className={`news-gallery-wrap${swipe ? " is-swipe" : ""}`}>
      <ul data-gallery-track aria-label="Photographs" className="news-gallery">
        {images.map((src, i) => (
          <li key={src} data-gallery-slide="">
            <Image
              src={recordSrc(src)}
              alt={`${alt}, photograph ${i + 2}`}
              fill
              sizes="(min-width: 768px) 18vw, 86vw"
              className="object-cover"
            />
          </li>
        ))}
      </ul>
      {swipe ? (
        <CarouselControls label="Photographs" count={images.length} className="md:hidden" />
      ) : null}
    </div>
  );
}
