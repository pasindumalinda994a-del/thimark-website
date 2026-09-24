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

async function chapter(page) {
  return page.evaluate(() => {
    const stations = [...document.querySelectorAll("[data-story-station]")];
    const slides = [...document.querySelectorAll("[data-story-slide]")];
    const about = document.getElementById("about");
    return {
      y: Math.round(window.scrollY),
      aboutTop: about ? Math.round(about.getBoundingClientRect().top) : null,
      active: stations.findIndex((s) => s.getAttribute("aria-current") === "true"),
      caption: stations
        .find((s) => s.getAttribute("aria-current") === "true")
        ?.querySelector(".story-reel-caption")?.textContent,
      slides: slides.map((s) => Number(getComputedStyle(s).opacity)),
    };
  });
}

try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
  await waitReady(page);

  await page.evaluate(() => document.getElementById("about")?.scrollIntoView());
  await page.waitForTimeout(800);

  const start = await chapter(page);
  await page.locator("[data-story-station]").nth(2).click();
  await page.waitForTimeout(1500);
  const afterClick = await chapter(page);
  await page.screenshot({ path: path.join(dir, "about-reel-desktop-click03.png") });

  const page2 = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page2.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
  await waitReady(page2);
  await page2.evaluate(() => document.getElementById("about")?.scrollIntoView());
  await page2.waitForTimeout(800);

  const progress = [];
  for (let i = 0; i < 18; i++) {
    await page2.mouse.wheel(0, 180);
    await page2.waitForTimeout(70);
    const s = await chapter(page2);
    progress.push(s);
    if (s.active >= 2 && s.aboutTop === 0) {
      await page2.screenshot({ path: path.join(dir, "about-reel-desktop-ch03.png") });
      break;
    }
  }

  const reduced = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await reduced.emulateMedia({ reducedMotion: "reduce" });
  await reduced.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
  await waitReady(reduced);
  await reduced.evaluate(() => document.getElementById("about")?.scrollIntoView());
  await reduced.waitForTimeout(800);
  const reducedSnap = await chapter(reduced);
  await reduced.screenshot({ path: path.join(dir, "about-reel-desktop-reduced.png") });

  console.log(JSON.stringify({ start, afterClick, progress, reducedSnap }, null, 2));
} finally {
  await browser.close();
}
