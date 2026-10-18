# Contactsheet

Upload a photo collection, inspect thumbnails, split false matches and record a per-image selection manifest.

A Kite content agent can buy image grouping and a selection manifest. Choices belong to the operator, and source images are not deleted.

## Start a project

Requires Node.js 20.11 or newer.

```sh
npm ci
npm test
npm start
# Open http://127.0.0.1:3000
```

Create a named photo collection, replace the editable example inputs and save your brief. No analysis or payment happens automatically.

## Workflow

Upload actual image files, inspect grouped thumbnails, split false matches, choose keep/omit/cover per image, save and rerun, then export a reviewed selection manifest. Unreadable or undecided images and multiple covers in one group block release. Originals are never deleted.

### Inputs

- **Source photos**: Up to 40 JPEG, PNG or WebP files, 6 MB of source files total. Originals are never deleted.
- **Similarity threshold (0–32)**
- **Keep these image pairs in separate groups**
- **Selection decisions**

### Deliverables

Photo selection-manifest CSV with source digests. Every completed run also includes an audit JSON with result, input hash, rule version and review decisions. Draft downloads are labeled; release requires current inputs, no blocking issues and an explicit acceptance for every review item.

## What makes this a project workspace

- A named brief and persistent business inputs, not a disposable request.
- Structured forms, source-file import where applicable, business tables and visual previews.
- Immutable analysis runs, scenario duplication, result comparison and historical input restoration.
- Per-item review notes, blocked release for unresolved issues, archived projects and reviewed exports.
- Encrypted local persistence, restart recovery and revision checks that prevent stale edits overwriting newer work.

Project inputs and snapshots remain until removed. Preserve the private `.workspace-data` directory and its encryption key. The application is single-operator and single-process; it has no multitenant accounts or external approval signatures. Default retention limits are 50 projects, 10 runs per project, 64 MB per project and 256 MB overall. See [workspace operations and API](docs/PROJECT-GUIDE.md).

## Kite integration

`npm run check:kite` verifies the configured Kite chain and reads its current block. The service descriptor is at `/kite-service.json`.

Free local analysis returns no payment receipt. With explicitly configured paid mode, a project run prepares a task-bound x402 v2 quote; an operator signs with compatible wallet tooling, the service verifies authorization, computes the business output, requests settlement and delivers only after confirmed success. The workspace collects the delivered result against its saved input hash.

Missing payment configuration fails closed. The task-specific nonce signing extension still requires client interoperability testing. No live wallet-funded payment, stock Passport compatibility, official registry certification or Electric Capital acceptance is claimed. See [Kite setup and verification limits](docs/KITE-INTEGRATION.md).

Remote or paid-mode project management requires a private `WORKSPACE_ACCESS_TOKEN` of at least 32 characters. Bind locally by default, and configure HTTPS before remote use. `.env.example` is a configuration reference; the application does not load it automatically.

## Verification and scope

`npm test` runs business regressions, this project's acceptance tests, project-storage/review/access tests, and payment-state tests with a **fake facilitator**. [Verification record](docs/VERIFICATION.json) distinguishes these from historical live read-only network probes.

Actual JPEG/PNG/WebP decoding, EXIF orientation, difference hashes, complete-linkage grouping, hash-backed identity and ID-based selection decisions.

Up to 40 images, 20 MP per image, 8 MB encoded input. Empty sample is a schema example; tests generate actual PNG fixtures. No face recognition, aesthetics scoring or image deletion.

Developed with AI assistance as a Kite integration evaluation project. [Common infrastructure](docs/SHARED-INFRASTRUCTURE.md) is shared across the evaluation repositories; each project has its own business engine, forms, release criteria and exports. Licensed under MIT.
