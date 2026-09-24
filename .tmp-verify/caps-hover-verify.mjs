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

async function scrollToCaps(page) {
  await page.evaluate(() => {
    document.getElementById("manufacturing")?.scrollIntoView({ block: "start" });
  });
  await page.waitForTimeout(900);
}

function glyphStateFn() {
  const cards = [...document.querySelectorAll("[data-caps-card]")];
  const strokeState = (el) => {
    const cs = getComputedStyle(el);
    const dash = parseFloat(cs.strokeDasharray) || 0;
    const offset = parseFloat(cs.strokeDashoffset) || 0;
    const drawn = dash > 0 ? 1 - Math.min(1, Math.abs(offset) / dash) : 1;
    return {
      drawn: Number(drawn.toFixed(3)),
      opacity: Number(Number(cs.opacity).toFixed(3)),
    };
  };
  return {
    hoverMedia: window.matchMedia(
      "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    ).matches,
    cards: cards.map((card) => {
      const vis = [...card.querySelectorAll('[data-glyph-stroke="visible"]')];
      const hid = [...card.querySelectorAll('[data-glyph-stroke="hidden"]')];
      const visDrawn = vis.map((el) => strokeState(el).drawn);
      const hidOp = hid.map((el) => strokeState(el).opacity);
      const avg = (arr) =>
        arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
      return {
        tag: card.querySelector(".caps-card-head span")?.textContent ?? "",
        visAvg: Number(avg(visDrawn).toFixed(3)),
        hidAvg: Number(avg(hidOp).toFixed(3)),
        visMin: Number(Math.min(...visDrawn, 1).toFixed(3)),
      };
    }),
  };
}

async function glyphState(page) {
  return page.evaluate(glyphStateFn);
}

const log = [];
function record(label, data) {
  log.push({ label, data });
  console.log(label, JSON.stringify(data, null, 2));
}

try {
  const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await desktop.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
  await waitReady(desktop);
  await scrollToCaps(desktop);

  const drawn = await glyphState(desktop);
  record("desktop after scroll", {
    hoverMedia: drawn.hoverMedia,
    visAvg: drawn.cards.map((c) => c.visAvg),
    hidAvg: drawn.cards.map((c) => c.hidAvg),
  });

  const first = desktop.locator("[data-caps-card]").first();
  const box = await first.boundingBox();
  if (!box) throw new Error("first card missing");

  await desktop.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await desktop.waitForTimeout(80);
  const midHover = await glyphState(desktop);
  record("desktop hover mid-draw", {
    visMin0: midHover.cards[0].visMin,
    visAvg0: midHover.cards[0].visAvg,
    visAvg1: midHover.cards[1].visAvg,
  });

  await desktop.waitForTimeout(1100);
  const afterHover = await glyphState(desktop);
  record("desktop hover complete", {
    visAvg0: afterHover.cards[0].visAvg,
    hidAvg0: afterHover.cards[0].hidAvg,
  });

  await desktop.mouse.move(20, 20);
  await desktop.waitForTimeout(80);
  await desktop.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await desktop.waitForTimeout(80);
  const beforeLeave = await glyphState(desktop);
  await desktop.mouse.move(20, 20);
  await desktop.waitForTimeout(80);
  const afterLeave = await glyphState(desktop);
  record("desktop leave mid-draw", {
    visMinBeforeLeave: beforeLeave.cards[0].visMin,
    visAvgAfterLeave: afterLeave.cards[0].visAvg,
    hidAvgAfterLeave: afterLeave.cards[0].hidAvg,
  });

  const allCards = [];
  const cardCount = await desktop.locator("[data-caps-card]").count();
  for (let i = 0; i < cardCount; i++) {
    const cardBox = await desktop.locator("[data-caps-card]").nth(i).boundingBox();
    if (!cardBox || cardBox.x > 1440 - 40) continue;
    await desktop.mouse.move(20, 20);
    await desktop.waitForTimeout(40);
    await desktop.mouse.move(
      cardBox.x + Math.min(cardBox.width / 2, 80),
      cardBox.y + cardBox.height / 2,
    );
    await desktop.waitForTimeout(80);
    const mid = await glyphState(desktop);
    await desktop.mouse.move(20, 20);
    await desktop.waitForTimeout(50);
    const done = await glyphState(desktop);
    allCards.push({
      i,
      visMinMid: mid.cards[i].visMin,
      visAvgDone: done.cards[i].visAvg,
    });
  }
  record("desktop all cards hover", allCards);

  const mobile = await browser.newPage({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  await mobile.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
  await waitReady(mobile);
  await scrollToCaps(mobile);
  const mobileDrawn = await glyphState(mobile);
  const mbox = await mobile.locator("[data-caps-card]").first().boundingBox();
  if (mbox) {
    await mobile.mouse.move(mbox.x + mbox.width / 2, mbox.y + mbox.height / 2);
    await mobile.waitForTimeout(80);
  }
  const mobileHover = await glyphState(mobile);
  record("mobile hover", {
    hoverMedia: mobileDrawn.hoverMedia,
    visAvgAfterScroll: mobileDrawn.cards[0]?.visAvg,
    visMinOnMove: mobileHover.cards[0]?.visMin,
  });

  const reduced = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await reduced.emulateMedia({ reducedMotion: "reduce" });
  await reduced.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
  await waitReady(reduced);
  await scrollToCaps(reduced);
  const reducedDrawn = await glyphState(reduced);
  const rbox = await reduced.locator("[data-caps-card]").first().boundingBox();
  if (rbox) {
    await reduced.mouse.move(rbox.x + rbox.width / 2, rbox.y + rbox.height / 2);
    await reduced.waitForTimeout(80);
  }
  const reducedHover = await glyphState(reduced);
  record("reduced motion hover", {
    hoverMedia: reducedDrawn.hoverMedia,
    visAvgAfterScroll: reducedDrawn.cards[0]?.visAvg,
    visMinOnMove: reducedHover.cards[0]?.visMin,
  });

  const ok =
    drawn.hoverMedia === true &&
    drawn.cards.every((c) => c.visAvg > 0.85) &&
    midHover.cards[0].visMin < 0.85 &&
    afterHover.cards[0].visAvg > 0.85 &&
    beforeLeave.cards[0].visMin < 0.95 &&
    afterLeave.cards[0].visAvg > 0.85 &&
    mobileDrawn.hoverMedia === false &&
    (mobileHover.cards[0]?.visMin ?? 0) > 0.85 &&
    reducedDrawn.hoverMedia === false &&
    (reducedHover.cards[0]?.visMin ?? 0) > 0.85 &&
    allCards.length >= 4 &&
    allCards.every((c) => c.visMinMid < 0.85 && c.visAvgDone > 0.85);

  if (!ok) {
    throw new Error("capability hover redraw checks failed");
  }
  console.log("PASS");
} finally {
  await browser.close();
}
