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

try {
  const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const failed = [];
  desktop.on("response", (res) => {
    if (res.url().includes("/home-images/quality-") && res.status() >= 400) {
      failed.push({ url: res.url(), status: res.status() });
    }
  });

  await desktop.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
  await waitReady(desktop);
  await desktop.evaluate(() => document.getElementById("quality")?.scrollIntoView());
  await desktop.waitForTimeout(1400);

  const info = await desktop.evaluate(() => {
    const pillars = [...document.querySelectorAll("[data-q-pillar]")];
    return pillars.map((p) => {
      const img = p.querySelector("img");
      const media = p.querySelector(".quality-pillar-media");
      const numeral = p.querySelector(".quality-pillar-numeral");
      const mr = media?.getBoundingClientRect();
      const nr = numeral?.getBoundingClientRect();
      return {
        title: p.querySelector("h3")?.textContent,
        src: (img?.currentSrc || img?.src || "").replace(location.origin, ""),
        complete: img?.complete ?? false,
        naturalWidth: img?.naturalWidth ?? 0,
        media: mr
          ? { x: Math.round(mr.x), y: Math.round(mr.y), w: Math.round(mr.width), h: Math.round(mr.height) }
          : null,
        numeral: numeral
          ? {
              display: getComputedStyle(numeral).display,
              stroke: getComputedStyle(numeral).webkitTextStroke,
              w: Math.round(nr.width),
              h: Math.round(nr.height),
            }
          : null,
      };
    });
  });

  await desktop.screenshot({ path: path.join(dir, "quality-photos-desktop.png") });

  const mobile = await browser.newPage({
    viewport: { width: 390, height: 844, isMobile: true },
  });
  await mobile.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
  await waitReady(mobile);
  await mobile.evaluate(() =>
    document.querySelector(".quality-pillars")?.scrollIntoView({ block: "start" }),
  );
  await mobile.waitForTimeout(1000);
  await mobile.screenshot({ path: path.join(dir, "quality-photos-mobile-top.png") });
  await mobile.evaluate(() =>
    document.querySelectorAll("[data-q-pillar]")[2]?.scrollIntoView({ block: "center" }),
  );
  await mobile.waitForTimeout(600);
  await mobile.screenshot({ path: path.join(dir, "quality-photos-mobile-end.png") });

  console.log(JSON.stringify({ info, failed }, null, 2));
} finally {
  await browser.close();
}
