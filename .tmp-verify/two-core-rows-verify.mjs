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
    const section = document.getElementById("capabilities");
    const heading = document.getElementById("two-core-heading");
    const lede = section?.querySelector(".two-core-lede");
    const intro = section?.querySelector(".two-core-intro");
    const images = section?.querySelector(".grid.grid-cols-1");
    const copy = section?.querySelector(".two-core-copy");
    const colA = document.getElementById("automotive");
    const colB = document.getElementById("machinery");
    const box = (n) => {
      if (!n) return null;
      const r = n.getBoundingClientRect();
      return {
        top: Math.round(r.top),
        bottom: Math.round(r.bottom),
        height: Math.round(r.height),
        width: Math.round(r.width),
      };
    };
    const text = (n) => (n?.innerText ?? "").replace(/\s+/g, " ").trim();
    const lines = [...(section?.querySelectorAll("span[aria-hidden]") ?? [])]
      .filter((n) => n.className.includes("h-seg"))
      .map((n) => ({
        className: n.className,
        top: Math.round(n.getBoundingClientRect().top),
      }));
    return {
      vh: window.innerHeight,
      row: Math.round(row * 10) / 10,
      row1: Math.round(row),
      row3: Math.round(3 * row),
      row12: Math.round(12 * row),
      section: box(section),
      intro: box(intro),
      heading: box(heading),
      lede: box(lede),
      images: box(images),
      copy: box(copy),
      colA: box(colA),
      colB: box(colB),
      headingText: text(heading),
      ledeText: text(lede),
      colAText: text(colA),
      colBText: text(colB),
      bodyGone:
        !text(section).includes("We design, fabricate") &&
        !text(section).includes("From individual brackets") &&
        !text(section).includes("We design and manufacture customized") &&
        !text(section).includes("From fabricated systems"),
      lines,
    };
  });
}

const log = [];

try {
  const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await desktop.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
  await waitReady(desktop);
  await desktop.evaluate(() => {
    document.getElementById("capabilities")?.scrollIntoView();
  });
  await desktop.waitForTimeout(800);
  const d = await snapshot(desktop);
  log.push({ desktop: d });
  await desktop.screenshot({
    path: path.join(dir, "two-core-desktop.png"),
    fullPage: false,
  });
  await desktop.evaluate(() => {
    const section = document.getElementById("capabilities");
    if (section) {
      window.scrollTo(0, section.offsetTop + section.offsetHeight - window.innerHeight);
    }
  });
  await desktop.waitForTimeout(400);
  await desktop.screenshot({
    path: path.join(dir, "two-core-desktop-titles.png"),
    fullPage: false,
  });

  const mobile = await browser.newPage({
    viewport: { width: 390, height: 844, isMobile: true },
  });
  await mobile.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
  await waitReady(mobile);
  await mobile.evaluate(() => {
    document.getElementById("capabilities")?.scrollIntoView();
  });
  await mobile.waitForTimeout(800);
  const m = await snapshot(mobile);
  log.push({ mobile: m });
  await mobile.screenshot({
    path: path.join(dir, "two-core-mobile-top.png"),
    fullPage: false,
  });
  await mobile.evaluate(() => {
    document.getElementById("automotive")?.scrollIntoView();
  });
  await mobile.waitForTimeout(400);
  await mobile.screenshot({
    path: path.join(dir, "two-core-mobile-copy.png"),
    fullPage: false,
  });

  console.log(JSON.stringify(log, null, 2));
} finally {
  await browser.close();
}
