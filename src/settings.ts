import { App, Plugin, PluginSettingTab, Setting } from "obsidian";

export interface SamplePluginSettings {
  enabled: boolean;
}

export const DEFAULT_SETTINGS: SamplePluginSettings = {
  enabled: true,
};

export class SampleSettingsTab extends PluginSettingTab {
  constructor(app: App, plugin: Plugin, private readonly getSettings: () => SamplePluginSettings, private readonly save: (s: SamplePluginSettings) => Promise<void>) {
    super(app, plugin);
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    containerEl.createEl("h2", { text: "Sample Plugin E2E" });

    new Setting(containerEl)
      .setName("Enabled")
      .setDesc("Toggle the plugin's enabled state")
      .addToggle((toggle) => {
        toggle.setValue(this.getSettings().enabled).onChange(async (value) => {
          const next = { ...this.getSettings(), enabled: value };
          await this.save(next);
          this.display();
        });
      });
  }
}


