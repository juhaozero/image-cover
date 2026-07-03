import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import toIco from 'to-ico';

const root = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(root, '../public');
const svgPath = path.join(publicDir, 'favicon.svg');
const svg = fs.readFileSync(svgPath);

const icoSizes = [16, 32, 48];
const pngs = await Promise.all(
  icoSizes.map((size) => sharp(svg).resize(size, size).png().toBuffer()),
);

fs.writeFileSync(path.join(publicDir, 'favicon.ico'), await toIco(pngs));
await sharp(svg).resize(180, 180).png().toFile(path.join(publicDir, 'apple-touch-icon.png'));

console.log('Generated: favicon.ico, apple-touch-icon.png');
