import { chromium } from "file:///C:/Users/pasin/AppData/Local/Temp/pw-verify/node_modules/playwright-core/index.mjs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});

function inSlot(word, copy, pad = 3) {
  if (!word || !copy) return false;
  return Math.abs(word.top - copy.top) < pad;
}

async function measure(page) {
  return page.evaluate(() => {
    const root = document.querySelector('[role="status"][aria-busy="true"]');
    if (!root) return { present: false };

    const box = (n) => {
      const r = n.getBoundingClientRect();
      return {
        left: r.left,
        top: r.top,
        right: r.right,
        bottom: r.bottom,
        width: r.width,
        height: r.height,
        cx: r.left + r.width / 2,
        cy: r.top + r.height / 2,
      };
    };

    const opacity = (n) => Number(getComputedStyle(n).opacity);

    const lines = [...root.querySelectorAll("[data-line]")].map((n) => {
      const svgLine = n.querySelector("line");
      return {
        id: n.getAttribute("data-line"),
        axis: n.getAttribute("data-axis"),
        strokeWidth: svgLine?.getAttribute("stroke-width") ?? null,
        width: n.getBoundingClientRect().width,
        height: n.getBoundingClientRect().height,
        left: n.getBoundingClientRect().left,
        top: n.getBoundingClientRect().top,
      };
    });

    const cells = [...root.querySelectorAll("[data-cell]")].map((n) => ({
      id: n.getAttribute("data-cell"),
      ...box(n),
    }));

    const mark = root.querySelector("[data-mark]");
    const copy = root.querySelector("[data-copy]");
    const copyBox = copy ? box(copy) : null;
    const titles = ["engineering", "manufacturing", "innovation", "brand"].map(
      (name) => {
        const n =
          name === "brand"
            ? root.querySelector("[data-brand]")
            : root.querySelector(`[data-word='${name}']`);
        const b = n ? box(n) : null;
        const shown = Boolean(
          b && copyBox && Math.abs(b.top - copyBox.top) < 3,
        );
        return { name, shown, box: b };
      },
    );

    const vInnerL = lines.find((l) => l.id === "v-inner-l");
    const vInnerR = lines.find((l) => l.id === "v-inner-r");
    const vOuterL = lines.find((l) => l.id === "v-outer-l");
    const vOuterR = lines.find((l) => l.id === "v-outer-r");
    const hInnerT = lines.find((l) => l.id === "h-inner-t");
    const hInnerB = lines.find((l) => l.id === "h-inner-b");
    const hOuterT = lines.find((l) => l.id === "h-outer-t");
    const hOuterB = lines.find((l) => l.id === "h-outer-b");
    const centerX = (l) => (l ? l.left + l.width / 2 : null);
    const centerY = (l) => (l ? l.top + l.height / 2 : null);
    const mx = Math.round((innerWidth - 78) / 2);
    const my = Math.round((innerHeight - 100) / 2);

    return {
      present: true,
      vw: innerWidth,
      vh: innerHeight,
      cx: innerWidth / 2,
      cy: innerHeight / 2,
      mx,
      my,
      progress: root.querySelector("[data-progress]")?.textContent ?? "",
      strokeWidths: [...new Set(lines.map((l) => l.strokeWidth))],
      plusTotal: root.querySelectorAll("[data-plus]").length,
      cells,
      mark: mark ? box(mark) : null,
      copy: copyBox,
      titles,
      gutters: {
        vInner: centerX(vInnerR) - centerX(vInnerL),
        hInner: centerY(hInnerB) - centerY(hInnerT),
        vOuter: centerX(vOuterR) - centerX(vOuterL),
      },
      inset: (() => {
        const tl = cells.find((c) => c.id === "tl");
        const tr = cells.find((c) => c.id === "tr");
        const bl = cells.find((c) => c.id === "bl");
        if (!tl || !tr || !bl) return null;
        return {
          vOuterL: tl.left - centerX(vOuterL),
          vInnerL: centerX(vInnerL) - tl.right,
          vInnerR: tr.left - centerX(vInnerR),
          vOuterR: centerX(vOuterR) - tr.right,
          hOuterT: tl.top - centerY(hOuterT),
          hInnerT: centerY(hInnerT) - tl.bottom,
          hInnerB: bl.top - centerY(hInnerB),
          hOuterB: centerY(hOuterB) - bl.bottom,
        };
      })(),
    };
  });
}

async function waitFor(page, fn, timeout = 12000) {
  await page.waitForFunction(fn, null, { timeout });
}

