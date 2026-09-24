import { chromium } from "file:///C:/Users/pasin/AppData/Local/Temp/pw-verify/node_modules/playwright-core/index.mjs";

const OUT = "C:/Users/pasin/Documents/Web Projects/thimark-website/.tmp-verify";
const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});

async function waitReady(page) {
  await page.waitForFunction(
    () => !document.querySelector('[role="status"][aria-busy="true"]'),
    { timeout: 40000 },
  );
}

async function inspect(page, ids) {
  return page.evaluate((headingIds) => {
    return headingIds.map((id) => {
      const el = document.getElementById(id);
      if (!el) return { id, present: false };
      const cs = getComputedStyle(el);
      const masks = [...el.querySelectorAll("span")].filter((n) => {
        const overflow = getComputedStyle(n).overflow;
        return overflow === "clip" || overflow === "hidden";
      });
      const lines = masks
        .map((mask) => mask.firstElementChild)
        .filter(Boolean);
      return {
        id,
        present: true,
        tag: el.tagName,
        opacity: Number(cs.opacity),
        visibility: cs.visibility,
        maskCount: masks.length,
        lineCount: lines.length,
        lines: lines.map((line) => {
          const t = getComputedStyle(line).transform;
          const m = t.match(/matrix\(([^)]+)\)/);
          const ty = m ? Number(m[1].split(",")[5]) : 0;
          return {
            text: line.textContent.trim(),
            ty: Math.round(ty),
          };
        }),
        text: el.textContent.replace(/\s+/g, " ").trim(),
      };
    });
  }, ids);
}

const IDS = [
  "hero-heading",
  "about-heading",
  "two-core-heading",
  "featured-heading",
  "caps-heading",
  "quality-heading",
  "partners-heading",
  "catalogue-heading",
  "quote-heading",
];

try {
  const desktop = await browser.newPage({
    viewport: { width: 1440, height: 900 },
  });
  await desktop.goto("http://localhost:3000/", {
    waitUntil: "domcontentloaded",
  });
  await waitReady(desktop);
  await desktop.waitForTimeout(350);
  console.log("desktop-hero-mid", JSON.stringify(await inspect(desktop, ["hero-heading"]), null, 2));
  await desktop.screenshot({ path: `${OUT}/heading-mask-hero-mid.png` });

  await desktop.waitForTimeout(900);
  console.log("desktop-hero-done", JSON.stringify(await inspect(desktop, ["hero-heading"]), null, 2));
  console.log("desktop-below-fold", JSON.stringify(await inspect(desktop, ["about-heading", "quality-heading", "quote-heading"]), null, 2));

  for (const id of ["about-heading", "featured-heading", "quality-heading", "partners-heading", "quote-heading"]) {
    await desktop.evaluate((headingId) => {
      document.getElementById(headingId)?.scrollIntoView({ block: "center" });
    }, id);
    await desktop.waitForTimeout(280);
    console.log(`desktop-${id}-mid`, JSON.stringify(await inspect(desktop, [id]), null, 2));
    await desktop.screenshot({ path: `${OUT}/heading-mask-${id}-mid.png` });
    await desktop.waitForTimeout(800);
  }

  console.log("desktop-all-done", JSON.stringify(await inspect(desktop, IDS), null, 2));

  const mobile = await browser.newPage({
    viewport: { width: 390, height: 844, isMobile: true },
  });
  await mobile.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
  await waitReady(mobile);
  await mobile.waitForTimeout(350);
  console.log("mobile-hero-mid", JSON.stringify(await inspect(mobile, ["hero-heading"]), null, 2));
  await mobile.screenshot({ path: `${OUT}/heading-mask-hero-mobile-mid.png` });
  await mobile.waitForTimeout(900);

  await mobile.evaluate(() => {
    document.getElementById("quote-heading")?.scrollIntoView({ block: "center" });
  });
  await mobile.waitForTimeout(280);
  console.log("mobile-quote-mid", JSON.stringify(await inspect(mobile, ["quote-heading"]), null, 2));
  await mobile.screenshot({ path: `${OUT}/heading-mask-quote-mobile-mid.png` });

  const reduced = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  await reduced.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
  await waitReady(reduced);
  await reduced.waitForTimeout(400);
  console.log("reduced-hero", JSON.stringify(await inspect(reduced, ["hero-heading"]), null, 2));
  await reduced.evaluate(() => {
    document.getElementById("quality-heading")?.scrollIntoView({ block: "center" });
  });
  await reduced.waitForTimeout(400);
  console.log("reduced-quality", JSON.stringify(await inspect(reduced, ["quality-heading"]), null, 2));
  await reduced.screenshot({ path: `${OUT}/heading-mask-reduced-quality.png` });
} finally {
  await browser.close();
}
