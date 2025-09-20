import { Plugin, TFile } from "obsidian";
import { logForE2E, emitPluginLog } from "../testing/logging";

export function registerCommands(plugin: Plugin): void {
  plugin.addCommand({
    id: "e2e-emit-log",
    name: "E2E: Emit Log",
    callback: () => {
      logForE2E("log", "command:emit-log");
      emitPluginLog(plugin, "info", "command:emit-log");
    },
  });

  plugin.addCommand({
    id: "e2e-open-sample-note",
    name: "E2E: Open Sample Note",
    callback: async () => {
      try {
        const abstract = plugin.app.vault.getAbstractFileByPath("Sample Note.md");
        const file = abstract instanceof TFile ? abstract : null;
        if (file) {
          await plugin.app.workspace.getLeaf(true).openFile(file);
          logForE2E("info", `command:open-sample-note`);
          emitPluginLog(plugin, "info", "command:open-sample-note");
        } else {
          logForE2E("warn", "command:open-sample-note:file-not-found");
          emitPluginLog(plugin, "warn", "command:open-sample-note:file-not-found");
        }
      } catch (err) {
        logForE2E("error", `command:open-sample-note:error`);
        emitPluginLog(plugin, "error", "command:open-sample-note:error");
      }
    },
  });
}


