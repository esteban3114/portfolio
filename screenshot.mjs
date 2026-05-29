import { chromium } from 'playwright';
import { createServer } from 'http';
import { readFileSync, existsSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = __dirname;

const MIME = {
  '.html': 'text/html',
  '.jsx':  'text/javascript',
  '.js':   'text/javascript',
  '.css':  'text/css',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
};

const server = createServer((req, res) => {
  const url = req.url === '/' ? '/index.html' : req.url;
  const file = join(ROOT, url);
  if (existsSync(file)) {
    const ext = extname(file);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'text/plain' });
    res.end(readFileSync(file));
  } else {
    res.writeHead(404); res.end('Not found');
  }
});

await new Promise(r => server.listen(7331, r));
console.log('Server up on :7331');

const browser = await chromium.launch();

const viewports = [
  { name: 'iphone13pro', width: 375,  height: 812,  isMobile: true,  ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1' },
  { name: 'desktop',     width: 1440, height: 900,  isMobile: false, ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36' },
];

for (const vp of viewports) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    isMobile: vp.isMobile,
    userAgent: vp.ua,
  });
  const page = await ctx.newPage();

  // inject sessionStorage skip before page load
  await page.addInitScript(() => {
    sessionStorage.setItem('estbn_booted', '1');
    localStorage.setItem('estbn_section', 'WHO');
  });

  await page.goto('http://localhost:7331/', { waitUntil: 'networkidle' });

  // wait for React to render the terminal
  await page.waitForSelector('.terminal', { timeout: 15000 });
  // let typewriter tick a few frames
  await page.waitForTimeout(1200);

  const out = `screenshot-${vp.name}.png`;
  await page.screenshot({ path: out, fullPage: false });
  console.log(`Saved ${out}`);

  // also capture boot screen
  const ctx2 = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    isMobile: vp.isMobile,
    userAgent: vp.ua,
  });
  const page2 = await ctx2.newPage();
  await page2.goto('http://localhost:7331/', { waitUntil: 'networkidle' });
  await page2.waitForTimeout(3500); // let boot type a few lines
  await page2.screenshot({ path: `screenshot-${vp.name}-boot.png`, fullPage: false });
  console.log(`Saved screenshot-${vp.name}-boot.png`);
  await ctx2.close();
  await ctx.close();
}

await browser.close();
server.close();
console.log('Done.');
