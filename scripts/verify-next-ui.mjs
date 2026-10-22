import fs from 'node:fs';
import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
const { default: puppeteer } = await import(pathToFileURL(process.argv[2]).href);
const browser = await puppeteer.launch({executablePath:process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true,args:['--no-sandbox']});
try {
 const page = await browser.newPage(); const errors=[]; page.on('pageerror',e => errors.push(e.message));
 for (const [path,name] of [['/','home'],['/about','about']]) {
  await page.setViewport({width:390,height:844}); await page.goto('http://localhost:3000'+path,{waitUntil:'networkidle0'});
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await page.screenshot({path:`reports/validation/next-${name}-mobile.png`,fullPage:true});
 }
 await page.goto('http://localhost:3000/login',{waitUntil:'networkidle0'});
 await page.type('[name=email]','admin@example.com'); await page.type('[name=password]',process.env.AUTH_TEST_ADMIN_PASSWORD);
 await Promise.all([page.waitForNavigation({waitUntil:'networkidle0'}), page.click('form button')]);
 assert.ok(page.url().endsWith('/dashboard')); await page.goto('http://localhost:3000/admin',{waitUntil:'networkidle0'});
 await Promise.all([page.waitForNavigation({waitUntil:'networkidle0'}),page.click('form button')]);
 await page.waitForSelector('[role=status]',{timeout:10000}).catch(async e => { console.log('ACTION URL',page.url()); console.log((await page.$eval('body',e=>e.innerText)).slice(0,3000)); throw e; });
 assert.match(await page.$eval('[role=status]',e=>e.textContent),/thành công/);
 assert.deepEqual(errors,[]); fs.writeFileSync('reports/testing/next-ui-results.json',JSON.stringify({time:new Date().toISOString(),checks:['mobile overflow: home/about','admin credentials login through form','admin Server Action through form','no JavaScript errors'],faviconStatus:(await page.goto('http://localhost:3000/favicon.ico')).status()},null,2));
 console.log('UI checks passed');
} finally { await browser.close(); }
