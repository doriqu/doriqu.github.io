#!/usr/bin/env node
const { chromium } = require("@playwright/test");

const bothThemes = process.argv.includes("--both-themes");
const urlArg = process.argv.find((arg) => arg.startsWith("--url="));
const baseUrl = urlArg ? urlArg.slice("--url=".length) : "http://localhost:8080/";

function isGrey(color) {
  const values = [...color.matchAll(/rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/gi)];
  return values.every((match) => Math.abs(Number(match[1]) - Number(match[2])) < 0.5 && Math.abs(Number(match[2]) - Number(match[3])) < 0.5);
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
  const themes = bothThemes ? ["dark", "light"] : [await page.locator("html").getAttribute("data-theme") || "dark"];
  let failed = false;
  for (const theme of themes) {
    await page.locator("html").evaluate((root, value) => root.setAttribute("data-theme", value), theme);
    await page.waitForTimeout(170);
    const colors = await page.evaluate(() => {
      const result = [];
      const props = [
        "color",
        "backgroundColor",
        "backgroundImage",
        "borderTopColor",
        "borderRightColor",
        "borderBottomColor",
        "borderLeftColor",
        "outlineColor",
        "textDecorationColor",
        "fill",
        "stroke",
        "boxShadow",
        "textShadow",
      ];
      for (const element of document.querySelectorAll("html, body, body *")) {
        for (const pseudo of [null, "::before", "::after"]) {
          const style = getComputedStyle(element, pseudo);
          for (const property of props) {
            const value = style[property];
            if (value && value !== "rgba(0, 0, 0, 0)") {
              const selector = element.tagName.toLowerCase() + (element.id ? `#${element.id}` : "") + (pseudo || "");
              result.push({ selector, property, value });
            }
          }
        }
      }
      return result;
    });
    const nonGrey = colors.filter(({ value }) => !isGrey(value));
    console.log(`[${theme}] ${nonGrey.length ? `FAIL: ${nonGrey.length} non-grey computed colors` : "PASS: all computed colors are neutral"}`);
    for (const item of nonGrey) console.log(`  ${item.selector} ${item.property}: ${item.value}`);
    failed ||= nonGrey.length > 0;
  }
  await browser.close();
  process.exitCode = failed ? 1 : 0;
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
