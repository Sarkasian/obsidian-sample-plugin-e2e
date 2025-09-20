import { browser } from '@wdio/globals'

describe('Plugin smoke', function() {
  it('loads and logs startup', async function() {
    // Wait for Obsidian workspace ready
    await browser.execute(async () => {
      const svc = (window as any).wdioObsidianService?.()
      if (!svc) return
      await new Promise<void>(resolve => svc.app.workspace.onLayoutReady(() => resolve()))
    })

    // Read logs from window context populated by plugin
    const markers = await browser.execute(() => {
      const w: any = window as any
      const entries = (w.__PLUGIN_TEST_LOGS__ || []).map((e: any) => `[${e.level}] ${e.message}`)
      return entries
    })

    const hasStartup = Array.isArray(markers) && markers.some((m: string) => m.includes('plugin:onload'))
    if (!hasStartup) throw new Error('Startup log not found in window.__PLUGIN_TEST_LOGS__')
  })
})


