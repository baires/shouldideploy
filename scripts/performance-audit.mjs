import lighthouse from 'lighthouse';
import puppeteer from 'puppeteer-core';
import fs from 'node:fs/promises';
const label = process.argv[2] || 'audit';
const url = process.argv[3] || 'http://localhost:3100/';
const outputDirectory = process.env.PERF_OUTPUT || '/tmp/shouldideploy-perf/results';
await fs.mkdir(outputDirectory, { recursive: true });
const browser = await puppeteer.launch({executablePath:process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true,args:['--remote-debugging-port=9222']});
try {
for (let i=1;i<=3;i++) {
 const {lhr,report} = await lighthouse(url, {port:9222,onlyCategories:['performance'],output:'json',logLevel:'error'});
 await fs.writeFile(`${outputDirectory}/${label}-${i}.json`,report);
 console.log(JSON.stringify({label,run:i,score:lhr.categories.performance.score,...Object.fromEntries(['first-contentful-paint','largest-contentful-paint','speed-index','total-blocking-time','cumulative-layout-shift','total-byte-weight','bootup-time','mainthread-work-breakdown'].map(k=>[k,lhr.audits[k]?.numericValue]))}));
}
} finally {await browser.close();}
