import { chromium } from "file:///C:/Users/pasin/AppData/Local/Temp/pw-verify/node_modules/playwright-core/index.mjs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});

async function waitReady(page) {
  await page.waitForFunction(
    () => !document.querySelector('[role="status"][aria-busy="true"]'),
    { timeout: 40000 },
  );
  await page.waitForTimeout(600);
}

async function snapshot(page) {
  return page.evaluate(() => {
    const row = window.innerHeight / 14;
    const about = document.getElementById("about");
    const header = about?.querySelector("header");
    const copy = about?.querySelector(".about-copy");
    const image = about?.querySelector(".about-image");
    const reel = about?.querySelector(".story-reel-meta");
    const stations = [...document.querySelectorAll("[data-story-station]")];
    const slides = [...document.querySelectorAll("[data-story-slide]")];
    const fills = [...document.querySelectorAll("[data-story-fill]")];
    const lines = [...about?.querySelectorAll("span[aria-hidden]") ?? []]
      .filter((n) => n.className.includes("h-seg"))
      .map((n) => ({
        className: n.className,
        top: Math.round(n.getBoundingClientRect().top),
      }));
    const box = (n) => {
      if (!n) return null;
      const r = n.getBoundingClientRect();
      return {
        top: Math.round(r.top),
        left: Math.round(r.left),
        right: Math.round(r.right),
        bottom: Math.round(r.bottom),
        height: Math.round(r.height),
        width: Math.round(r.width),
      };
    };
    return {
      y: Math.round(window.scrollY),
      vh: window.innerHeight,
      row: Math.round(row),
      row3: Math.round(3 * row),
      about: box(about),
      header: box(header),
      copy: box(copy),
      image: box(image),
      reel: box(reel),
      lines,
      active: stations.findIndex((s) => s.getAttribute("aria-current") === "true"),
      labels: stations.map((s) => ({
        current: s.getAttribute("aria-current") === "true",
        caption: s.querySelector(".story-reel-caption")?.textContent ?? "",
        captionShown: getComputedStyle(s.querySelector(".story-reel-caption")).display !== "none",
      })),
      slides: slides.map((s) => Number(getComputedStyle(s).opacity)),
      fills: fills.map((f) => {
        const t = getComputedStyle(f).transform;
        return t;
      }),
      storyRow: Boolean(document.querySelector("[data-story-row]")),
      headingLine2: lines.some((l) => l.className.includes("top-rows-2")),
    };
  });
}

const log = [];

try {
  const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await desktop.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
  await waitReady(desktop);

  await desktop.evaluate(() => {
    document.getElementById("about")?.scrollIntoView();
  });
  await desktop.waitForTimeout(900);
  const pinned = await snapshot(desktop);
  log.push({ step: "desktop-pin-start", pinned });
  await desktop.screenshot({
    path: path.join(dir, "about-reel-desktop-start.png"),
  });

  for (let i = 0; i < 12; i++) {
    await desktop.mouse.wheel(0, 500);
    await desktop.waitForTimeout(80);
  }
  const mid = await snapshot(desktop);
  log.push({ step: "desktop-mid", mid });
  await desktop.screenshot({
    path: path.join(dir, "about-reel-desktop-mid.png"),
  });

  const lastStation = desktop.locator("[data-story-station]").nth(4);
  await lastStation.click();
  await desktop.waitForTimeout(1400);
  const clicked = await snapshot(desktop);
  log.push({ step: "desktop-click-05", clicked });
  await desktop.screenshot({
    path: path.join(dir, "about-reel-desktop-click.png"),
  });

  const mobile = await browser.newPage({
    viewport: { width: 390, height: 844, isMobile: true },
  });
  await mobile.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
  await waitReady(mobile);
  await mobile.evaluate(() => {
    document.getElementById("about")?.scrollIntoView();
  });
  await mobile.waitForTimeout(800);
  const mobileTop = await snapshot(mobile);
  log.push({ step: "mobile-top", mobileTop });
  await mobile.screenshot({
    path: path.join(dir, "about-reel-mobile-top.png"),
    fullPage: false,
  });

  await mobile.evaluate(() => {
    document.querySelector(".about-image")?.scrollIntoView({ block: "center" });
  });
  await mobile.waitForTimeout(800);
  const mobileImage = await snapshot(mobile);
  log.push({ step: "mobile-image", mobileImage });
  await mobile.screenshot({
    path: path.join(dir, "about-reel-mobile-image.png"),
  });

  console.log(JSON.stringify(log, null, 2));
} finally {
  await browser.close();
}
