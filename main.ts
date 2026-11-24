// news-image-20261124 — "The World Today" for Tuesday, 24 November 2026.
//
// The entry is a single 1024x1024 PNG infographic (entry.png, shipped next
// to this file) summing up the day's world news in six panels plus an
// "Also today" strip: Huang's return sends Nvidia up 31%, COP31 collapses
// in Antalya, NATO sends AWACS to Poland, Ukraine sinks a Russian warship
// in Libya, Seoul's Ulleung Island air alert, and the Indonesia factory
// fire. This program just places that image where the grader expects it,
// so every run produces exactly the same bytes.
//
// Run outside the grader with MAKEFUN_OUTPUT_DIR set, e.g.:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const image = readFileSync(join(here, 'entry.png'));

// Refuse to emit anything that is not a whole PNG file.
const PNG_MAGIC = 0x89504e47;
const PNG_MAGIC_TAIL = 0x0d0a1a0a;
if (image.length < 8 || image.readUInt32BE(0) !== PNG_MAGIC || image.readUInt32BE(4) !== PNG_MAGIC_TAIL) {
  throw new Error('entry.png is not a PNG file');
}

// The bounty caps the image at 1 MiB and 1024x1024 px; fail loudly rather
// than shipping an oversize entry.
const MAX_BYTES = 1024 * 1024;
if (image.length > MAX_BYTES) {
  throw new Error(`entry.png is ${image.length} bytes, over the 1 MiB limit`);
}

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'entry.png'), image);
console.log(`wrote entry.png (${image.length} bytes) to ${outDir}`);
