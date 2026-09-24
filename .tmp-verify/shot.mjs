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

try {
  const desktop = await browser.newPage();
  await desktop.setViewport({ width: 1440, height: 900 });
  await waitForApp(desktop);
  await desktop.screenshot({
    path: path.join(dir, "sidebar-desktop-hero.png"),
  });

  await desktop.hover('aside a[aria-label="Request a Quote"]');
  await new Promise((r) => setTimeout(r, 400));
  await desktop.screenshot({
    path: path.join(dir, "sidebar-desktop-raq-hover.png"),
  });

  await desktop.hover("aside");
  const about = await desktop.$('aside a[href="/#about"]');
  if (about) {
    await about.hover();
    await new Promise((r) => setTimeout(r, 400));
    await desktop.screenshot({
      path: path.join(dir, "sidebar-desktop-nav-hover.png"),
    });
  }

  await desktop.evaluate(() => {
    document.getElementById("about")?.scrollIntoView();
  });
  await new Promise((r) => setTimeout(r, 600));
  await desktop.screenshot({
    path: path.join(dir, "sidebar-desktop-about.png"),
  });

  const products = await desktop.$('aside a[href="/#capabilities"]');
  if (products) {
    await products.hover();
    await new Promise((r) => setTimeout(r, 500));
    await desktop.screenshot({
      path: path.join(dir, "sidebar-desktop-accordion.png"),
    });
  }

  const mobile = await browser.newPage();
  await mobile.setViewport({ width: 390, height: 844, isMobile: true });
  await waitForApp(mobile);
  await mobile.screenshot({
    path: path.join(dir, "sidebar-mobile-header.png"),
  });
  const menu = await mobile.$('button[aria-controls="mobile-nav"]');
  if (menu) {
    await menu.click();
    await new Promise((r) => setTimeout(r, 500));
    await mobile.screenshot({
      path: path.join(dir, "sidebar-mobile-open.png"),
    });
  }
} finally {
  await browser.close();
}
