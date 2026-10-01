import sharp from 'sharp';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { resolve, relative } from 'node:path';
import defaultAssets from '../src/data/assets.json' with { type: 'json' };
const assets = process.env.REGARDIN_IMAGE_MANIFEST
  ? JSON.parse(await readFile(process.env.REGARDIN_IMAGE_MANIFEST, 'utf8'))
  : defaultAssets;
const destination = process.env.REGARDIN_IMAGE_OUTPUT || 'public/images';
const indexPath = process.env.REGARDIN_IMAGE_INDEX || 'src/data/generated-images.json';
let previous = {};
try {
  previous = JSON.parse(await readFile(indexPath, 'utf8'));
} catch {
  /* First image build. */
}
const output = {};
for (const asset of assets.filter((a) => a.approved === true)) {
  if (!/^[a-z0-9-]+$/.test(asset.slug) || !asset.sourceUrl || !asset.alt)
    throw new Error('Approved assets need a safe slug, provenance and descriptive alt text.');
  const source = resolve('research/_raw', asset.original);
  if (relative(resolve('research/_raw'), source).startsWith('..'))
    throw new Error('Asset source must stay inside the private raw archive.');
  const cached = previous[asset.slug];
  if (
    cached &&
    cached.original === asset.original &&
    cached.sourceUrl === asset.sourceUrl &&
    cached.alt === asset.alt &&
    cached.originalSha256 === asset.originalSha256
  ) {
    for (const variant of cached.variants) {
      const bytes = await readFile(resolve(destination, variant.url.split('/').at(-1)));
      if (bytes.length !== variant.bytes)
        throw new Error('Committed derivative size mismatch: ' + variant.url);
    }
    await readFile(resolve(destination, cached.og.split('/').at(-1)));
    output[asset.slug] = cached;
    continue;
  }
  const input = await readFile(source);
  const meta = await sharp(input).metadata();
  await mkdir(destination, { recursive: true });
  const widths = [480, 800, 1200, 1600].filter((w) => w <= Math.max(meta.width, 480));
  const variants = [];
  for (const width of widths) {
    for (const format of ['avif', 'webp']) {
      const filename = `${asset.slug}-${width}.${format}`;
      const result = await sharp(input)
        .rotate()
        .resize({ width, withoutEnlargement: true })
        .toFormat(format, { quality: format === 'avif' ? 48 : 75 })
        .toFile(resolve(destination, filename));
      variants.push({
        url: '/images/' + filename,
        width: result.width,
        height: result.height,
        bytes: result.size,
        format,
      });
      if (asset.hero && result.size > 200 * 1024)
        throw new Error('Hero variant exceeds 200 KB: ' + filename);
    }
  }
  const og = await sharp(input)
    .rotate()
    .resize(1200, 630, { fit: 'cover' })
    .jpeg({ quality: 80 })
    .toFile(resolve(destination, asset.slug + '-og.jpg'));
  output[asset.slug] = {
    original: asset.original,
    originalSha256: asset.originalSha256,
    alt: asset.alt,
    sourceUrl: asset.sourceUrl,
    variants,
    og: '/images/' + asset.slug + '-og.jpg',
    ogBytes: og.size,
  };
}
await writeFile(indexPath, JSON.stringify(output, null, 2) + '\n');
console.log(
  `Image pipeline prepared ${Object.keys(output).length} explicitly approved assets. Originals and metadata remain private; outputs omit EXIF/GPS.`,
);
