import {chromium} from 'playwright-core';
import {createServer} from 'node:http';
import {readFile,access} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const root=new URL('../',import.meta.url);
const types={'.html':'text/html','.css':'text/css','.js':'text/javascript','.json':'application/json','.svg':'image/svg+xml','.jpg':'image/jpeg','.webp':'image/webp'};
const server=createServer(async(req,res)=>{try{const url=new URL(req.url,'http://localhost');const path=url.pathname==='/'?'index.html':url.pathname.slice(1);if(path.includes('..'))throw Error();const body=await readFile(new URL(path,root));res.setHeader('Content-Type',types['.'+path.split('.').pop()]||'application/octet-stream');res.end(body)}catch{res.writeHead(404);res.end('Not found')}});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
let browser;
try{
 browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:1200,height:630},deviceScaleFactor:1});
 await page.goto(`http://127.0.0.1:${server.address().port}/templates/og.html`);await page.evaluate(()=>document.fonts.ready);
 let hasHero=false;try{await access(new URL('assets/hero.jpg',root));hasHero=true}catch{}
 if(hasHero)await page.locator('.og-photo img').evaluate(img=>{if(!img.complete||!img.naturalWidth)throw Error('Responsive hero missing; run npm run images');});
 else await page.evaluate(()=>document.querySelector('.og').classList.add('no-photo'));
 await page.screenshot({path:fileURLToPath(new URL('assets/og.png',root))});console.log('Rendered assets/og.png (1200×630).');
}finally{await browser?.close();await new Promise(resolve=>server.close(resolve))}
