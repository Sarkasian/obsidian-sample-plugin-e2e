import type { Plugin } from "obsidian";

export type LogLevel = "log" | "error" | "warn" | "info" | "debug";

interface E2ELogEntry {
  level: LogLevel;
  message: string;
  timestamp: number;
}

export function logForE2E(level: LogLevel, message: string): void {
  try {
    (console as any)[level](`[E2E] ${message}`);
    if (typeof window !== "undefined") {
      const w = window as Window & { __PLUGIN_TEST_LOGS__?: E2ELogEntry[] };
      if (!w.__PLUGIN_TEST_LOGS__) w.__PLUGIN_TEST_LOGS__ = [];
      w.__PLUGIN_TEST_LOGS__.push({ level, message, timestamp: Date.now() });
    }
  } catch {}
}

export async function emitPluginLog(
  plugin: Plugin,
  level: LogLevel,
  message: string
): Promise<void> {
  try {
    logForE2E(level, message);
    const enableFlag = await plugin.app.vault.adapter.exists(".e2e-enable-logs");
    if (!enableFlag) return;
    const line = JSON.stringify({ level, message, ts: Date.now() }) + "\n";
    await plugin.app.vault.adapter.append("E2E.log", line);
  } catch {}
}


