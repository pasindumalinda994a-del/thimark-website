import { chromium } from "file:///C:/Users/pasin/AppData/Local/Temp/pw-verify/node_modules/playwright-core/index.mjs";
import { writeFileSync, mkdirSync } from "node:fs";

const OUT = "C:/Users/pasin/Documents/Web Projects/thimark-website/.tmp-verify/about";
mkdirSync(OUT, { recursive: true });
const BASE = "http://localhost:3000";
const ONLY = process.argv[2] ?? "all";
const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});
const issues = [];

async function open(path, opts) {
  const page = await browser.newPage(opts);
  page.on("pageerror", (err) => issues.push(`[${path}] ${String(err)}`));
  page.on("console", (m) => {
    if (m.type() === "error" || m.type() === "warning") issues.push(`[${path}] ${m.type()}: ${m.text()}`);
  });
  await page.goto(BASE + path, { waitUntil: "domcontentloaded" });
  await page
    .waitForFunction(() => !document.querySelector('[role="status"][aria-busy="true"]'), { timeout: 25000 })
    .catch(() => {});
  await page.waitForTimeout(900);
  return page;
}

async function wheelTo(page, targetY, step = 240) {
  for (let pass = 0; pass < 3; pass++) {
    const y = await page.evaluate(() => window.scrollY);
    let delta = targetY - y;
    if (Math.abs(delta) < 4) break;
    while (Math.abs(delta) > 0) {
      const d = Math.sign(delta) * Math.min(step, Math.abs(delta));
      await page.mouse.wheel(0, d);
      delta -= d;
      await page.waitForTimeout(16);
    }
    await page.waitForTimeout(1800);
  }
}

const topOf = (page, sel) =>
  page.evaluate((s) => {
    const el = document.querySelector(s);
    const host = el?.closest(".pin-spacer") ?? el;
    return host ? Math.round(host.getBoundingClientRect().top + window.scrollY) : null;
  }, sel);

function cellOverflow(page, sel) {
  return page.evaluate((s) => {
    const root = document.querySelector(s);
    if (!root) return [`missing ${s}`];
    const out = [];
    root.querySelectorAll(".plate-cell").forEach((cell, i) => {
      if (getComputedStyle(cell).display === "none") return;
      if (innerWidth >= 768 && getComputedStyle(cell).position !== "absolute") {
        out.push({ i, cls: cell.className.slice(0, 60), position: getComputedStyle(cell).position });
      }
      const box = cell.getBoundingClientRect();
      let maxBottom = box.top;
      let maxRight = box.left;
      cell.querySelectorAll("h1,h2,h3,p,li,a,blockquote,span,dd,dt").forEach((el) => {
        if (el.closest("[aria-hidden='true']")) return;
        const cs = getComputedStyle(el);
        if (cs.position === "absolute" || cs.position === "fixed") return;
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) return;
        let bottom = r.bottom;
        let right = r.right;
        for (let a = el.parentElement; a && a !== cell; a = a.parentElement) {
          const acs = getComputedStyle(a);
          if (/hidden|clip/.test(acs.overflow)) {
            const ar = a.getBoundingClientRect();
            bottom = Math.min(bottom, ar.bottom);
            right = Math.min(right, ar.right);
          }
        }
        maxBottom = Math.max(maxBottom, bottom);
        maxRight = Math.max(maxRight, right);
      });
      const ob = Math.round(maxBottom - box.bottom);
      const or = Math.round(maxRight - box.right);
      if (ob > 2 || or > 2) {
        out.push({ i, cls: cell.className.slice(0, 60), overflowBottom: ob, overflowRight: or });
      }
    });
    return out;
  }, sel);
}

const SECTIONS = [
  "#overview",
  "#journey",
  "#vision-mission",
  "#lean",
  "#quality-system",
  "#way-of-working",
  "#partnerships",
  "#why-thimark",
  "#network",
];

const report = {};

