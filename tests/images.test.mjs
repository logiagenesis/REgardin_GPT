import { test } from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import { mkdir, writeFile, readFile, rm, mkdtemp } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
test('image pipeline strips metadata, emits responsive formats and excludes unapproved assets', async () => {
  const temp = await mkdtemp(join(tmpdir(), 'regardin-images-'));
  const filename = '__synthetic-test-' + crypto.randomUUID() + '.jpg';
  const raw = 'research/_raw/' + filename;
  try {
    await mkdir('research/_raw', { recursive: true });
    await sharp({ create: { width: 1000, height: 750, channels: 3, background: '#b5563a' } })
      .withMetadata({ exif: { IFD0: { Artist: 'Synthetic test only' } } })
      .jpeg()
      .toFile(raw);
    const manifest = join(temp, 'manifest.json');
    const output = join(temp, 'output');
    const index = join(temp, 'images.json');
    await writeFile(
      manifest,
      JSON.stringify([
        {
          slug: 'synthetic-test',
          original: filename,
          sourceUrl: 'https://example.com/synthetic-test',
          alt: 'Synthetic image used only in an automated test',
          approved: true,
          hero: true,
        },
        { slug: 'not-approved', original: 'does-not-exist.jpg', approved: false },
      ]),
    );
    execFileSync(process.execPath, ['scripts/images.mjs'], {
      env: {
        ...process.env,
        REGARDIN_IMAGE_MANIFEST: manifest,
        REGARDIN_IMAGE_OUTPUT: output,
        REGARDIN_IMAGE_INDEX: index,
      },
      stdio: 'pipe',
    });
    const entries = JSON.parse(await readFile(index, 'utf8'));
    assert.deepEqual(Object.keys(entries), ['synthetic-test']);
    const variants = entries['synthetic-test'].variants;
    assert.equal(variants.length, 4);
    for (const v of variants) {
      const metadata = await sharp(join(output, v.url.split('/').at(-1))).metadata();
      assert.equal(metadata.exif, undefined);
      assert.ok(v.bytes < 200 * 1024);
      assert.ok([480, 800].includes(metadata.width));
    }
    const og = await sharp(join(output, 'synthetic-test-og.jpg')).metadata();
    assert.equal(og.width, 1200);
    assert.equal(og.height, 630);
    assert.equal(og.exif, undefined);
  } finally {
    await rm(raw, { force: true });
    await rm(temp, { recursive: true, force: true });
  }
});
