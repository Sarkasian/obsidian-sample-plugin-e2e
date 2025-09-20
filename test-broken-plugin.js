#!/usr/bin/env node

/**
 * Broken Plugin Test for Obsidian (dev-only)
 * Intentionally breaks the plugin to test error message capture
 */

import { spawn } from 'child_process';
import { join, resolve } from 'path';
import { fileURLToPath } from 'url';
import { writeFileSync, readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, '..');

async function testBrokenPlugin() {
  console.log('🚨 Starting Obsidian broken plugin test with stdout capture...\n');
  
  const vaultPath = join(__dirname, 'test', 'vaults', 'simple');
  const pluginPath = join(__dirname);
  
  console.log(`Vault: ${vaultPath}`);
  console.log(`Plugin: ${pluginPath}\n`);
  
  // Backup the original src/main.ts
  const originalMainTs = readFileSync(join(__dirname, 'src', 'main.ts'), 'utf8');
  console.log('📝 Backing up original main.ts...');
  
  // Create a broken version of src/main.ts with syntax error
  const brokenMainTs = `
import { Plugin } from 'obsidian';

export default class SamplePlugin extends Plugin {
  onload() {
    // Intentionally broken code to test error capture
    console.log('Plugin loading...');
    
    // This will cause a syntax error
    const broken = {
      missing: 'quote
    };
    
    console.log('This should not execute');
  }
}
`;
  
  try {
    // Write the broken code
    writeFileSync(join(__dirname, 'src', 'main.ts'), brokenMainTs);
    console.log('💥 Created broken main.ts with syntax error...');
    
    // Build the plugin (this should fail)
    console.log('🔨 Building broken plugin...');
    const buildProcess = spawn('node', ['esbuild.config.mjs'], {
      stdio: ['pipe', 'pipe', 'pipe'],
      cwd: __dirname
    });
    
    buildProcess.stdout.on('data', (data) => {
      console.log(`[BUILD STDOUT] ${data.toString().trim()}`);
    });
    
    buildProcess.stderr.on('data', (data) => {
      console.log(`[BUILD STDERR] ${data.toString().trim()}`);
    });
    
    buildProcess.on('exit', (code) => {
      console.log(`\n[BUILD PROCESS] Exited with code ${code}`);
      
      if (code !== 0) {
        console.log('✅ SUCCESS: Build failed as expected!');
        console.log('🎯 Error messages were captured above!');
      } else {
        console.log('❌ Build succeeded unexpectedly');
      }
      
      // Restore original main.ts
      console.log('🔄 Restoring original src/main.ts...');
      writeFileSync(join(__dirname, 'src', 'main.ts'), originalMainTs);
      console.log('✅ Original main.ts restored');
    });
    
  } catch (error) {
    console.log(`[ERROR] ${error.message}`);
    
    // Restore original main.ts
    console.log('🔄 Restoring original src/main.ts...');
    writeFileSync(join(__dirname, 'src', 'main.ts'), originalMainTs);
    console.log('✅ Original main.ts restored');
  }
}

testBrokenPlugin().catch(console.error);
