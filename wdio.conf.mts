import type { Options } from '@wdio/types'
import { join } from 'node:path'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import { execSync } from 'node:child_process'
import { writeFileSync, existsSync, unlinkSync } from 'node:fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const runtimeOnlyEnv = String(process.env.E2E_RUNTIME_ERROR || '').trim()
const RUNTIME_MODE = runtimeOnlyEnv === '1' || /^true$/i.test(runtimeOnlyEnv)

export const config: Options.Testrunner = {
  runner: 'local',
  autoCompileOpts: {
    autoCompile: true,
    tsNodeOpts: {
      project: './tsconfig.wdio.json',
      transpileOnly: true
    }
  },
  specs: RUNTIME_MODE ? ['./test/specs/runtime-error.e2e.ts'] : ['./test/specs/**/*.e2e.ts'],
  exclude: RUNTIME_MODE ? [] : ['./test/specs/runtime-error.e2e.ts'],
  capabilities: [{
    browserName: 'obsidian',
    'wdio:obsidianOptions': {
      installerVersion: "earliest",
      plugins: ["./"],
      vault: "./test/vaults/simple",
    },
  }],
  logLevel: 'info',
  bail: 0,
  baseUrl: 'obsidian://',
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,
  services: [
    ['obsidian', {
      installerVersion: "earliest",
      plugins: ["./"],
      vault: "./test/vaults/simple"
    }]
  ],
  framework: 'mocha',
  reporters: ['spec'],
  mochaOpts: {
    ui: 'bdd',
    timeout: 60000
  },
  autoCompile: true,
  onPrepare: function() {
    try {
      const root = __dirname

      // Optional runtime error mode via env
      const injectRuntimeError = String(process.env.E2E_RUNTIME_ERROR || '').trim()
      if (injectRuntimeError === '1' || /^true$/i.test(injectRuntimeError)) {
        // Create a vault flag instead of swapping code
        const vault = join(root, 'test', 'vaults', 'simple')
        const flag = join(vault, '.e2e-runtime-error')
        writeFileSync(flag, '1')
        console.log('[E2E] Created .e2e-runtime-error flag in test vault')
      }

      // Enable file append logging if requested
      const enableLogs = String(process.env.E2E_ENABLE_LOGS || '').trim()
      if (enableLogs === '1' || /^true$/i.test(enableLogs)) {
        const vault = join(root, 'test', 'vaults', 'simple')
        const flag = join(vault, '.e2e-enable-logs')
        writeFileSync(flag, '1')
        console.log('[E2E] Created .e2e-enable-logs flag in test vault')
      }

      execSync('npm run build', { stdio: 'inherit' });
    } catch (e) {
      // fail fast if build fails
      throw e;
    }
  },
  onComplete: function() {
    try {
      const root = __dirname
      const vault = join(root, 'test', 'vaults', 'simple')
      const errFlag = join(vault, '.e2e-runtime-error')
      if (existsSync(errFlag)) unlinkSync(errFlag)
      const logFlag = join(vault, '.e2e-enable-logs')
      if (existsSync(logFlag)) unlinkSync(logFlag)
    } catch {
      // ignore
    }
  },
  before: async function() {
    (global as any).__CONSOLE_BUFFER__ = [] as { level: string; text: string }[];
    const origLog = console.log;
    const origErr = console.error;
    const origWarn = console.warn;
    console.log = (...args: any[]) => {
      (global as any).__CONSOLE_BUFFER__.push({ level: 'log', text: args.join(' ') });
      origLog.apply(console, args as any);
    };
    console.error = (...args: any[]) => {
      (global as any).__CONSOLE_BUFFER__.push({ level: 'error', text: args.join(' ') });
      origErr.apply(console, args as any);
    };
    console.warn = (...args: any[]) => {
      (global as any).__CONSOLE_BUFFER__.push({ level: 'warn', text: args.join(' ') });
      origWarn.apply(console, args as any);
    };
  },
}
