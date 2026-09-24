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
    const eyebrow = document.querySelector(".two-core-eyebrow");
    const heading = document.getElementById("two-core-heading");
    const er = eyebrow.getBoundingClientRect();
    const hr = heading.getBoundingClientRect();
    return {
      text: eyebrow.textContent.trim(),
      fontSize: getComputedStyle(eyebrow).fontSize,
      eyebrowBottom: Math.round(er.bottom),
      headingTop: Math.round(hr.top),
      gap: Math.round(hr.top - er.bottom),
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
  await desktop.screenshot({ path: ".tmp-verify/two-core-eyebrow-desktop.png" });

  const mobile = await browser.newPage({
    viewport: { width: 390, height: 844, isMobile: true },
  });
  await mobile.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
  await ready(mobile);
  await mobile.evaluate(() => document.getElementById("capabilities")?.scrollIntoView());
  await mobile.waitForTimeout(600);
  console.log("mobile", JSON.stringify(await measure(mobile)));
  await mobile.screenshot({ path: ".tmp-verify/two-core-eyebrow-mobile.png" });
} finally {
  await browser.close();
}
