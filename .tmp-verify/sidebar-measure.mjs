import puppeteer from "puppeteer-core";

const browser = await puppeteer.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: "new",
  args: ["--hide-scrollbars"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto("http://localhost:3000/", { waitUntil: "networkidle0" });
await page.waitForFunction(
  () => !document.querySelector('[aria-busy="true"]'),
  { timeout: 40000 },
);

const data = await page.evaluate(() => {
  const aside = document.querySelector("aside");
  const plate = aside.querySelector(".sidebar-plate").getBoundingClientRect();
  const marks = [...aside.querySelectorAll("svg[data-station-plus]")].map((el) => {
    const box = el.getBoundingClientRect();
    const cls = el.getAttribute("class") || "";
    const rail = cls.includes("sb-rail-branch")
      ? "branch"
      : cls.includes("sb-rail-r")
        ? "r"
        : "l";
    return {
      rail,
      cx: +(box.left + box.width / 2).toFixed(1),
      cy: +(box.top + box.height / 2).toFixed(1),
      station:
        el.closest("[data-station]")?.getAttribute("data-station") || "shell",
    };
  });
  const lines = [...aside.querySelectorAll(".sb-h-seg, .sb-h-seg-branch, .sb-h-join")].map(
    (el) => {
      const box = el.getBoundingClientRect();
      return {
        cls: [...el.classList].filter((c) => c.startsWith("sb-")).join(" "),
        y: +box.top.toFixed(1),
        x: +box.left.toFixed(1),
        w: +box.width.toFixed(1),
        station:
          el.closest("[data-station]")?.getAttribute("data-station") || "shell",
      };
    },
  );
  return { row: +(plate.height / 14).toFixed(2), marks, lines };
});

console.log(JSON.stringify(data, null, 2));
await browser.close();
