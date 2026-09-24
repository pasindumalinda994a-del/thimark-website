import { chromium } from "file:///C:/Users/pasin/AppData/Local/Temp/pw-verify/node_modules/playwright-core/index.mjs";

const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});

async function waitReady(page) {
  await page.waitForFunction(
    () => !document.querySelector('[role="status"][aria-busy="true"]'),
    { timeout: 40000 },
  );
  await page.waitForTimeout(400);
}

function glyphStateFn() {
  const strokeState = (el) => {
    const cs = getComputedStyle(el);
    const dash = parseFloat(cs.strokeDasharray) || 0;
    const offset = parseFloat(cs.strokeDashoffset) || 0;
    const drawn = dash > 0 ? 1 - Math.min(1, Math.abs(offset) / dash) : 1;
    return Number(drawn.toFixed(3));
  };
  const panels = [...document.querySelectorAll("[data-chapter-glyph]")];
  const about = document.getElementById("about");
  return {
    hoverMedia: window.matchMedia(
      "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    ).matches,
    aboutTop: about ? Math.round(about.getBoundingClientRect().top) : null,
    y: Math.round(window.scrollY),
    panels: panels.map((panel, i) => {
      const vis = [...panel.querySelectorAll('[data-glyph-stroke="visible"]')];
      const hid = [...panel.querySelectorAll('[data-glyph-stroke="hidden"]')];
      const visDrawn = vis.map(strokeState);
      const hidOp = hid.map((el) => Number(getComputedStyle(el).opacity));
      const avg = (arr) =>
        arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
      return {
        i,
        opacity: Number(Number(getComputedStyle(panel).opacity).toFixed(3)),
        visAvg: Number(avg(visDrawn).toFixed(3)),
        visMin: Number(Math.min(...visDrawn, 1).toFixed(3)),
        hidAvg: Number(avg(hidOp).toFixed(3)),
      };
    }),
  };
}

async function glyphState(page) {
  return page.evaluate(glyphStateFn);
}

function active(state) {
  const idx = state.panels.findIndex((p) => p.opacity > 0.5);
  return { idx, panel: state.panels[idx] ?? null };
}

function record(label, data) {
  console.log(label, JSON.stringify(data, null, 2));
}

async function pinAbout(page) {
  for (let i = 0; i < 80; i++) {
    await page.mouse.wheel(0, 180);
    await page.waitForTimeout(40);
    const s = await glyphState(page);
    if (s.aboutTop !== null && s.aboutTop <= 2 && s.aboutTop >= -8) return s;
  }
  return glyphState(page);
}

async function waitForDrawStart(page, index, timeout = 2000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const s = await glyphState(page);
    const panel = s.panels[index];
    if (panel && panel.opacity > 0.4 && panel.visMin < 0.85) return s;
    await page.waitForTimeout(40);
  }
  return glyphState(page);
}

