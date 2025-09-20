import { browser } from '@wdio/globals'

describe('Runtime error injection', function() {
  it('captures runtime error on plugin load', async function() {
    // This spec relies on E2E_RUNTIME_ERROR=1 to create a vault flag during onPrepare.
    await browser.pause(1500)

    const markers = await browser.execute(() => {
      const w: any = window as any
      return (w.__PLUGIN_TEST_LOGS__ || []).map((e: any) => `[${e.level}] ${e.message}`)
    })

    const hasMarker = Array.isArray(markers) && markers.some((m: string) => m.includes('runtime-error-injected'))
    const hasError = Array.isArray(markers) && markers.some((m: string) => m.includes('Intentional runtime error for testing!'))
    if (!hasMarker && !hasError) throw new Error('Expected to capture runtime error injection logs in window.__PLUGIN_TEST_LOGS__')
  })
})


