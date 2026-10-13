import sharp from 'sharp';
import {readFile} from 'node:fs/promises';
const root=new URL('../',import.meta.url);
const data=await readFile(new URL('assets/Hero.jpg.png',root));
await sharp(data).rotate().jpeg({quality:90,mozjpeg:true}).toFile(new URL('assets/hero.jpg',root).pathname);
for(const width of [640,1280,1920]){
 await sharp(data).rotate().resize({width}).webp({quality:85}).toFile(new URL(`assets/hero-${width}.webp`,root).pathname);
 await sharp(data).rotate().resize({width}).jpeg({quality:87,mozjpeg:true}).toFile(new URL(`assets/hero-${width}.jpg`,root).pathname);
}
console.log('Prepared responsive WebP/JPG sizes from the supplied hero banner.');
