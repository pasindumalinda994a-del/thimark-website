import { chromium } from "file:///C:/Users/pasin/AppData/Local/Temp/pw-verify/node_modules/playwright-core/index.mjs";

const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});

for (const [w, h] of [
  [1440, 900],
  [1280, 720],
]) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.goto("http://localhost:3000/enquire", { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);

  const m = await page.evaluate(async () => {
    const well = document.querySelector(".enquire-well");
    const frame = document.querySelector(".enquire-well-frame");
    const rect = frame.querySelector("rect");
    const wb = well.getBoundingClientRect();
    const fb = frame.getBoundingClientRect();
    const parts = [".enquire-well-kicker", ".enquire-well-title", ".enquire-well-formats", ".enquire-drop-spec"].map(
      (sel) => document.querySelector(sel).getBoundingClientRect(),
    );
    const top = Math.min(...parts.map((p) => p.top));
    const bottom = Math.max(...parts.map((p) => p.bottom));
    const style = getComputedStyle(rect);
    const off1 = style.strokeDashoffset;
    await new Promise((r) => setTimeout(r, 300));
    const off2 = getComputedStyle(rect).strokeDashoffset;
    return {
      frame: {
        left: Math.round(fb.left - wb.left),
        right: Math.round(wb.right - fb.right),
        top: Math.round(fb.top - wb.top),
        bottom: Math.round(wb.bottom - fb.bottom),
      },
      copyGapTop: Math.round(top - wb.top),
      copyGapBottom: Math.round(wb.bottom - bottom),
      centersX: parts.map((p) => Math.round(p.left + p.width / 2 - (wb.left + wb.width / 2))),
      dash: style.strokeDasharray,
      animating: off1 !== off2,
      offsets: [off1, off2],
    };
  });
  console.log(w, h, JSON.stringify(m));
  await page.screenshot({ path: `.tmp-verify/enquire/well-${w}x${h}.png` });

  await page.locator(".enquire-well").hover();
  await page.waitForTimeout(200);
  const hover = await page.evaluate(() => getComputedStyle(document.querySelector(".enquire-well-frame rect")).stroke);
  console.log("hover stroke", hover);
  await page.screenshot({ path: `.tmp-verify/enquire/well-hover-${w}x${h}.png` });

  await page.evaluate(() => {
    const drop = document.querySelector(".enquire-drop");
    const dt = new DataTransfer();
    dt.items.add(new File(["x"], "a.dwg"));
    drop.dispatchEvent(new DragEvent("dragenter", { bubbles: true, dataTransfer: dt }));
  });
  await page.mouse.move(0, 0);
  await page.waitForTimeout(200);
  const drag = await page.evaluate(() => ({
    over: document.querySelector(".enquire-drop").classList.contains("is-over"),
    stroke: getComputedStyle(document.querySelector(".enquire-well-frame rect")).stroke,
  }));
  console.log("drag", JSON.stringify(drag));
  await page.screenshot({ path: `.tmp-verify/enquire/well-drag-${w}x${h}.png` });
  await page.evaluate(() => {
    const drop = document.querySelector(".enquire-drop");
    drop.dispatchEvent(new DragEvent("dragleave", { bubbles: true }));
  });

  await page.locator(".contact-file-input").setInputFiles([
    { name: "bracket.dwg", mimeType: "application/octet-stream", buffer: Buffer.alloc(4096) },
    { name: "frame.step", mimeType: "application/octet-stream", buffer: Buffer.alloc(8192) },
  ]);
  await page.waitForTimeout(250);
  const files = await page.evaluate(() => {
    const well = document.querySelector(".enquire-well").getBoundingClientRect();
    const title = document.querySelector(".enquire-well-title").getBoundingClientRect();
    return { titleCenterOffset: Math.round(title.left + title.width / 2 - (well.left + well.width / 2)) };
  });
  console.log("files", JSON.stringify(files));
  await page.screenshot({ path: `.tmp-verify/enquire/well-files-${w}x${h}.png` });
  await page.close();
}

const reduced = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
await reduced.goto("http://localhost:3000/enquire", { waitUntil: "networkidle" });
const anim = await reduced.evaluate(
  () => getComputedStyle(document.querySelector(".enquire-well-frame rect")).animationName,
);
console.log("reduced animation", anim);

await browser.close();
