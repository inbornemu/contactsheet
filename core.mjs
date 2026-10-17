import sharp from 'sharp';
import { createHash } from 'node:crypto';
import { insist, list, integer, unique, text } from './lib/validation.mjs';
export function validate({ photos, threshold = 6, splitPairs = [], decisions = {} }) {
  list(photos, 'photos', 40); integer(threshold, 'threshold', 0, 32); unique(photos);
  insist(photos.length > 0, 'Choose at least one image');
  let bytes = 0;
  for (const p of photos) {
    text(p.name, 'filename', 200); text(p.base64, 'image base64', 3000000);
    insist(/^[\dA-Za-z+/]+={0,2}$/.test(p.base64), 'Invalid image encoding'); bytes += Buffer.byteLength(p.base64);
  }
  insist(bytes <= 8000000, 'At most 8 MB encoded images');
  for (const pair of list(splitPairs, 'splitPairs', 200)) insist(pair.length === 2 && pair.every(id => photos.some(p => p.id === id)), 'Unknown split image');
  for (const [id, d] of Object.entries(decisions)) insist(photos.some(p => p.id === id) && ['keep', 'omit-from-manifest', 'cover'].includes(d), 'Unknown decision');
}
export function hamming(a, b) { let bits = BigInt(`0x${a}`) ^ BigInt(`0x${b}`), count = 0; while (bits) { count += Number(bits & 1n); bits >>= 1n; } return count; }
export async function analyzePhoto(photo) {
  const bytes = Buffer.from(photo.base64, 'base64');
  const hash = createHash('sha256').update(bytes).digest('hex');
  const image = sharp(bytes, { limitInputPixels: 20000000, failOn: 'warning' });
  const metadata = await image.metadata();
  insist(['jpeg', 'png', 'webp'].includes(metadata.format) && (metadata.pages || 1) === 1, 'Only single-frame JPEG, PNG and WebP supported');
  const data = await image.rotate().resize(9, 8, { fit: 'fill' }).greyscale().removeAlpha().raw().toBuffer();
  let bits = 0n;
  for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) bits = (bits << 1n) | BigInt(data[y * 9 + x] > data[y * 9 + x + 1]);
  // Only technical dimensions and digests are exported; EXIF/GPS/serials are discarded.
  return { id: photo.id, name: photo.name, sha256: hash, dHash: bits.toString(16).padStart(16, '0'), width: metadata.width, height: metadata.height };
}
export async function run(input) {
  validate(input); const images = [], failures = [];
  for (const p of input.photos) {
    try { images.push(await analyzePhoto(p)); }
    catch { failures.push({ id: p.id, name: p.name, reason: 'unsupported-or-undecodable-image' }); }
  }
  insist(images.length > 0, 'No decodable images; no billable result');
  const split = input.splitPairs || [], groups = [];
  for (const image of images) {
    // Complete linkage avoids A≈B≈C chains that merge dissimilar A and C.
    const group = groups.find(g => g.every(other => hamming(image.dHash, other.dHash) <= (input.threshold ?? 6) && !split.some(([a, b]) => (a === image.id && b === other.id) || (b === image.id && a === other.id))));
    if (group) group.push(image); else groups.push([image]);
  }
  return { groups: groups.map((g, i) => ({ id: i + 1, images: g.map(p => ({ ...p, decision: input.decisions?.[p.id] || 'undecided' })) })), failures, sourceCount: input.photos.length, analyzedCount: images.length, deletesOriginals: false, method: 'oriented-9x8-difference-hash-v1' };
}
