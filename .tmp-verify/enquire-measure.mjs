import { chromium } from "file:///C:/Users/pasin/AppData/Local/Temp/pw-verify/node_modules/playwright-core/index.mjs";

const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3000/enquire", { waitUntil: "networkidle" });
await page.waitForTimeout(1200);

const box = (el) => {
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return {
    t: Math.round(r.top),
    b: Math.round(r.bottom),
    h: Math.round(r.height),
    text: (el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 90),
  };
};

const data = await page.evaluate(boxFn => {
  const measure = (sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return {
      t: Math.round(r.top),
      b: Math.round(r.bottom),
      h: Math.round(r.height),
      text: (el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 90),
    };
  };
  const section = document.querySelector("#enquire").getBoundingClientRect();
  return {
    sidebar: measure('aside a[aria-label="Enquire with Thimark"]'),
    section: { t: Math.round(section.top), b: Math.round(section.bottom), h: Math.round(section.height) },
    note: measure(".contact-note"),
    submit: measure(".contact-submit"),
    files: measure(".contact-files"),
    message: measure("#enquire-message"),
    vh: window.innerHeight,
  };
});
console.log(JSON.stringify(data, null, 2));
await page.locator(".contact-submit").scrollIntoViewIfNeeded();
await page.screenshot({ path: ".tmp-verify/enquire/desktop-submit.png" });

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto("http://localhost:3000/enquire", { waitUntil: "networkidle" });
await mobile.locator('button[aria-label="Open menu"]').click();
await mobile.waitForTimeout(600);
const m = await mobile.evaluate(() => {
  const el = document.querySelector('#mobile-nav a[aria-label="Enquire with Thimark"]');
  const r = el.getBoundingClientRect();
  return { t: Math.round(r.top), b: Math.round(r.bottom), h: Math.round(r.height), vh: innerHeight, text: el.textContent.trim() };
});
console.log("mobile", JSON.stringify(m));
await browser.close();
