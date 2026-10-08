import { chromium } from "file:///C:/Users/pasin/AppData/Local/Temp/pw-verify/node_modules/playwright-core/index.mjs";

const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});

const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3000/enquire", { waitUntil: "networkidle" });
await page.waitForTimeout(400);

const report = await page.evaluate(() => {
  const text = document.body.innerText;
  const banned = ["Automotive", "OEM", "Industrial machinery", "Powder coating", "General"];
  const found = banned.filter((word) => text.includes(word));
  const radios = document.querySelectorAll('[role="radio"], .contact-work-cell').length;
  const labels = [...document.querySelectorAll(".contact-field-label")].map((node) => node.textContent.trim());
  const row = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--row"));
  const section = document.querySelector("#enquire");
  const sectionTop = section.getBoundingClientRect().top;
  const fields = ["enquire-name", "enquire-company", "enquire-email", "enquire-phone", "enquire-message"].map(
    (id) => {
      const el = document.getElementById(id).closest(".contact-field");
      const box = el.getBoundingClientRect();
      return {
        id,
        top: Math.round(box.top - sectionTop),
        bottom: Math.round(box.bottom - sectionTop),
      };
    },
  );
  const lines = [6, 7, 8, 9, 10].map((n) => Math.round(n * row));
  return { found, radios, labels, row: Math.round(row), fields, lines };
});
console.log(JSON.stringify(report, null, 2));

await page.screenshot({ path: ".tmp-verify/enquire/no-topics-desktop.png" });

await page.locator("button.contact-submit").click();
await page.waitForTimeout(200);
const errors = await page.locator(".contact-field-error").allTextContents();
console.log("empty errors", errors);

await page.locator("#enquire-name").fill("Ada Lovelace");
await page.locator("#enquire-email").fill("ada@example.com");
await page.locator("#enquire-phone").fill("0112345678");
await page.locator("#enquire-message").fill("Need a bracket reviewed.");
await page.locator("button.contact-submit").click();
await page.waitForSelector(".contact-confirm-ref");
const ref = await page.locator(".contact-confirm-ref").textContent();
console.log("reference", ref);

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto("http://localhost:3000/enquire", { waitUntil: "networkidle" });
await mobile.waitForTimeout(300);
const mobileText = await mobile.locator("body").innerText();
console.log(
  "mobile banned",
  ["Automotive", "OEM", "Industrial machinery", "Powder coating"].filter((word) => mobileText.includes(word)),
);
await mobile.locator("#enquire-name").scrollIntoViewIfNeeded();
await mobile.screenshot({ path: ".tmp-verify/enquire/no-topics-mobile.png" });

await browser.close();
