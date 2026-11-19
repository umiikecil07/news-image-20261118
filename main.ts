// News image 18 Nov 2026 — publish the front-page image.
//
// The entry is a single pre-rendered 1024x1024 newspaper front page
// ("THE WORLD TODAY — Wednesday 18 November 2026") saved next to this
// file as entry.png. This script copies it into the output directory
// make.fun expects, creating that directory when it does not exist yet.

import { copyFileSync, existsSync, mkdirSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const sourceImage = resolve(here, "entry.png");
const targetDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const targetImage = join(targetDir, "entry.png");

if (!existsSync(sourceImage)) {
  console.error(`entry.png not found next to main.ts: ${sourceImage}`);
  process.exit(1);
}

mkdirSync(targetDir, { recursive: true });
copyFileSync(sourceImage, targetImage);

// The output must be an exact copy — bail out loudly if it is not.
const copiedBytes = statSync(targetImage).size;
const sourceBytes = statSync(sourceImage).size;
if (copiedBytes !== sourceBytes) {
  console.error(
    `size mismatch after copy: source ${sourceBytes} bytes, output ${copiedBytes} bytes`,
  );
  process.exit(1);
}
console.log(`Wrote ${targetImage} (${copiedBytes} bytes)`);
