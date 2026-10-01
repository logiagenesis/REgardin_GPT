import sharp from 'sharp';
import { readdir, mkdir, writeFile } from 'node:fs/promises';
import { basename } from 'node:path';
const files = (await readdir('research/_raw'))
  .filter((f) => /\.(png|jpe?g)$/i.test(f))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
await mkdir('research/thumbnails', { recursive: true });
const width = 180,
  height = 170,
  columns = 7;
const layers = [];
const cells = [];
for (let i = 0; i < files.length; i++) {
  const name = files[i];
  const thumb = await sharp('research/_raw/' + name)
    .rotate()
    .resize(width, height - 25, { fit: 'contain', background: '#e9e4da' })
    .jpeg({ quality: 70 })
    .toBuffer();
  await writeFile('research/thumbnails/' + name + '.jpg', thumb);
  const text = name.replace(/[^\w. -]/g, '').slice(0, 28);
  const label = Buffer.from(
    `<svg width="${width}" height="25"><rect width="100%" height="100%" fill="#f7f5f0"/><text x="5" y="17" font-size="11" fill="#1e1f1c">${i + 1}. ${text}</text></svg>`,
  );
  layers.push(
    { input: thumb, left: (i % columns) * width, top: Math.floor(i / columns) * height },
    {
      input: label,
      left: (i % columns) * width,
      top: Math.floor(i / columns) * height + height - 25,
    },
  );
  cells.push(
    `<figure><img src="thumbnails/${basename(name)}.jpg" alt="Source media ${i + 1}, awaiting classification"><figcaption>${i + 1}. ${text}<br>Project and permission: awaiting confirmation</figcaption></figure>`,
  );
}
await sharp({
  create: {
    width: columns * width,
    height: Math.ceil(files.length / columns) * height,
    channels: 3,
    background: '#f7f5f0',
  },
})
  .composite(layers)
  .jpeg({ quality: 85 })
  .toFile('research/contact-sheet.jpg');
await writeFile(
  'research/contact-sheet.html',
  `<!DOCTYPE html><html lang="en-ZA"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Regardin source media — private review</title><style>body{font:14px Arial;background:#f7f5f0;color:#1e1f1c;padding:25px}main{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:20px}figure{margin:0}img{width:100%;height:180px;object-fit:contain}figcaption{padding-top:10px}</style></head><body><h1>Source media review</h1><p>Originals from the existing website. Do not publish until work attribution, project context and permissions are confirmed. Raw originals and this sheet remain git-ignored.</p><main>${cells.join('')}</main></body></html>`,
);
console.log(`Prepared private contact sheet for ${files.length} source images.`);
