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

function collect() {
  const aside = document.querySelector("aside");
  const plate = aside?.querySelector(".sidebar-plate");
  if (!aside || !plate) {
    return { error: "no plate", aside: Boolean(aside) };
  }
  const plateBox = plate.getBoundingClientRect();
  const row = plateBox.height / 14;
  const pluses = [...aside.querySelectorAll("svg[data-station-plus], svg.size-\\[7px\\]")];
  const allPlus = [...aside.querySelectorAll("svg")].filter((el) => {
    const box = el.getBoundingClientRect();
    return box.width > 0 && box.height > 0 && box.width < 20;
  });

  const stations = [...aside.querySelectorAll("[data-station]")].map((el) => {
    const box = el.getBoundingClientRect();
    return {
      id: el.getAttribute("data-station"),
      top: box.top,
      height: box.height,
      rows: +(box.height / row).toFixed(2),
    };
  });

  const rails = [...aside.querySelectorAll(".sb-v-seg")].map((el) => {
    const box = el.getBoundingClientRect();
    return {
      className: el.className,
      left: +box.left.toFixed(2),
      top: +box.top.toFixed(2),
      height: +box.height.toFixed(2),
    };
  });

  const marks = allPlus.map((el) => {
    const box = el.getBoundingClientRect();
    return {
      left: +(box.left + box.width / 2).toFixed(2),
      top: +(box.top + box.height / 2).toFixed(2),
      className: el.getAttribute("class"),
    };
  });

  const logo = aside.querySelector('a[aria-label="Thimark home"]')?.getBoundingClientRect();
  const raq = aside.querySelector('a[aria-label="Request a Quote"]')?.getBoundingClientRect();
  const about = aside.querySelector('a[href="/#about"]');
  const auto = aside.querySelector('a[href="/#automotive"]');

  return {
    plate: {
      height: +plateBox.height.toFixed(2),
      width: +plateBox.width.toFixed(2),
      row: +row.toFixed(2),
    },
    logoRows: logo ? +((logo.height) / row).toFixed(2) : null,
    raqRows: raq ? +(raq.height / row).toFixed(2) : null,
    stations,
    rails: rails.slice(0, 8),
    railCount: rails.length,
    plusCount: marks.length,
    pluses: marks.slice(0, 12),
    aboutCurrent: about?.getAttribute("aria-current") || null,
    autoText: auto?.textContent?.trim() || null,
    g1: getComputedStyle(plate).getPropertyValue("--g1-offset").trim(),
    branch: getComputedStyle(plate).getPropertyValue("--sb-branch").trim(),
  };
}

const checks = [];

try {
  const desktop = await browser.newPage();
  await desktop.setViewport({ width: 1440, height: 900 });
  await waitForApp(desktop);

  const info = await desktop.evaluate(collect);
  checks.push({ desktop: info });

  await desktop.screenshot({
    path: path.join(dir, "sidebar-plate-desktop.png"),
    clip: { x: 0, y: 0, width: 240, height: 900 },
  });
  await desktop.screenshot({
    path: path.join(dir, "sidebar-plate-desktop-full.png"),
  });

  const about = await desktop.$('aside a[href="/#about"]');
  if (about) {
    await about.hover();
    await new Promise((r) => setTimeout(r, 400));
    await desktop.screenshot({
      path: path.join(dir, "sidebar-plate-hover.png"),
      clip: { x: 0, y: 0, width: 220, height: 900 },
    });
  }

  const auto = await desktop.$('aside a[href="/#automotive"]');
  if (auto) {
    await auto.hover();
    await new Promise((r) => setTimeout(r, 400));
    await desktop.screenshot({
      path: path.join(dir, "sidebar-plate-branch-hover.png"),
      clip: { x: 0, y: 0, width: 240, height: 900 },
    });
    await auto.click();
    await desktop.waitForFunction(
      () =>
        Boolean(
          document.querySelector(
            'aside a[href="/#automotive"][aria-current="page"]',
          ),
        ),
      { timeout: 8000 },
    ).catch(() => {});
    const after = await desktop.evaluate(() => {
      const current = document.querySelector(
        'aside a[href="/#automotive"][aria-current="page"]',
      );
      const group = document.querySelector('[data-station="capabilities"] svg line');
      return {
        automotiveCurrent: Boolean(current),
        groupStroke: group?.getAttribute("stroke") || group?.style.stroke || null,
      };
    });
    checks.push(after);
    await desktop.screenshot({
      path: path.join(dir, "sidebar-plate-active.png"),
      clip: { x: 0, y: 0, width: 240, height: 900 },
    });
  }

  const mobile = await browser.newPage();
  await mobile.setViewport({ width: 390, height: 844, isMobile: true });
  await waitForApp(mobile);
  await mobile.screenshot({
    path: path.join(dir, "sidebar-plate-mobile-header.png"),
    clip: { x: 0, y: 0, width: 390, height: 80 },
  });
  const menu = await mobile.$('button[aria-controls="mobile-nav"]');
  if (menu) {
    await menu.click();
    await new Promise((r) => setTimeout(r, 500));
  }
  const mobileInfo = await mobile.evaluate(() => {
    const nav = document.getElementById("mobile-nav");
    const plate = nav?.querySelector(".sidebar-plate");
    const box = plate?.getBoundingClientRect();
    const auto = nav?.querySelector('a[href="/#automotive"]');
    const raq = nav?.querySelector('a[aria-label="Request a Quote"]');
    return {
      plateHeight: box ? +box.height.toFixed(2) : null,
      plateTop: box ? +box.top.toFixed(2) : null,
      autoText: auto?.textContent?.trim() || null,
      raqVisible: Boolean(raq && raq.getBoundingClientRect().height > 0),
    };
  });
  checks.push({ mobile: mobileInfo });
  await mobile.screenshot({
    path: path.join(dir, "sidebar-plate-mobile-open.png"),
  });

  console.log(JSON.stringify(checks, null, 2));
} finally {
  await browser.close();
}