async function waitWord(page, name) {
  await page.waitForFunction(
    (n) => {
      const copy = document.querySelector("[data-copy]");
      const word =
        n === "brand"
          ? document.querySelector("[data-brand]")
          : document.querySelector(`[data-word='${n}']`);
      if (!copy || !word) return false;
      return (
        Math.abs(
          word.getBoundingClientRect().top - copy.getBoundingClientRect().top,
        ) < 3
      );
    },
    name,
    { timeout: 20000 },
  );
}

async function runViewport(label, viewport) {
  const page = await browser.newPage({ viewport });
  await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
  await page.waitForSelector('[role="status"][aria-busy="true"]');

  await waitFor(page, () => {
    const n = parseInt(
      document.querySelector("[data-progress]")?.textContent ?? "0",
      10,
    );
    const cell = document.querySelector("[data-cell='tl']");
    return n >= 18 && cell && Number(getComputedStyle(cell).opacity) > 0.4;
  });
  const afterDraw = await measure(page);
  await page.screenshot({ path: path.join(dir, `preload-${label}-draw.png`) });

  await waitWord(page, "engineering");
  const eng = await measure(page);
  await page.screenshot({ path: path.join(dir, `preload-${label}-eng.png`) });

  await waitWord(page, "manufacturing");
  const mfg = await measure(page);
  await page.screenshot({ path: path.join(dir, `preload-${label}-mfg.png`) });

  await waitWord(page, "innovation");
  const inn = await measure(page);
  await page.screenshot({ path: path.join(dir, `preload-${label}-inn.png`) });

  await waitWord(page, "brand");
  const brand = await measure(page);
  await page.screenshot({ path: path.join(dir, `preload-${label}-brand.png`) });

  await page.waitForFunction(
    () => !document.querySelector('[role="status"][aria-busy="true"]'),
    { timeout: 40000 },
  );

  await page.close();
  return { afterDraw, eng, mfg, inn, brand };
}

function round(n) {
  return n == null ? null : Math.round(n * 10) / 10;
}

function wordSummary(shot) {
  const shown = shot.titles.filter((t) => t.shown).map((t) => t.name);
  const visible = shot.titles.find((t) => t.shown);
  return {
    shown,
    cxOff: visible?.box ? round(visible.box.cx - shot.cx) : null,
  };
}

try {
  const desktop = await runViewport("desktop", { width: 1440, height: 900 });
  const mobile = await runViewport("mobile", { width: 390, height: 844 });

  const reduced = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await reduced.emulateMedia({ reducedMotion: "reduce" });
  await reduced.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
  await reduced.waitForSelector('[role="status"][aria-busy="true"]');
  await reduced.waitForFunction(() => {
    const cell = document.querySelector("[data-cell='tl']");
    return cell && Number(getComputedStyle(cell).opacity) > 0.9;
  });
  const reducedShot = await measure(reduced);
  await reduced.screenshot({ path: path.join(dir, "preload-reduced.png") });
  await reduced.waitForFunction(
    () => !document.querySelector('[role="status"][aria-busy="true"]'),
    { timeout: 40000 },
  );
  const reducedGone = await reduced.evaluate(
    () => !document.querySelector('[role="status"][aria-busy="true"]'),
  );
  await reduced.close();

  const summarize = (label, pack) => {
    const d = pack.afterDraw;
    const markOffX = d.mark ? d.mark.cx - d.cx : null;
    const markOffY = d.mark ? d.mark.cy - d.cy : null;
    return {
      label,
      strokes: d.strokeWidths,
      pluses: d.plusTotal,
      markOrigin: d.mark ? [round(d.mark.left), round(d.mark.top)] : null,
      expectOrigin: [d.mx, d.my],
      markOff: [round(markOffX), round(markOffY)],
      gutters: {
        vInner: round(d.gutters.vInner),
        hInner: round(d.gutters.hInner),
        vOuter: round(d.gutters.vOuter),
      },
      inset: d.inset
        ? Object.fromEntries(
            Object.entries(d.inset).map(([k, v]) => [k, round(v)]),
          )
        : null,
      eng: wordSummary(pack.eng),
      mfg: wordSummary(pack.mfg),
      inn: wordSummary(pack.inn),
      brand: wordSummary(pack.brand),
    };
  };

  console.log(JSON.stringify({
    desktop: summarize("desktop", desktop),
    mobile: summarize("mobile", mobile),
    reduced: {
      present: reducedShot.present,
      pluses: reducedShot.plusTotal,
      titlesShown: reducedShot.titles?.filter((t) => t.shown).map((t) => t.name),
      gone: reducedGone,
    },
  }, null, 2));
} finally {
  await browser.close();
}
