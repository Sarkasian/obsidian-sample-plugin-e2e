# E2E Tests for Sample Plugin E2E

This directory contains the WebdriverIO-based E2E tests used to validate the sample plugin’s behavior and log capture.

## What’s included

- Minimal specs that assert deterministic console output from the plugin
- A test vault (`test/vaults/simple`) with `Sample Note.md`
- An optional runtime-error spec to verify error capture

## Running

```bash
npm run test:e2e
```

## Specs

- `plugin-smoke.e2e.ts`: asserts `[E2E] plugin:onload`
- `simple-test.e2e.ts`: invokes `E2E: Emit Log` via command palette
- `file-open.e2e.ts`: opens `Sample Note.md` via command palette and checks file-open log
- `runtime-error.e2e.ts`: temporarily swaps `src/main.ts` with `src/main.ts.backup`, rebuilds, and expects an intentional runtime error to be captured

## Notes

- Console output is buffered in the test runner via a simple hook in `wdio.conf.mts`. Look for messages prefixed with `[E2E]`.
- The vault `E2E.log` file is also appended to by the plugin as auxiliary evidence if needed.
