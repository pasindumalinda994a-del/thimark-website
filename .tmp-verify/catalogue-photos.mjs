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

async function openCatalogue(page) {
  await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
  await waitReady(page);
  await page.evaluate(() =>
    document.getElementById("catalogue")?.scrollIntoView({ block: "start" }),
  );
  await page.waitForTimeout(1400);
}

function collectCards() {
  const cards = [...document.querySelectorAll("[data-cat-card]")];
  return cards.map((card) => {
    const media = card.querySelector("[data-cat-media]");
    const img = card.querySelector(".catalogue-card-photo");
    const title = card.querySelector("h3")?.textContent?.trim() ?? "";
    const mr = media?.getBoundingClientRect();
    const style = img ? getComputedStyle(img) : null;
    return {
      title,
      hasPhoto: Boolean(media?.classList.contains("has-photo")),
      cursor: card.getAttribute("data-cursor"),
      src: (img?.currentSrc || img?.src || "").replace(location.origin, ""),
      complete: img?.complete ?? false,
      naturalWidth: img?.naturalWidth ?? 0,
      objectFit: style?.objectFit ?? null,
      mediaBg: media ? getComputedStyle(media).backgroundColor : null,
      media: mr
        ? {
            w: Math.round(mr.width),
            h: Math.round(mr.height),
          }
        : null,
    };
  });
}

try {
  const failed = [];
  const desktop = await browser.newPage({
    viewport: { width: 1440, height: 900 },
  });
  desktop.on("response", (res) => {
    if (res.url().includes("/products/") && res.status() >= 400) {
      failed.push({ url: res.url(), status: res.status() });
    }
  });

  await openCatalogue(desktop);

  const ct100 = await desktop.evaluate(collectCards);
  await desktop.screenshot({
    path: path.join(dir, "catalogue-ct100-desktop.png"),
  });

  const firstPhoto = desktop.locator(".catalogue-card").filter({
    has: desktop.locator(".catalogue-card-photo"),
  }).first();
  await firstPhoto.hover();
  await desktop.waitForTimeout(600);
  const hoverCursor = await desktop.evaluate(() => {
    const card = document.querySelector(".catalogue-card");
    return {
      cursor: card?.getAttribute("data-cursor"),
      scale: getComputedStyle(
        card?.querySelector(".catalogue-card-photo") ?? document.body,
      ).transform,
    };
  });
  await desktop.screenshot({
    path: path.join(dir, "catalogue-ct100-desktop-hover.png"),
  });

  await desktop.getByRole("tab", { name: /Pulsar N160/ }).click();
  await desktop.waitForTimeout(800);
  const pulsar = await desktop.evaluate(collectCards);
  await desktop.screenshot({
    path: path.join(dir, "catalogue-pulsar-desktop.png"),
  });

  const mobile = await browser.newPage({
    viewport: { width: 390, height: 844, isMobile: true },
  });
  await openCatalogue(mobile);
  const mobileCards = await mobile.evaluate(collectCards);
  await mobile.screenshot({
    path: path.join(dir, "catalogue-ct100-mobile.png"),
  });
  await mobile.evaluate(() =>
    document.querySelectorAll("[data-cat-card]")[4]?.scrollIntoView({
      block: "center",
    }),
  );
  await mobile.waitForTimeout(500);
  await mobile.screenshot({
    path: path.join(dir, "catalogue-ct100-mobile-stay.png"),
  });

  const reduced = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  await openCatalogue(reduced);
  const reducedCards = await reduced.evaluate(collectCards);
  await reduced.screenshot({
    path: path.join(dir, "catalogue-ct100-reduced.png"),
  });

  console.log(
    JSON.stringify(
      { failed, ct100, hoverCursor, pulsar, mobileCards, reducedCards },
      null,
      2,
    ),
  );
} finally {
  await browser.close();
}
