import {chromium} from 'playwright-core';
import {mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
const base=process.env.PREVIEW_URL||'http://127.0.0.1:8000';
const output=resolve(process.env.SCREENSHOT_DIR||'work/screenshots');
await mkdir(output,{recursive:true});
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
try{
 for(const width of [1440,390]){
  const page=await browser.newPage({viewport:{width,height:1000},deviceScaleFactor:1});
  await page.goto(base);await page.evaluate(()=>document.fonts.ready);
  // Trigger every reveal and lazy image by visiting the page in natural order.
  await page.evaluate(async()=>{for(let y=0;y<document.documentElement.scrollHeight;y+=650){scrollTo({top:y,behavior:"instant"});await new Promise(r=>setTimeout(r,80))}scrollTo({top:0,behavior:"instant"})});
  await page.waitForTimeout(1300);
  await page.screenshot({path:resolve(output,`vellora-${width}.png`),fullPage:true});await page.close();
 }
 console.log(`Saved full-page screenshots to ${output}`);
}finally{await browser.close()}
