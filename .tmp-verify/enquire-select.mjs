import { chromium } from "file:///C:/Users/pasin/AppData/Local/Temp/pw-verify/node_modules/playwright-core/index.mjs";

const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});

const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3000/enquire", { waitUntil: "networkidle" });
await page.waitForTimeout(300);

const options = await page.locator("#enquire-topic option").allTextContents();
console.log("options", options);

await page.locator("button.contact-submit").click();
await page.waitForTimeout(150);
console.log("topic error", await page.locator("#enquire-topic-error").textContent());

const align = await page.evaluate(() => {
  const section = document.querySelector("#enquire");
  const top = section.getBoundingClientRect().top;
  const height = section.getBoundingClientRect().height;
  const row = height / 20;
  const ids = ["enquire-topic", "enquire-name", "enquire-company", "enquire-email", "enquire-phone", "enquire-message"];
  return ids.map((id) => {
    const box = document.getElementById(id).closest(".contact-field").getBoundingClientRect();
    return {
      id,
      top: Math.round((box.top - top) / row),
      bottom: Math.round((box.bottom - top) / row),
    };
  });
});
console.log(align);

await page.screenshot({ path: ".tmp-verify/enquire/select-empty.png" });
await page.locator("#enquire-topic").selectOption("powder-coating");
await page.waitForTimeout(150);
const shown = await page.locator("#enquire-topic").evaluate((node) => node.options[node.selectedIndex].text);
console.log("selected", shown);
await page.screenshot({ path: ".tmp-verify/enquire/select-filled.png" });

const linked = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await linked.goto("http://localhost:3000/enquire?service=automotive", { waitUntil: "networkidle" });
const preset = await linked.locator("#enquire-topic").inputValue();
console.log("preset", preset);

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto("http://localhost:3000/enquire", { waitUntil: "networkidle" });
await mobile.locator("#enquire-topic").scrollIntoViewIfNeeded();
await mobile.screenshot({ path: ".tmp-verify/enquire/select-mobile.png" });

await browser.close();
