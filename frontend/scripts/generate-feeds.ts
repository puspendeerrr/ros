/**
 * Syndication Feeds Generator CLI (npm run generate-feeds)
 * Generates public rss.xml, atom.xml, and jsonfeed.json (strictly published items).
 */

import path from 'path';
import { fileURLToPath } from 'url';
import { PublishingEngine } from '../src/content/publishing/publishing.engine.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspaceDir = path.resolve(__dirname, '..');

async function runGenerateFeeds() {
  console.log('[Feeds Pipeline] Generating public-only rss.xml, atom.xml, and jsonfeed.json...');
  const engine = new PublishingEngine();
  try {
    await engine.run(workspaceDir, false);
    console.log('[Feeds Pipeline] ✅ Generated public-only syndication feeds in public/.');
  } catch (err) {
    console.error('[Feeds Pipeline] ❌ Generation failed:', err);
    process.exit(1);
  }
}

runGenerateFeeds();
