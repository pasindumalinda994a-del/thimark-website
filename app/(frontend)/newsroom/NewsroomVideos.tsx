"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Copy from "@/app/(frontend)/components/Copy";
import H2Heading from "@/app/(frontend)/components/H2Heading";
import H3Heading from "@/app/(frontend)/components/H3Heading";
import SectionGrid from "@/app/(frontend)/components/SectionGrid";
import { usePlateMotion } from "@/app/(frontend)/components/usePlateMotion";
import {
  Cell,
  Corners,
  Eyebrow,
  Frame,
  MobileEdge,
  PlateBlock,
  type HLine,
  type VLine,
} from "@/app/(frontend)/components/plate";
import {
  formatVideoDate,
  youtubeEmbed,
  youtubeThumb,
  type NewsVideo,
} from "@/app/(frontend)/newsroom/videos";

const INTRO_H: HLine[] = [
  [3, 0, 12],
  [4, 0, 12],
];

const INTRO_V: VLine[] = [
  [0, 0, 4],
  [12, 0, 4],
  [8, 0, 3],
];

const GRID_ROWS = 20;

const GRID_H: HLine[] = [[0, 0, 12]];

const GRID_V: VLine[] = [
  [0, 0, GRID_ROWS],
  [6, 0, GRID_ROWS],
  [12, 0, GRID_ROWS],
];

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function PlayMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path d="M4 2.5v9l8-4.5L4 2.5z" fill="currentColor" />
    </svg>
  );
}

function VideoThumb({
  video,
  playing,
  onPlay,
}: {
  video: NewsVideo;
  playing: boolean;
  onPlay: (video: NewsVideo) => void;
}) {
  return (
    <div className="news-videos-tile">
      <div className="news-videos-thumb relative">
        {playing ? (
          <iframe
            src={youtubeEmbed(video.youtubeId)}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="news-videos-inline-iframe"
          />
        ) : (
          <button
            type="button"
            className="news-videos-hit"
            onClick={() => onPlay(video)}
            aria-label={`Play ${video.title}`}
            data-cursor="interactive"
          >
            <Image
              src={youtubeThumb(video.youtubeId)}
              alt=""
              fill
              sizes="(min-width: 768px) 40vw, 100vw"
              className="object-cover"
            />
            <Corners tone="page" />
            <span className="news-videos-play" aria-hidden>
              <PlayMark />
            </span>
          </button>
        )}
      </div>
      <div className="news-videos-copy">
        <p className="index-tag flex items-center justify-between gap-4 font-normal">
          <span>Video</span>
          <time dateTime={video.date}>{formatVideoDate(video.date)}</time>
        </p>
        <H3Heading variant="title" className="news-videos-thumb-title">
          {video.title}
        </H3Heading>
        <Copy variant="meta" className="news-videos-blurb text-steel/75">
          {video.blurb}
        </Copy>
      </div>
    </div>
  );
}

export default function NewsroomVideos({ videos = [] }: { videos?: NewsVideo[] }) {
  const ref = useRef<HTMLElement>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  usePlateMotion(ref, { image: "rise" });

  if (videos.length === 0) return null;

  return (
    <SectionGrid
      ref={ref}
      id="newsroom-videos"
      aria-labelledby="newsroom-videos-heading"
      rows={16}
      tone="page"
      outerV={false}
      className="plate-auto flex flex-col bg-cream text-steel [--page-bg:var(--cream)] [--page-ink:var(--steel)] scroll-mt-16 xl:scroll-mt-0"
    >
      <PlateBlock rows={4}>
        <Frame h={INTRO_H} v={INTRO_V} />

        <Cell at={[0, 8, 0, 3]} className="plate-title">
          <MobileEdge open />
          <Eyebrow data-reveal index="02">
            Videos
          </Eyebrow>
          <H2Heading id="newsroom-videos-heading">
            On screen.{" "}
            <span className="ab-statement-muted">Work you can watch.</span>
          </H2Heading>
        </Cell>

        <Cell at={[8, 12, 0, 3]} className="plate-lede">
          <MobileEdge />
          <Copy data-reveal variant="lede">
            Brand films on quality, partnerships, and the shop floor — from{" "}
            <a
              href="https://www.youtube.com/@Thimark-x1r"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-steel/30 underline-offset-4 transition-colors hover:decoration-brand"
              data-cursor="interactive"
            >
              @Thimark-x1r
            </a>
            .
          </Copy>
        </Cell>

        <Cell at={[0, 12, 3, 4]} className="ab-head index-tag">
          <MobileEdge open />
          <span className="flex items-center gap-2">
            <span aria-hidden className="ab-marker" />
            Footage
          </span>
          <span className="tabular-nums">[{pad2(videos.length)}]</span>
        </Cell>
      </PlateBlock>

      <PlateBlock rows={GRID_ROWS} className="news-videos-grid-block">
        <Frame h={GRID_H} v={GRID_V} />

        <Cell at={[0, 12, 0, GRID_ROWS]} className="news-videos-grid-cell">
          <MobileEdge />
          <ul data-reveal className="news-videos-grid">
            {videos.map((video) => (
              <li key={video.id}>
                <VideoThumb
                  video={video}
                  playing={activeId === video.id}
                  onPlay={(next) => setActiveId(next.id)}
                />
              </li>
            ))}
          </ul>
        </Cell>
      </PlateBlock>
    </SectionGrid>
  );
}
