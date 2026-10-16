import assert from 'node:assert/strict';
import { groupPhotos, decide } from './app.mjs';
const groups = groupPhotos([{ name: 'a.jpg', mtime: 100000, bytes: 'same' }, { name: 'b.jpg', mtime: 100100, bytes: 'same' }, { name: 'a.jpg', mtime: 100100, bytes: 'different' }]);
assert.equal(groups.length, 2);
const kept = decide(groups, { 'a.jpg': '保留' });
assert.ok(kept.flatMap(group => group.items).some(item => item.decision === '保留'));
console.log('contactsheet: ok');
