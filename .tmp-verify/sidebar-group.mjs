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
  await page.waitForSelector("aside", { timeout: 10000 });
}

const checks = [];

try {
  const desktop = await browser.newPage();
  await desktop.setViewport({ width: 1440, height: 900 });
  await waitForApp(desktop);

  const info = await desktop.evaluate(() => {
    const aside = document.querySelector("aside");
    const group = aside?.querySelector('[data-station="capabilities"]');
    const groupLink = group?.querySelector("a");
    const auto = aside?.querySelector('a[href="/#automotive"]');
    const mach = aside?.querySelector('a[href="/#machinery"]');
    const caps = aside?.querySelector('a[href="/#capabilities"]');
    const autoBox = auto?.getBoundingClientRect();
    return {
      groupTag: group?.querySelector("p")?.textContent?.replace(/\s+/g, " ").trim(),
      groupIsLink: Boolean(groupLink),
      autoVisible: Boolean(auto && autoBox && autoBox.height > 0),
      autoText: auto?.textContent?.trim(),
      machText: mach?.textContent?.trim(),
      capabilitiesLink: Boolean(caps),
    };
  });
  checks.push(info);

  await desktop.screenshot({
    path: path.join(dir, "sidebar-group-desktop.png"),
  });

  const auto = await desktop.$('aside a[href="/#automotive"]');
  if (auto) {
    await auto.hover();
    await new Promise((r) => setTimeout(r, 400));
    await desktop.screenshot({
      path: path.join(dir, "sidebar-group-hover.png"),
    });
    await auto.click();
    await new Promise((r) => setTimeout(r, 800));
  }

  const afterClick = await desktop.evaluate(() => {
    const auto = document.getElementById("automotive");
    const box = auto?.getBoundingClientRect();
    const active = document.querySelector(
      'aside a[href="/#automotive"][aria-current="page"]',
    );
    return {
      automotiveInView: Boolean(box && box.top < window.innerHeight && box.bottom > 0),
      automotiveCurrent: Boolean(active),
    };
  });
  checks.push(afterClick);

  await desktop.screenshot({
    path: path.join(dir, "sidebar-group-automotive.png"),
  });

  const mobile = await browser.newPage();
  await mobile.setViewport({ width: 390, height: 844, isMobile: true });
  await waitForApp(mobile);
  const menu = await mobile.$('button[aria-controls="mobile-nav"]');
  if (menu) {
    await menu.click();
    await new Promise((r) => setTimeout(r, 500));
  }

  const mobileInfo = await mobile.evaluate(() => {
    const nav = document.getElementById("mobile-nav");
    const auto = nav?.querySelector('a[href="/#automotive"]');
    const mach = nav?.querySelector('a[href="/#machinery"]');
    const groupLink = nav?.querySelector('[data-station="capabilities"] a');
    const autoBox = auto?.getBoundingClientRect();
    return {
      autoVisible: Boolean(auto && autoBox && autoBox.height > 0),
      autoText: auto?.textContent?.trim(),
      machText: mach?.textContent?.trim(),
      groupIsLink: Boolean(groupLink),
    };
  });
  checks.push(mobileInfo);

  await mobile.screenshot({
    path: path.join(dir, "sidebar-group-mobile.png"),
  });

  console.log(JSON.stringify(checks, null, 2));
} finally {
  await browser.close();
}
