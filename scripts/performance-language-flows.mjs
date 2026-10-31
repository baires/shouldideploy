import assert from 'node:assert/strict';
import fs from 'node:fs';
import puppeteer from 'puppeteer-core';
const browser=await puppeteer.launch({executablePath:process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
try {
 const page=await browser.newPage();await page.goto('http://localhost:3100/');await page.waitForNetworkIdle();
 await page.setRequestInterception(true);let mode=null;
 page.on('request',r=>{if(mode&&r.resourceType()==='script'){const action=mode;mode=null;if(action==='fail')void r.abort();else setTimeout(()=>void r.continue(),500);}else void r.continue();});
 mode='delay';
 const languageSelector='ul.footer-list li:last-child select';
 await page.select(languageSelector,'cs');await page.select(languageSelector,'pt');
 await page.waitForFunction(()=>document.querySelector('.tagline').textContent==='Devo fazer deploy hoje?');
 await new Promise(r=>setTimeout(r,700));assert.equal(await page.$eval(languageSelector,e=>e.value),'pt');
 mode='fail';await page.select(languageSelector,'el');await new Promise(r=>setTimeout(r,500));assert.equal(await page.$eval('.tagline',e=>e.textContent),'Devo fazer deploy hoje?');
 for(const lang of ['en','es','es-AR','pt','cs','sl','bg']){const expected=JSON.parse(fs.readFileSync(`locales/${lang}.json`)).tagline;await page.select(languageSelector,lang);await page.waitForFunction(text=>document.querySelector('.tagline').textContent===text,{},expected);}
 console.log('PASS: stale translation requests cannot override latest selection; failed translation preserves content; all other language chunks load');
} finally {await browser.close();}
