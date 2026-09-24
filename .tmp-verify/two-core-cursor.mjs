import puppeteer from "puppeteer-core";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const chrome = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: "new",
  args: ["--hide-scrollbars"],
});

async function waitForApp(page) {
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle0" });
  await page.waitForFunction(
    () => !document.querySelector('[aria-busy="true"]'),
    { timeout: 40000 },
  );
}

function cursorState() {
  const root = document.querySelector("[data-custom-cursor]");
  const plus = root?.querySelector(":scope > div");
  const frame = root?.querySelector(":scope > div.absolute") ?? root?.children[1];
  const dashes = frame?.querySelector("[data-explore-dashes]");
  const marks = frame ? [...frame.querySelectorAll("[data-explore-plus]")] : [];
  const label = frame?.querySelector("[data-explore-label]");
  const rect = root?.getBoundingClientRect();
  const hit = document.elementFromPoint(rect ? rect.x + 12 : 0, rect ? rect.y + 12 : 0);
  return {
    headOpacity: root ? getComputedStyle(root).opacity : null,
    headTransform: root ? getComputedStyle(root).transform : null,
    headRect: rect
      ? { x: Math.round(rect.x), y: Math.round(rect.y), w: Math.round(rect.width), h: Math.round(rect.height) }
      : null,
    plusOpacity: plus ? getComputedStyle(plus).opacity : null,
    plusVisibility: plus ? getComputedStyle(plus).visibility : null,
    label: label?.textContent?.replace(/\s+/g, " ").trim() ?? null,
    labelOpacity: label ? getComputedStyle(label).opacity : null,
    dashOpacity: dashes ? getComputedStyle(dashes).opacity : null,
    dashScale: dashes ? getComputedStyle(dashes).transform : null,
    markCount: marks.length,
    markOpacity: marks.map((el) => getComputedStyle(el).opacity),
    markTransform: marks.map((el) => getComputedStyle(el).transform),
    dashCount: frame?.querySelectorAll("[stroke-dasharray]").length ?? 0,
    underCursor: hit ? `${hit.tagName}.${hit.className}`.slice(0, 80) : null,
  };
}

try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await waitForApp(page);

  await page.mouse.move(720, 360);
  await new Promise((r) => setTimeout(r, 300));
  const hero = await page.evaluate(() => {
    const head = document.querySelector("[data-custom-cursor]");
    const plus = head?.querySelector(":scope > div");
    return {
      hasClass: document.documentElement.classList.contains("has-custom-cursor"),
      headOpacity: head ? getComputedStyle(head).opacity : null,
      plusOpacity: plus ? getComputedStyle(plus).opacity : null,
      bodyCursor: getComputedStyle(document.body).cursor,
    };
  });
  console.log("hero idle", hero);
  await page.screenshot({
    path: path.join(dir, "cursor-desktop-hero.png"),
    clip: { x: 670, y: 310, width: 100, height: 100 },
  });

  const image = await page.waitForSelector("[data-core-image='0']");
  await image.evaluate((el) => el.scrollIntoView({ block: "center" }));
  await new Promise((r) => setTimeout(r, 700));
  const box = await image.boundingBox();
  const cx = box.x + box.width / 2;
  const cy = box.y + box.height / 2;
  await page.mouse.move(cx, cy);
  await new Promise((r) => setTimeout(r, 700));

  const hover = await page.evaluate(cursorState);
  console.log("explore hover mouse", { cx, cy });
  console.log("explore hover", hover);
  const hx = hover.headRect?.x ?? cx;
  const hy = hover.headRect?.y ?? cy;
  await page.screenshot({
    path: path.join(dir, "cursor-two-core-hover.png"),
    clip: {
      x: Math.max(0, hx - 20),
      y: Math.max(0, hy - 20),
      width: 100,
      height: 100,
    },
  });
  await page.screenshot({
    path: path.join(dir, "cursor-two-core-hover-full.png"),
  });

  await page.mouse.move(80, 80);
  await new Promise((r) => setTimeout(r, 700));
  const leave = await page.evaluate(cursorState);
  console.log("explore leave", leave);

  const image2 = await page.$("[data-core-image='1']");
  const box2 = await image2.boundingBox();
  const cx2 = box2.x + box2.width / 2;
  const cy2 = box2.y + box2.height / 2;
  await page.mouse.move(cx2, cy2);
  await new Promise((r) => setTimeout(r, 700));
  const hover2 = await page.evaluate(cursorState);
  console.log("explore hover 2 mouse", { cx2, cy2 });
  console.log("explore hover 2", hover2);
  const hx2 = hover2.headRect?.x ?? cx2;
  const hy2 = hover2.headRect?.y ?? cy2;
  await page.screenshot({
    path: path.join(dir, "cursor-two-core-hover-2.png"),
    clip: {
      x: Math.max(0, hx2 - 20),
      y: Math.max(0, hy2 - 20),
      width: 100,
      height: 100,
    },
  });

  await page.mouse.move(cx, cy);
  await new Promise((r) => setTimeout(r, 250));
  await image.click();
  await new Promise((r) => setTimeout(r, 800));
  const afterClick = await page.evaluate(() => ({
    hash: window.location.hash,
  }));
  console.log("explore click", afterClick);
} finally {
  await browser.close();
}
