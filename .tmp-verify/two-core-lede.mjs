import { chromium } from "file:///C:/Users/pasin/AppData/Local/Temp/pw-verify/node_modules/playwright-core/index.mjs";

const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});

async function ready(page) {
  await page.waitForFunction(
    () => !document.querySelector('[role="status"][aria-busy="true"]'),
    { timeout: 40000 },
  );
  await page.waitForTimeout(500);
}

async function measure(page) {
  return page.evaluate(() => {
    const lede = document.querySelector(".two-core-lede");
    const cs = getComputedStyle(lede);
    const r = lede.getBoundingClientRect();
    return {
      fontSize: cs.fontSize,
      height: Math.round(r.height),
      top: Math.round(r.top),
      bottom: Math.round(r.bottom),
      row3: Math.round((3 * innerHeight) / 14),
    };
  });
}

try {
  const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await desktop.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
  await ready(desktop);
  await desktop.evaluate(() => document.getElementById("capabilities")?.scrollIntoView());
  await desktop.waitForTimeout(600);
  console.log("desktop", JSON.stringify(await measure(desktop)));
  await desktop.screenshot({ path: ".tmp-verify/two-core-lede-16.png" });

  const mobile = await browser.newPage({
    viewport: { width: 390, height: 844, isMobile: true },
  });
  await mobile.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
  await ready(mobile);
  await mobile.evaluate(() => document.getElementById("capabilities")?.scrollIntoView());
  await mobile.waitForTimeout(600);
  console.log("mobile", JSON.stringify(await measure(mobile)));
  await mobile.screenshot({ path: ".tmp-verify/two-core-lede-16-mobile.png" });
} finally {
  await browser.close();
}
