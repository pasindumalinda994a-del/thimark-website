import puppeteer from "puppeteer-core";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const chrome =
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

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

const desktop = await browser.newPage();
await desktop.setViewport({ width: 1440, height: 900 });
await waitForApp(desktop);

const info = await desktop.evaluate(() => {
  const aside = document.querySelector("aside");
  const plate = aside.querySelector(".sidebar-plate").getBoundingClientRect();
  const nav = aside.querySelector(".sidebar-nav").getBoundingClientRect();
  const logo = aside
    .querySelector('a[aria-label="Thimark home"]')
    .closest(".h-rows-2")
    .getBoundingClientRect();
  const raq = aside
    .querySelector('a[aria-label="Request a Quote"]')
    .closest(".h-rows-2")
    .getBoundingClientRect();
  const index = aside.textContent.includes("Index");
  return {
    plateH: plate.height,
    logoH: +logo.height.toFixed(1),
    raqH: +raq.height.toFixed(1),
    navTop: +nav.top.toFixed(1),
    navH: +nav.height.toFixed(1),
    navCenter: +(nav.top + nav.height / 2).toFixed(1),
    mid: +(plate.top + plate.height / 2).toFixed(1),
    hasIndex: index && aside.innerText.includes("INDEX"),
    stationCount: aside.querySelectorAll("[data-station]").length,
  };
});

await desktop.screenshot({
  path: path.join(dir, "sidebar-center-desktop.png"),
  clip: { x: 0, y: 0, width: 240, height: 900 },
});
await desktop.screenshot({
  path: path.join(dir, "sidebar-center-full.png"),
});

const about = await desktop.$('aside a[href="/#about"]');
if (about) {
  await about.hover();
  await new Promise((r) => setTimeout(r, 350));
  await desktop.screenshot({
    path: path.join(dir, "sidebar-center-hover.png"),
    clip: { x: 0, y: 0, width: 240, height: 900 },
  });
}

const mobile = await browser.newPage();
await mobile.setViewport({ width: 390, height: 844, isMobile: true });
await waitForApp(mobile);
const menu = await mobile.$('button[aria-controls="mobile-nav"]');
if (menu) {
  await menu.click();
  await new Promise((r) => setTimeout(r, 500));
}
await mobile.screenshot({
  path: path.join(dir, "sidebar-center-mobile.png"),
});

console.log(JSON.stringify(info, null, 2));
await browser.close();
