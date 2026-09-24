import { chromium } from "file:///C:/Users/pasin/AppData/Local/Temp/pw-verify/node_modules/playwright-core/index.mjs";

const BASE = "http://localhost:3000";
const PAGES = [
  { path: "/about", heading: "About Us under development", label: "About Us" },
  { path: "/automotive", heading: "Automotive under development", label: "Automotive" },
  {
    path: "/industrial-machinery",
    heading: "Industrial Machinery under development",
    label: "Industrial Machinery",
  },
  { path: "/newsroom", heading: "Newsroom under development", label: "Newsroom" },
  { path: "/gallery", heading: "Gallery under development", label: "Gallery" },
  { path: "/contact", heading: "Contact Us under development", label: "Contact Us" },
];

const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});

async function inspect(page) {
  return page.evaluate(() => {
    const h1 = document.querySelector("h1");
    const current = [...document.querySelectorAll('a[aria-current="page"]')].map((a) => ({
      text: a.textContent.replace(/\s+/g, " ").trim(),
      href: a.getAttribute("href"),
    }));
    const raq = document.querySelector('a[aria-label="Request a Quote"]');
    const logo = document.querySelector('a[aria-label="Thimark home"]');
    return {
      title: document.title,
      heading: h1?.textContent.replace(/\s+/g, " ").trim() ?? null,
      current,
      raqHref: raq?.getAttribute("href") ?? null,
      logoHref: logo?.getAttribute("href") ?? null,
    };
  });
}

const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const results = [];

for (const spec of PAGES) {
  const res = await page.goto(`${BASE}${spec.path}`, { waitUntil: "networkidle" });
  await page.waitForSelector("h1");
  const info = await inspect(page);
  const currentMatch = info.current.some(
    (c) => c.href === spec.path || c.text.includes(spec.label),
  );
  results.push({
    viewport: "desktop",
    path: spec.path,
    status: res?.status() ?? 0,
    headingOk: info.heading === spec.heading,
    heading: info.heading,
    title: info.title,
    currentOk: currentMatch,
    current: info.current,
    raqHref: info.raqHref,
    logoHref: info.logoHref,
  });
}

await page.goto(`${BASE}/about`, { waitUntil: "networkidle" });
await page.click('aside a[href="/newsroom"]');
await page.waitForURL("**/newsroom");
const clicked = await inspect(page);

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(`${BASE}/gallery`, { waitUntil: "networkidle" });
await mobile.waitForSelector("h1");
const mobileInfo = await inspect(mobile);
await mobile.click('button[aria-label="Open menu"]');
await mobile.click('#mobile-nav a[href="/contact"]');
await mobile.waitForURL("**/contact");
const mobileClicked = await inspect(mobile);

await page.goto(`${BASE}/about`, { waitUntil: "networkidle" });
await page.click('aside a[aria-label="Thimark home"]');
await page.waitForURL((url) => url.pathname === "/");

console.log(JSON.stringify({ results, clicked, mobileInfo, mobileClicked }, null, 2));

await browser.close();
