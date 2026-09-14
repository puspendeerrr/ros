import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, '..', 'public');
const iconsDir = path.join(publicDir, 'icons');

// Create icons directory if it doesn't exist
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

const sourceLogo = path.join(publicDir, 'favicon.png');

if (fs.existsSync(sourceLogo)) {
  const targets = [
    path.join(iconsDir, 'icon-192.png'),
    path.join(iconsDir, 'icon-512.png'),
    path.join(iconsDir, 'maskable-512.png'),
    path.join(iconsDir, 'apple-touch-icon.png')
  ];

  targets.forEach((target) => {
    fs.copyFileSync(sourceLogo, target);
    console.log(`[PWA Asset Gen] Copied ${path.basename(sourceLogo)} -> ${target}`);
  });
} else {
  console.error('[PWA Asset Gen] Source logo not found at public/favicon.png');
}
