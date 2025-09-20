import { Plugin, TFile } from "obsidian";
import { logForE2E, emitPluginLog } from "./testing/logging";

export function registerEvents(plugin: Plugin): void {
  plugin.registerEvent(
    plugin.app.workspace.on("file-open", (file) => {
      try {
        if (file && (file as any).path) {
          const tfile = file as TFile;
          const path = tfile.path ?? "<unknown>";
          logForE2E("info", `event:file-open:${path}`);
          emitPluginLog(plugin, "info", `event:file-open:${path}`);
        }
      } catch {
        // ignore
      }
    })
  );
}


