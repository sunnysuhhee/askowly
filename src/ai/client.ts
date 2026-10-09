import { analyzeMessage, type ScamResult, type Tell } from '../scam/engine'
import { answerLocally } from './localRouter'
import { readAnswer, type ApiAnswer, type ChatErrorCode } from './answer'
import type { AskResult, ChatTurn } from './types'

// Gemini usually answers in a few seconds; the server gives up at 25s, so wait a little longer.
const TIMEOUT_MS = 30_000

const CODES: readonly ChatErrorCode[] = [
  'missing_key', 'invalid_key', 'rate_limited', 'model_unavailable', 'bad_request',
  'truncated', 'invalid_response', 'upstream_error', 'timeout', 'backend_unavailable',
]

class ChatError extends Error {
  constructor(readonly code: ChatErrorCode, readonly status?: number) {
    super(code)
  }
}

/** Reads the error code the server sent, or decides the backend is not there (e.g. index.html came back). */
async function errorFrom(res: Response): Promise<ChatError> {
  const body = await res.json().catch(() => null)
  const code = body?.code
  return new ChatError(CODES.includes(code) ? code : 'backend_unavailable', res.status)
}

/** Development-only, sanitized: the reason code and HTTP status, never the conversation. */
function logFallback(error: ChatError) {
  if (import.meta.env.DEV) {
    console.warn(`[Owly] Answered on-device: ${error.code}${error.status ? ` (HTTP ${error.status})` : ''}`)
  }
}

/**
 * Continue the chat through our /api/chat proxy. `history` is the conversation
 * so far, ending with what the person just said. If there is no signal, the
 * call fails, or it is too slow, answer on-device instead, so the app always works.
 */
export async function ask(history: ChatTurn[], context: { medNames: string[] }): Promise<AskResult> {
  const message = history[history.length - 1]?.text ?? ''
  if (!navigator.onLine) return answerLocally(message, 'no-internet')

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: history.map(({ role, text }) => ({ role, text })), context }),
      signal: controller.signal,
    })
    if (!res.ok) throw await errorFrom(res)
    const data = readAnswer(await res.json().catch(() => null))
    // A 200 that is not our JSON usually means the page (index.html) came back instead of the API.
    if (!data) throw new ChatError(res.headers.get('content-type')?.includes('json') ? 'invalid_response' : 'backend_unavailable', res.status)
    return {
      intent: data.intent,
      reply: data.reply,
      source: 'ai',
      medName: data.med_name,
      scam: data.intent === 'scam' ? mergeScam(message, data.scam_tells) : undefined,
    }
  } catch (e) {
    const error =
      e instanceof ChatError ? e : new ChatError(controller.signal.aborted ? 'timeout' : 'backend_unavailable')
    logFallback(error)
    return { ...answerLocally(message, 'unavailable'), diagnostic: error.code }
  } finally {
    clearTimeout(timer)
  }
}

/**
 * The on-device engine's tells are always shown (deterministic for the demo);
 * the AI's extra tells are added when they point at something new.
 */
export function mergeScam(message: string, aiTells: ApiAnswer['scam_tells']): ScamResult {
  const local = analyzeMessage(message)
  const seen = new Set(local.tells.map((t) => t.quote.toLowerCase()))
  const extra: Tell[] = aiTells
    .filter((t) => t.quote && !seen.has(t.quote.toLowerCase()))
    .map((t, i) => ({ id: `ai-${i}`, title: t.title, quote: t.quote, why: t.why, weight: 2 }))
  const tells = [...local.tells, ...extra]
  const score = local.score + extra.length * 2
  const verdict = score >= 6 ? 'scam' : score >= 2 ? 'careful' : 'safe'
  return { verdict, score, tells }
}
