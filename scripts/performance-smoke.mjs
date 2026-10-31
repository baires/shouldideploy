import assert from 'node:assert/strict';
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
const christmas=JSON.parse(fs.readFileSync('locales/es-AR.json','utf8')).reasons.christmas;
const browser=await puppeteer.launch({executablePath:process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
try {
 const page=await browser.newPage(); const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.emulateMediaFeatures([{name:'prefers-color-scheme',value:'light'}]);
 await page.setViewport({width:390,height:844,isMobile:true});
 await page.goto('http://localhost:3100/'); await page.waitForFunction(()=>Boolean(document.querySelector('#text').textContent));
 const initial=await page.$eval('#text',e=>e.textContent);
 await new Promise(r=>setTimeout(r,400)); assert.equal(await page.$eval('#text',e=>e.textContent),initial,'hydration must preserve message');
 console.log('hydration passed');await page.click('.theme-toggle');await page.waitForFunction(()=>document.documentElement.dataset.theme==='Dark');
 console.log('theme passed');await page.select('select', 'America/Sao_Paulo');await page.waitForFunction(()=>location.search.includes('America'));
 console.log('timezone passed');const selectors=await page.$$('select'); await selectors[1].select('es-AR'); await page.waitForFunction(()=>document.querySelector('.tagline').textContent==='¿Debería deployar hoy?');
 console.log('language passed');await page.reload(); await page.waitForFunction(()=>document.querySelector('.tagline').textContent==='¿Debería deployar hoy?');
 assert.equal(await page.evaluate(()=>document.documentElement.dataset.theme),'Dark');
 await page.click('#reload');await page.keyboard.press('Space');
 console.log('persistence and reload passed');await page.goto('http://localhost:3100/?tz=UTC&date=2026-12-25');await page.waitForFunction(messages=>messages.includes(document.querySelector('#text').textContent),{},christmas);
 await page.setJavaScriptEnabled(false);await page.goto('http://localhost:3100/');assert.ok(await page.$eval('#text',e=>e.textContent));
 assert.deepEqual(errors,[]);console.log('PASS: SSR message, hydration stability, theme, timezone, language, preference persistence, click/Space, custom date, and JavaScript-disabled rendering');
}finally{await browser.close();}
