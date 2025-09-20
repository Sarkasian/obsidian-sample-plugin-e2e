# Sample Plugin E2E (Obsidian)

Minimal Obsidian plugin wired for end-to-end testing and agent workflows. It provides:

- A tiny plugin surface (startup log, one command, one `file-open` listener)
- E2E harness via WebdriverIO `wdio-obsidian-service`
- Deterministic console log markers for test assertions
- An intentional runtime-error variant for log/error-capture testing

## Quick start

```bash
npm install
npm run dev   # builds to main.js (watch)
# Or for production build
npm run build
```

Ensure `main.js` and `manifest.json` reside in your vault under `.obsidian/plugins/obsidian-sample-plugin-e2e/`.

## Plugin behavior

- On load, logs `[E2E] plugin:onload`
- Command: `E2E: Emit Log` emits `[E2E] command:emit-log`
- Command: `E2E: Open Sample Note` opens `Sample Note.md` in the test vault and emits `[E2E] command:open-sample-note`
- Event: `file-open` logs `[E2E] event:file-open:<path>` and mirrors to `E2E.log` in the vault

## Testing

Run E2E tests (starts Obsidian with the test vault):

```bash
npm run test:e2e
```

Included specs:
- `plugin-smoke.e2e.ts`: asserts startup log
- `simple-test.e2e.ts`: runs the emit-log command through command palette
- `file-open.e2e.ts`: opens sample note and asserts file-open event log

Runtime error test (isolated):

```bash
npm run test:e2e:runtime
```

- Uses a vault flag `.e2e-runtime-error` to make the plugin intentionally throw during `onload`.
- The flag is created/cleaned by the test runner; no source swapping is needed.

Optional E2E log file (E2E.log):

```bash
cross-env E2E_ENABLE_LOGS=1 npm run test:e2e
```

- When enabled, the plugin appends compact JSON entries to `E2E.log` in the test vault.
- Disabled by default to keep production behavior clean.

Build-failure test (standalone):

```bash
npm run test:broken
```

## Project layout

```
src/
  main.ts               # entry point
  commands/index.ts     # small testable commands
  events.ts             # minimal event listener
  utils/logging.ts      # deterministic log helpers and vault log mirror
test/
  specs/*.e2e.ts        # E2E test specs
  vaults/simple         # test vault
  (runner sets .e2e-runtime-error and .e2e-enable-logs flags here)
```

## Notes

- Manifest `id` is `obsidian-sample-plugin-e2e` to match the folder name.
- The E2E tests rely on console output markers with `[E2E]` prefix.
- The vault `E2E.log` file is appended to for additional verification if needed.

## License

MIT
