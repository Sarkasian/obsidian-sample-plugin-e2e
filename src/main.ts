import { Plugin } from "obsidian";
import { logForE2E, emitPluginLog } from "./testing/logging";
import { registerCommands } from "./commands";
import { registerEvents } from "./events";
import { DEFAULT_SETTINGS, SamplePluginSettings, SampleSettingsTab } from "./settings";

export default class SamplePluginE2E extends Plugin {
  settings!: SamplePluginSettings;

  async onload(): Promise<void> {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    logForE2E("log", "plugin:onload");
    await emitPluginLog(this, "info", "plugin:onload");

    // E2E runtime error injection via vault flag
    try {
      const hasRuntimeErrorFlag = await this.app.vault.adapter.exists(".e2e-runtime-error");
      if (hasRuntimeErrorFlag) {
        logForE2E("error", "runtime-error-injected");
        throw new Error("Intentional runtime error for testing!");
      }
    } catch (e) {
      // If exists() fails, ignore and continue normal startup
    }
    registerCommands(this);
    registerEvents(this);

    this.addSettingTab(new SampleSettingsTab(this.app, this, () => this.settings, async (s) => {
      this.settings = s;
      await this.saveData(this.settings);
    }));
  }

  onunload(): void {
    logForE2E("log", "plugin:onunload");
  }
}


