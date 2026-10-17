import { fileURLToPath } from 'node:url';
import { start } from './lib/server.mjs';
import { run, validate } from './core.mjs';
export * from './core.mjs';
export const spec = { ...{
  "slug": "contactsheet",
  "repo": "contactsheet",
  "owner": "inbornemu",
  "title": "Contactsheet",
  "purpose": "Group real photo uploads into a reviewable contact-sheet manifest",
  "workflow": "A Kite content agent can buy image grouping and a selection manifest. Choices belong to the operator, and source images are not deleted.",
  "colors": [
    "#20201e",
    "#f1eee5",
    "#775d22"
  ],
  "required": [
    "photos"
  ],
  "maxBytes": 8500000,
  "sample": {
    "photos": [],
    "threshold": 6,
    "splitPairs": [],
    "decisions": {}
  },
  "changed": "Actual JPEG/PNG/WebP decoding, EXIF orientation, difference hashes, complete-linkage grouping, hash-backed identity and ID-based selection decisions.",
  "limits": "Up to 40 images, 20 MP per image, 8 MB encoded input. Empty sample is a schema example; tests generate actual PNG fixtures. No face recognition, aesthetics scoring or image deletion.",
  "version": "0.2.0",
  "inputSchema": {
    "type": "object",
    "required": [
      "photos"
    ],
    "properties": {
      "photos": {
        "type": "array"
      },
      "threshold": {
        "type": "integer"
      },
      "splitPairs": {
        "type": "array"
      },
      "decisions": {
        "type": "object"
      }
    }
  }
}, run, validate };
if (process.argv[1] === fileURLToPath(import.meta.url)) start(spec);

