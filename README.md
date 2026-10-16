# Contactsheet

A traceable first-pass photo contact sheet. It groups supplied file summaries by explicit time and content digest, then leaves keep/split/cover decisions to a person.

This is a synthetic public evaluation project for testing developer indexing. It does not identify faces, score aesthetics, delete files, claim Electric Capital acceptance, or contain real photographs. The account owner must review changes before any external submission.

## Run

```sh
npm test
npm start
```

Open `http://localhost:3000`. The MVP deliberately uses metadata and hashes rather than pretending to perform image analysis; original files are never touched.