if (ONLY === "all" || ONLY === "desktop") {
  for (const vp of [
    { width: 1440, height: 900 },
    { width: 1280, height: 720 },
  ]) {
    const page = await open("/about", { viewport: vp });
    await page.mouse.move(vp.width - 10, 20);
    const tag = `${vp.width}`;
    report[tag] = { hScroll: await page.evaluate(() => document.documentElement.scrollWidth - innerWidth) };
    for (const sel of SECTIONS) {
      if (sel === "#journey") continue;
      const y = await topOf(page, sel);
      if (y == null) {
        report[tag][sel] = "missing";
        continue;
      }
      await wheelTo(page, y);
      report[tag][sel] = await cellOverflow(page, sel);
      await page.screenshot({ path: `${OUT}/d${tag}-${sel.slice(1)}.png` });
      const h = await page.evaluate((s) => document.querySelector(s).offsetHeight, sel);
      if (h > vp.height + 40) {
        await wheelTo(page, y + h - vp.height);
        await page.screenshot({ path: `${OUT}/d${tag}-${sel.slice(1)}-end.png` });
      }
    }
    const pinStart = await topOf(page, "#journey");
    const pinLen = 4.5 * vp.height;
    report[tag].journey = {};
    for (const p of [0.02, 0.35, 0.68, 0.98]) {
      await wheelTo(page, pinStart + p * pinLen);
      report[tag].journey[p] = await page.evaluate(() => ({
        active: [...document.querySelectorAll(".jn-item")].findIndex((li) => li.dataset.active === "true"),
        numeral: document.querySelector("[data-jn-numeral]")?.textContent,
      }));
      if (p === 0.35) report[tag].journeyOverflow = await cellOverflow(page, "#journey");
      await page.screenshot({ path: `${OUT}/d${tag}-journey-${Math.round(p * 100)}.png` });
    }
    await page.close();
  }
}

if (ONLY === "all" || ONLY === "mobile") {
  const mobile = await open("/about", { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  report.mobile = { hScroll: await mobile.evaluate(() => document.documentElement.scrollWidth - innerWidth) };
  for (const sel of SECTIONS) {
    const h = await mobile.evaluate((s) => document.querySelector(s)?.offsetHeight ?? 0, sel);
    const y = await topOf(mobile, sel);
    if (y == null) continue;
    for (let off = 0, k = 0; off < h && k < 6; off += 780, k++) {
      await mobile.evaluate((t) => window.scrollTo(0, t), y + off);
      await mobile.waitForTimeout(1300);
      await mobile.screenshot({ path: `${OUT}/m-${sel.slice(1)}-${k}.png` });
    }
  }
  await mobile.close();
}

if (ONLY === "all" || ONLY === "reduced") {
  const reduced = await open("/about", { viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  report.reduced = {};
  for (const sel of ["#overview", "#journey", "#quality-system", "#why-thimark"]) {
    await reduced.evaluate((s) => document.querySelector(s)?.scrollIntoView(), sel);
    await reduced.waitForTimeout(700);
    report.reduced[sel] = await reduced.evaluate((s) => {
      const root = document.querySelector(s);
      const hidden = [...root.querySelectorAll("h1,h2,h3,p,img")].filter(
        (el) => Number(getComputedStyle(el).opacity) < 0.5 || getComputedStyle(el).visibility === "hidden",
      ).length;
      return { hidden };
    }, sel);
    await reduced.screenshot({ path: `${OUT}/r-${sel.slice(1)}.png` });
  }
  await reduced.close();
}

if (ONLY === "all" || ONLY === "home") {
  const home = await open("/", { viewport: { width: 1440, height: 900 } });
  await home.mouse.move(1430, 20);
  const start = await topOf(home, "#about");
  const len = 3.5 * 900;
  report.home = {};
  for (const p of [0.1, 0.6, 0.98]) {
    await wheelTo(home, start + p * len);
    report.home[p] = await home.evaluate(() => ({
      slides: document.querySelectorAll("[data-story-slide]").length,
      numeral: document.querySelector("#about [data-story-numeral], #about [data-numeral]")?.textContent ?? null,
    }));
    await home.screenshot({ path: `${OUT}/home-story-${Math.round(p * 100)}.png` });
  }
  await home.close();
}

await browser.close();
report.issues = issues;
writeFileSync(`${OUT}/report.json`, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
