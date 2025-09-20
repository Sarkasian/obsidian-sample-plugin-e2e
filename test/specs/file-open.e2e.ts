import { browser } from '@wdio/globals'

describe('File open event', function() {
  it('logs when Sample Note is opened', async function() {
    await browser.execute(async () => {
      const svc = (window as any).wdioObsidianService?.()
      if (!svc) return
      await new Promise<void>(resolve => svc.app.workspace.onLayoutReady(() => resolve()))
    })

    // Trigger command to open the sample note
    await browser.keys(['Control', 'p'])
    await browser.pause(400)
    await browser.keys(Array.from('E2E: Open Sample Note'))
    await browser.pause(400)
    await browser.keys(['Enter'])
    await browser.pause(1200)

    const markers = await browser.execute(() => {
      const w: any = window as any
      return (w.__PLUGIN_TEST_LOGS__ || []).map((e: any) => `[${e.level}] ${e.message}`)
    })
    const hasEvent = Array.isArray(markers) && markers.some((m: string) => m.includes('event:file-open:Sample Note.md'))
    if (!hasEvent) throw new Error('Did not find file-open log for Sample Note.md in window.__PLUGIN_TEST_LOGS__')
  })
})


