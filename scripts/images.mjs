import sharp from 'sharp';
import {readFile,writeFile} from 'node:fs/promises';
const root=new URL('../',import.meta.url);
const photo=new URL('assets/jesiel.jpg',root);
const data=await readFile(photo);
const meta=await sharp(data).metadata();
for(const width of [480,800,1200]){
 await sharp(data).rotate().resize({width}).webp({quality:84}).toFile(new URL(`assets/jesiel-${width}.webp`,root).pathname);
 await sharp(data).rotate().resize({width}).jpeg({quality:87,mozjpeg:true}).toFile(new URL(`assets/jesiel-${width}.jpg`,root).pathname);
}
// Preserve the actual aspect ratio in static markup (including EXIF rotation).
const rotated=[5,6,7,8].includes(meta.orientation);
const width=rotated?meta.height:meta.width,height=rotated?meta.width:meta.height;
for(const name of ['index.html']){
 const file=new URL(name,root);const html=await readFile(file,'utf8');await writeFile(file,html.replaceAll('width="874" height="875"',`width="${width}" height="${height}"`));
}
console.log(`Prepared responsive WebP/JPG assets from authorised photo (${width}×${height}).`);
