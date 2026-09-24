import { chromium } from "file:///C:/Users/pasin/AppData/Local/Temp/pw-verify/node_modules/playwright-core/index.mjs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const expected = [
  "/home-images/about-steel-fabrication.jpeg",
  "/home-images/about-iso-precision.jpeg",
  "/home-images/about-automotive-manufacturing.jpeg",
  "/home-images/about-industrial-automation.jpeg",
  "/home-images/about-international-engineering.jpeg",
];

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

async function inspect(page) {
  return page.evaluate(() => {
    const slides = [...document.querySelectorAll("[data-story-slide]")];
    return slides.map((el) => {
      const img = el.tagName === "IMG" ? el : el.querySelector("img");
      const src = img?.currentSrc || img?.src || el.getAttribute("src") || "";
      return {
        src: src.replace(location.origin, ""),
        complete: img?.complete ?? false,
        naturalWidth: img?.naturalWidth ?? 0,
        clip: getComputedStyle(el).clipPath,
        visible: getComputedStyle(el).opacity,
      };
    });
  });
}

try {
  const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const failed = [];
  desktop.on("response", (res) => {
    if (res.url().includes("/home-images/about-") && res.status() >= 400) {
      failed.push({ url: res.url(), status: res.status() });
    }
  });

  await desktop.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
  await waitReady(desktop);
  await desktop.evaluate(() => document.getElementById("about")?.scrollIntoView());
  await desktop.waitForTimeout(900);

  const start = await inspect(desktop);
  await desktop.screenshot({ path: path.join(dir, "about-photos-desktop-01.png") });

  await desktop.locator("[data-story-station]").nth(2).click();
  await desktop.waitForTimeout(1400);
  const chapter3 = await inspect(desktop);
  await desktop.screenshot({ path: path.join(dir, "about-photos-desktop-03.png") });

  await desktop.locator("[data-story-station]").nth(4).click();
  await desktop.waitForTimeout(1400);
  const chapter5 = await inspect(desktop);
  await desktop.screenshot({ path: path.join(dir, "about-photos-desktop-05.png") });

  const mobile = await browser.newPage({
    viewport: { width: 390, height: 844, isMobile: true },
  });
  await mobile.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
  await waitReady(mobile);
  await mobile.evaluate(() => document.querySelector(".about-reel")?.scrollIntoView({ block: "center" }));
  await mobile.waitForTimeout(900);
  const mobileStart = await inspect(mobile);
  await mobile.screenshot({ path: path.join(dir, "about-photos-mobile.png") });

  const srcs = start.map((s) => s.src.split("?")[0]);
  console.log(JSON.stringify({
    srcs,
    match: expected.every((p, i) => srcs[i]?.includes(p.replace("/home-images/", ""))),
    loaded: start.every((s) => s.complete && s.naturalWidth > 0),
    failed,
    start,
    chapter3,
    chapter5,
    mobileStart,
  }, null, 2));
} finally {
  await browser.close();
}
