import { copyFile, mkdir } from 'node:fs/promises';
await mkdir('public/fonts', { recursive: true });
for (const [family, weights] of [
  ['dm-sans', ['400-normal', '500-normal', '600-normal']],
  ['bodoni-moda', ['400-normal', '400-italic']],
]) {
  for (const weight of weights) {
    const name = `${family}-latin-${weight}.woff2`;
    await copyFile(`node_modules/@fontsource/${family}/files/${name}`, `public/fonts/${name}`);
  }
  await copyFile(
    `node_modules/@fontsource/${family}/LICENSE`,
    `public/fonts/${family}-LICENSE.txt`,
  );
}
