import { chromium } from "file:///C:/Users/pasin/AppData/Local/Temp/pw-verify/node_modules/playwright-core/index.mjs";

const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});

const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3000/enquire", { waitUntil: "networkidle" });
await page.waitForTimeout(400);

const closed = await page.evaluate(() => {
  const section = document.querySelector("#enquire");
  const top = section.getBoundingClientRect().top;
  const row = section.getBoundingClientRect().height / 20;
  const ids = ["enquire-topic", "enquire-name", "enquire-company", "enquire-email", "enquire-phone", "enquire-message"];
  const fields = ids.map((id) => {
    const el = document.getElementById(id);
    const field = el.closest(".contact-field");
    const box = field.getBoundingClientRect();
    const control = el.getBoundingClientRect();
    return {
      id,
      top: Math.round((box.top - top) / row),
      bottom: Math.round((box.bottom - top) / row),
      h: Math.round(box.height),
      row: Math.round(row),
      clipped: el.scrollHeight > el.clientHeight + 1,
      textTop: Math.round(control.top - box.top),
    };
  });
  return { row: Math.round(row), fields };
});
console.log("closed", JSON.stringify(closed, null, 2));
await page.screenshot({ path: ".tmp-verify/enquire/topic-closed.png" });

await page.locator("#enquire-topic").click();
await page.waitForTimeout(150);
const open = await page.evaluate(() => {
  const section = document.querySelector("#enquire");
  const top = section.getBoundingClientRect().top;
  const row = section.getBoundingClientRect().height / 20;
  const menu = document.querySelector(".topic-menu");
  const box = menu.getBoundingClientRect();
  const options = [...document.querySelectorAll(".topic-option")].map((node) => {
    const b = node.getBoundingClientRect();
    return {
      text: node.textContent.replace(/\s+/g, " ").trim(),
      top: Math.round((b.top - top) / row),
      h: Math.round(b.height),
    };
  });
  return {
    menuTop: Math.round((box.top - top) / row),
    menuH: Math.round(box.height / row),
    options,
  };
});
console.log("open", JSON.stringify(open, null, 2));
await page.screenshot({ path: ".tmp-verify/enquire/topic-open.png" });

await page.locator("#enquire-topic-industrial").click();
await page.waitForTimeout(100);
console.log("value", await page.locator(".topic-value").textContent());
console.log("expanded", await page.locator("#enquire-topic").getAttribute("aria-expanded"));
await page.screenshot({ path: ".tmp-verify/enquire/topic-chosen.png" });

await page.locator("#enquire-topic").click();
await page.keyboard.press("ArrowDown");
await page.keyboard.press("Enter");
console.log("after keys", await page.locator(".topic-value").textContent());

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto("http://localhost:3000/enquire", { waitUntil: "networkidle" });
await mobile.locator("#enquire-topic").scrollIntoViewIfNeeded();
await mobile.locator("#enquire-topic").click();
await mobile.waitForTimeout(150);
await mobile.screenshot({ path: ".tmp-verify/enquire/topic-mobile.png" });
const mobileRow = await mobile.evaluate(() => {
  const row = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--row"));
  const opt = document.querySelector(".topic-option").getBoundingClientRect().height;
  const field = document.querySelector("#enquire-name").closest(".contact-field").getBoundingClientRect().height;
  return { row, opt, field };
});
console.log("mobile", mobileRow);

await browser.close();
