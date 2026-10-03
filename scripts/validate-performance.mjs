import fs from 'node:fs';
import { pathToFileURL } from 'node:url';
// Truyền đường dẫn puppeteer-core làm tham số; có sẵn trong bộ cài Lighthouse.
const { default: puppeteer } = await import(pathToFileURL(process.argv[2]).href);
const browser = await puppeteer.launch({executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true, args:['--no-sandbox']});
const results = [];
const assert = (value, message) => { if (!value) throw new Error(message); };
try {
  for (const mode of ['before','after']) {
    const page = await browser.newPage();
    await page.setViewport({width:1440,height:1100});
    const errors = []; page.on('pageerror', e => errors.push(e.message));
    await page.goto(`http://127.0.0.1:4173/performance.html?mode=${mode}&debug`, {waitUntil:'networkidle0'});
    const mounted = await page.$$eval('[data-product-id]', rows => rows.length);
    assert(mode === 'before' ? mounted === 10000 : mounted <= 16, 'Số dòng mount sai');
    const before = await page.evaluate(() => ({...window.performanceLab}));
    await page.click('[data-product-id="1"] input');
    await page.waitForFunction(() => document.querySelectorAll('.stats b')[2].textContent === '1');
    const after = await page.evaluate(() => ({...window.performanceLab}));
    assert(mode === 'before' ? after.rows - before.rows === 10000 : after.rows - before.rows === 1, 'Memo không bỏ qua các dòng không đổi');
    assert(mode === 'before' ? after.computations - before.computations === 1 : after.computations === before.computations, 'Memo phép lọc không đúng');
    await page.evaluate(() => { const list = document.getElementById('list'); list.scrollTop = list.scrollHeight; });
    await page.waitForSelector('[data-product-id="10000"]');
    await page.evaluate(() => { document.getElementById('list').scrollTop = 0; });
    await page.waitForSelector('[data-product-id="1"]');
    assert(await page.$eval('[data-product-id="1"] input', el => el.checked), 'Mất lựa chọn sau khi cuộn');
    await page.type('input[placeholder]', 'Tai nghe 00001');
    await page.waitForFunction(() => document.querySelectorAll('.stats b')[1].textContent === '1');
    await page.$eval('input[placeholder]', el => { const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set; setter.call(el,''); el.dispatchEvent(new Event('input',{bubbles:true})); });
    await page.waitForFunction(() => document.querySelectorAll('.stats b')[1].textContent === '10.000');
    await page.select('.toolbar select', 'Điện tử');
    await page.waitForFunction(() => document.querySelectorAll('.stats b')[1].textContent === '2.500');
    await page.select('.toolbar select', '');
    await page.select('.toolbar label:nth-child(3) select', 'price');
    await page.waitForFunction(() => document.querySelector('[data-product-id] small').textContent === 'SKU-00001');
    const ids = await page.$$eval('[data-product-id]', rows => rows.slice(0,3).map(r => Number(r.dataset.productId)));
    assert(JSON.stringify(ids) === JSON.stringify([1,121,241]), 'Sắp xếp giá sai');
    await page.click('.toolbar button');
    await page.waitForFunction(() => document.querySelectorAll('.stats b')[2].textContent === '0');
    await page.screenshot({path:`reports/validation/${mode}-desktop.png`,fullPage:true});
    await page.setViewport({width:390,height:844});
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Tràn ngang trên mobile');
    await page.screenshot({path:`reports/validation/${mode}-mobile.png`,fullPage:true});
    assert(!errors.length, errors.join('\n'));
    results.push({mode,mounted,selection:{rowRenders:after.rows-before.rows,filterComputations:after.computations-before.computations},checks:['scroll to product 10000','selection survives scroll','search','category','price sort','clear selection','mobile overflow','no console errors']});
    await page.close();
  }
  fs.writeFileSync('reports/validation/functional.json',JSON.stringify(results,null,2));
  console.log(JSON.stringify(results,null,2));
} finally { await browser.close(); }
