import { browser } from '@wdio/globals'

describe('Simple Obsidian Test', function() {
  before(async function() {
    console.log('Simple test initialized');
    await browser.pause(2000);
  });

  it('should open and close command palette', async function() {
    console.log('Testing command palette...');
    
    // Open command palette
    await browser.keys(['Control', 'p']);
    await browser.pause(500);
    
    // Close command palette
    await browser.keys(['Escape']);
    await browser.pause(500);
    
    console.log('Command palette test completed');
  });

  it('should emit plugin command log', async function() {
    // Invoke command palette and run our command
    await browser.keys(['Control', 'p']);
    await browser.pause(400);
    await browser.keys(Array.from('E2E: Emit Log'));
    await browser.pause(400);
    await browser.keys(['Enter']);
    await browser.pause(1000);

    const markers = await browser.execute(() => {
      const w: any = window as any
      return (w.__PLUGIN_TEST_LOGS__ || []).map((e: any) => `[${e.level}] ${e.message}`)
    })

    const hasCommand = Array.isArray(markers) && markers.some((m: string) => m.includes('command:emit-log'))
    if (!hasCommand) throw new Error('Did not find command emit log in window.__PLUGIN_TEST_LOGS__')
  });
});
