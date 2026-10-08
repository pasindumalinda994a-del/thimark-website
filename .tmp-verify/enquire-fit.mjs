import { chromium } from "file:///C:/Users/pasin/AppData/Local/Temp/pw-verify/node_modules/playwright-core/index.mjs";

const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});

for (const [w, h] of [
  [1440, 900],
  [1280, 720],
  [1920, 1080],
]) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.goto("http://localhost:3000/enquire", { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  const m = await page.evaluate(() => {
    const section = document.querySelector("#enquire").getBoundingClientRect();
    const row = section.height / 14;
    const rel = (el) => {
      const b = el.getBoundingClientRect();
      return [+((b.top - section.top) / row).toFixed(2), +((b.bottom - section.top) / row).toFixed(2)];
    };
    const ids = ["enquire-topic", "enquire-name", "enquire-company", "enquire-email", "enquire-phone", "enquire-message"];
    const btn = document.querySelector("button.contact-submit");
    const well = document.querySelector(".enquire-well");
    const wellTitle = document.querySelector(".enquire-well-title");
    return {
      sectionH: Math.round(section.height),
      viewH: innerHeight,
      fields: Object.fromEntries(ids.map((id) => [id, rel(document.getElementById(id).closest(".contact-field"))])),
      title: rel(document.querySelector(".contact-form-title")),
      head: rel(document.querySelector(".enquire-drop-head")),
      well: rel(well),
      button: rel(btn),
      wellOverflow: well.scrollHeight > well.clientHeight + 1,
      wellTitleBottom: rel(wellTitle)[1],
    };
  });
  console.log(w, h, JSON.stringify(m));
  await page.screenshot({ path: `.tmp-verify/enquire/fit-${w}x${h}.png` });
  await page.close();
}

await browser.close();
