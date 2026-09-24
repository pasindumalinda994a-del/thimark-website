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

function labelColor(page, selector) {
  return page.$eval(selector, (el) => {
    const label = el.querySelector("span.relative.z-3") || el.querySelector("span.z-3");
    return label ? getComputedStyle(label).color : "missing";
  });
}

try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle0" });
  await page.waitForFunction(
    () => !document.querySelector('[aria-busy="true"]'),
    { timeout: 40000 },
  );

  const hero = await page.waitForSelector("#hero a.hero-cta");
  console.log("hero rest", await labelColor(page, "#hero a.hero-cta"));
  await hero.hover();
  await new Promise((r) => setTimeout(r, 500));
  console.log("hero hover", await labelColor(page, "#hero a.hero-cta"));
  await hero.screenshot({ path: path.join(dir, "button-hero-hover.png") });

  await page.evaluate(() => document.getElementById("about")?.scrollIntoView());
  await new Promise((r) => setTimeout(r, 700));
  const about = await page.waitForSelector("#about a.about-cta");
  console.log("about rest", await labelColor(page, "#about a.about-cta"));
  await about.hover();
  await new Promise((r) => setTimeout(r, 500));
  console.log("about hover", await labelColor(page, "#about a.about-cta"));
  await about.screenshot({ path: path.join(dir, "button-about-hover.png") });
} finally {
  await browser.close();
}
