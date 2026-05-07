import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { renderVideo } from '@rendervid/renderer-node';
const __dirname = dirname(fileURLToPath(import.meta.url));
const template = JSON.parse(readFileSync(join(__dirname, 'template.json'), 'utf8'));
await renderVideo({ template, output: join(__dirname, 'output', 'claude-code-figma-mcp.mp4') });
