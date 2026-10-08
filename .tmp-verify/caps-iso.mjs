import { chromium } from "file:///C:/Users/pasin/AppData/Local/Temp/pw-verify/node_modules/playwright-core/index.mjs";
import { mkdir } from "node:fs/promises";

const out = ".tmp-verify/caps-iso";
await mkdir(out, { recursive: true });

const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});

function cardState() {
  return [...document.querySelectorAll("[data-caps-card]")].map((card) => {
    const svg = card.querySelector(".caps-glyph");
    const box = card.querySelector(".caps-card-glyph")?.getBoundingClientRect();
    const r = svg?.getBoundingClientRect();
    const strokes = [...(svg?.querySelectorAll("[data-glyph-stroke]") ?? [])];
    const ratios = strokes
      .map((el) => {
        const len = el.getTotalLength();
        if (len < 8) return null;
        return Math.abs(parseFloat(el.style.strokeDashoffset) || 0) / len;
      })
      .filter((v) => v != null);
    const vb = svg?.viewBox.baseVal;
    const scale = vb && r ? Math.min(r.width / vb.width, r.height / vb.height) : null;
    return {
      title: card.querySelector("[data-caps-title]")?.textContent,
      viewBox: svg?.getAttribute("viewBox"),
      paths: strokes.length,
      undrawn: ratios.filter((v) => v > 0.2).length,
      box: box ? { w: Math.round(box.width), h: Math.round(box.height) } : null,
      drawnPx: scale && vb ? { w: Math.round(vb.width * scale), h: Math.round(vb.height * scale) } : null,
      strokePx: scale ? Math.round(scale * 100) / 100 : null,
    };
  });
}

async function run(label, viewport, reduced) {
  const context = await browser.newContext({
    viewport,
    reducedMotion: reduced ? "reduce" : "no-preference",
  });
  const page = await context.newPage();
  const errors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error" || msg.type() === "warning") errors.push(msg.text());
  });
  page.on("pageerror", (err) => errors.push(err.message));
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  await page.waitForFunction(
    () => !document.querySelector('[role="status"][aria-busy="true"]'),
    null,
    { timeout: 40000 },
  );
  await page.waitForTimeout(600);

  const top = await page.evaluate(() => {
    const el = document.getElementById("caps-heading")?.closest("section");
    return el ? el.getBoundingClientRect().top + window.scrollY : 0;
  });

  await page.evaluate((y) => window.scrollTo(0, y - window.innerHeight * 0.5), top);
  await page.waitForTimeout(viewport.width < 768 ? 150 : 500);
  if (viewport.width < 768) {
    await page.locator("[data-caps-card]").first().scrollIntoViewIfNeeded();
    await page.waitForTimeout(450);
  }
  const during = await page.evaluate(cardState);
  if (viewport.width < 768) {
    await page.locator("[data-caps-card]").first().screenshot({ path: `${out}/${label}-card1-mid.png` });
  }
  await page.evaluate((y) => window.scrollTo(0, y), top);
  await page.waitForTimeout(2600);
  const settled = await page.evaluate(cardState);
  await page.screenshot({ path: `${out}/${label}-start.png` });

  let hover = null;
  if (!reduced && viewport.width >= 768) {
    const card = page.locator("[data-caps-card]").nth(1);
    await page.mouse.move(5, 5);
    await card.hover();
    await page.waitForTimeout(350);
    hover = (await page.evaluate(cardState))[1];
    await page.waitForTimeout(1800);
    await page.evaluate(
      (y) => window.scrollTo(0, y + window.innerHeight * 1.4),
      top,
    );
    await page.waitForTimeout(2200);
    await page.screenshot({ path: `${out}/${label}-end.png` });
  } else if (viewport.width < 768) {
    for (let i = 0; i < 6; i++) {
      await page.locator("[data-caps-card]").nth(i).scrollIntoViewIfNeeded();
      await page.waitForTimeout(250);
    }
    await page.locator("[data-caps-card]").nth(5).screenshot({ path: `${out}/${label}-card6.png` });
    await page.locator("[data-caps-card]").nth(1).scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await page.locator("[data-caps-card]").nth(1).screenshot({ path: `${out}/${label}-card2.png` });
  }

  const about = await page.evaluate(() => {
    const marks = [...document.querySelectorAll(".about-chapter-mark")];
    return marks.map((m) => ({
      viewBox: m.getAttribute("viewBox"),
      paths: m.querySelectorAll("path").length,
    }));
  });

  await context.close();
  const brief = (list) => list.map((c) => `${c.viewBox}:${c.paths}p/${c.undrawn}u`);
  return {
    label,
    errors,
    during: brief(during),
    settled: brief(settled),
    hoverUndrawn: hover?.undrawn ?? null,
    about: about.map((a) => a.viewBox),
  };
}

const desktop = await run("desktop", { width: 1440, height: 900 }, false);
const mobile = await run("mobile", { width: 390, height: 844 }, false);
const reduced = await run("reduced", { width: 1440, height: 900 }, true);
console.log(JSON.stringify({ desktop, mobile, reduced }, null, 2));
await browser.close();
