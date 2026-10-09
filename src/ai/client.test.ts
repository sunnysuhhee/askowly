import { ask } from './client'
import type { ChatTurn } from './types'

const history: ChatTurn[] = [{ role: 'user', text: 'Hello there' }]
const ctx = { medNames: [] }

function json(status: number, body: unknown, type = 'application/json') {
  return new Response(typeof body === 'string' ? body : JSON.stringify(body), { status, headers: { 'Content-Type': type } })
}

afterEach(() => {
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

describe('ask', () => {
  it('marks a valid server answer as online', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(json(200, { intent: 'other', reply: 'Hi!', scam_tells: [] })))
    const r = await ask(history, ctx)
    expect(r).toMatchObject({ source: 'ai', reply: 'Hi!' })
    expect(r.diagnostic).toBeUndefined()
  })

  it.each(['missing_key', 'invalid_key', 'rate_limited', 'model_unavailable', 'invalid_response'] as const)(
    'falls back on-device and keeps the server code %s',
    async (code) => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue(json(502, { error: code, code })))
      const r = await ask(history, ctx)
      expect(r).toMatchObject({ source: 'offline', offlineReason: 'unavailable', diagnostic: code })
    },
  )

  it('treats index.html instead of the API as backend_unavailable', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(json(200, '<!doctype html><html></html>', 'text/html')))
    expect(await ask(history, ctx)).toMatchObject({ source: 'offline', diagnostic: 'backend_unavailable' })
  })

  it('treats a network failure as backend_unavailable', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))
    expect(await ask(history, ctx)).toMatchObject({ source: 'offline', diagnostic: 'backend_unavailable' })
  })

  it('waits longer than the old 12 seconds, then reports a timeout', async () => {
    vi.useFakeTimers()
    vi.stubGlobal(
      'fetch',
      vi.fn((_url: string, init: RequestInit) =>
        new Promise((_, reject) => init.signal?.addEventListener('abort', () => reject(new DOMException('aborted', 'AbortError')))),
      ),
    )
    let settled = false
    const pending = ask(history, ctx).then((r) => ((settled = true), r))
    await vi.advanceTimersByTimeAsync(15_000)
    expect(settled).toBe(false)
    await vi.advanceTimersByTimeAsync(15_000)
    expect(await pending).toMatchObject({ source: 'offline', diagnostic: 'timeout' })
  })
})
