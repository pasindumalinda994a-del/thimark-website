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

async function waitForApp(page) {
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle0" });
  await page.waitForFunction(
    () => !document.querySelector('[aria-busy="true"]'),
    { timeout: 40000 },
  );
}

function cursorState() {
  const html = document.documentElement;
  const head = document.querySelector("[data-custom-cursor]");
  const ink = head?.querySelector("[data-cursor-ink]");
  return {
    hasClass: html.classList.contains("has-custom-cursor"),
    layerCount: document.querySelectorAll("[data-custom-cursor]").length,
    svgCount: document.querySelectorAll("[data-custom-cursor] svg").length,
    canvasCount: document.querySelectorAll("[data-custom-cursor] canvas").length,
    bodyCursor: getComputedStyle(document.body).cursor,
    plusOpacity: head ? getComputedStyle(head).opacity : null,
    ink: ink ? getComputedStyle(ink).stroke : null,
    plusTransform: head ? getComputedStyle(head).transform : null,
  };
}

try {
  const desktop = await browser.newPage();
  await desktop.setViewport({ width: 1440, height: 900 });
  await waitForApp(desktop);

  await desktop.mouse.move(720, 360);
  await new Promise((r) => setTimeout(r, 400));
  const hero = await desktop.evaluate(cursorState);
  console.log("desktop hero", hero);
  await desktop.screenshot({
    path: path.join(dir, "cursor-desktop-hero.png"),
  });

  const cta = await desktop.$("a.hero-cta");
  if (cta) {
    await cta.evaluate((el) => el.scrollIntoView({ block: "center" }));
    await new Promise((r) => setTimeout(r, 400));
    const box = await cta.boundingBox();
    if (box) {
      await desktop.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await new Promise((r) => setTimeout(r, 450));
    }
  }
  const hover = await desktop.evaluate(cursorState);
  console.log("desktop hover", hover);
  await desktop.screenshot({
    path: path.join(dir, "cursor-desktop-hover.png"),
  });

  await desktop.mouse.down();
  await new Promise((r) => setTimeout(r, 60));
  const pressed = await desktop.evaluate(cursorState);
  console.log("desktop press", pressed);
  await desktop.screenshot({
    path: path.join(dir, "cursor-desktop-press.png"),
  });
  await desktop.mouse.up();
  await new Promise((r) => setTimeout(r, 300));

  await desktop.evaluate(() => {
    document.getElementById("about")?.scrollIntoView();
  });
  await new Promise((r) => setTimeout(r, 800));
  const aboutHeading = await desktop.$("#about-heading");
  if (aboutHeading) {
    const box = await aboutHeading.boundingBox();
    if (box) {
      await desktop.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await new Promise((r) => setTimeout(r, 350));
    }
  }
  const about = await desktop.evaluate(cursorState);
  console.log("desktop about", about);
  await desktop.screenshot({
    path: path.join(dir, "cursor-desktop-about.png"),
  });

  const nav = await desktop.$('aside a[href="/#about"]');
  if (nav) {
    const box = await nav.boundingBox();
    if (box) {
      await desktop.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await new Promise((r) => setTimeout(r, 400));
    }
  }
  const sidebar = await desktop.evaluate(cursorState);
  console.log("desktop sidebar", sidebar);
  await desktop.screenshot({
    path: path.join(dir, "cursor-desktop-sidebar.png"),
  });

  await desktop.evaluate(() => {
    const input = document.createElement("input");
    input.id = "cursor-text-probe";
    input.style.cssText =
      "position:fixed;left:40px;top:40px;z-index:80;width:160px;height:32px;";
    document.body.appendChild(input);
  });
  const probe = await desktop.$("#cursor-text-probe");
  if (probe) {
    const box = await probe.boundingBox();
    if (box) {
      await desktop.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await new Promise((r) => setTimeout(r, 250));
    }
  }
  const textField = await desktop.evaluate(() => {
    const input = document.getElementById("cursor-text-probe");
    const head = document.querySelector("[data-custom-cursor]");
    return {
      inputCursor: input ? getComputedStyle(input).cursor : null,
      plusOpacity: head ? getComputedStyle(head).opacity : null,
    };
  });
  console.log("desktop text field", textField);

  const reduced = await browser.newPage();
  await reduced.setViewport({ width: 1440, height: 900 });
  await reduced.emulateMediaFeatures([
    { name: "prefers-reduced-motion", value: "reduce" },
  ]);
  await waitForApp(reduced);
  await reduced.mouse.move(700, 400);
  await new Promise((r) => setTimeout(r, 300));
  const reducedState = await reduced.evaluate(cursorState);
  console.log("reduced", reducedState);
  await reduced.screenshot({
    path: path.join(dir, "cursor-reduced.png"),
  });
} finally {
  await browser.close();
}
