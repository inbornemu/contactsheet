import test from 'node:test'; import assert from 'node:assert/strict'; import sharp from 'sharp'; import { run, analyzePhoto } from './core.mjs';
async function photo(id, name = 'same-name.png') { const data = await sharp({ create: { width: 20, height: 20, channels: 3, background: '#334455' } }).png().toBuffer(); return { id, name, base64: data.toString('base64') }; }
test('actual decoded images group while explicit split and per-ID decisions persist', async () => {
  const input = { photos: [await photo('a'), await photo('b')], decisions: { a: 'keep', b: 'cover' } };
  assert.equal((await run(input)).groups.length, 1);
  const r = await run({ ...input, splitPairs: [['a', 'b']], threshold: 32 }); assert.equal(r.groups.length, 2); assert.equal(r.groups[1].images[0].decision, 'cover');
});
test('same filename with different content gets separate SHA identities', async () => {
  const a = await photo('a'), b = await photo('b'); b.base64 = (await sharp({ create: { width: 20, height: 20, channels: 3, background: '#ff0000' } }).png().toBuffer()).toString('base64');
  assert.notEqual((await analyzePhoto(a)).sha256, (await analyzePhoto(b)).sha256);
});
test('damaged inputs are reported individually, no original is deleted', async () => { const r = await run({ photos: [await photo('a'), { id: 'b', name: 'bad.jpg', base64: Buffer.from('broken').toString('base64') }] }); assert.equal(r.failures.length, 1); assert.equal(r.analyzedCount, 1); assert.equal(r.deletesOriginals, false); });
test('technical output never exposes EXIF or input image data', async () => { const r = await analyzePhoto(await photo('a')); assert.deepEqual(Object.keys(r).sort(), ['dHash', 'height', 'id', 'name', 'sha256', 'width']); });
test('all-corrupt batches fail instead of charging for an empty report', async () => { await assert.rejects(run({ photos: [{ id: 'bad', name: 'bad.jpg', base64: 'YnJva2Vu' }] }), /No decodable/); });
