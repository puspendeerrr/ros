import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateFavicons() {
  const publicDir = path.resolve(__dirname, '../public');
  const sourceIcon = path.join(publicDir, 'favicon.png');

  if (!fs.existsSync(sourceIcon)) {
    console.error('Source favicon.png not found at:', sourceIcon);
    return;
  }

  // 1. 16x16 PNG
  const buf16 = await sharp(sourceIcon).resize(16, 16).png().toBuffer();
  fs.writeFileSync(path.join(publicDir, 'favicon-16x16.png'), buf16);

  // 2. 32x32 PNG
  const buf32 = await sharp(sourceIcon).resize(32, 32).png().toBuffer();
  fs.writeFileSync(path.join(publicDir, 'favicon-32x32.png'), buf32);

  // 3. 180x180 Apple Touch Icon
  const buf180 = await sharp(sourceIcon).resize(180, 180).png().toBuffer();
  fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), buf180);

  // 4. 192x192 Android Chrome Icon
  const buf192 = await sharp(sourceIcon).resize(192, 192).png().toBuffer();
  fs.writeFileSync(path.join(publicDir, 'android-chrome-192x192.png'), buf192);

  // 5. 512x512 Android Chrome Icon
  const buf512 = await sharp(sourceIcon).resize(512, 512).png().toBuffer();
  fs.writeFileSync(path.join(publicDir, 'android-chrome-512x512.png'), buf512);

  // 6. Generate standard multi-image favicon.ico (16x16 + 32x32 embedded PNG format)
  // ICO header: 6 bytes (Reserved 2 bytes = 0, Type 2 bytes = 1, ImageCount 2 bytes = 2)
  // Directory entry (16 bytes per image):
  // Width (1B), Height (1B), ColorCount (1B=0), Reserved (1B=0), ColorPlanes (2B=1), BPP (2B=32), DataSize (4B), Offset (4B)
  const headerSize = 6;
  const dirEntrySize = 16;
  const numImages = 2;
  const offset1 = headerSize + dirEntrySize * numImages;
  const offset2 = offset1 + buf16.length;

  const icoHeader = Buffer.alloc(headerSize);
  icoHeader.writeUInt16LE(0, 0); // Reserved
  icoHeader.writeUInt16LE(1, 2); // Type 1 = ICO
  icoHeader.writeUInt16LE(numImages, 4); // 2 images

  const entry1 = Buffer.alloc(dirEntrySize);
  entry1.writeUInt8(16, 0); // Width
  entry1.writeUInt8(16, 1); // Height
  entry1.writeUInt8(0, 2); // Colors
  entry1.writeUInt8(0, 3); // Reserved
  entry1.writeUInt16LE(1, 4); // Planes
  entry1.writeUInt16LE(32, 6); // BPP
  entry1.writeUInt32LE(buf16.length, 8); // Size
  entry1.writeUInt32LE(offset1, 12); // Offset

  const entry2 = Buffer.alloc(dirEntrySize);
  entry2.writeUInt8(32, 0); // Width
  entry2.writeUInt8(32, 1); // Height
  entry2.writeUInt8(0, 2); // Colors
  entry2.writeUInt8(0, 3); // Reserved
  entry2.writeUInt16LE(1, 4); // Planes
  entry2.writeUInt16LE(32, 6); // BPP
  entry2.writeUInt32LE(buf32.length, 8); // Size
  entry2.writeUInt32LE(offset2, 12); // Offset

  const icoBuffer = Buffer.concat([icoHeader, entry1, entry2, buf16, buf32]);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);

  console.log('[Favicons] Generated complete favicon suite successfully in public/:');
  console.log(' - favicon.ico');
  console.log(' - favicon-16x16.png');
  console.log(' - favicon-32x32.png');
  console.log(' - apple-touch-icon.png');
  console.log(' - android-chrome-192x192.png');
  console.log(' - android-chrome-512x512.png');
}

generateFavicons().catch(err => {
  console.error('Error generating favicons:', err);
  process.exit(1);
});
