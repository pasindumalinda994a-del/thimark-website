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

async function showQualityFoot(page) {
  await page.evaluate(() => {
    const el = document.getElementById("quality");
    if (!el) return;
    const bottom = el.getBoundingClientRect().bottom + window.scrollY;
    window.scrollTo(0, bottom - window.innerHeight);
  });
  await page.waitForTimeout(1100);
}

try {
  const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await desktop.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
  await waitReady(desktop);
  await showQualityFoot(desktop);

  const info = await desktop.evaluate(() => {
    const marks = [...document.querySelectorAll(".quality-cred")];
    return marks.map((c) => {
      const r = c.getBoundingClientRect();
      const rail = c.querySelector(".quality-cred-rail");
      const hat = c.querySelector(".quality-cred-hat");
      const copy = c.querySelector(".quality-cred-copy");
      const org = c.querySelector(".quality-cred-org");
      const cs = (el) => (el ? getComputedStyle(el) : null);
      return {
        label: c.getAttribute("aria-label"),
        box: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
        org: org
          ? { text: org.textContent, h: Math.round(org.getBoundingClientRect().height) }
          : null,
        rail: rail
          ? { bg: cs(rail).backgroundColor, w: cs(rail).width, transform: cs(rail).transform }
          : null,
        hat: hat
          ? { bg: cs(hat).backgroundColor, h: cs(hat).height, transform: cs(hat).transform }
          : null,
        copy: copy
          ? { opacity: cs(copy).opacity, bg: cs(copy).backgroundColor }
          : null,
      };
    });
  });

  await desktop.screenshot({ path: path.join(dir, "quality-marks-desktop.png") });
  const foot = desktop.locator("#quality");
  const box = await foot.boundingBox();
  if (box) {
    await desktop.screenshot({
      path: path.join(dir, "quality-marks-desktop-crop.png"),
      clip: {
        x: Math.max(0, box.x),
        y: Math.max(0, box.y + box.height - 220),
        width: box.width,
        height: 220,
      },
    });
  }

  const mobile = await browser.newPage({
    viewport: { width: 390, height: 844, isMobile: true },
  });
  await mobile.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
  await waitReady(mobile);
  await mobile.evaluate(() =>
    document.querySelector(".quality-creds")?.scrollIntoView({ block: "center" }),
  );
  await mobile.waitForTimeout(1000);
  await mobile.screenshot({ path: path.join(dir, "quality-marks-mobile.png") });

  console.log(JSON.stringify(info, null, 2));
} finally {
  await browser.close();
}
