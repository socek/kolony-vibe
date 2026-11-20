import { describe, it, expect, vi } from 'vitest'

describe('dźwięk w tle', () => {
  it('ukrycie strony wstrzymuje kontekst dźwięku, powrót go wznawia', async () => {
    const ctx = { state: 'running', suspend: vi.fn(function () { this.state = 'suspended' }), resume: vi.fn(function () { this.state = 'running' }) }
    window.AudioContext = vi.fn(function () { return ctx })
    const { initAudio, onVisibility } = await import('../../src/game/audio.js')
    initAudio()
    onVisibility(true)
    expect(ctx.suspend).toHaveBeenCalled()
    expect(ctx.state).toBe('suspended')
    onVisibility(false)
    expect(ctx.resume).toHaveBeenCalled()
    expect(ctx.state).toBe('running')
  })
})
