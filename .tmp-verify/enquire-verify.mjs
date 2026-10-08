import { chromium } from "file:///C:/Users/pasin/AppData/Local/Temp/pw-verify/node_modules/playwright-core/index.mjs";
import { mkdirSync, writeFileSync } from "node:fs";

const OUT = "C:/Users/pasin/Documents/Web Projects/thimark-website/.tmp-verify/enquire";
mkdirSync(OUT, { recursive: true });
const BASE = "http://localhost:3000";
const issues = [];

const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});

function note(msg) {
  issues.push(msg);
  console.log(msg);
}

async function shot(page, name) {
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: false });
}

const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
desktop.on("pageerror", (err) => note(`desktop pageerror ${err}`));
await desktop.goto(BASE + "/", { waitUntil: "networkidle" });
const homeNav = await desktop.locator("aside").innerText();
if (/contact us/i.test(homeNav)) note("sidebar still has Contact Us");
const enquireBtn = desktop.locator('aside a[aria-label="Enquire with Thimark"]');
if ((await enquireBtn.count()) !== 1) note("sidebar Enquire button missing");
if ((await enquireBtn.innerText()).trim() !== "Enquire") note(`sidebar label: ${await enquireBtn.innerText()}`);
const hero = await desktop.locator(".hero-cta-primary").innerText();
if (!/enquire/i.test(hero)) note(`hero CTA: ${hero}`);

await desktop.goto(BASE + "/enquire?service=powder", { waitUntil: "networkidle" });
await desktop.waitForTimeout(400);
const powder = desktop.locator('[role="radio"][aria-checked="true"]');
const powderLabel = (await powder.innerText()).replace(/\s+/g, " ");
if (!/powder coating/i.test(powderLabel)) note(`preselect: ${powderLabel}`);
await shot(desktop, "desktop-start");

await desktop.locator('button[type="submit"]').click();
await desktop.waitForTimeout(200);
const errors = await desktop.locator(".contact-field-error, .contact-work-error").allInnerTexts();
if (errors.length < 4) note(`expected validation errors, got ${JSON.stringify(errors)}`);
await shot(desktop, "desktop-errors");

await desktop.locator("#enquire-name").fill("Amal Perera");
await desktop.locator("#enquire-company").fill("Test Works");
await desktop.locator("#enquire-email").fill("not-an-email");
await desktop.locator("#enquire-phone").fill("123");
await desktop.locator("#enquire-message").fill("Need a bracket.");
await desktop.locator('button[type="submit"]').click();
await desktop.waitForTimeout(200);
const fieldErrors = await desktop.locator(".contact-field-error").allInnerTexts();
if (!fieldErrors.some((t) => /email/i.test(t))) note(`email error missing: ${fieldErrors}`);
if (!fieldErrors.some((t) => /number/i.test(t))) note(`phone error missing: ${fieldErrors}`);

await desktop.locator("#enquire-email").fill("amal@example.com");
await desktop.locator("#enquire-phone").fill("+94 112 051 944");
const fileInput = desktop.locator('input[type="file"]');
await fileInput.setInputFiles({
  name: "bracket.dwg",
  mimeType: "application/acad",
  buffer: Buffer.from("dwg"),
});
await fileInput.setInputFiles({
  name: "notes.exe",
  mimeType: "application/octet-stream",
  buffer: Buffer.from("nope"),
});
const fileText = await desktop.locator(".contact-files").innerText();
if (!/bracket\.dwg/i.test(fileText)) note(`file list missing dwg: ${fileText}`);
if (!/isn.t a supported file/i.test(fileText)) note(`reject message missing: ${fileText}`);
await desktop.locator('button[aria-label="Remove bracket.dwg"]').click();
const afterRemove = await desktop.locator(".contact-files").innerText();
if (/bracket\.dwg/i.test(afterRemove)) note("file was not removed");
await fileInput.setInputFiles({
  name: "bracket.step",
  mimeType: "application/step",
  buffer: Buffer.from("step"),
});
await shot(desktop, "desktop-filled");

await desktop.locator('button[type="submit"]').click();
await desktop.locator(".contact-confirm-ref").waitFor({ timeout: 4000 });
const ref = (await desktop.locator(".contact-confirm-ref").innerText()).trim();
if (!/^TH-ENQ-\d{4}-\d{4}$/.test(ref)) note(`bad reference: ${ref}`);
await shot(desktop, "desktop-done");
await desktop.locator("text=Send another").click();
await desktop.locator("#enquire-name").waitFor();
if ((await desktop.locator("#enquire-name").inputValue()) !== "") note("reset left the name");

const footer = desktop.locator("footer");
await footer.scrollIntoViewIfNeeded();
const footerText = await footer.innerText();
if (/contact us/i.test(footerText)) note("footer still lists Contact Us");
if (!/enquire/i.test(footerText)) note("footer missing Enquire");

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
mobile.on("pageerror", (err) => note(`mobile pageerror ${err}`));
await mobile.goto(BASE + "/enquire", { waitUntil: "networkidle" });
await mobile.waitForTimeout(300);
const menu = mobile.locator("#mobile-nav, button[aria-label='Open menu'], button[aria-label='Menu']");
const openBtn = mobile.locator("button[aria-label='Menu'], button[aria-label='Open menu'], button[aria-expanded]").first();
if (await openBtn.count()) {
  await openBtn.click();
  await mobile.waitForTimeout(400);
  const overlay = await mobile.locator("body").innerText();
  if (/contact us/i.test(overlay)) note("mobile menu still has Contact Us");
  await shot(mobile, "mobile-menu");
  await mobile.keyboard.press("Escape");
  await mobile.waitForTimeout(200);
}
await shot(mobile, "mobile-top");
await mobile.locator("#enquire-message").scrollIntoViewIfNeeded();
await shot(mobile, "mobile-form");
await mobile.locator(".contact-files").scrollIntoViewIfNeeded();
await shot(mobile, "mobile-files");

await browser.close();
writeFileSync(`${OUT}/report.json`, JSON.stringify({ issues }, null, 2));
console.log(issues.length ? `ISSUES ${issues.length}` : "OK");
process.exit(issues.length ? 1 : 0);
