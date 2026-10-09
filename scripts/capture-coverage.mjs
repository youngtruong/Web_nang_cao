import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
// Reuse puppeteer-core from a local installation, passed as the first argument.
const { default: puppeteer } = await import(pathToFileURL(resolve(process.argv[2])).href);
const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true, args: ['--no-sandbox'],
});
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL(resolve('reports/testing/coverage/index.html')).href, { waitUntil: 'load' });
  await page.screenshot({ path: 'reports/testing/coverage.png', fullPage: true });
} finally { await browser.close(); }
