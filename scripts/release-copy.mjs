import { copyFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const vaultPath = process.env.VAULT_PATH;
if (!vaultPath) {
  console.error('VAULT_PATH env var is required.');
  process.exit(1);
}

const pluginId = 'obsidian-sample-plugin-e2e';
const destDir = join(vaultPath, '.obsidian', 'plugins', pluginId);
if (!existsSync(destDir)) mkdirSync(destDir, { recursive: true });

for (const f of ['main.js', 'manifest.json']) {
  copyFileSync(join(process.cwd(), f), join(destDir, f));
}

console.log(`Copied release files to ${destDir}`);