try {
  const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await desktop.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
  await waitReady(desktop);

  const before = await glyphState(desktop);
  record("desktop before about", {
    aboutTop: before.aboutTop,
    visAvg0: before.panels[0]?.visAvg,
  });

  const pinned = await pinAbout(desktop);
  record("desktop pin", {
    aboutTop: pinned.aboutTop,
    visMin0: pinned.panels[0]?.visMin,
    visAvg0: pinned.panels[0]?.visAvg,
    opacity0: pinned.panels[0]?.opacity,
  });

  const pinDraw = await waitForDrawStart(desktop, 0, 1200);
  record("desktop chapter 0 draw", {
    visMin0: pinDraw.panels[0]?.visMin,
    visAvg0: pinDraw.panels[0]?.visAvg,
  });
  await desktop.waitForTimeout(1100);
  const pinDone = await glyphState(desktop);
  record("desktop chapter 0 done", {
    visAvg0: pinDone.panels[0]?.visAvg,
    hidAvg0: pinDone.panels[0]?.hidAvg,
  });

  const stations = desktop.locator("[data-story-station]");
  const chapterDraws = [];
  const count = await stations.count();
  for (let i = 1; i < count; i++) {
    await stations.nth(i).click();
    const mid = await waitForDrawStart(desktop, i, 1800);
    await desktop.waitForTimeout(1000);
    const done = await glyphState(desktop);
    chapterDraws.push({
      i,
      visMinMid: mid.panels[i]?.visMin,
      visAvgDone: done.panels[i]?.visAvg,
      opacityDone: done.panels[i]?.opacity,
    });
  }
  record("desktop chapter clicks", chapterDraws);

  const field = desktop.locator(".about-chapter-glyph");
  const box = await field.boundingBox();
  if (!box) throw new Error("glyph field missing");
  await desktop.mouse.move(20, 20);
  await desktop.waitForTimeout(80);
  await desktop.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  const hoverMid = await waitForDrawStart(desktop, count - 1, 800);
  record("desktop hover mid", {
    visMin: hoverMid.panels[count - 1]?.visMin,
    visAvg: hoverMid.panels[count - 1]?.visAvg,
  });
  await desktop.waitForTimeout(1100);
  const hoverDone = await glyphState(desktop);
  record("desktop hover done", {
    visAvg: hoverDone.panels[count - 1]?.visAvg,
    hidAvg: hoverDone.panels[count - 1]?.hidAvg,
  });

  await desktop.mouse.move(20, 20);
  await desktop.waitForTimeout(60);
  await desktop.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  const beforeLeave = await waitForDrawStart(desktop, count - 1, 800);
  await desktop.mouse.move(20, 20);
  await desktop.waitForTimeout(80);
  const afterLeave = await glyphState(desktop);
  record("desktop leave mid-draw", {
    visMinBefore: beforeLeave.panels[count - 1]?.visMin,
    visAvgAfter: afterLeave.panels[count - 1]?.visAvg,
  });

  const mobile = await browser.newPage({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  await mobile.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
  await waitReady(mobile);
  for (let i = 0; i < 50; i++) {
    await mobile.mouse.wheel(0, 200);
    await mobile.waitForTimeout(40);
    const s = await glyphState(mobile);
    if (s.aboutTop !== null && s.aboutTop <= 80) break;
  }
  await mobile.waitForTimeout(400);
  const mobileStart = await glyphState(mobile);
  await mobile.locator("[data-story-station]").nth(1).click();
  const mobileMid = await waitForDrawStart(mobile, 1, 1800);
  const fieldBox = await mobile.locator(".about-chapter-glyph").boundingBox();
  if (fieldBox) {
    await mobile.mouse.move(fieldBox.x + fieldBox.width / 2, fieldBox.y + 20);
    await mobile.waitForTimeout(80);
  }
  const mobileHover = await glyphState(mobile);
  record("mobile", {
    hoverMedia: mobileStart.hoverMedia,
    visMinOnChapter: mobileMid.panels[1]?.visMin,
    visMinOnMove: mobileHover.panels[1]?.visMin,
  });

  const reduced = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await reduced.emulateMedia({ reducedMotion: "reduce" });
  await reduced.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
  await waitReady(reduced);
  await reduced.evaluate(() => {
    document.getElementById("about")?.scrollIntoView({ block: "start" });
  });
  await reduced.waitForTimeout(500);
  const reducedStart = await glyphState(reduced);
  const rbox = await reduced.locator(".about-chapter-glyph").boundingBox();
  if (rbox) {
    await reduced.mouse.move(rbox.x + rbox.width / 2, rbox.y + rbox.height / 2);
    await reduced.waitForTimeout(80);
  }
  const reducedHover = await glyphState(reduced);
  record("reduced motion", {
    hoverMedia: reducedStart.hoverMedia,
    visAvg0: reducedStart.panels[0]?.visAvg,
    visMinOnMove: reducedHover.panels[0]?.visMin,
  });

  const ok =
    pinDone.panels[0]?.visAvg > 0.85 &&
    chapterDraws.length >= 3 &&
    chapterDraws.every((c) => c.visMinMid < 0.85 && c.visAvgDone > 0.85) &&
    (hoverMid.panels[count - 1]?.visMin ?? 1) < 0.85 &&
    (hoverDone.panels[count - 1]?.visAvg ?? 0) > 0.85 &&
    (beforeLeave.panels[count - 1]?.visMin ?? 1) < 0.95 &&
    (afterLeave.panels[count - 1]?.visAvg ?? 0) > 0.85 &&
    mobileStart.hoverMedia === false &&
    (mobileMid.panels[1]?.visMin ?? 1) < 0.85 &&
    reducedStart.hoverMedia === false &&
    (reducedHover.panels[0]?.visMin ?? 0) > 0.85;

  if (!ok) throw new Error("about glyph draw checks failed");
  console.log("PASS");
} finally {
  await browser.close();
}
