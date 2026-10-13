/**
 * Netlify Function for POST /api/chat.
 *
 * Reuses the exact same handler as api/chat.ts (Gemini proxy, safety rules, error codes)
 * by giving it a tiny stand-in for the Vercel req/res helpers it expects.
 * Set GEMINI_API_KEY (and optionally GEMINI_MODEL) in Netlify:
 * Site configuration -> Environment variables. The key stays server-side.
 */
import handler from '../../api/chat'

export default async (req: Request): Promise<Response> => {
  let body: unknown = {}
  if (req.method === 'POST') {
    try {
      const raw = await req.text()
      body = raw ? JSON.parse(raw) : {}
    } catch {
      /* handler rejects the empty body */
    }
  }

  let status = 200
  let payload: unknown = null
  const res = {
    status(code: number) {
      status = code
      return res
    },
    json(data: unknown) {
      payload = data
      return res
    },
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await handler({ method: req.method, body } as any, res as any)
  } catch (error) {
    console.error(`[netlify/chat] handler crashed: ${error instanceof Error ? error.name : 'unknown'}`)
    status = 500
    payload = { error: 'upstream_error', code: 'upstream_error' }
  }

  return new Response(JSON.stringify(payload ?? {}), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  })
}

export const config = { path: '/api/chat' }
