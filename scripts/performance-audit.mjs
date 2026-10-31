import lighthouse from 'lighthouse';
import puppeteer from 'puppeteer-core';
import fs from 'node:fs/promises';
import path from 'node:path';
import { tmpdir } from 'node:os';
const label = process.argv[2] || 'audit';
const url = process.argv[3] || 'http://localhost:3100/';
if (!/^[a-zA-Z0-9_-]+$/.test(label)) {
  throw new Error('Audit label may only contain letters, numbers, underscores, and hyphens');
}
const outputRoot = process.env.PERF_OUTPUT || tmpdir();
await fs.mkdir(outputRoot, { recursive: true });
const outputDirectory = await fs.mkdtemp(path.join(outputRoot, 'shouldideploy-perf-'));
console.log(`Reports: ${outputDirectory}`);
const browser = await puppeteer.launch({executablePath:process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true,args:['--remote-debugging-port=9222']});
try {
for (let i=1;i<=3;i++) {
 const {lhr,report} = await lighthouse(url, {port:9222,onlyCategories:['performance'],output:'json',logLevel:'error'});
 await fs.writeFile(`${outputDirectory}/${label}-${i}.json`, report, { flag: 'wx', mode: 0o600 });
 console.log(JSON.stringify({label,run:i,score:lhr.categories.performance.score,...Object.fromEntries(['first-contentful-paint','largest-contentful-paint','speed-index','total-blocking-time','cumulative-layout-shift','total-byte-weight','bootup-time','mainthread-work-breakdown'].map(k=>[k,lhr.audits[k]?.numericValue]))}));
}
} finally {await browser.close();}
