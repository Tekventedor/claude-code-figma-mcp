import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { createNodeRenderer } from '@rendervid/renderer-node';

const __dirname = dirname(fileURLToPath(import.meta.url));

const template = JSON.parse(readFileSync(join(__dirname, 'template.json'), 'utf-8'));
const outputPath = join(__dirname, 'output', 'claude-code-figma-mcp.mp4');

const renderer = createNodeRenderer({
  concurrency: 2,
  gpu: { rendering: true, encoding: 'auto', fallback: true },
});

const started = Date.now();
const result = await renderer.renderVideo({
  template,
  inputs: {},
  outputPath,
  codec: 'libx264',
  quality: 20,
  pixelFormat: 'yuv420p',
  audioCodec: 'none',
  onProgress: (p) => {
    if (p.phase === 'rendering' && p.currentFrame % 30 === 0) {
      process.stderr.write(`\r[render] frame ${p.currentFrame}/${p.totalFrames} (${p.percent.toFixed(1)}%)`);
    }
    if (p.phase === 'complete') process.stderr.write('\n');
  },
});
const elapsed = ((Date.now() - started) / 1000).toFixed(1);

if (!result.success) {
  console.error(`Render failed: ${result.error}`);
  process.exit(1);
}
console.log(`\n✓ ${result.frameCount} frames in ${elapsed}s → ${result.outputPath} (${(result.fileSize/1048576).toFixed(2)} MB)`);
