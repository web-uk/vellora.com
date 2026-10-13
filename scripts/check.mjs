import {chromium} from 'playwright-core';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const base=process.env.PREVIEW_URL||'http://127.0.0.1:8000';
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
const axe=await readFile(new URL('../node_modules/axe-core/axe.min.js',import.meta.url),'utf8');
const problems=[];
try{
 for(const width of [1440,390]){
  const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});
  page.on('pageerror',e=>problems.push(e.message));
  await page.goto(base);await page.evaluate(()=>document.fonts.ready);
  const banner=page.locator('.hero-banner img');
  assert.equal(await banner.count(),1,'hero banner present');
  assert.equal(await banner.evaluate(e=>e.complete&&e.naturalWidth>0),true,'hero image loaded');
  assert.equal(await page.locator('.button-arrow').evaluateAll(items=>items.every(e=>e.tagName.toLowerCase()==='svg')),true,'SVG arrows');
  assert.equal(await page.locator('h1').innerText(),'Mentorship for those who lead\nin business, in community and in life.');
  assert.equal(await page.locator('#stats .stat').count(),1);
  assert.equal(await page.locator('#form-fields').evaluate(e=>e.disabled),true);
  assert.equal(await page.locator('.whatsapp-float').count(),0);
  assert.equal(await page.locator('#testimonials').isVisible(),false);
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);assert.equal(overflow,false,`horizontal overflow at ${width}`);
  const tiny=await page.evaluate(()=>Array.from(document.querySelectorAll('body *')).filter(e=>e.checkVisibility()&&e.textContent.trim()&&parseFloat(getComputedStyle(e).fontSize)<12).map(e=>`${e.tagName}.${e.className}`));assert.deepEqual(tiny,[],`text below 12px at ${width}`);
  const invalidHeadings=await page.locator('h2 em,h3 em').count();assert.equal(invalidHeadings,1); // Contact only.
  await page.locator('[data-context="business"]').click();assert.equal(await page.locator('#context').inputValue(),'business');
  await page.locator('[data-lang="pt"]').click();await page.waitForFunction(()=>document.documentElement.lang==='pt');
  assert.equal(await page.locator('#context').inputValue(),'business');assert.match(await page.locator('#stats').innerText(),/Quase 30/);
  assert.match(await page.locator('#about').innerText(),/Há quase 30 anos, acompanho/);
  await page.locator('[data-lang="en"]').click();await page.waitForFunction(()=>document.documentElement.lang==='en');
  await page.addScriptTag({content:axe});const results=await page.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa']}}));
  assert.deepEqual(results.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[]);
  await page.goto(`${base}/privacy.html?lang=pt`);await page.waitForFunction(()=>document.documentElement.lang==='pt');assert.match(await page.locator('h1').innerText(),/privacidade/);
  await page.close();
 }
 const nojs=await browser.newPage({javaScriptEnabled:false});await nojs.goto(base);
 assert.match(await nojs.locator('#audience').innerText(),/A newly promoted leader/);assert.equal(await nojs.locator('#form-fields').evaluate(e=>e.disabled),true);assert.equal(await nojs.locator('h1').innerText(),'Mentorship for those who lead\nin business, in community and in life.');await nojs.close();
 const page=await browser.newPage();await page.goto(base);
 await page.evaluate(()=>{VELLORA_CONFIG.stats=[{value:'',label:'Hidden'},{value:'Confirmed',label:'Verified entry'}];});
 await page.locator('[data-lang="pt"]').click();await page.waitForFunction(()=>document.documentElement.lang==='pt');assert.equal(await page.locator('#stats .stat').count(),1);
 await page.evaluate(()=>{VELLORA_CONFIG.stats=[]});await page.locator('[data-lang="en"]').click();await page.waitForFunction(()=>document.documentElement.lang==='en');assert.equal(await page.locator('.proof-band').isVisible(),false);
 // Test the real contact gate and submission behavior with an intercepted endpoint; no external message is sent.
 await page.evaluate(()=>{VELLORA_CONFIG.formspreeEndpoint='https://formspree.io/f/example';VELLORA_CONFIG.privacyReady=false});await page.locator('[data-lang="pt"]').click();await page.waitForFunction(()=>document.documentElement.lang==='pt');assert.equal(await page.locator('#form-fields').evaluate(e=>e.disabled),true);
 await page.evaluate(()=>{VELLORA_CONFIG.privacyReady=true});await page.locator('[data-lang="en"]').click();await page.waitForFunction(()=>document.documentElement.lang==='en');assert.equal(await page.locator('#form-fields').evaluate(e=>e.disabled),false);
 await page.route('https://formspree.io/f/example',r=>r.fulfill({status:200,contentType:'application/json',body:'{"ok":true}'}));
 await page.locator('[name="name"]').fill('Local test');await page.locator('[name="email"]').fill('test@example.com');await page.locator('[name="context"]').selectOption('leader');await page.locator('[name="message"]').fill('Local intercepted test');await page.locator('[type="checkbox"]').check();await page.locator('[type="submit"]').click();await page.waitForFunction(()=>document.getElementById('form-status').textContent.includes('Thank you'));
 assert.deepEqual(problems,[]);console.log('PASS: 1440/390 layouts, bilingual UI, card selection, stats filtering, disabled form, mock submission, no-JS English, privacy, minimum type size and axe WCAG A/AA.');
}finally{await browser.close()}
